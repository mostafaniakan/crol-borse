import { SOURCE_DEFINITIONS } from "../data-sources";
import { CRAWLER_CONFIG_VERSION, getCrawlerConfig } from "./crawler-sites.js";
import { INGESTION_PARSER_VERSION, type IngestionMethod, type ValidationIssue } from "./types";

const TIMEOUT_MS = 8_000;
const DEFAULT_MAX_BYTES = 5_000_000;

type CrawlResult = {
  ok: boolean;
  sourceId: string;
  method: IngestionMethod;
  url: string | null;
  httpStatus: number | null;
  contentType: string | null;
  rawHtml: string | null;
  extracted: unknown | null;
  checksumSha256: string | null;
  parserVersion: string;
  issues: ValidationIssue[];
};

function issue(code: string, message: string, severity: ValidationIssue["severity"] = "error"): ValidationIssue {
  return { code, message, severity };
}

async function digest(value: string) {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function decodeEntities(value: string) {
  return value.replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function cleanText(value: string) {
  return decodeEntities(value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
}

function extractTables(html: string) {
  return Array.from(html.matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/gi)).map((table) =>
    Array.from(table[1].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)).map((row) =>
      Array.from(row[1].matchAll(/<(?:td|th)\b[^>]*>([\s\S]*?)<\/(?:td|th)>/gi)).map((cell) => cleanText(cell[1])),
    ).filter((row) => row.length > 0),
  ).filter((table) => table.length > 0);
}

function extractLinks(html: string, baseUrl: string) {
  return Array.from(html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)).map((match) => {
    const href = match[1].match(/href\s*=\s*["']([^"']+)["']/i)?.[1];
    if (!href) return null;
    try {
      return { href: new URL(href, baseUrl).toString(), text: cleanText(match[2]) };
    } catch {
      return null;
    }
  }).filter(Boolean).slice(0, 500);
}

function extractField(html: string, hint: string) {
  const dataAttribute = hint.match(/\[data-([\w-]+)\]/)?.[1];
  const className = hint.match(/\.([\w-]+)/)?.[1];
  const tagName = hint.match(/^(?:([a-z][\w-]*)|[a-z][\w-]*\s)/i)?.[1];
  const pattern = dataAttribute
    ? new RegExp(`<[^>]*data-${dataAttribute}=["'][^"']*["'][^>]*>([\\s\\S]*?)<\\/[^>]+>`, "i")
    : className
      ? new RegExp(`<[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>([\\s\\S]*?)<\\/[^>]+>`, "i")
      : tagName
        ? new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i")
        : null;
  const match = pattern ? html.match(pattern) : null;
  return match ? cleanText(match[1]) : null;
}

type CrawlerFieldConfig = { fields?: Record<string, string> };

function extractHtmlData(html: string, url: string, config: CrawlerFieldConfig) {
  const fields = Object.fromEntries(Object.entries(config.fields ?? {}).map(([name, hint]) => [name, extractField(html, String(hint))]));
  const jsonLd = Array.from(html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)).map((match) => {
    try { return JSON.parse(match[1]); } catch { return null; }
  }).filter(Boolean);
  return {
    crawlerConfigVersion: CRAWLER_CONFIG_VERSION,
    url,
    title: cleanText(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ""),
    fields,
    tables: extractTables(html),
    links: extractLinks(html, url),
    jsonLd,
    contentLength: html.length,
  };
}

function robotsAllows(robots: string, pathname: string) {
  let applies = false;
  const disallowed: string[] = [];
  for (const line of robots.split(/\r?\n/)) {
    const [rawKey, rawValue] = line.split("#")[0].split(":");
    const key = rawKey?.trim().toLowerCase();
    const value = rawValue?.trim() ?? "";
    if (key === "user-agent") applies = value === "*";
    if (applies && key === "disallow" && value) disallowed.push(value);
  }
  return !disallowed.some((rule) => pathname.startsWith(rule));
}

async function fetchText(url: string, maxBytes: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { Accept: "text/html, application/xhtml+xml", "User-Agent": "RadarSahm/0.1 public-crawler" } });
    const body = await response.text();
    if (new TextEncoder().encode(body).byteLength > maxBytes) throw new Error("PAYLOAD_TOO_LARGE");
    return { response, body };
  } finally {
    clearTimeout(timer);
  }
}

export async function crawlSite(sourceId: string, entrypointId?: string): Promise<CrawlResult> {
  const source = SOURCE_DEFINITIONS.find((item) => item.id === sourceId);
  const config = getCrawlerConfig(sourceId);
  if (!source || !config) return { ok: false, sourceId, method: "html", url: null, httpStatus: null, contentType: null, rawHtml: null, extracted: null, checksumSha256: null, parserVersion: INGESTION_PARSER_VERSION, issues: [issue("UNKNOWN_SOURCE", "پیکربندی کرول این منبع پیدا نشد.")] };
  if (config.requiresBrowser) return { ok: false, sourceId, method: "browser", url: null, httpStatus: null, contentType: null, rawHtml: null, extracted: null, checksumSha256: null, parserVersion: INGESTION_PARSER_VERSION, issues: [issue("BROWSER_REQUIRED", "این منبع JavaScript محور است و کرول HTML ساده برای آن معتبر نیست.")] };
  const entrypoint = config.entrypoints.find((item) => item.id === entrypointId) ?? config.entrypoints[0];
  if (!entrypoint) return { ok: false, sourceId, method: "html", url: null, httpStatus: null, contentType: null, rawHtml: null, extracted: null, checksumSha256: null, parserVersion: INGESTION_PARSER_VERSION, issues: [issue("NO_ENTRYPOINT", "صفحه مجاز برای کرول تعریف نشده است.")] };
  const url = new URL(entrypoint.url);
  if (!config.hosts.includes(url.hostname)) return { ok: false, sourceId, method: "html", url: entrypoint.url, httpStatus: null, contentType: null, rawHtml: null, extracted: null, checksumSha256: null, parserVersion: INGESTION_PARSER_VERSION, issues: [issue("HOST_NOT_ALLOWED", "دامنه این URL در allowlist منبع نیست.")] };
  try {
    const robotsUrl = `${url.origin}/robots.txt`;
    const robots = await fetchText(robotsUrl, 250_000);
    if (!robots.response.ok || !robotsAllows(robots.body, url.pathname)) return { ok: false, sourceId, method: "html", url: url.toString(), httpStatus: robots.response.status, contentType: robots.response.headers.get("content-type"), rawHtml: null, extracted: null, checksumSha256: null, parserVersion: INGESTION_PARSER_VERSION, issues: [issue("ROBOTS_BLOCKED", "robots.txt اجازه این مسیر را تایید نکرد.")] };
    const page = await fetchText(url.toString(), config.maxBytes ?? DEFAULT_MAX_BYTES);
    const checksumSha256 = await digest(page.body);
    if (!page.response.ok) return { ok: false, sourceId, method: "html", url: url.toString(), httpStatus: page.response.status, contentType: page.response.headers.get("content-type"), rawHtml: null, extracted: null, checksumSha256, parserVersion: INGESTION_PARSER_VERSION, issues: [issue("HTTP_ERROR", `صفحه با HTTP ${page.response.status} پاسخ داد.`)] };
    const extracted = extractHtmlData(page.body, url.toString(), config);
    const hasUsefulContent = extracted.tables.length > 0 || extracted.links.length > 0 || Object.values(extracted.fields).some(Boolean);
    return { ok: hasUsefulContent, sourceId, method: "html", url: url.toString(), httpStatus: page.response.status, contentType: page.response.headers.get("content-type"), rawHtml: hasUsefulContent ? page.body : null, extracted: hasUsefulContent ? extracted : null, checksumSha256, parserVersion: INGESTION_PARSER_VERSION, issues: hasUsefulContent ? [] : [issue("NO_EXTRACTABLE_DATA", "صفحه HTML داده قابل استخراج طبق تگ های پیکربندی شده نداشت.")] };
  } catch (error) {
    return { ok: false, sourceId, method: "html", url: url.toString(), httpStatus: null, contentType: null, rawHtml: null, extracted: null, checksumSha256: null, parserVersion: INGESTION_PARSER_VERSION, issues: [issue(error instanceof Error && error.message === "PAYLOAD_TOO_LARGE" ? "PAYLOAD_TOO_LARGE" : "CRAWL_FAILED", "کرول صفحه به دلیل خطای شبکه، robots یا حجم پاسخ انجام نشد.")] };
  }
}

import { env } from "cloudflare:workers";
import { adapterMethodSummary, getSourceAdapter } from "../../../lib/ingestion/adapters";
import { ingestUserFile } from "../../../lib/ingestion/file-parser";
import { crawlSite } from "../../../lib/ingestion/html-crawler";
import { CRAWLER_CONFIG_VERSION, CRAWLER_SITE_CONFIGS } from "../../../lib/ingestion/crawler-sites.js";
import type { IngestionMethod } from "../../../lib/ingestion/types";

const allowedMethods = new Set<IngestionMethod>(["official-api", "public-web-api", "html", "browser", "file", "manual"]);

function credentials() {
  return {
    FRED_API_KEY: typeof env.FRED_API_KEY === "string" ? env.FRED_API_KEY : undefined,
    TRADING_ECONOMICS_API_KEY: typeof env.TRADING_ECONOMICS_API_KEY === "string" ? env.TRADING_ECONOMICS_API_KEY : undefined,
  };
}

export async function GET() {
  return Response.json({ ok: true, methods: adapterMethodSummary(credentials()), crawlerConfigVersion: CRAWLER_CONFIG_VERSION, crawlerConfigs: CRAWLER_SITE_CONFIGS, parserVersion: "2026.10.08.1" });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, code: "INVALID_JSON", message: "بدنه درخواست JSON معتبر نیست." }, { status: 400 });
  }

  const sourceId = typeof body.sourceId === "string" ? body.sourceId : "";
  const dataset = typeof body.dataset === "string" ? body.dataset : "market-data";
  const method = typeof body.method === "string" && allowedMethods.has(body.method as IngestionMethod) ? body.method as IngestionMethod : undefined;
  const adapter = getSourceAdapter(sourceId, credentials());
  if (!adapter) return Response.json({ ok: false, code: "UNKNOWN_SOURCE", message: "منبع داده ناشناخته است." }, { status: 404 });

  if ((method === "file" || method === "manual") && typeof body.content === "string") {
    if (new TextEncoder().encode(body.content).byteLength > 5_000_000) {
      return Response.json({ ok: false, code: "PAYLOAD_TOO_LARGE", message: "حجم فایل از سقف ۵ مگابایت بیشتر است." }, { status: 413 });
    }
    const result = ingestUserFile(adapter, {
      sourceId,
      dataset,
      content: body.content,
      contentType: typeof body.contentType === "string" ? body.contentType : "application/octet-stream",
      fileName: typeof body.fileName === "string" ? body.fileName : "upload.dat",
    });
    return Response.json(result, { status: result.ok ? 200 : 422 });
  }

  if (method === "html") {
    const crawl = await crawlSite(sourceId, typeof body.entrypoint === "string" ? body.entrypoint : undefined);
    const validation = crawl.extracted === null ? { valid: false, coverage: "unknown" as const, issues: crawl.issues, recordCount: 0, schemaVersion: "html-crawler-v1" } : adapter.validate(crawl.extracted, crawl.contentType ?? "text/html");
    const provenance = crawl.url ? {
      sourceId,
      sourceName: sourceId,
      url: crawl.url,
      method: crawl.method,
      requestedAt: new Date().toISOString(),
      retrievedAt: new Date().toISOString(),
      httpStatus: crawl.httpStatus,
      contentType: crawl.contentType,
      etag: null,
      lastModified: null,
      checksumSha256: crawl.checksumSha256,
      parserVersion: crawl.parserVersion,
      licenseNote: "کرول فقط برای صفحات عمومی و مسیرهای مجاز اجرا شده است.",
    } : null;
    const result = {
      ok: crawl.ok && validation.valid,
      sourceId,
      dataset,
      status: crawl.ok && validation.valid ? "accepted" as const : "rejected" as const,
      provenance,
      rawPayload: crawl.ok && validation.valid ? crawl.extracted : null,
      validation,
      issues: [...crawl.issues, ...validation.issues.filter((item) => !crawl.issues.some((known) => known.code === item.code))],
    };
    return Response.json(result, { status: result.ok ? 200 : 422 });
  }

  const result = await adapter.fetch({ sourceId, dataset, symbol: typeof body.symbol === "string" ? body.symbol : undefined, method });
  const status = result.status === "accepted" ? 200 : result.status === "rate-limited" ? 429 : result.status === "rejected" ? 422 : 503;
  return Response.json(result, { status });
}

import { env } from "cloudflare:workers";
import {
  SOURCE_DEFINITIONS,
  baselineHealth,
  type SourceDefinition,
  type SourceHealth,
  type SourceStatus,
} from "../../../lib/data-sources";

const TIMEOUT_MS = 5_000;
const MAX_RETRIES = 1;

function configured(name: keyof Cloudflare.Env) {
  const value = env[name];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sourceUrl(source: SourceDefinition) {
  if (source.id === "fred") {
    const key = configured("FRED_API_KEY");
    if (!key) return undefined;
    const url = new URL("https://api.stlouisfed.org/fred/series");
    url.searchParams.set("series_id", "GNPCA");
    url.searchParams.set("api_key", key);
    url.searchParams.set("file_type", "json");
    return url.toString();
  }

  if (source.id === "trading-economics") {
    const key = configured("TRADING_ECONOMICS_API_KEY");
    if (!key) return undefined;
    const url = new URL("https://api.tradingeconomics.com/country/iran");
    url.searchParams.set("c", key);
    return url.toString();
  }

  return source.probeUrl;
}

function contractIsValid(source: SourceDefinition, body: string, contentType: string) {
  if (!body.trim()) return false;
  if (source.id === "codal" || source.id === "fipiran") return false;

  try {
    const parsed = JSON.parse(body) as Record<string, unknown>;
    if (source.id === "tsetmc") return "marketOverview" in parsed;
    if (source.id === "fred") return Array.isArray(parsed.seriess);
    if (source.id === "trading-economics") return Array.isArray(parsed);
    return contentType.includes("json");
  } catch {
    return false;
  }
}

async function probe(source: SourceDefinition, checkedAt: string): Promise<SourceHealth> {
  const initial = baselineHealth(source, checkedAt);
  const url = sourceUrl(source);
  if (!url) {
    return initial;
  }

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: "application/json", "User-Agent": "RadarSahm/0.1 data-monitor" },
      });
      const body = await response.text();
      const contentType = response.headers.get("content-type") ?? "";
      if (response.ok) {
        const validContract = contractIsValid(source, body, contentType);
        const status: SourceStatus = validContract ? "active" : "degraded";
        return {
          ...initial,
          status,
          lastSuccessAt: checkedAt,
          coverage: validContract ? "verified" : "partial",
          reason: validContract
            ? "اتصال و قرارداد پاسخ probe تأیید شد؛ تازگی داده در دریافت کامل تعیین می‌شود."
            : "Endpoint پاسخ داد، اما قرارداد داده کامل این Connector تأیید نشده است.",
          errorCount: 0,
        };
      }

      const retryable = response.status === 429 || response.status >= 500;
      if (!retryable || attempt === MAX_RETRIES) {
        return {
          ...initial,
          status: response.status === 401 || response.status === 403 ? "degraded" : "unavailable",
          errorCount: 1,
          reason: `probe با وضعیت HTTP ${response.status} پاسخ داد.`,
        };
      }
    } catch (error) {
      if (attempt === MAX_RETRIES) {
        return {
          ...initial,
          status: "unavailable",
          errorCount: 1,
          reason: error instanceof Error && error.name === "AbortError" ? "مهلت اتصال تمام شد." : "خطای شبکه در probe.",
        };
      }
    } finally {
      clearTimeout(timeout);
    }

    await delay(250 * 2 ** attempt);
  }

  return initial;
}

export async function GET() {
  const checkedAt = new Date().toISOString();
  const sources = await Promise.all(SOURCE_DEFINITIONS.map((source) => probe(source, checkedAt)));

  return Response.json({
    ok: true,
    checkedAt,
    sources,
  });
}

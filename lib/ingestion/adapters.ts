import { SOURCE_DEFINITIONS, type SourceDefinition } from "../data-sources";
import {
  INGESTION_PARSER_VERSION,
  type AdapterMethod,
  type IngestionMethod,
  type IngestionRequest,
  type IngestionResult,
  type SourceAdapter,
  type ValidationIssue,
  type ValidationResult,
} from "./types";

type AdapterConfig = {
  FRED_API_KEY?: string;
  TRADING_ECONOMICS_API_KEY?: string;
};

const REQUEST_TIMEOUT_MS = 8_000;
const MAX_RETRIES = 2;
const DEFAULT_MAX_BYTES = 5_000_000;

const sourceById = new Map(SOURCE_DEFINITIONS.map((source) => [source.id, source]));

function hasValue(value: string | undefined) {
  return typeof value === "string" && value.trim().length > 0;
}

function method(
  value: IngestionMethod,
  availability: AdapterMethod["availability"],
  auth: AdapterMethod["auth"],
  legalNote: string,
  endpoint?: string,
  enabled = false,
  limits?: string,
): AdapterMethod {
  return { method: value, availability, auth, legalNote, endpoint, enabled, limits };
}

function sha256(value: string) {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)).then((hash) =>
    Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, "0")).join(""),
  );
}

function issue(code: string, message: string, severity: ValidationIssue["severity"] = "error", field?: string): ValidationIssue {
  return { code, message, severity, field };
}

function validateGeneric(payload: unknown, contentType?: string): ValidationResult {
  if (payload === null || payload === undefined || payload === "") {
    return { valid: false, coverage: "unknown", issues: [issue("EMPTY_PAYLOAD", "پاسخ منبع خالی است.")], recordCount: 0, schemaVersion: "generic-v1" };
  }
  const recordCount = Array.isArray(payload) ? payload.length : typeof payload === "object" ? 1 : 0;
  const isStructured = typeof payload === "object" || contentType?.includes("json") || contentType?.includes("csv");
  return {
    valid: isStructured && recordCount > 0,
    coverage: isStructured && recordCount > 0 ? "partial" : "unknown",
    issues: isStructured && recordCount > 0 ? [] : [issue("UNSUPPORTED_PAYLOAD", "ساختار پاسخ برای اعتبارسنجی عمومی کافی نیست.")],
    recordCount,
    schemaVersion: "generic-v1",
  };
}

function validateBySource(sourceId: string, payload: unknown, contentType?: string): ValidationResult {
  if (sourceId === "fred") {
    const value = payload as { seriess?: unknown[]; observations?: unknown[] } | null;
    const records = Array.isArray(value?.observations) ? value.observations : Array.isArray(value?.seriess) ? value.seriess : [];
    return {
      valid: records.length > 0,
      coverage: records.length > 0 ? "verified" : "unknown",
      issues: records.length > 0 ? [] : [issue("FRED_SCHEMA_MISMATCH", "پاسخ FRED باید seriess یا observations داشته باشد.")],
      recordCount: records.length,
      schemaVersion: "fred-v1",
    };
  }
  if (sourceId === "trading-economics") {
    const records = Array.isArray(payload) ? payload : [];
    return {
      valid: records.length > 0,
      coverage: records.length > 0 ? "verified" : "unknown",
      issues: records.length > 0 ? [] : [issue("TE_SCHEMA_MISMATCH", "پاسخ Trading Economics باید آرایه رکوردها باشد.")],
      recordCount: records.length,
      schemaVersion: "trading-economics-v1",
    };
  }
  if (sourceId === "tsetmc") {
    const value = payload as { marketOverview?: unknown } | null;
    const valid = Boolean(value && typeof value === "object" && "marketOverview" in value);
    return {
      valid,
      coverage: valid ? "verified" : "unknown",
      issues: valid ? [] : [issue("TSETMC_SCHEMA_MISMATCH", "قرارداد Market Overview تایید نشد.")],
      recordCount: valid ? 1 : 0,
      schemaVersion: "tsetmc-market-overview-v1",
    };
  }
  return validateGeneric(payload, contentType);
}

async function parseBody(response: Response, maxBytes: number): Promise<{ raw: string; contentType: string }> {
  const length = Number(response.headers.get("content-length") ?? "0");
  if (length > maxBytes) throw new Error("PAYLOAD_TOO_LARGE");
  const raw = await response.text();
  if (new TextEncoder().encode(raw).byteLength > maxBytes) throw new Error("PAYLOAD_TOO_LARGE");
  return { raw, contentType: response.headers.get("content-type") ?? "" };
}

function parsePayload(raw: string, contentType: string): unknown {
  if (contentType.includes("json") || /^[\[{]/.test(raw.trim())) {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }
  return raw;
}

async function requestWithRetry(url: string, maxBytes: number) {
  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: "application/json, text/csv, text/html", "User-Agent": "RadarSahm/0.1 source-adapter" },
      });
      const body = await parseBody(response, maxBytes);
      if ((response.status === 429 || response.status >= 500) && attempt < MAX_RETRIES) {
        const retryAfter = Number(response.headers.get("retry-after") ?? "0");
        const backoff = retryAfter > 0 ? Math.min(retryAfter * 1000, 10_000) : 250 * 2 ** attempt;
        await new Promise((resolve) => setTimeout(resolve, backoff));
        continue;
      }
      return { response, body };
    } catch (error) {
      lastError = error;
      if (attempt === MAX_RETRIES) throw error;
      await new Promise((resolve) => setTimeout(resolve, 250 * 2 ** attempt));
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastError instanceof Error ? lastError : new Error("REQUEST_FAILED");
}

function unavailable(source: SourceDefinition, request: IngestionRequest, methods: AdapterMethod[], reason: string, status: IngestionResult["status"] = "unavailable"): IngestionResult {
  const issues = [issue("NO_APPROVED_METHOD", reason)];
  return {
    ok: false,
    sourceId: source.id,
    dataset: request.dataset,
    status,
    provenance: null,
    rawPayload: null,
    validation: { valid: false, coverage: "unknown", issues, recordCount: 0, schemaVersion: "none" },
    issues: [...issues, ...methods.filter((item) => !item.enabled).map((item) => issue(`METHOD_${item.method.toUpperCase()}`, `${item.method}: ${item.legalNote}`, "warning"))],
  };
}

function createAdapter(source: SourceDefinition, methods: AdapterMethod[]): SourceAdapter {
  return {
    sourceId: source.id,
    methods,
    validate: (payload, contentType) => validateBySource(source.id, payload, contentType),
    async fetch(request) {
      const chosen = request.method ? methods.find((item) => item.method === request.method) : methods.find((item) => item.enabled && item.endpoint);
      if (!chosen) return unavailable(source, request, methods, "برای این منبع هیچ روش دریافت تاییدشده و فعال وجود ندارد.");
      if (!chosen.enabled || !chosen.endpoint) return unavailable(source, request, methods, `روش ${chosen.method} برای این منبع فعال نیست؛ علت مجوز یا پیکربندی را بررسی کنید.`);
      if (chosen.method === "file" || chosen.method === "manual" || chosen.method === "html" || chosen.method === "browser") {
        return unavailable(source, request, methods, `روش ${chosen.method} به ورودی مجاز یا محیط اختصاصی نیاز دارد و از مسیر API اجرا نمی شود.`);
      }

      const requestedAt = new Date().toISOString();
      try {
        const { response, body } = await requestWithRetry(chosen.endpoint, request.maxBytes ?? DEFAULT_MAX_BYTES);
        const payload = parsePayload(body.raw, body.contentType);
        const validation = validateBySource(source.id, payload, body.contentType);
        const checksumSha256 = await sha256(body.raw);
        const provenance = {
          sourceId: source.id,
          sourceName: source.name,
          url: chosen.endpoint,
          method: chosen.method,
          requestedAt,
          retrievedAt: new Date().toISOString(),
          httpStatus: response.status,
          contentType: body.contentType || null,
          etag: response.headers.get("etag"),
          lastModified: response.headers.get("last-modified"),
          checksumSha256,
          parserVersion: INGESTION_PARSER_VERSION,
          licenseNote: chosen.legalNote,
        };
        if (response.status === 429) {
          return { ok: false, sourceId: source.id, dataset: request.dataset, status: "rate-limited", provenance, rawPayload: null, validation, issues: [issue("RATE_LIMITED", "منبع محدودیت درخواست اعمال کرده است.")] };
        }
        if (!response.ok) {
          return { ok: false, sourceId: source.id, dataset: request.dataset, status: "unavailable", provenance, rawPayload: null, validation, issues: [issue("HTTP_ERROR", `منبع با HTTP ${response.status} پاسخ داد.`)] };
        }
        return { ok: validation.valid, sourceId: source.id, dataset: request.dataset, status: validation.valid ? "accepted" : "rejected", provenance, rawPayload: validation.valid ? payload : null, validation, issues: validation.issues };
      } catch (error) {
        return unavailable(source, request, methods, error instanceof Error && error.message === "PAYLOAD_TOO_LARGE" ? "حجم پاسخ از سقف مجاز بیشتر است." : "درخواست منبع با خطای شبکه یا زمان انتظار مواجه شد.");
      }
    },
  };
}

function methodsFor(source: SourceDefinition, config: AdapterConfig): AdapterMethod[] {
  const fredReady = source.id === "fred" && hasValue(config.FRED_API_KEY);
  const teReady = source.id === "trading-economics" && hasValue(config.TRADING_ECONOMICS_API_KEY);
  const officialEndpoint = source.id === "fred" && fredReady
    ? `https://api.stlouisfed.org/fred/series?series_id=GNPCA&api_key=${encodeURIComponent(config.FRED_API_KEY ?? "")}&file_type=json`
    : source.id === "trading-economics" && teReady
      ? `https://api.tradingeconomics.com/country/iran?c=${encodeURIComponent(config.TRADING_ECONOMICS_API_KEY ?? "")}`
      : source.probeUrl;

  const apiEnabled = Boolean(officialEndpoint && (source.id === "fred" ? fredReady : source.id === "trading-economics" ? teReady : false));
  const publicEnabled = source.id === "tsetmc" && Boolean(source.probeUrl);
  return [
    method("official-api", apiEnabled ? "ready" : source.auth === "api-key" ? "needs-credentials" : "unverified", source.auth === "api-key" ? "api-key" : "none", source.auth === "api-key" ? "کلید API باید در Secret محیط تنظیم شود." : "قرارداد رسمی این منبع هنوز تایید نشده است.", officialEndpoint, apiEnabled, "پاسخ 429 و Retry-After باید رعایت شود."),
    method("public-web-api", publicEnabled ? "unverified" : "unverified", "none", "Endpoint عمومی باید از نظر مجوز و قرارداد پاسخ جداگانه تایید شود.", publicEnabled ? source.probeUrl : undefined, false),
    method("html", "unverified", "none", "استخراج HTML فقط پس از بررسی robots، شرایط استفاده و مجوز منبع مجاز است.", source.officialUrl, false),
    method("browser", "blocked", "none", "Browser automation در Worker فعال نیست و هرگز CAPTCHA یا کنترل امنیتی را دور نمی زند.", source.officialUrl, false),
    method("file", "unverified", "user-upload", "فایل عمومی یا دارای مجوز باید توسط کاربر وارد و نسخه آن ثبت شود.", undefined, false),
    method("manual", source.auth === "licensed" || source.auth === "manual" ? "needs-license" : "unverified", source.auth === "licensed" ? "licensed" : "user-upload", "ورود دستی فقط برای داده ای که کاربر مجوز استفاده از آن را دارد.", undefined, false),
  ];
}

export function createSourceAdapters(config: AdapterConfig = {}) {
  return new Map(SOURCE_DEFINITIONS.map((source) => [source.id, createAdapter(source, methodsFor(source, config))]));
}

export function getSourceAdapter(sourceId: string, config: AdapterConfig = {}) {
  const source = sourceById.get(sourceId);
  if (!source) return undefined;
  return createAdapter(source, methodsFor(source, config));
}

export function adapterMethodSummary(config: AdapterConfig = {}) {
  return SOURCE_DEFINITIONS.map((source) => ({ sourceId: source.id, name: source.name, methods: methodsFor(source, config) }));
}

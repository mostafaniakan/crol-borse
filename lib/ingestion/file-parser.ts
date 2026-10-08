import { INGESTION_PARSER_VERSION, type IngestionResult, type SourceAdapter } from "./types";

function parseCsv(input: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];
    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell.trim());
      if (row.some((value) => value.length > 0)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell.trim());
    if (row.some((value) => value.length > 0)) rows.push(row);
  }
  if (rows.length < 2) return [];
  const headers = rows[0].map((header, index) => header || `column_${index + 1}`);
  return rows.slice(1).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? null])));
}

function parseContent(content: string, contentType: string, fileName: string) {
  const looksJson = contentType.includes("json") || fileName.toLowerCase().endsWith(".json") || /^[\[{]/.test(content.trim());
  if (looksJson) {
    try {
      return JSON.parse(content);
    } catch {
      return null;
    }
  }
  if (contentType.includes("csv") || fileName.toLowerCase().endsWith(".csv") || content.includes(",")) return parseCsv(content);
  return null;
}

function deduplicate(payload: unknown) {
  if (!Array.isArray(payload)) return { payload, removed: 0 };
  const seen = new Set<string>();
  const unique = payload.filter((row) => {
    const key = typeof row === "object" && row !== null
      ? JSON.stringify(Object.entries(row as Record<string, unknown>).sort(([left], [right]) => left.localeCompare(right)))
      : JSON.stringify(row);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return { payload: unique, removed: payload.length - unique.length };
}

export function ingestUserFile(adapter: SourceAdapter, input: { content: string; contentType: string; fileName: string; dataset: string; sourceId: string }): IngestionResult {
  const payload = parseContent(input.content, input.contentType, input.fileName);
  if (payload === null) {
    const validation = { valid: false, coverage: "unknown" as const, issues: [{ code: "FILE_FORMAT_UNSUPPORTED", message: "فقط JSON و CSV ساختاریافته پذیرفته می شود.", severity: "error" as const }], recordCount: 0, schemaVersion: INGESTION_PARSER_VERSION };
    return { ok: false, sourceId: input.sourceId, dataset: input.dataset, status: "rejected", provenance: null, rawPayload: null, validation, issues: validation.issues };
  }
  const deduped = deduplicate(payload);
  const validation = adapter.validate(deduped.payload, input.contentType);
  if (deduped.removed > 0) {
    validation.issues = [...validation.issues, { code: "DUPLICATES_REMOVED", message: `${deduped.removed} رکورد تکراری پیش از پذیرش حذف شد.`, severity: "warning" }];
  }
  const provenance = {
    sourceId: input.sourceId,
    sourceName: input.sourceId,
    url: `upload://${input.fileName}`,
    method: "file" as const,
    requestedAt: new Date().toISOString(),
    retrievedAt: new Date().toISOString(),
    httpStatus: null,
    contentType: input.contentType,
    etag: null,
    lastModified: null,
    checksumSha256: null,
    parserVersion: INGESTION_PARSER_VERSION,
    licenseNote: "ورود فایل فقط در صورت داشتن مجوز استفاده از داده مجاز است.",
  };
  return { ok: validation.valid, sourceId: input.sourceId, dataset: input.dataset, status: validation.valid ? "accepted" : "rejected", provenance, rawPayload: validation.valid ? deduped.payload : null, validation, issues: validation.issues };
}

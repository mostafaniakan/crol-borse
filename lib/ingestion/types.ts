export type IngestionMethod = "official-api" | "public-web-api" | "html" | "browser" | "file" | "manual";

export type MethodAvailability = "ready" | "needs-credentials" | "needs-license" | "unverified" | "blocked";

export type AdapterMethod = {
  method: IngestionMethod;
  availability: MethodAvailability;
  endpoint?: string;
  auth: "none" | "api-key" | "token" | "licensed" | "user-upload";
  legalNote: string;
  limits?: string;
  enabled: boolean;
};

export type IngestionRequest = {
  sourceId: string;
  dataset: string;
  symbol?: string;
  method?: IngestionMethod;
  url?: string;
  maxBytes?: number;
};

export type ValidationIssue = {
  code: string;
  message: string;
  field?: string;
  severity: "error" | "warning";
};

export type ValidationResult = {
  valid: boolean;
  coverage: "verified" | "partial" | "unknown";
  issues: ValidationIssue[];
  recordCount: number;
  schemaVersion: string;
};

export type Provenance = {
  sourceId: string;
  sourceName: string;
  url: string;
  method: IngestionMethod;
  requestedAt: string;
  retrievedAt: string;
  httpStatus: number | null;
  contentType: string | null;
  etag: string | null;
  lastModified: string | null;
  checksumSha256: string | null;
  parserVersion: string;
  licenseNote: string;
};

export type IngestionResult = {
  ok: boolean;
  sourceId: string;
  dataset: string;
  status: "accepted" | "rejected" | "unavailable" | "rate-limited";
  provenance: Provenance | null;
  rawPayload: unknown | null;
  validation: ValidationResult;
  issues: ValidationIssue[];
};

export type SourceAdapter = {
  sourceId: string;
  methods: AdapterMethod[];
  fetch(request: IngestionRequest): Promise<IngestionResult>;
  validate(payload: unknown, contentType?: string): ValidationResult;
};

export const INGESTION_PARSER_VERSION = "2026.10.08.1";

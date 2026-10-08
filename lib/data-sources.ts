export type SourceStatus = "active" | "degraded" | "stale" | "unavailable";

export type SourceDefinition = {
  id: string;
  name: string;
  category: "market" | "financial" | "economic" | "comparative";
  officialUrl: string;
  probeUrl?: string;
  auth: "public" | "api-key" | "licensed" | "manual";
  capabilities: string[];
  baselineStatus: SourceStatus;
  baselineReason: string;
};

export type SourceHealth = SourceDefinition & {
  status: SourceStatus;
  checkedAt: string;
  lastSuccessAt: string | null;
  freshness: "fresh" | "unknown" | "stale";
  coverage: "verified" | "partial" | "unknown";
  errorCount: number;
  reason: string;
};

/**
 * The registry is deliberately metadata-only. A source becomes Active only
 * after its connector probe and response contract have both been validated.
 */
export const SOURCE_DEFINITIONS: SourceDefinition[] = [
  {
    id: "tsetmc",
    name: "TSETMC",
    category: "market",
    officialUrl: "https://www.tsetmc.com",
    probeUrl: "https://cdn.tsetmc.com/api/MarketData/GetMarketOverview/0",
    auth: "public",
    capabilities: ["market-watch", "prices", "history", "client-type"],
    baselineStatus: "degraded",
    baselineReason: "پاسخ زنده از محیط اجرا 403 بود؛ محدودیت دسترسی یا ضدربات باید بررسی شود.",
  },
  {
    id: "codal",
    name: "Codal",
    category: "financial",
    officialUrl: "https://codal.ir",
    probeUrl: "https://codal.ir",
    auth: "public",
    capabilities: ["financial-reports", "disclosures", "amendments"],
    baselineStatus: "degraded",
    baselineReason: "سایت پاسخ HTTP می‌دهد، اما Connector و قرارداد API گزارش‌های مالی هنوز تأیید نشده است.",
  },
  {
    id: "fipiran",
    name: "Fipiran",
    category: "financial",
    officialUrl: "https://www.fipiran.com",
    probeUrl: "https://www.fipiran.com",
    auth: "public",
    capabilities: ["financial-indicators", "funds", "market-data"],
    baselineStatus: "degraded",
    baselineReason: "پاسخ زنده از محیط اجرا 403 بود؛ API عمومی قابل اتکا هنوز تأیید نشده است.",
  },
  {
    id: "tse",
    name: "TSE",
    category: "market",
    officialUrl: "https://tse.ir",
    auth: "manual",
    capabilities: ["official-market-information"],
    baselineStatus: "unavailable",
    baselineReason: "Endpoint رسمی و قابل استفاده برای این پروژه هنوز بررسی و آزمایش نشده است.",
  },
  {
    id: "ifb",
    name: "IFB",
    category: "market",
    officialUrl: "https://www.ifb.ir",
    auth: "manual",
    capabilities: ["otc-disclosures", "market-information"],
    baselineStatus: "unavailable",
    baselineReason: "Endpoint رسمی و مجاز برای دریافت خودکار هنوز پیکربندی نشده است.",
  },
  {
    id: "cbi",
    name: "CBI",
    category: "economic",
    officialUrl: "https://www.cbi.ir",
    auth: "manual",
    capabilities: ["currency", "monetary-data"],
    baselineStatus: "unavailable",
    baselineReason: "Connector رسمی قابل آزمایش در مخزن وجود ندارد.",
  },
  {
    id: "sci",
    name: "SCI",
    category: "economic",
    officialUrl: "https://www.amar.org.ir",
    auth: "manual",
    capabilities: ["inflation", "economic-indicators"],
    baselineStatus: "unavailable",
    baselineReason: "Connector رسمی قابل آزمایش در مخزن وجود ندارد.",
  },
  {
    id: "ime",
    name: "IME",
    category: "economic",
    officialUrl: "https://www.ime.co.ir",
    auth: "manual",
    capabilities: ["commodity-prices"],
    baselineStatus: "unavailable",
    baselineReason: "Connector رسمی قابل آزمایش در مخزن وجود ندارد.",
  },
  {
    id: "irenex",
    name: "IRENEX",
    category: "economic",
    officialUrl: "https://www.irenex.ir",
    auth: "manual",
    capabilities: ["energy-prices"],
    baselineStatus: "unavailable",
    baselineReason: "Connector رسمی قابل آزمایش در مخزن وجود ندارد.",
  },
  {
    id: "fred",
    name: "FRED",
    category: "economic",
    officialUrl: "https://fred.stlouisfed.org/docs/api/fred/",
    auth: "api-key",
    capabilities: ["global-macro-series"],
    baselineStatus: "unavailable",
    baselineReason: "FRED برای درخواست‌های API به API key نیاز دارد و کلید در محیط تنظیم نشده است.",
  },
  {
    id: "trading-economics",
    name: "Trading Economics",
    category: "economic",
    officialUrl: "https://docs.tradingeconomics.com/get_started/",
    auth: "api-key",
    capabilities: ["global-macro", "commodities", "indices"],
    baselineStatus: "unavailable",
    baselineReason: "API به اشتراک و کلید نیاز دارد و کلید در محیط تنظیم نشده است.",
  },
  {
    id: "rahavard365",
    name: "Rahavard365",
    category: "comparative",
    officialUrl: "https://rahavard365.com",
    auth: "licensed",
    capabilities: ["comparative-research"],
    baselineStatus: "unavailable",
    baselineReason: "فقط با دسترسی مجاز و قرارداد معتبر قابل فعال‌سازی است.",
  },
];

export function baselineHealth(source: SourceDefinition, checkedAt = new Date().toISOString()): SourceHealth {
  return {
    ...source,
    status: source.baselineStatus,
    checkedAt,
    lastSuccessAt: null,
    freshness: "unknown",
    coverage: "unknown",
    errorCount: source.baselineStatus === "unavailable" ? 1 : 0,
    reason: source.baselineReason,
  };
}

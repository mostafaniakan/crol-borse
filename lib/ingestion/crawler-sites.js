/**
 * راهنمای کرول عمومی هر منبع.
 *
 * این فایل عمدا از منطق کرول جدا است تا اضافه کردن سایت جدید فقط با اضافه
 * کردن یک entry انجام شود. verified فقط بعد از probe واقعی، بررسی robots و
 * تایید قرارداد پاسخ باید true شود.
 */
export const CRAWLER_CONFIG_VERSION = "2026.10.08.1";

const common = {
  method: "html",
  robots: "must-check",
  maxBytes: 5_000_000,
  verified: false,
  requiresBrowser: false,
  legal: "فقط صفحات عمومی و قابل دسترسی بدون عبور از CAPTCHA یا محدودیت امنیتی.",
};

export const CRAWLER_SITE_CONFIGS = {
  tsetmc: {
    ...common,
    name: "TSETMC",
    hosts: ["www.tsetmc.com", "tsetmc.com"],
    entrypoints: [{ id: "market-watch", url: "https://www.tsetmc.com/MarketWatch", dataset: "market-data" }, { id: "instrument", url: "https://www.tsetmc.com/MarketWatch", dataset: "security-master" }],
    requiresBrowser: true,
    tags: { root: "main, body", rows: "table tr", cells: "table td", links: "a[href]", scripts: "script" },
    fields: { symbol: "[data-symbol], .symbol, td:nth-child(1)", price: "[data-price], .price, td:nth-child(2)", volume: "[data-volume], .volume, td:nth-child(3)", close: "[data-close], .close" },
    notes: "صفحه بازار معمولا JavaScript محور است؛ CDN JSON و API عمومی باید جداگانه قراردادسنجی شوند.",
  },
  "cdn-tsetmc": {
    ...common,
    name: "TSETMC CDN",
    hosts: ["cdn.tsetmc.com"],
    entrypoints: [{ id: "market-overview", url: "https://cdn.tsetmc.com/api/MarketData/GetMarketOverview/0", dataset: "market-overview" }],
    method: "public-web-api",
    tags: { json: "application/json" },
    fields: { marketOverview: "marketOverview", symbol: "symbol", price: "price", volume: "volume" },
    notes: "این منبع HTML نیست؛ پاسخ JSON فقط پس از تایید قرارداد و مجوز استفاده پذیرفته می شود.",
  },
  codal: {
    ...common,
    name: "Codal",
    hosts: ["codal.ir", "www.codal.ir"],
    entrypoints: [{ id: "home", url: "https://codal.ir/", dataset: "disclosures" }, { id: "search", url: "https://codal.ir/ReportList.aspx", dataset: "financial-reports" }],
    tags: { root: "main, #aspnetForm, body", reportRows: "table tr, .report-row", reportLinks: "a[href*='Report'], a[href*='View']", forms: "form", scripts: "script" },
    fields: { title: "h1, h2, .title", issuer: ".issuer, [data-issuer]", publishedAt: "time, .date, [data-date]", reportUrl: "a[href*='Report'], a[href*='View']" },
    notes: "صفحه اصلی برای اثبات قرارداد API کافی نیست؛ گزارش باید با شناسه اطلاعیه، دوره و اصلاحیه اعتبارسنجی شود.",
  },
  fipiran: {
    ...common,
    name: "Fipiran",
    hosts: ["www.fipiran.com", "fipiran.com"],
    entrypoints: [{ id: "home", url: "https://www.fipiran.com/", dataset: "financial-indicators" }],
    tags: { root: "main, body", tables: "table", rows: "table tr", links: "a[href]" },
    fields: { symbol: ".symbol, [data-symbol]", eps: ".eps, [data-eps]", pe: ".pe, [data-pe]", date: "time, .date, [data-date]" },
    notes: "در صورت 403 یا نبود قرارداد پاسخ، از این منبع عدد تحلیلی استخراج نمی شود.",
  },
  tse: {
    ...common,
    name: "TSE",
    hosts: ["tse.ir", "www.tse.ir"],
    entrypoints: [{ id: "home", url: "https://tse.ir/", dataset: "official-notices" }],
    tags: { root: "main, body", notices: "article, table tr, .news-item", links: "a[href]", dates: "time, .date" },
    fields: { title: "h1, h2, .title", publishedAt: "time, .date", documentUrl: "a[href]" },
    notes: "فقط اطلاعیه عمومی؛ هیچ جدول مالی بدون نسخه فایل و منبع رسمی وارد تحلیل نمی شود.",
  },
  ifb: {
    ...common,
    name: "IFB",
    hosts: ["ifb.ir", "www.ifb.ir"],
    entrypoints: [{ id: "home", url: "https://www.ifb.ir/", dataset: "otc-notices" }],
    tags: { root: "main, body", notices: "article, table tr, .news-item", links: "a[href]", dates: "time, .date" },
    fields: { title: "h1, h2, .title", publishedAt: "time, .date", documentUrl: "a[href]" },
    notes: "اطلاعات فرابورس باید با تاریخ موثر و سند رسمی ذخیره شود.",
  },
  cbi: {
    ...common,
    name: "CBI",
    hosts: ["cbi.ir", "www.cbi.ir"],
    entrypoints: [{ id: "home", url: "https://www.cbi.ir/", dataset: "economic-data" }, { id: "exchange", url: "https://www.cbi.ir/ExRates/rates_fa.aspx", dataset: "exchange-rates" }],
    tags: { root: "main, body", tables: "table", rows: "table tr", rss: "a[href*='rss'], a[href*='RSS']", links: "a[href]" },
    fields: { title: "h1, h2, .title", rate: "td.rate, [data-rate], table td", currency: "td.currency, [data-currency]", date: "time, .date, [data-date]" },
    notes: "صفحه رسمی CBI بخش های نرخ ارز و آمار اقتصادی را معرفی می کند؛ واحد ریال باید صریح ثبت شود.",
  },
  sci: {
    ...common,
    name: "SCI",
    hosts: ["amar.org.ir", "www.amar.org.ir"],
    entrypoints: [{ id: "home", url: "https://www.amar.org.ir/", dataset: "economic-indicators" }],
    tags: { root: "main, body", tables: "table", rows: "table tr", reports: "article, .report, a[href]" },
    fields: { title: "h1, h2, .title", value: "td.value, [data-value], table td", period: "time, .date, [data-period]", unit: ".unit, [data-unit]" },
    notes: "شاخص های آماری باید با دوره، واحد و نسخه انتشار تطبیق داده شوند.",
  },
  ime: {
    ...common,
    name: "IME",
    hosts: ["ime.co.ir", "www.ime.co.ir"],
    entrypoints: [{ id: "home", url: "https://www.ime.co.ir/", dataset: "commodity-prices" }],
    tags: { root: "main, body", tables: "table", rows: "table tr", links: "a[href]" },
    fields: { product: ".product, [data-product], table td:nth-child(1)", price: ".price, [data-price], table td:nth-child(2)", quantity: ".quantity, [data-quantity]", date: "time, .date, [data-date]" },
    notes: "قیمت کالا باید با بازار، واحد، حجم و تاریخ معامله ذخیره شود.",
  },
  irenex: {
    ...common,
    name: "IRENEX",
    hosts: ["irenex.ir", "www.irenex.ir"],
    entrypoints: [{ id: "home", url: "https://www.irenex.ir/", dataset: "energy-prices" }],
    tags: { root: "main, body", tables: "table", rows: "table tr", links: "a[href]" },
    fields: { product: ".product, [data-product]", price: ".price, [data-price]", volume: ".volume, [data-volume]", date: "time, .date, [data-date]" },
    notes: "اطلاعات انرژی باید با واحد قیمت و حجم و تاریخ تحویل تطبیق داده شود.",
  },
  rahavard365: {
    ...common,
    name: "Rahavard365",
    hosts: ["rahavard365.com", "www.rahavard365.com"],
    entrypoints: [{ id: "home", url: "https://rahavard365.com/", dataset: "comparative-research" }],
    tags: { root: "main, body", tables: "table", charts: "canvas, svg", links: "a[href]" },
    fields: { symbol: ".symbol, [data-symbol]", value: ".value, [data-value]", date: "time, .date, [data-date]" },
    legal: "کرول یا دریافت خودکار فقط با مجوز و قرارداد معتبر؛ بدون مجوز مسدود است.",
    notes: "این منبع تطبیقی است و نباید به عنوان شاهد مستقل برای داده ای که منبع اولیه آن جای دیگری است استفاده شود.",
  },
  "trading-economics": {
    ...common,
    name: "Trading Economics",
    hosts: ["tradingeconomics.com", "api.tradingeconomics.com"],
    entrypoints: [{ id: "home", url: "https://tradingeconomics.com/", dataset: "global-macro" }],
    method: "official-api",
    tags: { root: "main, body", tables: "table", charts: "canvas, svg", links: "a[href]" },
    fields: { indicator: ".indicator, [data-indicator]", actual: ".actual, [data-actual]", unit: ".unit, [data-unit]", date: "time, .date, [data-date]" },
    legal: "دریافت خودکار از API فقط با کلید و سطح دسترسی معتبر؛ HTML عمومی جایگزین مجوز API نیست.",
    notes: "برای داده جهانی API رسمی بر HTML مقدم است.",
  },
  fred: {
    ...common,
    name: "FRED",
    hosts: ["fred.stlouisfed.org", "api.stlouisfed.org"],
    entrypoints: [{ id: "home", url: "https://fred.stlouisfed.org/", dataset: "global-macro" }],
    method: "official-api",
    tags: { root: "main, body", tables: "table", charts: "svg", links: "a[href]" },
    fields: { seriesId: "[data-series-id], .series-id", value: "[data-value], td.value", period: "time, .date, [data-period]" },
    legal: "API رسمی و کلید ثبت شده مقدم است؛ استفاده باید با Terms و حقوق سری های شخص ثالث سازگار باشد.",
    notes: "صفحه HTML برای آموزش و کشف سری است؛ داده تحلیلی باید از API با timestamp و vintage گرفته شود.",
  },
};

export function getCrawlerConfig(sourceId) {
  return Object.prototype.hasOwnProperty.call(CRAWLER_SITE_CONFIGS, sourceId) ? CRAWLER_SITE_CONFIGS[sourceId] : undefined;
}

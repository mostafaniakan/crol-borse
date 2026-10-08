"use client";

import { useState } from "react";
import { ArrowRight, ExternalLink, RefreshCw, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { SOURCE_DEFINITIONS, type SourceHealth, type SourceStatus } from "../../lib/data-sources";
import { TermHelp } from "../../components/learning/term-help";
import type { AdapterMethod } from "../../lib/ingestion/types";

const statusLabel: Record<SourceStatus, string> = {
  active: "فعال",
  degraded: "ناپایدار / ناقص",
  stale: "قدیمی",
  unavailable: "در دسترس نیست",
};

const categoryLabel = {
  market: "بازار و معاملات",
  financial: "مالی و افشا",
  economic: "اقتصادی",
  comparative: "تطبیقی",
} as const;

const methodLabel: Record<AdapterMethod["method"], string> = {
  "official-api": "API رسمی",
  "public-web-api": "API عمومی",
  html: "HTML",
  browser: "مرورگر",
  file: "فایل",
  manual: "ورود دستی",
};

export default function DataSourcesPage() {
  const [sources, setSources] = useState<SourceHealth[]>(SOURCE_DEFINITIONS.map((source) => ({
    ...source,
    status: source.baselineStatus,
    checkedAt: "—",
    lastSuccessAt: null,
    freshness: "unknown",
    coverage: "unknown",
    errorCount: source.baselineStatus === "unavailable" ? 1 : 0,
    reason: source.baselineReason,
  })));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("برای بررسی اتصال منابع، دکمه به‌روزرسانی را بزنید.");
  const [methodPlans, setMethodPlans] = useState<Record<string, AdapterMethod[]>>({});
  const [crawlState, setCrawlState] = useState<Record<string, "loading" | "ok" | "failed">>({});
  const [crawlMessage, setCrawlMessage] = useState<Record<string, string>>({});

  const refresh = async () => {
    setLoading(true);
    setMessage("در حال اجرای probe محدود برای منابع قابل دسترس...");
    try {
      const response = await fetch("/api/data-sources", { cache: "no-store" });
      const payload = await response.json() as { sources?: SourceHealth[] };
      if (!response.ok || !Array.isArray(payload.sources)) throw new Error("invalid-response");
      setSources(payload.sources);
      const methodResponse = await fetch("/api/ingestion", { cache: "no-store" });
      const methodPayload = await methodResponse.json() as { methods?: { sourceId: string; methods: AdapterMethod[] }[] };
      if (methodResponse.ok && Array.isArray(methodPayload.methods)) setMethodPlans(Object.fromEntries(methodPayload.methods.map((item) => [item.sourceId, item.methods])));
      setMessage("وضعیت منابع به‌روزرسانی شد. Active فقط به معنای تأیید probe و قرارداد پاسخ است.");
    } catch {
      setMessage("دریافت وضعیت منابع ناموفق بود؛ آخرین وضعیت نمایش‌داده‌شده معتبر فرض نمی‌شود.");
    } finally {
      setLoading(false);
    }
  };

  const crawl = async (sourceId: string) => {
    setCrawlState((current) => ({ ...current, [sourceId]: "loading" }));
    try {
      const response = await fetch("/api/ingestion", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sourceId, dataset: "public-page", method: "html" }) });
      const payload = await response.json() as { ok?: boolean; issues?: { message?: string }[] };
      const text = payload.issues?.[0]?.message ?? (payload.ok ? "داده عمومی استخراج و اعتبارسنجی شد." : "کرول تایید نشد.");
      setCrawlState((current) => ({ ...current, [sourceId]: payload.ok ? "ok" : "failed" }));
      setCrawlMessage((current) => ({ ...current, [sourceId]: text }));
    } catch {
      setCrawlState((current) => ({ ...current, [sourceId]: "failed" }));
      setCrawlMessage((current) => ({ ...current, [sourceId]: "ارتباط با سرویس کرول برقرار نشد." }));
    }
  };

  return (
    <main className="source-monitor" dir="rtl">
      <header className="source-monitor-header">
        <Link className="back-link" href="/"><ArrowRight size={16}/> بازگشت به رادار سهم</Link>
        <div className="source-title-row">
          <div>
            <div className="eyebrow"><span className="eyebrow-line"/> پایش چندمنبعی داده</div>
            <h1>سلامت منابع اطلاعاتی</h1>
            <p>هر منبع مستقل بررسی می‌شود؛ منبع ناقص یا مسدود وارد رتبه‌بندی نمی‌شود.</p>
          </div>
          <button className="refresh-sources" type="button" onClick={() => void refresh()} disabled={loading}><RefreshCw size={16}/> {loading ? "در حال بررسی" : "به‌روزرسانی"}</button>
        </div>
        <div className="source-monitor-note"><ShieldCheck size={16}/><span>{message}</span></div>
      </header>
      <section className="source-grid">
        {sources.map((source) => (
          <article className={`source-card source-${source.status}`} key={source.id}>
            <div className="source-card-top"><div><span className="source-category">{categoryLabel[source.category]}</span><h2>{source.name}</h2></div><span className="source-status"><i/>{statusLabel[source.status]}</span></div>
            <p className="source-reason">{source.reason}</p>
            <dl className="source-facts">
              <div><dt><TermHelp termId="data-freshness" label="تازگی داده" compact/></dt><dd>{source.freshness === "fresh" ? "تازه" : "نامشخص"}</dd></div>
              <div><dt><TermHelp termId="data-coverage" label="پوشش داده" compact/></dt><dd>{source.coverage === "verified" ? "تأییدشده" : source.coverage === "partial" ? "ناقص" : "نامشخص"}</dd></div>
              <div><dt>خطا</dt><dd>{source.errorCount}</dd></div>
              <div><dt>آخرین probe</dt><dd>{source.checkedAt === "—" ? "—" : new Date(source.checkedAt).toLocaleString("fa-IR")}</dd></div>
            </dl>
            <div className="source-card-bottom"><span>دسترسی: {source.auth === "api-key" ? "کلید API" : source.auth === "licensed" ? "مجوز" : source.auth === "manual" ? "دستی" : "عمومی"}</span><a href={source.officialUrl} target="_blank" rel="noreferrer">منبع رسمی <ExternalLink size={13}/></a><button type="button" className="source-crawl" onClick={() => void crawl(source.id)} disabled={crawlState[source.id] === "loading"}>{crawlState[source.id] === "loading" ? "در حال کرول" : "کرول صفحه عمومی"}</button></div>
            <div className="source-methods"><small>زنجیره دریافت</small><div>{(methodPlans[source.id] ?? []).map((item) => <span className={item.enabled ? "enabled" : "disabled"} key={item.method}>{methodLabel[item.method]}</span>)}</div></div>
            {crawlMessage[source.id] && <div className={`source-crawl-message ${crawlState[source.id]}`} role="status">{crawlMessage[source.id]}</div>}
          </article>
        ))}
      </section>
    </main>
  );
}

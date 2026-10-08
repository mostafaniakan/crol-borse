"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, AlertTriangle, BarChart3, BookOpen, Database, Gauge, ListChecks, Play, Settings2, ShieldCheck } from "lucide-react";
import { TermHelp } from "../../components/learning/term-help";

const navItems = [
  { href: "/dashboard", label: "نمای کلی", icon: Gauge },
  { href: "/", label: "رتبه‌بندی بازار", icon: BarChart3 },
  { href: "/analysis-lab", label: "آزمایشگاه تحلیل", icon: BookOpen },
  { href: "/learning-assistant", label: "دستیار یادگیری", icon: BookOpen },
  { href: "/activity", label: "گزارش فعالیت", icon: Activity },
  { href: "/data-sources", label: "منابع داده", icon: Database },
  { href: "/settings", label: "تنظیمات", icon: Settings2 },
];

export default function DashboardPage() {
  const [jobMessage, setJobMessage] = useState("هیچ اجرای واقعی ثبت نشده است.");
  const [starting, setStarting] = useState(false);

  const startJob = async (kind: "market" | "watchlist") => {
    setStarting(true);
    setJobMessage("در حال درخواست ایجاد Job...");
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind, configVersion: "current" }),
      });
      const payload = await response.json() as { message?: string };
      setJobMessage(payload.message ?? (response.ok ? "Job ایجاد شد." : "ایجاد Job ناموفق بود."));
    } catch {
      setJobMessage("ارتباط با Backend اجرای تحلیل برقرار نشد.");
    } finally {
      setStarting(false);
    }
  };

  return (
    <main className="management-dashboard" dir="rtl">
      <aside className="dashboard-sidebar">
        <Link href="/" className="dashboard-brand"><span>ر</span><strong>رادار سهم</strong></Link>
        <div className="dashboard-sidebar-label">مدیریت سامانه</div>
        <nav>{navItems.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={href === "/dashboard" ? "active" : ""}><Icon size={17}/><span>{label}</span></Link>)}</nav>
        <div className="sidebar-footer"><ShieldCheck size={16}/><span>حالت ایمن<br/><small>بدون داده معتبر، رتبه منتشر نمی‌شود</small></span></div>
      </aside>
      <section className="dashboard-content">
        <header className="dashboard-header"><div><span className="dashboard-kicker">مدیریت و کنترل تحلیل</span><h1>نمای کلی سامانه</h1><p>وضعیت اجرا، کیفیت داده و منابع را از یک نقطه بررسی کنید.</p></div><Link href="/data-sources" className="dashboard-outline"><Database size={16}/> پایش منابع</Link></header>

        <section className="dashboard-alert"><AlertTriangle size={18}/><div><strong>رتبه‌بندی عملیاتی هنوز فعال نیست</strong><span>منبع داده و storage اجرای Job باید پیکربندی و اعتبارسنجی شوند. اعداد نمونه در این داشبورد نمایش داده نمی‌شوند.</span></div></section>

        <section className="dashboard-stat-grid">
          {[{label:"نمادهای شناسایی‌شده",value:"—",note:"داده منبع متصل نیست"},{label:"نمادهای واجد شرایط",value:"—",note:"پس از Data Quality Gate"},{label:"۱۰۰ رتبه برتر",value:"—",note:"اسکن معتبر در دسترس نیست"},{label:"۵۰ نماد ثابت",value:"—",note:"Watchlist هنوز ذخیره نشده"}].map((item) => <article className="dashboard-stat" key={item.label}><span>{item.label}</span><strong>{item.value}</strong><small>{item.note === "پس از Data Quality Gate" ? <><span>پس از </span><TermHelp termId="data-quality-gate" label="دروازه کیفیت داده" compact/></> : item.note}</small></article>)}
        </section>

        <div className="dashboard-two-col">
          <section className="dashboard-panel job-panel"><div className="panel-heading"><div><span className="panel-kicker">مرکز کنترل تحلیل</span><h2>اجرای عملیات</h2></div><span className="job-idle">آماده نیست</span></div><p className="panel-description">هر اجرا باید در Backend با Job ID پایدار ثبت شود تا بسته‌شدن مرورگر اجرای آن را از بین نبرد.</p><div className="job-actions"><button type="button" onClick={() => void startJob("market")} disabled={starting}><Play size={15}/> شروع تحلیل کامل بازار</button><button type="button" className="secondary" onClick={() => void startJob("watchlist")} disabled={starting}><ListChecks size={15}/> تحلیل ۵۰ نماد ثابت</button></div><div className="job-message" role="status">{jobMessage}</div></section>
          <section className="dashboard-panel"><div className="panel-heading"><div><span className="panel-kicker">Live Progress Monitor</span><h2>پیشرفت اجرای جاری</h2></div><span className="job-idle">بدون اجرا</span></div><div className="empty-progress"><Gauge size={25}/><strong>پیشرفتی برای نمایش وجود ندارد</strong><span>درصد پیشرفت فقط از واحدهای کاری واقعی محاسبه می‌شود.</span></div></section>
        </div>

        <section className="dashboard-panel"><div className="panel-heading"><div><span className="panel-kicker">کنترل کیفیت</span><h2>هشدارها و داده‌های ناقص</h2></div><Link href="/data-sources" className="panel-link">مشاهده منابع</Link></div><div className="quality-grid"><div><AlertTriangle size={18}/><strong>منبع داده عملیاتی وجود ندارد</strong><span>اسکن بازار متوقف می‌ماند تا Connector معتبر فعال شود.</span></div><div><Database size={18}/><strong>Storage تحلیل تنظیم نشده</strong><span>Job، Snapshot و Calculation Trace قابل ذخیره نیستند.</span></div><div><ShieldCheck size={18}/><strong>خروجی نمونه از رتبه‌بندی جداست</strong><span>داده نمایشی در محیط عملیاتی به‌عنوان نتیجه استفاده نمی‌شود.</span></div></div></section>
      </section>
    </main>
  );
}

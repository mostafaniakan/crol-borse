"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, ArrowUpRight, Database, Activity, ShieldCheck, ChevronDown } from "lucide-react";
import Link from "next/link";
import { TermHelp } from "../components/learning/term-help";

type Company = { ticker:string; name:string; industry:string; score:number; verdict:string; color:string; salesGrowth:number; marketShare:number; cashQuality:number; valuation:number; liquidity:string; marketSignal:string; reasons:string[]; risk:string };
const companies: Company[] = [
  {ticker:"فملی",name:"ملی صنایع مس ایران",industry:"فلزات اساسی",score:88,verdict:"مناسب برای بررسی عمیق",color:"#55d6be",salesGrowth:41,marketShare:78,cashQuality:86,valuation:72,liquidity:"بالا",marketSignal:"تقاضای پایدار",reasons:["رشد فروش دیتابیس در ۱۲ ماه اخیر بالاتر از میانگین صنعت","جریان نقد عملیاتی با سود گزارش‌شده هم‌جهت است","نقدشوندگی بالا و پوشش تحلیلی مناسب"],risk:"حساس به قیمت جهانی مس و نرخ ارز"},
  {ticker:"فولاد",name:"فولاد مبارکه اصفهان",industry:"فلزات اساسی",score:84,verdict:"قوی با ریسک چرخه‌ای",color:"#6ea8fe",salesGrowth:35,marketShare:82,cashQuality:79,valuation:69,liquidity:"بالا",marketSignal:"قدرت نسبی مثبت",reasons:["سهم بازار داخلی بالا و شبکه توزیع گسترده","حاشیه سود عملیاتی در محدوده قابل اتکا","ارزش معاملات روزانه امکان ورود و خروج را بهتر می‌کند"],risk:"ریسک انرژی، قیمت‌گذاری و رکود فولاد"},
  {ticker:"شپنا",name:"پالایش نفت اصفهان",industry:"فراورده‌های نفتی",score:79,verdict:"ارزشمند اما پرنوسان",color:"#f7b267",salesGrowth:28,marketShare:64,cashQuality:74,valuation:81,liquidity:"بالا",marketSignal:"نوسان بالا",reasons:["ارزش‌گذاری نسبی جذاب‌تر از میانگین گروه","روند فروش محصول در گزارش‌های ماهانه قابل پیگیری است","حجم معاملات بالا و شناوری مناسب"],risk:"وابسته به کرک‌اسپرد، نرخ خوراک و سیاست‌های صنعت"},
  {ticker:"شپاکسا",name:"پاکسان",industry:"محصولات شیمیایی",score:73,verdict:"رشد عملیاتی قابل پیگیری",color:"#d7a8ff",salesGrowth:52,marketShare:47,cashQuality:61,valuation:68,liquidity:"متوسط",marketSignal:"رشد فروش",reasons:["رشد مقداری فروش در دیتابیس از رشد قیمت جدا شده است","تنوع محصول و برند ریسک تمرکز را کاهش می‌دهد","پتانسیل بهبود حاشیه سود با اصلاح ترکیب فروش"],risk:"نقدشوندگی متوسط و فشار مواد اولیه"},
  {ticker:"کگل",name:"معدنی و صنعتی گل گهر",industry:"استخراج کانه‌های فلزی",score:69,verdict:"نیازمند بررسی قیمت خرید",color:"#fb7185",salesGrowth:22,marketShare:74,cashQuality:72,valuation:58,liquidity:"بالا",marketSignal:"خنثی",reasons:["جایگاه رقابتی و سهم بازار قابل توجه","کیفیت جریان نقد مناسب","امتیاز ارزش‌گذاری با توجه به قیمت فعلی متوسط است"],risk:"قیمت سهم ممکن است بخش زیادی از رشد را پیش‌خور کرده باشد"},
];
const money=(value:number)=>new Intl.NumberFormat("fa-IR",{maximumFractionDigits:0}).format(value);
function Metric({label,value,termId}:{label:string;value:number;termId:string}){return <div className="metric"><div className="metric-top"><TermHelp termId={termId} label={label} compact/><strong>{money(value)}٪</strong></div><div className="track"><span style={{width:`${Math.min(value,100)}%`}} /></div></div>}

export default function Home(){
  const [query,setQuery]=useState(""); const [searched,setSearched]=useState(false); const [selected,setSelected]=useState<Company|null>(companies[0]);
  const [databaseCheckEnabled,setDatabaseCheckEnabled]=useState(true);
  const [databaseStatus,setDatabaseStatus]=useState<"idle"|"checking"|"available"|"unavailable">("idle");
  const [scanStatus,setScanStatus]=useState<"idle"|"loading"|"unavailable">("idle");
  const [scanMessage,setScanMessage]=useState("اسکن کامل بازار فقط با منبع داده معتبر اجرا می‌شود.");
  const results=useMemo(()=>{const q=query.trim().toLowerCase(); if(!q)return companies; return companies.filter(c=>`${c.ticker} ${c.name} ${c.industry}`.toLowerCase().includes(q));},[query]);
  const searchResults=(term:string)=>{const q=term.trim().toLowerCase();if(!q)return companies;return companies.filter(c=>`${c.ticker} ${c.name} ${c.industry}`.toLowerCase().includes(q));};
  const checkDatabase=async()=>{
    setDatabaseStatus("checking");
    const controller=new AbortController();
    const timeout=window.setTimeout(()=>controller.abort(),5000);
    try{
      const response=await fetch("/api/database-health",{cache:"no-store",signal:controller.signal});
      const payload=await response.json().catch(()=>null) as {ok?:boolean}|null;
      if(!response.ok || payload?.ok!==true){setDatabaseStatus("unavailable");return false;}
      setDatabaseStatus("available");return true;
    }catch{
      setDatabaseStatus("unavailable");return false;
    }finally{
      window.clearTimeout(timeout);
    }
  };
  const runSearch=async(term:string)=>{
    if(databaseCheckEnabled && !(await checkDatabase()))return;
    const nextResults=searchResults(term);
    setQuery(term);setSearched(true);setSelected(nextResults[0]??null);
  };
  const scanAll=async()=>{
    setScanStatus("loading");setScanMessage("در حال بررسی منبع داده و آماده‌سازی اسکن کامل...");
    if(databaseCheckEnabled && !(await checkDatabase())){setScanStatus("unavailable");setScanMessage("اتصال دیتابیس برقرار نشد؛ اسکن کامل متوقف شد.");return;}
    try{
      const response=await fetch("/api/market-scan?limit=100",{cache:"no-store"});
      const payload=await response.json().catch(()=>null) as {message?:string}|null;
      if(!response.ok){setScanStatus("unavailable");setScanMessage(payload?.message??"منبع داده برای اسکن کامل آماده نیست.");return;}
      setScanStatus("idle");setScanMessage("اسکن کامل بازار با موفقیت انجام شد.");
    }catch{
      setScanStatus("unavailable");setScanMessage("اسکن کامل به دلیل خطای منبع داده انجام نشد.");
    }
  };
  const submit=(event:React.FormEvent)=>{event.preventDefault();if(query.trim())void runSearch(query);else void scanAll()};
  const databaseMessage=databaseStatus==="checking"?"در حال بررسی اتصال قبل از جست‌وجو...":databaseStatus==="available"?"اتصال دیتابیس تأیید شد.":databaseStatus==="unavailable"?"اتصال دیتابیس برقرار نشد؛ جست‌وجو متوقف شد.":databaseCheckEnabled?"قبل از هر جست‌وجو اتصال دیتابیس بررسی می‌شود.":"بررسی دیتابیس خاموش است؛ نتایج را حتماً در کدال و TSETMC کنترل کنید.";
  return <main className="app-shell" dir="rtl">
    <header className="topbar"><div className="brand"><div className="brand-mark">ر</div><div><div className="brand-name">رادار سهم</div><div className="brand-sub">Market intelligence</div></div></div><div className="topbar-meta"><Link className="source-monitor-link" href="/learning-assistant">دستیار یادگیری</Link><span className="divider"/><Link className="source-monitor-link" href="/dashboard">داشبورد مدیریت</Link><span className="divider"/><Link className="source-monitor-link" href="/data-sources">سلامت منابع داده</Link><span className="divider"/><span className="live-dot"/> داده نمایشی است <span className="divider"/> بررسی قبل از جست‌وجو: {databaseCheckEnabled?"روشن":"خاموش"}</div></header>
    <section className="hero"><div className="eyebrow"><span className="eyebrow-line"/> غربالگری چندمنبعی بازار</div><h1>شرکت‌هایی را پیدا کن که<br/><em>ارزش بررسی</em> دارند.</h1><p>رشد فروش واقعی، کیفیت سود و وضعیت معامله را کنار هم ببین؛ قبل از اینکه تصمیم سرمایه‌گذاری بگیری.</p><button type="button" className="market-scan-button" onClick={()=>void scanAll()} disabled={scanStatus==="loading"||databaseStatus==="checking"}><Database size={17}/>{scanStatus==="loading"?"در حال اسکن بازار":"اسکن کل بازار؛ حداکثر ۱۰۰ نماد"}<ArrowUpRight size={17}/></button><div className={`scan-status ${scanStatus}`} role="status"><span/>{scanMessage}</div><form onSubmit={submit} className="searchbar"><Search size={20}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="جست‌وجوی اختیاری یک نماد..." aria-label="جست‌وجوی شرکت"/><button type="submit" disabled={databaseStatus==="checking"}>{databaseStatus==="checking"?"در حال بررسی":"تحلیل کن"} <ArrowUpRight size={17}/></button></form><label className="database-toggle"><input type="checkbox" checked={databaseCheckEnabled} onChange={e=>{setDatabaseCheckEnabled(e.target.checked);setDatabaseStatus("idle")}}/><span><strong>بررسی اتصال دیتابیس قبل از جست‌وجو</strong><small>{databaseMessage}</small></span></label><div className={`database-status ${databaseStatus}`} role="status"><Database size={15}/><span>{databaseMessage}</span></div><div className="suggestions"><span>پیشنهاد:</span>{["فملی","فولاد","شپنا","محصولات شیمیایی"].map(item=><button type="button" key={item} onClick={()=>void runSearch(item)}>{item}</button>)}</div></section>
    <section className="workspace"><div className="section-heading"><div><div className="eyebrow small"><span className="eyebrow-line"/> {searched?"نتیجه جست‌وجو":"نمونه رتبه‌بندی امروز"}</div><h2>{searched&&query?`نتایج برای «${query}»`:"نامزدهای برتر برای بررسی"}</h2></div><button className="filter-button"><SlidersHorizontal size={16}/> فیلترها <ChevronDown size={14}/></button></div>
      <div className="content-grid"><div className="ranking-list">{results.length?results.map((c,index)=><button key={c.ticker} className={`company-row ${selected?.ticker===c.ticker?"selected":""}`} onClick={()=>setSelected(c)}><span className="rank">{String(index+1).padStart(2,"0")}</span><span className="company-logo" style={{background:c.color}}>{c.ticker.slice(0,1)}</span><span className="company-info"><strong>{c.name}</strong><small>{c.ticker} <i>•</i> {c.industry}</small></span><span className="company-score"><strong>{c.score}</strong><small><TermHelp termId="score" label="امتیاز" compact/></small></span><span className="row-chevron">‹</span></button>):<div className="empty"><Search size={28}/><strong>نتیجه‌ای پیدا نشد</strong><span>نام نماد یا صنعت دیگری را امتحان کن.</span></div>}<div className="data-note"><Database size={16}/><span>این نسخه هنوز امتیازهای نمونه را نمایش می‌دهد؛ برای تصمیم واقعی، اطلاعات شرکت را در کدال و TSETMC تطبیق دهید.</span></div></div>
      {selected&&<aside className="detail-card"><div className="detail-head"><div className="detail-symbol"><span className="company-logo large" style={{background:selected.color}}>{selected.ticker.slice(0,1)}</span><div><strong>{selected.ticker}</strong><small>{selected.name}</small></div></div><span className="score-ring" style={{["--score" as string]:`${selected.score*3.6}deg`}}>{selected.score}<small>/ ۱۰۰</small></span></div><div className="verdict"><ShieldCheck size={18}/><div><strong>{selected.verdict}</strong><span><TermHelp termId="confidence" label="سطح اطمینان" compact/>: متوسط تا بالا</span></div></div><div className="metrics"><Metric label="رشد فروش دیتابیس" termId="sales-growth" value={selected.salesGrowth}/><Metric label="سهم بازار دسته" termId="market-share" value={selected.marketShare}/><Metric label="کیفیت جریان نقد" termId="operating-cash-flow" value={selected.cashQuality}/><Metric label="جذابیت ارزش‌گذاری" termId="valuation" value={selected.valuation}/></div><div className="detail-liquidity"><TermHelp termId="liquidity" label="نقدشوندگی" compact/>: {selected.liquidity}</div><div className="why"><div className="why-title"><Activity size={16}/> چرا این رتبه؟</div>{selected.reasons.map(reason=><div className="reason" key={reason}><span/>{reason}</div>)}</div><div className="risk"><span><TermHelp termId="risk-quality" label="ریسک اصلی" compact/></span><strong>{selected.risk}</strong></div><button className="detail-cta">مشاهده تحلیل کامل <ArrowUpRight size={16}/></button></aside>}
      </div></section><footer><span>رادار سهم</span><span>این ابزار برای غربالگری است، نه توصیه قطعی خرید یا فروش.</span><span>داده‌ها باید قبل از تصمیم نهایی با کدال و TSETMC تطبیق داده شوند.</span></footer>
  </main>;
}

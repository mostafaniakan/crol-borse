import Link from "next/link";
import { BookOpen, Calculator, ChevronDown, Database } from "lucide-react";
import { TermHelp } from "../../components/learning/term-help";

export default function AnalysisLabPage() {
  return (
    <main className="workspace-page" dir="rtl">
      <header className="workspace-header">
        <Link href="/dashboard">بازگشت به داشبورد</Link>
        <span>آموزش و بازبینی محاسبات</span>
        <h1>آزمایشگاه تحلیل و محاسبات</h1>
        <p>ورودی، منبع، فرمول و مراحل هر شاخص فقط از Calculation Trace ثبت شده نمایش داده می شود. برای یادگیری مقدماتی، روی علامت سوال کنار شاخص بزنید.</p>
      </header>
      <section className="lab-controls">
        <label>نماد<button disabled>پس از ثبت تحلیل <ChevronDown size={14}/></button></label>
        <label><TermHelp termId="rsi" label="RSI" compact/> یا <TermHelp termId="pe" label="P/E" compact/><button disabled>داده محاسبه شده موجود نیست <ChevronDown size={14}/></button></label>
        <label>تاریخ تحلیل<button disabled>بدون اجرای ثبت شده <ChevronDown size={14}/></button></label>
      </section>
      <section className="workspace-empty">
        <Calculator size={30}/>
        <h2><TermHelp termId="calculation-trace" label="Calculation Trace" compact/> موجود نیست</h2>
        <p>پس از اتصال منبع معتبر، اجرای Job و ذخیره نسخه الگوریتم، داده خام و مراحل محاسبه مرحله به مرحله در این صفحه نمایش داده می شوند.</p>
        <div className="trace-flow"><span><Database size={14}/> Source</span><i>←</i><span>Raw Data</span><i>←</i><span>Validation</span><i>←</i><span>Calculation</span><i>←</i><span><BookOpen size={14}/> Explanation</span></div>
      </section>
    </main>
  );
}

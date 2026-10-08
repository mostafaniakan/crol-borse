import Link from "next/link";
import { Activity, Filter } from "lucide-react";

export default function ActivityPage() {
  return <main className="workspace-page" dir="rtl"><header className="workspace-header"><Link href="/dashboard">بازگشت به داشبورد</Link><span>رویدادهای Backend</span><h1>گزارش فعالیت سیستم</h1><p>Log عملیاتی و Calculation Trace در این صفحه از یکدیگر جدا نگه داشته می‌شوند.</p></header><section className="activity-toolbar"><button disabled><Filter size={14}/> فیلتر نماد</button><button disabled>مرحله</button><button disabled>شدت هشدار</button><button disabled>منبع داده</button><button disabled>Job ID</button></section><section className="workspace-empty"><Activity size={30}/><h2>رخداد عملیاتی ثبت نشده است</h2><p>پس از اتصال Job Store، رویدادها همراه زمان، شناسه اجرا، مرحله و نتیجه نمایش داده می‌شوند. Secretها در Log ثبت نخواهند شد.</p></section></main>;
}

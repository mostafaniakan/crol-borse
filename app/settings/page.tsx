import Link from "next/link";
import { ShieldCheck } from "lucide-react";

const settings = ["اجرای خودکار و زمان‌بندی","منابع فعال و تست اتصال","حداقل نقدشوندگی و پوشش داده","وزن‌های نسخه‌بندی‌شده مدل","مدیریت ۵۰ نماد ثابت","سطح هشدارها و تم ظاهری"];

export default function SettingsPage() {
  return <main className="workspace-page" dir="rtl"><header className="workspace-header"><Link href="/dashboard">بازگشت به داشبورد</Link><span>تنظیمات نسخه‌بندی‌شده</span><h1>مدیریت تنظیمات</h1><p>تغییر وزن‌ها و آستانه‌ها باید نسخه جدید بسازد و نتایج قبلی را بازنویسی نکند.</p></header><section className="settings-list">{settings.map((item)=><div key={item}><span>{item}</span><button disabled>نیازمند Settings Store</button></div>)}</section><section className="settings-warning"><ShieldCheck size={17}/><span>تا زمان اتصال storage پایدار، تنظیمات قابل تغییر نیستند و مقدار جعلی ذخیره نمی‌شود.</span></section></main>;
}

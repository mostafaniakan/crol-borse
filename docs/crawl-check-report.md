# گزارش بررسی اولیه صفحات کرول

تاریخ بررسی: ۱۴۰۵/۰۷/۱۶

این گزارش فقط نتیجه دسترسی و ساختار اولیه صفحه عمومی را ثبت می کند. موفق بودن HTTP به معنی معتبر بودن داده مالی یا مجاز بودن استفاده تجاری نیست.

| منبع | نتیجه بررسی اولیه | وضعیت کرول |
| --- | --- | --- |
| TSETMC | صفحه اصلی در ابزار بررسی timeout شد؛ CDN به صورت صفحه HTML قابل بررسی نبود و قبلا probe آن 403 ثبت کرده است. | `browser-required` / `unverified` |
| Codal | صفحه در ابزار بررسی timeout شد؛ قرارداد گزارش مالی تایید نشد. | `unavailable` / `unverified` |
| Fipiran | صفحه timeout شد و probe قبلی 403 داشت. | `unavailable` / `unverified` |
| TSE | صفحه timeout شد و endpoint عمومی تایید نشد. | `unavailable` |
| IFB | صفحه timeout شد و endpoint عمومی تایید نشد. | `unavailable` |
| CBI | صفحه عمومی قابل مشاهده بود و بخش های آمار، نرخ ارز، نرخ تورم، RSS و جدول های محتوا دیده شد. | `html-candidate`, هنوز `verified=false` |
| SCI | صفحه timeout شد و جدول/فایل قابل اعتبارسنجی دریافت نشد. | `unavailable` |
| IME | صفحه timeout شد و جدول قیمت قابل اعتبارسنجی دریافت نشد. | `unavailable` |
| IRENEX | URL توسط ابزار بررسی قابل دسترسی نبود. | `unavailable` |
| Rahavard365 | صفحه عمومی فقط shell/iframe قابل مشاهده بود؛ دسترسی داده نیازمند مجوز است. | `licensed-only` |
| Trading Economics | صفحه عمومی و جدول های بازار قابل مشاهده بود؛ داده تحلیلی باید از API دارای مجوز گرفته شود. | `api-preferred` |
| FRED | صفحه عمومی قابل مشاهده بود؛ داده باید از API با کلید و timestamp/vintage گرفته شود. | `api-preferred` |

## نتیجه عملیاتی

- تنظیمات هر منبع در `lib/ingestion/crawler-sites.js` ثبت شده است.
- `verified=false` برای همه selectorهای اولیه باقی مانده است تا نمونه پاسخ واقعی با قرارداد داده تطبیق داده شود.
- کرول عمومی از `robots.txt` شروع می شود و با خطای robots، CAPTCHA، احراز هویت یا نیاز به JavaScript متوقف می شود.
- هیچ مقدار استخراج نشده ای به امتیازدهی یا رتبه بندی وارد نمی شود.

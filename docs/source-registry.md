# رجیستری منابع

رجیستری اجرایی در `lib/data-sources.ts` و تنظیمات کرول در `lib/ingestion/crawler-sites.js` است.

| منبع | نقش | روش فعلی | وضعیت |
| --- | --- | --- | --- |
| TSETMC/CDN | معاملات و تاریخچه | API عمومی/probe | Degraded یا Unverified |
| Codal | صورت مالی و افشا | HTML/فایل پس از مجوز | Degraded |
| Fipiran | شاخص های پردازش شده | HTML/فایل | Degraded |
| TSE/IFB | اطلاعات رسمی | فایل/دستی تا تایید endpoint | Unavailable |
| CBI/SCI/IME/IRENEX | اقتصاد، کالا و انرژی | HTML/فایل | Unavailable یا Unverified |
| FRED | اقتصاد جهانی | API با کلید | Needs credentials |
| Trading Economics | داده مکمل | API با مجوز | Needs credentials/license |
| Rahavard365 | تطبیقی | فقط licensed | Licensed only |

هیچ وضعیت `Active` بدون probe، قرارداد پاسخ، مجوز و کیفیت داده معتبر صادر نمی شود.

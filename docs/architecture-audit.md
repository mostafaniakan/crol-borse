# ممیزی معماری و آمادگی تولید

تاریخ ممیزی: ۱۴۰۵/۰۷/۱۶

## دامنه بررسی

مخزن با بررسی ساختار `app/`، مسیرهای API، `lib/`، `db/`، `postgres/`، تنظیمات Vinext/Cloudflare، اسکریپت های build، وابستگی ها، رابط کاربری و تست های قابل اجرا بررسی شد.

## فناوری واقعی فعلی

- رابط: React 19 و Next-compatible Vinext 1.0 beta
- Runtime: Cloudflare Worker با Vite و RSC
- دیتابیس runtime: فعال نیست؛ `db/schema.ts` خالی و D1 در `.openai/hosting.json` برابر `null` است.
- طرح PostgreSQL: فقط `postgres/schema.sql` و `postgres/seed.sql`؛ به runtime وصل نیست.
- Storage خام: وجود ندارد.
- Worker و Job پایدار: وجود ندارد.
- Provider بازار و صورت مالی: قرارداد و اتصال عملیاتی کامل ندارد.
- تست: تست واحد، integration، golden dataset و backtest وجود ندارد.

## وضعیت ماژول ها

| ماژول | وضعیت | شدت | شواهد |
| --- | --- | --- | --- |
| Frontend dashboard | Partial | Medium | صفحات RTL وجود دارند اما بخشی از داده صفحه اصلی آرایه نمونه است. |
| Top 100 ranking | Missing | Critical | `/api/market-scan` عمدا `DATA_SOURCE_NOT_CONFIGURED` برمی گرداند. |
| Watchlist 50 | Missing | Critical | ذخیره و نگاشت مستقل ۵۰ نماد وجود ندارد. |
| Source registry | Partial | High | رجیستری و probe وجود دارد؛ قرارداد کامل داده و مجوز همه منابع تایید نشده است. |
| Crawler adapters | Partial | High | allowlist، robots، selector و HTML crawler وجود دارد؛ selectorهای منابع `verified=false` هستند. |
| Official API adapters | Partial | High | FRED و Trading Economics با credential قابل فعال سازی هستند؛ منابع ایرانی قرارداد عملیاتی کامل ندارند. |
| Bronze/Silver/Gold storage | Missing | Critical | raw immutable و normalized/feature storage وجود ندارد. |
| Data Quality Gate | Missing | Critical | اعتبارسنجی کامل واحد، تاریخ، corporate action و reconciliation وجود ندارد. |
| Calculation engine | Missing | Critical | فقط قرارداد Trace وجود دارد و `/api/analysis/...` بدون trace پاسخ 503 می دهد. |
| Scoring/ranking engine | Missing | Critical | مدل نسخه بندی شده و cross-sectional ranking وجود ندارد. |
| Market regime | Missing | High | تشخیص Bullish/Bearish/Sideways پیاده نشده است. |
| Security risk engine | Missing | Critical | ریسک نماد، صنعت و سبد پیاده نشده است. |
| Backtesting | Missing | Critical | point-in-time، execution model و walk-forward وجود ندارد. |
| Independent verification | Missing | Critical | golden dataset و پیاده سازی مرجع مستقل وجود ندارد. |
| Job orchestration | Missing | Critical | `/api/jobs` با `JOB_STORE_NOT_CONFIGURED` پاسخ می دهد. |
| Progress monitor | Partial | High | UI دارد اما فقط داده اجرای واقعی را می پذیرد و storage ندارد. |
| Calculation trace | Partial | High | UI، پایگاه دانش و قرارداد API وجود دارد؛ trace ذخیره شده وجود ندارد. |
| Learning assistant | Implemented | Medium | پایگاه دانش نسخه بندی شده و توضیح درجا فعال است؛ مثال های واقعی به engine وابسته اند. |
| Audit log | Missing | High | تصمیم بازبینی و تغییر داده ذخیره نمی شود. |
| Database health | Partial | High | فقط `SELECT 1` روی D1 را بررسی می کند و تازگی/پوشش منبع را اثبات نمی کند. |
| Deployment | Partial | High | build موفق است؛ binding دیتابیس و storage تولیدی تنظیم نشده است. |
| Security/secrets | Partial | High | کلیدها از env خوانده می شوند؛ auth، rate limit داخلی و redaction لاگ کامل نیست. |

## یافته های بحرانی

1. هیچ مسیر معتبر برای انتشار رتبه بندی ۱۰۰ سهم وجود ندارد؛ این وضعیت ایمن است و باید حفظ شود.
2. دیتابیس و storage پایدار به runtime متصل نیستند.
3. داده نمونه صفحه اصلی نباید در مسیر عملیاتی با نتیجه واقعی اشتباه شود.
4. بدون point-in-time snapshot، backtest معتبر و بدون look-ahead قابل ادعا نیست.
5. نبود security/auth برای endpointهای mutation قبل از عمومی شدن باید رفع شود.

## اعتبارسنجی اجرا شده

- `npm run lint`: موفق
- `npm run build`: موفق
- مسیرهای API و صفحات در build شناسایی شدند.
- probe منابع در محیط فعلی برای برخی منابع 403/timeout داشته و برای منابع فاقد credential اجرا نشده است.

این ممیزی وضعیت فعلی را ثبت می کند و هیچ بخش Missing را آماده تولید اعلام نمی کند.

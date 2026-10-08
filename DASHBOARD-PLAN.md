# نقشه داشبورد مدیریتی و آموزشی

## نقشه مسیرها

| مسیر | هدف | وضعیت فعلی |
| --- | --- | --- |
| `/` | رادار سهم و اسکن کامل بازار | موجود؛ اسکن تا اتصال Provider متوقف می‌شود |
| `/dashboard` | نمای کلی بازار، Jobها، منابع و هشدارها | در این مرحله اضافه می‌شود |
| `/data-sources` | پایش سلامت منابع داده | موجود |
| `/analysis-lab` | نمایش Calculation Trace و آموزش فرمول‌ها | قرارداد و صفحه اولیه در این مرحله |
| `/activity` | Log عملیاتی و رخدادهای تحلیل | قرارداد و صفحه اولیه در این مرحله |
| `/settings` | منابع، آستانه‌ها، وزن‌ها و Watchlist | قرارداد و صفحه اولیه در این مرحله |
| `/learning-assistant` | فرهنگ لغت و دستیار آموزشی نسخه بندی شده | در این مرحله اضافه می‌شود |

## اجزای پیشنهادی

- `DashboardShell`: نوار کناری RTL، تم و ناوبری
- `DataHealthCards`: وضعیت منابع و تازگی داده
- `JobControlPanel`: شروع، توقف، ادامه و اجرای مجدد Job
- `LiveProgressMonitor`: پیشرفت بر اساس رویدادهای واقعی Job
- `RankingTable`: رتبه‌بندی فقط با داده معتبر
- `CalculationTraceViewer`: ورودی، فرمول، مراحل و خروجی هر شاخص
- `ActivityLog`: رخدادهای عملیاتی جدا از Calculation Trace
- `SettingsPanel`: تنظیمات نسخه‌بندی‌شده و Watchlist مستقل
- `LearningAssistant`: فرهنگ لغت، توضیح درجا و جستجوی فارسی، انگلیسی و مخفف

## قراردادهای API

### `GET /api/data-sources`

وضعیت هر Connector را همراه `status`, `checkedAt`, `lastSuccessAt`, `freshness`, `coverage`, `errorCount` و `reason` برمی‌گرداند.

### `POST /api/jobs`

```json
{
  "kind": "market|watchlist|symbol",
  "symbol": "اختیاری",
  "configVersion": "شناسه نسخه تنظیمات"
}
```

پاسخ موفق باید `jobId`, `status`, `createdAt` و `configVersion` داشته باشد. تا زمان اتصال storage پایدار، endpoint باید `JOB_STORE_NOT_CONFIGURED` بدهد و Job جعلی نسازد.

### `GET /api/jobs/:jobId`

وضعیت قابل بازیابی Job، شمارنده‌های واقعی، مرحله فعلی، رخداد آخر و خطاهای ثبت‌شده را برمی‌گرداند.

### `POST /api/jobs/:jobId/actions`

عملیات `pause`, `resume`, `retry` و `cancel` را با کنترل همزمانی اجرا می‌کند.

### `GET /api/jobs/:jobId/events`

رخدادهای عملیاتی و Calculation Trace را با cursor برمی‌گرداند. Log عملیاتی و Trace محاسباتی دو نوع جدا هستند.

### `GET /api/analysis/:symbol/:metric`

داده خام، منبع، تاریخ مؤثر، فرمول، مراحل جایگذاری و خروجی ثبت‌شده شاخص را برمی‌گرداند؛ بدون داده معتبر پاسخ تحلیلی تولید نمی‌شود.

## مرز فاز فعلی

رابط و قراردادها بدون عدد آزمایشی ساخته می‌شوند. اجرای واقعی Job، درصد پیشرفت، ذخیره Snapshot و Calculation Trace به storage پایدار و Providerهای تأییدشده نیاز دارد؛ تا آن زمان این بخش‌ها وضعیت شفاف `NOT_CONFIGURED` نمایش می‌دهند.

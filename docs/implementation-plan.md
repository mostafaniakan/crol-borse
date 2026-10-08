# برنامه اجرای مرحله ای

## P0: ایمنی داده و عملیات

1. انتخاب و provision دیتابیس پایدار و object storage.
2. ایجاد schemaهای instruments، raw observations، quality issues، jobs و audit log.
3. اتصال Source Adapter به Bronze و ثبت provenance کامل.
4. پیاده سازی Data Quality Gate با fail-closed و quarantine.
5. افزودن auth، rate limit، redaction لاگ و idempotency برای mutationها.
6. حفظ رفتار فعلی: نبود داده معتبر باید رتبه بندی را متوقف کند.

معیار خروج: هیچ رکورد invalid مستقیما به Silver یا Gold وارد نشود و یک اجرای شکست خورده snapshot معتبر قبلی را تغییر ندهد.

## P1: موتور محاسبات و رتبه بندی

1. Security Master و نگاشت ۵۰ نماد ثابت.
2. normalized observations و financial report versions با publication time.
3. محاسبه مستقل EPS، P/E، رشد، ROE، margin، RSI، MACD، ATR، volatility و drawdown.
4. Factor definitions برای Value، Quality، Profitability، Growth، Momentum، Liquidity و Risk.
5. نرمال سازی cross-sectional و sector-normalized با اطلاعات همان تاریخ.
6. امتیاز و رتبه نسخه بندی شده با Data Coverage و Eligibility Status.
7. Calculation Trace از Source تا Rank.

معیار خروج: برای هر رتبه، داده، نسخه مدل، پوشش، علت پذیرش/رد و اجزای امتیاز قابل بازسازی باشد.

## P2: ریسک و بک تست

1. ریسک نماد، صنعت و سبد.
2. VaR/CVaR، stress و سناریو با برچسب فرضی در نبود سبد واقعی.
3. point-in-time universe، as-of join و publication-time awareness.
4. execution model برای توقف، صف، دامنه نوسان، نقدشوندگی و هزینه.
5. walk-forward، out-of-sample، sensitivity و benchmark.

معیار خروج: نتیجه آزمون بدون look-ahead و survivorship bias قابل بازتولید باشد؛ در غیر این صورت نامعتبر اعلام شود.

## P3: وضعیت بازار و گزارش مدیریتی

1. Regime Detection با وضعیت Uncertain در شواهد ناکافی.
2. داشبورد Top 100، Watchlist 50، Risk Center، Backtest Lab و Audit Reports.
3. گزارش «چرا این رتبه؟» و «آیا می توان به این تحلیل اعتماد کرد؟» با evidence واقعی.

## تست هر مرحله

- lint و build
- unit و property-based tests برای محاسبات
- golden dataset و cross-implementation comparison
- integration با provider mock و پاسخ خطادار
- replay یک snapshot با همان داده و configuration
- تست قطع worker، retry، duplicate job و حفظ snapshot قبلی

## ترتیب انتشار

تا پایان P0 و P1، محصول فقط به عنوان غربالگری آزمایشی و زیرساخت اعتبارسنجی معرفی می شود. عبارت های توصیه قطعی، تضمین بازده و «آماده تصمیم مالی» ممنوع هستند.

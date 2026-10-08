# معماری هدف

## تصمیم معماری

معماری هدف یک Modular Monolith با Worker پس زمینه و دیتابیس پایدار است. این انتخاب با runtime فعلی سازگارتر از بازنویسی کامل به سرویس های جداست و مرزهای ماژول را قبل از هر مهاجرت مشخص می کند.

```text
Frontend (RTL)
  -> API / Auth / Settings
  -> Job Orchestrator
       -> Ingestion Adapters -> Bronze (immutable raw)
       -> Quality Gate -> Silver (normalized)
       -> Feature Engine -> Gold (features)
       -> Scoring / Risk / Regime -> Snapshot
       -> Explainability / Learning / Reports
```

## مرز ماژول ها

- `ingestion`: دریافت، rate limit، parser، provenance و source health
- `instruments`: security master، ISIN، ins_code، alias و تاریخ عضویت universe
- `storage`: raw immutable، normalized observations، snapshots و audit events
- `quality`: schema، واحد، تاریخ، duplicate، anomaly، reconciliation و quarantine
- `features`: نسبت های بنیادی، تکنیکال، جریان پول و شاخص های ریسک
- `scoring`: factor definitions، وزن های نسخه بندی شده، ranking و eligibility
- `regime`: وضعیت بازار با پارامتر و شواهد قابل بازتولید
- `risk`: ریسک نماد، صنعت و سبد
- `backtesting`: point-in-time data، execution model، هزینه و گزارش آزمون
- `verification`: محاسبه مستقل، golden dataset و regression
- `jobs`: job id، checkpoint، cancellation، retry و progress event
- `explainability`: Calculation Trace و پایگاه دانش آموزشی
- `monitoring`: source health، metrics و audit log

## انتخاب ذخیره سازی

در وضعیت فعلی D1 binding وجود ندارد و PostgreSQL نیز به runtime متصل نشده است. برای داده مالی تاریخی، PostgreSQL/TimescaleDB یا PostgreSQL با partition زمانی گزینه هدف است؛ R2/Object Storage برای Bronze immutable و فایل های خام مناسب است. تا زمان انتخاب و provision واقعی، هیچ adapter نباید نتیجه رتبه بندی تولید کند.

## قرارداد لایه ها

- Bronze فقط append-only است و hash منبع و زمان دریافت را نگه می دارد.
- Silver فقط رکوردی است که Data Quality Gate را گذرانده یا با وضعیت quarantine ثبت شده است.
- Gold فقط از Silver معتبر ساخته می شود و مستقیما از HTML یا raw JSON خوانده نمی شود.
- Ranking فقط از Gold و snapshot سازگار استفاده می کند.
- Watchlist در universe مستقل است و وزن یا امتیاز اضافی ندارد.

## شرایط انتشار

```text
No verified source -> no accepted Silver record
No accepted Silver -> no Gold feature
No validated feature -> no score
No complete snapshot -> no published ranking
```

# فرهنگ داده

این سند قرارداد مفهومی داده است؛ تا زمانی که storage پایدار provision نشود، جداول عملیاتی محسوب نمی شود.

| حوزه | فیلدهای پایه | قاعده |
| --- | --- | --- |
| Instrument | instrument_id, ins_code, isin, ticker, name, industry | تغییر نام و کد با alias و تاریخ موثر ثبت می شود. |
| Observation | source_id, source_url, acquisition_method, effective_date, published_at, collected_at | زمان موثر، زمان انتشار و زمان دریافت جدا هستند. |
| Provenance | raw_payload_reference, raw_payload_hash, parser_version, source_version | raw append-only و قابل هش است. |
| Quality | validation_status, validation_errors, validated_at, quarantine_reason | invalid مستقیما وارد Gold نمی شود. |
| Financial | period_end, statement_type, consolidated, unit, currency, revision_id | اصلی/تلفیقی و اصلاحیه جدا نگه داشته می شوند. |
| Market | session_date, open, high, low, close, last, volume, value, trade_count | توقف، عدم معامله و corporate action صریح ثبت می شوند. |
| Feature | feature_name, value, formula_version, as_of_date, coverage | فقط از Silver معتبر ساخته می شود. |
| Score | factor, component_score, weight, model_version, eligibility | Watchlist امتیاز اضافی ایجاد نمی کند. |

# پروتکل بک تست

بک تست تا زمان وجود Point-in-Time Data و Historical Universe معتبر قابل اجرا نیست.

حداقل الزامات: as-of join، زمان انتشار گزارش، corporate action، نماد حذف شده، توقف، صف، دامنه نوسان، هزینه، نقدشوندگی، روزهای بدون معامله، ورود در جلسه بعدی و snapshot نسخه بندی شده.

آزمون باید chronological train/validation/test، walk-forward، out-of-sample، حساسیت هزینه و benchmark سازگار داشته باشد. اگر دسترس پذیری تاریخی داده اثبات نشود، بازه باید حذف یا با محدودیت صریح گزارش شود.

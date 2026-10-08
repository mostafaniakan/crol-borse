export type LearningCategory = "fundamental" | "technical" | "risk" | "market" | "data" | "statistics";

export type LearningSource = {
  title: string;
  url: string;
};

export type LearningExample = {
  label: "فرضی" | "واقعی";
  setup: string;
  steps: string[];
  result: string;
};

export type LearningTerm = {
  id: string;
  faName: string;
  enName: string;
  aliases: string[];
  category: LearningCategory;
  beginner: string;
  advanced: string;
  formula?: string;
  example: LearningExample;
  interpretation: string[];
  limitations: string[];
  rankingImpact: string;
  sources: LearningSource[];
};

export const KNOWLEDGE_BASE_VERSION = "2026.10.08.1";

export const LEARNING_TERMS: LearningTerm[] = [
  {
    id: "score",
    faName: "امتیاز",
    enName: "Score",
    aliases: ["امتیاز کل", "امتیاز سهم", "Total Score"],
    category: "market",
    beginner: "امتیاز یک عدد خلاصه برای مقایسه سهم هاست. این عدد به تنهایی معنی خرید یا سود قطعی ندارد.",
    advanced: "امتیاز باید خروجی نسخه مشخصی از مدل باشد و از زیرامتیازهای نرمال شده با وزن های ثبت شده ساخته شود.",
    formula: "Total Score = 0.30 × Fundamental + 0.25 × Technical + 0.20 × Liquidity + 0.10 × Money Flow + 0.15 × Risk Quality",
    example: { label: "فرضی", setup: "فرض کنید زیرامتیازها به ترتیب 80، 60، 70، 50 و 75 باشند.", steps: ["0.30 × 80 = 24", "0.25 × 60 = 15", "0.20 × 70 = 14", "0.10 × 50 = 5", "0.15 × 75 = 11.25"], result: "امتیاز کل = 69.25 از 100" },
    interpretation: ["امتیاز بالاتر یعنی شرایط اندازه گیری شده بهتر است.", "مقایسه فقط میان نمادهایی معتبر است که پوشش داده و مدل یکسان دارند."],
    limitations: ["وزن ها فرضیه مدل هستند و بدون بک تست بهینه محسوب نمی شوند.", "داده ناقص نباید خودکار صفر شود یا با حدس جایگزین شود."],
    rankingImpact: "امتیاز کل مبنای رتبه بندی بازار است، اما نماد با داده ناکافی باید از رتبه بندی معتبر خارج شود.",
    sources: [{ title: "CFA Institute: Model Validation", url: "https://www.cfainstitute.org/" }],
  },
  {
    id: "eps",
    faName: "سود هر سهم",
    enName: "Earnings Per Share (EPS)",
    aliases: ["EPS", "سود هر سهم"],
    category: "fundamental",
    beginner: "EPS نشان می دهد شرکت در یک دوره برای هر سهم چقدر سود ساخته است.",
    advanced: "EPS سود قابل انتساب به سهامداران عادی تقسیم بر میانگین موزون تعداد سهام عادی در دوره است. EPS اصلی و تلفیقی باید جدا بمانند.",
    formula: "EPS = سود قابل انتساب به سهامداران عادی ÷ میانگین موزون تعداد سهام",
    example: { label: "فرضی", setup: "سود قابل انتساب 120 میلیارد ریال و میانگین سهام 60 میلیون سهم است.", steps: ["120,000,000,000 ÷ 60,000,000", "نتیجه = 2,000 ریال برای هر سهم"], result: "EPS = 2,000 ریال" },
    interpretation: ["EPS مثبت و رو به رشد می تواند نشانه بهبود سودآوری باشد.", "EPS منفی یا غیر عادی باید جداگانه در مدل علامت گذاری شود."],
    limitations: ["سود حسابداری لزوما جریان نقد نیست.", "افزایش سرمایه، سود غیر عملیاتی و تفاوت اصلی و تلفیقی می تواند مقایسه را تغییر دهد."],
    rankingImpact: "EPS در امتیاز بنیادی و محاسبه P/E استفاده می شود، اما فقط با دوره مالی و تاریخ انتشار معتبر.",
    sources: [{ title: "Investor.gov: Earnings Per Share", url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/earnings-share-eps" }],
  },
  {
    id: "pe",
    faName: "نسبت قیمت به سود",
    enName: "Price to Earnings Ratio (P/E)",
    aliases: ["P/E", "پی بر ای", "نسبت قیمت به سود"],
    category: "fundamental",
    beginner: "P/E نشان می دهد قیمت سهم چند برابر سود سالانه هر سهم است.",
    advanced: "P/E از تقسیم قیمت مبنا بر EPS هم دوره به دست می آید. EPS صفر، منفی، قدیمی یا غیر عادی نباید به P/E مطلوب تبدیل شود.",
    formula: "P/E = قیمت سهم ÷ EPS",
    example: { label: "فرضی", setup: "قیمت سهم 20,000 ریال و EPS معتبر 2,000 ریال است.", steps: ["20,000 ÷ 2,000", "نتیجه = 10"], result: "P/E = 10 واحد" },
    interpretation: ["P/E پایین تر همیشه به معنی ارزندگی نیست و ممکن است ریسک یا افت سود را نشان دهد.", "مقایسه باید با شرکت های هم صنعت و دوره مشابه انجام شود."],
    limitations: ["برای EPS منفی تعریف اقتصادی قابل اتکا ندارد.", "تفاوت سود اصلی و تلفیقی یا سود یکباره می تواند نتیجه را گمراه کند."],
    rankingImpact: "P/E بخشی از جذابیت ارزش گذاری در امتیاز بنیادی است و بدون EPS معتبر وارد امتیاز قطعی نمی شود.",
    sources: [{ title: "Investor.gov: Price Earnings Ratio", url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/price-earnings-ratio-pe" }],
  },
  {
    id: "sales-growth",
    faName: "رشد فروش",
    enName: "Revenue Growth",
    aliases: ["رشد درآمد", "Sales Growth", "Revenue"],
    category: "fundamental",
    beginner: "رشد فروش تغییر مقدار فروش شرکت نسبت به دوره قبل است.",
    advanced: "رشد فروش باید با دوره همسان، اثر تورم، تغییر نرخ فروش و مقدار فروش بررسی شود؛ رشد اسمی به تنهایی رشد واقعی نیست.",
    formula: "رشد فروش = (فروش دوره جدید - فروش دوره قبل) ÷ فروش دوره قبل × 100",
    example: { label: "فرضی", setup: "فروش از 100 به 125 میلیارد ریال رسیده است.", steps: ["125 - 100 = 25", "25 ÷ 100 × 100 = 25٪"], result: "رشد فروش = 25 درصد" },
    interpretation: ["رشد پایدار همراه با حاشیه سود و جریان نقد بهتر کیفیت بیشتری دارد.", "رشد ناشی از افزایش قیمت با رشد مقداری یکسان نیست."],
    limitations: ["تورم و تغییر ترکیب محصول می تواند رشد را بزرگ نمایی کند.", "دوره های فصلی باید با دوره مشابه مقایسه شوند."],
    rankingImpact: "رشد فروش یکی از ورودی های امتیاز بنیادی است و پوشش زمانی آن باید ثبت شود.",
    sources: [{ title: "CFA Institute: Financial Statement Analysis", url: "https://www.cfainstitute.org/insights/professional-learning/refresher-readings/financial-statement-analysis" }],
  },
  {
    id: "operating-cash-flow",
    faName: "جریان نقد عملیاتی",
    enName: "Operating Cash Flow (OCF)",
    aliases: ["OCF", "جریان نقد عملیات", "کیفیت سود"],
    category: "fundamental",
    beginner: "جریان نقد عملیاتی پولی است که فعالیت اصلی شرکت واقعا ایجاد یا مصرف کرده است.",
    advanced: "OCF از بخش عملیات صورت جریان وجوه نقد می آید و برای بررسی تبدیل سود حسابداری به نقد استفاده می شود.",
    formula: "کیفیت ساده سود = جریان نقد عملیاتی ÷ سود خالص",
    example: { label: "فرضی", setup: "جریان نقد عملیاتی 90 و سود خالص 100 میلیارد ریال است.", steps: ["90 ÷ 100 = 0.90", "0.90 × 100 = 90٪"], result: "نسبت تبدیل سود به نقد = 90 درصد" },
    interpretation: ["نسبت نزدیک یا بالاتر از 100 درصد در چند دوره می تواند نشانه تبدیل خوب سود به نقد باشد.", "یک دوره پایین به تنهایی نتیجه قطعی نیست."],
    limitations: ["سرمایه در گردش، وصول مطالبات و پرداخت های زمان بندی شده اثر زیادی دارند.", "همبستگی با سود علت و معلول قطعی را ثابت نمی کند."],
    rankingImpact: "کیفیت جریان نقد در امتیاز بنیادی و Risk Quality اثر می گذارد.",
    sources: [{ title: "CFA Institute: Cash Flow Analysis", url: "https://www.cfainstitute.org/insights/professional-learning/refresher-readings/analysis-of-financial-statements" }],
  },
  {
    id: "liquidity",
    faName: "نقدشوندگی",
    enName: "Liquidity",
    aliases: ["ارزش معاملات", "Liquidity Score", "قابلیت معامله"],
    category: "market",
    beginner: "نقدشوندگی یعنی بتوان سهم را با سرعت بیشتر و هزینه کمتر خرید یا فروخت.",
    advanced: "نقدشوندگی باید با میانه ارزش معاملات، حجم، روزهای بدون معامله، شناوری و ریسک صف سنجیده شود؛ حجم به تنهایی کافی نیست.",
    formula: "میانه ارزش معاملات 20 جلسه = median(value_t-19 ... value_t)",
    example: { label: "فرضی", setup: "ارزش معاملات پنج جلسه 10، 12، 7، 20 و 15 میلیارد ریال است.", steps: ["مرتب سازی: 7، 10، 12، 15، 20", "عدد میانی = 12"], result: "میانه ارزش معاملات = 12 میلیارد ریال" },
    interpretation: ["میانه بالاتر معمولا خروج از موقعیت را آسان تر می کند.", "نقدشوندگی پایین ریسک اجرای سفارش و خروج را زیاد می کند."],
    limitations: ["ارزش معاملات یک روز پرحجم می تواند میانگین را گمراه کند.", "توقف نماد و صف خرید یا فروش باید جداگانه ثبت شود."],
    rankingImpact: "نقدشوندگی 20 درصد وزن مدل پایه را دارد، اما داده ناکافی باید باعث حذف از رتبه بندی معتبر شود.",
    sources: [{ title: "CFA Institute: Market Liquidity", url: "https://www.cfainstitute.org/insights/articles/2019/market-liquidity" }],
  },
  {
    id: "rsi",
    faName: "شاخص قدرت نسبی",
    enName: "Relative Strength Index (RSI)",
    aliases: ["RSI", "قدرت نسبی", "RSI14"],
    category: "technical",
    beginner: "RSI سرعت و اندازه تغییرات اخیر قیمت را بین صفر و صد خلاصه می کند.",
    advanced: "RSI کلاسیک با میانگین هموار شده سود و زیان در معمولا 14 دوره محاسبه می شود: RSI = 100 - 100 ÷ (1 + RS)، و RS نسبت میانگین سود به میانگین زیان است.",
    formula: "RS = Average Gain ÷ Average Loss؛ RSI = 100 - 100 ÷ (1 + RS)",
    example: { label: "فرضی", setup: "میانگین سود 4 و میانگین زیان 2 در 14 جلسه است.", steps: ["RS = 4 ÷ 2 = 2", "RSI = 100 - 100 ÷ 3", "RSI = 66.67"], result: "RSI تقریبا 66.7 است" },
    interpretation: ["مقادیر بالاتر از 70 در برخی روش ها ناحیه داغ و پایین تر از 30 ناحیه ضعیف تلقی می شود.", "در روند قوی RSI می تواند مدت زیادی در ناحیه بالا یا پایین بماند."],
    limitations: ["RSI به تنهایی زمان برگشت قیمت را تضمین نمی کند.", "انتخاب تعداد دوره و روش اولیه سازی روی مقدار اثر دارد."],
    rankingImpact: "RSI در بخش تکنیکال و مومنتوم استفاده می شود و فقط با تاریخچه کافی و قیمت تعدیل شده معتبر است.",
    sources: [{ title: "Fidelity: Relative Strength Index", url: "https://www.fidelity.com/learning-center/trading-investing/technical-analysis/technical-indicator-guide/RSI" }],
  },
  {
    id: "sma",
    faName: "میانگین متحرک ساده",
    enName: "Simple Moving Average (SMA)",
    aliases: ["SMA20", "SMA50", "SMA200", "میانگین متحرک"],
    category: "technical",
    beginner: "SMA میانگین قیمت در تعداد مشخصی از دوره های اخیر است.",
    advanced: "SMA_n برابر مجموع قیمت های انتخاب شده تقسیم بر n است و به همه دوره ها وزن یکسان می دهد.",
    formula: "SMA_n = (P1 + P2 + ... + Pn) ÷ n",
    example: { label: "فرضی", setup: "قیمت پایانی سه جلسه 100، 110 و 120 است.", steps: ["100 + 110 + 120 = 330", "330 ÷ 3 = 110"], result: "SMA3 = 110" },
    interpretation: ["قیمت بالاتر از SMA می تواند قدرت روند را نشان دهد، اما سیگنال قطعی نیست.", "SMA بلندتر واکنش کندتر و نویز کمتر دارد."],
    limitations: ["شاخص ذاتا با تاخیر حرکت می کند.", "قیمت های تعدیل نشده در حضور افزایش سرمایه می توانند نتیجه را خراب کنند."],
    rankingImpact: "SMAها بخشی از ویژگی های روند در امتیاز تکنیکال هستند.",
    sources: [{ title: "CFA Institute: Technical Analysis", url: "https://www.cfainstitute.org/insights/articles/2023/technical-analysis" }],
  },
  {
    id: "volatility",
    faName: "نوسان پذیری",
    enName: "Volatility",
    aliases: ["Historical Volatility", "نوسان تاریخی", "ریسک نوسان"],
    category: "risk",
    beginner: "نوسان پذیری اندازه تغییرات قیمت است؛ تغییرات بزرگ تر یعنی عدم قطعیت بیشتر.",
    advanced: "نوسان تاریخی معمولا انحراف معیار بازده های دوره ای است و برای سالانه سازی باید فرض دوره های معاملاتی ثبت شود.",
    formula: "σ = sqrt(Σ(r_i - mean(r))² ÷ (n - 1))",
    example: { label: "فرضی", setup: "سه بازده روزانه 1٪، 2٪ و 3٪ با میانگین 2٪ داریم.", steps: ["فاصله ها: -1٪، 0٪، 1٪", "واریانس نمونه = (1 + 0 + 1) ÷ 2 = 1", "انحراف معیار = 1٪"], result: "نوسان نمونه روزانه = 1 درصد" },
    interpretation: ["نوسان بالاتر یعنی دامنه نتیجه های ممکن بیشتر است.", "نوسان پایین تر به معنی نبود ریسک بنیادی یا نقدشوندگی نیست."],
    limitations: ["نوسان گذشته تضمین نوسان آینده نیست.", "دوره اندازه گیری و رخدادهای غیر عادی نتیجه را تغییر می دهند."],
    rankingImpact: "نوسان در بخش Risk Quality اثر کاهنده دارد و باید همراه Drawdown و نقدشوندگی دیده شود.",
    sources: [{ title: "CFA Institute: Volatility", url: "https://www.cfainstitute.org/insights/articles/2020/volatility" }],
  },
  {
    id: "drawdown",
    faName: "افت از قله",
    enName: "Maximum Drawdown",
    aliases: ["Drawdown", "حداکثر افت سرمایه", "افت تاریخی"],
    category: "risk",
    beginner: "Drawdown نشان می دهد قیمت یا ارزش سبد از یک قله تا کف بعدی چقدر افت کرده است.",
    advanced: "حداکثر Drawdown کمترین نسبت (ارزش فعلی - قله قبلی) به قله قبلی در بازه مورد بررسی است.",
    formula: "Drawdown = (Current Value - Previous Peak) ÷ Previous Peak × 100",
    example: { label: "فرضی", setup: "ارزش سبد از 100 به 75 رسیده است.", steps: ["75 - 100 = -25", "-25 ÷ 100 × 100 = -25٪"], result: "افت از قله = منفی 25 درصد" },
    interpretation: ["افت منفی بزرگ تر، ریسک تجربه زیان و زمان جبران بیشتر را نشان می دهد.", "بازه زمانی باید همراه مقدار گزارش شود."],
    limitations: ["به ترتیب زمانی داده حساس است و به تنهایی احتمال زیان آینده را پیش بینی نمی کند.", "قیمت تعدیل نشده می تواند افت ساختگی ایجاد کند."],
    rankingImpact: "Drawdown در امتیاز ریسک وارد می شود و امتیاز ریسک کمتر به معنی کیفیت بالاتر است.",
    sources: [{ title: "CFA Institute: Risk and Return", url: "https://www.cfainstitute.org/insights/professional-learning/refresher-readings/risk-return" }],
  },
  {
    id: "data-coverage",
    faName: "پوشش داده",
    enName: "Data Coverage",
    aliases: ["پوشش اطلاعات", "Coverage Score", "کفایت داده"],
    category: "data",
    beginner: "پوشش داده می گوید چه مقدار از اطلاعات لازم برای تحلیل واقعا موجود و معتبر است.",
    advanced: "پوشش باید بر اساس فیلدهای مورد نیاز، دوره زمانی، منبع، تازگی و وضعیت اعتبار محاسبه شود؛ تعداد رکورد خام به تنهایی کافی نیست.",
    formula: "Coverage = تعداد فیلدهای معتبر موجود ÷ تعداد فیلدهای لازم × 100",
    example: { label: "فرضی", setup: "از 10 فیلد لازم، 8 فیلد معتبر و تازه است.", steps: ["8 ÷ 10 = 0.8", "0.8 × 100 = 80٪"], result: "پوشش داده = 80 درصد" },
    interpretation: ["پوشش بالاتر امکان محاسبه شاخص های بیشتری را می دهد.", "پوشش پایین باید باعث برچسب مشروط یا حذف از رتبه بندی شود."],
    limitations: ["وجود فیلد به معنی درست بودن آن نیست.", "پوشش منابع مختلف را نباید بدون کنترل همپوشانی جمع کرد."],
    rankingImpact: "پوشش داده دروازه انتشار رتبه است و می تواند نماد را از رتبه بندی جامع خارج کند.",
    sources: [{ title: "FRED API Documentation", url: "https://fred.stlouisfed.org/docs/api/fred/" }],
  },
  {
    id: "market-share",
    faName: "سهم بازار",
    enName: "Market Share",
    aliases: ["سهم بازار دسته", "Market Share"],
    category: "market",
    beginner: "سهم بازار نشان می دهد یک شرکت چه بخشی از فروش یا مقدار بازار مربوط به خود را در اختیار دارد.",
    advanced: "سهم بازار باید با تعریف روشن بازار، دوره، واحد فروش و جامعه شرکت های قابل مقایسه محاسبه شود.",
    formula: "Market Share = فروش شرکت ÷ فروش کل بازار تعریف شده × 100",
    example: { label: "فرضی", setup: "فروش شرکت 30 و فروش بازار تعریف شده 200 میلیارد ریال است.", steps: ["30 ÷ 200 = 0.15", "0.15 × 100 = 15٪"], result: "سهم بازار = 15 درصد" },
    interpretation: ["سهم بالاتر می تواند قدرت رقابتی یا اندازه بزرگ تر را نشان دهد.", "رشد سهم بازار مهم تر از مقدار یک دوره است."],
    limitations: ["اگر اندازه کل بازار دقیق نباشد، سهم بازار هم معتبر نیست.", "سهم بازار بالا تضمین حاشیه سود یا بازده سهم نیست."],
    rankingImpact: "سهم بازار یکی از ویژگی های بنیادی و زمینه ای است و باید فقط در صنعت مرتبط مقایسه شود.",
    sources: [{ title: "CFA Institute: Industry Analysis", url: "https://www.cfainstitute.org/insights/professional-learning/refresher-readings/industry-analysis" }],
  },
  {
    id: "valuation",
    faName: "ارزش گذاری",
    enName: "Valuation",
    aliases: ["جذابیت ارزش گذاری", "Valuation Score"],
    category: "fundamental",
    beginner: "ارزش گذاری یعنی مقایسه قیمت فعلی با برآورد ارزش یا سودآوری شرکت.",
    advanced: "ارزش گذاری مجموعه ای از روش ها مانند P/E، جریان نقد تنزیل شده و مقایسه با هم صنعت است؛ خروجی به فرضیات حساس است.",
    formula: "در این نسخه فرمول واحد ندارد؛ روش، دوره و فرضیات باید همراه نتیجه ثبت شوند.",
    example: { label: "فرضی", setup: "P/E شرکت 8 و میانه P/E صنعت 12 است.", steps: ["8 ÷ 12 = 0.667", "P/E شرکت حدود 33 درصد پایین تر از میانه صنعت است"], result: "جذابیت نسبی فقط یک نشانه است، نه حکم ارزندگی" },
    interpretation: ["ارزش گذاری پایین می تواند فرصت یا نشانه ریسک و افت سود باشد.", "مقایسه هم صنعت و هم دوره ضروری است."],
    limitations: ["فرضیات سود و نرخ تنزیل نتیجه را تغییر می دهند.", "یک نسبت نباید کل تصمیم را تعیین کند."],
    rankingImpact: "جذابیت ارزش گذاری در امتیاز بنیادی قرار می گیرد و با کیفیت سود و ریسک ترکیب می شود.",
    sources: [{ title: "CFA Institute: Equity Valuation", url: "https://www.cfainstitute.org/insights/professional-learning/refresher-readings/equity-valuation-applications-and-processes" }],
  },
  {
    id: "risk-quality",
    faName: "کیفیت ریسک",
    enName: "Risk Quality Score",
    aliases: ["ریسک اصلی", "Risk Quality", "امتیاز ریسک"],
    category: "risk",
    beginner: "کیفیت ریسک نشان می دهد سهم با توجه به ریسک های اندازه گیری شده چقدر شرایط قابل کنترل تری دارد.",
    advanced: "در مدل پایه، Risk Quality Score جهت معکوس ریسک است؛ نوسان، Drawdown، نقدشوندگی و کیفیت داده با وزن های ثبت شده ترکیب می شوند.",
    formula: "Risk Quality = 100 - نمره ریسک نرمال شده",
    example: { label: "فرضی", setup: "نمره ریسک نرمال شده 35 از 100 است.", steps: ["100 - 35 = 65"], result: "کیفیت ریسک = 65 از 100" },
    interpretation: ["عدد بالاتر یعنی ریسک اندازه گیری شده کمتر است.", "ریسک ناشناخته با عدد بالا پوشانده نمی شود."],
    limitations: ["ریسک های سیاسی، عملیاتی و داده ای ممکن است کامل اندازه گیری نشوند.", "وزن ها و نرمال سازی باید نسخه بندی شوند."],
    rankingImpact: "این امتیاز 15 درصد مدل پایه را تشکیل می دهد و به معنی تضمین امنیت یا سود نیست.",
    sources: [{ title: "CFA Institute: Risk and Return", url: "https://www.cfainstitute.org/insights/professional-learning/refresher-readings/risk-return" }],
  },
  {
    id: "confidence",
    faName: "سطح اطمینان",
    enName: "Confidence Level",
    aliases: ["اطمینان تحلیلی", "Confidence"],
    category: "data",
    beginner: "سطح اطمینان می گوید نتیجه چقدر بر داده کامل، تازه و سازگار تکیه دارد.",
    advanced: "این مقدار نباید احتمال سود تلقی شود؛ باید از پوشش داده، توافق منابع، تازگی و اعتبار محاسبات مشتق شود.",
    formula: "فرمول ثابت ندارد؛ روش ترکیب مولفه ها باید در نسخه مدل ثبت شود.",
    example: { label: "فرضی", setup: "پوشش 90 درصد، توافق منابع 80 درصد و تازگی 100 درصد است.", steps: ["میانگین ساده = (90 + 80 + 100) ÷ 3", "نتیجه = 90"], result: "اطمینان داده ای فرضی = 90 از 100، نه احتمال سود" },
    interpretation: ["سطح بالا یعنی مبنای داده ای بهتر است.", "سطح پایین باید توضیح محدودیت را همراه نتیجه نشان دهد."],
    limitations: ["اعتماد داده با اعتماد به آینده قیمت فرق دارد.", "میانگین ساده همیشه روش مناسب نیست و نباید بدون مستندات استفاده شود."],
    rankingImpact: "سطح اطمینان برای پذیرش یا حذف نماد از رتبه بندی استفاده می شود و امتیاز اضافی نیست.",
    sources: [{ title: "FRED API Documentation", url: "https://fred.stlouisfed.org/docs/api/fred/" }],
  },
  {
    id: "data-freshness",
    faName: "تازگی داده",
    enName: "Data Freshness",
    aliases: ["Stale Data", "داده قدیمی", "زمان آخرین دریافت"],
    category: "data",
    beginner: "تازگی داده فاصله زمانی بین زمان دریافت و زمان تحلیل را نشان می دهد.",
    advanced: "داده باید با زمان موثر بازار، زمان انتشار گزارش و timestamp دریافت مقایسه شود؛ داده قدیمی نباید تحلیل لحظه ای تلقی شود.",
    formula: "Data Age = Analysis Time - Effective Time",
    example: { label: "فرضی", setup: "تحلیل ساعت 12 انجام شده و آخرین داده ساعت 10 دریافت شده است.", steps: ["12:00 - 10:00 = 2 ساعت", "سن داده = 2 ساعت"], result: "تازگی باید با آستانه منبع و نوع شاخص سنجیده شود." },
    interpretation: ["سن کمتر معمولا برای داده لحظه ای مناسب تر است.", "گزارش مالی ماهانه با داده معاملات لحظه ای آستانه یکسان ندارد."],
    limitations: ["تازه بودن داده خطای محتوایی را حذف نمی کند.", "زمان موثر و زمان انتشار ممکن است متفاوت باشند."],
    rankingImpact: "داده قدیمی می تواند امتیاز را مشروط کند یا جلوی انتشار رتبه را بگیرد.",
    sources: [{ title: "FRED Real-Time Periods", url: "https://fred.stlouisfed.org/docs/api/fred/realtime_periods.html" }],
  },
  {
    id: "calculation-trace",
    faName: "ردیابی محاسبات",
    enName: "Calculation Trace",
    aliases: ["مسیر محاسبه", "ردیابی تحلیل", "Trace"],
    category: "data",
    beginner: "ردیابی محاسبات نشان می دهد یک عدد تحلیلی دقیقا از کدام منبع و چه مراحلی ساخته شده است.",
    advanced: "Calculation Trace باید شناسه منبع، داده خام، نسخه اعتبارسنجی، فرمول، پارامترها، نسخه مدل و خروجی نهایی را به صورت تغییرناپذیر ثبت کند.",
    formula: "Source → Raw Data → Validation → Calculation → Score → Ranking → Explanation",
    example: { label: "فرضی", setup: "برای EPS یک نماد، گزارش کدال، دوره مالی و نسخه محاسبه ثبت شده است.", steps: ["دریافت گزارش و ذخیره شناسه سند", "اعتبارسنجی دوره و واحد پول", "محاسبه EPS با نسخه مدل 1.0", "اتصال خروجی به امتیاز و رتبه"], result: "هر عدد قابل بازسازی و بررسی است" },
    interpretation: ["ردیابی کامل یعنی کاربر می تواند علت یک امتیاز را دنبال کند.", "نبود ردیابی باید نتیجه را مشروط یا غیر قابل انتشار کند."],
    limitations: ["ردیابی کامل صحت منبع اولیه را به تنهایی تضمین نمی کند.", "تغییرات منبع یا مدل باید با نسخه جدید ثبت شوند."],
    rankingImpact: "رتبه فقط زمانی معتبر است که مسیر Source تا Ranking برای شاخص های موثر ثبت شده باشد.",
    sources: [{ title: "NIST: Data Integrity and Provenance", url: "https://www.nist.gov/programs-projects/data-provenance" }],
  },
  {
    id: "data-quality-gate",
    faName: "دروازه کیفیت داده",
    enName: "Data Quality Gate",
    aliases: ["گیت کیفیت داده", "کیفیت داده", "Quality Gate"],
    category: "data",
    beginner: "دروازه کیفیت داده بررسی می کند آیا اطلاعات برای محاسبه و انتشار رتبه کافی و معتبر است یا نه.",
    advanced: "این دروازه باید کامل بودن، تازگی، سازگاری واحدها، توافق منابع، دوره مالی و خطاهای اعتبارسنجی را با آستانه نسخه بندی شده کنترل کند.",
    formula: "Publish = Coverage ≥ threshold AND Freshness = valid AND Validation = passed",
    example: { label: "فرضی", setup: "پوشش 95 درصد، داده تازه و اعتبارسنجی موفق است و آستانه پوشش 90 درصد تعیین شده است.", steps: ["95 ≥ 90 برقرار است", "تازگی معتبر است", "اعتبارسنجی موفق است"], result: "نماد از دروازه کیفیت عبور می کند" },
    interpretation: ["عبور یعنی داده برای همان کاربرد مشخص قابل استفاده است.", "عبور از دروازه به معنی پیش بینی سود یا نبود ریسک نیست."],
    limitations: ["آستانه ها به نوع شاخص و حساسیت کاربرد وابسته اند.", "کیفیت داده منبع اولیه باید جداگانه پایش شود."],
    rankingImpact: "بدون عبور از دروازه کیفیت، نماد نباید رتبه قطعی 100 سهم دریافت کند.",
    sources: [{ title: "NIST: Data Quality", url: "https://www.nist.gov/itl/iad/mig/data-quality" }],
  },
];

export function findLearningTerms(query: string, category?: LearningCategory) {
  const normalized = query.trim().toLocaleLowerCase("fa");
  return LEARNING_TERMS.filter((term) => {
    const matchesCategory = !category || term.category === category;
    const haystack = [term.faName, term.enName, ...term.aliases].join(" ").toLocaleLowerCase("fa");
    return matchesCategory && (!normalized || haystack.includes(normalized));
  });
}

export function getLearningTerm(id: string) {
  return LEARNING_TERMS.find((term) => term.id === id);
}

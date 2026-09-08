// Comprehensive Multi-language Translation Dictionary (fa, en, ar, tr)
// Vista Industrial Truth Platform - Developed by Vista Intelligent Network

export type SupportedLanguage = 'fa' | 'en' | 'ar' | 'tr';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'rtl' | 'ltr';
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', dir: 'rtl' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  fa: {
    // Brand & Identity
    brand_title: 'ویستا حقیقت صنعتی',
    brand_sub: 'شبکه هوشمند ابتکار ویستا • پارک علم و فناوری',
    version_badge: 'نسخه بومی ۴.۰',
    reg_number: 'شماره ثبت رسمی: ۵۸۳۳۰۲',

    // Navigation & Routes
    nav_home: 'صفحه اصلی و معرفی پروژه',
    nav_architecture: 'معماری ۱۱ لایه و غول‌های فناوری',
    nav_twin: 'دوقلوی دیجیتال ۳ بعدی',
    nav_didban: 'ویستا-دیدبان (واقعیت مشترک)',
    nav_pasdar: 'ویستا-پاسدار (پایش ریسک و حریم)',
    nav_nazmgar: 'ویستا-نظم‌گر (انطباق با برنامه)',
    nav_hafeze: 'ویستا-حافظه (گراف بافتار سازمانی)',
    nav_vibration: 'طیف‌سنج ارتعاشات و ایزو ۱۰۸۱۶',
    nav_what_if: 'شبیه‌ساز سناریوهای چه-اگر',
    nav_truth_block: 'اکسپلورر بلوک حقیقت و هش',
    nav_contracts: 'پروپوزال و قرارداد رسمی',
    nav_guide: 'راهنمای متدولوژی و استانداردها',
    nav_login: 'ورود به سامانه و نقش‌ها',
    nav_dashboard: 'ورود به داشبورد صنعتی',
    nav_overview: 'معرفی کلی پلتفرم',

    // Landing Page Hero
    hero_badge: 'سند مرجع معماری پلتفرم حقیقت صنعتی ویستا • شهریور ۱۴۰۵',
    hero_title_1: 'حقیقت صنعتی تغییرناپذیر،',
    hero_title_2: 'دوقلوی دیجیتال سه‌بعدی و سه‌گانه تصمیم',
    hero_desc: 'معماری مرجع بومی، تحریم‌ناپذیر و مستقر در سایت (On-Premise) جهت پایش سلامت دارایی‌های دوار، ممیزی زنجیره شواهد سنسوری، شبیه‌سازی سناریوهای چه-اگر و خودکارسازی فرامین نگهداری و تعمیرات در صنایع سنگین کشور.',
    hero_cta_login: 'ورود به پلتفرم و مشاهده نقش‌ها',
    hero_cta_twin: 'مشاهده دوقلوی ۳بعدی (Three.js)',
    hero_cta_explore: 'مشاهده جریان حقیقت فیزیکی',

    // Metrics Banner
    stat_assets: 'تجهیزات صنعتی تحت پایش برخط',
    stat_latency: 'تأخیر همگام‌سازی زمان PTP',
    stat_compliance: 'انطباق با استانداردهای ISO / IEC',
    stat_sanctions: 'ریسک تحریم و وابستگی ابری خارجی',

    // Evidence Chain
    evidence_heading: 'جریان سرتاسری حقیقت فیزیکی: از ارتعاش خام تا تصمیم اثبات‌پذیر',
    evidence_sub: 'در صنعت واقعی، داده تنها در صورتی ارزش حقوقی و مهندسی دارد که زنجیره اصالت، کالیبراسیون و هویت حسگر غیرقابل جعل باشد.',
    step1_title: '۱. حسگر فیزیکی و امضای سخت‌افزاری',
    step1_desc: 'شتاب‌سنج و ترموکوپل با امضای کریپتوگرافیک و گواهی کالیبراسیون فعال در لایه ۰ پردو.',
    step2_title: '۲. گره لبه و همگام‌سازی زمانی',
    step2_desc: 'دریافت تله‌متری، برچسب زمانی دقیق IEEE 1588 PTP زیر ۱۰ میلی‌ثانیه و فشرده‌سازی لبه.',
    step3_title: '۳. بلوک حقیقت و زنجیره ضدجعل',
    step3_desc: 'محاسبه هش رمزنگاری SHA-256 و تشکیل بلوک غیرقابل تغییر حقیقت قبل از ارسال به ابر یا سرور.',
    step4_title: '۴. دوقلوی سه‌بعدی و شبیه‌سازی',
    step4_desc: 'نگاشت بردار ارتعاشی بر مدل هندسی سه‌بعدی، تخمین عمر باقیمانده (RUL) و تحلیل چه-اگر.',
    step5_title: '۵. سه‌گانه تصمیم و فرمان خودکار',
    step5_desc: 'داوری میان دیدبان (واقعیت)، پاسدار (ایمنی) و نظم‌گر (برنامه) و صدور دستور کار CMMS.',

    // Triad Modules
    triad_heading: 'سه‌گانه تصمیم‌گیری پلتفرم ویستا (The Vista Decision Triad)',
    triad_sub: 'تفکیک شفاف مسئولیت‌ها میان واقعیت فیزیکی، موازین ایمنی و برنامه‌ریزی تولید.',
    didban_title: 'ویستا-دیدبان (Vista-Didban)',
    didban_role: 'موتور واقعیت مشترک و حقیقت فیزیکی',
    didban_desc: 'پایش بدون فیلتر ارتعاشات، دور موتور و دما، نگاشت بر استاندارد ISO 10816 و حذف خطای انسانی.',
    pasdar_title: 'ویستا-پاسدار (Vista-Pasdar)',
    pasdar_role: 'پایشگر حریم‌های ایمنی، حفاظت و HSE',
    pasdar_desc: 'نظارت دائم بر خطوط قرمز تجهیزات، اعمال فرامین خاموشی اضطراری و جلوگیری از فجایع صنعتی.',
    nazmgar_title: 'ویستا-نظم‌گر (Vista-Nazmgar)',
    nazmgar_role: 'تنظیم‌کننده توازن بار و انطباق با برنامه',
    nazmgar_desc: 'بهینه‌سازی برنامه تعمیرات با توجه به پیک شبکه برق و تعهدات قراردادی تولید صنعتی.',

    // Leadership
    leadership_heading: 'مدیریت ارشد و راهبری فنی پروژه',
    leadership_sub: 'شرکت شبکه هوشمند ابتکار ویستا • مستقر در پارک علم و فناوری',
    pm_title: 'مدیر ارشد پروژه (Project Manager)',
    pm_name: 'دکتر علی شفیعی‌زاده',
    pm_desc: 'مسئول استقرار گره‌های لبه، مدیریت پروژه‌های پایلوت در مجتمع‌های صنعتی، هماهنگی مهندسی سه‌گانه تصمیم و نظارت بر رعایت چارچوب استانداردهای ISO 55001 و IEC 62443.',
    ceo_title: 'مدیرعامل (Chief Executive Officer)',
    ceo_name: 'مهندس مسعود بخشی',
    ceo_desc: 'مدیرعامل شرکت شبکه هوشمند ابتکار ویستا، برنده دو جایزه ملی هوش مصنوعی ایران و راهبر استراتژیک توسعه فناوری‌های بومی دوقلوی صنعتی.',

    // Authentication & Roles
    auth_title: 'سامانه دسترسی سازمانی و احراز هویت ایمن ویستا (RBAC)',
    auth_headline: 'ورود به پلتفرم حقیقت صنعتی و دوقلوی دیجیتال',
    auth_sub: 'برای دسترسی به داده‌های لحظه‌ای، سناریوهای پایش سلامت و صدور فرامین خودکار، یکی از پرسوناهای سازمانی را انتخاب کنید یا با شناسه خود وارد شوید.',
    auth_switch_persona: 'انتخاب پرسونای نقش‌های سازمانی (دسترسی سریع دمو)',
    auth_credentials: 'ورود با شناسه و توکن اختصاصی OT',
    auth_login_btn: 'ورود امن به سامانه و باز کردن داشبورد صنعتی',
    auth_session_active: 'نشست فعال',
    auth_logout: 'خروج از حساب / بازگشت به لندینگ',
    auth_back_home: 'بازگشت به صفحه معرفی پروژه',
    auth_onpremise_active: 'سرور احراز هویت محلی On-Premise فعال است',
    auth_required_banner: 'برای دسترسی به داشبورد عملیاتی و دوقلو، لطفاً ابتدا هویت خود را مشخص کنید.',

    // Role Titles
    role_pm: 'مدیر ارشد پروژه و استقرار پلتفرم صنعتی ویستا',
    role_ceo: 'مدیرعامل شرکت شبکه هوشمند ابتکار ویستا',
    role_reliability: 'سرپرست قابلیت اطمینان و آنالیز ارتعاشات PdM',
    role_operator: 'تکنسین ارشد اتاق کنترل SCADA',
    role_auditor: 'بازرس ممیزی حقیقت داده و استاندارد ISO 55000',

    // Role Names
    name_shafiee: 'دکتر علی شفیعی‌زاده',
    name_bakhshi: 'مهندس مسعود بخشی',
    name_kavyani: 'مهندس آریا کاویانی',
    name_rostami: 'علیرضا رستمی',
    name_mahdavi: 'سارا مهدوی',

    // Simulation Controls
    theme_light: 'حالت روز (روشن)',
    theme_dark: 'حالت شب (تاریک)',
    lang_select: 'تغییر زبان',
    sim_running: 'شبیه‌سازی فعال',
    sim_paused: 'متوقف',
    sim_reset: 'بازنشانی',
    sim_speed: 'سرعت',
    sim_scenario: 'سناریوی خرابی',
  },

  en: {
    // Brand & Identity
    brand_title: 'Vista Industrial Truth',
    brand_sub: 'Vista Intelligent Network • Science & Technology Park',
    version_badge: 'Native v4.0',
    reg_number: 'Official Registration No: 583302',

    // Navigation & Routes
    nav_home: 'Home & Project Overview',
    nav_architecture: '11-Layer Architecture & Tech Giants',
    nav_twin: '3D Digital Twin Engine',
    nav_didban: 'Vista-Didban (Shared Reality)',
    nav_pasdar: 'Vista-Pasdar (Safety & HSE Boundary)',
    nav_nazmgar: 'Vista-Nazmgar (Operational Scheduling)',
    nav_hafeze: 'Vista-Hafeze (Organizational Context)',
    nav_vibration: 'Vibration Analyzer & ISO 10816',
    nav_what_if: 'Physical What-If Simulator',
    nav_truth_block: 'Truth Block & Hash Explorer',
    nav_contracts: 'Proposals & Official Contracts',
    nav_guide: 'Methodology Guide & Standards',
    nav_login: 'Login & Roles',
    nav_dashboard: 'Enter Industrial Dashboard',
    nav_overview: 'Platform Overview',

    // Landing Page Hero
    hero_badge: 'Vista Industrial Truth Reference Architecture • September 2026',
    hero_title_1: 'Immutable Industrial Truth,',
    hero_title_2: '3D Digital Twin & Decision Triad',
    hero_desc: 'An on-premise, sanction-resilient reference architecture for monitoring rotating asset health, auditing sensory evidence chains, simulating what-if scenarios, and automating maintenance work orders in heavy industry.',
    hero_cta_login: 'Enter Platform & View Roles',
    hero_cta_twin: 'Explore 3D Twin (Three.js)',
    hero_cta_explore: 'Inspect Physical Truth Flow',

    // Metrics Banner
    stat_assets: 'Connected Assets Under Online Monitoring',
    stat_latency: 'PTP Time-Sync Error Latency',
    stat_compliance: 'Compliance with ISO / IEC Standards',
    stat_sanctions: 'Foreign Cloud Lock-in & Sanction Risk',

    // Evidence Chain
    evidence_heading: 'End-to-End Physical Truth Flow: From Raw Vibration to Auditable Decision',
    evidence_sub: 'In mission-critical industry, data only possesses legal and engineering authority when sensor identity, calibration validity, and origin are tamper-proof.',
    step1_title: '1. Physical Sensor & Hardware Signature',
    step1_desc: 'High-frequency accelerometer and thermocouple with crypto-signatures and active calibration certificates at Purdue Layer 0.',
    step2_title: '2. Edge Node & Microsecond Time-Sync',
    step2_desc: 'Sub-10ms IEEE 1588 PTP hardware timestamping, telemetry ingestion, and edge signal compression.',
    step3_title: '3. Immutable Truth Block & Hash Chain',
    step3_desc: 'Cryptographic SHA-256 block hashing creates a permanent, tamper-evident record before server dispatch.',
    step4_title: '4. 3D Digital Twin & Physics Simulation',
    step4_desc: 'Spatial vibration mapping onto 3D CAD meshes, real-time RUL estimation, and parametric what-if simulations.',
    step5_title: '5. Decision Triad & Autonomous Dispatch',
    step5_desc: 'Arbitration between Didban (Reality), Pasdar (Safety), and Nazmgar (Schedule) issuing automated CMMS work orders.',

    // Triad Modules
    triad_heading: 'The Vista Decision Triad Architecture',
    triad_sub: 'Strict separation of concerns between physical reality, safety limits, and production planning.',
    didban_title: 'Vista-Didban (Shared Reality)',
    didban_role: 'Single Source of Physical Truth Engine',
    didban_desc: 'Unfiltered vibration, speed, and thermal monitoring mapped to ISO 10816 standards to eliminate human reporting bias.',
    pasdar_title: 'Vista-Pasdar (Safety Guardian)',
    pasdar_role: 'Safety Envelope & HSE Guard',
    pasdar_desc: 'Continuous surveillance of operational redlines, automatic trip limits, and industrial disaster prevention.',
    nazmgar_title: 'Vista-Nazmgar (Operational Harmonizer)',
    nazmgar_role: 'Load Balancing & Schedule Alignment',
    nazmgar_desc: 'Optimizes maintenance scheduling according to grid electricity tariff peaks and production contract commitments.',

    // Leadership
    leadership_heading: 'Executive Leadership & Technical Governance',
    leadership_sub: 'Vista Intelligent Network Co. • Science & Technology Park',
    pm_title: 'Senior Project Manager',
    pm_name: 'Dr. Ali Shafieezadeh',
    pm_desc: 'Directs edge node deployments, heavy industry pilot installations, Decision Triad engineering synchronization, and ISO 55001 / IEC 62443 compliance frameworks.',
    ceo_title: 'Chief Executive Officer (CEO)',
    ceo_name: 'Eng. Masoud Bakhshi',
    ceo_desc: 'CEO of Vista Intelligent Network Co., winner of two national Iranian AI awards, and executive sponsor of sovereign industrial twin technologies.',

    // Authentication & Roles
    auth_title: 'Enterprise Access Control & Secure Authentication (RBAC)',
    auth_headline: 'Login to Industrial Truth & Digital Twin Platform',
    auth_sub: 'Select an enterprise persona or enter your credentials to inspect live telemetry, audit immutable evidence, and trigger automated actions.',
    auth_switch_persona: 'Select Enterprise Role Persona (Fast Demo)',
    auth_credentials: 'Login with Corporate ID & Dedicated OT Token',
    auth_login_btn: 'Authenticate & Open Industrial Dashboard',
    auth_session_active: 'Active Session',
    auth_logout: 'Sign Out / Back to Landing',
    auth_back_home: 'Back to Project Overview',
    auth_onpremise_active: 'Local On-Premise Authentication Server Active',
    auth_required_banner: 'Please authenticate to access the operational industrial dashboard and digital twins.',

    // Role Titles
    role_pm: 'Senior Project Manager & Industrial Platform Lead',
    role_ceo: 'Chief Executive Officer, Vista Intelligent Network',
    role_reliability: 'Reliability Lead & Vibration Analyst (PdM)',
    role_operator: 'Senior SCADA Control Room Operator',
    role_auditor: 'ISO 55000 Data Truth & Compliance Auditor',

    // Role Names
    name_shafiee: 'Dr. Ali Shafieezadeh',
    name_bakhshi: 'Eng. Masoud Bakhshi',
    name_kavyani: 'Eng. Arya Kavyani',
    name_rostami: 'Alireza Rostami',
    name_mahdavi: 'Sara Mahdavi',

    // Simulation Controls
    theme_light: 'Light Mode',
    theme_dark: 'Dark Mode',
    lang_select: 'Switch Language',
    sim_running: 'Simulation Running',
    sim_paused: 'Paused',
    sim_reset: 'Reset',
    sim_speed: 'Speed',
    sim_scenario: 'Fault Scenario',
  },

  ar: {
    // Brand & Identity
    brand_title: 'حقيقة فيستا الصناعية',
    brand_sub: 'شبكة فيستا الذكية للابتكار • واحة العلوم والتكنولوجيا',
    version_badge: 'الإصدار الوطني ٤.۰',
    reg_number: 'رقم السجل التجاري الرسمي: ۵۸۳۳۰۲',

    // Navigation & Routes
    nav_home: 'الرئيسية ونظرة عامة',
    nav_architecture: 'معمارية الـ ۱۱ طبقة وعمالقة التقنية',
    nav_twin: 'التوأم الرقمي ثلاثي الأبعاد',
    nav_didban: 'فيستا-دیدبان (الواقع المشترك)',
    nav_pasdar: 'فيستا-پاسدار (مراقبة المخاطر والسلامة)',
    nav_nazmgar: 'فيستا-نظم‌گر (التوافق مع الجداول)',
    nav_hafeze: 'فيستا-حافظه (سياق المعرفة المؤسسية)',
    nav_vibration: 'محلل الاهتزازات وآيزو ۱۰۸۱۶',
    nav_what_if: 'محاكي السيناريوهات الافتراضية',
    nav_truth_block: 'مستكشف كتل الحقيقة والتجزئة',
    nav_contracts: 'العروض والعقود الرسمية',
    nav_guide: 'دليل المنهجية والمعايير',
    nav_login: 'تسجيل الدخول والأدوار',
    nav_dashboard: 'دخول لوحة التحكم الصناعية',
    nav_overview: 'نظرة عامة على المنصة',

    // Landing Page Hero
    hero_badge: 'الوثيقة المرجعية لمعمارية منصة حقيقة فيستا الصناعية • سبتمبر ۲۰۲۶',
    hero_title_1: 'حقيقة صناعية غير قابلة للتغيير،',
    hero_title_2: 'توأم رقمي ثلاثي الأبعاد وثلاثي القرارات',
    hero_desc: 'معمارية وطنية مستقلة في الموقع لمراقبة صحة الأصول الدوارة، وتدقيق سلاسل الأدلة المستشعرة، ومحاكاة السيناريوهات وأتمتة أوامر الصيانة في الصناعات الثقيلة.',
    hero_cta_login: 'دخول المنصة وعرض الأدوار',
    hero_cta_twin: 'معاينة التوأم ثلاثي الأبعاد (Three.js)',
    hero_cta_explore: 'فحص مسار الحقيقة الفيزيائية',

    // Metrics Banner
    stat_assets: 'المعدات الصناعية الخاضعة للمراقبة الحية',
    stat_latency: 'دقة مزامنة الوقت PTP بالمللي ثانية',
    stat_compliance: 'الامتثال لمعايير ISO و IEC العالمية',
    stat_sanctions: 'مخاطر الحظر السحابي الخارجي',

    // Evidence Chain
    evidence_heading: 'مسار الحقيقة الفيزيائية الشامل: من الاهتزاز الخام إلى القرار المثبت',
    evidence_sub: 'في الصناعة الحقيقية، لا تملك البيانات قيمة قانونية وهندسية إلا إذا كانت هوية المستشعر وصلاحية المعايرة مشفرة وغير قابلة للتزوير.',
    step1_title: '١. المستشعر الفيزيائي والبصمة الصلبة',
    step1_desc: 'مستشعر تسارع ومزدوج حراري مع توقيعات تشفيرية وشهادات معايرة نشطة في الطبقة 0 من بوردو.',
    step2_title: '٢. عقدة الحافة وتزامن الوقت بالميكروثانية',
    step2_desc: 'طابع زمني للأجهزة وفق معيار IEEE 1588 PTP بأقل من 10 مللي ثانية وضغط الإشارات.',
    step3_title: '٣. كتلة الحقيقة غير القابلة للتغيير',
    step3_desc: 'حساب تجزئة التشفير SHA-256 وتشكيل سجل دائم ومضاد للتلاعب قبل الإرسال.',
    step4_title: '٤. التوأم ثلاثي الأبعاد ومحاكاة الفيزياء',
    step4_desc: 'تعيين الاهتزاز المكاني على النماذج ثلاثية الأبعاد، وتقدير العمر المتبقي RUL ومحاكاة السيناريوهات.',
    step5_title: '٥. ثلاثي القرار والإجراءات التلقائية',
    step5_desc: 'التحكيم بين دیدبان (الواقع)، پاسدار (السلامة)، و نظم‌گر (الجدول) لإصدار أوامر صيانة CMMS التلقائية.',

    // Triad Modules
    triad_heading: 'معمارية ثلاثي اتخاذ القرار في منصة فيستا',
    triad_sub: 'فصل صارم بين الواقع الفيزيائي وحدود السلامة والتخطيط الإنتاجي.',
    didban_title: 'فيستا-دیدبان (Vista-Didban)',
    didban_role: 'محرك الواقع المشترك والحقيقة الفيزيائية',
    didban_desc: 'مراقبة فورية غير مفلترة للاهتزازات والسرعة ودرجات الحرارة وفق معايير ISO 10816 للقضاء على التحيّز البشري.',
    pasdar_title: 'فيستا-پاسدار (Vista-Pasdar)',
    pasdar_role: 'حارس نطاق السلامة والبيئة والصحة المهنية (HSE)',
    pasdar_desc: 'مراقبة دائمة للخطوط الحمراء التشغيلية وإجراءات الإيقاف التلقائي لمنع الكوارث الصناعية.',
    nazmgar_title: 'فيستا-نظم‌گر (Vista-Nazmgar)',
    nazmgar_role: 'موازن الأحمال والتوافق مع الجداول',
    nazmgar_desc: 'تحسين جداول الصيانة مع مراعاة ذروة تعرفة شبكة الكهرباء والالتزامات التعاقدية.',

    // Leadership
    leadership_heading: 'الإدارة التنفيذية والقيادة الفنية للمشروع',
    leadership_sub: 'شركة شبكة فيستا الذكية للابتكار • واحة العلوم والتكنولوجيا',
    pm_title: 'مدير المشروع الأول (Project Manager)',
    pm_name: 'د. علي شفيعي‌زاده',
    pm_desc: 'مسؤول عن نشر عقد الحافة وإدارة المشاريع التجريبية والتنسيق الهندسي لثلاثي القرار والامتثال لمعايير ISO 55001 و IEC 62443.',
    ceo_title: 'الرئيس التنفيذي (CEO)',
    ceo_name: 'م. مسعود بخشي',
    ceo_desc: 'الرئيس التنفيذي لشركة شبكة فيستا الذكية، الحائز على جائزتين وطنيتين للذكاء الاصطناعي، والراعي الاستراتيجي للتوأم الصناعي المستقل.',

    // Authentication & Roles
    auth_title: 'نظام الوصول المؤسسي والتحقق الآمن لفيستا (RBAC)',
    auth_headline: 'تسجيل الدخول لمنصة الحقيقة الصناعية والتوأم الرقمي',
    auth_sub: 'اختر أحد الأدوار والشخصيات المؤسسية للوصول المباشر أو أدخل بياناتك المعتمدة لتفقد الأصول وتشغيل التوأم.',
    auth_switch_persona: 'اختيار الشخصيات والأدوار المؤسسية (عرض سريع)',
    auth_credentials: 'تسجيل الدخول بالرمز المؤسسي ورمز OT',
    auth_login_btn: 'تسجيل الدخول الآمن وفتح لوحة التحكم الصناعية',
    auth_session_active: 'الجلسة نشطة',
    auth_logout: 'تسجيل الخروج / العودة للرئيسية',
    auth_back_home: 'العودة لصفحة معرفی المشروع',
    auth_onpremise_active: 'خادم المصادقة المحلي في الموقع نشط',
    auth_required_banner: 'يرجى تسجيل الدخول للوصول إلى لوحة التحكم الصناعية والتوائم الرقمية.',

    // Role Titles
    role_pm: 'كبير مديري المشروع واستقرار المنصة الصناعية',
    role_ceo: 'الرئيس التنفيذي لشركة شبكة فيستا الذكية',
    role_reliability: 'رئيس الموثوقية وتحليل الاهتزازات (PdM)',
    role_operator: 'كبير مشغلي غرفة التحكم SCADA',
    role_auditor: 'مفتش تدقيق حقيقة البيانات ومعيار ISO 55000',

    // Role Names
    name_shafiee: 'د. علي شفيعي‌زاده',
    name_bakhshi: 'م. مسعود بخشي',
    name_kavyani: 'م. آريا كاوياني',
    name_rostami: 'علي رضا رستمي',
    name_mahdavi: 'سارة مهدوي',

    // Simulation Controls
    theme_light: 'الوضع النهاري (فاتح)',
    theme_dark: 'الوضع الليلي (داكن)',
    lang_select: 'تغيير اللغة',
    sim_running: 'المحاكاة نشطة',
    sim_paused: 'متوقفة',
    sim_reset: 'إعادة ضبط',
    sim_speed: 'السرعة',
    sim_scenario: 'سيناريو العطل',
  },

  tr: {
    // Brand & Identity
    brand_title: 'Vista Endüstriyel Gerçeklik',
    brand_sub: 'Vista Akıllı Ağ İnovasyonu • Teknopark',
    version_badge: 'Yerli Sürüm 4.0',
    reg_number: 'Resmi Sicil No: 583302',

    // Navigation & Routes
    nav_home: 'Ana Sayfa & Projeye Genel Bakış',
    nav_architecture: '11 Katmanlı Mimari & Devler',
    nav_twin: '3B Dijital İkiz Motoru',
    nav_didban: 'Vista-Didban (Ortak Gerçeklik)',
    nav_pasdar: 'Vista-Pasdar (Risk & İSG Sınırı)',
    nav_nazmgar: 'Vista-Nazmgar (Operasyonel Planlama)',
    nav_hafeze: 'Vista-Hafeze (Kurumsal Bağlam)',
    nav_vibration: 'Titreşim Analizörü & ISO 10816',
    nav_what_if: 'Fiziksel Ne-Olursa Simülatörü',
    nav_truth_block: 'Gerçeklik Bloğu & Hash Gezgini',
    nav_contracts: 'Teklifler & Resmi Sözleşmeler',
    nav_guide: 'Metodoloji Kılavuzu & Standartlar',
    nav_login: 'Giriş & Roller',
    nav_dashboard: 'Endüstriyel Panele Giriş',
    nav_overview: 'Platform Genel Bakış',

    // Landing Page Hero
    hero_badge: 'Vista Endüstriyel Gerçeklik Referans Mimarisi • Eylül 2026',
    hero_title_1: 'Değiştirilemez Endüstriyel Gerçeklik,',
    hero_title_2: '3B Dijital İkiz ve Karar Üçlüsü',
    hero_desc: 'Ağır sanayide dönen varlıkların sağlığını izlemek, sensör kanıt zincirlerini denetlemek, ne-olursa senaryolarını simüle etmek ve bakım iş emirlerini otomatikleştirmek için yerinde (On-Premise) bağımsız referans mimarisi.',
    hero_cta_login: 'Platforma Gir ve Rolleri İncele',
    hero_cta_twin: '3B İkizi İncele (Three.js)',
    hero_cta_explore: 'Fiziksel Gerçeklik Akışını Gör',

    // Metrics Banner
    stat_assets: 'Çevrimiçi İzlenen Endüstriyel Varlıklar',
    stat_latency: 'PTP Zaman Senkronizasyon Hata Gecikmesi',
    stat_compliance: 'ISO / IEC Standartlarına Uyum',
    stat_sanctions: 'Yabancı Bulut Bağımlılığı ve Yaptırım Riski',

    // Evidence Chain
    evidence_heading: 'Uçtan Uca Fiziksel Gerçeklik Akışı: Ham Titreşimden Kanıtlanabilir Karara',
    evidence_sub: 'Gerçek sanayide veriler, ancak sensör kimliği, kalibrasyon geçerliliği ve kaynağı şifrelenmiş ve değiştirilemez olduğunda hukuki ve mühendislik değerine sahiptir.',
    step1_title: '1. Fiziksel Sensör & Donanım İmzası',
    step1_desc: 'Purdue Katman 0 seviyesinde kriptografik imzalara ve aktif kalibrasyon sertifikalarına sahip ivmeölçer ve termokupl.',
    step2_title: '2. Uç Düğüm ve Mikrosaniye Zaman Senkronizasyonu',
    step2_desc: '10 milisaniyenin altında IEEE 1588 PTP donanım zaman damgası, telemetri alımı ve uç sinyal sıkıştırma.',
    step3_title: '3. Değiştirilemez Gerçeklik Bloğu ve Hash Zinciri',
    step3_desc: 'Kriptografik SHA-256 blok hashleme, sunucuya iletilmeden önce kurcalamaya karşı korumalı kalıcı bir kayıt oluşturur.',
    step4_title: '4. 3B Dijital İkiz ve Fizik Simülasyonu',
    step4_desc: 'Mekansal titreşimlerin 3B CAD modellerine eşlenmesi, kalan faydalı ömür (RUL) tahmini ve parametrik ne-olursa simülasyonları.',
    step5_title: '5. Karar Üçlüsü ve Otomatik İş Emri',
    step5_desc: 'Didban (Gerçeklik), Pasdar (Güvenlik) ve Nazmgar (Plan) arasındaki tahkim, otomatik CMMS bakım emirleri üretir.',

    // Triad Modules
    triad_heading: 'Vista Karar Üçlüsü Mimarisi (The Decision Triad)',
    triad_sub: 'Fiziksel gerçeklik, güvenlik sınırları ve üretim planlaması arasında kesin görev ayrımı.',
    didban_title: 'Vista-Didban (Ortak Gerçeklik)',
    didban_role: 'Fiziksel Gerçekliğin Tek Kaynağı Motoru',
    didban_desc: 'İnsan raporlama önyargısını ortadan kaldırmak için ISO 10816 standartlarıyla eşleştirilmiş filtrelenmemiş titreşim, hız ve sıcaklık izleme.',
    pasdar_title: 'Vista-Pasdar (Güvenlik Muhafızı)',
    pasdar_role: 'Güvenlik Zarfı ve İSG Denetçisi',
    pasdar_desc: 'Operasyonel kırmızı çizgilerin sürekli gözetimi, acil kapatma limitleri ve endüstriyel felaketlerin önlenmesi.',
    nazmgar_title: 'Vista-Nazmgar (Operasyonel Uyumlaştırıcı)',
    nazmgar_role: 'Yük Dengeleme ve Plan Uyumu',
    nazmgar_desc: 'Elektrik şebekesi tarife zirveleri ve üretim sözleşmesi taahhütlerini dikkate alarak bakım planlamasını optimize eder.',

    // Leadership
    leadership_heading: 'Üst Düzey Yönetim ve Teknik Liderlik',
    leadership_sub: 'Vista Akıllı Ağ İnovasyon Şirketi • Teknopark',
    pm_title: 'Kıdemli Proje Müdürü (Project Manager)',
    pm_name: 'Dr. Ali Shafieezadeh',
    pm_desc: 'Uç düğüm kurulumları, ağır sanayi pilot tesisleri, Karar Üçlüsü mühendislik koordinasyonu ve ISO 55001 / IEC 62443 uyumluluk çerçevelerini yönetmektedir.',
    ceo_title: 'Genel Müdür (CEO)',
    ceo_name: 'Müh. Masoud Bakhshi',
    ceo_desc: 'Vista Akıllı Ağ Şirketi Genel Müdürü, iki ulusal İran Yapay Zeka ödülü sahibi ve yerli endüstriyel ikiz teknolojilerinin stratejik lideri.',

    // Authentication & Roles
    auth_title: 'Kurumsal Erişim Kontrolü ve Güvenli Kimlik Doğrulama (RBAC)',
    auth_headline: 'Endüstriyel Gerçeklik ve Dijital İkiz Platformuna Giriş',
    auth_sub: 'Canlı telemetriyi incelemek, değiştirilemez kanıtları denetlemek ve otomatik eylemleri tetiklemek için bir persona seçin veya kurumsal kimliğinizle giriş yapın.',
    auth_switch_persona: 'Kurumsal Rol Personası Seç (Hızlı Demo)',
    auth_credentials: 'Kurumsal Kimlik ve Özel OT Belirteci ile Giriş',
    auth_login_btn: 'Güvenli Giriş Yap ve Endüstriyel Paneli Aç',
    auth_session_active: 'Aktif Oturum',
    auth_logout: 'Çıkış Yap / Ana Sayfaya Dön',
    auth_back_home: 'Projeye Genel Bakışa Dön',
    auth_onpremise_active: 'Yerel Tesis İçi Kimlik Doğrulama Sunucusu Aktif',
    auth_required_banner: 'Endüstriyel kontrol paneline ve dijital ikizlere erişmek için lütfen kimliğinizi doğrulayın.',

    // Role Titles
    role_pm: 'Kıdemli Proje Müdürü & Endüstriyel Platform Lideri',
    role_ceo: 'Genel Müdür (CEO), Vista Akıllı Ağ',
    role_reliability: 'Güvenilirlik Lideri & Titreşim Analisti (PdM)',
    role_operator: 'Kıdemli SCADA Kontrol Odası Teknisyeni',
    role_auditor: 'ISO 55000 Veri Gerçekliği ve Uyum Denetçisi',

    // Role Names
    name_shafiee: 'Dr. Ali Shafieezadeh',
    name_bakhshi: 'Müh. Masoud Bakhshi',
    name_kavyani: 'Müh. Arya Kavyani',
    name_rostami: 'Alireza Rostami',
    name_mahdavi: 'Sara Mahdavi',

    // Simulation Controls
    theme_light: 'Gündüz Modu (Açık)',
    theme_dark: 'Gece Modu (Karanlık)',
    lang_select: 'Dili Değiştir',
    sim_running: 'Canlı Simülasyon',
    sim_paused: 'Duraklatıldı',
    sim_reset: 'Sıfırla',
    sim_speed: 'Hız',
    sim_scenario: 'Arıza Senaryosu',
  },
};

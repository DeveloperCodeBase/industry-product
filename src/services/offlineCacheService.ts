// Vista Industrial Truth Platform - Offline Document & Service Worker Service
// Enables field technicians to read, search, and verify critical manuals, SOPs, and P&ID specs in network-denied areas.

export interface CriticalTechnicalDocument {
  id: string;
  titleFa: string;
  titleEn: string;
  docCode: string;
  assetId: string;
  assetNameFa: string;
  category: 'vibration_sop' | 'bearing_manual' | 'seal_protocol' | 'compressor_guide' | 'pump_manual' | 'cybersecurity_std';
  categoryLabelFa: string;
  version: string;
  revisionDate: string;
  fileSizeKb: number;
  cryptographicHash: string;
  isCachedOffline: boolean;
  cachedAt?: string;
  summaryFa: string;
  keySections: Array<{
    title: string;
    content: string;
    tags?: string[];
  }>;
  safetyCautionsFa: string[];
  applicableStandards: string[];
}

const STORAGE_KEY_OFFLINE_DOCS = 'vista_cached_critical_docs_v1';
const STORAGE_KEY_SIMULATED_OFFLINE = 'vista_simulated_offline_mode';

// Pre-seeded critical engineering manuals
export const PRE_SEEDED_CRITICAL_DOCUMENTS: CriticalTechnicalDocument[] = [
  {
    id: 'doc-manual-k04',
    titleFa: 'دفترچه راهنمای جامع پایش وضعیت و عیب‌یابی کمپرسور رفت‌وبرگشتی K-04',
    titleEn: 'Comprehensive Condition Monitoring & Troubleshooting Manual for Reciprocating Compressor K-04',
    docCode: 'VIN-MAN-K04-REV4',
    assetId: 'compressor-04',
    assetNameFa: 'کمپرسور گاز فشار بالا K-04 (عسلویه)',
    category: 'compressor_guide',
    categoryLabelFa: 'راهنمای کمپرسور فرآیندی',
    version: '4.2',
    revisionDate: '۱۴۰۵/۰۵/۱۲',
    fileSizeKb: 840,
    cryptographicHash: '0x8f4c9a72b10e34d7',
    isCachedOffline: true,
    cachedAt: '۱۴۰۵/۰۶/۰۱ - ۰۹:۱۵',
    summaryFa: 'دستورالعمل جامع بازرسی راد، سیلندرهای فشار بالا، پایش لقی کراس‌هد و تحلیل ارتعاشات هارمونیک دور لنگ کمپرسور با سنسورهای لایه صفر.',
    keySections: [
      {
        title: '۱. مقادیر آستانه ارتعاشات مجاز یاتاقان‌های اصلی (Main Bearings Thresholds)',
        content: 'طبق استاندارد ISO 10816-6، حد ارتعاش مجاز بدنه کراس‌هد در وضعیت نرمال (Zone A/B) کمتر از ۴.۵ میلی‌متر بر ثانیه RMS است. در صورت ثبت سرعت بیش از ۷.۱ mm/s وضعیت هشدار (Zone C) صادر شده و در ارتعاش بالای ۱۱.۲ mm/s فرمان تریپ اضطراری سیستم اینترلاک اجرا می‌شود.'
      },
      {
        title: '۲. نحوه محاسبه تنش میله پیستون (Rod Drop Monitoring)',
        content: 'سنسورهای جریان گردابی (Eddy Current Proximity Probes) موقعیت میله پیستون را به صورت آنی در جهت عمودی رصد می‌کنند. سایش بیش از ۰.۲۵ میلی‌متر در رینگ‌های سوارکننده نشان‌دهنده نیاز فوری به تعویض رایدر رینگ‌ها در برنامه شات‌دان آتی است.'
      },
      {
        title: '۳. چک‌لیست بازرسی میدانی قبل از استارت',
        content: 'بررسی فشار روغن مدار هیدرولیک (حداقل ۳.۲ بار)، بررسی دمای سنسورهای PT100 روی یاتاقان‌ها (کمتر از ۶۵ درجه سانتی‌گراد)، باز بودن مسیر گاز بارگیری و راستی‌آزمایی تطابق مهر هش کالیبراسیون سنسورهای شتاب‌سنج.'
      }
    ],
    safetyCautionsFa: [
      'هرگز بدون تخلیه فشار گاز داخل سیلندرها اقدام به باز نمودن فلنج‌ها ننمایید.',
      'وجود گاز هیدروژن سولفید (H2S) نیازمند به همراه داشتن دتکتور فردی و ماسک تنفسی فشار مثبت است.',
      'سنسورهای ارتعاشی متصل به کمپرسور باید حتماً دارای گواهی ضد انفجار ATEX Zone 1 Ex d باشند.'
    ],
    applicableStandards: ['API 618', 'ISO 10816-6', 'API 670']
  },
  {
    id: 'doc-sop-bearing-skf',
    titleFa: 'دستورالعمل نگهداری، روانکاری و مونتاژ بیرینگ‌های غلتشی کروی SKF 23144 CC',
    titleEn: 'Maintenance, Lubrication & Mounting SOP for SKF 23144 CC Spherical Roller Bearings',
    docCode: 'VIN-SOP-BRG-23144',
    assetId: 'compressor-04',
    assetNameFa: 'کمپرسور گاز K-04 (شفت محرک اصلی)',
    category: 'bearing_manual',
    categoryLabelFa: 'دستورالعمل مهندسی بیرینگ',
    version: '3.1',
    revisionDate: '۱۴۰۵/۰۴/۱۸',
    fileSizeKb: 620,
    cryptographicHash: '0x3d17e92a8c54ff10',
    isCachedOffline: true,
    cachedAt: '۱۴۰۵/۰۶/۰۲ - ۱۰:۴۰',
    summaryFa: 'مشخصات ابعادی، فرکانس‌های عیب رینگ داخلی و خارجی (BPFO/BPFI)، فاصله لقی مجاز C3 و پروتکل تزریق گریس لیتیوم کمپلکس با پایه روغن سنتتیک.',
    keySections: [
      {
        title: '۱. فرکانس‌های مشخصه عیوب یاتاقان در دور نامی ۱۴۸۰ RPM',
        content: 'فرکانس چرخش شفت (1X) = 24.67 Hz. فرکانس عیب رینگ خارجی (BPFO) = 217.4 Hz. فرکانس عیب رینگ داخلی (BPFI) = 298.6 Hz. فرکانس چرخش ساچمه (BSF) = 89.2 Hz. فرکانس گردش قفسه (FTF) = 10.1 Hz.'
      },
      {
        title: '۲. پروتکل روانکاری و میزان گریس تجدید شونده (Re-greasing Calculation)',
        content: 'مقدار گریس برای هر بار شارژ: G = 0.005 × D × B = 0.005 × 370 × 120 = ۲۲۲ گرم. پریود زمانی تزریق در شرایط کاری پیوسته و دمای کاری ۷۰ درجه: هر ۱۵۰۰ ساعت کارکرد معادل با دو ماه تقویمی.'
      },
      {
        title: '۳. اندازه‌گیری لقی شعاعی با فیلر گیج در هنگام نصب',
        content: 'لقی اولیه پیش از انطباق برای کد C3 باید بین ۰.۱۸۰ الی ۰.۲۴۰ میلی‌متر باشد. کاهش لقی نهایی پس از هیدرولیک نات درایو باید در محدوده ۰.۰۷۰ الی ۰.۰۹۰ میلی‌متر تثبیت گردد.'
      }
    ],
    safetyCautionsFa: [
      'استفاده از حرارت مستقیم شعله برای گرم کردن بیرینگ اکیداً ممنوع بوده و صرفاً از دستگاه القاگر حرارتی (Induction Heater) با کنترل دما تا حداکثر ۱۱۰°C استفاده شود.',
      'از آلودگی گریس با گردوغبار محیطی در هنگام اتصال گریس‌پمپ جداً خودداری فرمایید.'
    ],
    applicableStandards: ['ISO 281', 'ISO 15243', 'DIN 635-2']
  },
  {
    id: 'doc-protocol-seal-53a',
    titleFa: 'پروتکل استقرار، بازرسی و توازن فشار مکانیکال سیل دوبل Plan 53A',
    titleEn: 'Deployment, Inspection & Pressure Balancing Protocol for Dual Mechanical Seal Plan 53A',
    docCode: 'VIN-PROT-SEAL-53A',
    assetId: 'pump-02',
    assetNameFa: 'پمپ سانتریفیوژ خوراک P-02 (پالایشگاه)',
    category: 'seal_protocol',
    categoryLabelFa: 'پروتکل سیل مکانیکی',
    version: '2.4',
    revisionDate: '۱۴۰۵/۰۳/۲۵',
    fileSizeKb: 510,
    cryptographicHash: '0x1b82f04e9c7a2319',
    isCachedOffline: true,
    cachedAt: '۱۴۰۵/۰۶/۰۳ - ۱۴:۲۰',
    summaryFa: 'تنظیم فشار مخزن سیال حائل با گاز ازت (Barrier Fluid N2 Cushion)، پایش نشتی سطوح تماس سیلیکون کارباید و کنترل حرارت مدار سیرکولاسیون.',
    keySections: [
      {
        title: '۱. فرمول تنظیم فشار مخزن گاز ازت سیال حائل',
        content: 'فشار محفظه مخزن (Barrier Pressure) طبق API 682 همواره باید حداقل ۱.۴ الی ۲.۰ بار بالاتر از حداکثر فشار محفظه سیل پمپ (Seal Chamber Pressure) تنظیم شود تا از نفوذ سیال هیدروکربوری فرآیند به لایه بیرونی پیشگیری به عمل آید.'
      },
      {
        title: '۲. کنترل سطح و کیفیت سیال مسدودکننده (Barrier Fluid)',
        content: 'از روغن توربین هیدرولیک با ویسکوزیته ISO VG 32 سنتتیک فاقد آب و ناخالصی استفاده شود. در صورت افت سطح مایع در سایت گلاس، فوراً شارژ از طریق پمپ دستی تاییدشده انجام شود.'
      }
    ],
    safetyCautionsFa: [
      'در صورت افت فشار ازت به کمتر از فشار محفظه سیل، آلارم قرمز صادر شده و باید بلافاصله بار پمپ به خط پشتیبان منتقل شود.',
      'تماس با سیال فرآیندی داغ موجب سوختگی شدید می‌گردد. از عینک ایمنی و دستکش مقاوم حرارتی استفاده گردد.'
    ],
    applicableStandards: ['API 682 4th Edition', 'ISO 21049']
  },
  {
    id: 'doc-manual-pump-p02',
    titleFa: 'راهنمای راه‌اندازی، پایش کاویتاسیون و ارتعاشات پمپ سانتریفیوژ P-02',
    titleEn: 'Commissioning, Cavitation Monitoring & Vibration Analysis Manual for Centrifugal Pump P-02',
    docCode: 'VIN-MAN-PMP-P02',
    assetId: 'pump-02',
    assetNameFa: 'پمپ سانتریفیوژ انتقال خوراک P-02',
    category: 'pump_manual',
    categoryLabelFa: 'راهنمای پمپ صنعتی',
    version: '3.0',
    revisionDate: '۱۴۰۵/۰۲/۱۴',
    fileSizeKb: 730,
    cryptographicHash: '0x4e61d8b9201fa49c',
    isCachedOffline: true,
    cachedAt: '۱۴۰۵/۰۶/۰۴ - ۱۶:۰۵',
    summaryFa: 'تحلیل فرکانس پره‌گذری پروانه (Blade Pass Frequency - BPF)، محاسبه حاشیه NPSHa، تشخیص کاویتاسیون بر پایه نویز فرکانس بالا و هم‌راستاسازی لیزری شفت.',
    keySections: [
      {
        title: '۱. محاسبه فرکانس پره‌گذری پروانه (BPF)',
        content: 'پروانه دارای ۶ پره و دور نامی ۲۹۵۰ RPM (فرکانس دور شفت ۴۹.۱۷ هرتز). فرکانس BPF = 6 × 49.17 = 295 Hz. وجود پیک‌های تیز در این فرکانس همراه با هارمونیک‌های آن نشانه انسداد هیدرولیکی یا فاصله نامناسب زبانه حلزونی است.'
      },
      {
        title: '۲. علایم اولیه ایجاد پدیده کاویتاسیون (Cavitation Inception)',
        content: 'افزایش ناگهانی طیف باند پهن در فرکانس‌های ۱ تا ۵ کیلوهرتز و جهش شاخص Crest Factor به بالای ۵ همراه با صدای شبیه به خرد شدن سنگ‌ریزه در داخل محفظه پوسته.'
      }
    ],
    safetyCautionsFa: [
      'هرگز پمپ را با شیر تخلیه (Discharge Valve) بسته برای مدت طولانی‌تر از ۳۰ ثانیه روشن نگه ندارید.',
      'تجهیز حتماً باید قبل از راه‌اندازی هواگیری (Priming) کامل شده باشد.'
    ],
    applicableStandards: ['API 610 12th Edition', 'ISO 10816-7', 'HI 9.6.4']
  },
  {
    id: 'doc-std-iso10816',
    titleFa: 'استاندارد مرجع ارزیابی شدت ارتعاشات ماشین‌آلات صنعتی (ISO 10816-3 & ISO 20816-1)',
    titleEn: 'Industrial Machinery Vibration Severity Evaluation Standard (ISO 10816-3 & ISO 20816-1)',
    docCode: 'VIN-STD-ISO-10816-3',
    assetId: 'compressor-04',
    assetNameFa: 'کلیه ماشین‌آلات دوار بالای ۱۵ کیلووات',
    category: 'vibration_sop',
    categoryLabelFa: 'استاندارد بین‌المللی ارتعاشات',
    version: '2026 Ed.',
    revisionDate: '۱۴۰۵/۰۱/۱۰',
    fileSizeKb: 950,
    cryptographicHash: '0x9923bb6108163fac',
    isCachedOffline: true,
    cachedAt: '۱۴۰۵/۰۶/۰۵ - ۰۸:۰۰',
    summaryFa: 'جدول دسته‌بندی ماشین‌آلات در چهار گروه (کلاس ۱ تا ۴)، حدود تفکیک نواحی چهارگانه کیفیت ارتعاشی A، B، C و D بر حسب سرعت موثر (Velocity RMS).',
    keySections: [
      {
        title: '۱. حدود ارتعاشات کلاس ۳ (پمپ‌ها و کمپرسورهای بالای ۳۰۰ کیلووات روی فونداسیون صلب)',
        content: 'ناحیه A (تجهیز تازه نصب‌شده/عالی): ۰ الی ۲.۳ mm/s RMS. ناحیه B (کارکرد مداوم نامحدود): ۲.۳ الی ۴.۵ mm/s RMS. ناحیه C (هشدار موقت و برنامه‌ریزی تعمیرات): ۴.۵ الی ۷.۱ mm/s RMS. ناحیه D (توقف اضطراری/خطر شکست): بالای ۷.۱ mm/s RMS.'
      },
      {
        title: '۲. تفاوت فونداسیون صلب (Rigid) و انعطاف‌پذیر (Flexible)',
        content: 'اگر کمترین فرکانس طبیعی سیستم تکیه‌گاهی بالاتر از فرکانس تحریک اصلی (دور کاری) به میزان حداقل ۲۵٪ باشد، فونداسیون صلب تلقی می‌گردد. در غیر این صورت فونداسیون انعطاف‌پذیر بوده و حدود مجاز تا ۱.۴ برابر افزایش می‌یابد.'
      }
    ],
    safetyCautionsFa: [
      'ورود سرعت ارتعاشات به محدوده Zone D ریسک فوری شکست خستگی شفت، گریپاژ یاتاقان و آتش‌سوزی در محیط‌های فرآیندی را به همراه دارد.'
    ],
    applicableStandards: ['ISO 10816-3', 'ISO 20816-1', 'ISO 13373-1']
  },
  {
    id: 'doc-std-iec62443',
    titleFa: 'دستورالعمل تفکیک مناطق و سطوح امنیتی شبکه پایش صنعتی بر پایه IEC 62443-3-3',
    titleEn: 'Zones and Conduits Industrial Security & Data Isolation Architecture (IEC 62443-3-3)',
    docCode: 'VIN-STD-IEC-62443',
    assetId: 'transformer-01',
    assetNameFa: 'معماری شبکه داده لبه و پست توزیع برق',
    category: 'cybersecurity_std',
    categoryLabelFa: 'استاندارد امنیت صنعتی',
    version: '3.3',
    revisionDate: '۱۴۰۴/۱۱/۲۰',
    fileSizeKb: 680,
    cryptographicHash: '0x62443abcde1234ff',
    isCachedOffline: true,
    cachedAt: '۱۴۰۵/۰۶/۰۵ - ۰۸:۱۵',
    summaryFa: 'جداسازی منطقه ابزاردقیق Level 0/1 از Level 2/3 با دیتادیود سخت‌افزاری، امضای دیجیتال بلوک‌های حقیقت با SHA-256 و ایزولاسیون کامل پلتفرم در شرایط آفلاین.',
    keySections: [
      {
        title: '۱. مدل لایه‌بندی امنیتی پردو (Purdue Zone Model)',
        content: 'تجهیزات ارتعاش‌سنجی و سنسورها در لایه Level 0 مستقر هستند. باکس‌های لبه ویستا در Level 1 پردازش ارتعاشات و ثبت بلوک حقیقت را با قفل سخت‌افزاری انجام داده و انتقال داده به سرور دیدبان صرفاً از طریق کانال یک‌طرفه فیزیکی (Hardware Data Diode) صورت می‌پذیرد.'
      },
      {
        title: '۲. عملکرد کامپوننت‌های محلی در قطعی ارتباط سراسری (Island Mode)',
        content: 'در صورت قطع کلی شبکه فیبر یا ارتباط اینترانت، پلتفرم تا ۹۰ روز بدون کاهش دقت اقدام به ذخیره بلوک‌های حقیقت، هش‌های زمانی نانوثانیه PTP و تحلیل‌های پیش‌بینانه در حافظه NVMe رمزنگاری‌شده لبه می‌نماید.'
      }
    ],
    safetyCautionsFa: [
      'اتصال هرگونه حافظه فلش غیرمجاز به پورت‌های یو‌اس‌بی سخت‌افزارهای لبه بدون بررسی آنتی‌ویروس صنعتی در کیوسک پاکسازی ممنوع است.'
    ],
    applicableStandards: ['IEC 62443-3-3', 'NIST SP 800-82', 'API 1164']
  }
];

class OfflineCacheService {
  private isSwRegistered = false;

  constructor() {
    this.init();
  }

  public init() {
    // Check if initial storage exists, if not initialize with default critical manuals
    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem(STORAGE_KEY_OFFLINE_DOCS);
      if (!existing) {
        localStorage.setItem(STORAGE_KEY_OFFLINE_DOCS, JSON.stringify(PRE_SEEDED_CRITICAL_DOCUMENTS));
      }

      // Try registering service worker
      this.registerServiceWorker();
    }
  }

  private registerServiceWorker() {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // In iframes, register gracefully without breaking
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
          this.isSwRegistered = true;
          console.log('[Vista Offline Service] Service Worker registered:', reg.scope);
        })
        .catch((err) => {
          console.log('[Vista Offline Service] SW notice (using local cached storage):', err.message);
        });
    }
  }

  // Get all documents available in offline storage
  public getDocuments(): CriticalTechnicalDocument[] {
    if (typeof window === 'undefined') return PRE_SEEDED_CRITICAL_DOCUMENTS;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_OFFLINE_DOCS);
      if (!raw) return PRE_SEEDED_CRITICAL_DOCUMENTS;
      return JSON.parse(raw);
    } catch {
      return PRE_SEEDED_CRITICAL_DOCUMENTS;
    }
  }

  // Save or cache a document for offline use
  public cacheDocument(doc: CriticalTechnicalDocument): void {
    const docs = this.getDocuments();
    const idx = docs.findIndex((d) => d.id === doc.id);
    const updatedDoc: CriticalTechnicalDocument = {
      ...doc,
      isCachedOffline: true,
      cachedAt: new Date().toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    if (idx >= 0) {
      docs[idx] = updatedDoc;
    } else {
      docs.unshift(updatedDoc);
    }

    localStorage.setItem(STORAGE_KEY_OFFLINE_DOCS, JSON.stringify(docs));

    // Also attempt to push to Service Worker Cache API if available
    if (typeof window !== 'undefined' && 'caches' in window) {
      caches.open('vista-technical-docs-v1').then((cache) => {
        const response = new Response(JSON.stringify(updatedDoc), {
          headers: { 'Content-Type': 'application/json' }
        });
        cache.put(`/offline-manuals/${doc.id}`, response);
      }).catch(() => {});
    }
  }

  // Remove document from offline cache
  public removeDocumentFromCache(docId: string): void {
    const docs = this.getDocuments();
    const updated = docs.map((d) => {
      if (d.id === docId) {
        return { ...d, isCachedOffline: false, cachedAt: undefined };
      }
      return d;
    });
    localStorage.setItem(STORAGE_KEY_OFFLINE_DOCS, JSON.stringify(updated));

    if (typeof window !== 'undefined' && 'caches' in window) {
      caches.open('vista-technical-docs-v1').then((cache) => {
        cache.delete(`/offline-manuals/${docId}`);
      }).catch(() => {});
    }
  }

  // Precache all available critical documents at once
  public precacheAll(): void {
    const docs = this.getDocuments().map((d) => ({
      ...d,
      isCachedOffline: true,
      cachedAt: new Date().toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));
    localStorage.setItem(STORAGE_KEY_OFFLINE_DOCS, JSON.stringify(docs));
  }

  // Clear all cached documents
  public clearAllCache(): void {
    const docs = this.getDocuments().map((d) => ({
      ...d,
      isCachedOffline: false,
      cachedAt: undefined
    }));
    localStorage.setItem(STORAGE_KEY_OFFLINE_DOCS, JSON.stringify(docs));

    if (typeof window !== 'undefined' && 'caches' in window) {
      caches.delete('vista-technical-docs-v1').catch(() => {});
    }
  }

  // Check network state (online vs offline), factoring in simulated offline mode
  public isOnline(): boolean {
    if (this.isSimulatedOffline()) {
      return false;
    }
    if (typeof navigator !== 'undefined') {
      return navigator.onLine;
    }
    return true;
  }

  // Simulated offline toggle for testing in dev / preview
  public isSimulatedOffline(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEY_SIMULATED_OFFLINE) === 'true';
  }

  public setSimulatedOffline(simulated: boolean): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_SIMULATED_OFFLINE, simulated ? 'true' : 'false');
    window.dispatchEvent(new Event('vista-network-state-change'));
  }

  // Storage metrics
  public getStorageMetrics(): { cachedCount: number; totalCount: number; totalSizeKb: number; formattedSize: string } {
    const docs = this.getDocuments();
    const cached = docs.filter((d) => d.isCachedOffline);
    const totalSizeKb = cached.reduce((acc, curr) => acc + (curr.fileSizeKb || 0), 0);
    const formattedSize = totalSizeKb >= 1024 ? `${(totalSizeKb / 1024).toFixed(1)} MB` : `${totalSizeKb} KB`;

    return {
      cachedCount: cached.length,
      totalCount: docs.length,
      totalSizeKb,
      formattedSize
    };
  }
}

export const offlineCacheService = new OfflineCacheService();

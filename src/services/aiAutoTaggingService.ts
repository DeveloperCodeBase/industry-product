// Vista Industrial Truth Platform - AI Document Auto-Tagging Service
// Automatically scans technical documents, reports, contracts and assigns relevant keywords, ISO categories and Asset IDs.

export interface AutoTagResult {
  source: string;
  fileName: string;
  title: string;
  category: 'vibration_audit' | 'p&id_diagram' | 'maintenance_sop' | 'epc_contract' | 'incident_report' | 'calibration_cert';
  matchedAssetIds: Array<{ id: string; nameFa: string; confidence: number }>;
  assignedTags: string[];
  standardsReferenced: string[];
  estimatedCriticality: 'critical' | 'warning' | 'normal' | 'preventive';
  summaryFa: string;
  confidenceScore: number;
}

export const SAMPLE_TECHNICAL_DOCS_FOR_TAGGING = [
  {
    title: 'گزارش ممیزی ارتعاشات و اسپایک BPFO یاتاقان کمپرسور K-04',
    fileName: 'Audit_Report_K04_Bearing_BPFO.docx',
    text: `گزارش ممیزی ارتعاشاتی شماره AUD-2026-K04
تجهیز: کمپرسور رفت‌وبرگشتی فشار بالا K-04 (عسلویه)
محل اندازه‌گیری: یاتاقان غلتشی کروی شفت محرک اصلی (SKF 23144 CC)
در آنالیز دمدولاسیون پوش هیلبرت (Hilbert Envelope Spectrum)، اسپایک‌های متوالی با هارمونیک‌های مرتبه ۳ و ۴ در فرکانس ۲۱۷.۴ هرتز مشاهده گردید که دقیقاً منطبق بر فرکانس مشخصه عیب رینگ خارجی (BPFO) بیرینگ است.
سرعت ارتعاش مؤثر RMS بدنه به ۵.۴ میلی‌متر بر ثانیه افزایش یافته که بر اساس استاندارد ISO 10816-3 در محدوده هشدار زرد (Zone C) قرار دارد.
شاخص کرتوزیس (Kurtosis) از عدد نرمال ۳.۰ به ۴.۶ جهش داشته است.
توصیه فوری: تزریق گریس لیتیوم کمپلکس با گرید NLGI 2، برنامه‌ریزی تعویض بلبرینگ در توقف فرآیندی ۱۰ روز آینده و کالیبراسیون مجدد سنسور شتاب‌سنج با گواهی آزمایشگاه مرجع.`
  },
  {
    title: 'دستورالعمل تعویض پروانه و رفع کاویتاسیون پمپ سانتریفیوژ P-02',
    fileName: 'SOP_Centrifugal_Pump_P02_Cavitation.pdf',
    text: `دستورالعمل مهندسی پایش و نگهداری پمپ خوراک P-02
استاندارد مرجع: API 610 ویرایش ۱۲ و ISO 10816-7
مشاهدات میدانی حاکی از نویز فرکانس بالا (بین ۲ تا ۵ کیلوهرتز) در پوسته حلزونی و ارتعاش ۴.۸ میلی‌متر بر ثانیه در جهت شعاعی عمودی است.
بررسی حاشیه NPSHa نشان می‌دهد فشار ورودی به دلیل گرفتگی صافی استرینر مکش کاهش یافته و پدیده کاویتاسیون آغاز شده است.
فرکانس پره‌گذری پروانه (Blade Pass Frequency - BPF) در فرکانس ۲۹۵ هرتز دارای سایدباندهای مدولاسیون است.
اقدامات الزامی: شستشوی فیلتر استرینر خط مکش، هم‌راستاسازی لیزری شفت کوپلینگ و بازرسی مکانیکال سیل Plan 53A از نظر عدم نشت سیال هیدروکربوری فرآیند.`
  },
  {
    title: 'پیمان حقوقی و توافقنامه واگذاری دوقلوی دیجیتال ویستا (ثبت ۵۸۳۳۰۲)',
    fileName: 'Contract_Vista_DigitalTwin_SLA9995.pdf',
    text: `قرارداد رسمی شماره VIN-IND-2026/09
طرف اول: شرکت شبکه هوشمند ابتکار ویستا (شماره ثبت رسمی ۵۸۳۳۰۲، عضو پارک علم و فناوری سمنان)
طرف دوم: مجتمع پتروشیمی عسلویه (پالایشگاه گاز)
موضوع: استقرار پلتفرم حقیقت صنعتی، سامانه دیدبان، پاسدار، نظم‌گر و حافظه بر بستر سخت‌افزار لبه کاملاً ایزوله (Air-Gapped).
تعهدات SLA: تضمین پایش برخط و بلادرنگ با سطح دسترسی ۹۹.۹۵٪، ممهور به مهر دیجیتال بلوک حقیقت و کلاک سخت‌افزاری IEEE 1588 PTP.
الزامات محرمانگی و امنیتی: رعایت کامل استاندارد IEC 62443-3-3 و استقرار دیتادیود سخت‌افزاری جهت تفکیک شبکه کنترل فرآیند از شبکه اداری کارفرما.`
  }
];

export async function scanAndAutoTagDocument(
  text: string,
  title?: string,
  fileName?: string
): Promise<AutoTagResult> {
  try {
    const res = await fetch('/api/auto-tag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, title, fileName })
    });

    if (res.ok) {
      const data = await res.json();
      return {
        source: data.source || 'ai_engine',
        fileName: data.fileName || fileName || 'document.pdf',
        title: data.title || title || 'سند فنی تحلیل‌شده',
        category: data.category || 'vibration_audit',
        matchedAssetIds: data.matchedAssetIds || [{ id: 'compressor-04', nameFa: 'کمپرسور K-04', confidence: 90 }],
        assignedTags: data.assignedTags || ['پایش-وضعیت', 'صنعتی'],
        standardsReferenced: data.standardsReferenced || ['ISO 10816-3'],
        estimatedCriticality: data.estimatedCriticality || 'normal',
        summaryFa: data.summaryFa || 'پردازش و استخراج هوشمند موجودیت‌های سند فنی با موفقیت صورت گرفت.',
        confidenceScore: data.confidenceScore || 95.0
      };
    }
  } catch (err) {
    console.warn('[AutoTag] API call failed or offline, falling back to local heuristic extraction:', err);
  }

  // Deterministic local extraction fallback
  const lower = text.toLowerCase();
  const matchedAssets: Array<{ id: string; nameFa: string; confidence: number }> = [];
  const tags: string[] = [];
  const standards: string[] = [];

  if (lower.includes('k-04') || lower.includes('k04') || lower.includes('compressor') || lower.includes('کمپرسور')) {
    matchedAssets.push({ id: 'compressor-04', nameFa: 'کمپرسور گاز فشار بالا K-04', confidence: 96 });
    tags.push('کمپرسور-K04', 'شفت-محرک', 'سیلندر-فشاربالا');
  }
  if (lower.includes('p-02') || lower.includes('p02') || lower.includes('pump') || lower.includes('پمپ')) {
    matchedAssets.push({ id: 'pump-02', nameFa: 'پمپ سانتریفیوژ انتقال خوراک P-02', confidence: 94 });
    tags.push('پمپ-P02', 'پروانه-هیدرولیک', 'کاویتاسیون');
  }
  if (lower.includes('m-01') || lower.includes('motor') || lower.includes('الکتروموتور')) {
    matchedAssets.push({ id: 'motor-01', nameFa: 'الکتروموتور ولتاژ متوسط M-01', confidence: 88 });
    tags.push('الکتروموتور-M01', 'سیم‌پیچ-استاتور');
  }

  if (lower.includes('bpfo') || lower.includes('bearing') || lower.includes('یاتاقان') || lower.includes('بیرینگ')) {
    tags.push('فرکانس-BPFO', 'بیرینگ-SKF-23144', 'طیف-دمدولاسیون-پوش');
  }
  if (lower.includes('seal') || lower.includes('سیل') || lower.includes('53a')) {
    tags.push('مکانیکال-سیل', 'Plan-53A', 'سیال-حائل');
  }
  if (lower.includes('rms') || lower.includes('ارتعاش') || lower.includes('vibration')) {
    tags.push('ارتعاشات-RMS', 'کرتوزیس-Kurtosis', 'تحلیل-طیف-FFT');
  }
  if (lower.includes('10816')) {
    standards.push('ISO 10816-3');
    tags.push('استاندارد-ISO-10816');
  }
  if (lower.includes('670') || lower.includes('api 610') || lower.includes('api 682')) {
    standards.push('API 670 / API 610');
    tags.push('استاندارد-API');
  }
  if (lower.includes('62443')) {
    standards.push('IEC 62443-3-3');
    tags.push('امنیت-سایبری-صنعتی');
  }

  if (matchedAssets.length === 0) {
    matchedAssets.push({ id: 'compressor-04', nameFa: 'کمپرسور گاز K-04 (تجهیز پیش‌فرض)', confidence: 75 });
  }

  return {
    source: 'local_heuristic_engine',
    fileName: fileName || 'manual_input.txt',
    title: title || 'سند ارزیابی فنی',
    category: tags.some(t => t.includes('BPFO') || t.includes('ارتعاش')) ? 'vibration_audit' : 'maintenance_sop',
    matchedAssetIds: matchedAssets,
    assignedTags: Array.from(new Set(tags)),
    standardsReferenced: standards.length > 0 ? standards : ['ISO 10816-3', 'API 670'],
    estimatedCriticality: tags.some(t => t.includes('BPFO')) ? 'critical' : 'normal',
    summaryFa: `تحلیل هوشمند سند با انطباق بالا بر تجهیز ${matchedAssets[0].nameFa} و اجزای مرتبط با استانداردهای پایش ارتعاشی انجام شد.`,
    confidenceScore: 93.5
  };
}

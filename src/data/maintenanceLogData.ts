import { ComponentHealthRecord, MaintenanceIntervention, DegradationDataPoint } from '../types';

export const INITIAL_COMPONENT_HEALTH: Record<string, ComponentHealthRecord[]> = {
  'compressor-04': [
    {
      componentName: 'مجموعه بیرینگ محرک غلتشی (SKF 22318/C3)',
      componentKey: 'drive_bearing',
      healthScore: 58,
      degradationRate: 2.8,
      criticality: 'critical',
      primaryStressFactor: 'فشار دینامیکی نامتقارن و فرکانس عیب رینگ خارجی BPFO در ۱۲۷ هرتز',
      recommendedInspectionDays: 4,
    },
    {
      componentName: 'آب‌بند مکانیکی گازی دوگانه (Dry Gas Seal)',
      componentKey: 'mechanical_seal',
      healthScore: 84,
      degradationRate: 0.6,
      criticality: 'high',
      primaryStressFactor: 'نوسان جزئی فشار گاز آب‌بندی اولیه نیتروژن',
      recommendedInspectionDays: 28,
    },
    {
      componentName: 'پروانه‌های گریز از مرکز مرحله ۳ (Inconel 718 Impeller)',
      componentKey: 'impeller_stage3',
      healthScore: 76,
      degradationRate: 1.1,
      criticality: 'high',
      primaryStressFactor: 'فرسایش ذره‌ای ملایم ناشی از ریزقطرات کندانس گاز ترش',
      recommendedInspectionDays: 45,
    },
    {
      componentName: 'کوپلینگ انعطاف‌پذیر شفت اصلی (Flexible Disc Coupling)',
      componentKey: 'shaft_coupling',
      healthScore: 69,
      degradationRate: 1.9,
      criticality: 'medium',
      primaryStressFactor: 'عدم هم‌محوری زاویه‌ای ۰.۱۲ میلی‌متر با الکتروموتور',
      recommendedInspectionDays: 14,
    },
    {
      componentName: 'سیم‌پیچ استاتور الکتروموتور ۵.۲ مگاوات (Stator Windings)',
      componentKey: 'stator_windings',
      healthScore: 91,
      degradationRate: 0.3,
      criticality: 'critical',
      primaryStressFactor: 'پایداری حرارتی کلاس H در محدوده مجاز ۹۲ درجه سانتی‌گر',
      recommendedInspectionDays: 90,
    },
  ],
  'pump-02': [
    {
      componentName: 'سیل کارتریجی مکانیکی (Plan 53A Seal)',
      componentKey: 'mechanical_seal',
      healthScore: 62,
      degradationRate: 3.1,
      criticality: 'critical',
      primaryStressFactor: 'تخریب تدریجی سیال مانع (Barrier Fluid Degradation)',
      recommendedInspectionDays: 6,
    },
    {
      componentName: 'یاتاقان ژورنال لغزشی (Babbitt Sleeve Bearing)',
      componentKey: 'journal_bearing',
      healthScore: 88,
      degradationRate: 0.5,
      criticality: 'high',
      primaryStressFactor: 'پایداری فیلم روغن هیدرودینامیک ISO VG 46',
      recommendedInspectionDays: 60,
    },
    {
      componentName: 'ایمپلر برنزی ضدخوردگی (SS316 Open Impeller)',
      componentKey: 'impeller',
      healthScore: 79,
      degradationRate: 1.2,
      criticality: 'high',
      primaryStressFactor: 'کاویتاسیون موضعی در NPSH حاشیه‌ای',
      recommendedInspectionDays: 30,
    },
  ],
};

export const INITIAL_INTERVENTIONS: MaintenanceIntervention[] = [
  {
    id: 'int-001',
    assetId: 'compressor-04',
    assetName: 'کمپرسور سانتریفیوژ گاز خوراک K-04',
    component: 'بیرینگ محرک جلو (SKF 22318)',
    suggestedAction: 'تعویض روانکار و تزریق گریس صنعتی تمام‌سنتتیک با ویسکوزیته بالا (ISO VG 220)',
    technicalDetails: 'تحلیل هارمونیک نشان‌دهنده افزایش قله‌های اینولپ فرکانس BPFO به میزان ۱.۸g بود. روان‌کاری لایه‌مرزی توانست ارتعاش اصطکاکی را ۲۴٪ کاهش دهد.',
    confidenceScore: 97.4,
    priority: 'high',
    status: 'completed',
    triggeredBy: 'شناسایی قله شتاب اینولپ ۱۲۷ هرتز و جهش شاخص کرتوزیس به ۴.۳',
    suggestedDate: '۱۴۰۵/۰۶/۰۲ - ۰۸:۳۰',
    completedDate: '۱۴۰۵/۰۶/۰۲ - ۱۱:۱۵',
    technicianName: 'تکنسین علیرضا رستمی / تأیید مهندس کاویانی',
    preventedDowntimeHours: 12,
    economicSavingsMillionTomans: 850,
  },
  {
    id: 'int-002',
    assetId: 'compressor-04',
    assetName: 'کمپرسور سانتریفیوژ گاز خوراک K-04',
    component: 'شفت اصلی و کوپلینگ دیسکی',
    suggestedAction: 'تراز لیزری شفت (Laser Realignment) و بررسی پیچ‌های پایه در پایش ارتعاشات فاز',
    technicalDetails: 'تحلیل ارتعاشات بردار فاز ۱X و ۲X انحراف زاویه‌ای ۰.۱۴ درجه را آشکار ساخت. اجرای تراز شفت قبل از سرایت به سیل‌های گاز توصیه می‌شود.',
    confidenceScore: 94.8,
    priority: 'scheduled',
    status: 'scheduled',
    triggeredBy: 'همبستگی قله ۲X ارتعاشات شفت با افزایش جریان استاتور',
    suggestedDate: '۱۴۰۵/۰۶/۱۰ - ۰۷:۰۰',
    technicianName: 'واحد تعمیرات مکانیک و تراز لیزری',
    preventedDowntimeHours: 18,
    economicSavingsMillionTomans: 1420,
  },
  {
    id: 'int-003',
    assetId: 'compressor-04',
    assetName: 'کمپرسور سانتریفیوژ گاز خوراک K-04',
    component: 'مجموعه بیرینگ محرک غلتشی',
    suggestedAction: 'سفارش‌گذاری و آماده‌سازی کیت تعویض کامل بیرینگ در پنجره تعمیراتی بعدی (Planned Turnaround)',
    technicalDetails: 'مدل رگرسیون تضعیف ویبول با اطمینان ۹۹٪ اتمام عمر مفید باقیمانده (RUL) را ظرف ۱۸ روز آینده در صورت حفظ بار نامی پیش‌بینی می‌کند.',
    confidenceScore: 98.2,
    priority: 'emergency',
    status: 'in_progress',
    triggeredBy: 'مدل زوال استهلاک غیرخطی هوش مصنوعی و کاهش RUL به کمتر از ۲۵۰ ساعت',
    suggestedDate: '۱۴۰۵/۰۶/۰۷ - ۱۴:۰۰',
    technicianName: 'مهندس آریا کاویانی / اداره بازرسی فنی',
    preventedDowntimeHours: 36,
    economicSavingsMillionTomans: 3100,
  },
  {
    id: 'int-004',
    assetId: 'pump-02',
    assetName: 'پمپ سانتریفیوژ هیدروکربنی P-02',
    component: 'سیستم آب‌بند Plan 53A',
    suggestedAction: 'تخلیه و شارژ مجدد مایع بافر نیتروژنه مخزن مخزن کوئنچ',
    technicalDetails: 'افت فشار مخزن کوئنچ به کمتر از ۲.۱ بار باعث ریسک فرار هیدروکربن به اتمسفر گردیده بود.',
    confidenceScore: 96.0,
    priority: 'high',
    status: 'completed',
    triggeredBy: 'سنسور افت فشار دیفرانسیلی سیل و آلارم دیده‌بان',
    suggestedDate: '۱۴۰۵/۰۵/۲۸ - ۱۰:۴۵',
    completedDate: '۱۴۰۵/۰۵/۲۸ - ۱۲:۰۰',
    technicianName: 'تکنسین شیفت اتاق کنترل',
    preventedDowntimeHours: 8,
    economicSavingsMillionTomans: 480,
  },
  {
    id: 'int-005',
    assetId: 'blower-01',
    assetName: 'دمنده فشارقوی هوای کوره B-01',
    component: 'فیلترهای ورودی هوای احتراق',
    suggestedAction: 'بک‌واش پالسی و تعویض المنت‌های غشایی هپا فیلتر هوای مکش',
    technicalDetails: 'افزایش اختلاف فشار ورودی به ۲۵ میلی‌بار سبب افزایش مصرف برق الکتروموتور به میزان ۴.۸٪ گردید.',
    confidenceScore: 92.5,
    priority: 'preventive',
    status: 'scheduled',
    triggeredBy: 'پایش مصرف بهینه انرژی الگوریتم نظم‌گر',
    suggestedDate: '۱۴۰۵/۰۶/۱۵ - ۰۹:۰۰',
    technicianName: 'واحد سرویس فیلتراسیون',
    preventedDowntimeHours: 6,
    economicSavingsMillionTomans: 320,
  },
];

export function generateDegradationTimeline(assetId: string): DegradationDataPoint[] {
  const points: DegradationDataPoint[] = [];
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  // Past 20 days historical readings + 10 days AI forecast
  const baseHealth = assetId === 'compressor-04' ? 62 : 85;
  const initialVib = assetId === 'compressor-04' ? 2.4 : 1.8;

  for (let i = -20; i <= 10; i++) {
    const isForecast = i > 0;
    const date = new Date(now + i * oneDay);
    const dayStr = `${date.getMonth() + 1}/${date.getDate()}`;

    // Linear + noise decay pattern
    const decay = isForecast ? i * 1.6 : (20 + i) * 1.3;
    const health = Math.max(15, Math.min(100, Math.round(98 - decay + (isForecast ? 0 : (Math.sin(i) * 2)))));
    const vibRms = Number((initialVib + (100 - health) * 0.065 + (isForecast ? 0 : Math.random() * 0.2)).toFixed(2));
    const envelopePeakG = Number(((100 - health) * 0.08 + (isForecast ? 0.3 : Math.random() * 0.15)).toFixed(2));
    const wearIndex = Number(((100 - health) / 10).toFixed(1));
    const tempC = Math.round(68 + (100 - health) * 0.35 + (isForecast ? 0 : (i % 2 === 0 ? 1 : -1)));
    const rulForecast = Math.max(0, Math.round(720 - (20 + i) * 28));

    points.push({
      timestamp: dayStr,
      dayIndex: i,
      overallHealth: health,
      bearingWearIndex: wearIndex,
      vibrationRms: vibRms,
      envelopePeakG,
      temperatureC: tempC,
      rulForecastHours: rulForecast,
      isForecast,
    });
  }

  return points;
}

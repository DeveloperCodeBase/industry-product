import { DiagramAnnotation } from '../types';

export interface IndustrialTechnicalDiagram {
  id: string;
  assetId: string;
  titleFa: string;
  titleEn: string;
  code: string;
  standard: string;
  descriptionFa: string;
  svgType: 'compressor_pid' | 'pump_cross_section' | 'substation_sld';
}

export const TECHNICAL_DIAGRAMS: IndustrialTechnicalDiagram[] = [
  {
    id: 'diagram-k04-pid',
    assetId: 'compressor-04',
    titleFa: 'نقشه فرآیندی P&ID و سنسورهای ابزاردقیق کمپرسور گاز K-04',
    titleEn: 'Compressor K-04 Process & Instrumentation Diagram (P&ID)',
    code: 'PID-VISTA-COMP-04-REV04',
    standard: 'ANSI/ISA-5.1 & API 617',
    descriptionFa: 'شامل موقعیت سنسورهای ارتعاشی شتاب‌سنج پیزوالکتریک، پروب‌های مجاورتی جریان گردابی جابجایی شفت و ترانسمیترهای فشار تفاضلی آب‌بند گاز',
    svgType: 'compressor_pid',
  },
  {
    id: 'diagram-p02-cross',
    assetId: 'pump-02',
    titleFa: 'نقشه برش مکانیکی مقطع پمپ و پلان سیل Plan 53A',
    titleEn: 'Centrifugal Pump P-02 Cross Section & API 682 Seal Plan',
    code: 'MEC-VISTA-PUMP-02-CS02',
    standard: 'API 610 12th Ed / ISO 13709',
    descriptionFa: 'جزئیات محفظه یاتاقان‌ها، ژورنال برینگ، محفظه آب‌بند و مسیر چرخش سیال بافر کوئنچ مخزن تحت فشار نیتروژن',
    svgType: 'pump_cross_section',
  },
  {
    id: 'diagram-substation-20kv',
    assetId: 'substation-01',
    titleFa: 'نقشه تک‌خطی SLD تابلوی فشارمتوسط ۲۰ کیلوولت و درایو VFD',
    titleEn: 'Substation 20kV MV Switchgear & VFD Single Line Diagram',
    code: 'ELE-VISTA-SLD-20KV-REV02',
    standard: 'IEC 62271-200 & IEEE 1588',
    descriptionFa: 'جانمایی ترانسفورماتور ایزولاسیون، درایو کنترل دور و نمونه‌برداری ترانسفورماتور جریان CT/PT با پروتکل حقیقت',
    svgType: 'substation_sld',
  },
];

export const INITIAL_DIAGRAM_ANNOTATIONS: DiagramAnnotation[] = [
  {
    id: 'ann-001',
    diagramId: 'diagram-k04-pid',
    diagramTitle: 'کمپرسور گاز K-04',
    xPercent: 28.5,
    yPercent: 42.0,
    authorName: 'مهندس آریا کاویانی',
    authorRole: 'سرپرست قابلیت اطمینان و ارتعاشات',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
    category: 'vibration_defect',
    severity: 'critical',
    title: 'افزایش دامنه هارمونیک BPFO روی پروب شتاب‌سنج محرک',
    comment: 'سنسور شتاب‌سنج پیزوالکتریک روی یاتاقان دیس‌شارژ قله ارتعاشی ۱۲۷ هرتز با دامنه ۱.۹g نشان می‌دهد. پایش روزانه و آماده‌سازی روانکار ضروری است.',
    timestamp: '۱۴۰۵/۰۶/۰۵ - ۱۰:۱۵',
    status: 'open',
  },
  {
    id: 'ann-002',
    diagramId: 'diagram-k04-pid',
    diagramTitle: 'کمپرسور گاز K-04',
    xPercent: 71.0,
    yPercent: 36.5,
    authorName: 'علیرضا رستمی',
    authorRole: 'تکنسین ارشد اتاق کنترل',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    category: 'maintenance_note',
    severity: 'warning',
    title: 'افت فشار گاز آب‌بندی اولیه در رگولاتور PCV-102',
    comment: 'شیر فشارشکن گاز نیتروژن بافر نوسان ۲۵۰ میلی‌بار دارد. فیلتر ورودی ۵ میکرونی در شیفت بعدی تمیزکاری شود.',
    timestamp: '۱۴۰۵/۰۶/۰۳ - ۱۴:۴۰',
    status: 'in_review',
  },
  {
    id: 'ann-003',
    diagramId: 'diagram-k04-pid',
    diagramTitle: 'کمپرسور گاز K-04',
    xPercent: 50.0,
    yPercent: 78.0,
    authorName: 'سارا مهدوی',
    authorRole: 'ممیز حقیقت داده و استاندارد ISO 55000',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    category: 'calibration_audit',
    severity: 'info',
    title: 'برچسب کالیبراسیون ترانسمیتر PT-404 تا ۱۴۰۵/۱۱ معتبر است',
    comment: 'کد گواهی کالیبراسیون آزمایشگاه مرجع برق توان‌گستر به بلوک حقیقت متصل شد و هش تاییدیه در زنجیره ثبت است.',
    timestamp: '۱۴۰۵/۰۵/۲۹ - ۰۹:۰۰',
    status: 'resolved',
    resolvedBy: 'سارا مهدوی',
    resolvedAt: '۱۴۰۵/۰۵/۳۰ - ۱۱:۰۰',
  },
  {
    id: 'ann-004',
    diagramId: 'diagram-p02-cross',
    diagramTitle: 'پمپ سانتریفیوژ P-02',
    xPercent: 36.0,
    yPercent: 55.0,
    authorName: 'دکتر علی شفیعی‌زاده',
    authorRole: 'مدیر پروژه و استقرار دوقلو',
    authorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80',
    category: 'design_change',
    severity: 'warning',
    title: 'نصب پروب دمای RTD پلاتینیوم دوگانه درون کاسه سیل',
    comment: 'به منظور ارتقای دوقلوی سطح ۳ به سطح ۴، سنسور حرارتی کمکی PT100 در فاز اورهال پاییزه روی سیل مکانیکی ونت پلن ۵۳ مستقر خواهد شد.',
    timestamp: '۱۴۰۵/۰۶/۰۱ - ۱۶:۲۰',
    status: 'open',
  },
];

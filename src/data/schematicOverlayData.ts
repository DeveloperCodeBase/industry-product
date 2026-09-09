import { ComponentHealthRecord, MaintenanceIntervention } from '../types';

export interface MachinePartHotspot {
  id: string;
  schematicId: string;
  nameFa: string;
  nameEn: string;
  code: string;
  tag: string;
  category: 'bearing' | 'seal' | 'impeller' | 'motor' | 'valve' | 'sensor' | 'piping' | 'auxiliary';
  xPercent: number; // 0-100% position on canvas
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
  shape: 'circle' | 'rect';
  healthScore: number; // 0-100%
  criticality: 'critical' | 'high' | 'medium' | 'low';
  rulHours: number; // Remaining Useful Life
  status: 'normal' | 'warning' | 'critical';
  currentReadings: {
    vibration?: string;
    temperature?: string;
    pressure?: string;
    speedRpm?: number;
    faultFrequency?: string;
  };
  specs: {
    manufacturer: string;
    modelNumber: string;
    standard: string;
    clearanceTolerance: string;
    lubricantType: string;
    replacementCycleHours: number;
    operatingHoursSoFar: number;
    warehouseStockCount: number;
  };
  relatedMaintenanceLogs: PartMaintenanceLog[];
  relatedDocumentation: PartDocumentLink[];
}

export interface PartMaintenanceLog {
  id: string;
  workOrderId: string;
  titleFa: string;
  titleEn: string;
  date: string;
  technician: string;
  technicianRole: string;
  type: 'preventive' | 'corrective' | 'emergency' | 'calibration' | 'inspection';
  status: 'completed' | 'in_progress' | 'scheduled' | 'overdue';
  severity: 'critical' | 'warning' | 'info';
  findingsFa: string;
  actionsTakenFa: string;
  economicSavingsMillionTomans: number;
  preventedDowntimeHours: number;
  truthBlockHash?: string;
  partsReplaced?: string[];
}

export interface PartDocumentLink {
  id: string;
  docType: 'sop' | 'manual' | 'standard' | 'drawing' | 'bom' | 'certificate' | 'safety';
  docCode: string;
  titleFa: string;
  titleEn: string;
  category: string;
  summaryFa: string;
  pageReference?: string;
  truthSigned: boolean;
  lastRevisionDate: string;
  keyParameters: { label: string; value: string }[];
}

export interface IndustrialSchematicItem {
  id: string;
  assetId: string;
  titleFa: string;
  titleEn: string;
  code: string;
  categoryFa: string;
  standard: string;
  descriptionFa: string;
  svgType: 'compressor_pid' | 'pump_cross_section' | 'gas_turbine' | 'substation_sld';
  isCustomUpload?: boolean;
  uploadedImageUrl?: string;
  parts: MachinePartHotspot[];
}

export const PRESET_SCHEMATICS: IndustrialSchematicItem[] = [
  {
    id: 'schematic-k04-pid',
    assetId: 'compressor-04',
    titleFa: 'نقشه فرآیندی P&ID و سنسورهای ابزاردقیق کمپرسور K-04',
    titleEn: 'Centrifugal Gas Compressor K-04 P&ID & Instrumentation Diagram',
    code: 'PID-VISTA-COMP-04-REV04',
    categoryFa: 'تجهیزات دوار فرآیندی گاز ترش',
    standard: 'ANSI/ISA-5.1 & API 617 8th Edition',
    descriptionFa: 'جانمایی خطوط مکش، دیس‌شارژ، محفظه بیرینگ‌های ژورنال و رانش، آب‌بند گاز خشک دوگانه و ترانسمیترهای پایش وضعیت',
    svgType: 'compressor_pid',
    parts: [
      {
        id: 'part-k04-bearing-de',
        schematicId: 'schematic-k04-pid',
        nameFa: 'مجموعه بیرینگ محرک غلتشی جلو (Drive End Bearing)',
        nameEn: 'Drive End Roller Bearing Assembly (SKF 22318/C3)',
        code: 'BRG-DE-401',
        tag: 'DE-BEARING',
        category: 'bearing',
        xPercent: 33.7,
        yPercent: 38.0,
        widthPercent: 9.5,
        heightPercent: 12.0,
        shape: 'circle',
        healthScore: 58,
        criticality: 'critical',
        rulHours: 340,
        status: 'critical',
        currentReadings: {
          vibration: 'RMS: 4.8 mm/s | Peak: 6.2 mm/s',
          temperature: '84.5 °C',
          faultFrequency: 'BPFO: 127.4 Hz (دامنه 1.9g اینولپ)',
          speedRpm: 2980,
        },
        specs: {
          manufacturer: 'SKF Sweden / تخصصی توربوماشین',
          modelNumber: '22318 EK/C3 Spherical Roller Bearing',
          standard: 'ISO 15 / DIN 635-2',
          clearanceTolerance: 'لقی شعاعی C3: ۰.۰۸۰ تا ۰.۱۰۵ میلی‌متر',
          lubricantType: 'Mobil Polyrex EM تمام‌سنتتیک با پایه پلی‌اوره',
          replacementCycleHours: 16000,
          operatingHoursSoFar: 14280,
          warehouseStockCount: 2,
        },
        relatedMaintenanceLogs: [
          {
            id: 'log-k04-b1',
            workOrderId: 'WO-8419-VIB',
            titleFa: 'روانکاری اضطراری و ممیزی ارتعاشات طیف فرکانسی اینولپ',
            titleEn: 'Emergency Relubrication & Envelope Vibration Spectrum Audit',
            date: '۱۴۰۵/۰۶/۰۲ - ۱۰:۱۵',
            technician: 'علیرضا رستمی / مهندس آریا کاویانی',
            technicianRole: 'سرپرست ارتعاشات و تکنسین شیفت مکانیک',
            type: 'corrective',
            status: 'completed',
            severity: 'critical',
            findingsFa: 'شناسایی قله شتاب اینولپ ۱۲۷ هرتز منطبق بر فرکانس عیب رینگ خارجی (BPFO) یاتاقان و جهش شاخص کرتوزیس به ۴.۳.',
            actionsTakenFa: 'تزریق ۱۵۰ گرم گریس سنتتیک فشاربالا و پایش لایه‌مرزی؛ ارتعاش فوری ۲۲٪ افت داشت اما ریسک پیتینگ رینگ خارجی پایدار است.',
            economicSavingsMillionTomans: 850,
            preventedDowntimeHours: 14,
            truthBlockHash: '0x7f9a1b4c3e2d8f90a1b2c3d4e5f6a7b8c9d0e1f2',
            partsReplaced: ['روانکار سنتتیک ISO VG 220'],
          },
          {
            id: 'log-k04-b2',
            workOrderId: 'WO-8480-REP',
            titleFa: 'دستور کار تعویض کامل بیرینگ در پنجره اورهال ماه آینده',
            titleEn: 'Scheduled Overhaul Bearing Replacement Work Order',
            date: '۱۴۰۵/۰۶/۱۰ - ۰۸:۰۰',
            technician: 'تیم تخصصی مکانیک ویستا و پیمانکار اورهال',
            technicianRole: 'اکیپ تعمیرات اساسی توربوکمپرسور',
            type: 'emergency',
            status: 'in_progress',
            severity: 'critical',
            findingsFa: 'مدل رگرسیون پیش‌بین زوال ویبول با اطمینان ۹۸٪ ضرورت تعویض قبل از رسیدن ساعت کارکرد به ۱۵۰۰۰ ساعت را تایید کرده است.',
            actionsTakenFa: 'کیت بیرینگ SKF 22318 C3 از انبار تخصصی رزرو شد، فیکسچرهای هیدرولیک جااندازی و گرم‌کن القایی آماده به کار گردید.',
            economicSavingsMillionTomans: 3100,
            preventedDowntimeHours: 36,
            truthBlockHash: '0x88f2c19e34b071a9c3e2d4f8a1b5c9e2d3f4a5b6',
          },
        ],
        relatedDocumentation: [
          {
            id: 'doc-k04-sop-bearing',
            docType: 'sop',
            docCode: 'SOP-MEC-VISTA-12',
            titleFa: 'دستورالعمل مهندسی پایش و تعویض بیرینگ‌های غلتشی سرعت‌بالا',
            titleEn: 'Standard Operating Procedure: High-Speed Rolling Bearings Inspection',
            category: 'روش اجرایی استاندارد (SOP)',
            summaryFa: 'مراحل بازرسی لقی شعاعی، نصب با القاگر مغناطیسی تا حداکثر دمای ۱۱۰°C و ممیزی ارتعاشی پس از راه‌اندازی.',
            pageReference: 'فصل ۴، صفحات ۴۵ الی ۵۲',
            truthSigned: true,
            lastRevisionDate: '۱۴۰۵/۰۴/۱۵',
            keyParameters: [
              { label: 'ماکزیمم دمای نصب با گرم‌کن القایی', value: '110 °C' },
              { label: 'حد هشدار ارتعاش ISO Zone C', value: '4.5 mm/s RMS' },
              { label: 'حد توقف اضطراری Trip Zone D', value: '7.1 mm/s RMS' },
            ],
          },
          {
            id: 'doc-k04-iso-10816',
            docType: 'standard',
            docCode: 'ISO 10816-3 / ISO 20816',
            titleFa: 'استاندارد بین‌المللی ارزیابی ارتعاشات مکانیکی ماشین‌آلات صنعتی',
            titleEn: 'Mechanical Vibration Evaluation of Machine Vibration on Non-Rotating Parts',
            category: 'استاندارد بین‌المللی کیفیت',
            summaryFa: 'کلاس ماشینی Group 1 (موتورها و کمپرسورهای بالای ۳۰۰ کیلووات نصب‌شده روی فونداسیون صلب). مرز هشدار و تریپ ارتعاشات.',
            pageReference: 'بخش ۳.۲ جدول کلاس ۱',
            truthSigned: true,
            lastRevisionDate: '۱۴۰۴/۱۱/۲۰',
            keyParameters: [
              { label: 'محدوده مجاز کارکرد عادی (Zone A)', value: '< 2.3 mm/s' },
              { label: 'محدوده قابل‌قبول موقت (Zone B)', value: '2.3 - 4.5 mm/s' },
              { label: 'محدوده اخطار و تعمیرات (Zone C)', value: '4.5 - 7.1 mm/s' },
              { label: 'محدوده توقف فوری (Zone D)', value: '> 7.1 mm/s' },
            ],
          },
          {
            id: 'doc-k04-bom-skf',
            docType: 'bom',
            docCode: 'BOM-SKF-22318-EK',
            titleFa: 'شناسنامه قطعه یدکی و مشخصات متالورژی برینگ SKF',
            titleEn: 'Bill of Materials & Metallurgical Specifications: SKF 22318',
            category: 'کاتالوگ قطعات یدکی (BOM)',
            summaryFa: 'مشخصات فولاد بلبرینگ کربن‌کروم با عملیات حرارتی سخت‌کاری سطحی، قفسه برنجی تراشکاری‌شده ماشین‌کاری (M Caged).',
            pageReference: 'کاتالوگ جامع SKF صفحه ۴۸۲',
            truthSigned: true,
            lastRevisionDate: '۱۴۰۵/۰۱/۱۰',
            keyParameters: [
              { label: 'قطر داخلی شفت (d)', value: '90 mm' },
              { label: 'قطر خارجی هوزینگ (D)', value: '190 mm' },
              { label: 'پهنای یاتاقان (B)', value: '64 mm' },
              { label: 'ظرفیت بار دینامیکی (C)', value: '640 kN' },
            ],
          },
        ],
      },
      {
        id: 'part-k04-seal',
        schematicId: 'schematic-k04-pid',
        nameFa: 'آب‌بند مکانیکی گازی دوگانه (Tandem Dry Gas Seal)',
        nameEn: 'Tandem Dry Gas Seal with Intermediate Labyrinth',
        code: 'SEAL-DGS-102',
        tag: 'DGS-SEAL',
        category: 'seal',
        xPercent: 56.5,
        yPercent: 38.0,
        widthPercent: 9.0,
        heightPercent: 12.0,
        shape: 'circle',
        healthScore: 84,
        criticality: 'high',
        rulHours: 2400,
        status: 'normal',
        currentReadings: {
          pressure: 'فشار تفاضلی گاز بافر: 2.8 bar',
          temperature: '52.0 °C',
          vibration: 'لرزش بدنه سیل: 1.1 mm/s',
          faultFrequency: 'نشتی ونت اولیه: 1.2 Nm³/h (نرمال)',
        },
        specs: {
          manufacturer: 'EagleBurgmann / John Crane',
          modelNumber: 'DGS 80mm Dual Gas Seal Plan 72/76',
          standard: 'API 682 4th Edition / API 617',
          clearanceTolerance: 'شکاف گازی روتاری/استاتور: ۳.۵ میکرومتر',
          lubricantType: 'گاز ازت خشک خلوص ۹۹.۹۹٪ (Dry N2 Buffer)',
          replacementCycleHours: 24000,
          operatingHoursSoFar: 8400,
          warehouseStockCount: 1,
        },
        relatedMaintenanceLogs: [
          {
            id: 'log-k04-s1',
            workOrderId: 'WO-8104-SEAL',
            titleFa: 'سرویس فیلتر دوقلوی گاز آب‌بندی اولیه نیتروژن',
            titleEn: 'Primary Seal Gas Duplex Filter Cartridge Servicing',
            date: '۱۴۰۵/۰۴/۱۸ - ۱۱:۳۰',
            technician: 'رضا کاظمی',
            technicianRole: 'تکنسین سیستم‌های کمکی و فلوئید',
            type: 'preventive',
            status: 'completed',
            severity: 'info',
            findingsFa: 'افت فشار فیلتر کارتریجی Coalescing به ۳۵۰ میلی‌بار رسیده بود که با سوییچ به المنت یدکی رفع شد.',
            actionsTakenFa: 'المنت‌های ۲ میکرونی تعویض و محفظه با گاز نیتروژن پرژ گردید. فشار دیفرانسیلی به حالت استاندارد ۱۰۰ میلی‌بار بازگشت.',
            economicSavingsMillionTomans: 380,
            preventedDowntimeHours: 8,
            truthBlockHash: '0x12a3b4c5d6e7f890a1b2c3d4e5f6a7b8c9d0e1f2',
            partsReplaced: ['کارتریج فیلتر ۲ میکرون کوالسنت'],
          },
        ],
        relatedDocumentation: [
          {
            id: 'doc-k04-api-682',
            docType: 'standard',
            docCode: 'API 682 / ISO 21049',
            titleFa: 'استاندارد سیستم‌های آب‌بندی شفت پمپ‌ها و کمپرسورهای گریز از مرکز',
            titleEn: 'Pumps - Shaft Sealing Systems for Centrifugal and Rotary Pumps',
            category: 'استاندارد انجمن نفت آمریکا (API)',
            summaryFa: 'الزامات پیکربندی پلان ۷۲ و ۷۶، محدوده مجاز نرخ نشتی گاز اولیه و سنسورهای مانیتورینگ جریان ونت ثانویه.',
            pageReference: 'بخش پیوست E، پلان‌های گازی',
            truthSigned: true,
            lastRevisionDate: '۱۴۰۴/۰۹/۱۰',
            keyParameters: [
              { label: 'حداقل فشار بافر نسبت به محفظه فرآیندی', value: '1.5 bar Delta-P' },
              { label: 'حداکثر دمای مجاز فیس‌های کربنی', value: '150 °C' },
              { label: 'نقطه آلارم نشتی گاز ونت اول', value: '4.5 Nm³/h' },
            ],
          },
        ],
      },
      {
        id: 'part-k04-impeller',
        schematicId: 'schematic-k04-pid',
        nameFa: 'پروانه‌های گریز از مرکز مرحله ۳ (Inconel 718 Impeller)',
        nameEn: 'Centrifugal Impeller Stage 3 - Five-Axis Milled',
        code: 'IMP-STG3-K04',
        tag: 'IMPELLER-S3',
        category: 'impeller',
        xPercent: 44.5,
        yPercent: 49.0,
        widthPercent: 9.0,
        heightPercent: 12.0,
        shape: 'circle',
        healthScore: 76,
        criticality: 'high',
        rulHours: 5600,
        status: 'normal',
        currentReadings: {
          pressure: 'فشار تراکم مرحله ۳: 18.4 bar',
          temperature: '112.0 °C گاز خروجی',
          vibration: 'دامنه 1X پروانه: 1.8 mm/s',
          speedRpm: 10450,
        },
        specs: {
          manufacturer: 'Siemens Energy / ساخت ویژه ویستا',
          modelNumber: 'IMP-K04-INC718-450mm',
          standard: 'API 617 / NACE MR0175 (ضد گاز ترش H2S)',
          clearanceTolerance: 'لقی محوری لابیرنت: ۰.۳۵ میلی‌متر',
          lubricantType: 'فاقد تماس مستقیم (محفظه گاز خشک)',
          replacementCycleHours: 48000,
          operatingHoursSoFar: 22400,
          warehouseStockCount: 1,
        },
        relatedMaintenanceLogs: [
          {
            id: 'log-k04-imp1',
            workOrderId: 'WO-7920-BAL',
            titleFa: 'بالانس دینامیکی روتور و ممیزی رسوب‌زدایی تیغه‌های ایمپلر',
            titleEn: 'Rotor Dynamic High-Speed Balancing & Impeller Wash',
            date: '۱۴۰۴/۱۲/۱۴ - ۰۹:۰۰',
            technician: 'آزمایشگاه ارتعاشات دینامیک ویستا',
            technicianRole: 'مهندس ارشد بالانس دینامیکی',
            type: 'inspection',
            status: 'completed',
            severity: 'info',
            findingsFa: 'انحراف آنبالانسی معادل ۱.۸ گرم‌میلی‌متر در زاویه ۱۲۰ درجه ناشی از رسوب هیدروکربن‌های سنگین.',
            actionsTakenFa: 'شستشوی التراسونیک تیغه‌ها، جرم‌برداری و تراز وزنی مطابق گرید ISO 1940 G1.0 با موفقیت انجام شد.',
            economicSavingsMillionTomans: 1200,
            preventedDowntimeHours: 24,
            truthBlockHash: '0x99a8b7c6d5e4f3210a1b2c3d4e5f6a7b8c9d0e1f',
          },
        ],
        relatedDocumentation: [
          {
            id: 'doc-k04-iso-1940',
            docType: 'standard',
            docCode: 'ISO 1940-1 / ISO 21940',
            titleFa: 'استاندارد کیفیت بالانس مکانیکی روتورهای صلب ماشین‌آلات دوار',
            titleEn: 'Mechanical Vibration - Balance Quality Requirements for Rotors',
            category: 'استاندارد بالانس و لرزش',
            summaryFa: 'تعیین گرید بالانس G1.0 برای کمپرسورهای گریز از مرکز گاز در دورهای بالای ۱۰,۰۰۰ RPM.',
            pageReference: 'بخش ۴، جداول مجاز خارج از مرکزی جرم',
            truthSigned: true,
            lastRevisionDate: '۱۴۰۴/۰۸/۱۲',
            keyParameters: [
              { label: 'گرید بالانس مجاز', value: 'G 1.0 (تخصصی توربین)' },
              { label: 'حداکثر خارج از مرکزی باقیمانده', value: '0.8 g.mm/kg' },
            ],
          },
        ],
      },
      {
        id: 'part-k04-motor',
        schematicId: 'schematic-k04-pid',
        nameFa: 'الکتروموتور محرک ۵.۲ مگاوات (5.2MW Induction Drive Motor)',
        nameEn: 'Medium Voltage Squirrel Cage Induction Motor (6.6kV)',
        code: 'MTR-5.2MW-K04',
        tag: 'MAIN-MOTOR',
        category: 'motor',
        xPercent: 17.5,
        yPercent: 71.0,
        widthPercent: 10.0,
        heightPercent: 12.0,
        shape: 'rect',
        healthScore: 91,
        criticality: 'critical',
        rulHours: 12000,
        status: 'normal',
        currentReadings: {
          temperature: 'دمای استاتور: 88.5 °C (کلاس حرارتی H)',
          vibration: 'ارتعاش یاتاقان موتور: 1.4 mm/s',
          speedRpm: 2985,
        },
        specs: {
          manufacturer: 'ABB / Jamco High Voltage',
          modelNumber: 'AMI 500L4A BAFT',
          standard: 'IEC 60034-1 / IEEE 841',
          clearanceTolerance: 'فاصله هوایی روتور/استاتور: ۲.۱ میلی‌متر',
          lubricantType: 'روغن گردشی ISO VG 46 با کولر آبی',
          replacementCycleHours: 60000,
          operatingHoursSoFar: 18400,
          warehouseStockCount: 0,
        },
        relatedMaintenanceLogs: [
          {
            id: 'log-k04-mtr1',
            workOrderId: 'WO-7620-ELEC',
            titleFa: 'آزمون تخلیه جزئی (Partial Discharge) و مقاومت عایقی مگر سیم‌پیچ',
            titleEn: 'Stator Partial Discharge & Insulation Resistance Megger Test',
            date: '۱۴۰۵/۰۲/۱۵ - ۰۸:۰۰',
            technician: 'سید محسن حسینی',
            technicianRole: 'مهندس ارشد برق و حفاظت فشار متوسط',
            type: 'inspection',
            status: 'completed',
            severity: 'info',
            findingsFa: 'مقاومت عایقی بالاتر از ۵ گیگااهم در ولتاژ تست ۵۰۰۰ ولت DC؛ شاخص پلاریزاسیون (PI) برابر ۳.۴.',
            actionsTakenFa: 'سیم‌پیچ‌ها از گرد و غبار تمیزکاری شد، هیترهای ضدمیعانات در حالت اتوماتیک اعتبارسنجی شدند.',
            economicSavingsMillionTomans: 640,
            preventedDowntimeHours: 10,
            truthBlockHash: '0x44d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5',
          },
        ],
        relatedDocumentation: [
          {
            id: 'doc-k04-iec-60034',
            docType: 'standard',
            docCode: 'IEC 60034-1 / IEEE 43',
            titleFa: 'استاندارد بین‌المللی ارزیابی سیم‌پیچ‌های الکتریکی ماشین‌های دوار',
            titleEn: 'Rotating Electrical Machines - Rating and Performance',
            category: 'استاندارد الکتریکال',
            summaryFa: 'معیارهای قبولی آزمون شاخص پولاریزاسیون، حداکثر افزایش دمای مجاز عایق‌های کلاس F و H.',
            pageReference: 'بخش ۸.۴ جدول تست‌های عایقی',
            truthSigned: true,
            lastRevisionDate: '۱۴۰۴/۱۰/۰۵',
            keyParameters: [
              { label: 'حداقل شاخص پولاریزاسیون (PI)', value: '> 2.0 (مطلوب)' },
              { label: 'کلاس عایقی سیم‌پیچ', value: 'Class H (180 °C max)' },
            ],
          },
        ],
      },
      {
        id: 'part-k04-coupling',
        schematicId: 'schematic-k04-pid',
        nameFa: 'کوپلینگ انعطاف‌پذیر دیسکی شفت اصلی (Flexible Disc Coupling)',
        nameEn: 'All-Metal Flexible Disc Pack Shaft Coupling',
        code: 'CPL-FLX-01',
        tag: 'SHAFT-COUPLING',
        category: 'auxiliary',
        xPercent: 26.0,
        yPercent: 54.0,
        widthPercent: 7.5,
        heightPercent: 9.0,
        shape: 'circle',
        healthScore: 69,
        criticality: 'medium',
        rulHours: 1100,
        status: 'warning',
        currentReadings: {
          vibration: 'قله ارتعاشی 2X شفت: 2.9 mm/s',
          temperature: '48.0 °C',
        },
        specs: {
          manufacturer: 'Flender / Rexnord Thomas',
          modelNumber: 'Thomas Series 71 Disc Pack',
          standard: 'API 671 / ISO 10441',
          clearanceTolerance: 'انحراف عدم‌هم‌محوری مجاز: ۰.۰۵ میلی‌متر',
          lubricantType: 'خشک بدون نیاز به روانکار (Dry Disc Pack)',
          replacementCycleHours: 20000,
          operatingHoursSoFar: 14200,
          warehouseStockCount: 2,
        },
        relatedMaintenanceLogs: [
          {
            id: 'log-k04-cpl1',
            workOrderId: 'WO-8310-ALIGN',
            titleFa: 'تراز لیزری شفت کوپلینگ موتور و کمپرسور',
            titleEn: 'Laser Alignment Audit & Bolt Torque Tightening',
            date: '۱۴۰۵/۰۵/۱۰ - ۱۳:۰۰',
            technician: 'حمیدرضا مریدی',
            technicianRole: 'کارشناس مکانیک دقیق و الاینمنت',
            type: 'corrective',
            status: 'completed',
            severity: 'warning',
            findingsFa: 'عدم هم‌محوری زاویه‌ای معادل ۰.۱۲ درجه که موجب ظهور قله ۲X در طیف ارتعاشات شده بود.',
            actionsTakenFa: 'شیم‌گذاری فولاد زنگ‌نزن زیر پایه‌های جلو الکتروموتور به ضخامت ۰.۴۵ میلی‌متر، انحراف به ۰.۰۳ میلی‌متر تقلیل یافت.',
            economicSavingsMillionTomans: 520,
            preventedDowntimeHours: 8,
            truthBlockHash: '0x33b2a1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4',
          },
        ],
        relatedDocumentation: [
          {
            id: 'doc-k04-api-671',
            docType: 'standard',
            docCode: 'API 671 / ISO 10441',
            titleFa: 'استاندارد کوپلینگ‌های انعطاف‌پذیر ویژه پالایشگاه‌ها و صنایع گاز',
            titleEn: 'Special-Purpose Couplings for Petroleum and Gas Services',
            category: 'استاندارد API',
            summaryFa: 'الزامات تحمل گشتاور استارت، ضریب اطمینان دیسک‌پک‌های ضدزنگ و تلرانس بالانس دینامیکی.',
            pageReference: 'بخش ۵ مشخصات طراحی دیسک',
            truthSigned: true,
            lastRevisionDate: '۱۴۰۴/۰۷/۱۵',
            keyParameters: [
              { label: 'حداکثر زاویه مجاز نامحوری حین کار', value: '0.25 deg' },
              { label: 'گشتاور مجاز طراحی (Peak Torque)', value: '18,500 N.m' },
            ],
          },
        ],
      },
      {
        id: 'part-k04-pt104',
        schematicId: 'schematic-k04-pid',
        nameFa: 'ترانسمیتر فشار تفاضلی خط دیس‌شارژ (PT-104)',
        nameEn: 'High-Precision Smart Differential Pressure Transmitter',
        code: 'PT-104',
        tag: 'PRESS-TRANSMITTER',
        category: 'sensor',
        xPercent: 72.5,
        yPercent: 42.0,
        widthPercent: 7.0,
        heightPercent: 9.0,
        shape: 'circle',
        healthScore: 94,
        criticality: 'medium',
        rulHours: 18000,
        status: 'normal',
        currentReadings: {
          pressure: '24.2 bar (فشار خروجی پایدار)',
        },
        specs: {
          manufacturer: 'Yokogawa / Rosemount',
          modelNumber: 'EJX110A Differential Pressure',
          standard: 'IEC 61508 SIL 2/3 / HART 7',
          clearanceTolerance: 'خطای اندازه‌گیری: ±۰.۰۴٪ اسپن',
          lubricantType: 'دیافراگم هیدروکربنی سیلیکونی',
          replacementCycleHours: 50000,
          operatingHoursSoFar: 12000,
          warehouseStockCount: 4,
        },
        relatedMaintenanceLogs: [
          {
            id: 'log-k04-pt1',
            workOrderId: 'WO-7500-CAL',
            titleFa: 'کالیبراسیون ۵ نقطه‌ای آزمایشگاه ابزاردقیق مرجع توان‌گستر',
            titleEn: '5-Point Pressure Calibration & SIL Loop Test',
            date: '۱۴۰۵/۰۳/۰۴ - ۱۰:۰۰',
            technician: 'سارا مهدوی / مهندس ابزاردقیق',
            technicianRole: 'ممیز حقیقت داده و آزمایشگاه کالیبراسیون',
            type: 'calibration',
            status: 'completed',
            severity: 'info',
            findingsFa: 'حداکثر رانش صفر معادل ۰.۰۲٪ که با کالیبراتور فلوک سری 754 تنظیم مجدد و خط صفر تثبیت شد.',
            actionsTakenFa: 'گواهی کالیبراسیون مرجع صادر و هش رمزنگاری‌شده در زنجیره بلوک حقیقت ثبت گردید.',
            economicSavingsMillionTomans: 220,
            preventedDowntimeHours: 4,
            truthBlockHash: '0x11e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2',
          },
        ],
        relatedDocumentation: [
          {
            id: 'doc-k04-cal-cert',
            docType: 'certificate',
            docCode: 'CERT-CAL-VISTA-404',
            titleFa: 'شناسنامه و گواهی رسمی کالیبراسیون آزمایشگاهی معتبر تا ۱۴۰۵/۱۱',
            titleEn: 'Official Metrological Calibration Certificate & Traceability',
            category: 'شناسنامه کالیبراسیون و حقیقت',
            summaryFa: 'گواهی ردیابی‌پذیر به آزمایشگاه ملی مرجع اوزان و مقیاس‌ها با خطای کمتر از ۰.۰۴٪.',
            pageReference: 'برگه ۱ گواهی پیوست',
            truthSigned: true,
            lastRevisionDate: '۱۴۰۵/۰۳/۰۴',
            keyParameters: [
              { label: 'شماره گواهی کالیبراسیون', value: 'CAL-VISTA-1405-098' },
              { label: 'تاریخ انقضای اعتبار', value: '۱۴۰۵/۱۱/۳۰' },
              { label: 'کلاس استاندارد', value: 'ISO/IEC 17025' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'schematic-p02-cross',
    assetId: 'pump-02',
    titleFa: 'نقشه برش مقطع مکانیکی پمپ هیدروکربنی P-02 و پلان ۵۳A',
    titleEn: 'Centrifugal Hydrocarbon Pump P-02 Mechanical Section & Plan 53A',
    code: 'MEC-VISTA-PUMP-02-CS02',
    categoryFa: 'پمپ‌های سانتریفیوژ فرآیندی پالایشگاهی',
    standard: 'API 610 12th Edition / ISO 13709',
    descriptionFa: 'جزئیات برش عرضی شفت، پوسته هیدرولیکی، محفظه یاتاقان‌های ژورنال و بال‌برینگ، کارتریج آب‌بند مکانیکی و مسیر مخزن کوئنچ',
    svgType: 'pump_cross_section',
    parts: [
      {
        id: 'part-p02-seal',
        schematicId: 'schematic-p02-cross',
        nameFa: 'کارتریج سیل مکانیکی پلان ۵۳A (Plan 53A Dual Seal)',
        nameEn: 'Cartridge Mechanical Seal Assembly (Plan 53A)',
        code: 'SEAL-P02-53A',
        tag: 'CARTRIDGE-SEAL',
        category: 'seal',
        xPercent: 31.0,
        yPercent: 50.0,
        widthPercent: 8.5,
        heightPercent: 16.0,
        shape: 'rect',
        healthScore: 62,
        criticality: 'critical',
        rulHours: 420,
        status: 'warning',
        currentReadings: {
          pressure: 'فشار مخزن بافر: 2.2 bar (آستانه هشدار)',
          temperature: '68.0 °C',
          vibration: '2.1 mm/s',
        },
        specs: {
          manufacturer: 'Flowserve / John Crane',
          modelNumber: 'BXQ 200 Dual Pressurized',
          standard: 'API 682 Category 2 / Plan 53A',
          clearanceTolerance: 'تخت بودن فیس‌های کربید سیلیسیم: ۲ باند نوری',
          lubricantType: 'روغن سنتتیک بافر مخصوص سیل ISO VG 22',
          replacementCycleHours: 16000,
          operatingHoursSoFar: 13800,
          warehouseStockCount: 1,
        },
        relatedMaintenanceLogs: [
          {
            id: 'log-p02-s1',
            workOrderId: 'WO-8240-SEAL',
            titleFa: 'شارژ اضطراری مخزن کوئنچ و تست نشتی هیدروکربن',
            titleEn: 'Barrier Fluid Replenishment & Helium Sniffing Test',
            date: '۱۴۰۵/۰۵/۲۸ - ۱۰:۴۵',
            technician: 'علیرضا رضوانی',
            technicianRole: 'تکنسین تعمیرات پمپ و سیل',
            type: 'corrective',
            status: 'completed',
            severity: 'warning',
            findingsFa: 'کاهش فشار مخزن بافر ناشی از فرار ملایم روغن از فیس ثانویه؛ نشتی سیال اصلی به اتمسفر صفر بوده است.',
            actionsTakenFa: 'تزریق ۲ لیتر مایع بافر جدید، پرژ ازت تا فشار ۲.۸ بار و بررسی نشت‌بندی با اسپری دتکتور.',
            economicSavingsMillionTomans: 480,
            preventedDowntimeHours: 8,
            truthBlockHash: '0xaa11bb22cc33dd44ee55ff66aa77bb88cc99dd00',
          },
        ],
        relatedDocumentation: [
          {
            id: 'doc-p02-sop-seal',
            docType: 'sop',
            docCode: 'SOP-PUMP-53A-REV3',
            titleFa: 'دستورالعمل جامع سرویس و تخلیه مخزن تحت فشار پلان ۵۳A',
            titleEn: 'Plan 53A Seal Support System Maintenance & Purge Procedure',
            category: 'دستورالعمل اجرایی (SOP)',
            summaryFa: 'مراحل ایزولاسیون، تهویه نیتروژن، نمونه‌گیری از سیال مانع جهت سنجش آلودگی به هیدروکربن سنگین.',
            pageReference: 'صفحه ۱۲ الی ۱۸',
            truthSigned: true,
            lastRevisionDate: '۱۴۰۴/۱۱/۰۱',
            keyParameters: [
              { label: 'حداقل فشار مجاز نیتروژن مخزن', value: '1.4 bar بالاتر از فشار مکش' },
              { label: 'حداکثر نرخ مصرف مایع بافر', value: '15 ml / 24 hours' },
            ],
          },
        ],
      },
      {
        id: 'part-p02-impeller',
        schematicId: 'schematic-p02-cross',
        nameFa: 'ایمپلر استنلس‌استیل ۳۱۶ هیدرولیکی (SS316 Closed Impeller)',
        nameEn: 'SS316 Enclosed Radial Flow Hydraulic Impeller',
        code: 'IMP-P02-SS',
        tag: 'IMPELLER-P02',
        category: 'impeller',
        xPercent: 45.0,
        yPercent: 50.0,
        widthPercent: 12.0,
        heightPercent: 20.0,
        shape: 'circle',
        healthScore: 79,
        criticality: 'high',
        rulHours: 7200,
        status: 'normal',
        currentReadings: {
          pressure: 'فشار خروجی: 12.5 bar',
          vibration: 'ارتعاش پروانه: 1.6 mm/s',
        },
        specs: {
          manufacturer: 'KSB / Sulzer Pumps',
          modelNumber: 'RDL 250-400 Impeller SS316L',
          standard: 'API 610 / ISO 13709',
          clearanceTolerance: 'لقی رینگ سایشی (Wear Ring): ۰.۲۵ میلی‌متر',
          lubricantType: 'فاقد نیاز به روانکار',
          replacementCycleHours: 32000,
          operatingHoursSoFar: 16000,
          warehouseStockCount: 2,
        },
        relatedMaintenanceLogs: [
          {
            id: 'log-p02-imp1',
            workOrderId: 'WO-7800-CLR',
            titleFa: 'اندازه‌گیری لقی رینگ سایشی و اصلاح کاویتاسیون موضعی',
            titleEn: 'Wear Ring Clearance Measurement & Cavitation Inspection',
            date: '۱۴۰۵/۰۲/۱۱ - ۱۴:۰۰',
            technician: 'مجید ترابی',
            technicianRole: 'سرپرست اکیپ تراشکاری و بازسازی پمپ',
            type: 'inspection',
            status: 'completed',
            severity: 'info',
            findingsFa: 'لقی بین پروانه و رینگ سایشی در محدوده استاندارد ۰.۲۸ میلی‌متر اندازه‌گیری شد؛ سایش جزئی در لبه ورودی تیغه.',
            actionsTakenFa: 'پولیش تیغه‌های ورودی، تعویض پیچ‌های محوری و گشتاوردهی مهره پروانه با ترک‌متر دقیق.',
            economicSavingsMillionTomans: 390,
            preventedDowntimeHours: 6,
            truthBlockHash: '0x55aa66bb77cc88dd99ee00ff11aa22bb33cc44dd',
          },
        ],
        relatedDocumentation: [
          {
            id: 'doc-p02-api-610',
            docType: 'standard',
            docCode: 'API 610 12th Ed',
            titleFa: 'استاندارد پمپ‌های گریز از مرکز صنایع نفت، پتروشیمی و گاز طبیعی',
            titleEn: 'Centrifugal Pumps for Petroleum, Petrochemical and Natural Gas Industries',
            category: 'استاندارد مرجع API',
            summaryFa: 'تعیین محدوده مجاز لقی رینگ‌های سایشی پوسته و پروانه، محدودیت‌های انحراف شفت و حداقل NPSH حاشیه ایمنی.',
            pageReference: 'بخش ۶.۷ رینگ‌های سایشی',
            truthSigned: true,
            lastRevisionDate: '۱۴۰۴/۰۶/۰۱',
            keyParameters: [
              { label: 'حداقل لقی شعاعی رینگ سایشی', value: '0.25 mm' },
              { label: 'ماکزیمم لقی قبل از تعویض', value: '0.50 mm (سقف تعویض)' },
            ],
          },
        ],
      },
    ],
  },
];

import React, { useState, useMemo } from 'react';
import {
  GitCompare,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Printer,
  Sparkles,
  Sliders,
  ShieldCheck,
  Building,
  Layers,
  Calendar,
  Hash,
  Filter,
  Eye,
  Columns,
  List
} from 'lucide-react';

export interface DiffLine {
  lineNumberA?: number;
  lineNumberB?: number;
  type: 'added' | 'removed' | 'modified' | 'unchanged';
  textA?: string;
  textB?: string;
  changeNoteFa?: string;
}

export interface DocumentVersionPair {
  id: string;
  titleFa: string;
  docCode: string;
  assetId: string;
  assetNameFa: string;
  versionA: {
    label: string;
    date: string;
    author: string;
    hash: string;
    status: string;
  };
  versionB: {
    label: string;
    date: string;
    author: string;
    hash: string;
    status: string;
  };
  metadataChanges: Array<{
    fieldFa: string;
    oldValue: string;
    newValue: string;
    impact: 'critical' | 'improvement' | 'neutral';
  }>;
  lines: DiffLine[];
}

export const DOCUMENT_COMPARISON_PAIRS: DocumentVersionPair[] = [
  {
    id: 'pair-contract',
    titleFa: 'قرارداد رسمی واگذاری و استقرار دوقلوی صنعتی ویستا (ثبت ۵۸۳۳۰۲)',
    docCode: 'VIN-IND-2026/09',
    assetId: 'compressor-04',
    assetNameFa: 'پتروشیمی و پالایشگاه گاز عسلویه',
    versionA: {
      label: 'ویرایش ۱.۲ (پیش‌نویس اولیه کارفرمایی)',
      date: '۱۴۰۴/۰۲/۱۵',
      author: 'امور حقوقی پیمانکاری',
      hash: '0x12a9bc44d019f301',
      status: 'منسوخ‌شده (Archived)'
    },
    versionB: {
      label: 'ویرایش ۲.۰ (نسخه نهایی مصوب با کد ثبتی ۵۸۳۳۰۲)',
      date: '۱۴۰۵/۰۶/۱۷',
      author: 'هیئت مدیره شرکت شبکه هوشمند ابتکار ویستا',
      hash: '0x583302abcdef9911',
      status: 'لازم‌الاجرا و فعال (Active Lawful)'
    },
    metadataChanges: [
      { fieldFa: 'شناسه ثبتی رسمی شرکت', oldValue: 'در شرف ثبت', newValue: 'شماره ثبت رسمی ۵۸۳۳۰۲ (سهامی خاص)', impact: 'improvement' },
      { fieldFa: 'سطح تضمین دسترسی پایش (SLA)', oldValue: '۹۸.۵٪ پایش روزانه', newValue: '۹۹.۹۵٪ بدون قطعی با جبران خسارت', impact: 'critical' },
      { fieldFa: 'ایزولاسیون شبکه صنعتی', oldValue: 'فایروال نرم‌افزاری معمولی', newValue: 'دیتادیود سخت‌افزاری منطبق بر IEC 62443-3-3', impact: 'critical' },
      { fieldFa: 'اعتبارسنجی حقیقت داده', oldValue: 'لاگ‌های معمولی دیتابیس', newValue: 'زنجیره بلوک حقیقت با امضای نانوثانیه PTP', impact: 'improvement' }
    ],
    lines: [
      {
        lineNumberA: 1,
        lineNumberB: 1,
        type: 'unchanged',
        textA: 'ماده ۱. طرفین قرارداد: این پیمان فیمابین مجتمع پتروشیمی عسلویه و شرکت فناور ویستا منعقد می‌گردد.',
        textB: 'ماده ۱. طرفین قرارداد: این پیمان فیمابین مجتمع پتروشیمی عسلویه و شرکت فناور ویستا منعقد می‌گردد.'
      },
      {
        lineNumberA: 2,
        lineNumberB: 2,
        type: 'modified',
        textA: 'ماده ۲. هویت حقوقی: شرکت ویستا به عنوان تیم مستقل نرم‌افزاری خدمات پشتیبانی را ارائه می‌دهد.',
        textB: 'ماده ۲. هویت حقوقی: شرکت شبکه هوشمند ابتکار ویستا (شماره ثبت ۵۸۳۳۰۲، عضو پارک علم و فناوری سمنان و نظام صنفی رایانه‌ای) به عنوان طرف دوم معرفی می‌گردد.',
        changeNoteFa: 'درج شماره ثبت رسمی ۵۸۳۳۰۲ و عضویت رسمی در پارک علم و فناوری'
      },
      {
        lineNumberA: 3,
        lineNumberB: 3,
        type: 'modified',
        textA: 'ماده ۳. سطح در دسترس بودن: سیستم در ساعات کاری اداری متعهد به دریافت اطلاعات از سنسورها است (۹۸.۵٪).',
        textB: 'ماده ۳. سطح در دسترس بودن: سامانه پلتفرم حقیقت متعهد به مانیتورینگ بلادرنگ با SLA حداقل ۹۹.۹۵٪ در کلیه ۲۴ ساعت شبانه‌روز و ایام تعطیل می‌باشد.',
        changeNoteFa: 'ارتقای تعهد آپ‌تایم از ۹۸.۵٪ به ۹۹.۹۵٪ با تضمین بدون وقفه'
      },
      {
        lineNumberA: 4,
        type: 'removed',
        textA: 'ماده ۴. تبادل ابری: داده‌های تله‌متری به سرور ابری خارج از سایت ارسال و ذخیره می‌شود.',
        changeNoteFa: 'حذف کامل انتقال ابری به دلیل الزامات امنیت ملی پدافند غیرعامل'
      },
      {
        lineNumberB: 4,
        type: 'added',
        textB: 'ماده ۴. معماری ایزوله لبه (Air-Gapped Edge): هیچ‌گونه داده‌ای به ابر خارجی ارسال نگردیده و تمامی پردازش‌ها در باکس‌های لبه صنعتی در محل کارخانه انجام می‌شود.',
        changeNoteFa: 'افزوده شدن استقرار ۱۰۰٪ ایزوله محلی بدون نیاز به اینترنت'
      },
      {
        lineNumberA: 5,
        lineNumberB: 5,
        type: 'unchanged',
        textA: 'ماده ۵. مدت قرارداد: مدت زمان اجرای پروژه و تحویل دوقلوی دیجیتال ۱۲ ماه شمسی است.',
        textB: 'ماده ۵. مدت قرارداد: مدت زمان اجرای پروژه و تحویل دوقلوی دیجیتال ۱۲ ماه شمسی است.'
      },
      {
        lineNumberB: 6,
        type: 'added',
        textB: 'ماده ۶. ثبت بلوک حقیقت: کلیه رویدادهای بحرانی و ارتعاشی موظف به ثبت در زنجیره هش SHA-256 غیرقابل دستکاری می‌باشند.',
        changeNoteFa: 'بند جدید الزام حقوقی زنجیره بلوک حقیقت (Cryptographic Truth Chain)'
      }
    ]
  },
  {
    id: 'pair-vibration-k04',
    titleFa: 'گزارش ممیزی ارتعاشات و سلامت یاتاقان کمپرسور K-04',
    docCode: 'VIN-AUD-2026-K04',
    assetId: 'compressor-04',
    assetNameFa: 'کمپرسور گاز فشار بالا K-04',
    versionA: {
      label: 'گزارش اولیه (شهریور ۱۴۰۴ - رخداد نقص فرکانسی)',
      date: '۱۴۰۴/۰۶/۱۰',
      author: 'تیم پایش ارتعاشات میدانی',
      hash: '0xbb1923485ccdde01',
      status: 'وضعیت بحرانی (Zone C Warning)'
    },
    versionB: {
      label: 'گزارش ممیزی نهایی (شهریور ۱۴۰۵ - پس از اورهال و تعویض)',
      date: '۱۴۰۵/۰۶/۰۲',
      author: 'مهندس آریا کاویانی (سرپرست ارتعاشات ویستا)',
      hash: '0x8f4c9a72b10e34d7',
      status: 'وضعیت استاندارد و سالم (Zone A Normal)'
    },
    metadataChanges: [
      { fieldFa: 'سرعت ارتعاش مؤثر RMS بدنه', oldValue: '۵.۴ میلی‌متر بر ثانیه (هشدار زرد)', newValue: '۱.۹ میلی‌متر بر ثانیه (سبز - عالی)', impact: 'improvement' },
      { fieldFa: 'شاخص کشیدگی توزیع (Kurtosis)', oldValue: '۴.۶ (وجود ضربه متناوب شدید)', newValue: '۲.۹۵ (توزیع نرمال گوسی)', impact: 'improvement' },
      { fieldFa: 'دامنه قله فرکانس BPFO (217Hz)', oldValue: '۰.۴۲ گرم شتاب اینولپ', newValue: 'کمتر از ۰.۰۳ گرم (حذف کامل اسپایک)', impact: 'critical' },
      { fieldFa: 'عمر مفید باقیمانده یاتاقان (RUL)', oldValue: '۲۴۰ ساعت (۱۰ روز)', newValue: '۲۲,۰۰۰ ساعت کارکرد ایمن', impact: 'improvement' }
    ],
    lines: [
      {
        lineNumberA: 1,
        lineNumberB: 1,
        type: 'unchanged',
        textA: 'موضوع: پایش طیف فرکانسی و تحلیل دمدولاسیون پوش هیلبرت شفت محرک اصلی کمپرسور K-04.',
        textB: 'موضوع: پایش طیف فرکانسی و تحلیل دمدولاسیون پوش هیلبرت شفت محرک اصلی کمپرسور K-04.'
      },
      {
        lineNumberA: 2,
        lineNumberB: 2,
        type: 'modified',
        textA: 'وضعیت بیرینگ: شواهد قطعی از بروز پیتینگ (Pitting) در شیار رینگ خارجی یاتاقان SKF 23144 مشاهده شد و اسپایک تیز در ۲۱۷.۴ هرتز ثبت گردید.',
        textB: 'وضعیت بیرینگ: یاتاقان جدید SKF 23144 CC با لقی مجاز C3 نصب و با گریس لیتیوم کمپلکس سنتتیک شارژ گردید؛ هیچ‌گونه اسپایک عیب مشاهده نمی‌شود.',
        changeNoteFa: 'رفع عیب مکانیکی و نصب یاتاقان استاندارد جدید'
      },
      {
        lineNumberA: 3,
        lineNumberB: 3,
        type: 'modified',
        textA: 'مقدار سرعت ارتعاش RMS: 5.4 mm/s - قرارگیری در ناحیه C استاندارد ISO 10816-3 (هشدار توقف).',
        textB: 'مقدار سرعت ارتعاش RMS: 1.9 mm/s - قرارگیری در ناحیه A استاندارد ISO 10816-3 (کیفیت نو و عالی).',
        changeNoteFa: 'کاهش ۶۵ درصدی دامنه ارتعاشات کل'
      },
      {
        lineNumberA: 4,
        type: 'removed',
        textA: 'توصیه اضطراری: محدودسازی دور کمپرسور به حداکثر ۸۰٪ بار نامی جهت جلوگیری از گریپاژ آنی شفت.',
        changeNoteFa: 'رفع محدودیت بار تولید'
      },
      {
        lineNumberB: 4,
        type: 'added',
        textB: 'توصیه جاری: ادامه بهره‌برداری با ۱۰۰٪ ظرفیت تولید نامی و روانکاری مجدد طبق برنامه بعد از ۱۵۰۰ ساعت کارکرد.',
        changeNoteFa: 'مجوز بهره‌برداری کامل با حداکثر ظرفیت'
      }
    ]
  },
  {
    id: 'pair-sop-pump',
    titleFa: 'دستورالعمل نگهداری و بازرسی پمپ سانتریفیوژ P-02',
    docCode: 'VIN-SOP-PMP-P02',
    assetId: 'pump-02',
    assetNameFa: 'پمپ سانتریفیوژ خوراک P-02',
    versionA: {
      label: 'ویرایش سال ۲۰۲۱ (نگهداری سنتی زمان‌محور PM)',
      date: '۱۴۰۰/۰۳/۱۵',
      author: 'اداره نگهداری و تعمیرات پالایشگاه',
      hash: '0x3310aa881122ccdd',
      status: 'منسوخ (Traditional PM)'
    },
    versionB: {
      label: 'ویرایش سال ۲۰۲۶ (نگهداری هوشمند مبتنی بر شرایط CBM)',
      date: '۱۴۰۵/۰۲/۱۴',
      author: 'دکتر علی شفیعی‌زاده (مدیر استقرار دوقلو ویستا)',
      hash: '0x4e61d8b9201fa49c',
      status: 'مصوب هوشمند (AI CBM Standard)'
    },
    metadataChanges: [
      { fieldFa: 'استراتژی نگهداری', oldValue: 'تعمیرات دوره‌ای هر ۶ ماه یکبار (حتی در صورت سلامت قطعه)', newValue: 'نگهداری مبتنی بر شرایط واقعی (CBM) و مدل پیش‌بین RUL', impact: 'improvement' },
      { fieldFa: 'تشخیص کاویتاسیون', oldValue: 'شنیدن صدای گوش تکنسین میدانی', newValue: 'سنسور آکوستیک امیشن اولتراسونیک و سایدباندهای BPF', impact: 'critical' },
      { fieldFa: 'رویه هم‌راستاسازی', oldValue: 'ساعت اندیکاتور دستی سنتی', newValue: 'سیستم لیزری اتوماتیک ۵ محوره با تلرانس ۰.۰۲ میلی‌متر', impact: 'improvement' }
    ],
    lines: [
      {
        lineNumberA: 1,
        lineNumberB: 1,
        type: 'unchanged',
        textA: 'دستورالعمل جامع سرویس دوره‌ای پمپ سانتریفیوژ خوراک P-02 بر اساس استاندارد API 610.',
        textB: 'دستورالعمل جامع سرویس دوره‌ای پمپ سانتریفیوژ خوراک P-02 بر اساس استاندارد API 610.'
      },
      {
        lineNumberA: 2,
        lineNumberB: 2,
        type: 'modified',
        textA: 'روش بازرسی: تکنسین شیفت موظف است با لمس دست دمای یاتاقان‌ها را تست کرده و هر ماه روغن کاسه نمد را تعویض نماید.',
        textB: 'روش بازرسی: ترانسمیترهای آنلاین PT100 و شتاب‌سنج‌های پیزوالکتریک داده‌ها را به دوقلوی دیجیتال ارسال کرده و تعویض روغن تنها بر پایه افت شاخص ویسکوزیته اعلام می‌گردد.',
        changeNoteFa: 'گذار از بازرسی سنتی به سنسورهای پیوسته لایه صفر'
      },
      {
        lineNumberB: 3,
        type: 'added',
        textB: 'پایش حاشیه NPSH: در صورت افت فشار محفظه مکش به کمتر از حاشیه امن ۱.۲ متر، آلارم هشدار اولیه کاویتاسیون در دیدبان صادر می‌شود.',
        changeNoteFa: 'پروتکل جدید پیشگیری از تخریب پروانه بر اثر کاویتاسیون'
      }
    ]
  }
];

export const DocumentComparison: React.FC = () => {
  const [selectedPairId, setSelectedPairId] = useState<string>(DOCUMENT_COMPARISON_PAIRS[0].id);
  const [viewMode, setViewMode] = useState<'sideBySide' | 'unified'>('sideBySide');
  const [filterChangedOnly, setFilterChangedOnly] = useState<boolean>(false);

  const activePair = useMemo(() => {
    return DOCUMENT_COMPARISON_PAIRS.find((p) => p.id === selectedPairId) || DOCUMENT_COMPARISON_PAIRS[0];
  }, [selectedPairId]);

  const displayedLines = useMemo(() => {
    if (!filterChangedOnly) return activePair.lines;
    return activePair.lines.filter((l) => l.type !== 'unchanged');
  }, [activePair, filterChangedOnly]);

  const stats = useMemo(() => {
    const added = activePair.lines.filter((l) => l.type === 'added').length;
    const removed = activePair.lines.filter((l) => l.type === 'removed').length;
    const modified = activePair.lines.filter((l) => l.type === 'modified').length;
    const unchanged = activePair.lines.filter((l) => l.type === 'unchanged').length;
    return { added, removed, modified, unchanged, total: activePair.lines.length };
  }, [activePair]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <GitCompare size={22} />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">مقایسه‌گر هوشمند ویرایش‌های اسناد و قراردادها (Document Diff)</h1>
              <span className="text-xs text-purple-400 font-mono">Visual Difference Engine • تحلیل تطبیقی متادیتا، تعهدات SLA و حدود فیزیکی</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 max-w-3xl leading-relaxed">
            امکان مقایسه بند به بند دو نسخه از قراردادهای EPC، ممیزی‌های ادواری ارتعاشاتی و دستورالعمل‌های نگهداری با هایلایت تغییرات، حذفیات و اصلاحات فنی.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="#/knowledge-graph"
            className="px-3 py-2 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Layers size={14} />
            <span>گراف دانش ارتباطات</span>
          </a>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-1.5 transition-colors"
          >
            <Printer size={14} />
            <span>چاپ گزارش مقایسه (PDF)</span>
          </button>
        </div>
      </div>

      {/* Document Pair Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {DOCUMENT_COMPARISON_PAIRS.map((pair) => {
          const isSelected = pair.id === selectedPairId;
          return (
            <div
              key={pair.id}
              onClick={() => setSelectedPairId(pair.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-purple-950/40 border-purple-500/60 shadow-lg shadow-purple-950/50'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded-lg border border-purple-500/20">
                  {pair.docCode}
                </span>
                <span className="text-[11px] text-slate-400 truncate">{pair.assetNameFa}</span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-white mt-2 leading-snug line-clamp-2">
                {pair.titleFa}
              </h3>
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="truncate max-w-[110px]">{pair.versionA.label.split(' ')[0]}</span>
                <ArrowRight size={12} className="text-purple-400" />
                <span className="text-emerald-400 font-semibold truncate max-w-[120px]">{pair.versionB.label.split(' ')[0]}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Metadata Comparison Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-400" />
            <h2 className="text-sm font-bold text-white">مقایسه متادیتا، مراجع تصویب و کدهای هش زنجیره حقیقت</h2>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">تجهیز مرتبط:</span>
            <span className="font-bold text-sky-400">{activePair.assetNameFa}</span>
          </div>
        </div>

        {/* Side-by-Side Metadata Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Version A Card */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-400">نسخه مبنا (Version A)</span>
              <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 text-[10px] border border-rose-500/20">
                {activePair.versionA.status}
              </span>
            </div>
            <div className="text-sm font-bold text-slate-200">{activePair.versionA.label}</div>
            <div className="space-y-1 text-slate-400 pt-1 text-[11px]">
              <div>تنظیم‌کننده: <strong className="text-slate-300">{activePair.versionA.author}</strong></div>
              <div>تاریخ: <strong className="text-slate-300">{activePair.versionA.date}</strong></div>
              <div>کد هش: <span className="font-mono text-slate-500">{activePair.versionA.hash}</span></div>
            </div>
          </div>

          {/* Version B Card */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400">نسخه جاری مصوب (Version B)</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20">
                {activePair.versionB.status}
              </span>
            </div>
            <div className="text-sm font-bold text-slate-100">{activePair.versionB.label}</div>
            <div className="space-y-1 text-slate-400 pt-1 text-[11px]">
              <div>تنظیم‌کننده: <strong className="text-slate-300">{activePair.versionB.author}</strong></div>
              <div>تاریخ تصویب: <strong className="text-emerald-300">{activePair.versionB.date}</strong></div>
              <div>کد هش ریشه: <span className="font-mono text-emerald-400 font-bold">{activePair.versionB.hash}</span></div>
            </div>
          </div>
        </div>

        {/* Key Numerical / Contractual Impacts Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-2 font-semibold">موضوع تغییر / شاخص کلیدی</th>
                <th className="pb-2 font-semibold text-rose-400">مقدار در نسخه قبلی (Old)</th>
                <th className="pb-2 font-semibold text-emerald-400">مقدار مصوب جدید (New)</th>
                <th className="pb-2 font-semibold text-center">نوع تاثیر</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {activePair.metadataChanges.map((change, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 font-medium text-slate-200">{change.fieldFa}</td>
                  <td className="py-2.5 text-slate-400 line-through decoration-rose-500/60">{change.oldValue}</td>
                  <td className="py-2.5 font-semibold text-emerald-300">{change.newValue}</td>
                  <td className="py-2.5 text-center">
                    {change.impact === 'critical' ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 text-[10px] font-bold border border-rose-500/30">
                        بحرانی / الزامی
                      </span>
                    ) : change.impact === 'improvement' ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                        بهبود کیفی
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px]">
                        خنثی
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Diff View Controls & Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        {/* Statistics Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold font-mono">
            +{stats.added} بند افزوده شده
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 font-bold font-mono">
            -{stats.removed} بند حذف شده
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold font-mono">
            ~{stats.modified} بند اصلاح شده
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-400 font-mono">
            {stats.unchanged} بند بدون تغییر
          </span>
        </div>

        {/* View Mode Switcher & Filter */}
        <div className="flex items-center gap-2">
          {/* Changes Only Filter Toggle */}
          <button
            onClick={() => setFilterChangedOnly(!filterChangedOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
              filterChangedOnly
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Filter size={13} />
            <span>فقط تغییرات</span>
          </button>

          {/* Mode Switcher */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1 text-xs">
            <button
              onClick={() => setViewMode('sideBySide')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
                viewMode === 'sideBySide' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="نمای موازی دو ستونه"
            >
              <Columns size={13} />
              <span className="hidden sm:inline">کنار هم (Side by Side)</span>
            </button>
            <button
              onClick={() => setViewMode('unified')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
                viewMode === 'unified' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="نمای یکپارچه خطی"
            >
              <List size={13} />
              <span className="hidden sm:inline">یکپارچه (Unified)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Diff Content Container */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden font-sans text-xs sm:text-sm">
        {/* Header Bar */}
        <div className="bg-slate-900/90 border-b border-slate-800 p-3.5 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2 font-bold text-white">
            <FileText size={16} className="text-purple-400" />
            <span>متن کامل بندها و هایلایت بصری تفاضل متون (Diff Inspector)</span>
          </div>
          <span className="font-mono text-slate-500 text-[11px]">
            نمایش {displayedLines.length} از {activePair.lines.length} خط
          </span>
        </div>

        {/* View Mode: Side by Side */}
        {viewMode === 'sideBySide' && (
          <div className="divide-y divide-slate-850">
            {/* Table Header */}
            <div className="grid grid-cols-2 bg-slate-900/40 text-[11px] font-bold text-slate-400 border-b border-slate-800">
              <div className="p-3 border-l border-slate-800 flex items-center justify-between">
                <span>{activePair.versionA.label}</span>
                <span className="text-rose-400 font-mono">[-] نسخه مبنا</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span>{activePair.versionB.label}</span>
                <span className="text-emerald-400 font-mono">[+] نسخه مصوب نهایی</span>
              </div>
            </div>

            {/* Diff Lines */}
            {displayedLines.map((line, idx) => {
              if (line.type === 'unchanged') {
                return (
                  <div key={idx} className="grid grid-cols-2 hover:bg-slate-900/20 text-slate-400 leading-relaxed">
                    <div className="p-3 border-l border-slate-800/80 flex gap-3">
                      <span className="font-mono text-slate-600 select-none text-xs shrink-0 w-6 text-left">{line.lineNumberA}</span>
                      <div className="text-slate-300">{line.textA}</div>
                    </div>
                    <div className="p-3 flex gap-3">
                      <span className="font-mono text-slate-600 select-none text-xs shrink-0 w-6 text-left">{line.lineNumberB}</span>
                      <div className="text-slate-300">{line.textB}</div>
                    </div>
                  </div>
                );
              }

              if (line.type === 'modified') {
                return (
                  <div key={idx} className="grid grid-cols-2 bg-amber-950/15 hover:bg-amber-950/25 border-l-2 border-r-2 border-amber-500 leading-relaxed">
                    <div className="p-3 border-l border-slate-800/80 bg-rose-950/15 flex gap-3">
                      <span className="font-mono text-rose-400 font-bold select-none text-xs shrink-0 w-6 text-left">{line.lineNumberA}</span>
                      <div className="text-rose-200">
                        <span className="text-rose-400 font-bold ml-1 font-mono">~</span>
                        {line.textA}
                      </div>
                    </div>
                    <div className="p-3 bg-emerald-950/20 flex gap-3">
                      <span className="font-mono text-emerald-400 font-bold select-none text-xs shrink-0 w-6 text-left">{line.lineNumberB}</span>
                      <div className="space-y-1">
                        <div className="text-emerald-200 font-medium">
                          <span className="text-emerald-400 font-bold ml-1 font-mono">~</span>
                          {line.textB}
                        </div>
                        {line.changeNoteFa && (
                          <div className="text-[11px] text-amber-400 font-medium bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 inline-block">
                            علت تغییر: {line.changeNoteFa}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }

              if (line.type === 'removed') {
                return (
                  <div key={idx} className="grid grid-cols-2 bg-rose-950/20 hover:bg-rose-950/30 border-r-2 border-rose-500 leading-relaxed">
                    <div className="p-3 border-l border-slate-800/80 flex gap-3">
                      <span className="font-mono text-rose-400 font-bold select-none text-xs shrink-0 w-6 text-left">{line.lineNumberA}</span>
                      <div className="text-rose-300 line-through decoration-rose-500/70">
                        <span className="text-rose-400 font-bold ml-1 font-mono">-</span>
                        {line.textA}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-950/50 flex items-center justify-center text-slate-600 text-xs italic">
                      [این بند در نسخه نهایی حذف شده است]
                    </div>
                  </div>
                );
              }

              if (line.type === 'added') {
                return (
                  <div key={idx} className="grid grid-cols-2 bg-emerald-950/20 hover:bg-emerald-950/30 border-l-2 border-emerald-500 leading-relaxed">
                    <div className="p-3 border-l border-slate-800/80 bg-slate-950/50 flex items-center justify-center text-slate-600 text-xs italic">
                      [در نسخه قبلی وجود نداشت]
                    </div>
                    <div className="p-3 flex gap-3">
                      <span className="font-mono text-emerald-400 font-bold select-none text-xs shrink-0 w-6 text-left">{line.lineNumberB}</span>
                      <div className="space-y-1">
                        <div className="text-emerald-200 font-medium">
                          <span className="text-emerald-400 font-bold ml-1 font-mono">+</span>
                          {line.textB}
                        </div>
                        {line.changeNoteFa && (
                          <div className="text-[11px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 inline-block">
                            {line.changeNoteFa}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>
        )}

        {/* View Mode: Unified Continuous Diff */}
        {viewMode === 'unified' && (
          <div className="divide-y divide-slate-900 font-mono text-xs">
            {displayedLines.map((line, idx) => {
              if (line.type === 'unchanged') {
                return (
                  <div key={idx} className="p-3 flex items-start gap-3 hover:bg-slate-900/30 text-slate-300 font-sans">
                    <span className="text-slate-600 font-mono text-[11px] shrink-0 w-8">{line.lineNumberB}</span>
                    <span className="text-slate-500 font-mono shrink-0 select-none"> </span>
                    <div className="leading-relaxed">{line.textB}</div>
                  </div>
                );
              }

              if (line.type === 'removed') {
                return (
                  <div key={idx} className="p-3 flex items-start gap-3 bg-rose-950/25 border-r-2 border-rose-500 text-rose-300 font-sans">
                    <span className="text-rose-400/70 font-mono text-[11px] shrink-0 w-8">{line.lineNumberA}</span>
                    <span className="text-rose-400 font-bold font-mono shrink-0 select-none">-</span>
                    <div className="leading-relaxed line-through decoration-rose-500/60">{line.textA}</div>
                  </div>
                );
              }

              if (line.type === 'added') {
                return (
                  <div key={idx} className="p-3 flex items-start gap-3 bg-emerald-950/25 border-r-2 border-emerald-500 text-emerald-200 font-sans">
                    <span className="text-emerald-400/70 font-mono text-[11px] shrink-0 w-8">{line.lineNumberB}</span>
                    <span className="text-emerald-400 font-bold font-mono shrink-0 select-none">+</span>
                    <div className="space-y-1">
                      <div className="leading-relaxed font-semibold">{line.textB}</div>
                      {line.changeNoteFa && (
                        <span className="text-[11px] text-emerald-400 font-sans bg-emerald-500/10 px-2 py-0.5 rounded inline-block">
                          {line.changeNoteFa}
                        </span>
                      )}
                    </div>
                  </div>
                );
              }

              if (line.type === 'modified') {
                return (
                  <div key={idx} className="space-y-1 bg-amber-950/15 p-2 border-r-2 border-amber-500">
                    <div className="p-2 flex items-start gap-3 bg-rose-950/30 text-rose-300 font-sans rounded">
                      <span className="text-rose-400 font-mono text-[11px] shrink-0 w-8">{line.lineNumberA}</span>
                      <span className="text-rose-400 font-bold font-mono shrink-0 select-none">-</span>
                      <div className="leading-relaxed line-through decoration-rose-500/60">{line.textA}</div>
                    </div>
                    <div className="p-2 flex items-start gap-3 bg-emerald-950/30 text-emerald-200 font-sans rounded">
                      <span className="text-emerald-400 font-mono text-[11px] shrink-0 w-8">{line.lineNumberB}</span>
                      <span className="text-emerald-400 font-bold font-mono shrink-0 select-none">+</span>
                      <div className="space-y-1">
                        <div className="leading-relaxed font-semibold">{line.textB}</div>
                        {line.changeNoteFa && (
                          <span className="text-[11px] text-amber-400 font-sans bg-amber-500/10 px-2 py-0.5 rounded inline-block">
                            علت تغییر: {line.changeNoteFa}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

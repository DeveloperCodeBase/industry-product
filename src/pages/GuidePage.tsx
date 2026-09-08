import React from 'react';
import { BookOpen, ShieldCheck, Cpu, Award, FileText, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

export const GuidePage: React.FC = () => {
  const standards = [
    {
      code: 'ISO 10816 / ISO 20816',
      title: 'ارزیابی ارتعاشات مکانیکی ماشین‌آلات صنعتی در بخش‌های غیرچرخان',
      desc: 'تعریف حدود مجاز ارتعاش در ۴ کلاس ماشین‌آلات (کلاس I تا IV) و ۴ ناحیه وضعیت کیفی A (عالی)، B (رضایت‌بخش)، C (هشدار) و D (خطر توقف فوری).',
    },
    {
      code: 'ISO 13374 (MIMOSA CRIS)',
      title: 'پایش وضعیت و عیب‌یابی سیستم‌های ماشین‌آلات صنعتی (CBM/PdM)',
      desc: 'معماری ۶ مرحله‌ای استاندارد برای پردازش داده‌های ارتعاشی از بلوک داده خام تا تصمیم‌گیری نهایی و صدور دستور کار نگهداری.',
    },
    {
      code: 'IEC 62443 (ISA-99)',
      title: 'امنیت سایبری سیستم‌های کنترل و اتوماسیون صنعتی (IACS/OT)',
      desc: 'تفکیک زون‌ها و مجاری ارتباطی (Zones & Conduits)، تعریف سطوح اطمینان امنیتی (Security Levels) و الزامات عدم اتصال بی‌پروای OT به اینترنت.',
    },
    {
      code: 'IEEE 1588v2 (PTP)',
      title: 'پروتکل همگام‌سازی زمانی با دقت نانوثانیه در شبکه‌های محلی',
      desc: 'همگام‌سازی زمان سخت‌افزاری با خطای زیر ۱۰ میکروثانیه بین سنسورها جهت اعتبارسنجی قطعی رویدادهای فیزیکی در بلوک حقیقت.',
    },
    {
      code: 'ISO 55000 / 55001',
      title: 'مدیریت دارایی‌های فیزیکی و چرخه عمر تجهیزات صنعتی (Asset Management)',
      desc: 'اصول حاکمیت سازمانی، بهینه‌سازی هزینه چرخه عمر (LCC) و استنادپذیری به شواهد فنی در ممیزی‌های سالانه.',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <BookOpen size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">راهنمای کاربری و متدولوژی علمی پلتفرم حقیقت صنعتی</h1>
              <span className="text-xs text-sky-400 font-mono">مفاهیم پایه، استانداردهای بین‌المللی و نحوه بهره‌برداری سازمانی</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">
            مستند مرجع آموزشی برای مهندسان قابلیت اطمینان، سرپرستان اتاق کنترل، کارشناسان ابزاردقیق و ممیزان کیفیت کارخانه.
          </p>
        </div>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <ShieldCheck size={20} />
          </div>
          <h3 className="font-bold text-white text-base">۱. اصل اصالت حقیقت فیزیکی</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            داده‌ها تا زمانی که منبع فیزیکی معتبر، گواهی کالیبراسیون انقضانیافته و برچسب زمانی با خطای مشخص نداشته باشند، وارد زنجیره استنتاج هوش مصنوعی نمی‌شوند.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Cpu size={20} />
          </div>
          <h3 className="font-bold text-white text-base">۲. تقدم محاسبات لبه (Edge-First)</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            الگوریتم‌های فوریه، استخراج مشخصه‌های آماری و راستی‌آزمایی هش در گره‌های سخت‌افزاری مجاور ماشین اجرا می‌شوند تا قطعی شبکه کارخانه مانع کارکرد سیستم نشود.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Award size={20} />
          </div>
          <h3 className="font-bold text-white text-base">۳. پیوند علم فیزیک با هوش مصنوعی</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            مدل‌های تخمین عمر (RUL) از ترکیب یادگیری عمیق و معادلات مکانیک شکست و خستگی متریال بهره می‌برند تا از پیش‌بینی‌های غیرواقعی یا اصطلاحاً «توهم هوش مصنوعی» مصون بمانند.
          </p>
        </div>
      </div>

      {/* Industrial Standards Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <FileText size={18} className="text-sky-400" />
          استانداردهای بین‌المللی مرجع در طراحی پلتفرم ویستا
        </h2>

        <div className="space-y-3">
          {standards.map((std, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-sky-400">{std.code}</span>
                <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                  <CheckCircle2 size={12} />
                  انطباق کامل
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-200">{std.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">{std.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

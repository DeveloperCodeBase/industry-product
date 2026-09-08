import React, { useState } from 'react';
import {
  Network,
  Layers,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Cpu,
  Lock,
  Database,
  Eye,
  CalendarCheck,
  GitFork,
  BookOpen,
  Award
} from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number>(6); // Default to Truth verification layer

  const layers11 = [
    {
      num: '۰',
      nameEn: 'Layer 0: Physical Sensing & Actuation',
      nameFa: 'لایه ۰: حسگرها و عملگرهای فیزیکی',
      sub: 'پیزوالکتریک، شتاب‌سنج، ترموکوپل، فرستنده‌های پیزورزیستیو',
      desc: 'دریافت مستقیم سیگنال‌های فیزیکی میلی‌ولتی با کالیبراسیون رسمی و شناسنامه کارخانه‌ای منحصربه‌فرد بر اساس استاندارد IEEE 1451.',
      icon: Cpu,
    },
    {
      num: '۱',
      nameEn: 'Layer 1: Galvanic Isolation & Signal Conditioning',
      nameFa: 'لایه ۱: ایزولاسیون گالوانیک و بهسازی سیگنال',
      sub: 'بریرهای ضدانفجار، فیلترهای آنالوگ ضدپدیدگی (Anti-Aliasing)',
      desc: 'ایزولاسیون ۲.۵ کیلوولت بین محیط پرنویز میدانی کارخانه و لایه دیجیتال جهت پیشگیری از اعوجاج سیگنال و اضافه ولتاژ ناگهانی.',
      icon: Layers,
    },
    {
      num: '۲',
      nameEn: 'Layer 2: Real-time Edge Node (Edge-B)',
      nameFa: 'لایه ۲: گره پردازش بلادرنگ لبه (Edge-B)',
      sub: 'پردازنده‌های ARM Cortex و DSPهای صنعتی',
      desc: 'اجرای در لحظه الگوریتم‌های FFT، استخراج RMS، چولگی (Skewness) و کرتوزیس در کمتر از ۲ میلی‌ثانیه بدون بار اضافی بر شبکه.',
      icon: Cpu,
    },
    {
      num: '۳',
      nameEn: 'Layer 3: Precision Timing & Secure Transport',
      nameFa: 'لایه ۳: همگام‌سازی زمانی دقیق و انتقال امن',
      sub: 'پروتکل PTP (IEEE 1588v2)، رمزنگاری TLS 1.3 صنعتی',
      desc: 'همگام‌سازی زمان با خطای زیر ۱۰ میکروثانیه بین تمامی گره‌های کارخانه برای انطباق قطعی رخدادها در زنجیره حقیقت.',
      icon: Lock,
    },
    {
      num: '۴',
      nameEn: 'Layer 4: Heavy Edge Compute (Edge-A)',
      nameFa: 'لایه ۴: گره محاسباتی سنگین لبه (Edge-A)',
      sub: 'سرورهای صنعتی رکمونت با پردازشگر گرافیکی تعبیه‌شده',
      desc: 'اجرای مدل‌های یادگیری عمیق فشرده‌شده، بافر حلقوی محلی ۵۰۰ نقطه‌ای و تجمیع داده‌های ایستگاهی کارخانه.',
      icon: Database,
    },
    {
      num: '۵',
      nameEn: 'Layer 5: OT/IT Industrial DMZ & Broker',
      nameFa: 'لایه ۵: زون حائل امنیتی DMZ و بروکر داده',
      sub: 'OPC UA Server/Client، بروکرهای MQTT Sparkplug B',
      desc: 'جداسازی قاطع شبکه کنترل صنعتی (شبکه اتوماسیون) از شبکه سازمانی IT منطبق بر استانداردهای امنیت سایبری IEC 62443.',
      icon: Network,
    },
    {
      num: '۶',
      nameEn: 'Layer 6: Truth Verification Pipeline (Truth Block)',
      nameFa: 'لایه ۶: خط لوله اعتبارسنجی حقیقت (قلب پلتفرم ویستا)',
      sub: 'تولید شناسه هش SHA-256، بررسی گواهی کالیبراسیون حسگر',
      desc: 'قفل‌کردن داده‌ها در بسته‌های غیرقابل‌دستکاری (Truth Block)؛ داده‌ای که نتوان اصالت و کالیبراسیون آن را اثبات کرد کنار گذاشته می‌شود.',
      icon: ShieldCheck,
    },
    {
      num: '۷',
      nameEn: 'Layer 7: Hybrid Physics & AI Modeling Engine',
      nameFa: 'لایه ۷: موتور مدل‌سازی هیبریدی فیزیکی و هوش مصنوعی',
      sub: 'معادلات ناویر-استوکس، ارتعاشات دینامیکی، استهلاک برینگ',
      desc: 'ترکیب هوش مصنوعی داده‌محور با قوانین صلب فیزیک؛ جلوگیری از توهم آماری مدل‌های هوش مصنوعی متداول.',
      icon: Layers,
    },
    {
      num: '۸',
      nameEn: 'Layer 8: Organizational Memory & Context (Vista-Hafeze)',
      nameFa: 'لایه ۸: حافظه سازمانی و بافتار (ویستا-حافظه)',
      sub: 'گراف دانش دارایی‌ها، پیوند به ERP/CMMS و دستورالعمل‌های SOP',
      desc: 'متصل کردن هر ارتعاش غیرعادی به دستور کارهای نگهداری، سوابق خرابی‌های ۵ سال گذشته و شماره سفارش قطعات یدکی انبار.',
      icon: GitFork,
    },
    {
      num: '۹',
      nameEn: 'Layer 9: Decision & Visibility Suite',
      nameFa: 'لایه ۹: سه‌گانه تصمیم‌گیری (دیدبان، پاسدار، نظم‌گر)',
      sub: 'داشبوردهای تخصصی، دوقلوی ۳بعدی، هشدارهای مناطق ریسک',
      desc: 'تحویل داده‌های حقیقت به سه دسته ذینفع: مهندسان قابلیت اطمینان، پرسنل ایمنی HSE و مدیران برنامه‌ریزی تولید.',
      icon: Eye,
    },
    {
      num: '۱۰',
      nameEn: 'Layer 10: Governance, Audit & Legal Contracting',
      nameFa: 'لایه ۱۰: حاکمیت، ممیزی حقوقی و مدل‌های قراردادی',
      sub: 'گزارش‌های ممیزی ISO 55000، مستندات SLA، بسته‌های واگذاری',
      desc: 'قابلیت استناد قضایی به شواهد ذخیره‌شده جهت ادعای خسارت بیمه، گواهی استاندارد و صدور پیش‌نویس قراردادهای رسمی صنعتی.',
      icon: BookOpen,
    },
  ];

  const globalGiants = [
    {
      name: 'Siemens Xcelerator (آلمان)',
      category: 'اتوماسیون سنتی + شبیه‌سازی چندفیزیکی',
      dataIntegrity: 'وابسته به TIA Portal و کنترلرهای انحصاری زیمنس',
      edgeReadiness: 'بالا (Siemens Industrial Edge)',
      cloudConstraint: 'وابستگی ابری بالا به MindSphere/Insights Hub در دیتاسنترهای اروپا',
      iranVulnerability: 'تحریم کامل؛ ریسک قطع سرویس و عدم دسترسی به لایسنس',
    },
    {
      name: 'GE Vernova (آمریکا)',
      category: 'تحلیل داده‌های ناوگان نیروگاهی و توربین',
      dataIntegrity: 'ناموجود (تمرکز بر مدل‌های آماری و فرمول‌های APM)',
      edgeReadiness: 'متوسط؛ وابسته به استقرارهای سنگین سروری',
      cloudConstraint: 'پلتفرم ابری چند میلیارد دلاری با معماری سنگین',
      iranVulnerability: 'تحریم درجه یک OFAC؛ هرگونه آپدیت و اتصال مسدود است',
    },
    {
      name: 'Honeywell Forge (آمریکا)',
      category: 'سیستم‌های فرآیندی DCS و بهینه‌سازی انرژی',
      dataIntegrity: 'متمرکز بر تله‌متری عمومی Experion بدون ثبت کالیبراسیون',
      edgeReadiness: 'متوسط تا بالا',
      cloudConstraint: 'مدل Saas مبتنی بر ابرهای مایکروسافت Azure',
      iranVulnerability: 'تجهیزات دوکاربردی و منع قانونی صادرات به ایران',
    },
    {
      name: 'Schneider EcoStruxure (فرانسه)',
      category: 'مدیریت انرژی و اتوماسیون توزیع‌شده IEC 61499',
      dataIntegrity: 'در سطح استاندارد محصولات الکتریکال',
      edgeReadiness: 'بالا با راه‌کارهای EcoStruxure Edge',
      cloudConstraint: 'ترکیب ابری و لبه',
      iranVulnerability: 'محدودیت‌های شدید مبادلات بانکی و پشتیبانی فنی',
    },
    {
      name: 'ABB Ability & Genix (سوئیس/سوئد)',
      category: 'همگرایی لایه‌های OT/IT/ET و سنسورهای تعبیه‌شده',
      dataIntegrity: 'سنسورهای ارتعاش هوشمند موتور اما فاقد لایه شواهد حقیقت',
      edgeReadiness: 'بالا',
      cloudConstraint: 'وابستگی به کلاود خارجی برای تحلیل‌های نسل جدید Genix',
      iranVulnerability: 'عدم ارائه خدمات پشتیبانی به صنایع بزرگ و پتروشیمی‌های ایران',
    },
    {
      name: 'Palantir Foundry (آمریکا)',
      category: 'یکپارچه‌سازی داده‌های زنجیره ارزش سازمانی',
      dataIntegrity: 'مدل آنتولوژی عمیق، اما دور از سنسورهای سطح صفر فیزیکی',
      edgeReadiness: 'پایین در لایه کنترل صنعتی',
      cloudConstraint: 'سنگین‌ترین مدل محاسبات ابری دفاعی و شرکتی',
      iranVulnerability: 'غیرقابل دسترس و ممنوع برای شرکت‌های خاورمیانه',
    },
    {
      name: 'پلتفرم حقیقت صنعتی ویستا (ایران)',
      category: 'معماری بومی ۱۱لایه مبتنی بر بلوک حقیقت و دوقلوی مستقل',
      dataIntegrity: '۱۰۰٪ تضمین‌شده با امضای سخت‌افزاری و برچسب زمانی PTP',
      edgeReadiness: 'کامل (Edge-First Native)',
      cloudConstraint: 'استقلال کامل از هرگونه ابر خارجی؛ استقرار در سایت کارخانه',
      iranVulnerability: 'صفر؛ مالکیت ۱۰۰٪ کد و الگوریتم‌ها توسط شرکت ویستا',
    },
  ];

  const selectedLayer = layers11[selectedLayerIndex];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Network size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">معماری مرجع ۱۱ لایه پلتفرم حقیقت صنعتی ویستا</h1>
              <span className="text-xs text-sky-400 font-mono">طراحی منطبق بر IEC 62443، ISA-95 و تحلیل عمیق غول‌های فناوری جهان</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">
            گذار از مدل‌های سنتی ۵ لایه پردو (Purdue Model) به معماری مدرن شواهد حقیقت. پاسخ قاطع فنی به نیازمندی صنایع مادر در مواجهه با چالش‌های تحریم، فرسودگی ناوگان و کمبود متخصص.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs">
          <Award size={16} className="text-amber-400" />
          <div>
            <div className="font-bold text-white">طراحی مرجع بومی</div>
            <div className="text-[10px] text-slate-400">ثبت مالکیت شرکت ویستا</div>
          </div>
        </div>
      </div>

      {/* 11-Layer Interactive Stack Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* The 11 Layers Vertical Stack (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers size={16} className="text-sky-400" />
              ساختار سلسله‌مراتبی لایه‌ها (از حسگر تا حاکمیت)
            </h2>
            <span className="text-xs font-mono text-slate-400">برای جزئیات لایه کلیک کنید</span>
          </div>

          <div className="space-y-1.5">
            {layers11.map((layer, idx) => {
              const Icon = layer.icon;
              const isSelected = selectedLayerIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedLayerIndex(idx)}
                  className={`cursor-pointer p-3 rounded-xl border transition-all flex items-center justify-between text-xs ${
                    isSelected
                      ? 'bg-sky-950/60 border-sky-500 shadow-md shadow-sky-500/20 text-white'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                        isSelected ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {layer.num}
                    </span>
                    <div>
                      <div className="font-bold text-slate-100 flex items-center gap-2">
                        <span>{layer.nameFa}</span>
                        {idx === 6 && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            هسته حقیقت
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{layer.nameEn}</div>
                    </div>
                  </div>

                  <Icon size={16} className={isSelected ? 'text-sky-400' : 'text-slate-500'} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Layer Deep Dive Panel (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-mono text-sky-400 uppercase">
                تشریح لایه {selectedLayer.num} معماری
              </span>
              <h3 className="font-bold text-base text-white mt-1">{selectedLayer.nameFa}</h3>
              <div className="text-xs text-slate-400 font-mono mt-0.5">{selectedLayer.nameEn}</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-300">مؤلفه‌ها و تکنولوژی‌های اصلی:</div>
              <div className="text-xs text-sky-300 font-medium">{selectedLayer.sub}</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-300">نقش در پلتفرم حقیقت ویستا:</div>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedLayer.desc}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-sky-950/30 border border-sky-500/30 text-[11px] text-sky-300 leading-relaxed">
            تمام لایه‌ها به گونه‌ای طراحی شده‌اند که به صورت کاملاً غیروابسته (Decoupled) عمل کنند تا اختلال در هر لایه منجر به توقف خط لوله‌های دیگر نشود.
          </div>
        </div>
      </div>

      {/* Global Tech Giants Deep Comparative Analysis */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div>
          <h2 className="text-base font-bold text-white">
            تحلیل عمیق رویکرد غول‌های صنعتی جهان و دلیل برتری معماری ویستا
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            بررسی نقاط ضعف بنیادین غول‌های بین‌المللی در صنایع خاورمیانه و ایران:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {globalGiants.map((giant, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                giant.name.includes('ویستا')
                  ? 'bg-sky-950/50 border-sky-500/80 shadow-lg shadow-sky-500/20'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                  <span>{giant.name}</span>
                </div>
                <div className="text-[11px] text-sky-400 font-medium mb-2">{giant.category}</div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 text-[10px] block">یکپارچگی و حقیقت داده:</span>
                    <span className="leading-snug">{giant.dataIntegrity}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 text-[10px] block">ریسک تحریم و وابستگی:</span>
                    <span
                      className={
                        giant.name.includes('ویستا')
                          ? 'text-emerald-400 font-bold'
                          : 'text-rose-400 font-medium'
                      }
                    >
                      {giant.iranVulnerability}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800 font-mono">
                محدودیت ابری: {giant.cloudConstraint}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

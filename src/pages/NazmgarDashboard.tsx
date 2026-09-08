import React, { useState } from 'react';
import {
  CalendarCheck,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Layers,
  BarChart3,
  Clock,
  ArrowRight,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NazmgarDashboard: React.FC = () => {
  const { assets } = useApp();
  const [throttleAccepted, setThrottleAccepted] = useState(false);

  // Hourly plan vs actual production data (tons/hour or units)
  const productionHours = [
    { hour: '۰۷:۰۰', planned: 120, actual: 118, envelopeMax: 125, envelopeMin: 105 },
    { hour: '۰۸:۰۰', planned: 125, actual: 124, envelopeMax: 130, envelopeMin: 110 },
    { hour: '۰۹:۰۰', planned: 130, actual: 129, envelopeMax: 132, envelopeMin: 112 },
    { hour: '۱۰:۰۰', planned: 135, actual: 114, envelopeMax: 120, envelopeMin: 95 }, // Bottleneck hit!
    { hour: '۱۱:۰۰', planned: 135, actual: 108, envelopeMax: 115, envelopeMin: 90 },
    { hour: '۱۲:۰۰', planned: 130, actual: 105, envelopeMax: 112, envelopeMin: 88 },
    { hour: '۱۳:۰۰', planned: 130, actual: 104, envelopeMax: 110, envelopeMin: 85 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CalendarCheck size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">ویستا-نظم‌گر (Vista-Nazmgar)</h1>
              <span className="text-xs text-emerald-400 font-mono">انطباق برنامه تولید ERP با واقعیت فیزیکی کارخانه</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">
            محصول سوم سه‌گانه ویستا: از بین بردن شکاف بین خوش‌بینی کاذب سیستم‌های برنامه‌ریزی بالا‌دستی و توان واقعی ماشین‌آلات، با محاسبه پاکت توان عملیاتی (Throughput Envelope).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-center">
            <div className="text-[11px] text-slate-400">تحقق برنامه شیفت</div>
            <div className="text-lg font-black font-mono text-amber-400 mt-0.5">۸۳.۶٪</div>
          </div>
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-center">
            <div className="text-[11px] text-slate-400">گلوگاه فعال خط</div>
            <div className="text-lg font-black font-mono text-rose-400 mt-0.5">K-04</div>
          </div>
        </div>
      </div>

      {/* Recommended Real-time Throttle Alert */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 p-4 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm">فرمان تنظیم توان عملیاتی (Throughput Throttle Advisory)</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                پیشنهاد الگوریتم نظم‌گر
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              با توجه به ارتعاش ۵.۸ میلی‌متر بر ثانیه در <strong>کمپرسور گاز K-04</strong>، ادامه باردهی اسمی ۱۳۵ تن بر ساعت خطر گسیختگی کوپلینگ و توقف فاجعه‌بار خط را در پی دارد. نرخ تغذیه بهینه برای حفظ پایداری: <strong>۱۰۸ تن بر ساعت</strong>.
            </p>
          </div>
        </div>

        <button
          onClick={() => setThrottleAccepted(!throttleAccepted)}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
            throttleAccepted
              ? 'bg-emerald-600 text-white'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
          }`}
        >
          {throttleAccepted ? <CheckCircle2 size={16} /> : <Zap size={16} />}
          <span>{throttleAccepted ? 'فرمان اعمال شد (۱۰۸ تن/ساعت)' : 'تأیید کاهش نرخ باردهی خط'}</span>
        </button>
      </div>

      {/* Plan vs Reality & Throughput Envelope Chart (الزام فصل ۱۵) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 size={18} className="text-sky-400" />
              نمودار برنامه در برابر واقعیت و پاکت توان عملیاتی فیزیکی (Throughput Envelope)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              باند رنگی نشان‌دهنده محدوده واقع‌بینانه بر پایه فرسودگی تجهیزات و سیگنال‌های حقیقت لایه لبه است.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-sky-400 inline-block"></span>
              <span className="text-slate-300">برنامه اسمی ERP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-400 inline-block"></span>
              <span className="text-slate-300">خروجی واقعی فیزیکی</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-2 bg-slate-700/60 inline-block rounded-sm"></span>
              <span className="text-slate-400">پاکت توان مجاز</span>
            </div>
          </div>
        </div>

        {/* SVG Visualization of Envelope and Lines */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="h-56 w-full relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 600 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="envelopeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="40" x2="600" y2="40" stroke="#1e293b" strokeDasharray="3,3" />
              <line x1="0" y1="80" x2="600" y2="80" stroke="#1e293b" strokeDasharray="3,3" />
              <line x1="0" y1="120" x2="600" y2="120" stroke="#1e293b" strokeDasharray="3,3" />

              {/* Throughput Envelope Polygon (Min to Max capacity band) */}
              {(() => {
                const maxPoints = productionHours.map((d, i) => {
                  const x = (i / (productionHours.length - 1)) * 600;
                  const y = 160 - (d.envelopeMax - 80) * 2.2;
                  return `${x},${y}`;
                });
                const minPoints = [...productionHours].reverse().map((d, i) => {
                  const origIdx = productionHours.length - 1 - i;
                  const x = (origIdx / (productionHours.length - 1)) * 600;
                  const y = 160 - (d.envelopeMin - 80) * 2.2;
                  return `${x},${y}`;
                });

                const envelopePath = [...maxPoints, ...minPoints].join(' ');
                return <polygon points={envelopePath} fill="url(#envelopeGradient)" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="4,4" />;
              })()}

              {/* Planned Line (Sky Blue) */}
              {(() => {
                const points = productionHours.map((d, i) => {
                  const x = (i / (productionHours.length - 1)) * 600;
                  const y = 160 - (d.planned - 80) * 2.2;
                  return `${x},${y}`;
                }).join(' ');
                return <polyline points={points} fill="none" stroke="#38bdf8" strokeWidth="3" />;
              })()}

              {/* Actual Line (Emerald / Amber when deviated) */}
              {(() => {
                const points = productionHours.map((d, i) => {
                  const x = (i / (productionHours.length - 1)) * 600;
                  const y = 160 - (d.actual - 80) * 2.2;
                  return `${x},${y}`;
                }).join(' ');
                return <polyline points={points} fill="none" stroke="#10b981" strokeWidth="3" />;
              })()}

              {/* Points circles */}
              {productionHours.map((d, i) => {
                const x = (i / (productionHours.length - 1)) * 600;
                const yPlan = 160 - (d.planned - 80) * 2.2;
                const yAct = 160 - (d.actual - 80) * 2.2;
                return (
                  <g key={i}>
                    <circle cx={x} cy={yPlan} r="3.5" fill="#38bdf8" />
                    <circle cx={x} cy={yAct} r="4" fill={d.actual < d.planned - 10 ? '#f43f5e' : '#10b981'} />
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-3 border-t border-slate-800">
            {productionHours.map((d, i) => (
              <span key={i}>{d.hour}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Production Assets Health Impact Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="text-xs font-semibold text-slate-400">انحراف کل شیفت نسبت به برنامه</div>
          <div className="text-2xl font-black font-mono text-rose-400">-۸۴ تن</div>
          <p className="text-[11px] text-slate-400">به علت محدودیت ارتعاش بیرینگ در خط انتقال گاز</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="text-xs font-semibold text-slate-400">درصد در دسترس بودن ناوگان (Availability)</div>
          <div className="text-2xl font-black font-mono text-emerald-400">۹۴.۲٪</div>
          <p className="text-[11px] text-slate-400">۶ از ۸ تجهیز با حداکثر راندمان مکانیکی کار می‌کنند</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="text-xs font-semibold text-slate-400">صرفه‌جویی با پیشگیری از توقف ناگهانی</div>
          <div className="text-2xl font-black font-mono text-sky-400">۱.۸ میلیارد تومان</div>
          <p className="text-[11px] text-slate-400">جلوگیری از قفل شدن روتور و تخریب پوسته کمپرسور</p>
        </div>
      </div>
    </div>
  );
};

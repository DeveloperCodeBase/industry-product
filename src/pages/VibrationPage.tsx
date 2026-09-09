import React, { useState } from 'react';
import {
  Waves,
  AlertTriangle,
  Info,
  Sliders,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingDown,
  ShieldCheck,
  ChevronRight,
  Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { dataEngine } from '../services/syntheticData';

export const VibrationPage: React.FC = () => {
  const { assets, selectedAssetId, setSelectedAssetId, t } = useApp();
  const selected = assets.find((a) => a.id === selectedAssetId) || assets[0];
  const fftData = dataEngine.getFFTSpectrum(selected.id);

  const [hoveredBin, setHoveredBin] = useState<{ freq: number; amp: number } | null>(null);

  // ISO 10816-3 Zone Determination based on vibration RMS
  const rms = selected.telemetry.vibrationRms;
  let isoZone: 'A' | 'B' | 'C' | 'D' = 'A';
  let isoZoneDesc = 'منطقه A: ماشین در شرایط عالی و نوساز';
  let isoZoneColor = 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';

  if (rms > 7.1) {
    isoZone = 'D';
    isoZoneDesc = 'منطقه D: ارتعاش فراتر از حد مجاز — خطر تخریب آنی و ضرورت توقف اضطراری';
    isoZoneColor = 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  } else if (rms > 4.5) {
    isoZone = 'C';
    isoZoneDesc = 'منطقه C: کارکرد نامطلوب — فقط برای دوره محدود و تحت مراقبت پیوسته مجاز است';
    isoZoneColor = 'text-amber-400 border-amber-500/40 bg-amber-500/10';
  } else if (rms > 2.8) {
    isoZone = 'B';
    isoZoneDesc = 'منطقه B: قابل قبول برای کارکرد بلندمدت نامحدود بدون آسیب ساختاری';
    isoZoneColor = 'text-sky-400 border-sky-500/40 bg-sky-500/10';
  }

  // XAI SHAP Features attribution
  const shapFeatures = [
    { name: 'دامنه قله عیب قفسه بیرینگ (BPFO)', impact: '+۴۲٪', value: 42, color: 'bg-rose-500' },
    { name: 'کشیدگی سیگنال فرکانس بالا (Kurtosis)', impact: '+۲۴٪', value: 24, color: 'bg-amber-500' },
    { name: 'افزایش دمای بدنه یاتاقان نسبت به میانگین', impact: '+۱۸٪', value: 18, color: 'bg-sky-500' },
    { name: 'سایدباندهای مدولاسیون دور چرخش (1X)', impact: '+۱۱٪', value: 11, color: 'bg-indigo-500' },
    { name: 'ناپایداری جریان فاز موتور الکتریکی', impact: '+۵٪', value: 5, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Asset Selector & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Waves size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{t('vibration_analysis')}</h1>
              <span className="text-xs text-sky-400 font-mono">ISO 10816/20816 • FFT • 1X, 2X, 3X Harmonics</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">
            محاسبه فوریه سریع روی بلوک‌های حقیقت ارتعاش لایه لبه. استخراج الگوهای عیب بیرینگ (BPFO, BPFI, BSF, FTF) و تخمین عمر باقی‌مانده (RUL).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">انتخاب دارایی:</span>
          <select
            value={selected.id}
            onChange={(e) => setSelectedAssetId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            {assets.map((a) => (
              <option key={a.id} value={a.id}>
                {a.id.toUpperCase()} — {a.faName || a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ISO Zone Banner with Educational Caveat (الزام فصل ۱۵) */}
      <div className={`p-4 rounded-2xl border ${isoZoneColor} flex flex-col md:flex-row md:items-center justify-between gap-3`}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-950/40 border flex items-center justify-center font-black font-mono text-xl shrink-0">
            {isoZone}
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider">
              طبقه‌بندی وضعیت ارتعاش براساس استاندارد ISO 10816-3 (کلاس {selected.isoClass})
            </div>
            <div className="text-sm font-semibold text-white mt-0.5">{isoZoneDesc}</div>
            <div className="text-[11px] text-slate-300 mt-1 flex items-center gap-1 font-mono">
              <span>مقدار مؤثر ارتعاش (RMS): <strong>{selected.telemetry.vibrationRms} mm/s</strong></span>
              <span>•</span>
              <span>دور نامی: <strong>{selected.telemetry.rpm} RPM</strong></span>
            </div>
          </div>
        </div>

        {/* Mandatory Educational Caveat Box */}
        <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 max-w-sm">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-0.5">
            <Info size={13} />
            <span>هشدار متدولوژی و اصول ممیزی:</span>
          </div>
          مرزهای ISO 10816 راهنمای تجربی اولیه هستند. در ماشین‌های بحرانی با فرکانس متغیر یا بار نوسانی، تصمیم‌گیری باید منحصراً بر پایه سیر صعودی ترند فرکانسی و تحلیل اوربیت صورت گیرد نه یک آستانه ثابت.
        </div>
      </div>

      {/* FFT Spectrum Display */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity size={18} className="text-sky-400" />
              طیف فرکانسی ارتعاش (FFT Spectrum - ۰ تا ۱۰۰۰ هرتز)
            </h2>
            <span className="text-xs text-slate-400">
              پنجره‌گذاری Hanning • تفکیک‌پذیری ۰.۵ هرتز • نرخ نمونه‌برداری ۲۵.۶ کیلوهرتز در گره لبه
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
              1X = ۵۰ Hz
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              2X = ۱۰۰ Hz
            </span>
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
              BPFO = ۱۸۰ Hz
            </span>
          </div>
        </div>

        {/* FFT Bar / Polyline Visualizer */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="h-64 w-full relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
              <defs>
                <linearGradient id="fftGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#1e293b" strokeDasharray="2,2" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#1e293b" strokeDasharray="2,2" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#1e293b" strokeDasharray="2,2" />

              {/* FFT Frequency Bins as Bars */}
              {fftData.map((bin: { frequency: number; amplitude: number; harmonic?: string }, i: number) => {
                const x = (i / (fftData.length - 1)) * 480 + 10;
                const h = Math.min(140, bin.amplitude * 35);
                const y = 145 - h;
                const isHarmonic = bin.harmonic !== undefined;

                return (
                  <g
                    key={i}
                    onMouseEnter={() => setHoveredBin({ freq: bin.frequency, amp: bin.amplitude })}
                    onMouseLeave={() => setHoveredBin(null)}
                    className="cursor-pointer"
                  >
                    <rect
                      x={x - 2}
                      y={y}
                      width={4}
                      height={h}
                      fill={
                        bin.harmonic === 'BPFO'
                          ? '#f43f5e'
                          : bin.harmonic === '1X'
                          ? '#38bdf8'
                          : bin.harmonic === '2X'
                          ? '#f59e0b'
                          : bin.harmonic === '3X'
                          ? '#a855f7'
                          : '#475569'
                      }
                      rx={1}
                    />
                    {isHarmonic && (
                      <text
                        x={x}
                        y={y - 6}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {bin.harmonic}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-3 border-t border-slate-800">
            <span>۰ Hz</span>
            <span>۲۵۰ Hz</span>
            <span>۵۰۰ Hz</span>
            <span>۷۵۰ Hz</span>
            <span>۱۰۰۰ Hz</span>
          </div>

          {hoveredBin && (
            <div className="mt-2 text-xs font-mono text-center text-sky-400 bg-slate-900 py-1 rounded-lg border border-slate-800">
              فرکانس: <strong>{hoveredBin.freq.toFixed(1)} Hz</strong> | دامنه پیک: <strong>{hoveredBin.amp.toFixed(3)} mm/s</strong>
            </div>
          )}
        </div>
      </div>

      {/* RUL & XAI Attribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Remaining Useful Life (RUL) with Confidence Band (الزام فصل ۱۵) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock size={18} className="text-amber-400" />
              تخمین عمر مفید باقی‌مانده (RUL)
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
              فاصله اطمینان ۹۵٪
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-2">
            <div className="text-xs text-slate-400">تخمین ساعت کارکرد بدون ریسک خرابی حاد</div>
            <div className="text-3xl font-black font-mono text-amber-400">
              {selected.healthScore > 80 ? '۳,۴۲۰' : selected.healthScore > 60 ? '۱,۲۸۰' : '۳۶۰'}{' '}
              <span className="text-sm text-slate-400 font-normal">ساعت</span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              کران پایین: <strong>۲۹۰ ساعت</strong> • کران بالا: <strong>۴۵۰ ساعت</strong>
            </div>

            {/* Confidence Band Visual Bar */}
            <div className="relative pt-4 pb-2">
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden relative">
                <div
                  className="absolute h-full bg-amber-500/30 border-x border-amber-400"
                  style={{ left: '30%', width: '35%' }}
                />
                <div
                  className="absolute h-full bg-amber-400 rounded-full"
                  style={{ left: '45%', width: '6%' }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>توقف فوری</span>
                <span className="text-amber-400 font-bold">بازه اطمینان پیش‌بینی</span>
                <span>عمر طراحی کامل</span>
              </div>
            </div>
          </div>
        </div>

        {/* Explainable AI (SHAP-style Feature Attribution) (الزام فصل ۱۵) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles size={18} className="text-sky-400" />
              تبیین‌پذیری مدل هوش مصنوعی (SHAP Feature Attribution)
            </h3>
            <span className="text-xs font-mono text-slate-400">علت‌یابی ریشه‌ای (RCA)</span>
          </div>

          <p className="text-xs text-slate-400">
            سهم نسبی هر شاخص در کاهش امتیاز سلامت دارایی و تحریک وضعیت هشدار:
          </p>

          <div className="space-y-2.5">
            {shapFeatures.map((feat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{feat.name}</span>
                  <span className="font-mono font-bold text-white">{feat.impact}</span>
                </div>
                <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full ${feat.color} rounded-full transition-all`}
                    style={{ width: `${feat.value * 2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

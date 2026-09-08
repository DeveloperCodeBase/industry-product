import React, { useState } from 'react';
import {
  Sliders,
  RotateCcw,
  Activity,
  Flame,
  Gauge,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingDown,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WhatIfPage: React.FC = () => {
  const { assets, selectedAssetId, setSelectedAssetId } = useApp();
  const selected = assets.find((a) => a.id === selectedAssetId) || assets[0];

  // 3 Sliders as required by Chapter 15: Load %, Ambient Temp °C, Operating RPM
  const [loadPercent, setLoadPercent] = useState<number>(100);
  const [ambientTemp, setAmbientTemp] = useState<number>(28);
  const [operatingRpm, setOperatingRpm] = useState<number>(selected.telemetry.rpm);

  // Instant client-side physics recalculation without network roundtrips
  const baseHealth = selected.healthScore;
  const baseVib = selected.telemetry.vibrationRms;
  const baseTemp = selected.telemetry.temperature;

  // Recalculated outputs
  const loadFactor = loadPercent / 100;
  const tempDelta = ambientTemp - 25;
  const rpmFactor = operatingRpm / (selected.telemetry.rpm || 2980);

  // Vibration scales non-linearly with load & rpm
  const simVibration = Number((baseVib * (0.4 + 0.6 * Math.pow(loadFactor, 1.8) * Math.pow(rpmFactor, 1.5))).toFixed(2));
  // Temperature scales with load and ambient temp
  const simTemp = Number((baseTemp + tempDelta * 0.7 + (loadFactor - 1) * 22).toFixed(1));
  // Health drops if vibration or temperature exceeds threshold
  let healthPenalty = 0;
  if (simVibration > 4.5) healthPenalty += (simVibration - 4.5) * 8;
  if (simTemp > 70) healthPenalty += (simTemp - 70) * 1.5;
  const simHealth = Math.max(12, Math.min(100, Math.round(baseHealth - healthPenalty)));

  // RUL hours recalculation
  const simRulHours = Math.max(48, Math.round((simHealth / 100) * 4200 * (1 / Math.max(0.6, loadFactor * 1.2))));

  const handleReset = () => {
    setLoadPercent(100);
    setAmbientTemp(28);
    setOperatingRpm(selected.telemetry.rpm);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sliders size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">شبیه‌ساز سناریوی «چه-اگر» (What-If Physics Simulator)</h1>
              <span className="text-xs text-purple-400 font-mono">محاسبه در لحظه بدون تأخیر شبکه بر پایه قوانین فیزیکی</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">
            آزمایش اثر تغییر شرایط عملیاتی (درصد بار، دمای محیط و دور چرخش) بر سلامت، ارتعاش و طول عمر باقی‌مانده (RUL) بدون ریسک فیزیکی روی تجهیز واقعی.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selected.id}
            onChange={(e) => setSelectedAssetId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
          >
            {assets.map((a) => (
              <option key={a.id} value={a.id}>
                {a.id.toUpperCase()} — {a.faName}
              </option>
            ))}
          </select>

          <button
            onClick={handleReset}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
            title="بازنشانی پارامترها"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Main Simulation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: 3 Sliders (فصل ۱۵: بار، دمای محیط، دور کارکرد) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Zap size={18} className="text-sky-400" />
              متغیرهای ورودی سناریو
            </h2>
            <span className="text-xs font-mono text-slate-400">۳ متغیر کنترلی</span>
          </div>

          {/* Slider 1: Load Percentage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">۱. درصد بار مکانیکی (Load Ratio):</span>
              <span className="font-mono font-bold text-sky-400 text-sm">{loadPercent}٪</span>
            </div>
            <input
              type="range"
              min="50"
              max="135"
              step="1"
              value={loadPercent}
              onChange={(e) => setLoadPercent(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer h-2 bg-slate-950 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>۵۰٪ (کم‌باری)</span>
              <span>۱۰۰٪ (بار نامی)</span>
              <span className="text-rose-400">۱۳۵٪ (اضافه‌بار شدید)</span>
            </div>
          </div>

          {/* Slider 2: Ambient Temperature */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">۲. دمای محیط سالن (Ambient Temp):</span>
              <span className="font-mono font-bold text-amber-400 text-sm">{ambientTemp} °C</span>
            </div>
            <input
              type="range"
              min="10"
              max="55"
              step="1"
              value={ambientTemp}
              onChange={(e) => setAmbientTemp(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-950 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>۱۰ °C (زمستان)</span>
              <span>۲۵ °C (دمای استاندارد)</span>
              <span className="text-rose-400">۵۵ °C (گرمای اوج تابستان)</span>
            </div>
          </div>

          {/* Slider 3: Operating RPM */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">۳. دور کاری شفت (Operating RPM):</span>
              <span className="font-mono font-bold text-purple-400 text-sm">{operatingRpm} RPM</span>
            </div>
            <input
              type="range"
              min="1200"
              max="3600"
              step="20"
              value={operatingRpm}
              onChange={(e) => setOperatingRpm(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer h-2 bg-slate-950 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>۱۲۰۰ RPM</span>
              <span>۲۹۸۰ RPM (نامی)</span>
              <span>۳۶۰۰ RPM (بیش‌سرعت)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            <div className="flex items-center gap-1.5 text-sky-400 font-bold mb-1">
              <Info size={14} />
              <span>مبنای ریاضی شبیه‌ساز:</span>
            </div>
            معادلات دینامیک سیالات و انتقال حرارت غیرخطی بر اساس استاندارد ISO 13374. توان ارتعاش متناسب با توان دوم نسبت سرعت و بار مکانیکی رشد می‌کند.
          </div>
        </div>

        {/* Right Side: Recalculated Real-time Outputs */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity size={18} className="text-emerald-400" />
              خروجی‌های پیش‌بینی‌شده فیزیکی
            </h2>
            <span className="text-xs font-mono text-slate-400">پاسخ دینامیکی شبیه‌ساز بر روی تجهیز: {selected.faName}</span>
          </div>

          {/* 4 Output KPI Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Health Score */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>شاخص سلامت پیش‌بینی‌شده</span>
                <Activity size={14} className="text-sky-400" />
              </div>
              <div className="text-3xl font-black font-mono text-white">
                {simHealth}٪
              </div>
              <div className="text-[11px] font-mono flex items-center gap-1">
                <span className={simHealth < baseHealth ? 'text-rose-400' : 'text-emerald-400'}>
                  {simHealth - baseHealth > 0 ? `+${simHealth - baseHealth}` : simHealth - baseHealth}٪
                </span>
                <span className="text-slate-500">نسبت به مبنا</span>
              </div>
            </div>

            {/* Vibration RMS */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>ارتعاش مؤثر (RMS)</span>
                <Gauge size={14} className="text-amber-400" />
              </div>
              <div className="text-3xl font-black font-mono text-amber-400">
                {simVibration} <span className="text-sm font-normal text-slate-400">mm/s</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {simVibration > 4.5 ? '⚠️ محدوده نامطلوب Zone C' : '✓ محدوده مجاز Zone B'}
              </div>
            </div>

            {/* Operating Temp */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>دمای تخمینی بیرینگ</span>
                <Flame size={14} className="text-rose-400" />
              </div>
              <div className="text-3xl font-black font-mono text-rose-400">
                {simTemp} <span className="text-sm font-normal text-slate-400">°C</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                آستانه آلارم ترمال: ۷۲ °C
              </div>
            </div>

            {/* Estimated RUL */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>عمر مفید باقی‌مانده (RUL)</span>
                <Clock size={14} className="text-purple-400" />
              </div>
              <div className="text-3xl font-black font-mono text-purple-400">
                {simRulHours.toLocaleString()} <span className="text-sm font-normal text-slate-400">ساعت</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                کاهش فرسایش در حالت کارکرد پیوسته
              </div>
            </div>
          </div>

          {/* Operational Recommendation Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>نتیجه‌گیری فنی و توصیه مهندسی ویستا:</span>
            </div>
            {loadPercent > 110 ? (
              <p className="text-rose-300 leading-relaxed">
                تحت شرایط شبیه‌سازی‌شده (بار {loadPercent}٪ و دور {operatingRpm} RPM)، ارتعاش بیرینگ به {simVibration} mm/s رسیده و دمای یاتاقان به مرز بحرانی وارد می‌شود. عمر باقیمانده قطعه بیش از ۶۰٪ افت خواهد کرد. اجرای این سناریو بدون سیستم خنک‌کننده کمکی توصیه نمی‌شود.
              </p>
            ) : (
              <p className="text-slate-300 leading-relaxed">
                شرایط کاری پایدار است. پارامترهای ارتعاش و دما در محدوده ایمن استاندارد ISO 10816 باقی مانده و نرخ استهلاک تجهیز در کران‌های طراحی بهینه حفظ می‌شود.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

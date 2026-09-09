import React, { useState } from 'react';
import {
  Boxes,
  Waves,
  FileCheck,
  Activity,
  Sliders,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  AlertTriangle,
  Layers,
  Gauge,
  LineChart
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DigitalTwinEngine } from '../components/twin/DigitalTwinEngine';
import { RealTimeDashboard } from '../components/dashboard/RealTimeDashboard';
import { TwinMaturityMode } from '../types';

export const DigitalTwinPage: React.FC = () => {
  const {
    assets,
    selectedAsset,
    setSelectedAssetId,
    twinMaturity,
    setTwinMaturity,
    activeScenario,
    setScenario
  } = useApp();

  const [viewMode, setViewMode] = useState<'both' | '3d' | 'telemetry'>('both');

  return (
    <div className="space-y-6 w-full max-w-[1920px] mx-auto pb-12">
      {/* Top Header & Maturity Levels Guide */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <Boxes size={22} />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-white">
                موتور سه‌بعدی دوقلوی دیجیتال ویستا (Digital Twin Engine)
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                سند مرجع معماری فصل ۱۰ و ۱۵: شبیه‌سازی بلادرنگ فیزیکی Three.js بر مبنای داده‌های تله‌متری سنسورهای لبه و زنجیره بلوک حقیقت
              </p>
            </div>
          </div>
        </div>

        {/* 4 Maturity Levels (تاکسونومی سطوح ۴ گانه بلوغ دوقلو) */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800 gap-1 overflow-x-auto">
          {[
            { id: 'descriptive', label: '۱. توصیفی', desc: 'مدل ساختاری CAD' },
            { id: 'informative', label: '۲. تشخیصی', desc: 'تله‌متری برخط' },
            { id: 'predictive', label: '۳. پیش‌بین', desc: 'تخمین RUL' },
            { id: 'autonomous', label: '۴. جامع/خودران', desc: 'فرمان هوشمند' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setTwinMaturity(m.id as TwinMaturityMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex flex-col items-center ${
                twinMaturity === m.id
                  ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span>{m.label}</span>
              <span className="text-[9px] opacity-75">{m.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* View Mode Mode Toggles: 3D Twin vs Recharts Telemetry vs Both */}
      <div className="flex items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setViewMode('both')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewMode === 'both'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Layers size={14} />
            <span>نمای ترکیبی (مدل ۳D + تله‌متری بلادرنگ)</span>
          </button>
          <button
            onClick={() => setViewMode('3d')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewMode === '3d'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Boxes size={14} />
            <span>فقط موتور سه‌بعدی Three.js</span>
          </button>
          <button
            onClick={() => setViewMode('telemetry')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewMode === 'telemetry'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <LineChart size={14} />
            <span>فقط داشبورد بلادرنگ Recharts</span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>پایش همگام دوقلو و تله‌متری</span>
        </div>
      </div>

      {/* Main 3D Interactive Twin Engine */}
      {(viewMode === 'both' || viewMode === '3d') && (
        <DigitalTwinEngine
          asset={selectedAsset}
          assets={assets}
          onSelectAsset={setSelectedAssetId}
          maturityMode={twinMaturity}
          onChangeMaturityMode={setTwinMaturity}
          showControls={true}
        />
      )}

      {/* Real-time Telemetry Sensor Recharts Dashboard */}
      {(viewMode === 'both' || viewMode === 'telemetry') && (
        <div className="space-y-3 pt-2">
          {viewMode === 'both' && (
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Gauge size={18} className="text-sky-400" />
                <span>داشبورد گرافیکی تله‌متری و تحلیل بلادرنگ (Recharts Telemetry)</span>
              </div>
              <span className="text-xs text-slate-500 font-mono">تجهیز جاری: {selectedAsset.faName}</span>
            </div>
          )}
          <RealTimeDashboard
            initialAssetId={selectedAsset.id}
            show3DSwitchButton={false}
          />
        </div>
      )}

      {/* Quick Asset Selector Strip */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300">
            ناحیه انتخاب تجهیزات خط تولید جهت شبیه‌سازی دوقلوی سه‌بعدی ({assets.length} تجهیز فعال):
          </span>
          <span className="text-slate-500 font-mono">ایستگاه پایش: Edge-E / PTP Master</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {assets.map((a) => {
            const isSelected = a.id === selectedAsset.id;
            return (
              <button
                key={a.id}
                onClick={() => setSelectedAssetId(a.id)}
                className={`p-3 rounded-xl text-right transition-all border flex flex-col justify-between space-y-1.5 ${
                  isSelected
                    ? 'bg-sky-950/70 border-sky-500 ring-1 ring-sky-500 shadow-lg shadow-sky-500/20'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-sky-400 uppercase">
                    {a.type}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      a.status === 'critical'
                        ? 'bg-red-500 animate-pulse'
                        : a.status === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                </div>
                <div className="font-bold text-xs text-white truncate">{a.faName}</div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-900">
                  <span>سلامت: {a.healthScore}٪</span>
                  <span>{a.telemetry.vibrationRms} mm/s</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Equipment Deep-Dive Cards & Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Diagnostic Metrics */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm pb-2 border-b border-slate-800">
            <Activity size={16} className="text-sky-400" />
            <span>پایش دینامیک ارتعاشات و طیف FFT</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            محاسبه برخط شاخص‌های فرکانسی شکست یاتاقان (BPFO, BPFI, BSF, FTF) با نمونه‌برداری ۲۵.۶ کیلوهرتز در گره لبه بدون ارسال به اینترنت خارجی.
          </p>
          <div className="pt-2">
            <a
              href={`#/vibration/${selectedAsset.id}`}
              className="w-full py-2 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <Waves size={14} />
              <span>تحلیل آبشار ارتعاشی و طیف کامل</span>
              <ChevronLeft size={14} />
            </a>
          </div>
        </div>

        {/* Card 2: What-If Fault Scenarios */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm pb-2 border-b border-slate-800">
            <Sliders size={16} className="text-purple-400" />
            <span>شبیه‌سازی سناریوی خرابی (What-If)</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {activeScenario
              ? `سناریوی فعال: «${activeScenario.titleFa}» با هدف پایش اثرات ارتعاشی روی دوقلوی سه‌بعدی.`
              : 'تزریق مجازی سناریوهای خرابی زودرس یاتاقان، ناترازی محور و گرفتگی مجرای روغن جهت تست تاب‌آوری.'}
          </p>
          <div className="pt-2">
            <a
              href={`#/what-if/${selectedAsset.id}`}
              className="w-full py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <Sliders size={14} />
              <span>مرکز تزریق سناریوهای فیزیکی</span>
              <ChevronLeft size={14} />
            </a>
          </div>
        </div>

        {/* Card 3: Truth Block Proof */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm pb-2 border-b border-slate-800">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>ممیزی بلوک حقیقت (Truth Block)</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            تمامی مقادیر نمایش داده شده در این مدل سه‌بعدی ممهور به هش تغییرناپذیر SHA-256، ساعت اتمی PTP و گواهی کالیبراسیون رسمی آزمایشگاه مرجع هستند.
          </p>
          <div className="pt-2">
            <a
              href={`#/truth-block`}
              className="w-full py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <FileCheck size={14} />
              <span>بازرسی زنجیره شواهد غیرقابل انکار</span>
              <ChevronLeft size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalTwinPage;

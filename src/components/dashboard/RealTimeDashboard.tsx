import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import {
  Boxes,
  Activity,
  Thermometer,
  Gauge,
  Zap,
  Play,
  Pause,
  RotateCcw,
  FileDown,
  Sparkles,
  ShieldCheck,
  Waves,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Info,
  Maximize2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Asset, TelemetryData } from '../../types';
import { dataEngine } from '../../services/syntheticData';
import { ExportReportModal } from '../export/ExportReportModal';
import { DocumentInsightModal } from '../documents/DocumentInsightModal';

interface RealTimeDashboardProps {
  initialAssetId?: string;
  onNavigateTo3D?: () => void;
  show3DSwitchButton?: boolean;
}

interface TelemetryPoint extends TelemetryData {
  timeFormatted: string;
  isoZone: string;
  accelG: number;
}

export const RealTimeDashboard: React.FC<RealTimeDashboardProps> = ({
  initialAssetId,
  onNavigateTo3D,
  show3DSwitchButton = true,
}) => {
  const {
    assets,
    selectedAsset,
    setSelectedAssetId,
    twinMaturity,
    activeScenario,
  } = useApp();

  // If initialAssetId is supplied and differs from selectedAsset, sync it
  useEffect(() => {
    if (initialAssetId && initialAssetId !== selectedAsset.id) {
      setSelectedAssetId(initialAssetId);
    }
  }, [initialAssetId, selectedAsset.id, setSelectedAssetId]);

  // Buffer and Refresh settings
  const [bufferSize, setBufferSize] = useState<number>(30); // 30, 60, or 120 points
  const [refreshIntervalMs, setRefreshIntervalMs] = useState<number>(1000);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [activeMetricTab, setActiveMetricTab] = useState<'vibration' | 'thermal' | 'electrical' | 'all'>('vibration');

  // Modals state
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isInsightModalOpen, setIsInsightModalOpen] = useState<boolean>(false);

  // Local circular telemetry buffer for the selected asset
  const [telemetryBuffer, setTelemetryBuffer] = useState<TelemetryPoint[]>(() => {
    const rawBuffer = dataEngine.getBufferForAsset(selectedAsset.id);
    const initial = rawBuffer.length > 0 ? rawBuffer : [selectedAsset.telemetry];
    return initial.slice(-30).map((pt) => formatPoint(pt));
  });

  function formatPoint(pt: TelemetryData): TelemetryPoint {
    const d = new Date(pt.timestampMs ?? Date.now());
    const timeFormatted = `${d.getHours().toString().padStart(2, '0')}:${d
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;

    let isoZone = 'Zone A (Good)';
    if (pt.vibrationRms > 4.5) isoZone = 'Zone D (Danger)';
    else if (pt.vibrationRms > 2.8) isoZone = 'Zone C (Alert)';
    else if (pt.vibrationRms > 1.4) isoZone = 'Zone B (Satisfactory)';

    // Approximate acceleration from velocity and rpm
    const f0 = pt.rpm / 60;
    const accelG = Number(((pt.vibrationRms * 2 * Math.PI * f0) / 9806.65).toFixed(2));

    return {
      ...pt,
      timeFormatted,
      isoZone,
      accelG,
    };
  }

  // Efficient Polling Mechanism
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const currentLatest = selectedAsset.telemetry;
      const formatted = formatPoint(currentLatest);

      setTelemetryBuffer((prev) => {
        // Prevent duplicate timestamps if simulation is paused upstream
        const last = prev[prev.length - 1];
        if (last && last.timestampMs === formatted.timestampMs) {
          return prev;
        }
        const updated = [...prev, formatted];
        if (updated.length > bufferSize) {
          return updated.slice(updated.length - bufferSize);
        }
        return updated;
      });
    }, refreshIntervalMs);

    return () => clearInterval(interval);
  }, [selectedAsset.telemetry, bufferSize, refreshIntervalMs, isPaused]);

  // When selected asset changes, reload its history from engine buffer
  useEffect(() => {
    const rawBuffer = dataEngine.getBufferForAsset(selectedAsset.id);
    const initial = rawBuffer.length > 0 ? rawBuffer : [selectedAsset.telemetry];
    setTelemetryBuffer(initial.slice(-bufferSize).map((pt) => formatPoint(pt)));
  }, [selectedAsset.id, bufferSize]);

  // Memoized Statistical Calculations
  const stats = useMemo(() => {
    if (telemetryBuffer.length === 0) {
      return {
        vibMin: 0,
        vibMax: 0,
        vibAvg: 0,
        tempMin: 0,
        tempMax: 0,
        tempAvg: 0,
        currMin: 0,
        currMax: 0,
        currAvg: 0,
        pressMin: 0,
        pressMax: 0,
        pressAvg: 0,
      };
    }

    const vibs = telemetryBuffer.map((p) => p.vibrationRms);
    const temps = telemetryBuffer.map((p) => p.temperature);
    const currs = telemetryBuffer.map((p) => p.current);
    const presses = telemetryBuffer.map((p) => p.pressure);

    const calc = (arr: number[]) => ({
      min: Number(Math.min(...arr).toFixed(2)),
      max: Number(Math.max(...arr).toFixed(2)),
      avg: Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2)),
    });

    const v = calc(vibs);
    const t = calc(temps);
    const c = calc(currs);
    const p = calc(presses);

    return {
      vibMin: v.min,
      vibMax: v.max,
      vibAvg: v.avg,
      tempMin: t.min,
      tempMax: t.max,
      tempAvg: t.avg,
      currMin: c.min,
      currMax: c.max,
      currAvg: c.avg,
      pressMin: p.min,
      pressMax: p.max,
      pressAvg: p.avg,
    };
  }, [telemetryBuffer]);

  // Harmonic FFT breakdown based on current asset
  const harmonicsData = useMemo(() => {
    const latest = telemetryBuffer[telemetryBuffer.length - 1] || selectedAsset.telemetry;
    const v = latest.vibrationRms;
    return [
      { name: '1X (دور نامی)', amp: Number((v * 0.45).toFixed(2)), limit: 2.8, color: '#38bdf8' },
      { name: '2X (عدم‌هم‌راستایی)', amp: Number((v * 0.22).toFixed(2)), limit: 1.5, color: '#818cf8' },
      { name: '3X (هارمونیک تیغه)', amp: Number((v * 0.12).toFixed(2)), limit: 1.0, color: '#c084fc' },
      { name: 'BPFO (شیار خارجی)', amp: Number(((v > 4.5 ? 0.4 : 0.08) * v).toFixed(2)), limit: 1.2, color: '#f43f5e' },
      { name: 'BPFI (شیار داخلی)', amp: Number(((v > 5.5 ? 0.3 : 0.05) * v).toFixed(2)), limit: 1.2, color: '#fb923c' },
    ];
  }, [telemetryBuffer, selectedAsset.telemetry]);

  const latestPoint = telemetryBuffer[telemetryBuffer.length - 1] || selectedAsset.telemetry;

  return (
    <div className="space-y-5 text-right">
      {/* 3D Digital Twin Context Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Machine Identity & 3D Spatial Marker */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <Boxes size={26} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white">
                پایش تله‌متری بلادرنگ در بافت دوقلوی سه‌بعدی (3D Twin Telemetry)
              </h2>
              {selectedAsset.model3DConfig?.position && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                  ماتریس موقعیت: [{selectedAsset.model3DConfig.position.join(', ')}]
                </span>
              )}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                سطح بلوغ: {twinMaturity}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              متصل به مدل مش سه‌بعدی «{selectedAsset.faName || selectedAsset.name}» | ایستگاه گیرنده سنسور پیزوالکتریک لبه DE/NDE
            </p>
          </div>
        </div>

        {/* Action Buttons & 3D Jump Button */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
          {show3DSwitchButton && onNavigateTo3D && (
            <button
              onClick={onNavigateTo3D}
              className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-sky-600/20 transition-all"
            >
              <Boxes size={15} />
              <span>بازگشت به مدل سه‌بعدی Three.js</span>
            </button>
          )}

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
            title="صدور گزارش رسمی مهندسی و نمودارها به صورت PDF"
          >
            <FileDown size={15} className="text-sky-400" />
            <span>خروجی PDF</span>
          </button>

          <button
            onClick={() => setIsInsightModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-800 text-xs font-bold flex items-center gap-1.5 transition-all"
            title="خلاصه‌سازی اسناد و ممیزی فنی با هوش مصنوعی"
          >
            <Sparkles size={15} className="text-purple-400" />
            <span>خلاصه هوشمند سند (Gemini)</span>
          </button>
        </div>
      </div>

      {/* Asset Selector Strip (3D Twin Synchronization) */}
      <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-bold text-slate-400 shrink-0 ml-2">انتخاب تجهیز خط تولید:</span>
        <div className="flex items-center gap-1.5">
          {assets.map((a) => {
            const isSelected = a.id === selectedAsset.id;
            return (
              <button
                key={a.id}
                onClick={() => setSelectedAssetId(a.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-sky-950/80 border-sky-500 text-white font-bold ring-1 ring-sky-500'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    a.status === 'critical'
                      ? 'bg-red-500 animate-ping'
                      : a.status === 'warning'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                />
                <span>{a.faName || a.name}</span>
                <span className="text-[10px] font-mono text-slate-500">
                  {a.telemetry.vibrationRms.toFixed(1)} mm/s
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* High-Level Telemetry KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* KPI 1: Vibration RMS */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold flex items-center gap-1">
              <Activity size={15} className="text-sky-400" />
              <span>سرعت ارتعاشات RMS</span>
            </span>
            <span
              className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                latestPoint.vibrationRms > 4.5
                  ? 'bg-red-950 text-red-400 border border-red-800'
                  : latestPoint.vibrationRms > 2.8
                  ? 'bg-amber-950 text-amber-400 border border-amber-800'
                  : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
              }`}
            >
              ISO {selectedAsset.isoClass}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-white">
              {latestPoint.vibrationRms.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500 font-mono">mm/s RMS</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800 font-mono">
            <span>حداقل: {stats.vibMin}</span>
            <span>میانگین: {stats.vibAvg}</span>
            <span>حداکثر: {stats.vibMax}</span>
          </div>
        </div>

        {/* KPI 2: Temperature */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold flex items-center gap-1">
              <Thermometer size={15} className="text-amber-400" />
              <span>دمای یاتاقان دیس‌شارژ</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">حد هشدار: ۸۰°C</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-white">
              {latestPoint.temperature.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500 font-mono">°C</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800 font-mono">
            <span>حداقل: {stats.tempMin}</span>
            <span>میانگین: {stats.tempAvg}</span>
            <span>حداکثر: {stats.tempMax}</span>
          </div>
        </div>

        {/* KPI 3: Current / Load */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold flex items-center gap-1">
              <Zap size={15} className="text-purple-400" />
              <span>جریان موتور و لود</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">۳ فاز ۳۸۰V</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-white">
              {latestPoint.current.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500 font-mono">آمپر (A)</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800 font-mono">
            <span>حداقل: {stats.currMin}</span>
            <span>میانگین: {stats.currAvg}</span>
            <span>حداکثر: {stats.currMax}</span>
          </div>
        </div>

        {/* KPI 4: Shaft Speed & Pressure */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold flex items-center gap-1">
              <Gauge size={15} className="text-emerald-400" />
              <span>سرعت دورانی و فشار</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">فرکانس: {(latestPoint.rpm / 60).toFixed(1)}Hz</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-white">
              {latestPoint.rpm}
            </span>
            <span className="text-xs text-slate-500 font-mono">RPM ({latestPoint.pressure.toFixed(1)} bar)</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800 font-mono">
            <span>سلامت: {selectedAsset.healthScore}٪</span>
            <span>عمر باقیمانده: {selectedAsset.rulHours}h</span>
          </div>
        </div>
      </div>

      {/* RealTime Telemetry Recharts Display */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        {/* Stream Controls Bar (Optimized Buffer Refresh Logic) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          {/* Metric Selector Tabs */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveMetricTab('vibration')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeMetricTab === 'vibration'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ارتعاشات و شتاب پیک (ISO 10816)
            </button>
            <button
              onClick={() => setActiveMetricTab('thermal')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeMetricTab === 'thermal'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              دما و شیب حرارتی یاتاقان
            </button>
            <button
              onClick={() => setActiveMetricTab('electrical')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeMetricTab === 'electrical'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              جریان الکتریکی و فشار فرایندی
            </button>
            <button
              onClick={() => setActiveMetricTab('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeMetricTab === 'all'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              نمودار تجمیعی چندشاخصی
            </button>
          </div>

          {/* Buffer Window & Polling Controls */}
          <div className="flex items-center gap-2 text-xs">
            {/* Play/Pause Buffer */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all border ${
                isPaused
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title={isPaused ? 'ادامه ثبت بلادرنگ' : 'توقف موقت بافر جهت بررسی ریزموج‌ها'}
            >
              {isPaused ? <Play size={14} className="fill-amber-400 text-amber-400" /> : <Pause size={14} />}
              <span>{isPaused ? 'متوقف (Pause)' : 'برخط (Live)'}</span>
            </button>

            {/* Window Size Selector */}
            <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400">طول بافر:</span>
              {[30, 60, 120].map((size) => (
                <button
                  key={size}
                  onClick={() => setBufferSize(size)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                    bufferSize === size
                      ? 'bg-sky-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {size}s
                </button>
              ))}
            </div>

            {/* Refresh Rate Selector */}
            <select
              value={refreshIntervalMs}
              onChange={(e) => setRefreshIntervalMs(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-[11px] rounded-lg px-2 py-1 font-mono focus:outline-none focus:border-sky-500"
            >
              <option value={500}>نرخ: ۰.۵ ثانیه</option>
              <option value={1000}>نرخ: ۱.۰ ثانیه</option>
              <option value={2000}>نرخ: ۲.۰ ثانیه</option>
            </select>
          </div>
        </div>

        {/* Primary Chart Area using Recharts */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {activeMetricTab === 'vibration' ? (
              <AreaChart data={telemetryBuffer} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="vibGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timeFormatted" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 'dataMax + 2']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '11px',
                    direction: 'rtl',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8', paddingTop: '8px' }} />
                
                {/* ISO 10816 Threshold Reference Lines */}
                <ReferenceLine y={1.4} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'حد A (ایده‌آل)', fill: '#10b981', fontSize: 10, position: 'right' }} />
                <ReferenceLine y={2.8} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'حد B (هشدار مقدماتی)', fill: '#f59e0b', fontSize: 10, position: 'right' }} />
                <ReferenceLine y={4.5} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'حد C/D (خطر / توقف)', fill: '#ef4444', fontSize: 10, position: 'right' }} />

                <Area
                  type="monotone"
                  dataKey="vibrationRms"
                  name="سرعت ارتعاشات RMS (mm/s)"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#vibGradient)"
                  isAnimationActive={false}
                />
              </AreaChart>
            ) : activeMetricTab === 'thermal' ? (
              <AreaChart data={telemetryBuffer} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timeFormatted" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} domain={[20, 110]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '11px',
                    direction: 'rtl',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8', paddingTop: '8px' }} />
                <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'آستانه هشدار ۸۰°C', fill: '#ef4444', fontSize: 10, position: 'right' }} />
                <Area
                  type="monotone"
                  dataKey="temperature"
                  name="دمای بیرینگ (°C)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#tempGradient)"
                  isAnimationActive={false}
                />
              </AreaChart>
            ) : activeMetricTab === 'electrical' ? (
              <LineChart data={telemetryBuffer} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timeFormatted" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '11px',
                    direction: 'rtl',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8', paddingTop: '8px' }} />
                <Line
                  type="monotone"
                  dataKey="current"
                  name="جریان موتور (Amperes)"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="pressure"
                  name="فشار عملیاتی (Bar)"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            ) : (
              <LineChart data={telemetryBuffer} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timeFormatted" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '11px',
                    direction: 'rtl',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8', paddingTop: '8px' }} />
                <Line
                  type="monotone"
                  dataKey="vibrationRms"
                  name="ارتعاشات (mm/s)"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  name="دما (°C)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="current"
                  name="جریان (A)"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Dynamic Section: FFT Harmonics Breakdown & Truth Seal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sub-Card 1: Recharts BarChart for FFT Fault Harmonics */}
        <div className="lg:col-span-2 p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Waves size={16} className="text-sky-400" />
              <h3 className="text-xs font-bold text-white">
                توزیع دامنه‌ای هارمونیک‌های ارتعاشی یاتاقان (FFT Fault Harmonics)
              </h3>
            </div>
            <a
              href={`#/vibration/${selectedAsset.id}`}
              className="text-[11px] text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
            >
              <span>مشاهده آبشار کامل طیف</span>
              <span>←</span>
            </a>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={harmonicsData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 4]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '11px',
                    direction: 'rtl',
                  }}
                />
                <ReferenceLine y={1.5} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'آستانه نقص ۱.۵', fill: '#ef4444', fontSize: 9 }} />
                <Bar dataKey="amp" name="دامنه شتاب/سرعت" fill="#38bdf8" radius={[4, 4, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sub-Card 2: Cryptographic Truth Seal & What-If Status */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-xs pb-2 border-b border-slate-800">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>اعتبارسنجی بلوک حقیقت (Truth Block)</span>
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-500">شناسه آخرین بلوک زنجیره:</div>
                <div className="font-mono text-sky-400 font-bold text-[11px] truncate">
                  {selectedAsset.lastTruthBlockId || 'TB-2026-980124'}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-500">دقت همگام‌سازی ساعت PTP:</div>
                <div className="font-mono text-emerald-400 font-bold text-[11px]">
                  ±۶.۸ میکروثانیه (IEEE 1588)
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">سناریوی فعال What-If:</span>
              <span className="font-bold text-purple-400">
                {activeScenario ? activeScenario.titleFa : 'عادی / پایدار'}
              </span>
            </div>
            <a
              href={`#/what-if/${selectedAsset.id}`}
              className="w-full py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <Sliders size={14} />
              <span>تزریق سناریوی خرابی به دوقلو</span>
            </a>
          </div>
        </div>
      </div>

      {/* PDF Export Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        asset={selectedAsset}
        telemetryHistory={telemetryBuffer}
      />

      {/* AI Document Insight Modal */}
      <DocumentInsightModal
        isOpen={isInsightModalOpen}
        onClose={() => setIsInsightModalOpen(false)}
      />
    </div>
  );
};

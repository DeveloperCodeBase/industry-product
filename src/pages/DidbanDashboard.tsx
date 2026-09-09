import React, { useState } from 'react';
import {
  Eye,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileCheck2,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Filter,
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  Waves
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Asset, TelemetryData } from '../types';
import { dataEngine } from '../services/syntheticData';

export const DidbanDashboard: React.FC = () => {
  const { assets, selectedAssetId, setSelectedAssetId, activeScenario, t, isRtl } = useApp();
  const [filterSection, setFilterSection] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [playbackTimeOffset, setPlaybackTimeOffset] = useState<number>(0);
  const [activeSignalTab, setActiveSignalTab] = useState<'vibrationRms' | 'temperature' | 'current' | 'pressure'>('vibrationRms');

  const selected = assets.find((a) => a.id === selectedAssetId) || assets[0];
  const historyData = dataEngine.getBufferForAsset(selected.id);

  // Filtered assets list
  const filteredAssets = assets.filter((a) => {
    if (filterSection !== 'all' && a.section !== filterSection) return false;
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    return true;
  });

  // Calculate high-level plant stats
  const avgHealth = Math.round(assets.reduce((sum, a) => sum + a.healthScore, 0) / assets.length);
  const criticalCount = assets.filter((a) => a.status === 'critical').length;
  const warningCount = assets.filter((a) => a.status === 'warning').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Mission Statement */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Eye size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{t('didban_header_title')}</h1>
              <span className="text-xs text-sky-400 font-mono">{t('didban_header_sub')}</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">
            {t('didban_header_desc')}
          </p>
        </div>

        {/* Global KPIs */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-center flex-1 sm:flex-none min-w-[120px]">
            <div className="text-[11px] text-slate-400">{t('didban_avg_health')}</div>
            <div className="text-lg font-black font-mono text-emerald-400 mt-0.5">{avgHealth}٪</div>
          </div>
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-center flex-1 sm:flex-none min-w-[120px]">
            <div className="text-[11px] text-slate-400">{t('didban_open_alerts')}</div>
            <div className="text-lg font-black font-mono text-amber-400 mt-0.5">
              {warningCount + criticalCount}
            </div>
          </div>
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-center hidden lg:block min-w-[120px]">
            <div className="text-[11px] text-slate-400">{t('didban_evidence_integrity')}</div>
            <div className="text-lg font-black font-mono text-sky-400 mt-0.5">۹۹.۹۸٪</div>
          </div>
        </div>
      </div>

      {/* Filter and View Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <Filter size={14} className="text-slate-400" />
          <span className="font-semibold text-slate-300">{t('didban_filter_status')}</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
          >
            <option value="all">{t('didban_filter_all')} ({assets.length})</option>
            <option value="normal">{t('didban_filter_healthy')}</option>
            <option value="warning">{t('didban_filter_warning')}</option>
            <option value="critical">{t('didban_filter_critical')}</option>
          </select>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          {filteredAssets.length} / {assets.length}
        </div>
      </div>

      {/* Asset Health Tiles Grid (8-12 tiles as requested in doc chapter 15) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredAssets.map((asset) => {
          const isSelected = asset.id === selected.id;
          return (
            <div
              key={asset.id}
              onClick={() => setSelectedAssetId(asset.id)}
              className={`cursor-pointer p-4 rounded-2xl border transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-slate-900 border-sky-500 shadow-lg shadow-sky-500/20 ring-1 ring-sky-500/40'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              {/* Status colored accent bar */}
              <div
                className={`absolute top-0 right-0 left-0 h-1 ${
                  asset.status === 'normal'
                    ? 'bg-emerald-500'
                    : asset.status === 'advisory'
                    ? 'bg-sky-500'
                    : asset.status === 'warning'
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
              />

              <div className="flex items-start justify-between mt-1">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{asset.id}</span>
                  <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-sky-300 transition-colors">
                    {asset.name}
                  </h3>
                </div>

                {/* Health Score Pill */}
                <div
                  className={`px-2 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 ${
                    asset.healthScore >= 90
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : asset.healthScore >= 75
                      ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                      : asset.healthScore >= 50
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  <Activity size={12} />
                  <span>{asset.healthScore}٪</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">{asset.faName}</p>

              {/* Real-time telemetry badges */}
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-xs">
                <div className="bg-slate-950/80 p-1.5 rounded-lg border border-slate-800/60">
                  <div className="text-[10px] text-slate-500">{t('didban_vibration_rms')}</div>
                  <div className="font-mono font-bold text-slate-200 mt-0.5 flex items-center justify-between">
                    <span>{asset.telemetry.vibrationRms}</span>
                    <span className="text-[9px] text-slate-500">mm/s</span>
                  </div>
                </div>
                <div className="bg-slate-950/80 p-1.5 rounded-lg border border-slate-800/60">
                  <div className="text-[10px] text-slate-500">{t('didban_temperature')}</div>
                  <div className="font-mono font-bold text-slate-200 mt-0.5 flex items-center justify-between">
                    <span>{asset.telemetry.temperature}</span>
                    <span className="text-[9px] text-slate-500">°C</span>
                  </div>
                </div>
              </div>

              {/* Confidence Score & Truth Block Link */}
              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <ShieldCheck size={12} className="text-emerald-400" />
                  <span>{t('didban_confidence_score')}: <strong>{asset.confidenceScore}٪</strong></span>
                </span>
                <span className="text-sky-400 flex items-center gap-1 group-hover:underline">
                  <span>{(asset.lastTruthBlockId || 'TB-2026-980124').slice(0, 12)}</span>
                  <FileCheck2 size={11} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Asset Detailed Real-time Analysis */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-sky-400 uppercase">{selected.id}</span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">{selected.section}</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">{selected.faName || selected.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{selected.type} — ISO {selected.isoClass}</p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`#/vibration/${selected.id}`}
              className="px-3 py-2 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 font-semibold text-xs border border-sky-500/30 transition-colors flex items-center gap-1.5"
            >
              <Waves size={14} />
              <span>{t('didban_fft_spectrum')}</span>
            </a>
            <a
              href={`#/what-if/${selected.id}`}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Sliders size={14} />
              <span>{t('nav_what_if')}</span>
            </a>
          </div>
        </div>

        {/* Signal Tab Selector */}
        <div className="flex items-center gap-2 text-xs border-b border-slate-800/80 pb-2 overflow-x-auto">
          {[
            { id: 'vibrationRms', label: `${t('didban_vibration_rms')} (mm/s)`, value: `${selected.telemetry.vibrationRms} mm/s` },
            { id: 'temperature', label: `${t('didban_temperature')} (°C)`, value: `${selected.telemetry.temperature} °C` },
            { id: 'current', label: `Current (A)`, value: `${selected.telemetry.current} A` },
            { id: 'pressure', label: `Pressure (bar)`, value: `${selected.telemetry.pressure} bar` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSignalTab(tab.id as any)}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeSignalTab === tab.id
                  ? 'bg-sky-600/20 text-sky-300 border border-sky-500/40 font-bold'
                  : 'text-slate-400 hover:bg-slate-800/80'
              }`}
            >
              <div className="text-[11px]">{tab.label}</div>
              <div className="font-mono text-white text-xs mt-0.5">{tab.value}</div>
            </button>
          ))}
        </div>

        {/* Live SVG Time-Series Chart */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Activity size={14} className="text-sky-400 animate-pulse" />
              روند زنده سری زمانی ({activeSignalTab}) — بافر ۵۰۰ نقطه بر مبنای فصل ۱۵
            </span>
            <span>بازه نمونه‌برداری: ۱ ثانیه | کالیبره ISO 13374</span>
          </div>

          {/* SVG Line Chart */}
          <div className="h-44 w-full relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Reference Grid lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#1e293b" strokeDasharray="3,3" />
              <line x1="0" y1="60" x2="500" y2="60" stroke="#1e293b" strokeDasharray="3,3" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="#1e293b" strokeDasharray="3,3" />

              {/* Draw Data Points */}
              {historyData.length > 1 && (() => {
                const values = historyData.map((d) => d[activeSignalTab]);
                const minVal = Math.min(...values) * 0.9;
                const maxVal = Math.max(...values) * 1.1 || 1;
                const range = maxVal - minVal || 1;

                const points = values.map((val, idx) => {
                  const x = (idx / (values.length - 1)) * 500;
                  const y = 110 - ((val - minVal) / range) * 100;
                  return `${x.toFixed(1)},${y.toFixed(1)}`;
                });

                const polyPath = points.join(' ');
                const areaPath = `0,120 ${polyPath} 500,120`;

                return (
                  <>
                    <polygon points={areaPath} fill="url(#chartGradient)" />
                    <polyline
                      points={polyPath}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                );
              })()}
            </svg>
          </div>
        </div>

        {/* Historical Playback Scrubber (بازپخش تاریخی با اسلایدر زمان - الزام فصل ۱۵) */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock size={14} className="text-amber-400" />
              بازپخش و مرور تاریخی وضعیت کارخانه (Time Scrubber)
            </span>
            <span className="font-mono text-slate-400 text-[11px]">
              {playbackTimeOffset === 0 ? 'اکنون (برخط)' : `${playbackTimeOffset} دقیقه قبل`}
            </span>
          </div>

          <input
            type="range"
            min="-60"
            max="0"
            value={playbackTimeOffset}
            onChange={(e) => setPlaybackTimeOffset(Number(e.target.value))}
            className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>۶۰ دقیقه قبل</span>
            <span>۳۰ دقیقه قبل</span>
            <span className="text-emerald-400 font-bold">زمان زنده کنونی</span>
          </div>
        </div>
      </div>
    </div>
  );
};

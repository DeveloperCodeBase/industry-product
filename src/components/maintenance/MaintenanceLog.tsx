import React, { useState, useMemo } from 'react';
import {
  Wrench,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingDown,
  TrendingUp,
  Calendar,
  Sparkles,
  Sliders,
  DollarSign,
  ShieldAlert,
  ChevronLeft,
  Filter,
  Plus,
  Headphones,
  CheckCircle,
  FileCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ReferenceArea,
  AreaChart,
  Area
} from 'recharts';
import { useApp } from '../../context/AppContext';
import {
  INITIAL_COMPONENT_HEALTH,
  INITIAL_INTERVENTIONS,
  generateDegradationTimeline
} from '../../data/maintenanceLogData';
import { ComponentHealthRecord, MaintenanceIntervention, DegradationDataPoint } from '../../types';
import { IndustrialAudioPlayer } from '../common/IndustrialAudioPlayer';

export const MaintenanceLog: React.FC<{ initialAssetId?: string }> = ({ initialAssetId }) => {
  const { assets, selectedAssetId, setSelectedAssetId, currentUser, t } = useApp();
  const activeAssetId = initialAssetId || selectedAssetId || 'compressor-04';
  const activeAsset = assets.find((a) => a.id === activeAssetId) || assets[0];

  const [interventions, setInterventions] = useState<MaintenanceIntervention[]>(INITIAL_INTERVENTIONS);
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'scheduled' | 'in_progress'>('all');
  const [metricView, setMetricView] = useState<'health' | 'vibration' | 'rul'>('health');
  const [selectedInterventionForAudio, setSelectedInterventionForAudio] = useState<MaintenanceIntervention | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New intervention form state
  const [newAction, setNewAction] = useState('');
  const [newComponent, setNewComponent] = useState('مجموعه بیرینگ محرک');
  const [newPriority, setNewPriority] = useState<'emergency' | 'high' | 'scheduled' | 'preventive'>('high');

  // Degradation timeline data
  const degradationData: DegradationDataPoint[] = useMemo(() => {
    return generateDegradationTimeline(activeAssetId);
  }, [activeAssetId]);

  // Component health items for current asset
  const componentHealthItems: ComponentHealthRecord[] = useMemo(() => {
    return (
      INITIAL_COMPONENT_HEALTH[activeAssetId] || [
        {
          componentName: 'یاتاقان‌های دوار اصلی',
          componentKey: 'bearings',
          healthScore: activeAsset.healthScore,
          degradationRate: 1.8,
          criticality: 'critical',
          primaryStressFactor: 'فشار دینامیکی کارکرد پیوسته و تنش حرارتی',
          recommendedInspectionDays: 10,
        },
        {
          componentName: 'سیستم آب‌بندی و پکینگ',
          componentKey: 'seal',
          healthScore: Math.min(100, activeAsset.healthScore + 15),
          degradationRate: 0.9,
          criticality: 'high',
          primaryStressFactor: 'فرسایش ملایم لایه‌مرزی الاستومری',
          recommendedInspectionDays: 30,
        },
      ]
    );
  }, [activeAssetId, activeAsset.healthScore]);

  // Filtered interventions
  const filteredInterventions = useMemo(() => {
    return interventions.filter((item) => {
      const matchAsset = item.assetId === activeAssetId || activeAssetId === 'all';
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchAsset && matchStatus;
    });
  }, [interventions, activeAssetId, statusFilter]);

  const handleAddIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAction.trim()) return;

    const newEntry: MaintenanceIntervention = {
      id: `int-${Date.now()}`,
      assetId: activeAssetId,
      assetName: activeAsset.faName || activeAsset.name,
      component: newComponent,
      suggestedAction: newAction,
      technicalDetails: `ثبت دستی مداخله توسط ${currentUser.nameFa || currentUser.name} به عنوان متمم پیش‌بینی هوش مصنوعی.`,
      confidenceScore: 95.0,
      priority: newPriority,
      status: 'scheduled',
      triggeredBy: 'ثبت کاربر ارشد قابلیت اطمینان (Expert Manual Entry)',
      suggestedDate: '۱۴۰۵/۰۶/۱۸ - شیفت صبح',
      technicianName: currentUser.nameFa || currentUser.name,
      preventedDowntimeHours: 10,
      economicSavingsMillionTomans: 650,
    };

    setInterventions((prev) => [newEntry, ...prev]);
    setNewAction('');
    setShowAddModal(false);
  };

  const handleToggleComplete = (id: string) => {
    setInterventions((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'completed' ? 'in_progress' : 'completed';
          return {
            ...item,
            status: nextStatus,
            completedDate: nextStatus === 'completed' ? '۱۴۰۵/۰۶/۰۸ - اکنون' : undefined,
          };
        }
        return item;
      })
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
            <Wrench size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                لاگ نگهداری پیش‌بینانه و روند زوال قطعات (MaintenanceLog)
              </h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                AI Service Interventions
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              پایش روند تخریب زمانی اجزای تجهیزات بر پایه داده‌های ارتعاشاتی و تاریخچه مداخلات هوش مصنوعی
            </p>
          </div>
        </div>

        {/* Asset Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-bold whitespace-nowrap">انتخاب تجهیز:</label>
          <select
            value={activeAssetId}
            onChange={(e) => setSelectedAssetId(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-sky-500"
          >
            {assets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.faName || asset.name} ({asset.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Component Health Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity size={16} className="text-sky-400" />
            <span>سلامت لحظه‌ای اجزای مکانیکی و الکتریکی {activeAsset.faName}</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {componentHealthItems.length} مؤلفه پایش‌شده
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {componentHealthItems.map((comp) => {
            const isCritical = comp.healthScore < 60;
            const isWarning = comp.healthScore >= 60 && comp.healthScore < 80;
            return (
              <div
                key={comp.componentKey}
                className={`p-4 rounded-2xl border transition-all ${
                  isCritical
                    ? 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-950/20'
                    : isWarning
                    ? 'bg-amber-950/20 border-amber-500/30'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <span className="text-xs font-bold text-white truncate max-w-[70%]">
                    {comp.componentName}
                  </span>
                  <span
                    className={`text-xs font-mono font-black px-2 py-0.5 rounded ${
                      isCritical
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : isWarning
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {comp.healthScore}٪
                  </span>
                </div>

                <div className="pt-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>نرخ تخریب (Degradation Rate):</span>
                    <span className="font-mono text-amber-400 font-bold">{comp.degradationRate}٪ / ماه</span>
                  </div>

                  <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-950/50 p-2 rounded-xl border border-slate-800/50">
                    <strong className="text-slate-300">عامل استرس: </strong>
                    {comp.primaryStressFactor}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>پایش بعدی توصیه شده:</span>
                    <span className="font-mono font-bold text-sky-400">{comp.recommendedInspectionDays} روز آینده</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Degradation Trends Recharts Visualization */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <TrendingDown size={18} className="text-sky-400" />
              <h2 className="text-base font-bold text-white">
                روند زوال و پیش‌بینی عمر مفید (Degradation Trends & RUL Forecast)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              تاریخچه ۲۰ روز گذشته + پیش‌بینی ۱۰ روز آینده با مدل رگرسیون تضعیف ویبول هوش مصنوعی
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <button
              onClick={() => setMetricView('health')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                metricView === 'health'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              شاخص سلامت کل (٪)
            </button>
            <button
              onClick={() => setMetricView('vibration')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                metricView === 'vibration'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ارتعاشات RMS و اینولپ (mm/s & g)
            </button>
            <button
              onClick={() => setMetricView('rul')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                metricView === 'rul'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              عمر باقیمانده RUL (ساعت)
            </button>
          </div>
        </div>

        {/* Recharts Chart Container */}
        <div className="h-72 w-full pt-2" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            {metricView === 'health' ? (
              <AreaChart data={degradationData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Warning 60%', fill: '#f59e0b', fontSize: 10 }} />
                <ReferenceLine y={35} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Critical 35%', fill: '#ef4444', fontSize: 10 }} />
                <ReferenceArea x1={degradationData[20]?.timestamp} x2={degradationData[degradationData.length - 1]?.timestamp} fill="#38bdf8" fillOpacity={0.07} />
                <Area
                  type="monotone"
                  dataKey="overallHealth"
                  name="شاخص سلامت تجهیز"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#healthGrad)"
                />
              </AreaChart>
            ) : metricView === 'vibration' ? (
              <LineChart data={degradationData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <ReferenceLine y={4.5} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'ISO Zone C (4.5 mm/s)', fill: '#f59e0b', fontSize: 10 }} />
                <ReferenceLine y={7.1} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'ISO Zone D Trip (7.1 mm/s)', fill: '#ef4444', fontSize: 10 }} />
                <Line
                  type="monotone"
                  dataKey="vibrationRms"
                  name="ارتعاش سرعت RMS (mm/s)"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="envelopePeakG"
                  name="شتاب اینولپ بیرینگ (g)"
                  stroke="#ec4899"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            ) : (
              <LineChart data={degradationData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit=" h" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <ReferenceLine y={200} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'RUL Alarm 200h', fill: '#ef4444', fontSize: 10 }} />
                <Line
                  type="monotone"
                  dataKey="rulForecastHours"
                  name="عمر مفید باقیمانده RUL (ساعت)"
                  stroke="#a855f7"
                  strokeWidth={2.5}
                  dot={{ r: 2 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span>داده‌های ثبت‌شده کالیبره</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span>ناحیه پیش‌بینی هوش مصنوعی (۱۰ روز آینده)</span>
            </span>
          </div>
          <div className="font-mono text-slate-500 text-[11px]">
            مدل پیش‌بینی: Weibull Hazard Rate & Physics-Informed LSTM
          </div>
        </div>
      </div>

      {/* History of AI-Suggested Service Interventions */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles size={18} className="text-purple-400" />
              <span>تاریخچه مداخلات و سرویس‌های پیشنهادی هوش مصنوعی (AI Service Interventions)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              ثبت توصیه‌های تعمیراتی هدفمند مبتنی بر تحلیل FFT، همبستگی چندسیگنالی و شاخص اطمینان هوش مصنوعی
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  statusFilter === 'all' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                همه ({interventions.length})
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  statusFilter === 'completed' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                تکمیل‌شده
              </button>
              <button
                onClick={() => setStatusFilter('scheduled')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  statusFilter === 'scheduled' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                برنامه‌ریزی‌شده
              </button>
              <button
                onClick={() => setStatusFilter('in_progress')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  statusFilter === 'in_progress' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                در حال اجرا
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-sky-600/30 transition-all"
            >
              <Plus size={15} />
              <span>ثبت مداخله دستی</span>
            </button>
          </div>
        </div>

        {/* Audio Player for Selected Intervention */}
        {selectedInterventionForAudio && (
          <IndustrialAudioPlayer
            title={`دستورالعمل صوتی: ${selectedInterventionForAudio.component}`}
            subtitle={`اقدام پیشنهادی: ${selectedInterventionForAudio.suggestedAction}`}
            textToSpeak={`${selectedInterventionForAudio.suggestedAction}. جزییات فنی: ${selectedInterventionForAudio.technicalDetails}. علت تشخیص: ${selectedInterventionForAudio.triggeredBy}. ضریب اطمینان هوش مصنوعی: ${selectedInterventionForAudio.confidenceScore} درصد.`}
          />
        )}

        {/* Interventions List */}
        <div className="space-y-3">
          {filteredInterventions.map((item) => {
            const isCompleted = item.status === 'completed';
            const isEmergency = item.priority === 'emergency';
            return (
              <div
                key={item.id}
                className={`p-5 rounded-3xl border transition-all ${
                  isCompleted
                    ? 'bg-slate-900/60 border-slate-800'
                    : isEmergency
                    ? 'bg-rose-950/30 border-rose-500/50 shadow-xl shadow-rose-950/30'
                    : 'bg-slate-900/90 border-slate-700/80'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {item.assetId}
                      </span>
                      <span className="text-xs font-bold text-sky-400">{item.component}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.priority === 'emergency'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                            : item.priority === 'high'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        }`}
                      >
                        اولویت: {item.priority}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                        اطمینان AI: {item.confidenceScore}٪
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-black text-white">{item.suggestedAction}</h3>
                  </div>

                  {/* Status & Audio Quick Action */}
                  <div className="flex items-center gap-2 self-start lg:self-auto">
                    <button
                      onClick={() => setSelectedInterventionForAudio(item)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title="قرائت صوتی دستورالعمل برای تکنسین"
                    >
                      <Headphones size={14} />
                      <span>قرائت صوتی (TTS)</span>
                    </button>

                    <button
                      onClick={() => handleToggleComplete(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        isCompleted
                          ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30'
                          : 'bg-amber-600 hover:bg-amber-500 text-white shadow-md'
                      }`}
                    >
                      <CheckCircle2 size={14} />
                      <span>{isCompleted ? 'تکمیل‌شده' : 'ثبت اقدام و بستن'}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400 text-[11px]">محرک هوش مصنوعی (Trigger):</span>
                    <p className="text-slate-200 leading-snug">{item.triggeredBy}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 text-[11px]">جزئیات فنی عیب‌یابی:</span>
                    <p className="text-slate-300 leading-snug">{item.technicalDetails}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 text-[11px]">صرفه‌جویی و پیشگیری:</span>
                    <div className="flex items-center gap-2 font-mono text-emerald-400 font-bold">
                      <span>جلوگیری از {item.preventedDowntimeHours} ساعت توقف</span>
                      <span>≈ {item.economicSavingsMillionTomans} م.تومان</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 text-[11px]">مسئول پیگیری و زمان:</span>
                    <div className="text-slate-300">
                      <div>{item.technicianName || 'واحد نگهداری و تعمیرات'}</div>
                      <div className="text-[11px] font-mono text-slate-400">{item.suggestedDate}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Intervention Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Wrench size={18} className="text-sky-400" />
                <span>ثبت مداخله و اقدام سرویس جدید</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddIntervention} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">مؤلفه تحت سرویس:</label>
                <input
                  type="text"
                  value={newComponent}
                  onChange={(e) => setNewComponent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">اقدام پیشنهادی و شرح کار:</label>
                <textarea
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  placeholder="مثال: روان‌کاری تکمیلی با گریس سنتیتی و بررسی میزان ارتعاش پس از تعویض..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">اولویت اقدام:</label>
                  <select
                    value={newPriority}
                    onChange={(e: any) => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="emergency">اضطراری (Emergency)</option>
                    <option value="high">بالا (High)</option>
                    <option value="scheduled">برنامه‌ریزی‌شده (Scheduled)</option>
                    <option value="preventive">پیشگیرانه (Preventive)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">کاربر ثبت‌کننده:</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.nameFa || currentUser.name}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-lg shadow-sky-600/30"
                >
                  ثبت در سامانه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

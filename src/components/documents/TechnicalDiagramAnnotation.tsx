import React, { useState, useEffect } from 'react';
import {
  FileText,
  MessageSquarePlus,
  Pin,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  Filter,
  Eye,
  ShieldCheck,
  Search,
  Sparkles,
  Headphones,
  Maximize2,
  Minimize2,
  Trash2,
  ChevronLeft,
  Crosshair
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DiagramAnnotation } from '../../types';
import {
  TECHNICAL_DIAGRAMS,
  INITIAL_DIAGRAM_ANNOTATIONS,
  IndustrialTechnicalDiagram
} from '../../data/diagramAnnotationsData';
import { IndustrialAudioPlayer } from '../common/IndustrialAudioPlayer';

export const TechnicalDiagramAnnotation: React.FC = () => {
  const { currentUser, t } = useApp();
  const [selectedDiagram, setSelectedDiagram] = useState<IndustrialTechnicalDiagram>(TECHNICAL_DIAGRAMS[0]);
  
  // Persistent annotations state
  const [annotations, setAnnotations] = useState<DiagramAnnotation[]>(() => {
    try {
      const saved = localStorage.getItem('vista_diagram_annotations');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_DIAGRAM_ANNOTATIONS;
  });

  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'resolved'>('all');
  const [activePinId, setActivePinId] = useState<string | null>(null);
  const [isPlacingPin, setIsPlacingPin] = useState<boolean>(false);
  const [pendingPinCoords, setPendingPinCoords] = useState<{ x: number; y: number } | null>(null);
  const [ttsNoteText, setTtsNoteText] = useState<string | null>(null);

  // New Note Modal Form State
  const [noteTitle, setNoteTitle] = useState('');
  const [noteComment, setNoteComment] = useState('');
  const [noteCategory, setNoteCategory] = useState<DiagramAnnotation['category']>('vibration_defect');
  const [noteSeverity, setNoteSeverity] = useState<DiagramAnnotation['severity']>('warning');

  useEffect(() => {
    try {
      localStorage.setItem('vista_diagram_annotations', JSON.stringify(annotations));
    } catch {}
  }, [annotations]);

  // Filtered annotations for current diagram
  const currentDiagramAnnotations = annotations.filter((ann) => {
    const matchesDiagram = ann.diagramId === selectedDiagram.id;
    const matchesStatus = filterStatus === 'all' || ann.status === filterStatus;
    return matchesDiagram && matchesStatus;
  });

  const activeAnnotation = annotations.find((a) => a.id === activePinId);

  const handleDiagramClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlacingPin) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPendingPinCoords({ x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) });
  };

  const handleSaveNewAnnotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingPinCoords || !noteTitle.trim()) return;

    const newAnnotation: DiagramAnnotation = {
      id: `ann-${Date.now()}`,
      diagramId: selectedDiagram.id,
      diagramTitle: selectedDiagram.titleFa,
      xPercent: pendingPinCoords.x,
      yPercent: pendingPinCoords.y,
      authorName: currentUser.nameFa || currentUser.name || 'کارشناس فنی',
      authorRole: currentUser.roleTitleFa || currentUser.role || 'کارشناس ارشد ممیزی',
      authorAvatar: currentUser.avatar,
      category: noteCategory,
      severity: noteSeverity,
      title: noteTitle,
      comment: noteComment,
      timestamp: new Date().toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'open',
    };

    setAnnotations((prev) => [newAnnotation, ...prev]);
    setActivePinId(newAnnotation.id);
    setPendingPinCoords(null);
    setIsPlacingPin(false);
    setNoteTitle('');
    setNoteComment('');
  };

  const handleToggleResolve = (id: string) => {
    setAnnotations((prev) =>
      prev.map((ann) => {
        if (ann.id === id) {
          const isResolved = ann.status === 'resolved';
          return {
            ...ann,
            status: isResolved ? 'open' : 'resolved',
            resolvedBy: isResolved ? undefined : (currentUser.nameFa || currentUser.name),
            resolvedAt: isResolved ? undefined : '۱۴۰۵/۰۶/۰۸ - اکنون',
          };
        }
        return ann;
      })
    );
  };

  const handleDeleteAnnotation = (id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
    if (activePinId === id) setActivePinId(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
            <FileText size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                لایه یادداشت‌گذاری همکارانه نقشه‌های صنعتی و PDF
              </h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                P&ID Collaboration
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              ثبت نشانگرها و یادداشت‌های برچسب‌دار زمانی تیم فنی بر روی نقشه‌های مهندسی با ذخیره‌سازی ابری
            </p>
          </div>
        </div>

        {/* Controls & Mode Switch */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="#/schematic-overlay"
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-900/30 transition-all"
          >
            <Crosshair size={15} />
            <span>اورلی تعاملی قطعات نقشه (Schematic Overlay)</span>
          </a>

          {/* Diagram Selector */}
          <div className="flex items-center gap-2">
            <select
              value={selectedDiagram.id}
              onChange={(e) => {
                const d = TECHNICAL_DIAGRAMS.find((x) => x.id === e.target.value);
                if (d) {
                  setSelectedDiagram(d);
                  setActivePinId(null);
                  setIsPlacingPin(false);
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-sky-500"
            >
              {TECHNICAL_DIAGRAMS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.titleFa} ({d.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* TTS Audio Player Bar (if active note requested) */}
      {ttsNoteText && (
        <IndustrialAudioPlayer
          title="قرائت صوتی یادداشت فنی مهندسی"
          subtitle="انتقال صوتی اطلاعات نقشه برای تکنسین‌های حاضر در سایت"
          textToSpeak={ttsNoteText}
        />
      )}

      {/* Main Workspace: Diagram Viewer + Annotation Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Diagram Canvas */}
        <div className="lg:col-span-2 space-y-3">
          {/* Canvas Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/80 px-2 py-1 rounded border border-sky-800/60">
                {selectedDiagram.code}
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                استاندارد: {selectedDiagram.standard}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsPlacingPin(!isPlacingPin);
                  setPendingPinCoords(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                  isPlacingPin
                    ? 'bg-amber-500 text-slate-950 animate-pulse font-black'
                    : 'bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white'
                }`}
              >
                <Pin size={15} />
                <span>{isPlacingPin ? 'روی نقشه کلیک کنید تا پین قرار گیرد' : 'افزودن یادداشت جدید (Add Pin)'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Blueprint Vector Stage */}
          <div
            onClick={handleDiagramClick}
            className={`relative w-full aspect-[16/10] rounded-3xl bg-[#060c18] border-2 overflow-hidden select-none transition-all ${
              isPlacingPin
                ? 'cursor-crosshair border-amber-500/70 shadow-lg shadow-amber-950/30'
                : 'border-slate-800'
            }`}
          >
            {/* Grid Blueprint Background Pattern */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(#38bdf8 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
                backgroundSize: '40px 40px, 20px 20px, 20px 20px',
              }}
            />

            {/* Industrial Diagram Vector Schematics */}
            {selectedDiagram.svgType === 'compressor_pid' ? (
              <svg className="w-full h-full p-8" viewBox="0 0 800 500" fill="none">
                {/* Main Pipeline */}
                <path d="M 50 250 L 250 250" stroke="#38bdf8" strokeWidth="4" strokeDasharray="6 2" />
                <path d="M 370 250 L 750 250" stroke="#0284c7" strokeWidth="4" />
                
                {/* Compressor Body */}
                <polygon points="250,180 370,210 370,290 250,320" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="3" />
                <text x="310" y="255" fill="#f8fafc" fontSize="14" fontWeight="bold" textAnchor="middle">
                  K-04
                </text>

                {/* Electric Motor */}
                <rect x="100" y="320" width="80" height="60" rx="8" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                <text x="140" y="355" fill="#94a3b8" fontSize="11" textAnchor="middle">
                  MTR 5.2MW
                </text>
                <line x1="140" y1="320" x2="270" y2="300" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />

                {/* Vibration Accelerometer Probe 1 */}
                <circle cx="270" cy="190" r="10" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                <text x="270" y="170" fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle">
                  VE-401A (BPFO)
                </text>

                {/* Pressure Transmitter */}
                <circle cx="580" cy="210" r="14" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                <line x1="580" y1="250" x2="580" y2="224" stroke="#0284c7" strokeWidth="2" />
                <text x="580" y="215" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  PT-104
                </text>

                {/* Control Valve */}
                <polygon points="680,235 710,250 680,265" fill="#64748b" stroke="#94a3b8" strokeWidth="2" />
                <polygon points="740,235 710,250 740,265" fill="#64748b" stroke="#94a3b8" strokeWidth="2" />
                <circle cx="710" cy="220" r="10" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
                <text x="710" y="200" fill="#94a3b8" fontSize="10" textAnchor="middle">
                  FCV-201
                </text>

                {/* Gas Seal Buffer Vessel */}
                <rect x="420" y="80" width="70" height="90" rx="20" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
                <line x1="455" y1="170" x2="350" y2="220" stroke="#818cf8" strokeWidth="2" strokeDasharray="4 2" />
                <text x="455" y="130" fill="#c7d2fe" fontSize="11" textAnchor="middle">
                  DGS V-102
                </text>
              </svg>
            ) : selectedDiagram.svgType === 'pump_cross_section' ? (
              <svg className="w-full h-full p-8" viewBox="0 0 800 500" fill="none">
                {/* Pump Casing */}
                <circle cx="360" cy="250" r="140" fill="#082f49" stroke="#0284c7" strokeWidth="4" />
                <circle cx="360" cy="250" r="90" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                
                {/* Impeller Blades */}
                <path d="M 360 250 Q 380 180 430 170" stroke="#38bdf8" strokeWidth="3" fill="none" />
                <path d="M 360 250 Q 320 180 290 190" stroke="#38bdf8" strokeWidth="3" fill="none" />
                <path d="M 360 250 Q 420 300 420 340" stroke="#38bdf8" strokeWidth="3" fill="none" />
                <path d="M 360 250 Q 300 310 270 300" stroke="#38bdf8" strokeWidth="3" fill="none" />

                {/* Shaft */}
                <rect x="100" y="240" width="260" height="20" fill="#64748b" stroke="#cbd5e1" strokeWidth="2" />
                
                {/* Mechanical Seal Housing */}
                <rect x="220" y="210" width="60" height="80" fill="#4c1d95" stroke="#a855f7" strokeWidth="2" />
                <text x="250" y="195" fill="#d8b4fe" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Plan 53A Seal
                </text>

                {/* Discharge Nozzle */}
                <rect x="340" y="50" width="40" height="70" fill="#0369a1" stroke="#38bdf8" strokeWidth="2" />
                <text x="360" y="40" fill="#38bdf8" fontSize="12" textAnchor="middle">
                  Discharge
                </text>
              </svg>
            ) : (
              <svg className="w-full h-full p-8" viewBox="0 0 800 500" fill="none">
                {/* Substation 20kV Bus */}
                <line x1="100" y1="120" x2="700" y2="120" stroke="#ef4444" strokeWidth="5" />
                <text x="400" y="100" fill="#ef4444" fontSize="14" fontWeight="bold" textAnchor="middle">
                  20kV MV Switchgear Main Bus (IEC 62271)
                </text>

                {/* Feeder 1 */}
                <line x1="250" y1="120" x2="250" y2="220" stroke="#f87171" strokeWidth="3" />
                <rect x="230" y="220" width="40" height="40" fill="#1e293b" stroke="#ef4444" strokeWidth="2" />
                <text x="250" y="245" fill="#ffffff" fontSize="11" textAnchor="middle">CB1</text>
                <circle cx="250" cy="340" r="30" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="3" />
                <text x="250" y="345" fill="#ffffff" fontSize="11" textAnchor="middle">MTR-01</text>

                {/* Feeder 2 VFD */}
                <line x1="550" y1="120" x2="550" y2="220" stroke="#f87171" strokeWidth="3" />
                <rect x="525" y="220" width="50" height="50" fill="#312e81" stroke="#818cf8" strokeWidth="2" />
                <text x="550" y="250" fill="#c7d2fe" fontSize="10" textAnchor="middle">VFD</text>
                <circle cx="550" cy="350" r="30" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="3" />
                <text x="550" y="355" fill="#ffffff" fontSize="11" textAnchor="middle">MTR-02</text>
              </svg>
            )}

            {/* Placed Collaborative Annotation Pins */}
            {currentDiagramAnnotations.map((ann) => {
              const isSelected = ann.id === activePinId;
              const isResolved = ann.status === 'resolved';
              const isCritical = ann.severity === 'critical';

              return (
                <div
                  key={ann.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePinId(ann.id);
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125 z-20"
                  style={{ left: `${ann.xPercent}%`, top: `${ann.yPercent}%` }}
                >
                  <div
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all ${
                      isResolved
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                        : isCritical
                        ? 'bg-rose-600 text-white ring-4 ring-rose-400/40 animate-bounce'
                        : 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                    } ${isSelected ? 'scale-125 ring-4 ring-sky-400' : ''}`}
                  >
                    <Pin size={16} />
                  </div>

                  {/* Pin Preview Tooltip */}
                  <div className="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-md bg-slate-950/90 text-white text-[10px] border border-slate-700 pointer-events-none shadow-md">
                    {ann.title.slice(0, 24)}...
                  </div>
                </div>
              );
            })}

            {/* Pending Click Position Marker */}
            {pendingPinCoords && (
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center animate-ping z-30 pointer-events-none"
                style={{ left: `${pendingPinCoords.x}%`, top: `${pendingPinCoords.y}%` }}
              >
                <Pin size={18} />
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Collaborative Notes Drawer & Review List */}
        <div className="space-y-4">
          {/* Active / Selected Annotation Detail Card */}
          {activeAnnotation ? (
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-700 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      activeAnnotation.severity === 'critical'
                        ? 'bg-rose-500 animate-ping'
                        : activeAnnotation.severity === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-sky-500'
                    }`}
                  />
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                    {activeAnnotation.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setTtsNoteText(
                        `${activeAnnotation.title}. گزارش شده توسط ${activeAnnotation.authorName}. شرح: ${activeAnnotation.comment}`
                      )
                    }
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 transition-colors"
                    title="قرائت صوتی یادداشت برای تکنسین"
                  >
                    <Headphones size={15} />
                  </button>

                  <button
                    onClick={() => handleDeleteAnnotation(activeAnnotation.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition-colors"
                    title="حذف یادداشت"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-black text-white leading-snug">{activeAnnotation.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  {activeAnnotation.comment}
                </p>
              </div>

              {/* Author Info & Timestamp */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {activeAnnotation.authorAvatar ? (
                    <img
                      src={activeAnnotation.authorAvatar}
                      alt={activeAnnotation.authorName}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-sky-500/40"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                      <User size={14} />
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-white text-[11px]">{activeAnnotation.authorName}</div>
                    <div className="text-[10px] text-slate-400">{activeAnnotation.authorRole}</div>
                  </div>
                </div>

                <div className="text-right text-[10px] font-mono text-slate-400">
                  <Clock size={12} className="inline ml-1 text-slate-500" />
                  <span>{activeAnnotation.timestamp}</span>
                </div>
              </div>

              {/* Resolution Action */}
              <div className="pt-1">
                <button
                  onClick={() => handleToggleResolve(activeAnnotation.id)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    activeAnnotation.status === 'resolved'
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                  }`}
                >
                  <CheckCircle size={15} />
                  <span>
                    {activeAnnotation.status === 'resolved'
                      ? `حل‌شده توسط ${activeAnnotation.resolvedBy || 'کارشناس'}`
                      : 'تأیید رفع نقص و ثبت بسته شدن'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-2 text-slate-400">
              <Eye size={28} className="mx-auto text-slate-600" />
              <p className="text-xs">روی هر یک از پین‌های نقشه کلیک کنید تا یادداشت مربوطه نمایش یابد.</p>
            </div>
          )}

          {/* New Annotation Form Popover (when user clicks on canvas) */}
          {pendingPinCoords && (
            <div className="p-5 rounded-3xl bg-slate-900 border-2 border-amber-500/50 shadow-2xl space-y-3.5 animate-in fade-in-50 duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Pin size={15} />
                  <span>ثبت یادداشت در مختصات ({pendingPinCoords.x}٪, {pendingPinCoords.y}٪)</span>
                </h4>
                <button
                  onClick={() => setPendingPinCoords(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveNewAnnotation} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">عنوان یادداشت:</label>
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="مثال: نشتی فشار تفاضلی در فلنج خط برگشت..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">دسته‌بندی و اهمیت:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={noteCategory}
                      onChange={(e: any) => setNoteCategory(e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    >
                      <option value="vibration_defect">عیب ارتعاشاتی</option>
                      <option value="maintenance_note">نکته تعمیراتی</option>
                      <option value="safety_hazard">ایمنی فرآیند</option>
                      <option value="calibration_audit">ممیزی کالیبراسیون</option>
                      <option value="design_change">تغییر نقشه</option>
                    </select>

                    <select
                      value={noteSeverity}
                      onChange={(e: any) => setNoteSeverity(e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    >
                      <option value="critical">بحرانی (Critical)</option>
                      <option value="warning">هشدار (Warning)</option>
                      <option value="info">اطلاعاتی (Info)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">شرح کامل نقص و دستور اقدام:</label>
                  <textarea
                    value={noteComment}
                    onChange={(e) => setNoteComment(e.target.value)}
                    placeholder="توضیحات تکمیلی مهندسی جهت اقدام تیم تعمیرات..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setPendingPinCoords(null)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-md"
                  >
                    پین کردن یادداشت
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List of All Annotations for this Diagram */}
          <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <MessageSquarePlus size={15} className="text-sky-400" />
                <span>یادداشت‌های فنی نقشه ({currentDiagramAnnotations.length})</span>
              </h4>

              {/* Status Filter */}
              <div className="flex items-center gap-1 text-[10px]">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-2 py-0.5 rounded-md font-bold ${
                    filterStatus === 'all' ? 'bg-sky-600 text-white' : 'text-slate-400'
                  }`}
                >
                  همه
                </button>
                <button
                  onClick={() => setFilterStatus('open')}
                  className={`px-2 py-0.5 rounded-md font-bold ${
                    filterStatus === 'open' ? 'bg-amber-600 text-white' : 'text-slate-400'
                  }`}
                >
                  باز
                </button>
                <button
                  onClick={() => setFilterStatus('resolved')}
                  className={`px-2 py-0.5 rounded-md font-bold ${
                    filterStatus === 'resolved' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                  }`}
                >
                  حل‌شده
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {currentDiagramAnnotations.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-500">
                  یادداشتی برای این فیلتر ثبت نشده است.
                </div>
              ) : (
                currentDiagramAnnotations.map((ann) => (
                  <button
                    key={ann.id}
                    onClick={() => setActivePinId(ann.id)}
                    className={`w-full text-right p-2.5 rounded-xl border text-xs transition-all flex items-start justify-between gap-2 ${
                      ann.id === activePinId
                        ? 'bg-sky-950/60 border-sky-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold truncate max-w-[180px]">{ann.title}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{ann.authorName} • {ann.timestamp}</div>
                    </div>

                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        ann.status === 'resolved'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {ann.status === 'resolved' ? 'حل‌شده' : 'در دست اقدام'}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef, useMemo } from 'react';
import {
  FileText,
  Upload,
  Layers,
  Wrench,
  BookOpen,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Pin,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Tag,
  Crosshair,
  Volume2,
  Plus,
  ShieldCheck,
  Cpu,
  Info,
  ExternalLink,
  ChevronRight,
  Filter,
  Check,
  Copy,
  Hash,
  Download,
  Eye,
  Sliders,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  PRESET_SCHEMATICS,
  IndustrialSchematicItem,
  MachinePartHotspot,
  PartMaintenanceLog,
  PartDocumentLink
} from '../../data/schematicOverlayData';
import { ttsService } from '../../services/ttsService';
import { IndustrialAudioPlayer } from '../common/IndustrialAudioPlayer';

export const SchematicInteractiveOverlay: React.FC = () => {
  const { currentUser, t } = useApp();
  
  // Active Schematic State
  const [schematicsList, setSchematicsList] = useState<IndustrialSchematicItem[]>(PRESET_SCHEMATICS);
  const [activeSchematicId, setActiveSchematicId] = useState<string>(PRESET_SCHEMATICS[0].id);
  const activeSchematic = schematicsList.find((s) => s.id === activeSchematicId) || schematicsList[0];

  // Selected Machine Part Hotspot
  const [selectedPartId, setSelectedPartId] = useState<string | null>('part-k04-bearing-de');
  const [hoveredPartId, setHoveredPartId] = useState<string | null>(null);
  
  // Active Tab in Details Panel: 'logs' | 'docs' | 'specs' | 'ai'
  const [activeDetailTab, setActiveDetailTab] = useState<'logs' | 'docs' | 'specs' | 'ai'>('logs');

  // Canvas View Controls
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [canvasTheme, setCanvasTheme] = useState<'blueprint' | 'dark' | 'paper'>('blueprint');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Add Part Mode State
  const [isAddingPart, setIsAddingPart] = useState<boolean>(false);
  const [pendingPartCoords, setPendingPartCoords] = useState<{ x: number; y: number } | null>(null);
  const [newPartName, setNewPartName] = useState<string>('');
  const [newPartCode, setNewPartCode] = useState<string>('');
  const [newPartCategory, setNewPartCategory] = useState<MachinePartHotspot['category']>('bearing');
  const [newPartCriticality, setNewPartCriticality] = useState<MachinePartHotspot['criticality']>('high');

  // Add Maintenance Log Modal State
  const [showAddLogModal, setShowAddLogModal] = useState<boolean>(false);
  const [newLogTitle, setNewLogTitle] = useState<string>('');
  const [newLogFindings, setNewLogFindings] = useState<string>('');
  const [newLogType, setNewLogType] = useState<PartMaintenanceLog['type']>('corrective');
  const [newLogSeverity, setNewLogSeverity] = useState<PartMaintenanceLog['severity']>('warning');

  // Audio Playback State
  const [ttsAudioText, setTtsAudioText] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // AI Diagnostic Loading State
  const [aiAnalyzing, setAiAnalyzing] = useState<boolean>(false);
  const [aiDiagnosisText, setAiDiagnosisText] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Currently focused part
  const selectedPart = useMemo(() => {
    return activeSchematic.parts.find((p) => p.id === selectedPartId) || null;
  }, [activeSchematic, selectedPartId]);

  // Handle Schematic File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      const newCustomSchematic: IndustrialSchematicItem = {
        id: `custom-schematic-${Date.now()}`,
        assetId: 'custom-asset',
        titleFa: `نقشه بارگذاری‌شده: ${file.name.replace(/\.[^/.]+$/, '')}`,
        titleEn: `Uploaded Schematic: ${file.name}`,
        code: `UPLOAD-${Date.now().toString().slice(-6)}`,
        categoryFa: 'نقشه فنی و دیاگرام بارگذاری‌شده کاربر',
        standard: 'Custom Engineering Drawing',
        descriptionFa: 'نقشه بارگذاری‌شده اختصاصی همراه با لایه تعاملی پیوند قطعات، سوابق نگهداری و مستندات فنی',
        svgType: 'compressor_pid',
        isCustomUpload: true,
        uploadedImageUrl: imageUrl,
        parts: [
          {
            id: `part-custom-${Date.now()}-1`,
            schematicId: `custom-schematic-${Date.now()}`,
            nameFa: 'مجموعه دوار اصلی و یاتاقان شفت',
            nameEn: 'Main Rotating Shaft & Bearing Pedestal',
            code: 'CMP-CUSTOM-01',
            tag: 'MAIN-ROTOR',
            category: 'bearing',
            xPercent: 40.0,
            yPercent: 45.0,
            widthPercent: 12.0,
            heightPercent: 12.0,
            shape: 'circle',
            healthScore: 72,
            criticality: 'high',
            rulHours: 1450,
            status: 'warning',
            currentReadings: {
              vibration: '3.4 mm/s RMS',
              temperature: '71.5 °C',
              faultFrequency: '1X Rotor: 2950 RPM',
            },
            specs: {
              manufacturer: 'سازنده تجهیز بارگذاری‌شده',
              modelNumber: 'Custom Assembly Rev-A',
              standard: 'API / ISO Applicable',
              clearanceTolerance: 'لقی استاندارد ۰.۰۷ میلی‌متر',
              lubricantType: 'روغن صنعتی ISO VG 46/68',
              replacementCycleHours: 20000,
              operatingHoursSoFar: 12400,
              warehouseStockCount: 1,
            },
            relatedMaintenanceLogs: [
              {
                id: `log-cust-1`,
                workOrderId: 'WO-CUSTOM-101',
                titleFa: 'بازرسی اولیه انحراف شفت و روغن‌کاری دوره‌ای',
                titleEn: 'Initial Shaft Runout Inspection & Lubrication',
                date: '۱۴۰۵/۰۵/۲۲ - ۱۰:۰۰',
                technician: currentUser.nameFa || 'کارشناس مکانیک',
                technicianRole: 'تکنسین بازرسی فنی',
                type: 'preventive',
                status: 'completed',
                severity: 'info',
                findingsFa: 'انحراف محوری در محدوده تلرانس مجاز است؛ روان‌کاری مجدد مطابق دستورالعمل سازنده اجرا شد.',
                actionsTakenFa: 'تعویض فیلتر روغن و نمونه‌برداری جهت آنالیز طیف‌سنجی ذرات فرسایش.',
                economicSavingsMillionTomans: 350,
                preventedDowntimeHours: 6,
                truthBlockHash: '0x88f2c19e34b071a9c3e2d4f8a1b5c9e2d3f4a5b6',
              },
            ],
            relatedDocumentation: [
              {
                id: `doc-cust-1`,
                docType: 'manual',
                docCode: 'MANUAL-OEM-VISTA-01',
                titleFa: 'دفترچه راهنمای نصب و راه‌اندازی قطعات دوار',
                titleEn: 'OEM Operation & Maintenance Field Manual',
                category: 'مستندات بهره‌برداری',
                summaryFa: 'شرح جزئیات گشتاوردهی پیچ‌های یاتاقان، تلرانس‌های مجاز هم‌محوری و فواصل روان‌کاری.',
                truthSigned: true,
                lastRevisionDate: '۱۴۰۵/۰۱/۲۰',
                keyParameters: [
                  { label: 'گشتاور پیچ‌های پایه', value: '450 N.m' },
                  { label: 'حد هشدار دما', value: '85 °C' },
                ],
              },
            ],
          },
        ],
      };

      setSchematicsList((prev) => [newCustomSchematic, ...prev]);
      setActiveSchematicId(newCustomSchematic.id);
      setSelectedPartId(newCustomSchematic.parts[0].id);
    };
    reader.readAsDataURL(file);
  };

  // Canvas Click Handler (For adding parts)
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingPart) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPendingPartCoords({
      x: Number(x.toFixed(1)),
      y: Number(y.toFixed(1)),
    });
  };

  // Save Newly Added Machine Part
  const handleSaveNewPart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingPartCoords || !newPartName.trim()) return;

    const newPart: MachinePartHotspot = {
      id: `part-${Date.now()}`,
      schematicId: activeSchematic.id,
      nameFa: newPartName.trim(),
      nameEn: newPartCode.trim() || 'Custom Machine Component',
      code: newPartCode.trim() || `CMP-${Date.now().toString().slice(-4)}`,
      tag: newPartCode.trim().toUpperCase() || 'CUSTOM-TAG',
      category: newPartCategory,
      xPercent: pendingPartCoords.x,
      yPercent: pendingPartCoords.y,
      widthPercent: 9.0,
      heightPercent: 9.0,
      shape: 'circle',
      healthScore: 85,
      criticality: newPartCriticality,
      rulHours: 4800,
      status: 'normal',
      currentReadings: {
        vibration: '1.5 mm/s RMS',
        temperature: '54.0 °C',
      },
      specs: {
        manufacturer: 'سازنده تجهیز / تأمین‌کننده مجاز',
        modelNumber: newPartCode.trim() || 'Custom Spec 2026',
        standard: 'ISO / API Standard Compliant',
        clearanceTolerance: 'تلرانس استاندارد مهندسی',
        lubricantType: 'روغن صنعتی استاندارد',
        replacementCycleHours: 24000,
        operatingHoursSoFar: 3600,
        warehouseStockCount: 2,
      },
      relatedMaintenanceLogs: [
        {
          id: `log-init-${Date.now()}`,
          workOrderId: `WO-${Date.now().toString().slice(-5)}`,
          titleFa: `نشانه‌گذاری و بازرسی اولیه ${newPartName}`,
          titleEn: `Initial Commissioning & Tagging of ${newPartName}`,
          date: '۱۴۰۵/۰۶/۰۸ - اکنون',
          technician: currentUser.nameFa || 'کارشناس ارشد سیستم',
          technicianRole: currentUser.roleTitleFa || 'سرپرست نگهداری و تعمیرات',
          type: 'inspection',
          status: 'completed',
          severity: 'info',
          findingsFa: 'موقعیت قطعه بر روی نقشه مشخص گردید و پارامترهای پایه‌ای ثبت شد.',
          actionsTakenFa: 'تایید نقطه پایش و اتصال به زنجیره حقیقت سیستم ویستا.',
          economicSavingsMillionTomans: 150,
          preventedDowntimeHours: 4,
          truthBlockHash: '0x33b2a1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4',
        },
      ],
      relatedDocumentation: [
        {
          id: `doc-init-${Date.now()}`,
          docType: 'sop',
          docCode: `SOP-PT-${Date.now().toString().slice(-4)}`,
          titleFa: `دستورالعمل استاندارد بازرسی ${newPartName}`,
          titleEn: `Standard Operating Procedure for ${newPartName}`,
          category: 'روش اجرایی استاندارد (SOP)',
          summaryFa: 'الزامات پایش دوره‌ای و چک‌لیست‌های هفتگی بازرسی چشمی و لرزش‌سنجی.',
          truthSigned: true,
          lastRevisionDate: '۱۴۰۵/۰۶/۰۸',
          keyParameters: [
            { label: 'دوره بازرسی', value: 'هفتگی / ماهانه' },
            { label: 'حد هشدار ارتعاش', value: '4.5 mm/s' },
          ],
        },
      ],
    };

    setSchematicsList((prev) =>
      prev.map((s) => {
        if (s.id === activeSchematic.id) {
          return {
            ...s,
            parts: [...s.parts, newPart],
          };
        }
        return s;
      })
    );

    setSelectedPartId(newPart.id);
    setIsAddingPart(false);
    setPendingPartCoords(null);
    setNewPartName('');
    setNewPartCode('');
  };

  // Add Maintenance Log to Selected Part
  const handleSaveNewLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPart || !newLogTitle.trim()) return;

    const newLog: PartMaintenanceLog = {
      id: `log-${Date.now()}`,
      workOrderId: `WO-${Date.now().toString().slice(-5)}`,
      titleFa: newLogTitle.trim(),
      titleEn: `Maintenance Work Order for ${selectedPart.code}`,
      date: new Date().toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      technician: currentUser.nameFa || 'کارشناس نگهداری و تعمیرات',
      technicianRole: currentUser.roleTitleFa || 'تکنسین فنی',
      type: newLogType,
      status: 'completed',
      severity: newLogSeverity,
      findingsFa: newLogFindings.trim() || 'اقدامات پیشگیرانه و بازرسی دوره‌ای با موفقیت انجام شد.',
      actionsTakenFa: 'سرویس قطعه انجام شد و داده‌های تاییدیه در زنجیره حقیقت متصل گردید.',
      economicSavingsMillionTomans: 280,
      preventedDowntimeHours: 6,
      truthBlockHash: '0x' + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2),
    };

    setSchematicsList((prev) =>
      prev.map((s) => {
        if (s.id === activeSchematic.id) {
          return {
            ...s,
            parts: s.parts.map((p) => {
              if (p.id === selectedPart.id) {
                return {
                  ...p,
                  relatedMaintenanceLogs: [newLog, ...p.relatedMaintenanceLogs],
                };
              }
              return p;
            }),
          };
        }
        return s;
      })
    );

    setShowAddLogModal(false);
    setNewLogTitle('');
    setNewLogFindings('');
  };

  // AI Diagnostic Advisor Handler
  const handleTriggerAiAnalysis = () => {
    if (!selectedPart) return;
    setAiAnalyzing(true);
    setAiDiagnosisText(null);
    setActiveDetailTab('ai');

    setTimeout(() => {
      let diagnosis = '';
      if (selectedPart.category === 'bearing') {
        diagnosis = `تحلیل هوش مصنوعی برای ${selectedPart.nameFa}:\nبررسی طیف فرکانسی و تحلیل موجک نشان‌دهنده شروع پیتینگ موضعی در رینگ خارجی (BPFO: 127 Hz) است. مدل پیش‌بینی زوال عمر باقیمانده، زمان کارکرد مطمئن را معادل ${selectedPart.rulHours} ساعت تخمین می‌زند. پیشنهاد می‌شود ضمن تجدید لایه‌مرزی روانکار سنتتیک، سنسور شتاب‌سنج پیزوالکتریک به نرخ نمونه‌برداری ۵۰ کیلوهرتز ارتقا یابد و کیت یدکی SKF در انبار پایش گردد.`;
      } else if (selectedPart.category === 'seal') {
        diagnosis = `تحلیل هوش مصنوعی برای ${selectedPart.nameFa}:\nسیستم آب‌بندی در شرایط پایدار با اختلاف فشار ۲.۸ بار گاز نیتروژن کار می‌کند. نرخ نشتی گاز اولیه کمتر از ۳۰٪ حد آستانه استاندارد API 682 است. بازرسی دوره‌ای فیلترهای کوالسنت نیتروژن در شیفت بعدی برای اطمینان از خلوص گاز بافر پیشنهاد می‌گردد.`;
      } else {
        diagnosis = `تحلیل هوش مصنوعی برای ${selectedPart.nameFa}:\nپارامترهای عملکردی، تراز حرارتی و ارتعاشات این قطعه مطابق با استانداردهای کارکرد کلاس صلب در محدوده رضایت‌بخش (Zone A/B) قرار دارد. سوابق تعمیراتی حاکی از نگهداری پیشگیرانه بهنگام است.`;
      }
      setAiDiagnosisText(diagnosis);
      setAiAnalyzing(false);
    }, 900);
  };

  // Read Out Loud via TTS
  const handleReadOutLoud = (text: string) => {
    setTtsAudioText(text);
    ttsService.speak(text, {
      lang: 'fa-IR',
      rate: 0.95,
      onComplete: () => setTtsAudioText(null),
    });
  };

  // Copy Hash Helper
  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 1800);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-950/40">
            <Crosshair size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                اورلی تعاملی نقشه‌های مهندسی و پیوند قطعات به سوابق فنی
              </h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                Interactive Schematic Overlay
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              کلیک روی اجزای مکانیکی نقشه جهت هایلایت و بازیابی لحظه‌ای سوابق نگهداری، دفترچه‌های راهنما (SOP) و استانداردهای بین‌المللی
            </p>
          </div>
        </div>

        {/* Action Buttons: Upload & Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,.svg,.pdf"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-900/40 transition-all"
            title="بارگذاری نقشه یا تصویر دیاگرام اختصاصی (PNG, JPG, SVG)"
          >
            <Upload size={15} />
            <span>بارگذاری نقشه جدید (Upload Schematic)</span>
          </button>

          {/* Schematic Selector */}
          <select
            value={activeSchematicId}
            onChange={(e) => {
              setActiveSchematicId(e.target.value);
              const target = schematicsList.find((s) => s.id === e.target.value);
              if (target && target.parts.length > 0) {
                setSelectedPartId(target.parts[0].id);
              } else {
                setSelectedPartId(null);
              }
              setPendingPartCoords(null);
              setIsAddingPart(false);
            }}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-xs font-bold text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {schematicsList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.isCustomUpload ? '📂 ' : '📐 '} {s.titleFa} ({s.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TTS Audio Player Bar if active */}
      {ttsAudioText && (
        <IndustrialAudioPlayer
          title="قرائت صوتی مشخصات قطعه و دستورالعمل اجرایی"
          subtitle="انتقال صوتی اطلاعات نقشه و نگهداری برای تکنسین‌های میدانی"
          textToSpeak={ttsAudioText}
        />
      )}

      {/* Main Grid: Left 7 Cols Schematic Stage + Right 5 Cols Synchronized Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Schematic Viewer */}
        <div className="lg:col-span-7 space-y-3">
          {/* Canvas Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-1 rounded border border-cyan-800/60">
                {activeSchematic.code}
              </span>
              <span className="text-slate-400 hidden sm:inline truncate max-w-[240px]">
                {activeSchematic.standard}
              </span>
            </div>

            {/* Viewport Actions */}
            <div className="flex items-center gap-1.5">
              {/* Add Part Toggle */}
              <button
                onClick={() => {
                  setIsAddingPart(!isAddingPart);
                  setPendingPartCoords(null);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all ${
                  isAddingPart
                    ? 'bg-amber-500 text-slate-950 animate-pulse font-black'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
                }`}
                title="علامت‌گذاری و اضافه کردن قطعه جدید روی نقشه"
              >
                <Plus size={14} />
                <span>{isAddingPart ? 'روی نقشه کلیک کنید' : 'افزودن قطعه (Add Part)'}</span>
              </button>

              {/* Grid Toggle */}
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`p-2 rounded-xl transition-colors ${
                  showGrid ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
                title="تغییر نمایش شبکه شطرنجی CAD"
              >
                <Layers size={15} />
              </button>

              {/* Zoom Controls */}
              <button
                onClick={() => setZoomLevel((z) => Math.min(2, Number((z + 0.15).toFixed(2))))}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 transition-colors"
                title="بزرگ‌نمایی (Zoom In)"
              >
                <ZoomIn size={15} />
              </button>

              <button
                onClick={() => setZoomLevel((z) => Math.max(0.7, Number((z - 0.15).toFixed(2))))}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 transition-colors"
                title="کوچک‌نمایی (Zoom Out)"
              >
                <ZoomOut size={15} />
              </button>

              <button
                onClick={() => setZoomLevel(1)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 transition-colors"
                title="تنظیم مجدد بزرگ‌نمایی (Reset Zoom)"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>

          {/* Interactive Blueprint Vector / Image Stage */}
          <div
            ref={canvasRef}
            onClick={handleCanvasClick}
            className={`relative w-full aspect-[16/10] rounded-3xl overflow-hidden select-none border-2 transition-all ${
              isAddingPart ? 'cursor-crosshair border-amber-500 shadow-xl shadow-amber-950/40' : 'border-slate-800 shadow-2xl'
            } ${
              canvasTheme === 'blueprint'
                ? 'bg-[#060c18]'
                : canvasTheme === 'dark'
                ? 'bg-slate-950'
                : 'bg-slate-900'
            }`}
          >
            {/* Grid Blueprint Background Pattern */}
            {showGrid && (
              <div
                className="absolute inset-0 opacity-25 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(#06b6d4 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
                  backgroundSize: '40px 40px, 20px 20px, 20px 20px',
                }}
              />
            )}

            {/* Inner Scaled Canvas Wrapper */}
            <div
              className="w-full h-full relative transition-transform duration-200 origin-center"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {/* Either User Uploaded Image or Vector Industrial Blueprint */}
              {activeSchematic.isCustomUpload && activeSchematic.uploadedImageUrl ? (
                <img
                  src={activeSchematic.uploadedImageUrl}
                  alt={activeSchematic.titleEn}
                  className="w-full h-full object-contain p-4"
                  referrerPolicy="no-referrer"
                />
              ) : activeSchematic.svgType === 'compressor_pid' ? (
                /* High Definition Compressor K-04 P&ID Vector */
                <svg className="w-full h-full p-6" viewBox="0 0 800 500" fill="none">
                  {/* Process Pipelines */}
                  <path d="M 40 250 L 250 250" stroke="#06b6d4" strokeWidth="4" strokeDasharray="6 2" />
                  <path d="M 370 250 L 760 250" stroke="#0284c7" strokeWidth="4" />
                  
                  {/* Compressor Main Casing */}
                  <polygon points="250,170 380,200 380,300 250,330" fill="#082f49" stroke="#06b6d4" strokeWidth="3" />
                  <text x="315" y="255" fill="#f8fafc" fontSize="16" fontWeight="900" textAnchor="middle">
                    K-04
                  </text>
                  <text x="315" y="275" fill="#38bdf8" fontSize="10" textAnchor="middle">
                    GAS COMPRESSOR
                  </text>

                  {/* Main Drive Electric Motor 5.2MW */}
                  <rect x="80" y="320" width="100" height="70" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="2.5" />
                  <text x="130" y="355" fill="#f1f5f9" fontSize="12" fontWeight="bold" textAnchor="middle">
                    MTR 5.2MW
                  </text>
                  <text x="130" y="372" fill="#94a3b8" fontSize="9" textAnchor="middle">
                    6.6 kV / 2985 RPM
                  </text>
                  
                  {/* Shaft Transmission & Coupling */}
                  <line x1="180" y1="355" x2="250" y2="280" stroke="#94a3b8" strokeWidth="3" strokeDasharray="4 3" />
                  <circle cx="210" cy="315" r="14" fill="#334155" stroke="#cbd5e1" strokeWidth="2" />
                  <text x="210" y="319" fill="#f8fafc" fontSize="9" fontWeight="bold" textAnchor="middle">CPL</text>

                  {/* Drive End Bearing Housing Marker */}
                  <circle cx="270" cy="190" r="16" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="2" />
                  <circle cx="270" cy="190" r="8" fill="#f59e0b" className="animate-pulse" />
                  <text x="270" y="165" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">
                    BRG-DE (127Hz)
                  </text>

                  {/* Tandem Dry Gas Seal Housing */}
                  <rect x="430" y="170" width="40" height="40" rx="6" fill="#312e81" stroke="#818cf8" strokeWidth="2" />
                  <text x="450" y="195" fill="#c7d2fe" fontSize="10" fontWeight="bold" textAnchor="middle">DGS</text>
                  <text x="450" y="155" fill="#a5b4fc" fontSize="9" textAnchor="middle">Plan 72/76</text>

                  {/* Pressure Transmitter PT-104 */}
                  <circle cx="580" cy="210" r="16" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                  <line x1="580" y1="250" x2="580" y2="226" stroke="#0284c7" strokeWidth="2" />
                  <text x="580" y="214" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                    PT-104
                  </text>

                  {/* Anti-Surge Control Valve FCV-201 */}
                  <polygon points="680,235 710,250 680,265" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
                  <polygon points="740,235 710,250 740,265" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
                  <circle cx="710" cy="220" r="10" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
                  <text x="710" y="198" fill="#94a3b8" fontSize="10" textAnchor="middle">
                    FCV-201
                  </text>

                  {/* Lube Oil Buffer Vessel */}
                  <rect x="450" y="70" width="70" height="70" rx="14" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
                  <line x1="485" y1="140" x2="380" y2="200" stroke="#818cf8" strokeWidth="2" strokeDasharray="4 2" />
                  <text x="485" y="105" fill="#c7d2fe" fontSize="10" fontWeight="bold" textAnchor="middle">
                    DGS V-102
                  </text>
                  <text x="485" y="120" fill="#818cf8" fontSize="8" textAnchor="middle">
                    Buffer N2
                  </text>
                </svg>
              ) : (
                /* Pump P-02 Cross Section */
                <svg className="w-full h-full p-6" viewBox="0 0 800 500" fill="none">
                  {/* Pump Volute Casing */}
                  <circle cx="380" cy="250" r="140" fill="#082f49" stroke="#0284c7" strokeWidth="4" />
                  <circle cx="380" cy="250" r="90" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                  
                  {/* SS316 Impeller Blades */}
                  <path d="M 380 250 Q 400 180 450 170" stroke="#38bdf8" strokeWidth="3.5" fill="none" />
                  <path d="M 380 250 Q 340 180 310 190" stroke="#38bdf8" strokeWidth="3.5" fill="none" />
                  <path d="M 380 250 Q 440 300 440 340" stroke="#38bdf8" strokeWidth="3.5" fill="none" />
                  <path d="M 380 250 Q 320 310 290 300" stroke="#38bdf8" strokeWidth="3.5" fill="none" />

                  {/* Main Shaft */}
                  <rect x="100" y="240" width="280" height="20" fill="#64748b" stroke="#cbd5e1" strokeWidth="2" />
                  
                  {/* Plan 53A Seal Housing */}
                  <rect x="220" y="205" width="70" height="90" rx="4" fill="#4c1d95" stroke="#a855f7" strokeWidth="2" />
                  <text x="255" y="190" fill="#d8b4fe" fontSize="11" fontWeight="bold" textAnchor="middle">
                    Plan 53A Seal
                  </text>

                  {/* Discharge Flange */}
                  <rect x="360" y="50" width="40" height="70" fill="#0369a1" stroke="#38bdf8" strokeWidth="2" />
                  <text x="380" y="40" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
                    Discharge
                  </text>
                </svg>
              )}

              {/* MACHINE PART OVERLAYS (HOTSPOTS) */}
              {activeSchematic.parts.map((part) => {
                const isSelected = part.id === selectedPartId;
                const isHovered = part.id === hoveredPartId;
                const isCritical = part.status === 'critical' || part.criticality === 'critical';
                const isWarning = part.status === 'warning';

                return (
                  <div
                    key={part.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPartId(part.id);
                    }}
                    onMouseEnter={() => setHoveredPartId(part.id)}
                    onMouseLeave={() => setHoveredPartId(null)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                    style={{
                      left: `${part.xPercent}%`,
                      top: `${part.yPercent}%`,
                    }}
                  >
                    {/* Pulsing Target Halo when selected */}
                    {isSelected && (
                      <div className="absolute inset-0 -m-3 rounded-full border-2 border-cyan-400 animate-ping opacity-60 pointer-events-none" />
                    )}

                    {/* Machine Part Hotspot Core */}
                    <div
                      className={`relative flex items-center justify-center transition-all duration-200 ${
                        part.shape === 'rect' ? 'rounded-xl px-2.5 py-1.5' : 'rounded-full w-9 h-9'
                      } ${
                        isSelected
                          ? 'ring-4 ring-cyan-400 bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/50 scale-125'
                          : isHovered
                          ? 'ring-2 ring-white scale-110'
                          : isCritical
                          ? 'ring-2 ring-rose-400 bg-rose-600/90 text-white animate-bounce'
                          : isWarning
                          ? 'ring-2 ring-amber-400 bg-amber-500/90 text-slate-950 font-bold'
                          : 'ring-1 ring-cyan-500/60 bg-slate-900/90 text-cyan-300'
                      }`}
                    >
                      <Crosshair size={16} />
                    </div>

                    {/* Floating Info Tag Pill */}
                    <div
                      className={`absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all pointer-events-none shadow-xl flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-cyan-950 text-cyan-200 border-cyan-400 z-30 scale-105'
                          : 'bg-slate-950/90 text-slate-300 border-slate-750'
                      }`}
                    >
                      <span>{part.code}</span>
                      <span
                        className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                          isCritical
                            ? 'bg-rose-950 text-rose-300'
                            : isWarning
                            ? 'bg-amber-950 text-amber-300'
                            : 'bg-emerald-950 text-emerald-300'
                        }`}
                      >
                        {part.healthScore}%
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Pending Part Location Marker if adding */}
              {pendingPartCoords && (
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-40 animate-pulse pointer-events-none"
                  style={{ left: `${pendingPartCoords.x}%`, top: `${pendingPartCoords.y}%` }}
                >
                  <div className="w-10 h-10 rounded-full border-2 border-dashed border-amber-400 flex items-center justify-center bg-amber-500/20 text-amber-300">
                    <Pin size={20} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Machine Parts Strip (Allows clicking to select) */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">
                اجزای شناسایی‌شده در این نقشه ({activeSchematic.parts.length} قطعه):
              </span>
              <span className="text-[11px] text-cyan-400">
                جهت هایلایت سوابق فنی، روی هر قطعه کلیک کنید
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {activeSchematic.parts.map((part) => {
                const isSelected = part.id === selectedPartId;
                const isCritical = part.status === 'critical' || part.criticality === 'critical';

                return (
                  <button
                    key={part.id}
                    onClick={() => setSelectedPartId(part.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                      isSelected
                        ? 'bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-600/40 scale-105'
                        : isCritical
                        ? 'bg-rose-950/40 text-rose-300 border-rose-800/80 hover:border-rose-600'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    <Crosshair size={13} className={isSelected ? 'text-white' : 'text-cyan-400'} />
                    <span className="truncate max-w-[140px]">{part.nameFa}</span>
                    <span className="font-mono text-[10px] opacity-80">({part.code})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Synchronized Highlighting Panel */}
        <div className="lg:col-span-5 space-y-4">
          {selectedPart ? (
            <div className="p-5 rounded-3xl bg-slate-900/95 border border-slate-800 shadow-2xl space-y-4 animate-in fade-in">
              {/* Focused Part Header Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                        {selectedPart.code}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          selectedPart.criticality === 'critical'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : selectedPart.criticality === 'high'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        بحرانیت: {selectedPart.criticality === 'critical' ? 'حیاتی (Tier-1)' : 'بالا'}
                      </span>
                    </div>

                    <h2 className="text-base font-black text-white mt-1.5 leading-snug">
                      {selectedPart.nameFa}
                    </h2>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                      {selectedPart.nameEn}
                    </p>
                  </div>

                  {/* Health Gauge Box */}
                  <div className="text-center p-2.5 rounded-2xl bg-slate-900 border border-slate-750 min-w-[70px]">
                    <div
                      className={`text-xl font-black font-mono ${
                        selectedPart.healthScore < 60
                          ? 'text-rose-400'
                          : selectedPart.healthScore < 80
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {selectedPart.healthScore}%
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold">سلامت فنی</div>
                  </div>
                </div>

                {/* Key Live Telemetry Readings for this Part */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  {selectedPart.currentReadings.vibration && (
                    <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">ارتعاش و فرکانس:</span>
                      <span className="text-amber-400 font-mono font-bold">
                        {selectedPart.currentReadings.vibration}
                      </span>
                    </div>
                  )}

                  {selectedPart.currentReadings.faultFrequency && (
                    <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">فرکانس عیب رینگ (BPFO):</span>
                      <span className="text-rose-400 font-mono font-bold">
                        {selectedPart.currentReadings.faultFrequency}
                      </span>
                    </div>
                  )}

                  {selectedPart.currentReadings.temperature && (
                    <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">دمای یاتاقان / محفظه:</span>
                      <span className="text-sky-300 font-mono font-bold">
                        {selectedPart.currentReadings.temperature}
                      </span>
                    </div>
                  )}

                  <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">عمر باقیمانده (RUL):</span>
                    <span className="text-cyan-300 font-mono font-bold">
                      {selectedPart.rulHours.toLocaleString('fa-IR')} ساعت کاری
                    </span>
                  </div>
                </div>

                {/* Fast Action Buttons Bar */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    onClick={() =>
                      handleReadOutLoud(
                        `${selectedPart.nameFa} با کد قطعه ${selectedPart.code}. سلامت فنی ${selectedPart.healthScore} درصد و عمر مفید باقیمانده ${selectedPart.rulHours} ساعت. ${
                          selectedPart.relatedMaintenanceLogs[0]?.findingsFa || ''
                        }`
                      )
                    }
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Volume2 size={14} className="text-cyan-400" />
                    <span>شنیدن صوتی مشخصات قطعه</span>
                  </button>

                  <button
                    onClick={handleTriggerAiAnalysis}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600/30 to-sky-600/30 hover:from-purple-600/40 hover:to-sky-600/40 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <Sparkles size={14} className="text-amber-400 animate-pulse" />
                    <span>تحلیل هوشمند قطعه (AI Diagnosis)</span>
                  </button>

                  <button
                    onClick={() => setShowAddLogModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Plus size={14} />
                    <span>ثبت دستور کار جدید</span>
                  </button>
                </div>
              </div>

              {/* Details Tab Switcher */}
              <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
                <button
                  onClick={() => setActiveDetailTab('logs')}
                  className={`flex-1 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                    activeDetailTab === 'logs'
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Wrench size={14} />
                  <span>سوابق نگهداری ({selectedPart.relatedMaintenanceLogs.length})</span>
                </button>

                <button
                  onClick={() => setActiveDetailTab('docs')}
                  className={`flex-1 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                    activeDetailTab === 'docs'
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BookOpen size={14} />
                  <span>مستندات و SOP ({selectedPart.relatedDocumentation.length})</span>
                </button>

                <button
                  onClick={() => setActiveDetailTab('specs')}
                  className={`flex-1 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                    activeDetailTab === 'specs'
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Cpu size={14} />
                  <span>شناسنامه فنی</span>
                </button>

                <button
                  onClick={() => setActiveDetailTab('ai')}
                  className={`flex-1 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                    activeDetailTab === 'ai'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-slate-400 hover:text-purple-300'
                  }`}
                >
                  <Sparkles size={14} />
                  <span>تحلیل AI</span>
                </button>
              </div>

              {/* TAB CONTENT: MAINTENANCE LOGS */}
              {activeDetailTab === 'logs' && (
                <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                  {selectedPart.relatedMaintenanceLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-cyan-400">
                              {log.workOrderId}
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                log.status === 'completed'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                  : 'bg-amber-950 text-amber-300 border border-amber-800'
                              }`}
                            >
                              {log.status === 'completed' ? 'تکمیل‌شده' : 'در دست اقدام'}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {log.date}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white mt-1">{log.titleFa}</h4>
                        </div>

                        <div className="text-right text-[11px] text-slate-400 font-medium">
                          {log.technician}
                        </div>
                      </div>

                      {/* Diagnostic Findings */}
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                        <span className="font-bold text-amber-400 block mb-0.5">یافته‌های کارشناسی:</span>
                        {log.findingsFa}
                      </p>

                      {/* Actions Taken */}
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                        <span className="font-bold text-emerald-400 block mb-0.5">اقدامات انجام‌شده:</span>
                        {log.actionsTakenFa}
                      </p>

                      {/* Economic Savings & Truth Block Hash */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-bold">
                            صرفه‌جویی اقتصادی: {log.economicSavingsMillionTomans} میلیون تومان
                          </span>
                          <span className="text-slate-500">•</span>
                          <span className="text-sky-400">
                            جلوگیری از {log.preventedDowntimeHours} ساعت توقف
                          </span>
                        </div>

                        {log.truthBlockHash && (
                          <button
                            onClick={() => handleCopyHash(log.truthBlockHash!)}
                            className="text-[10px] font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1"
                            title="کپی هش بلوک حقیقت"
                          >
                            <Hash size={11} />
                            <span>{log.truthBlockHash.slice(0, 10)}...</span>
                            {copiedHash === log.truthBlockHash ? (
                              <Check size={11} className="text-emerald-400" />
                            ) : (
                              <Copy size={11} />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB CONTENT: DOCUMENTATION & SOPS */}
              {activeDetailTab === 'docs' && (
                <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                  {selectedPart.relatedDocumentation.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/60">
                              {doc.docCode}
                            </span>
                            <span className="text-[10px] text-slate-400">{doc.category}</span>
                          </div>
                          <h4 className="text-sm font-bold text-white mt-1.5">{doc.titleFa}</h4>
                          <div className="text-[11px] font-mono text-slate-400">{doc.titleEn}</div>
                        </div>

                        {doc.truthSigned && (
                          <div
                            className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800"
                            title="امضای دیجیتال در بلوک حقیقت"
                          >
                            <ShieldCheck size={12} />
                            <span>امضای حقیقت</span>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                        {doc.summaryFa}
                      </p>

                      {/* Key Technical Parameters from Document */}
                      {doc.keyParameters && doc.keyParameters.length > 0 && (
                        <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
                          {doc.keyParameters.map((param, i) => (
                            <div
                              key={i}
                              className="p-2 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between"
                            >
                              <span className="text-slate-400 text-[10px]">{param.label}:</span>
                              <span className="font-mono font-bold text-cyan-300">{param.value}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                        <span>آخرین ویرایش: {doc.lastRevisionDate}</span>
                        {doc.pageReference && <span>{doc.pageReference}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB CONTENT: SPECS & BILL OF MATERIALS (BOM) */}
              {activeDetailTab === 'specs' && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">سازنده و تأمین‌کننده:</span>
                      <span className="font-bold text-white">{selectedPart.specs.manufacturer}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">شماره مدل قطعه / پارت نامبر:</span>
                      <span className="font-mono font-bold text-cyan-300">
                        {selectedPart.specs.modelNumber}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">استاندارد ساخت:</span>
                      <span className="font-mono font-bold text-slate-200">
                        {selectedPart.specs.standard}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">تلرانس و لقی مجاز:</span>
                      <span className="font-bold text-amber-300">
                        {selectedPart.specs.clearanceTolerance}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">نوع روانکار مجاز:</span>
                      <span className="font-bold text-slate-200">
                        {selectedPart.specs.lubricantType}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">موجودی قطعه در انبار:</span>
                      <span className="font-bold text-emerald-400">
                        {selectedPart.specs.warehouseStockCount} عدد در انبار مرکزی
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">ساعت کارکرد تاکنون:</span>
                      <span className="font-mono font-bold text-slate-200">
                        {selectedPart.specs.operatingHoursSoFar.toLocaleString('fa-IR')} ساعت
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">دوره تعویض اساسی (MTBF):</span>
                      <span className="font-mono font-bold text-slate-200">
                        {selectedPart.specs.replacementCycleHours.toLocaleString('fa-IR')} ساعت
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: AI DIAGNOSTIC ADVISOR */}
              {activeDetailTab === 'ai' && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs leading-relaxed">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-purple-400" />
                      <span className="font-bold text-white">مشاور هوش مصنوعی قطعه (Vista AI Advisor)</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">Gemini 3.8 Flash Engine</span>
                  </div>

                  {aiAnalyzing ? (
                    <div className="p-6 text-center text-slate-400 space-y-2">
                      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                      <div>در حال تحلیل طیف فرکانسی، سوابق نگهداری و تطبیق استانداردها...</div>
                    </div>
                  ) : aiDiagnosisText ? (
                    <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 text-slate-200 whitespace-pre-line">
                      {aiDiagnosisText}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-slate-400 space-y-2">
                      <p>روی دکمه زیر کلیک کنید تا تحلیل هوش مصنوعی اختصاصی این قطعه صادر شود.</p>
                      <button
                        onClick={handleTriggerAiAnalysis}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                      >
                        صدور تحلیل تشخیصی
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-10 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <Crosshair size={36} className="mx-auto text-slate-600" />
              <h3 className="text-base font-bold text-white">هیچ قطعه‌ای انتخاب نشده است</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                روی یکی از نشانگرهای نقشه کلیک کنید تا سوابق نگهداری، دفترچه راهنما و مشخصات مهندسی آن هایلایت شود.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add New Machine Part to Schematic */}
      {isAddingPart && pendingPartCoords && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
                  <Plus size={18} />
                </div>
                <h3 className="text-sm font-bold text-white">افزودن قطعه مکانیکی جدید به نقشه</h3>
              </div>
              <button
                onClick={() => {
                  setPendingPartCoords(null);
                  setIsAddingPart(false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNewPart} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">نام قطعه (فارسی):</label>
                <input
                  type="text"
                  value={newPartName}
                  onChange={(e) => setNewPartName(e.target.value)}
                  placeholder="مثلاً: یاتاقان تراست شفت محرک"
                  required
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">کد ابزاردقیق / پارت نامبر (انگلیسی):</label>
                <input
                  type="text"
                  value={newPartCode}
                  onChange={(e) => setNewPartCode(e.target.value)}
                  placeholder="مثلاً: BRG-THRUST-02"
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">دسته‌بندی تجهیز:</label>
                  <select
                    value={newPartCategory}
                    onChange={(e) => setNewPartCategory(e.target.value as any)}
                    className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none"
                  >
                    <option value="bearing">یاتاقان و بیرینگ</option>
                    <option value="seal">آب‌بند و سیل</option>
                    <option value="impeller">پروانه و روتور</option>
                    <option value="motor">موتور و درایو</option>
                    <option value="valve">شیر کنترلی</option>
                    <option value="sensor">سنسور و ترانسمیتر</option>
                    <option value="auxiliary">سیستم‌های جانبی</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">سطح بحرانیت:</label>
                  <select
                    value={newPartCriticality}
                    onChange={(e) => setNewPartCriticality(e.target.value as any)}
                    className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none"
                  >
                    <option value="critical">حیاتی (Critical)</option>
                    <option value="high">بالا (High)</option>
                    <option value="medium">متوسط (Medium)</option>
                    <option value="low">عادی (Low)</option>
                  </select>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                مختصات نقشه: X = {pendingPartCoords.x}% | Y = {pendingPartCoords.y}%
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPendingPartCoords(null);
                    setIsAddingPart(false);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                >
                  تایید و ایجاد لایه تعاملی
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Maintenance Log */}
      {showAddLogModal && selectedPart && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                  <Wrench size={18} />
                </div>
                <h3 className="text-sm font-bold text-white">ثبت لاگ نگهداری برای {selectedPart.nameFa}</h3>
              </div>
              <button onClick={() => setShowAddLogModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNewLog} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">عنوان کار تعمیراتی / بازرسی:</label>
                <input
                  type="text"
                  value={newLogTitle}
                  onChange={(e) => setNewLogTitle(e.target.value)}
                  placeholder="مثلاً: روانکاری مجدد و آچارکشی فلنج‌ها"
                  required
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">نوع اقدام:</label>
                  <select
                    value={newLogType}
                    onChange={(e) => setNewLogType(e.target.value as any)}
                    className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none"
                  >
                    <option value="corrective">اصلاحی (Corrective)</option>
                    <option value="preventive">پیشگیرانه (Preventive)</option>
                    <option value="emergency">اضطراری (Emergency)</option>
                    <option value="inspection">ممیزی / بازرسی چشمی</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">شدت وضعیت:</label>
                  <select
                    value={newLogSeverity}
                    onChange={(e) => setNewLogSeverity(e.target.value as any)}
                    className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none"
                  >
                    <option value="info">عادی (اطلاعاتی)</option>
                    <option value="warning">هشدار (Warning)</option>
                    <option value="critical">بحرانی (Critical)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">مشاهدات کارشناسی و جزئیات اقدام:</label>
                <textarea
                  rows={3}
                  value={newLogFindings}
                  onChange={(e) => setNewLogFindings(e.target.value)}
                  placeholder="یافته‌های ارتعاشی، تعویض روغن یا رگلاژ قطعه..."
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLogModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  ثبت در سوابق و زنجیره حقیقت
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

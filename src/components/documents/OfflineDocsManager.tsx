import React, { useState, useEffect, useMemo } from 'react';
import {
  HardDrive,
  Wifi,
  WifiOff,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  RefreshCw,
  Volume2,
  VolumeX,
  ShieldCheck,
  Cpu,
  Box,
  Layers,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sliders,
  Check
} from 'lucide-react';
import {
  offlineCacheService,
  CriticalTechnicalDocument,
  PRE_SEEDED_CRITICAL_DOCUMENTS
} from '../../services/offlineCacheService';
import { ttsService } from '../../services/ttsService';

export const OfflineDocsManager: React.FC = () => {
  const [documents, setDocuments] = useState<CriticalTechnicalDocument[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedDocForReading, setSelectedDocForReading] = useState<CriticalTechnicalDocument | null>(null);
  const [isReadingAloud, setIsReadingAloud] = useState<boolean>(false);
  const [storageStats, setStorageStats] = useState({
    cachedCount: 0,
    totalCount: 0,
    totalSizeKb: 0,
    formattedSize: '0 KB'
  });

  // Reload state from offlineCacheService
  const refreshState = () => {
    const docs = offlineCacheService.getDocuments();
    setDocuments(docs);
    setIsOnline(offlineCacheService.isOnline());
    setIsSimulatedOffline(offlineCacheService.isSimulatedOffline());
    setStorageStats(offlineCacheService.getStorageMetrics());
  };

  useEffect(() => {
    refreshState();

    const handleNetworkChange = () => {
      refreshState();
    };

    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);
    window.addEventListener('vista-network-state-change', handleNetworkChange);

    return () => {
      window.removeEventListener('online', handleNetworkChange);
      window.removeEventListener('offline', handleNetworkChange);
      window.removeEventListener('vista-network-state-change', handleNetworkChange);
    };
  }, []);

  const handleToggleSimulatedOffline = () => {
    const nextState = !isSimulatedOffline;
    offlineCacheService.setSimulatedOffline(nextState);
    refreshState();
  };

  const handleToggleCache = (doc: CriticalTechnicalDocument) => {
    if (doc.isCachedOffline) {
      offlineCacheService.removeDocumentFromCache(doc.id);
    } else {
      offlineCacheService.cacheDocument(doc);
    }
    refreshState();
  };

  const handlePrecacheAll = () => {
    offlineCacheService.precacheAll();
    refreshState();
  };

  const handleClearCache = () => {
    if (window.confirm('آیا از پاکسازی اسناد کش‌شده در حافظه مرورگر اطمینان دارید؟')) {
      offlineCacheService.clearAllCache();
      refreshState();
    }
  };

  const handleReadAloud = (doc: CriticalTechnicalDocument) => {
    if (isReadingAloud) {
      ttsService.stop();
      setIsReadingAloud(false);
      return;
    }

    const textToSpeak = `${doc.titleFa}. تجهیز مرتبط: ${doc.assetNameFa}. خلاصه دستورالعمل: ${doc.summaryFa}. هشدارهای ایمنی: ${doc.safetyCautionsFa.join('، ')}.`;
    setIsReadingAloud(true);
    ttsService.speak(textToSpeak, {
      lang: 'fa-IR',
      rate: 0.95,
      onComplete: () => setIsReadingAloud(false)
    });
  };

  const filteredDocs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return documents.filter((doc) => {
      if (categoryFilter !== 'all' && doc.category !== categoryFilter) return false;
      if (q) {
        const inFa = doc.titleFa.toLowerCase().includes(q) || doc.summaryFa.toLowerCase().includes(q);
        const inEn = doc.titleEn.toLowerCase().includes(q);
        const inCode = doc.docCode.toLowerCase().includes(q);
        const inAsset = doc.assetNameFa.toLowerCase().includes(q);
        if (!inFa && !inEn && !inCode && !inAsset) return false;
      }
      return true;
    });
  }, [documents, categoryFilter, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <HardDrive size={22} />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">مرکز اسناد آفلاین میدانی (PWA & Service Worker)</h1>
              <span className="text-xs text-emerald-400 font-mono">Offline-First Caching Engine • دسترسی تکنسین‌ها به دفترچه‌های فنی بدون اینترنت</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 max-w-3xl leading-relaxed">
            امکان مطالعه، جستجو و راستی‌آزمایی دستورالعمل‌های ISO 10816، روانکاری یاتاقان‌ها و نقشه‌های P&ID در مناطق فرآیندی فاقد آنتن‌دهی و شبکه‌های ایزوله صنعتی (Air-Gapped).
          </p>
        </div>

        {/* Network State & Simulator Switch */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className={`px-3.5 py-2 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
            isOnline
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 shadow-md shadow-emerald-950/40'
              : 'bg-rose-950/40 text-rose-300 border-rose-500/40 shadow-md shadow-rose-950/40'
          }`}>
            {isOnline ? <Wifi size={16} className="text-emerald-400" /> : <WifiOff size={16} className="text-rose-400" />}
            <span>{isOnline ? 'وضعیت شبکه: متصل برخط (Online)' : 'وضعیت شبکه: قطع ارتباط (Offline Field Mode)'}</span>
          </div>

          <button
            onClick={handleToggleSimulatedOffline}
            className={`px-3.5 py-2 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
              isSimulatedOffline
                ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-750'
            }`}
            title="شبیه‌سازی قطعی ارتباط جهت بررسی عملکرد ایزوله پلتفرم"
          >
            <Sliders size={14} />
            <span>{isSimulatedOffline ? 'خروج از شبیه‌ساز آفلاین' : 'تست شبیه‌ساز آفلاین'}</span>
          </button>
        </div>
      </div>

      {/* Storage Metrics & Batch Actions Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Cached Count */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">اسناد آماده در کش آفلاین</div>
            <div className="text-base font-bold text-white font-mono">
              {storageStats.cachedCount} از {storageStats.totalCount} سند
            </div>
          </div>
        </div>

        {/* Metric 2: Occupied Storage */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <HardDrive size={20} />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">حجم ذخیره‌سازی محلی</div>
            <div className="text-base font-bold text-sky-400 font-mono">
              {storageStats.formattedSize}
            </div>
          </div>
        </div>

        {/* Metric 3: Service Worker Status */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">موتور کش هوشمند PWA</div>
            <div className="text-xs font-bold text-purple-300">
              Service Worker v1 (Active)
            </div>
          </div>
        </div>

        {/* Action: Precache All Button */}
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex items-center gap-2">
          <button
            onClick={handlePrecacheAll}
            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download size={14} />
            <span>دانلود همه برای فیلد</span>
          </button>
          <button
            onClick={handleClearCache}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 border border-slate-700 transition-colors"
            title="پاکسازی کش محلی"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              categoryFilter === 'all'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            همه اسناد ({documents.length})
          </button>
          <button
            onClick={() => setCategoryFilter('compressor_guide')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              categoryFilter === 'compressor_guide'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            کمپرسور
          </button>
          <button
            onClick={() => setCategoryFilter('bearing_manual')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              categoryFilter === 'bearing_manual'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            بیرینگ و یاتاقان
          </button>
          <button
            onClick={() => setCategoryFilter('seal_protocol')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              categoryFilter === 'seal_protocol'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            سیل مکانیکی
          </button>
          <button
            onClick={() => setCategoryFilter('vibration_sop')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              categoryFilter === 'vibration_sop'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            استاندارد ارتعاشات
          </button>
        </div>

        <div className="relative min-w-[220px]">
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در دستورالعمل‌ها..."
            className="w-full bg-slate-950 text-slate-200 text-xs py-1.5 pr-8 pl-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Documents List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Header tags */}
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                  {doc.docCode}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">{doc.categoryLabelFa}</span>
                  {doc.isCachedOffline ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1 border border-emerald-500/30">
                      <Check size={11} />
                      <span>کش‌شده (Offline Ready)</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px]">
                      فقط آنلاین
                    </span>
                  )}
                </div>
              </div>

              {/* Titles */}
              <h3 className="text-sm font-bold text-white mt-3 leading-snug">{doc.titleFa}</h3>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5 line-clamp-1">{doc.titleEn}</p>

              {/* Summary */}
              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed line-clamp-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                {doc.summaryFa}
              </p>

              {/* Metadata row */}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <div>تجهیز: <strong className="text-slate-200">{doc.assetNameFa}</strong></div>
                <div>نسخه: <span className="font-mono text-white">{doc.version}</span></div>
                <div>حجم: <span className="font-mono text-emerald-400">{doc.fileSizeKb} KB</span></div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-2 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedDocForReading(doc)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
              >
                <FileText size={14} className="text-emerald-400" />
                <span>مطالعه سند در فیلد</span>
              </button>

              <button
                onClick={() => handleToggleCache(doc)}
                className={`p-2 rounded-xl text-xs font-medium border transition-colors ${
                  doc.isCachedOffline
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-rose-950 hover:text-rose-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-emerald-600 hover:text-white'
                }`}
                title={doc.isCachedOffline ? 'حذف از حافظه کش' : 'ذخیره در حافظه کش آفلاین'}
              >
                {doc.isCachedOffline ? <Check size={16} /> : <Download size={16} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reader Modal for Offline Field Study */}
      {selectedDocForReading && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-3 bg-slate-950/80">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    {selectedDocForReading.docCode}
                  </span>
                  <span className="text-xs text-slate-400">ویرایش {selectedDocForReading.version}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    حالت آفلاین فعال
                  </span>
                </div>
                <h2 className="text-base font-bold text-white leading-snug">{selectedDocForReading.titleFa}</h2>
                <div className="text-xs text-slate-400">تجهیز هدف: {selectedDocForReading.assetNameFa}</div>
              </div>

              <div className="flex items-center gap-2">
                {/* TTS Reader Button */}
                <button
                  onClick={() => handleReadAloud(selectedDocForReading)}
                  className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    isReadingAloud
                      ? 'bg-amber-600 text-white border-amber-500 animate-pulse'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                  title="قرائت صوتی دستورالعمل با هوش مصنوعی (TTS)"
                >
                  {isReadingAloud ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  <span className="text-xs hidden sm:inline">{isReadingAloud ? 'توقف صوت' : 'قرائت صوتی'}</span>
                </button>

                <button
                  onClick={() => {
                    ttsService.stop();
                    setIsReadingAloud(false);
                    setSelectedDocForReading(null);
                  }}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm leading-relaxed text-slate-300">
              {/* Safety Cautions (Crucial in field conditions) */}
              {selectedDocForReading.safetyCautionsFa.length > 0 && (
                <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 font-bold">
                    <AlertTriangle size={18} />
                    <span>الزامات ایمنی و هشدارهای حین عملیات میدانی:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-rose-200/90 text-xs">
                    {selectedDocForReading.safetyCautionsFa.map((caution, i) => (
                      <li key={i}>{caution}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sections */}
              <div className="space-y-4">
                {selectedDocForReading.keySections.map((sec, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                    <h4 className="font-bold text-emerald-300 text-sm">{sec.title}</h4>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{sec.content}</p>
                  </div>
                ))}
              </div>

              {/* Standards Reference & Hash */}
              <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-400">استانداردهای بین‌المللی مرتبط: </span>
                  <span className="text-sky-400 font-mono font-bold">
                    {selectedDocForReading.applicableStandards.join(' • ')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">کد هش زنجیره حقیقت: </span>
                  <span className="text-emerald-400 font-mono text-[11px] font-bold">
                    {selectedDocForReading.cryptographicHash}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                ذخیره‌شده در حافظه کش آفلاین مرورگر • دسترسی ۱۰۰٪ مستقل از شبکه
              </span>
              <button
                onClick={() => {
                  ttsService.stop();
                  setIsReadingAloud(false);
                  setSelectedDocForReading(null);
                }}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

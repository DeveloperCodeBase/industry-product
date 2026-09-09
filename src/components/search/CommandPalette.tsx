import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Activity,
  Layers,
  FileText,
  ShieldAlert,
  ArrowRight,
  Sliders,
  Waves,
  ShieldCheck,
  Building,
  Hash,
  X,
  CornerDownLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ARCHITECTURE_CHAPTERS, ChapterSummary } from '../../data/chaptersData';

interface SearchResultItem {
  id: string;
  category: 'asset' | 'dashboard' | 'chapter' | 'truth' | 'document';
  titleFa: string;
  titleEn: string;
  subtitleFa: string;
  subtitleEn: string;
  route: string;
  assetId?: string;
  tags: string[];
}

export const CommandPalette: React.FC = () => {
  const {
    assets,
    setSelectedAssetId,
    language,
    currentUser,
    selectedAssetId,
    t
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'asset' | 'dashboard' | 'chapter' | 'document'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Dynamic AI-driven role-based suggestions
  const roleAiSuggestions = useMemo(() => {
    const role = currentUser?.role || 'admin';
    const roleTitle = currentUser?.roleTitleFa || currentUser?.name || 'کاربر سیستم';

    if (role === 'reliability_engineer') {
      return {
        badgeFa: 'پیشنهادات ویژه سرپرست ارتعاشات و RUL',
        roleTitle,
        suggestions: [
          { labelFa: 'تحلیل فرکانس BPFO و یاتاقان SKF', query: 'bpfo', tag: 'BPFO' },
          { labelFa: 'استاندارد ارتعاشات ISO 10816', query: 'iso 10816', tag: 'ISO-10816' },
          { labelFa: 'گراف دانش اسناد و قطعات (D3)', query: 'گراف دانش', tag: 'D3-Graph' },
          { labelFa: 'ممیزی ارتعاشی کمپرسور K-04', query: 'k04', tag: 'K-04' }
        ]
      };
    } else if (role === 'operator') {
      return {
        badgeFa: 'پیشنهادات اختصاصی تکنسین میدانی و اپراتور',
        roleTitle,
        suggestions: [
          { labelFa: 'دفترچه‌های راهنمای آفلاین (PWA)', query: 'آفلاین', tag: 'Offline-PWA' },
          { labelFa: 'دستورالعمل نگهداری پمپ P-02', query: 'پمپ', tag: 'SOP-P02' },
          { labelFa: 'اسکنر بارکد و QR تجهیزات', query: 'qr', tag: 'Field-QR' },
          { labelFa: 'دستورکارهای CMMS نظم‌گر', query: 'نظم گر', tag: 'CMMS' }
        ]
      };
    } else if (role === 'auditor') {
      return {
        badgeFa: 'پیشنهادات ویژه بازرس ممیزی حقیقت داده',
        roleTitle,
        suggestions: [
          { labelFa: 'کاوشگر زنجیره بلوک حقیقت و هش PTP', query: 'truth block', tag: 'Truth-Block' },
          { labelFa: 'مقایسه‌گر ویرایش‌های اسناد (Diff)', query: 'مقایسه', tag: 'Doc-Diff' },
          { labelFa: 'کالیبراسیون و شناسنامه حسگرها', query: 'کالیبراسیون', tag: 'Calibration' },
          { labelFa: 'پیمان حقوقی و ممیزی IP', query: 'قرارداد', tag: 'SLA-Legal' }
        ]
      };
    }

    // Default for admin / executives
    return {
      badgeFa: 'پیشنهادات هوشمند مدیران ارشد استقرار ویستا',
      roleTitle,
      suggestions: [
        { labelFa: 'پیمان رسمی ثبت ۵۸۳۳۰۲ و تعهدات SLA', query: '583302', tag: 'Contract-583302' },
        { labelFa: 'مقایسه‌گر نسخه‌های اسناد (Diff)', query: 'مقایسه', tag: 'Doc-Diff' },
        { labelFa: 'گراف دانش پیوند اسناد و دارایی‌ها', query: 'گراف دانش', tag: 'Knowledge-Graph' },
        { labelFa: 'ایزولاسیون شبکه IEC 62443', query: 'iec', tag: 'Cybersecurity' }
      ]
    };
  }, [currentUser]);

  // Global keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Build searchable database
  const searchDatabase = useMemo<SearchResultItem[]>(() => {
    const items: SearchResultItem[] = [];

    // 1. Assets
    assets.forEach((a) => {
      const vib = a.telemetry?.vibrationRms ? a.telemetry.vibrationRms.toFixed(2) : '0.00';
      const faTitle = a.faName || a.name;
      const faType = a.faType || a.type;
      items.push({
        id: `asset-${a.id}`,
        category: 'asset',
        titleFa: faTitle,
        titleEn: a.name,
        subtitleFa: `${faType} • وضعیت: ${a.status.toUpperCase()} • ارتعاش: ${vib} mm/s`,
        subtitleEn: `${a.type} • Status: ${a.status.toUpperCase()} • Vibration: ${vib} mm/s`,
        route: a.id === 'compressor-04' ? '#/vibration' : '#/twin',
        assetId: a.id,
        tags: [a.name, faTitle, a.type, faType, a.id, 'sensor', 'twin', 'vibration'],
      });
    });

    // 2. Dashboards & Products
    const dashboards: Array<{ titleFa: string; titleEn: string; descFa: string; descEn: string; route: string; tags: string[] }> = [
      {
        titleFa: 'ویستا-دیدبان (واقعیت مشترک)',
        titleEn: 'Vista-Didban (Shared Reality)',
        descFa: 'داشبورد بلادرنگ پایش پارامترهای فیزیکی، تله‌متری و حذف توهم',
        descEn: 'Real-time sensor telemetry and shared reality dashboard',
        route: '#/didban',
        tags: ['دیدبان', 'didban', 'telemetry', 'realtime', 'سنسور', 'telemetry'],
      },
      {
        titleFa: 'ویستا-پاسدار (حریم امن و پایش سلامت)',
        titleEn: 'Vista-Pasdar (Safety & HSE Envelope)',
        descFa: 'پایش حریم‌های فیزیکی، حدود مجاز ISO 10816 و حفاظت دارایی',
        descEn: 'Physical safety envelope, ISO vibration zones and trip protection',
        route: '#/pasdar',
        tags: ['پاسدار', 'pasdar', 'safety', 'hse', 'iso10816', 'trip', 'حفاظت'],
      },
      {
        titleFa: 'ویستا-نظم‌گر (بهینه‌سازی بار و زمان)',
        titleEn: 'Vista-Nazmgar (Load & Schedule Optimizer)',
        descFa: 'توازن بار تولید، پیش‌بینی RUL و اتصال به دستورکارهای CMMS',
        descEn: 'Load scheduling, RUL prediction and CMMS work order dispatch',
        route: '#/nazmgar',
        tags: ['نظم گر', 'nazmgar', 'cmms', 'work order', 'rul', 'تولید'],
      },
      {
        titleFa: 'ویستا-حافظه (گراف دانش و تجارب سازمانی)',
        titleEn: 'Vista-Hafeze (Knowledge Graph & Graph RAG)',
        descFa: 'ثبت شواهد قطعی سوابق خرابی، همبستگی آماری و مستندات استاندارد',
        descEn: 'Incident knowledge graph, historical fault precedents and SOPs',
        route: '#/hafeze',
        tags: ['حافظه', 'hafeze', 'graph', 'sop', 'knowledge', 'خرابی'],
      },
      {
        titleFa: 'دوقلوی دیجیتال سه‌بعدی (۳D Digital Twin)',
        titleEn: '3D Digital Twin Engine',
        descFa: 'موتور سه‌بعدی Three.js با ۴ سطح بلوغ (توصیفی، پیش‌بین، تجویزی، خودگردان)',
        descEn: 'Three.js 3D engine with 4 maturity levels (Descriptive to Autonomous)',
        route: '#/twin',
        tags: ['دوقلو', 'twin', '3d', 'threejs', 'maturity', 'شبیه سازی'],
      },
      {
        titleFa: 'تحلیلگر طیف ارتعاشات و FFT',
        titleEn: 'Vibration Spectrum & FFT Analyzer',
        descFa: 'تحلیل طیف فرکانسی، پاکت ارتعاشی، دمدولاسیون و فرکانس‌های عیب یاتاقان',
        descEn: 'FFT frequency spectra, envelope demodulation, BPFO/BPFI bearing faults',
        route: '#/vibration',
        tags: ['ارتعاش', 'vibration', 'fft', 'spectrum', 'bearing', 'طیف'],
      },
      {
        titleFa: 'شبیه‌ساز سناریوهای فیزیکی چه-اگر (What-If)',
        titleEn: 'What-If Physical Fault Simulator',
        descFa: 'تزریق خرابی، تست پاسخ تجهیز و ارزیابی ریسک مونت‌کارلو',
        descEn: 'Fault injection, equipment stress response and Monte Carlo risk',
        route: '#/what-if',
        tags: ['سناریو', 'whatif', 'scenario', 'monte carlo', 'خرابی', 'شبیه ساز'],
      },
      {
        titleFa: 'کاوشگر بلوک حقیقت و زنجیره هش',
        titleEn: 'Truth Block & Evidence Hash Explorer',
        descFa: 'زنجیره هش غیرقابل انکار SHA-256، مهرهای زمانی IEEE 1588 و ممیزی حقیقت',
        descEn: 'Immutable SHA-256 cryptographic truth chain and PTP timestamps',
        route: '#/truth-block',
        tags: ['بلوک حقیقت', 'truth block', 'sha256', 'hash', 'cryptography', 'ممیزی'],
      },
      {
        titleFa: 'معماری ۱۱ لایه و بررسی غول‌های فناوری',
        titleEn: '11-Layer Architecture & Tech Giants Benchmarking',
        descFa: 'بررسی زیمنس، جنرال الکتریک، هانی‌ول، اشنایدر، ای‌بی‌بی و مدل ۱۱ لایه ویستا',
        descEn: 'Detailed benchmark of Siemens, GE, Honeywell, ABB, Schneider & 11 layers',
        route: '#/architecture',
        tags: ['معماری', 'architecture', 'siemens', 'ge', 'honeywell', 'abb', 'schneider'],
      },
      {
        titleFa: 'اورلی تعاملی نقشه‌های مهندسی و پیوند قطعات به سوابق فنی',
        titleEn: 'Interactive Schematic Overlay & Part Maintenance Linkage',
        descFa: 'کلیک روی اجزای نقشه و دیاگرام جهت هایلایت و پیوند لحظه‌ای سوابق نگهداری، SOP و استانداردها',
        descEn: 'Interactive machine parts overlay, maintenance logs and technical docs highlight',
        route: '#/schematic-overlay',
        tags: ['نقشه', 'اورلی', 'schematic', 'overlay', 'قطعات', 'machine parts', 'pid', 'دیاگرام', 'برش مقطع'],
      },
      {
        titleFa: 'اسناد، تفاهم‌نامه‌ها و قراردادهای رسمی',
        titleEn: 'Proposals, MOUs & Official Legal Contracts',
        descFa: 'اسناد حقوقی شماره ثبت ۵۸۳۳۰۲، قرارداد استقرار صنعتی و ممیزی IP',
        descEn: 'Official legal contracts, SLA, IP licensing and registration #583302',
        route: '#/proposals-contracts',
        tags: ['قرارداد', 'proposal', 'contract', 'mou', 'حقوقی', 'مهر رسمی'],
      },
      {
        titleFa: 'راهنمای استانداردها و متدولوژی',
        titleEn: 'Methodology & Standards Guide',
        descFa: 'استانداردهای ISO 10816/20816، ISO 13373 و IEC 62443',
        descEn: 'Engineering standards guide: ISO 10816, ISO 13373, IEC 62443',
        route: '#/guide',
        tags: ['راهنما', 'guide', 'standards', 'iso', 'iec', 'پردو'],
      },
      {
        titleFa: 'ورود و مدیریت پرسونای سازمانی',
        titleEn: 'Login & Enterprise Role Switcher',
        descFa: 'احراز هویت مبتنی بر نقش (RBAC) و تغییر پرسونای مدیریتی/مهندسی',
        descEn: 'Role-based access control (RBAC) and executive/engineering personas',
        route: '#/login',
        tags: ['ورود', 'login', 'auth', 'roles', 'پرسونا'],
      },
    ];

    dashboards.forEach((d, idx) => {
      items.push({
        id: `dash-${idx}`,
        category: 'dashboard',
        titleFa: d.titleFa,
        titleEn: d.titleEn,
        subtitleFa: d.descFa,
        subtitleEn: d.descEn,
        route: d.route,
        tags: d.tags,
      });
    });

    // 3. Chapters from reference doc (doc1.docx)
    ARCHITECTURE_CHAPTERS.forEach((c: ChapterSummary) => {
      items.push({
        id: `chap-${c.chapterNumber}`,
        category: 'chapter',
        titleFa: c.titleFa,
        titleEn: c.titleEn,
        subtitleFa: c.summaryFa,
        subtitleEn: c.summaryFa,
        route: '#/architecture',
        tags: [c.titleFa, c.titleEn, `فصل ${c.chapterNumber}`, `chapter ${c.chapterNumber}`, ...(c.keyTakeaways || [])],
      });
    });

    // 4. Industrial Documents, Contracts & SOPs
    const documents = [
      {
        id: 'doc-contract-583302',
        titleFa: 'قرارداد رسمی پیمان استقرار سامانه پایش و دوقلوی دیجیتال ویستا (ثبت ۵۸۳۳۰۲)',
        titleEn: 'Official Vista Digital Twin EPC & Deployment Contract #583302',
        subtitleFa: 'تعهدات مهندسی پتروشیمی، استقرار لبه، حریم IEC 62443 و ممیزی زنجیره بلوک حقیقت',
        subtitleEn: 'Petrochemical EPC obligations, edge isolation, IEC 62443 & Truth Block SLA',
        route: '#/proposals-contracts',
        tags: ['قرارداد', 'contract', '583302', 'پیمان', 'عسلویه', 'تعهدات', 'epc', 'document'],
      },
      {
        id: 'doc-sla-9995',
        titleFa: 'توافق‌نامه سطح خدمات پتروشیمی (SLA ۹۹.۹۵٪ و حریم سایبری)',
        titleEn: 'Petrochemical Service Level Agreement (99.95% Availability SLA)',
        subtitleFa: 'تضمین پایش بلادرنگ بدون قطعی، هشدار کمتر از ۲ ثانیه و فاصله اطمینان ۹۹.۸٪',
        subtitleEn: 'Zero-downtime SLA, <2s alert trip response, 99.8% confidence interval',
        route: '#/proposals-contracts',
        tags: ['sla', 'خدمات', 'دسترس پذیری', 'تضمین', 'توافق نامه', 'document'],
      },
      {
        id: 'doc-audit-k04',
        titleFa: 'گزارش ممیزی ارتعاشاتی و تحلیل سلامت یاتاقان کمپرسور K-04',
        titleEn: 'Vibration Audit & Bearing Defect Report for Compressor K-04',
        subtitleFa: 'تحلیل هارمونیک BPFO، شاخص کرتوزیس ۴.۳ و دستورالعمل تعویض بیرینگ SKF',
        subtitleEn: 'BPFO harmonic spike analysis, kurtosis 4.3 and bearing replacement SOP',
        route: '#/vibration/compressor-04',
        tags: ['گزارش', 'report', 'audit', 'k04', 'کمپرسور', 'بیرینگ', 'vibration', 'document'],
      },
      {
        id: 'doc-iec-62443',
        titleFa: 'سند استاندارد معماری امنیت صنعتی و ایزولاسیون داده IEC 62443-3-3',
        titleEn: 'IEC 62443 Industrial Cybersecurity & Data Isolation Standard',
        subtitleFa: 'جداسازی مناطق پردو Level 0/1 از شبکه‌های عمومی با دیتادیود سخت‌افزاری',
        subtitleEn: 'Purdue model level isolation, hardware data diode and AES-256 encryption',
        route: '#/guide',
        tags: ['امنیت', 'iec62443', 'security', 'cybersecurity', 'پردو', 'دیود', 'document'],
      },
      {
        id: 'doc-sop-maintenance',
        titleFa: 'دستورالعمل SOP تعمیرات پیش‌بینانه و کالیبراسیون سنسورهای لبه',
        titleEn: 'Predictive Maintenance SOP & Edge Sensor Calibration Guide',
        subtitleFa: 'رویه ممیزی دوره‌ای گواهی آزمایشگاه مرجع، جبران رانش و آزمون نویز زمینه',
        subtitleEn: 'Calibration audit procedures, drift offset verification and sensor zeroing',
        route: '#/truth-block',
        tags: ['sop', 'دستورالعمل', 'تعمیرات', 'نگهداری', 'کالیبراسیون', 'document'],
      },
      {
        id: 'doc-tool-knowledge-graph',
        titleFa: 'گراف دانش پیوند اسناد فنی و دارایی‌های مکانیکی (D3.js)',
        titleEn: 'Document & Asset Knowledge Graph Visualizer',
        subtitleFa: 'ردیابی بصری روابط گزارش‌های ارتعاشی، نقشه‌های P&ID و قطعات با D3.js',
        subtitleEn: 'D3.js interactive force simulation linking technical reports to physical assets',
        route: '#/knowledge-graph',
        tags: ['گراف دانش', 'knowledge graph', 'd3', 'ارتباطات', 'روابط', 'document'],
      },
      {
        id: 'doc-tool-comparison',
        titleFa: 'مقایسه‌گر هوشمند ویرایش‌های اسناد و قراردادها (Diff Inspector)',
        titleEn: 'Document & Contract Version Diff Inspector',
        subtitleFa: 'تحلیل بصری تغییرات بندها، تفاضل متادیتا و تعهدات SLA بین دو نسخه',
        subtitleEn: 'Side-by-side and unified diff viewer highlighting additions, removals and SLA modifications',
        route: '#/doc-comparison',
        tags: ['مقایسه', 'diff', 'تغییرات', 'ویرایش', 'قرارداد', 'document'],
      },
      {
        id: 'doc-tool-offline-manager',
        titleFa: 'مرکز اسناد آفلاین میدانی و کش Service Worker (PWA)',
        titleEn: 'Field Offline Documents & Service Worker Manager',
        subtitleFa: 'دسترسی آفلاین ۱۰۰٪ به دفترچه‌های راهنما، SOPها و هشدارهای ایمنی در مناطق بدون شبکه',
        subtitleEn: 'Service worker offline caching engine for field engineers in air-gapped zones',
        route: '#/offline-docs',
        tags: ['آفلاین', 'offline', 'pwa', 'service worker', 'فیلد', 'کش', 'document'],
      },
    ];

    documents.forEach((doc) => {
      items.push({
        id: doc.id,
        category: 'document',
        titleFa: doc.titleFa,
        titleEn: doc.titleEn,
        subtitleFa: doc.subtitleFa,
        subtitleEn: doc.subtitleEn,
        route: doc.route,
        tags: doc.tags,
      });
    });

    return items;
  }, [assets]);

  // Filter items based on active category & query
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    return searchDatabase.filter((item) => {
      // Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      // Query filter
      if (!q) return true;

      const inFa = item.titleFa.toLowerCase().includes(q) || item.subtitleFa.toLowerCase().includes(q);
      const inEn = item.titleEn.toLowerCase().includes(q) || item.subtitleEn.toLowerCase().includes(q);
      const inTags = item.tags.some((tag) => tag.toLowerCase().includes(q));

      return inFa || inEn || inTags;
    });
  }, [searchDatabase, activeCategory, query]);

  // Keep selected index within bounds
  useEffect(() => {
    if (selectedIndex >= filteredResults.length) {
      setSelectedIndex(0);
    }
  }, [filteredResults.length, selectedIndex]);

  // Keyboard navigation inside command palette
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        executeItem(filteredResults[selectedIndex]);
      }
    }
  };

  const executeItem = (item: SearchResultItem) => {
    if (item.assetId) {
      setSelectedAssetId(item.assetId);
    }
    window.location.hash = item.route;
    setIsOpen(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'asset':
        return <Activity size={16} className="text-sky-400 shrink-0" />;
      case 'dashboard':
        return <Layers size={16} className="text-teal-400 shrink-0" />;
      case 'chapter':
        return <FileText size={16} className="text-amber-400 shrink-0" />;
      case 'document':
        return <Sparkles size={16} className="text-purple-400 shrink-0" />;
      default:
        return <Search size={16} className="text-slate-400 shrink-0" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'asset':
        return t('search_assets');
      case 'dashboard':
        return t('search_dashboards');
      case 'chapter':
        return t('search_chapters');
      case 'document':
        return language === 'en' ? 'Contracts & Docs' : 'اسناد و قراردادها';
      default:
        return t('search_all');
    }
  };

  return (
    <>
      {/* Search trigger button in Navbar */}
      <button
        id="global-command-palette-trigger"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 sm:gap-2 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 hover:bg-slate-700/90 text-slate-300 dark:text-slate-300 light:text-slate-700 border border-slate-700/60 dark:border-slate-700/60 light:border-slate-200 transition-all text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/50"
        title="جستجوی سریع (Ctrl+K)"
        aria-label="جستجوی سریع در پلتفرم"
      >
        <Search size={15} className="text-sky-400 shrink-0" />
        <span className="hidden xl:inline text-slate-400 dark:text-slate-400 light:text-slate-500 max-w-[140px] 2xl:max-w-[200px] truncate">
          {t('search_placeholder')}
        </span>
        <span className="hidden 2xl:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-900/80 dark:bg-slate-900/80 light:bg-white text-[10px] font-mono text-slate-400 dark:text-slate-400 light:text-slate-600 border border-slate-700/70 dark:border-slate-700/70 light:border-slate-300">
          <kbd className="font-sans">Ctrl</kbd>
          <span>K</span>
        </span>
      </button>

      {/* Command Palette Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
          {/* Backdrop click to dismiss */}
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />

          {/* Palette Dialog */}
          <div
            id="command-palette-modal"
            className="relative w-full max-w-2xl bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 text-right"
          >
            {/* Search Input Bar */}
            <div className="p-3.5 border-b border-slate-800 dark:border-slate-800 light:border-slate-200 flex items-center gap-3 bg-slate-950/70 dark:bg-slate-950/70 light:bg-slate-50">
              <Search size={20} className="text-sky-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder={t('search_placeholder')}
                className="w-full bg-transparent text-sm font-medium text-slate-100 dark:text-slate-100 light:text-slate-900 placeholder-slate-500 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-200 rounded-lg"
                >
                  <X size={16} />
                </button>
              )}
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 dark:bg-slate-800 light:bg-slate-200 text-slate-400">
                ESC
              </span>
            </div>

            {/* AI-Driven Role Recommendation Filter Bar */}
            <div className="px-3.5 py-2.5 bg-gradient-to-r from-sky-950/40 via-purple-950/30 to-slate-950/50 border-b border-slate-800/90 text-xs">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 text-sky-400 font-bold text-[11px]">
                  <Sparkles size={13} className="animate-pulse text-amber-400" />
                  <span>{roleAiSuggestions.badgeFa}</span>
                </div>
                <span className="text-[10px] text-slate-400 truncate max-w-[200px]">
                  نقش: {roleAiSuggestions.roleTitle}
                </span>
              </div>

              {/* Suggestion Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                {roleAiSuggestions.suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(sug.query);
                      setSelectedIndex(0);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all flex items-center gap-1 border ${
                      query === sug.query
                        ? 'bg-sky-600 text-white border-sky-400 shadow-md shadow-sky-600/30'
                        : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-750 hover:border-sky-500/50'
                    }`}
                  >
                    <span>{sug.labelFa}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Category Chips */}
            <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 bg-slate-950/40 dark:bg-slate-950/40 light:bg-slate-100 text-xs overflow-x-auto">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeCategory === 'all'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {t('search_all')} ({searchDatabase.length})
              </button>
              <button
                onClick={() => setActiveCategory('asset')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeCategory === 'asset'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Activity size={13} />
                <span>{t('search_assets')} ({assets.length})</span>
              </button>
              <button
                onClick={() => setActiveCategory('dashboard')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeCategory === 'dashboard'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Layers size={13} />
                <span>{t('search_dashboards')} (12)</span>
              </button>
              <button
                onClick={() => setActiveCategory('chapter')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeCategory === 'chapter'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <FileText size={13} />
                <span>{t('search_chapters')} (17)</span>
              </button>
              <button
                onClick={() => setActiveCategory('document')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeCategory === 'document'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Sparkles size={13} />
                <span>{language === 'en' ? 'Contracts & Docs' : 'اسناد و قراردادها'} (5)</span>
              </button>
            </div>

            {/* Results List */}
            <div
              ref={listRef}
              className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-800/50 dark:divide-slate-800/50 light:divide-slate-100"
            >
              {filteredResults.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-xs text-slate-400 font-medium">{t('search_no_results')}</p>
                </div>
              ) : (
                filteredResults.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => executeItem(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-sky-500/15 dark:bg-sky-500/15 light:bg-sky-50 border border-sky-500/30'
                          : 'hover:bg-slate-800/40 dark:hover:bg-slate-800/40 light:hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className={`p-2 rounded-xl shrink-0 ${
                            isSelected
                              ? 'bg-sky-500/20 text-sky-400'
                              : 'bg-slate-800/70 dark:bg-slate-800/70 light:bg-slate-100 text-slate-400'
                          }`}
                        >
                          {getCategoryIcon(item.category)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 truncate">
                              {language === 'en' || language === 'tr' ? item.titleEn : item.titleFa}
                            </span>
                            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 dark:bg-slate-800 light:bg-slate-200 text-slate-400">
                              {getCategoryLabel(item.category)}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600 truncate mt-0.5">
                            {language === 'en' || language === 'tr' ? item.subtitleEn : item.subtitleFa}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-slate-500 shrink-0">
                        {isSelected && (
                          <span className="text-[10px] text-sky-400 font-mono hidden sm:inline flex items-center gap-1">
                            <CornerDownLeft size={12} />
                            <span>انتخاب</span>
                          </span>
                        )}
                        <ChevronRight size={15} className="rtl:rotate-180" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer hints */}
            <div className="p-2.5 border-t border-slate-800 dark:border-slate-800 light:border-slate-200 bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-50 text-[11px] text-slate-400 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{t('search_navigate')}</span>
              </div>
              <div className="font-mono text-[10px] text-slate-500">
                {filteredResults.length} نتیجه
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

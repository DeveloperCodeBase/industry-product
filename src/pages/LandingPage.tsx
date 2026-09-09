import React, { useState } from 'react';
import {
  Eye,
  ShieldAlert,
  CalendarCheck,
  GitFork,
  CheckCircle,
  XCircle,
  ExternalLink,
  Layers,
  Database,
  Lock,
  Boxes,
  Cpu,
  TrendingUp,
  Award,
  ArrowRight,
  ShieldCheck,
  Activity,
  Zap,
  Check,
  Server,
  Terminal,
  FileText,
  Sliders,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Building2,
  Users,
  Scale,
  QrCode,
  Wrench,
  Gauge,
  Waves,
  Fingerprint,
  Radio,
  BookOpen
} from 'lucide-react';
import { TechGiantBenchmark, VibrationIsoZone } from '../types';
import { useApp } from '../context/AppContext';
import { AssetQrScannerModal } from '../components/scanner/AssetQrScannerModal';

export const LandingPage: React.FC = () => {
  const { assets, t, language, theme, isAuthenticated, setSelectedAssetId } = useApp();
  const [activeTab, setActiveTab] = useState<'science_vibration' | 'truth_chain' | 'triad' | 'twin_levels' | 'benchmark'>('science_vibration');
  const [scannerOpen, setScannerOpen] = useState(false);
  const [selectedIsoPowerKw, setSelectedIsoPowerKw] = useState<number>(350);
  const [selectedIsoFoundation, setSelectedIsoFoundation] = useState<'rigid' | 'flexible'>('rigid');

  const benchmarkData: TechGiantBenchmark[] = [
    {
      vendor: 'Siemens Xcelerator',
      faVendor: language === 'en' ? 'Siemens (Germany)' : language === 'ar' ? 'سيمنز (ألمانيا)' : language === 'tr' ? 'Siemens (Almanya)' : 'زیمنس (آلمان)',
      platform: 'Insights Hub & Simcenter',
      strengths: language === 'en' ? 'Deep multiphysics hybrid simulation (Simcenter) and TIA portal integration' : 'شبیه‌سازی چندفیزیکی عمیق (Hybrid Twin) با مدل‌های Simcenter و ادغام با TIA',
      weaknesses: language === 'en' ? 'Heavy proprietary hardware lock-in, global cloud subscription dependency' : 'قفل فروشنده شدید در سخت‌افزار، مدل اشتراک ابری وابسته به شبکه جهانی، هزینه دلاری سنگین',
      truthChainSupport: language === 'en' ? 'Partial' : 'ناقص',
      cloudDependence: language === 'en' ? 'High' : 'بالا',
      iranSanctionRisk: language === 'en' ? 'Critical (Total Sanctions)' : 'بحرانی (تحریم کامل و عدم پشتیبانی)',
      architectureLayer: 'Edge to Cloud to PLM',
    },
    {
      vendor: 'GE Vernova (Predix Legacy)',
      faVendor: language === 'en' ? 'General Electric (USA)' : language === 'ar' ? 'جنرال إلكتريك (أمريكا)' : language === 'tr' ? 'General Electric (ABD)' : 'جنرال الکتریک (آمریکا)',
      platform: 'Meridium APM & Fleet Analytics',
      strengths: language === 'en' ? 'Extensive library of turbomachinery failure modes built over decades' : 'بانک جامع الگوهای شکست توربین‌ها و دارایی‌های حرارتی مبتنی بر داده‌های چند دهه‌ای',
      weaknesses: language === 'en' ? 'Predix infrastructure sunset, licensing friction, weak on-premise airgap mode' : 'شکست زیرساخت Predix، پیچیدگی لایسنس و عدم انطباق با نیازمندی‌های شبکه محلی On-Premise',
      truthChainSupport: language === 'en' ? 'None' : 'ناموجود',
      cloudDependence: language === 'en' ? 'Very High' : 'بسیار بالا',
      iranSanctionRisk: language === 'en' ? 'Critical (Total Sanctions)' : 'بحرانی (تحریم کامل)',
      architectureLayer: 'Oil & Gas / Power APM',
    },
    {
      vendor: 'Schneider EcoStruxure',
      faVendor: language === 'en' ? 'Schneider Electric (France)' : language === 'ar' ? 'شنايدر إلكتريك (فرنسا)' : language === 'tr' ? 'Schneider Electric (Fransa)' : 'اشنایدر الکتریک (فرانسه)',
      platform: 'Automation Expert & EcoCare',
      strengths: language === 'en' ? 'Open decoupled control architecture based on international IEC 61499' : 'معماری کنترل تفکیک‌شده و باز مبتنی بر استاندارد بین‌المللی IEC 61499',
      weaknesses: language === 'en' ? 'Focuses primarily on electrical distribution rather than deep mechanical vibration dynamics' : 'تمرکز بیشتر بر توزیع برق و آمار تا تحلیل‌های دینامیکی چندبعدی ارتعاشات مکانیکی',
      truthChainSupport: language === 'en' ? 'Partial' : 'ناقص',
      cloudDependence: language === 'en' ? 'Moderate' : 'متوسط',
      iranSanctionRisk: language === 'en' ? 'High Risk' : 'بسیار پرخطر',
      architectureLayer: 'Connected Products to Edge Control',
    },
    {
      vendor: 'ABB Genix',
      faVendor: language === 'en' ? 'ABB (Switzerland/Sweden)' : language === 'ar' ? 'إيه بي بي (سويسرا/السويد)' : language === 'tr' ? 'ABB (İsviçre/İsveç)' : 'ای‌بی‌بی (سوئیس/سوئد)',
      platform: 'Genix Industrial Analytics & AI',
      strengths: language === 'en' ? 'Triad convergence of OT/IT/ET data and integrated smart electric motor vibration sensors' : 'همگرایی سه‌گانه داده‌های صنعتی OT/IT/ET و حسگرهای ارتعاشی یکپارچه الکتروموتورها',
      weaknesses: language === 'en' ? 'Lack of tamper-evident hardware proof chain with open microsecond PTP timestamping' : 'فقدان مکانیسم بومی اثبات‌ناپذیری زنجیره کالیبراسیون و برچسب زمانی با پروتکل باز PTP',
      truthChainSupport: language === 'en' ? 'Weak' : 'محدود',
      cloudDependence: language === 'en' ? 'High' : 'بالا',
      iranSanctionRisk: language === 'en' ? 'Critical' : 'بحرانی',
      architectureLayer: 'OT/IT/ET Enterprise Suite',
    },
    {
      vendor: 'Vista Industrial Truth',
      faVendor: language === 'en' ? 'Vista Intelligent Network Co.' : language === 'ar' ? 'شركة شبكة فيستا الذكية' : language === 'tr' ? 'Vista Akıllı Ağ İnovasyonu' : 'شرکت شبکه هوشمند ابتکار ویستا',
      platform: language === 'en' ? 'National Industrial Truth, 3D Digital Twin & Autonomous PdM' : 'پلتفرم جامع حقیقت صنعتی، دوقلوی ۳بعدی و نگهداری پیش‌بینانه بومی',
      strengths: language === 'en' ? 'SHA-256 truth blocks, sub-10ms PTP sync, 4-tier 3D twin, 100% on-premise airgap deployment' : 'بلوک حقیقت با هش SHA-256 و PTP، دوقلوی سه‌بعدی ۴ سطحی، استقرار ۱۰۰٪ On-Premise، پشتیبانی از ناوگان مختلط صنایع ایران',
      weaknesses: language === 'en' ? 'Requires edge acquisition cards on legacy plants without existing sensors' : 'نیازمند نصب کارت‌های هوشمند جمع‌آوری لبه در خطوط قدیمی فاقد سنسور',
      truthChainSupport: language === 'en' ? 'Complete (Cryptographic)' : 'کامل (ثبت رمزنگاری‌شده)',
      cloudDependence: language === 'en' ? 'Independent (Air-gapped)' : 'مستقل (Edge-Native On-Premise)',
      iranSanctionRisk: language === 'en' ? 'Zero (100% Sovereign IP)' : 'صفر (توسعه و مالکیت ۱۰۰٪ بومی ویستا)',
      architectureLayer: language === 'en' ? 'Complete 11-layer architecture' : '۱۱ لایه کامل معماری منطبق بر استانداردهای بین‌المللی',
    },
  ];

  const isRtl = language === 'fa' || language === 'ar';

  const evidenceSteps = [
    {
      num: isRtl ? '۰۱' : '01',
      title: t('step1_title'),
      desc: t('step1_desc'),
      tag: 'Purdue Layer 0',
      color: 'border-sky-500 text-sky-400',
    },
    {
      num: isRtl ? '۰۲' : '02',
      title: t('step2_title'),
      desc: t('step2_desc'),
      tag: 'IEEE 1588 PTP',
      color: 'border-cyan-500 text-cyan-400',
    },
    {
      num: isRtl ? '۰۳' : '03',
      title: t('step3_title'),
      desc: t('step3_desc'),
      tag: 'SHA-256 Immutable',
      color: 'border-emerald-500 text-emerald-400',
    },
    {
      num: isRtl ? '۰۴' : '04',
      title: t('step4_title'),
      desc: t('step4_desc'),
      tag: 'Three.js & ISO 10816',
      color: 'border-purple-500 text-purple-400',
    },
    {
      num: isRtl ? '۰۵' : '05',
      title: t('step5_title'),
      desc: t('step5_desc'),
      tag: 'Autonomous CMMS',
      color: 'border-rose-500 text-rose-400',
    },
  ];

  const primaryTargetUrl = isAuthenticated ? '#/didban' : '#/login';

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 w-full max-w-[1920px] mx-auto min-w-0">
      {/* Top Scientific Master Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-white dark:bg-gradient-to-b dark:from-[#060c18] dark:via-[#091122] dark:to-[#040810] border border-slate-200 dark:border-slate-800 p-5 sm:p-8 lg:p-12 shadow-2xl transition-colors">
        {/* Subtle Ambient Mathematical Glow */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          {/* Scientific Badges Row */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 text-xs font-bold tracking-wide">
              <Award size={15} />
              <span>{t('hero_badge')}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold">
              <ShieldCheck size={14} />
              <span>{t('hero_standards')}</span>
            </div>
          </div>

          {/* Master Headline */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
            {t('hero_title_1')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500 dark:from-sky-400 dark:via-cyan-300 dark:to-teal-300">
              {t('hero_title_2')}
            </span>
          </h1>

          {/* Deep Scientific Project Description */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl text-justify">
            {t('hero_desc')}
          </p>

          {/* Primary Action Controls */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={primaryTargetUrl}
              className="px-5 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-sky-600/30 transition-all flex items-center gap-2 group whitespace-nowrap"
            >
              <Lock size={16} />
              <span>{isAuthenticated ? t('nav_dashboard') : t('hero_cta_login')}</span>
              {isRtl ? (
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              ) : (
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              )}
            </a>

            <a
              href={isAuthenticated ? '#/twin' : '#/login'}
              className="px-4 sm:px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm border border-slate-300 dark:border-slate-700 transition-all flex items-center gap-2 shadow-sm whitespace-nowrap"
            >
              <Boxes size={16} className="text-sky-500" />
              <span>{t('hero_cta_twin')}</span>
            </a>

            <a
              href="#/maintenance"
              className="px-4 sm:px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm border border-slate-300 dark:border-slate-700 transition-all flex items-center gap-2 shadow-sm whitespace-nowrap"
            >
              <Wrench size={16} className="text-amber-500" />
              <span>{t('hero_cta_maintenance')}</span>
            </a>

            <button
              onClick={() => setScannerOpen(true)}
              className="px-4 sm:px-5 py-3 rounded-xl bg-purple-600/15 hover:bg-purple-600/25 text-purple-700 dark:text-purple-300 font-bold text-xs sm:text-sm border border-purple-500/40 transition-all flex items-center gap-2 shadow-sm whitespace-nowrap"
            >
              <QrCode size={16} className="text-purple-500" />
              <span>{t('hero_cta_qr')}</span>
            </button>
          </div>

          {/* Scientific Metrics Proof Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-slate-200 dark:border-slate-800/80">
            <div className="bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800/80">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">{t('stat_traceability')}</div>
              <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">۹۹.۹۸٪</div>
              <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{t('stat_traceability_sub')}</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800/80">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">{t('stat_sync_precision')}</div>
              <div className="text-xl sm:text-2xl font-black font-mono text-sky-600 dark:text-sky-400 mt-1">±۴.۲ µs</div>
              <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{t('stat_sync_sub')}</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800/80">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">{t('stat_twin_levels')}</div>
              <div className="text-xl sm:text-2xl font-black font-mono text-purple-600 dark:text-purple-400 mt-1">Level 1 - 4</div>
              <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{t('stat_twin_sub')}</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800/80">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">{t('stat_independence')}</div>
              <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">۱۰۰٪</div>
              <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{t('stat_independence_sub')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Scientific Deep Dive Section */}
      <section className="p-5 sm:p-8 lg:p-10 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 mb-1">
              <BookOpen size={16} />
              <span>{t('tab_vibration_iso')}</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
              {t('iso_calc_title')}
            </h2>
          </div>

          {/* Scientific Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('science_vibration')}
              className={`px-3 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
                activeTab === 'science_vibration'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('tab_vibration_iso')}
            </button>
            <button
              onClick={() => setActiveTab('truth_chain')}
              className={`px-3 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
                activeTab === 'truth_chain'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('tab_truth_chain')}
            </button>
            <button
              onClick={() => setActiveTab('triad')}
              className={`px-3 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
                activeTab === 'triad'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('tab_triad')}
            </button>
            <button
              onClick={() => setActiveTab('twin_levels')}
              className={`px-3 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
                activeTab === 'twin_levels'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('tab_twin_maturity')}
            </button>
            <button
              onClick={() => setActiveTab('benchmark')}
              className={`px-3 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
                activeTab === 'benchmark'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('tab_benchmark')}
            </button>
          </div>
        </div>

        {/* Tab 1: Vibration Physics & ISO 10816-3 */}
        {activeTab === 'science_vibration' && (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
                <p>
                  {t('iso_calc_sub')}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30">
                    <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>{t('iso_zone_a')}:</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      {t('iso_zone_a_desc')}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-500/30">
                    <div className="flex items-center gap-2 font-bold text-sky-700 dark:text-sky-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                      <span>{t('iso_zone_b')}:</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      {t('iso_zone_b_desc')}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-500/30">
                    <div className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span>{t('iso_zone_c')}:</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      {t('iso_zone_c_desc')}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-500/30">
                    <div className="flex items-center gap-2 font-bold text-rose-700 dark:text-rose-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span>{t('iso_zone_d')}:</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      {t('iso_zone_d_desc')}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                    <Waves size={15} className="text-sky-500" />
                    <span>{t('didban_spectral_harmonics')}</span>
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {t('spectral_desc')}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-center pt-1">
                    <div className="p-2 rounded-xl bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800">
                      <div className="font-bold text-sky-600 dark:text-sky-400">BPFO</div>
                      <div className="text-slate-500">{t('bpfo_label')}</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800">
                      <div className="font-bold text-cyan-600 dark:text-cyan-400">BPFI</div>
                      <div className="text-slate-500">{t('bpfi_label')}</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800">
                      <div className="font-bold text-purple-600 dark:text-purple-400">BSF</div>
                      <div className="text-slate-500">{t('bsf_label')}</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800">
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">FTF</div>
                      <div className="text-slate-500">{t('ftf_label')}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vibration Zone Interactive Simulator Preview */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Gauge size={20} className="text-sky-500" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {t('iso_calc_title')}
                    </h3>
                  </div>

                  <div className="space-y-2 text-xs">
                    <label className="block text-slate-600 dark:text-slate-400">{t('iso_power_kw')}:</label>
                    <div className="grid grid-cols-2 gap-2 font-mono">
                      <button
                        onClick={() => setSelectedIsoPowerKw(150)}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          selectedIsoPowerKw === 150
                            ? 'bg-sky-600 text-white border-sky-500'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800'
                        }`}
                      >
                        15 - 300 kW
                      </button>
                      <button
                        onClick={() => setSelectedIsoPowerKw(350)}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          selectedIsoPowerKw === 350
                            ? 'bg-sky-600 text-white border-sky-500'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800'
                        }`}
                      >
                        &gt; 300 kW
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <label className="block text-slate-600 dark:text-slate-400">{t('iso_foundation')}:</label>
                    <div className="grid grid-cols-2 gap-2 font-mono">
                      <button
                        onClick={() => setSelectedIsoFoundation('rigid')}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          selectedIsoFoundation === 'rigid'
                            ? 'bg-sky-600 text-white border-sky-500'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800'
                        }`}
                      >
                        {t('iso_rigid')}
                      </button>
                      <button
                        onClick={() => setSelectedIsoFoundation('flexible')}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          selectedIsoFoundation === 'flexible'
                            ? 'bg-sky-600 text-white border-sky-500'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800'
                        }`}
                      >
                        {t('iso_flexible')}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Zone A:</span>
                      <span className="text-emerald-500 font-bold">&lt; 2.3 mm/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Zone B:</span>
                      <span className="text-sky-500 font-bold">2.3 - 4.5 mm/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Zone C:</span>
                      <span className="text-amber-500 font-bold">4.5 - 7.1 mm/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Zone D:</span>
                      <span className="text-rose-500 font-bold">&gt; 7.1 mm/s</span>
                    </div>
                  </div>
                </div>

                <a
                  href="#/vibration"
                  className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-sky-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                >
                  <Waves size={15} />
                  <span>{t('tab_vibration_iso')}</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Cryptographic Truth Chain */}
        {activeTab === 'truth_chain' && (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
              <p>
                {t('truth_chain_desc')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {evidenceSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 shadow-md"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-2xl font-black font-mono ${step.color}`}>{step.num}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
                        {step.tag}
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug">{step.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-sky-600 dark:text-sky-400 font-bold">
                    <span>{t('truth_blocks')}</span>
                    <Fingerprint size={14} className="text-emerald-500" />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-emerald-500 shrink-0" />
                <span className="text-slate-700 dark:text-slate-300">
                  {t('truth_chain_desc')}
                </span>
              </div>
              <a
                href="#/truth-block"
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold whitespace-nowrap transition-colors"
              >
                {t('nav_truth_block')}
              </a>
            </div>
          </div>
        )}

        {/* Tab 3: Decision Triad */}
        {activeTab === 'triad' && (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Didban */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-teal-500/40 space-y-4 shadow-md flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                    <Eye size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">{t('didban_title')}</h3>
                    <div className="text-xs text-teal-600 dark:text-teal-400 font-bold font-mono mt-0.5">{t('didban_role')}</div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                    {t('didban_desc')}
                  </p>
                </div>
                <a
                  href="#/didban"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline pt-2 border-t border-slate-200 dark:border-slate-800"
                >
                  <span>{t('nav_didban')}</span>
                  {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                </a>
              </div>

              {/* Pasdar */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-rose-500/40 space-y-4 shadow-md flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <ShieldAlert size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">{t('pasdar_title')}</h3>
                    <div className="text-xs text-rose-600 dark:text-rose-400 font-bold font-mono mt-0.5">{t('pasdar_role')}</div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                    {t('pasdar_desc')}
                  </p>
                </div>
                <a
                  href="#/pasdar"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline pt-2 border-t border-slate-200 dark:border-slate-800"
                >
                  <span>{t('nav_pasdar')}</span>
                  {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                </a>
              </div>

              {/* Nazmgar */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-sky-500/40 space-y-4 shadow-md flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                    <Scale size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">{t('nazmgar_title')}</h3>
                    <div className="text-xs text-sky-600 dark:text-sky-400 font-bold font-mono mt-0.5">{t('nazmgar_role')}</div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                    {t('nazmgar_desc')}
                  </p>
                </div>
                <a
                  href="#/nazmgar"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline pt-2 border-t border-slate-200 dark:border-slate-800"
                >
                  <span>{t('nav_nazmgar')}</span>
                  {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Digital Twin 4 Levels */}
        {activeTab === 'twin_levels' && (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-700 dark:text-sky-300">
                  Level 1
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t('level1_title')}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t('level1_desc')}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-700 dark:text-teal-300">
                  Level 2
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t('level2_title')}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t('level2_desc')}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-700 dark:text-purple-300">
                  Level 3
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t('level3_title')}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t('level3_desc')}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-300">
                  Level 4
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t('level4_title')}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t('level4_desc')}
                </p>
              </div>
            </div>

            <div className="text-center pt-2">
              <a
                href="#/twin"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-sky-600/30 transition-all"
              >
                <Boxes size={16} />
                <span>{t('hero_cta_twin')}</span>
              </a>
            </div>
          </div>
        )}

        {/* Tab 5: Benchmark Matrix */}
        {activeTab === 'benchmark' && (
          <div className="space-y-4 animate-in fade-in-50 duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse min-w-[650px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                    <th className="p-3 font-bold">{t('benchmark_vendor')}</th>
                    <th className="p-3 font-bold">{t('benchmark_strengths')}</th>
                    <th className="p-3 font-bold">{t('benchmark_weaknesses')}</th>
                    <th className="p-3 font-bold">{t('evidence_integrity')}</th>
                    <th className="p-3 font-bold">{t('benchmark_cloud_dep')}</th>
                    <th className="p-3 font-bold">{t('benchmark_sanction_risk')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                  {benchmarkData.map((b, idx) => {
                    const isVista = b.vendor.includes('Vista');
                    return (
                      <tr
                        key={idx}
                        className={`transition-colors ${
                          isVista
                            ? 'bg-sky-50 dark:bg-sky-950/40 font-semibold text-slate-900 dark:text-white'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <td className="p-4 whitespace-nowrap">
                          <div className="font-bold text-slate-900 dark:text-white">{b.faVendor}</div>
                          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">{b.platform}</div>
                        </td>
                        <td className="p-4 max-w-xs">{b.strengths}</td>
                        <td className="p-4 max-w-xs text-slate-500 dark:text-slate-400">{b.weaknesses}</td>
                        <td className="p-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              (b.truthChainSupport || '').includes('کامل') || (b.truthChainSupport || '').includes('Complete')
                                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                                : (b.truthChainSupport || '').includes('ناقص') || (b.truthChainSupport || '').includes('Partial')
                                ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                                : 'bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30'
                            }`}
                          >
                            {b.truthChainSupport}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap font-mono">{b.cloudDependence}</td>
                        <td className="p-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              isVista
                                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                                : 'bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30'
                            }`}
                          >
                            {b.iranSanctionRisk}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Live Fleet Preview Grid */}
      <section className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {t('didban_asset_list')} ({assets.length})
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('didban_live_telemetry')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#/maintenance"
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>{t('nav_maintenance')}</span>
              {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {assets.map((asset) => (
            <div
              key={asset.id}
              onClick={() => {
                setSelectedAssetId(asset.id);
                window.location.hash = '#/twin';
              }}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 transition-all flex flex-col justify-between group cursor-pointer select-none shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{asset.id}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      asset.healthScore > 80
                        ? 'bg-emerald-400'
                        : asset.healthScore > 60
                        ? 'bg-amber-400'
                        : 'bg-rose-400'
                    }`}
                  />
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white mt-1 group-hover:text-sky-500 truncate">
                  {asset.faName || asset.name}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-500 dark:text-slate-400">{asset.telemetry.vibrationRms.toFixed(1)} mm/s</span>
                <span className="font-bold text-sky-600 dark:text-sky-400">{asset.healthScore}٪</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership & Project Governance */}
      <section className="p-8 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 mb-1">
              <Building2 size={15} />
              <span>{t('leadership_sub')}</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {t('leadership_heading')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t('reg_number')} • پارک علم و فناوری دانشگاه
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono">
              ثبت صنعتی: ۱۴۰۵ / ۲۰۲۶
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Project Manager Card */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-sky-500/40 flex items-start gap-4 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80"
              alt={t('pm_name')}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-sky-500/40 shrink-0"
            />
            <div className="space-y-1">
              <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/30 font-mono">
                {t('pm_title')}
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">{t('pm_name')}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('pm_desc')}
              </p>
            </div>
          </div>

          {/* CEO Card */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 flex items-start gap-4 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
              alt={t('ceo_name')}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-400 dark:ring-slate-700 shrink-0"
            />
            <div className="space-y-1">
              <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-mono">
                {t('ceo_title')}
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">{t('ceo_name')}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('ceo_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* QR Scanner Field Modal */}
      <AssetQrScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
      />
    </div>
  );
};

export default LandingPage;

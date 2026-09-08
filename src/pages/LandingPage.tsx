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
  Scale
} from 'lucide-react';
import { TechGiantBenchmark } from '../types';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const { assets, t, language, theme, isAuthenticated } = useApp();
  const [selectedNode, setSelectedNode] = useState<string>('truth_block');
  const [activeTab, setActiveTab] = useState<'overview' | 'triad' | 'benchmark' | 'standards'>('overview');

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

  const evidenceSteps = [
    {
      num: '۰۱',
      title: t('step1_title'),
      desc: t('step1_desc'),
      tag: 'Purdue Layer 0',
      color: 'border-sky-500 text-sky-400',
    },
    {
      num: '۰۲',
      title: t('step2_title'),
      desc: t('step2_desc'),
      tag: 'IEEE 1588 PTP',
      color: 'border-cyan-500 text-cyan-400',
    },
    {
      num: '۰۳',
      title: t('step3_title'),
      desc: t('step3_desc'),
      tag: 'SHA-256 Immutable',
      color: 'border-emerald-500 text-emerald-400',
    },
    {
      num: '۰۴',
      title: t('step4_title'),
      desc: t('step4_desc'),
      tag: 'Three.js & ISO 10816',
      color: 'border-purple-500 text-purple-400',
    },
    {
      num: '۰۵',
      title: t('step5_title'),
      desc: t('step5_desc'),
      tag: 'Autonomous CMMS',
      color: 'border-rose-500 text-rose-400',
    },
  ];

  const primaryTargetUrl = isAuthenticated ? '#/didban' : '#/login';

  return (
    <div className="space-y-16 pb-16 max-w-7xl mx-auto">
      {/* Top Stylish Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 lg:p-14 shadow-2xl transition-colors">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 text-xs font-bold tracking-wide">
            <Award size={15} />
            <span>{t('hero_badge')}</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
            {t('hero_title_1')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600 dark:from-sky-400 dark:via-cyan-300 dark:to-teal-300">
              {t('hero_title_2')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            {t('hero_desc')}
          </p>

          {/* Primary Call to Actions */}
          <div className="flex flex-wrap items-center gap-3.5 pt-3">
            <a
              href={primaryTargetUrl}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-extrabold text-sm shadow-xl shadow-sky-600/30 transition-all flex items-center gap-2 group"
            >
              <Lock size={16} />
              <span>{isAuthenticated ? t('nav_dashboard') : t('hero_cta_login')}</span>
              <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            </a>

            <a
              href={isAuthenticated ? '#/twin' : '#/login'}
              className="px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-sm border border-slate-300 dark:border-slate-700 transition-all flex items-center gap-2 shadow-sm"
            >
              <Boxes size={18} className="text-sky-500" />
              <span>{t('hero_cta_twin')}</span>
            </a>

            <a
              href={isAuthenticated ? '#/didban' : '#/login'}
              className="px-5 py-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm border border-slate-200 dark:border-slate-800 transition-all flex items-center gap-2"
            >
              <Eye size={18} className="text-teal-500" />
              <span>{t('hero_cta_explore')}</span>
            </a>
          </div>

          {/* Live Industrial Metrics Proof Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800/80">
            <div className="bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800/80">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('stat_compliance')}</div>
              <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">۹۹.۹۸٪</div>
              <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">SHA-256 & PTP ISO 55001</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800/80">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('stat_latency')}</div>
              <div className="text-2xl font-black font-mono text-sky-600 dark:text-sky-400 mt-1">±۶.۸ ms</div>
              <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">IEEE 1588 PTP Hardware</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800/80">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('stat_assets')}</div>
              <div className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400 mt-1">Level 1 - 4</div>
              <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">CAD Model to Autonomous PdM</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800/80">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('stat_sanctions')}</div>
              <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">۰٪</div>
              <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">100% Sovereign On-Premise</div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Fleet Preview Grid */}
      <section className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {t('stat_assets')} ({assets.length} واحد)
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              تله‌متری زنده و ارتعاشات RMS ثبت‌شده در گره‌های لبه با گواهی کالیبراسیون فعال
            </p>
          </div>

          <a
            href={primaryTargetUrl}
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{t('hero_cta_login')}</span>
            <ChevronLeft size={14} />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {assets.map((asset) => (
            <a
              key={asset.id}
              href={primaryTargetUrl}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 transition-all flex flex-col justify-between group block select-none shadow-sm"
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
            </a>
          ))}
        </div>
      </section>

      {/* 5-Step Evidence Chain */}
      <section className="space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono">
            <ShieldCheck size={14} />
            <span>ISO 55001 & IEC 62443 Compliance</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('evidence_heading')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {t('evidence_sub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {evidenceSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 relative overflow-hidden shadow-lg transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-black font-mono ${step.color}`}>{step.num}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {step.tag}
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug">{step.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-sky-600 dark:text-sky-400 font-bold">
                <span>تأیید گواهی کالیبراسیون</span>
                <CheckCircle size={14} className="text-emerald-500" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Decision Triad Showcase */}
      <section className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-8 shadow-xl transition-colors">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400 text-xs font-bold">
            <Scale size={15} />
            <span>The Vista Decision Triad Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {t('triad_heading')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {t('triad_sub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Didban */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-teal-500/40 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Eye size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">{t('didban_title')}</h3>
                <div className="text-xs text-teal-600 dark:text-teal-400 font-bold font-mono mt-0.5">{t('didban_role')}</div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('didban_desc')}
              </p>
            </div>
            <a
              href={primaryTargetUrl}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline pt-2 border-t border-slate-200 dark:border-slate-800"
            >
              <span>مشاهده در پلتفرم</span>
              <ChevronLeft size={14} />
            </a>
          </div>

          {/* Pasdar */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-rose-500/40 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <ShieldAlert size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">{t('pasdar_title')}</h3>
                <div className="text-xs text-rose-600 dark:text-rose-400 font-bold font-mono mt-0.5">{t('pasdar_role')}</div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('pasdar_desc')}
              </p>
            </div>
            <a
              href={primaryTargetUrl}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline pt-2 border-t border-slate-200 dark:border-slate-800"
            >
              <span>مشاهده در پلتفرم</span>
              <ChevronLeft size={14} />
            </a>
          </div>

          {/* Nazmgar */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-sky-500/40 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <Scale size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">{t('nazmgar_title')}</h3>
                <div className="text-xs text-sky-600 dark:text-sky-400 font-bold font-mono mt-0.5">{t('nazmgar_role')}</div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('nazmgar_desc')}
              </p>
            </div>
            <a
              href={primaryTargetUrl}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline pt-2 border-t border-slate-200 dark:border-slate-800"
            >
              <span>مشاهده در پلتفرم</span>
              <ChevronLeft size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* Global Tech Giants Benchmark Table */}
      <section className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 mb-1">
              <Zap size={14} />
              <span>ارزیابی تطبیقی و استقلال فناوری</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              مقایسه پلتفرم ویستا با غول‌های فناوری صنعتی جهان
            </h2>
          </div>
          <div className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl">
            ISO 55001 / IEC 62443 Matrix
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="p-3 font-bold">فروشنده و پلتفرم</th>
                <th className="p-3 font-bold">نقاط قوت مهندسی</th>
                <th className="p-3 font-bold">چالش‌ها و قفل مشتری</th>
                <th className="p-3 font-bold">اثبات زنجیره حقیقت</th>
                <th className="p-3 font-bold">وابستگی به ابر خارجی</th>
                <th className="p-3 font-bold">ریسک تحریم در ایران</th>
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

      {/* Bottom CTA Banner: Direct Jump to Login */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-sky-50 via-white to-cyan-50 dark:from-sky-950/60 dark:via-slate-900 dark:to-cyan-950/60 border border-sky-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden transition-colors">
        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {language === 'en'
              ? 'Ready to Access the Industrial Truth & Digital Twin Platform?'
              : language === 'ar'
              ? 'هل أنت مستعد لدخول منصة الحقيقة الصناعية والتوأم الرقمي؟'
              : language === 'tr'
              ? 'Endüstriyel Gerçeklik ve Dijital İkiz Platformuna Girmeye Hazır mısınız?'
              : 'آماده ورود به پلتفرم حقیقت صنعتی و دوقلوی دیجیتال هستید؟'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {language === 'en'
              ? 'To experience differentiated role access (Project Manager, Reliability Engineer, Control Room Operator, and ISO Auditor), proceed to authentication.'
              : language === 'ar'
              ? 'لتجربة الصلاحيات المؤسسية المنفصلة (مدير المشروع، مهندس الموثوقية، مشغل غرفة التحكم، ومفتش الآيزو)، يرجى تسجيل الدخول.'
              : language === 'tr'
              ? 'Farklılaştırılmış kurumsal rolleri (Proje Müdürü, Güvenilirlik Mühendisi, Kontrol Odası Teknisyeni, ISO Denetçisi) deneyimlemek için giriş yapın.'
              : 'جهت تجربه دسترسی‌های تفکیک‌شده (مدیر پروژه، قابلیت اطمینان، اپراتور اتاق کنترل و ممیز استاندارد)، از طریق صفحه ورود وارد داشبورد شوید.'}
          </p>
          <div className="pt-2">
            <a
              href="#/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-black text-sm shadow-xl shadow-sky-600/40 transition-all group"
            >
              <Lock size={16} />
              <span>{t('hero_cta_login')}</span>
              <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

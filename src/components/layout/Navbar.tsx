import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ShieldCheck,
  Zap,
  Activity,
  UserCheck,
  ChevronDown,
  Menu,
  X,
  AlertTriangle,
  Cpu,
  Sun,
  Moon,
  Globe,
  Lock,
  Boxes,
  Eye,
  LogOut,
  FileText,
  Network,
  BookOpen,
  QrCode,
  ShieldAlert,
  Scale,
  GitFork,
  Waves,
  Sliders,
  Home,
  FileSpreadsheet,
  Gauge,
  Wrench,
  Search,
  Sparkles
} from 'lucide-react';
import { useApp, USER_PROFILES } from '../../context/AppContext';
import { PRESET_SCENARIOS } from '../../services/syntheticData';
import { SUPPORTED_LANGUAGES } from '../../i18n/translations';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { CommandPalette } from '../search/CommandPalette';
import { AssetQrScannerModal } from '../scanner/AssetQrScannerModal';

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isFullPageView?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ sidebarOpen, setSidebarOpen, isFullPageView }) => {
  const {
    activeScenario,
    setScenario,
    isSimRunning,
    toggleSimulation,
    simSpeed,
    setSimSpeed,
    resetSimulation,
    currentUser,
    setCurrentUser,
    theme,
    toggleTheme,
    language,
    setLanguage,
    t,
    isAuthenticated,
    logout
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [scenarioDropdownOpen, setScenarioDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#/');

  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const scenarioDropdownRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close any open dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(target)) {
        setMoreDropdownOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(target)) {
        setLangDropdownOpen(false);
      }
      if (scenarioDropdownRef.current && !scenarioDropdownRef.current.contains(target)) {
        setScenarioDropdownOpen(false);
      }
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(target)) {
        setRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation & Route changes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setRoleDropdownOpen(false);
        setScenarioDropdownOpen(false);
        setLangDropdownOpen(false);
        setMoreDropdownOpen(false);
      }
    };
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
      setMoreDropdownOpen(false);
      setRoleDropdownOpen(false);
      setScenarioDropdownOpen(false);
      setLangDropdownOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  // Core primary navigation links (clean, concise labels for the desktop navbar)
  const primaryNavLinks = [
    { href: '#/twin', label: 'دوقلوی ۳D', icon: Activity },
    { href: '#/didban', label: 'دیدبان', icon: Eye },
    { href: '#/pasdar', label: 'پاسدار', icon: ShieldAlert },
    { href: '#/nazmgar', label: 'نظم‌گر', icon: Scale },
    { href: '#/hafeze', label: 'ویستا-حافظه', icon: GitFork },
  ];

  // Secondary links placed inside "More" dropdown on desktop
  const moreNavLinks = [
    { href: '#/architecture', label: 'معماری ۱۱ لایه و مقایسه غول‌ها', icon: Network, desc: 'بررسی زیمنس، جنرال الکتریک، ABB و اشنایدر' },
    { href: '#/truth-block', label: 'کاوشگر بلوک حقیقت و زنجیره هش', icon: ShieldCheck, desc: 'مهرهای زمانی IEEE 1588 و SHA-256' },
    { href: '#/proposals-contracts', label: 'تفاهم‌نامه‌ها و قراردادهای رسمی', icon: FileSpreadsheet, desc: 'شماره ثبت ۵۸۳۳۰۲ و توافق‌نامه استقرار On-Premise' },
    { href: '#/vibration', label: 'تحلیلگر تخصصی طیف ارتعاشات و FFT', icon: Waves, desc: 'پاکت فرکانسی و تحلیل خرابی بیرینگ بر اساس ISO 10816' },
    { href: '#/what-if', label: 'شبیه‌ساز سناریوهای فیزیکی چه-اگر', icon: Sliders, desc: 'تزریق خرابی و ارزیابی ریسک مونت‌کارلو' },
    { href: '#/guide', label: 'راهنمای متدولوژی و استانداردهای صنعتی', icon: BookOpen, desc: 'استانداردهای ISO 10816-3، API 670 و IEC 62443' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-40 h-16 w-full bg-slate-900/95 dark:bg-slate-950/95 light:bg-white/95 backdrop-blur border-b border-slate-800 dark:border-slate-800 light:border-slate-200 text-slate-100 dark:text-slate-100 light:text-slate-900 transition-colors">
      <div className="w-full max-w-[1920px] mx-auto h-full px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* =========================================
            LEFT AREA: BRAND IDENTITY & SIDEBAR TOGGLE
            ========================================= */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Sidebar Toggle for Dashboard View (xl:flex) */}
          {!isFullPageView && (
            <button
              id="desktop-sidebar-toggle-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 hover:bg-slate-700 text-slate-300 dark:text-slate-300 light:text-slate-700 hidden xl:flex items-center justify-center focus:outline-none transition-colors border border-slate-700/50"
              title="تغییر وضعیت نوار کناری"
              aria-label="تغییر وضعیت نوار کناری"
            >
              <Menu size={18} />
            </button>
          )}

          {/* Brand Logo & Name */}
          <a href="#/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-sky-500 to-cyan-400 flex items-center justify-center shadow-md shadow-sky-500/20 text-white font-bold group-hover:scale-105 transition-transform shrink-0">
              <Cpu size={20} className="text-white sm:w-[22px] sm:h-[22px]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm sm:text-base tracking-tight text-white dark:text-white light:text-slate-900 whitespace-nowrap">
                  ویستا
                </span>
                <span className="hidden sm:inline text-xs font-semibold text-sky-400 dark:text-sky-400 light:text-sky-600 whitespace-nowrap">
                  • حقیقت صنعتی
                </span>
                <span className="hidden md:inline-block text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 dark:text-sky-400 light:text-sky-700 border border-sky-500/30 shrink-0">
                  v4.0
                </span>
              </div>
              <span className="hidden 2xl:block text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-500 leading-none">
                {t('brand_sub')}
              </span>
            </div>
          </a>
        </div>

        {/* ====================================================
            CENTER AREA: PRIMARY DESKTOP NAV OR SIMULATION TOOLS
            ==================================================== */}
        <div className="hidden xl:flex items-center justify-center flex-1 min-w-0 px-2">
          {isFullPageView ? (
            /* Desktop Landing Navigation Bar (Strictly fits without wrapping) */
            <nav className="flex items-center gap-1 bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-100/90 p-1 rounded-2xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200">
              {primaryNavLinks.map((link) => {
                const Icon = link.icon;
                const isActive = currentHash === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold ${
                      isActive
                        ? 'bg-sky-500/20 text-sky-400 dark:text-sky-400 light:text-sky-600 font-bold border border-sky-500/40 shadow-sm'
                        : 'text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-slate-800/70 dark:hover:bg-slate-800/70 light:hover:bg-slate-200/80'
                    }`}
                  >
                    <Icon size={14} className={isActive ? 'text-sky-400' : 'text-slate-400'} />
                    <span>{link.label}</span>
                  </a>
                );
              })}

              {/* "More" dropdown for secondary views */}
              <div className="relative" ref={moreDropdownRef}>
                <button
                  id="navbar-more-dropdown-btn"
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 text-xs font-semibold ${
                    moreDropdownOpen
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <span>سایر بخش‌ها</span>
                  <ChevronDown size={13} className={`text-slate-400 transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {moreDropdownOpen && (
                  <div className="absolute rtl:left-0 ltr:right-0 mt-2 w-72 bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                    <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 dark:border-slate-800 light:border-slate-200 mb-1">
                      کاوش و اسناد تخصصی ویستا
                    </div>
                    <div className="space-y-1">
                      {moreNavLinks.map((item) => {
                        const Icon = item.icon;
                        const isCurrent = currentHash === item.href;
                        return (
                          <a
                            key={item.href}
                            href={item.href}
                            onClick={() => setMoreDropdownOpen(false)}
                            className={`flex items-start gap-2.5 p-2 rounded-xl text-xs transition-colors ${
                              isCurrent
                                ? 'bg-sky-500/15 text-sky-400 font-bold'
                                : 'text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-slate-800/70 dark:hover:bg-slate-800/70 light:hover:bg-slate-100'
                            }`}
                          >
                            <Icon size={16} className="text-sky-400 shrink-0 mt-0.5" />
                            <div className="min-w-0">
                              <div className="font-semibold leading-tight">{item.label}</div>
                              <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{item.desc}</div>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </nav>
          ) : (
            /* Simulation Toolbar in Dashboard View */
            <div className="hidden lg:flex items-center gap-2 bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-100 p-1.5 rounded-xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 shadow-inner">
              {/* Scenario selector */}
              <div className="relative" ref={scenarioDropdownRef}>
                <button
                  id="scenario-selector-dropdown-btn"
                  onClick={() => setScenarioDropdownOpen(!scenarioDropdownOpen)}
                  className="flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg bg-slate-800/90 dark:bg-slate-800/90 light:bg-white text-slate-200 dark:text-slate-200 light:text-slate-800 border border-slate-700/60 dark:border-slate-700/60 light:border-slate-300 transition-colors"
                >
                  <AlertTriangle size={14} className={activeScenario ? 'text-amber-400 animate-pulse' : 'text-slate-400'} />
                  <span className="max-w-[120px] truncate font-medium">
                    {activeScenario ? activeScenario.titleFa : t('sim_scenario')}
                  </span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {scenarioDropdownOpen && (
                  <div className="absolute rtl:left-0 ltr:right-0 mt-1.5 w-72 bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-xl shadow-2xl py-1.5 z-50 text-start">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 border-b border-slate-800 dark:border-slate-800 light:border-slate-200">
                      سناریوهای تزریق خرابی ارتعاشی و الکتریکی
                    </div>
                    <button
                      onClick={() => {
                        setScenario(null);
                        setScenarioDropdownOpen(false);
                      }}
                      className="w-full text-start px-3 py-2 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-slate-800/80 flex items-center justify-between"
                    >
                      <span>وضعیت عادی کارخانه (Baseline)</span>
                      {!activeScenario && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
                    </button>
                    {PRESET_SCENARIOS.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setScenario(s.id || null);
                          setScenarioDropdownOpen(false);
                        }}
                        className="w-full text-start px-3 py-2 text-xs text-slate-200 dark:text-slate-200 light:text-slate-800 hover:bg-slate-800/80 flex flex-col gap-0.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sky-400">{s.titleFa}</span>
                          {activeScenario?.id === s.id && <span className="w-2 h-2 rounded-full bg-amber-400"></span>}
                        </div>
                        <span className="text-[10px] text-slate-400 line-clamp-1">{s.titleEn}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-4 w-[1px] bg-slate-800 dark:bg-slate-800 light:bg-slate-300" />

              {/* Simulation controls */}
              <div className="flex items-center gap-1">
                <button
                  id="sim-play-pause-btn"
                  onClick={toggleSimulation}
                  className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                    isSimRunning
                      ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                  }`}
                  title={isSimRunning ? t('sim_paused') : t('sim_running')}
                >
                  {isSimRunning ? <Pause size={14} /> : <Play size={14} />}
                  <span className="hidden 2xl:inline">{isSimRunning ? t('sim_running') : t('sim_paused')}</span>
                </button>

                <div className="flex items-center bg-slate-900 dark:bg-slate-900 light:bg-white rounded-lg p-0.5 border border-slate-800 dark:border-slate-800 light:border-slate-200 text-[11px] font-mono">
                  {[1, 2, 5].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setSimSpeed(speed)}
                      className={`px-1.5 py-0.5 rounded transition-colors ${
                        simSpeed === speed ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>

                <button
                  id="sim-reset-btn"
                  onClick={resetSimulation}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title={t('sim_reset')}
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ====================================================
            RIGHT AREA: SEARCH, NOTIFS, UTILITIES & AUTH / MENU
            ==================================================== */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Global Search Bar / Command Palette Trigger */}
          <CommandPalette />

          {/* Notifications Bell */}
          <NotificationCenter />

          {/* Theme Toggle (hidden on mobile < sm; accessible in drawer) */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 hover:bg-slate-700 text-slate-300 dark:text-slate-300 light:text-slate-700 border border-slate-700/60 dark:border-slate-700/60 light:border-slate-200 transition-colors hidden sm:flex items-center justify-center"
            title={theme === 'dark' ? t('theme_light') : t('theme_dark')}
            aria-label="تغییر تم"
          >
            {theme === 'dark' ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-sky-600" />}
          </button>

          {/* Language Switcher (hidden on mobile < sm; accessible in drawer) */}
          <div className="relative hidden sm:block" ref={langDropdownRef}>
            <button
              id="language-switcher-btn"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 hover:bg-slate-700 text-slate-300 dark:text-slate-300 light:text-slate-700 border border-slate-700/60 dark:border-slate-700/60 light:border-slate-200 text-xs font-semibold transition-colors"
              title={t('lang_select')}
              aria-label="انتخاب زبان"
            >
              <Globe size={13} className="text-sky-400 shrink-0" />
              <span>{currentLang.flag}</span>
              <span className="text-[11px] font-medium hidden md:inline">{currentLang.code.toUpperCase()}</span>
              <ChevronDown size={12} className="text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div
                id="language-dropdown-menu"
                className="absolute rtl:left-0 ltr:right-0 mt-2 w-44 bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-2xl shadow-2xl py-1.5 z-50 overflow-hidden"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 dark:border-slate-800 light:border-slate-200 mb-1">
                  {t('lang_select')}
                </div>
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                      language === l.code
                        ? 'bg-sky-500/20 text-sky-400 font-bold'
                        : 'text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{l.flag}</span>
                      <div className="text-start">
                        <div className="font-semibold leading-none">{l.nativeName}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{l.name}</div>
                      </div>
                    </div>
                    {language === l.code && <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-sm shadow-sky-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* QR Scanner Tool (hidden on < lg) */}
          <button
            id="navbar-qr-scanner-btn"
            onClick={() => setScannerOpen(true)}
            className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 transition-colors hidden lg:flex items-center justify-center"
            title="اسکنر QR کد تجهیزات فیزیکی"
            aria-label="اسکنر QR"
          >
            <QrCode size={15} />
          </button>

          {/* Primary Login / Dashboard Button (hidden on < sm; fully prominent in drawer) */}
          {isFullPageView ? (
            <a
              id="navbar-auth-action-btn"
              href={isAuthenticated ? '#/didban' : '#/login'}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-[0.98] text-white font-bold text-xs shadow-sm shadow-sky-500/20 border border-sky-400/30 transition-all whitespace-nowrap"
            >
              <Lock size={13} className="text-sky-200" />
              <span>{isAuthenticated ? t('nav_dashboard') : t('hero_cta_login')}</span>
            </a>
          ) : (
            /* User Role Profile in Dashboard View */
            <div className="relative" ref={roleDropdownRef}>
              <button
                id="user-role-menu-btn"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 hover:bg-slate-700 border border-slate-700/60 dark:border-slate-700/60 light:border-slate-200 transition-all text-start"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-sky-500/40 shrink-0"
                />
                <div className="hidden 2xl:block text-start">
                  <div className="text-xs font-bold text-slate-200 dark:text-slate-200 light:text-slate-800 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-sky-400 dark:text-sky-400 light:text-sky-600 font-medium leading-none truncate max-w-[120px]">
                    {currentUser.roleTitleFa}
                  </div>
                </div>
                <ChevronDown size={13} className="text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute rtl:left-0 ltr:right-0 mt-2 w-72 bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-2xl shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 text-xs font-semibold text-slate-400 border-b border-slate-800 dark:border-slate-800 light:border-slate-200 mb-1 flex items-center justify-between">
                    <span>تغییر نقش کاربری سازمانی</span>
                    <UserCheck size={14} className="text-sky-400" />
                  </div>
                  <div className="space-y-1">
                    {USER_PROFILES.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          setCurrentUser(u);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full text-start p-2 rounded-xl text-xs flex items-center gap-2.5 transition-colors ${
                          currentUser.id === u.id
                            ? 'bg-sky-500/15 text-white dark:text-white light:text-slate-900 border border-sky-500/30'
                            : 'text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-slate-800/70'
                        }`}
                      >
                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-slate-100 dark:text-slate-100 light:text-slate-800 flex items-center justify-between">
                            <span>{u.name}</span>
                            {currentUser.id === u.id && <span className="text-[10px] text-sky-400 font-mono">فعال</span>}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">{u.roleTitleFa}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-800 dark:border-slate-800 light:border-slate-200 px-2 flex items-center justify-between">
                    <a
                      href="#/login"
                      onClick={() => setRoleDropdownOpen(false)}
                      className="text-[11px] text-sky-400 hover:underline flex items-center gap-1 py-1"
                    >
                      <span>مدیریت نشست</span>
                      <ShieldCheck size={12} />
                    </a>
                    <button
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        logout();
                      }}
                      className="text-[11px] text-rose-400 hover:underline flex items-center gap-1 py-1"
                    >
                      <LogOut size={12} />
                      <span>{t('auth_logout')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Universal Hamburger Menu Button (Directly toggles the unified Sidebar across all mobile/tablet screens) */}
          <button
            id="navbar-hamburger-sidebar-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 hover:bg-slate-700 text-slate-200 dark:text-slate-200 light:text-slate-800 border border-slate-700/60 dark:border-slate-700/60 light:border-slate-200 xl:hidden flex items-center justify-center transition-colors focus:outline-none"
            title="منوی ناوبری و سایدبار"
            aria-label="باز کردن سایدبار"
          >
            <Menu size={18} className="text-sky-400" />
          </button>
        </div>
      </div>

      {/* Field Asset QR & Barcode Scanner Modal */}
      <AssetQrScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
      />
    </header>
  );
};

export default Navbar;


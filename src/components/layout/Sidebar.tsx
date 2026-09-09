import React, { useEffect, useState } from 'react';
import {
  Home,
  Eye,
  Activity,
  ShieldAlert,
  Scale,
  BookOpen,
  Waves,
  Sliders,
  ShieldCheck,
  FileSpreadsheet,
  FileText,
  X,
  Lock,
  GitFork,
  Network,
  LogOut,
  Gauge,
  Wrench,
  QrCode,
  GitCompare,
  DownloadCloud,
  Crosshair,
  Cpu,
  Sun,
  Moon,
  Search,
  Check,
  ChevronDown,
  UserCheck,
  KeyRound,
  LogIn,
  ArrowRight,
  ChevronLeft
} from 'lucide-react';
import { useApp, USER_PROFILES } from '../../context/AppContext';
import { UserProfile } from '../../types';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../../i18n/translations';
import { AssetQrScannerModal } from '../scanner/AssetQrScannerModal';
import { CommandPalette } from '../search/CommandPalette';

export interface SidebarProps {
  currentRoute: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isFullPageView?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  sidebarOpen,
  setSidebarOpen,
  isFullPageView = false,
}) => {
  const {
    currentUser,
    truthBlocks,
    login,
    logout,
    t,
    theme,
    toggleTheme,
    language,
    setLanguage,
    isAuthenticated,
  } = useApp();

  const isLandingRoute =
    currentRoute === '#/' ||
    currentRoute === '' ||
    currentRoute === '#/landing' ||
    currentRoute === '#/login';

  const [searchOpen, setSearchOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [loginTab, setLoginTab] = useState<'personas' | 'credentials'>('personas');
  const [credUsername, setCredUsername] = useState('a.shafiee@vistapower.ir');
  const [credPassword, setCredPassword] = useState('••••••••••••');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSelectPersona = (u: UserProfile) => {
    setIsLoggingIn(true);
    setTimeout(() => {
      login(u);
      setSidebarOpen(false);
      setIsLoggingIn(false);
      window.location.hash = '#/didban';
    }, 200);
  };

  const handleCredentialsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    const matched =
      USER_PROFILES.find(
        (u) => u.email && u.email.toLowerCase() === credUsername.trim().toLowerCase()
      ) || USER_PROFILES[0];
    setTimeout(() => {
      login(matched);
      setSidebarOpen(false);
      setIsLoggingIn(false);
      window.location.hash = '#/didban';
    }, 200);
  };

  const PERSONA_BADGES: Record<string, { label: string; color: string; desc: string }> = {
    'user-shafiee': {
      label: 'مدیر ارشد پروژه',
      color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      desc: 'دسترسی کلان به تمام ماژول‌ها و ممیزی حقیقت',
    },
    'user-bakhshi': {
      label: 'مدیرعامل ویستا',
      color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      desc: 'تصمیم‌گیری استراتژیک بار و تفاهم‌نامه‌ها',
    },
    'user-kavyani': {
      label: 'پایش ارتعاشات PdM',
      color: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      desc: 'تحلیل FFT، زوال بیرینگ و پیش‌بینی خرابی',
    },
    'user-rostami': {
      label: 'اپراتور اسکادا',
      color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      desc: 'دیده‌بانی برخط اسکادا و تأیید هشدارهای اضطراری',
    },
    'user-mahdavi': {
      label: 'ممیز حقیقت داده',
      color: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      desc: 'راستی‌آزمایی هش SHA-256 و ایزو ۵۵۰۰۰',
    },
  };

  const landingNavLinks = [
    { href: '#/', label: 'صفحه اصلی و دموها', icon: Home, badge: 'ویستا' },
    { href: '#/architecture', label: 'معماری ۱۱ لایه و مقایسه غول‌ها', icon: Network, badge: 'Siemens vs GE' },
    { href: '#/proposals-contracts', label: 'تفاهم‌نامه‌ها و قراردادهای رسمی', icon: FileSpreadsheet, badge: 'رسمی' },
    { href: '#/guide', label: 'راهنمای استانداردها و متدولوژی', icon: BookOpen, badge: 'ISO 10816' },
  ];

  // Close sidebar when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen, setSidebarOpen]);

  // Lock body scroll on mobile when sidebar drawer is open
  useEffect(() => {
    if (sidebarOpen && typeof window !== 'undefined' && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const navCategories = [
    {
      name: 'معرفی و پایه‌ها',
      items: [
        { href: '#/', label: t('nav_home'), icon: Home },
        { href: '#/architecture', label: t('nav_architecture'), icon: Network },
        { href: '#/twin', label: t('nav_twin'), icon: Activity, badge: '۴ سطح بلوغ' },
      ],
    },
    {
      name: 'سه‌گانه تصمیم‌گیری و بافتار',
      items: [
        { href: '#/didban', label: t('nav_didban'), icon: Eye },
        { href: '#/pasdar', label: t('nav_pasdar'), icon: ShieldAlert, badge: 'HSE' },
        { href: '#/nazmgar', label: t('nav_nazmgar'), icon: Scale },
        { href: '#/hafeze', label: t('nav_hafeze'), icon: GitFork },
      ],
    },
    {
      name: 'تحلیل تخصصی و پایش بلادرنگ',
      items: [
        { href: '#/realtime', label: 'داشبورد بلادرنگ سنسورها', icon: Gauge, badge: 'Recharts' },
        { href: '#/maintenance', label: 'لاگ سلامت و زوال قطعات', icon: Wrench, badge: 'AI PdM' },
        { href: '#/vibration', label: t('nav_vibration'), icon: Waves },
        { href: '#/what-if', label: t('nav_what_if'), icon: Sliders },
        { href: '#/truth-block', label: t('nav_truth_block'), icon: ShieldCheck, badge: `${truthBlocks.length}` },
      ],
    },
    {
      name: 'اسناد فنی و ابزارهای هوشمند',
      items: [
        { href: '#/schematic-overlay', label: 'اورلی تعاملی نقشه‌ها و قطعات', icon: Crosshair, badge: 'Overlay' },
        { href: '#/knowledge-graph', label: 'گراف دانش اسناد و قطعات', icon: GitFork, badge: 'D3.js' },
        { href: '#/doc-comparison', label: 'مقایسه‌گر ویرایش‌های اسناد', icon: GitCompare, badge: 'Diff' },
        { href: '#/offline-docs', label: 'اسناد آفلاین میدانی (PWA)', icon: DownloadCloud, badge: 'PWA' },
        { href: '#/annotations', label: 'یادداشت‌های نقشه P&ID', icon: FileText, badge: 'همکارانه' },
        { href: '#/proposals-contracts', label: t('nav_contracts'), icon: FileSpreadsheet, badge: 'مهر رسمی' },
        { href: '#/guide', label: t('nav_guide'), icon: BookOpen },
        { href: '#/login', label: t('nav_login'), icon: Lock },
      ],
    },
  ];

  // In full page view (landing/login) on desktop (xl+), the sidebar should never render on desktop
  // But on mobile/tablet/laptop (< xl), it should always be available whenever sidebarOpen is true!
  const desktopVisibilityClass = isFullPageView ? 'xl:hidden' : 'xl:flex';

  return (
    <>
      {/* Mobile Dark Backdrop */}
      {sidebarOpen && (
        <div
          id="mobile-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 xl:hidden transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        id="app-main-sidebar"
        className={`fixed xl:sticky top-0 xl:top-16 right-0 h-full xl:h-[calc(100vh-4rem)] w-80 sm:w-84 xl:w-72 bg-slate-950/98 dark:bg-slate-950/98 light:bg-white/98 backdrop-blur-2xl border-l border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 z-50 xl:z-30 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 ${desktopVisibilityClass} ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'
        }`}
      >
        {/* Top Header - Visible on Mobile/Tablet */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 xl:hidden shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold shadow-md ${
                isLandingRoute
                  ? 'bg-gradient-to-tr from-sky-600 via-indigo-600 to-cyan-500 shadow-sky-500/20'
                  : 'bg-gradient-to-tr from-sky-600 to-cyan-400 shadow-sky-500/20'
              }`}
            >
              {isLandingRoute ? <Lock size={19} /> : <Cpu size={20} />}
            </div>
            <div>
              <div className="text-xs font-black text-white dark:text-white light:text-slate-900 leading-tight">
                {isLandingRoute ? 'گزینه‌های ورود به سامانه' : 'ویستا • حقیقت صنعتی'}
              </div>
              <div className="text-[10px] font-mono text-sky-400 dark:text-sky-400 light:text-sky-600 font-bold">
                {isLandingRoute ? 'احراز هویت و دسترسی سازمانی' : 'نسخه ملی ۴.۰'}
              </div>
            </div>
          </div>

          <button
            id="mobile-sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-xl bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 hover:bg-slate-700 text-slate-300 dark:text-slate-300 light:text-slate-700 transition-colors focus:outline-none"
            aria-label="بستن منو"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mobile Quick Action Tools Strip (Search, Theme, Language, QR) */}
        <div className="p-3 border-b border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 xl:hidden space-y-2 shrink-0 bg-slate-900/40 dark:bg-slate-900/40 light:bg-slate-50/50">
          {/* Quick Search Button (Only in dashboard view) */}
          {!isLandingRoute && (
            <button
              id="mobile-sidebar-search-btn"
              onClick={() => {
                setSearchOpen(true);
                setSidebarOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 text-slate-400 hover:text-slate-200 border border-slate-700/60 dark:border-slate-700/60 light:border-slate-200 text-xs transition-colors"
            >
              <div className="flex items-center gap-2">
                <Search size={14} className="text-sky-400" />
                <span>جستجوی تجهیزات و اسناد...</span>
              </div>
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-700/60 text-slate-300">
                Ctrl+K
              </kbd>
            </button>
          )}

          {/* Quick Controls: Theme, Language, QR Scanner */}
          <div className="flex items-center gap-2 pt-0.5">
            {/* Theme Toggle */}
            <button
              id="mobile-sidebar-theme-btn"
              onClick={toggleTheme}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 hover:bg-slate-700 text-slate-300 dark:text-slate-300 light:text-slate-700 text-xs font-medium border border-slate-700/60 dark:border-slate-700/60 light:border-slate-200 transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={14} className="text-amber-400" />
                  <span>حالت روز</span>
                </>
              ) : (
                <>
                  <Moon size={14} className="text-sky-500" />
                  <span>حالت شب</span>
                </>
              )}
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative flex-1">
              <button
                id="mobile-sidebar-lang-btn"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 hover:bg-slate-700 text-slate-300 dark:text-slate-300 light:text-slate-700 text-xs font-medium border border-slate-700/60 dark:border-slate-700/60 light:border-slate-200 transition-colors"
              >
                <span>{SUPPORTED_LANGUAGES.find((l) => l.code === language)?.flag || '🇮🇷'}</span>
                <span>{SUPPORTED_LANGUAGES.find((l) => l.code === language)?.name || 'فارسی'}</span>
                <ChevronDown size={12} className="text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-xl shadow-2xl p-1 z-50 space-y-1">
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code as SupportedLanguage);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                        language === l.code
                          ? 'bg-sky-600 text-white font-bold'
                          : 'text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span>{l.flag}</span>
                        <span>{l.name}</span>
                      </span>
                      {language === l.code && <Check size={12} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* QR Scanner */}
            <button
              id="mobile-sidebar-qr-btn"
              onClick={() => {
                setScannerOpen(true);
                setSidebarOpen(false);
              }}
              className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 transition-colors flex items-center justify-center shrink-0"
              title="اسکنر QR کد تجهیزات"
            >
              <QrCode size={15} />
            </button>
          </div>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="p-3.5 space-y-4 overflow-y-auto flex-1">
          {isLandingRoute ? (
            /* =========================================================
               LANDING PAGE MOBILE DRAWER: DEDICATED LOGIN OPTIONS
               ========================================================= */
            <div className="space-y-4">
              {/* Active Session Card if user is already authenticated */}
              {isAuthenticated ? (
                <div className="bg-gradient-to-br from-slate-900 via-sky-950/40 to-slate-900 dark:from-slate-900 dark:via-sky-950/40 dark:to-slate-900 light:bg-sky-50/80 border border-sky-500/30 rounded-2xl p-3.5 space-y-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-400 dark:text-sky-400 light:text-sky-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>نشست شما در سامانه فعال است</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-11 h-11 rounded-xl object-cover ring-2 ring-sky-500/50 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-black text-white dark:text-white light:text-slate-900 truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-[11px] text-sky-400 dark:text-sky-400 light:text-sky-700 font-semibold truncate">
                        {currentUser.roleTitleFa}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-500 font-mono truncate">
                        {currentUser.email}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        setSidebarOpen(false);
                        window.location.hash = '#/didban';
                      }}
                      className="py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/30 transition-all"
                    >
                      <Eye size={14} />
                      <span>ورود به داشبورد</span>
                    </button>
                    <button
                      onClick={() => {
                        logout();
                      }}
                      className="py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 dark:text-rose-400 light:text-rose-600 border border-rose-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <LogOut size={13} />
                      <span>{t('auth_logout')}</span>
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Login Method Tabs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <div className="text-xs font-black text-white dark:text-white light:text-slate-900 flex items-center gap-1.5">
                    <Lock size={14} className="text-sky-400" />
                    <span>گزینه‌های ورود به سامانه</span>
                  </div>
                  <span className="text-[10px] text-sky-400 font-mono bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
                    ۵ نقش تخصصی
                  </span>
                </div>

                <div className="flex p-1 rounded-xl bg-slate-900 dark:bg-slate-900 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-200 gap-1 text-xs">
                  <button
                    onClick={() => setLoginTab('personas')}
                    className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                      loginTab === 'personas'
                        ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <UserCheck size={13} />
                    <span>ورود سریع با نقش‌ها</span>
                  </button>
                  <button
                    onClick={() => setLoginTab('credentials')}
                    className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                      loginTab === 'credentials'
                        ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <KeyRound size={13} />
                    <span>کلمه عبور (SSO)</span>
                  </button>
                </div>
              </div>

              {/* Persona Mode */}
              {loginTab === 'personas' ? (
                <div className="space-y-2">
                  <div className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600 px-1">
                    روی هر یک از نقش‌های زیر کلیک کنید تا بی‌درنگ وارد داشبورد شوید:
                  </div>

                  <div className="space-y-2">
                    {USER_PROFILES.map((u, idx) => {
                      const personaId = u.id || `persona-${idx}`;
                      const isCurrent = Boolean(
                        isAuthenticated && currentUser?.id && u.id && currentUser.id === u.id
                      );
                      const badgeInfo = (u.id ? PERSONA_BADGES[u.id] : undefined) || {
                        label: 'کاربر صنعتی',
                        color: 'bg-slate-800 text-slate-300 border-slate-700',
                        desc: u.roleTitleFa || '',
                      };

                      return (
                        <div
                          key={personaId}
                          className={`p-3 rounded-2xl border transition-all relative ${
                            isCurrent
                              ? 'bg-sky-950/60 dark:bg-sky-950/60 light:bg-sky-50 border-sky-500 shadow-md ring-1 ring-sky-500/50'
                              : 'bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-100/90 border-slate-800 dark:border-slate-800 light:border-slate-200 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-11 h-11 rounded-xl object-cover ring-1 ring-sky-500/40 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <div className="text-xs font-black text-white dark:text-white light:text-slate-900 truncate">
                                  {u.name}
                                </div>
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${badgeInfo.color}`}
                                >
                                  {badgeInfo.label}
                                </span>
                              </div>
                              <div className="text-[10px] text-sky-400 dark:text-sky-400 light:text-sky-700 font-semibold truncate mt-0.5">
                                {u.roleTitleFa}
                              </div>
                              <div className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-500 leading-tight line-clamp-1 mt-1">
                                {badgeInfo.desc}
                              </div>
                            </div>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-slate-800/80 dark:border-slate-800/80 light:border-slate-200/80 flex items-center justify-between">
                            <div className="text-[10px] font-mono text-slate-400 dark:text-slate-400 light:text-slate-500 truncate max-w-[140px]">
                              {u.email}
                            </div>
                            <button
                              onClick={() => handleSelectPersona(u)}
                              disabled={isLoggingIn}
                              className={`py-1.5 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
                                isCurrent
                                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                  : 'bg-sky-600 hover:bg-sky-500 active:scale-[0.97] text-white shadow-sky-600/30'
                              }`}
                            >
                              {isCurrent ? (
                                <>
                                  <Check size={12} strokeWidth={3} />
                                  <span>کاربر فعال</span>
                                </>
                              ) : (
                                <>
                                  <LogIn size={12} />
                                  <span>ورود با این نقش</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Credentials Form */
                <form
                  onSubmit={handleCredentialsLogin}
                  className="bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-100/90 border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-2xl p-3.5 space-y-3"
                >
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 dark:text-slate-300 light:text-slate-700 mb-1">
                      پست الکترونیکی سازمانی:
                    </label>
                    <input
                      type="text"
                      value={credUsername}
                      onChange={(e) => setCredUsername(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 dark:bg-slate-950 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-300 text-xs font-mono text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 dark:text-slate-300 light:text-slate-700 mb-1">
                      کلمه عبور اکتیو دایرکتوری (SSO):
                    </label>
                    <input
                      type="password"
                      value={credPassword}
                      onChange={(e) => setCredPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 dark:bg-slate-950 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-300 text-xs font-mono text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>پروتکل امنیتی:</span>
                    <span className="text-emerald-400 font-mono font-bold">IEC 62443 / PTP</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/30 transition-all"
                  >
                    <LogIn size={14} />
                    <span>ورود امن به داشبورد صنعتی</span>
                  </button>
                </form>
              )}

              {/* Dedicated Official Login Page Button */}
              <a
                href="#/login"
                onClick={() => setSidebarOpen(false)}
                className="w-full p-2.5 rounded-xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 hover:bg-slate-800 text-slate-300 dark:text-slate-300 light:text-slate-700 border border-slate-800 dark:border-slate-800 light:border-slate-200 text-xs font-bold flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-emerald-400" />
                  <span>صفحه جامع ورود و اعتبارسنجی لبه</span>
                </div>
                <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform text-slate-400" />
              </a>

              {/* Landing Page Public Links */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80 dark:border-slate-800/80 light:border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-400 light:text-slate-500 font-mono px-1">
                  پیوندهای عمومی لندینگ پیج:
                </div>
                <div className="space-y-1">
                  {landingNavLinks.map((link, idx) => {
                    const Icon = link.icon;
                    const isActive = currentRoute === link.href || (link.href === '#/' && (currentRoute === '' || currentRoute === '#/landing'));
                    return (
                      <a
                        key={idx}
                        href={link.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-sky-600/15 text-sky-400 dark:text-sky-400 light:text-sky-600 font-bold border border-sky-500/30'
                            : 'text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-slate-800/60 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon size={15} className={isActive ? 'text-sky-400' : 'text-slate-400'} />
                          <span>{link.label}</span>
                        </div>
                        {link.badge && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 dark:bg-slate-800 light:bg-slate-200 text-slate-400 dark:text-slate-400 light:text-slate-600">
                            {link.badge}
                          </span>
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* =========================================================
               OPERATIONAL DASHBOARD SIDEBAR (WHEN ON DASHBOARD VIEWS)
               ========================================================= */
            <>
              {/* User Profile Card OR Login Prompt */}
              {isAuthenticated ? (
                <div className="bg-slate-900/90 dark:bg-slate-900/90 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-200 p-3 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-9 h-9 rounded-xl object-cover ring-1 ring-sky-500/40 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white dark:text-white light:text-slate-900 truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-[10px] text-sky-400 dark:text-sky-400 light:text-sky-700 font-medium truncate">
                        {currentUser.roleTitleFa}
                      </div>
                    </div>
                  </div>

                  <a
                    href="#/login"
                    onClick={() => setSidebarOpen(false)}
                    title="تغییر نقش کاربری"
                    className="text-[10px] text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 bg-slate-800 dark:bg-slate-800 light:bg-white hover:bg-slate-700 px-2 py-1 rounded-lg border border-slate-700 dark:border-slate-700 light:border-slate-200 transition-colors shrink-0"
                  >
                    تغییر
                  </a>
                </div>
              ) : (
                <a
                  href="#/login"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center justify-center gap-2 w-full p-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/30 transition-all border border-sky-400/30"
                >
                  <Lock size={14} className="text-sky-200" />
                  <span>{t('hero_cta_login')}</span>
                </a>
              )}

              {/* Navigation Groups */}
              {navCategories.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-400 dark:text-slate-400 light:text-slate-500 font-mono px-2 tracking-wider">
                    {cat.name}
                  </div>
                  <div className="space-y-1">
                    {cat.items.map((item, iIdx) => {
                      const Icon = item.icon;
                      const isActive =
                        item.href === '#/'
                          ? currentRoute === '#/' || currentRoute === ''
                          : currentRoute.startsWith(item.href);

                      return (
                        <a
                          key={iIdx}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                            isActive
                              ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-600/30'
                              : 'text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-slate-900/80 dark:hover:bg-slate-900/80 light:hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <Icon
                              size={16}
                              className={`shrink-0 transition-colors ${
                                isActive ? 'text-white' : 'text-slate-400 group-hover:text-sky-400'
                              }`}
                            />
                            <span className="truncate">{item.label}</span>
                          </div>

                          {item.badge && (
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md shrink-0 mr-1 ${
                                isActive
                                  ? 'bg-sky-700 text-white'
                                  : 'bg-slate-800 dark:bg-slate-800 light:bg-slate-200 text-slate-400 dark:text-slate-400 light:text-slate-700 group-hover:text-slate-300'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </a>
                      );
                    })}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Bottom Status & Actions */}
        <div className="p-3 border-t border-slate-800 dark:border-slate-800 light:border-slate-200 bg-slate-950 dark:bg-slate-950 light:bg-slate-50 text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-600 space-y-2 shrink-0">
          <div className="flex items-center justify-between">
            <span>گره پردازش لبه ویستا:</span>
            <span className="text-emerald-400 dark:text-emerald-400 light:text-emerald-600 font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Edge-B Local
            </span>
          </div>

          {isLandingRoute ? (
            <div className="flex items-center gap-2">
              <a
                href="#/login"
                onClick={() => setSidebarOpen(false)}
                className="flex-1 py-1.5 px-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors text-center shadow-sm"
              >
                <Lock size={12} />
                <span>صفحه جامع لاگین</span>
              </a>
              <button
                onClick={() => setSidebarOpen(false)}
                className="py-1.5 px-3 rounded-xl bg-slate-800 dark:bg-slate-800 light:bg-slate-200 hover:bg-slate-700 text-slate-300 dark:text-slate-300 light:text-slate-700 font-bold text-xs transition-colors"
              >
                بستن
              </button>
            </div>
          ) : isAuthenticated ? (
            <button
              onClick={() => {
                setSidebarOpen(false);
                logout();
              }}
              className="w-full py-1.5 px-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 dark:text-rose-400 light:text-rose-600 border border-rose-500/20 font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut size={13} />
              <span>{t('auth_logout')}</span>
            </button>
          ) : (
            <a
              href="#/guide"
              onClick={() => setSidebarOpen(false)}
              className="w-full py-1.5 px-2.5 rounded-xl bg-slate-800 dark:bg-slate-800 light:bg-slate-200 hover:bg-slate-700 text-slate-300 dark:text-slate-300 light:text-slate-700 font-bold flex items-center justify-center gap-1.5 transition-colors text-center"
            >
              <BookOpen size={13} />
              <span>راهنمای جامع سامانه</span>
            </a>
          )}
        </div>
      </aside>

      {/* Global Modals triggered from Mobile Sidebar */}
      <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} showTrigger={false} />
      <AssetQrScannerModal isOpen={scannerOpen} onClose={() => setScannerOpen(false)} />
    </>
  );
};

export default Sidebar;

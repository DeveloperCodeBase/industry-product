import React, { useState } from 'react';
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
  ArrowRight,
  Boxes,
  Eye,
  LogOut,
  FileText,
  Network,
  BookOpen,
  QrCode
} from 'lucide-react';
import { useApp, USER_PROFILES } from '../../context/AppContext';
import { PRESET_SCENARIOS } from '../../services/syntheticData';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../../i18n/translations';
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
  const [scannerOpen, setScannerOpen] = useState(false);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 dark:bg-slate-950/95 light:bg-white/95 backdrop-blur border-b border-slate-800 dark:border-slate-800 light:border-slate-200 text-slate-100 dark:text-slate-100 light:text-slate-900 transition-colors">
      <div className="px-4 py-2.5 flex items-center justify-between gap-2 lg:gap-4 max-w-7xl mx-auto w-full">
        {/* Right Section (in RTL) / Left (in LTR): Menu toggle & Brand */}
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle only visible on dashboard view */}
          {!isFullPageView && (
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl bg-slate-800 dark:bg-slate-800 light:bg-slate-100 hover:bg-slate-700 text-slate-300 dark:text-slate-300 light:text-slate-700 lg:hidden focus:outline-none"
              aria-label="منوی ناوبری"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}

          <a href="#/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-sky-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white font-bold group-hover:scale-105 transition-transform shrink-0">
              <Cpu size={22} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base tracking-tight text-white dark:text-white light:text-slate-900">
                  {t('brand_title')}
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 dark:text-sky-400 light:text-sky-700 border border-sky-500/30">
                  {t('version_badge')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-500 leading-none mt-0.5">
                {t('brand_sub')}
              </p>
            </div>
          </a>
        </div>

        {/* Center Section: On Landing show clean informational links; on Dashboard show Simulation controls */}
        {isFullPageView ? (
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-bold text-slate-300 dark:text-slate-300 light:text-slate-700">
            <a
              href="#/"
              className="px-3 py-1.5 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-100 transition-colors"
            >
              <span>{t('nav_home')}</span>
            </a>
            <a
              href="#/architecture"
              className="px-3 py-1.5 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-100 transition-colors flex items-center gap-1"
            >
              <Network size={14} className="text-sky-400" />
              <span>{t('nav_architecture')}</span>
            </a>
            <a
              href="#/proposals-contracts"
              className="px-3 py-1.5 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-100 transition-colors flex items-center gap-1"
            >
              <FileText size={14} className="text-teal-400" />
              <span>{t('nav_contracts')}</span>
            </a>
            <a
              href="#/guide"
              className="px-3 py-1.5 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-100 transition-colors flex items-center gap-1"
            >
              <BookOpen size={14} className="text-indigo-400" />
              <span>{t('nav_guide')}</span>
            </a>
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-2 lg:gap-3 bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-100 p-1.5 rounded-xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 shadow-inner">
            {/* Scenario selector */}
            <div className="relative">
              <button
                id="scenario-selector-dropdown-btn"
                onClick={() => setScenarioDropdownOpen(!scenarioDropdownOpen)}
                className="flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg bg-slate-800/90 dark:bg-slate-800/90 light:bg-white text-slate-200 dark:text-slate-200 light:text-slate-800 border border-slate-700/60 dark:border-slate-700/60 light:border-slate-300 transition-colors"
              >
                <AlertTriangle size={14} className={activeScenario ? 'text-amber-400 animate-pulse' : 'text-slate-400'} />
                <span className="max-w-[140px] truncate font-medium">
                  {activeScenario ? activeScenario.titleFa : t('sim_scenario')}
                </span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {scenarioDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-72 bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-xl shadow-2xl py-1.5 z-50 text-right">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 border-b border-slate-800 dark:border-slate-800 light:border-slate-200">
                    سناریوهای تزریق خرابی ارتعاشی و الکتریکی
                  </div>
                  <button
                    onClick={() => {
                      setScenario(null);
                      setScenarioDropdownOpen(false);
                    }}
                    className="w-full text-right px-3 py-2 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-slate-800/80 flex items-center justify-between"
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
                      className="w-full text-right px-3 py-2 text-xs text-slate-200 dark:text-slate-200 light:text-slate-800 hover:bg-slate-800/80 flex flex-col gap-0.5"
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
                <span className="hidden xl:inline">{isSimRunning ? t('sim_running') : t('sim_paused')}</span>
              </button>

              {/* Speed buttons */}
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

        {/* Actions Section: Command Palette, Notifications, Theme, Language, User/Auth */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Global Search Bar / Command Palette Trigger */}
          <CommandPalette />

          {/* Field Machine QR Code Scanner Button */}
          <button
            id="navbar-qr-scanner-btn"
            onClick={() => setScannerOpen(true)}
            className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 transition-colors"
            title="اسکنر بارکد و QR کد تجهیزات میدانی"
            aria-label="اسکنر بارکد تجهیزات"
          >
            <QrCode size={16} />
          </button>

          {/* Notification Center (System alerts, maintenance schedules, security updates) */}
          <NotificationCenter />

          {/* Light/Dark Mode Toggle with Smooth Transition */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 hover:bg-slate-700 text-slate-300 dark:text-slate-300 light:text-slate-700 border border-slate-700/60 dark:border-slate-700/60 light:border-slate-200 transition-colors"
            title={theme === 'dark' ? t('theme_light') : t('theme_dark')}
            aria-label="تغییر تم روشنایی و تاریکی"
          >
            {theme === 'dark' ? (
              <Sun size={16} className="text-amber-400" />
            ) : (
              <Moon size={16} className="text-sky-600" />
            )}
          </button>

          {/* Multi-language Selector Toggle Dropdown (Persian, English, Arabic, Turkish) */}
          <div className="relative">
            <button
              id="language-switcher-btn"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 hover:bg-slate-700 text-slate-300 dark:text-slate-300 light:text-slate-700 border border-slate-700/60 dark:border-slate-700/60 light:border-slate-200 text-xs font-semibold transition-colors"
              title={t('lang_select')}
              aria-label="انتخاب زبان سیستم"
            >
              <Globe size={14} className="text-sky-400 shrink-0" />
              <span>{currentLang.flag}</span>
              <span className="hidden sm:inline text-[11px] font-medium">{currentLang.nativeName}</span>
              <ChevronDown size={13} className="text-slate-400" />
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
                      <div className="text-right">
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

          {/* If on Landing / Unauthenticated: Show prominent "ورود به پلتفرم" button */}
          {isFullPageView ? (
            <div className="flex items-center gap-2">
              <a
                href={isAuthenticated ? '#/didban' : '#/login'}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-sky-600/30 transition-all flex items-center gap-1.5"
              >
                <Lock size={14} />
                <span>{isAuthenticated ? t('nav_dashboard') : t('hero_cta_login')}</span>
              </a>
            </div>
          ) : (
            /* User Role Selector on Dashboard */
            <div className="relative flex items-center gap-2">
              <button
                id="user-role-menu-btn"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 hover:bg-slate-700 border border-slate-700/60 dark:border-slate-700/60 light:border-slate-200 transition-all text-right"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-sky-500/40"
                />
                <div className="hidden lg:block text-right">
                  <div className="text-xs font-bold text-slate-200 dark:text-slate-200 light:text-slate-800 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-sky-400 dark:text-sky-400 light:text-sky-600 font-medium leading-none truncate max-w-[130px]">
                    {currentUser.roleTitleFa}
                  </div>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {/* Quick Logout Button */}
              <button
                onClick={logout}
                title={t('auth_logout')}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
              >
                <LogOut size={16} />
              </button>

              {roleDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-2xl shadow-2xl p-2 z-50">
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
                        className={`w-full text-right p-2 rounded-xl text-xs flex items-center gap-2.5 transition-colors ${
                          currentUser.id === u.id
                            ? 'bg-sky-500/15 text-white dark:text-white light:text-slate-900 border border-sky-500/30'
                            : 'text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-slate-800/70'
                        }`}
                      >
                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-lg object-cover" />
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
                      <span>مدیریت نشست و احراز هویت</span>
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

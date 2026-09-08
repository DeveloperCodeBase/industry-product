import React from 'react';
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
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface SidebarProps {
  currentRoute: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const { currentUser, truthBlocks, logout, t } = useApp();

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
      name: 'تحلیل تخصصی و شبیه‌سازی',
      items: [
        { href: '#/vibration', label: t('nav_vibration'), icon: Waves },
        { href: '#/what-if', label: t('nav_what_if'), icon: Sliders },
        { href: '#/truth-block', label: t('nav_truth_block'), icon: ShieldCheck, badge: `${truthBlocks.length}` },
      ],
    },
    {
      name: 'اسناد، استقرار و پرسونای کاربری',
      items: [
        { href: '#/proposals-contracts', label: t('nav_contracts'), icon: FileSpreadsheet, badge: 'مهر رسمی' },
        { href: '#/guide', label: t('nav_guide'), icon: BookOpen },
        { href: '#/login', label: t('nav_login'), icon: Lock },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={`fixed lg:sticky top-16 right-0 h-[calc(100vh-4rem)] w-72 bg-slate-950/95 dark:bg-slate-950/95 light:bg-white/95 backdrop-blur-xl border-l border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 z-40 flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation Items */}
        <div className="p-3.5 space-y-5 overflow-y-auto max-h-full">
          {/* Active User Quick Card */}
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
              title="تغییر نقش کاربری"
              className="text-[10px] text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 bg-slate-800 dark:bg-slate-800 light:bg-white hover:bg-slate-700 px-2 py-1 rounded-lg border border-slate-700 dark:border-slate-700 light:border-slate-200 transition-colors shrink-0"
            >
              تغییر
            </a>
          </div>

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
        </div>

        {/* Bottom Status & Logout */}
        <div className="p-3 border-t border-slate-800 dark:border-slate-800 light:border-slate-200 bg-slate-950 dark:bg-slate-950 light:bg-slate-50 text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-600 space-y-2 shrink-0">
          <div className="flex items-center justify-between">
            <span>گره پردازش لبه:</span>
            <span className="text-emerald-400 dark:text-emerald-400 light:text-emerald-600 font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Edge-B Local
            </span>
          </div>

          <button
            onClick={logout}
            className="w-full py-1.5 px-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 dark:text-rose-400 light:text-rose-600 border border-rose-500/20 font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <LogOut size={13} />
            <span>{t('auth_logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

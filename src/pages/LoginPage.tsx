import React, { useState } from 'react';
import {
  Lock,
  UserCheck,
  ShieldCheck,
  KeyRound,
  Fingerprint,
  ChevronLeft,
  Check
} from 'lucide-react';
import { useApp, USER_PROFILES } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const { currentUser, setCurrentUser, login, theme, t } = useApp();
  const [selectedUser, setSelectedUser] = useState(currentUser || USER_PROFILES[0]);
  const [mode, setMode] = useState<'persona' | 'credentials'>('persona');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authStepMessage, setAuthStepMessage] = useState<string>('');
  const [username, setUsername] = useState<string>('a.shafiee@vistapower.ir');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [edgeToken, setEdgeToken] = useState<string>('VISTA-EDGE-PTP-2026-9801');

  const handlePerformLogin = () => {
    setIsAuthenticating(true);
    setAuthStepMessage('در حال اعتبارسنجی گواهی امنیتی IEC 62443 و برچسب زمانی PTP...');

    setTimeout(() => {
      setAuthStepMessage('در حال اتصال به گره‌های لبه Edge-E و بازیابی بلوک‌های حقیقت...');
    }, 600);

    setTimeout(() => {
      setAuthStepMessage('احراز هویت موفقیت‌آمیز بود! در حال انتقال به داشبورد...');
    }, 1100);

    setTimeout(() => {
      setIsAuthenticating(false);
      login(selectedUser);
    }, 1600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 sm:py-8 pb-16">
      {/* Top Breadcrumb / Back Link */}
      <div className="flex items-center justify-between">
        <a
          href="#/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-sky-500 transition-colors font-semibold"
        >
          <ChevronLeft size={16} />
          <span>{t('auth_back_home')}</span>
        </a>

        <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 dark:text-emerald-400 light:text-emerald-700 bg-emerald-950/40 dark:bg-emerald-950/40 light:bg-emerald-50 px-3 py-1 rounded-full border border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{t('auth_onpremise_active')}</span>
        </div>
      </div>

      {/* Main Login Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 dark:text-sky-400 light:text-sky-700 text-xs font-bold">
          <Lock size={15} />
          <span>{t('auth_title')}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white dark:text-white light:text-slate-900 tracking-tight">
          {t('auth_headline')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-xl mx-auto leading-relaxed">
          {t('auth_sub')}
        </p>
      </div>

      {/* Authentication Container */}
      <div className="rounded-3xl bg-slate-900/90 dark:bg-slate-900/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Mode Selector Tabs */}
        <div className="flex p-1.5 rounded-2xl bg-slate-950 dark:bg-slate-950 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-200 gap-2">
          <button
            onClick={() => setMode('persona')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
              mode === 'persona'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-slate-200'
            }`}
          >
            <UserCheck size={16} />
            <span>{t('auth_switch_persona')}</span>
          </button>
          <button
            onClick={() => setMode('credentials')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
              mode === 'credentials'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-slate-200'
            }`}
          >
            <KeyRound size={16} />
            <span>{t('auth_credentials')}</span>
          </button>
        </div>

        {mode === 'persona' ? (
          /* Mode 1: Persona Selector Cards */
          <div className="space-y-4">
            <div className="text-xs font-bold text-slate-300 dark:text-slate-300 light:text-slate-700 flex items-center justify-between">
              <span>پرسونای مورد نظر خود را جهت ورود مشخص کنید:</span>
              <span className="text-slate-500 font-mono text-[11px]">۵ سطح دسترسی تفکیک‌شده</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {USER_PROFILES.map((u) => {
                const isSelected = selectedUser.id === u.id;
                const isProjectManager = u.id === 'user-shafiee';
                return (
                  <div
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className={`cursor-pointer p-4 sm:p-5 rounded-2xl border transition-all relative flex flex-col justify-between space-y-3.5 select-none ${
                      isSelected
                        ? 'bg-sky-950/70 dark:bg-sky-950/70 light:bg-sky-50 border-sky-500 shadow-xl shadow-sky-500/20 ring-1 ring-sky-500'
                        : 'bg-slate-950/70 dark:bg-slate-950/70 light:bg-slate-50/70 border-slate-800/90 dark:border-slate-800/90 light:border-slate-200 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-sky-500/40 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-black text-sm text-white dark:text-white light:text-slate-900">{u.name}</h3>
                            {isProjectManager && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 dark:text-amber-300 light:text-amber-700 border border-amber-500/30">
                                مدیر پروژه
                              </span>
                            )}
                          </div>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0 shadow">
                              <Check size={12} strokeWidth={3} />
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-sky-400 dark:text-sky-400 light:text-sky-700 font-bold mt-1 leading-snug">
                          {u.roleTitleFa}
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-500 font-mono mt-0.5 truncate">
                          {u.email}
                        </div>
                      </div>
                    </div>

                    {/* Permissions list */}
                    <div className="space-y-1.5 pt-2.5 border-t border-slate-800/80 dark:border-slate-800/80 light:border-slate-200">
                      <div className="text-[10px] font-bold text-slate-400 dark:text-slate-400 light:text-slate-600">
                        مجوزها و دسترسی‌های تخصیص‌یافته:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {u.permissions.slice(0, 3).map((perm, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[10px] bg-slate-900 dark:bg-slate-900 light:bg-white text-slate-300 dark:text-slate-300 light:text-slate-700 border border-slate-800 dark:border-slate-800 light:border-slate-300"
                          >
                            ✓ {perm}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Mode 2: Corporate Form */
          <div className="space-y-4 max-w-lg mx-auto py-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 dark:text-slate-300 light:text-slate-700 mb-1.5">
                پست الکترونیکی سازمانی یا کد پرسنلی:
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 dark:bg-slate-950 light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-300 text-white dark:text-white light:text-slate-900 text-xs font-mono focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 dark:text-slate-300 light:text-slate-700 mb-1.5">
                رمز عبور یکپارچه اکتیو دایرکتوری (SSO / LDAP):
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 dark:bg-slate-950 light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-300 text-white dark:text-white light:text-slate-900 text-xs font-mono focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 dark:text-slate-300 light:text-slate-700 mb-1.5">
                توکن سخت‌افزاری گره لبه (Edge Token PTP):
              </label>
              <input
                type="text"
                value={edgeToken}
                onChange={(e) => setEdgeToken(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 dark:bg-slate-950 light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-300 text-sky-400 dark:text-sky-400 light:text-sky-700 text-xs font-mono focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Authentication Progress Banner */}
        {isAuthenticating && (
          <div className="p-4 rounded-2xl bg-sky-950/80 dark:bg-sky-950/80 light:bg-sky-100 border border-sky-500/50 text-xs text-sky-200 dark:text-sky-200 light:text-sky-900 flex items-center gap-3 animate-pulse">
            <div className="w-5 h-5 rounded-full border-2 border-sky-400 border-t-transparent animate-spin shrink-0" />
            <div className="font-bold">{authStepMessage}</div>
          </div>
        )}

        {/* Primary Submit Button */}
        <div className="pt-2">
          <button
            onClick={handlePerformLogin}
            disabled={isAuthenticating}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white font-black text-sm sm:text-base shadow-xl shadow-sky-600/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            <Fingerprint size={20} />
            <span>
              ورود به پلتفرم صنعتی ویستا با هویت «{selectedUser.name}» و مشاهده داشبورد
            </span>
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Security Credentials Footer Notice */}
      <div className="p-5 rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-200 text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 space-y-2">
        <div className="flex items-center gap-2 text-white dark:text-white light:text-slate-900 font-bold">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span>امنیت سخت‌افزاری و ایزولاسیون شبکه OT (IEC 62443 Security Level 2):</span>
        </div>
        <p className="leading-relaxed">
          ورود به این پلتفرم در لایه صنعتی کارخانه احراز می‌گردد. توکن‌های امنیتی مبتنی بر کلیدهای رمزنگاری محلی بوده و هیچ داده‌ای بدون برچسب زمانی معتبر و هش یکپارچگی ثبت نخواهد شد. تمامی تغییرات مدیریتی مستقیماً در دفترکل ممیزی حقیقت ذخیره می‌شوند.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

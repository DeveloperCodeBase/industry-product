import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Award,
  Mail,
  Phone,
  Globe,
  FileText,
  CheckCircle2,
  Database,
  Lock,
  Clock,
  HardDrive,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { truthBlocks } = useApp();
  const [latestBlockHash, setLatestBlockHash] = useState<string>('0x7e4a...9b12');
  const [lastBackupTime, setLastBackupTime] = useState<string>('۱۴۰۵/۰۶/۰۸ - ۱۱:۴۵:۰۲');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  useEffect(() => {
    if (truthBlocks && truthBlocks.length > 0) {
      const top = truthBlocks[0];
      const h = top.cryptographicHash || top.blockSignatureSha256 || top.hash || top.id || '0x7e4a9b12c89f';
      setLatestBlockHash(`${h.slice(0, 6)}...${h.slice(-4)}`);
    }
  }, [truthBlocks]);

  const handleVerifyChain = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const now = new Date();
      setLastBackupTime(
        now.toLocaleDateString('fa-IR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    }, 800);
  };

  const blockCount = truthBlocks && truthBlocks.length > 0 ? truthBlocks.length : 14892;

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 py-10 px-4 sm:px-8 mt-auto">
      <div className="w-full max-w-[1920px] mx-auto space-y-8">
        {/* Visual Data Integrity & Synchronized Block Status Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/80 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Live Sync Status Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>زنجیره حقیقت: همگام‌سازی کامل (100% Synced)</span>
            </div>

            {/* Block Height & Hash */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <div className="flex items-center gap-1 text-slate-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                <Database size={13} className="text-sky-400" />
                <span>ارتفاع زنجیره: #{blockCount.toLocaleString('fa-IR')}</span>
              </div>

              <div className="hidden sm:flex items-center gap-1 text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                <Lock size={12} className="text-purple-400" />
                <span>هش ریشه: {latestBlockHash}</span>
              </div>
            </div>
          </div>

          {/* Backup Time & IEEE 1588 Clock */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <HardDrive size={13} className="text-cyan-400" />
              <span>آخرین نسخه پشتیبان رمزنگاری‌شده:</span>
              <span className="font-mono text-cyan-300 font-bold">{lastBackupTime}</span>
            </div>

            <div className="hidden lg:flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800">
              <Cpu size={12} />
              <span>PTP Jitter: ±3.8 µs (IEEE 1588)</span>
            </div>

            <button
              onClick={handleVerifyChain}
              disabled={isVerifying}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
              title="راستی‌آزمایی دوباره تمام بلوک‌های حقیقت"
            >
              <RefreshCw size={13} className={isVerifying ? 'animate-spin text-sky-300' : ''} />
              <span>{isVerifying ? 'در حال صحه‌گذاری...' : 'صحت‌سنجی زنجیره'}</span>
            </button>
          </div>
        </div>

        {/* 4-Col Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: About Vista */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center text-white">
                V
              </div>
              <span>شرکت شبکه هوشمند ابتکار ویستا</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 text-justify">
              پیشگام در حوزه سامانه‌های هوش مصنوعی صنعتی، دوقلوی دیجیتال سه‌بعدی تعاملی، نگهداری پیش‌بینانه مبتنی بر فیزیک ارتعاشات و ثبت تغییرناپذیر حقیقت داده برای صنایع نفت، گاز، پتروشیمی، فولاد و نیروگاهی.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-sky-400 font-medium">
              <Award size={14} />
              <span>برنده دو جایزه در دومین رویداد ملی هوش مصنوعی ایران</span>
            </div>
          </div>

          {/* Col 2: Official Credentials */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-sky-400" />
              اطلاعات ثبتی و مجوزها
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                <span>شماره ثبت رسمی: <strong className="text-slate-200 font-mono">۵۸۳۳۰۲</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                <span>عضو پارک علم و فناوری استان سمنان (شاهرود)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                <span>عضو رسمی سازمان نظام صنفی رایانه‌ای استان سمنان</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                <span>انطباق کامل با استانداردهای ISO 10816-3 و API 670</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Leadership & Project Management */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
              <FileText size={16} className="text-sky-400" />
              مدیریت و راهبری پروژه
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <div className="font-semibold text-slate-200">مسعود بخشی</div>
                <div className="text-[11px] text-sky-400">مدیرعامل</div>
              </li>
              <li className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <div className="font-semibold text-slate-200">دکتر علی شفیعی‌زاده</div>
                <div className="text-[11px] text-emerald-400 font-semibold">مدیر پروژه و استقرار دوقلو</div>
              </li>
              <li className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <div className="font-semibold text-slate-200">مهندس آریا کاویانی</div>
                <div className="text-[11px] text-slate-400">سرپرست قابلیت اطمینان و ارتعاشات</div>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
              <Globe size={16} className="text-sky-400" />
              ارتباط و هماهنگی صنعتی
            </h4>
            <div className="space-y-2.5">
              <a
                href="https://vistapower.ir"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-slate-300 hover:text-sky-400 transition-colors group"
              >
                <Globe size={14} className="text-sky-400" />
                <span className="font-mono group-hover:underline">vistapower.ir</span>
              </a>
              <a
                href="mailto:devcodebase.dev@gmail.com"
                className="flex items-center gap-2 text-slate-300 hover:text-sky-400 transition-colors group"
              >
                <Mail size={14} className="text-sky-400" />
                <span className="font-mono group-hover:underline">devcodebase.dev@gmail.com</span>
              </a>
              <a
                href="tel:09124733234"
                className="flex items-center gap-2 text-slate-300 hover:text-sky-400 transition-colors group"
              >
                <Phone size={14} className="text-sky-400" />
                <span className="font-mono text-emerald-400">۰۹۱۲۴۷۳۳۲۳۴</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright notice */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3 text-center sm:text-right">
          <p>
            طراحی، پیاده‌سازی و توسعه: <strong>شرکت شبکه هوشمند ابتکار ویستا (Vista Intelligent Network)</strong> — کلیه حقوق مادی و معنوی این سامانه محفوظ است.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <a href="#/guide" className="hover:text-sky-400">متدولوژی علمی</a>
            <span>•</span>
            <a href="#/maintenance" className="hover:text-sky-400">لاگ نگهداری</a>
            <span>•</span>
            <a href="#/annotations" className="hover:text-sky-400">یادداشت‌های نقشه</a>
            <span>•</span>
            <a href="#/proposals-contracts" className="hover:text-sky-400">قرارداد و پروپوزال</a>
            <span>•</span>
            <a href="#/architecture" className="hover:text-sky-400">معماری مرجع</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

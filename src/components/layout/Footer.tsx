import React from 'react';
import { ShieldCheck, Award, Mail, Phone, Globe, FileText, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 py-10 px-4 sm:px-8 mt-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: About Vista */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center text-white">
                V
              </div>
              <span>شرکت شبکه هوشمند ابتکار ویستا</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              شرکتی بین‌المللی در حوزه سامانههای هوش مصنوعی، دوقلوی دیجیتال صنعتی، مدلهای زبانی بزرگ، RAG و ایجنتهای هوشمند برای سازمانها و کارخانجات بزرگ کشور.
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
                <span>توسعه‌دهنده رسمی سامانه «دانشگاه هوشمند ایران»</span>
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
              <li className="bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 p-2 rounded-lg border border-slate-800 dark:border-slate-800 light:border-slate-200">
                <div className="font-semibold text-slate-200 dark:text-slate-200 light:text-slate-900">مسعود بخشی</div>
                <div className="text-[11px] text-sky-400">مدیرعامل</div>
              </li>
              <li className="bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 p-2 rounded-lg border border-slate-800 dark:border-slate-800 light:border-slate-200">
                <div className="font-semibold text-slate-200 dark:text-slate-200 light:text-slate-900">دکتر علی شفیعی‌زاده</div>
                <div className="text-[11px] text-emerald-400 font-semibold">مدیر پروژه</div>
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
            <a href="#/proposals-contracts" className="hover:text-sky-400">قرارداد و پروپوزال</a>
            <span>•</span>
            <a href="#/architecture" className="hover:text-sky-400">معماری مرجع</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

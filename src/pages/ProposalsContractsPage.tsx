import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Copy,
  CheckCircle2,
  Download,
  Building,
  ShieldCheck,
  Award,
  Lock,
  DollarSign,
  Layers,
  FileCheck,
  Sparkles
} from 'lucide-react';
import { DocumentInsightModal } from '../components/documents/DocumentInsightModal';
import { DocumentAutoTaggerModal } from '../components/documents/DocumentAutoTaggerModal';
import { GitFork, GitCompare, DownloadCloud, Tag } from 'lucide-react';

export const ProposalsContractsPage: React.FC = () => {
  const [activeDocTab, setActiveDocTab] = useState<'proposal' | 'contract' | 'mou'>('proposal');
  const [copied, setCopied] = useState(false);
  const [insightModalOpen, setInsightModalOpen] = useState(false);
  const [autoTaggerOpen, setAutoTaggerOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">مستندات واگذاری صنعتی، پروپوزال، تفاهم‌نامه و قرارداد رسمی</h1>
              <span className="text-xs text-emerald-400 font-mono">شرکت شبکه هوشمند ابتکار ویستا • شماره ثبت رسمی: ۵۸۳۳۰۲</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">
            قالب‌های مصوب و حقوقی جهت ارائه به هلدینگ‌های صنعتی، پالایشگاه‌ها، کارخانجات فولاد و معادن بزرگ کشور برای استقرار پلتفرم حقیقت و دوقلوی دیجیتال.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setAutoTaggerOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-sky-950/40"
            title="برچسب‌گذاری و استخراج خودکار کد تجهیزات، استانداردها و تگ‌ها با AI"
          >
            <Tag size={14} className="text-sky-400" />
            <span>برچسب‌گذاری هوشمند با AI (Auto-Tag)</span>
          </button>
          <button
            onClick={() => setInsightModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-purple-950/40"
            title="تحلیل هوشمند مفاد قرارداد با مدل زبانی هوش مصنوعی جمینای"
          >
            <Sparkles size={14} className="text-purple-400" />
            <span>تحلیل هوشمند مفاد با هوش مصنوعی (Gemini)</span>
          </button>
          <button
            onClick={handleCopy}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Copy size={14} />
            <span>{copied ? 'متن کپی شد!' : 'کپی کل متن سند'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-lg shadow-sky-600/30 flex items-center gap-1.5 transition-colors"
          >
            <Printer size={14} />
            <span>چاپ رسمی / ذخیره PDF</span>
          </button>
        </div>
      </div>

      {/* Quick Tools Navigation Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <a
          href="#/knowledge-graph"
          className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-sky-500/50 transition-all flex items-center gap-3 group shadow-md"
        >
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <GitFork size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
              گراف دانش اسناد و دارایی‌ها (D3.js)
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              مشاهده اتصالات قراردادها، استانداردها و تجهیزات در شبیه‌ساز نیرو
            </div>
          </div>
        </a>

        <a
          href="#/doc-comparison"
          className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-purple-500/50 transition-all flex items-center gap-3 group shadow-md"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <GitCompare size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
              مقایسه‌گر ویرایش‌های اسناد (Diff)
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              تحلیل تغییرات بندهای قراردادها و گزارش‌ها با هایلایت رنگی
            </div>
          </div>
        </a>

        <a
          href="#/offline-docs"
          className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/50 transition-all flex items-center gap-3 group shadow-md"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <DownloadCloud size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
              مرکز اسناد آفلاین میدانی (PWA)
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              دسترسی بدون اینترنت به دفترچه‌های راهنما با Service Worker
            </div>
          </div>
        </a>
      </div>

      {/* Document Selector Tabs */}
      <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveDocTab('proposal')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeDocTab === 'proposal'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCheck size={16} />
          <span>۱. پروپوزال فنی و مالی استقرار پلتفرم حقیقت صنعتی</span>
        </button>

        <button
          onClick={() => setActiveDocTab('contract')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeDocTab === 'contract'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck size={16} />
          <span>۲. قرارداد رسمی واگذاری لایسنس و خدمات مهندسی</span>
        </button>

        <button
          onClick={() => setActiveDocTab('mou')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeDocTab === 'mou'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building size={16} />
          <span>۳. تفاهم‌نامه همکاری فناورانه و تحقیق و توسعه (MoU)</span>
        </button>
      </div>

      {/* The Printable Official Document Sheet */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl text-slate-200 space-y-8 print:bg-white print:text-black print:p-0 print:border-0">
        {/* Official Letterhead */}
        <div className="border-b-2 border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center font-black text-white text-lg">
                V
              </div>
              <h2 className="text-lg font-black text-white tracking-tight">شرکت شبکه هوشمند ابتکار ویستا (سهامی خاص)</h2>
            </div>
            <p className="text-xs text-slate-400">
              شماره ثبت: ۵۸۳۳۰۲ • عضو پارک علم و فناوری سمنان (شاهرود) • نظام صنفی رایانه‌ای
            </p>
            <p className="text-[11px] text-sky-400 font-mono">
              توسعه‌دهنده رسمی پلتفرم حقیقت صنعتی و سامانه دانشگاه هوشمند ایران
            </p>
          </div>

          <div className="text-left font-mono text-xs text-slate-400 space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>شماره سند: <strong className="text-slate-200">VIN-IND-2026/09</strong></div>
            <div>تاریخ تنظیم: <strong className="text-slate-200">۱۴۰۵/۰۶/۱۷ (شهریور ۱۴۰۵)</strong></div>
            <div>سطح محرمانگی: <strong className="text-amber-400">محرمانه تجاری</strong></div>
          </div>
        </div>

        {/* Tab 1: Proposal Content */}
        {activeDocTab === 'proposal' && (
          <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-slate-300">
            <div>
              <h3 className="text-lg font-black text-white text-center pb-2 border-b border-slate-800">
                پروپوزال فنی و اجرایی استقرار پلتفرم حقیقت صنعتی ویستا، نگهداری پیش‌بینانه و دوقلوی دیجیتال
              </h3>
              <p className="text-xs text-slate-400 text-center mt-1">
                موضوع: مانیتورینگ سلامت دارایی‌های دوار، جلوگیری از توقف‌های ناخواسته خط تولید و کاهش هزینه‌های تعمیراتی
              </p>
            </div>

            <section className="space-y-2">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                ۱. مقدمه و ضرورت پروژه
              </h4>
              <p>
                در کارخانجات و مجتمع‌های بزرگ صنعتی، بروز توقفات برنامه‌ریزی‌نشده (Unplanned Downtime) هزینه‌های هنگفتی در حدود میلیاردها تومان در هر شیفت به سازمان تحمیل می‌کند. پلتفرم حقیقت صنعتی شرکت شبکه هوشمند ابتکار ویستا به عنوان راهکاری بومی، امن و منطبق بر استاندارد بین‌المللی ISO 13374 و IEC 62443، داده‌های حسگرهای میدانی را بدون وابستگی به ابر خارجی در سطح لبه (Edge) راستی‌آزمایی و با ایجاد «بلوک حقیقت» تغییرناپذیر، شبیه‌سازی دوقلوی دیجیتال را در ۴ سطح بلوغ محقق می‌سازد.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                ۲. محصولات تحویلی اکوسیستم ویستا
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li><strong>ویستا-دیدبان (Vista-Didban):</strong> رؤیت‌پذیری واقعیت مشترک کارخانه، داشبوردهای برخط کاشی سلامت دارایی‌ها و بازپخش تاریخی.</li>
                <li><strong>ویستا-پاسدار (Vista-Pasdar):</strong> پایش ریسک و ایمنی فیزیکی، نقشه ۲بعدی کارخانه و هشدار ورود مجدد تکنسین به ناحیه خطر.</li>
                <li><strong>ویستا-نظم‌گر (Vista-Nazmgar):</strong> انطباق تولید با حقیقت، محاسبه پاکت توان عملیاتی (Throughput Envelope) و شناسایی گلوگاه‌ها.</li>
                <li><strong>ویستا-حافظه (Vista-Hafeze):</strong> گراف دانش یکپارچه‌ساز حسگر با سیستم‌های ERP/CMMS و دستورالعمل‌های نگهداری SOP.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                ۳. برآورد مالی و مدل‌های واگذاری
              </h4>
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-900 border-b border-slate-800 font-bold text-slate-200">
                    <tr>
                      <th className="p-3">ردیف</th>
                      <th className="p-3">عنوان بسته خدمت</th>
                      <th className="p-3">مدت زمان اجرا</th>
                      <th className="p-3">مبلغ برآوردی (تومان)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    <tr>
                      <td className="p-3 font-mono">۱</td>
                      <td className="p-3">لایسنس دائمی پلتفرم بومی ویستا (Site License تا ۳۰ دارایی)</td>
                      <td className="p-3">تحویل آنی</td>
                      <td className="p-3 font-mono font-bold text-emerald-400">۲,۸۰۰,۰۰۰,۰۰۰</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">۲</td>
                      <td className="p-3">استقرار گره‌های لبه Edge-B، سنسورگذاری و راه‌اندازی PTP</td>
                      <td className="p-3">۳ ماه کاری</td>
                      <td className="p-3 font-mono font-bold text-emerald-400">۱,۴۵۰,۰۰۰,۰۰۰</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">۳</td>
                      <td className="p-3">یکپارچه‌سازی گراف دانش ویستا-حافظه با پایگاه داده CMMS کارفرما</td>
                      <td className="p-3">۲ ماه کاری</td>
                      <td className="p-3 font-mono font-bold text-emerald-400">۹۵۰,۰۰۰,۰۰۰</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">۴</td>
                      <td className="p-3">پشتیبانی سالانه، به‌روزرسانی مدل‌های RUL و کالیبراسیون</td>
                      <td className="p-3">۱۲ ماهه</td>
                      <td className="p-3 font-mono font-bold text-emerald-400">۶۸۰,۰۰۰,۰۰۰</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* Tab 2: Legal Contract Content */}
        {activeDocTab === 'contract' && (
          <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-slate-300">
            <h3 className="text-lg font-black text-white text-center pb-2 border-b border-slate-800">
              قرارداد واگذاری لایسنس نرم‌افزاری، پیاده‌سازی و خدمات نگهداری پلتفرم حقیقت صنعتی
            </h3>

            <div className="space-y-4">
              <section className="space-y-1">
                <h4 className="font-bold text-white text-sm">ماده ۱ — طرفین قرارداد:</h4>
                <p>
                  این قرارداد فی‌مابین <strong>شرکت شبکه هوشمند ابتکار ویستا (سهامی خاص)</strong> به شماره ثبت ۵۸۳۳۰۲ و شناسه ملی مربوطه با نمایندگی آقای <strong>مسعود بخشی</strong> (مدیرعامل) و آقای <strong>علی شفیعی‌زاده</strong> (مدیر پروژه و راهبر فنی) به عنوان «مجری/تأمین‌کننده» از یک طرف، و شرکت کارفرما از طرف دیگر منعقد گردید.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-white text-sm">ماده ۲ — موضوع قرارداد:</h4>
                <p>
                  واگذاری حق بهره‌برداری غیرانحصاری و مادام‌العمر (Permanent License) از نرم‌افزار پلتفرم حقیقت صنعتی ویستا، پیاده‌سازی ماژول‌های دیدبان، پاسدار، نظم‌گر و حافظه سازمانی، و پشتیبانی فنی و کالیبراسیون داده‌ها بر روی دارایی‌های دوار خط تولید.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-white text-sm">ماده ۳ — مالکیت معنوی و امنیت داده:</h4>
                <p>
                  کلیه حقوق مالکیت فکری سورس‌کد پایه و الگوریتم‌های هوش مصنوعی متعلق به شرکت شبکه هوشمند ابتکار ویستا است. کارفرما مالکیت ۱۰۰٪ کلیه داده‌های تولیدی، بلوک‌های حقیقت، لاگ‌های ممیزی و تله‌متری فیزیکی را دارا بوده و پلتفرم به صورت On-Premise در سرورهای محلی کارفرما بدون خروج هرگونه بیت داده به اینترنت اجرا می‌شود.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-white text-sm">ماده ۴ — تعهدات تضمین کیفیت (SLA):</h4>
                <p>
                  مجری پایداری ۹۹.۹٪ نرم‌افزار در طول ساعات بهره‌برداری، زمان پاسخ به خطاهای بحرانی ظرف کمتر از ۴ ساعت کاری، و تضمین عدم مخدوش شدن هش‌های زنجیره شواهد حقیقت را تعهد می‌نماید.
                </p>
              </section>
            </div>
          </div>
        )}

        {/* Tab 3: MoU Content */}
        {activeDocTab === 'mou' && (
          <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-slate-300">
            <h3 className="text-lg font-black text-white text-center pb-2 border-b border-slate-800">
              تفاهم‌نامه همکاری راهبردی در حوزه توسعه کاربردهای هوش مصنوعی و دوقلوی دیجیتال
            </h3>

            <div className="space-y-4">
              <section className="space-y-1">
                <h4 className="font-bold text-white text-sm">مقدمه تفاهم:</h4>
                <p>
                  با عنایت به ضرورت ارتقای بهره‌وری ملی، بومی‌سازی فناوری‌های بنیادین صنعت نسل ۴.۰ و بهره‌گیری از هوش مصنوعی مولد و دوقلوی دیجیتال در حفظ زیرساخت‌های حیاتی کشور، این تفاهم‌نامه میان شرکت شبکه هوشمند ابتکار ویستا و طرف مقابل منعقد گردید.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-white text-sm">محورهای همکاری:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>اجرای پایلوت تحقیقاتی هوش مصنوعی در پایش خرابی‌های زودرس یاتاقان‌ها و گیربکس‌ها.</li>
                  <li>توسعه مشترک مدل‌های یادگیری عمیق پیش‌بین با دانشگاه هوشمند ایران.</li>
                  <li>ارائه آموزش‌های تخصصی آنالیز ارتعاشات و استانداردهای پایش وضعیت به کارشناسان صنایع.</li>
                </ul>
              </section>
            </div>
          </div>
        )}

        {/* Official Signatures & Seal Block */}
        <div className="pt-8 border-t-2 border-slate-800 grid grid-cols-2 gap-8 text-center text-xs">
          <div className="space-y-6">
            <div className="font-bold text-slate-300">از طرف شرکت کارفرما:</div>
            <div className="h-16 flex items-center justify-center text-slate-600 font-mono text-[11px]">
              [محل امضا و مهر رسمی کارفرما]
            </div>
            <div className="font-semibold text-slate-400">نام و سمت نماینده مجاز</div>
          </div>

          <div className="space-y-6">
            <div className="font-bold text-slate-300">از طرف شرکت شبکه هوشمند ابتکار ویستا:</div>
            <div className="h-16 flex flex-col items-center justify-center text-sky-400 font-semibold text-xs">
              <span>مسعود بخشی (مدیرعامل)</span>
              <span>دکتر علی شفیعی‌زاده (مدیر پروژه)</span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5">ثبت: ۵۸۳۳۰۲</span>
            </div>
            <div className="font-semibold text-slate-400">مهر برجسته و امضای مجاز شرکت</div>
          </div>
        </div>
      </div>

      {/* AI Document Insight Modal */}
      <DocumentInsightModal
        isOpen={insightModalOpen}
        onClose={() => setInsightModalOpen(false)}
      />

      {/* AI Auto-Tagging Modal */}
      <DocumentAutoTaggerModal
        isOpen={autoTaggerOpen}
        onClose={() => setAutoTaggerOpen(false)}
      />
    </div>
  );
};

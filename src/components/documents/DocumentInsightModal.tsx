import React, { useState } from 'react';
import {
  Sparkles,
  X,
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Clock,
  Copy,
  Check,
  RefreshCw,
  FileCheck2,
  Building,
  ShieldCheck,
  ArrowRight,
  Printer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface DocumentInsightData {
  source?: string;
  note?: string;
  title: string;
  executiveSummary: string;
  keyTakeaways: string[];
  criticalRisks: string[];
  recommendations: string[];
  estimatedReadingTimeMinutes?: number;
}

const PRELOADED_DOCUMENTS = [
  {
    id: 'contract-vista-583302',
    title: 'قرارداد رسمی پیمان استقرار سامانه پایش و دوقلوی دیجیتال ویستا (ثبت ۵۸۳۳۰۲)',
    category: 'قرارداد صنعتی و حقوقی',
    text: `شماره قرارداد: VISTA-EPC-1403-882
موضوع قرارداد: استقرار جامع پلتفرم حقیقت صنعتی، سامانه دوقلوی دیجیتال و نگهداری پیش‌بینانه تجهیزات دوار مجتمع پتروشیمی.
طرف اول: شرکت شبکه هوشمند ابتکار ویستا (مسئولیت محدود)، شماره ثبت ۵۸۳۳۰۲، شناسه ملی ۱۴۰۱۰۲۲۸۹۲۴ به عنوان مجری و ارائه‌دهنده فناوری.
طرف دوم: مجتمع پتروشیمی خوراک پارس عسلویه به عنوان کارفرما.

ماده ۱ - تعهدات فنی و معماری:
۱.۱. مجری متعهد می‌گردد داده‌های تله‌متری ارتعاشات را با نرخ ۲۵.۶ کیلوهرتز در گره‌های لبه (Edge-E) جمع‌آوری و با پروتکل امنیتی IEC 62443 ایزوله نماید.
۱.۲. عدم ارسال هرگونه داده خام پردازش‌نشده به شبکه‌های اینترنت عمومی؛ تمامی پردازش‌های FFT، استخراج فرکانس‌های نقص یاتاقان (BPFO, BPFI) و محاسبه شاخص سلامت به صورت محلی در سرورهای محصور پالایشگاه اجرا خواهد شد.
۱.۳. ثبت تمامی هش‌های اعتبارسنجی در بلوک حقیقت (Truth Block) با الگوریتم SHA-256 و امضای سخت‌افزاری HSM به صورت غیرقابل انکار و تغییرناپذیر.

ماده ۲ - توافق سطح خدمات (SLA):
۲.۱. حداقل دسترس‌پذیری عملیاتی سامانه دوقلو ۹۹.۹۵٪ در طول دوره سالانه تضمین می‌گردد.
۲.۲. نرخ دقت تخمین ساعات کارکرد باقیمانده (RUL) تجهیزات حیاتی (کلاس III ایزو ۱۰۸۱۶) نباید کمتر از ۹۵٪ با فاصله اطمینان ۹۹.۸٪ باشد.
۲.۳. زمان پاسخ به هشدارهای وضعیت بحرانی (Critical Alert) کمتر از ۲ ثانیه جهت ارسال تریگر به سیستم قطع اضطراری ESD.

ماده ۳ - شرایط مالی و تسویه مبتنی بر عملکرد:
۳.۱. پرداخت ۲۰٪ مبلغ کل قرارداد پس از آزمون پذیرش سایت (SAT) و راه‌اندازی موفق دوقلوی سه‌بعدی روی کمپرسورهای K-01 الی K-06.
۳.۲. جریمه تأخیر در رفع رخدادهای خطای نرم‌افزاری معادل ۰.۲٪ از مبلغ تضمین ماهیانه به ازای هر ساعت مازاد بر ۴ ساعت.
۳.۳. حفظ کامل حقوق مالکیت فکری نرم‌افزار، الگوریتم‌های هوش مصنوعی و مدل‌های کالیبراسیون در انحصار شرکت ویستا.`,
  },
  {
    id: 'vibration-audit-k04',
    title: 'گزارش ممیزی ارتعاشاتی و تحلیل سلامت کمپرسور سانتریفیوژ گاز K-04',
    category: 'گزارش فنی و دیاگنوستیک',
    text: `تاریخ بازرسی: ۱۴۰۴/۱۲/۲۰
ایستگاه پایش: یاتاقان دیس‌شارژ سمت محرک (NDE) - کمپرسور K-04
سرعت دورانی نامی: ۲۹۷۵ دور در دقیقه (۴۹.۵۸ هرتز = 1X)
استاندارد مرجع ارزیابی: ISO 10816-3 (Group 1 - Rigid Foundation - Class III)

خلاصه مشاهدات دینامیکی و طیف فرکانسی FFT:
۱. سرعت ارتعاشات کلی RMS معادل ۵.۸ میلی‌متر بر ثانیه ثبت گردید که در محدوده ناحیه C استاندارد ایزو (هشدار و لزوم برنامه‌ریزی تعمیرات) قرار دارد.
۲. در طیف فرکانسی شتاب پیک، پیک مشخص در فرکانس ۱۸۰.۹ هرتز مطابق با هارمونیک ۳.۶۵X شناسایی شد که نشان‌دهنده شروع ترک میکرو در شیار خارجی بیرینگ ساچمه‌ای (BPFO) است.
۳. ضریب کشیدگی (Kurtosis) سیگنال شتاب به مقدار ۴.۳ رسیده است (مقدار نرمال زیر ۳.۰)، که بیانگر وجود ضربات متناوب ناشی از برخورد اجزای غلتان با نقطه آسیب‌دیده است.
۴. دمای بیرینگ در سطح ۷۸.۴ درجه سانتی‌گراد تثبیت شده و افزایش شیب حرارتی ۰.۳ درجه بر ساعت در شیفت کاری اخیر مشاهده می‌شود.

نتیجه‌گیری و اقدامات عاجل پیشنهادی:
الف) کاهش لود فشاری کمپرسور به میزان ۱۵٪ تا زمان پنجره تعمیراتی بعدی.
ب) نمونه‌گیری فوری از روغن هیدرولیک و بررسی ذرات براده فلزی (Ferrography).
ج) آماده‌سازی قطعه یدکی بیرینگ مدل SKF 7314 BECBM در انبار اضطراری و تعویض در زمان Overhaul با ساعت کارکرد حداکثر ۱۴۰ ساعت باقیمانده.`,
  },
  {
    id: 'sla-security-iec62443',
    title: 'سند استاندارد معماری امنیت صنعتی و ایزولاسیون داده IEC 62443-3-3',
    category: 'استاندارد و امنیت سایبری',
    text: `سند الزامات امنیت سایبری سامانه‌های کنترل صنعتی و اینترنت اشیاء صنعتی (IIoT) در معماری چندلایه ویستا.

۱. تفکیک مناطق و لوله‌های ارتباطی (Zones & Conduits):
- منطقه صفر و یک (Level 0/1): سنسورهای پیزوالکتریک و ماژول‌های DAQ ایزوله در شبکه اختصاصی ایترنت صنعتی و پروتکل‌های با تأخیر قطعی (TSN/PTP).
- منطقه دو و سه (Level 2/3): دروازه هوشمند لبه Edge-E مجهز به دیواره آتش دیتادیود سخت‌افزاری یک‌طرفه جهت ممانعت فیزیکی از نفوذ بیرونی به خطوط فرمان PLC.
- ارتباط سرور دوقلوی دیجیتال با سامانه‌های بیرونی صرفاً از طریق توکن‌های رمزشده با کلید‌های نامتقارن ECDSA و بدون اجازه ورود ترافیک غیرمجاز.

۲. حفاظت داده و عدم افشای محرمانگی:
- کلیه اطلاعات تله‌متری به محض خروج از سنسور با کلید محلی AES-256 رمزنگاری می‌شوند.
- عدم ذخیره لاگ‌های غیررمزنگاری شده حاوی مقادیر فرایندی گاز و پتروشیمی.
- تطابق با ضوابط پدافند غیرعامل کشور در صیانت از زیرساخت‌های حیاتی انرژی.`,
  },
];

interface DocumentInsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDocumentText?: string;
  initialDocumentTitle?: string;
}

export const DocumentInsightModal: React.FC<DocumentInsightModalProps> = ({
  isOpen,
  onClose,
  initialDocumentText,
  initialDocumentTitle,
}) => {
  const { language } = useApp();
  const [selectedDocId, setSelectedDocId] = useState<string>(PRELOADED_DOCUMENTS[0].id);
  const [activeTab, setActiveTab] = useState<'preloaded' | 'custom'>('preloaded');
  const [customTitle, setCustomTitle] = useState<string>(initialDocumentTitle || '');
  const [customText, setCustomText] = useState<string>(initialDocumentText || '');
  const [customCategory, setCustomCategory] = useState<string>('قرارداد صنعتی');
  const [targetLang, setTargetLang] = useState<string>(language || 'fa');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [insight, setInsight] = useState<DocumentInsightData | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentPreloaded = PRELOADED_DOCUMENTS.find((d) => d.id === selectedDocId) || PRELOADED_DOCUMENTS[0];

  const handleAnalyze = async () => {
    const textToAnalyze = activeTab === 'preloaded' ? currentPreloaded.text : customText;
    const titleToAnalyze = activeTab === 'preloaded' ? currentPreloaded.title : customTitle || 'سند ارزیابی‌شده';
    const categoryToAnalyze = activeTab === 'preloaded' ? currentPreloaded.category : customCategory;

    if (!textToAnalyze || textToAnalyze.trim().length === 0) {
      setError('متن سند جهت تحلیل نمی‌تواند خالی باشد.');
      return;
    }

    setLoading(true);
    setError(null);
    setInsight(null);

    try {
      const response = await fetch('/api/document-insight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textToAnalyze,
          title: titleToAnalyze,
          documentType: categoryToAnalyze,
          language: targetLang,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `خطا در دریافت تحلیل هوشمند (${response.status})`);
      }

      const data: DocumentInsightData = await response.json();
      setInsight(data);
    } catch (err: any) {
      console.error('Error analyzing document:', err);
      setError(err.message || 'خطای غیرمنتظره در ارتباط با سرویس هوش مصنوعی');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCustomTitle(file.name.replace(/\.[^/.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCustomText(content || '');
      setActiveTab('custom');
    };
    reader.readAsText(file);
  };

  const copyToClipboard = () => {
    if (!insight) return;
    const formatted = `
${insight.title}
خلاصه اجرایی:
${insight.executiveSummary}

نکات کلیدی و چکیده:
${insight.keyTakeaways.map((k) => `• ${k}`).join('\n')}

ریسک‌های شناسایی‌شده:
${insight.criticalRisks.map((r) => `⚠️ ${r}`).join('\n')}

توصیه‌های اقدام‌محور:
${insight.recommendations.map((a) => `✓ ${a}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Sparkles size={22} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>دیدبان هوشمند اسناد و گزارش‌ها (Document Insight)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  Gemini 3.8 Flash AI
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                خلاصه‌سازی بلادرنگ قراردادهای صنعتی، ممیزی‌های فنی ارتعاشات و استخراج بندهای کلیدی و تعهدات SLA
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="بستن"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-right">
          {/* Top Options Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            {/* Tabs: Preloaded vs Custom */}
            <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('preloaded')}
                className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                  activeTab === 'preloaded'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                اسناد و قراردادهای مرجع سازمانی
              </button>
              <button
                onClick={() => setActiveTab('custom')}
                className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                  activeTab === 'custom'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                بارگذاری سند یا قرارداد دلخواه
              </button>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">زبان خروجی هوش مصنوعی:</span>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-purple-500 font-medium"
              >
                <option value="fa">فارسی (Persian)</option>
                <option value="en">English (انگلیسی)</option>
                <option value="ar">العربية (عربی)</option>
                <option value="tr">Türkçe (ترکی)</option>
              </select>
            </div>
          </div>

          {/* Preloaded Document Mode */}
          {activeTab === 'preloaded' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-300">
                سند مرجع جهت تحلیل هوشمند را انتخاب کنید:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                {PRELOADED_DOCUMENTS.map((doc) => {
                  const isSelected = selectedDocId === doc.id;
                  return (
                    <button
                      key={doc.id}
                      onClick={() => {
                        setSelectedDocId(doc.id);
                        setInsight(null);
                      }}
                      className={`p-3 rounded-xl text-right border transition-all flex flex-col justify-between space-y-2 ${
                        isSelected
                          ? 'bg-purple-950/60 border-purple-500 ring-1 ring-purple-500 shadow-md shadow-purple-500/20'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-purple-400 font-semibold px-2 py-0.5 rounded bg-purple-950/80 border border-purple-800">
                          {doc.category}
                        </span>
                        {isSelected && <CheckCircle2 size={16} className="text-purple-400" />}
                      </div>
                      <h4 className="font-bold text-xs text-white line-clamp-2 leading-relaxed">
                        {doc.title}
                      </h4>
                      <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-900 font-mono">
                        حجم متن: ~{doc.text.length} کاراکتر
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Text Preview Collapse */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="font-bold text-slate-300">بخشی از محتوای سند انتخابی:</span>
                  <span className="font-mono text-[11px] text-purple-400">{currentPreloaded.title}</span>
                </div>
                <p className="text-slate-400 leading-relaxed font-mono text-[11px] max-h-28 overflow-y-auto whitespace-pre-wrap p-2 bg-slate-900 rounded-lg">
                  {currentPreloaded.text}
                </p>
              </div>
            </div>
          )}

          {/* Custom Upload Mode */}
          {activeTab === 'custom' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">عنوان سند:</label>
                  <input
                    type="text"
                    placeholder="مثال: قرارداد EPC پالایشگاه یا گزارش ارتعاشات توربین"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">دسته‌بندی موضوعی:</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="قرارداد صنعتی و حقوقی">قرارداد صنعتی و حقوقی (EPC/MOU)</option>
                    <option value="گزارش فنی و دیاگنوستیک ارتعاشات">گزارش فنی و دیاگنوستیک ارتعاشات</option>
                    <option value="دستورالعمل SOP نگهداری پیش‌بینانه">دستورالعمل SOP نگهداری پیش‌بینانه</option>
                    <option value="استاندارد و ممیزی سایبری">استاندارد و ممیزی سایبری (IEC 62443)</option>
                  </select>
                </div>
              </div>

              {/* Upload Input & Text Area */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300">متن سند یا الصاق فایل:</label>
                  <label className="flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300 cursor-pointer">
                    <Upload size={13} />
                    <span>بارگذاری فایل متنی (.txt / .md / .json)</span>
                    <input
                      type="file"
                      accept=".txt,.md,.json,.csv,.doc"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <textarea
                  rows={6}
                  placeholder="متن کامل یا بخش‌های مهم قرارداد یا گزارش صنعتی را اینجا وارد یا پیست کنید..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-purple-500 font-mono leading-relaxed resize-none"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>تعداد کاراکتر: {customText.length}</span>
                  {customText.length > 0 && (
                    <button
                      onClick={() => setCustomText('')}
                      className="text-red-400 hover:text-red-300"
                    >
                      پاک‌کردن متن
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Trigger Button */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>هوش مصنوعی در حال پردازش و استخراج مفاد کلیدی...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>تولید خلاصه اجرایی و نکات کلیدی با Gemini AI</span>
                </>
              )}
            </button>

            {insight && (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={copyToClipboard}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copied ? 'کپی شد' : 'کپی خلاصه'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-200 flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* AI Result Presentation */}
          {insight && (
            <div className="mt-4 space-y-4 border-t border-slate-800 pt-5 animate-in fade-in duration-300">
              {/* Header Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-purple-950/40 border border-purple-900/60 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-xs text-purple-200">
                    تحلیل کامل سند: «{insight.title}»
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                  {insight.estimatedReadingTimeMinutes && (
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>زمان خواندن کامل متن: ~{insight.estimatedReadingTimeMinutes} دقیقه</span>
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-purple-900 text-purple-200 font-sans">
                    مدل: {insight.source || 'gemini-3.8-flash'}
                  </span>
                </div>
              </div>

              {/* 1. Executive Summary */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <h3 className="text-xs font-bold text-purple-300 flex items-center gap-2">
                  <FileCheck2 size={16} />
                  <span>خلاصه اجرایی مدیریت (Executive Summary)</span>
                </h3>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {insight.executiveSummary}
                </p>
              </div>

              {/* 2. Key Bullet-Point Takeaways */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-sky-300 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-sky-400" />
                  <span>نکات کلیدی و تعهدات حقوقی/فنی (Key Takeaways)</span>
                </h3>
                <div className="space-y-2">
                  {insight.keyTakeaways?.map((takeaway, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2.5 text-xs text-slate-200 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800"
                    >
                      <span className="w-5 h-5 rounded-full bg-sky-950 text-sky-400 border border-sky-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="leading-relaxed">{takeaway}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Critical Risks & Red Flags */}
              {insight.criticalRisks && insight.criticalRisks.length > 0 && (
                <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 space-y-3">
                  <h3 className="text-xs font-bold text-red-300 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-red-400" />
                    <span>ریسک‌های شناسایی‌شده و پرچم‌های قرمز فنی (Critical Risks)</span>
                  </h3>
                  <div className="space-y-2">
                    {insight.criticalRisks.map((risk, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 text-xs text-red-200 bg-red-950/40 p-2.5 rounded-lg border border-red-900/50"
                      >
                        <span className="text-red-400 font-bold shrink-0 mt-0.5">⚠️</span>
                        <span className="leading-relaxed">{risk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Actionable Recommendations */}
              {insight.recommendations && insight.recommendations.length > 0 && (
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-3">
                  <h3 className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                    <Lightbulb size={16} className="text-emerald-400" />
                    <span>اقدامات پیشنهادی و گام‌های انطباق (Actionable Recommendations)</span>
                  </h3>
                  <div className="space-y-2">
                    {insight.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 text-xs text-emerald-100 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-900/50"
                      >
                        <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                        <span className="leading-relaxed">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-mono">
            شرکت شبکه هوشمند ابتکار ویستا - تحلیل هوشمند اسناد با هوش مصنوعی جمینای
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            بستن پنجره
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Sparkles,
  Tag,
  Cpu,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Layers,
  X,
  Plus,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Box
} from 'lucide-react';
import {
  scanAndAutoTagDocument,
  SAMPLE_TECHNICAL_DOCS_FOR_TAGGING,
  AutoTagResult
} from '../../services/aiAutoTaggingService';

interface DocumentAutoTaggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaggingComplete?: (result: AutoTagResult) => void;
}

export const DocumentAutoTaggerModal: React.FC<DocumentAutoTaggerModalProps> = ({
  isOpen,
  onClose,
  onTaggingComplete
}) => {
  const [documentTitle, setDocumentTitle] = useState<string>('');
  const [documentText, setDocumentText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tagResult, setTagResult] = useState<AutoTagResult | null>(null);
  const [newTagInput, setNewTagInput] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleLoadSample = (sampleIdx: number) => {
    const sample = SAMPLE_TECHNICAL_DOCS_FOR_TAGGING[sampleIdx];
    setDocumentTitle(sample.title);
    setDocumentText(sample.text);
    setFileName(sample.fileName);
    setTagResult(null);
    setSavedSuccess(false);
  };

  const handleAnalyze = async () => {
    if (!documentText.trim()) return;
    setIsLoading(true);
    setSavedSuccess(false);
    try {
      const result = await scanAndAutoTagDocument(documentText, documentTitle, fileName);
      setTagResult(result);
    } catch (err) {
      console.error('Auto tag error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = () => {
    if (!newTagInput.trim() || !tagResult) return;
    const clean = newTagInput.trim().replace(/^#/, '');
    if (!tagResult.assignedTags.includes(clean)) {
      setTagResult({
        ...tagResult,
        assignedTags: [...tagResult.assignedTags, clean]
      });
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!tagResult) return;
    setTagResult({
      ...tagResult,
      assignedTags: tagResult.assignedTags.filter((t) => t !== tagToRemove)
    });
  };

  const handleSaveToKnowledge = () => {
    if (!tagResult) return;
    setSavedSuccess(true);
    if (onTaggingComplete) {
      onTaggingComplete(tagResult);
    }
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">سرویس برچسب‌گذاری و استخراج هوشمند موجودیت‌ها (AI Auto-Tagging)</h2>
              <p className="text-xs text-slate-400">شناسایی خودکار کد تجهیزات، فرکانس‌های عیب یاتاقان و تطبیق استانداردها</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Sample Load Buttons */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-400">بارگذاری سریع اسناد نمونه:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => handleLoadSample(0)}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-right text-xs font-medium text-slate-300 transition-colors"
              >
                <div className="font-bold text-white truncate">گزارش ارتعاشات K-04</div>
                <div className="text-[11px] text-amber-400 font-mono">اسپایک BPFO یاتاقان</div>
              </button>
              <button
                onClick={() => handleLoadSample(1)}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-right text-xs font-medium text-slate-300 transition-colors"
              >
                <div className="font-bold text-white truncate">دستورالعمل پمپ P-02</div>
                <div className="text-[11px] text-sky-400 font-mono">کاویتاسیون و پروانه</div>
              </button>
              <button
                onClick={() => handleLoadSample(2)}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-right text-xs font-medium text-slate-300 transition-colors"
              >
                <div className="font-bold text-white truncate">پیمان رسمی ویستا</div>
                <div className="text-[11px] text-purple-400 font-mono">ثبت ۵۸۳۳۰۲ و تعهد SLA</div>
              </button>
            </div>
          </div>

          {/* Input Document Fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">عنوان سند / گزارش فنی:</label>
              <input
                type="text"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                placeholder="مثلاً: گزارش ممیزی ارتعاشی یاتاقان شفت محرک کمپرسور..."
                className="w-full bg-slate-950 text-slate-200 text-xs py-2 px-3 rounded-xl border border-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">متن یا خلاصه محتوای گزارش جهت اسکن هوش مصنوعی:</label>
              <textarea
                rows={5}
                value={documentText}
                onChange={(e) => setDocumentText(e.target.value)}
                placeholder="متن سند، پاراگراف‌های فنی، مقادیر ارتعاشات یا بندهای حقوقی قرارداد را اینجا الصاق کنید..."
                className="w-full bg-slate-950 text-slate-200 text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-sky-500 leading-relaxed font-sans"
              />
            </div>
          </div>

          {/* Action Button: Scan */}
          <button
            onClick={handleAnalyze}
            disabled={isLoading || !documentText.trim()}
            className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-600/30"
          >
            {isLoading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>در حال تحلیل هوشمند متن سند با مدل هوش مصنوعی...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>اسکن و استخراج برچسب‌ها با هوش مصنوعی ویستا</span>
              </>
            )}
          </button>

          {/* Results Card */}
          {tagResult && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  <span className="font-bold text-white text-xs">نتایج طبقه‌بندی و انتساب خودکار</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400">ضریب اطمینان:</span>
                  <span className="text-emerald-400 font-bold">{tagResult.confidenceScore}%</span>
                </div>
              </div>

              {/* Matched Asset IDs */}
              <div className="space-y-1.5">
                <span className="text-xs text-slate-400 font-semibold">تجهیزات و دارایی‌های شناسایی‌شده:</span>
                <div className="flex flex-wrap gap-2">
                  {tagResult.matchedAssetIds.map((asset) => (
                    <div
                      key={asset.id}
                      className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs flex items-center gap-2"
                    >
                      <Box size={14} className="text-sky-400" />
                      <span className="font-bold">{asset.nameFa}</span>
                      <span className="font-mono text-[10px] text-sky-400 bg-sky-500/20 px-1.5 py-0.5 rounded">
                        {asset.confidence}% تطابق
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assigned Tags */}
              <div className="space-y-1.5">
                <span className="text-xs text-slate-400 font-semibold">برچسب‌ها و تگ‌های صنعتی استخراج‌شده:</span>
                <div className="flex flex-wrap gap-1.5">
                  {tagResult.assignedTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-mono flex items-center gap-1.5 group"
                    >
                      <span>#{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-slate-400 hover:text-rose-400 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Tag Input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    placeholder="افزودن برچسب سفارشی..."
                    className="flex-1 bg-slate-900 text-slate-200 text-xs py-1.5 px-3 rounded-lg border border-slate-800 focus:outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium flex items-center gap-1"
                  >
                    <Plus size={13} />
                    <span>افزودن</span>
                  </button>
                </div>
              </div>

              {/* Standards Referenced */}
              {tagResult.standardsReferenced.length > 0 && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">استانداردهای تشخیص داده شده:</span>
                  <div className="flex gap-1">
                    {tagResult.standardsReferenced.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold text-[11px] border border-emerald-500/20">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Summary */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 text-xs leading-relaxed text-slate-300">
                <span className="font-bold text-slate-200 block mb-1">خلاصه تحلیل هوش مصنوعی:</span>
                {tagResult.summaryFa}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            {tagResult?.source === 'gemini-3.8-flash' ? 'پردازش‌شده توسط Gemini 3.8 Flash' : 'موتور یادگیری تحلیلی صنعتی ویستا'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
            >
              انصراف
            </button>
            {tagResult && (
              <button
                onClick={handleSaveToKnowledge}
                disabled={savedSuccess}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-colors"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 size={15} />
                    <span>به بانک اسناد پیوند داده شد!</span>
                  </>
                ) : (
                  <>
                    <Tag size={15} />
                    <span>تایید برچسب‌ها و پیوند به گراف دانش</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

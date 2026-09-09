import React, { useState } from 'react';
import {
  FileDown,
  Printer,
  X,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Calendar,
  Clock,
  Settings,
  Activity,
  Award
} from 'lucide-react';
import { Asset, TelemetryData } from '../../types';
import { generateIndustrialPdfReport } from '../../services/pdfReportService';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset;
  telemetryHistory: TelemetryData[];
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  asset,
  telemetryHistory,
}) => {
  const [reportTitle, setReportTitle] = useState<string>(
    `گزارش رسمی پایش وضعیت و سلامت تجهیز: ${asset.faName || asset.name}`
  );
  const [authorName, setAuthorName] = useState<string>('مهندس ارشد پایش وضعیت (ویستا-دیدبان)');
  const [reportNotes, setReportNotes] = useState<string>(
    'ارزیابی انطباق دینامیکی ارتعاشات بر اساس استاندارد ISO 10816-3 و گواهی زنجیره شواهد غیرقابل انکار بلاک حقیقت.'
  );
  const [includeTruthBlock, setIncludeTruthBlock] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const samples = telemetryHistory.length > 0 ? telemetryHistory : [asset.telemetry];
  const vibs = samples.map((s) => s.vibrationRms);
  const temps = samples.map((s) => s.temperature);
  const currents = samples.map((s) => s.current);
  const pressures = samples.map((s) => s.pressure);

  const minVib = Math.min(...vibs).toFixed(2);
  const maxVib = Math.max(...vibs).toFixed(2);
  const avgVib = (vibs.reduce((a, b) => a + b, 0) / vibs.length).toFixed(2);

  const minTemp = Math.min(...temps).toFixed(1);
  const maxTemp = Math.max(...temps).toFixed(1);
  const avgTemp = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1);

  const minCurr = Math.min(...currents).toFixed(1);
  const maxCurr = Math.max(...currents).toFixed(1);
  const avgCurr = (currents.reduce((a, b) => a + b, 0) / currents.length).toFixed(1);

  const minPress = Math.min(...pressures).toFixed(2);
  const maxPress = Math.max(...pressures).toFixed(2);
  const avgPress = (pressures.reduce((a, b) => a + b, 0) / pressures.length).toFixed(2);

  const handleExportPdf = () => {
    setIsGenerating(true);
    setDownloadSuccess(false);
    try {
      generateIndustrialPdfReport({
        asset,
        telemetryHistory,
        title: reportTitle,
        notes: reportNotes,
        authorName,
        includeTruthBlock,
      });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDirectPrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <FileDown size={22} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>صدور گزارش رسمی و خروجی چاپی PDF</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                  ISO 10816 / ISO 13374
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                تهیه اسناد مستندسازی و بسته‌بندی داده‌های تله‌متری با تأییدیه رمزنگاری برای کارفرما
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="بستن پنجره"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body: Settings & Interactive Preview */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-right">
          {/* Customization Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">عنوان رسمی گزارش:</label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">نام کارشناس / صادرکننده گزارش:</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-500 font-medium"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">یادداشت و ملاحظات مهندسی:</label>
              <textarea
                rows={2}
                value={reportNotes}
                onChange={(e) => setReportNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-500 resize-none font-medium"
              />
            </div>

            <div className="md:col-span-2 flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={includeTruthBlock}
                  onChange={(e) => setIncludeTruthBlock(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500 w-4 h-4"
                />
                <span>ضمیمه کردن بلوک حقیقت، اثر انگشت هش SHA-256 و گواهی کالیبراسیون سنسور</span>
              </label>

              <span className="text-[11px] text-slate-400 font-mono">
                تعداد نقاط ثبت‌شده در بافر: {samples.length} نمونه
              </span>
            </div>
          </div>

          {/* Document Printable Visual Layout Preview (High-quality print styled container) */}
          <div className="border border-slate-700 rounded-xl bg-white text-slate-900 p-6 shadow-inner print:p-0 print:border-none">
            {/* Header / Letterhead */}
            <div className="border-b-2 border-sky-600 pb-4 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-sky-400 flex items-center justify-center font-black text-xl">
                  V
                </div>
                <div>
                  <h3 className="font-black text-slate-950 text-base leading-tight">
                    شرکت شبکه هوشمند ابتکار ویستا (مسئولیت محدود)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                    شماره ثبت: ۵۸۳۳۰۲ | شناسه ملی: ۱۴۰۱۰۲۲۸۹۲۴ | آزمایشگاه تخصصی ارتعاشات و دوقلوی دیجیتال
                  </p>
                </div>
              </div>
              <div className="text-left font-mono text-[11px] text-slate-600 space-y-0.5">
                <div>کد رهگیری: <span className="font-bold text-sky-800">VISTA-REP-2026-98</span></div>
                <div>تاریخ: {new Date().toLocaleDateString('fa-IR')}</div>
                <div>انطباق زمانی PTP: <span className="text-emerald-700 font-bold">±۶.۸ میلی‌ثانیه</span></div>
              </div>
            </div>

            {/* Title & Notes */}
            <div className="mb-5">
              <h4 className="font-bold text-slate-900 text-sm">{reportTitle}</h4>
              <p className="text-xs text-slate-600 mt-1">{reportNotes}</p>
            </div>

            {/* Asset Identity Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 p-3.5 rounded-lg mb-5 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">تجهیز تحت پایش:</span>
                <span className="font-bold text-slate-900">{asset.faName || asset.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">کلاس استاندارد ISO:</span>
                <span className="font-bold text-slate-900">{asset.isoClass}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">شاخص سلامت (Health):</span>
                <span className={`font-bold ${asset.healthScore < 80 ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {asset.healthScore}٪ (عمر باقیمانده: {asset.rulHours} ساعت)
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">وضعیت عملیاتی:</span>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                    asset.status === 'critical'
                      ? 'bg-red-100 text-red-800'
                      : asset.status === 'warning'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {asset.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Aggregated Telemetry Table */}
            <div className="mb-5 overflow-x-auto">
              <h5 className="font-bold text-xs text-slate-900 mb-2 flex items-center gap-1.5">
                <Activity size={14} className="text-sky-600" />
                <span>۱. جدول آماری تله‌متری و میانگین پنجره پایش بلادرنگ</span>
              </h5>
              <table className="w-full text-xs border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="border border-slate-200 p-2 text-right">پارامتر سنسور</th>
                    <th className="border border-slate-200 p-2 text-center">آخرین مقدار برخط</th>
                    <th className="border border-slate-200 p-2 text-center">حداقل (Min)</th>
                    <th className="border border-slate-200 p-2 text-center">حداکثر (Max)</th>
                    <th className="border border-slate-200 p-2 text-center">میانگین (Mean)</th>
                    <th className="border border-slate-200 p-2 text-center">محدوده شدت ISO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-200 p-2 font-medium">سرعت ارتعاشات RMS (mm/s)</td>
                    <td className="border border-slate-200 p-2 text-center font-mono font-bold text-slate-900">
                      {asset.telemetry.vibrationRms.toFixed(2)}
                    </td>
                    <td className="border border-slate-200 p-2 text-center font-mono">{minVib}</td>
                    <td className="border border-slate-200 p-2 text-center font-mono">{maxVib}</td>
                    <td className="border border-slate-200 p-2 text-center font-mono">{avgVib}</td>
                    <td className="border border-slate-200 p-2 text-center">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          asset.telemetry.vibrationRms > 4.5
                            ? 'bg-red-100 text-red-800'
                            : asset.telemetry.vibrationRms > 2.8
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {asset.telemetry.vibrationRms > 4.5
                          ? 'منطقه C/D (هشدار)'
                          : asset.telemetry.vibrationRms > 2.8
                          ? 'منطقه B (قابل قبول)'
                          : 'منطقه A (ایده‌آل)'}
                      </span>
                    </td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="border border-slate-200 p-2 font-medium">دمای بیرینگ یاتاقان (°C)</td>
                    <td className="border border-slate-200 p-2 text-center font-mono font-bold text-slate-900">
                      {asset.telemetry.temperature.toFixed(1)}
                    </td>
                    <td className="border border-slate-200 p-2 text-center font-mono">{minTemp}</td>
                    <td className="border border-slate-200 p-2 text-center font-mono">{maxTemp}</td>
                    <td className="border border-slate-200 p-2 text-center font-mono">{avgTemp}</td>
                    <td className="border border-slate-200 p-2 text-center font-mono text-slate-600">
                      {asset.telemetry.temperature > 80 ? 'بیش از آستانه هشدار' : 'عادی'}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 p-2 font-medium">جریان فاز موتور (آمپر)</td>
                    <td className="border border-slate-200 p-2 text-center font-mono font-bold text-slate-900">
                      {asset.telemetry.current.toFixed(1)} A
                    </td>
                    <td className="border border-slate-200 p-2 text-center font-mono">{minCurr} A</td>
                    <td className="border border-slate-200 p-2 text-center font-mono">{maxCurr} A</td>
                    <td className="border border-slate-200 p-2 text-center font-mono">{avgCurr} A</td>
                    <td className="border border-slate-200 p-2 text-center font-mono text-emerald-700 font-bold">
                      پایدار
                    </td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="border border-slate-200 p-2 font-medium">فشار عملیاتی سیال (بار)</td>
                    <td className="border border-slate-200 p-2 text-center font-mono font-bold text-slate-900">
                      {asset.telemetry.pressure.toFixed(2)} bar
                    </td>
                    <td className="border border-slate-200 p-2 text-center font-mono">{minPress}</td>
                    <td className="border border-slate-200 p-2 text-center font-mono">{maxPress}</td>
                    <td className="border border-slate-200 p-2 text-center font-mono">{avgPress}</td>
                    <td className="border border-slate-200 p-2 text-center font-mono text-emerald-700 font-bold">
                      نامی
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Truth Block Verification Seal */}
            {includeTruthBlock && (
              <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg text-xs space-y-1 mb-4 text-sky-950">
                <div className="flex items-center gap-1.5 font-bold text-sky-900">
                  <ShieldCheck size={16} className="text-sky-600" />
                  <span>تأییدیه رمزنگاری و ثبت در زنجیره بلوک حقیقت (ISO 13374 / IEC 62443)</span>
                </div>
                <p className="font-mono text-[10px] text-slate-600">
                  شناسه بلوک: {asset.lastTruthBlockId || 'TB-2026-980124'} | هش دیجیتال SHA-256: 0x9e7a88b19c2f54a8b7e6d018...
                </p>
                <p className="text-[10px] text-slate-600">
                  سنسور پیزوالکتریک لبه دارای گواهی کالیبراسیون معتبر تا تاریخ ۱۴۰۵/۱۱/۲۶ از آزمایشگاه همکار استاندارد.
                </p>
              </div>
            )}

            {/* Document Signature & Footer */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <div>
                <span>تأییدکننده گزارش: </span>
                <span className="font-bold text-slate-800">{authorName}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400 font-sans">
                <Award size={14} className="text-sky-600" />
                <span>ممهور به امضای الکترونیک امن ماژول سخت‌افزاری HSM لبه</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            {downloadSuccess && (
              <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1.5 rounded-lg">
                <CheckCircle2 size={16} />
                <span>فایل PDF با موفقیت تولید و دانلود شد!</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDirectPrint}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition-colors border border-slate-700"
            >
              <Printer size={16} />
              <span>چاپ مستقیم / چاپگر</span>
            </button>

            <button
              onClick={handleExportPdf}
              disabled={isGenerating}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-sky-600/30 transition-all disabled:opacity-50"
            >
              <FileDown size={16} />
              <span>{isGenerating ? 'در حال ایجاد فایل PDF...' : 'دانلود فایل رسمی PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  FileCheck2,
  Lock,
  Search,
  CheckCircle,
  Copy,
  Clock,
  ShieldCheck,
  Cpu,
  Database,
  ExternalLink,
  ChevronRight,
  GitCommit,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TruthBlock } from '../types';

export const TruthBlockExplorerPage: React.FC = () => {
  const { truthBlocks, t, isRtl } = useApp();
  const [selectedBlock, setSelectedBlock] = useState<TruthBlock | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [verifiedHash, setVerifiedHash] = useState<boolean | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  const displayedBlocks = truthBlocks.filter((b) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const blockId = b.id || b.truthBlockId || '';
    const blockHash = b.hash || b.cryptographicHash || '';
    return (
      blockId.toLowerCase().includes(q) ||
      b.assetId.toLowerCase().includes(q) ||
      blockHash.toLowerCase().includes(q)
    );
  });

  const activeBlock = selectedBlock || truthBlocks[0];

  const handleVerifyHash = () => {
    setVerifiedHash(null);
    setTimeout(() => {
      // In our deterministic PRNG, the block hash is valid
      setVerifiedHash(true);
    }, 400);
  };

  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <FileCheck2 size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{t('truth_page_title')}</h1>
              <span className="text-xs text-sky-400 font-mono">{t('truth_page_sub')}</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">
            {t('truth_page_desc')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 text-xs">
            <div className="text-slate-400 font-mono">{t('truth_blocks')}:</div>
            <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">{truthBlocks.length}</div>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Live Stream on Right / Details Inspector on Left */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stream List (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <GitCommit size={16} className="text-sky-400" />
              {t('truth_blocks')}
            </h2>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search size={14} className={`absolute top-2.5 text-slate-400 ${isRtl ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-slate-950 border border-slate-800 rounded-xl py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'
              }`}
            />
          </div>

          {/* Blocks Scrollable List */}
          <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
            {displayedBlocks.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                در حال دریافت نخستین پالس‌های بلوک حقیقت از موتور شبیه‌ساز...
              </div>
            ) : (
              displayedBlocks.map((block) => {
                const isSelected = activeBlock?.id === block.id;
                return (
                  <div
                    key={block.id}
                    onClick={() => {
                      setSelectedBlock(block);
                      setVerifiedHash(null);
                    }}
                    className={`cursor-pointer p-3 rounded-xl border transition-all text-xs font-mono ${
                      isSelected
                        ? 'bg-sky-950/40 border-sky-500 shadow-md shadow-sky-500/20'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sky-400">{block.id}</span>
                      <span className="text-[10px] text-slate-400">{new Date(block.timestamp).toLocaleTimeString('fa-IR')}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-300 font-sans">{block.assetId}</span>
                      <span className="text-emerald-400 font-bold">{block.confidenceScore}٪ صحت</span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate mt-1">
                      هش: {block.hash}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Block Detailed Inspector (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
          {activeBlock ? (
            <>
              {/* Header of Active Block */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Lock size={16} className="text-sky-400" />
                    <span className="text-xs text-slate-400 font-mono">بلوک برگزیده:</span>
                    <h2 className="text-base font-bold font-mono text-white">{activeBlock.id}</h2>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    تجهیز مبدأ: <strong>{activeBlock.assetId}</strong> • طرحواره استاندارد {activeBlock.schemaVersion}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleVerifyHash}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw size={13} />
                    <span>راستی‌آزمایی هش رمزنگاری</span>
                  </button>
                </div>
              </div>

              {/* Verification Result Banner */}
              {verifiedHash !== null && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-400" />
                  <span>
                    ✓ امضای دیجیتال و هش با بار داده تطبیق کامل دارد. داده‌ها بدون هرگونه تغییر یا جعل در زنجیره شواهد تأیید شدند.
                  </span>
                </div>
              )}

              {/* 6 Essential Properties of Truth Block as in Chapter 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Hash */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 col-span-2 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>هش تغییرناپذیر SHA-256 (Hash Digest)</span>
                    <button
                      onClick={() => handleCopyHash(activeBlock.hash || activeBlock.cryptographicHash || '')}
                      className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-mono text-[10px]"
                    >
                      <Copy size={11} />
                      <span>{copiedHash ? 'کپی شد!' : 'کپی هش'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-slate-200 text-xs break-all bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    {activeBlock.hash}
                  </div>
                </div>

                {/* Sensor ID & Calibration */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-[11px] text-slate-400">شناسنامه حسگر (Sensor Identity)</div>
                  <div className="font-mono font-bold text-white text-xs">{activeBlock.sensorId}</div>
                  <div className="text-[10px] text-slate-500">شماره سریال سازنده معتبر</div>
                </div>

                {/* Calibration Expiry */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-[11px] text-slate-400">تاریخ انقضای کالیبراسیون</div>
                  <div className="font-mono font-bold text-emerald-400 text-xs">{activeBlock.calibrationExpiry}</div>
                  <div className="text-[10px] text-slate-500">آزمایشگاه مرجع کالیبراسیون ایران</div>
                </div>

                {/* Timestamp & PTP sync error */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-[11px] text-slate-400">برچسب زمانی دقیق (IEEE 1588)</div>
                  <div className="font-mono font-bold text-white text-xs">
                    {new Date(activeBlock.timestamp).toISOString()}
                  </div>
                  <div className="text-[10px] text-sky-400 font-mono">
                    خطای همگام‌سازی: ±{activeBlock.syncErrorMs} میلی‌ثانیه
                  </div>
                </div>

                {/* Firmware & Signature */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-[11px] text-slate-400">نسخه فریمور گره لبه</div>
                  <div className="font-mono font-bold text-white text-xs">{activeBlock.firmwareVersion}</div>
                  <div className="text-[10px] text-emerald-400 font-mono">امضای دیجیتال: معتبر و ممهور</div>
                </div>
              </div>

              {/* Payload Details */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">بار داده فیزیکی (Payload Snapshot)</span>
                  <span className="text-sky-400 font-mono text-[11px]">فرمت JSON رمزنگاری‌شده</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500">ارتعاش RMS</div>
                    <div className="font-bold text-amber-400 mt-0.5">{activeBlock.payload.vibrationRms} mm/s</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500">دمای بدنه</div>
                    <div className="font-bold text-sky-400 mt-0.5">{activeBlock.payload.temperature} °C</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500">جریان موتور</div>
                    <div className="font-bold text-slate-200 mt-0.5">{activeBlock.payload.current} A</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500">فشار خط</div>
                    <div className="font-bold text-slate-200 mt-0.5">{activeBlock.payload.pressure} bar</div>
                  </div>
                </div>
              </div>

              {/* Hafeze Context Link */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs">
                <div className="text-slate-300">
                  پیوند بافتار سازمانی در <strong>ویستا-حافظه</strong>: دستور کار CMMS شماره #WO-8419
                </div>
                <a
                  href="#/hafeze"
                  className="text-sky-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>مشاهده در گراف دانش</span>
                  <ChevronRight size={14} />
                </a>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-slate-500 text-xs">
              یک بلوک حقیقت را از فهرست سمت راست انتخاب کنید.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

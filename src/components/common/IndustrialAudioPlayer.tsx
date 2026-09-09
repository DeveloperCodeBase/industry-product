import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  FastForward,
  Headphones,
  CheckCircle,
  X,
  Sparkles
} from 'lucide-react';
import { ttsService, TTSState } from '../../services/ttsService';

interface IndustrialAudioPlayerProps {
  textToSpeak?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  compact?: boolean;
}

export const IndustrialAudioPlayer: React.FC<IndustrialAudioPlayerProps> = ({
  textToSpeak,
  title = 'راهنمای صوتی هوشمند اپراتور (Hands-Free Field Audio)',
  subtitle = 'قرائت گفتاری دستورالعمل‌های فنی و گزارش‌های تشخیصی برای تکنسین‌های میدانی',
  className = '',
  compact = false,
}) => {
  const [ttsState, setTtsState] = useState<TTSState>({
    isPlaying: false,
    isPaused: false,
    currentText: '',
    progressPercent: 0,
    rate: 1.0,
  });

  const [selectedRate, setSelectedRate] = useState<number>(1.0);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  useEffect(() => {
    setIsSupported(ttsService.isSupported());
    const unsubscribe = ttsService.subscribe((state) => {
      setTtsState(state);
      setSelectedRate(state.rate);
    });
    return () => unsubscribe();
  }, []);

  const handlePlay = () => {
    const text = textToSpeak || ttsState.currentText;
    if (!text) return;

    if (ttsState.isPaused) {
      ttsService.resume();
    } else {
      ttsService.speak(text, { rate: selectedRate });
    }
  };

  const handlePause = () => {
    ttsService.pause();
  };

  const handleStop = () => {
    ttsService.stop();
  };

  const handleRateChange = (rate: number) => {
    setSelectedRate(rate);
    ttsService.setRate(rate);
  };

  if (!isSupported) {
    return null;
  }

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs ${className}`}>
        <button
          onClick={ttsState.isPlaying && !ttsState.isPaused ? handlePause : handlePlay}
          className="p-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition-colors"
          title={ttsState.isPlaying && !ttsState.isPaused ? 'توقف موقت صدا' : 'پخش صوتی دستورالعمل'}
          aria-label="پخش صوتی"
        >
          {ttsState.isPlaying && !ttsState.isPaused ? <Pause size={13} /> : <Play size={13} />}
        </button>

        {ttsState.isPlaying && (
          <button
            onClick={handleStop}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="توقف کامل"
          >
            <Square size={13} />
          </button>
        )}

        <div className="flex items-center gap-1 text-[11px] text-slate-300 font-medium px-1">
          <Headphones size={13} className={ttsState.isPlaying ? 'text-sky-400 animate-pulse' : 'text-slate-500'} />
          <span>{ttsState.isPlaying ? (ttsState.isPaused ? 'مکث' : 'در حال خواندن...') : 'شنیدن صوتی'}</span>
        </div>

        {ttsState.isPlaying && (
          <div className="flex items-center gap-0.5 px-1">
            <span className="w-1 h-3 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1 h-4 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1 h-2 bg-sky-400 rounded-full animate-bounce" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-sky-500/30 shadow-xl space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-400 flex items-center justify-center shrink-0">
            <Headphones size={18} />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{title}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                TTS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{subtitle}</p>
          </div>
        </div>

        {/* Audio Visualizer Wave */}
        {ttsState.isPlaying && !ttsState.isPaused && (
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-950/60 border border-sky-800/60">
            <span className="w-1 h-3.5 bg-sky-400 rounded-full animate-pulse" />
            <span className="w-1 h-5 bg-sky-400 rounded-full animate-pulse [animation-delay:150ms]" />
            <span className="w-1 h-2.5 bg-sky-400 rounded-full animate-pulse [animation-delay:300ms]" />
            <span className="w-1 h-6 bg-sky-400 rounded-full animate-pulse [animation-delay:75ms]" />
            <span className="w-1 h-4 bg-sky-400 rounded-full animate-pulse [animation-delay:220ms]" />
            <span className="text-[10px] text-sky-400 font-mono ml-1">پخش صوتی</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {ttsState.isPlaying && (
        <div className="space-y-1">
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-200"
              style={{ width: `${ttsState.progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>پیشرفت گفتار: {ttsState.progressPercent}٪</span>
            <span>کیفیت استریو لبه</span>
          </div>
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
        <div className="flex items-center gap-2">
          <button
            onClick={ttsState.isPlaying && !ttsState.isPaused ? handlePause : handlePlay}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 flex items-center gap-1.5 transition-all"
          >
            {ttsState.isPlaying && !ttsState.isPaused ? (
              <>
                <Pause size={14} />
                <span>مکث</span>
              </>
            ) : (
              <>
                <Play size={14} />
                <span>{ttsState.isPaused ? 'ادامه پخش' : 'شروع قرائت صوتی'}</span>
              </>
            )}
          </button>

          {ttsState.isPlaying && (
            <button
              onClick={handleStop}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Square size={13} />
              <span>توقف</span>
            </button>
          )}
        </div>

        {/* Playback Rate Pills */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-medium">سرعت:</span>
          {[0.8, 1.0, 1.25, 1.5].map((rate) => (
            <button
              key={rate}
              onClick={() => handleRateChange(rate)}
              className={`px-2 py-1 rounded-lg text-[11px] font-mono font-bold transition-colors ${
                selectedRate === rate
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

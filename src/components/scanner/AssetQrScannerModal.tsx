import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  QrCode,
  X,
  Boxes,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  ChevronLeft,
  FileText,
  Sliders,
  Sparkles,
  ExternalLink,
  Upload
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Asset } from '../../types';

interface AssetQrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssetDetected?: (asset: Asset) => void;
}

export const AssetQrScannerModal: React.FC<AssetQrScannerModalProps> = ({
  isOpen,
  onClose,
  onAssetDetected,
}) => {
  const { assets, setSelectedAssetId, t } = useApp();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [detectedAsset, setDetectedAsset] = useState<Asset | null>(null);
  const [scanMethod, setScanMethod] = useState<'camera' | 'samples' | 'upload'>('samples');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Sample industrial physical machine barcodes for quick field testing
  const sampleBarcodes = [
    { code: 'ASSET:compressor-04', label: 'کمپرسور گاز K-04', assetId: 'compressor-04', section: 'پتروشیمی بوعلی - واحد ۱۰۰' },
    { code: 'ASSET:pump-02', label: 'پمپ سانتریفیوژ P-02', assetId: 'pump-02', section: 'پایپ‌لاین هیدروکربنی' },
    { code: 'ASSET:blower-01', label: 'دمنده فشارقوی هوای کوره B-01', assetId: 'blower-01', section: 'واحد یوتیلیتی و احتراق' },
    { code: 'ASSET:turbine-03', label: 'توربین گاز سنگین TG-03', assetId: 'turbine-03', section: 'نیروگاه سیکل ترکیبی' },
    { code: 'ASSET:kiln-motor-01', label: 'الکتروموتور درایو کوره سیمان M-01', assetId: 'kiln-motor-01', section: 'صنایع سیمان و مواد اولیه' },
  ];

  const playSuccessBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  const handleBarcodeDecoded = (barcodeText: string) => {
    playSuccessBeep();

    // Extract asset id from format "ASSET:<id>" or direct id
    let targetId = barcodeText.replace(/^ASSET:/i, '').trim();
    let matched = assets.find((a) => a.id.toLowerCase() === targetId.toLowerCase());

    if (!matched) {
      // Fuzzy match by name or fallback to first
      matched = assets.find((a) => a.id.includes(targetId) || a.name.toLowerCase().includes(targetId.toLowerCase())) || assets[0];
    }

    if (matched) {
      setDetectedAsset(matched);
      onAssetDetected?.(matched);
    }
  };

  // Start Camera Stream
  useEffect(() => {
    if (!isOpen || scanMethod !== 'camera') {
      stopCamera();
      return;
    }

    let active = true;

    async function startCamera() {
      try {
        setCameraError(null);
        setIsScanning(true);

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('دستگاه یا مرورگر شما از وبکم پشتیبانی نمی‌کند.');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }

        // Initialize BarcodeDetector if available
        if ('BarcodeDetector' in window) {
          const detector = new (window as any).BarcodeDetector({
            formats: ['qr_code', 'code_128', 'data_matrix'],
          });

          const scanInterval = setInterval(async () => {
            if (!active || !videoRef.current || videoRef.current.readyState < 2) return;
            try {
              const barcodes = await detector.detect(videoRef.current);
              if (barcodes && barcodes.length > 0) {
                clearInterval(scanInterval);
                handleBarcodeDecoded(barcodes[0].rawValue);
              }
            } catch {
              // frame detection pass
            }
          }, 400);

          return () => clearInterval(scanInterval);
        }
      } catch (err: any) {
        console.warn('Camera access issue:', err);
        setHasCameraPermission(false);
        setCameraError(err.message || 'دسترسی به دوربین در این محیط مجاز نیست یا دوربینی متصل نمی‌باشد.');
        // Gracefully switch to sample barcodes so user can test seamlessly
        setScanMethod('samples');
      }
    }

    startCamera();

    return () => {
      active = false;
      stopCamera();
    };
  }, [isOpen, scanMethod]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const handleNavigateToTwin = (asset: Asset) => {
    setSelectedAssetId(asset.id);
    stopCamera();
    onClose();
    window.location.hash = '#/twin';
  };

  const handleNavigateToMaintenance = (asset: Asset) => {
    setSelectedAssetId(asset.id);
    stopCamera();
    onClose();
    window.location.hash = '#/maintenance';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/40 text-sky-400 flex items-center justify-center">
              <QrCode size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>اسکنر بارکد و QR کد تجهیزات صنعتی</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                  Field Asset QR
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                اتصال مستقیم کارشناسان میدانی به دوقلوی دیجیتال ۳D و اسناد فنی
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scan Mode Switcher */}
        <div className="flex items-center gap-1.5 p-2 bg-slate-950/60 border-b border-slate-800 text-xs px-4">
          <button
            onClick={() => {
              setDetectedAsset(null);
              setScanMethod('camera');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              scanMethod === 'camera'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Camera size={14} />
            <span>دوربین زنده (Live Camera)</span>
          </button>

          <button
            onClick={() => {
              stopCamera();
              setDetectedAsset(null);
              setScanMethod('samples');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              scanMethod === 'samples'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <QrCode size={14} />
            <span>بارکدهای میدانی آماده (Test Tags)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {scanMethod === 'camera' && (
            <div className="space-y-3">
              {/* Camera Stream Viewport */}
              <div className="relative aspect-video w-full rounded-2xl bg-black border-2 border-slate-800 overflow-hidden flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Crosshair Viewfinder Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="relative w-56 h-56 border-2 border-sky-400/50 rounded-2xl">
                    {/* Viewfinder Corners */}
                    <span className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-sky-400 rounded-tl-lg" />
                    <span className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-sky-400 rounded-tr-lg" />
                    <span className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-sky-400 rounded-bl-lg" />
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-sky-400 rounded-br-lg" />

                    {/* Animated Scanning Laser Line */}
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent absolute top-0 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_12px_#06b6d4]" />
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-sm border border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>بارکد یا QR کد روی بدنه فیزیکی دستگاه را در قاب قرار دهید</span>
                  </span>
                  <span className="font-mono text-sky-400">Scan Active</span>
                </div>
              </div>

              {cameraError && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">پیام دوربین: </span>
                    <span>{cameraError}</span>
                    <p className="mt-1 text-slate-400 text-[11px]">
                      می‌توانید از تب «بارکدهای میدانی آماده» جهت تست کارکرد استفاده کنید.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {scanMethod === 'samples' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-300 font-medium">
                روی هر یک از تگ‌های فیزیکی زیر کلیک کنید تا سناریوی اسکن بارکد در سایت صنعتی بازسازی شود:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {sampleBarcodes.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => handleBarcodeDecoded(item.code)}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-sky-500/50 text-right transition-all group flex items-start justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-sky-400">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.section}</div>
                      <div className="text-[10px] font-mono text-sky-400/90 mt-1 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40 inline-block">
                        {item.code}
                      </div>
                    </div>
                    <QrCode size={20} className="text-slate-600 group-hover:text-sky-400 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Detected Asset Showcase Card */}
          {detectedAsset && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950/40 border border-emerald-500/40 shadow-xl space-y-3 animate-in fade-in-50 duration-300">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                    <CheckCircle size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">تجهیز شناسایی شد</span>
                    <h3 className="text-sm font-black text-white">{detectedAsset.faName || detectedAsset.name}</h3>
                  </div>
                </div>

                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {detectedAsset.id}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">شاخص سلامت</div>
                  <div className="text-base font-black font-mono text-sky-400 mt-0.5">{detectedAsset.healthScore}٪</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">ارتعاشات RMS</div>
                  <div className="text-base font-black font-mono text-amber-400 mt-0.5">{detectedAsset.telemetry.vibrationRms.toFixed(1)} mm/s</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">عمر مفید RUL</div>
                  <div className="text-base font-black font-mono text-purple-400 mt-0.5">{detectedAsset.rulHours} h</div>
                </div>
              </div>

              {/* Redirection Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={() => handleNavigateToTwin(detectedAsset)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <Boxes size={16} />
                  <span>مشاهده دوقلوی دیجیتال ۳D</span>
                </button>

                <button
                  onClick={() => handleNavigateToMaintenance(detectedAsset)}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileText size={15} />
                  <span>لاگ سلامت و نگهداری</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px]">پروتکل شناسایی تجهیزات: ISO 14224 / API 670</span>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};

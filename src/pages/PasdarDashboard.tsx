import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Flame,
  Activity,
  Users,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Compass,
  Volume2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PasdarDashboard: React.FC = () => {
  const { assets } = useApp();
  const [selectedZone, setSelectedZone] = useState<string>('zone_gas_compression');

  const zones = [
    {
      id: 'zone_gas_compression',
      title: 'منطقه ۱: واحد تراکم و تثبیت گاز (Zone 1 ATEX)',
      riskLevel: 'high',
      riskScore: 84,
      hazardType: 'ارتعاش بحرانی + گاز قابل‌اشتعال',
      activeAlert: 'هشدار ارتعاش بالا در کمپرسور K-04 و خطر فرسودگی کوپلینگ',
      exposureHours: '۳.۴ ساعت مواجهه شیفت فعلی',
      personnelInZone: 2,
      maxSafeMinutes: 45,
    },
    {
      id: 'zone_crushing_milling',
      title: 'منطقه ۲: آسیاب سنگ و خردایش اولیه',
      riskLevel: 'medium',
      riskScore: 68,
      hazardType: 'حرارت استاتور موتور M-201 + غبار سیلیسی',
      activeAlert: 'افزایش دمای پوسته استاتور به بالای ۶۵ درجه',
      exposureHours: '۵.۱ ساعت مواجهه',
      personnelInZone: 4,
      maxSafeMinutes: 120,
    },
    {
      id: 'zone_conveyors',
      title: 'منطقه ۳: خط انتقال پیوسته نوار نقاله',
      riskLevel: 'low',
      riskScore: 28,
      hazardType: 'خطر مکانیکی درام در حال چرخش',
      activeAlert: 'وضعیت درام و رولیک‌ها نرمال است',
      exposureHours: '۲.۰ ساعت مواجهه',
      personnelInZone: 1,
      maxSafeMinutes: 360,
    },
    {
      id: 'zone_utilities',
      title: 'منطقه ۴: یوتیلیتی، دیگ‌های بخار و پمپ‌ها',
      riskLevel: 'low',
      riskScore: 32,
      hazardType: 'فشار بخار و هیدرولیک',
      activeAlert: 'فشار ۱۶.۴ بار در پمپ فید بویلر، سیستم پایدار',
      exposureHours: '۱.۲ ساعت مواجهه',
      personnelInZone: 1,
      maxSafeMinutes: 240,
    },
  ];

  const currentZone = zones.find((z) => z.id === selectedZone) || zones[0];

  const reEntryAlarms = [
    {
      time: '۱۰:۲۲:۱۴',
      worker: 'مهدی نوری (مکانیک نوبت روز)',
      zone: 'منطقه ۱ (تراکم گاز)',
      event: 'ورود مجدد پس از هشدار قرمز ارتعاش بدون ماسک و گیت ایزولاسیون',
      action: 'اعلام صوتی و درخواست خروج از محدوده چرخش K-04',
      status: 'active',
    },
    {
      time: '۰۹:۱۵:۰۲',
      worker: 'سجاد کمالی (روانکار شیفت)',
      zone: 'منطقه ۲ (آسیاب سنگ)',
      event: 'ورود به حریم پیرامونی الکتروموتور با دمای غیرعادی',
      action: 'تأیید بازرسی چشمی و خروج ایمن انجام شد',
      status: 'resolved',
    },
    {
      time: '۰۸:۰۴:۴۵',
      worker: 'تیم تست ارتعاش پرتابل',
      zone: 'منطقه ۴ (یوتیلیتی)',
      event: 'مجوز ورود گرم و ثبت لاگ ایمنی صادر شد',
      action: 'پایان موفق اندازه‌گیری آفلاین',
      status: 'resolved',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">ویستا-پاسدار (Vista-Pasdar)</h1>
              <span className="text-xs text-amber-400 font-mono">پایایی، پایش ریسک مناطق کارخانه و هشدارهای ورود مجدد</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">
            محصول دوم سه‌گانه ویستا: مدیریت ریسک فیزیکی، نقشه ۲بعدی زون‌های حساس، هشدارهای مواجهه اپراتور و انطباق با سطوح ایمنی صنعتی IEC 62443.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs">
          <ShieldCheck size={18} className="text-emerald-400" />
          <div>
            <div className="font-bold text-white">پایش ایمنی OT فعال</div>
            <div className="text-[10px] text-slate-400">سطح اطمینان SL-2 صنعتی</div>
          </div>
        </div>
      </div>

      {/* 2D Interactive Plant Risk Floorplan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Compass size={18} className="text-sky-400" />
              طرح‌بندی ۲بعدی کارخانه و هیت‌مپ مناطق ریسک
            </h2>
            <span className="text-xs font-mono text-slate-400">برای مشاهده روی هر زون کلیک کنید</span>
          </div>

          {/* Blueprint Canvas Graphic */}
          <div className="relative bg-slate-950 rounded-xl p-4 border border-slate-800 min-h-[340px] flex flex-col justify-between overflow-hidden">
            {/* Background architectural grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none" />

            <div className="relative z-10 grid grid-cols-2 gap-4 h-full flex-1">
              {zones.map((z) => {
                const isSelected = selectedZone === z.id;
                return (
                  <div
                    key={z.id}
                    onClick={() => setSelectedZone(z.id)}
                    className={`cursor-pointer p-4 rounded-xl border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-950/30 shadow-lg shadow-amber-500/20 ring-1 ring-amber-500/50'
                        : z.riskLevel === 'high'
                        ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-500'
                        : z.riskLevel === 'medium'
                        ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-200">{z.title.split(':')[0]}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            z.riskLevel === 'high'
                              ? 'bg-rose-500/20 text-rose-400'
                              : z.riskLevel === 'medium'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          شاخص ریسک: {z.riskScore}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-white">{z.title.split(':')[1]}</div>
                      <p className="text-[11px] text-slate-400 mt-1">{z.hazardType}</p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Users size={12} className="text-sky-400" />
                        {z.personnelInZone} پرسنل حاضر
                      </span>
                      <span>سقف مجاز: {z.maxSafeMinutes} دقیقه</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Zone Inspector Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] font-mono text-amber-400 uppercase">اطلاعات زون انتخابی</span>
            <h3 className="font-bold text-base text-white mt-0.5">{currentZone.title}</h3>
            <p className="text-xs text-slate-400 mt-1">{currentZone.hazardType}</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400 mb-1">هشدار فعال زون:</div>
              <div className="font-semibold text-amber-300 leading-relaxed flex items-start gap-1.5">
                <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <span>{currentZone.activeAlert}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">مدت مواجهه تجمیعی</div>
                <div className="font-mono font-bold text-white mt-1">{currentZone.exposureHours}</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">پرسنل حاضر</div>
                <div className="font-mono font-bold text-sky-400 mt-1">{currentZone.personnelInZone} نفر</div>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">شاخص کمی‌سازی مواجهه (Exposure Index):</span>
                <span className="font-bold font-mono text-amber-400">{currentZone.riskScore} / ۱۰۰</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    currentZone.riskScore > 75
                      ? 'bg-rose-500'
                      : currentZone.riskScore > 50
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${currentZone.riskScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Re-entry Alarms Timeline (تایم‌لاین هشدارهای ورود مجدد — الزام فصل ۱۵) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 size={18} className="text-rose-400" />
            <h2 className="text-base font-bold text-white">تایم‌لاین هشدارهای ورود مجدد پرسنل به منطقه پرخطر</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">سنسورهای رادار UWB و تگ‌های RFID لایه ۰</span>
        </div>

        <div className="space-y-3">
          {reEntryAlarms.map((alarm, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                alarm.status === 'active'
                  ? 'bg-rose-950/30 border-rose-500/50 shadow-md shadow-rose-500/10'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-mono font-bold text-xs ${
                    alarm.status === 'active' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {idx + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{alarm.worker}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-sky-400 font-medium">{alarm.zone}</span>
                  </div>
                  <p className="text-slate-300 mt-1">{alarm.event}</p>
                  <div className="text-[11px] text-amber-400 mt-1 font-mono flex items-center gap-1">
                    <span>اقدام سیستم: {alarm.action}</span>
                  </div>
                </div>
              </div>

              <div className="sm:text-left shrink-0 font-mono text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {alarm.time}
                </span>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                    alarm.status === 'active' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {alarm.status === 'active' ? 'هشدار فعال' : 'بررسی شد'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

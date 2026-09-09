import React, { useState } from 'react';
import {
  GitFork,
  FileText,
  AlertCircle,
  Wrench,
  UserCheck,
  History,
  Boxes,
  Lock,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HafezePage: React.FC = () => {
  const { isRtl, t } = useApp();
  const [selectedNodeId, setSelectedNodeId] = useState<string>('sensor_anomaly');

  const nodes = [
    {
      id: 'sensor_anomaly',
      type: 'ناهنجاری حسگر',
      title: 'ناهنجاری ارتعاش در بیرینگ NDE کمپرسور گاز K-04',
      date: 'امروز ۱۰:۲۲:۱۴',
      icon: AlertCircle,
      color: 'border-rose-500 bg-rose-950/40 text-rose-300',
      badgeColor: 'bg-rose-500/20 text-rose-300',
      details:
        'ثبت فرکانس ۱۸۰ هرتز (BPFO) با دامنه پیک ۵.۸ میلی‌متر بر ثانیه. این سیگنال با داده‌های لبه تایید و قفل شده است.',
      links: ['truth_block_04', 'technician_note', 'historical_incident'],
    },
    {
      id: 'truth_block_04',
      type: 'بلوک حقیقت',
      title: 'بلوک حقیقت BLK-1369-0428',
      date: 'برچسب زمانی PTP ±۶.۸ms',
      icon: Lock,
      color: 'border-sky-500 bg-sky-950/40 text-sky-300',
      badgeColor: 'bg-sky-500/20 text-sky-300',
      details:
        'سند تغییرناپذیر با هش 7f9a1... ثبت‌شده در لبه Edge-B. گواهی کالیبراسیون حسگر تا اسفند ۱۴۰۵ معتبر است.',
      links: ['work_order_cmms'],
    },
    {
      id: 'work_order_cmms',
      type: 'دستور کار نگهداری CMMS',
      title: 'دستور کار خودکار #WO-8419',
      date: 'ارجاع به شیفت فنی شنبه',
      icon: Wrench,
      color: 'border-emerald-500 bg-emerald-950/40 text-emerald-300',
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
      details:
        'عنوان: بازرسی بیرینگ، اندازه‌گیری لقی شعاعی و روانکاری مجدد با گریس لیتیوم صابونی کمپلکس NLGI-2.',
      links: ['sop_manual', 'spare_part'],
    },
    {
      id: 'sop_manual',
      type: 'روش اجرایی استاندارد (SOP)',
      title: 'دستورالعمل مهندسی SOP-MEC-12',
      date: 'ویرایش ۴.۱ مصوب',
      icon: FileText,
      color: 'border-indigo-500 bg-indigo-950/40 text-indigo-300',
      badgeColor: 'bg-indigo-500/20 text-indigo-300',
      details:
        'مراحل استاندارد دمونتاژ پوسته کمپرسور سانتریفیوژ، گشتاور بستن پیچ‌ها (Torque: 240 N.m) و الزامات بالانس روتور.',
      links: [],
    },
    {
      id: 'technician_note',
      type: 'یادداشت اپراتور اتاق کنترل',
      title: 'گزارش شیفت تکنسین علیرضا رستمی',
      date: 'شیفت صبح امروز',
      icon: UserCheck,
      color: 'border-amber-500 bg-amber-950/40 text-amber-300',
      badgeColor: 'bg-amber-500/20 text-amber-300',
      details:
        '«در بازرسی چشمی ساعت ۰۹:۴۰ صدای سوت و لرزش خفیف در یاتاقان حس شد. دمای بدنه با ترمومتر لیزری ۶۸ درجه قرائت گردید.»',
      links: [],
    },
    {
      id: 'historical_incident',
      type: 'حادثه تاریخی در بایگانی',
      title: 'حادثه گریپاژ شفت کمپرسور در آبان ۱۳۹۹',
      date: 'سوابق ۵ سال گذشته',
      icon: History,
      color: 'border-purple-500 bg-purple-950/40 text-purple-300',
      badgeColor: 'bg-purple-500/20 text-purple-300',
      details:
        'به علت نادیده‌گرفتن هشدار ارتعاش، بیرینگ خرد شده و روتور قفل کرد. خسارت مستقیم: ۵ روز توقف خط و ۲.۳ میلیارد تومان هزینه بازسازی.',
      links: [],
    },
    {
      id: 'spare_part',
      type: 'قطعه در انبار مرکزی ERP',
      title: 'موجودی انبار: رولربیرینگ SKF 6314-2Z',
      date: 'انبار قطعات یدکی پتروشیمی',
      icon: Boxes,
      color: 'border-cyan-500 bg-cyan-950/40 text-cyan-300',
      badgeColor: 'bg-cyan-500/20 text-cyan-300',
      details:
        'تعداد موجود: ۲ عدد. موقعیت قفسه: B-14-02. پیش‌فاکتور خرید تامین‌کننده داخلی در سیستم تدارکات ثبت شده است.',
      links: [],
    },
  ];

  const activeNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  return (
    <div className="w-full max-w-[1920px] mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <GitFork size={20} />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">{t('hafeze_header_title')}</h1>
              <span className="text-xs text-sky-400 font-mono">{t('hafeze_header_sub')}</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">
            {t('hafeze_header_desc')}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs">
          <Sparkles size={16} className="text-sky-400 shrink-0" />
          <div>
            <div className="font-bold text-white">{t('hafeze_graph_badge')}</div>
            <div className="text-[10px] text-slate-400">{t('hafeze_graph_nodes_count')}</div>
          </div>
        </div>
      </div>

      {/* Interactive Graph Canvas & Linked Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Graph Node Network (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <GitFork size={16} className="text-sky-400" />
              {t('hafeze_network_title')}
            </h2>
            <span className="text-xs font-mono text-slate-400">{t('hafeze_network_hint')}</span>
          </div>

          {/* Node Grid Layout representing the graph */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {nodes.map((node) => {
              const Icon = node.icon;
              const isSelected = selectedNodeId === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all relative ${
                    isSelected
                      ? `${node.color} ring-2 ring-sky-500 shadow-xl shadow-sky-500/10`
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${node.badgeColor}`}>
                      {node.type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{node.date}</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Icon size={18} className="shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1 text-start">
                      <h3 className="font-bold text-xs text-white leading-snug">{node.title}</h3>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {node.details}
                      </p>
                    </div>
                  </div>

                  {node.links.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>پیوند به: {node.links.length} رکورد سازمانی</span>
                      {isRtl ? <ChevronLeft size={12} className="text-sky-400" /> : <ChevronRight size={12} className="text-sky-400" />}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Node Details Panel (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="border-b border-slate-800 pb-3 text-start">
              <span className="text-[10px] font-mono text-sky-400 uppercase">{activeNode.type}</span>
              <h3 className="font-bold text-base text-white mt-1">{activeNode.title}</h3>
              <div className="text-xs text-slate-400 mt-1">{activeNode.date}</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-start">
              <div className="text-xs font-semibold text-slate-300">{t('hafeze_linked_details')}</div>
              <p className="text-xs text-slate-300 leading-relaxed">{activeNode.details}</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs text-start">
              <div className="font-semibold text-slate-300">{t('hafeze_related_nodes')}</div>
              {activeNode.links.length === 0 ? (
                <div className="text-slate-500 text-[11px]">Leaf Node</div>
              ) : (
                <div className="space-y-1.5">
                  {activeNode.links.map((linkId) => {
                    const targetNode = nodes.find((n) => n.id === linkId);
                    if (!targetNode) return null;
                    return (
                      <button
                        key={linkId}
                        onClick={() => setSelectedNodeId(linkId)}
                        className="w-full text-start p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] text-sky-300 flex items-center justify-between border border-slate-800 transition-colors"
                      >
                        <span className="truncate">{targetNode.title}</span>
                        {isRtl ? <ArrowLeft size={12} className="shrink-0" /> : <ArrowRight size={12} className="shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <a
              href="#/truth-block"
              className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs text-center flex items-center justify-center gap-2 transition-colors"
            >
              <span>{t('nav_truth_block')}</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  AlertTriangle,
  Wrench,
  ShieldCheck,
  CheckCheck,
  Trash2,
  ExternalLink,
  Check,
  X,
  Info,
  Flame,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NotificationCategory, IndustrialNotification } from '../../types';

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadNotifsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearReadNotifications,
    language,
    t,
    setSelectedAssetId
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NotificationCategory | 'all'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Filter notifications by category
  const filteredNotifs = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    return n.category === activeTab;
  });

  const getNotificationTitle = (n: IndustrialNotification): string => {
    if (language === 'en') return n.titleEn || n.titleFa;
    if (language === 'ar') return n.titleAr || n.titleFa;
    if (language === 'tr') return n.titleTr || n.titleEn || n.titleFa;
    return n.titleFa;
  };

  const getNotificationMessage = (n: IndustrialNotification): string => {
    if (language === 'en') return n.messageEn || n.messageFa;
    if (language === 'ar') return n.messageAr || n.messageFa;
    if (language === 'tr') return n.messageTr || n.messageEn || n.messageFa;
    return n.messageFa;
  };

  const getActionLabel = (n: IndustrialNotification): string => {
    if (language === 'en' || language === 'tr') {
      return n.actionLabelEn || 'View Detail';
    }
    return n.actionLabelFa || 'مشاهده جزئیات';
  };

  const handleActionClick = (n: IndustrialNotification) => {
    markNotificationAsRead(n.id);
    if (n.assetId) {
      setSelectedAssetId(n.assetId);
    }
    if (n.actionRoute) {
      window.location.hash = n.actionRoute;
    }
    setIsOpen(false);
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          badge: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
          indicator: 'bg-rose-500',
          icon: <Flame size={14} className="text-rose-400 shrink-0" />,
          label: t('notif_critical')
        };
      case 'warning':
        return {
          badge: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
          indicator: 'bg-amber-500',
          icon: <AlertTriangle size={14} className="text-amber-400 shrink-0" />,
          label: t('notif_warning')
        };
      case 'success':
        return {
          badge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
          indicator: 'bg-emerald-500',
          icon: <ShieldCheck size={14} className="text-emerald-400 shrink-0" />,
          label: t('notif_success')
        };
      case 'info':
      default:
        return {
          badge: 'bg-sky-500/15 text-sky-400 border border-sky-500/30',
          indicator: 'bg-sky-500',
          icon: <Info size={14} className="text-sky-400 shrink-0" />,
          label: t('notif_info')
        };
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button Trigger */}
      <button
        id="notification-center-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 hover:bg-slate-700 text-slate-300 dark:text-slate-300 light:text-slate-700 border border-slate-700/60 dark:border-slate-700/60 light:border-slate-200 transition-colors focus:outline-none"
        title={t('notif_title')}
        aria-label="مرکز اعلانات"
      >
        <Bell size={16} />
        {unreadNotifsCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-mono font-bold text-white shadow-lg shadow-rose-500/40">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-60" />
            <span className="relative z-10">{unreadNotifsCount}</span>
          </span>
        )}
      </button>

      {/* Notification Center Dropdown */}
      {isOpen && (
        <div
          id="notification-center-dropdown"
          className="absolute rtl:left-0 ltr:right-0 mt-2 w-[340px] sm:w-[420px] bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[560px]"
        >
          {/* Header */}
          <div className="p-3.5 border-b border-slate-800 dark:border-slate-800 light:border-slate-200 bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <Bell size={15} />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-100 dark:text-slate-100 light:text-slate-900 leading-tight">
                  {t('notif_title')}
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  {unreadNotifsCount} {t('notif_unread_badge')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {unreadNotifsCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="px-2 py-1 text-[11px] font-medium text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 rounded-lg transition-colors flex items-center gap-1"
                  title={t('notif_mark_all_read')}
                >
                  <CheckCheck size={13} />
                  <span className="hidden sm:inline">{t('notif_mark_all_read')}</span>
                </button>
              )}
              <button
                onClick={clearReadNotifications}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                title={t('notif_clear')}
              >
                <Trash2 size={13} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 p-1.5 border-b border-slate-800 dark:border-slate-800 light:border-slate-200 bg-slate-950/40 dark:bg-slate-950/40 light:bg-slate-100 text-[11px]">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-colors text-center ${
                activeTab === 'all'
                  ? 'bg-slate-800 dark:bg-slate-800 light:bg-white text-white dark:text-white light:text-slate-900 shadow-sm border border-slate-700/60 dark:border-slate-700/60 light:border-slate-200'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('notif_all')}
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-colors text-center flex items-center justify-center gap-1 ${
                activeTab === 'system'
                  ? 'bg-slate-800 dark:bg-slate-800 light:bg-white text-rose-400 shadow-sm border border-slate-700/60 dark:border-slate-700/60 light:border-slate-200'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertTriangle size={12} />
              <span>{t('notif_system')}</span>
            </button>
            <button
              onClick={() => setActiveTab('maintenance')}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-colors text-center flex items-center justify-center gap-1 ${
                activeTab === 'maintenance'
                  ? 'bg-slate-800 dark:bg-slate-800 light:bg-white text-amber-400 shadow-sm border border-slate-700/60 dark:border-slate-700/60 light:border-slate-200'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wrench size={12} />
              <span>{t('notif_maintenance')}</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-colors text-center flex items-center justify-center gap-1 ${
                activeTab === 'security'
                  ? 'bg-slate-800 dark:bg-slate-800 light:bg-white text-emerald-400 shadow-sm border border-slate-700/60 dark:border-slate-700/60 light:border-slate-200'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck size={12} />
              <span>{t('notif_security')}</span>
            </button>
          </div>

          {/* List of Notifications */}
          <div className="overflow-y-auto divide-y divide-slate-800/60 dark:divide-slate-800/60 light:divide-slate-200 flex-1 p-1">
            {filteredNotifs.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-slate-800/50 dark:bg-slate-800/50 light:bg-slate-100 flex items-center justify-center text-slate-400">
                  <Bell size={20} />
                </div>
                <p className="text-xs text-slate-400 font-medium">{t('notif_empty')}</p>
              </div>
            ) : (
              filteredNotifs.map((n) => {
                const style = getSeverityStyle(n.severity);
                return (
                  <div
                    key={n.id}
                    className={`p-3 rounded-xl transition-all ${
                      !n.read
                        ? 'bg-slate-800/40 dark:bg-slate-800/40 light:bg-sky-50/50 hover:bg-slate-800/70'
                        : 'hover:bg-slate-800/20 light:hover:bg-slate-50 opacity-80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${style.badge}`}>
                          {style.icon}
                          <span>{style.label}</span>
                        </span>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                        )}
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                          <Clock size={11} />
                          {n.timestamp}
                        </span>
                      </div>

                      {!n.read && (
                        <button
                          onClick={() => markNotificationAsRead(n.id)}
                          className="text-slate-400 hover:text-emerald-400 p-1 rounded-md transition-colors"
                          title="علامت‌گذاری به‌عنوان خوانده‌شده"
                        >
                          <Check size={13} />
                        </button>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 mb-1 leading-snug">
                      {getNotificationTitle(n)}
                    </h4>

                    <p className="text-[11px] text-slate-300 dark:text-slate-300 light:text-slate-600 leading-relaxed mb-2">
                      {getNotificationMessage(n)}
                    </p>

                    {n.actionRoute && (
                      <button
                        onClick={() => handleActionClick(n)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-400 hover:text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 px-2.5 py-1 rounded-lg border border-sky-500/20 transition-colors"
                      >
                        <span>{getActionLabel(n)}</span>
                        <ExternalLink size={12} />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

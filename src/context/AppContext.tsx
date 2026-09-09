import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Asset, FaultScenario, TruthBlock, TwinMaturityMode, UserProfile, SupportedLanguage, ThemeMode, IndustrialNotification } from '../types';
import { dataEngine, INITIAL_ASSETS } from '../services/syntheticData';
import { TRANSLATIONS, SUPPORTED_LANGUAGES, LanguageInfo } from '../i18n/translations';
import { INITIAL_NOTIFICATIONS } from '../data/notificationsData';

export const USER_PROFILES: UserProfile[] = [
  {
    id: 'user-shafiee',
    name: 'دکتر علی شفیعی‌زاده',
    nameFa: 'دکتر علی شفیعی‌زاده',
    role: 'admin',
    roleTitleFa: 'مدیر ارشد پروژه و استقرار پلتفرم صنعتی ویستا',
    email: 'a.shafiee@vistapower.ir',
    // Distinguished male professional portrait:
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
    permissions: [
      'مدیریت کلان پروژه و استقرار دوقلوهای دیجیتال',
      'ممیزی بلوک حقیقت و زنجیره شواهد',
      'تأیید فرامین خودکار ویستا-نظم‌گر',
      'تنظیم آستانه‌های استاندارد ویستا-پاسدار',
      'تخصیص سطوح دسترسی کاربران صنعتی',
    ],
  },
  {
    id: 'user-bakhshi',
    name: 'مهندس مسعود بخشی',
    nameFa: 'مهندس مسعود بخشی',
    role: 'admin',
    roleTitleFa: 'مدیرعامل شرکت شبکه هوشمند ابتکار ویستا',
    email: 'm.bakhshi@vistapower.ir',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    permissions: ['مدیریت کلان پلتفرم صنعتی', 'تصمیم‌گیری استراتژیک بار و انرژی', 'تأیید تفاهم‌نامه‌ها و قراردادها'],
  },
  {
    id: 'user-kavyani',
    name: 'مهندس آریا کاویانی',
    nameFa: 'مهندس آریا کاویانی',
    role: 'reliability_engineer',
    roleTitleFa: 'سرپرست قابلیت اطمینان و آنالیز ارتعاشات',
    email: 'kavyani@industry.ir',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    permissions: ['آنالیز FFT و طیف فرکانسی', 'تنظیم پارامترهای سناریو', 'تحلیل RUL و پیش‌بینی خرابی', 'اتصال به سیستم CMMS'],
  },
  {
    id: 'user-rostami',
    name: 'علیرضا رستمی',
    nameFa: 'علیرضا رستمی',
    role: 'operator',
    roleTitleFa: 'تکنسین ارشد اتاق کنترل و پایپ‌لاین',
    email: 'rostami.control@industry.ir',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    permissions: ['دیده‌بانی برخط تجهیزات', 'تأیید هشدارهای اضطراری', 'ثبت گزارش‌های نوبتی در ویستا-حافظه'],
  },
  {
    id: 'user-mahdavi',
    name: 'سارا مهدوی',
    nameFa: 'سارا مهدوی',
    role: 'auditor',
    roleTitleFa: 'بازرس ممیزی حقیقت داده و استاندارد ISO 55000',
    email: 's.mahdavi@audit-cert.org',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    permissions: ['راستی‌آزمایی هش رمزنگاری بلوک حقیقت', 'بررسی شناسنامه کالیبراسیون حسگرها', 'استخراج گزارش لاگ ممیزی'],
  },
];

interface AppContextType {
  assets: Asset[];
  selectedAsset: Asset;
  selectedAssetId: string;
  setSelectedAssetId: (id: string) => void;
  truthBlocks: TruthBlock[];
  activeScenario: FaultScenario | null;
  setScenario: (id: string | null) => void;
  twinMaturity: TwinMaturityMode;
  setTwinMaturity: (mode: TwinMaturityMode) => void;
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  login: (user?: UserProfile) => void;
  logout: () => void;
  isSimRunning: boolean;
  toggleSimulation: () => void;
  simSpeed: number;
  setSimSpeed: (speed: number) => void;
  resetSimulation: () => void;
  historicalPlaybackTime: number | null;
  setHistoricalPlaybackTime: (time: number | null) => void;
  
  // Theme & Language (i18n)
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  toggleTheme: () => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
  currentLanguageInfo: LanguageInfo;

  // Notifications Center
  notifications: IndustrialNotification[];
  unreadNotifsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearReadNotifications: () => void;
  addNotification: (notif: IndustrialNotification) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('compressor-04');
  const [truthBlocks, setTruthBlocks] = useState<TruthBlock[]>([]);
  const [activeScenario, setActiveScenarioState] = useState<FaultScenario | null>(null);
  const [twinMaturity, setTwinMaturity] = useState<TwinMaturityMode>('informative');
  const [currentUser, setCurrentUser] = useState<UserProfile>(USER_PROFILES[0]);
  const [notifications, setNotifications] = useState<IndustrialNotification[]>(INITIAL_NOTIFICATIONS);
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('vista_authenticated') === 'true';
  });

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('vista_theme') as ThemeMode) || 'dark';
  });

  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem('vista_lang') as SupportedLanguage) || 'fa';
  });

  const [isSimRunning, setIsSimRunning] = useState<boolean>(true);
  const [simSpeed, setSimSpeedState] = useState<number>(1);
  const [historicalPlaybackTime, setHistoricalPlaybackTime] = useState<number | null>(null);

  // Sync theme changes to document with smooth CSS transition
  useEffect(() => {
    localStorage.setItem('vista_theme', theme);
    const root = document.documentElement;
    root.classList.add('theme-transition');
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    const timer = setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 380);
    return () => clearTimeout(timer);
  }, [theme]);

  // Sync language and direction changes
  useEffect(() => {
    localStorage.setItem('vista_lang', language);
    const isRtl = language === 'fa' || language === 'ar';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
  };

  const currentLanguageInfo = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const t = (key: string): string => {
    if (TRANSLATIONS[language] && TRANSLATIONS[language][key]) {
      return TRANSLATIONS[language][key];
    }
    if (TRANSLATIONS['fa'] && TRANSLATIONS['fa'][key]) {
      return TRANSLATIONS['fa'][key];
    }
    return key;
  };

  const login = (user?: UserProfile) => {
    if (user) {
      setCurrentUser(user);
    }
    setIsAuthenticated(true);
    localStorage.setItem('vista_authenticated', 'true');
    // Navigate directly to the main industrial truth dashboard
    window.location.hash = '#/didban';
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('vista_authenticated');
    window.location.hash = '#/login';
  };

  // Simulation tick loop
  useEffect(() => {
    const interval = setInterval(() => {
      const result = dataEngine.tick(1000);
      setAssets(result.assets);
      if (result.newTruthBlocks.length > 0) {
        setTruthBlocks((prev) => [...result.newTruthBlocks.slice(0, 3), ...prev].slice(0, 100));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const setScenario = (id: string | null) => {
    dataEngine.setScenario(id);
    const sc = dataEngine.getActiveScenario();
    setActiveScenarioState(sc);
    if (sc) {
      const targetId = sc.assetId || 'compressor-04';
      const scenarioAlert: IndustrialNotification = {
        id: `notif-scenario-${Date.now()}`,
        category: 'system',
        severity: 'critical',
        titleFa: `تزریق سناریوی بحرانی: ${sc.titleFa || 'سناریوی ارتعاشی'}`,
        titleEn: `Critical Fault Injected: ${sc.titleEn || 'Fault Scenario'}`,
        titleAr: `حقن سيناريو العطل: ${sc.titleFa || 'سيناريو'}`,
        titleTr: `Arıza Senaryosu Eklendi: ${sc.titleEn || 'Arıza'}`,
        messageFa: `آستانه‌های فیزیکی و امضای ارتعاشی تغییر یافتند. پیامد فیزیکی: ${sc.impactSummaryFa || sc.descriptionFa || 'ورود به محدوده هشدار'}`,
        messageEn: `Physical thresholds and vibration signatures altered: ${sc.description || 'Elevated vibration levels'}`,
        timestamp: 'هم‌اکنون',
        read: false,
        assetId: targetId,
        actionRoute: targetId === 'compressor-04' ? '#/vibration' : '#/twin',
        actionLabelFa: 'بررسی در دوقلوی دیجیتال',
        actionLabelEn: 'Inspect in Digital Twin',
      };
      setNotifications((prev) => [scenarioAlert, ...prev]);
    }
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearReadNotifications = () => {
    setNotifications((prev) => prev.filter((n) => !n.read));
  };

  const addNotification = (notif: IndustrialNotification) => {
    setNotifications((prev) => [notif, ...prev]);
  };

  const toggleSimulation = () => {
    const running = dataEngine.togglePause();
    setIsSimRunning(running);
  };

  const setSimSpeed = (speed: number) => {
    dataEngine.setSpeed(speed);
    setSimSpeedState(speed);
  };

  const resetSimulation = () => {
    dataEngine.reset();
    setActiveScenarioState(null);
    setAssets(INITIAL_ASSETS);
    setTruthBlocks([]);
    setHistoricalPlaybackTime(null);
  };

  const selectedAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];

  return (
    <AppContext.Provider
      value={{
        assets,
        selectedAsset,
        selectedAssetId,
        setSelectedAssetId,
        truthBlocks,
        activeScenario,
        setScenario,
        twinMaturity,
        setTwinMaturity,
        currentUser,
        setCurrentUser,
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        isSimRunning,
        toggleSimulation,
        simSpeed,
        setSimSpeed,
        resetSimulation,
        historicalPlaybackTime,
        setHistoricalPlaybackTime,
        theme,
        setTheme,
        toggleTheme,
        language,
        setLanguage,
        t,
        currentLanguageInfo,
        notifications,
        unreadNotifsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearReadNotifications,
        addNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;

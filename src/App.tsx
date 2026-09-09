import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { DidbanDashboard } from './pages/DidbanDashboard';
import { PasdarDashboard } from './pages/PasdarDashboard';
import { NazmgarDashboard } from './pages/NazmgarDashboard';
import { VibrationPage } from './pages/VibrationPage';
import { WhatIfPage } from './pages/WhatIfPage';
import { TruthBlockExplorerPage } from './pages/TruthBlockExplorerPage';
import { HafezePage } from './pages/HafezePage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { ProposalsContractsPage } from './pages/ProposalsContractsPage';
import { GuidePage } from './pages/GuidePage';
import { LoginPage } from './pages/LoginPage';
import { RealTimeDashboard } from './components/dashboard/RealTimeDashboard';
import { MaintenanceLog } from './components/maintenance/MaintenanceLog';
import { TechnicalDiagramAnnotation } from './components/documents/TechnicalDiagramAnnotation';
import { DocumentKnowledgeGraph } from './components/documents/DocumentKnowledgeGraph';
import { DocumentComparison } from './components/documents/DocumentComparison';
import { OfflineDocsManager } from './components/documents/OfflineDocsManager';
import { SchematicInteractiveOverlay } from './components/documents/SchematicInteractiveOverlay';

const AppContent: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>(window.location.hash || '#/');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { setSelectedAssetId, theme, isAuthenticated } = useApp();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/';
      setCurrentRoute(hash);

      // Extract assetId if route contains dynamic segment
      // e.g. #/vibration/compressor-04 or #/what-if/motor-01
      const parts = hash.split('/');
      if (parts.length >= 3 && parts[2]) {
        setSelectedAssetId(parts[2]);
      }

      // Close mobile drawer on route change
      setSidebarOpen(false);

      // Scroll to top on navigation
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial call
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setSelectedAssetId]);

  // Public views that NEVER display the dashboard sidebar
  const isFullPageView =
    currentRoute === '#/' ||
    currentRoute === '' ||
    currentRoute === '#/landing' ||
    currentRoute === '#/login';

  // Check if current route is an operational dashboard route requiring authentication
  const isOperationalDashboardRoute =
    currentRoute.startsWith('#/didban') ||
    currentRoute.startsWith('#/twin') ||
    currentRoute.startsWith('#/realtime') ||
    currentRoute.startsWith('#/maintenance') ||
    currentRoute.startsWith('#/annotations') ||
    currentRoute.startsWith('#/knowledge-graph') ||
    currentRoute.startsWith('#/doc-comparison') ||
    currentRoute.startsWith('#/offline-docs') ||
    currentRoute.startsWith('#/schematic-overlay') ||
    currentRoute.startsWith('#/pasdar') ||
    currentRoute.startsWith('#/nazmgar') ||
    currentRoute.startsWith('#/hafeze') ||
    currentRoute.startsWith('#/vibration') ||
    currentRoute.startsWith('#/what-if') ||
    currentRoute.startsWith('#/truth-block');

  // Route Dispatcher
  const renderRoute = () => {
    // If not authenticated and trying to access operational dashboard, guide to Login page
    if (!isAuthenticated && isOperationalDashboardRoute) {
      return <LoginPage />;
    }

    if (currentRoute === '#/' || currentRoute === '' || currentRoute === '#/landing') {
      return <LandingPage />;
    }
    if (currentRoute.startsWith('#/twin')) {
      return <DigitalTwinPage />;
    }
    if (currentRoute.startsWith('#/realtime')) {
      return <RealTimeDashboard onNavigateTo3D={() => { window.location.hash = '#/twin'; }} />;
    }
    if (currentRoute.startsWith('#/maintenance')) {
      return <MaintenanceLog />;
    }
    if (currentRoute.startsWith('#/annotations')) {
      return <TechnicalDiagramAnnotation />;
    }
    if (currentRoute.startsWith('#/knowledge-graph')) {
      return <DocumentKnowledgeGraph />;
    }
    if (currentRoute.startsWith('#/doc-comparison')) {
      return <DocumentComparison />;
    }
    if (currentRoute.startsWith('#/offline-docs')) {
      return <OfflineDocsManager />;
    }
    if (currentRoute.startsWith('#/schematic-overlay')) {
      return <SchematicInteractiveOverlay />;
    }
    if (currentRoute.startsWith('#/didban')) {
      return <DidbanDashboard />;
    }
    if (currentRoute.startsWith('#/pasdar')) {
      return <PasdarDashboard />;
    }
    if (currentRoute.startsWith('#/nazmgar')) {
      return <NazmgarDashboard />;
    }
    if (currentRoute.startsWith('#/vibration')) {
      return <VibrationPage />;
    }
    if (currentRoute.startsWith('#/what-if')) {
      return <WhatIfPage />;
    }
    if (currentRoute.startsWith('#/truth-block')) {
      return <TruthBlockExplorerPage />;
    }
    if (currentRoute.startsWith('#/hafeze')) {
      return <HafezePage />;
    }
    if (currentRoute.startsWith('#/architecture')) {
      return <ArchitecturePage />;
    }
    if (currentRoute.startsWith('#/proposals-contracts')) {
      return <ProposalsContractsPage />;
    }
    if (currentRoute.startsWith('#/guide')) {
      return <GuidePage />;
    }
    if (currentRoute.startsWith('#/login')) {
      return <LoginPage />;
    }

    return <LandingPage />;
  };

  // Only show sidebar when the user is logged in AND not on a full-page landing/login view
  const shouldShowSidebar = isAuthenticated && !isFullPageView;

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors selection:bg-sky-600 selection:text-white ${
        theme === 'dark' ? 'bg-[#070c17] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top Fixed Navigation Bar - permanently fixed, never scrolls */}
      <Navbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isFullPageView={!shouldShowSidebar}
      />

      {/* Fixed Navbar Height Compensator (64px / h-16) */}
      <div className="h-16 shrink-0 w-full" aria-hidden="true" />

      {/* Main Structural Body */}
      <div className="flex-1 flex w-full relative">
        {/* Unified Responsive Industrial Sidebar */}
        <Sidebar
          currentRoute={currentRoute}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isFullPageView={!shouldShowSidebar}
        />

        {/* Dynamic Page Content Area */}
        <main className="flex-1 w-full max-w-[1920px] mx-auto min-w-0 px-3 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-x-hidden">
          {renderRoute()}
        </main>
      </div>

      {/* Global Comprehensive Industrial Footer */}
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

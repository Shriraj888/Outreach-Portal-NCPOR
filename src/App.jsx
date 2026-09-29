import { useState, useEffect, useRef, useCallback } from 'react';
import { PortalProvider } from './context/PortalContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Expeditions from './pages/Expeditions';
import ExpeditionDetail from './pages/ExpeditionDetail';
import PolarMap from './pages/PolarMap';
import Publications from './pages/Publications';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import UploadStudio from './pages/admin/UploadStudio';
import ExpeditionForm from './pages/admin/ExpeditionForm';
import AIGenerateStudio from './pages/admin/AIGenerateStudio';
import SelectiveAIStudio from './pages/admin/SelectiveAIStudio';
import { routeToHash, hashToRoute } from './utils/routes';
import './App.css';

function MainApp() {
  // Parse initial route from window.location.hash on mount
  const initial = hashToRoute(window.location.hash);
  const [currentRoute, setCurrentRoute] = useState(initial.route);
  const [selectedExpeditionId, setSelectedExpeditionId] = useState(initial.params.expeditionId || null);
  const navCountRef = useRef(0);

  // Page transition state
  const [displayedRoute, setDisplayedRoute] = useState(initial.route);
  const [pageTransition, setPageTransition] = useState(''); // '', 'page-exit', 'page-enter'
  const transitionTimerRef = useRef(null);
  const prevRouteRef = useRef(initial.route);

  // Trigger page transition whenever currentRoute changes
  useEffect(() => {
    if (currentRoute === prevRouteRef.current) return;
    prevRouteRef.current = currentRoute;

    // Start exit animation
    setPageTransition('page-exit');
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = setTimeout(() => {
      setDisplayedRoute(currentRoute);
      setPageTransition('page-enter');
      transitionTimerRef.current = setTimeout(() => {
        setPageTransition('');
      }, 350);
    }, 250);

    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, [currentRoute]);

  // Synchronize hash changes from browser Back & Forward navigation or URL bar edits
  useEffect(() => {
    // If initially no hash, normalize to '#/' without creating extra history entry
    if (!window.location.hash) {
      window.history.replaceState(null, '', '#/');
    }

    const handleHashChange = () => {
      const parsed = hashToRoute(window.location.hash);
      setCurrentRoute(parsed.route);
      if (parsed.params.expeditionId) {
        setSelectedExpeditionId(parsed.params.expeditionId);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = useCallback((route, params = {}) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navCountRef.current += 1;

    let finalParams = { ...params };
    if (route === 'expedition-detail' && selectedExpeditionId && !finalParams.expeditionId) {
      finalParams.expeditionId = selectedExpeditionId;
    } else if (route.startsWith('expedition-') && route !== 'expedition-detail') {
      finalParams.expeditionId = route.replace('expedition-', '');
    }

    const targetHash = routeToHash(route, finalParams);
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    } else {
      setCurrentRoute(route);
      if (finalParams.expeditionId) {
        setSelectedExpeditionId(finalParams.expeditionId);
      }
    }
  }, [selectedExpeditionId]);

  const handleSelectExpedition = useCallback((id) => {
    setSelectedExpeditionId(id);
    navigateTo('expedition-detail', { expeditionId: id });
  }, [navigateTo]);

  const handleBack = useCallback((fallbackRoute = 'home') => {
    if (navCountRef.current > 0 && window.history.length > 1) {
      window.history.back();
    } else {
      navigateTo(fallbackRoute);
    }
  }, [navigateTo]);

  const renderContent = () => {
    const route = displayedRoute;
    // Detail route
    if (route === 'expedition-detail' || route.startsWith('expedition-')) {
      const expId = route.startsWith('expedition-') && route !== 'expedition-detail'
        ? route.replace('expedition-', '')
        : (selectedExpeditionId || 'isea-43');
      return (
        <ExpeditionDetail 
          expeditionId={expId}
          onBack={() => handleBack('expeditions')}
          navigateTo={navigateTo}
        />
      );
    }

    // Admin Routes
    if (route === 'admin-login') {
      return <AdminLogin navigateTo={navigateTo} />;
    }

    if (route === 'admin-dashboard') {
      return (
        <AdminDashboard 
          navigateTo={navigateTo} 
          onSelectExpedition={handleSelectExpedition} 
        />
      );
    }

    if (route === 'admin-upload' || route.startsWith('admin-upload-')) {
      const category = route.startsWith('admin-upload-') 
        ? route.replace('admin-upload-', '') 
        : 'reports';
      return (
        <UploadStudio 
          initialCategory={category}
          onBack={() => handleBack('admin-dashboard')} 
          navigateTo={navigateTo} 
        />
      );
    }

    if (route === 'admin-new-expedition') {
      return (
        <UploadStudio 
          initialCategory="reports"
          onBack={() => handleBack('admin-dashboard')} 
          navigateTo={navigateTo} 
        />
      );
    }

    if (route.startsWith('admin-edit-')) {
      const expId = route.replace('admin-edit-', '');
      return (
        <ExpeditionForm 
          expeditionId={expId}
          onBack={() => handleBack('admin-dashboard')} 
          navigateTo={navigateTo} 
        />
      );
    }

    if (route.startsWith('admin-generate-')) {
      const expId = route.replace('admin-generate-', '');
      return (
        <AIGenerateStudio 
          expeditionId={expId}
          onBack={() => handleBack('admin-dashboard')} 
          navigateTo={navigateTo}
          onSelectExpedition={handleSelectExpedition}
        />
      );
    }

    if (route === 'admin-selective-ai' || route.startsWith('admin-selective-ai-')) {
      const assetId = route.startsWith('admin-selective-ai-')
        ? route.replace('admin-selective-ai-', '')
        : null;
      return (
        <SelectiveAIStudio 
          initialAssetId={assetId}
          onBack={() => handleBack('admin-dashboard')}
          navigateTo={navigateTo}
        />
      );
    }

    // Public Pages
    switch (route) {
      case 'expeditions':
        return (
          <Expeditions 
            onSelectExpedition={handleSelectExpedition} 
            navigateTo={navigateTo} 
          />
        );
      case 'map':
        return (
          <PolarMap 
            onSelectExpedition={handleSelectExpedition} 
            navigateTo={navigateTo} 
          />
        );
      case 'publications':
        return <Publications navigateTo={navigateTo} />;
      case 'home':
      default:
        return (
          <Home 
            navigateTo={navigateTo} 
            onSelectExpedition={handleSelectExpedition} 
          />
        );
    }
  };

  return (
    <div className="app-shell">
      <Header currentRoute={currentRoute} navigateTo={navigateTo} />
      <main className={`app-main-content ${pageTransition}`}>
        {renderContent()}
      </main>
      <Footer navigateTo={navigateTo} />
    </div>
  );
}

export default function App() {
  return (
    <PortalProvider>
      <MainApp />
    </PortalProvider>
  );
}

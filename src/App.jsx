import { useState } from 'react';
import { PortalProvider } from './context/PortalContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Expeditions from './pages/Expeditions';
import ExpeditionDetail from './pages/ExpeditionDetail';
import PolarMap from './pages/PolarMap';
import Learn from './pages/Learn';
import Publications from './pages/Publications';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ExpeditionForm from './pages/admin/ExpeditionForm';
import AIGenerateStudio from './pages/admin/AIGenerateStudio';
import './App.css';

function MainApp() {
  const [currentRoute, setCurrentRoute] = useState('home');
  const [selectedExpeditionId, setSelectedExpeditionId] = useState(null);

  const navigateTo = (route) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentRoute(route);
  };

  const handleSelectExpedition = (id) => {
    setSelectedExpeditionId(id);
    navigateTo('expedition-detail');
  };

  const renderContent = () => {
    // Detail route
    if (currentRoute === 'expedition-detail') {
      return (
        <ExpeditionDetail 
          expeditionId={selectedExpeditionId || 'isea-43'}
          onBack={() => navigateTo('expeditions')}
          navigateTo={navigateTo}
        />
      );
    }

    // Admin Routes
    if (currentRoute === 'admin-login') {
      return <AdminLogin navigateTo={navigateTo} />;
    }

    if (currentRoute === 'admin-dashboard') {
      return (
        <AdminDashboard 
          navigateTo={navigateTo} 
          onSelectExpedition={handleSelectExpedition} 
        />
      );
    }

    if (currentRoute === 'admin-new-expedition') {
      return (
        <ExpeditionForm 
          onBack={() => navigateTo('admin-dashboard')} 
          navigateTo={navigateTo} 
        />
      );
    }

    if (currentRoute.startsWith('admin-edit-')) {
      const expId = currentRoute.replace('admin-edit-', '');
      return (
        <ExpeditionForm 
          expeditionId={expId}
          onBack={() => navigateTo('admin-dashboard')} 
          navigateTo={navigateTo} 
        />
      );
    }

    if (currentRoute.startsWith('admin-generate-')) {
      const expId = currentRoute.replace('admin-generate-', '');
      return (
        <AIGenerateStudio 
          expeditionId={expId}
          onBack={() => navigateTo('admin-dashboard')} 
          navigateTo={navigateTo}
          onSelectExpedition={handleSelectExpedition}
        />
      );
    }

    // Public Pages
    switch (currentRoute) {
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
      case 'learn':
        return <Learn navigateTo={navigateTo} />;
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
      <main className="app-main-content">
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

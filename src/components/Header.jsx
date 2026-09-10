import { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  Compass, 
  Search, 
  Globe2, 
  Layers, 
  MapPin, 
  FileText, 
  Lock, 
  Sun, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

import IndiaFlag from './IndiaFlag';

export default function Header({ currentRoute, navigateTo }) {
  const { 
    lang, 
    toggleLang, 
    t, 
    a11y, 
    toggleHighContrast, 
    setFontSize, 
    auth, 
    logout,
    searchQuery, 
    setSearchQuery 
  } = usePortal();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t.nav.home, icon: Compass },
    { id: 'expeditions', label: t.nav.expeditions, icon: Layers },
    { id: 'map', label: t.nav.map, icon: MapPin },
    { id: 'publications', label: t.nav.publications, icon: FileText }
  ];

  const handleNav = (id) => {
    navigateTo(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      {/* Top Gov of India Tricolor Ribbon & A11y Toolbar */}
      <div className="gov-strip">
        <div className="container gov-strip-content">
          <div className="gov-title">
            <IndiaFlag width={18} height={12} className="gov-strip-flag" />
            <span className="gov-text gov-text-full">
              भारत सरकार | <strong>GOVERNMENT OF INDIA</strong> • MINISTRY OF EARTH SCIENCES
            </span>
            <span className="gov-text gov-text-short">
              भारत सरकार | <strong>GOVT. OF INDIA</strong> • MoES
            </span>
          </div>

          <div className="a11y-toolbar">
            {/* Font Scaler */}
            <div className="a11y-group" title="Adjust Text Size">
              <span className="a11y-label">Text:</span>
              <button 
                className={`a11y-btn ${a11y.fontSize === 'normal' ? 'active' : ''}`}
                onClick={() => setFontSize('normal')}
              >
                A
              </button>
              <button 
                className={`a11y-btn ${a11y.fontSize === 'large' ? 'active' : ''}`}
                onClick={() => setFontSize('large')}
              >
                A+
              </button>
              <button 
                className={`a11y-btn ${a11y.fontSize === 'larger' ? 'active' : ''}`}
                onClick={() => setFontSize('larger')}
              >
                A++
              </button>
            </div>

            {/* High Contrast Toggle */}
            <button 
              className={`a11y-toggle ${a11y.highContrast ? 'active' : ''}`}
              onClick={toggleHighContrast}
              title="Toggle High Contrast (WCAG-AA)"
            >
              <Sun size={13} />
              <span>{a11y.highContrast ? 'High Contrast ON' : 'Contrast'}</span>
            </button>

            {/* Language Switcher */}
            <button className="lang-toggle-btn" onClick={toggleLang}>
              <Globe2 size={13} />
              <span>{lang === 'en' ? 'हिन्दी (HI)' : 'English (EN)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="main-nav-bar">
        <div className="container nav-container">
          {/* Logo & Institute Identity */}
          <div className="brand-lockup" onClick={() => handleNav('home')} role="button" tabIndex={0}>
            <div className="brand-logo-container">
              <div className="brand-emblem-badge">
                <Compass className="brand-icon" size={24} />
              </div>
            </div>
            <div className="brand-text">
              <div className="brand-primary">
                {lang === 'hi' ? 'राष्ट्रीय ध्रुवीय एवं महासागर अनुसंधान केंद्र' : 'NCPOR'}
              </div>
              <div className="brand-secondary">
                {lang === 'hi' ? 'पृथ्वी विज्ञान मंत्रालय' : 'National Centre for Polar and Ocean Research'}
              </div>
              <div className="brand-tagline">
                Ministry of Earth Sciences, Govt. of India • Polar Science Outreach
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => handleNav(item.id)}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action CTAs: Admin & Quick Search */}
          <div className="nav-actions">
            {/* Quick Search */}
            <div className="search-input-wrapper">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                placeholder={lang === 'hi' ? "खोजें..." : "Search missions, stations..."}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentRoute !== 'expeditions' && e.target.value.length > 0) {
                    navigateTo('expeditions');
                  }
                }}
                className="header-search-input"
              />
              {searchQuery && (
                <button 
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Admin Portal Button */}
            {auth.isAuthenticated ? (
              <div className="admin-logged-group">
                <button 
                  className="btn-admin active"
                  onClick={() => handleNav('admin-dashboard')}
                >
                  <Sparkles size={14} />
                  <span>Admin Studio</span>
                </button>
                <button 
                  className="btn-logout"
                  onClick={logout}
                  title="Sign out of NCPOR Admin"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                className="btn-admin"
                onClick={() => handleNav('admin-login')}
              >
                <Lock size={13} />
                <span>NCPOR Staff</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-content">
            {/* Mobile Search Bar */}
            <div className="mobile-search-row">
              <Search size={16} className="mobile-search-icon" />
              <input
                type="text"
                placeholder={lang === 'hi' ? "मिशन या स्टेशन खोजें..." : "Search missions, stations..."}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentRoute !== 'expeditions' && e.target.value.length > 0) {
                    handleNav('expeditions');
                  }
                }}
                className="mobile-search-input"
              />
              {searchQuery && (
                <button 
                  className="mobile-clear-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="mobile-nav-list">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.id;
                return (
                  <button
                    key={item.id}
                    className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleNav(item.id)}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div className="mobile-divider"></div>

              {auth.isAuthenticated ? (
                <>
                  <button
                    className="mobile-nav-item admin-active"
                    onClick={() => handleNav('admin-dashboard')}
                  >
                    <Sparkles size={18} />
                    <span>Admin Studio Dashboard</span>
                  </button>
                  <button
                    className="mobile-nav-item"
                    onClick={logout}
                  >
                    <span>Sign Out</span>
                  </button> 
                </>
              ) : (
                <button
                  className="mobile-nav-item"
                  onClick={() => handleNav('admin-login')}
                >
                  <Lock size={18} />
                  <span>NCPOR Staff Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: #ffffff;
          border-bottom: 1px solid var(--border-subtle);
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
        }

        .gov-strip {
          background: #1e293b;
          border-bottom: 1px solid #0f172a;
          font-size: 0.75rem;
          color: #cbd5e1;
          padding: 0.4rem 0;
        }

        .gov-strip-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .gov-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.74rem;
          letter-spacing: 0.02em;
          color: #f1f5f9;
        }

        .gov-text-short {
          display: none;
        }

        .gov-strip-flag {
          border-radius: 2px;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.25);
          flex-shrink: 0;
        }

        .a11y-toolbar {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .a11y-group {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .a11y-label {
          font-size: 0.7rem;
          color: #94a3b8;
          margin-right: 2px;
        }

        .a11y-btn {
          background: transparent;
          border: none;
          color: #cbd5e1;
          padding: 1px 5px;
          font-size: 0.72rem;
          font-weight: 600;
          cursor: pointer;
          border-radius: 2px;
        }

        .a11y-btn.active, .a11y-btn:hover {
          background: #ffffff;
          color: #0f172a;
        }

        .a11y-toggle, .lang-toggle-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #e2e8f0;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.74rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .a11y-toggle:hover, .lang-toggle-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
          color: #ffffff;
        }

        .a11y-toggle.active {
          background: #d97706;
          color: #ffffff;
          font-weight: 700;
          border-color: #d97706;
        }

        .main-nav-bar {
          padding: 0.75rem 0;
          background: #ffffff;
          border-bottom: 1px solid #cbd5e1;
        }

        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }

        .brand-lockup {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          cursor: pointer;
          text-decoration: none;
        }

        .brand-emblem-badge {
          width: 42px;
          height: 42px;
          border-radius: 8px;
          background: var(--navy);
          border: 1px solid #0f2b5c;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fbbf24;
          box-shadow: 0 2px 5px rgba(10, 37, 64, 0.15);
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        .brand-primary {
          font-size: 1.18rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: var(--navy);
          line-height: 1.15;
        }

        .brand-secondary {
          font-size: 0.78rem;
          color: var(--text-secondary);
          font-weight: 500;
          line-height: 1.2;
        }

        .brand-tagline {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.5rem 0.85rem;
          border-radius: var(--radius-sm);
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--text-secondary);
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.15s ease;
          position: relative;
        }

        .nav-link:hover {
          color: var(--navy);
          background: #f1f5f9;
        }

        .nav-link.active {
          color: #065f46;
          background: #ecfdf5;
          border-color: #a7f3d0;
          font-weight: 600;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 0.75rem;
          color: var(--text-muted);
          pointer-events: none;
        }

        .header-search-input {
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          padding: 0.45rem 1.8rem 0.45rem 2.2rem;
          color: var(--text-primary);
          font-size: 0.82rem;
          width: 190px;
          transition: all 0.2s ease;
        }

        .header-search-input:focus {
          outline: none;
          border-color: var(--ice);
          width: 240px;
          background: #ffffff;
          box-shadow: 0 0 0 3px var(--ice-glow);
        }

        .clear-search-btn {
          position: absolute;
          right: 0.6rem;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 2px;
        }

        .btn-admin {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: #f1f5f9;
          color: var(--navy);
          border: 1px solid #cbd5e1;
          padding: 0.45rem 0.85rem;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-admin:hover, .btn-admin.active {
          background: var(--navy);
          border-color: var(--navy);
          color: #ffffff;
        }

        .admin-logged-group {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .btn-logout {
          background: #fee2e2;
          color: #b91c1c;
          border: 1px solid #fecaca;
          padding: 0.45rem 0.7rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-logout:hover {
          background: #fca5a5;
        }

        .mobile-menu-toggle {
          display: none;
          background: transparent;
          border: none;
          color: var(--navy);
          cursor: pointer;
          padding: 0.25rem;
        }

        .mobile-drawer {
          background: #ffffff;
          border-top: 1px solid var(--border-subtle);
          padding: 1rem;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .mobile-search-row {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 0.85rem;
        }

        .mobile-search-icon {
          position: absolute;
          left: 0.85rem;
          color: var(--text-muted);
          pointer-events: none;
        }

        .mobile-search-input {
          width: 100%;
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.65rem 2.2rem 0.65rem 2.5rem;
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .mobile-search-input:focus {
          outline: none;
          border-color: var(--ice);
          background: #ffffff;
          box-shadow: 0 0 0 3px var(--ice-glow);
        }

        .mobile-clear-btn {
          position: absolute;
          right: 0.75rem;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }

        .mobile-nav-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.8rem 1rem;
          border-radius: var(--radius-sm);
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          font-size: 0.92rem;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
          min-height: 46px;
        }

        .mobile-nav-item.active {
          background: #eff6ff;
          border-color: #bfdbfe;
          color: var(--navy);
          font-weight: 600;
        }

        .mobile-nav-item.admin-active {
          background: #ecfdf5;
          border-color: #a7f3d0;
          color: #047857;
          font-weight: 700;
        }

        .mobile-divider {
          height: 1px;
          background: var(--border-subtle);
          margin: 0.5rem 0;
        }

        @media (max-width: 1024px) {
          .desktop-nav {
            display: none;
          }
          .mobile-menu-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 40px;
            min-height: 40px;
          }
          .header-search-input {
            width: 140px;
          }
          .header-search-input:focus {
            width: 180px;
          }
        }

        @media (max-width: 860px) {
          .search-input-wrapper {
            display: none;
          }
          .brand-secondary, .brand-tagline {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .gov-text-full {
            display: none;
          }
          .gov-text-short {
            display: inline;
          }
          .gov-title {
            font-size: 0.7rem;
          }
          .brand-primary {
            font-size: 1.05rem;
          }
          .brand-emblem-badge {
            width: 36px;
            height: 36px;
          }
          .a11y-label {
            display: none;
          }
          .a11y-toolbar {
            gap: 0.35rem;
          }
          .a11y-toggle span {
            display: none;
          }
          .a11y-toggle {
            padding: 4px 6px;
          }
        }

        @media (max-width: 480px) {
          .nav-container {
            gap: 0.75rem;
          }
          .btn-admin span {
            display: none;
          }
          .btn-admin {
            padding: 0.45rem 0.55rem;
          }
          .admin-logged-group .btn-admin span {
            display: none;
          }
          .btn-logout {
            padding: 0.45rem 0.55rem;
          }
        }
      `}</style>
    </header>
  );
}

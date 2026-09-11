import { useState, useEffect, useRef } from 'react';
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
  Sparkles,
  ChevronRight
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
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === '/' && 
        document.activeElement !== searchInputRef.current && 
        document.activeElement?.tagName !== 'INPUT' && 
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

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
            <span className="gov-text gov-text-micro">
              भारत सरकार | <strong>MoES</strong>
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
              <span className="lang-text-full">{lang === 'en' ? 'हिन्दी (HI)' : 'English (EN)'}</span>
              <span className="lang-text-short">{lang === 'en' ? 'हिन्दी' : 'EN'}</span>
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
                <Compass className="brand-icon" size={23} />
              </div>
            </div>
            <div className="brand-text">
              <div className="brand-primary">
                {lang === 'hi' ? 'राष्ट्रीय ध्रुवीय एवं महासागर अनुसंधान केंद्र' : 'NCPOR'}
              </div>
              <div className="brand-secondary">
                {lang === 'hi' ? 'राष्ट्रीय ध्रुवीय एवं महासागर अनुसंधान केंद्र' : 'National Centre for Polar and Ocean Research'}
              </div>
              <div className="brand-tagline">
                {lang === 'hi' ? 'पृथ्वी विज्ञान मंत्रालय, भारत सरकार' : 'Ministry of Earth Sciences, Govt. of India'}
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
              <Search size={14} className="search-icon" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={lang === 'hi' ? "खोजें..." : "Search missions..."}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentRoute !== 'expeditions' && e.target.value.length > 0) {
                    navigateTo('expeditions');
                  }
                }}
                className="header-search-input"
              />
              {searchQuery ? (
                <button 
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                  type="button"
                >
                  <X size={12} />
                </button>
              ) : (
                <kbd className="search-kbd-hint" title="Press / to search" onClick={() => searchInputRef.current?.focus()}>/</kbd>
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

      {/* Mobile Drawer Menu & Overlay */}
      {mobileMenuOpen && (
        <>
          <div 
            className="mobile-drawer-backdrop" 
            onClick={() => setMobileMenuOpen(false)} 
            aria-hidden="true"
          />
          <div className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
            <div className="mobile-drawer-content">
              {/* Mobile Search Bar */}
              <div className="mobile-search-row">
                <Search size={15} className="mobile-search-icon" />
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

              {/* Main Navigation Card */}
              <div className="mobile-nav-group">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentRoute === item.id;
                  return (
                    <button
                      key={item.id}
                      className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => handleNav(item.id)}
                    >
                      <div className={`mobile-nav-icon-wrap nav-icon-${item.id}`}>
                        <Icon size={16} />
                      </div>
                      <span className="mobile-nav-label">{item.label}</span>
                      <ChevronRight size={15} className="mobile-nav-arrow" />
                    </button>
                  );
                })}
              </div>

              {/* Staff / Admin Access Card */}
              <div className="mobile-staff-card">
                {auth.isAuthenticated ? (
                  <div className="mobile-auth-logged">
                    <button
                      className="mobile-staff-btn admin-active"
                      onClick={() => handleNav('admin-dashboard')}
                    >
                      <div className="mobile-staff-icon-wrap admin-icon">
                        <Sparkles size={15} />
                      </div>
                      <div className="mobile-staff-text">
                        <span className="staff-title">Admin Studio Dashboard</span>
                        <span className="staff-sub">Manage & Edit Portal</span>
                      </div>
                      <ChevronRight size={15} className="mobile-nav-arrow" />
                    </button>
                    <button
                      className="mobile-signout-btn"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    className="mobile-staff-btn"
                    onClick={() => handleNav('admin-login')}
                  >
                    <div className="mobile-staff-icon-wrap lock-icon">
                      <Lock size={15} />
                    </div>
                    <div className="mobile-staff-text">
                      <span className="staff-title">NCPOR Staff Login</span>
                      <span className="staff-sub">Official Portal Access</span>
                    </div>
                    <span className="staff-badge">Staff</span>
                    <ChevronRight size={15} className="mobile-nav-arrow" />
                  </button>
                )}
              </div>

              {/* Mobile Quick Accessibility & Language Controls */}
              <div className="mobile-controls-panel">
                <div className="mobile-controls-row">
                  {/* Font Size Selector */}
                  <div className="mobile-control-chip-group">
                    <button 
                      className={`mobile-a11y-pill ${a11y.fontSize === 'normal' ? 'active' : ''}`}
                      onClick={() => setFontSize('normal')}
                      title="Normal font size"
                    >
                      A
                    </button>
                    <button 
                      className={`mobile-a11y-pill ${a11y.fontSize === 'large' ? 'active' : ''}`}
                      onClick={() => setFontSize('large')}
                      title="Large font size"
                    >
                      A+
                    </button>
                    <button 
                      className={`mobile-a11y-pill ${a11y.fontSize === 'larger' ? 'active' : ''}`}
                      onClick={() => setFontSize('larger')}
                      title="Larger font size"
                    >
                      A++
                    </button>
                  </div>

                  {/* Contrast Toggle */}
                  <button 
                    className={`mobile-contrast-btn ${a11y.highContrast ? 'active' : ''}`}
                    onClick={toggleHighContrast}
                    title="Toggle High Contrast"
                  >
                    <Sun size={13} />
                    <span>{a11y.highContrast ? 'High Contrast ON' : 'Contrast'}</span>
                  </button>
                </div>

                {/* Language Switcher */}
                <button className="mobile-lang-chip" onClick={toggleLang}>
                  <div className="lang-chip-left">
                    <Globe2 size={14} />
                    <span>{lang === 'en' ? 'हिन्दी में देखें' : 'Switch to English'}</span>
                  </div>
                  <span className="lang-tag">{lang === 'en' ? 'HI' : 'EN'}</span>
                </button>
              </div>
            </div>
          </div>
        </>
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
          flex-wrap: nowrap;
          gap: 0.5rem;
          width: 100%;
        }

        .gov-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.74rem;
          letter-spacing: 0.02em;
          color: #f1f5f9;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
          flex-shrink: 1;
        }

        .gov-text-short, .gov-text-micro, .lang-text-short {
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
          padding: 0.8rem 0;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid #cbd5e1;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.03);
          transition: background 0.2s ease, box-shadow 0.2s ease;
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
          gap: 0.8rem;
          cursor: pointer;
          text-decoration: none;
          flex-shrink: 0;
        }

        .brand-icon {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .brand-lockup:hover .brand-icon {
          transform: rotate(25deg);
        }

        .brand-emblem-badge {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: var(--navy);
          border: 1px solid #0f2b5c;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fbbf24;
          box-shadow: 0 2px 5px rgba(10, 37, 64, 0.15);
          flex-shrink: 0;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .brand-lockup:hover .brand-emblem-badge {
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(10, 37, 64, 0.22);
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        .brand-primary {
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: var(--navy);
          line-height: 1.2;
        }

        .brand-secondary {
          font-size: 0.76rem;
          color: var(--text-secondary);
          font-weight: 600;
          line-height: 1.2;
        }

        .brand-tagline {
          font-size: 0.68rem;
          color: #64748b;
          font-weight: 500;
          line-height: 1.2;
          white-space: nowrap;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.48rem 0.85rem;
          border-radius: 7px;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-secondary);
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.18s ease;
          position: relative;
          white-space: nowrap;
        }

        .nav-link:hover {
          color: var(--navy);
          background: #f1f5f9;
          transform: translateY(-1px);
        }

        .nav-link.active {
          color: #047857;
          background: #ecfdf5;
          border-color: #a7f3d0;
          font-weight: 700;
          box-shadow: 0 1px 3px rgba(4, 120, 87, 0.08);
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
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
          padding: 0.45rem 2.2rem 0.45rem 2.2rem;
          color: var(--text-primary);
          font-size: 0.82rem;
          width: 185px;
          transition: all 0.22s ease;
        }

        .header-search-input:focus {
          outline: none;
          border-color: var(--ice);
          width: 225px;
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

        .search-kbd-hint {
          position: absolute;
          right: 0.65rem;
          font-family: inherit;
          font-size: 0.7rem;
          font-weight: 700;
          color: #94a3b8;
          background: #e2e8f0;
          border: 1px solid #cbd5e1;
          padding: 1px 5px;
          border-radius: 4px;
          line-height: 1.2;
          cursor: pointer;
          pointer-events: auto;
          transition: all 0.15s ease;
        }

        .search-kbd-hint:hover {
          color: #0f172a;
          border-color: #94a3b8;
        }

        .btn-admin {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: #f1f5f9;
          color: var(--navy);
          border: 1px solid #cbd5e1;
          padding: 0.45rem 0.85rem;
          border-radius: 7px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
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
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          color: var(--navy);
          cursor: pointer;
          width: 44px;
          height: 44px;
          border-radius: 8px;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .mobile-menu-toggle:hover {
          background: #e2e8f0;
        }

        .mobile-drawer-backdrop {
          position: fixed;
          inset: 0;
          top: 0;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          z-index: 140;
        }

        .mobile-drawer {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #cbd5e1;
          padding: 0.75rem 0.85rem 0.95rem;
          box-shadow: 0 20px 35px -8px rgba(15, 23, 42, 0.16);
          max-height: calc(100vh - 70px);
          max-height: calc(100dvh - 70px);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          z-index: 150;
          animation: mobileDrawerSlide 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes mobileDrawerSlide {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mobile-drawer-content {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          max-width: 480px;
          margin: 0 auto;
        }

        /* Search Row */
        .mobile-search-row {
          position: relative;
          display: flex;
          align-items: center;
        }

        .mobile-search-icon {
          position: absolute;
          left: 0.8rem;
          color: #0284c7;
          pointer-events: none;
        }

        .mobile-search-input {
          width: 100%;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          padding: 0.5rem 2rem 0.5rem 2.3rem;
          font-size: 0.86rem;
          color: var(--text-primary);
          min-height: 40px;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
          transition: all 0.15s ease;
        }

        .mobile-search-input:focus {
          outline: none;
          border-color: #0284c7;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
        }

        .mobile-clear-btn {
          position: absolute;
          right: 0.6rem;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }

        /* Main Navigation Group */
        .mobile-nav-group {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
          display: flex;
          flex-direction: column;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0.85rem;
          border: none;
          background: #ffffff;
          text-align: left;
          cursor: pointer;
          min-height: 44px;
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.15s ease, transform 0.1s ease;
        }

        .mobile-nav-link:last-child {
          border-bottom: none;
        }

        .mobile-nav-link:active {
          background: #f8fafc;
        }

        .mobile-nav-link.active {
          background: #f0f9ff;
        }

        .mobile-nav-icon-wrap {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.15s ease;
        }

        .nav-icon-home { background: #eff6ff; color: #0284c7; }
        .nav-icon-expeditions { background: #f0fdf4; color: #16a34a; }
        .nav-icon-map { background: #f5f3ff; color: #7c3aed; }
        .nav-icon-publications { background: #fffbeb; color: #d97706; }

        .mobile-nav-link.active .nav-icon-home { background: #0284c7; color: #ffffff; }
        .mobile-nav-link.active .nav-icon-expeditions { background: #16a34a; color: #ffffff; }
        .mobile-nav-link.active .nav-icon-map { background: #7c3aed; color: #ffffff; }
        .mobile-nav-link.active .nav-icon-publications { background: #d97706; color: #ffffff; }

        .mobile-nav-label {
          font-size: 0.88rem;
          font-weight: 600;
          color: #1e293b;
          flex: 1;
        }

        .mobile-nav-link.active .mobile-nav-label {
          color: #0369a1;
          font-weight: 700;
        }

        .mobile-nav-arrow {
          color: #94a3b8;
          flex-shrink: 0;
          transition: transform 0.15s ease, color 0.15s ease;
        }

        .mobile-nav-link:hover .mobile-nav-arrow,
        .mobile-nav-link.active .mobile-nav-arrow {
          color: #0369a1;
          transform: translateX(2px);
        }

        /* Staff / Admin Card */
        .mobile-staff-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
        }

        .mobile-staff-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.6rem 0.85rem;
          border: none;
          background: #ffffff;
          text-align: left;
          cursor: pointer;
          min-height: 44px;
          transition: background 0.15s ease;
        }

        .mobile-staff-btn:active {
          background: #f8fafc;
        }

        .mobile-staff-icon-wrap {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .lock-icon {
          background: #f1f5f9;
          color: #475569;
        }

        .admin-icon {
          background: #ecfdf5;
          color: #059669;
        }

        .mobile-staff-text {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          flex: 1;
        }

        .staff-title {
          font-size: 0.84rem;
          font-weight: 700;
          color: #0f172a;
        }

        .staff-sub {
          font-size: 0.70rem;
          color: #64748b;
        }

        .staff-badge {
          font-size: 0.68rem;
          font-weight: 700;
          background: #e0f2fe;
          color: #0369a1;
          padding: 2px 7px;
          border-radius: 6px;
          margin-right: 0.25rem;
        }

        .mobile-auth-logged {
          display: flex;
          flex-direction: column;
        }

        .mobile-signout-btn {
          background: #fef2f2;
          border: none;
          border-top: 1px solid #fee2e2;
          color: #dc2626;
          padding: 0.45rem 0.85rem;
          font-size: 0.76rem;
          font-weight: 600;
          cursor: pointer;
          text-align: center;
          transition: background 0.15s ease;
        }

        .mobile-signout-btn:active {
          background: #fee2e2;
        }

        /* Controls Panel */
        .mobile-controls-panel {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 0.5rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
        }

        .mobile-controls-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .mobile-control-chip-group {
          display: inline-flex;
          align-items: center;
          background: #f1f5f9;
          padding: 2px;
          border-radius: 7px;
          gap: 2px;
        }

        .mobile-a11y-pill {
          border: none;
          background: transparent;
          padding: 3px 9px;
          font-size: 0.74rem;
          font-weight: 700;
          color: #475569;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .mobile-a11y-pill.active {
          background: #ffffff;
          color: #0284c7;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
        }

        .mobile-contrast-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          padding: 4px 9px;
          border-radius: 7px;
          font-size: 0.74rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .mobile-contrast-btn.active {
          background: #0f172a;
          color: #f8fafc;
          border-color: #0f172a;
        }

        .mobile-lang-chip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 0.45rem 0.75rem;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 600;
          color: #0369a1;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .mobile-lang-chip:hover,
        .mobile-lang-chip:active {
          background: #f0f9ff;
          border-color: #bae6fd;
        }

        .lang-chip-left {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .lang-tag {
          font-size: 0.68rem;
          font-weight: 800;
          background: #e0f2fe;
          color: #0284c7;
          padding: 1px 6px;
          border-radius: 4px;
        }

        @media (max-width: 1024px) {
          .desktop-nav {
            display: none;
          }
          .header-search-input {
            width: 140px;
          }
          .header-search-input:focus {
            width: 180px;
          }
          .gov-text-full {
            display: none;
          }
          .gov-text-short {
            display: inline;
          }
          .a11y-label {
            display: none;
          }
        }

        @media (max-width: 860px) {
          .desktop-nav {
            display: none;
          }
          .mobile-menu-toggle {
            display: flex;
          }
          .search-input-wrapper {
            display: none;
          }
          .btn-admin, .admin-logged-group {
            display: none !important;
          }
          .brand-secondary, .brand-tagline {
            display: none;
          }
          .gov-strip-content {
            flex-wrap: nowrap;
            gap: 0.35rem;
          }
          .a11y-toolbar {
            gap: 0.25rem;
            flex-shrink: 0;
          }
          .a11y-toggle span {
            display: none;
          }
          .a11y-toggle {
            padding: 3px 6px;
          }
        }

        @media (max-width: 640px) {
          .gov-strip-content {
            flex-wrap: nowrap;
            gap: 0.3rem;
          }
          .gov-title {
            font-size: 0.68rem;
          }
          .brand-primary {
            font-size: 1.05rem;
          }
          .brand-emblem-badge {
            width: 36px;
            height: 36px;
          }
          .a11y-toolbar {
            gap: 0.2rem;
            flex-shrink: 0;
          }
          .a11y-group {
            padding: 1px 4px;
            gap: 1px;
          }
          .a11y-btn {
            padding: 1px 4px;
            font-size: 0.68rem;
          }
          .lang-toggle-btn {
            padding: 2px 6px;
            font-size: 0.72rem;
          }
        }

        @media (max-width: 480px) {
          .gov-strip-content {
            flex-wrap: nowrap;
            gap: 0.25rem;
          }
          .gov-text-short {
            display: none;
          }
          .gov-text-micro {
            display: inline;
          }
          .gov-title {
            font-size: 0.64rem;
          }
          .lang-text-full {
            display: none;
          }
          .lang-text-short {
            display: inline;
          }
          .nav-container {
            gap: 0.5rem;
          }
          .brand-lockup {
            gap: 0.5rem;
          }
          .a11y-group {
            padding: 1px 3px;
          }
          .a11y-btn {
            padding: 1px 3px;
            font-size: 0.65rem;
          }
          .a11y-toggle {
            padding: 2px 4px;
          }
          .lang-toggle-btn {
            padding: 2px 5px;
            font-size: 0.66rem;
          }
        }

        @media (max-width: 380px) {
          .gov-strip {
            padding: 0.3rem 0;
          }
          .gov-title {
            font-size: 0.62rem;
          }
          .a11y-btn {
            padding: 1px 2px;
            font-size: 0.62rem;
          }
          .lang-toggle-btn {
            padding: 2px 4px;
            font-size: 0.64rem;
          }
        }
      `}</style>
    </header>
  );
}

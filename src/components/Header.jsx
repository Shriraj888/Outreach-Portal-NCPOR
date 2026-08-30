import { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  Compass, 
  Search, 
  Globe2, 
  Layers, 
  BookOpen, 
  MapPin, 
  FileText, 
  Lock, 
  Sun, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

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
    { id: 'learn', label: t.nav.learn, icon: BookOpen, highlight: true },
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
            <span className="tricolor-dot"></span>
            <span className="gov-text">
              भारत सरकार | <strong>GOVERNMENT OF INDIA</strong> • MINISTRY OF EARTH SCIENCES
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
                <Compass className="brand-icon pulse-glow" size={28} />
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
                MoES • Smart Polar Science Outreach Portal
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
                  className={`nav-link ${isActive ? 'active' : ''} ${item.highlight ? 'nav-highlight' : ''}`}
                  onClick={() => handleNav(item.id)}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                  {item.highlight && <span className="learn-badge">SIH '26</span>}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs: Admin & Quick Search */}
          <div className="nav-actions">
            {/* Quick Search */}
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder={lang === 'hi' ? "खोजें..." : "Search missions, ice..."}
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
          background: rgba(11, 24, 41, 0.94);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(141, 164, 190, 0.12);
        }

        .gov-strip {
          background: #060e1c;
          border-bottom: 1px solid rgba(141, 164, 190, 0.1);
          font-size: 0.75rem;
          color: var(--text-secondary);
          padding: 0.35rem 0;
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
          font-size: 0.72rem;
          letter-spacing: 0.03em;
        }

        .tricolor-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(180deg, #ff9933 33%, #ffffff 33%, #ffffff 66%, #138808 66%);
          display: inline-block;
        }

        .a11y-toolbar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .a11y-group {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          background: rgba(255, 255, 255, 0.05);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .a11y-label {
          font-size: 0.68rem;
          color: var(--text-muted);
          margin-right: 2px;
        }

        .a11y-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 1px 5px;
          font-size: 0.72rem;
          font-weight: 600;
          cursor: pointer;
          border-radius: 2px;
        }

        .a11y-btn.active, .a11y-btn:hover {
          background: var(--accent-cyan);
          color: #000;
        }

        .a11y-toggle, .lang-toggle-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.72rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .a11y-toggle:hover, .lang-toggle-btn:hover {
          background: rgba(56, 189, 248, 0.2);
          border-color: var(--accent-ice);
        }

        .a11y-toggle.active {
          background: #ffff00;
          color: #000;
          font-weight: 700;
        }

        .main-nav-bar {
          padding: 0.75rem 0;
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
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(21, 41, 66, 0.9) 0%, rgba(30, 58, 100, 0.95) 100%);
          border: 1px solid rgba(245, 158, 11, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--saffron);
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        .brand-primary {
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #ffffff;
          line-height: 1.1;
        }

        .brand-secondary {
          font-size: 0.78rem;
          color: var(--text-secondary);
          font-weight: 400;
          line-height: 1.2;
        }

        .brand-tagline {
          font-size: 0.68rem;
          color: var(--text-muted);
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 0.4rem;
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
          transition: all 0.2s ease;
          position: relative;
        }

        .nav-link:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
        }

        .nav-link.active {
          color: var(--saffron-light);
          background: rgba(245, 158, 11, 0.1);
          border-color: rgba(245, 158, 11, 0.28);
          font-weight: 600;
        }

        .nav-highlight {
          color: #fcd34d !important;
        }

        .learn-badge {
          background: linear-gradient(135deg, #f59e0b, #ef4444);
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 1px 5px;
          border-radius: 4px;
          margin-left: 2px;
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
          background: rgba(15, 32, 55, 0.9);
          border: 1px solid rgba(141, 164, 190, 0.2);
          border-radius: var(--radius-full);
          padding: 0.45rem 1.8rem 0.45rem 2.2rem;
          color: #ffffff;
          font-size: 0.82rem;
          width: 180px;
          transition: all 0.25s ease;
        }

        .header-search-input:focus {
          outline: none;
          border-color: var(--saffron);
          width: 240px;
          background: rgba(15, 32, 55, 1);
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.12);
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
          background: rgba(245, 158, 11, 0.1);
          color: var(--saffron-light);
          border: 1px solid rgba(245, 158, 11, 0.3);
          padding: 0.45rem 0.9rem;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-admin:hover, .btn-admin.active {
          background: rgba(245, 158, 11, 0.2);
          border-color: var(--saffron);
          color: #ffffff;
        }

        .admin-logged-group {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .btn-logout {
          background: rgba(239, 68, 68, 0.15);
          color: #fca5a5;
          border: 1px solid rgba(239, 68, 68, 0.3);
          padding: 0.45rem 0.7rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          cursor: pointer;
        }

        .btn-logout:hover {
          background: rgba(239, 68, 68, 0.25);
        }

        .mobile-menu-toggle {
          display: none;
          background: transparent;
          border: none;
          color: #ffffff;
          cursor: pointer;
          padding: 0.25rem;
        }

        .mobile-drawer {
          background: var(--bg-deep);
          border-top: 1px solid var(--border-subtle);
          padding: 1rem;
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
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          font-size: 0.95rem;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
        }

        .mobile-nav-item.active {
          background: rgba(245, 158, 11, 0.12);
          border-color: rgba(245, 158, 11, 0.3);
          color: var(--saffron-light);
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
            display: block;
          }
          .header-search-input {
            width: 140px;
          }
          .header-search-input:focus {
            width: 180px;
          }
        }

        @media (max-width: 640px) {
          .header-search-input {
            display: none;
          }
          .gov-title {
            font-size: 0.65rem;
          }
          .brand-secondary, .brand-tagline {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}

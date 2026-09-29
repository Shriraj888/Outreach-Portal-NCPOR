import useScrollRevealAll from '../hooks/useScrollRevealAll';
import { usePortal } from '../context/PortalContext';
import { ExternalLink, Mail, Phone, MapPin, Award, ArrowUp } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function Footer({ navigateTo }) {
  const { lang } = usePortal();
  const footerRef = useScrollRevealAll();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer" role="contentinfo" ref={footerRef}>
      <div className="container footer-content">
        <div className="footer-grid">
          {/* Column 1: Institute Info */}
          <div className="footer-col brand-col reveal" style={{ '--delay': '0ms' }}>
            <div className="footer-brand" onClick={scrollToTop}>
              <img src={logoImg} alt="PolarPedia Logo" className="footer-logo-img" />
              <div>
                <h4 className="footer-brand-title">
                  {lang === 'hi' ? 'पोलरपीडिया' : 'PolarPedia'}
                </h4>
                <p className="footer-brand-sub">
                  National Centre for Polar and Ocean Research
                </p>
              </div>
            </div>
            
            <p className="footer-desc">
              India's premier nodal agency for planning, promoting, and executing polar and Southern Ocean scientific research.
            </p>
          </div>

          {/* Column 2: Polar Expeditions */}
          <div className="footer-col reveal" style={{ '--delay': '80ms' }}>
            <h5 className="footer-heading">Polar Expeditions</h5>
            <ul className="footer-links">
              <li>
                <button type="button" onClick={() => navigateTo('expeditions')}>Antarctica Missions (ISEA)</button>
              </li>
              <li>
                <button type="button" onClick={() => navigateTo('expeditions')}>Arctic Research (Himadri)</button>
              </li>
              <li>
                <button type="button" onClick={() => navigateTo('expeditions')}>Himalayan Cryosphere (Himansh)</button>
              </li>
              <li>
                <button type="button" onClick={() => navigateTo('expeditions')}>Southern Ocean Cruises</button>
              </li>
              <li>
                <button type="button" onClick={() => navigateTo('map')}>Interactive 3D Polar Map</button>
              </li>
            </ul>
          </div>

          {/* Column 3: Education & Outreach */}
          <div className="footer-col reveal" style={{ '--delay': '160ms' }}>
            <h5 className="footer-heading">Education & Outreach</h5>
            <ul className="footer-links">
              <li>
                <button type="button" onClick={() => navigateTo('publications')}>Open Science Publications</button>
              </li>
              <li>
                <button type="button" onClick={() => navigateTo('expeditions')}>Media Press Kits & Galleries</button>
              </li>
              <li>
                <button type="button" onClick={() => navigateTo('admin-login')}>NCPOR Content Studio</button>
              </li>
              <li>
                <a href="https://ncpor.res.in" target="_blank" rel="noopener noreferrer" className="external-link">
                  <span>Official NCPOR Portal</span>
                  <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Headquarters & Hackathon Badge */}
          <div className="footer-col hq-col reveal" style={{ '--delay': '240ms' }}>
            <h5 className="footer-heading">Headquarters</h5>
            <div className="footer-contact">
              <div className="contact-item">
                <MapPin size={14} className="contact-icon" />
                <span>Headland Sada, Vasco da Gama, Goa - 403804, India</span>
              </div>
              <a href="mailto:outreach@ncpor.res.in" className="contact-item contact-link">
                <Mail size={14} className="contact-icon" />
                <span>outreach@ncpor.res.in</span>
              </a>
              <a href="tel:+918322525600" className="contact-item contact-link">
                <Phone size={14} className="contact-icon" />
                <span>+91-832-2525600 (Polar Ops)</span>
              </a>
            </div>

            <div className="sih-badge-card">
              <div className="sih-icon-wrap">
                <Award size={16} />
              </div>
              <div className="sih-text">
                <div className="sih-title">Smart India Hackathon 2026</div>
                <div className="sih-subtitle">Problem Statement 26063 (MoES / NCPOR)</div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            © {new Date().getFullYear()} National Centre for Polar and Ocean Research (NCPOR), MoES, Government of India.
          </div>
          
          <div className="footer-meta-links">
            <span className="footer-meta-pill">Open Science</span>
            <span className="footer-meta-dot">•</span>
            <span className="footer-meta-pill">WCAG 2.1 AA</span>
            <span className="footer-meta-dot">•</span>
            <span className="footer-meta-pill">Antarctic Protocol Certified</span>
          </div>

          <button 
            type="button" 
            className="footer-back-to-top"
            onClick={scrollToTop}
            title="Scroll to top"
            aria-label="Scroll to top"
          >
            <span>Top</span>
            <ArrowUp size={13} />
          </button>
        </div>
      </div>

      <style>{`
        .site-footer {
          background: #0f172a;
          color: #94a3b8;
          border-top: 1px solid #1e293b;
          position: relative;
          margin-top: 3.5rem;
        }

        .footer-content {
          padding: 2.75rem 1.5rem 1.5rem;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
          gap: 2.25rem;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 0.85rem;
          cursor: pointer;
        }

        .footer-logo-img {
          width: 42px;
          height: 42px;
          object-fit: contain;
          border-radius: 8px;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .footer-brand:hover .footer-logo-img {
          transform: scale(1.05);
        }



        .footer-brand-title {
          font-size: 1.05rem;
          color: #ffffff;
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.01em;
        }

        .footer-brand-sub {
          font-size: 0.72rem;
          color: #94a3b8;
          margin-top: 1px;
        }

        .footer-desc {
          font-size: 0.8rem;
          line-height: 1.55;
          color: #cbd5e1;
          margin-bottom: 1rem;
        }

        .footer-heading {
          font-size: 0.85rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.95rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          padding: 0;
          margin: 0;
        }

        .footer-links button, 
        .footer-links a {
          background: none;
          border: none;
          color: #cbd5e1;
          font-size: 0.8rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0;
          text-decoration: none;
        }

        .footer-links button:hover, 
        .footer-links a:hover {
          color: #38bdf8;
          transform: translateX(3px);
        }

        .external-link {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
        }

        .footer-contact {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          font-size: 0.78rem;
          color: #cbd5e1;
          margin-bottom: 1rem;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          line-height: 1.4;
          text-decoration: none;
        }

        .contact-link {
          color: #cbd5e1;
          transition: color 0.2s ease;
        }

        .contact-link:hover {
          color: #38bdf8;
        }

        .contact-icon {
          color: #38bdf8;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .sih-badge-card {
          background: rgba(245, 158, 11, 0.08);
          border: 1px solid rgba(245, 158, 11, 0.25);
          border-radius: 8px;
          padding: 0.65rem 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.55rem;
          transition: all 0.25s ease;
        }

        .sih-badge-card:hover {
          background: rgba(245, 158, 11, 0.15);
          border-color: rgba(245, 158, 11, 0.4);
          transform: translateY(-1px);
        }

        .sih-icon-wrap {
          color: #f59e0b;
          flex-shrink: 0;
        }

        .sih-title {
          font-size: 0.76rem;
          font-weight: 700;
          color: #fbbf24;
          line-height: 1.25;
        }

        .sih-subtitle {
          font-size: 0.68rem;
          color: #94a3b8;
          margin-top: 1px;
        }

        .footer-divider {
          height: 1px;
          background: #1e293b;
          margin: 2rem 0 1.25rem 0;
        }

        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          font-size: 0.74rem;
          color: #64748b;
        }

        .footer-copyright {
          color: #94a3b8;
        }

        .footer-meta-links {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .footer-meta-dot {
          opacity: 0.4;
        }

        .footer-meta-pill {
          color: #94a3b8;
        }

        .footer-back-to-top {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #1e293b;
          border: 1px solid #334155;
          color: #cbd5e1;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.3rem 0.65rem;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .footer-back-to-top:hover {
          background: #334155;
          color: #ffffff;
          border-color: #64748b;
          transform: translateY(-2px);
        }

        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
        }

        @media (max-width: 768px) {
          .site-footer {
            margin-top: 2rem;
          }
          .footer-content {
            padding: 1.75rem 0.85rem 1rem;
          }
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 1.25rem 1rem;
          }
          .footer-col.brand-col {
            grid-column: 1 / -1;
            margin-bottom: 0.25rem;
          }
          .footer-col.hq-col {
            grid-column: 1 / -1;
            margin-top: 0.25rem;
          }
          .footer-desc {
            font-size: 0.76rem;
            line-height: 1.45;
            margin-bottom: 0.5rem;
          }
          .footer-heading {
            font-size: 0.76rem;
            margin-bottom: 0.55rem;
          }
          .footer-links {
            gap: 0.4rem;
          }
          .footer-links button, .footer-links a {
            font-size: 0.75rem;
          }
          .footer-contact {
            display: grid;
            grid-template-columns: 1fr;
            gap: 0.35rem;
            margin-bottom: 0.65rem;
            font-size: 0.74rem;
          }
          .contact-item {
            gap: 0.4rem;
          }
          .sih-badge-card {
            padding: 0.45rem 0.65rem;
            gap: 0.45rem;
          }
          .sih-title {
            font-size: 0.72rem;
          }
          .sih-subtitle {
            font-size: 0.64rem;
          }
          .footer-divider {
            margin: 1.25rem 0 0.85rem;
          }
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.6rem;
            font-size: 0.7rem;
          }
          .footer-meta-links {
            flex-wrap: wrap;
            gap: 0.35rem;
            font-size: 0.68rem;
          }
        }

        @media (max-width: 480px) {
          .footer-brand-title {
            font-size: 0.95rem;
          }
          .footer-links button, .footer-links a {
            font-size: 0.72rem;
            line-height: 1.35;
          }
          .footer-heading {
            font-size: 0.72rem;
          }
        }
      `}</style>
    </footer>
  );
}

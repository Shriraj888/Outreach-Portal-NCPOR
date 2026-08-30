import React from 'react';
import { usePortal } from '../context/PortalContext';
import { Compass, Shield, Award, ExternalLink, Mail, Phone, MapPin, Radio, Heart } from 'lucide-react';

export default function Footer({ navigateTo }) {
  const { lang, t } = usePortal();

  return (
    <footer className="site-footer">
      <div className="footer-top-wave"></div>
      
      <div className="container footer-content">
        <div className="footer-grid">
          {/* Column 1: Institute Info */}
          <div className="footer-col brand-col">
            <div className="footer-brand">
              <div className="footer-logo-badge">
                <Compass size={24} className="footer-compass" />
              </div>
              <div>
                <h4 className="footer-brand-title">
                  {lang === 'hi' ? 'राष्ट्रीय ध्रुवीय एवं महासागर अनुसंधान केंद्र' : 'NCPOR'}
                </h4>
                <p className="footer-brand-sub">
                  Ministry of Earth Sciences, Govt. of India
                </p>
              </div>
            </div>
            
            <p className="footer-desc">
              India's premier nodal agency for planning, promoting, coordinating and executing the entire gamut of polar and Southern Ocean scientific research.
            </p>

            <div className="polar-status-badge">
              <span className="live-pulse"></span>
              <span>All 5 Polar Research Bases Telemetry: <strong>ONLINE</strong></span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h5 className="footer-heading">Polar Expeditions</h5>
            <ul className="footer-links">
              <li>
                <button onClick={() => navigateTo('expeditions')}>Antarctica Missions (ISEA)</button>
              </li>
              <li>
                <button onClick={() => navigateTo('expeditions')}>Arctic Research (Himadri)</button>
              </li>
              <li>
                <button onClick={() => navigateTo('expeditions')}>Himalayan Cryosphere (Himansh)</button>
              </li>
              <li>
                <button onClick={() => navigateTo('expeditions')}>Southern Ocean Expeditions</button>
              </li>
              <li>
                <button onClick={() => navigateTo('map')}>Interactive Polar Map</button>
              </li>
            </ul>
          </div>

          {/* Column 3: Smart Education & Media */}
          <div className="footer-col">
            <h5 className="footer-heading">Smart Education & Outreach</h5>
            <ul className="footer-links">
              <li>
                <button onClick={() => navigateTo('learn')}>
                  <span className="footer-highlight">Student Learn Zone & Quiz</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('publications')}>Open Science Publications</button>
              </li>
              <li>
                <button onClick={() => navigateTo('expeditions')}>Media Press Kits & Galleries</button>
              </li>
              <li>
                <button onClick={() => navigateTo('admin-login')}>NCPOR AI Content Studio</button>
              </li>
              <li>
                <a href="https://ncpor.res.in" target="_blank" rel="noopener noreferrer" className="external-link">
                  <span>Official NCPOR Main Portal</span>
                  <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Hackathon Badge */}
          <div className="footer-col">
            <h5 className="footer-heading">Institutional Headquarters</h5>
            <div className="footer-contact">
              <div className="contact-item">
                <MapPin size={15} className="contact-icon" />
                <span>Headland Sada, Vasco da Gama, Goa - 403804, India</span>
              </div>
              <div className="contact-item">
                <Mail size={15} className="contact-icon" />
                <span>outreach@ncpor.res.in</span>
              </div>
              <div className="contact-item">
                <Phone size={15} className="contact-icon" />
                <span>+91-832-2525600 (Polar Ops)</span>
              </div>
            </div>

            <div className="sih-badge-card">
              <div className="sih-icon-wrap">
                <Award size={18} />
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
            © {new Date().getFullYear()} National Centre for Polar and Ocean Research (NCPOR), MoES, Government of India. All rights reserved.
          </div>
          <div className="footer-meta-links">
            <span>Designed for Open Science & Public Outreach</span>
            <span>•</span>
            <span>WCAG 2.1 AA Compliant</span>
            <span>•</span>
            <span>Zero Plastic & Antarctic Environmental Protocol</span>
          </div>
        </div>
      </div>

      <style>{`
        .site-footer {
          background: #040810;
          color: var(--text-secondary);
          border-top: 1px solid var(--border-subtle);
          position: relative;
          margin-top: 4rem;
        }

        .footer-content {
          padding: 3.5rem 1.5rem 1.5rem 1.5rem;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
          gap: 2.5rem;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .footer-logo-badge {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(56, 189, 248, 0.15);
          border: 1px solid rgba(56, 189, 248, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-ice);
        }

        .footer-brand-title {
          font-size: 1.05rem;
          color: #ffffff;
          font-weight: 700;
          line-height: 1.2;
        }

        .footer-brand-sub {
          font-size: 0.75rem;
          color: var(--text-ice);
        }

        .footer-desc {
          font-size: 0.82rem;
          line-height: 1.5;
          color: var(--text-muted);
          margin-bottom: 1.25rem;
        }

        .polar-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #6ee7b7;
          font-size: 0.75rem;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
        }

        .live-pulse {
          width: 7px;
          height: 7px;
          background: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 8px #10b981;
          animation: pulseGlow 1.5s infinite;
        }

        .footer-heading {
          font-size: 0.95rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 1.2rem;
          letter-spacing: -0.01em;
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .footer-links button, .footer-links a {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 0.84rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0;
        }

        .footer-links button:hover, .footer-links a:hover {
          color: var(--accent-ice);
          transform: translateX(3px);
        }

        .footer-highlight {
          color: #fcd34d;
          font-weight: 600;
        }

        .external-link {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .footer-contact {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 1.25rem;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
        }

        .contact-icon {
          color: var(--accent-cyan);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .sih-badge-card {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(239, 68, 68, 0.12) 100%);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: var(--radius-sm);
          padding: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .sih-icon-wrap {
          color: #f59e0b;
        }

        .sih-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: #fcd34d;
        }

        .sih-subtitle {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .footer-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          margin: 2.5rem 0 1.5rem 0;
        }

        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .footer-meta-links {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </footer>
  );
}

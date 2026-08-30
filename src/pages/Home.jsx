import { usePortal } from '../context/PortalContext';
import { 
  Compass, 
  MapPin, 
  BookOpen,
  Sparkles, 
  ArrowRight, 
  ThermometerSnowflake, 
  Wind, 
  Radio, 
  FileText, 
  Award,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import ExpeditionCard from '../components/ExpeditionCard';

export default function Home({ navigateTo, onSelectExpedition }) {
  const { 
    expeditions, 
    activities, 
    stations, 
    lang, 
    t, 
    setSelectedRegion 
  } = usePortal();

  // Featured expedition (e.g. 43rd Antarctic)
  const featuredExpedition = expeditions.find(e => e.id === 'isea-43') || expeditions[0];

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
    navigateTo('expeditions');
  };

  return (
    <div className="home-page-container">
      {/* Live Polar Telemetry Ticker Bar */}
      <div className="telemetry-bar">
        <div className="container telemetry-inner">
          <div className="telemetry-label">
            <Radio size={14} className="telemetry-pulse-icon" />
            <span>LIVE POLAR TELEMETRY:</span>
          </div>
          <div className="telemetry-stations">
            {stations.slice(0, 4).map((st) => (
              <div key={st.id} className="station-ticker-item">
                <span className="st-name">{st.name}:</span>
                <span className="st-temp"><ThermometerSnowflake size={12} /> {st.temp}</span>
                <span className="st-wind"><Wind size={12} /> {st.wind}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-overlay"></div>
        <div className="container hero-content">
          <div className="hero-badge">
            <span className="tricolor-badge">🇮🇳</span>
            <span>NATIONAL OUTREACH PORTAL • SMART INDIA HACKATHON 2026</span>
          </div>

          <h1 className="hero-heading">
            {t.hero.title}
          </h1>

          <p className="hero-subtext">
            {t.hero.subtitle}
          </p>

          <div className="hero-cta-group">
            <button 
              className="btn-primary hero-btn"
              onClick={() => {
                setSelectedRegion('All');
                navigateTo('expeditions');
              }}
            >
              <Compass size={18} />
              <span>{t.hero.exploreExpeditions}</span>
            </button>

            <button 
              className="btn-secondary hero-btn"
              onClick={() => navigateTo('map')}
            >
              <MapPin size={18} />
              <span>{t.hero.interactiveMap}</span>
            </button>

            <button 
              className="btn-ai hero-btn"
              onClick={() => navigateTo('learn')}
            >
              <Sparkles size={18} />
              <span>{t.hero.studentZone}</span>
            </button>
          </div>

          {/* Key Stat Cards */}
          <div className="hero-stats-row">
            <div className="stat-card">
              <div className="stat-number">5</div>
              <div className="stat-label">Permanent Bases (Bharati, Maitri, Himadri, Himansh, IndARC)</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">43+</div>
              <div className="stat-label">Historic Antarctic Missions</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">1,200+</div>
              <div className="stat-label">Peer-Reviewed Polar Publications</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">100%</div>
              <div className="stat-label">Open Public Outreach & Smart Education</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Polar Pillars Navigator */}
      <section className="pillars-section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">EXPLORE BY FRONTIER</div>
            <h2 className="section-title">India's Three Poles of Scientific Exploration</h2>
            <p className="section-subtitle">
              From the frozen southern continent to high Arctic fjords and the snowpack of the Himalayas.
            </p>
          </div>

          <div className="pillars-grid">
            {/* Antarctica */}
            <div className="pillar-card antarctica" onClick={() => handleRegionClick('Antarctica')}>
              <div className="pillar-bg-img bg-antarctica"></div>
              <div className="pillar-overlay"></div>
              <div className="pillar-content">
                <span className="badge badge-antarctica">South Pole • 69°S to 90°S</span>
                <h3 className="pillar-title">Antarctica (ISEA)</h3>
                <p className="pillar-desc">
                  Maitri & Bharati stations. Deep ice core paleoclimatology, Southern Ocean teleconnections, and space weather monitoring.
                </p>
                <div className="pillar-action">
                  <span>Explore 43 Expeditions</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>

            {/* Arctic */}
            <div className="pillar-card arctic" onClick={() => handleRegionClick('Arctic')}>
              <div className="pillar-bg-img bg-arctic"></div>
              <div className="pillar-overlay"></div>
              <div className="pillar-content">
                <span className="badge badge-arctic">North Pole • 78°55'N</span>
                <h3 className="pillar-title">The Arctic (Himadri)</h3>
                <p className="pillar-desc">
                  Ny-Ålesund & Kongsfjorden. Tracking Arctic amplification, sea-ice shrinkage, and oceanic links to the Indian Monsoon.
                </p>
                <div className="pillar-action">
                  <span>Explore Arctic Missions</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>

            {/* Himalaya */}
            <div className="pillar-card himalaya" onClick={() => handleRegionClick('Himalaya')}>
              <div className="pillar-bg-img bg-himalaya"></div>
              <div className="pillar-overlay"></div>
              <div className="pillar-content">
                <span className="badge badge-himalaya">Third Pole • 4,080m Altitude</span>
                <h3 className="pillar-title">Himalayan Cryosphere</h3>
                <p className="pillar-desc">
                  Himansh Observatory in Spiti Valley. Glacier mass balance, radar ice profiling, and downstream river water security.
                </p>
                <div className="pillar-action">
                  <span>Explore Glaciology</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Expedition Spotlight */}
      {featuredExpedition && (
        <section className="featured-spotlight-section">
          <div className="container">
            <div className="spotlight-card glass-panel">
              <div className="spotlight-grid">
                <div className="spotlight-media">
                  <img 
                    src={featuredExpedition.heroImage} 
                    alt={featuredExpedition.title} 
                    className="spotlight-img"
                  />
                  <div className="spotlight-img-badge">
                    <Sparkles size={14} />
                    <span>Featured Mission Spotlight</span>
                  </div>
                </div>

                <div className="spotlight-info">
                  <div className="spotlight-top-tags">
                    <span className="badge badge-antarctica">{featuredExpedition.region}</span>
                    <span className="spotlight-year">{featuredExpedition.year}</span>
                    {featuredExpedition.aiGeneratedContent && (
                      <span className="spotlight-ai-tag">
                        <Sparkles size={12} /> AI Outreach Pack Ready
                      </span>
                    )}
                  </div>

                  <h3 className="spotlight-title">
                    {lang === 'hi' && featuredExpedition.titleHi ? featuredExpedition.titleHi : featuredExpedition.title}
                  </h3>

                  <p className="spotlight-summary">
                    {featuredExpedition.summary}
                  </p>

                  <div className="spotlight-deliverables">
                    <div className="deliverable-item">
                      <CheckCircle2 size={16} className="deliv-icon" />
                      <span>122m Paleoclimatic Ice Core Retrieved</span>
                    </div>
                    <div className="deliverable-item">
                      <CheckCircle2 size={16} className="deliv-icon" />
                      <span>Zero-Waste Green Power Microgrid Tested</span>
                    </div>
                    <div className="deliverable-item">
                      <CheckCircle2 size={16} className="deliv-icon" />
                      <span>14 Novel Cold-Active Extremophile Microbes Isolated</span>
                    </div>
                  </div>

                  <div className="spotlight-actions">
                    <button 
                      className="btn-primary"
                      onClick={() => onSelectExpedition(featuredExpedition.id)}
                    >
                      <span>Explore Full Expedition & Media</span>
                      <ArrowRight size={16} />
                    </button>
                    <button 
                      className="btn-secondary"
                      onClick={() => navigateTo('map')}
                    >
                      <MapPin size={16} />
                      <span>View on Station Map</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Grid of Recent Expeditions */}
      <section className="recent-expeditions-section">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <div className="section-eyebrow">POLAR ARCHIVES</div>
              <h2 className="section-title">Latest Archived Expeditions</h2>
            </div>
            <button 
              className="btn-secondary"
              onClick={() => {
                setSelectedRegion('All');
                navigateTo('expeditions');
              }}
            >
              <span>View All Expeditions</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="grid-cards">
            {expeditions.slice(0, 3).map((exp) => (
              <ExpeditionCard 
                key={exp.id} 
                expedition={exp} 
                onSelect={onSelectExpedition} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Smart Education Callout Banner */}
      <section className="smart-edu-banner-section">
        <div className="container">
          <div className="smart-edu-card">
            <div className="smart-edu-text">
              <div className="smart-badge">
                <Award size={16} />
                <span>SMART INDIA HACKATHON 2026 • SMART EDUCATION THEME</span>
              </div>
              <h2 className="smart-title">
                Polar Explorer Student Hub & Interactive Quiz
              </h2>
              <p className="smart-desc">
                Simplified explainers on ancient ice cores, auroras, Himalayan glaciers, and Antarctic krill. Test your polar science knowledge, earn an official badge, and generate your certificate!
              </p>
              <div className="smart-btns">
                <button 
                  className="btn-primary smart-btn"
                  onClick={() => navigateTo('learn')}
                >
                  <BookOpen size={18} />
                  <span>Start Learning & Take the Quiz</span>
                </button>
                <button 
                  className="btn-secondary smart-btn"
                  onClick={() => navigateTo('publications')}
                >
                  <FileText size={18} />
                  <span>Browse Student-Friendly Papers</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Institutional News & Activities */}
      <section className="news-section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">INSTITUTIONAL ANNOUNCEMENTS</div>
            <h2 className="section-title">Latest Activities & Outreach Feed</h2>
          </div>

          <div className="activities-grid">
            {activities.map((act) => (
              <div key={act.id} className="glass-panel activity-card">
                <div className="act-header">
                  <span className="act-badge">{act.badge}</span>
                  <span className="act-date">
                    <Calendar size={13} /> {act.date}
                  </span>
                </div>
                <h4 className="act-title">
                  {lang === 'hi' && act.titleHi ? act.titleHi : act.title}
                </h4>
                <p className="act-summary">{act.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .home-page-container {
          display: flex;
          flex-direction: column;
          gap: 4rem;
        }

        /* Telemetry Bar */
        .telemetry-bar {
          background: rgba(4, 8, 16, 0.95);
          border-bottom: 1px solid var(--border-subtle);
          padding: 0.45rem 0;
          font-size: 0.78rem;
        }

        .telemetry-inner {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          overflow-x: auto;
          white-space: nowrap;
        }

        .telemetry-label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--accent-cyan);
          font-weight: 700;
          letter-spacing: 0.04em;
          flex-shrink: 0;
        }

        .telemetry-pulse-icon {
          animation: pulseGlow 1.8s infinite;
        }

        .telemetry-stations {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .station-ticker-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
        }

        .st-name {
          color: #ffffff;
          font-weight: 600;
        }

        .st-temp {
          color: #7dd3fc;
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }

        .st-wind {
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          padding: 5rem 0 3rem;
          background: linear-gradient(180deg, rgba(7, 13, 24, 0.4) 0%, rgba(12, 23, 42, 0.8) 100%), 
                      url('https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1800&q=80');
          background-size: cover;
          background-position: center;
          border-bottom: 1px solid var(--border-subtle);
        }

        .hero-bg-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(7, 13, 24, 0.75) 0%, rgba(7, 13, 24, 0.95) 100%);
        }

        .hero-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 960px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.35);
          color: var(--saffron-light);
          padding: 0.35rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          margin-bottom: 1.5rem;
        }

        .hero-heading {
          font-size: 3rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.15;
          margin-bottom: 1.25rem;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
        }

        .hero-subtext {
          font-size: 1.15rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 2rem;
          max-width: 800px;
        }

        .hero-cta-group {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 3.5rem;
        }

        .hero-btn {
          padding: 0.85rem 1.75rem;
          font-size: 0.95rem;
        }

        .hero-stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          width: 100%;
        }

        .stat-card {
          background: rgba(15, 29, 53, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 1.25rem 1rem;
          text-align: center;
          transition: transform 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          border-color: rgba(245, 158, 11, 0.4);
        }

        .stat-number {
          font-family: var(--font-heading);
          font-size: 2.2rem;
          font-weight: 700;
          color: var(--saffron);
          line-height: 1;
          margin-bottom: 0.35rem;
        }

        .stat-label {
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.35;
        }

        /* Section Headings */
        .section-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 2.5rem;
        }

        .section-header-flex {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .section-eyebrow {
          font-size: 0.74rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--saffron);
          margin-bottom: 0.35rem;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 0.5rem;
        }

        .section-subtitle {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        /* 3 Pillars */
        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.75rem;
        }

        .pillar-card {
          position: relative;
          height: 380px;
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: pointer;
          border: 1px solid var(--border-subtle);
          box-shadow: var(--shadow-card);
          transition: all 0.3s ease;
        }

        .pillar-card:hover {
          transform: translateY(-6px);
          border-color: rgba(245, 158, 11, 0.4);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7);
        }

        .pillar-bg-img {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.5s ease;
        }

        .bg-antarctica {
          background-image: url('https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80');
        }

        .bg-arctic {
          background-image: url('https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&w=800&q=80');
        }

        .bg-himalaya {
          background-image: url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80');
        }

        .pillar-card:hover .pillar-bg-img {
          transform: scale(1.08);
        }

        .pillar-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(7, 13, 24, 0.3) 0%, rgba(7, 13, 24, 0.95) 100%);
        }

        .pillar-content {
          position: absolute;
          inset: 0;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          z-index: 1;
        }

        .pillar-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0.75rem 0 0.5rem;
        }

        .pillar-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 1.25rem;
        }

        .pillar-action {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--saffron-light);
          font-size: 0.85rem;
          font-weight: 700;
        }

        /* Spotlight */
        .spotlight-card {
          padding: 2rem;
          border-radius: var(--radius-lg);
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .spotlight-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 2.5rem;
          align-items: center;
        }

        .spotlight-media {
          position: relative;
          height: 360px;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .spotlight-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .spotlight-img-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: rgba(11, 24, 41, 0.88);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(245, 158, 11, 0.4);
          color: var(--saffron-light);
          padding: 0.35rem 0.8rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .spotlight-top-tags {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 0.85rem;
          flex-wrap: wrap;
        }

        .spotlight-year {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .spotlight-ai-tag {
          background: rgba(29, 78, 216, 0.15);
          color: var(--ice-light);
          border: 1px solid rgba(96, 165, 250, 0.3);
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .spotlight-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.25;
          margin-bottom: 0.85rem;
        }

        .spotlight-summary {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 1.25rem;
        }

        .spotlight-deliverables {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.75rem;
        }

        .deliverable-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .deliv-icon {
          color: #10b981;
          flex-shrink: 0;
        }

        .spotlight-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        /* Smart Education Banner */
        .smart-edu-card {
          background: linear-gradient(135deg, #0f2240 0%, #0d1f38 60%, #0c2535 100%);
          border: 1px solid rgba(13, 148, 136, 0.35);
          border-radius: var(--radius-lg);
          padding: 3rem 2rem;
          text-align: center;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
        }

        .smart-edu-text {
          max-width: 800px;
          margin: 0 auto;
        }

        .smart-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(251, 191, 36, 0.15);
          color: #fde68a;
          border: 1px solid rgba(251, 191, 36, 0.35);
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .smart-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 0.85rem;
        }

        .smart-desc {
          font-size: 1rem;
          color: #e2e8f0;
          line-height: 1.6;
          margin-bottom: 1.75rem;
        }

        .smart-btns {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .smart-btn {
          padding: 0.75rem 1.5rem;
        }

        /* Activities */
        .activities-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .activity-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
        }

        .act-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .act-badge {
          background: rgba(13, 148, 136, 0.15);
          color: #2dd4bf;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .act-date {
          font-size: 0.75rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .act-title {
          font-size: 1.05rem;
          color: #ffffff;
          font-weight: 700;
          line-height: 1.35;
          margin-bottom: 0.65rem;
        }

        .act-summary {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        @media (max-width: 1024px) {
          .hero-stats-row {
            grid-template-columns: repeat(2, 1fr);
          }
          .pillars-grid {
            grid-template-columns: 1fr;
          }
          .pillar-card {
            height: 280px;
          }
          .spotlight-grid {
            grid-template-columns: 1fr;
          }
          .activities-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .hero-heading {
            font-size: 2rem;
          }
          .hero-stats-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

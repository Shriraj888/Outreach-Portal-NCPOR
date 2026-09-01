import { usePortal } from '../context/PortalContext';
import { 
  Compass, 
  MapPin, 
  BookOpen, 
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
            <span className="tricolor-dot"></span>
            <span>NATIONAL POLAR SCIENCE OUTREACH PORTAL • GOVT. OF INDIA</span>
          </div>

          <h1 className="hero-heading">
            {t.hero.title}
          </h1>

          <p className="hero-subtext">
            {t.hero.subtitle}
          </p>

          <div className="hero-cta-group">
            <button 
              className="btn-saffron hero-btn"
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
              className="btn-primary hero-btn"
              onClick={() => navigateTo('learn')}
            >
              <BookOpen size={18} />
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
              <div className="stat-label">Historic Antarctic Expeditions</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">1,200+</div>
              <div className="stat-label">Peer-Reviewed Publications</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">100%</div>
              <div className="stat-label">Open Public Outreach & Education</div>
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
              From the frozen southern continent to high Arctic fjords and the glaciers of the Himalayas.
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
                    <span>Featured Mission Archive</span>
                  </div>
                </div>

                <div className="spotlight-info">
                  <div className="spotlight-top-tags">
                    <span className="badge badge-antarctica">{featuredExpedition.region}</span>
                    <span className="spotlight-year">Season {featuredExpedition.year}</span>
                    {featuredExpedition.aiGeneratedContent && (
                      <span className="spotlight-ai-tag">
                        Outreach Pack Ready
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
                      <span>Zero-Waste Green Power Microgrid Operational</span>
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
                      <span>Explore Full Expedition Archive</span>
                      <ArrowRight size={16} />
                    </button>
                    <button 
                      className="btn-secondary"
                      onClick={() => navigateTo('map')}
                    >
                      <MapPin size={16} />
                      <span>View Station Map</span>
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
                <span>SMART INDIA HACKATHON 2026 • SMART EDUCATION</span>
              </div>
              <h2 className="smart-title">
                Polar Explorer Student Hub & Interactive Quiz
              </h2>
              <p className="smart-desc">
                Simplified explainers on ancient ice cores, auroras, Himalayan glaciers, and Antarctic ecosystems. Test your polar science knowledge and earn your official Explorer Certificate!
              </p>
              <div className="smart-btns">
                <button 
                  className="btn-saffron smart-btn"
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
                  <span>Browse Open Science Papers</span>
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
          background: #dfe4ea;
          border-bottom: 1px solid #cbd5e1;
          padding: 0.5rem 0;
          font-size: 0.8rem;
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
          gap: 0.45rem;
          color: #0369a1;
          font-weight: 700;
          letter-spacing: 0.03em;
          flex-shrink: 0;
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
          color: #334155;
        }

        .st-name {
          color: #0f172a;
          font-weight: 600;
        }

        .st-temp {
          color: #0284c7;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }

        .st-wind {
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          padding: 5rem 0 4rem;
          background: linear-gradient(180deg, #eaedf2 0%, #dfe4eb 100%);
          border-bottom: 1px solid var(--border-subtle);
        }

        .hero-bg-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 20%, rgba(2, 132, 199, 0.06) 0%, transparent 70%);
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
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #1e3a8a;
          padding: 0.35rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          margin-bottom: 1.5rem;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        .tricolor-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: linear-gradient(180deg, #ff9933 33%, #ffffff 33%, #ffffff 66%, #138808 66%);
          box-shadow: 0 0 0 1px rgba(0,0,0,0.15);
        }

        .hero-heading {
          font-size: 3rem;
          font-weight: 800;
          color: var(--navy);
          line-height: 1.2;
          margin-bottom: 1.25rem;
        }

        .hero-subtext {
          font-size: 1.15rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 2.25rem;
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
          background: #ffffff;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-md);
          padding: 1.5rem 1rem;
          text-align: center;
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
          border-color: #cbd5e1;
        }

        .stat-number {
          font-family: var(--font-heading);
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--navy);
          line-height: 1;
          margin-bottom: 0.35rem;
        }

        .stat-label {
          font-size: 0.78rem;
          color: var(--text-muted);
          line-height: 1.35;
          font-weight: 500;
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
          box-shadow: var(--shadow-sm);
          transition: all 0.25s ease;
        }

        .pillar-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
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
          transform: scale(1.06);
        }

        .pillar-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(10, 25, 47, 0.2) 0%, rgba(10, 25, 47, 0.88) 100%);
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
          font-size: 1.35rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0.75rem 0 0.5rem;
        }

        .pillar-desc {
          font-size: 0.85rem;
          color: #e2e8f0;
          line-height: 1.5;
          margin-bottom: 1.25rem;
        }

        .pillar-action {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #fbbf24;
          font-size: 0.85rem;
          font-weight: 700;
        }

        /* Spotlight */
        .spotlight-card {
          padding: 2.25rem;
          border-radius: var(--radius-lg);
          background: #ffffff;
          border: 1px solid var(--border-card);
          box-shadow: var(--shadow-md);
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
          border: 1px solid var(--border-subtle);
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
          background: rgba(15, 23, 42, 0.85);
          color: #ffffff;
          padding: 0.35rem 0.8rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
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
          background: #e0f2fe;
          color: #0369a1;
          border: 1px solid #bae6fd;
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          font-weight: 600;
        }

        .spotlight-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--navy);
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
          color: #059669;
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
          background: #0a2540;
          border: 1px solid #1e3a8a;
          border-radius: var(--radius-lg);
          padding: 3.5rem 2rem;
          text-align: center;
          box-shadow: var(--shadow-lg);
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
          color: #fbbf24;
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
          color: #cbd5e1;
          line-height: 1.6;
          margin-bottom: 2rem;
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
          background: #ffffff;
        }

        .act-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .act-badge {
          background: #e0f2fe;
          color: #0369a1;
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
          color: var(--navy);
          font-weight: 700;
          line-height: 1.35;
          margin-bottom: 0.65rem;
        }

        .act-summary {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.55;
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

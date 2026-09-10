import { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  Compass, 
  MapPin, 
  ArrowRight, 
  ThermometerSnowflake, 
  Wind, 
  Radio, 
  Calendar,
  CheckCircle2,
  Globe2,
  Layers
} from 'lucide-react';
import ExpeditionCard from '../components/ExpeditionCard';
import IndiaFlag from '../components/IndiaFlag';

export default function Home({ navigateTo, onSelectExpedition }) {
  const { 
    expeditions, 
    activities, 
    stations, 
    lang, 
    t, 
    setSelectedRegion 
  } = usePortal();

  const [activeStationRegion, setActiveStationRegion] = useState('All');

  // Featured expedition (e.g. 43rd Antarctic)
  const featuredExpedition = expeditions.find(e => e.id === 'isea-43') || expeditions[0];

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
    navigateTo('expeditions');
  };

  const visibleStations = stations
    .filter((st) => ['st-bharati', 'st-maitri', 'st-himadri', 'st-himansh'].includes(st.id))
    .filter((st) => {
      if (activeStationRegion === 'All') return true;
      return st.region.toLowerCase() === activeStationRegion.toLowerCase();
    });

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
        {/* Modern Layered Aurora & Particle Mesh Backdrop */}
        <div className="hero-aurora-glow"></div>
        <div className="hero-grid-pattern"></div>
        <div className="hero-bg-overlay"></div>

        <div className="container hero-content">
          {/* Sovereign & Scientific Institutional Masthead */}
          <div className="hero-institutional-masthead">
            <div className="masthead-sovereign-line">
              <span className="masthead-rule left-rule"></span>
              <div className="masthead-identity">
                <IndiaFlag width={24} height={16} className="masthead-flag" />
                <span className="masthead-entity">
                  {lang === 'hi' ? 'भारत सरकार • पृथ्वी विज्ञान मंत्रालय' : 'GOVERNMENT OF INDIA • MINISTRY OF EARTH SCIENCES'}
                </span>
              </div>
              <span className="masthead-rule right-rule"></span>
            </div>
            
            <div className="masthead-institute-node">
              <span className="institute-fullname">
                {lang === 'hi' 
                  ? 'राष्ट्रीय ध्रुवीय एवं महासागर अनुसंधान केंद्र' 
                  : 'National Centre for Polar and Ocean Research'}
              </span>
              <span className="institute-acronym">NCPOR</span>
            </div>
          </div>

          <h1 className="hero-heading">
            <span className="hero-title-main">
              {lang === 'hi' ? 'राष्ट्रीय ध्रुवीय विज्ञान' : 'NATIONAL POLAR SCIENCE'}
            </span>
            <span className="hero-title-accent">
              {lang === 'hi' ? 'आउटरीच पोर्टल' : 'OUTREACH PORTAL'}
            </span>
          </h1>

          <h2 className="hero-tagline">
            {t.hero.title}
          </h2>

          <p className="hero-subtext">
            {t.hero.subtitle}
          </p>

          <div className="hero-cta-group">
            <button 
              className="btn-saffron hero-btn hero-btn-primary"
              onClick={() => {
                setSelectedRegion('All');
                navigateTo('expeditions');
              }}
            >
              <Compass size={18} />
              <span>{t.hero.exploreExpeditions}</span>
            </button>

            <button 
              className="btn-secondary hero-btn hero-btn-glass"
              onClick={() => navigateTo('map')}
            >
              <Globe2 size={18} />
              <span>{t.hero.interactiveMap}</span>
            </button>
          </div>


          {/* India's Polar Research Stations Hub */}
          <div className="hero-stations-hub">
            <div className="stations-hub-header">
              <div className="hub-header-left">
                <span className="hub-eyebrow">
                  <Radio size={12} className="hub-radio-pulse" />
                  <span>{lang === 'hi' ? 'रीयल-टाइम ध्रुवीय वेधशालाएं' : 'REAL-TIME POLAR BASES'}</span>
                </span>
                <h2 className="hub-title">
                  {lang === 'hi' ? 'भारत के प्रमुख अनुसंधान केंद्र' : "India's Polar Research Stations"}
                </h2>
              </div>

              <div className="station-filter-pills" role="tablist" aria-label="Filter stations by region">
                {['All', 'Antarctica', 'Arctic', 'Himalaya'].map(region => (
                  <button
                    key={region}
                    type="button"
                    className={`filter-pill ${activeStationRegion === region ? 'active' : ''}`}
                    onClick={() => setActiveStationRegion(region)}
                    role="tab"
                    aria-selected={activeStationRegion === region}
                  >
                    {region === 'All' ? (lang === 'hi' ? 'सभी केंद्र (4)' : 'All Bases (4)') : 
                     region === 'Antarctica' ? (lang === 'hi' ? 'अंटार्कटिका (2)' : 'Antarctica (2)') :
                     region === 'Arctic' ? (lang === 'hi' ? 'आर्कटिक (1)' : 'Arctic (1)') : 
                     (lang === 'hi' ? 'हिमालय (1)' : 'Himalaya (1)')}
                  </button>
                ))}
              </div>
            </div>

            <div className={`hero-stations-grid ${visibleStations.length === 2 ? 'filtered-2' : visibleStations.length === 1 ? 'filtered-1' : ''}`}>
              {visibleStations.map((st) => (
                <div 
                  key={st.id} 
                  className="station-ops-card"
                  onClick={() => navigateTo('map')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigateTo('map');
                    }
                  }}
                >
                  <div className="station-card-media">
                    <img 
                      src={st.image} 
                      alt={st.name} 
                      className="station-card-img" 
                      loading="lazy"
                    />
                    <div className="station-media-gradient"></div>
                    <div className="station-card-top-row">
                      <span className={`station-region-pill pill-${st.region.toLowerCase()}`}>
                        <MapPin size={10} />
                        <span>{st.region}</span>
                      </span>
                      <span className="station-live-badge">
                        <span className="live-status-dot"></span>
                        <span>LIVE</span>
                      </span>
                    </div>
                  </div>

                  <div className="station-card-body">
                    <div className="station-card-info">
                      <div className="station-name-row">
                        <h3 className="station-card-name">
                          {lang === 'hi' && st.nameHi ? st.nameHi : st.name}
                        </h3>
                        <span className="station-comm-year">Est. {st.commissioned}</span>
                      </div>
                      <span className="station-coords-badge">
                        {Math.abs(st.lat).toFixed(1)}°{st.lat < 0 ? 'S' : 'N'}, {Math.abs(st.lng).toFixed(1)}°{st.lng < 0 ? 'W' : 'E'}
                        {st.elevation && <span className="st-elev"> • {st.elevation}</span>}
                      </span>
                    </div>

                    <div className="station-card-footer">
                      <div className="station-telemetry-strip">
                        <span className="telemetry-chip temp-chip" title="Real-time temperature">
                          <ThermometerSnowflake size={11} className="chip-icon-temp" />
                          <span>{st.temp}</span>
                        </span>
                        <span className="telemetry-dot">•</span>
                        <span className="telemetry-chip wind-chip" title="Wind conditions">
                          <Wind size={11} className="chip-icon-wind" />
                          <span>{st.wind}</span>
                        </span>
                      </div>
                      <span className="station-3d-btn">
                        <Layers size={10} className="btn-3d-icon" />
                        <span>3D Base</span>
                        <ArrowRight size={10} className="btn-3d-arrow" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
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
              <div className="pillar-img-wrap">
                <div className="pillar-bg-img bg-antarctica"></div>
                <div className="pillar-img-fade"></div>
              </div>
              <div className="pillar-body">
                <h3 className="pillar-title">Antarctica</h3>
                <p className="pillar-desc">
                  Maitri & Bharati — ice core paleoclimatology, Southern Ocean dynamics, and space weather.
                </p>
                <div className="pillar-footer">
                  <div className="pillar-stats-row">
                    <span className="pillar-stat"><strong>43</strong> Expeditions</span>
                    <span className="pillar-stat-dot"></span>
                    <span className="pillar-stat"><strong>40+</strong> Years</span>
                  </div>
                  <div className="pillar-cta">
                    Explore <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </div>

            {/* Arctic */}
            <div className="pillar-card arctic" onClick={() => handleRegionClick('Arctic')}>
              <div className="pillar-img-wrap">
                <div className="pillar-bg-img bg-arctic"></div>
                <div className="pillar-img-fade"></div>
              </div>
              <div className="pillar-body">
                <h3 className="pillar-title">The Arctic</h3>
                <p className="pillar-desc">
                  Himadri at Ny-Ålesund — Arctic amplification, sea-ice dynamics, and monsoon linkages.
                </p>
                <div className="pillar-footer">
                  <div className="pillar-stats-row">
                    <span className="pillar-stat"><strong>16</strong> Years</span>
                    <span className="pillar-stat-dot"></span>
                    <span className="pillar-stat"><strong>12+</strong> Expeditions</span>
                  </div>
                  <div className="pillar-cta">
                    Explore <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </div>

            {/* Himalaya */}
            <div className="pillar-card himalaya" onClick={() => handleRegionClick('Himalaya')}>
              <div className="pillar-img-wrap">
                <div className="pillar-bg-img bg-himalaya"></div>
                <div className="pillar-img-fade"></div>
              </div>
              <div className="pillar-body">
                <h3 className="pillar-title">Himalayan Cryosphere</h3>
                <p className="pillar-desc">
                  Himansh Observatory, Spiti — glacier mass balance, ice-radar profiling, and water security.
                </p>
                <div className="pillar-footer">
                  <div className="pillar-stats-row">
                    <span className="pillar-stat"><strong>4,080m</strong> Altitude</span>
                    <span className="pillar-stat-dot"></span>
                    <span className="pillar-stat"><strong>5+</strong> Glaciers</span>
                  </div>
                  <div className="pillar-cta">
                    Explore <ArrowRight size={14} />
                  </div>
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
          margin-bottom: -4rem;
        }

        .telemetry-inner {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          overflow-x: auto;
          white-space: nowrap;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .telemetry-inner::-webkit-scrollbar {
          display: none;
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
          color: #059669;
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
          padding: 2.25rem 0 2.25rem;
          background: 
            radial-gradient(120% 100% at 50% 0%, rgba(15, 23, 42, 0.48) 0%, rgba(15, 23, 42, 0.82) 60%, rgba(15, 23, 42, 0.98) 100%),
            url('https://images.unsplash.com/photo-1509326066092-14b2e882fe86?q=80&w=1920&auto=format&fit=crop') center 40% / cover no-repeat;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          overflow: hidden;
        }

        /* Animated Aurora Lights */
        .hero-aurora-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: 
            radial-gradient(ellipse 65% 35% at 50% 12%, rgba(16, 185, 129, 0.24) 0%, rgba(6, 182, 212, 0.14) 45%, transparent 75%),
            radial-gradient(circle at 18% 28%, rgba(56, 189, 248, 0.16) 0%, transparent 45%),
            radial-gradient(circle at 82% 22%, rgba(217, 119, 6, 0.14) 0%, transparent 40%);
          filter: blur(28px);
          animation: auroraFloat 12s ease-in-out infinite alternate;
        }

        @keyframes auroraFloat {
          0% {
            transform: scale(1) translateY(0);
            opacity: 0.85;
          }
          50% {
            transform: scale(1.06) translateY(-10px);
            opacity: 1;
          }
          100% {
            transform: scale(1.02) translateY(6px);
            opacity: 0.88;
          }
        }

        /* Latitude/Longitude Science Particle Grid */
        .hero-grid-pattern {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: 
            radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: radial-gradient(ellipse 80% 55% at 50% 30%, #000 20%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse 80% 55% at 50% 30%, #000 20%, transparent 80%);
          opacity: 0.7;
        }

        .hero-bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 65%, rgba(15, 23, 42, 0.95) 100%);
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 1080px;
        }

        /* Sovereign & Scientific Institutional Masthead (Prestigious & Non-Generic) */
        .hero-institutional-masthead {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.45rem;
          margin-bottom: 1.25rem;
          width: 100%;
          max-width: 860px;
        }

        .masthead-sovereign-line {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.95rem;
          width: 100%;
        }

        .masthead-rule {
          flex: 1;
          height: 1px;
          min-width: 30px;
          background: linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.4));
        }

        .masthead-rule.right-rule {
          background: linear-gradient(90deg, rgba(56, 189, 248, 0.4), transparent);
        }

        .masthead-identity {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          flex-shrink: 0;
        }

        .masthead-flag {
          border-radius: 2px;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.4);
          transition: transform 0.2s ease;
        }

        .masthead-entity {
          font-family: var(--font-heading);
          font-size: 0.88rem;
          font-weight: 750;
          letter-spacing: 0.14em;
          color: #f8fafc;
          text-transform: uppercase;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
        }

        .masthead-institute-node {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 600;
        }

        .institute-fullname {
          color: #e2e8f0;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-shadow: 0 1px 8px rgba(0, 0, 0, 0.5);
        }

        .institute-acronym {
          color: #7dd3fc;
          font-weight: 800;
          background: rgba(14, 165, 233, 0.28);
          border: 1px solid rgba(125, 211, 252, 0.7);
          padding: 0.12rem 0.5rem;
          border-radius: 4px;
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          text-shadow: 0 0 10px rgba(56, 189, 248, 0.7);
          box-shadow: 0 0 14px rgba(56, 189, 248, 0.3), inset 0 0 8px rgba(56, 189, 248, 0.2);
          backdrop-filter: blur(4px);
        }

        /* Primary High-Priority Main Portal Heading */
        .hero-heading {
          font-size: clamp(2.35rem, 4.8vw + 0.3rem, 3.85rem);
          font-weight: 900;
          color: #ffffff;
          line-height: 1.08;
          margin-bottom: 0.85rem;
          letter-spacing: -0.025em;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          align-items: center;
          text-transform: uppercase;
        }

        .hero-title-main {
          color: #ffffff;
          letter-spacing: -0.015em;
          text-shadow: 0 4px 28px rgba(0, 0, 0, 0.65), 0 0 50px rgba(56, 189, 248, 0.2);
        }

        .hero-title-accent {
          background: linear-gradient(115deg, #0ea5e9 0%, #38bdf8 25%, #67e8f9 50%, #bae6fd 78%, #ffffff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 4px 24px rgba(14, 165, 233, 0.55)) drop-shadow(0 2px 12px rgba(0, 0, 0, 0.45));
          letter-spacing: 0.02em;
        }

        .hero-tagline {
          font-family: var(--font-heading);
          font-size: clamp(1.05rem, 1.8vw + 0.2rem, 1.3rem);
          font-weight: 600;
          color: #e0f2fe;
          line-height: 1.4;
          margin-bottom: 0.55rem;
          max-width: 800px;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
        }

        .hero-subtext {
          font-size: 0.98rem;
          color: #cbd5e1;
          line-height: 1.55;
          margin-bottom: 1.25rem;
          max-width: 720px;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
        }

        /* Modern CTA Group */
        .hero-cta-group {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.9rem;
          flex-wrap: wrap;
          margin-bottom: 0.95rem;
        }

        .hero-btn {
          padding: 0.68rem 1.5rem;
          font-size: 0.9rem;
          font-weight: 700;
          border-radius: var(--radius-sm);
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          transition: all 0.24s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-btn-primary {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #ffffff;
          box-shadow: 0 6px 20px rgba(217, 119, 6, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25);
        }

        .hero-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(217, 119, 6, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.35);
          background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
        }

        .hero-btn-glass {
          background: rgba(15, 23, 42, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.28);
          color: #ffffff;
          backdrop-filter: blur(14px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .hero-btn-glass:hover {
          background: rgba(30, 41, 59, 0.85);
          border-color: rgba(56, 189, 248, 0.6);
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35), 0 0 16px rgba(56, 189, 248, 0.25);
        }

        /* Polar Science Impact Counter Strip */
        .hero-metrics-strip {
          display: inline-flex;
          align-items: center;
          gap: 1.4rem;
          background: rgba(15, 23, 42, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.16);
          backdrop-filter: blur(16px);
          padding: 0.65rem 1.6rem;
          border-radius: var(--radius-lg);
          margin-top: 0.25rem;
          margin-bottom: 1.65rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.12);
        }

        .hero-metric-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.15rem;
        }

        .metric-num {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
        }

        .metric-plus, .metric-unit {
          color: #38bdf8;
          font-size: 0.95rem;
          font-weight: 700;
          margin-left: 2px;
        }

        .metric-label {
          font-size: 0.7rem;
          color: #cbd5e1;
          font-weight: 500;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        .metric-divider {
          width: 1px;
          height: 24px;
          background: rgba(255, 255, 255, 0.18);
        }

        /* Polar Research Stations Hub - Compact, Smooth & Balanced */
        .hero-stations-hub {
          width: 100%;
          max-width: 1020px;
          margin: 1.25rem auto 0;
        }

        .stations-hub-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.85rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .hub-header-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.15rem;
        }

        .hub-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.64rem;
          font-weight: 800;
          color: #34d399;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .hub-radio-pulse {
          color: #34d399;
          animation: pulse 2s infinite;
        }

        .hub-title {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .station-filter-pills {
          display: inline-flex;
          align-items: center;
          background: rgba(15, 23, 42, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: var(--radius-full);
          padding: 0.2rem;
          gap: 0.2rem;
          backdrop-filter: blur(12px);
        }

        .filter-pill {
          background: transparent;
          border: none;
          color: #cbd5e1;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.28rem 0.75rem;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-pill:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }

        .filter-pill.active {
          background: #059669;
          color: #ffffff;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(5, 150, 105, 0.4);
        }

        .hero-stations-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.8rem;
          width: 100%;
          transition: all 0.3s ease;
        }

        .hero-stations-grid.filtered-2 {
          grid-template-columns: repeat(2, 1fr);
          max-width: 520px;
          margin: 0 auto;
        }

        .hero-stations-grid.filtered-1 {
          grid-template-columns: 1fr;
          max-width: 270px;
          margin: 0 auto;
        }

        /* Ultra-Smooth Frosted Polar Glass Station Card */
        .station-ops-card {
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.75) 0%, rgba(15, 23, 42, 0.9) 100%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          overflow: hidden;
          text-align: left;
          box-shadow: 0 6px 20px -2px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.04);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          position: relative;
          backdrop-filter: blur(16px);
        }

        .station-ops-card:hover {
          transform: translateY(-3px);
          border-color: rgba(56, 189, 248, 0.45);
          box-shadow: 0 12px 28px -4px rgba(0, 0, 0, 0.45), 0 0 16px rgba(56, 189, 248, 0.18);
        }

        .station-card-media {
          position: relative;
          height: 74px;
          width: 100%;
          overflow: hidden;
        }

        .station-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .station-ops-card:hover .station-card-img {
          transform: scale(1.06);
        }

        .station-media-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%);
        }

        .station-card-top-row {
          position: absolute;
          top: 0.45rem;
          left: 0.55rem;
          right: 0.55rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 2;
        }

        .station-region-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.6rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 0.14rem 0.45rem;
          border-radius: 9999px;
          backdrop-filter: blur(8px);
        }

        .pill-antarctica {
          background: rgba(4, 120, 87, 0.85);
          color: #ecfdf5;
          border: 1px solid rgba(167, 243, 208, 0.35);
        }

        .pill-arctic {
          background: rgba(21, 128, 61, 0.85);
          color: #f0fdf4;
          border: 1px solid rgba(187, 247, 208, 0.35);
        }

        .pill-himalaya {
          background: rgba(180, 83, 9, 0.85);
          color: #fffbeb;
          border: 1px solid rgba(253, 230, 138, 0.35);
        }

        .station-live-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.58rem;
          font-weight: 800;
          color: #34d399;
          background: rgba(15, 23, 42, 0.75);
          border: 1px solid rgba(52, 211, 153, 0.4);
          padding: 0.12rem 0.42rem;
          border-radius: 9999px;
          backdrop-filter: blur(8px);
        }

        .live-status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 6px #34d399;
        }

        .station-card-body {
          padding: 0.65rem 0.75rem 0.72rem;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          flex: 1;
        }

        .station-card-info {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .station-name-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 0.4rem;
        }

        .station-card-name {
          font-family: var(--font-heading);
          font-size: 0.95rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.25;
        }

        .station-comm-year {
          font-size: 0.62rem;
          color: #94a3b8;
          font-weight: 500;
          white-space: nowrap;
        }

        .station-coords-badge {
          font-size: 0.65rem;
          color: #94a3b8;
          font-family: var(--font-mono);
          font-weight: 500;
        }

        .st-elev {
          color: #64748b;
          font-family: var(--font-body);
        }

        /* Redesigned Telemetry & 3D Base Action Bar */
        .station-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.35rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 0.32rem 0.48rem;
          transition: border-color 0.2s ease, background 0.2s ease;
        }

        .station-ops-card:hover .station-card-footer {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(56, 189, 248, 0.22);
        }

        .station-telemetry-strip {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          min-width: 0;
          overflow: hidden;
        }

        .telemetry-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.22rem;
          font-size: 0.7rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .temp-chip {
          color: #6ee7b7;
        }

        .wind-chip {
          color: #cbd5e1;
          font-size: 0.66rem;
        }

        .chip-icon-temp {
          color: #34d399;
          flex-shrink: 0;
        }

        .chip-icon-wind {
          color: #64748b;
          flex-shrink: 0;
        }

        .telemetry-dot {
          color: rgba(255, 255, 255, 0.22);
          font-size: 0.65rem;
          flex-shrink: 0;
        }

        /* Redesigned 3D Base Button */
        .station-3d-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.24rem;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: #38bdf8;
          white-space: nowrap;
          flex-shrink: 0;
          padding: 0.22rem 0.52rem;
          border-radius: 9999px;
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.28);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-3d-icon {
          color: #38bdf8;
          transition: transform 0.2s ease;
        }

        .btn-3d-arrow {
          color: #38bdf8;
          transition: transform 0.2s ease;
        }

        .station-ops-card:hover .station-3d-btn {
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.95) 0%, rgba(2, 132, 199, 0.95) 100%);
          border-color: #38bdf8;
          color: #ffffff;
          box-shadow: 0 2px 10px rgba(14, 165, 233, 0.4);
        }

        .station-ops-card:hover .station-3d-btn .btn-3d-icon {
          color: #ffffff;
          transform: rotate(-10deg);
        }

        .station-ops-card:hover .station-3d-btn .btn-3d-arrow {
          color: #ffffff;
          transform: translateX(2px);
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

        /* 3 Pillars — Enhanced */
        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .pillar-card {
          position: relative;
          height: 420px;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 24px -4px rgba(0, 0, 0, 0.3);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .pillar-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px -8px rgba(0, 0, 0, 0.45);
        }

        .pillar-card.antarctica:hover {
          border-color: rgba(52, 211, 153, 0.5);
          box-shadow: 0 20px 40px -8px rgba(0, 0, 0, 0.45), 0 0 24px rgba(52, 211, 153, 0.15);
        }

        .pillar-card.arctic:hover {
          border-color: rgba(56, 189, 248, 0.5);
          box-shadow: 0 20px 40px -8px rgba(0, 0, 0, 0.45), 0 0 24px rgba(56, 189, 248, 0.15);
        }

        .pillar-card.himalaya:hover {
          border-color: rgba(251, 191, 36, 0.5);
          box-shadow: 0 20px 40px -8px rgba(0, 0, 0, 0.45), 0 0 24px rgba(251, 191, 36, 0.15);
        }

        .pillar-bg-img {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .bg-antarctica {
          background-image: url('https://data.ncpor.res.in/static/images/slider/bharati/IMG_(17).JPG');
        }

        .bg-arctic {
          background-image: url('https://data.ncpor.res.in/static/images/slider/himadri/IMG_3.JPG');
        }

        .bg-himalaya {
          background-image: url('https://data.ncpor.res.in/static/images/slider/himansh/IMG_4.JPG');
        }

        .pillar-card:hover .pillar-bg-img {
          transform: scale(1.08);
        }

        .pillar-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(10, 25, 47, 0.15) 0%, rgba(10, 25, 47, 0.5) 45%, rgba(10, 25, 47, 0.92) 100%);
        }

        .pillar-content {
          position: absolute;
          inset: 0;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          z-index: 1;
        }

        /* Meta chips */
        .pillar-meta-chips {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.65rem;
        }

        .pillar-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.2rem 0.55rem;
          border-radius: 9999px;
          backdrop-filter: blur(8px);
          letter-spacing: 0.02em;
        }

        .chip-location {
          background: rgba(255, 255, 255, 0.12);
          color: #e2e8f0;
          border: 1px solid rgba(255, 255, 255, 0.18);
        }

        .chip-count {
          background: rgba(255, 255, 255, 0.08);
          color: #cbd5e1;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .pillar-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 0.45rem;
          letter-spacing: -0.01em;
          line-height: 1.25;
        }

        .pillar-title-sub {
          font-weight: 500;
          color: #94a3b8;
          font-size: 0.85em;
        }

        .pillar-desc {
          font-size: 0.82rem;
          color: #cbd5e1;
          line-height: 1.55;
          margin-bottom: 1rem;
        }

        /* Stats row */
        .pillar-stats-row {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.65rem 0;
          margin-bottom: 0.85rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .pillar-stat {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .pillar-stat-num {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
        }

        .antarctica .pillar-stat-num { color: #6ee7b7; }
        .arctic .pillar-stat-num { color: #7dd3fc; }
        .himalaya .pillar-stat-num { color: #fcd34d; }

        .pillar-stat-label {
          font-size: 0.65rem;
          color: #94a3b8;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .pillar-stat-divider {
          width: 1px;
          height: 28px;
          background: rgba(255, 255, 255, 0.15);
        }

        .pillar-action {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.82rem;
          font-weight: 700;
          transition: gap 0.25s ease;
        }

        .antarctica .pillar-action { color: #34d399; }
        .arctic .pillar-action { color: #38bdf8; }
        .himalaya .pillar-action { color: #fbbf24; }

        .pillar-card:hover .pillar-action {
          gap: 0.75rem;
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
          .home-page-container {
            gap: 3rem;
          }
          .telemetry-bar {
            margin-bottom: -3rem;
          }
          .hero-stations-hub {
            max-width: 580px;
          }
          .hero-stations-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }
          .hero-metrics-strip {
            gap: 1.25rem;
            padding: 0.75rem 1.4rem;
          }
          .pillars-grid {
            grid-template-columns: 1fr;
          }
          .pillar-card {
            height: 340px;
          }
          .spotlight-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .activities-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .stations-hub-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.85rem;
          }
          .station-filter-pills {
            width: 100%;
            overflow-x: auto;
            white-space: nowrap;
            scrollbar-width: none;
          }
          .station-filter-pills::-webkit-scrollbar {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .home-page-container {
            gap: 2.25rem;
          }
          .telemetry-bar {
            margin-bottom: -2.25rem;
          }
          .hero-section {
            padding: 2.5rem 0 1.75rem;
          }
          .masthead-rule {
            display: none;
          }
          .masthead-entity {
            font-size: 0.68rem;
            letter-spacing: 0.1em;
            text-align: center;
          }
          .masthead-institute-node {
            flex-wrap: wrap;
            justify-content: center;
            font-size: 0.68rem;
            text-align: center;
          }
          .hero-heading {
            font-size: clamp(1.85rem, 6.2vw + 0.2rem, 2.45rem);
          }
          .hero-tagline {
            font-size: 0.95rem;
          }
          .hero-subtext {
            font-size: 0.88rem;
            margin-bottom: 1.15rem;
          }
          .hero-metrics-strip {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.85rem;
            width: 100%;
            padding: 0.9rem;
          }
          .metric-divider {
            display: none;
          }
          .hero-stations-hub {
            max-width: 330px;
            margin: 1rem auto 0;
          }
          .hero-stations-grid {
            grid-template-columns: 1fr;
            max-width: 320px;
            margin: 0 auto;
          }
          .pillar-card {
            height: 320px;
          }
          .spotlight-card {
            padding: 1.25rem;
          }
          .spotlight-media {
            height: 200px;
          }
          .spotlight-title {
            font-size: 1.35rem;
          }
          .activity-card {
            padding: 1.15rem;
          }
        }

        @media (max-width: 480px) {
          .hero-cta-group {
            flex-direction: column;
            width: 100%;
          }
          .hero-cta-group .hero-btn {
            width: 100%;
          }
          .spotlight-actions {
            flex-direction: column;
            align-items: stretch;
          }
          .spotlight-actions .btn-saffron,
          .spotlight-actions .btn-secondary {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}

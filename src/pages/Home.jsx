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
          <div className="telemetry-label" onClick={() => navigateTo('map')} title="Open Live Polar Map" role="button" tabIndex={0}>
            <Radio size={14} className="telemetry-pulse-icon" />
            <span>LIVE POLAR TELEMETRY</span>
          </div>

          <div className="telemetry-divider"></div>

          <div className="telemetry-stations">
            {stations.slice(0, 4).map((st) => (
              <div 
                key={st.id} 
                className="station-ticker-item"
                onClick={() => navigateTo('map')}
                title={`View ${st.name} live telemetry on 3D map`}
                role="button"
                tabIndex={0}
              >
                <span className="st-name">{st.name.replace(' Station', '')}</span>
                <span className="st-temp">
                  <ThermometerSnowflake size={13} />
                  <span>{st.temp}</span>
                </span>
                <span className="st-dot">•</span>
                <span className="st-wind">
                  <Wind size={13} />
                  <span>{st.wind}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="telemetry-action" onClick={() => navigateTo('map')} role="button" tabIndex={0} title="View all bases on 3D map">
            <span>3D Map</span>
            <ArrowRight size={13} />
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
              <div className="pillar-bg-img bg-antarctica"></div>
              <div className="pillar-overlay"></div>
              <div className="pillar-top-tag">
                <span className="pillar-tag-badge">South Pole</span>
              </div>
              <div className="pillar-content">
                <h3 className="pillar-title">Antarctica</h3>
                <p className="pillar-desc">Maitri and Bharati stations investigating ice cores, ocean currents, and space weather.</p>
                <div className="pillar-chips">
                  <span className="pillar-chip">Ice Cores</span>
                  <span className="pillar-chip">Space Weather</span>
                </div>
                <div className="pillar-footer">
                  <div className="pillar-meta">
                    <span>43 Expeditions</span>
                    <span className="meta-dot">•</span>
                    <span>40+ Years</span>
                  </div>
                  <div className="pillar-action">
                    <span>Explore</span>
                    <ArrowRight size={14} className="pillar-arrow" />
                  </div>
                </div>
              </div>
            </div>

            {/* Arctic */}
            <div className="pillar-card arctic" onClick={() => handleRegionClick('Arctic')}>
              <div className="pillar-bg-img bg-arctic"></div>
              <div className="pillar-overlay"></div>
              <div className="pillar-top-tag">
                <span className="pillar-tag-badge">North Pole</span>
              </div>
              <div className="pillar-content">
                <h3 className="pillar-title">Arctic</h3>
                <p className="pillar-desc">Himadri station at Ny-Ålesund studying Arctic amplification and monsoon linkages.</p>
                <div className="pillar-chips">
                  <span className="pillar-chip">Sea Ice</span>
                  <span className="pillar-chip">Monsoon Links</span>
                </div>
                <div className="pillar-footer">
                  <div className="pillar-meta">
                    <span>12+ Expeditions</span>
                    <span className="meta-dot">•</span>
                    <span>16 Years</span>
                  </div>
                  <div className="pillar-action">
                    <span>Explore</span>
                    <ArrowRight size={14} className="pillar-arrow" />
                  </div>
                </div>
              </div>
            </div>

            {/* Himalaya */}
            <div className="pillar-card himalaya" onClick={() => handleRegionClick('Himalaya')}>
              <div className="pillar-bg-img bg-himalaya"></div>
              <div className="pillar-overlay"></div>
              <div className="pillar-top-tag">
                <span className="pillar-tag-badge">Third Pole</span>
              </div>
              <div className="pillar-content">
                <h3 className="pillar-title">Himalayas</h3>
                <p className="pillar-desc">Himansh observatory in Spiti Valley monitoring glacier mass balance and water security.</p>
                <div className="pillar-chips">
                  <span className="pillar-chip">Glaciology</span>
                  <span className="pillar-chip">Water Security</span>
                </div>
                <div className="pillar-footer">
                  <div className="pillar-meta">
                    <span>4,080m Altitude</span>
                    <span className="meta-dot">•</span>
                    <span>5+ Glaciers</span>
                  </div>
                  <div className="pillar-action">
                    <span>Explore</span>
                    <ArrowRight size={14} className="pillar-arrow" />
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
            <div className="section-header">
              <div className="section-eyebrow">FEATURED MISSION</div>
              <h2 className="section-title">Latest Expedition Spotlight</h2>
            </div>
            <div className="spotlight-card">
              <div className="spotlight-grid">
                <div className="spotlight-media">
                  <img 
                    src={featuredExpedition.heroImage} 
                    alt={featuredExpedition.title} 
                    className="spotlight-img"
                  />
                </div>

                <div className="spotlight-info">
                  <div className="spotlight-top-tags">
                    <span className="badge badge-antarctica">{featuredExpedition.region}</span>
                    <span className="spotlight-year">{featuredExpedition.year}</span>
                    {featuredExpedition.aiGeneratedContent && (
                      <span className="spotlight-ai-tag">AI Outreach Ready</span>
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
                      <CheckCircle2 size={14} className="deliv-icon" />
                      <span>122m paleoclimatic ice core retrieved</span>
                    </div>
                    <div className="deliverable-item">
                      <CheckCircle2 size={14} className="deliv-icon" />
                      <span>Zero-waste green power microgrid operational</span>
                    </div>
                    <div className="deliverable-item">
                      <CheckCircle2 size={14} className="deliv-icon" />
                      <span>14 novel cold-active extremophile microbes isolated</span>
                    </div>
                  </div>

                  <div className="spotlight-actions">
                    <button 
                      className="btn-primary"
                      onClick={() => onSelectExpedition(featuredExpedition.id)}
                    >
                      <span>View Full Archive</span>
                      <ArrowRight size={15} />
                    </button>
                    <button 
                      className="btn-secondary"
                      onClick={() => navigateTo('map')}
                    >
                      <MapPin size={15} />
                      <span>Station Map</span>
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
            {activities.map((act) => {
              const cleanTitle = (lang === 'hi' && act.titleHi ? act.titleHi : act.title).replace(/[—–]/g, '-');
              const cleanSummary = act.summary ? act.summary.replace(/[—–]/g, '-') : '';
              return (
                <div key={act.id} className="activity-card" role="article">
                  <div className="act-top-bar">
                    <span className={`act-badge act-badge-${act.id}`}>
                      {act.badge}
                    </span>
                    <span className="act-date">
                      <Calendar size={12} />
                      <span>{act.date}</span>
                    </span>
                  </div>

                  <h4 className="act-title" title={cleanTitle}>
                    {cleanTitle}
                  </h4>

                  <p className="act-summary">{cleanSummary}</p>

                  <div className="act-footer">
                    <span className="act-type-label">{act.type}</span>
                    <div className="act-action-link">
                      <span>Read Update</span>
                      <ArrowRight size={13} className="act-arrow" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        .home-page-container {
          --home-section-gap: 4rem;
          display: flex;
          flex-direction: column;
          gap: var(--home-section-gap);
        }

        /* Telemetry Bar */
        .telemetry-bar {
          background: #dfe4ea;
          border-bottom: 1px solid #cbd5e1;
          padding: 0.5rem 0;
          font-size: 0.84rem;
          margin-bottom: calc(-1 * var(--home-section-gap));
        }

        .telemetry-inner {
          display: flex;
          align-items: center;
          gap: 1.15rem;
          overflow-x: auto;
          white-space: nowrap;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .telemetry-inner::-webkit-scrollbar {
          display: none;
        }

        .telemetry-label {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          color: #0369a1;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          flex-shrink: 0;
          cursor: pointer;
        }

        .telemetry-pulse-icon {
          color: #0369a1;
        }

        .telemetry-divider {
          width: 1px;
          height: 16px;
          background: #cbd5e1;
          flex-shrink: 0;
        }

        .telemetry-stations {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          flex: 1;
        }

        .station-ticker-item {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.15s ease;
        }

        .station-ticker-item:hover {
          background: rgba(255, 255, 255, 0.55);
          transform: translateY(-1px);
        }

        .st-name {
          color: #0f172a;
          font-weight: 700;
          font-size: 0.83rem;
        }

        .st-temp {
          color: #059669;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.82rem;
        }

        .st-dot {
          color: #94a3b8;
          font-size: 0.72rem;
        }

        .st-wind {
          color: #64748b;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.80rem;
        }

        .telemetry-action {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: #0369a1;
          cursor: pointer;
          margin-left: auto;
          flex-shrink: 0;
          transition: opacity 0.15s ease, transform 0.15s ease;
        }

        .telemetry-action:hover {
          opacity: 0.8;
          transform: translateX(2px);
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
          color: #ffffff;
          font-weight: 800;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 0.12rem 0.5rem;
          border-radius: 4px;
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), inset 0 0 6px rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
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

        /* 3 Pillars */
        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .pillar-card {
          position: relative;
          height: 380px;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 24px -6px rgba(0, 0, 0, 0.25);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease;
        }

        .pillar-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 22px 42px -10px rgba(0, 0, 0, 0.45);
          border-color: rgba(255, 255, 255, 0.25);
        }

        .pillar-card:active {
          transform: translateY(-2px);
        }

        .pillar-bg-img {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .pillar-card:hover .pillar-bg-img {
          transform: scale(1.08);
        }

        .bg-antarctica { background-image: url('https://data.ncpor.res.in/static/images/slider/bharati/IMG_(17).JPG'); }
        .bg-arctic { background-image: url('https://data.ncpor.res.in/static/images/slider/himadri/IMG_3.JPG'); }
        .bg-himalaya { background-image: url('https://data.ncpor.res.in/static/images/slider/himansh/IMG_4.JPG'); }

        .pillar-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(10, 20, 40, 0.15) 0%, rgba(10, 20, 40, 0.35) 35%, rgba(8, 15, 30, 0.95) 100%);
          transition: background 0.35s ease;
        }

        .pillar-card:hover .pillar-overlay {
          background: linear-gradient(180deg, rgba(10, 20, 40, 0.08) 0%, rgba(10, 20, 40, 0.28) 30%, rgba(8, 15, 30, 0.96) 100%);
        }

        .pillar-top-tag {
          position: absolute;
          top: 1.15rem;
          left: 1.15rem;
          z-index: 2;
        }

        .pillar-tag-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.3rem 0.75rem;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #ffffff;
          background: rgba(10, 20, 40, 0.65);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
        }

        .pillar-card:hover .pillar-tag-badge {
          background: rgba(10, 20, 40, 0.85);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-1px);
        }

        .pillar-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1.35rem;
          z-index: 1;
        }

        .pillar-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 0.35rem;
          letter-spacing: -0.01em;
          transition: transform 0.25s ease;
        }

        .pillar-card:hover .pillar-title {
          transform: translateX(2px);
        }

        .pillar-desc {
          font-size: 0.78rem;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.45;
          margin: 0 0 0.7rem;
        }

        .pillar-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 0.85rem;
        }

        .pillar-chip {
          font-size: 0.68rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .pillar-card:hover .pillar-chip {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
          color: #ffffff;
        }

        .pillar-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.65rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .pillar-meta {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.72rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.65);
        }

        .meta-dot {
          opacity: 0.5;
        }

        .pillar-action {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.74rem;
          font-weight: 700;
          padding: 0.38rem 0.85rem;
          border-radius: 9999px;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          background: rgba(255, 255, 255, 0.14);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .pillar-arrow {
          transition: transform 0.25s ease;
        }

        .pillar-card:hover .pillar-action {
          background: #ffffff;
          color: #0b192c;
          border-color: #ffffff;
          box-shadow: 0 4px 14px rgba(255, 255, 255, 0.25);
        }

        .pillar-card:hover .pillar-arrow {
          transform: translateX(3px);
        }

        /* Spotlight */
        .spotlight-card {
          padding: 1.75rem;
          border-radius: var(--radius-lg);
          background: #ffffff;
          border: 1px solid var(--border-card);
          box-shadow: 0 2px 20px -4px rgba(0, 0, 0, 0.08);
          transition: box-shadow 0.3s ease;
        }

        .spotlight-card:hover {
          box-shadow: 0 8px 32px -6px rgba(0, 0, 0, 0.12);
        }

        .spotlight-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: start;
        }

        .spotlight-media {
          position: relative;
          height: 320px;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid var(--border-subtle);
        }

        .spotlight-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .spotlight-card:hover .spotlight-img {
          transform: scale(1.03);
        }

        .spotlight-top-tags {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.65rem;
          flex-wrap: wrap;
        }

        .spotlight-year {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .spotlight-ai-tag {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
          font-size: 0.68rem;
          font-weight: 700;
        }

        .spotlight-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--navy);
          line-height: 1.3;
          margin-bottom: 0.65rem;
        }

        .spotlight-summary {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .spotlight-deliverables {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-bottom: 1.25rem;
        }

        .deliverable-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .deliv-icon {
          color: #059669;
          flex-shrink: 0;
        }

        .spotlight-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        /* Activities */
        .news-section {
          position: relative;
        }

        .activities-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .activity-card {
          padding: 1.35rem 1.35rem 1.15rem;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          box-shadow: 0 2px 10px -2px rgba(0, 0, 0, 0.04);
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease, border-color 0.28s ease;
          position: relative;
          cursor: pointer;
        }

        .activity-card:hover {
          transform: translateY(-4px);
          border-color: #cbd5e1;
          box-shadow: 0 14px 28px -6px rgba(0, 0, 0, 0.09), 0 2px 6px rgba(0, 0, 0, 0.04);
        }

        .activity-card:active {
          transform: translateY(-1px);
        }

        .act-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 0.85rem;
        }

        .act-badge {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.22rem 0.6rem;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: #e0f2fe;
          color: #0369a1;
          border: 1px solid #bae6fd;
        }

        .act-badge-act-1 {
          background: #fef3c7;
          color: #92400e;
          border-color: #fde68a;
        }

        .act-badge-act-2 {
          background: #e0f2fe;
          color: #0369a1;
          border-color: #bae6fd;
        }

        .act-badge-act-3 {
          background: #ecfdf5;
          color: #065f46;
          border-color: #a7f3d0;
        }

        .act-date {
          font-size: 0.72rem;
          font-weight: 600;
          color: #64748b;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
        }

        .act-title {
          font-size: 1.02rem;
          color: #0f172a;
          font-weight: 700;
          line-height: 1.35;
          margin-bottom: 0.6rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.75rem;
          transition: color 0.2s ease;
        }

        .activity-card:hover .act-title {
          color: #0284c7;
        }

        .act-summary {
          font-size: 0.8rem;
          color: #475569;
          line-height: 1.5;
          margin-bottom: 1.1rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        .act-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.75rem;
          border-top: 1px solid #f1f5f9;
          margin-top: auto;
        }

        .act-type-label {
          font-size: 0.7rem;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .act-action-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.76rem;
          font-weight: 700;
          color: #0284c7;
          transition: color 0.2s ease;
        }

        .act-arrow {
          transition: transform 0.2s ease;
        }

        .activity-card:hover .act-arrow {
          transform: translateX(3px);
        }

        @media (max-width: 1024px) {
          .home-page-container {
            --home-section-gap: 3rem;
          }
          .telemetry-bar {
            margin-bottom: calc(-1 * var(--home-section-gap));
          }
          .hero-stations-hub {
            max-width: 100%;
          }
          .hero-stations-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }
          .hero-metrics-strip {
            gap: 1rem;
            padding: 0.75rem 1.25rem;
          }
          .pillars-grid {
            grid-template-columns: 1fr;
          }
          .pillar-card {
            height: auto;
            min-height: 320px;
          }
          .spotlight-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .activities-grid {
            grid-template-columns: repeat(2, 1fr);
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
            -webkit-overflow-scrolling: touch;
          }
          .station-filter-pills::-webkit-scrollbar {
            display: none;
          }
          .activities-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .home-page-container {
            --home-section-gap: 2.25rem;
          }
          .telemetry-bar {
            margin-bottom: calc(-1 * var(--home-section-gap));
            padding: 0.45rem 0;
          }
          .telemetry-inner {
            gap: 0.85rem;
          }
          .hero-section {
            padding: 2rem 0 1.5rem;
          }
          .masthead-rule {
            display: none;
          }
          .masthead-entity {
            font-size: 0.68rem;
            letter-spacing: 0.08em;
            text-align: center;
          }
          .masthead-institute-node {
            flex-wrap: wrap;
            justify-content: center;
            font-size: 0.68rem;
            text-align: center;
            gap: 0.35rem;
          }
          .hero-heading {
            font-size: clamp(1.75rem, 6.2vw, 2.35rem);
            margin-bottom: 0.65rem;
          }
          .hero-tagline {
            font-size: 0.95rem;
            margin-bottom: 0.45rem;
          }
          .hero-subtext {
            font-size: 0.88rem;
            margin-bottom: 1.15rem;
          }
          .hero-cta-group {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            width: 100%;
            max-width: 520px;
            margin-left: auto;
            margin-right: auto;
            gap: 0.65rem;
          }
          .hero-cta-group .hero-btn {
            flex: 1 1 0;
            width: auto;
            min-width: 0;
            min-height: 44px;
            padding: 0.65rem 0.75rem;
            font-size: clamp(0.74rem, 2.7vw, 0.88rem);
            gap: 0.45rem;
            justify-content: center;
            text-align: center;
            white-space: nowrap;
          }
          .hero-metrics-strip {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
            width: 100%;
            padding: 0.85rem;
          }
          .metric-divider {
            display: none;
          }
          .hero-stations-hub {
            max-width: 100%;
            margin: 1.25rem 0 0;
          }
          .hero-stations-grid {
            grid-template-columns: repeat(2, 1fr);
            max-width: 100%;
            margin: 0;
            gap: 0.65rem;
          }
          .pillar-card {
            height: auto;
            min-height: 280px;
          }
          .spotlight-card {
            padding: 1.25rem;
          }
          .spotlight-media {
            height: 190px;
          }
          .spotlight-title {
            font-size: 1.25rem;
          }
          .activity-card {
            padding: 1.15rem;
          }
          .spotlight-actions {
            flex-direction: column;
            align-items: stretch;
            gap: 0.65rem;
          }
          .spotlight-actions .btn-saffron,
          .spotlight-actions .btn-secondary {
            width: 100%;
            justify-content: center;
            min-height: 44px;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .hero-stations-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
          }
          .hero-metrics-strip {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
          .station-ops-card {
            border-radius: 10px;
          }
          .station-card-media {
            height: 68px;
          }
          .station-card-body {
            padding: 0.55rem 0.6rem;
            gap: 0.35rem;
          }
          .station-card-name {
            font-size: 0.82rem;
          }
          .station-comm-year {
            font-size: 0.58rem;
          }
          .station-coords-badge {
            font-size: 0.58rem;
          }
          .station-card-footer {
            padding: 0.28rem 0.4rem;
            gap: 0.25rem;
          }
          .telemetry-chip {
            font-size: 0.64rem;
          }
          .wind-chip {
            font-size: 0.6rem;
          }
          .station-3d-btn {
            padding: 0.18rem 0.4rem;
            font-size: 0.62rem;
          }
        }
      `}</style>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { usePortal } from '../context/PortalContext';
import PolarGlobeMap from '../components/PolarGlobeMap';
import { 
  MapPin, 
  Compass, 
  ThermometerSnowflake, 
  Wind, 
  Radio, 
  Layers, 
  ArrowRight, 
  Globe2, 
  ShieldCheck,
  Navigation,
  Sparkles,
  Waves,
  Gauge,
  Activity,
  Sun,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { usePolarData } from '../hooks/usePolarData';

export default function PolarMap({ onSelectExpedition, navigateTo }) {
  const { stations, expeditions, lang } = usePortal();
  
  // Selected Station (starts as null to show full India/global overview)
  const [selectedStation, setSelectedStation] = useState(null);
  
  // Camera view preset: 'all' | 'antarctica' | 'arctic' | 'himalaya' | 'southern-ocean'
  const [activeRegionView, setActiveRegionView] = useState('all');
  
  // Projection mode: 'geoOrthographic' (3D Globe) | 'geoStereographic' (Polar Radar) | 'geoEqualEarth' (World Map)
  const [projectionType, setProjectionType] = useState('geoOrthographic');

  // Active Station Inspector Tab: 'telemetry' | 'science' | 'expeditions'
  const [stationTab, setStationTab] = useState('telemetry');

  // Layer Toggles
  const [layers, setLayers] = useState({
    showRoutes: true,
    showAurora: true,
    showSatellite: true,
    showSeaIce: true,
    showGraticule: true,
    showLabels: true,
    autoRotate: false
  });

  // ── Real-Time Data from Open-Meteo + NOAA + NCPOR ────────────────────────
  const {
    aurora,
    news: ncporNews,
    satellite: satPos,
    loading: dataLoading,
    error: dataError,
    lastUpdated,
    refetch,
    getStationWeather,
  } = usePolarData({ refreshIntervalMs: 10 * 60 * 1000 });

  // UTC clock (client-side, updates every second)
  const [utcTime, setUtcTime] = useState(new Date().toUTCString().slice(17, 25));
  useEffect(() => {
    const timer = setInterval(() => setUtcTime(new Date().toUTCString().slice(17, 25)), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleLayer = (layerName) => {
    setLayers(prev => ({ ...prev, [layerName]: !prev[layerName] }));
  };

  const handleStationClick = (st) => {
    setSelectedStation(st);
    if (!st) {
      setActiveRegionView('all');
    }
  };

  // Filter stations for directory
  const filteredStations = stations.filter(s => {
    if (activeRegionView === 'all') return true;
    if (activeRegionView === 'antarctica') return s.region === 'Antarctica';
    if (activeRegionView === 'arctic') return s.region === 'Arctic';
    if (activeRegionView === 'himalaya') return s.region === 'Himalaya';
    if (activeRegionView === 'southern-ocean') return s.region === 'Southern Ocean' || s.region === 'Antarctica';
    return true;
  });

  // Find related expeditions for the selected station
  const relatedExpeditions = expeditions.filter(
    e => e.region === selectedStation?.region || (selectedStation?.name && e.stations?.some(s => s.includes(selectedStation.name.split(' ')[0])))
  );

  return (
    <div className="container polar-map-page">
      {/* Top Header & Geospatial Network Bar */}
      <div className="page-header-row">
        <div>
          <div className="section-eyebrow">
            <Radio size={14} className="eyebrow-icon pulse" />
            <span>NCPOR GEOSPATIAL EARTH OBSERVATION & CRYOSPHERE NETWORK</span>
          </div>
          <h1 className="page-title">
            {lang === 'hi' ? 'इंटरैक्टिव 3D ध्रुवीय एवं क्रायोस्फीयर मानचित्र' : 'Interactive 3D Polar & Cryosphere Globe'}
          </h1>
          <p className="page-sub">
            {lang === 'hi' 
              ? 'अंटार्कटिका, आर्कटिक और हिमालय के तीसरे ध्रुव पर भारत के स्थायी वैज्ञानिक स्टेशनों, समुद्री वेधशालाओं और उपग्रह टेलीमेट्री का अन्वेषण करें।'
              : 'Explore India\'s permanent polar stations, deep-fjord ocean observatories, and satellite telemetry grids across Antarctica, the High Arctic, and the Himalayan Third Pole.'}
          </p>
        </div>

        {/* Projection Mode Switcher */}
        <div className="view-mode-toggle-group">
          <button 
            className={`mode-toggle-btn ${projectionType === 'geoOrthographic' ? 'active' : ''}`}
            onClick={() => setProjectionType('geoOrthographic')}
            title="3D Spherical Earth Globe View"
          >
            <Globe2 size={16} />
            <span>3D Globe View</span>
          </button>
          <button 
            className={`mode-toggle-btn ${projectionType === 'geoStereographic' ? 'active' : ''}`}
            onClick={() => setProjectionType('geoStereographic')}
            title="Polar Top-Down Stereographic Projection"
          >
            <Gauge size={16} />
            <span>Polar Radar</span>
          </button>
          <button 
            className={`mode-toggle-btn ${projectionType === 'geoEqualEarth' ? 'active' : ''}`}
            onClick={() => setProjectionType('geoEqualEarth')}
            title="Planar Equal Earth Global Map"
          >
            <Layers size={16} />
            <span>Equal Earth</span>
          </button>
        </div>
      </div>

      {/* Region Camera Presets Bar */}
      <div className="map-view-pills-bar">
        <div className="pills-label">
          <Compass size={14} />
          <span>Camera Focus:</span>
        </div>
        <div className="pills-scroll">
          <button 
            className={`map-view-btn ${activeRegionView === 'all' && !selectedStation ? 'active' : ''}`}
            onClick={() => {
              setActiveRegionView('all');
              setSelectedStation(null);
            }}
          >
            <Globe2 size={14} />
            <span>Global Overview (All Bases)</span>
          </button>
          <button 
            className={`map-view-btn ${activeRegionView === 'antarctica' ? 'active' : ''}`}
            onClick={() => {
              setActiveRegionView('antarctica');
              setSelectedStation(stations.find(s => s.id === 'st-bharati') || stations[0]);
            }}
          >
            <span>🇦🇶 Antarctica (Bharati, Maitri & DG)</span>
          </button>
          <button 
            className={`map-view-btn ${activeRegionView === 'arctic' ? 'active' : ''}`}
            onClick={() => {
              setActiveRegionView('arctic');
              setSelectedStation(stations.find(s => s.id === 'st-himadri') || stations[0]);
            }}
          >
            <span>❄️ High Arctic (Himadri & IndARC)</span>
          </button>
          <button 
            className={`map-view-btn ${activeRegionView === 'himalaya' ? 'active' : ''}`}
            onClick={() => {
              setActiveRegionView('himalaya');
              setSelectedStation(stations.find(s => s.id === 'st-himansh') || stations[0]);
            }}
          >
            <span>🏔️ Himalayan Third Pole (Himansh)</span>
          </button>
          <button 
            className={`map-view-btn ${activeRegionView === 'southern-ocean' ? 'active' : ''}`}
            onClick={() => setActiveRegionView('southern-ocean')}
          >
            <span>🌊 Southern Ocean Cruise Transect</span>
          </button>
        </div>
      </div>

      {/* Live Telemetry Realtime Status Banner */}
      <div className="telemetry-statusbar">
        <div className="status-item">
          <span className={`dot ${dataLoading ? 'dot-orange' : dataError ? 'dot-red' : 'dot-green'}`} />
          <span className="status-label">SATCOM LINK:</span>
          <span className="status-value">
            SARAL-AltiKa / Oceansat-3
            {satPos && <span style={{color:'#059669', fontWeight: 600}}> @ {satPos.lat.toFixed(1)}°, {satPos.lng.toFixed(1)}°</span>}
          </span>
        </div>
        <div className="status-item">
          <span className="status-label">AURORA ACTIVITY:</span>
          <span className={`status-value highlight-cyan ${
            aurora?.kpRaw >= 5 ? 'highlight-red' : aurora?.kpRaw >= 3 ? 'highlight-orange' : ''
          }`}>
            {aurora ? aurora.label : 'Kp — (fetching…)'}
          </span>
        </div>
        <div className="status-item">
          <span className="status-label">DATA SOURCE:</span>
          <span className="status-value">
            {lastUpdated
              ? <><span style={{color:'#059669', fontWeight: 600}}>● LIVE</span> NOAA / Open-Meteo · {lastUpdated.toLocaleTimeString()}</>
              : <span style={{color:'#64748b'}}>Connecting to NOAA…</span>}
          </span>
        </div>
        <div className="status-item">
          <span className="status-label">UTC CLOCK:</span>
          <span className="status-value font-mono">{utcTime} UTC</span>
        </div>
        <button
          onClick={refetch}
          title="Refresh live data"
          style={{ marginLeft: 'auto', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 6, color: '#0f172a', padding: '3px 10px', cursor: 'pointer', display:'flex', alignItems:'center', gap:4, fontSize:'0.75rem', fontWeight: 600 }}
        >
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* Main Map Layout Grid */}
      <div className="map-layout-grid">
        {/* Left Column: Interactive 3D Globe / Polar Map Viewport Card */}
        <div className="glass-panel map-viewport-card">
          {/* Interactive Layer Switches HUD */}
          <div className="viewport-layers-toolbar">
            <div className="layers-title">
              <Layers size={14} />
              <span>Interactive Layers</span>
            </div>
            
            <div className="layer-chip-buttons">
              <button 
                className={`layer-chip ${layers.showRoutes ? 'active' : ''}`}
                onClick={() => toggleLayer('showRoutes')}
                title="Toggle Great-Circle logistics & flight arcs from Goa"
              >
                <span>✈️ Logistics Arcs</span>
              </button>

              <button 
                className={`layer-chip ${layers.showAurora ? 'active' : ''}`}
                onClick={() => toggleLayer('showAurora')}
                title="Toggle Aurora Oval geomagnetic field rings"
              >
                <span>🌌 Aurora Oval</span>
              </button>

              <button 
                className={`layer-chip ${layers.showSatellite ? 'active' : ''}`}
                onClick={() => toggleLayer('showSatellite')}
                title="Toggle Polar Earth Observation Satellite Ground Track"
              >
                <span>🛰️ Orbit Satellite</span>
              </button>

              <button 
                className={`layer-chip ${layers.showSeaIce ? 'active' : ''}`}
                onClick={() => toggleLayer('showSeaIce')}
                title="Toggle Cryospheric Sea-Ice extent boundary"
              >
                <span>🧊 Cryosphere Ice</span>
              </button>

              <button 
                className={`layer-chip ${layers.showGraticule ? 'active' : ''}`}
                onClick={() => toggleLayer('showGraticule')}
                title="Toggle Latitude & Longitude Graticule Grid"
              >
                <span>🌐 Lat/Lng Grid</span>
              </button>

              <button 
                className={`layer-chip ${layers.showLabels ? 'active' : ''}`}
                onClick={() => toggleLayer('showLabels')}
                title="Toggle Country, Continent & Ocean Geographic Labels"
              >
                <span>🏷️ Geo Labels</span>
              </button>

              <button 
                className={`layer-chip ${layers.autoRotate ? 'active' : ''}`}
                onClick={() => toggleLayer('autoRotate')}
                title="Toggle Auto Orbit rotation"
              >
                <span>🔄 Auto-Orbit</span>
              </button>
            </div>
          </div>

          {/* Interactive Globe Canvas */}
          <div className="viewport-stage">
            <PolarGlobeMap 
              stations={stations}
              selectedStation={selectedStation}
              onSelectStation={handleStationClick}
              activePreset={activeRegionView}
              projectionType={projectionType}
              layers={layers}
              satellitePosition={satPos}
            />
          </div>

          {/* Footer Legend Bar */}
          <div className="viewport-footer-bar">
            <div className="interactive-tips">
              <span className="tip-badge">HOW TO INTERACT</span>
              <span>🖱️ Drag to rotate 3D sphere • 📜 Wheel to zoom • 📍 Click pin to lock telemetry</span>
            </div>
            
            <div className="legend-strip">
              <span className="legend-item"><span className="legend-dot antarctica-dot"></span> Antarctica Bases</span>
              <span className="legend-item"><span className="legend-dot arctic-dot"></span> High Arctic</span>
              <span className="legend-item"><span className="legend-dot himalaya-dot"></span> Himalayas</span>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Station Telemetry & Mission Command Center */}
        <div className="glass-panel station-inspect-card">
          {selectedStation ? (
            <div className="station-card-inner">
              {/* Header Visual with Badges */}
              <div className="station-thumb-wrap">
                <img 
                  src={selectedStation.image} 
                  alt={selectedStation.name} 
                  className="station-thumb" 
                />
                <div className="station-thumb-overlay"></div>
                
                <div className="station-badge-group">
                  <div className={`station-region-tag ${selectedStation.region.toLowerCase()}`}>
                    <MapPin size={12} />
                    <span>{selectedStation.region}</span>
                  </div>
                  <div className="station-status-pill">
                    <span className="live-pulse"></span>
                    <span>{selectedStation.status}</span>
                  </div>
                </div>

                <div className="station-image-footer">
                  <span className="commission-year">Est. {selectedStation.commissioned}</span>
                  <span className="coords-tag">{selectedStation.lat.toFixed(2)}°N / {selectedStation.lng.toFixed(2)}°E</span>
                </div>
              </div>

              {/* Station Info Title */}
              <div className="station-header-info">
                <h2 className="station-title">
                  {lang === 'hi' && selectedStation.nameHi ? selectedStation.nameHi : selectedStation.name}
                </h2>
                <p className="station-summary">{selectedStation.description}</p>
              </div>

              {/* Inspector Navigation Tabs */}
              <div className="station-tabs-nav">
                <button 
                  className={`tab-nav-btn ${stationTab === 'telemetry' ? 'active' : ''}`}
                  onClick={() => setStationTab('telemetry')}
                >
                  <Activity size={14} />
                  <span>Live Telemetry</span>
                </button>
                <button 
                  className={`tab-nav-btn ${stationTab === 'science' ? 'active' : ''}`}
                  onClick={() => setStationTab('science')}
                >
                  <Sparkles size={14} />
                  <span>Science Focus</span>
                </button>
                <button 
                  className={`tab-nav-btn ${stationTab === 'expeditions' ? 'active' : ''}`}
                  onClick={() => setStationTab('expeditions')}
                >
                  <Compass size={14} />
                  <span>Missions ({relatedExpeditions.length})</span>
                </button>
              </div>

              {/* Tab 1: Live Telemetry Grid */}
              {stationTab === 'telemetry' && (
                <div className="tab-content-pane">
                  <div className="station-telemetry-grid">
                    {/* Real-time temperature from Open-Meteo / NCPOR GPS coords */}
                    {(() => {
                      const live = getStationWeather(selectedStation.id, selectedStation.temp, selectedStation.wind);
                      return (
                        <>
                          <div className="telem-box">
                            <ThermometerSnowflake size={18} className="telem-icon telem-cyan" />
                            <div>
                              <div className="telem-lbl">
                                Ambient Temp
                                {live.isLive && <span style={{color:'#059669',fontSize:'0.65rem',marginLeft:4,fontWeight:700}}>● LIVE</span>}
                              </div>
                              <div className="telem-val highlight-temp">{live.temp}</div>
                            </div>
                          </div>

                          <div className="telem-box">
                            <Wind size={18} className="telem-icon telem-blue" />
                            <div>
                              <div className="telem-lbl">
                                Wind Vector
                                {live.isLive && <span style={{color:'#059669',fontSize:'0.65rem',marginLeft:4,fontWeight:700}}>● LIVE</span>}
                              </div>
                              <div className="telem-val">{live.wind} {live.windDir}</div>
                            </div>
                          </div>

                          <div className="telem-box">
                            <Navigation size={18} className="telem-icon telem-orange" />
                            <div>
                              <div className="telem-lbl">Site Elevation</div>
                              <div className="telem-val">{selectedStation.elevation}</div>
                            </div>
                          </div>

                          <div className="telem-box">
                            <Radio size={18} className="telem-icon telem-green" />
                            <div>
                              <div className="telem-lbl">Telemetry Uplink</div>
                              <div className="telem-val">Active (GSAT-7A)</div>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  <div className="station-telemetry-grid sub-grid">
                    {(() => {
                      const live = getStationWeather(selectedStation.id, selectedStation.temp, selectedStation.wind);
                      return (
                        <>
                          <div className="telem-box">
                            <Sun size={18} className="telem-icon telem-orange" />
                            <div>
                              <div className="telem-lbl">
                                Solar Radiation
                                {live.isLive && <span style={{color:'#059669',fontSize:'0.65rem',marginLeft:4,fontWeight:700}}>● LIVE</span>}
                              </div>
                              <div className="telem-val">{live.solar || '— W/m²'}</div>
                            </div>
                          </div>

                          <div className="telem-box">
                            <BarChart3 size={18} className="telem-icon telem-cyan" />
                            <div>
                              <div className="telem-lbl">
                                Baro Pressure
                                {live.isLive && <span style={{color:'#059669',fontSize:'0.65rem',marginLeft:4,fontWeight:700}}>● LIVE</span>}
                              </div>
                              <div className="telem-val">{live.pressure || '— hPa'}</div>
                            </div>
                          </div>

                          <div className="telem-box">
                            <Waves size={18} className="telem-icon telem-blue" />
                            <div>
                              <div className="telem-lbl">
                                Rel. Humidity
                                {live.isLive && <span style={{color:'#059669',fontSize:'0.65rem',marginLeft:4,fontWeight:700}}>● LIVE</span>}
                              </div>
                              <div className="telem-val">{live.humidity || '—'}</div>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Specialized Station Callout */}
                  {selectedStation.id === 'st-indarc' && (
                    <div className="specialized-info-box fjord-ocean">
                      <Waves size={16} className="spec-icon" />
                      <div>
                        <strong>Sub-surface Acoustic Mooring (192m Depth)</strong>
                        <p>10 oceanographic CTD & acoustic sensors continuously log temperature, salinity, and Atlantic warm-water influx into Kongsfjorden.</p>
                      </div>
                    </div>
                  )}

                  {selectedStation.id === 'st-himansh' && (
                    <div className="specialized-info-box himalaya-glacier">
                      <Compass size={16} className="spec-icon" />
                      <div>
                        <strong>High-Altitude Cryospheric Lab (13,400 ft)</strong>
                        <p>Real-time GLOF (Glacial Lake Outburst Flood) sensor arrays and ground-penetrating radar monitoring Sutri Dhaka and Chandra basin glaciers.</p>
                      </div>
                    </div>
                  )}

                  {selectedStation.id === 'st-bharati' && (
                    <div className="specialized-info-box green-habitat">
                      <ShieldCheck size={16} className="spec-icon" />
                      <div>
                        <strong>Energy-Efficient Container Architecture</strong>
                        <p>State-of-the-art green building with zero-waste discharge, greywater recycling, and hybrid solar-wind auxiliary microgrids.</p>
                      </div>
                    </div>
                  )}

                  {selectedStation.id === 'st-maitri' && (
                    <div className="specialized-info-box green-habitat">
                      <Radio size={16} className="spec-icon" />
                      <div>
                        <strong>Schirmacher Oasis Geoscience Hub</strong>
                        <p>Longest continuous meteorological & ozone-hole time-series station in East Antarctica, housing cosmic ray and seismological detectors.</p>
                      </div>
                    </div>
                  )}

                  {selectedStation.id === 'st-dg' && (
                    <div className="specialized-info-box heritage-base">
                      <ShieldCheck size={16} className="spec-icon" />
                      <div>
                        <strong>Historic Heritage & Auxiliary Supply Base (Est. 1983)</strong>
                        <p>India's first permanent base on the Princess Astrid Coast ice shelf. Preserved as a historical site and strategic fuel & transit depot supporting field expeditions.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Science Focus & Core Instruments */}
              {stationTab === 'science' && (
                <div className="tab-content-pane">
                  <div className="science-instruments-list">
                    <div className="instrument-card">
                      <div className="inst-header">
                        <span className="inst-tag">Atmospheric Physics</span>
                        <h4>Aerosol & Black Carbon Monitoring</h4>
                      </div>
                      <p>Multi-wavelength Aethalometers and Sun Photometers tracking long-range transboundary particulate transport.</p>
                    </div>

                    <div className="instrument-card">
                      <div className="inst-header">
                        <span className="inst-tag">Cryosphere & Glaciology</span>
                        <h4>Ice Core Paleoclimatology</h4>
                      </div>
                      <p>Electro-mechanical core drilling retrieving deep ice to analyze greenhouse gas isotope ratios spanning thousands of years.</p>
                    </div>

                    <div className="instrument-card">
                      <div className="inst-header">
                        <span className="inst-tag">Space Geodesy</span>
                        <h4>Ionospheric GPS & Magnetometry</h4>
                      </div>
                      <p>Studying space weather, auroral electrojets, and geomagnetic field line fluctuations affecting satellite navigation.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Related Expeditions */}
              {stationTab === 'expeditions' && (
                <div className="tab-content-pane">
                  <div className="related-expeditions-list">
                    {relatedExpeditions.length > 0 ? (
                      relatedExpeditions.map(exp => (
                        <div key={exp.id} className="mini-expedition-item" onClick={() => onSelectExpedition(exp.id)}>
                          <div className="mini-exp-img-wrap">
                            <img src={exp.heroImage} alt={exp.title} className="mini-exp-img" />
                          </div>
                          <div className="mini-exp-info">
                            <span className="mini-exp-year">{exp.year} • {exp.region}</span>
                            <h5 className="mini-exp-title">{lang === 'hi' && exp.titleHi ? exp.titleHi : exp.title}</h5>
                            <span className="mini-exp-action">Explore Fieldwork <ArrowRight size={12} /></span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-items-text">No direct expeditions tagged for this specific depot. Explore the Expeditions tab for all records.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="station-card-actions">
                <button 
                  className="btn-primary full-width"
                  onClick={() => {
                    const matchedExp = expeditions.find(e => e.region === selectedStation.region);
                    if (matchedExp) {
                      onSelectExpedition(matchedExp.id);
                    } else {
                      navigateTo('expeditions');
                    }
                  }}
                >
                  <Compass size={16} />
                  <span>{lang === 'hi' ? 'संबंधित अभियान देखें' : 'View Scientific Expeditions'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-inspect">
              <Globe2 size={42} className="empty-icon" />
              <h3>NCPOR Polar Geospatial Network</h3>
              <p>Select any research base on the 3D globe or click below to inspect live telemetry, weather metrics, and ongoing missions:</p>
              
              <div className="empty-station-chips">
                {stations.map(st => (
                  <button
                    key={st.id}
                    className="empty-station-chip"
                    onClick={() => handleStationClick(st)}
                  >
                    <span className={`chip-dot ${st.region.toLowerCase()}`} />
                    <span className="chip-name">{st.name}</span>
                    <span className="chip-region">{st.region}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* NCPOR Latest News Ticker from ncpor.res.in */}
      {ncporNews && ncporNews.length > 0 && (
        <div className="ncpor-news-banner">
          <div className="news-banner-label">
            <span className="dot dot-green" />
            <span>NCPOR LATEST</span>
          </div>
          <div className="news-ticker-track">
            {ncporNews.map((item, i) => (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="news-ticker-item"
              >
                <span className="news-sep">❯</span>
                {item.title}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Permanent Polar Research Facilities Directory */}
      <div className="stations-directory-section">
        <div className="section-header-flex">
          <div>
            <div className="section-eyebrow">RESEARCH INFRASTRUCTURE</div>
            <h3 className="section-title">
              {lang === 'hi' ? 'समस्त भारतीय स्थायी ध्रुवीय अनुसंधान केंद्र' : 'All Permanent Indian Polar Research Facilities'}
            </h3>
          </div>
          <span className="facility-count-badge">{filteredStations.length} Active Stations</span>
        </div>

        <div className="stations-grid">
          {filteredStations.map((st) => {
            const isSelected = selectedStation?.id === st.id;
            return (
              <div 
                key={st.id} 
                className={`glass-panel station-mini-card ${isSelected ? 'active-station' : ''}`}
                onClick={() => handleStationClick(st)}
              >
                <div className="mini-card-top">
                  <div className="mini-card-img-wrap">
                    <img src={st.image} alt={st.name} className="mini-card-img" />
                    <span className={`mini-region-badge ${st.region.toLowerCase()}`}>{st.region}</span>
                  </div>
                  
                  <div className="mini-card-header">
                    <h4>{lang === 'hi' && st.nameHi ? st.nameHi : st.name}</h4>
                    <span className="mini-status-text">
                      <span className="dot dot-green"></span>
                      {st.status.split('(')[0]}
                    </span>
                  </div>
                </div>

                <p className="mini-desc">{st.description}</p>
                
                <div className="mini-footer-stats">
                  <div className="stat-pill">
                    <ThermometerSnowflake size={13} className="pill-icon" />
                    <span>{st.temp}</span>
                  </div>
                  <div className="stat-pill">
                    <Navigation size={13} className="pill-icon" />
                    <span>{st.elevation}</span>
                  </div>
                  <div className="stat-pill coords">
                    <span>{st.lat.toFixed(1)}° / {st.lng.toFixed(1)}°</span>
                  </div>
                </div>

                <div className="mini-card-action-bar">
                  <span className="inspect-link">
                    <span>Focus in Globe</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .polar-map-page {
          padding: 2.5rem 1.5rem 6rem;
        }

        .eyebrow-icon {
          color: #0284c7;
        }

        /* View Mode Switcher */
        .view-mode-toggle-group {
          display: flex;
          align-items: center;
          background: #ffffff;
          border: 1px solid var(--border-card);
          padding: 0.25rem;
          border-radius: var(--radius-full);
          gap: 0.25rem;
          box-shadow: var(--shadow-xs);
        }

        .mode-toggle-btn {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-secondary);
          padding: 0.45rem 0.9rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .mode-toggle-btn:hover {
          color: var(--navy);
          background: #f1f5f9;
        }

        .mode-toggle-btn.active {
          background: var(--navy);
          color: #ffffff;
          border-color: var(--navy);
        }

        /* Region Presets Bar */
        .map-view-pills-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .pills-label {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--navy);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .pills-scroll {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .map-view-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: #ffffff;
          border: 1px solid var(--border-card);
          color: var(--text-primary);
          padding: 0.45rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: var(--shadow-xs);
        }

        .map-view-btn:hover {
          background: #f8fafc;
          color: var(--navy);
          border-color: #94a3b8;
        }

        .map-view-btn.active {
          background: #ffffff;
          border-color: var(--navy);
          color: var(--navy);
          box-shadow: 0 0 0 1px var(--navy);
        }

        /* Telemetry Status Bar */
        .telemetry-statusbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          border: 1px solid var(--border-card);
          padding: 0.65rem 1.25rem;
          border-radius: var(--radius-sm);
          margin-bottom: 1.5rem;
          font-size: 0.78rem;
          flex-wrap: wrap;
          gap: 0.75rem;
          box-shadow: var(--shadow-xs);
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .dot-green { background: #10b981; }
        .dot-orange { background: #f59e0b; }
        .dot-red { background: #ef4444; }

        .status-label {
          color: var(--text-muted);
          font-weight: 700;
        }

        .status-value {
          color: var(--navy);
          font-weight: 700;
        }

        .status-value.highlight-cyan {
          color: #0284c7;
        }

        /* Main Grid Layout */
        .map-layout-grid {
          display: grid;
          grid-template-columns: 1.85fr 1.15fr;
          gap: 1.5rem;
          margin-bottom: 3.5rem;
        }

        .map-viewport-card {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border: 1px solid var(--border-card);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        /* Viewport Layers Toolbar */
        .viewport-layers-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.85rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .layers-title {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--navy);
          text-transform: uppercase;
        }

        .layer-chip-buttons {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .layer-chip {
          background: #f1f5f9;
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          padding: 0.3rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .layer-chip:hover {
          color: var(--navy);
          background: #e2e8f0;
        }

        .layer-chip.active {
          background: #eff6ff;
          border-color: #bfdbfe;
          color: #0369a1;
          font-weight: 700;
        }

        .viewport-stage {
          position: relative;
          min-height: 520px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: #07152b;
        }

        .viewport-footer-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 1rem;
          padding-top: 0.85rem;
          border-top: 1px solid var(--border-subtle);
          font-size: 0.76rem;
          color: var(--text-secondary);
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .interactive-tips {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .tip-badge {
          background: #fffbeb;
          color: #b45309;
          font-weight: 700;
          font-size: 0.65rem;
          padding: 1px 6px;
          border-radius: 4px;
        }

        .legend-strip {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .antarctica-dot { background: #047857; }
        .arctic-dot { background: #059669; }
        .himalaya-dot { background: #d97706; }

        /* Station Inspect Card (Right Column) */
        .station-inspect-card {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border: 1px solid var(--border-card);
          box-shadow: var(--shadow-sm);
        }

        .station-thumb-wrap {
          position: relative;
          height: 190px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          margin-bottom: 1rem;
          background: #f1f5f9;
        }

        .station-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .station-thumb-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.1) 0%, rgba(15, 23, 42, 0.75) 100%);
        }

        .station-badge-group {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          right: 0.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .station-region-tag {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(255, 255, 255, 0.95);
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--navy);
        }

        .station-status-pill {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(255, 255, 255, 0.95);
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-full);
          font-size: 0.7rem;
          color: #047857;
          font-weight: 700;
        }

        .station-image-footer {
          position: absolute;
          bottom: 0.75rem;
          left: 0.75rem;
          right: 0.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.72rem;
          color: #ffffff;
          font-family: var(--font-mono);
          font-weight: 600;
        }

        .station-header-info {
          margin-bottom: 1rem;
        }

        .station-title {
          font-size: 1.45rem;
          color: var(--navy);
          margin-bottom: 0.4rem;
          font-weight: 800;
        }

        .station-summary {
          font-size: 0.84rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* Tabs Nav */
        .station-tabs-nav {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: #f1f5f9;
          border: 1px solid var(--border-subtle);
          padding: 0.25rem;
          border-radius: var(--radius-sm);
          margin-bottom: 1rem;
        }

        .tab-nav-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 0.4rem 0.25rem;
          border-radius: var(--radius-xs);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .tab-nav-btn:hover {
          color: var(--navy);
        }

        .tab-nav-btn.active {
          background: #ffffff;
          color: var(--navy);
          font-weight: 700;
          box-shadow: var(--shadow-xs);
        }

        .tab-content-pane {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          margin-bottom: 1.25rem;
        }

        /* Telemetry Grid */
        .station-telemetry-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.65rem;
        }

        .station-telemetry-grid.sub-grid {
          margin-top: -0.2rem;
        }

        .telem-box {
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.65rem 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .telem-icon.telem-cyan { color: #0284c7; }
        .telem-icon.telem-blue { color: #2563eb; }
        .telem-icon.telem-orange { color: #d97706; }
        .telem-icon.telem-green { color: #059669; }

        .telem-lbl {
          font-size: 0.68rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-weight: 700;
        }

        .telem-val {
          font-size: 0.88rem;
          color: var(--navy);
          font-weight: 800;
        }

        .highlight-temp {
          color: #0284c7;
        }

        .specialized-info-box {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          padding: 0.75rem 0.85rem;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          line-height: 1.4;
        }

        .specialized-info-box.fjord-ocean {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #1e40af;
        }

        .specialized-info-box.himalaya-glacier {
          background: #fffbeb;
          border: 1px solid #fde68a;
          color: #92400e;
        }

        .specialized-info-box.green-habitat {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #065f46;
        }

        .specialized-info-box.heritage-base {
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #9a3412;
        }

        .spec-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* Science Focus Tab */
        .science-instruments-list {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .instrument-card {
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.75rem 0.85rem;
        }

        .inst-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 0.25rem;
        }

        .inst-tag {
          font-size: 0.65rem;
          color: #d97706;
          font-weight: 700;
          text-transform: uppercase;
        }

        .instrument-card h4 {
          font-size: 0.85rem;
          color: var(--navy);
          font-weight: 700;
        }

        .instrument-card p {
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        /* Expeditions Tab */
        .related-expeditions-list {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .mini-expedition-item {
          display: flex;
          gap: 0.75rem;
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.5rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .mini-expedition-item:hover {
          border-color: #94a3b8;
          background: #ffffff;
          box-shadow: var(--shadow-sm);
        }

        .mini-exp-img-wrap {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-xs);
          overflow: hidden;
          flex-shrink: 0;
        }

        .mini-exp-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .mini-exp-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .mini-exp-year {
          font-size: 0.68rem;
          color: #0284c7;
          font-weight: 700;
          text-transform: uppercase;
        }

        .mini-exp-title {
          font-size: 0.82rem;
          color: var(--navy);
          line-height: 1.25;
          margin: 0.15rem 0;
          font-weight: 700;
        }

        .mini-exp-action {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.7rem;
          color: #d97706;
          font-weight: 700;
        }

        .empty-inspect {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 3rem 1.5rem;
          color: var(--text-secondary);
        }

        .empty-icon {
          color: #0284c7;
          margin-bottom: 1rem;
        }

        .empty-inspect h3 {
          color: var(--navy);
          margin-bottom: 0.5rem;
          font-weight: 700;
        }

        .empty-inspect p {
          font-size: 0.85rem;
          line-height: 1.5;
          max-width: 340px;
          margin-bottom: 1.25rem;
          color: var(--text-muted);
        }

        .empty-station-chips {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          width: 100%;
          max-width: 320px;
        }

        .empty-station-chip {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xs, 6px);
          padding: 0.55rem 0.75rem;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
        }

        .empty-station-chip:hover {
          border-color: #059669;
          background: #ecfdf5;
          transform: translateY(-1px);
        }

        .chip-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .chip-dot.antarctica { background: #047857; }
        .chip-dot.arctic     { background: #059669; }
        .chip-dot.himalaya   { background: #d97706; }
        .chip-dot.southern-ocean { background: #0f766e; }

        .chip-name {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--navy);
          flex: 1;
        }

        .chip-region {
          font-size: 0.68rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
        }

        /* Facility Directory */
        .stations-directory-section {
          margin-top: 1rem;
        }

        .section-header-flex {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .facility-count-badge {
          background: #eff6ff;
          color: #0369a1;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.3rem 0.75rem;
          border-radius: var(--radius-full);
          border: 1px solid #bfdbfe;
        }

        .stations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
          gap: 1.25rem;
        }

        .station-mini-card {
          padding: 1.15rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: #ffffff;
          border: 1px solid var(--border-card);
          box-shadow: var(--shadow-sm);
        }

        .station-mini-card:hover, .station-mini-card.active-station {
          border-color: #94a3b8;
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }

        .mini-card-top {
          display: flex;
          gap: 0.85rem;
          margin-bottom: 0.75rem;
        }

        .mini-card-img-wrap {
          position: relative;
          width: 75px;
          height: 60px;
          border-radius: var(--radius-xs);
          overflow: hidden;
          flex-shrink: 0;
          background: #f1f5f9;
        }

        .mini-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .mini-region-badge {
          position: absolute;
          bottom: 2px;
          left: 2px;
          right: 2px;
          text-align: center;
          font-size: 0.6rem;
          font-weight: 700;
          padding: 1px 2px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.95);
        }

        .mini-region-badge.antarctica { color: #047857; }
        .mini-region-badge.arctic { color: #059669; }
        .mini-region-badge.himalaya { color: #d97706; }

        .mini-card-header h4 {
          font-size: 0.98rem;
          color: var(--navy);
          margin-bottom: 0.2rem;
          font-weight: 700;
        }

        .mini-status-text {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.72rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .mini-desc {
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.45;
          margin-bottom: 0.85rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .mini-footer-stats {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 0.75rem;
          flex-wrap: wrap;
        }

        .stat-pill {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: #f1f5f9;
          border: 1px solid var(--border-subtle);
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-xs);
          font-size: 0.72rem;
          color: var(--navy);
          font-weight: 700;
        }

        .stat-pill.coords {
          font-family: var(--font-mono);
          color: var(--text-secondary);
        }

        .pill-icon {
          color: #0284c7;
        }

        .mini-card-action-bar {
          border-top: 1px solid #f1f5f9;
          padding-top: 0.6rem;
        }

        .inspect-link {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.35rem;
          font-size: 0.75rem;
          color: #0284c7;
          font-weight: 700;
        }

        @media (max-width: 1024px) {
          .map-layout-grid {
            grid-template-columns: 1fr;
          }
          .viewport-stage {
            min-height: 460px;
          }
        }

        /* NCPOR Live News Banner */
        .ncpor-news-banner {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #ffffff;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-sm, 8px);
          padding: 0.5rem 0.85rem;
          margin-bottom: 1.25rem;
          overflow: hidden;
          box-shadow: var(--shadow-xs);
        }

        .news-banner-label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #0284c7;
          white-space: nowrap;
          padding-right: 0.6rem;
          border-right: 1px solid var(--border-subtle);
        }

        .news-ticker-track {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .news-ticker-track::-webkit-scrollbar { display: none; }

        .news-ticker-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: var(--text-primary);
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          transition: color 0.15s;
        }
        .news-ticker-item:hover { color: #0284c7; }
        .news-sep { color: #0284c7; font-size: 0.65rem; }

        /* Aurora severity highlight classes */
        .highlight-red   { color: #dc2626 !important; }
        .highlight-orange { color: #ea580c !important; }
      `}</style>
    </div>
  );
}

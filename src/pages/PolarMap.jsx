import { useState, useEffect } from 'react';
import { usePortal } from '../context/PortalContext';
import PolarGlobeMap from '../components/PolarGlobeMap';
import useScrollRevealAll from '../hooks/useScrollRevealAll';
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
  RefreshCw,
  Mountain,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { usePolarData } from '../hooks/usePolarData';

export default function PolarMap({ onSelectExpedition, navigateTo }) {
  const { stations, expeditions, lang } = usePortal();
  const containerRef = useScrollRevealAll();
  
  // Selected Station (starts as null to show full India/global overview)
  const [selectedStation, setSelectedStation] = useState(null);
  
  // Camera view preset: 'all' | 'antarctica' | 'arctic' | 'himalaya' | 'southern-ocean'
  const [activeRegionView, setActiveRegionView] = useState('all');
  
  // Projection mode: 'geoOrthographic' (3D Globe) | 'geoStereographic' (Polar Radar) | 'geoEqualEarth' (World Map)
  const [projectionType, setProjectionType] = useState('geoOrthographic');

  // Active Station Inspector Tab: 'telemetry' | 'science' | 'expeditions'
  const [stationTab, setStationTab] = useState('telemetry');

  // Network card region filter: 'all' | 'antarctica' | 'arctic' | 'himalaya'
  const [networkFilter, setNetworkFilter] = useState('all');

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
    <div className="container polar-map-page" ref={containerRef}>
      {/* Top Header & Geospatial Network Bar */}
      <div className="page-header-row reveal">
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
      <div className="map-view-pills-bar reveal">
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
            <span>🌊 Southern Ocean</span>
          </button>
        </div>
      </div>

      {/* Live Telemetry Realtime Status Banner */}
      <div className="telemetry-statusbar reveal">
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
          className="telemetry-refresh-btn"
        >
          <RefreshCw size={12} className={dataLoading ? 'spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Main Map Layout Grid */}
      <div className="map-layout-grid">
        {/* Left Column: Interactive 3D Globe / Polar Map Viewport Card */}
        <div className="glass-panel map-viewport-card reveal">
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

          {/* Mobile Quick Station Drawer Popup */}
          {selectedStation && (
            <div className="mobile-station-quick-drawer">
              <div className="quick-drawer-left">
                <img 
                  src={selectedStation.image} 
                  alt={selectedStation.name} 
                  className="quick-drawer-thumb" 
                />
                <div className="quick-drawer-info">
                  <div className="quick-drawer-name">
                    {lang === 'hi' && selectedStation.nameHi ? selectedStation.nameHi : selectedStation.name}
                  </div>
                  <div className="quick-drawer-tags">
                    <span className="quick-region-tag">{selectedStation.region}</span>
                    <span className="quick-temp-tag">🌡️ {selectedStation.temp}</span>
                    <span className="quick-wind-tag">💨 {selectedStation.wind}</span>
                  </div>
                </div>
              </div>
              <div className="quick-drawer-actions">
                <a href="#station-inspector-section" className="quick-inspect-anchor-btn">
                  <span>Inspect</span>
                  <ArrowRight size={13} />
                </a>
                <button 
                  className="quick-close-btn" 
                  onClick={() => setSelectedStation(null)}
                  title="Clear selection"
                  aria-label="Deselect Station"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Footer Legend Bar */}
          <div className="viewport-footer-bar">
            <div className="interactive-tips">
              <span className="tip-badge">INTERACTION CONTROLS</span>
              <span>👆 1-finger rotate · 🤏 Pinch zoom · 📍 Tap pin to lock telemetry</span>
            </div>
            
            <div className="legend-strip">
              <span className="legend-item"><span className="legend-dot antarctica-dot"></span> Antarctica</span>
              <span className="legend-item"><span className="legend-dot arctic-dot"></span> Arctic</span>
              <span className="legend-item"><span className="legend-dot himalaya-dot"></span> Himalayas</span>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Station Telemetry & Mission Command Center */}
        <div id="station-inspector-section" className="glass-panel station-inspect-card reveal">
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
                  <button 
                    type="button"
                    className="station-close-inspect-btn" 
                    onClick={() => setSelectedStation(null)}
                    title="Return to Polar Geospatial Network Overview"
                  >
                    ✕
                  </button>
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
            <div className="geospatial-network-panel">
              {/* Pulsing Radar Beacon Graphic */}
              <div className="radar-beacon-container">
                <div className="radar-ping-ring ping-1" />
                <div className="radar-ping-ring ping-2" />
                <div className="radar-beacon-core">
                  <Globe2 size={28} className="beacon-globe-icon" />
                </div>
              </div>

              {/* Title & Subtitle */}
              <h3 className="geo-network-title">NCPOR Polar Geospatial Network</h3>
              <p className="geo-network-desc">
                {lang === 'hi'
                  ? '3D ग्लोब पर किसी भी भारतीय अनुसंधान केंद्र का चयन करें अथवा नीचे क्लिक करके लाइव टेलीमेट्री एवं मौसम डेटा देखें:'
                  : 'Select any research base on the 3D globe or click below to inspect live telemetry, weather metrics, and ongoing missions:'}
              </p>

              {/* Region Filter Tabs */}
              <div className="geo-filter-pill-row">
                {[
                  { id: 'all', label: 'All Bases', count: stations.length },
                  { id: 'antarctica', label: 'Antarctica', count: stations.filter(s => s.region === 'Antarctica').length },
                  { id: 'arctic', label: 'Arctic', count: stations.filter(s => s.region === 'Arctic').length },
                  { id: 'himalaya', label: 'Himalaya', count: stations.filter(s => s.region === 'Himalaya').length }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`geo-filter-pill ${networkFilter === tab.id ? 'active' : ''}`}
                    onClick={() => setNetworkFilter(tab.id)}
                  >
                    <span>{tab.label}</span>
                    <span className="geo-filter-count">{tab.count}</span>
                  </button>
                ))}
              </div>

              {/* Modern Interactive Station Cards */}
              <div className="geo-station-list">
                {stations
                  .filter(s => {
                    if (networkFilter === 'all') return true;
                    if (networkFilter === 'antarctica') return s.region === 'Antarctica';
                    if (networkFilter === 'arctic') return s.region === 'Arctic';
                    if (networkFilter === 'himalaya') return s.region === 'Himalaya';
                    return true;
                  })
                  .map(st => {
                    const weather = getStationWeather(st.id, st.temp, st.wind);
                    const isAntarctica = st.region === 'Antarctica';
                    const isArctic = st.region === 'Arctic';
                    const isHimalaya = st.region === 'Himalaya';
                    const regionClass = isAntarctica ? 'antarctica' : isArctic ? 'arctic' : 'himalaya';

                    return (
                      <button
                        key={st.id}
                        type="button"
                        className={`geo-station-card ${regionClass}`}
                        onClick={() => handleStationClick(st)}
                      >
                        <div className="geo-station-leading">
                          <div className={`geo-station-avatar ${regionClass}`}>
                            {isHimalaya ? (
                              <Mountain size={16} />
                            ) : st.id === 'st-indarc' ? (
                              <Waves size={16} />
                            ) : (
                              <Compass size={16} />
                            )}
                          </div>

                          <div className="geo-station-meta">
                            <div className="geo-station-name-line">
                              <span className="geo-station-title">
                                {lang === 'hi' && st.nameHi ? st.nameHi : st.name}
                              </span>
                            </div>
                            <div className="geo-station-subline">
                              <span className={`geo-region-tag ${regionClass}`}>
                                {st.region.toUpperCase()}
                              </span>
                              <span className="geo-sub-dot">•</span>
                              <span className="geo-station-loc">
                                {Math.abs(st.lat).toFixed(1)}°{st.lat >= 0 ? 'N' : 'S'}, {Math.abs(st.lng).toFixed(1)}°{st.lng >= 0 ? 'E' : 'W'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="geo-station-trailing">
                          <div className="geo-temp-pill">
                            <ThermometerSnowflake size={11} className="geo-temp-icon" />
                            <span>{weather.temp || st.temp.split(' ')[0]}</span>
                          </div>
                          <div className="geo-arrow-btn">
                            <ChevronRight size={14} className="geo-chevron-icon" />
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </div>

              {/* Bottom Interactive Hint */}
              <div className="geo-card-footer">
                <Radio size={12} className="geo-footer-icon" />
                <span>Click any station or 3D globe pin to lock telemetry</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* NCPOR Latest News Ticker (Modern Smooth Marquee) */}
      {ncporNews && ncporNews.length > 0 && (
        <div className="ncpor-news-banner reveal">
          <div className="news-banner-label">
            <span>NCPOR LATEST</span>
          </div>

          <div className="news-ticker-viewport">
            <div className="news-ticker-track">
              {[...ncporNews, ...ncporNews].map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="news-ticker-item"
                >
                  <span className="news-chevron">❯</span>
                  <span className="news-headline">{item.title}</span>
                  <ExternalLink size={10} className="news-ext-icon" />
                </a>
              ))}
            </div>
          </div>

          <a 
            href="https://ncpor.res.in" 
            target="_blank" 
            rel="noreferrer" 
            className="news-source-pill"
            title="Visit NCPOR Official Portal"
          >
            <span>ncpor.res.in</span>
            <ExternalLink size={9} />
          </a>
        </div>
      )}

      {/* Permanent Polar Research Facilities Directory */}
      <div className="stations-directory-section">
        <div className="section-header-flex reveal">
          <div>
            <div className="section-eyebrow">RESEARCH INFRASTRUCTURE</div>
            <h3 className="section-title">
              {lang === 'hi' ? 'समस्त भारतीय स्थायी ध्रुवीय अनुसंधान केंद्र' : 'All Permanent Indian Polar Research Facilities'}
            </h3>
          </div>
          <span className="facility-count-badge">{filteredStations.length} Active Stations</span>
        </div>

        <div className="stations-grid">
          {filteredStations.map((st, idx) => {
            const isSelected = selectedStation?.id === st.id;
            const regionClass = st.region.toLowerCase().replace(' ', '-');
            const weather = getStationWeather(st.id, st.temp, st.wind);

            const poleLabel = st.region === 'Antarctica' 
              ? 'SOUTH POLE' 
              : st.region === 'Arctic' 
                ? 'NORTH POLE' 
                : st.region === 'Himalaya' 
                  ? 'THIRD POLE' 
                  : (st.region || 'POLAR').toUpperCase();

            return (
              <div 
                key={st.id} 
                className={`station-immersive-card ${regionClass} ${isSelected ? 'active-station' : ''} reveal`}
                style={{ '--delay': `${idx * 80}ms` }}
                onClick={() => handleStationClick(st)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleStationClick(st);
                  }
                }}
              >
                {/* Background Hero Image */}
                <div 
                  className="station-card-bg"
                  style={{ backgroundImage: `url('${st.image}')` }}
                />

                {/* Cinematic Dark Gradient Overlay */}
                <div className="station-card-overlay" />

                {/* Top Badges */}
                <div className="station-card-top">
                  <span className="station-pole-badge">
                    {poleLabel}
                  </span>
                  <span className="station-status-badge">
                    {st.commissioned ? `EST. ${st.commissioned}` : (st.status.includes('Active') ? 'ACTIVE' : 'HERITAGE')}
                  </span>
                </div>

                {/* Floating Content Area */}
                <div className="station-card-content">
                  <h4 className="station-card-title">
                    {lang === 'hi' && st.nameHi ? st.nameHi : st.name}
                  </h4>

                  <p className="station-card-desc">
                    {st.description}
                  </p>

                  {/* Telemetry & Metrics Chips */}
                  <div className="station-card-chips">
                    <span className="station-chip">
                      <ThermometerSnowflake size={11} className="chip-glyph" />
                      <span>{weather.temp || st.temp.split(' ')[0]}</span>
                    </span>
                    <span className="station-chip">
                      <Navigation size={11} className="chip-glyph" />
                      <span>{st.elevation}</span>
                    </span>
                    {weather.wind && (
                      <span className="station-chip">
                        <Wind size={11} className="chip-glyph" />
                        <span>{weather.wind}</span>
                      </span>
                    )}
                  </div>

                  {/* Footer Row */}
                  <div className="station-card-footer">
                    <div className="station-card-meta">
                      <span>{Math.abs(st.lat).toFixed(1)}°{st.lat >= 0 ? 'N' : 'S'}</span>
                      <span className="meta-dot">•</span>
                      <span>{Math.abs(st.lng).toFixed(1)}°{st.lng >= 0 ? 'E' : 'W'}</span>
                    </div>

                    <div className="station-card-action">
                      <span>Focus in Globe</span>
                      <ArrowRight size={13} className="action-arrow" />
                    </div>
                  </div>
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

        .page-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 1.25rem;
        }

        /* View Mode Switcher */
        .view-mode-toggle-group {
          display: inline-flex;
          align-items: center;
          background: #ffffff;
          border: 1px solid var(--border-card);
          padding: 0.25rem;
          border-radius: var(--radius-full);
          gap: 0.25rem;
          box-shadow: var(--shadow-xs);
          flex-shrink: 0;
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
          margin-bottom: 0.85rem;
          padding: 0.45rem 0.85rem;
          background: #ffffff;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-xs);
          overflow-x: auto;
          scrollbar-width: none;
        }

        .map-view-pills-bar::-webkit-scrollbar {
          display: none;
        }

        .pills-label {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--navy);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          flex-shrink: 0;
          padding-right: 0.75rem;
          border-right: 1px solid var(--border-subtle);
          white-space: nowrap;
        }

        .pills-scroll {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: nowrap;
          flex: 1;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .pills-scroll::-webkit-scrollbar {
          display: none;
        }

        .map-view-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.76rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .map-view-btn:hover {
          background: #e2e8f0;
          color: var(--navy);
          border-color: #94a3b8;
        }

        .map-view-btn.active {
          background: var(--navy);
          border-color: var(--navy);
          color: #ffffff;
          box-shadow: var(--shadow-xs);
        }

        /* Telemetry Status Bar */
        .telemetry-statusbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          border: 1px solid var(--border-card);
          padding: 0.55rem 1rem;
          border-radius: var(--radius-md);
          margin-bottom: 1.25rem;
          font-size: 0.75rem;
          gap: 0.75rem;
          box-shadow: var(--shadow-xs);
          flex-wrap: nowrap;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .telemetry-statusbar::-webkit-scrollbar {
          display: none;
        }

        .status-item {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          white-space: nowrap;
          flex-shrink: 0;
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

        .telemetry-refresh-btn {
          margin-left: auto;
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--navy);
          padding: 0.25rem 0.65rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }

        .telemetry-refresh-btn:hover {
          background: #e2e8f0;
          border-color: #94a3b8;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
          box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04);
          border-radius: var(--radius-lg, 16px);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .station-close-inspect-btn {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.75rem;
          transition: all 0.15s ease;
          margin-left: auto;
        }

        .station-close-inspect-btn:hover {
          background: rgba(239, 68, 68, 0.85);
          border-color: rgba(239, 68, 68, 0.4);
          transform: scale(1.08);
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

        /* NCPOR Polar Geospatial Network Panel (Modern Redesign) */
        .geospatial-network-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 1rem 0.25rem 0.5rem;
          width: 100%;
          animation: geoFadeIn 0.3s ease-out;
        }

        @keyframes geoFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Radar Beacon Graphic */
        .radar-beacon-container {
          position: relative;
          width: 62px;
          height: 62px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0.25rem auto 0.85rem;
        }

        .radar-ping-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1.5px solid rgba(2, 132, 199, 0.35);
          pointer-events: none;
        }

        .radar-ping-ring.ping-1 {
          animation: radarBeaconPing 3s cubic-bezier(0, 0.2, 0.8, 1) infinite;
        }

        .radar-ping-ring.ping-2 {
          animation: radarBeaconPing 3s cubic-bezier(0, 0.2, 0.8, 1) infinite 1.5s;
        }

        @keyframes radarBeaconPing {
          0% {
            transform: scale(0.85);
            opacity: 0.9;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .radar-beacon-core {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 60%, #7dd3fc 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 18px -3px rgba(2, 132, 199, 0.35), inset 0 2px 4px rgba(255, 255, 255, 0.8);
          position: relative;
          z-index: 2;
        }

        .beacon-globe-icon {
          color: #0284c7;
          filter: drop-shadow(0 1px 2px rgba(2, 132, 199, 0.2));
        }

        /* Title & Description */
        .geo-network-title {
          color: var(--navy, #0f172a);
          font-size: 1.2rem;
          font-weight: 800;
          letter-spacing: -0.015em;
          margin: 0 0 0.4rem;
          line-height: 1.3;
        }

        .geo-network-desc {
          font-size: 0.82rem;
          line-height: 1.5;
          max-width: 360px;
          margin: 0 auto 1.1rem;
          color: var(--text-secondary, #64748b);
        }

        /* Regional Filter Pills */
        .geo-filter-pill-row {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          margin-bottom: 0.85rem;
          width: 100%;
          overflow-x: auto;
          scrollbar-width: none;
          padding-bottom: 2px;
        }

        .geo-filter-pill-row::-webkit-scrollbar {
          display: none;
        }

        .geo-filter-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: #f8fafc;
          border: 1px solid var(--border-subtle, #e2e8f0);
          color: var(--text-secondary, #64748b);
          padding: 0.28rem 0.6rem;
          border-radius: 9999px;
          font-size: 0.72rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .geo-filter-pill:hover {
          background: #f1f5f9;
          color: var(--navy, #0f172a);
          border-color: #cbd5e1;
        }

        .geo-filter-pill.active {
          background: var(--navy, #0f172a);
          border-color: var(--navy, #0f172a);
          color: #ffffff;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.15);
        }

        .geo-filter-count {
          font-size: 0.6rem;
          font-weight: 700;
          padding: 0.05rem 0.32rem;
          border-radius: 9999px;
          background: rgba(0, 0, 0, 0.06);
          line-height: 1.2;
        }

        .geo-filter-pill.active .geo-filter-count {
          background: rgba(255, 255, 255, 0.22);
          color: #ffffff;
        }

        /* Station Cards List */
        .geo-station-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          width: 100%;
        }

        .geo-station-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: var(--radius-sm, 10px);
          padding: 0.6rem 0.75rem;
          color: var(--text-primary, #0f172a);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          text-align: left;
          position: relative;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
        }

        .geo-station-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px -5px rgba(2, 132, 199, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04);
        }

        .geo-station-card:active {
          transform: translateY(0) scale(0.985);
        }

        .geo-station-card.antarctica:hover {
          border-color: #059669;
          background: linear-gradient(135deg, rgba(236, 253, 245, 0.7) 0%, #ffffff 100%);
        }

        .geo-station-card.arctic:hover {
          border-color: #0284c7;
          background: linear-gradient(135deg, rgba(240, 249, 255, 0.7) 0%, #ffffff 100%);
        }

        .geo-station-card.himalaya:hover {
          border-color: #d97706;
          background: linear-gradient(135deg, rgba(254, 243, 199, 0.7) 0%, #ffffff 100%);
        }

        /* Station Leading Section */
        .geo-station-leading {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          min-width: 0;
          flex: 1;
        }

        .geo-station-avatar {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .geo-station-card:hover .geo-station-avatar {
          transform: scale(1.05);
        }

        .geo-station-avatar.antarctica {
          background: rgba(5, 150, 105, 0.1);
          color: #047857;
        }

        .geo-station-avatar.arctic {
          background: rgba(2, 132, 199, 0.1);
          color: #0284c7;
        }

        .geo-station-avatar.himalaya {
          background: rgba(217, 119, 6, 0.1);
          color: #d97706;
        }

        .geo-status-indicator {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          border: 1.5px solid #ffffff;
        }

        .geo-status-indicator.antarctica {
          background: #059669;
          box-shadow: 0 0 5px #059669;
        }

        .geo-status-indicator.arctic {
          background: #0284c7;
          box-shadow: 0 0 5px #0284c7;
        }

        .geo-status-indicator.himalaya {
          background: #d97706;
          box-shadow: 0 0 5px #d97706;
        }

        /* Station Meta Info */
        .geo-station-meta {
          display: flex;
          flex-direction: column;
          min-width: 0;
          flex: 1;
        }

        .geo-station-name-line {
          display: flex;
          align-items: center;
        }

        .geo-station-title {
          font-size: 0.84rem;
          font-weight: 700;
          color: var(--navy, #0f172a);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .geo-station-subline {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          margin-top: 0.15rem;
        }

        .geo-region-tag {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.03em;
        }

        .geo-region-tag.antarctica { color: #047857; }
        .geo-region-tag.arctic     { color: #0284c7; }
        .geo-region-tag.himalaya   { color: #d97706; }

        .geo-sub-dot {
          color: #cbd5e1;
          font-size: 0.65rem;
        }

        .geo-station-loc {
          font-size: 0.64rem;
          color: var(--text-muted, #94a3b8);
          font-family: var(--font-mono, monospace);
        }

        /* Station Trailing Section */
        .geo-station-trailing {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          flex-shrink: 0;
        }

        .geo-temp-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          background: #f1f5f9;
          border: 1px solid var(--border-subtle, #e2e8f0);
          padding: 0.18rem 0.42rem;
          border-radius: 6px;
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--navy, #0f172a);
          font-family: var(--font-mono, monospace);
        }

        .geo-temp-icon {
          color: #0284c7;
        }

        .geo-arrow-btn {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          color: #94a3b8;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .geo-station-card:hover .geo-arrow-btn {
          background: #0284c7;
          color: #ffffff;
          transform: translateX(2px);
        }

        .geo-station-card.antarctica:hover .geo-arrow-btn {
          background: #059669;
          color: #ffffff;
        }

        .geo-station-card.himalaya:hover .geo-arrow-btn {
          background: #d97706;
          color: #ffffff;
        }

        /* Card Footer Hint */
        .geo-card-footer {
          margin-top: 0.95rem;
          padding-top: 0.75rem;
          border-top: 1px dashed var(--border-subtle, #e2e8f0);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          font-size: 0.7rem;
          color: var(--text-muted, #64748b);
          width: 100%;
        }

        .geo-footer-icon {
          color: #0284c7;
          flex-shrink: 0;
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
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.25rem;
        }

        .station-immersive-card {
          position: relative;
          height: 385px;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 12px 30px -8px rgba(15, 23, 42, 0.2), 0 4px 12px -2px rgba(15, 23, 42, 0.08);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease;
          user-select: none;
        }

        .station-immersive-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.32), 0 6px 16px -4px rgba(15, 23, 42, 0.12);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .station-immersive-card:active {
          transform: translateY(-2px);
        }

        .station-immersive-card.active-station {
          border-color: #38bdf8;
          box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.5), 0 20px 40px -8px rgba(2, 132, 199, 0.4);
        }

        .station-card-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .station-immersive-card:hover .station-card-bg {
          transform: scale(1.06);
        }

        .station-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg, 
            rgba(15, 23, 42, 0) 0%, 
            rgba(15, 23, 42, 0.04) 26%, 
            rgba(15, 23, 42, 0.62) 52%, 
            rgba(12, 18, 32, 0.93) 76%, 
            rgba(8, 14, 26, 0.98) 100%
          );
          transition: background 0.35s ease;
        }

        .station-immersive-card:hover .station-card-overlay {
          background: linear-gradient(
            180deg, 
            rgba(15, 23, 42, 0) 0%, 
            rgba(15, 23, 42, 0.02) 24%, 
            rgba(15, 23, 42, 0.58) 48%, 
            rgba(12, 18, 32, 0.95) 74%, 
            rgba(8, 14, 26, 1) 100%
          );
        }

        .station-card-top {
          position: absolute;
          top: 1.1rem;
          left: 1.1rem;
          right: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 2;
        }

        .station-pole-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.32rem 0.75rem;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #ffffff;
          background: rgba(26, 34, 48, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          transition: background 0.25s ease, border-color 0.25s ease;
        }

        .station-immersive-card:hover .station-pole-badge {
          background: rgba(32, 42, 60, 0.95);
          border-color: rgba(255, 255, 255, 0.25);
        }

        .station-status-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.32rem 0.65rem;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: rgba(255, 255, 255, 0.9);
          background: rgba(26, 34, 48, 0.75);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .station-card-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1.25rem;
          z-index: 1;
        }

        .station-card-title {
          font-size: 1.28rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 0.35rem;
          letter-spacing: -0.015em;
          line-height: 1.2;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
          transition: transform 0.25s ease;
        }

        .station-immersive-card:hover .station-card-title {
          transform: translateX(2px);
        }

        .station-card-desc {
          font-size: 0.78rem;
          color: rgba(241, 245, 249, 0.9);
          line-height: 1.42;
          margin: 0 0 0.65rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .station-card-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-bottom: 0.85rem;
        }

        .station-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.68rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.95);
          background: rgba(30, 38, 52, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.14);
          padding: 0.22rem 0.62rem;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .station-chip .chip-glyph {
          color: #38bdf8;
          flex-shrink: 0;
        }

        .station-immersive-card:hover .station-chip {
          background: rgba(38, 48, 66, 0.9);
          border-color: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }

        .station-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0;
          gap: 0.45rem;
        }

        .station-card-meta {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.72rem;
          font-weight: 500;
          color: rgba(203, 213, 225, 0.85);
          letter-spacing: 0.01em;
          font-family: var(--font-mono, monospace);
        }

        .station-card-action {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.36rem 0.9rem;
          border-radius: 9999px;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          background: rgba(34, 42, 58, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.14);
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          flex-shrink: 0;
        }

        .station-card-action .action-arrow {
          transition: transform 0.25s ease;
        }

        .station-immersive-card:hover .station-card-action {
          background: rgba(48, 60, 82, 0.98);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
        }

        .station-immersive-card:hover .station-card-action .action-arrow {
          transform: translateX(3px);
        }

        @media (max-width: 640px) {
          .station-immersive-card {
            height: 360px;
          }
          .station-card-content {
            padding: 1.15rem;
          }
          .station-card-title {
            font-size: 1.15rem;
          }
        }

        /* Mobile Quick Station Drawer */
        .mobile-station-quick-drawer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          border: 1px solid #bfdbfe;
          border-radius: var(--radius-sm, 8px);
          padding: 0.65rem 0.85rem;
          margin-top: 0.75rem;
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.12);
          gap: 0.75rem;
          animation: slideUpDrawer 0.25s ease-out;
        }

        @keyframes slideUpDrawer {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .quick-drawer-left {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          min-width: 0;
        }

        .quick-drawer-thumb {
          width: 44px;
          height: 44px;
          border-radius: 6px;
          object-fit: cover;
          flex-shrink: 0;
          border: 1px solid var(--border-subtle);
        }

        .quick-drawer-info {
          min-width: 0;
        }

        .quick-drawer-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--navy);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .quick-drawer-tags {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 0.15rem;
          flex-wrap: wrap;
        }

        .quick-region-tag {
          font-size: 0.68rem;
          font-weight: 700;
          color: #0284c7;
          background: #eff6ff;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
        }

        .quick-temp-tag, .quick-wind-tag {
          font-size: 0.68rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .quick-drawer-actions {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-shrink: 0;
        }

        .quick-inspect-anchor-btn {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          background: #0284c7;
          color: #ffffff;
          padding: 0.4rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.15s ease;
        }

        .quick-inspect-anchor-btn:hover {
          background: #0369a1;
        }

        .quick-close-btn {
          background: #f1f5f9;
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.75rem;
        }

        .quick-close-btn:hover {
          background: #e2e8f0;
          color: var(--navy);
        }

        /* Responsive Improvements */
        @media (max-width: 1024px) {
          .map-layout-grid {
            grid-template-columns: 1fr;
          }
          .viewport-stage {
            min-height: 440px;
          }
          .viewport-layers-toolbar {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.6rem;
          }
          .layer-chip-buttons {
            width: 100%;
            overflow-x: auto;
            padding-bottom: 0.35rem;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: thin;
          }
        }

        @media (max-width: 768px) {
          .polar-map-page {
            padding: 1.25rem 0.75rem 3.5rem;
          }
          .page-header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .view-mode-toggle-group {
            width: 100%;
            display: flex;
            background: #f1f5f9;
            padding: 0.25rem;
            border-radius: 8px;
            gap: 0.25rem;
          }
          .mode-toggle-btn {
            flex: 1;
            justify-content: center;
            padding: 0.55rem 0.35rem;
            font-size: 0.76rem;
            border-radius: 6px;
            min-height: 40px;
          }
          .mode-toggle-btn span {
            font-size: 0.74rem;
          }
          .map-view-pills-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          .pills-scroll {
            width: 100%;
            overflow-x: auto;
            padding-bottom: 0.35rem;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .pills-scroll::-webkit-scrollbar {
            display: none;
          }
          .viewport-stage {
            min-height: 380px;
          }
          .map-viewport-card {
            padding: 0.75rem;
          }
          .layer-chip-buttons {
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            padding-bottom: 0.25rem;
          }
          .layer-chip-buttons::-webkit-scrollbar {
            display: none;
          }
          .layer-chip {
            padding: 0.35rem 0.65rem;
            font-size: 0.72rem;
            white-space: nowrap;
            flex-shrink: 0;
            min-height: 34px;
          }
          .telemetry-statusbar {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.6rem;
            padding: 0.75rem;
          }
          .telemetry-refresh-btn {
            grid-column: span 2;
            justify-content: center;
            min-height: 38px;
          }
          .stations-grid {
            grid-template-columns: 1fr;
            gap: 0.85rem;
          }
          .viewport-footer-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }

        @media (max-width: 480px) {
          .mode-toggle-btn span {
            font-size: 0.7rem;
          }
          .telemetry-statusbar {
            grid-template-columns: 1fr;
            padding: 0.65rem;
          }
          .telemetry-refresh-btn {
            grid-column: span 1;
          }
          .station-telemetry-grid {
            grid-template-columns: 1fr;
          }
          .mobile-station-quick-drawer {
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
            gap: 0.65rem;
          }
          .quick-drawer-actions {
            width: 100%;
            display: flex;
            justify-content: space-between;
            gap: 0.5rem;
          }
          .quick-inspect-anchor-btn {
            flex: 1;
            justify-content: center;
            min-height: 38px;
          }
        }

        /* NCPOR Live News Banner (Modern Smooth Redesign) */
        .ncpor-news-banner {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: var(--radius-sm, 10px);
          padding: 0.4rem 0.65rem 0.4rem 0.55rem;
          margin-bottom: 1.5rem;
          overflow: hidden;
          box-shadow: 0 2px 8px -2px rgba(15, 23, 42, 0.04);
          position: relative;
        }

        .news-banner-label {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          color: #ffffff;
          padding: 0.26rem 0.65rem;
          border-radius: 9999px;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          white-space: nowrap;
          flex-shrink: 0;
          box-shadow: 0 2px 6px rgba(2, 132, 199, 0.25);
        }

        .news-ticker-viewport {
          flex: 1;
          overflow: hidden;
          position: relative;
          mask-image: linear-gradient(to right, transparent, black 15px, black calc(100% - 20px), transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 15px, black calc(100% - 20px), transparent);
          display: flex;
          align-items: center;
        }

        .news-ticker-track {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          white-space: nowrap;
          animation: tickerInfiniteScroll 38s linear infinite;
          width: max-content;
        }

        .ncpor-news-banner:hover .news-ticker-track {
          animation-play-state: paused;
        }

        @keyframes tickerInfiniteScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .news-ticker-item {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.76rem;
          color: var(--navy, #0f172a);
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          padding: 0.25rem 0.55rem;
          border-radius: 6px;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .news-chevron {
          color: #0284c7;
          font-size: 0.65rem;
          font-weight: 800;
          transition: transform 0.2s ease;
        }

        .news-headline {
          letter-spacing: -0.005em;
        }

        .news-ext-icon {
          color: #94a3b8;
          opacity: 0;
          transform: translateX(-3px);
          transition: all 0.2s ease;
        }

        .news-ticker-item:hover {
          color: #0284c7;
          background: rgba(2, 132, 199, 0.08);
        }

        .news-ticker-item:hover .news-chevron {
          transform: translateX(2px);
        }

        .news-ticker-item:hover .news-ext-icon {
          opacity: 1;
          transform: translateX(0);
          color: #0284c7;
        }

        .news-source-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: #f8fafc;
          border: 1px solid var(--border-subtle, #e2e8f0);
          color: var(--text-muted, #64748b);
          padding: 0.22rem 0.55rem;
          border-radius: 9999px;
          font-size: 0.66rem;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          flex-shrink: 0;
          transition: all 0.18s ease;
        }

        .news-source-pill:hover {
          background: #f1f5f9;
          color: #0284c7;
          border-color: #cbd5e1;
        }

        /* Aurora severity highlight classes */
        .highlight-red   { color: #dc2626 !important; }
        .highlight-orange { color: #ea580c !important; }
      `}</style>
    </div>
  );
}

import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import * as d3geo from 'd3-geo';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { ZoomIn, ZoomOut, RotateCw, Maximize2, Minimize2 } from 'lucide-react';

// ─── Static Geo Features & Geometry ─────────────────────────────────────────
const LAND = topojson.feature(worldData, worldData.objects.countries);
const GRATICULE = d3geo.geoGraticule()();
const SPHERE = { type: 'Sphere' };

// Country ID classifications
const ANT_IDS = new Set(['010']); // Antarctica
const IND_IDS = new Set(['356']); // India
const ARCT_IDS = new Set(['304', '578', '752', '246']); // Greenland, Norway, Sweden, Finland

// NCPOR Headquarters (Goa, India)
const HQ = {
  id: 'st-hq-goa',
  name: 'NCPOR Goa (HQ)',
  nameHi: 'एनसीपीओआर मुख्यालय, गोवा',
  region: 'India HQ',
  lng: 73.83,
  lat: 15.39,
  elevation: '45 m',
  temp: '+29°C',
  status: 'Operational Headquarters'
};

// ─── Curated Geographic Reference Labels (Continents, Countries, Polar Oceans) ──
const GEO_LABELS = [
  // ── Continents ──
  { name: 'ANTARCTICA', type: 'continent', lng: 0, lat: -82, minScale: 140 },
  { name: 'ASIA', type: 'continent', lng: 90, lat: 46, minScale: 140 },
  { name: 'AFRICA', type: 'continent', lng: 22, lat: 2, minScale: 140 },
  { name: 'EUROPE', type: 'continent', lng: 18, lat: 50, minScale: 160 },
  { name: 'AUSTRALIA', type: 'continent', lng: 134, lat: -25, minScale: 140 },
  { name: 'NORTH AMERICA', type: 'continent', lng: -100, lat: 46, minScale: 140 },
  { name: 'SOUTH AMERICA', type: 'continent', lng: -58, lat: -16, minScale: 140 },

  // ── Polar Geographic Sectors ──
  { name: 'South Pole (90°S)', type: 'polar', lng: 0, lat: -89.8, minScale: 220 },
  { name: 'North Pole (90°N)', type: 'polar', lng: 0, lat: 89.8, minScale: 200 },
  { name: 'Dronning Maud Land', type: 'region', lng: 14, lat: -73.5, minScale: 240 },
  { name: 'Princess Astrid Coast', type: 'region', lng: 12, lat: -68.8, minScale: 280 },
  { name: 'Larsemann Hills', type: 'region', lng: 76.5, lat: -67.8, minScale: 280 },
  { name: 'Schirmacher Oasis', type: 'region', lng: 11.6, lat: -71.5, minScale: 300 },
  { name: 'Weddell Sea', type: 'water', lng: -45, lat: -73, minScale: 210 },
  { name: 'Ross Sea', type: 'water', lng: 175, lat: -75, minScale: 210 },
  { name: 'Southern Ocean', type: 'water', lng: 60, lat: -56, minScale: 160 },
  { name: 'Arctic Ocean', type: 'water', lng: 0, lat: 84, minScale: 170 },
  { name: 'Barents Sea', type: 'water', lng: 40, lat: 74, minScale: 220 },
  { name: 'Indian Ocean', type: 'water', lng: 75, lat: -12, minScale: 150 },
  { name: 'Atlantic Ocean', type: 'water', lng: -28, lat: 15, minScale: 150 },
  { name: 'Pacific Ocean', type: 'water', lng: -160, lat: 5, minScale: 150 },

  // ── High Arctic & Cryosphere Regions ──
  { name: 'Svalbard (Norway)', type: 'country', lng: 18, lat: 78.5, minScale: 200 },
  { name: 'Greenland', type: 'country', lng: -40, lat: 72, minScale: 160 },
  { name: 'Kongsfjorden Fjord', type: 'region', lng: 12.2, lat: 80.2, minScale: 310 },

  // ── Prominent Countries ──
  { name: 'INDIA', type: 'highlight_country', lng: 79, lat: 21.5, minScale: 140 },
  { name: 'Himalayas / Third Pole', type: 'region', lng: 84, lat: 30, minScale: 200 },
  { name: 'Spiti Valley', type: 'region', lng: 78.2, lat: 33.2, minScale: 310 },
  { name: 'Norway', type: 'country', lng: 8.5, lat: 61, minScale: 220 },
  { name: 'Sweden', type: 'country', lng: 15.5, lat: 62, minScale: 240 },
  { name: 'Finland', type: 'country', lng: 26, lat: 64, minScale: 240 },
  { name: 'Russia / Siberia', type: 'country', lng: 95, lat: 62, minScale: 160 },
  { name: 'Canada', type: 'country', lng: -105, lat: 58, minScale: 160 },
  { name: 'Alaska (USA)', type: 'country', lng: -152, lat: 64, minScale: 180 },
  { name: 'United States', type: 'country', lng: -98, lat: 38, minScale: 170 },
  { name: 'South Africa', type: 'country', lng: 24, lat: -29, minScale: 170 },
  { name: 'Madagascar', type: 'country', lng: 47, lat: -19, minScale: 210 },
  { name: 'New Zealand', type: 'country', lng: 172, lat: -42, minScale: 190 },
  { name: 'Chile', type: 'country', lng: -71, lat: -35, minScale: 190 },
  { name: 'Argentina', type: 'country', lng: -65, lat: -38, minScale: 190 },
  { name: 'Brazil', type: 'country', lng: -52, lat: -10, minScale: 170 },
  { name: 'China', type: 'country', lng: 104, lat: 35, minScale: 160 },
  { name: 'Japan', type: 'country', lng: 138, lat: 37, minScale: 210 },
  { name: 'United Kingdom', type: 'country', lng: -2, lat: 54, minScale: 230 },
  { name: 'France', type: 'country', lng: 2.5, lat: 46.5, minScale: 240 },
  { name: 'Germany', type: 'country', lng: 10.5, lat: 51, minScale: 240 },
  { name: 'Saudi Arabia', type: 'country', lng: 45, lat: 24, minScale: 190 },
  { name: 'Indonesia', type: 'country', lng: 114, lat: -1, minScale: 190 },
];

// ─── Color & Math Helpers ───────────────────────────────────────────────────
function hexToRgba(hex, alpha = 1) {
  if (!hex) return `rgba(56, 189, 248, ${alpha})`;
  if (hex.startsWith('rgba') || hex.startsWith('rgb')) return hex;
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  if (isNaN(num)) return `rgba(56, 189, 248, ${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function lerp(a, b, t) { return a + (b - a) * t; }

function lerpAngle(a, b, t) {
  let d = b - a;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  return a + d * t;
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

// Check if a geographic coordinate is on the visible front-facing hemisphere
function isCoordFacing(lng, lat, rotation, projectionType) {
  if (projectionType === 'geoEqualEarth') return true;
  if (projectionType === 'geoStereographic') {
    const d = d3geo.geoDistance([lng, lat], [-rotation[0], -rotation[1]]);
    return d <= (105 * Math.PI / 180);
  }
  // geoOrthographic: facing if angular distance from camera center <= 90 deg
  const dist = d3geo.geoDistance([lng, lat], [-rotation[0], -rotation[1]]);
  return dist <= (Math.PI / 2);
}

// Build projection
function createProjection(type, scale, rotation, width, height) {
  let proj;
  if (type === 'geoStereographic') {
    proj = d3geo.geoStereographic().clipAngle(105);
  } else if (type === 'geoEqualEarth') {
    proj = d3geo.geoEqualEarth();
  } else {
    proj = d3geo.geoOrthographic().clipAngle(90);
  }
  return proj
    .scale(scale)
    .rotate(rotation)
    .translate([width / 2, height / 2]);
}

// Pre-computed Geographic Circles (True Spherical Geometry)
const arcticIceCap = d3geo.geoCircle().center([0, 90]).radius(16)();
const antarcticIceCap = d3geo.geoCircle().center([0, -90]).radius(22)();
const northAuroraRing = d3geo.geoCircle().center([10, 78]).radius(18)();
const southAuroraRing = d3geo.geoCircle().center([72, -72]).radius(20)();

// ─── Main PolarGlobeMap Component ───────────────────────────────────────────
export default function PolarGlobeMap({
  stations = [],
  selectedStation = null,
  onSelectStation = () => {},
  activePreset = 'all',
  projectionType = 'geoOrthographic',
  satellitePosition = null,  // { lat, lng } from real TLE orbital calc. Falls back to animation.
  layers = {
    showRoutes: true,
    showAurora: true,
    showSatellite: true,
    showSeaIce: true,
    showGraticule: true,
    showLabels: true,
    autoRotate: false,
  },
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Smooth animation and physics refs
  const rotRef = useRef([-80.3, -21.0, 0]);   // [lambda, phi, gamma] Centered on India (80.3°E, 21.0°N)
  const targetRef = useRef(null);            // tween target rotation
  const scaleRef = useRef(300);              // current zoom scale
  const targetScaleRef = useRef(null);       // tween target scale
  const velRef = useRef([0, 0]);             // drag inertia velocity
  const dragRef = useRef(null);              // active drag session
  const satRef = useRef({ angle: 0, lng: 15, lat: 60 });
  const satPosRef = useRef(null);            // real TLE position override
  const pulseRef = useRef(0);                // radar pulse phase
  const hovRef = useRef(null);               // hovered station item
  const renderedStationsRef = useRef([]);    // rendered station geometry for hit-testing
  const rafRef = useRef(null);
  const layersRef = useRef(layers);
  const selStRef = useRef(selectedStation);
  const stationsRef = useRef(stations);
  const projTypeRef = useRef(projectionType);

  // React UI state for HUD
  const [scaleState, setScaleState] = useState(300);
  const [rotState, setRotState] = useState([-80.3, -21.0, 0]);
  const [isHoveringPin, setIsHoveringPin] = useState(false);

  // Keep references fresh
  useEffect(() => { layersRef.current = layers; }, [layers]);
  useEffect(() => { selStRef.current = selectedStation; }, [selectedStation]);
  useEffect(() => { stationsRef.current = stations; }, [stations]);
  useEffect(() => { projTypeRef.current = projectionType; }, [projectionType]);
  useEffect(() => { satPosRef.current = satellitePosition; }, [satellitePosition]);

  // Preset Camera Angles
  const applyPreset = useCallback((preset) => {
    const map = {
      antarctica:       { rot: [-45, 75, 0], scale: 290 },
      arctic:           { rot: [-12, -78, 0], scale: 290 },
      himalaya:         { rot: [-77.6, -32.4, 0], scale: 330 },
      'southern-ocean': { rot: [-55, 45, 0], scale: 260 },
      all:              { rot: [-80.3, -21.0, 0], scale: 300 },
    };
    const p = map[preset] || map.all;
    targetRef.current = p.rot;
    targetScaleRef.current = p.scale;
  }, []);

  // Sync preset or selected station changes
  useEffect(() => {
    if (selectedStation?.lng != null && selectedStation?.lat != null) {
      targetRef.current = [-selectedStation.lng, -selectedStation.lat, 0];
      targetScaleRef.current = 330;
    } else {
      applyPreset(activePreset);
    }
  }, [selectedStation, activePreset, applyPreset]);

  // ── Canvas Rendering Engine ────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    const pt = projTypeRef.current;
    const baseScale = scaleRef.current;
    // Responsive scale: on mobile screens, fit the initial baseline view comfortably
    // while allowing unrestricted pinch-to-zoom and zoom button scaling
    const isMobile = W < 640;
    const mobileRatio = isMobile ? Math.min(W * 0.44, H * 0.44) / 300 : 1;
    const currentScale = pt === 'geoEqualEarth'
      ? (isMobile ? baseScale * Math.min(1, W / 600) : baseScale)
      : baseScale * mobileRatio;
    const currentRot = rotRef.current;
    const proj = createProjection(pt, currentScale, currentRot, W, H);
    const path = d3geo.geoPath(proj, ctx);

    const cx = W / 2;
    const cy = H / 2;
    const r = currentScale;

    // 1. Ocean Sphere Background & Atmospheric Rim Glow
    if (pt === 'geoOrthographic') {
      // Atmospheric Outer Corona Glow
      const atmGrad = ctx.createRadialGradient(cx, cy, r * 0.96, cx, cy, r * 1.14);
      atmGrad.addColorStop(0, 'rgba(56, 189, 248, 0.2)');
      atmGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.05)');
      atmGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.14, 0, Math.PI * 2);
      ctx.fillStyle = atmGrad;
      ctx.fill();

      // Deep Ocean Sphere Fill
      const oceanGrad = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.25, r * 0.05, cx, cy, r);
      oceanGrad.addColorStop(0, '#102a4e');
      oceanGrad.addColorStop(0.5, '#0a1d37');
      oceanGrad.addColorStop(1, '#030d1c');
      ctx.beginPath();
      path(SPHERE);
      ctx.fillStyle = oceanGrad;
      ctx.fill();

      // Limb Rim Highlight
      const rimGrad = ctx.createRadialGradient(cx, cy, r * 0.88, cx, cy, r * 1.01);
      rimGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      rimGrad.addColorStop(0.8, 'rgba(56, 189, 248, 0.12)');
      rimGrad.addColorStop(1, 'rgba(125, 211, 252, 0.38)');
      ctx.beginPath();
      path(SPHERE);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.fillStyle = rimGrad;
      ctx.fill();
    } else {
      // Boundary for Equal Earth or Stereographic Radar
      ctx.beginPath();
      path(SPHERE);
      ctx.fillStyle = '#07152b';
      ctx.fill();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }

    // 2. Graticule Lines (Coordinate Latitude/Longitude Grid)
    if (layersRef.current.showGraticule) {
      ctx.beginPath();
      path(GRATICULE);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.13)';
      ctx.lineWidth = 0.65;
      ctx.stroke();
    }

    // 3. Landmasses & Countries
    LAND.features.forEach((feat) => {
      const id = String(feat.id || '');
      const name = feat.properties?.name || '';
      const isAnt = ANT_IDS.has(id) || name === 'Antarctica';
      const isInd = IND_IDS.has(id) || name === 'India';
      const isArct = ARCT_IDS.has(id) || name.includes('Greenland') || name.includes('Norway');

      ctx.beginPath();
      path(feat);

      if (isAnt) {
        // Antarctica - Icy Glacial Cyan Glow
        ctx.fillStyle = 'rgba(125, 211, 252, 0.34)';
        ctx.strokeStyle = '#7dd3fc';
        ctx.lineWidth = 1.25;
      } else if (isInd) {
        // India - Warm Amber/Gold
        ctx.fillStyle = '#224673';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.35;
      } else if (isArct) {
        // Arctic nations - Emerald
        ctx.fillStyle = 'rgba(52, 211, 153, 0.24)';
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 1.0;
      } else {
        // General Continents
        ctx.fillStyle = '#11243e';
        ctx.strokeStyle = 'rgba(96, 165, 250, 0.22)';
        ctx.lineWidth = 0.55;
      }

      ctx.fill();
      ctx.stroke();
    });

    // 4. Cryospheric Sea-Ice Extent Layers
    if (layersRef.current.showSeaIce) {
      // Arctic Sea-Ice Ring
      ctx.beginPath();
      path(arcticIceCap);
      ctx.fillStyle = 'rgba(224, 242, 254, 0.16)';
      ctx.fill();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.6)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.setLineDash([]);

      // Antarctic Ice Sheet Extent
      ctx.beginPath();
      path(antarcticIceCap);
      ctx.fillStyle = 'rgba(125, 211, 252, 0.14)';
      ctx.fill();
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.6)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 5. Aurora Oval Zones (Atmospheric Plasma Ribbons)
    if (layersRef.current.showAurora) {
      const pulseVal = 0.5 + Math.sin(pulseRef.current * 2) * 0.15;

      // North Aurora (Borealis)
      ctx.beginPath();
      path(northAuroraRing);
      ctx.strokeStyle = `rgba(52, 211, 153, ${pulseVal})`;
      ctx.lineWidth = 2.4;
      ctx.fillStyle = 'rgba(52, 211, 153, 0.08)';
      ctx.fill();
      ctx.stroke();

      // South Aurora (Australis)
      ctx.beginPath();
      path(southAuroraRing);
      ctx.strokeStyle = `rgba(168, 85, 247, ${pulseVal * 0.9})`;
      ctx.lineWidth = 2.4;
      ctx.fillStyle = 'rgba(168, 85, 247, 0.08)';
      ctx.fill();
      ctx.stroke();
    }

    // 5.5. Geographic Country, Continent & Ocean Labels
    if (layersRef.current.showLabels !== false) {
      GEO_LABELS.forEach((lbl) => {
        if (baseScale < (lbl.minScale || 140)) return;
        if (!isCoordFacing(lbl.lng, lbl.lat, currentRot, pt)) return;

        const lp = proj([lbl.lng, lbl.lat]);
        if (!lp) return;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (lbl.type === 'continent') {
          const fontSize = Math.round(clamp(currentScale * 0.038, 9, 13));
          ctx.font = `bold ${fontSize}px Inter, sans-serif`;
          ctx.fillStyle = 'rgba(224, 242, 254, 0.65)';
          ctx.strokeStyle = 'rgba(3, 10, 23, 0.85)';
          ctx.lineWidth = 2.5;
          ctx.strokeText(lbl.name, lp[0], lp[1]);
          ctx.fillText(lbl.name, lp[0], lp[1]);
        } else if (lbl.type === 'highlight_country') {
          const fontSize = Math.round(clamp(currentScale * 0.034, 9, 12));
          ctx.font = `bold ${fontSize}px Inter, sans-serif`;
          ctx.fillStyle = '#fcd34d'; // Warm Amber/Gold for India
          ctx.strokeStyle = 'rgba(3, 10, 23, 0.9)';
          ctx.lineWidth = 2.5;
          ctx.strokeText(lbl.name, lp[0], lp[1]);
          ctx.fillText(lbl.name, lp[0], lp[1]);
        } else if (lbl.type === 'country') {
          const fontSize = Math.round(clamp(currentScale * 0.029, 8, 10.5));
          ctx.font = `600 ${fontSize}px Inter, sans-serif`;
          ctx.fillStyle = 'rgba(203, 213, 225, 0.72)';
          ctx.strokeStyle = 'rgba(3, 10, 23, 0.85)';
          ctx.lineWidth = 2.2;
          ctx.strokeText(lbl.name, lp[0], lp[1]);
          ctx.fillText(lbl.name, lp[0], lp[1]);
        } else if (lbl.type === 'region' || lbl.type === 'polar') {
          const fontSize = Math.round(clamp(currentScale * 0.028, 8, 10));
          ctx.font = `italic 600 ${fontSize}px Inter, sans-serif`;
          ctx.fillStyle = lbl.type === 'polar' ? '#7dd3fc' : 'rgba(186, 230, 253, 0.65)';
          ctx.strokeStyle = 'rgba(3, 10, 23, 0.85)';
          ctx.lineWidth = 2;
          ctx.strokeText(lbl.name, lp[0], lp[1]);
          ctx.fillText(lbl.name, lp[0], lp[1]);
        } else if (lbl.type === 'water') {
          const fontSize = Math.round(clamp(currentScale * 0.03, 8.5, 11));
          ctx.font = `italic ${fontSize}px Inter, sans-serif`;
          ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
          ctx.fillText(lbl.name, lp[0], lp[1]);
        }

        ctx.restore();
      });
    }

    // 6. Logistics Great-Circle Routes from Goa HQ
    if (layersRef.current.showRoutes) {
      const allStations = stationsRef.current;
      allStations.forEach((st, idx) => {
        const color = st.region === 'Antarctica' ? '#38bdf8'
                    : st.region === 'Arctic'     ? '#34d399'
                    : '#f59e0b';

        const routeFeature = {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [[HQ.lng, HQ.lat], [st.lng, st.lat]]
          }
        };

        // Draw Great-Circle Track Arc
        ctx.beginPath();
        path(routeFeature);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.6;
        ctx.setLineDash([5, 4]);
        ctx.globalAlpha = 0.65;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1.0;

        // Animated traveling flight / telemetry pulse
        const interp = d3geo.geoInterpolate([HQ.lng, HQ.lat], [st.lng, st.lat]);
        const progress = ((pulseRef.current * 0.35) + (idx * 0.22)) % 1;
        const pulseCoord = interp(progress);

        if (isCoordFacing(pulseCoord[0], pulseCoord[1], currentRot, pt)) {
          const ptScreen = proj(pulseCoord);
          if (ptScreen) {
            ctx.beginPath();
            ctx.arc(ptScreen[0], ptScreen[1], 3, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(ptScreen[0], ptScreen[1], 6.5, 0, Math.PI * 2);
            ctx.fillStyle = hexToRgba(color, 0.4);
            ctx.fill();
          }
        }
      });
    }

    // 7. NCPOR HQ Goa Marker
    if (isCoordFacing(HQ.lng, HQ.lat, currentRot, pt)) {
      const hqScreen = proj([HQ.lng, HQ.lat]);
      if (hqScreen) {
        // Outer Radar Ripple
        const hqR = 6 + Math.sin(pulseRef.current * 3) * 3;
        ctx.beginPath();
        ctx.arc(hqScreen[0], hqScreen[1], hqR + 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
        ctx.fill();

        // Main Dot
        ctx.beginPath();
        ctx.arc(hqScreen[0], hqScreen[1], 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label Badge
        ctx.fillStyle = 'rgba(7, 16, 30, 0.9)';
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
        ctx.lineWidth = 1;
        roundRect(ctx, hqScreen[0] + 9, hqScreen[1] - 12, 106, 17, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#fcd34d';
        ctx.font = 'bold 9px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('⭐ NCPOR HQ (Goa)', hqScreen[0] + 13, hqScreen[1] - 1);
      }
    }

    // 8. Earth Observation Polar Satellite Track
    if (layersRef.current.showSatellite) {
      // Use real TLE position if available (from usePolarData hook), fallback to animation
      const sat = satPosRef.current
        ? { lng: satPosRef.current.lng, lat: satPosRef.current.lat }
        : satRef.current;
      if (isCoordFacing(sat.lng, sat.lat, currentRot, pt)) {
        const satPt = proj([sat.lng, sat.lat]);
        if (satPt) {
          // Footprint Sensor Beam Circle
          const footCircle = d3geo.geoCircle().center([sat.lng, sat.lat]).radius(8)();
          ctx.beginPath();
          path(footCircle);
          ctx.fillStyle = 'rgba(252, 211, 77, 0.12)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(252, 211, 77, 0.35)';
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Satellite Body & Solar Panels
          ctx.fillStyle = '#fcd34d';
          ctx.fillRect(satPt[0] - 4, satPt[1] - 4, 8, 8);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.strokeRect(satPt[0] - 4, satPt[1] - 4, 8, 8);

          // Solar wings
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(satPt[0] - 4, satPt[1]);
          ctx.lineTo(satPt[0] - 13, satPt[1]);
          ctx.moveTo(satPt[0] + 4, satPt[1]);
          ctx.lineTo(satPt[0] + 13, satPt[1]);
          ctx.stroke();

          // Label
          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 8.5px monospace';
          ctx.textAlign = 'left';
          ctx.fillText('🛰️ OCEANSAT-3 / SARAL', satPt[0] + 16, satPt[1] + 3);
        }
      }
    }

    // 9. Polar Research Stations Markers & Pins with Collision Detection & Leader Lines
    const currentStations = stationsRef.current;
    const selStationId = selStRef.current?.id;
    const hovStationId = hovRef.current?.id;

    // Collect all visible stations with projected screen coordinates
    const visibleStations = [];
    currentStations.forEach((st) => {
      const facing = isCoordFacing(st.lng, st.lat, currentRot, pt);
      if (!facing) return;
      const p2 = proj([st.lng, st.lat]);
      if (!p2) return;
      visibleStations.push({
        st,
        x: p2[0],
        y: p2[1],
        isSel: st.id === selStationId,
        isHov: st.id === hovStationId,
      });
    });

    // Detect clusters and layout non-overlapping labels
    const layouts = [];
    const processedIds = new Set();

    visibleStations.forEach((item, i) => {
      if (processedIds.has(item.st.id)) return;

      const cluster = [item];
      for (let j = 0; j < visibleStations.length; j++) {
        if (i === j) continue;
        const other = visibleStations[j];
        if (Math.hypot(item.x - other.x, item.y - other.y) < 48) {
          cluster.push(other);
          processedIds.add(other.st.id);
        }
      }
      processedIds.add(item.st.id);

      if (cluster.length === 1) {
        // Single isolated station
        const { st, x, y, isSel, isHov } = item;
        const labelText = (st.name || '').replace(' Station', '').replace(' Underwater Observatory', '');
        ctx.font = `${isSel || isHov ? 'bold ' : '600 '}9.5px Inter, sans-serif`;
        const textMetrics = ctx.measureText(labelText);
        const tagW = textMetrics.width + 20;
        const tagH = 19;
        const tagX = x + 12;
        const tagY = y - 9;

        layouts.push({
          st,
          x,
          y,
          tagX,
          tagY,
          tagW,
          tagH,
          labelText,
          isSel,
          isHov,
          hasLeader: false,
          region: st.region,
        });
      } else {
        // Clustered stations (e.g. Dakshin Gangotri & Maitri in Antarctica, or IndARC & Himadri in Arctic)
        // Sort cluster so specific stations have deterministic and natural vertical slots
        cluster.sort((a, b) => {
          if (a.st.id === 'st-dg') return -1;
          if (b.st.id === 'st-dg') return 1;
          if (a.st.id === 'st-indarc') return -1;
          if (b.st.id === 'st-indarc') return 1;
          return a.y - b.y;
        });

        cluster.forEach((cItem, idx) => {
          const { st, x, y, isSel, isHov } = cItem;
          const labelText = (st.name || '').replace(' Station', '').replace(' Underwater Observatory', '');
          ctx.font = `${isSel || isHov ? 'bold ' : '600 '}9.5px Inter, sans-serif`;
          const textMetrics = ctx.measureText(labelText);
          const tagW = textMetrics.width + 20;
          const tagH = 19;

          let tagX, tagY, elbowX, elbowY;
          if (idx === 0) {
            // First item placed top-right with angled leader line
            tagX = x + 26;
            tagY = y - 26;
            elbowX = x + 14;
            elbowY = y - 16;
          } else {
            // Second item placed bottom-right with angled leader line
            tagX = x + 26;
            tagY = y + 12;
            elbowX = x + 14;
            elbowY = y + 10;
          }

          layouts.push({
            st,
            x,
            y,
            tagX,
            tagY,
            tagW,
            tagH,
            elbowX,
            elbowY,
            labelText,
            isSel,
            isHov,
            hasLeader: true,
            region: st.region,
          });
        });
      }
    });

    // Save for pointer hit-testing
    renderedStationsRef.current = layouts.map((l) => ({
      station: l.st,
      pin: [l.x, l.y],
      tagBounds: { x: l.tagX, y: l.tagY, w: l.tagW, h: l.tagH },
      isSel: l.isSel,
      isHov: l.isHov,
    }));

    // Sort draw order: non-selected/non-hovered first, hovered next, selected drawn on top
    layouts.sort((a, b) => {
      const scoreA = (a.isSel ? 2 : 0) + (a.isHov ? 1 : 0);
      const scoreB = (b.isSel ? 2 : 0) + (b.isHov ? 1 : 0);
      return scoreA - scoreB;
    });

    // Render each station marker, leader lines, and badge tooltip
    layouts.forEach((item) => {
      const { st, x, y, tagX, tagY, tagW, tagH, elbowX, elbowY, labelText, isSel, isHov, hasLeader } = item;

      const isHeritage = st.id === 'st-dg';
      const isUnderwater = st.id === 'st-indarc';
      const isHimansh = st.id === 'st-himansh';

      const color = isHeritage ? '#f59e0b'
                  : isUnderwater ? '#06b6d4'
                  : isHimansh ? '#fb923c'
                  : st.region === 'Antarctica' ? '#38bdf8'
                  : st.region === 'Arctic'     ? '#34d399'
                  : '#f59e0b';

      const dotRadius = isSel ? 6.5 : isHov ? 6 : 4.5;
      const pulseSize = isSel ? (15 + Math.sin(pulseRef.current * 4) * 5) : (isHov ? 13 : 9);

      // Draw Leader Line connecting pin to offset badge tag
      if (hasLeader) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(elbowX, elbowY);
        ctx.lineTo(tagX, tagY + tagH / 2);
        ctx.strokeStyle = isSel ? color : isHov ? '#ffffff' : hexToRgba(color, 0.75);
        ctx.lineWidth = isSel || isHov ? 1.6 : 1.1;
        ctx.stroke();

        // Pin connector anchor node
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = isSel ? '#ffffff' : color;
        ctx.fill();
      }

      // Radar Pulse Halo
      ctx.beginPath();
      ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(color, isSel ? 0.35 : isHov ? 0.25 : 0.15);
      ctx.fill();
      ctx.strokeStyle = hexToRgba(color, isSel ? 0.8 : isHov ? 0.6 : 0.35);
      ctx.lineWidth = 1;
      ctx.stroke();

      // Solid Center Marker Dot
      ctx.beginPath();
      ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = isSel || isHov ? '#ffffff' : 'rgba(255,255,255,0.85)';
      ctx.lineWidth = isSel ? 2 : 1.5;
      ctx.stroke();

      // Badge Card Box
      ctx.fillStyle = isSel ? 'rgba(7, 16, 30, 0.96)' : isHov ? 'rgba(12, 26, 48, 0.95)' : 'rgba(7, 16, 30, 0.88)';
      ctx.strokeStyle = isSel ? color : isHov ? '#ffffff' : hexToRgba(color, 0.4);
      ctx.lineWidth = isSel ? 1.6 : isHov ? 1.4 : 0.9;

      if (isSel || isHov) {
        ctx.shadowColor = hexToRgba(color, 0.6);
        ctx.shadowBlur = 8;
      }

      roundRect(ctx, tagX, tagY, tagW, tagH, 5);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0; // reset shadow blur

      // Status indicator dot inside label box
      const statusDotColor = isHeritage ? '#f59e0b' : '#34d399';
      ctx.beginPath();
      ctx.arc(tagX + 7, tagY + tagH / 2, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = statusDotColor;
      ctx.fill();

      // Label text
      ctx.font = `${isSel ? 'bold ' : isHov ? 'bold ' : '600 '}9.5px Inter, sans-serif`;
      ctx.fillStyle = isSel ? '#ffffff' : isHov ? '#ffffff' : color;
      ctx.textAlign = 'left';
      ctx.fillText(labelText, tagX + 13, tagY + 13);
    });

    ctx.restore();
  }, []);

  // ── 60 FPS RequestAnimationFrame Render Loop ──────────────────────────────
  useEffect(() => {
    let lastTime = performance.now();

    const tick = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      pulseRef.current += dt;

      // Orbit Satellite update
      const sat = satRef.current;
      sat.angle += dt * 0.45;
      sat.lng = ((sat.angle * 28) % 360) - 180;
      sat.lat = Math.sin(sat.angle) * 82;

      // Tween rotation to target camera angle
      const target = targetRef.current;
      const dragging = Boolean(dragRef.current);

      if (target && !dragging) {
        const r = rotRef.current;
        const n0 = lerpAngle(r[0], target[0], 0.12);
        const n1 = lerp(r[1], target[1], 0.12);
        rotRef.current = [n0, n1, 0];

        if (Math.abs(n0 - target[0]) < 0.15 && Math.abs(n1 - target[1]) < 0.15) {
          rotRef.current = [...target];
          targetRef.current = null;
        }
      } else if (!dragging) {
        // Drag inertia velocity physics
        const [vx, vy] = velRef.current;
        if (Math.abs(vx) > 0.01 || Math.abs(vy) > 0.01) {
          rotRef.current[0] += vx;
          rotRef.current[1] = clamp(rotRef.current[1] + vy, -85, 85);
          velRef.current[0] *= 0.92;
          velRef.current[1] *= 0.92;
        } else if (layersRef.current.autoRotate && !selStRef.current && !target) {
          // Slow steady auto-orbit around the globe
          rotRef.current[0] = (rotRef.current[0] - dt * 4.5) % 360;
        }
      }

      // Tween scale if needed
      if (targetScaleRef.current != null) {
        scaleRef.current = lerp(scaleRef.current, targetScaleRef.current, 0.12);
        setScaleState(Math.round(scaleRef.current));
        if (Math.abs(scaleRef.current - targetScaleRef.current) < 1) {
          scaleRef.current = targetScaleRef.current;
          targetScaleRef.current = null;
        }
      }

      // Draw active frame
      draw();

      // Readout updates
      if (Math.round(now / 16) % 12 === 0) {
        setRotState([...rotRef.current]);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [draw]);

  // ── Responsive Canvas Resizing ─────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const w = container.clientWidth;
      const h = w < 640 
        ? Math.max(320, Math.min(460, Math.round(w * 0.95))) 
        : Math.max(480, Math.min(640, Math.round(w * 0.62)));
      const dpr = window.devicePixelRatio || 1;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };

    handleResize();
    const ro = new ResizeObserver(handleResize);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // ── Native Mobile Multi-Touch (Pinch-to-Zoom & Rotate) Handlers ─────────
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let initialDist = null;
    let initialScale = null;
    let touchDrag = null;

    const onTouchStart = (e) => {
      // Prevent page viewport zoom or pull-to-refresh over the 3D globe canvas
      if (e.cancelable) e.preventDefault();

      // Cancel any ongoing animation tweens on manual touch
      targetRef.current = null;
      targetScaleRef.current = null;

      if (e.touches.length >= 2) {
        // Multi-touch pinch start
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        initialDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        initialScale = scaleRef.current;
        touchDrag = null;
        velRef.current = [0, 0];
        return;
      }

      if (e.touches.length === 1) {
        const t = e.touches[0];
        touchDrag = {
          startX: t.clientX,
          startY: t.clientY,
          lastX: t.clientX,
          lastY: t.clientY,
          rot: [...rotRef.current],
          startTime: performance.now(),
        };
        velRef.current = [0, 0];

        // Hit-test on touch down for station selection
        const rect = canvas.getBoundingClientRect();
        if (rect) {
          const mx = t.clientX - rect.left;
          const my = t.clientY - rect.top;
          const items = renderedStationsRef.current || [];
          let foundStation = null;
          let closestDist = Infinity;

          for (const item of items) {
            const b = item.tagBounds;
            if (mx >= b.x - 8 && mx <= b.x + b.w + 8 && my >= b.y - 8 && my <= b.y + b.h + 8) {
              foundStation = item.station;
              closestDist = 0;
              break;
            }
          }
          if (!foundStation) {
            for (const item of items) {
              const d = Math.hypot(item.pin[0] - mx, item.pin[1] - my);
              if (d < 32 && d < closestDist) {
                closestDist = d;
                foundStation = item.station;
              }
            }
          }
          hovRef.current = foundStation;
          setIsHoveringPin(Boolean(foundStation));
        }
      }
    };

    const onTouchMove = (e) => {
      if (e.cancelable) e.preventDefault();

      // 1. Two-finger Pinch Zoom (Smooth, Unclamped & Responsive)
      if (e.touches.length >= 2 && initialDist && initialScale) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const currentDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        if (currentDist > 0 && initialDist > 0) {
          const factor = currentDist / initialDist;
          const newScale = clamp(initialScale * factor, 120, 1000);
          scaleRef.current = newScale;
          setScaleState(Math.round(newScale));
        }
        return;
      }

      // 2. Single-finger Rotate Drag
      if (e.touches.length === 1 && touchDrag) {
        const t = e.touches[0];
        const dx = t.clientX - touchDrag.startX;
        const dy = t.clientY - touchDrag.startY;
        const sens = 0.35;

        const frameDx = t.clientX - touchDrag.lastX;
        const frameDy = t.clientY - touchDrag.lastY;
        touchDrag.lastX = t.clientX;
        touchDrag.lastY = t.clientY;

        rotRef.current[0] = touchDrag.rot[0] + dx * sens;
        rotRef.current[1] = clamp(touchDrag.rot[1] - dy * sens, -85, 85);

        velRef.current[0] = velRef.current[0] * 0.5 + frameDx * sens * 0.5;
        velRef.current[1] = velRef.current[1] * 0.5 + (-frameDy * sens) * 0.5;
      }
    };

    const onTouchEnd = (e) => {
      if (e.touches.length === 1) {
        // Transition from 2 fingers to 1 finger: re-anchor drag smoothly
        initialDist = null;
        initialScale = null;
        const t = e.touches[0];
        touchDrag = {
          startX: t.clientX,
          startY: t.clientY,
          lastX: t.clientX,
          lastY: t.clientY,
          rot: [...rotRef.current],
          startTime: performance.now(),
        };
        return;
      }

      if (e.touches.length === 0) {
        initialDist = null;
        initialScale = null;

        if (touchDrag) {
          const changed = e.changedTouches?.[0];
          if (changed) {
            const distMoved = Math.hypot(
              changed.clientX - touchDrag.startX,
              changed.clientY - touchDrag.startY
            );
            const duration = performance.now() - touchDrag.startTime;

            // Tap station detection (< 12px move & < 350ms duration)
            if (distMoved < 12 && duration < 350 && hovRef.current) {
              onSelectStation(hovRef.current);
            }
          }
          velRef.current[0] *= 0.3;
          velRef.current[1] *= 0.3;
          touchDrag = null;
        }
      }
    };

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', onTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [onSelectStation]);

  // ── Desktop Mouse & Pointer Drag Events ──────────────────────────────────
  const onPointerDown = useCallback((e) => {
    // Touch is exclusively handled by native touch listeners above
    if (e.pointerType === 'touch') return;

    const canvas = canvasRef.current;
    if (canvas && typeof canvas.setPointerCapture === 'function') {
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      rot: [...rotRef.current],
      time: performance.now(),
    };
    targetRef.current = null;
    targetScaleRef.current = null;
    velRef.current = [0, 0];

    // Immediate hit-testing on pointer down
    const rect = canvas?.getBoundingClientRect();
    if (canvas && rect) {
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const items = renderedStationsRef.current || [];
      let foundStation = null;
      let closestDist = Infinity;

      for (const item of items) {
        const b = item.tagBounds;
        if (mx >= b.x - 6 && mx <= b.x + b.w + 6 && my >= b.y - 6 && my <= b.y + b.h + 6) {
          foundStation = item.station;
          closestDist = 0;
          break;
        }
      }

      if (!foundStation) {
        for (const item of items) {
          const d = Math.hypot(item.pin[0] - mx, item.pin[1] - my);
          if (d < 28 && d < closestDist) {
            closestDist = d;
            foundStation = item.station;
          }
        }
      }

      if (foundStation) {
        hovRef.current = foundStation;
        setIsHoveringPin(true);
      }
    }
  }, []);

  const onPointerMove = useCallback((e) => {
    if (e.pointerType === 'touch') return;

    // Hover hit-test
    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    if (canvas && rect) {
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const items = renderedStationsRef.current || [];
      let foundStation = null;
      let closestDist = Infinity;

      for (const item of items) {
        const b = item.tagBounds;
        if (mx >= b.x - 6 && mx <= b.x + b.w + 6 && my >= b.y - 6 && my <= b.y + b.h + 6) {
          foundStation = item.station;
          closestDist = 0;
          break;
        }
      }

      if (!foundStation) {
        for (const item of items) {
          const d = Math.hypot(item.pin[0] - mx, item.pin[1] - my);
          if (d < 28 && d < closestDist) {
            closestDist = d;
            foundStation = item.station;
          }
        }
      }

      hovRef.current = foundStation;
      setIsHoveringPin(Boolean(foundStation));
    }

    // Drag rotation
    if (!dragRef.current) return;

    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    const sens = 0.32;

    const frameDx = e.clientX - dragRef.current.lastX;
    const frameDy = e.clientY - dragRef.current.lastY;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;

    rotRef.current[0] = dragRef.current.rot[0] + dx * sens;
    rotRef.current[1] = clamp(dragRef.current.rot[1] - dy * sens, -85, 85);

    velRef.current[0] = velRef.current[0] * 0.5 + frameDx * sens * 0.5;
    velRef.current[1] = velRef.current[1] * 0.5 + (-frameDy * sens) * 0.5;
  }, []);

  const onPointerUp = useCallback((e) => {
    if (e.pointerType === 'touch') return;

    const canvas = canvasRef.current;
    if (canvas && typeof canvas.releasePointerCapture === 'function' && canvas.hasPointerCapture?.(e.pointerId)) {
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
    if (!dragRef.current) return;
    const distMoved = Math.hypot(
      e.clientX - dragRef.current.startX,
      e.clientY - dragRef.current.startY
    );

    // If it was a tap/click without major dragging
    if (distMoved < 8 && hovRef.current) {
      onSelectStation(hovRef.current);
    }

    velRef.current[0] *= 0.25;
    velRef.current[1] *= 0.25;
    dragRef.current = null;
  }, [onSelectStation]);

  // Mouse Wheel Zoom
  const onWheel = useCallback((e) => {
    e.preventDefault();
    scaleRef.current = clamp(scaleRef.current - e.deltaY * 0.45, 120, 1000);
    targetScaleRef.current = null;
    setScaleState(Math.round(scaleRef.current));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  // Zoom In / Out Controls
  const handleZoomIn = () => {
    targetScaleRef.current = null;
    scaleRef.current = clamp(scaleRef.current + 60, 120, 1000);
    setScaleState(Math.round(scaleRef.current));
  };

  const handleZoomOut = () => {
    targetScaleRef.current = null;
    scaleRef.current = clamp(scaleRef.current - 60, 120, 1000);
    setScaleState(Math.round(scaleRef.current));
  };

  const handleReset = () => {
    applyPreset('all');
    onSelectStation(null);
  };

  const toggleFullscreenMode = () => {
    setIsFullscreen(prev => !prev);
  };

  // Center Coordinates Formatted Readout
  const coordDisplay = useMemo(() => {
    const lng = ((-(rotState[0] || 0) + 360) % 360).toFixed(1);
    const lat = (-(rotState[1] || 0)).toFixed(1);
    return { lng, lat };
  }, [rotState]);

  return (
    <div 
      ref={containerRef} 
      className={`polar-globe-wrapper ${isHoveringPin ? 'hovering-pin' : ''} ${isFullscreen ? 'pg-fullscreen-active' : ''}`}
    >
      {/* Top HUD Overlay Header */}
      <div className="pg-hud-top">
        {selectedStation && (
          <div className="pg-selected-pill">
            <span className="pg-station-name">{selectedStation.name}</span>
            <button 
              className="pg-clear-btn" 
              onClick={(e) => { e.stopPropagation(); onSelectStation(null); }}
              title="Clear selection"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Floating Vertical Control Dock (Mobile Thumb & Desktop Friendly) */}
      <div className="pg-floating-dock">
        <button className="pg-dock-btn" onClick={handleZoomIn} title="Zoom In (+)" aria-label="Zoom In">
          <ZoomIn size={16} />
        </button>
        <button className="pg-dock-btn" onClick={handleZoomOut} title="Zoom Out (-)" aria-label="Zoom Out">
          <ZoomOut size={16} />
        </button>
        <div className="pg-dock-divider" />
        <button className="pg-dock-btn" onClick={handleReset} title="Reset Global View" aria-label="Reset Global View">
          <RotateCw size={16} />
        </button>
        <div className="pg-dock-divider" />
        <button className="pg-dock-btn" onClick={toggleFullscreenMode} title={isFullscreen ? "Exit Fullscreen Map" : "Expand Fullscreen Map"} aria-label="Toggle Fullscreen">
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      {/* Main Interactive Canvas */}
      <canvas
        ref={canvasRef}
        className="pg-canvas"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ touchAction: 'none', display: 'block' }}
      />

      {/* Bottom HUD Status Strip */}
      <div className="pg-hud-bottom">
        <div className="pg-coord-readout">
          <span className="pg-coord-dot" />
          <span><strong>{coordDisplay.lng}°E, {coordDisplay.lat}°N</strong></span>
          <span className="pg-scale-tag">Zoom: {(scaleState / 300).toFixed(1)}x</span>
        </div>
        <div className="pg-hint-bar">
          <span>👆 1-finger rotate · 🤏 Pinch zoom · 📍 Tap base</span>
        </div>
      </div>

      <style>{`
        .polar-globe-wrapper {
          position: relative;
          background: radial-gradient(ellipse at 35% 35%, #0a1b36 0%, #030a17 100%);
          border-radius: var(--radius-md, 12px);
          overflow: hidden;
          border: 1px solid rgba(56, 189, 248, 0.22);
          box-shadow: inset 0 0 80px rgba(0, 0, 0, 0.75), 0 12px 40px rgba(0, 0, 0, 0.55);
          cursor: grab;
          user-select: none;
          touch-action: none;
        }

        .polar-globe-wrapper:active {
          cursor: grabbing;
        }

        .polar-globe-wrapper.hovering-pin {
          cursor: pointer;
        }

        .polar-globe-wrapper.pg-fullscreen-active {
          position: fixed;
          inset: 0;
          z-index: 9999;
          border-radius: 0;
          width: 100vw;
          height: 100vh;
        }

        .pg-canvas {
          display: block;
          width: 100%;
          touch-action: none;
        }

        .pg-hud-top {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          right: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 10;
          pointer-events: none;
          gap: 0.5rem;
        }

        .pg-badge {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(15, 23, 42, 0.88);
          border: 1px solid rgba(56, 189, 248, 0.35);
          backdrop-filter: blur(10px);
          padding: 0.3rem 0.65rem;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #38bdf8;
          pointer-events: auto;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
        }

        .pg-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 6px #10b981;
          animation: pulseDot 2s infinite;
        }

        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }

        .pg-selected-pill {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(2, 132, 199, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(8px);
          padding: 0.28rem 0.6rem;
          border-radius: 999px;
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 700;
          pointer-events: auto;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }

        .pg-clear-btn {
          background: rgba(0, 0, 0, 0.25);
          border: none;
          color: #ffffff;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          cursor: pointer;
        }

        /* Ergonomic Floating Dock */
        .pg-floating-dock {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          background: rgba(15, 23, 42, 0.88);
          border: 1px solid rgba(56, 189, 248, 0.3);
          backdrop-filter: blur(12px);
          padding: 0.35rem;
          border-radius: 10px;
          z-index: 12;
          pointer-events: auto;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
        }

        .pg-dock-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
          touch-action: manipulation;
        }

        .pg-dock-btn:hover {
          background: rgba(56, 189, 248, 0.25);
          border-color: #38bdf8;
          color: #ffffff;
          transform: scale(1.05);
        }

        .pg-dock-btn:active {
          transform: scale(0.95);
          background: rgba(56, 189, 248, 0.4);
        }

        .pg-dock-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.15);
          margin: 0.15rem 0.2rem;
        }

        .pg-hud-bottom {
          position: absolute;
          bottom: 0.65rem;
          left: 0.75rem;
          right: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 10;
          pointer-events: none;
          font-size: 0.72rem;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .pg-coord-readout {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(15, 23, 42, 0.88);
          border: 1px solid rgba(56, 189, 248, 0.25);
          backdrop-filter: blur(8px);
          padding: 0.28rem 0.55rem;
          border-radius: 6px;
          color: #38bdf8;
          font-family: monospace;
          pointer-events: auto;
          font-size: 0.7rem;
        }

        .pg-coord-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #38bdf8;
        }

        .pg-scale-tag {
          color: #94a3b8;
          border-left: 1px solid rgba(255, 255, 255, 0.15);
          padding-left: 0.35rem;
        }

        .pg-hint-bar {
          background: rgba(7, 16, 30, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(8px);
          padding: 0.28rem 0.55rem;
          border-radius: 6px;
          color: #94a3b8;
          font-size: 0.68rem;
          font-weight: 500;
        }

        @media (max-width: 640px) {
          .pg-floating-dock {
            right: 0.5rem;
            padding: 0.25rem;
            gap: 0.25rem;
          }
          .pg-dock-btn {
            width: 34px;
            height: 34px;
          }
          .pg-hud-top {
            top: 0.5rem;
            left: 0.5rem;
            right: 0.5rem;
          }
          .pg-hud-bottom {
            bottom: 0.5rem;
            left: 0.5rem;
            right: 0.5rem;
          }
          .pg-hint-bar {
            display: none;
          }
          .pg-badge-label {
            font-size: 0.65rem;
          }
        }
      `}</style>
    </div>
  );
}

// ── Canvas Round-Rect Helper ────────────────────────────────────────────────
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

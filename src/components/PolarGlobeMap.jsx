import React, { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import * as d3geo from 'd3-geo';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { ZoomIn, ZoomOut, RotateCw, Crosshair } from 'lucide-react';

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
  layers = {
    showRoutes: true,
    showAurora: true,
    showSatellite: true,
    showSeaIce: true,
    showGraticule: true,
    autoRotate: false,
  },
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Smooth animation and physics refs
  const rotRef = useRef([-70, -10, 0]);      // [lambda, phi, gamma]
  const targetRef = useRef(null);            // tween target rotation
  const scaleRef = useRef(240);              // current zoom scale
  const targetScaleRef = useRef(null);       // tween target scale
  const velRef = useRef([0, 0]);             // drag inertia velocity
  const dragRef = useRef(null);              // active drag session
  const satRef = useRef({ angle: 0, lng: 15, lat: 60 });
  const pulseRef = useRef(0);                // radar pulse phase
  const hovRef = useRef(null);               // hovered station item
  const rafRef = useRef(null);
  const layersRef = useRef(layers);
  const selStRef = useRef(selectedStation);
  const stationsRef = useRef(stations);
  const projTypeRef = useRef(projectionType);

  // React UI state for HUD
  const [scaleState, setScaleState] = useState(240);
  const [rotState, setRotState] = useState([-70, -10, 0]);
  const [isHoveringPin, setIsHoveringPin] = useState(false);

  // Keep references fresh
  useEffect(() => { layersRef.current = layers; }, [layers]);
  useEffect(() => { selStRef.current = selectedStation; }, [selectedStation]);
  useEffect(() => { stationsRef.current = stations; }, [stations]);
  useEffect(() => { projTypeRef.current = projectionType; }, [projectionType]);

  // Preset Camera Angles
  const applyPreset = useCallback((preset) => {
    const map = {
      antarctica:       { rot: [-45, 75, 0], scale: 280 },
      arctic:           { rot: [-12, -78, 0], scale: 290 },
      himalaya:         { rot: [-77.6, -32.4, 0], scale: 330 },
      'southern-ocean': { rot: [-55, 45, 0], scale: 260 },
      all:              { rot: [-68, -12, 0], scale: 240 },
    };
    const p = map[preset] || map.all;
    targetRef.current = p.rot;
    targetScaleRef.current = p.scale;
  }, []);

  // Sync preset or selected station changes
  useEffect(() => {
    if (selectedStation?.lng != null && selectedStation?.lat != null) {
      targetRef.current = [-selectedStation.lng, -selectedStation.lat, 0];
      targetScaleRef.current = 300;
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
    const currentScale = scaleRef.current;
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
      const sat = satRef.current;
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

    // 9. Polar Research Stations Markers & Pins
    const currentStations = stationsRef.current;
    const selStationId = selStRef.current?.id;
    const hovStationId = hovRef.current?.id;

    currentStations.forEach((st) => {
      const facing = isCoordFacing(st.lng, st.lat, currentRot, pt);
      if (!facing) return; // Don't draw station if occluded behind globe

      const p2 = proj([st.lng, st.lat]);
      if (!p2) return;

      const isSel = st.id === selStationId;
      const isHov = st.id === hovStationId;
      const color = st.region === 'Antarctica' ? '#38bdf8'
                  : st.region === 'Arctic'     ? '#34d399'
                  : '#f59e0b';

      const dotRadius = isSel ? 6.5 : isHov ? 6 : 4.5;
      const pulseSize = isSel ? (14 + Math.sin(pulseRef.current * 4) * 5) : (isHov ? 13 : 9);

      // Radar Pulse Halo
      ctx.beginPath();
      ctx.arc(p2[0], p2[1], pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(color, isSel ? 0.35 : 0.2);
      ctx.fill();
      ctx.strokeStyle = hexToRgba(color, isSel ? 0.7 : 0.4);
      ctx.lineWidth = 1;
      ctx.stroke();

      // Solid Center Marker
      ctx.beginPath();
      ctx.arc(p2[0], p2[1], dotRadius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = isSel ? 2 : 1.5;
      ctx.stroke();

      // Label Tag Box
      const labelText = (st.name || '').replace(' Station', '').replace(' Underwater Observatory', '');
      ctx.font = `${isSel ? 'bold ' : '600 '}9.5px Inter, sans-serif`;
      const textMetrics = ctx.measureText(labelText);
      const tagW = textMetrics.width + 12;
      const tagH = 18;
      const tagX = p2[0] + 10;
      const tagY = p2[1] - 9;

      ctx.fillStyle = isSel ? 'rgba(7, 16, 30, 0.95)' : 'rgba(7, 16, 30, 0.85)';
      ctx.strokeStyle = isSel ? color : 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = isSel ? 1.5 : 0.8;
      roundRect(ctx, tagX, tagY, tagW, tagH, 4);
      ctx.fill();
      ctx.stroke();

      // Label text
      ctx.fillStyle = isSel ? '#ffffff' : color;
      ctx.textAlign = 'left';
      ctx.fillText(labelText, tagX + 6, tagY + 12.5);
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
      const dragging = !!dragRef.current;

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
      const h = Math.max(540, Math.round(w * 0.62));
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

  // ── Pointer & Mouse Drag Events ───────────────────────────────────────────
  const onPointerDown = useCallback((e) => {
    const canvas = canvasRef.current;
    canvas?.setPointerCapture?.(e.pointerId);
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
  }, []);

  const onPointerMove = useCallback((e) => {
    // ── Hover hit-test (always runs, no globe movement) ──────────────────────
    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    if (canvas && rect) {
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      const pt = projTypeRef.current;
      const proj = createProjection(pt, scaleRef.current, rotRef.current, W, H);

      let foundStation = null;
      for (const st of stationsRef.current) {
        if (!isCoordFacing(st.lng, st.lat, rotRef.current, pt)) continue;
        const sp = proj([st.lng, st.lat]);
        if (sp && Math.hypot(sp[0] - mx, sp[1] - my) < 18) {
          foundStation = st;
          break;
        }
      }

      hovRef.current = foundStation;
      setIsHoveringPin(!!foundStation);
    }

    // ── Drag rotation (only runs when pointer is held down) ─────────────────
    if (!dragRef.current) return;

    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    const sens = 0.32;

    // Per-frame delta for inertia velocity (not cumulative)
    const frameDx = e.clientX - dragRef.current.lastX;
    const frameDy = e.clientY - dragRef.current.lastY;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;

    rotRef.current[0] = dragRef.current.rot[0] + dx * sens;
    rotRef.current[1] = clamp(dragRef.current.rot[1] - dy * sens, -85, 85);

    // Inertia velocity based on per-frame delta
    velRef.current[0] = velRef.current[0] * 0.5 + frameDx * sens * 0.5;
    velRef.current[1] = velRef.current[1] * 0.5 + (-frameDy * sens) * 0.5;
  }, []);

  const onPointerUp = useCallback((e) => {
    if (!dragRef.current) return;
    const distMoved = Math.hypot(
      e.clientX - dragRef.current.startX,
      e.clientY - dragRef.current.startY
    );

    // If it was a click without major dragging
    if (distMoved < 6 && hovRef.current) {
      onSelectStation(hovRef.current);
    }

    velRef.current[0] *= 0.25;
    velRef.current[1] *= 0.25;
    dragRef.current = null;
  }, [onSelectStation]);

  // Mouse Wheel Zoom
  const onWheel = useCallback((e) => {
    e.preventDefault();
    scaleRef.current = clamp(scaleRef.current - e.deltaY * 0.45, 140, 650);
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
    scaleRef.current = clamp(scaleRef.current + 50, 140, 650);
    setScaleState(Math.round(scaleRef.current));
  };

  const handleZoomOut = () => {
    scaleRef.current = clamp(scaleRef.current - 50, 140, 650);
    setScaleState(Math.round(scaleRef.current));
  };

  const handleReset = () => {
    applyPreset('all');
    onSelectStation(null);
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
      className={`polar-globe-wrapper ${isHoveringPin ? 'hovering-pin' : ''}`}
    >
      {/* Top HUD Overlay Controls */}
      <div className="pg-hud-top">
        <div className="pg-badge">
          <span className="pg-live-dot" />
          <span>CRYOSPHERE GEOSPATIAL RADAR</span>
        </div>

        <div className="pg-ctrl-row">
          <button className="pg-btn" onClick={handleZoomIn} title="Zoom In">
            <ZoomIn size={14} />
          </button>
          <button className="pg-btn" onClick={handleZoomOut} title="Zoom Out">
            <ZoomOut size={14} />
          </button>
          <button className="pg-btn" onClick={handleReset} title="Reset View">
            <RotateCw size={14} />
            <span>Reset</span>
          </button>
        </div>
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
          <Crosshair size={12} className="pg-icon-cyan" />
          <span>CENTER: <strong>{coordDisplay.lng}°E, {coordDisplay.lat}°N</strong></span>
          <span className="pg-scale-tag">ZOOM: {scaleState}px</span>
        </div>
        <div className="pg-hint-bar">
          🖱️ Drag to rotate sphere · 📜 Scroll to zoom · 📍 Click pin to inspect
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
        }

        .polar-globe-wrapper:active {
          cursor: grabbing;
        }

        .polar-globe-wrapper.hovering-pin {
          cursor: pointer;
        }

        .pg-canvas {
          display: block;
          width: 100%;
        }

        .pg-hud-top {
          position: absolute;
          top: 0.85rem;
          left: 0.85rem;
          right: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 10;
          pointer-events: none;
        }

        .pg-badge {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(7, 16, 30, 0.88);
          border: 1px solid rgba(56, 189, 248, 0.3);
          backdrop-filter: blur(10px);
          padding: 0.35rem 0.8rem;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: #7dd3fc;
          pointer-events: auto;
        }

        .pg-live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 6px #34d399;
          animation: pgBlink 1.4s infinite;
        }

        @keyframes pgBlink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.85); }
        }

        .pg-ctrl-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          pointer-events: auto;
        }

        .pg-btn {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          background: rgba(7, 16, 30, 0.88);
          border: 1px solid rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(10px);
          color: #94a3b8;
          padding: 0.35rem 0.7rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .pg-btn:hover {
          color: #ffffff;
          border-color: #38bdf8;
          background: rgba(56, 189, 248, 0.18);
        }

        .pg-hud-bottom {
          position: absolute;
          bottom: 0.75rem;
          left: 0.85rem;
          right: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 10;
          pointer-events: none;
          font-size: 0.72rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .pg-coord-readout {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(7, 16, 30, 0.88);
          border: 1px solid rgba(56, 189, 248, 0.2);
          backdrop-filter: blur(8px);
          padding: 0.3rem 0.65rem;
          border-radius: 6px;
          color: #7dd3fc;
          font-family: monospace;
          pointer-events: auto;
        }

        .pg-icon-cyan {
          color: #38bdf8;
        }

        .pg-scale-tag {
          color: #64748b;
          border-left: 1px solid rgba(255, 255, 255, 0.15);
          padding-left: 0.4rem;
        }

        .pg-hint-bar {
          background: rgba(7, 16, 30, 0.88);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(8px);
          padding: 0.3rem 0.65rem;
          border-radius: 6px;
          color: #94a3b8;
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

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { ArrowUpRight, Box, Crosshair, Layers, Minus, Plus, RotateCcw, Route } from 'lucide-react';
import { CHAPTERS, SECTION_IDS } from '@data';
import bangladeshDivisions from '@data/bangladeshDivisions.json';
import { useShowcase, useTheme } from '@hooks';
import { gsap, MEDIA } from '@animations';
import { countByCategory, formatCoordinates, getImageSrc } from '@utils';
import { SmartImage } from '../ui/SmartImage.jsx';
import { JourneyBookmarkButton } from '../ui/JourneyBookmarkButton.jsx';

const SVG_W = 600;
const SVG_H = 740;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;

const LAT_LINES = [21, 22, 23, 24, 25, 26];
const LNG_LINES = [88, 89, 90, 91, 92, 93];

const LIGHT_MAP = {
  graticuleStroke: '#CBD5E1',
  graticuleText: '#94A3B8',
  landFill: '#FFFFFF',
  landFocusFill: '#F8FAFC',
  landHoverFill: '#E2E8F0',
  extrusionBase: '#94A3B8',
  extrusionMid: '#CBD5E1',
  outerStroke: '#94A3B8',
  innerStroke: '#CBD5E1',
  labelColor: '#94A3B8',
  labelHoverColor: '#334155',
  shadowColor: '#1E293B',
  shadowOpacity: 0.12,
  tooltipBg: '#1E293B',
  tooltipText: '#FFFFFF',
  arcTrail: 'rgba(15, 23, 42, 0.35)',
  pins: {
    Hills: '#059669',
    Sea: '#0284c7',
    Forest: '#4d7c0f',
    Heritage: '#d97706',
  },
};

const DARK_MAP = {
  graticuleStroke: 'rgba(148, 163, 184, 0.14)',
  graticuleText: '#64748B',
  landFill: '#1E293B',
  landFocusFill: '#243247',
  landHoverFill: '#2D3F59',
  extrusionBase: '#050811',
  extrusionMid: '#0F172A',
  outerStroke: '#475569',
  innerStroke: '#334155',
  labelColor: '#64748B',
  labelHoverColor: '#E2E8F0',
  shadowColor: '#000000',
  shadowOpacity: 0.62,
  tooltipBg: '#F8FAFC',
  tooltipText: '#0B111E',
  arcTrail: 'rgba(226, 232, 240, 0.35)',
  pins: {
    Hills: '#10b981',
    Sea: '#38bdf8',
    Forest: '#84cc16',
    Heritage: '#f59e0b',
  },
};

const chapterByCategory = Object.fromEntries(CHAPTERS.map((c) => [c.category, c]));

const projection = geoMercator().fitExtent(
  [
    [46, 46],
    [SVG_W - 46, SVG_H - 64],
  ],
  bangladeshDivisions
);

const pathGenerator = geoPath(projection);

const DIVISIONS = bangladeshDivisions.features.map((feature) => ({
  name: feature.properties.name,
  d: pathGenerator(feature),
  centroid: pathGenerator.centroid(feature),
}));

const GRATICULE_LAT = LAT_LINES.map((lat) => ({
  lat,
  y: projection([90, lat])[1],
}));

const GRATICULE_LNG = LNG_LINES.map((lng) => ({
  lng,
  x: projection([lng, 23.5])[0],
}));

const BAY_LABEL = projection([90.05, 21.05]);

function clampPan(nextPan, nextZoom) {
  if (nextZoom <= 1) return { x: 0, y: 0 };
  const maxX = ((nextZoom - 1) * SVG_W) / 2;
  const maxY = ((nextZoom - 1) * SVG_H) / 2;
  return {
    x: Math.max(-maxX, Math.min(maxX, nextPan.x)),
    y: Math.max(-maxY, Math.min(maxY, nextPan.y)),
  };
}

/** Computes a graceful elevated quadratic Bézier curve between two projected points. */
function computeFlightArc(fromPt, toPt) {
  const dx = toPt.px - fromPt.px;
  const dy = toPt.py - fromPt.py;
  const dist = Math.hypot(dx, dy);
  if (dist < 2) return null;

  const midX = (fromPt.px + toPt.px) / 2;
  const midY = (fromPt.py + toPt.py) / 2;
  const lift = Math.min(135, dist * 0.34 + 28);
  const cx = midX + (dy / dist) * (lift * 0.22);
  const cy = midY - lift;

  return {
    d: `M ${fromPt.px.toFixed(1)} ${fromPt.py.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${toPt.px.toFixed(1)} ${toPt.py.toFixed(1)}`,
    p0: { x: fromPt.px, y: fromPt.py },
    p1: { x: cx, y: cy },
    p2: { x: toPt.px, y: toPt.py },
  };
}

function getDefaultReliefMode() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(MEDIA.desktop).matches && !window.matchMedia(MEDIA.reduceMotion).matches;
}

/**
 * Interactive 2D / 3D-Elevated Coordinate Atlas of Bangladesh.
 * Features isometric relief toggle, extruded landmass slab, animated curved flight arcs
 * with traveling light comet, layered radar sonar pulses, and coordinate odometer preview.
 */
export function SpotAtlas() {
  const { spots, openSpot, journeySpots, journeyMetrics, routeMode, setRouteMode } = useShowcase();
  const { isDark } = useTheme();
  const [focusId, setFocusId] = useState(spots[0]?.id);
  const [prevFocusId, setPrevFocusId] = useState(null);
  const [flightKey, setFlightKey] = useState(0);
  const [category, setCategory] = useState(null);
  const [hoveredDivision, setHoveredDivision] = useState(null);
  const [is3D, setIs3D] = useState(getDefaultReliefMode);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const svgRef = useRef(null);
  const stageRef = useRef(null);
  const previewCardRef = useRef(null);
  const coordTextRef = useRef(null);
  const arcGlowRef = useRef(null);
  const arcActiveRef = useRef(null);
  const arcDottedRef = useRef(null);
  const cometRef = useRef(null);
  const journeyGroupRef = useRef(null);
  const journeyPulseRef = useRef(null);
  const dragRef = useRef(null);
  const prevCoordsRef = useRef(spots[0]?.coordinates ?? { lat: 23.685, lng: 90.3563 });
  const tiltQuickRef = useRef(null);
  const pinPointerFocusRef = useRef({ active: false, wasFocused: false });

  const mapTheme = isDark ? DARK_MAP : LIGHT_MAP;

  const focus = spots.find((s) => s.id === focusId) ?? spots[0];
  const counts = useMemo(() => countByCategory(spots), [spots]);

  const divisionCounts = useMemo(
    () =>
      spots.reduce((acc, s) => {
        acc[s.division] = (acc[s.division] || 0) + 1;
        return acc;
      }, {}),
    [spots]
  );

  const pointById = useMemo(() => {
    const map = {};
    spots.forEach((spot) => {
      const [px, py] = projection([spot.coordinates.lng, spot.coordinates.lat]);
      map[spot.id] = { spot, px, py };
    });
    return map;
  }, [spots]);

  const journeyOrderById = useMemo(() => {
    const map = new Map();
    journeySpots.forEach((spot, idx) => map.set(spot.id, idx + 1));
    return map;
  }, [journeySpots]);

  const journeyLegs = useMemo(() => {
    if (journeySpots.length < 2) return [];
    const legs = [];
    for (let i = 0; i < journeySpots.length - 1; i += 1) {
      const fromPt = pointById[journeySpots[i].id];
      const toPt = pointById[journeySpots[i + 1].id];
      if (!fromPt || !toPt) continue;
      const arc = computeFlightArc(fromPt, toPt);
      if (arc) legs.push({ ...arc, fromId: journeySpots[i].id, toId: journeySpots[i + 1].id });
    }
    return legs;
  }, [journeySpots, pointById]);

  const showJourneyRoute = routeMode && journeyLegs.length > 0;

  const projectedSpots = useMemo(() => {
    const items = spots.map((spot) => pointById[spot.id]);
    // Render journey stops & focused pin last so markers and badges stay cleanly on top.
    return items.sort((a, b) => {
      const aFocus = a.spot.id === focus?.id ? 2 : showJourneyRoute && journeyOrderById.has(a.spot.id) ? 1 : 0;
      const bFocus = b.spot.id === focus?.id ? 2 : showJourneyRoute && journeyOrderById.has(b.spot.id) ? 1 : 0;
      return aFocus - bFocus;
    });
  }, [spots, pointById, focus?.id, showJourneyRoute, journeyOrderById]);

  const flightArc = useMemo(() => {
    if (!prevFocusId || !focusId || prevFocusId === focusId) return null;
    const fromPt = pointById[prevFocusId];
    const toPt = pointById[focusId];
    if (!fromPt || !toPt) return null;
    return computeFlightArc(fromPt, toPt);
  }, [prevFocusId, focusId, pointById]);

  const selectSpot = useCallback((nextId) => {
    setFocusId((current) => {
      if (current === nextId) return current;
      setPrevFocusId(current);
      setFlightKey((k) => k + 1);
      return nextId;
    });
  }, []);

  // Animate 2D Flat ⇄ 3D Relief architectural tilt transition (perspective 1300px, rotateX 34deg, rotateZ -4deg)
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const reduce = window.matchMedia(MEDIA.reduceMotion).matches;
    tiltQuickRef.current = null;

    const ctx = gsap.context(() => {
      gsap.to(stage, {
        transformPerspective: 1300,
        rotationX: is3D ? 34 : 0,
        rotationY: 0,
        rotationZ: is3D ? -4 : 0,
        scale: is3D ? 0.94 : 1,
        y: is3D ? -6 : 0,
        duration: reduce ? 0 : 0.78,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    });

    return () => {
      tiltQuickRef.current = null;
      ctx.revert();
    };
  }, [is3D]);

  const ensureStageTilt = () => {
    if (tiltQuickRef.current) return tiltQuickRef.current;
    const stage = stageRef.current;
    if (!stage || !is3D) return null;
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia(MEDIA.reduceMotion).matches) {
      return null;
    }
    tiltQuickRef.current = {
      rx: gsap.quickTo(stage, 'rotationX', { duration: 0.45, ease: 'power3.out' }),
      ry: gsap.quickTo(stage, 'rotationY', { duration: 0.45, ease: 'power3.out' }),
    };
    return tiltQuickRef.current;
  };

  // Animate glowing curved flight-arc draw + traveling light comet between pins
  useLayoutEffect(() => {
    if (!flightArc) return undefined;
    const glowPath = arcGlowRef.current;
    const activePath = arcActiveRef.current;
    const dottedPath = arcDottedRef.current;
    const comet = cometRef.current;
    if (!activePath || !dottedPath || !comet) return undefined;

    const reduce = window.matchMedia(MEDIA.reduceMotion).matches;
    if (reduce) {
      if (glowPath) gsap.set(glowPath, { opacity: 0 });
      gsap.set(activePath, { opacity: 0 });
      gsap.set(dottedPath, { opacity: 0.78 });
      gsap.set(comet, { opacity: 0 });
      return undefined;
    }

    const ctx = gsap.context(() => {
      const length = typeof activePath.getTotalLength === 'function' ? activePath.getTotalLength() : 280;
      const { p0, p1, p2 } = flightArc;
      const progress = { t: 0 };

      if (glowPath) gsap.set(glowPath, { strokeDasharray: length, strokeDashoffset: length, opacity: 0.65 });
      gsap.set(activePath, { strokeDasharray: length, strokeDashoffset: length, opacity: 1 });
      gsap.set(dottedPath, { opacity: 0 });
      gsap.set(comet, { opacity: 1, attr: { transform: `translate(${p0.x}, ${p0.y})` } });

      const tl = gsap.timeline();
      tl.to(
        glowPath ? [glowPath, activePath] : activePath,
        {
          strokeDashoffset: 0,
          duration: 0.76,
          ease: 'power2.inOut',
        },
        0
      );
      tl.to(
        progress,
        {
          t: 1,
          duration: 0.76,
          ease: 'power2.inOut',
          onUpdate: () => {
            const t = progress.t;
            const omt = 1 - t;
            const x = omt * omt * p0.x + 2 * omt * t * p1.x + t * t * p2.x;
            const y = omt * omt * p0.y + 2 * omt * t * p1.y + t * t * p2.y;
            comet.setAttribute('transform', `translate(${x.toFixed(2)}, ${y.toFixed(2)})`);
          },
        },
        0
      );
      tl.to(dottedPath, { opacity: 0.78, duration: 0.35, ease: 'power2.out' }, 0.58);
      tl.to(glowPath ? [glowPath, activePath] : activePath, { opacity: 0, duration: 0.45, ease: 'power2.out' }, 0.68);
      tl.to(comet, { opacity: 0, duration: 0.32, ease: 'power2.out' }, 0.72);
    });

    return () => ctx.revert();
  }, [flightArc, flightKey]);

  // Animate multi-stop custom Journey curved Bézier routes + sequential glowing traveling pulse
  useLayoutEffect(() => {
    if (!showJourneyRoute || !journeyGroupRef.current) return undefined;

    const group = journeyGroupRef.current;
    const pulse = journeyPulseRef.current;
    const legNodes = [...group.querySelectorAll('[data-journey-leg]')];
    const glowNodes = [...group.querySelectorAll('[data-journey-leg-glow]')];
    const stopBadges = [...group.querySelectorAll('[data-journey-stop-pop]')];
    if (legNodes.length === 0) return undefined;

    const reduce = window.matchMedia(MEDIA.reduceMotion).matches;
    if (reduce) {
      legNodes.forEach((p) => gsap.set(p, { strokeDashoffset: 0, opacity: 1 }));
      glowNodes.forEach((p) => gsap.set(p, { opacity: 0.5 }));
      if (pulse) gsap.set(pulse, { opacity: 0 });
      return undefined;
    }

    let pulseIo = null;
    const ctx = gsap.context(() => {
      const drawTl = gsap.timeline();

      legNodes.forEach((pathEl, idx) => {
        const len = typeof pathEl.getTotalLength === 'function' ? pathEl.getTotalLength() : 280;
        const glowEl = glowNodes[idx];
        gsap.set(pathEl, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
        if (glowEl) gsap.set(glowEl, { strokeDasharray: len, strokeDashoffset: len, opacity: 0.55 });

        drawTl.to(
          glowEl ? [glowEl, pathEl] : pathEl,
          { strokeDashoffset: 0, duration: 0.52, ease: 'power2.inOut' },
          idx * 0.34
        );
      });

      if (stopBadges.length > 0) {
        drawTl.fromTo(
          stopBadges,
          { scale: 0.6, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(2)' },
          0.08
        );
      }

      if (pulse && journeyLegs.length > 0) {
        const pulseTl = gsap.timeline({ repeat: -1, repeatDelay: 0.35, delay: 0.25 });
        const { p0: firstP0 } = journeyLegs[0];
        gsap.set(pulse, { opacity: 0, attr: { transform: `translate(${firstP0.x}, ${firstP0.y})` } });
        pulseTl.to(pulse, { opacity: 1, duration: 0.16 });

        journeyLegs.forEach((leg) => {
          const proxy = { t: 0 };
          pulseTl.to(proxy, {
            t: 1,
            duration: 0.82,
            ease: 'power1.inOut',
            onUpdate: () => {
              const t = proxy.t;
              const omt = 1 - t;
              const x = omt * omt * leg.p0.x + 2 * omt * t * leg.p1.x + t * t * leg.p2.x;
              const y = omt * omt * leg.p0.y + 2 * omt * t * leg.p1.y + t * t * leg.p2.y;
              pulse.setAttribute('transform', `translate(${x.toFixed(2)}, ${y.toFixed(2)})`);
            },
          });
        });

        pulseTl.to(pulse, { opacity: 0, duration: 0.2 });

        if (svgRef.current) {
          pulseIo = new IntersectionObserver(
            (entries) => {
              if (entries[0]?.isIntersecting) pulseTl.play();
              else pulseTl.pause();
            },
            { threshold: 0.02 }
          );
          pulseIo.observe(svgRef.current);
        }
      }
    }, stageRef);

    return () => {
      pulseIo?.disconnect();
      ctx.revert();
    };
  }, [showJourneyRoute, journeyLegs]);

  // Animate left preview card with crisp 3D flip/slide transition + live rolling coordinate odometer
  useEffect(() => {
    if (!focus) return undefined;
    const reduce = window.matchMedia(MEDIA.reduceMotion).matches;
    const fromCoords = prevCoordsRef.current;
    const toCoords = focus.coordinates;
    prevCoordsRef.current = toCoords;

    if (reduce) {
      if (coordTextRef.current) coordTextRef.current.textContent = formatCoordinates(toCoords);
      return undefined;
    }

    const ctx = gsap.context(() => {
      if (previewCardRef.current) {
        gsap.fromTo(
          previewCardRef.current,
          { rotationX: -12, y: 18, scale: 0.97, opacity: 0.35, transformOrigin: '50% 0%' },
          {
            rotationX: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.48,
            ease: 'power3.out',
            overwrite: 'auto',
            clearProps: 'transform,opacity',
          }
        );
      }
      if (coordTextRef.current) {
        const ticker = { lat: fromCoords.lat, lng: fromCoords.lng };
        gsap.to(ticker, {
          lat: toCoords.lat,
          lng: toCoords.lng,
          duration: 0.52,
          ease: 'power2.out',
          overwrite: 'auto',
          onUpdate: () => {
            if (coordTextRef.current) {
              coordTextRef.current.textContent = formatCoordinates({ lat: ticker.lat, lng: ticker.lng });
            }
          },
        });
      }
    });

    return () => ctx.revert();
  }, [focus]);

  const zoomIn = () => {
    setZoom((prev) => {
      const next = Math.min(MAX_ZOOM, prev + ZOOM_STEP);
      setPan((p) => clampPan(p, next));
      return next;
    });
  };

  const zoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(MIN_ZOOM, prev - ZOOM_STEP);
      setPan((p) => clampPan(p, next));
      return next;
    });
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const onStageMove = (e) => {
    if (dragRef.current) {
      const drag = dragRef.current;
      const scaleX = SVG_W / Math.max(drag.rect.width, 1);
      const scaleY = SVG_H / Math.max(drag.rect.height, 1);
      const dx = (e.clientX - drag.startX) * scaleX;
      const dy = (e.clientY - drag.startY) * scaleY;
      setPan(clampPan({ x: drag.origPan.x + dx, y: drag.origPan.y + dy }, zoom));
      return;
    }

    if (is3D && zoom === 1 && stageRef.current && e.pointerType === 'mouse') {
      const tilt = ensureStageTilt();
      if (!tilt) return;
      const rect = stageRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
      const ny = (e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
      tilt.rx(34 - ny * 8);
      tilt.ry(nx * 9);
    }
  };

  const onStageLeave = () => {
    if (is3D && tiltQuickRef.current) {
      tiltQuickRef.current.rx(34);
      tiltQuickRef.current.ry(0);
    }
  };

  const onPointerDown = (e) => {
    if (zoom <= 1) return;
    if (e.target.closest?.('[data-map-pin]')) return;
    const svg = svgRef.current;
    if (!svg) return;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origPan: pan,
      rect: svg.getBoundingClientRect(),
    };
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerEnd = () => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setIsDragging(false);
  };

  const mapTransform = `translate(${SVG_W / 2 + pan.x}, ${SVG_H / 2 + pan.y}) scale(${zoom}) translate(${-SVG_W / 2}, ${-SVG_H / 2})`;
  const invScale = 1 / Math.sqrt(zoom);
  const focusColor = mapTheme.pins[focus?.category] ?? (isDark ? '#10b981' : '#059669');

  return (
    <section
      id={SECTION_IDS.atlas}
      aria-labelledby="atlas-title"
      className="relative z-0 mt-20 scroll-mt-24 overflow-x-clip px-3 sm:mt-28 sm:px-5"
    >
      <div className="mx-auto grid max-w-[1600px] gap-3 lg:grid-cols-[1fr_1.15fr] lg:gap-4">
        {/* Left info & live telemetry preview column */}
        <div className="flex min-w-0 flex-col rounded-4xl border border-line bg-card p-5 transition-colors duration-300 dark:border-white/10 dark:bg-[#131C2E] sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <p className="text-[11px] font-semibold tracking-[0.24em] text-mist uppercase">Interactive Map</p>

            <div className="flex flex-wrap items-center gap-2">
              {journeySpots.length >= 2 && (
                <button
                  type="button"
                  data-atlas-route-toggle
                  data-cursor="magnetic"
                  aria-pressed={showJourneyRoute}
                  onClick={() => setRouteMode((v) => !v)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold tabular-nums transition-colors duration-200 active:scale-95 ${
                    showJourneyRoute
                      ? 'border-emerald-500/60 bg-bd-green text-white shadow-[0_8px_20px_-8px_rgba(0,106,78,0.6)] dark:border-emerald-400/50 dark:bg-emerald-500 dark:text-[#081214]'
                      : 'border-line bg-canvas text-ink hover:border-haze dark:border-white/10 dark:bg-[#0B111E] dark:text-slate-200 dark:hover:border-white/25'
                  }`}
                >
                  <Route className="h-3 w-3" strokeWidth={2.2} />
                  <span>
                    Show My Route · {journeySpots.length} · {journeyMetrics.totalKm} km
                  </span>
                </button>
              )}

              {/* 2D Flat / 3D Relief architectural toggle */}
              <div
                role="group"
                aria-label="Map projection perspective"
                data-atlas-relief-toggle
                className="inline-flex rounded-full border border-line bg-canvas p-0.5 transition-colors duration-300 dark:border-white/10 dark:bg-[#0B111E]"
              >
              <button
                type="button"
                data-cursor="magnetic"
                aria-pressed={!is3D}
                onClick={() => setIs3D(false)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors duration-200 ${
                  !is3D
                    ? 'bg-ink text-white dark:bg-white dark:text-[#0B111E]'
                    : 'text-ink-soft hover:text-ink dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                <Layers className="h-3 w-3" strokeWidth={2.2} />
                2D Flat
              </button>
              <button
                type="button"
                data-cursor="magnetic"
                aria-pressed={is3D}
                onClick={() => setIs3D(true)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors duration-200 ${
                  is3D
                    ? 'bg-ink text-white dark:bg-white dark:text-[#0B111E]'
                    : 'text-ink-soft hover:text-ink dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                <Box className="h-3 w-3" strokeWidth={2.2} />
                3D Relief
              </button>
            </div>
            </div>
          </div>

          <h2
            id="atlas-title"
            className="mt-2 font-display leading-[0.9] font-black tracking-[-0.05em] text-ink transition-colors duration-300 dark:text-slate-50"
            style={{ fontSize: 'clamp(2rem, 5vw, 4.75rem)' }}
          >
            Coordinate Atlas
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft transition-colors duration-300 dark:text-slate-400">
            Every destination plotted by its verified GPS coordinates. Select any pin to trace a flight arc across
            Bangladesh&apos;s eight divisions and open its travel story.
          </p>

          <div className="mt-6 flex flex-wrap gap-1.5" role="group" aria-label="Highlight a landscape">
            {CHAPTERS.map((chapter) => {
              const on = category === chapter.category;
              return (
                <button
                  key={chapter.id}
                  type="button"
                  data-cursor="magnetic"
                  aria-pressed={on}
                  onClick={() => setCategory(on ? null : chapter.category)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-colors duration-200 active:scale-95 ${
                    on
                      ? 'border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-[#0B111E]'
                      : 'border-line bg-white text-ink hover:border-haze dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200 dark:hover:border-white/25'
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${chapter.dotClass}`} aria-hidden="true" />
                  {chapter.title}
                  <span className={on ? 'text-white/60 dark:text-[#0B111E]/60' : 'text-mist'}>
                    {counts[chapter.category] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>

          {focus && (
            <div className="mt-6 [perspective:1000px] lg:mt-auto">
              <div
                ref={previewCardRef}
                data-atlas-preview
                className="overflow-hidden rounded-3xl border border-line bg-canvas transition-colors duration-300 will-change-transform dark:border-white/10 dark:bg-[#0B111E]/75"
              >
                <SmartImage
                  src={getImageSrc(focus.images.cover, 'card')}
                  fallbackSrc={focus.images.cover}
                  alt={focus.name}
                  className="h-44 w-full sm:h-56"
                  imgClassName="h-full w-full object-cover"
                />
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:p-5">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold tracking-[0.18em] text-mist uppercase">
                      {chapterByCategory[focus.category]?.number} · {focus.category} · {focus.division}
                    </p>
                    <p className="mt-1 truncate font-display text-xl font-bold text-ink dark:text-slate-50 sm:text-2xl">
                      {focus.name}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 font-mono text-xs text-ink-soft tabular-nums dark:text-slate-400">
                      <Crosshair className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                      <span ref={coordTextRef} className="truncate">
                        {formatCoordinates(focus.coordinates)}
                      </span>
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center justify-between gap-2 sm:justify-end">
                    <JourneyBookmarkButton spotId={focus.id} spotName={focus.name} />
                    <button
                      type="button"
                      data-cursor="magnetic"
                      onClick={() => openSpot(focus.id)}
                      className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white transition-colors duration-300 hover:bg-ink-soft active:scale-95 dark:bg-white dark:text-[#0B111E] dark:hover:bg-slate-200"
                    >
                      Open
                      <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right interactive 2D / 3D Relief map canvas */}
        <div className="relative min-w-0 overflow-hidden rounded-4xl border border-line bg-[#eef2f6] p-3 transition-colors duration-300 dark:border-white/10 dark:bg-[#080D17] sm:p-5">
          {/* Non-overlapping top floating bar: division badge + zoom controls (z-20, strictly below Navbar z-50) */}
          <div className="pointer-events-none absolute inset-x-3 top-3 z-20 flex items-center justify-between gap-2 sm:inset-x-5 sm:top-5">
            <div className="glass flex min-w-0 items-center gap-2 rounded-full border border-white/70 px-2.5 py-1.5 text-[11px] font-semibold text-ink shadow-sm transition-colors duration-300 dark:border-white/10 dark:text-slate-100 sm:px-3.5 sm:text-xs">
              <span className="h-2 w-2 shrink-0 rounded-full bg-bd-green dark:bg-emerald-400" aria-hidden="true" />
              {hoveredDivision ? (
                <span className="truncate">
                  {hoveredDivision} Division · {divisionCounts[hoveredDivision] ?? 0}{' '}
                  {divisionCounts[hoveredDivision] === 1 ? 'spot' : 'spots'}
                </span>
              ) : (
                <span className="truncate">Bangladesh · 8 Divisions</span>
              )}
            </div>

            <div
              data-map-control
              role="group"
              aria-label="Map zoom controls"
              className="glass pointer-events-auto flex shrink-0 items-center gap-0.5 rounded-full border border-white/70 p-1 shadow-sm transition-colors duration-300 dark:border-white/10 sm:gap-1"
            >
              <button
                type="button"
                data-cursor="magnetic"
                onClick={zoomIn}
                disabled={zoom >= MAX_ZOOM}
                aria-label="Zoom in"
                className="flex h-7 w-7 items-center justify-center rounded-full text-ink transition-colors hover:bg-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 dark:text-slate-100 dark:hover:bg-white/10 sm:h-8 sm:w-8"
              >
                <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.2} />
              </button>
              <button
                type="button"
                data-cursor="magnetic"
                onClick={zoomOut}
                disabled={zoom <= MIN_ZOOM}
                aria-label="Zoom out"
                className="flex h-7 w-7 items-center justify-center rounded-full text-ink transition-colors hover:bg-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 dark:text-slate-100 dark:hover:bg-white/10 sm:h-8 sm:w-8"
              >
                <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.2} />
              </button>
              {zoom > 1 && (
                <span className="px-1 text-[10px] font-bold text-ink-soft tabular-nums dark:text-slate-300 sm:px-1.5 sm:text-[11px]">
                  {zoom.toFixed(1)}×
                </span>
              )}
              <button
                type="button"
                data-cursor="magnetic"
                onClick={resetView}
                disabled={zoom === 1 && pan.x === 0 && pan.y === 0}
                aria-label="Reset map zoom"
                className="flex h-7 w-7 items-center justify-center rounded-full text-ink transition-colors hover:bg-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 dark:text-slate-100 dark:hover:bg-white/10 sm:h-8 sm:w-8"
              >
                <RotateCcw className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={2.2} />
              </button>
            </div>
          </div>

          <div
            onPointerDown={onPointerDown}
            onPointerMove={onStageMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
            onPointerLeave={onStageLeave}
            className={`relative mx-auto aspect-[600/740] w-full max-w-[640px] select-none [perspective:1300px] ${
              zoom > 1 ? (isDragging ? 'cursor-grabbing touch-none' : 'cursor-grab touch-none') : ''
            }`}
          >
            <div ref={stageRef} data-atlas-stage className="h-full w-full will-change-transform">
              <svg
                ref={svgRef}
                viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                role="img"
                aria-label="Interactive vector map of Bangladesh showing 8 divisions and 24 tourist destinations"
                className="h-full w-full overflow-visible"
              >
                <defs>
                  <filter id="bd-land-shadow" x="-15%" y="-15%" width="130%" height="135%">
                    <feDropShadow
                      dx={is3D ? '4' : '0'}
                      dy={is3D ? '16' : '6'}
                      stdDeviation={is3D ? '14' : '8'}
                      floodColor={mapTheme.shadowColor}
                      floodOpacity={is3D ? Math.min(0.75, mapTheme.shadowOpacity + 0.14) : mapTheme.shadowOpacity}
                    />
                  </filter>
                  <filter id="bd-pin-glow" x="-120%" y="-120%" width="340%" height="340%">
                    <feGaussianBlur stdDeviation="3.5" />
                  </filter>
                </defs>

                <g transform={mapTransform}>
                  {/* 1. Latitude / Longitude Graticule */}
                  <g aria-hidden="true">
                    {GRATICULE_LAT.map(({ lat, y }) => (
                      <g key={lat}>
                        <line
                          x1={0}
                          y1={y}
                          x2={SVG_W}
                          y2={y}
                          stroke={mapTheme.graticuleStroke}
                          strokeWidth={1}
                          strokeDasharray="4 4"
                          vectorEffect="non-scaling-stroke"
                        />
                        <text
                          x={6}
                          y={y - 5}
                          fill={mapTheme.graticuleText}
                          fontSize={10 * invScale}
                          fontWeight={600}
                          className="tabular-nums"
                        >
                          {lat}°N
                        </text>
                      </g>
                    ))}
                    {GRATICULE_LNG.map(({ lng, x }) => (
                      <g key={lng}>
                        <line
                          x1={x}
                          y1={0}
                          x2={x}
                          y2={SVG_H}
                          stroke={mapTheme.graticuleStroke}
                          strokeWidth={1}
                          strokeDasharray="4 4"
                          vectorEffect="non-scaling-stroke"
                        />
                        <text
                          x={x + 4}
                          y={SVG_H - 10}
                          fill={mapTheme.graticuleText}
                          fontSize={10 * invScale}
                          fontWeight={600}
                          className="tabular-nums"
                        >
                          {lng}°E
                        </text>
                      </g>
                    ))}
                  </g>

                  {/* 2. Ocean label */}
                  <text
                    x={BAY_LABEL[0]}
                    y={BAY_LABEL[1]}
                    textAnchor="middle"
                    fill={mapTheme.graticuleText}
                    opacity={isDark ? 0.65 : 0.75}
                    fontSize={11 * invScale}
                    fontWeight={600}
                    letterSpacing="0.28em"
                  >
                    BAY OF BENGAL
                  </text>

                  {/* 3. Multi-step 3D Relief Extruded Slab Layers beneath landmass */}
                  {is3D && (
                    <g pointerEvents="none" aria-hidden="true">
                      <g transform="translate(4, 16)" opacity={isDark ? 0.62 : 0.32}>
                        {DIVISIONS.map((div) => (
                          <path key={`slab-4-${div.name}`} d={div.d} fill={mapTheme.extrusionBase} />
                        ))}
                      </g>
                      <g transform="translate(3, 12)" opacity={isDark ? 0.78 : 0.48}>
                        {DIVISIONS.map((div) => (
                          <path key={`slab-3-${div.name}`} d={div.d} fill={mapTheme.extrusionBase} />
                        ))}
                      </g>
                      <g transform="translate(2, 8)" opacity={isDark ? 0.88 : 0.66}>
                        {DIVISIONS.map((div) => (
                          <path key={`slab-2-${div.name}`} d={div.d} fill={mapTheme.extrusionMid} />
                        ))}
                      </g>
                      <g transform="translate(1, 4)" opacity={isDark ? 0.94 : 0.82}>
                        {DIVISIONS.map((div) => (
                          <path key={`slab-1-${div.name}`} d={div.d} fill={mapTheme.outerStroke} />
                        ))}
                      </g>
                    </g>
                  )}

                  {/* 4. Outer National Silhouette & Soft Shadow */}
                  <g filter="url(#bd-land-shadow)" pointerEvents="none">
                    {DIVISIONS.map((div) => (
                      <path
                        key={`outer-${div.name}`}
                        d={div.d}
                        fill={mapTheme.landFill}
                        stroke={mapTheme.outerStroke}
                        strokeWidth={2.8}
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    ))}
                  </g>

                  {/* 5. Interactive 8-Division Fills & Crisp Internal Borders */}
                  <g>
                    {DIVISIONS.map((div) => {
                      const isHovered = hoveredDivision === div.name;
                      const isFocusDiv = focus?.division === div.name;
                      const fill = isHovered
                        ? mapTheme.landHoverFill
                        : isFocusDiv
                          ? mapTheme.landFocusFill
                          : mapTheme.landFill;
                      return (
                        <path
                          key={div.name}
                          data-division-path={div.name}
                          d={div.d}
                          fill={fill}
                          stroke={isHovered ? focusColor : mapTheme.innerStroke}
                          strokeOpacity={isHovered ? 0.65 : 1}
                          strokeWidth={isHovered ? 1.5 : 1}
                          strokeLinejoin="round"
                          vectorEffect="non-scaling-stroke"
                          onPointerEnter={(e) => {
                            if (e.pointerType === 'mouse') setHoveredDivision(div.name);
                          }}
                          onPointerLeave={() => setHoveredDivision((prev) => (prev === div.name ? null : prev))}
                          className="transition-colors duration-200"
                        />
                      );
                    })}
                  </g>

                  {/* 6. Subtle Division Micro-Labels */}
                  <g pointerEvents="none">
                    {DIVISIONS.map((div) => {
                      const [cx, cy] = div.centroid;
                      const isHovered = hoveredDivision === div.name;
                      const lx = div.name === 'Chattogram' ? cx + 12 : cx;
                      const ly = div.name === 'Chattogram' ? cy - 22 : cy;
                      return (
                        <text
                          key={`label-${div.name}`}
                          x={lx}
                          y={ly}
                          textAnchor="middle"
                          fill={isHovered ? mapTheme.labelHoverColor : mapTheme.labelColor}
                          fontSize={8.5 * invScale}
                          fontWeight={700}
                          letterSpacing="0.16em"
                          className="uppercase transition-colors duration-200"
                        >
                          {div.name}
                        </text>
                      );
                    })}
                  </g>

                  {/* 7. Glowing Curved Flight-Arc & Traveling Light Comet */}
                  {!showJourneyRoute && flightArc && (
                    <g data-flight-arc pointerEvents="none" aria-hidden="true">
                      {/* Soft persistent dotted trajectory after comet arrives */}
                      <path
                        ref={arcDottedRef}
                        d={flightArc.d}
                        fill="none"
                        stroke={mapTheme.arcTrail}
                        strokeWidth={1.6 * invScale}
                        strokeDasharray={`${4 * invScale} ${5 * invScale}`}
                        strokeLinecap="round"
                        opacity={0}
                      />
                      {/* Luminous atmospheric glow halo under active flight arc */}
                      <path
                        ref={arcGlowRef}
                        d={flightArc.d}
                        fill="none"
                        stroke={focusColor}
                        strokeWidth={5.5 * invScale}
                        strokeLinecap="round"
                        filter="url(#bd-pin-glow)"
                        opacity={0}
                      />
                      {/* Crisp active animated draw stroke */}
                      <path
                        ref={arcActiveRef}
                        d={flightArc.d}
                        fill="none"
                        stroke={isDark ? '#FFFFFF' : focusColor}
                        strokeWidth={2.4 * invScale}
                        strokeLinecap="round"
                        opacity={0}
                      />
                      {/* Glowing traveling comet head */}
                      <g ref={cometRef} opacity={0}>
                        <circle
                          r={10 * invScale}
                          fill={focusColor}
                          opacity={0.68}
                          filter="url(#bd-pin-glow)"
                        />
                        <circle
                          r={4.2 * invScale}
                          fill="#FFFFFF"
                          stroke={focusColor}
                          strokeWidth={1.8 * invScale}
                        />
                      </g>
                    </g>
                  )}

                  {/* 7B. Multi-Stop Custom Journey Route (Stop 1 -> Stop 2 -> Stop 3...) */}
                  {showJourneyRoute && (
                    <g ref={journeyGroupRef} data-journey-route pointerEvents="none" aria-hidden="true">
                      {journeyLegs.map((leg, idx) => (
                        <g key={`${leg.fromId}-${leg.toId}-${idx}`}>
                          <path
                            data-journey-leg-glow={idx}
                            d={leg.d}
                            fill="none"
                            stroke={isDark ? '#34d399' : '#006a4e'}
                            strokeWidth={6 * invScale}
                            strokeLinecap="round"
                            filter="url(#bd-pin-glow)"
                            opacity={0.55}
                          />
                          <path
                            data-journey-leg={idx}
                            d={leg.d}
                            fill="none"
                            stroke={isDark ? '#34d399' : '#006a4e'}
                            strokeWidth={2.6 * invScale}
                            strokeLinecap="round"
                          />
                        </g>
                      ))}

                      {/* Sequential glowing traveling light pulse along the multi-stop path */}
                      <g ref={journeyPulseRef} data-journey-pulse opacity={0}>
                        <circle
                          r={11 * invScale}
                          fill={isDark ? '#34d399' : '#10b981'}
                          opacity={0.65}
                          filter="url(#bd-pin-glow)"
                        />
                        <circle
                          r={4.5 * invScale}
                          fill="#FFFFFF"
                          stroke={isDark ? '#10b981' : '#006a4e'}
                          strokeWidth={1.8 * invScale}
                        />
                      </g>
                    </g>
                  )}

                  {/* 8. 24 Color-Coded GPS Pins with Layered Sonar Radar Rings & Numbered Stop Badges */}
                  <g>
                    {projectedSpots.map(({ spot, px, py }) => {
                      const stopNumber = journeyOrderById.get(spot.id);
                      const isRouteStop = Boolean(showJourneyRoute && stopNumber);
                      const isFocus = spot.id === focus?.id;
                      const dimmed = showJourneyRoute
                        ? !isRouteStop
                        : Boolean(category && spot.category !== category);
                      const color = isRouteStop
                        ? isDark
                          ? '#10b981'
                          : '#006a4e'
                        : mapTheme.pins[spot.category] ?? '#1E293B';
                      const dotRadius = (isRouteStop ? 8.5 : isFocus ? 7.5 : 4.8) * invScale;
                      const strokeW = 2.2 * invScale;

                      const flipBelow = py < 70;
                      const tipW = Math.min(220, Math.max(88, spot.name.length * 7.2 + 22));
                      const tipH = 26;
                      const tipY = flipBelow ? 14 : -(tipH + 16);
                      const scaledW = tipW * invScale;
                      let tipX = -tipW / 2;
                      if (px - scaledW / 2 < 18) tipX = (18 - px) / invScale;
                      else if (px + scaledW / 2 > SVG_W - 28) tipX = (SVG_W - 28 - scaledW - px) / invScale;

                      return (
                        <g
                          key={spot.id}
                          data-map-pin={spot.id}
                          data-cursor="fly"
                          transform={`translate(${px}, ${py})`}
                          role="button"
                          tabIndex={0}
                          aria-label={stopNumber ? `Stop ${stopNumber}: ${spot.name}, ${spot.district}` : `${spot.name}, ${spot.district}`}
                          onPointerDown={() => {
                            pinPointerFocusRef.current = { active: true, wasFocused: isFocus };
                          }}
                          onPointerEnter={(e) => {
                            if (e.pointerType === 'mouse') selectSpot(spot.id);
                          }}
                          onFocus={() => {
                            if (!pinPointerFocusRef.current.active) selectSpot(spot.id);
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            const openModal = pinPointerFocusRef.current.active
                              ? pinPointerFocusRef.current.wasFocused
                              : isFocus;
                            pinPointerFocusRef.current.active = false;
                            if (openModal) openSpot(spot.id);
                            else selectSpot(spot.id);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              if (isFocus) openSpot(spot.id);
                              else selectSpot(spot.id);
                            }
                          }}
                          opacity={dimmed ? 0.34 : 1}
                          className="cursor-pointer transition-opacity duration-200 focus:outline-none"
                        >
                          <circle r={13 / zoom} fill="transparent" />

                          {isDark && !dimmed && (
                            <circle
                              r={dotRadius * 2.1}
                              fill={color}
                              opacity={isFocus || isRouteStop ? 0.55 : 0.35}
                              filter="url(#bd-pin-glow)"
                            />
                          )}

                          {/* Multi-ring staggered expanding sonar radar ripples around active pin */}
                          {(isFocus || isRouteStop) && (
                            <g data-sonar-rings pointerEvents="none">
                              <circle
                                r={11 * invScale}
                                fill="none"
                                stroke={color}
                                strokeWidth={1.8 * invScale}
                                className="atlas-sonar-ring"
                              />
                              <circle
                                r={11 * invScale}
                                fill="none"
                                stroke={color}
                                strokeWidth={1.4 * invScale}
                                className="atlas-sonar-ring-delayed"
                              />
                              {isFocus && (
                                <circle
                                  r={11 * invScale}
                                  fill="none"
                                  stroke={color}
                                  strokeWidth={1.1 * invScale}
                                  className="atlas-sonar-ring-third"
                                />
                              )}
                            </g>
                          )}

                          <circle
                            r={dotRadius}
                            fill={color}
                            stroke={isDark ? '#0B111E' : '#FFFFFF'}
                            strokeWidth={strokeW}
                          />

                          {/* Numbered Journey Stop Badge (1, 2, 3...) */}
                          {isRouteStop && (
                            <g
                              data-journey-stop-badge={stopNumber}
                              data-journey-stop-pop
                              transform={`scale(${invScale})`}
                              pointerEvents="none"
                            >
                              <circle
                                cx={10}
                                cy={-10}
                                r={8.5}
                                fill={isDark ? '#F8FAFC' : '#0B111E'}
                                stroke={color}
                                strokeWidth={1.6}
                              />
                              <text
                                x={10}
                                y={-6.5}
                                textAnchor="middle"
                                fill={isDark ? '#0B111E' : '#FFFFFF'}
                                fontSize={10}
                                fontWeight={800}
                              >
                                {stopNumber}
                              </text>
                            </g>
                          )}

                          {isFocus && (
                            <g transform={`scale(${invScale})`} pointerEvents="none">
                              <rect
                                x={tipX}
                                y={tipY}
                                width={tipW}
                                height={tipH}
                                rx={tipH / 2}
                                fill={mapTheme.tooltipBg}
                              />
                              <text
                                x={tipX + tipW / 2}
                                y={tipY + tipH / 2 + 4}
                                textAnchor="middle"
                                fill={mapTheme.tooltipText}
                                fontSize={11}
                                fontWeight={600}
                              >
                                {spot.name}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useMemo, useRef, useState } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { ArrowUpRight, Crosshair, Minus, Plus, RotateCcw } from 'lucide-react';
import { CHAPTERS, SECTION_IDS } from '@data';
import bangladeshDivisions from '@data/bangladeshDivisions.json';
import { useShowcase, useTheme } from '@hooks';
import { countByCategory, formatCoordinates, getImageSrc } from '@utils';
import { SmartImage } from '../ui/SmartImage.jsx';

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
  outerStroke: '#94A3B8',
  innerStroke: '#CBD5E1',
  labelColor: '#94A3B8',
  labelHoverColor: '#334155',
  shadowColor: '#1E293B',
  shadowOpacity: 0.09,
  tooltipBg: '#1E293B',
  tooltipText: '#FFFFFF',
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
  outerStroke: '#475569',
  innerStroke: '#334155',
  labelColor: '#64748B',
  labelHoverColor: '#E2E8F0',
  shadowColor: '#000000',
  shadowOpacity: 0.55,
  tooltipBg: '#F8FAFC',
  tooltipText: '#0B111E',
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

/** Interactive coordinate atlas: Bangladesh 8-division vector map aligned with all 24 GPS pins. */
export function SpotAtlas() {
  const { spots, openSpot } = useShowcase();
  const { isDark } = useTheme();
  const [focusId, setFocusId] = useState(spots[0]?.id);
  const [category, setCategory] = useState(null);
  const [hoveredDivision, setHoveredDivision] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const svgRef = useRef(null);
  const dragRef = useRef(null);

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

  const projectedSpots = useMemo(() => {
    const items = spots.map((spot) => {
      const [px, py] = projection([spot.coordinates.lng, spot.coordinates.lat]);
      return { spot, px, py };
    });
    // Render focused pin last so its marker and tooltip stay on top.
    return items.sort((a, b) => (a.spot.id === focus?.id ? 1 : b.spot.id === focus?.id ? -1 : 0));
  }, [spots, focus?.id]);

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

  const onPointerMove = (e) => {
    const drag = dragRef.current;
    if (!drag) return;
    const scaleX = SVG_W / Math.max(drag.rect.width, 1);
    const scaleY = SVG_H / Math.max(drag.rect.height, 1);
    const dx = (e.clientX - drag.startX) * scaleX;
    const dy = (e.clientY - drag.startY) * scaleY;
    setPan(clampPan({ x: drag.origPan.x + dx, y: drag.origPan.y + dy }, zoom));
  };

  const onPointerEnd = () => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setIsDragging(false);
  };

  const mapTransform = `translate(${SVG_W / 2 + pan.x}, ${SVG_H / 2 + pan.y}) scale(${zoom}) translate(${-SVG_W / 2}, ${-SVG_H / 2})`;
  const invScale = 1 / Math.sqrt(zoom);

  return (
    <section id={SECTION_IDS.atlas} aria-labelledby="atlas-title" className="mt-24 scroll-mt-24 px-3 sm:mt-32 sm:px-5">
      <div className="mx-auto grid max-w-[1600px] gap-3 lg:grid-cols-[1fr_1.15fr] lg:gap-4">
        <div className="flex flex-col rounded-4xl border border-line bg-card p-5 transition-colors duration-300 dark:border-white/10 dark:bg-[#131C2E] sm:p-8 lg:p-10">
          <p className="text-[11px] font-semibold tracking-[0.24em] text-mist uppercase">Interactive Map</p>
          <h2
            id="atlas-title"
            className="mt-2 font-display leading-[0.9] font-black tracking-[-0.05em] text-ink transition-colors duration-300 dark:text-slate-50"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 4.75rem)' }}
          >
            Coordinate Atlas
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft transition-colors duration-300 dark:text-slate-400">
            Every destination plotted by its verified GPS coordinates. Hover or tap a point to preview, then open the full
            travel story.
          </p>

          <div className="mt-6 flex flex-wrap gap-1.5" role="group" aria-label="Highlight a landscape">
            {CHAPTERS.map((chapter) => {
              const on = category === chapter.category;
              return (
                <button
                  key={chapter.id}
                  type="button"
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
            <div className="mt-6 overflow-hidden rounded-3xl border border-line bg-canvas transition-colors duration-300 dark:border-white/10 dark:bg-[#0B111E]/75 lg:mt-auto">
              <SmartImage
                src={getImageSrc(focus.images.cover, 'card')}
                fallbackSrc={focus.images.cover}
                alt={focus.name}
                className="h-44 w-full sm:h-56"
                imgClassName="h-full w-full object-cover"
              />
              <div className="flex items-end justify-between gap-4 p-4 sm:p-5">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold tracking-[0.18em] text-mist uppercase">
                    {chapterByCategory[focus.category]?.number} · {focus.category} · {focus.division}
                  </p>
                  <p className="mt-1 truncate font-display text-xl font-bold text-ink dark:text-slate-50 sm:text-2xl">
                    {focus.name}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-soft tabular-nums dark:text-slate-400">
                    <Crosshair className="h-3.5 w-3.5" strokeWidth={2} />
                    {formatCoordinates(focus.coordinates)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openSpot(focus.id)}
                  className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white transition-colors duration-300 hover:bg-ink-soft active:scale-95 dark:bg-white dark:text-[#0B111E] dark:hover:bg-slate-200"
                >
                  Open
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative overflow-hidden rounded-4xl border border-line bg-[#eef2f6] p-3 transition-colors duration-300 dark:border-white/10 dark:bg-[#080D17] sm:p-5">
          {/* Top-left floating division indicator */}
          <div className="glass pointer-events-none absolute top-4 left-4 z-30 flex items-center gap-2 rounded-full border border-white/70 px-3.5 py-1.5 text-xs font-semibold text-ink shadow-sm transition-colors duration-300 dark:border-white/10 dark:text-slate-100 sm:top-6 sm:left-6">
            <span className="h-2 w-2 rounded-full bg-bd-green dark:bg-emerald-400" aria-hidden="true" />
            {hoveredDivision ? (
              <span>
                {hoveredDivision} Division · {divisionCounts[hoveredDivision] ?? 0}{' '}
                {divisionCounts[hoveredDivision] === 1 ? 'spot' : 'spots'}
              </span>
            ) : (
              <span>Bangladesh · 8 Divisions</span>
            )}
          </div>

          {/* Top-right floating zoom controls */}
          <div
            data-map-control
            role="group"
            aria-label="Map zoom controls"
            className="glass absolute top-4 right-4 z-30 flex items-center gap-1 rounded-full border border-white/70 p-1 shadow-sm transition-colors duration-300 dark:border-white/10 sm:top-6 sm:right-6"
          >
            <button
              type="button"
              onClick={zoomIn}
              disabled={zoom >= MAX_ZOOM}
              aria-label="Zoom in"
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink transition-colors hover:bg-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 dark:text-slate-100 dark:hover:bg-white/10"
            >
              <Plus className="h-4 w-4" strokeWidth={2.2} />
            </button>
            <button
              type="button"
              onClick={zoomOut}
              disabled={zoom <= MIN_ZOOM}
              aria-label="Zoom out"
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink transition-colors hover:bg-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 dark:text-slate-100 dark:hover:bg-white/10"
            >
              <Minus className="h-4 w-4" strokeWidth={2.2} />
            </button>
            {zoom > 1 && (
              <span className="px-1.5 text-[11px] font-bold text-ink-soft tabular-nums dark:text-slate-300">
                {zoom.toFixed(1)}×
              </span>
            )}
            <button
              type="button"
              onClick={resetView}
              disabled={zoom === 1 && pan.x === 0 && pan.y === 0}
              aria-label="Reset map zoom"
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink transition-colors hover:bg-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 dark:text-slate-100 dark:hover:bg-white/10"
            >
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.2} />
            </button>
          </div>

          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
            className={`relative mx-auto aspect-[600/740] w-full max-w-[640px] select-none ${
              zoom > 1 ? (isDragging ? 'cursor-grabbing touch-none' : 'cursor-grab touch-none') : ''
            }`}
          >
            <svg
              ref={svgRef}
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              role="img"
              aria-label="Interactive vector map of Bangladesh showing 8 divisions and 24 tourist destinations"
              className="h-full w-full overflow-visible"
            >
              <defs>
                <filter id="bd-land-shadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow
                    dx="0"
                    dy="6"
                    stdDeviation="8"
                    floodColor={mapTheme.shadowColor}
                    floodOpacity={mapTheme.shadowOpacity}
                  />
                </filter>
                <filter id="bd-pin-glow" x="-100%" y="-100%" width="300%" height="300%">
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

                {/* 3. Outer National Silhouette & Soft Shadow */}
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

                {/* 4. Interactive 8-Division Fills & Crisp Internal Borders */}
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
                        stroke={mapTheme.innerStroke}
                        strokeWidth={1}
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                        onMouseEnter={() => setHoveredDivision(div.name)}
                        onMouseLeave={() => setHoveredDivision((prev) => (prev === div.name ? null : prev))}
                        className="transition-colors duration-200"
                      />
                    );
                  })}
                </g>

                {/* 5. Subtle Division Micro-Labels */}
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

                {/* 6. 24 Color-Coded GPS Pins */}
                <g>
                  {projectedSpots.map(({ spot, px, py }) => {
                    const isFocus = spot.id === focus?.id;
                    const dimmed = Boolean(category && spot.category !== category);
                    const color = mapTheme.pins[spot.category] ?? '#1E293B';
                    const dotRadius = (isFocus ? 7.5 : 4.8) * invScale;
                    const strokeW = 2.2 * invScale;

                    const flipBelow = py < 70;
                    const tipW = Math.min(220, Math.max(88, spot.name.length * 7.2 + 22));
                    const tipH = 26;
                    const tipY = flipBelow ? 14 : -(tipH + 14);
                    const scaledW = tipW * invScale;
                    let tipX = -tipW / 2;
                    if (px - scaledW / 2 < 10) tipX = (10 - px) / invScale;
                    else if (px + scaledW / 2 > SVG_W - 10) tipX = (SVG_W - 10 - scaledW - px) / invScale;

                    return (
                      <g
                        key={spot.id}
                        data-map-pin={spot.id}
                        transform={`translate(${px}, ${py})`}
                        role="button"
                        tabIndex={0}
                        aria-label={`${spot.name}, ${spot.district}`}
                        onMouseEnter={() => setFocusId(spot.id)}
                        onFocus={() => setFocusId(spot.id)}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isFocus) openSpot(spot.id);
                          else setFocusId(spot.id);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            if (isFocus) openSpot(spot.id);
                            else setFocusId(spot.id);
                          }
                        }}
                        opacity={dimmed ? 0.22 : 1}
                        className="cursor-pointer transition-opacity duration-200 focus:outline-none"
                      >
                        <circle r={13 / zoom} fill="transparent" />

                        {isDark && !dimmed && (
                          <circle
                            r={dotRadius * 2.1}
                            fill={color}
                            opacity={isFocus ? 0.55 : 0.35}
                            filter="url(#bd-pin-glow)"
                          />
                        )}

                        {isFocus && (
                          <circle
                            r={12 * invScale}
                            fill={color}
                            opacity={0.35}
                            className="animate-ping"
                            style={{ transformOrigin: '0px 0px' }}
                          />
                        )}

                        <circle
                          r={dotRadius}
                          fill={color}
                          stroke={isDark ? '#0B111E' : '#FFFFFF'}
                          strokeWidth={strokeW}
                        />

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
    </section>
  );
}

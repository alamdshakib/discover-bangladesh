import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, CalendarDays, RotateCcw, Search, SearchX, X } from 'lucide-react';
import { SPOT_CATEGORIES } from '@data';
import { gsap, MEDIA, ScrollTrigger } from '@animations';
import { getImageSrc, getSeasonShort } from '@utils';
import { LiveWeatherPill } from './ui/WeatherBadge.jsx';
import { JourneyBookmarkButton } from './ui/JourneyBookmarkButton.jsx';

const CATEGORY_STYLES = {
  Hills: {
    dot: 'bg-emerald-500',
    pill: 'border-emerald-600/25 bg-emerald-500/[0.08] text-emerald-900 dark:border-emerald-400/30 dark:bg-emerald-400/[0.12] dark:text-emerald-200',
  },
  Sea: {
    dot: 'bg-sky-500',
    pill: 'border-sky-600/25 bg-sky-500/[0.08] text-sky-900 dark:border-sky-400/30 dark:bg-sky-400/[0.12] dark:text-sky-200',
  },
  Forest: {
    dot: 'bg-green-500',
    pill: 'border-green-600/25 bg-green-500/[0.08] text-green-900 dark:border-green-400/30 dark:bg-green-400/[0.12] dark:text-green-200',
  },
  Heritage: {
    dot: 'bg-amber-500',
    pill: 'border-amber-600/25 bg-amber-500/[0.08] text-amber-900 dark:border-amber-400/30 dark:bg-amber-400/[0.12] dark:text-amber-200',
  },
};

/**
 * Floating-Photo Swiss Editorial "Archive / Index" View (`01` to `48`).
 * - Desktop (`lg:` fine pointer): Hovering any row reveals a `w-64 h-44 rounded-2xl shadow-2xl`
 *   floating high-res cover photo tracking the cursor with `gsap.quickTo` inertia
 *   (`duration: 0.35, ease: 'power3.out'`) and smooth crossfades between rows.
 * - Mobile (`< lg`): Renders a crisp inline micro-thumbnail per row.
 * - Zero skewY, zero skewX, zero 3D card tilt wobble.
 */
export function IndexView({
  spots,
  totalCount,
  searchQuery = '',
  onSearchChange,
  onResetAll,
  onOpen,
}) {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [previewPair, setPreviewPair] = useState({ current: null, previous: null });
  const [isHovering, setIsHovering] = useState(false);

  const scopeRef = useRef(null);
  const previewRef = useRef(null);
  const activeImgLayerRef = useRef(null);
  const xToRef = useRef(null);
  const yToRef = useRef(null);
  const hasEnteredRef = useRef(false);
  const activeSpotIdRef = useRef(null);

  const visibleSpots = useMemo(() => {
    if (categoryFilter === 'All') return spots;
    return spots.filter((spot) => spot.category === categoryFilter);
  }, [spots, categoryFilter]);

  const categoryCounts = useMemo(() => {
    const map = { All: spots.length };
    SPOT_CATEGORIES.forEach((cat) => {
      map[cat] = spots.filter((s) => s.category === cat).length;
    });
    return map;
  }, [spots]);

  const renderedKey = useMemo(() => visibleSpots.map((s) => s.id).join(','), [visibleSpots]);

  // Preload card-sized images lazily when Index view mounts so row-to-row hover crossfade is instant
  useEffect(() => {
    if (!window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches) return undefined;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (cancelled) return;
      spots.slice(0, 16).forEach((spot) => {
        const img = new Image();
        img.decoding = 'async';
        img.src = getImageSrc(spot.images.cover, 'card');
      });
    }, 120);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [spots]);

  // Setup GSAP quickTo cursor inertia (`duration: 0.35, ease: 'power3.out'`)
  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return undefined;
    const reduce = window.matchMedia(MEDIA.reduceMotion).matches;

    gsap.set(preview, { opacity: 0, scale: 0.92, x: 0, y: 0 });

    xToRef.current = gsap.quickTo(preview, 'x', {
      duration: reduce ? 0.01 : 0.35,
      ease: 'power3.out',
    });
    yToRef.current = gsap.quickTo(preview, 'y', {
      duration: reduce ? 0.01 : 0.35,
      ease: 'power3.out',
    });

    return () => {
      gsap.killTweensOf(preview);
    };
  }, []);

  const activePreview = previewPair.current;
  const previousPreview = previewPair.previous;
  const activePreviewId = activePreview?.spot.id ?? null;

  // Smooth crossfade + subtle level settle whenever the hovered row changes
  useLayoutEffect(() => {
    const layer = activeImgLayerRef.current;
    if (!layer || !activePreviewId) return;
    if (window.matchMedia(MEDIA.reduceMotion).matches) return;

    gsap.fromTo(
      layer,
      { opacity: 0, scale: 1.05 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      }
    );
  }, [activePreviewId]);

  // Staggered level entrance + ScrollTrigger.refresh() when visible rows change
  useLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return undefined;
    const reduce = window.matchMedia(MEDIA.reduceMotion).matches;

    const ctx = gsap.context(() => {
      if (reduce) return;
      const rows = scope.querySelectorAll('[data-index-row]');
      if (rows.length === 0) return;

      gsap.fromTo(
        rows,
        { y: 14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.42,
          stagger: 0.014,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        }
      );
    }, scopeRef);

    const refreshRaf = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      window.cancelAnimationFrame(refreshRaf);
      ctx.revert();
    };
  }, [renderedKey]);

  const computePreviewCoords = (clientX, clientY) => {
    const cardW = 256; // w-64
    const cardH = 176; // h-44
    const gap = 24;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const placeLeft = clientX + gap + cardW + 16 > vw;
    const rawX = placeLeft ? clientX - cardW - gap : clientX + gap;
    const rawY = clientY - cardH * 0.5;

    return {
      x: Math.max(16, Math.min(vw - cardW - 16, rawX)),
      y: Math.max(82, Math.min(vh - cardH - 16, rawY)),
    };
  };

  const canShowFloatingPreview = () =>
    window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches;

  const handleListPointerMove = (e) => {
    if (!canShowFloatingPreview() || !previewRef.current) return;
    const { x, y } = computePreviewCoords(e.clientX, e.clientY);

    if (!hasEnteredRef.current) {
      hasEnteredRef.current = true;
      gsap.set(previewRef.current, { x, y });
    } else {
      xToRef.current?.(x);
      yToRef.current?.(y);
    }
  };

  const handleRowEnter = (spot, displayIndex, e) => {
    if (!canShowFloatingPreview() || !previewRef.current) return;

    const { x, y } = computePreviewCoords(e.clientX, e.clientY);
    if (!hasEnteredRef.current) {
      hasEnteredRef.current = true;
      gsap.set(previewRef.current, { x, y });
    } else {
      xToRef.current?.(x);
      yToRef.current?.(y);
    }

    if (activeSpotIdRef.current !== spot.id) {
      activeSpotIdRef.current = spot.id;
      setPreviewPair((prev) => ({
        previous: prev.current,
        current: { spot, number: String(displayIndex + 1).padStart(2, '0') },
      }));
    }

    if (!isHovering) {
      setIsHovering(true);
      const reduce = window.matchMedia(MEDIA.reduceMotion).matches;
      gsap.to(previewRef.current, {
        opacity: 1,
        scale: 1,
        duration: reduce ? 0.01 : 0.28,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }
  };

  const handleListLeave = () => {
    activeSpotIdRef.current = null;
    setIsHovering(false);
    hasEnteredRef.current = false;
    if (!previewRef.current) return;
    const reduce = window.matchMedia(MEDIA.reduceMotion).matches;
    gsap.to(previewRef.current, {
      opacity: 0,
      scale: 0.94,
      duration: reduce ? 0.01 : 0.22,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const handleRowKeyDown = (e, spotId) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(spotId);
    }
  };

  const clearAllArchiveFilters = () => {
    setCategoryFilter('All');
    onSearchChange?.('');
    onResetAll?.();
  };

  return (
    <div ref={scopeRef} data-index-view className="relative">
      {/* Swiss Archive Control Bar */}
      <div className="rounded-4xl border border-line bg-card p-4 transition-colors duration-300 dark:border-white/10 dark:bg-[#131C2E] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full transition-colors duration-500"
                style={{ backgroundColor: 'var(--chapter-accent, #10b981)' }}
              />
              <p className="font-mono text-[11px] font-bold tracking-[0.22em] text-mist uppercase">
                Swiss Editorial Archive · 01—{String(totalCount || spots.length).padStart(2, '0')}
              </p>
            </div>
            <p className="mt-1 font-display text-lg font-bold tracking-tight text-ink dark:text-slate-50 sm:text-xl">
              Complete Destination Index
            </p>
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            {/* Inline quick search synced with global searchQuery */}
            <div className="flex h-10 items-center gap-2 rounded-full border border-line bg-canvas px-3.5 transition-colors duration-200 focus-within:border-ink/40 focus-within:bg-white dark:border-white/10 dark:bg-white/[0.05] dark:focus-within:border-white/30 sm:w-64">
              <Search className="h-3.5 w-3.5 shrink-0 text-mist" strokeWidth={2.2} aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="Filter archive…"
                aria-label="Filter archive by destination, district, or division"
                className="h-full min-w-0 flex-1 bg-transparent text-xs font-medium text-ink placeholder:text-mist focus:outline-none dark:text-slate-100 sm:text-[13px]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange?.('')}
                  aria-label="Clear archive search"
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-line text-ink-soft hover:bg-haze dark:bg-white/15 dark:text-slate-200"
                >
                  <X className="h-3 w-3" strokeWidth={2.4} />
                </button>
              )}
            </div>

            {/* Category filter pills */}
            <div
              role="group"
              aria-label="Filter archive by chapter landscape"
              className="no-scrollbar flex items-center gap-1 overflow-x-auto"
            >
              {['All', ...SPOT_CATEGORIES].map((cat) => {
                const selected = categoryFilter === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    data-index-category={cat}
                    data-cursor="magnetic"
                    aria-pressed={selected}
                    onClick={() => setCategoryFilter(cat)}
                    className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-200 active:scale-95 ${
                      selected
                        ? 'border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-[#0B111E]'
                        : 'border-line bg-white text-ink-soft hover:border-haze hover:text-ink dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:border-white/25 dark:hover:text-white'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] font-bold tabular-nums ${
                        selected ? 'text-white/65 dark:text-[#0B111E]/65' : 'text-mist'
                      }`}
                    >
                      {categoryCounts[cat] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Razor-Sharp Swiss Editorial Index Table */}
      {visibleSpots.length > 0 ? (
        <div
          onPointerMove={handleListPointerMove}
          onPointerLeave={handleListLeave}
          className="mt-4 overflow-hidden rounded-4xl border border-line bg-card transition-colors duration-300 dark:border-white/10 dark:bg-[#131C2E] sm:mt-5"
        >
          {/* Desktop Column Header Row */}
          <div
            aria-hidden="true"
            className="hidden border-b border-line bg-canvas/70 px-6 py-3.5 font-mono text-[10px] font-bold tracking-[0.22em] text-mist uppercase lg:grid lg:grid-cols-[3.5rem_minmax(0,2.2fr)_minmax(0,1.1fr)_8.5rem_8.5rem_7.5rem_5.5rem] lg:items-center lg:gap-4 dark:border-white/10 dark:bg-white/[0.02]"
          >
            <span>No.</span>
            <span>Destination</span>
            <span>Division</span>
            <span>Category</span>
            <span>Best Season</span>
            <span>Live Temp</span>
            <span className="text-right">Action</span>
          </div>

          <div role="list" aria-label="Destination archive index" className="divide-y divide-line dark:divide-white/10">
            {visibleSpots.map((spot, idx) => {
              const indexLabel = String(idx + 1).padStart(2, '0');
              const catStyle = CATEGORY_STYLES[spot.category] ?? CATEGORY_STYLES.Hills;
              const seasonLabel = getSeasonShort(spot);

              return (
                <div
                  key={spot.id}
                  role="listitem"
                  data-index-row={spot.id}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    data-cursor="explore"
                    aria-label={`${indexLabel} ${spot.name}, ${spot.division} division, ${spot.category}, best season ${seasonLabel}`}
                    onPointerEnter={(e) => handleRowEnter(spot, idx, e)}
                    onClick={() => onOpen(spot.id)}
                    onKeyDown={(e) => handleRowKeyDown(e, spot.id)}
                    className="group relative flex flex-col gap-2.5 px-4 py-3.5 text-left transition-colors duration-200 hover:bg-canvas/90 focus-visible:bg-canvas/90 sm:px-5 sm:py-4 lg:grid lg:grid-cols-[3.5rem_minmax(0,2.2fr)_minmax(0,1.1fr)_8.5rem_8.5rem_7.5rem_5.5rem] lg:items-center lg:gap-4 lg:px-6 lg:py-4 dark:hover:bg-white/[0.04] dark:focus-visible:bg-white/[0.04]"
                  >
                    {/* Subtle left accent bar on hover */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-2 left-0 w-[3px] origin-center scale-y-0 rounded-r-full transition-transform duration-200 group-hover:scale-y-100"
                      style={{ backgroundColor: 'var(--chapter-accent, #10b981)' }}
                    />

                    {/* Mobile + Tablet Top Line / Desktop Cells */}
                    <div className="flex items-center gap-3 lg:contents">
                      {/* 1. Index Number (01 - 48) */}
                      <span
                        data-index-num
                        className="w-6 shrink-0 font-mono text-xs font-bold tracking-[0.12em] text-mist tabular-nums transition-colors duration-200 group-hover:text-ink lg:w-auto dark:group-hover:text-white"
                      >
                        {indexLabel}
                      </span>

                      {/* Mobile Inline Micro-Thumbnail (< lg) */}
                      <div className="h-11 w-14 shrink-0 overflow-hidden rounded-xl border border-line bg-line lg:hidden dark:border-white/10">
                        <img
                          src={getImageSrc(spot.images.cover, 'thumb')}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* 2. Destination Name + District / Tagline */}
                      <div className="min-w-0 flex-1 transition-transform duration-300 ease-out lg:group-hover:translate-x-1.5">
                        <p className="truncate font-display text-base font-bold tracking-[-0.02em] text-ink transition-colors duration-200 dark:text-slate-50 sm:text-lg">
                          {spot.name}
                        </p>
                        <p className="truncate text-xs text-mist lg:hidden">
                          {spot.district} · {spot.division}
                        </p>
                        <p className="hidden truncate text-xs text-mist lg:block">{spot.tagline}</p>
                      </div>

                      {/* Mobile Action Cluster */}
                      <div className="flex shrink-0 items-center gap-1.5 lg:hidden">
                        <JourneyBookmarkButton
                          spotId={spot.id}
                          spotName={spot.name}
                          className="!h-8 !w-8"
                        />
                        <span
                          aria-hidden="true"
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-canvas text-ink transition-colors group-hover:bg-ink group-hover:text-white dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:group-hover:bg-white dark:group-hover:text-[#0B111E]"
                        >
                          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.2} />
                        </span>
                      </div>
                    </div>

                    {/* Mobile Metadata Pills Row (< lg) */}
                    <div className="flex flex-wrap items-center gap-1.5 pl-9 lg:hidden">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${catStyle.pill}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${catStyle.dot}`} aria-hidden="true" />
                        {spot.category}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-line bg-canvas px-2.5 py-0.5 text-[11px] font-semibold text-ink-soft tabular-nums dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">
                        <CalendarDays className="h-3 w-3 text-mist" strokeWidth={2} aria-hidden="true" />
                        {seasonLabel}
                      </span>
                      <LiveWeatherPill spot={spot} data-index-weather-mobile={spot.id} />
                    </div>

                    {/* 3. Desktop Division + District */}
                    <div className="hidden min-w-0 lg:block">
                      <p className="truncate text-sm font-semibold text-ink dark:text-slate-100">{spot.division}</p>
                      <p className="truncate text-xs text-mist">{spot.district}</p>
                    </div>

                    {/* 4. Desktop Category Pill */}
                    <div className="hidden lg:block">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${catStyle.pill}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${catStyle.dot}`} aria-hidden="true" />
                        {spot.category}
                      </span>
                    </div>

                    {/* 5. Desktop Best Season */}
                    <div className="hidden lg:block">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft tabular-nums dark:text-slate-300">
                        <CalendarDays className="h-3.5 w-3.5 shrink-0 text-mist" strokeWidth={2} aria-hidden="true" />
                        {seasonLabel}
                      </span>
                    </div>

                    {/* 6. Desktop Live Temp */}
                    <div className="hidden lg:block">
                      <LiveWeatherPill spot={spot} data-index-weather={spot.id} />
                    </div>

                    {/* 7. Desktop Bookmark + Open Affordance */}
                    <div className="hidden items-center justify-end gap-2 lg:flex">
                      <JourneyBookmarkButton
                        spotId={spot.id}
                        spotName={spot.name}
                        className="!h-9 !w-9"
                      />
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-canvas text-ink transition-all duration-200 group-hover:border-ink group-hover:bg-ink group-hover:text-white dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:group-hover:border-white dark:group-hover:bg-white dark:group-hover:text-[#0B111E]"
                      >
                        <ArrowUpRight
                          className="h-4 w-4 transition-transform duration-200 group-hover:rotate-45"
                          strokeWidth={2.2}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center rounded-4xl border border-dashed border-haze bg-card px-6 py-16 text-center transition-colors duration-300 dark:border-white/15 dark:bg-[#131C2E]">
          <SearchX className="h-8 w-8 text-mist" strokeWidth={1.6} />
          <p className="mt-3 font-display text-xl font-bold text-ink dark:text-slate-50">
            No destinations match this archive filter
          </p>
          <p className="mt-1 max-w-sm text-sm text-ink-soft dark:text-slate-400">
            Clear the search query or switch landscape and season filters to restore all 48 entries.
          </p>
          <button
            type="button"
            data-cursor="magnetic"
            onClick={clearAllArchiveFilters}
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white transition-colors active:scale-95 dark:bg-white dark:text-[#0B111E]"
          >
            <RotateCcw className="h-4 w-4" strokeWidth={2} />
            Reset archive filters
          </button>
        </div>
      )}

      {/* Desktop Floating Cursor Photo Preview (`w-64 h-44 rounded-2xl shadow-2xl pointer-events-none fixed z-40`) */}
      <div
        ref={previewRef}
        data-index-preview
        data-active={isHovering ? 'true' : 'false'}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-40 hidden h-44 w-64 overflow-hidden rounded-2xl border border-white/50 bg-[#0d1525] opacity-0 shadow-2xl will-change-transform lg:block dark:border-white/20"
      >
        {/* Previous frame underneath for seamless crossfade without background flash */}
        {previousPreview && (
          <img
            key={`prev-${previousPreview.spot.id}`}
            src={getImageSrc(previousPreview.spot.images.cover, 'card')}
            alt=""
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Active frame crossfading on top */}
        {activePreview && (
          <div
            ref={activeImgLayerRef}
            key={`curr-${activePreview.spot.id}`}
            className="absolute inset-0 h-full w-full will-change-[transform,opacity]"
          >
            <img
              src={getImageSrc(activePreview.spot.images.cover, 'card')}
              alt=""
              decoding="async"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
            <div className="absolute right-3 bottom-2.5 left-3 flex items-end justify-between gap-2 text-white">
              <div className="min-w-0">
                <p className="font-mono text-[10px] font-bold tracking-[0.2em] text-emerald-300 uppercase tabular-nums">
                  {activePreview.number} · {activePreview.spot.category}
                </p>
                <p className="truncate font-display text-sm font-bold tracking-tight">
                  {activePreview.spot.name}
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-white/25 bg-black/45 px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm">
                {activePreview.spot.district}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, LayoutGrid, List, RotateCcw, Sparkles } from 'lucide-react';
import { CHAPTERS, SECTION_IDS, SPOT_CATEGORIES } from '@data';
import { useActiveSection, useShowcase } from '@hooks';
import { gsap, MEDIA, ScrollTrigger, scrollToTarget } from '@animations';
import {
  countByCategory,
  filterSpotsBySeasonVibe,
  groupByCategory,
  searchSpots,
  SEASON_FILTER_OPTIONS,
} from '@utils';
import { ChapterDock } from '../chapters/ChapterDock.jsx';
import { ChapterSection } from '../chapters/ChapterSection.jsx';
import { ExpoMatrix } from '../spots/ExpoMatrix.jsx';
import { IndexView } from '../IndexView.jsx';

const CHAPTER_IDS = CHAPTERS.map((c) => c.id);

const COLLECTION_VIEWS = [
  { mode: 'editorial', label: 'Editorial', icon: BookOpen },
  { mode: 'expo', label: 'Expo Bento', icon: LayoutGrid },
  { mode: 'index', label: 'Index', icon: List },
];

/**
 * Tri-view showcase: Editorial scrollytelling (default) ⇄ Expo Bento matrix ⇄ Swiss Floating-Photo Index,
 * equipped with interactive Season & Vibe filter bar, live search sync, sliding active pills,
 * live destination count badge, and clean ScrollTrigger refreshes on every view swap.
 */
export function Showcase() {
  const { spots, viewMode, setViewMode, searchQuery, setSearchQuery, openSpot } = useShowcase();
  const requestedMode = viewMode || 'editorial';
  const [displayMode, setDisplayMode] = useState(requestedMode);
  const [seasonFilter, setSeasonFilter] = useState('all');

  const titleWords = useMemo(() => [String(spots.length), 'places,', 'four', 'chapters.'], [spots.length]);

  const headerRef = useRef(null);
  const viewTrackRef = useRef(null);
  const viewPillRef = useRef(null);
  const filterTrackRef = useRef(null);
  const filterPillRef = useRef(null);
  const countBadgeRef = useRef(null);
  const viewRef = useRef(null);
  const pendingTarget = useRef(null);
  const isFirstRender = useRef(true);
  const isFirstFilterRef = useRef(true);
  const hasPositionedViewPillRef = useRef(false);
  const hasPositionedFilterPillRef = useRef(false);

  const filterCounts = useMemo(
    () =>
      Object.fromEntries(
        SEASON_FILTER_OPTIONS.map((opt) => [opt.key, filterSpotsBySeasonVibe(spots, opt.key).length])
      ),
    [spots]
  );

  const seasonFilteredSpots = useMemo(() => filterSpotsBySeasonVibe(spots, seasonFilter), [spots, seasonFilter]);
  const hasActiveSearch = Boolean(searchQuery && searchQuery.trim().length > 0);
  const filteredSpots = useMemo(
    () =>
      hasActiveSearch
        ? searchSpots(seasonFilteredSpots, searchQuery, seasonFilteredSpots.length)
        : seasonFilteredSpots,
    [seasonFilteredSpots, searchQuery, hasActiveSearch]
  );
  const isAnyFilterActive = seasonFilter !== 'all' || hasActiveSearch;

  const grouped = useMemo(() => groupByCategory(filteredSpots, SPOT_CATEGORIES), [filteredSpots]);
  const counts = useMemo(() => countByCategory(filteredSpots), [filteredSpots]);
  const visibleChapters = useMemo(
    () => CHAPTERS.filter((chapter) => (grouped[chapter.category]?.length ?? 0) > 0),
    [grouped]
  );
  const visibleChapterIds = useMemo(() => visibleChapters.map((c) => c.id), [visibleChapters]);
  const activeChapter = useActiveSection(visibleChapterIds.length ? visibleChapterIds : CHAPTER_IDS, {
    enabled: displayMode === 'editorial',
  });

  // Bidirectional masked word reveal + continuous scrubbed horizontal & tracking parallax
  useLayoutEffect(() => {
    const mm = gsap.matchMedia(headerRef);

    mm.add(MEDIA.motion, () => {
      const headerEl = headerRef.current;
      if (!headerEl) return;

      const words = headerEl.querySelectorAll('[data-showcase-word]');
      const eyebrow = headerEl.querySelector('[data-showcase-eyebrow]');
      const title = headerEl.querySelector('[data-showcase-title]');

      if (words.length > 0) {
        gsap.fromTo(
          words,
          { yPercent: 105, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.78,
            stagger: 0.06,
            ease: 'power4.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: headerEl,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      const scrubTl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: headerEl,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      });

      if (eyebrow) {
        scrubTl.fromTo(eyebrow, { x: 0 }, { x: 24, immediateRender: false }, 0);
      }
      if (title) {
        scrubTl.fromTo(
          title,
          { x: 18, letterSpacing: '-0.055em' },
          { x: 0, letterSpacing: '-0.025em', immediateRender: false },
          0
        );
      }
    });

    return () => mm.revert();
  }, []);

  // Animated sliding background pill for 3-way Collection View toggle (`Editorial` | `Expo Bento` | `Index`)
  useLayoutEffect(() => {
    const track = viewTrackRef.current;
    const pill = viewPillRef.current;
    if (!track || !pill) return undefined;

    const reduce = window.matchMedia(MEDIA.reduceMotion).matches;

    const syncViewPill = (instant = false) => {
      const activeBtn = track.querySelector(`[data-collection-view="${requestedMode}"]`);
      if (!activeBtn) return;

      const x = activeBtn.offsetLeft;
      const width = activeBtn.offsetWidth;
      const height = activeBtn.offsetHeight;

      if (!hasPositionedViewPillRef.current || reduce || instant) {
        hasPositionedViewPillRef.current = true;
        gsap.set(pill, { x, width, height, opacity: 1 });
      } else {
        gsap.to(pill, {
          x,
          width,
          height,
          opacity: 1,
          duration: 0.38,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }
    };

    syncViewPill(false);

    const onResize = () => syncViewPill(true);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, [requestedMode]);

  // Animated sliding background pill for Season & Vibe filter tabs
  useLayoutEffect(() => {
    const track = filterTrackRef.current;
    const pill = filterPillRef.current;
    if (!track || !pill) return undefined;

    const reduce = window.matchMedia(MEDIA.reduceMotion).matches;

    const syncPill = (instant = false) => {
      const activeBtn = track.querySelector(`[data-season-tab="${seasonFilter}"]`);
      if (!activeBtn) return;

      const x = activeBtn.offsetLeft;
      const width = activeBtn.offsetWidth;
      const height = activeBtn.offsetHeight;

      if (!hasPositionedFilterPillRef.current || reduce || instant) {
        hasPositionedFilterPillRef.current = true;
        gsap.set(pill, { x, width, height, opacity: 1 });
      } else {
        gsap.to(pill, {
          x,
          width,
          height,
          opacity: 1,
          duration: 0.42,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }
    };

    syncPill(false);

    const onResize = () => syncPill(true);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, [seasonFilter]);

  // Smooth container transition + ScrollTrigger refresh + live count pop when seasonFilter or searchQuery changes
  useLayoutEffect(() => {
    if (isFirstFilterRef.current) {
      isFirstFilterRef.current = false;
      return undefined;
    }

    const reduce = window.matchMedia(MEDIA.reduceMotion).matches;
    if (!reduce && countBadgeRef.current) {
      gsap.fromTo(
        countBadgeRef.current,
        { y: -6, opacity: 0.35 },
        { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out', clearProps: 'transform,opacity' }
      );
    }

    if (!reduce && viewRef.current) {
      gsap.fromTo(
        viewRef.current,
        { y: 14, opacity: 0.45 },
        {
          y: 0,
          opacity: 1,
          duration: 0.38,
          ease: 'power3.out',
          overwrite: 'auto',
          clearProps: 'transform,opacity',
        }
      );
    }

    const refreshRaf = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(refreshRaf);
  }, [seasonFilter, searchQuery]);

  // Morph out current view cleanly, then swap (`Editorial` ⇄ `Expo Bento` ⇄ `Index`).
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return undefined;
    const reduce = window.matchMedia(MEDIA.reduceMotion).matches;

    if (requestedMode === displayMode) {
      gsap.to(view, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: reduce ? 0 : 0.38,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        overwrite: true,
        onComplete: () => ScrollTrigger.refresh(),
      });
      return undefined;
    }

    const tween = gsap.to(view, {
      opacity: 0,
      y: 18,
      scale: 0.985,
      duration: reduce ? 0 : 0.22,
      ease: 'power2.in',
      overwrite: true,
      onComplete: () => setDisplayMode(requestedMode),
    });
    return () => tween.kill();
  }, [requestedMode, displayMode]);

  // After a view swap: scroll to target cleanly and recompute all ScrollTriggers.
  useLayoutEffect(() => {
    window.dispatchEvent(new CustomEvent('db:view-rendered', { detail: { mode: displayMode } }));

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return undefined;
    }

    const target = pendingTarget.current ?? `#${SECTION_IDS.showcase}`;
    const isChapter = Boolean(pendingTarget.current);
    pendingTarget.current = null;
    const element = document.querySelector(target);
    const alreadyPast = element ? element.getBoundingClientRect().top < 0 : false;
    scrollToTarget(target, { offset: isChapter ? -148 : -88, immediate: alreadyPast });

    const refreshRaf = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    const settleTimer = window.setTimeout(() => ScrollTrigger.refresh(), 160);
    return () => {
      window.cancelAnimationFrame(refreshRaf);
      window.clearTimeout(settleTimer);
    };
  }, [displayMode]);

  const jumpToChapter = (chapter) => {
    if (requestedMode !== 'editorial' || displayMode !== 'editorial') {
      pendingTarget.current = `#${chapter.id}`;
      setViewMode('editorial');
      return;
    }
    scrollToTarget(`#${chapter.id}`, { offset: -148 });
  };

  const resetAllFilters = () => {
    setSeasonFilter('all');
    setSearchQuery('');
  };

  return (
    <section id={SECTION_IDS.showcase} aria-label="Destinations" className="relative mt-4 scroll-mt-24 sm:mt-8">
      <div className="mx-auto max-w-[1600px] px-3 sm:px-5">
        <div
          ref={headerRef}
          className="flex flex-col gap-5 overflow-x-clip px-1 pb-5 sm:px-3 lg:flex-row lg:items-end lg:justify-between lg:pb-6"
        >
          <div className="px-1">
            <p
              data-showcase-eyebrow
              className="text-[11px] font-semibold tracking-[0.24em] text-mist uppercase will-change-transform"
            >
              The Collection
            </p>
            <h2
              data-showcase-title
              className="mt-2 font-display leading-[0.94] font-black tracking-[-0.055em] text-ink transition-colors duration-300 will-change-transform dark:text-slate-50"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 5.5rem)' }}
            >
              {titleWords.map((word, idx) => (
                <span key={`${word}-${idx}`} className="inline-block overflow-hidden py-0.5 align-bottom">
                  <span data-showcase-word className="inline-block will-change-transform">
                    {word}
                    {idx < titleWords.length - 1 ? '\u00A0' : ''}
                  </span>
                </span>
              ))}
            </h2>
          </div>

          {/* 3-Way Segmented View Toggle (`Editorial` | `Expo Bento` | `Index`) */}
          <div
            ref={viewTrackRef}
            role="radiogroup"
            aria-label="Showcase view"
            data-showcase-view-toggle
            className="relative flex w-full shrink-0 items-center rounded-full border border-line bg-white p-1 transition-colors duration-300 dark:border-white/10 dark:bg-[#131C2E] sm:w-auto"
          >
            <span
              ref={viewPillRef}
              aria-hidden="true"
              className="pointer-events-none absolute top-1 left-0 z-0 rounded-full bg-ink opacity-0 shadow-xs transition-colors duration-300 will-change-transform dark:bg-white"
            />
            {COLLECTION_VIEWS.map(({ mode, label, icon: Icon }) => {
              const selected = requestedMode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  role="radio"
                  data-collection-view={mode}
                  data-cursor="magnetic"
                  aria-checked={selected}
                  onClick={() => setViewMode(mode)}
                  className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-full px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors duration-200 active:scale-95 sm:flex-none sm:gap-2 sm:px-5 sm:text-sm ${
                    selected
                      ? 'text-white dark:text-[#0B111E]'
                      : 'text-ink-soft hover:text-ink dark:text-slate-400 dark:hover:text-slate-100'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sleek Glassmorphic Season & Vibe Filter Bar + Live Count Badge */}
        <div
          data-season-filter-bar
          className="mb-5 flex flex-col gap-3 px-1 sm:mb-6 sm:px-3 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="glass max-w-full rounded-full border border-white/75 p-1.5 shadow-[0_14px_34px_-20px_rgba(15,23,42,0.35)] transition-colors duration-300 dark:border-white/10 dark:shadow-[0_14px_34px_-18px_rgba(0,0,0,0.75)]">
            <div
              ref={filterTrackRef}
              role="tablist"
              aria-label="Filter destinations by season and vibe"
              className="no-scrollbar relative flex items-center gap-1 overflow-x-auto"
            >
              {/* Sliding Background Active Indicator Pill */}
              <span
                ref={filterPillRef}
                data-season-active-pill
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-0 z-0 rounded-full bg-ink opacity-0 shadow-sm transition-colors duration-300 will-change-transform dark:bg-white"
              />

              {SEASON_FILTER_OPTIONS.map((option) => {
                const isSelected = seasonFilter === option.key;
                const count = filterCounts[option.key] ?? 0;
                const isBestNow = option.key === 'best-now';

                return (
                  <button
                    key={option.key}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    data-season-tab={option.key}
                    data-cursor="magnetic"
                    onClick={() => setSeasonFilter(option.key)}
                    className={`relative z-10 flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors duration-200 active:scale-95 sm:px-4 sm:text-[13px] ${
                      isSelected
                        ? 'text-white dark:text-[#0B111E]'
                        : 'text-ink-soft hover:text-ink dark:text-slate-300 dark:hover:text-white'
                    }`}
                  >
                    {isBestNow && (
                      <Sparkles
                        className={`h-3.5 w-3.5 ${
                          isSelected
                            ? 'text-emerald-300 dark:text-bd-green'
                            : 'text-bd-green dark:text-emerald-400'
                        }`}
                        strokeWidth={2.2}
                        aria-hidden="true"
                      />
                    )}
                    <span>{option.key === 'all' ? `${option.label} (${spots.length})` : option.label}</span>
                    {option.key !== 'all' && (
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums transition-colors duration-200 ${
                          isSelected
                            ? 'bg-white/20 text-white dark:bg-[#0B111E]/15 dark:text-[#0B111E]'
                            : 'bg-ink/[0.07] text-ink-soft dark:bg-white/10 dark:text-slate-300'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 sm:justify-start lg:justify-end">
            <span
              ref={countBadgeRef}
              data-showcase-count
              aria-live="polite"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white/85 px-3.5 py-2 text-xs font-semibold text-ink-soft tabular-nums transition-colors duration-300 will-change-transform dark:border-white/10 dark:bg-[#131C2E] dark:text-slate-300"
            >
              <span
                className="h-1.5 w-1.5 rounded-full transition-colors duration-500"
                style={{ backgroundColor: 'var(--chapter-accent, #10b981)' }}
                aria-hidden="true"
              />
              <span>
                Showing <strong className="font-bold text-ink dark:text-slate-50">{filteredSpots.length}</strong> of{' '}
                {spots.length} destinations
              </span>
            </span>

            {isAnyFilterActive && (
              <button
                type="button"
                data-cursor="magnetic"
                onClick={resetAllFilters}
                className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-white px-3 text-xs font-semibold text-ink transition hover:border-haze active:scale-95 dark:border-white/10 dark:bg-[#131C2E] dark:text-slate-100 dark:hover:border-white/25"
              >
                <RotateCcw className="h-3 w-3" strokeWidth={2.2} />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      <ChapterDock
        chapters={visibleChapters.length > 0 ? visibleChapters : CHAPTERS}
        counts={counts}
        activeId={activeChapter}
        viewMode={displayMode}
        onJump={jumpToChapter}
        onTop={() => scrollToTarget(0, { offset: 0 })}
      />

      <div ref={viewRef} className="mx-auto mt-6 max-w-[1600px] px-3 sm:mt-8 sm:px-5">
        {displayMode === 'editorial' ? (
          visibleChapters.length > 0 ? (
            <div className="flex flex-col gap-16 sm:gap-20 lg:gap-28">
              {visibleChapters.map((chapter) => (
                <ChapterSection
                  key={chapter.id}
                  chapter={chapter}
                  spots={grouped[chapter.category]}
                  isFiltered={isAnyFilterActive}
                  onOpen={openSpot}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center rounded-4xl border border-dashed border-haze bg-card px-6 py-16 text-center transition-colors duration-300 dark:border-white/15 dark:bg-[#131C2E]">
              <p className="font-display text-xl font-bold text-ink dark:text-slate-50">
                No destinations match this search &amp; season filter
              </p>
              <button
                type="button"
                data-cursor="magnetic"
                onClick={resetAllFilters}
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white transition-colors active:scale-95 dark:bg-white dark:text-[#0B111E]"
              >
                <RotateCcw className="h-4 w-4" strokeWidth={2} />
                Reset filters
              </button>
            </div>
          )
        ) : displayMode === 'expo' ? (
          <ExpoMatrix spots={filteredSpots} isSeasonFiltered={isAnyFilterActive} onOpen={openSpot} />
        ) : (
          <IndexView
            spots={filteredSpots}
            totalCount={spots.length}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onResetAll={resetAllFilters}
            onOpen={openSpot}
          />
        )}
      </div>
    </section>
  );
}

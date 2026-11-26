import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, LayoutGrid, RotateCcw, Sparkles } from 'lucide-react';
import { CHAPTERS, SECTION_IDS, SPOT_CATEGORIES } from '@data';
import { useActiveSection, useShowcase } from '@hooks';
import { gsap, MEDIA, ScrollTrigger, scrollToTarget } from '@animations';
import { countByCategory, filterSpotsBySeasonVibe, groupByCategory, SEASON_FILTER_OPTIONS } from '@utils';
import { ChapterDock } from '../chapters/ChapterDock.jsx';
import { ChapterSection } from '../chapters/ChapterSection.jsx';
import { ExpoMatrix } from '../spots/ExpoMatrix.jsx';

const CHAPTER_IDS = CHAPTERS.map((c) => c.id);
const SHOWCASE_TITLE_WORDS = ['24', 'places,', 'four', 'chapters.'];

/**
 * Dual-view showcase: Editorial scrollytelling (default) ⇄ Expo bento matrix,
 * equipped with interactive Season & Vibe filter bar, sliding active pill,
 * live destination count badge, and staggered level card reflow.
 */
export function Showcase() {
  const { spots, expoMode, setExpoMode, openSpot } = useShowcase();
  const requestedMode = expoMode ? 'expo' : 'editorial';
  const [displayMode, setDisplayMode] = useState(requestedMode);
  const [seasonFilter, setSeasonFilter] = useState('all');

  const headerRef = useRef(null);
  const filterTrackRef = useRef(null);
  const filterPillRef = useRef(null);
  const countBadgeRef = useRef(null);
  const viewRef = useRef(null);
  const pendingTarget = useRef(null);
  const isFirstRender = useRef(true);
  const isFirstFilterRef = useRef(true);
  const hasPositionedFilterPillRef = useRef(false);

  const filterCounts = useMemo(
    () =>
      Object.fromEntries(
        SEASON_FILTER_OPTIONS.map((opt) => [opt.key, filterSpotsBySeasonVibe(spots, opt.key).length])
      ),
    [spots]
  );

  const filteredSpots = useMemo(() => filterSpotsBySeasonVibe(spots, seasonFilter), [spots, seasonFilter]);
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

  // Smooth container transition + ScrollTrigger refresh + live count pop when seasonFilter changes
  // (Animates viewRef wrapper rather than individual cards so card ScrollTriggers are never overwritten)
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
  }, [seasonFilter]);

  // Morph out current view cleanly, then swap.
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

  // After a swap: recompute ScrollTriggers cleanly without overwriting individual card triggers.
  useLayoutEffect(() => {
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
    return () => window.cancelAnimationFrame(refreshRaf);
  }, [displayMode]);

  const jumpToChapter = (chapter) => {
    if (expoMode || displayMode === 'expo') {
      pendingTarget.current = `#${chapter.id}`;
      setExpoMode(false);
      return;
    }
    scrollToTarget(`#${chapter.id}`, { offset: -148 });
  };

  return (
    <section id={SECTION_IDS.showcase} aria-label="Destinations" className="relative mt-6 scroll-mt-24 sm:mt-10">
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
              {SHOWCASE_TITLE_WORDS.map((word, idx) => (
                <span key={word} className="inline-block overflow-hidden py-0.5 align-bottom">
                  <span data-showcase-word className="inline-block will-change-transform">
                    {word}
                    {idx < SHOWCASE_TITLE_WORDS.length - 1 ? '\u00A0' : ''}
                  </span>
                </span>
              ))}
            </h2>
          </div>

          <div
            role="radiogroup"
            aria-label="Showcase view"
            className="flex w-full shrink-0 rounded-full border border-line bg-white p-1 transition-colors duration-300 dark:border-white/10 dark:bg-[#131C2E] sm:w-auto"
          >
            {[
              { mode: false, label: 'Editorial', icon: BookOpen },
              { mode: true, label: 'Expo Mode', icon: LayoutGrid },
            ].map(({ mode, label, icon: Icon }) => {
              const selected = expoMode === mode;
              return (
                <button
                  key={label}
                  type="button"
                  role="radio"
                  data-cursor="magnetic"
                  aria-checked={selected}
                  onClick={() => setExpoMode(mode)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 active:scale-95 sm:flex-none ${
                    selected
                      ? 'bg-ink text-white dark:bg-white dark:text-[#0B111E]'
                      : 'text-ink-soft hover:text-ink dark:text-slate-400 dark:hover:text-slate-100'
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                  {label}
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
                    <span>{option.label}</span>
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
              <span className="h-1.5 w-1.5 rounded-full bg-bd-green dark:bg-emerald-400" aria-hidden="true" />
              <span>
                Showing <strong className="font-bold text-ink dark:text-slate-50">{filteredSpots.length}</strong> of{' '}
                {spots.length} destinations
              </span>
            </span>

            {seasonFilter !== 'all' && (
              <button
                type="button"
                data-cursor="magnetic"
                onClick={() => setSeasonFilter('all')}
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
        expoMode={displayMode === 'expo'}
        onJump={jumpToChapter}
        onTop={() => scrollToTarget(0, { offset: 0 })}
      />

      <div ref={viewRef} className="mx-auto mt-6 max-w-[1600px] px-3 sm:mt-8 sm:px-5">
        {displayMode === 'editorial' ? (
          <div className="flex flex-col gap-16 sm:gap-20 lg:gap-28">
            {visibleChapters.map((chapter) => (
              <ChapterSection key={chapter.id} chapter={chapter} spots={grouped[chapter.category]} onOpen={openSpot} />
            ))}
          </div>
        ) : (
          <ExpoMatrix spots={filteredSpots} onOpen={openSpot} />
        )}
      </div>
    </section>
  );
}

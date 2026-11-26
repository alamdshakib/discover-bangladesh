import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, RotateCcw, SearchX } from 'lucide-react';
import { CHAPTERS, FILTER_GROUPS, SPOT_CATEGORIES } from '@data';
import { Flip, gsap, MEDIA, ScrollTrigger } from '@animations';
import { filterSpots, getExpoTileClass, groupByCategory } from '@utils';
import { ExpoCard } from './ExpoCard.jsx';
import { FilterPills } from './FilterPills.jsx';

const DEFAULT_VISIBLE = 6;
const emptySelection = () => Object.fromEntries(FILTER_GROUPS.map((g) => [g.key, new Set()]));

function countTags(spots, field) {
  return spots.reduce((acc, spot) => {
    const values = Array.isArray(spot[field]) ? spot[field] : [spot[field]];
    values.forEach((v) => {
      acc[v] = (acc[v] || 0) + 1;
    });
    return acc;
  }, {});
}

/**
 * Expo Mode: high-density level bento matrix with shutter unmask, window parallax,
 * per-chapter Show More (6 default when unfiltered), and FLIP multi-tag filters across all spots.
 */
export function ExpoMatrix({ spots, isSeasonFiltered = false, onOpen }) {
  const [selection, setSelection] = useState(emptySelection);
  const [expandedChapters, setExpandedChapters] = useState(() => new Set());
  const gridRef = useRef(null);
  const flipState = useRef(null);
  const hasMounted = useRef(false);

  const filtered = useMemo(() => filterSpots(spots, FILTER_GROUPS, selection), [spots, selection]);
  const tagCounts = useMemo(
    () => Object.fromEntries(FILTER_GROUPS.map((g) => [g.key, countTags(spots, g.field)])),
    [spots]
  );
  const activeCount = FILTER_GROUPS.reduce((n, g) => n + selection[g.key].size, 0);
  const isAnyFilterActive = isSeasonFiltered || activeCount > 0;

  const grouped = useMemo(() => groupByCategory(filtered, SPOT_CATEGORIES), [filtered]);
  const visibleChapters = useMemo(
    () => CHAPTERS.filter((chapter) => (grouped[chapter.category]?.length ?? 0) > 0),
    [grouped]
  );

  const renderedKey = useMemo(() => {
    if (isAnyFilterActive) return `filtered:${filtered.map((s) => s.id).join(',')}`;
    return visibleChapters
      .map((ch) => {
        const list = grouped[ch.category] ?? [];
        const shown = expandedChapters.has(ch.id) ? list : list.slice(0, DEFAULT_VISIBLE);
        return `${ch.id}=${shown.map((s) => s.id).join(',')}`;
      })
      .join('|');
  }, [isAnyFilterActive, filtered, visibleChapters, grouped, expandedChapters]);

  const revealedIdsRef = useRef(new Set());

  const captureLayout = () => {
    const cards = gridRef.current?.querySelectorAll('[data-expo-card]');
    flipState.current = cards?.length ? Flip.getState(cards) : null;
  };

  const toggleTag = (groupKey, tag) => {
    captureLayout();
    setSelection((prev) => {
      const nextSet = new Set(prev[groupKey]);
      if (nextSet.has(tag)) nextSet.delete(tag);
      else nextSet.add(tag);
      return { ...prev, [groupKey]: nextSet };
    });
  };

  const toggleChapterExpand = (chapterId) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(chapterId)) next.delete(chapterId);
      else next.add(chapterId);
      return next;
    });
  };

  const clearAll = () => {
    if (activeCount === 0) return;
    captureLayout();
    setSelection(emptySelection());
  };

  // Level card entrance (once per spot so Flip & hover never fight inline transforms) + scrubbed media parallax.
  useLayoutEffect(() => {
    const reduce = window.matchMedia(MEDIA.reduceMotion).matches;
    const grid = gridRef.current;
    if (!grid) return undefined;

    const ctx = gsap.context(() => {
      if (reduce) return;
      const cards = grid.querySelectorAll('[data-expo-card]');

      cards.forEach((card, idx) => {
        const spotId = card.getAttribute('data-flip-id');
        const shutter = card.querySelector('[data-card-shutter]');
        const media = card.querySelector('[data-card-media]');

        if (spotId && !revealedIdsRef.current.has(spotId)) {
          const cardTl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: 'top 96%',
              once: true,
              fastScrollEnd: true,
            },
            onComplete: () => {
              revealedIdsRef.current.add(spotId);
            },
          });

          cardTl.fromTo(
            card,
            { y: 36, opacity: 0, scale: 0.97 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.56,
              delay: (idx % 6) * 0.035,
              ease: 'power3.out',
              immediateRender: false,
              clearProps: 'transform,opacity',
            },
            0
          );

          if (shutter) {
            cardTl.fromTo(
              shutter,
              { clipPath: 'inset(10% 0% 0% 0% round 1.5rem)' },
              {
                clipPath: 'inset(0% 0% 0% 0% round 1.5rem)',
                duration: 0.6,
                ease: 'power3.out',
                immediateRender: false,
                clearProps: 'clipPath',
              },
              0
            );
          }
        }

        if (media) {
          gsap.fromTo(
            media,
            { yPercent: -7 },
            {
              yPercent: 7,
              ease: 'none',
              immediateRender: false,
              scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          );
        }
      });
    }, gridRef);

    hasMounted.current = true;
    return () => ctx.revert();
  }, [renderedKey]);

  // FLIP re-layout whenever the filtered or expanded set changes + immediate ScrollTrigger refresh.
  useLayoutEffect(() => {
    if (!hasMounted.current) return undefined;
    const state = flipState.current;
    flipState.current = null;
    const cards = gridRef.current?.querySelectorAll('[data-expo-card]');
    const reduce = window.matchMedia(MEDIA.reduceMotion).matches;

    if (state && cards?.length && !reduce) {
      Flip.from(state, {
        targets: cards,
        duration: 0.58,
        ease: 'power3.inOut',
        stagger: 0.012,
        nested: true,
        prune: true,
        onEnter: (els) => {
          els.forEach((el) => {
            const id = el.getAttribute('data-flip-id');
            if (id) revealedIdsRef.current.add(id);
          });
          return gsap.fromTo(
            els,
            { opacity: 0, scale: 0.92, y: 18 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.48,
              stagger: 0.025,
              ease: 'power3.out',
              clearProps: 'transform,opacity',
            }
          );
        },
        onComplete: () => ScrollTrigger.refresh(),
      });
      return undefined;
    }

    const refreshRaf = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(refreshRaf);
  }, [renderedKey]);

  return (
    <div>
      <div className="rounded-4xl border border-line bg-card p-4 transition-colors duration-300 dark:border-white/10 dark:bg-[#131C2E] sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="font-display text-lg font-bold tracking-tight text-ink dark:text-slate-50 sm:text-xl">
              Expo Matrix
            </p>
            <p className="text-xs text-mist sm:text-sm">Combine divisions and seasons — results update instantly.</p>
          </div>
          <p
            className="shrink-0 rounded-full bg-canvas px-3 py-1.5 text-xs font-semibold text-ink tabular-nums dark:bg-white/10 dark:text-slate-100"
            aria-live="polite"
          >
            {filtered.length} / {spots.length}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {FILTER_GROUPS.map((group, index) => (
            <FilterPills
              key={group.key}
              label={group.label}
              options={group.options}
              selected={selection[group.key]}
              counts={tagCounts[group.key]}
              onToggle={(tag) => toggleTag(group.key, tag)}
              leading={
                index === 0 ? (
                  <button
                    type="button"
                    data-cursor="magnetic"
                    aria-pressed={activeCount === 0}
                    onClick={clearAll}
                    className={`flex shrink-0 snap-start items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors duration-200 active:scale-95 ${
                      activeCount === 0
                        ? 'border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-[#0B111E]'
                        : 'border-line bg-white text-ink hover:border-haze dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200 dark:hover:border-white/25'
                    }`}
                  >
                    All
                    <span className={activeCount === 0 ? 'text-white/60 dark:text-[#0B111E]/60' : 'text-mist'}>
                      {spots.length}
                    </span>
                  </button>
                ) : null
              }
            />
          ))}
        </div>
      </div>

      <div ref={gridRef} className="mt-4 sm:mt-6">
        {isAnyFilterActive ? (
          <div className="grid grid-flow-dense auto-rows-[170px] grid-cols-2 gap-2.5 sm:auto-rows-[190px] sm:grid-cols-3 sm:gap-3 lg:auto-rows-[200px] lg:grid-cols-4 xl:grid-cols-6">
            {filtered.map((spot, index) => (
              <ExpoCard key={spot.id} spot={spot} tileClass={getExpoTileClass(index)} onOpen={onOpen} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-10 sm:gap-12">
            {visibleChapters.map((chapter) => {
              const chapterSpots = grouped[chapter.category] ?? [];
              const expanded = expandedChapters.has(chapter.id);
              const hasOverflow = chapterSpots.length > DEFAULT_VISIBLE;
              const visibleSpots = hasOverflow && !expanded ? chapterSpots.slice(0, DEFAULT_VISIBLE) : chapterSpots;
              const hiddenCount = Math.max(0, chapterSpots.length - DEFAULT_VISIBLE);

              return (
                <div key={chapter.id} data-expo-chapter={chapter.id}>
                  <div className="mb-3 flex items-center justify-between gap-3 px-1">
                    <div className="flex items-center gap-2.5">
                      <span className={`h-2 w-2 rounded-full ${chapter.dotClass}`} aria-hidden="true" />
                      <span className="font-mono text-xs font-bold tracking-[0.2em] text-mist uppercase">
                        {chapter.number}
                      </span>
                      <h3 className="font-display text-lg font-extrabold tracking-tight text-ink dark:text-slate-50 sm:text-xl">
                        {chapter.title}
                      </h3>
                    </div>
                    <span className="rounded-full border border-line bg-white/80 px-3 py-1 text-[11px] font-semibold text-ink-soft tabular-nums dark:border-white/10 dark:bg-[#131C2E] dark:text-slate-300">
                      Showing {visibleSpots.length} of {chapterSpots.length}
                    </span>
                  </div>

                  <div className="grid grid-flow-dense auto-rows-[170px] grid-cols-2 gap-2.5 sm:auto-rows-[190px] sm:grid-cols-3 sm:gap-3 lg:auto-rows-[200px] lg:grid-cols-4 xl:grid-cols-6">
                    {visibleSpots.map((spot, index) => (
                      <ExpoCard key={spot.id} spot={spot} tileClass={getExpoTileClass(index)} onOpen={onOpen} />
                    ))}
                  </div>

                  {hasOverflow && (
                    <div className="mt-5 flex justify-center sm:mt-6">
                      <button
                        type="button"
                        data-expo-chapter-expand={chapter.id}
                        data-cursor="magnetic"
                        aria-expanded={expanded}
                        onClick={() => toggleChapterExpand(chapter.id)}
                        className="glass inline-flex items-center gap-2 rounded-full border border-white/80 px-5 py-2.5 text-xs font-semibold tracking-wide text-ink shadow-[0_14px_34px_-16px_rgba(15,23,42,0.32)] transition-[transform,background-color,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-haze hover:shadow-[0_18px_40px_-16px_rgba(15,23,42,0.4)] active:scale-95 dark:border-white/15 dark:text-slate-100 dark:hover:border-white/30 dark:shadow-[0_14px_34px_-16px_rgba(0,0,0,0.85)] sm:px-6 sm:py-3 sm:text-sm"
                      >
                        {expanded ? (
                          <>
                            <span>Show less</span>
                            <ChevronUp className="h-4 w-4 text-bd-green dark:text-emerald-400" strokeWidth={2.2} />
                          </>
                        ) : (
                          <>
                            <span>
                              Show all {chapterSpots.length} in {chapter.title} (+{hiddenCount})
                            </span>
                            <ChevronDown className="h-4 w-4 text-bd-green dark:text-emerald-400" strokeWidth={2.2} />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {filtered.length === 0 && (
        <div className="mt-3 flex flex-col items-center rounded-4xl border border-dashed border-haze bg-card px-6 py-16 text-center transition-colors duration-300 dark:border-white/15 dark:bg-[#131C2E]">
          <SearchX className="h-8 w-8 text-mist" strokeWidth={1.6} />
          <p className="mt-3 font-display text-xl font-bold text-ink dark:text-slate-50">
            No destinations match these filters
          </p>
          <p className="mt-1 max-w-sm text-sm text-ink-soft dark:text-slate-400">
            Try removing a division or season tag to widen the search.
          </p>
          <button
            type="button"
            data-cursor="magnetic"
            onClick={clearAll}
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white transition-colors active:scale-95 dark:bg-white dark:text-[#0B111E]"
          >
            <RotateCcw className="h-4 w-4" strokeWidth={2} />
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}

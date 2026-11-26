import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { RotateCcw, SearchX } from 'lucide-react';
import { FILTER_GROUPS } from '@data';
import { Flip, gsap, MEDIA, ScrollTrigger } from '@animations';
import { filterSpots, getExpoTileClass } from '@utils';
import { ExpoCard } from './ExpoCard.jsx';
import { FilterPills } from './FilterPills.jsx';

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

/** Expo Mode: high-density 3D bento matrix with shutter unmask, window parallax, and FLIP filters. */
export function ExpoMatrix({ spots, onOpen }) {
  const [selection, setSelection] = useState(emptySelection);
  const gridRef = useRef(null);
  const flipState = useRef(null);
  const hasMounted = useRef(false);

  const filtered = useMemo(() => filterSpots(spots, FILTER_GROUPS, selection), [spots, selection]);
  const filteredKey = useMemo(() => filtered.map((s) => s.id).join(','), [filtered]);
  const revealedIdsRef = useRef(new Set());
  const tagCounts = useMemo(
    () => Object.fromEntries(FILTER_GROUPS.map((g) => [g.key, countTags(spots, g.field)])),
    [spots]
  );
  const activeCount = FILTER_GROUPS.reduce((n, g) => n + selection[g.key].size, 0);

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

      cards.forEach((card) => {
        const spotId = card.getAttribute('data-flip-id');
        const shutter = card.querySelector('[data-card-shutter]');
        const media = card.querySelector('[data-card-media]');

        if (spotId && !revealedIdsRef.current.has(spotId)) {
          const cardTl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: 'top 94%',
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
              duration: 0.58,
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
                duration: 0.62,
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
  }, [filteredKey]);

  // FLIP re-layout whenever the filtered set changes via tag pills.
  useLayoutEffect(() => {
    if (!hasMounted.current) return;
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
            { opacity: 1, scale: 1, y: 0, duration: 0.48, stagger: 0.025, ease: 'power3.out', clearProps: 'transform,opacity' }
          );
        },
        onComplete: () => ScrollTrigger.refresh(),
      });
    } else {
      ScrollTrigger.refresh();
    }
  }, [filtered]);

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

      <div
        ref={gridRef}
        className="mt-3 grid grid-flow-dense auto-rows-[170px] grid-cols-2 gap-2.5 sm:mt-4 sm:auto-rows-[190px] sm:grid-cols-3 sm:gap-3 lg:auto-rows-[200px] lg:grid-cols-4 xl:grid-cols-6"
      >
        {filtered.map((spot, index) => (
          <ExpoCard key={spot.id} spot={spot} tileClass={getExpoTileClass(index)} onOpen={onOpen} />
        ))}
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

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { RotateCcw, SearchX } from 'lucide-react';
import { FILTER_GROUPS } from '@data';
import { Flip, gsap, ScrollTrigger } from '@animations';
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

/** Expo Mode: high-density bento matrix of every spot with instant multi-tag filters. */
export function ExpoMatrix({ spots, onOpen }) {
  const [selection, setSelection] = useState(emptySelection);
  const gridRef = useRef(null);
  const flipState = useRef(null);
  const hasMounted = useRef(false);

  const filtered = useMemo(() => filterSpots(spots, FILTER_GROUPS, selection), [spots, selection]);
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

  // Entrance stagger on mount.
  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cards = gridRef.current.querySelectorAll('[data-expo-card]');
    if (!reduce) {
      gsap.from(cards, { opacity: 0, y: 30, scale: 0.96, duration: 0.7, stagger: 0.025, ease: 'expo.out', delay: 0.1 });
    }
    hasMounted.current = true;
    return () => gsap.killTweensOf(cards);
  }, []);

  // FLIP re-layout whenever the filtered set changes.
  useLayoutEffect(() => {
    if (!hasMounted.current) return;
    const state = flipState.current;
    flipState.current = null;
    const cards = gridRef.current.querySelectorAll('[data-expo-card]');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (state && !reduce) {
      Flip.from(state, {
        targets: cards,
        duration: 0.6,
        ease: 'power3.inOut',
        stagger: 0.012,
        nested: true,
        prune: true,
        onEnter: (els) =>
          gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.03, ease: 'power3.out' }),
        onComplete: () => ScrollTrigger.refresh(),
      });
    } else {
      ScrollTrigger.refresh();
    }
  }, [filtered]);

  return (
    <div>
      <div className="rounded-4xl border border-line bg-card p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="font-display text-lg font-bold tracking-tight text-ink sm:text-xl">Expo Matrix</p>
            <p className="text-xs text-mist sm:text-sm">Combine divisions and seasons — results update instantly.</p>
          </div>
          <p className="shrink-0 rounded-full bg-canvas px-3 py-1.5 text-xs font-semibold text-ink tabular-nums" aria-live="polite">
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
                    aria-pressed={activeCount === 0}
                    onClick={clearAll}
                    className={`flex shrink-0 snap-start items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition active:scale-95 ${
                      activeCount === 0 ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:border-haze'
                    }`}
                  >
                    All
                    <span className={activeCount === 0 ? 'text-white/60' : 'text-mist'}>{spots.length}</span>
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
        <div className="mt-3 flex flex-col items-center rounded-4xl border border-dashed border-haze bg-card px-6 py-16 text-center">
          <SearchX className="h-8 w-8 text-mist" strokeWidth={1.6} />
          <p className="mt-3 font-display text-xl font-bold text-ink">No destinations match these filters</p>
          <p className="mt-1 max-w-sm text-sm text-ink-soft">Try removing a division or season tag to widen the search.</p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white transition active:scale-95"
          >
            <RotateCcw className="h-4 w-4" strokeWidth={2} />
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}

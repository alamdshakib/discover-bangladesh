import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { useShowcase } from '@hooks';
import { getImageSrc, searchSpots } from '@utils';

/**
 * Pill-shaped instant search with a keyboard-navigable results listbox.
 * `inline` renders results in-flow (used inside the mobile menu drawer).
 */
export function SearchBar({ inline = false, onNavigate, className = '' }) {
  const { spots, openSpot, searchQuery, setSearchQuery } = useShowcase();
  const query = searchQuery ?? '';
  const setQuery = setSearchQuery;
  const [focused, setFocused] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const listId = useId();

  const results = useMemo(() => searchSpots(spots, query), [spots, query]);
  const hasQuery = query.trim().length > 0;
  const showPanel = hasQuery && (inline || focused);

  useEffect(() => {
    if (inline || !focused) return undefined;
    const onPointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setFocused(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [inline, focused]);

  const selectSpot = (spot) => {
    openSpot(spot.id);
    setQuery('');
    setHighlight(0);
    setFocused(false);
    inputRef.current?.blur();
    onNavigate?.();
  };

  const clear = () => {
    setQuery('');
    setHighlight(0);
    inputRef.current?.focus();
  };

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown' && results.length) {
      event.preventDefault();
      setHighlight((h) => (h + 1) % results.length);
    } else if (event.key === 'ArrowUp' && results.length) {
      event.preventDefault();
      setHighlight((h) => (h - 1 + results.length) % results.length);
    } else if (event.key === 'Enter' && results[highlight]) {
      event.preventDefault();
      selectSpot(results[highlight]);
    } else if (event.key === 'Escape') {
      if (hasQuery) setQuery('');
      else inputRef.current?.blur();
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <div className="flex h-11 items-center gap-2 rounded-full border border-line bg-white/90 pr-1.5 pl-4 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] transition-colors duration-300 focus-within:border-ink/40 focus-within:bg-white dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none dark:focus-within:border-white/30 dark:focus-within:bg-white/10">
        <Search className="h-4 w-4 shrink-0 text-mist" strokeWidth={2.2} aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlight(0);
          }}
          onFocus={() => setFocused(true)}
          onKeyDown={onKeyDown}
          placeholder={`Search ${spots.length} destinations…`}
          aria-label="Search destinations"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showPanel && results[highlight] ? `${listId}-${results[highlight].id}` : undefined}
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-mist focus:outline-none dark:text-slate-100"
        />
        {hasQuery && (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear search"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-line text-ink-soft transition-colors hover:bg-haze active:scale-95 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20"
          >
            <X className="h-4 w-4" strokeWidth={2.2} />
          </button>
        )}
      </div>

      {showPanel && (
        <div
          className={`${
            inline ? 'mt-3' : 'absolute top-full right-0 left-0 z-50 mt-2 min-w-[320px]'
          } animate-rise-in overflow-hidden rounded-3xl border border-line bg-white p-1.5 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.35)] transition-colors duration-300 dark:border-white/10 dark:bg-[#131C2E] dark:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)]`}
        >
          {results.length > 0 ? (
            <ul id={listId} role="listbox" aria-label="Search results">
              {results.map((spot, index) => (
                <li
                  key={spot.id}
                  id={`${listId}-${spot.id}`}
                  role="option"
                  aria-selected={index === highlight}
                >
                  <button
                    type="button"
                    onMouseEnter={() => setHighlight(index)}
                    onClick={() => selectSpot(spot)}
                    className={`flex w-full items-center gap-3 rounded-2xl p-2 text-left transition-colors active:scale-[0.98] ${
                      index === highlight ? 'bg-canvas dark:bg-white/[0.08]' : ''
                    }`}
                  >
                    <img
                      src={getImageSrc(spot.images.cover, 'thumb')}
                      alt=""
                      loading="lazy"
                      className="h-11 w-11 shrink-0 rounded-xl bg-line object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink dark:text-slate-50">{spot.name}</span>
                      <span className="block truncate text-xs text-mist">
                        {spot.district} · {spot.division} · {spot.category}
                      </span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-mist" strokeWidth={2} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p id={listId} className="px-3 py-4 text-sm text-ink-soft dark:text-slate-400">
              No destinations match “{query.trim()}”. Try a district, division, or landscape.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

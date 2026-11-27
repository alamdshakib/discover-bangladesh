import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowRight,
  BookOpen,
  Compass,
  CornerDownLeft,
  LayoutGrid,
  List,
  Map as MapIcon,
  Moon,
  Search,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import { CHAPTERS, SECTION_IDS } from '@data';
import { useScrollLock, useShowcase, useTheme } from '@hooks';
import { gsap, MEDIA, scrollToTarget } from '@animations';
import { getImageSrc, getSeasonShort } from '@utils';
import { LiveWeatherPill } from './ui/WeatherBadge.jsx';

const normalizeText = (value) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, '');

/**
 * Character-subsequence + substring fuzzy scorer (Apple Spotlight / Linear style).
 * Subsequence matching is enabled only on short identifier fields (`allowSubsequence`)
 * so queries like `"sjk"` match `"Sajek Valley"` without over-matching long prose.
 */
function scoreTokenFuzzy(haystack, token, allowSubsequence = false) {
  if (!token) return 1;
  if (haystack.startsWith(token)) return 120;
  const wordIdx = haystack.indexOf(` ${token}`);
  if (wordIdx !== -1) return 95;
  const subIdx = haystack.indexOf(token);
  if (subIdx !== -1) return Math.max(55, 85 - subIdx);

  if (!allowSubsequence || token.length < 2 || token.length > 8) return 0;

  // Tight ordered subsequence match (e.g. "sjk" -> "sajek valley", "cxs" -> "coxs bazar")
  let tIdx = 0;
  let firstMatch = -1;
  let lastMatch = -1;
  let consecutive = 0;
  let bonus = 0;
  for (let i = 0; i < haystack.length && tIdx < token.length; i += 1) {
    if (haystack[i] === token[tIdx]) {
      if (firstMatch === -1) firstMatch = i;
      lastMatch = i;
      tIdx += 1;
      consecutive += 1;
      bonus += consecutive * 4;
    } else {
      consecutive = 0;
    }
  }
  if (tIdx !== token.length) return 0;
  const span = lastMatch - firstMatch + 1;
  if (span > token.length * 3 + 2) return 0;
  return 24 + Math.min(28, bonus);
}

function fuzzyScoreSpot(spot, rawQuery) {
  const clean = normalizeText(rawQuery).trim();
  if (!clean) return 1;

  const tokens = clean.split(/\s+/).filter(Boolean);
  const name = normalizeText(spot.name);
  const district = normalizeText(spot.district);
  const division = normalizeText(spot.division);
  const category = normalizeText(spot.category);
  const seasonShort = normalizeText(getSeasonShort(spot));
  const seasons = normalizeText((spot.seasons || []).join(' '));
  const bestTime = normalizeText(spot.bestTime);
  const tagline = normalizeText(spot.tagline);

  let total = 0;
  for (const token of tokens) {
    const bestFieldScore = Math.max(
      scoreTokenFuzzy(name, token, true) * 1.4,
      scoreTokenFuzzy(district, token, true) * 1.15,
      scoreTokenFuzzy(division, token, false) * 1.15,
      scoreTokenFuzzy(category, token, false) * 1.1,
      scoreTokenFuzzy(seasonShort, token, false),
      scoreTokenFuzzy(seasons, token, false),
      scoreTokenFuzzy(bestTime, token, false) * 0.85,
      scoreTokenFuzzy(tagline, token, false) * 0.75
    );
    if (bestFieldScore <= 0) return 0;
    total += bestFieldScore;
  }
  return total;
}

function fuzzyScoreAction(action, rawQuery) {
  const clean = normalizeText(rawQuery).trim();
  if (!clean) return 1;
  const tokens = clean.split(/\s+/).filter(Boolean);
  const label = normalizeText(action.label);
  const target = normalizeText(`${action.label} ${action.subtitle} ${action.keywords || ''}`);

  let total = 0;
  for (const token of tokens) {
    const s = Math.max(scoreTokenFuzzy(label, token, true), scoreTokenFuzzy(target, token, false));
    if (s <= 0) return 0;
    total += s;
  }
  return total;
}

function CommandPaletteDialog({ onClose }) {
  const {
    spots,
    viewMode,
    setViewMode,
    openSpot,
    openTripFinder,
  } = useShowcase();
  const { isDark, toggleTheme } = useTheme();

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const labelId = useId();
  const listId = useId();
  const backdropRef = useRef(null);
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const listContainerRef = useRef(null);
  const closingRef = useRef(false);

  useScrollLock(true);

  // Close first so useScrollLock releases Lenis (`resumeScroll()`), then execute scroll/modal callback cleanly
  const closeThenRun = useCallback(
    (afterClose) => {
      onClose();
      window.requestAnimationFrame(() => {
        window.setTimeout(() => {
          afterClose?.();
        }, 45);
      });
    },
    [onClose]
  );

  const quickActions = useMemo(() => {
    const chapterActions = CHAPTERS.map((chapter) => ({
      id: `action-chapter-${chapter.id}`,
      kind: 'action',
      label: `Jump to ${chapter.number} ${chapter.title}`,
      subtitle: chapter.kicker,
      badge: `Chapter ${chapter.number}`,
      keywords: `chapter ${chapter.number} ${chapter.title} ${chapter.kicker} jump section`,
      icon: Compass,
      onSelect: () =>
        closeThenRun(() => {
          if (viewMode !== 'editorial') {
            setViewMode('editorial');
            window.setTimeout(() => scrollToTarget(`#${chapter.id}`, { offset: -148 }), 380);
          } else {
            scrollToTarget(`#${chapter.id}`, { offset: -148 });
          }
        }),
    }));

    return [
      {
        id: 'action-trip-finder',
        kind: 'action',
        label: 'Launch Smart Trip Finder',
        subtitle: '3-step interactive quiz to match your top 3 destinations',
        badge: '✦ Quiz',
        keywords: 'find my trip quiz itinerary recommend smart finder',
        icon: Sparkles,
        onSelect: () => closeThenRun(() => openTripFinder()),
      },
      {
        id: 'action-toggle-theme',
        kind: 'action',
        label: isDark ? 'Toggle Light Mode' : 'Toggle Dark Mode',
        subtitle: isDark ? 'Switch to crisp Slate editorial light palette' : 'Switch to Midnight Atlas dark palette',
        badge: isDark ? 'Light' : 'Dark',
        keywords: 'toggle dark light mode theme midnight appearance sun moon',
        icon: isDark ? Sun : Moon,
        onSelect: () =>
          closeThenRun(() =>
            toggleTheme({ x: window.innerWidth / 2, y: Math.min(240, window.innerHeight / 3) })
          ),
      },
      {
        id: 'action-view-editorial',
        kind: 'action',
        label: 'Switch View: Editorial',
        subtitle: 'Chapter-by-chapter scrollytelling bento showcase',
        badge: viewMode === 'editorial' ? 'Active' : 'View',
        keywords: 'switch view editorial chapters bento cards',
        icon: BookOpen,
        onSelect: () =>
          closeThenRun(() => {
            setViewMode('editorial');
            scrollToTarget(`#${SECTION_IDS.showcase}`, { offset: -88 });
          }),
      },
      {
        id: 'action-view-expo',
        kind: 'action',
        label: 'Switch View: Expo Bento',
        subtitle: 'High-density bento matrix with multi-tag division & season filters',
        badge: viewMode === 'expo' ? 'Active' : 'View',
        keywords: 'switch view expo bento matrix grid',
        icon: LayoutGrid,
        onSelect: () =>
          closeThenRun(() => {
            setViewMode('expo');
            scrollToTarget(`#${SECTION_IDS.showcase}`, { offset: -88 });
          }),
      },
      {
        id: 'action-view-index',
        kind: 'action',
        label: 'Switch View: Archive Index',
        subtitle: 'Swiss 01–48 destination directory with floating cursor photo preview',
        badge: viewMode === 'index' ? 'Active' : 'View',
        keywords: 'switch view index archive table list directory',
        icon: List,
        onSelect: () =>
          closeThenRun(() => {
            setViewMode('index');
            scrollToTarget(`#${SECTION_IDS.showcase}`, { offset: -88 });
          }),
      },
      {
        id: 'action-jump-atlas',
        kind: 'action',
        label: 'Jump to Coordinate Atlas Map',
        subtitle: 'Interactive d3-geo map of all 48 GPS pins & My Journey route',
        badge: 'Atlas',
        keywords: 'jump coordinate atlas map gps pins location',
        icon: MapIcon,
        onSelect: () => closeThenRun(() => scrollToTarget(`#${SECTION_IDS.atlas}`, { offset: -88 })),
      },
      ...chapterActions,
    ];
  }, [closeThenRun, isDark, openTripFinder, setViewMode, toggleTheme, viewMode]);

  const hasQuery = query.trim().length > 0;

  const matchedActions = useMemo(() => {
    if (!hasQuery) return quickActions;
    return quickActions
      .map((action) => ({ action, score: fuzzyScoreAction(action, query) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.action);
  }, [hasQuery, query, quickActions]);

  const matchedSpots = useMemo(() => {
    if (!hasQuery) return spots;
    return spots
      .map((spot) => ({ spot, score: fuzzyScoreSpot(spot, query) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.spot);
  }, [hasQuery, query, spots]);

  // Unified flat keyboard navigation list: when typing, prioritize matching destinations first then actions;
  // when query is empty, show Quick Actions first then all 48 destinations!
  const sections = useMemo(() => {
    const actionItems = matchedActions;
    const spotItems = matchedSpots.map((spot) => ({
      id: `spot-${spot.id}`,
      kind: 'spot',
      spot,
      onSelect: () => closeThenRun(() => openSpot(spot.id)),
    }));

    if (hasQuery) {
      return [
        ...(spotItems.length > 0 ? [{ key: 'spots', title: `Destinations (${spotItems.length})`, items: spotItems }] : []),
        ...(actionItems.length > 0 ? [{ key: 'actions', title: `Quick Actions (${actionItems.length})`, items: actionItems }] : []),
      ];
    }

    return [
      { key: 'actions', title: 'Quick Actions', items: actionItems },
      { key: 'spots', title: `All Destinations (${spotItems.length})`, items: spotItems },
    ];
  }, [closeThenRun, hasQuery, matchedActions, matchedSpots, openSpot]);

  const flatItems = useMemo(() => sections.flatMap((sec) => sec.items), [sections]);
  const clampedActiveIndex = flatItems.length > 0 ? Math.min(activeIndex, flatItems.length - 1) : 0;

  // Entrance animation + auto-focus search input
  useLayoutEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
    if (window.matchMedia(MEDIA.reduceMotion).matches) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.24, ease: 'power2.out' });
      gsap.fromTo(
        panelRef.current,
        { y: -16, scale: 0.97, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.3, ease: 'power3.out', clearProps: 'transform,opacity' }
      );
    });
    return () => ctx.revert();
  }, []);

  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    if (window.matchMedia(MEDIA.reduceMotion).matches) {
      onClose();
      return;
    }

    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(backdropRef.current, { opacity: 0, duration: 0.16, ease: 'power2.in' }, 0);
    tl.to(panelRef.current, { y: -10, scale: 0.98, opacity: 0, duration: 0.18, ease: 'power2.in' }, 0);
  }, [onClose]);

  // Keep active row scrolled smoothly inside list container
  useEffect(() => {
    const activeItem = flatItems[clampedActiveIndex];
    if (!activeItem || !listContainerRef.current) return;
    const rowEl = listContainerRef.current.querySelector(`[data-cmd-item="${activeItem.id}"]`);
    rowEl?.scrollIntoView({ block: 'nearest' });
  }, [clampedActiveIndex, flatItems]);

  // Escape key listener
  useEffect(() => {
    const prevFocus = document.activeElement;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        requestClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (prevFocus instanceof HTMLElement && prevFocus.isConnected) {
        prevFocus.focus({ preventScroll: true });
      }
    };
  }, [requestClose]);

  const handleInputKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (flatItems.length > 0) {
        setActiveIndex((prev) => (prev + 1) % flatItems.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (flatItems.length > 0) {
        setActiveIndex((prev) => (prev - 1 + flatItems.length) % flatItems.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = flatItems[clampedActiveIndex];
      target?.onSelect?.();
    }
  };

  let runningIndex = -1;

  return (
    <div
      data-command-palette
      className="fixed inset-0 z-[90] flex items-start justify-center px-3 pt-14 sm:px-5 sm:pt-[11vh]"
    >
      <div
        ref={backdropRef}
        onClick={requestClose}
        aria-hidden="true"
        className="absolute inset-0 bg-ink/45 backdrop-blur-md dark:bg-black/72"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        data-lenis-prevent
        className="glass relative z-10 flex max-h-[78svh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/85 bg-white/92 shadow-[0_40px_110px_-24px_rgba(15,23,42,0.58)] backdrop-blur-2xl sm:rounded-4xl dark:border-white/15 dark:bg-[#131C2E]/95 dark:shadow-[0_44px_120px_-24px_rgba(0,0,0,0.92)]"
      >
        <span id={labelId} className="sr-only">
          Spotlight Command Palette
        </span>

        {/* Top Spotlight Search Input Bar */}
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-line/85 px-4 sm:h-16 sm:px-5 dark:border-white/10">
          <Search className="h-4 w-4 shrink-0 text-bd-green sm:h-5 sm:w-5 dark:text-emerald-400" strokeWidth={2.2} aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            data-cmd-input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder={`Search ${spots.length} destinations, districts, seasons, or commands…`}
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={flatItems[clampedActiveIndex] ? `${listId}-${flatItems[clampedActiveIndex].id}` : undefined}
            className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-ink placeholder:text-mist focus:outline-none sm:text-base dark:text-slate-50"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setActiveIndex(0);
                inputRef.current?.focus();
              }}
              aria-label="Clear Spotlight query"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-line text-ink-soft hover:bg-haze dark:bg-white/10 dark:text-slate-200"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.3} />
            </button>
          )}

          <button
            type="button"
            data-cmd-close
            onClick={requestClose}
            aria-label="Close Spotlight Command Palette"
            className="rounded-lg border border-line bg-canvas px-2 py-1 font-mono text-[10px] font-bold tracking-wider text-mist uppercase transition hover:border-haze hover:text-ink dark:border-white/15 dark:bg-white/[0.06] dark:text-slate-300 dark:hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Results & Quick Actions Scrollable List */}
        <div
          id={listId}
          ref={listContainerRef}
          role="listbox"
          aria-label="Spotlight commands and destinations"
          data-lenis-prevent
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 sm:p-3"
        >
          {sections.length > 0 ? (
            sections.map((section) => (
              <div key={section.key} className="mb-3 last:mb-0">
                <p className="px-3 py-1.5 font-mono text-[10px] font-bold tracking-[0.22em] text-mist uppercase">
                  {section.title}
                </p>
                <div className="flex flex-col gap-0.5">
                  {section.items.map((item) => {
                    runningIndex += 1;
                    const itemFlatIdx = runningIndex;
                    const isHighlighted = itemFlatIdx === clampedActiveIndex;

                    if (item.kind === 'action') {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          id={`${listId}-${item.id}`}
                          type="button"
                          role="option"
                          aria-selected={isHighlighted}
                          data-cmd-item={item.id}
                          onMouseEnter={() => setActiveIndex(itemFlatIdx)}
                          onClick={item.onSelect}
                          className={`flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors duration-150 ${
                            isHighlighted
                              ? 'bg-ink text-white dark:bg-white dark:text-[#0B111E]'
                              : 'text-ink hover:bg-canvas dark:text-slate-100 dark:hover:bg-white/[0.06]'
                          }`}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <span
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                                isHighlighted
                                  ? 'bg-white/15 text-white dark:bg-[#0B111E]/12 dark:text-[#0B111E]'
                                  : 'bg-canvas text-ink dark:bg-white/[0.08] dark:text-emerald-300'
                              }`}
                            >
                              <Icon className="h-4 w-4" strokeWidth={2.1} aria-hidden="true" />
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold">{item.label}</p>
                              <p
                                className={`truncate text-xs ${
                                  isHighlighted ? 'text-white/70 dark:text-[#0B111E]/70' : 'text-mist'
                                }`}
                              >
                                {item.subtitle}
                              </p>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-2">
                            {item.badge && (
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                                  isHighlighted
                                    ? 'bg-white/20 text-white dark:bg-[#0B111E]/15 dark:text-[#0B111E]'
                                    : 'bg-canvas text-mist dark:bg-white/10 dark:text-slate-300'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                            <ArrowRight
                              className={`h-3.5 w-3.5 ${
                                isHighlighted ? 'opacity-100' : 'opacity-35'
                              }`}
                              strokeWidth={2.2}
                              aria-hidden="true"
                            />
                          </div>
                        </button>
                      );
                    }

                    const { spot } = item;
                    return (
                      <button
                        key={item.id}
                        id={`${listId}-${item.id}`}
                        type="button"
                        role="option"
                        aria-selected={isHighlighted}
                        data-cmd-item={item.id}
                        data-cmd-spot={spot.id}
                        onMouseEnter={() => setActiveIndex(itemFlatIdx)}
                        onClick={item.onSelect}
                        className={`flex w-full items-center justify-between gap-3 rounded-2xl px-2.5 py-2 text-left transition-colors duration-150 sm:px-3 ${
                          isHighlighted
                            ? 'bg-ink text-white dark:bg-white dark:text-[#0B111E]'
                            : 'text-ink hover:bg-canvas dark:text-slate-100 dark:hover:bg-white/[0.06]'
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <img
                            src={getImageSrc(spot.images.cover, 'thumb')}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="h-10 w-12 shrink-0 rounded-xl bg-line object-cover"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-sm font-bold">{spot.name}</p>
                              <span
                                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                  isHighlighted
                                    ? 'bg-white/20 text-white dark:bg-[#0B111E]/15 dark:text-[#0B111E]'
                                    : 'bg-canvas text-ink-soft dark:bg-white/10 dark:text-slate-300'
                                }`}
                              >
                                {spot.category}
                              </span>
                            </div>
                            <p
                              className={`truncate text-xs ${
                                isHighlighted ? 'text-white/75 dark:text-[#0B111E]/75' : 'text-mist'
                              }`}
                            >
                              {spot.district}, {spot.division} · Best: {getSeasonShort(spot)}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <span className="hidden sm:inline-flex">
                            <LiveWeatherPill
                              spot={spot}
                              variant="expo"
                              className={
                                isHighlighted
                                  ? '!border-white/30 !bg-white/15 !text-white dark:!border-[#0B111E]/25 dark:!bg-[#0B111E]/15 dark:!text-[#0B111E]'
                                  : '!border-line !bg-canvas !text-ink dark:!border-white/15 dark:!bg-white/10 dark:!text-slate-100'
                              }
                            />
                          </span>
                          <CornerDownLeft
                            className={`h-3.5 w-3.5 ${isHighlighted ? 'opacity-100' : 'opacity-30'}`}
                            strokeWidth={2.2}
                            aria-hidden="true"
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-12 text-center">
              <p className="font-display text-base font-bold text-ink dark:text-slate-100">
                No destinations or commands match “{query.trim()}”
              </p>
              <p className="mt-1 text-xs text-mist">
                Try a destination name, division (e.g., Sylhet), season (e.g., Winter), or “Trip Finder”.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Keyboard Legend Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-line/80 bg-canvas/60 px-4 py-2.5 text-[11px] text-mist sm:px-5 dark:border-white/10 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-line bg-white px-1.5 py-0.5 font-mono text-[10px] font-semibold text-ink dark:border-white/15 dark:bg-white/10 dark:text-slate-200">
                ↑↓
              </kbd>
              <span>Navigate</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-line bg-white px-1.5 py-0.5 font-mono text-[10px] font-semibold text-ink dark:border-white/15 dark:bg-white/10 dark:text-slate-200">
                ↵
              </kbd>
              <span>Select</span>
            </span>
            <span className="hidden items-center gap-1 sm:inline-flex">
              <kbd className="rounded border border-line bg-white px-1.5 py-0.5 font-mono text-[10px] font-semibold text-ink dark:border-white/15 dark:bg-white/10 dark:text-slate-200">
                ESC
              </kbd>
              <span>Close</span>
            </span>
          </div>
          <span className="font-mono text-[10px] font-semibold tracking-wider uppercase tabular-nums">
            {spots.length} Spots Indexed
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Global `Ctrl + K` / `Cmd + K` Spotlight Command Palette (`z-[90]`).
 */
export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, closeCommandPalette } = useShowcase();

  useEffect(() => {
    const onGlobalKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onGlobalKeyDown);
    return () => window.removeEventListener('keydown', onGlobalKeyDown);
  }, [setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;
  return createPortal(<CommandPaletteDialog onClose={closeCommandPalette} />, document.body);
}

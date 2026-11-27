import { useEffect, useLayoutEffect, useRef } from 'react';
import { ArrowUp, BookOpen, LayoutGrid, List, Map, Sparkles, X } from 'lucide-react';
import { CHAPTERS, SECTION_IDS } from '@data';
import { useScrollLock, useShowcase } from '@hooks';
import { gsap, MEDIA, scrollToTarget } from '@animations';
import { countByCategory } from '@utils';
import { SearchBar } from '../search/SearchBar.jsx';
import { ThemeToggle } from '../ui/ThemeToggle.jsx';

const MOBILE_VIEW_MODES = [
  { key: 'editorial', label: 'Editorial', icon: BookOpen },
  { key: 'expo', label: 'Expo Bento', icon: LayoutGrid },
  { key: 'index', label: 'Index', icon: List },
];

/** Slide-down mobile menu drawer (< md) with sequential level link stagger. */
export function MobileMenu({ open, onClose }) {
  const { spots, viewMode, setViewMode, openTripFinder } = useShowcase();
  const drawerRef = useRef(null);
  const closeRef = useRef(null);
  const counts = countByCategory(spots);

  useScrollLock(open);

  useEffect(() => {
    if (!open) return undefined;
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Sequential level slide animation whenever the mobile drawer opens
  useLayoutEffect(() => {
    if (!open || !drawerRef.current) return undefined;
    const reduce = window.matchMedia(MEDIA.reduceMotion).matches;
    if (reduce) return undefined;

    const ctx = gsap.context(() => {
      const items = drawerRef.current.querySelectorAll('[data-mobile-nav-item]');
      gsap.fromTo(
        items,
        { x: -18, y: 10, opacity: 0 },
        {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 0.45,
          stagger: 0.04,
          ease: 'power3.out',
          overwrite: 'auto',
          clearProps: 'transform,opacity',
        }
      );
    }, drawerRef);

    return () => ctx.revert();
  }, [open]);

  /** Close first, then scroll once the scroll lock has been released. */
  const navigate = (target, beforeScroll, scrollOpts) => {
    onClose();
    window.setTimeout(() => {
      beforeScroll?.();
      scrollToTarget(target, scrollOpts);
    }, 120);
  };

  return (
    <div
      id="mobile-menu"
      className={`fixed inset-0 z-[60] md:hidden ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
      inert={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-ink/30 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`absolute inset-x-3 top-3 max-h-[calc(100svh-1.5rem)] overflow-y-auto overscroll-contain rounded-4xl border border-white/70 bg-canvas p-4 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.6)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] dark:border-white/10 dark:bg-[#0B111E] dark:shadow-[0_30px_80px_-30px_rgba(0,0,0,0.85)] ${
          open ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'
        }`}
        data-lenis-prevent
      >
        <div data-mobile-nav-item className="flex items-center justify-between pl-2 will-change-transform">
          <span className="font-display text-sm font-bold tracking-[0.18em] text-mist uppercase">Menu</span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white transition-colors active:scale-95 dark:bg-white dark:text-[#0B111E]"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <div data-mobile-nav-item className="mt-4 will-change-transform">
          <SearchBar inline onNavigate={onClose} />
        </div>

        <button
          type="button"
          data-mobile-nav-item
          onClick={() => {
            onClose();
            window.setTimeout(() => openTripFinder(), 100);
          }}
          className="mt-2.5 flex w-full items-center justify-between rounded-3xl border border-emerald-600/25 bg-emerald-500/[0.08] px-4 py-3 text-left transition-colors will-change-transform active:scale-[0.99] dark:border-emerald-400/30 dark:bg-emerald-400/[0.12]"
        >
          <span className="flex items-center gap-2 text-sm font-bold text-ink dark:text-emerald-100">
            <Sparkles className="h-4 w-4 text-bd-green dark:text-emerald-300" strokeWidth={2.2} />
            <span>✦ Find My Trip Quiz</span>
          </span>
          <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-[11px] font-semibold text-ink-soft dark:bg-white/10 dark:text-emerald-200">
            3 Steps
          </span>
        </button>

        <div
          data-mobile-nav-item
          className="mt-4 rounded-3xl border border-line bg-white p-3 transition-colors duration-300 will-change-transform dark:border-white/10 dark:bg-[#131C2E]"
        >
          <p className="px-1 text-xs font-semibold tracking-[0.16em] text-mist uppercase">Collection View</p>
          <div
            role="radiogroup"
            aria-label="Collection view mode"
            className="mt-2 grid grid-cols-3 gap-1 rounded-2xl bg-canvas p-1 dark:bg-white/[0.05]"
          >
            {MOBILE_VIEW_MODES.map(({ key, label, icon: Icon }) => {
              const selected = viewMode === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => navigate(`#${SECTION_IDS.showcase}`, () => setViewMode(key))}
                  className={`flex items-center justify-center gap-1 rounded-xl px-1.5 py-2.5 text-[11px] font-semibold whitespace-nowrap transition-colors active:scale-95 sm:gap-1.5 sm:px-2 sm:text-xs ${
                    selected
                      ? 'bg-ink text-white shadow-xs dark:bg-white dark:text-[#0B111E]'
                      : 'text-ink-soft hover:text-ink dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          data-mobile-nav-item
          className="mt-2.5 flex items-center justify-between rounded-3xl border border-line bg-white p-2 pl-4 transition-colors duration-300 will-change-transform dark:border-white/10 dark:bg-[#131C2E]"
        >
          <div>
            <p className="text-sm font-semibold text-ink dark:text-slate-50">Midnight Atlas</p>
            <p className="text-xs text-mist">Switch between light &amp; dark theme</p>
          </div>
          <ThemeToggle showLabel />
        </div>

        <nav aria-label="Chapters" className="mt-4 grid grid-cols-2 gap-2">
          {CHAPTERS.map((chapter) => (
            <button
              key={chapter.id}
              type="button"
              data-mobile-nav-item
              onClick={() =>
                navigate(
                  viewMode !== 'editorial' ? `#${SECTION_IDS.showcase}` : `#${chapter.id}`,
                  () => {
                    if (viewMode !== 'editorial') setViewMode('editorial');
                  },
                  viewMode !== 'editorial' ? undefined : { offset: -148 }
                )
              }
              className="flex flex-col items-start rounded-3xl border border-line bg-white p-4 text-left transition-colors duration-300 will-change-transform active:scale-95 dark:border-white/10 dark:bg-[#131C2E]"
            >
              <span className="font-display text-xs font-bold text-mist">{chapter.number}</span>
              <span className="mt-1 font-display text-xl font-black tracking-tight text-ink dark:text-slate-50">
                {chapter.title}
              </span>
              <span className="mt-1 text-xs text-mist">{counts[chapter.category] ?? 0} destinations</span>
            </button>
          ))}
        </nav>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            data-mobile-nav-item
            onClick={() => navigate(`#${SECTION_IDS.atlas}`)}
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white transition-colors will-change-transform active:scale-95 dark:bg-white dark:text-[#0B111E]"
          >
            <Map className="h-4 w-4" strokeWidth={2} />
            Explore Map
          </button>
          <button
            type="button"
            data-mobile-nav-item
            onClick={() => navigate(0)}
            className="flex h-12 items-center justify-center gap-2 rounded-full border border-line bg-white text-sm font-semibold text-ink transition-colors will-change-transform active:scale-95 dark:border-white/10 dark:bg-[#131C2E] dark:text-slate-100"
          >
            <ArrowUp className="h-4 w-4" strokeWidth={2} />
            Back to Top
          </button>
        </div>
      </div>
    </div>
  );
}

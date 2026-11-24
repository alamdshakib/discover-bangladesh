import { useEffect, useRef } from 'react';
import { ArrowUp, Map, X } from 'lucide-react';
import { CHAPTERS, SECTION_IDS } from '@data';
import { useScrollLock, useShowcase } from '@hooks';
import { scrollToTarget } from '@animations';
import { countByCategory } from '@utils';
import { SearchBar } from '../search/SearchBar.jsx';
import { ExpoSwitch } from '../ui/ExpoSwitch.jsx';

/** Slide-down mobile menu drawer (< md). */
export function MobileMenu({ open, onClose }) {
  const { spots, expoMode, setExpoMode } = useShowcase();
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

  /** Close first, then scroll once the scroll lock has been released. */
  const navigate = (target, beforeScroll) => {
    onClose();
    window.setTimeout(() => {
      beforeScroll?.();
      scrollToTarget(target);
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
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`absolute inset-x-3 top-3 max-h-[calc(100svh-1.5rem)] overflow-y-auto overscroll-contain rounded-4xl border border-white/70 bg-canvas p-4 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.6)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'
        }`}
        data-lenis-prevent
      >
        <div className="flex items-center justify-between pl-2">
          <span className="font-display text-sm font-bold tracking-[0.18em] text-mist uppercase">Menu</span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white transition active:scale-95"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <SearchBar inline onNavigate={onClose} className="mt-4" />

        <div className="mt-4 flex items-center justify-between rounded-3xl border border-line bg-white p-2 pl-4">
          <div>
            <p className="text-sm font-semibold text-ink">Expo Mode</p>
            <p className="text-xs text-mist">High-density bento matrix with filters</p>
          </div>
          <ExpoSwitch
            checked={expoMode}
            onChange={(value) => navigate(`#${SECTION_IDS.showcase}`, () => setExpoMode(value))}
          />
        </div>

        <nav aria-label="Chapters" className="mt-4 grid grid-cols-2 gap-2">
          {CHAPTERS.map((chapter) => (
            <button
              key={chapter.id}
              type="button"
              onClick={() =>
                navigate(expoMode ? `#${SECTION_IDS.showcase}` : `#${chapter.id}`, () => {
                  if (expoMode) setExpoMode(false);
                })
              }
              className="flex flex-col items-start rounded-3xl border border-line bg-white p-4 text-left transition active:scale-95"
            >
              <span className="font-display text-xs font-bold text-mist">{chapter.number}</span>
              <span className="mt-1 font-display text-xl font-black tracking-tight text-ink">{chapter.title}</span>
              <span className="mt-1 text-xs text-mist">{counts[chapter.category] ?? 0} destinations</span>
            </button>
          ))}
        </nav>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => navigate(`#${SECTION_IDS.atlas}`)}
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white transition active:scale-95"
          >
            <Map className="h-4 w-4" strokeWidth={2} />
            Explore Map
          </button>
          <button
            type="button"
            onClick={() => navigate(0)}
            className="flex h-12 items-center justify-center gap-2 rounded-full border border-line bg-white text-sm font-semibold text-ink transition active:scale-95"
          >
            <ArrowUp className="h-4 w-4" strokeWidth={2} />
            Back to Top
          </button>
        </div>
      </div>
    </div>
  );
}

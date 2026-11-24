import { useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * Sticky glassmorphic chapter index (01–04) with live count badges.
 * Horizontally scrollable with snap on small screens.
 */
export function ChapterDock({ chapters, counts, activeId, expoMode, onJump, onTop }) {
  const trackRef = useRef(null);

  // Keep the active pill visible inside the horizontally scrollable track.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !activeId) return;
    const pill = track.querySelector(`[data-chapter-pill="${activeId}"]`);
    if (!pill) return;
    const left = pill.offsetLeft - track.clientWidth / 2 + pill.clientWidth / 2;
    track.scrollTo({ left, behavior: 'smooth' });
  }, [activeId]);

  return (
    <div className="pointer-events-none sticky top-[76px] z-40 flex justify-center px-3 sm:top-[84px] sm:px-5">
      <nav
        aria-label="Chapter index"
        className="glass pointer-events-auto max-w-full rounded-full border border-white/70 p-1.5 shadow-[0_18px_40px_-22px_rgba(15,23,42,0.45)] transition-colors duration-300 dark:border-white/10 dark:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.8)]"
      >
        <div ref={trackRef} className="no-scrollbar flex snap-x snap-mandatory items-center gap-1 overflow-x-auto">
          {expoMode && (
            <span className="flex shrink-0 snap-start items-center gap-1.5 rounded-full bg-ink px-3 py-2 text-xs font-semibold tracking-wide text-white dark:bg-white dark:text-[#0B111E]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-bd-red" aria-hidden="true" />
              Expo
            </span>
          )}

          {chapters.map((chapter) => {
            const isActive = !expoMode && activeId === chapter.id;
            return (
              <button
                key={chapter.id}
                type="button"
                data-chapter-pill={chapter.id}
                onClick={() => onJump(chapter)}
                aria-current={isActive ? 'true' : undefined}
                className={`flex shrink-0 snap-start items-center gap-2 rounded-full py-2 pr-2 pl-3 text-sm font-semibold transition-colors duration-300 active:scale-95 ${
                  isActive
                    ? 'bg-ink text-white dark:bg-white dark:text-[#0B111E]'
                    : 'text-ink hover:bg-white dark:text-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <span
                  className={`font-display text-[11px] font-bold ${
                    isActive ? 'text-white/60 dark:text-[#0B111E]/60' : 'text-mist'
                  }`}
                >
                  {chapter.number}
                </span>
                {chapter.title}
                <span
                  className={`min-w-[1.5rem] rounded-full px-1.5 py-0.5 text-center text-[11px] font-bold tabular-nums ${
                    isActive
                      ? 'bg-white/20 text-white dark:bg-[#0B111E]/15 dark:text-[#0B111E]'
                      : 'bg-ink/[0.07] text-ink-soft dark:bg-white/10 dark:text-slate-300'
                  }`}
                >
                  {counts[chapter.category] ?? 0}
                </span>
              </button>
            );
          })}

          <span className="mx-0.5 h-6 w-px shrink-0 bg-haze dark:bg-white/15" aria-hidden="true" />

          <button
            type="button"
            onClick={onTop}
            className="flex shrink-0 snap-start items-center gap-1.5 rounded-full border border-line bg-white px-3 py-2 text-sm font-semibold text-ink transition-colors duration-300 hover:bg-canvas active:scale-95 dark:border-white/10 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15"
          >
            <ArrowUp className="h-3.5 w-3.5" strokeWidth={2.4} />
            Top
          </button>
        </div>
      </nav>
    </div>
  );
}

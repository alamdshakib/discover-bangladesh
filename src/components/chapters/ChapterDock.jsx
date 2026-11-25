import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { gsap, MEDIA, ScrollTrigger } from '@animations';

/**
 * Sticky glassmorphic chapter index (01–04) with a gliding liquid glass pill,
 * sentinel-tracked pinned frost/elevation transition under the Navbar at `top-[72px]`.
 */
export function ChapterDock({ chapters, counts, activeId, expoMode, onJump, onTop }) {
  const trackRef = useRef(null);
  const indicatorRef = useRef(null);
  const sentinelRef = useRef(null);
  const hasPositionedRef = useRef(false);
  const [pinned, setPinned] = useState(false);

  // Detect the exact moment the dock becomes pinned at `top-[72px]` below the Navbar
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return undefined;

    const trigger = ScrollTrigger.create({
      trigger: sentinel,
      start: 'top 74px',
      end: 'max',
      onEnter: () => setPinned(true),
      onLeaveBack: () => setPinned(false),
    });

    const syncInitial = () => setPinned(sentinel.getBoundingClientRect().top <= 74);
    syncInitial();

    return () => trigger.kill();
  }, []);

  // Keep the active pill centered inside the horizontally scrollable track on mobile.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !activeId) return;
    const pill = track.querySelector(`[data-chapter-pill="${activeId}"]`);
    if (!pill) return;
    const left = pill.offsetLeft - track.clientWidth / 2 + pill.clientWidth / 2;
    track.scrollTo({ left, behavior: 'smooth' });
  }, [activeId]);

  // Smoothly glide & liquid-morph the active glass pill across chapters.
  useLayoutEffect(() => {
    const track = trackRef.current;
    const indicator = indicatorRef.current;
    if (!track || !indicator) return undefined;

    const reduce = window.matchMedia(MEDIA.reduceMotion).matches;

    const syncIndicator = (instant = false) => {
      if (expoMode || !activeId) {
        gsap.to(indicator, { opacity: 0, duration: reduce || instant ? 0 : 0.25, overwrite: 'auto' });
        return;
      }
      const pill = track.querySelector(`[data-chapter-pill="${activeId}"]`);
      if (!pill) {
        gsap.to(indicator, { opacity: 0, duration: 0.2, overwrite: 'auto' });
        return;
      }

      const x = pill.offsetLeft;
      const width = pill.offsetWidth;
      const height = pill.offsetHeight;

      if (!hasPositionedRef.current || reduce || instant) {
        hasPositionedRef.current = true;
        gsap.set(indicator, { x, width, height, scaleX: 1, opacity: 1 });
      } else {
        const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });
        tl.to(
          indicator,
          {
            x,
            width,
            height,
            opacity: 1,
            duration: 0.48,
            ease: 'power3.out',
          },
          0
        );
        // Subtle liquid stretch pulse during glide
        tl.fromTo(
          indicator,
          { scaleX: 1 },
          { scaleX: 1.07, duration: 0.16, ease: 'power2.out', yoyo: true, repeat: 1 },
          0
        );
      }
    };

    syncIndicator(false);

    const onResize = () => syncIndicator(true);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, [activeId, expoMode]);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />
      <div className="pointer-events-none sticky top-[72px] z-40 flex justify-center px-3 sm:px-5">
        <nav
          data-chapter-dock
          data-pinned={pinned ? 'true' : 'false'}
          aria-label="Chapter index"
          className={`glass pointer-events-auto max-w-full rounded-full border p-1.5 transition-[transform,background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-out ${
            pinned
              ? 'scale-[0.97] border-white/90 bg-white/88 shadow-[0_22px_48px_-18px_rgba(15,23,42,0.48)] backdrop-blur-2xl dark:border-emerald-400/25 dark:bg-[#131C2E]/92 dark:shadow-[0_24px_52px_-18px_rgba(0,0,0,0.88)]'
              : 'scale-100 border-white/70 shadow-[0_18px_40px_-22px_rgba(15,23,42,0.45)] dark:border-white/10 dark:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.8)]'
          }`}
        >
          <div ref={trackRef} className="no-scrollbar relative flex snap-x snap-mandatory items-center gap-1 overflow-x-auto">
            {/* Gliding liquid glass active chapter pill */}
            <span
              ref={indicatorRef}
              data-chapter-liquid-pill
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-0 z-0 rounded-full border border-white/20 bg-ink/95 opacity-0 shadow-[0_8px_22px_-8px_rgba(15,23,42,0.55)] backdrop-blur-md transition-colors duration-300 will-change-transform dark:border-white/40 dark:bg-white/95 dark:shadow-[0_8px_22px_-8px_rgba(255,255,255,0.35)]"
            />

            {expoMode && (
              <span className="relative z-10 flex shrink-0 snap-start items-center gap-1.5 rounded-full bg-ink px-3 py-2 text-xs font-semibold tracking-wide text-white dark:bg-white dark:text-[#0B111E]">
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
                  data-cursor="magnetic"
                  onClick={() => onJump(chapter)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative z-10 flex shrink-0 snap-start items-center gap-2 rounded-full py-2 pr-2 pl-3 text-sm font-semibold transition-colors duration-300 active:scale-95 ${
                    isActive
                      ? 'text-white dark:text-[#0B111E]'
                      : 'text-ink hover:bg-white/60 dark:text-slate-200 dark:hover:bg-white/10'
                  }`}
                >
                  <span
                    className={`font-display text-[11px] font-bold transition-colors duration-300 ${
                      isActive ? 'text-white/60 dark:text-[#0B111E]/60' : 'text-mist'
                    }`}
                  >
                    {chapter.number}
                  </span>
                  {chapter.title}
                  <span
                    className={`min-w-[1.5rem] rounded-full px-1.5 py-0.5 text-center text-[11px] font-bold tabular-nums transition-colors duration-300 ${
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

            <span className="relative z-10 mx-0.5 h-6 w-px shrink-0 bg-haze dark:bg-white/15" aria-hidden="true" />

            <button
              type="button"
              data-cursor="magnetic"
              onClick={onTop}
              className="relative z-10 flex shrink-0 snap-start items-center gap-1.5 rounded-full border border-line bg-white px-3 py-2 text-sm font-semibold text-ink transition-colors duration-300 hover:bg-canvas active:scale-95 dark:border-white/10 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15"
            >
              <ArrowUp className="h-3.5 w-3.5" strokeWidth={2.4} />
              Top
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}

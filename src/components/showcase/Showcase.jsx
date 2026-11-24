import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, LayoutGrid } from 'lucide-react';
import { CHAPTERS, SECTION_IDS, SPOT_CATEGORIES } from '@data';
import { useActiveSection, useShowcase } from '@hooks';
import { gsap, ScrollTrigger, scrollToTarget } from '@animations';
import { countByCategory, groupByCategory } from '@utils';
import { ChapterDock } from '../chapters/ChapterDock.jsx';
import { ChapterSection } from '../chapters/ChapterSection.jsx';
import { ExpoMatrix } from '../spots/ExpoMatrix.jsx';

const CHAPTER_IDS = CHAPTERS.map((c) => c.id);

/**
 * Dual-view showcase: Editorial scrollytelling (default) ⇄ Expo bento matrix.
 * The visible view (`displayMode`) trails the requested mode so the swap can fade out/in.
 */
export function Showcase() {
  const { spots, expoMode, setExpoMode, openSpot } = useShowcase();
  const requestedMode = expoMode ? 'expo' : 'editorial';
  const [displayMode, setDisplayMode] = useState(requestedMode);
  const viewRef = useRef(null);
  const pendingTarget = useRef(null);
  const isFirstRender = useRef(true);

  const grouped = useMemo(() => groupByCategory(spots, SPOT_CATEGORIES), [spots]);
  const counts = useMemo(() => countByCategory(spots), [spots]);
  const activeChapter = useActiveSection(CHAPTER_IDS, { enabled: displayMode === 'editorial' });

  // Fade the current view out, then swap.
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (requestedMode === displayMode) {
      gsap.to(view, { opacity: 1, y: 0, duration: reduce ? 0 : 0.45, ease: 'power3.out', overwrite: true });
      return undefined;
    }

    const tween = gsap.to(view, {
      opacity: 0,
      y: 24,
      duration: reduce ? 0 : 0.3,
      ease: 'power2.in',
      overwrite: true,
      onComplete: () => setDisplayMode(requestedMode),
    });
    return () => tween.kill();
  }, [requestedMode, displayMode]);

  // After a swap: recompute triggers and bring the new view into position.
  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    ScrollTrigger.refresh();
    const target = pendingTarget.current ?? `#${SECTION_IDS.showcase}`;
    const isChapter = Boolean(pendingTarget.current);
    pendingTarget.current = null;
    const element = document.querySelector(target);
    // Jump instantly while the view is faded out if we're already inside the showcase;
    // otherwise glide down to it.
    const alreadyPast = element ? element.getBoundingClientRect().top < 0 : false;
    scrollToTarget(target, { offset: isChapter ? -140 : -88, immediate: alreadyPast });
  }, [displayMode]);

  const jumpToChapter = (chapter) => {
    if (expoMode || displayMode === 'expo') {
      pendingTarget.current = `#${chapter.id}`;
      setExpoMode(false);
      return;
    }
    scrollToTarget(`#${chapter.id}`, { offset: -140 });
  };

  return (
    <section id={SECTION_IDS.showcase} aria-label="Destinations" className="relative mt-16 scroll-mt-24 sm:mt-24">
      <div className="mx-auto max-w-[1600px] px-3 sm:px-5">
        <div className="flex flex-col gap-5 px-1 pb-6 sm:px-3 lg:flex-row lg:items-end lg:justify-between lg:pb-8">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.24em] text-mist uppercase">The Collection</p>
            <h2
              className="mt-2 font-display leading-[0.9] font-black tracking-[-0.05em] text-ink transition-colors duration-300 dark:text-slate-50"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 5.5rem)' }}
            >
              24 places, four chapters.
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
      </div>

      <ChapterDock
        chapters={CHAPTERS}
        counts={counts}
        activeId={activeChapter}
        expoMode={displayMode === 'expo'}
        onJump={jumpToChapter}
        onTop={() => scrollToTarget(0, { offset: 0 })}
      />

      <div ref={viewRef} className="mx-auto mt-4 max-w-[1600px] px-3 sm:mt-6 sm:px-5">
        {displayMode === 'editorial' ? (
          <div className="flex flex-col gap-16 sm:gap-20 lg:gap-28">
            {CHAPTERS.map((chapter) => (
              <ChapterSection key={chapter.id} chapter={chapter} spots={grouped[chapter.category]} onOpen={openSpot} />
            ))}
          </div>
        ) : (
          <ExpoMatrix spots={spots} onOpen={openSpot} />
        )}
      </div>
    </section>
  );
}

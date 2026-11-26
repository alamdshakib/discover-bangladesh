import { useLayoutEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { gsap, MEDIA, ScrollTrigger } from '@animations';
import { getBentoSpans } from '@utils';
import { ChapterHeader } from './ChapterHeader.jsx';
import { SpotCard } from '../spots/SpotCard.jsx';

const DEFAULT_VISIBLE = 6;

export function ChapterSection({ chapter, spots, isFiltered = false, onOpen }) {
  const scopeRef = useRef(null);
  const expandBtnRef = useRef(null);
  const hasToggledRef = useRef(false);
  const extraCtxRef = useRef(null);
  const [expanded, setExpanded] = useState(false);

  const hasOverflow = !isFiltered && spots.length > DEFAULT_VISIBLE;
  const isExpanded = expanded && hasOverflow;
  const visibleSpots = hasOverflow && !isExpanded ? spots.slice(0, DEFAULT_VISIBLE) : spots;
  const hiddenCount = Math.max(0, spots.length - DEFAULT_VISIBLE);
  const spans = getBentoSpans(visibleSpots.length);
  const coverUrl = spots[1]?.images.cover ?? spots[0]?.images.cover;
  const baseKey = `${isFiltered ? 'filtered' : 'default'}:${spots
    .slice(0, isFiltered ? spots.length : DEFAULT_VISIBLE)
    .map((s) => s.id)
    .join(',')}`;

  // 1. Chapter Banner ScrollTrigger choreography (independent of Show More state)
  useLayoutEffect(() => {
    const mm = gsap.matchMedia(scopeRef);

    mm.add(MEDIA.motion, () => {
      const scope = scopeRef.current;
      const banner = scope.querySelector('[data-chapter-banner]');
      const glow = scope.querySelector('[data-chapter-glow]');
      const numberScrub = scope.querySelector('[data-chapter-number-scrub]');
      const titleScrub = scope.querySelector('[data-chapter-title-scrub]');
      const bgScrub = scope.querySelector('[data-chapter-bg]');
      const bannerDesc = scope.querySelector('[data-chapter-desc]');
      const contours = scope.querySelectorAll('[data-chapter-contour]');
      const rule = scope.querySelector('[data-chapter-rule]');
      const headlineMasks = scope.querySelectorAll('[data-chapter-number], [data-chapter-title], [data-chapter-word]');

      if (!banner) return;

      const expandTl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: banner,
          start: 'top 95%',
          end: 'top 25%',
          scrub: 0.7,
        },
      });

      expandTl.fromTo(banner, { scale: 0.93, transformOrigin: 'center top' }, { scale: 1, immediateRender: false }, 0);

      if (glow) {
        expandTl.fromTo(
          glow,
          { opacity: 0.25, xPercent: -12 },
          { opacity: 0.95, xPercent: 8, immediateRender: false },
          0
        );
      }

      const innerScrubTl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: banner,
          start: 'top 95%',
          end: 'bottom 20%',
          scrub: 0.8,
        },
      });

      if (numberScrub) {
        innerScrubTl.fromTo(numberScrub, { x: -24 }, { x: 0, immediateRender: false }, 0);
      }
      if (titleScrub) {
        innerScrubTl.fromTo(titleScrub, { x: 20 }, { x: 0, immediateRender: false }, 0);
      }
      if (bgScrub) {
        innerScrubTl.fromTo(bgScrub, { yPercent: -10 }, { yPercent: 10, immediateRender: false }, 0);
      }

      const detailsTl = gsap.timeline({
        scrollTrigger: {
          trigger: banner,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
          fastScrollEnd: true,
        },
      });

      if (contours.length > 0) {
        contours.forEach((path) => {
          const len = typeof path.getTotalLength === 'function' ? path.getTotalLength() : 1400;
          detailsTl.fromTo(
            path,
            { strokeDasharray: len, strokeDashoffset: len },
            { strokeDashoffset: 0, duration: 1.35, ease: 'power2.out', immediateRender: false },
            0
          );
        });
      }

      if (rule) {
        detailsTl.fromTo(
          rule,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.9, ease: 'power3.out', transformOrigin: 'left center', immediateRender: false },
          0.05
        );
      }

      if (headlineMasks.length > 0) {
        detailsTl.fromTo(
          headlineMasks,
          { yPercent: 90, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.045,
            ease: 'power4.out',
            immediateRender: false,
          },
          0.08
        );
      }

      if (bannerDesc) {
        detailsTl.fromTo(
          bannerDesc,
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.78, ease: 'power3.out', immediateRender: false },
          0.16
        );
      }
    });

    return () => mm.revert();
  }, []);

  // 2. Destination Cards — Bidirectional Level Entrance + Continuous Scrubbed Photo Parallax (first 6 / filtered)
  useLayoutEffect(() => {
    const mm = gsap.matchMedia(scopeRef);

    mm.add(MEDIA.motion, () => {
      const scope = scopeRef.current;
      const allWraps = [...scope.querySelectorAll('[data-spot-card-wrap]')];
      const baseWraps = isFiltered ? allWraps : allWraps.slice(0, DEFAULT_VISIBLE);

      baseWraps.forEach((wrap) => {
        const shutter = wrap.querySelector('[data-card-shutter]');
        const media = wrap.querySelector('[data-card-media]');

        const cardTl = gsap.timeline({
          scrollTrigger: {
            trigger: wrap,
            start: 'top 92%',
            toggleActions: 'play none none reverse',
            fastScrollEnd: true,
          },
        });

        cardTl.fromTo(
          wrap,
          { y: 50, opacity: 0, scale: 0.97 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.65,
            ease: 'power3.out',
            immediateRender: false,
          },
          0
        );

        if (shutter) {
          cardTl.fromTo(
            shutter,
            { clipPath: 'inset(12% 0% 0% 0% round 2rem 2rem 0 0)' },
            {
              clipPath: 'inset(0% 0% 0% 0% round 2rem 2rem 0 0)',
              duration: 0.7,
              ease: 'power3.out',
              immediateRender: false,
            },
            0
          );
        }

        if (media) {
          gsap.fromTo(
            media,
            { yPercent: -7 },
            {
              yPercent: 7,
              ease: 'none',
              immediateRender: false,
              scrollTrigger: {
                trigger: wrap,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        }
      });
    });

    return () => mm.revert();
  }, [baseKey, isFiltered]);

  // 3. Staggered Level Entrance for expanded overflow cards (+6) + immediate ScrollTrigger.refresh()
  useLayoutEffect(() => {
    extraCtxRef.current?.revert();
    extraCtxRef.current = null;

    if (!hasToggledRef.current) return undefined;
    const scope = scopeRef.current;
    if (!scope) return undefined;

    const reduce = window.matchMedia(MEDIA.reduceMotion).matches;

    if (isExpanded && !reduce) {
      const extraWraps = [...scope.querySelectorAll('[data-spot-card-wrap]')].slice(DEFAULT_VISIBLE);
      if (extraWraps.length > 0) {
        extraCtxRef.current = gsap.context(() => {
          gsap.fromTo(
            extraWraps,
            { y: 36, opacity: 0, scale: 0.97 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.56,
              stagger: 0.055,
              ease: 'power3.out',
              overwrite: 'auto',
              clearProps: 'transform,opacity',
            }
          );

          extraWraps.forEach((wrap) => {
            const shutter = wrap.querySelector('[data-card-shutter]');
            const media = wrap.querySelector('[data-card-media]');

            if (shutter) {
              gsap.fromTo(
                shutter,
                { clipPath: 'inset(10% 0% 0% 0% round 2rem 2rem 0 0)' },
                {
                  clipPath: 'inset(0% 0% 0% 0% round 2rem 2rem 0 0)',
                  duration: 0.62,
                  ease: 'power3.out',
                  clearProps: 'clipPath',
                }
              );
            }

            if (media) {
              gsap.fromTo(
                media,
                { yPercent: -7 },
                {
                  yPercent: 7,
                  ease: 'none',
                  immediateRender: false,
                  scrollTrigger: {
                    trigger: wrap,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                  },
                }
              );
            }
          });
        }, scopeRef);
      }
    }

    const refreshRaf = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      window.cancelAnimationFrame(refreshRaf);
      extraCtxRef.current?.revert();
      extraCtxRef.current = null;
    };
  }, [isExpanded]);

  const handleToggleExpand = () => {
    hasToggledRef.current = true;
    setExpanded((prev) => !prev);
  };

  return (
    <section id={chapter.id} ref={scopeRef} aria-labelledby={`${chapter.id}-title`} className="scroll-mt-40">
      <span id={`${chapter.id}-title`} className="sr-only">
        Chapter {chapter.number}: {chapter.title}
      </span>
      <ChapterHeader chapter={chapter} count={spots.length} coverUrl={coverUrl} />

      <div
        data-chapter-grid
        className="mt-3 grid grid-cols-1 gap-3 sm:mt-4 sm:gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-5"
      >
        {visibleSpots.map((spot, i) => (
          <SpotCard
            key={spot.id}
            spot={spot}
            span={spans[i]}
            label={`${chapter.number}.${String(i + 1).padStart(2, '0')} · ${chapter.title}`}
            onOpen={onOpen}
          />
        ))}
      </div>

      {hasOverflow && (
        <div className="mt-6 flex justify-center sm:mt-8">
          <button
            ref={expandBtnRef}
            type="button"
            data-chapter-expand={chapter.id}
            data-cursor="magnetic"
            aria-expanded={isExpanded}
            onClick={handleToggleExpand}
            className="glass inline-flex items-center gap-2 rounded-full border border-white/80 px-5 py-3 text-xs font-semibold tracking-wide text-ink shadow-[0_14px_34px_-16px_rgba(15,23,42,0.32)] transition-[transform,background-color,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-haze hover:shadow-[0_18px_40px_-16px_rgba(15,23,42,0.4)] active:scale-95 dark:border-white/15 dark:text-slate-100 dark:hover:border-white/30 dark:shadow-[0_14px_34px_-16px_rgba(0,0,0,0.85)] sm:px-6 sm:py-3.5 sm:text-sm"
          >
            {isExpanded ? (
              <>
                <span>Show less</span>
                <ChevronUp className="h-4 w-4 text-bd-green dark:text-emerald-400" strokeWidth={2.2} />
              </>
            ) : (
              <>
                <span>
                  Show all {spots.length} in {chapter.title} (+{hiddenCount})
                </span>
                <ChevronDown className="h-4 w-4 text-bd-green dark:text-emerald-400" strokeWidth={2.2} />
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
}

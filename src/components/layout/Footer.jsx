import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUp, Crosshair } from 'lucide-react';
import { CHAPTERS, SITE_META } from '@data';
import { useMagnetic, useShowcase } from '@hooks';
import { gsap, MEDIA, scrollToTarget } from '@animations';

const WORDMARK_LETTERS = 'BANGLADESH'.split('');

const BASE_GRADIENT = 'linear-gradient(180deg, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0.05) 100%)';
const GLOW_GRADIENT = 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(226, 232, 240, 0.62) 100%)';

export function Footer() {
  const { spots, expoMode, setExpoMode } = useShowcase();
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const footerRef = useRef(null);
  const arrowRef = useRef(null);
  const letterNodesRef = useRef([]);
  const backBtnRef = useMagnetic({ strengthX: 14, strengthY: 9 });

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(footerRef);

    mm.add({ reduce: MEDIA.reduceMotion }, (ctx) => {
      if (ctx.conditions.reduce) return;
      const scope = footerRef.current;

      // 1. Dark rounded footer card entrance
      gsap.fromTo(
        scope.querySelector('[data-footer-card]'),
        { scale: 0.97, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          immediateRender: false,
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: scope, start: 'top 94%', once: true },
        }
      );

      // 2. Editorial header row stagger reveal
      gsap.from(scope.querySelectorAll('[data-footer-reveal]'), {
        y: 24,
        opacity: 0,
        duration: 0.85,
        stagger: 0.08,
        ease: 'power3.out',
        immediateRender: false,
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: scope, start: 'top 90%', once: true },
      });

      // 3. Staggered letter-by-letter rise without bottom overflow clipping
      gsap.from(scope.querySelectorAll('[data-footer-letter]'), {
        y: 28,
        opacity: 0,
        duration: 0.9,
        stagger: 0.045,
        ease: 'power4.out',
        immediateRender: false,
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: scope.querySelector('[data-footer-mask]'),
          start: 'top 96%',
          once: true,
        },
      });

      // 4. Scroll-scrubbed vertical parallax reveal on the giant wordmark
      gsap.fromTo(
        scope.querySelector('[data-footer-wordmark]'),
        { y: 34 },
        {
          y: 0,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: scope,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 1,
          },
        }
      );
    });

    return () => mm.revert();
  }, []);

  // 3D Elastic Wave across BANGLADESH letters (y: -14, scale: 1.06 + neighboring ripple falloff)
  useEffect(() => {
    const reduce = window.matchMedia(MEDIA.reduceMotion).matches;
    if (reduce) return;

    letterNodesRef.current.forEach((node, idx) => {
      if (!node) return;
      if (hoveredIdx === null) {
        gsap.to(node, {
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 0.68,
          ease: 'elastic.out(1, 0.42)',
          overwrite: 'auto',
        });
        return;
      }

      const dist = Math.abs(hoveredIdx - idx);
      const liftY = dist === 0 ? -14 : dist === 1 ? -8 : dist === 2 ? -3.5 : 0;
      const scaleVal = dist === 0 ? 1.06 : dist === 1 ? 1.032 : dist === 2 ? 1.012 : 1;
      const rotX = dist === 0 ? 8 : dist === 1 ? 4 : dist === 2 ? 1.5 : 0;

      gsap.to(node, {
        y: liftY,
        scale: scaleVal,
        rotationX: rotX,
        transformPerspective: 800,
        duration: 0.56,
        ease: 'elastic.out(1, 0.45)',
        overwrite: 'auto',
      });
    });
  }, [hoveredIdx]);

  // Spring-loaded upward arrow shoot-out & bottom loop-in on hover
  const handleBackBtnEnter = () => {
    const arrow = arrowRef.current;
    if (!arrow || window.matchMedia(MEDIA.reduceMotion).matches) return;
    const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });
    tl.to(arrow, { yPercent: -145, opacity: 0, duration: 0.18, ease: 'power2.in' });
    tl.set(arrow, { yPercent: 145 });
    tl.to(arrow, {
      yPercent: 0,
      opacity: 1,
      duration: 0.44,
      ease: 'back.out(2.1)',
      clearProps: 'transform,opacity',
    });
  };

  const handleChapterJump = (chapter) => {
    if (expoMode) {
      setExpoMode(false);
      window.setTimeout(() => scrollToTarget(`#${chapter.id}`, { offset: -140 }), 420);
      return;
    }
    scrollToTarget(`#${chapter.id}`, { offset: -140 });
  };

  return (
    <footer ref={footerRef} className="relative z-0 mt-24 px-3 pb-3 sm:mt-32 sm:px-5 sm:pb-5">
      <div
        data-footer-card
        className="mx-auto max-w-[1600px] overflow-hidden rounded-4xl border border-transparent bg-ink px-5 pt-10 pb-6 text-white transition-colors duration-300 will-change-transform dark:border-white/10 dark:bg-[#131C2E] sm:px-10 sm:pt-14 lg:px-14"
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p data-footer-reveal className="text-[11px] font-semibold tracking-[0.24em] text-white/50 uppercase">
              {SITE_META.edition}
            </p>
            <p
              data-footer-reveal
              className="mt-3 font-display text-2xl leading-tight font-bold tracking-[-0.02em] sm:text-3xl"
            >
              {SITE_META.tagline}.
            </p>
            <p data-footer-reveal className="mt-3 text-sm leading-relaxed text-white/60">
              A purely visual showcase and travel guide — no bookings, no pricing. Photography courtesy of Wikimedia
              Commons contributors; tap the credit on any photo for its source and license.
            </p>
            <div data-footer-reveal className="mt-5">
              <span className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-white/70 tabular-nums">
                <Crosshair className="h-3.5 w-3.5 shrink-0 text-white/50" strokeWidth={2} aria-hidden="true" />
                <span>23.6850° N, 90.3563° E</span>
                <span className="text-white/30" aria-hidden="true">
                  ·
                </span>
                <span>{spots.length} Curated Destinations</span>
              </span>
            </div>
          </div>

          <div data-footer-reveal>
            <button
              ref={backBtnRef}
              type="button"
              data-footer-back-top
              data-cursor="magnetic"
              onPointerEnter={handleBackBtnEnter}
              onClick={() => scrollToTarget(0, { offset: 0 })}
              className="group inline-flex h-12 w-fit items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-ink transition-colors hover:bg-canvas active:scale-95"
            >
              <span className="relative inline-flex h-4 w-4 items-center justify-center overflow-hidden">
                <ArrowUp ref={arrowRef} data-back-arrow className="h-4 w-4 will-change-transform" strokeWidth={2.2} />
              </span>
              Back to top
            </button>
          </div>
        </div>

        {/* Smooth unclipped Inter/Plus Jakarta Sans BANGLADESH wordmark with 3D Elastic Wave hover */}
        <div
          data-footer-wordmark
          aria-hidden="true"
          className="mt-10 w-full [container-type:inline-size] will-change-transform sm:mt-12"
        >
          <div
            data-footer-mask
            onPointerLeave={() => setHoveredIdx(null)}
            className="overflow-visible px-1 pt-6"
          >
            <div
              className="flex w-full items-end justify-between pb-6 leading-[1.15] font-black tracking-tight select-none [perspective:800px]"
              style={{
                fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif",
                fontSize: 'clamp(1.5rem, 12.5cqw, 12.5rem)',
              }}
            >
              {WORDMARK_LETTERS.map((char, index) => {
                const dist = hoveredIdx === null ? null : Math.abs(hoveredIdx - index);
                const sheenOpacity =
                  dist === 0 ? 1 : dist === 1 ? 0.62 : dist === 2 ? 0.28 : 0;

                return (
                  <span key={index} data-footer-letter className="inline-block tracking-normal will-change-transform">
                    <span
                      ref={(el) => {
                        letterNodesRef.current[index] = el;
                      }}
                      data-footer-hover-letter={index}
                      onPointerEnter={() => setHoveredIdx(index)}
                      className="relative inline-block origin-bottom will-change-transform"
                    >
                      <span
                        className="-mx-[0.06em] block bg-clip-text px-[0.06em] pb-3 text-transparent"
                        style={{ backgroundImage: BASE_GRADIENT, WebkitBackgroundClip: 'text' }}
                      >
                        {char}
                      </span>
                      <span
                        data-footer-letter-sheen={index}
                        className="pointer-events-none absolute inset-y-0 -inset-x-[0.06em] block bg-clip-text px-[0.06em] pb-3 text-transparent transition-[opacity,filter] duration-300 ease-out"
                        style={{
                          backgroundImage: GLOW_GRADIENT,
                          WebkitBackgroundClip: 'text',
                          opacity: sheenOpacity,
                          filter: dist === 0 ? 'drop-shadow(0 6px 20px rgba(255,255,255,0.28))' : 'none',
                        }}
                      >
                        {char}
                      </span>
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between lg:pr-20">
          <span>© 2026 {SITE_META.name}</span>
          <nav aria-label="Footer chapters" className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {CHAPTERS.map((chapter, index) => (
              <Fragment key={chapter.id}>
                <button
                  type="button"
                  data-cursor="magnetic"
                  onClick={() => handleChapterJump(chapter)}
                  className="relative py-0.5 text-white/60 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-white after:transition-transform after:duration-300 hover:text-white hover:after:scale-x-100 active:scale-95"
                >
                  {chapter.title}
                </button>
                {index < CHAPTERS.length - 1 && (
                  <span aria-hidden="true" className="text-white/30">
                    ·
                  </span>
                )}
              </Fragment>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

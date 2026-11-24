import { Fragment, useLayoutEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import { CHAPTERS, SITE_META } from '@data';
import { useShowcase } from '@hooks';
import { gsap, MEDIA, scrollToTarget } from '@animations';

export function Footer() {
  const { expoMode, setExpoMode } = useShowcase();
  const footerRef = useRef(null);
  const backBtnRef = useRef(null);
  const sweepStrokeRef = useRef(null);
  const sweepFillRef = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(footerRef);

    mm.add({ isDesktop: MEDIA.desktop, reduce: MEDIA.reduceMotion }, (ctx) => {
      const { isDesktop, reduce } = ctx.conditions;
      if (reduce) return;
      const scope = footerRef.current;

      // 1. Dark rounded footer card smooth entrance
      gsap.fromTo(
        scope.querySelector('[data-footer-card]'),
        { scale: 0.96, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.95,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: { trigger: scope, start: 'top 92%', once: true },
        }
      );

      // 2. Stagger-reveal eyebrow, headline, description, and Back to top pill
      gsap.from(scope.querySelectorAll('[data-footer-reveal]'), {
        y: 24,
        opacity: 0,
        duration: 0.85,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: { trigger: scope, start: 'top 88%', once: true },
      });

      // 3. Responsive SVG BANGLADESH wordmark entrance
      gsap.from(scope.querySelector('[data-footer-wordmark-stroke]'), {
        y: 28,
        opacity: 0,
        duration: 0.95,
        ease: 'expo.out',
        clearProps: 'transform',
        scrollTrigger: { trigger: scope.querySelector('[data-footer-wordmark]'), start: 'top 96%', once: true },
      });

      // 4. Scroll-scrubbed subtle parallax on the BANGLADESH wordmark
      const wordmark = scope.querySelector('[data-footer-wordmark]');
      if (wordmark) {
        gsap.fromTo(
          wordmark,
          isDesktop ? { x: -16, y: 16 } : { y: 12 },
          {
            ...(isDesktop ? { x: 8, y: 0 } : { y: 0 }),
            ease: 'none',
            scrollTrigger: {
              trigger: scope,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: 0.8,
            },
          }
        );
      }

      // 5. Smooth, wide GSAP ambient light sweep across all 10 letters
      const sweepNodes = [sweepStrokeRef.current, sweepFillRef.current].filter(Boolean);
      if (sweepNodes.length > 0) {
        gsap.fromTo(
          sweepNodes,
          { attr: { x1: -480, x2: 40 } },
          {
            attr: { x1: 960, x2: 1480 },
            duration: 5.2,
            ease: 'sine.inOut',
            repeat: -1,
            repeatDelay: 1.0,
          }
        );
      }
    });

    return () => mm.revert();
  }, []);

  // Subtle magnetic hover effect on the Back to top pill
  const handleMagneticMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const btn = backBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(btn, {
      x: relX * 14,
      y: relY * 8,
      duration: 0.35,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  };

  const handleMagneticLeave = () => {
    const btn = backBtnRef.current;
    if (!btn) return;
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.55,
      ease: 'elastic.out(1, 0.5)',
      overwrite: 'auto',
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
          </div>
          <div data-footer-reveal>
            <button
              ref={backBtnRef}
              type="button"
              onClick={() => scrollToTarget(0, { offset: 0 })}
              onPointerMove={handleMagneticMove}
              onPointerLeave={handleMagneticLeave}
              className="group inline-flex h-12 w-fit items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-ink transition-colors hover:bg-canvas active:scale-95"
            >
              <ArrowUp
                className="h-4 w-4 transition-transform duration-300 ease-out group-hover:-translate-y-1"
                strokeWidth={2.2}
              />
              Back to top
            </button>
          </div>
        </div>

        {/* Full-width seamlessly illuminated BANGLADESH wordmark (zero rectangular cutout) */}
        <div
          data-footer-wordmark
          aria-hidden="true"
          className="group/wordmark relative mt-10 w-full cursor-default select-none will-change-transform sm:mt-12"
        >
          <svg viewBox="0 0 1000 132" className="block h-auto w-full overflow-visible">
            <defs>
              {/* Oversized filter region ensures bloom feathers cleanly with zero box clipping */}
              <filter id="footer-soft-bloom" x="-30%" y="-80%" width="160%" height="260%">
                <feGaussianBlur stdDeviation="5" />
              </filter>

              {/* Seamless full-width emerald-to-slate stroke gradient across all 10 letters */}
              <linearGradient id="footer-stroke-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(226, 232, 240, 0.58)" />
                <stop offset="28%" stopColor="rgba(16, 185, 129, 0.82)" />
                <stop offset="52%" stopColor="rgba(226, 232, 240, 0.78)" />
                <stop offset="76%" stopColor="rgba(16, 185, 129, 0.72)" />
                <stop offset="100%" stopColor="rgba(226, 232, 240, 0.58)" />
              </linearGradient>

              {/* Subtle ambient inner fill across all 10 letters */}
              <linearGradient id="footer-fill-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(226, 232, 240, 0.06)" />
                <stop offset="28%" stopColor="rgba(16, 185, 129, 0.14)" />
                <stop offset="52%" stopColor="rgba(226, 232, 240, 0.10)" />
                <stop offset="76%" stopColor="rgba(16, 185, 129, 0.12)" />
                <stop offset="100%" stopColor="rgba(226, 232, 240, 0.06)" />
              </linearGradient>

              {/* Wide GSAP ambient light sweep gradients */}
              <linearGradient
                ref={sweepStrokeRef}
                id="footer-sweep-stroke"
                gradientUnits="userSpaceOnUse"
                x1="-480"
                y1="0"
                x2="40"
                y2="0"
              >
                <stop offset="0%" stopColor="rgba(16, 185, 129, 0)" />
                <stop offset="28%" stopColor="rgba(16, 185, 129, 0.55)" />
                <stop offset="50%" stopColor="rgba(248, 250, 252, 0.98)" />
                <stop offset="72%" stopColor="rgba(16, 185, 129, 0.55)" />
                <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
              </linearGradient>

              <linearGradient
                ref={sweepFillRef}
                id="footer-sweep-fill"
                gradientUnits="userSpaceOnUse"
                x1="-480"
                y1="0"
                x2="40"
                y2="0"
              >
                <stop offset="0%" stopColor="rgba(16, 185, 129, 0)" />
                <stop offset="35%" stopColor="rgba(16, 185, 129, 0.2)" />
                <stop offset="50%" stopColor="rgba(248, 250, 252, 0.24)" />
                <stop offset="65%" stopColor="rgba(16, 185, 129, 0.2)" />
                <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
              </linearGradient>
            </defs>

            {/* 1. Soft outer bloom */}
            <text
              x="500"
              y="108"
              textAnchor="middle"
              textLength="990"
              lengthAdjust="spacing"
              fill="none"
              stroke="url(#footer-stroke-grad)"
              strokeWidth="4"
              filter="url(#footer-soft-bloom)"
              fontSize="132"
              fontWeight="900"
              className="font-display opacity-45 transition-opacity duration-500 group-hover/wordmark:opacity-75"
            >
              BANGLADESH
            </text>

            {/* 2. Full-width illuminated base */}
            <text
              data-footer-wordmark-stroke
              x="500"
              y="108"
              textAnchor="middle"
              textLength="990"
              lengthAdjust="spacing"
              fill="url(#footer-fill-grad)"
              stroke="url(#footer-stroke-grad)"
              strokeWidth="1.6"
              fontSize="132"
              fontWeight="900"
              className="font-display"
            >
              BANGLADESH
            </text>

            {/* 3. Wide GSAP ambient light sweep */}
            <text
              x="500"
              y="108"
              textAnchor="middle"
              textLength="990"
              lengthAdjust="spacing"
              fill="url(#footer-sweep-fill)"
              stroke="url(#footer-sweep-stroke)"
              strokeWidth="2.2"
              fontSize="132"
              fontWeight="900"
              pointerEvents="none"
              className="font-display"
            >
              BANGLADESH
            </text>
          </svg>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 {SITE_META.name}</span>
          <nav aria-label="Footer chapters" className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {CHAPTERS.map((chapter, index) => (
              <Fragment key={chapter.id}>
                <button
                  type="button"
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

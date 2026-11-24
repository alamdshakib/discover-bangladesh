import { Fragment, useLayoutEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import { CHAPTERS, SITE_META } from '@data';
import { useShowcase } from '@hooks';
import { gsap, MEDIA, scrollToTarget } from '@animations';

const WORDMARK_LETTERS = 'BANGLADESH'.split('');

export function Footer() {
  const { expoMode, setExpoMode } = useShowcase();
  const footerRef = useRef(null);
  const wordmarkRef = useRef(null);
  const backBtnRef = useRef(null);

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

      // 3. Giant BANGLADESH letter-stagger reveal
      gsap.from(scope.querySelectorAll('[data-footer-letter]'), {
        yPercent: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.032,
        ease: 'expo.out',
        clearProps: 'transform',
        scrollTrigger: { trigger: scope.querySelector('[data-footer-wordmark]'), start: 'top 96%', once: true },
      });

      // 4. Scroll-scrubbed subtle parallax on the BANGLADESH wordmark
      const wordmark = scope.querySelector('[data-footer-wordmark]');
      if (wordmark) {
        gsap.fromTo(
          wordmark,
          isDesktop ? { x: -24, y: 18 } : { y: 12 },
          {
            ...(isDesktop ? { x: 10, y: 0 } : { y: 0 }),
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
    });

    return () => mm.revert();
  }, []);

  // Mouse-tracking radial spotlight on BANGLADESH wordmark (zero React re-renders)
  const handleWordmarkMove = (e) => {
    const el = wordmarkRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
    el.style.setProperty('--spot-opacity', '1');
  };

  const handleWordmarkLeave = () => {
    wordmarkRef.current?.style.setProperty('--spot-opacity', '0');
  };

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
    <footer ref={footerRef} className="mt-24 px-3 pb-3 sm:mt-32 sm:px-5 sm:pb-5">
      <div
        data-footer-card
        className="mx-auto max-w-[1600px] overflow-hidden rounded-4xl bg-ink px-5 pt-10 pb-6 text-white will-change-transform sm:px-10 sm:pt-14 lg:px-14"
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

        <div
          ref={wordmarkRef}
          data-footer-wordmark
          onPointerMove={handleWordmarkMove}
          onPointerLeave={handleWordmarkLeave}
          aria-hidden="true"
          className="relative mt-12 cursor-default select-none will-change-transform"
          style={{ '--spot-x': '50%', '--spot-y': '50%', '--spot-opacity': 0 }}
        >
          {/* Ambient radial halo behind the letters */}
          <div
            className="pointer-events-none absolute -inset-x-6 -inset-y-4 transition-opacity duration-300"
            style={{
              opacity: 'var(--spot-opacity)',
              background:
                'radial-gradient(280px circle at var(--spot-x) var(--spot-y), rgba(16, 185, 129, 0.16), rgba(226, 232, 240, 0.08) 45%, transparent 72%)',
            }}
          />

          {/* Base outlined BANGLADESH wordmark */}
          <p
            className="relative font-display leading-[0.8] font-black tracking-[-0.06em] whitespace-nowrap text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.22)]"
            style={{ fontSize: 'clamp(2.4rem, 12.6vw, 14.5rem)' }}
          >
            {WORDMARK_LETTERS.map((char, i) => (
              <span key={`base-${i}`} data-footer-letter className="inline-block">
                {char}
              </span>
            ))}
          </p>

          {/* Cursor-masked illuminated slate-white & emerald outline layer */}
          <p
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/30 via-emerald-300/45 to-slate-200/35 bg-clip-text font-display leading-[0.8] font-black tracking-[-0.06em] whitespace-nowrap text-transparent transition-opacity duration-300 [-webkit-text-stroke:1.5px_rgb(226_232_240/0.92)]"
            style={{
              fontSize: 'clamp(2.4rem, 12.6vw, 14.5rem)',
              opacity: 'var(--spot-opacity)',
              maskImage: 'radial-gradient(240px circle at var(--spot-x) var(--spot-y), black 0%, transparent 72%)',
              WebkitMaskImage:
                'radial-gradient(240px circle at var(--spot-x) var(--spot-y), black 0%, transparent 72%)',
            }}
          >
            {WORDMARK_LETTERS.map((char, i) => (
              <span key={`glow-${i}`} data-footer-letter className="inline-block">
                {char}
              </span>
            ))}
          </p>
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

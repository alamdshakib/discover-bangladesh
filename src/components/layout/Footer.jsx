import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUp, Crosshair } from 'lucide-react';
import { CHAPTERS, SITE_META } from '@data';
import { useMagnetic, useShowcase } from '@hooks';
import { gsap, MEDIA, scrollToTarget } from '@animations';

const WORDMARK_LETTERS = 'BANGLADESH'.split('');
const PARTICLE_COUNT = 35;

const BASE_GRADIENT = 'linear-gradient(180deg, rgba(255, 255, 255, 0.30) 0%, rgba(148, 163, 184, 0.08) 100%)';
const GLOW_GRADIENT = 'linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(226, 248, 240, 0.72) 100%)';

export function Footer() {
  const { spots, expoMode, setExpoMode, journeySpots } = useShowcase();
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const footerRef = useRef(null);
  const cardRef = useRef(null);
  const canvasRef = useRef(null);
  const arrowPrimaryRef = useRef(null);
  const arrowSecondaryRef = useRef(null);
  const letterNodesRef = useRef([]);
  const backBtnRef = useMagnetic({ strengthX: 16, strengthY: 10 });

  // Lightweight ~35 floating firefly/mist particles on <canvas>, paused via IntersectionObserver when off-screen
  useEffect(() => {
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card) return undefined;
    if (window.matchMedia(MEDIA.reduceMotion).matches) return undefined;

    const ctx2d = canvas.getContext('2d');
    if (!ctx2d) return undefined;

    let width = 0;
    let height = 0;
    let rafId = 0;
    let isVisible = false;

    const createParticle = (initial = false) => ({
      x: Math.random() * (width || 1200),
      y: initial ? Math.random() * (height || 520) : (height || 520) + Math.random() * 24,
      r: 0.9 + Math.random() * 1.5,
      vy: 0.18 + Math.random() * 0.34,
      swayAmp: 0.12 + Math.random() * 0.26,
      swayFreq: 0.008 + Math.random() * 0.014,
      phase: Math.random() * Math.PI * 2,
      baseAlpha: 0.12 + Math.random() * 0.28,
      emerald: Math.random() > 0.42,
    });

    const particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle(true));

    const resize = () => {
      const rect = card.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(card);

    const tick = () => {
      if (!isVisible) {
        rafId = 0;
        return;
      }
      ctx2d.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.phase += p.swayFreq;
        p.y -= p.vy;
        p.x += Math.sin(p.phase) * p.swayAmp;

        if (p.y < -12) {
          p.x = Math.random() * width;
          p.y = height + 8;
        }
        if (p.x < -10) p.x = width + 8;
        if (p.x > width + 10) p.x = -8;

        const pulse = 0.65 + 0.35 * Math.sin(p.phase * 1.7);
        const alpha = p.baseAlpha * pulse;

        ctx2d.beginPath();
        ctx2d.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx2d.fillStyle = p.emerald
          ? `rgba(110, 231, 183, ${alpha.toFixed(3)})`
          : `rgba(226, 232, 240, ${alpha.toFixed(3)})`;
        ctx2d.fill();
      }

      rafId = window.requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = Boolean(entry?.isIntersecting);
        if (isVisible && !rafId) {
          rafId = window.requestAnimationFrame(tick);
        } else if (!isVisible && rafId) {
          window.cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { threshold: 0.04 }
    );

    io.observe(card);

    return () => {
      isVisible = false;
      if (rafId) window.cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  // GSAP context-scoped ScrollTrigger animations
  useLayoutEffect(() => {
    const mm = gsap.matchMedia(footerRef);

    mm.add(MEDIA.motion, () => {
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
          scrollTrigger: { trigger: scope, start: 'top 94%', once: true, fastScrollEnd: true },
        }
      );

      // 2. Editorial header row stagger reveal
      gsap.from(scope.querySelectorAll('[data-footer-reveal]'), {
        y: 22,
        opacity: 0,
        duration: 0.82,
        stagger: 0.08,
        ease: 'power3.out',
        immediateRender: false,
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: scope, start: 'top 90%', once: true, fastScrollEnd: true },
      });

      // 3. Sunrise Mountain Ridge Wordmark Reveal (scrub: 1) — BANGLADESH rises up out of the mountain horizon
      const riseTl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: scope,
          start: 'top 96%',
          end: 'bottom-=16 bottom',
          scrub: 1,
        },
      });

      riseTl.fromTo(
        scope.querySelector('[data-footer-glow]'),
        { opacity: 0.45, scale: 0.92 },
        { opacity: 1, scale: 1.04, immediateRender: false },
        0
      );

      riseTl.fromTo(
        scope.querySelector('[data-footer-wordmark-rise]'),
        { yPercent: 44, opacity: 0.28 },
        { yPercent: 0, opacity: 1, immediateRender: false },
        0
      );

      riseTl.fromTo(
        scope.querySelector('[data-footer-ridge-back]'),
        { yPercent: 14 },
        { yPercent: 0, immediateRender: false },
        0
      );

      riseTl.fromTo(
        scope.querySelector('[data-footer-ridge-front]'),
        { yPercent: 8 },
        { yPercent: 0, immediateRender: false },
        0
      );
    });

    return () => mm.revert();
  }, []);

  // 3D Elastic Letter Wave across BANGLADESH (y: -16, scale: 1.06 + smooth neighbor falloff curve)
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
          duration: 0.72,
          ease: 'elastic.out(1, 0.42)',
          overwrite: 'auto',
        });
        return;
      }

      const dist = Math.abs(hoveredIdx - idx);
      const liftY = dist === 0 ? -16 : dist === 1 ? -9.5 : dist === 2 ? -4 : dist === 3 ? -1.2 : 0;
      const scaleVal = dist === 0 ? 1.06 : dist === 1 ? 1.034 : dist === 2 ? 1.014 : dist === 3 ? 1.004 : 1;
      const rotX = dist === 0 ? 8 : dist === 1 ? 4 : dist === 2 ? 1.5 : 0;

      gsap.to(node, {
        y: liftY,
        scale: scaleVal,
        rotationX: rotX,
        transformPerspective: 800,
        duration: 0.58,
        ease: 'elastic.out(1, 0.44)',
        overwrite: 'auto',
      });
    });
  }, [hoveredIdx]);

  // Magnetic Rocket ↑ Back to top: primary arrow shoots upward out of mask while fresh arrow glides in from below
  const handleBackBtnEnter = () => {
    const primary = arrowPrimaryRef.current;
    const secondary = arrowSecondaryRef.current;
    if (!primary || !secondary || window.matchMedia(MEDIA.reduceMotion).matches) return;

    const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });
    tl.set(primary, { yPercent: 0, opacity: 1 });
    tl.set(secondary, { yPercent: 140, opacity: 1 });
    tl.to(primary, { yPercent: -140, opacity: 0, duration: 0.24, ease: 'power3.in' }, 0);
    tl.to(secondary, { yPercent: 0, opacity: 1, duration: 0.42, ease: 'back.out(2)' }, 0.08);
    tl.add(() => {
      gsap.set(primary, { clearProps: 'transform,opacity' });
      gsap.set(secondary, { yPercent: 140, opacity: 0 });
    });
  };

  const handleChapterJump = (chapter) => {
    if (expoMode) {
      setExpoMode(false);
      window.setTimeout(() => scrollToTarget(`#${chapter.id}`, { offset: -148 }), 420);
      return;
    }
    scrollToTarget(`#${chapter.id}`, { offset: -148 });
  };

  const hasJourneyDock = journeySpots.length > 0;

  return (
    <footer
      ref={footerRef}
      className={`relative z-0 mt-24 overflow-x-clip px-3 sm:mt-32 sm:px-5 ${
        hasJourneyDock ? 'pb-20 sm:pb-24 lg:pb-5' : 'pb-3 sm:pb-5'
      }`}
    >
      <div
        ref={cardRef}
        data-footer-card
        className="relative isolate mx-auto max-w-[1600px] overflow-hidden rounded-4xl border border-transparent bg-[#0d1525] px-5 pt-10 pb-6 text-white transition-colors duration-300 will-change-transform dark:border-white/10 dark:bg-[#0f182a] sm:px-10 sm:pt-14 lg:px-14"
      >
        {/* Volumetric dawn/moonlight horizon glow — soft radial light, zero hard cutout boxes */}
        <div
          data-footer-glow
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 will-change-transform"
          style={{
            background:
              'radial-gradient(ellipse 68% 54% at 50% 76%, rgba(16, 185, 129, 0.17) 0%, rgba(148, 184, 218, 0.10) 40%, rgba(13, 21, 37, 0) 76%), radial-gradient(ellipse 46% 36% at 50% 82%, rgba(226, 242, 255, 0.09) 0%, rgba(13, 21, 37, 0) 72%)',
          }}
        />

        {/* ~35 ultra-subtle floating firefly/mist particles on <canvas> */}
        <canvas
          ref={canvasRef}
          data-footer-particles
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
        />

        {/* Upper Editorial Row + Magnetic Rocket Back to Top */}
        <div className="relative z-20 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p data-footer-reveal className="text-[11px] font-semibold tracking-[0.24em] text-emerald-300/75 uppercase">
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
              <span className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-white/75 tabular-nums backdrop-blur-sm">
                <Crosshair className="h-3.5 w-3.5 shrink-0 text-emerald-300/80" strokeWidth={2} aria-hidden="true" />
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
              className="group inline-flex h-12 w-fit items-center gap-2.5 rounded-full bg-white px-6 text-sm font-semibold text-ink shadow-[0_14px_34px_-12px_rgba(255,255,255,0.28)] transition-colors hover:bg-canvas active:scale-95"
            >
              <span className="relative inline-flex h-4 w-4 items-center justify-center overflow-hidden">
                <ArrowUp
                  ref={arrowPrimaryRef}
                  data-back-arrow
                  className="h-4 w-4 will-change-transform"
                  strokeWidth={2.2}
                />
                <ArrowUp
                  ref={arrowSecondaryRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 h-4 w-4 translate-y-[140%] opacity-0 will-change-transform"
                  strokeWidth={2.2}
                />
              </span>
              Back to top
            </button>
          </div>
        </div>

        {/* Mountain Ridge Horizon + Smooth Unclipped BANGLADESH Sunrise & 3D Elastic Wave Stage */}
        <div
          data-footer-horizon-stage
          aria-hidden="true"
          className="relative z-10 mt-10 w-full [container-type:inline-size] sm:mt-12"
        >
          {/* Low-contrast distant mountain silhouette behind BANGLADESH */}
          <svg
            data-footer-ridge-back
            viewBox="0 0 1440 240"
            preserveAspectRatio="none"
            className="pointer-events-none absolute -inset-x-6 bottom-0 z-[2] h-[88%] w-[calc(100%+3rem)] will-change-transform"
          >
            <defs>
              <linearGradient id="footer-back-ridge" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(52, 211, 153, 0.09)" />
                <stop offset="55%" stopColor="rgba(30, 41, 59, 0.34)" />
                <stop offset="100%" stopColor="rgba(13, 21, 37, 0)" />
              </linearGradient>
            </defs>
            <path
              fill="url(#footer-back-ridge)"
              stroke="rgba(226, 232, 240, 0.09)"
              strokeWidth="1"
              d="M0,128 C96,104 176,68 272,74 C368,80 442,132 542,116 C644,98 726,42 828,48 C924,54 1002,112 1098,104 C1194,96 1284,54 1372,68 C1402,73 1424,84 1440,92 L1440,240 L0,240 Z"
            />
          </svg>

          {/* BANGLADESH Sunrise Wordmark + Interactive 3D Elastic Wave */}
          <div
            data-footer-mask
            onPointerLeave={() => setHoveredIdx(null)}
            className="relative z-[10] overflow-visible px-1 pt-7"
          >
            <div data-footer-wordmark-rise className="will-change-transform">
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
                    dist === 0 ? 1 : dist === 1 ? 0.65 : dist === 2 ? 0.3 : dist === 3 ? 0.1 : 0;

                  return (
                    <span key={index} data-footer-letter className="inline-block tracking-normal">
                      <span
                        ref={(el) => {
                          letterNodesRef.current[index] = el;
                        }}
                        data-footer-hover-letter={index}
                        onPointerEnter={() => setHoveredIdx(index)}
                        className="relative inline-block cursor-default origin-bottom will-change-transform"
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
                            filter:
                              dist === 0
                                ? 'drop-shadow(0 8px 24px rgba(255,255,255,0.32)) drop-shadow(0 0 14px rgba(52,211,153,0.22))'
                                : 'none',
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

          {/* Subtle foreground mountain horizon sill framing the wordmark base without clipping letters */}
          <svg
            data-footer-ridge-front
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
            className="pointer-events-none absolute -inset-x-6 -bottom-2 z-[12] h-7 w-[calc(100%+3rem)] will-change-transform sm:h-9"
          >
            <path
              fill="#0d1525"
              className=" transition-colors duration-300 dark:fill-[#0f182a]"
              stroke="rgba(148, 163, 184, 0.14)"
              strokeWidth="1"
              d="M0,46 C128,28 242,58 384,48 C518,38 636,16 768,22 C902,28 1024,56 1164,46 C1272,38 1368,20 1440,30 L1440,80 L0,80 Z"
            />
          </svg>
        </div>

        {/* Bottom Copyright & Interactive Chapter Jump Links */}
        <div className="relative z-20 mt-2 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between lg:pr-20">
          <span>© 2026 {SITE_META.name}</span>
          <nav aria-label="Footer chapters" className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {CHAPTERS.map((chapter, index) => (
              <Fragment key={chapter.id}>
                <button
                  type="button"
                  data-footer-chapter-link={chapter.id}
                  data-cursor="magnetic"
                  onClick={() => handleChapterJump(chapter)}
                  className="relative py-0.5 text-white/65 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-emerald-300 after:transition-transform after:duration-300 hover:text-white hover:after:scale-x-100 active:scale-95"
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

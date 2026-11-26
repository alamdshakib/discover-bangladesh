import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { BANGLADESH_DIVISIONS, spotsData } from '@data';
import { useScrollLock } from '@hooks';
import { gsap, MEDIA, ScrollTrigger } from '@animations';
import { getImageSrc } from '@utils';

const MONTAGE_IDS = [
  'sajek-valley',
  'coxs-bazar',
  'sundarbans',
  'tanguar-haor',
  'nilgiri-hills',
  'saint-martins-island',
];

const TARGET_LAT = 23.685;
const TARGET_LNG = 90.3563;

/**
 * 4-Act Pure Cinema Intro (~3.8s total) mounted at the root of App (z-[9999]).
 * Plays reliably on every page load/refresh (no sessionStorage gating), locks body
 * and Lenis scroll while active, includes a Skip Intro button, and hands off
 * seamlessly into the Hero kinetic reveal on exit.
 */
export function CinematicIntro() {
  const [visible, setVisible] = useState(true);
  const [scrollLocked, setScrollLocked] = useState(true);
  const [activeCut, setActiveCut] = useState(0);

  const rootRef = useRef(null);
  const tlRef = useRef(null);
  const percentRef = useRef(null);
  const latRef = useRef(null);
  const lngRef = useRef(null);
  const exitedRef = useRef(false);
  const handoffFiredRef = useRef(false);

  useScrollLock(visible && scrollLocked);

  const montageSpots = useMemo(() => {
    const byId = Object.fromEntries(spotsData.map((s) => [s.id, s]));
    return MONTAGE_IDS.map((id) => byId[id]).filter(Boolean);
  }, []);

  const fireHandoff = useCallback(() => {
    if (handoffFiredRef.current) return;
    handoffFiredRef.current = true;
    setScrollLocked(false);
    window.dispatchEvent(new CustomEvent('db:intro-done'));
    window.requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  const finishIntro = useCallback(() => {
    if (exitedRef.current) return;
    exitedRef.current = true;
    fireHandoff();
    setVisible(false);
    window.requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [fireHandoff]);

  // Hard wall-clock failsafe so backgrounded tabs never stay covered by the intro
  useEffect(() => {
    if (!visible) return undefined;
    const failsafeId = window.setTimeout(finishIntro, 4400);
    return () => {
      window.clearTimeout(failsafeId);
      window.requestAnimationFrame(() => ScrollTrigger.refresh());
    };
  }, [visible, finishIntro]);

  // Theatrical fast skip transition (button click or Escape key)
  const handleSkip = useCallback(() => {
    if (exitedRef.current) return;
    tlRef.current?.kill();

    const root = rootRef.current;
    if (!root || window.matchMedia(MEDIA.reduceMotion).matches) {
      finishIntro();
      return;
    }

    fireHandoff();
    const topCurtain = root.querySelector('[data-cinema-curtain-top]');
    const bottomCurtain = root.querySelector('[data-cinema-curtain-bottom]');
    const topBar = root.querySelector('[data-cinema-bar-top]');
    const bottomBar = root.querySelector('[data-cinema-bar-bottom]');
    const stage = root.querySelector('[data-cinema-stage]');
    const skipBtn = root.querySelector('[data-cinema-skip]');

    const skipTl = gsap.timeline({ onComplete: finishIntro });
    skipTl.to([stage, skipBtn], { opacity: 0, duration: 0.18, ease: 'power2.in' }, 0);
    skipTl.to([topCurtain, topBar], { yPercent: -100, duration: 0.42, ease: 'power4.inOut' }, 0.04);
    skipTl.to([bottomCurtain, bottomBar], { yPercent: 100, duration: 0.42, ease: 'power4.inOut' }, 0.04);
  }, [finishIntro, fireHandoff]);

  // Allow Escape key to skip cleanly
  useEffect(() => {
    if (!visible) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') handleSkip();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [visible, handleSkip]);

  // 4-Act GSAP Master Timeline (~3.8s total)
  useLayoutEffect(() => {
    if (!visible || !rootRef.current) return undefined;

    const reduceMotion = window.matchMedia(MEDIA.reduceMotion).matches;
    if (reduceMotion) {
      const id = window.setTimeout(finishIntro, 350);
      return () => window.clearTimeout(id);
    }

    const ctx = gsap.context(() => {
      const root = rootRef.current;
      const topBar = root.querySelector('[data-cinema-bar-top]');
      const bottomBar = root.querySelector('[data-cinema-bar-bottom]');
      const topCurtain = root.querySelector('[data-cinema-curtain-top]');
      const bottomCurtain = root.querySelector('[data-cinema-curtain-bottom]');
      const act1Group = root.querySelector('[data-cinema-act1]');
      const rule = root.querySelector('[data-cinema-rule]');
      const frame = root.querySelector('[data-cinema-frame]');
      const slides = root.querySelectorAll('[data-cinema-slide]');
      const slideImgs = root.querySelectorAll('[data-cinema-slide-img]');
      const stampWrap = root.querySelector('[data-cinema-stamp]');
      const backdropDim = root.querySelector('[data-cinema-dim]');
      const titleGroup = root.querySelector('[data-cinema-title-group]');
      const titleMain = root.querySelector('[data-cinema-title-main]');
      const titleSub = root.querySelector('[data-cinema-title-sub]');
      const skipBtn = root.querySelector('[data-cinema-skip]');

      // Initial hidden states
      gsap.set(topBar, { yPercent: -100 });
      gsap.set(bottomBar, { yPercent: 100 });
      gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' });
      gsap.set(frame, {
        clipPath: 'inset(50% 0% 50% 0% round 16px)',
        opacity: 0,
        scale: 0.96,
      });
      gsap.set(slides, { opacity: 0 });
      gsap.set(stampWrap, { opacity: 0, y: 10 });
      gsap.set(backdropDim, { opacity: 0 });
      gsap.set(titleGroup, { opacity: 0 });
      gsap.set(titleMain, {
        yPercent: 105,
        scale: 1.08,
        letterSpacing: '0.35em',
        opacity: 0,
        backgroundPosition: '130% 0%',
      });
      gsap.set(titleSub, { yPercent: 110, opacity: 0 });

      const metrics = { pct: 0, lat: 0, lng: 0 };

      const tl = gsap.timeline({
        onComplete: finishIntro,
      });
      tlRef.current = tl;

      /* =====================================================================
         ACT 1 (0.0s – 0.9s): Dark Cinema Theatre & Atmospheric Ignition
         ===================================================================== */
      tl.to([topBar, bottomBar], { yPercent: 0, duration: 0.45, ease: 'power3.out' }, 0);

      tl.to(
        metrics,
        {
          pct: 100,
          lat: TARGET_LAT,
          lng: TARGET_LNG,
          duration: 0.82,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (percentRef.current) {
              percentRef.current.textContent = `${String(Math.round(metrics.pct)).padStart(2, '0')}%`;
            }
            if (latRef.current) {
              latRef.current.textContent = `${metrics.lat.toFixed(4).padStart(7, '0')}° N`;
            }
            if (lngRef.current) {
              lngRef.current.textContent = `${metrics.lng.toFixed(4).padStart(7, '0')}° E`;
            }
          },
        },
        0.04
      );

      tl.to(rule, { scaleX: 1, duration: 0.82, ease: 'power2.inOut' }, 0.04);

      // Clear Act 1 telemetry right before Act 2 frame wipe
      tl.to(act1Group, { opacity: 0, y: -14, duration: 0.22, ease: 'power2.in' }, 0.82);

      /* =====================================================================
         ACT 2 (0.9s – 2.1s): High-Speed Photographic Trailer Montage (6 cuts)
         ===================================================================== */
      tl.to(
        frame,
        {
          clipPath: 'inset(0% 0% 0% 0% round 16px)',
          opacity: 1,
          scale: 1,
          duration: 0.28,
          ease: 'power4.out',
        },
        0.88
      );

      tl.to(stampWrap, { opacity: 1, y: 0, duration: 0.2, ease: 'power3.out' }, 0.92);

      const cutDuration = 0.2;
      montageSpots.forEach((_spot, idx) => {
        const startAt = 0.9 + idx * cutDuration;
        const slide = slides[idx];
        const img = slideImgs[idx];
        const prevSlide = idx > 0 ? slides[idx - 1] : null;

        tl.call(() => setActiveCut(idx), null, startAt);

        if (prevSlide) {
          tl.set(prevSlide, { opacity: 0 }, startAt);
        }
        if (slide) {
          tl.set(slide, { opacity: 1 }, startAt);
        }
        if (img) {
          tl.fromTo(
            img,
            { scale: 1.12 },
            { scale: 1.0, duration: cutDuration + 0.06, ease: 'power2.out' },
            startAt
          );
        }
      });

      /* =====================================================================
         ACT 3 (2.1s – 3.0s): Monumental Kinetic Title Reveal
         ===================================================================== */
      tl.to(stampWrap, { opacity: 0, y: 8, duration: 0.2, ease: 'power2.in' }, 2.08);
      tl.to(backdropDim, { opacity: 0.68, duration: 0.35, ease: 'power2.out' }, 2.1);
      tl.set(titleGroup, { opacity: 1 }, 2.12);

      tl.to(
        titleMain,
        {
          yPercent: 0,
          scale: 1,
          letterSpacing: '-0.03em',
          opacity: 1,
          duration: 0.72,
          ease: 'power4.out',
        },
        2.14
      );

      // Luminous letter-clipped horizontal light sweep across the giant title
      tl.to(
        titleMain,
        {
          backgroundPosition: '-30% 0%',
          duration: 0.78,
          ease: 'power2.inOut',
        },
        2.22
      );

      tl.to(
        titleSub,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
        },
        2.4
      );

      /* =====================================================================
         ACT 4 (3.0s – 3.8s): Theatrical Curtain Split & Seamless Hand-off
         ===================================================================== */
      tl.to(
        frame,
        {
          scale: 1.22,
          opacity: 0,
          duration: 0.68,
          ease: 'power4.inOut',
        },
        3.0
      );

      tl.to(
        [titleGroup, skipBtn],
        {
          y: -18,
          opacity: 0,
          duration: 0.34,
          ease: 'power3.in',
        },
        3.0
      );

      // Trigger live Hero kinetic entrance the exact millisecond curtains begin to split
      tl.call(fireHandoff, null, 3.12);

      tl.to(
        [topCurtain, topBar],
        {
          yPercent: -100,
          duration: 0.72,
          ease: 'power4.inOut',
        },
        3.08
      );

      tl.to(
        [bottomCurtain, bottomBar],
        {
          yPercent: 100,
          duration: 0.72,
          ease: 'power4.inOut',
        },
        3.08
      );
    }, rootRef);

    return () => {
      tlRef.current?.kill();
      tlRef.current = null;
      ctx.revert();
    };
  }, [visible, montageSpots, finishIntro, fireHandoff]);

  if (!visible) return null;

  const currentSpot = montageSpots[activeCut] ?? montageSpots[0];

  return (
    <div
      ref={rootRef}
      data-cinematic-intro
      role="dialog"
      aria-modal="true"
      aria-label="Discover Bangladesh cinematic introduction"
      className="fixed inset-0 z-[9999] overflow-hidden select-none"
    >
      {/* Top & bottom split pitch-black cinema theatre curtains */}
      <div
        data-cinema-curtain-top
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 overflow-hidden bg-[#04070D] will-change-transform"
      >
        <div
          className="cinema-flare absolute -bottom-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.24) 0%, rgba(217, 119, 6, 0.14) 42%, transparent 72%)',
          }}
        />
      </div>

      <div
        data-cinema-curtain-bottom
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 overflow-hidden bg-[#04070D] will-change-transform"
      >
        <div
          className="cinema-flare absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full opacity-45 blur-3xl"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(217, 119, 6, 0.2) 0%, rgba(16, 185, 129, 0.16) 45%, transparent 72%)',
          }}
        />
      </div>

      {/* Subtle 35mm animated film grain overlay */}
      <div
        aria-hidden="true"
        className="cinema-grain pointer-events-none absolute -inset-12 z-10 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Anamorphic 2.39:1 cinema letterbox bars */}
      <div
        data-cinema-bar-top
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-20 flex h-[7.5svh] items-center justify-between border-b border-white/[0.08] bg-[#020408] px-5 will-change-transform sm:h-[9.5svh] sm:px-10"
      >
        <span className="font-mono text-[10px] font-semibold tracking-[0.28em] text-white/40 uppercase">
          DISCOVER BD · 2.39:1
        </span>
        <span className="font-mono text-[10px] font-medium tracking-[0.24em] text-emerald-400/70 uppercase">
          REC ● 2026
        </span>
      </div>

      <div
        data-cinema-bar-bottom
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex h-[7.5svh] items-center justify-start border-t border-white/[0.08] bg-[#020408] px-5 will-change-transform sm:h-[9.5svh] sm:px-10"
      >
        <span className="font-mono text-[10px] font-medium tracking-[0.24em] text-white/35 uppercase">
          {BANGLADESH_DIVISIONS.length} DIVISIONS · {spotsData.length} DESTINATIONS
        </span>
      </div>

      {/* Main centered theatre stage */}
      <div
        data-cinema-stage
        className="pointer-events-none relative z-20 flex h-full w-full flex-col items-center justify-center px-4 text-white"
      >
        {/* ACT 1: Monospace coordinate & percentage telemetry + hairline rule */}
        <div
          data-cinema-act1
          className="absolute inset-x-4 flex flex-col items-center justify-center text-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-xs font-semibold tracking-[0.22em] text-white/85 tabular-nums sm:text-sm">
            <span ref={percentRef} className="text-emerald-400">
              00%
            </span>
            <span className="text-white/25" aria-hidden="true">
              /
            </span>
            <span ref={latRef}>00.0000° N</span>
            <span className="text-white/30" aria-hidden="true">
              ·
            </span>
            <span ref={lngRef}>00.0000° E</span>
          </div>

          <div className="mt-4 h-px w-[min(82vw,420px)] overflow-hidden bg-white/15">
            <div
              data-cinema-rule
              className="h-full w-full bg-gradient-to-r from-emerald-400/70 via-white to-amber-300/80"
            />
          </div>

          <p className="mt-3 font-mono text-[10px] tracking-[0.32em] text-white/45 uppercase">
            CALIBRATING VISUAL ATLAS
          </p>
        </div>

        {/* ACT 2: Widescreen photographic trailer montage frame */}
        <div className="relative flex w-full flex-col items-center justify-center">
          <div
            data-cinema-frame
            className="relative aspect-video w-[82vw] max-w-[760px] overflow-hidden rounded-2xl bg-[#0B111E] shadow-[0_32px_100px_-24px_rgba(0,0,0,0.9)] ring-1 ring-white/15 will-change-transform"
          >
            {montageSpots.map((spot, idx) => (
              <div
                key={spot.id}
                data-cinema-slide
                className="absolute inset-0 h-full w-full"
                style={{ zIndex: idx + 1 }}
              >
                <img
                  data-cinema-slide-img
                  src={getImageSrc(spot.images.cover, 'card')}
                  alt={spot.name}
                  loading="eager"
                  decoding="async"
                  draggable={false}
                  className="h-full w-full object-cover will-change-transform"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25"
                />
              </div>
            ))}

            {/* Moody darkening veil for Act 3 title legibility */}
            <div
              data-cinema-dim
              aria-hidden="true"
              className="absolute inset-0 z-20 bg-[#04070D]"
            />
          </div>

          {/* Rhythmic location stamp beneath the cinema frame */}
          <div
            data-cinema-stamp
            className="mt-4 flex items-center gap-3 font-mono text-[11px] font-semibold tracking-[0.26em] text-white/85 uppercase tabular-nums sm:mt-5 sm:text-xs"
          >
            <span className="text-emerald-400">
              {String(activeCut + 1).padStart(2, '0')} / {String(montageSpots.length).padStart(2, '0')}
            </span>
            <span className="h-px w-5 bg-white/30" aria-hidden="true" />
            <span>{currentSpot?.name ?? 'BANGLADESH'}</span>
            <span className="hidden text-white/40 sm:inline">· {currentSpot?.division}</span>
          </div>
        </div>

        {/* ACT 3: Monumental kinetic editorial title reveal */}
        <div
          data-cinema-title-group
          className="absolute inset-x-4 z-30 flex flex-col items-center justify-center text-center"
        >
          <div className="relative overflow-hidden px-3 py-2">
            <h1
              data-cinema-title-main
              className="bg-clip-text font-display leading-[0.98] font-black text-transparent uppercase will-change-transform"
              style={{
                fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif",
                fontSize: 'clamp(1.75rem, 6.2vw, 5.2rem)',
                backgroundImage:
                  'linear-gradient(110deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.86) 38%, rgba(255,255,255,1) 48%, rgba(167,243,208,1) 52%, rgba(255,255,255,0.86) 62%, rgba(255,255,255,0.82) 100%)',
                backgroundSize: '240% 100%',
                WebkitBackgroundClip: 'text',
              }}
            >
              DISCOVER BANGLADESH
            </h1>
          </div>

          <div className="mt-3 overflow-hidden">
            <p
              data-cinema-title-sub
              className="font-mono text-[10px] font-semibold tracking-[0.34em] text-emerald-300/90 uppercase sm:text-xs"
            >
              VISUAL ATLAS — EDITION 2026
            </p>
          </div>
        </div>
      </div>

      {/* Sleek Skip Intro pill button (always accessible at bottom-right) */}
      <button
        type="button"
        data-cinema-skip
        onClick={handleSkip}
        className="pointer-events-auto fixed right-4 bottom-3 z-30 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.08] px-3.5 py-1.5 font-mono text-[10px] font-semibold tracking-[0.2em] text-white/80 uppercase backdrop-blur-md transition-colors duration-200 hover:border-white/45 hover:bg-white/15 hover:text-white active:scale-95 sm:right-8 sm:bottom-5 sm:px-4 sm:py-2 sm:text-[11px]"
      >
        Skip Intro →
      </button>
    </div>
  );
}

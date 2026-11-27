import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { spotsData } from '@data';
import { useScrollLock } from '@hooks';
import { gsap, MEDIA, ScrollTrigger } from '@animations';
import { getImageSrc } from '@utils';

const MONTAGE_IDS = [
  'sajek-valley',
  'coxs-bazar',
  'sundarbans',
  'tanguar-haor',
  'paharpur-buddhist-vihara',
];

const TARGET_LAT = 23.685;
const TARGET_LNG = 90.3563;

// Ultra-fine SVG fractalNoise texture for subtle 4% photographic cinema grain
const FILM_GRAIN_URI =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/**
 * Ultra-Refined ~2.6-second Studio-Grade Film Intro (`z-[9999]`):
 * - Beat 1 (0.0s – 1.2s): Rapid 5-photo aperture montage + 00%→100% telemetry + GPS lock + center-out hairline.
 * - Beat 2 (1.2s – 1.8s): Baseline-masked DISCOVER / BANGLADESH editorial lockup over darkened aperture.
 * - Beat 3 (1.8s – 2.6s): Fluid upward cinema curtain wipe (`clip-path: inset(0% 0% 100% 0%)`) handing off
 *   directly into the live Hero choreography.
 * Respects `prefers-reduced-motion`, provides `Skip Intro →`, and always unlocks Lenis & body scroll cleanly.
 */
export function CinematicIntro() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !window.matchMedia(MEDIA.reduceMotion).matches;
  });
  const [scrollLocked, setScrollLocked] = useState(true);
  const [activeCut, setActiveCut] = useState(0);

  const rootRef = useRef(null);
  const curtainRef = useRef(null);
  const tlRef = useRef(null);
  const percentRef = useRef(null);
  const coordsRef = useRef(null);
  const exitedRef = useRef(false);
  const handoffFiredRef = useRef(false);

  useScrollLock(visible && scrollLocked);

  const montageSpots = useMemo(() => {
    const byId = Object.fromEntries(spotsData.map((s) => [s.id, s]));
    const resolved = MONTAGE_IDS.map((id) => byId[id]).filter(Boolean);
    return resolved.length > 0 ? resolved : spotsData.slice(0, 5);
  }, []);

  const fireHandoff = useCallback(() => {
    if (handoffFiredRef.current) return;
    handoffFiredRef.current = true;
    window.__dbIntroDone = true;
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

  // If reduced motion auto-skipped on initial render, emit handoff cleanly on mount
  useEffect(() => {
    if (!visible) {
      fireHandoff();
    }
  }, [visible, fireHandoff]);

  // Hard wall-clock failsafe (3.4s) so throttled/backgrounded tabs never stall
  useEffect(() => {
    if (!visible) return undefined;
    const failsafeId = window.setTimeout(finishIntro, 3400);
    return () => {
      window.clearTimeout(failsafeId);
      window.requestAnimationFrame(() => ScrollTrigger.refresh());
    };
  }, [visible, finishIntro]);

  // Immediate smooth Skip Intro handler (button click or Escape)
  const handleSkip = useCallback(() => {
    if (exitedRef.current) return;
    tlRef.current?.kill();

    const curtain = curtainRef.current;
    const root = rootRef.current;
    if (!curtain || !root || window.matchMedia(MEDIA.reduceMotion).matches) {
      finishIntro();
      return;
    }

    fireHandoff();
    const skipBtn = root.querySelector('[data-cinema-skip]');
    const stage = root.querySelector('[data-cinema-stage]');

    const skipTl = gsap.timeline({ onComplete: finishIntro });
    skipTl.to([stage, skipBtn], { opacity: 0, y: -10, duration: 0.16, ease: 'power2.in' }, 0);
    skipTl.to(
      curtain,
      {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 0.42,
        ease: 'power4.inOut',
      },
      0.04
    );
  }, [finishIntro, fireHandoff]);

  useEffect(() => {
    if (!visible) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') handleSkip();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [visible, handleSkip]);

  // Reset StrictMode guard refs whenever timeline effect re-runs
  useLayoutEffect(() => {
    if (!visible || !rootRef.current) return undefined;

    exitedRef.current = false;
    handoffFiredRef.current = false;
    window.__dbIntroDone = false;

    if (window.matchMedia(MEDIA.reduceMotion).matches) {
      finishIntro();
      return undefined;
    }

    const ctx = gsap.context(() => {
      const root = rootRef.current;
      const curtain = curtainRef.current;
      const aperture = root.querySelector('[data-cinema-aperture]');
      const slides = root.querySelectorAll('[data-cinema-slide]');
      const slideImgs = root.querySelectorAll('[data-cinema-slide-img]');
      const dimLayer = root.querySelector('[data-cinema-dim]');
      const progressLine = root.querySelector('[data-cinema-progress]');
      const telemetryRow = root.querySelector('[data-cinema-telemetry]');
      const cutLabel = root.querySelector('[data-cinema-cut-label]');
      const wordDiscover = root.querySelector('[data-cinema-discover]');
      const wordBangladesh = root.querySelector('[data-cinema-bangladesh]');
      const lockup = root.querySelector('[data-cinema-lockup]');
      const skipBtn = root.querySelector('[data-cinema-skip]');

      // Initial crisp states
      gsap.set(curtain, { clipPath: 'inset(0% 0% 0% 0%)' });
      gsap.set(aperture, { opacity: 0, scale: 0.94, clipPath: 'inset(12% 0% 12% 0% round 16px)' });
      gsap.set(slides, { opacity: 0 });
      gsap.set(dimLayer, { opacity: 0 });
      gsap.set(progressLine, { scaleX: 0, transformOrigin: 'center center' });
      gsap.set(telemetryRow, { opacity: 0, y: 8 });
      gsap.set(wordDiscover, { yPercent: 112, opacity: 0 });
      gsap.set(wordBangladesh, { yPercent: 112, opacity: 0 });

      const metrics = { pct: 0, lat: 20.85, lng: 88.42 };
      const tl = gsap.timeline({ onComplete: finishIntro });
      tlRef.current = tl;

      /* =====================================================================
         BEAT 1 (0.0s – 1.2s): Rapid 5-Photo Aperture Montage + Telemetry Lock
         ===================================================================== */
      tl.to(
        aperture,
        {
          opacity: 1,
          scale: 1,
          clipPath: 'inset(0% 0% 0% 0% round 16px)',
          duration: 0.34,
          ease: 'power3.out',
        },
        0
      );

      tl.to(telemetryRow, { opacity: 1, y: 0, duration: 0.28, ease: 'power3.out' }, 0.04);

      tl.to(
        progressLine,
        {
          scaleX: 1,
          duration: 1.15,
          ease: 'power2.inOut',
        },
        0.04
      );

      tl.to(
        metrics,
        {
          pct: 100,
          lat: TARGET_LAT,
          lng: TARGET_LNG,
          duration: 1.15,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (percentRef.current) {
              percentRef.current.textContent = `${String(Math.round(metrics.pct)).padStart(2, '0')}%`;
            }
            if (coordsRef.current) {
              coordsRef.current.textContent = `${metrics.lat.toFixed(4)}° N, ${metrics.lng.toFixed(4)}° E`;
            }
          },
        },
        0.04
      );

      const cutStep = 0.21;
      montageSpots.forEach((_spot, idx) => {
        const at = 0.08 + idx * cutStep;
        const slide = slides[idx];
        const img = slideImgs[idx];
        const prev = idx > 0 ? slides[idx - 1] : null;

        tl.call(() => setActiveCut(idx), null, at);
        if (prev) tl.set(prev, { opacity: 0 }, at);
        if (slide) tl.set(slide, { opacity: 1 }, at);
        if (img) {
          tl.fromTo(
            img,
            { scale: 1.12 },
            { scale: 1.02, duration: cutStep + 0.08, ease: 'power2.out' },
            at
          );
        }
      });

      /* =====================================================================
         BEAT 2 (1.2s – 1.8s): Masked Editorial Wordmark Lockup
         ===================================================================== */
      tl.to(cutLabel, { opacity: 0, y: -4, duration: 0.16, ease: 'power2.in' }, 1.16);
      tl.to(dimLayer, { opacity: 0.64, duration: 0.34, ease: 'power2.out' }, 1.18);
      tl.to(aperture, { scale: 1.05, duration: 0.56, ease: 'power2.out' }, 1.18);

      tl.to(
        wordDiscover,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.54,
          ease: 'power4.out',
        },
        1.22
      );

      tl.to(
        wordBangladesh,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.46,
          ease: 'power4.out',
        },
        1.34
      );

      /* =====================================================================
         BEAT 3 (1.8s – 2.6s): Seamless Upward Cinema Curtain Wipe Handoff
         ===================================================================== */
      tl.to(
        [lockup, telemetryRow, skipBtn],
        {
          y: -14,
          opacity: 0,
          duration: 0.28,
          ease: 'power3.in',
        },
        1.8
      );

      tl.to(
        aperture,
        {
          scale: 1.14,
          opacity: 0.25,
          duration: 0.48,
          ease: 'power3.inOut',
        },
        1.82
      );

      // Fire Hero entrance right as the upward curtain wipe begins revealing the Hero stage
      tl.call(fireHandoff, null, 1.86);

      tl.to(
        curtain,
        {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 0.72,
          ease: 'power4.inOut',
        },
        1.86
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
      aria-label="Discover Bangladesh studio film introduction"
      className="fixed inset-0 z-[9999] overflow-hidden select-none"
    >
      {/* Full-screen obsidian cinema curtain peeled upward via clip-path on Beat 3 */}
      <div
        ref={curtainRef}
        data-cinema-curtain
        className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#06090f] px-4 text-white will-change-[clip-path]"
      >
        {/* Soft atmospheric emerald-slate radial aura */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(56% 48% at 50% 48%, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.42) 48%, rgba(6, 9, 15, 0) 78%), radial-gradient(40% 34% at 24% 24%, rgba(56, 189, 248, 0.08) 0%, transparent 72%)',
          }}
        />

        {/* Subtle animated photographic film grain (opacity: 0.04) */}
        <div
          aria-hidden="true"
          className="cinema-grain pointer-events-none absolute -inset-10 opacity-[0.04] mix-blend-overlay"
          style={{ backgroundImage: FILM_GRAIN_URI, backgroundSize: '180px 180px' }}
        />

        {/* Center Cinema Stage */}
        <div data-cinema-stage className="relative z-10 flex w-full max-w-2xl flex-col items-center justify-center">
          {/* Sleek Photo Aperture + Centered Masked Lockup */}
          <div className="relative flex items-center justify-center">
            <div
              data-cinema-aperture
              className="relative h-[165px] w-[260px] overflow-hidden rounded-2xl bg-[#0d1524] shadow-[0_32px_95px_-22px_rgba(0,0,0,0.92)] ring-1 ring-white/15 will-change-[clip-path,transform,opacity] sm:h-[220px] sm:w-[360px]"
            >
              {montageSpots.map((spot, idx) => (
                <div
                  key={spot.id}
                  data-cinema-slide={spot.id}
                  className="absolute inset-0 h-full w-full"
                  style={{ zIndex: idx + 1 }}
                >
                  <img
                    data-cinema-slide-img
                    src={getImageSrc(spot.images.cover, 'card')}
                    alt={spot.name}
                    loading="eager"
                    fetchPriority={idx === 0 ? 'high' : 'auto'}
                    decoding="async"
                    draggable={false}
                    className="h-full w-full object-cover will-change-transform"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20"
                  />
                </div>
              ))}

              {/* Active reel location micro-stamp inside viewport */}
              <div
                data-cinema-cut-label
                className="absolute right-3 bottom-2.5 left-3 z-10 flex items-center justify-between font-mono text-[10px] font-semibold tracking-[0.2em] text-white/90 uppercase tabular-nums"
              >
                <span className="truncate">{currentSpot?.name}</span>
                <span className="shrink-0 text-emerald-300">
                  {String(activeCut + 1).padStart(2, '0')} / {String(montageSpots.length).padStart(2, '0')}
                </span>
              </div>

              {/* Beat 2 aperture darkening veil for wordmark legibility */}
              <div
                data-cinema-dim
                aria-hidden="true"
                className="absolute inset-0 z-20 bg-[#06090f]"
              />
            </div>

            {/* Beat 2: Baseline-Masked DISCOVER / BANGLADESH Wordmark Lockup */}
            <div
              data-cinema-lockup
              className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center px-3 text-center"
            >
              <div className="overflow-hidden py-0.5">
                <span
                  data-cinema-discover
                  className="block font-display leading-[0.95] font-black tracking-[-0.04em] text-white uppercase will-change-transform"
                  style={{
                    fontSize: 'clamp(2.1rem, 6.2vw, 4.35rem)',
                    textShadow: '0 10px 32px rgba(6, 9, 15, 0.72)',
                  }}
                >
                  DISCOVER
                </span>
              </div>
              <div className="mt-1.5 overflow-hidden py-0.5">
                <span
                  data-cinema-bangladesh
                  className="block font-display text-[11px] font-bold tracking-[0.42em] text-emerald-300/95 uppercase will-change-transform sm:text-xs"
                >
                  BANGLADESH
                </span>
              </div>
            </div>
          </div>

          {/* Monospace Telemetry Counter + Locking GPS Coordinates + Center-Out Hairline */}
          <div data-cinema-telemetry className="mt-6 flex w-[260px] flex-col items-center sm:mt-7 sm:w-[360px]">
            <div className="relative h-px w-full overflow-hidden bg-white/12">
              <div
                data-cinema-progress
                aria-hidden="true"
                className="h-full w-full bg-gradient-to-r from-emerald-400/50 via-white to-emerald-400/50 shadow-[0_0_12px_rgba(16,185,129,0.75)] will-change-transform"
              />
            </div>

            <div className="mt-3 flex w-full items-center justify-between gap-2 font-mono text-[10px] font-semibold tracking-[0.18em] text-white/75 uppercase tabular-nums sm:text-[11px]">
              <span ref={percentRef} data-cinema-percent className="text-emerald-400">
                00%
              </span>
              <span ref={coordsRef} data-cinema-coords className="truncate text-right text-white/80">
                20.8500° N, 88.4200° E
              </span>
            </div>
          </div>
        </div>

        {/* Crisp Minimal Skip Intro Pill (Bottom-Right) */}
        <button
          type="button"
          data-cinema-skip
          onClick={handleSkip}
          className="pointer-events-auto fixed right-4 bottom-4 z-30 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.08] px-3.5 py-2 font-mono text-[10px] font-semibold tracking-[0.2em] text-white/85 uppercase backdrop-blur-md transition-colors duration-200 hover:border-white/45 hover:bg-white/15 hover:text-white active:scale-95 sm:right-7 sm:bottom-6 sm:px-4 sm:text-[11px]"
        >
          Skip Intro →
        </button>
      </div>
    </div>
  );
}

import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, MEDIA } from '@animations';

const SESSION_KEY = 'db_intro_seen';
const TARGET_LAT = 23.685;
const TARGET_LNG = 90.3563;
const PANELS = [0, 1, 2, 3];

function shouldPlayIntro() {
  if (typeof window === 'undefined') return false;
  try {
    if (window.matchMedia(MEDIA.reduceMotion).matches) return false;
    return !window.sessionStorage.getItem(SESSION_KEY);
  } catch {
    return false;
  }
}

/**
 * Broadcast-grade ~1.3s editorial coordinate preloader.
 * Runs once per browser session, draws a precision compass reticle, ticks an odometer
 * onto Bangladesh's coordinates (23.6850° N · 90.3563° E), and lifts away via a
 * staggered architectural curtain wipe.
 */
export function Preloader() {
  const [visible, setVisible] = useState(shouldPlayIntro);
  const rootRef = useRef(null);
  const latRef = useRef(null);
  const lngRef = useRef(null);

  useLayoutEffect(() => {
    if (!visible || !rootRef.current) return undefined;

    let handoffFired = false;
    const emitDone = () => {
      if (handoffFired) return;
      handoffFired = true;
      try {
        window.sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        // Ignore storage restrictions.
      }
      window.dispatchEvent(new CustomEvent('db:preloader-done'));
    };

    const ctx = gsap.context(() => {
      const root = rootRef.current;
      const rings = root.querySelectorAll('[data-reticle-draw]');
      const ticks = root.querySelectorAll('[data-reticle-tick]');
      const panels = root.querySelectorAll('[data-preloader-panel]');
      const progress = root.querySelector('[data-preloader-bar]');
      const titleLine = root.querySelector('[data-preloader-title]');
      const subLine = root.querySelector('[data-preloader-sub]');
      const centerStage = root.querySelector('[data-preloader-stage]');

      rings.forEach((el) => {
        const len = typeof el.getTotalLength === 'function' ? el.getTotalLength() : 280;
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
      });

      const coords = { lat: 0, lng: 0 };

      const tl = gsap.timeline({
        onComplete: () => {
          emitDone();
          setVisible(false);
        },
      });

      // 0.00s → 0.80s: Compass reticle draw-in + coordinate odometer + progress hairline
      tl.to(
        rings,
        {
          strokeDashoffset: 0,
          duration: 0.72,
          stagger: 0.06,
          ease: 'power3.inOut',
        },
        0
      );

      tl.fromTo(
        ticks,
        { opacity: 0, scale: 0.6, transformOrigin: 'center center' },
        { opacity: 1, scale: 1, duration: 0.45, stagger: 0.03, ease: 'power3.out' },
        0.12
      );

      tl.to(
        coords,
        {
          lat: TARGET_LAT,
          lng: TARGET_LNG,
          duration: 0.82,
          ease: 'power3.out',
          onUpdate: () => {
            if (latRef.current) latRef.current.textContent = `${coords.lat.toFixed(4).padStart(7, '0')}° N`;
            if (lngRef.current) lngRef.current.textContent = `${coords.lng.toFixed(4).padStart(7, '0')}° E`;
          },
        },
        0.04
      );

      tl.fromTo(
        progress,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.82, ease: 'power2.inOut', transformOrigin: 'left center' },
        0.05
      );

      tl.fromTo(
        [titleLine, subLine],
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.62, stagger: 0.06, ease: 'power4.out' },
        0.16
      );

      // 0.88s → 1.32s: Center content lifts away + staggered architectural panel curtain wipe
      tl.to(
        centerStage,
        {
          y: -18,
          opacity: 0,
          duration: 0.28,
          ease: 'power3.in',
        },
        0.86
      );

      tl.call(emitDone, null, 0.96);

      tl.to(
        panels,
        {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 0.46,
          stagger: 0.045,
          ease: 'power4.inOut',
        },
        0.92
      );
    }, rootRef);

    return () => {
      emitDone();
      ctx.revert();
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-preloader
      className="pointer-events-none fixed inset-0 z-[120] overflow-hidden select-none"
    >
      {/* 4 staggered vertical architectural curtain panels */}
      <div className="absolute inset-0 grid grid-cols-4">
        {PANELS.map((idx) => (
          <div
            key={idx}
            data-preloader-panel
            style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            className="h-full w-full border-r border-ink/[0.04] bg-canvas last:border-r-0 dark:border-white/[0.04] dark:bg-[#0B111E]"
          />
        ))}
      </div>

      {/* Centered telemetry reticle & masked typography */}
      <div
        data-preloader-stage
        className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 text-ink dark:text-slate-50"
      >
        <div className="relative flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
          <svg viewBox="0 0 120 120" className="h-full w-full overflow-visible">
            {/* Outer architectural reticle ring */}
            <circle
              data-reticle-draw
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.22"
              strokeWidth="1"
            />
            {/* Inner precision ring */}
            <circle
              data-reticle-draw
              cx="60"
              cy="60"
              r="34"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.55"
              strokeWidth="1.2"
            />
            {/* Crosshair axes */}
            <line
              data-reticle-draw
              x1="60"
              y1="2"
              x2="60"
              y2="20"
              stroke="currentColor"
              strokeOpacity="0.7"
              strokeWidth="1.2"
            />
            <line
              data-reticle-draw
              x1="60"
              y1="100"
              x2="60"
              y2="118"
              stroke="currentColor"
              strokeOpacity="0.7"
              strokeWidth="1.2"
            />
            <line
              data-reticle-draw
              x1="2"
              y1="60"
              x2="20"
              y2="60"
              stroke="currentColor"
              strokeOpacity="0.7"
              strokeWidth="1.2"
            />
            <line
              data-reticle-draw
              x1="100"
              y1="60"
              x2="118"
              y2="60"
              stroke="currentColor"
              strokeOpacity="0.7"
              strokeWidth="1.2"
            />
            {/* Diagonal precision ticks */}
            {[45, 135, 225, 315].map((deg) => (
              <line
                key={deg}
                data-reticle-tick
                x1="60"
                y1="12"
                x2="60"
                y2="17"
                stroke="currentColor"
                strokeOpacity="0.4"
                strokeWidth="1"
                transform={`rotate(${deg} 60 60)`}
              />
            ))}
          </svg>
          <span className="absolute h-2.5 w-2.5 rounded-full bg-bd-green shadow-[0_0_16px_rgba(16,185,129,0.75)] dark:bg-emerald-400" />
        </div>

        {/* High-speed rolling coordinate odometer */}
        <div className="mt-6 flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.2em] text-ink tabular-nums dark:text-slate-100 sm:text-sm">
          <span ref={latRef}>00.0000° N</span>
          <span className="text-mist" aria-hidden="true">
            ·
          </span>
          <span ref={lngRef}>00.0000° E</span>
        </div>

        {/* Hairline progress bar */}
        <div className="mt-4 h-px w-48 overflow-hidden bg-ink/10 dark:bg-white/15 sm:w-56">
          <div data-preloader-bar className="h-full w-full bg-ink dark:bg-emerald-400" />
        </div>

        {/* Masked editorial wordmark */}
        <div className="mt-4 overflow-hidden">
          <p
            data-preloader-title
            className="text-center font-display text-[11px] font-bold tracking-[0.28em] text-ink uppercase dark:text-slate-200 sm:text-xs"
          >
            DISCOVER BANGLADESH — VISUAL ATLAS 2026
          </p>
        </div>
        <div className="mt-1 overflow-hidden">
          <p data-preloader-sub className="text-[10px] font-medium tracking-[0.22em] text-mist uppercase">
            8 Divisions · 24 Curated Destinations
          </p>
        </div>
      </div>
    </div>
  );
}

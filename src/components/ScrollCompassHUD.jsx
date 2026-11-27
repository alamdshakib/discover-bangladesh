import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CHAPTERS, SECTION_IDS } from '@data';
import { useMagnetic } from '@hooks';
import { getScrollState, gsap, MEDIA, ScrollTrigger, scrollToTarget } from '@animations';

const RING_RADIUS = 25;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const TRACKED_SECTIONS = [
  { id: SECTION_IDS.top, code: 'BD' },
  ...CHAPTERS.map((c) => ({ id: c.id, code: c.number })),
  { id: SECTION_IDS.atlas, code: 'MAP' },
];

/**
 * Floating minimal desktop Compass Rose & Scroll Progress HUD.
 * Needle rotates continuously (0° → 360°) linked to Lenis scroll progress while displaying
 * the active chapter code (01–04) inside a filling circular progress ring.
 */
export function ScrollCompassHUD() {
  const [activeCode, setActiveCode] = useState('BD');
  const ringRef = useRef(null);
  const needleRef = useRef(null);
  const codeRef = useRef(null);
  const btnRef = useMagnetic({ strengthX: 8, strengthY: 8 });
  const mountedRef = useRef(false);

  useEffect(() => {
    let observer = null;
    const codeById = Object.fromEntries(TRACKED_SECTIONS.map((s) => [s.id, s.code]));

    const bindObserver = () => {
      observer?.disconnect();
      const visible = new Map();
      const elements = TRACKED_SECTIONS.map((item) => document.getElementById(item.id)).filter(Boolean);
      if (elements.length === 0) return;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) visible.set(entry.target.id, entry.boundingClientRect.top);
            else visible.delete(entry.target.id);
          });
          if (visible.size > 0) {
            const [topId] = [...visible.entries()].sort((a, b) => a[1] - b[1]);
            const next = codeById[topId[0]];
            if (next) setActiveCode(next);
          }
        },
        { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
      );

      elements.forEach((el) => observer.observe(el));
    };

    bindObserver();
    ScrollTrigger.addEventListener('refresh', bindObserver);
    return () => {
      ScrollTrigger.removeEventListener('refresh', bindObserver);
      observer?.disconnect();
    };
  }, []);

  // Crisp micro-pop when active chapter code changes (01 → 02 → 03 → 04)
  useLayoutEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    if (!codeRef.current || window.matchMedia(MEDIA.reduceMotion).matches) return;
    gsap.fromTo(
      codeRef.current,
      { scale: 0.72, opacity: 0.35 },
      { scale: 1, opacity: 1, duration: 0.36, ease: 'back.out(2)', overwrite: 'auto', clearProps: 'transform,opacity' }
    );
  }, [activeCode]);

  useEffect(() => {
    let smoothed = 0;

    const onTick = () => {
      const { progress } = getScrollState();
      smoothed += (progress - smoothed) * 0.16;
      const clamped = Math.max(0, Math.min(1, smoothed));

      if (ringRef.current) {
        ringRef.current.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - clamped));
      }
      if (needleRef.current) {
        needleRef.current.style.transform = `rotate(${(clamped * 360).toFixed(2)}deg)`;
      }
      if (btnRef.current) {
        const show = clamped > 0.025 ? 1 : 0.72;
        btnRef.current.style.opacity = String(show);
      }
    };

    gsap.ticker.add(onTick);
    return () => gsap.ticker.remove(onTick);
  }, [btnRef]);

  return (
    <button
      ref={btnRef}
      type="button"
      data-scroll-compass
      data-cursor="magnetic"
      onClick={() => scrollToTarget(0, { offset: 0 })}
      aria-label="Scroll progress compass — jump back to top"
      title="Back to top"
      className="glass fixed right-6 bottom-6 z-40 hidden h-16 w-16 items-center justify-center rounded-full border border-white/75 text-ink shadow-[0_18px_40px_-18px_rgba(15,23,42,0.4)] transition-[background-color,border-color,opacity,box-shadow] duration-300 hover:border-emerald-500/40 hover:shadow-[0_20px_44px_-16px_rgba(16,185,129,0.35)] active:scale-95 dark:border-white/15 dark:text-slate-100 dark:hover:border-emerald-400/40 dark:shadow-[0_18px_40px_-16px_rgba(0,0,0,0.85)] lg:flex"
    >
      <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
        {/* Background track ring */}
        <circle
          cx="32"
          cy="32"
          r={RING_RADIUS}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.14"
          strokeWidth="1.6"
        />
        {/* 8 cardinal & intercardinal compass ticks */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line
            key={deg}
            x1="32"
            y1="9"
            x2="32"
            y2={deg % 90 === 0 ? '12.5' : '11'}
            stroke="currentColor"
            strokeOpacity={deg % 90 === 0 ? '0.42' : '0.2'}
            strokeWidth={deg % 90 === 0 ? '1.25' : '0.9'}
            transform={`rotate(${deg} 32 32)`}
          />
        ))}
        {/* Live scroll progress stroke tinted by active chapter accent */}
        <circle
          ref={ringRef}
          cx="32"
          cy="32"
          r={RING_RADIUS}
          fill="none"
          style={{ stroke: 'var(--chapter-accent, #10b981)' }}
          className="transition-[stroke] duration-500"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
          transform="rotate(-90 32 32)"
        />
        {/* Rotating precision compass needle tinted by active chapter accent */}
        <g ref={needleRef} style={{ transformOrigin: '32px 32px' }}>
          <polygon
            points="32,11.5 34.3,21 29.7,21"
            style={{ fill: 'var(--chapter-accent, #10b981)' }}
            className="transition-[fill] duration-500"
          />
          <polygon points="32,52.5 33.6,44 30.4,44" fill="currentColor" opacity="0.28" />
        </g>
      </svg>

      {/* Active chapter indicator (01–04, BD, MAP) */}
      <span
        ref={codeRef}
        data-compass-code
        className="pointer-events-none absolute font-mono text-[10px] font-bold tracking-[0.12em] tabular-nums"
      >
        {activeCode}
      </span>
    </button>
  );
}

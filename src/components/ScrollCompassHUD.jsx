import { useEffect, useRef, useState } from 'react';
import { CHAPTERS, SECTION_IDS } from '@data';
import { getScrollState, gsap, scrollToTarget } from '@animations';

const RING_RADIUS = 25;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const TRACKED_SECTIONS = [
  { id: SECTION_IDS.top, code: 'BD' },
  ...CHAPTERS.map((c) => ({ id: c.id, code: c.number })),
  { id: SECTION_IDS.atlas, code: 'MAP' },
];

/**
 * Floating minimal desktop Compass Rose & Scroll Progress HUD.
 * Needle rotates 0° → 360° and outer ring fills continuously via GSAP ticker (zero React scroll churn).
 */
export function ScrollCompassHUD() {
  const [activeCode, setActiveCode] = useState('BD');
  const ringRef = useRef(null);
  const needleRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const visible = new Map();
    const elements = TRACKED_SECTIONS.map((item) => ({
      ...item,
      el: document.getElementById(item.id),
    })).filter((item) => Boolean(item.el));

    if (elements.length === 0) return undefined;

    const codeById = Object.fromEntries(TRACKED_SECTIONS.map((s) => [s.id, s.code]));

    const observer = new IntersectionObserver(
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

    elements.forEach(({ el }) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

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
        const show = clamped > 0.03 ? 1 : 0.65;
        btnRef.current.style.opacity = String(show);
      }
    };

    gsap.ticker.add(onTick);
    return () => gsap.ticker.remove(onTick);
  }, []);

  return (
    <button
      ref={btnRef}
      type="button"
      data-scroll-compass
      data-cursor="magnetic"
      onClick={() => scrollToTarget(0, { offset: 0 })}
      aria-label="Scroll progress compass — jump back to top"
      title="Back to top"
      className="glass fixed right-6 bottom-6 z-40 hidden h-16 w-16 items-center justify-center rounded-full border border-white/75 text-ink shadow-[0_18px_40px_-18px_rgba(15,23,42,0.4)] transition-[transform,background-color,border-color,opacity] duration-300 hover:scale-105 active:scale-95 dark:border-white/15 dark:text-slate-100 dark:shadow-[0_18px_40px_-16px_rgba(0,0,0,0.85)] lg:flex"
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
        {/* Cardinal compass ticks */}
        {[0, 90, 180, 270].map((deg) => (
          <line
            key={deg}
            x1="32"
            y1="9"
            x2="32"
            y2="12"
            stroke="currentColor"
            strokeOpacity="0.35"
            strokeWidth="1.2"
            transform={`rotate(${deg} 32 32)`}
          />
        ))}
        {/* Live scroll progress stroke */}
        <circle
          ref={ringRef}
          cx="32"
          cy="32"
          r={RING_RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
          transform="rotate(-90 32 32)"
        />
        {/* Rotating precision compass needle */}
        <g ref={needleRef} style={{ transformOrigin: '32px 32px' }}>
          <polygon points="32,12 34.2,21 29.8,21" className="fill-bd-green dark:fill-emerald-400" />
          <polygon points="32,52 33.6,44 30.4,44" fill="currentColor" opacity="0.28" />
        </g>
      </svg>

      {/* Active chapter indicator */}
      <span className="pointer-events-none absolute font-mono text-[10px] font-bold tracking-[0.12em] tabular-nums">
        {activeCode}
      </span>
    </button>
  );
}

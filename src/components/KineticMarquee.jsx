import { useEffect, useRef } from 'react';
import { getScrollState, gsap, MEDIA } from '@animations';

const DEFAULT_ITEMS = [
  '24 CURATED DESTINATIONS',
  '8 DIVISIONS',
  'BAY OF BENGAL',
  'SYLHET',
  'CHATTOGRAM',
  'SUNDARBANS',
  'SAJEK VALLEY',
  "COX'S BAZAR",
];

/**
 * Scroll-velocity reactive architectural editorial marquee.
 * Glides smoothly at rest, accelerates + subtly skews on fast scrolls, reverses when
 * scrolling upward, and pauses automatically when scrolled out of view.
 */
export function KineticMarquee({ items = DEFAULT_ITEMS, className = '' }) {
  const wrapperRef = useRef(null);
  const trackRef = useRef(null);
  const firstGroupRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    const firstGroup = firstGroupRef.current;
    if (!wrapper || !track || !firstGroup) return undefined;

    const prefersReduced = window.matchMedia(MEDIA.reduceMotion).matches;
    if (prefersReduced) return undefined;

    let isVisible = true;
    let x = 0;
    let direction = 1;
    let smoothedVelocity = 0;
    let smoothedSkew = 0;
    let groupWidth = firstGroup.offsetWidth || 1200;

    const resizeObserver = new ResizeObserver(() => {
      groupWidth = firstGroup.offsetWidth || 1200;
    });
    resizeObserver.observe(firstGroup);

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    visibilityObserver.observe(wrapper);

    const baseSpeed = 0.72; // px per frame @ 60fps

    const onTick = (_time, deltaTime) => {
      if (!isVisible) return;
      const dtFactor = Math.min(deltaTime / 16.6667, 2.5);
      const { velocity } = getScrollState();

      // Smoothly damp incoming Lenis scroll velocity
      smoothedVelocity += (velocity - smoothedVelocity) * 0.12;
      if (Math.abs(smoothedVelocity) > 0.35) {
        direction = smoothedVelocity >= 0 ? 1 : -1;
      }

      const boost = Math.min(Math.abs(smoothedVelocity) * 0.42, 16);
      const step = (baseSpeed + boost) * direction * dtFactor;
      x -= step;

      if (x <= -groupWidth) x += groupWidth;
      else if (x > 0) x -= groupWidth;

      const targetSkew = Math.max(-6, Math.min(6, smoothedVelocity * -0.14));
      smoothedSkew += (targetSkew - smoothedSkew) * 0.14;

      track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0) skewX(${smoothedSkew.toFixed(2)}deg)`;
    };

    gsap.ticker.add(onTick);
    return () => {
      gsap.ticker.remove(onTick);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  const renderGroup = (refObj, hidden = false) => (
    <div
      ref={refObj}
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-6 pr-6 sm:gap-9 sm:pr-9"
    >
      {items.map((item) => (
        <div key={item} className="flex shrink-0 items-center gap-6 sm:gap-9">
          <span className="font-display text-xs font-bold tracking-[0.26em] text-ink/75 whitespace-nowrap uppercase transition-colors duration-300 dark:text-slate-300/85 sm:text-[13px]">
            {item}
          </span>
          <span className="text-[10px] text-bd-green/80 dark:text-emerald-400/80" aria-hidden="true">
            ✦
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div
      ref={wrapperRef}
      data-kinetic-marquee
      aria-label="Bangladesh editorial highlights"
      className={`relative my-10 overflow-hidden border-y border-line/90 bg-white/55 py-4 backdrop-blur-sm transition-colors duration-300 dark:border-white/10 dark:bg-[#131C2E]/55 sm:my-14 sm:py-5 ${className}`}
    >
      {/* Edge fade vignettes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-canvas to-transparent dark:from-[#0B111E] sm:w-24"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-canvas to-transparent dark:from-[#0B111E] sm:w-24"
      />

      <div ref={trackRef} className="flex w-max will-change-transform">
        {renderGroup(firstGroupRef, false)}
        {renderGroup(null, true)}
      </div>
    </div>
  );
}

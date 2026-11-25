import { useEffect, useRef } from 'react';
import { getScrollState, gsap, MEDIA } from '@animations';

const TOP_TRACK_ITEMS = [
  '24 DESTINATIONS',
  '8 DIVISIONS',
  'SAJEK',
  "COX'S BAZAR",
  'SUNDARBANS',
  'SYLHET',
  "ST. MARTIN'S",
];

const BOTTOM_TRACK_ITEMS = [
  'HILLS & RIDGES',
  'BAY OF BENGAL',
  'MANGROVE DELTA',
  'LIVING HERITAGE',
  'BANDARBAN',
  'TANGUAR HAOR',
  'KUAKATA',
];

/**
 * Dual-track scroll-velocity reactive kinetic typography ribbon.
 * Top and bottom rows glide in opposite directions, accelerate dynamically with
 * Lenis scroll velocity, reverse on upward scroll, and pause automatically off-screen.
 */
export function KineticMarquee({
  topItems = TOP_TRACK_ITEMS,
  bottomItems = BOTTOM_TRACK_ITEMS,
  className = '',
}) {
  const wrapperRef = useRef(null);
  const topTrackRef = useRef(null);
  const bottomTrackRef = useRef(null);
  const topGroupRef = useRef(null);
  const bottomGroupRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const topTrack = topTrackRef.current;
    const bottomTrack = bottomTrackRef.current;
    const topGroup = topGroupRef.current;
    const bottomGroup = bottomGroupRef.current;
    if (!wrapper || !topTrack || !bottomTrack || !topGroup || !bottomGroup) return undefined;

    const prefersReduced = window.matchMedia(MEDIA.reduceMotion).matches;
    if (prefersReduced) return undefined;

    let isVisible = true;
    let topX = 0;
    let bottomX = -(bottomGroup.offsetWidth || 1000) * 0.5;
    let direction = 1;
    let smoothedVelocity = 0;
    let topWidth = topGroup.offsetWidth || 1200;
    let bottomWidth = bottomGroup.offsetWidth || 1200;

    const resizeObserver = new ResizeObserver(() => {
      topWidth = topGroup.offsetWidth || 1200;
      bottomWidth = bottomGroup.offsetWidth || 1200;
    });
    resizeObserver.observe(topGroup);
    resizeObserver.observe(bottomGroup);

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    visibilityObserver.observe(wrapper);

    const baseSpeedTop = 0.72;
    const baseSpeedBottom = 0.62;

    const onTick = (_time, deltaTime) => {
      if (!isVisible) return;
      const dtFactor = Math.min(deltaTime / 16.6667, 2.5);
      const { velocity } = getScrollState();

      smoothedVelocity += (velocity - smoothedVelocity) * 0.12;
      if (Math.abs(smoothedVelocity) > 0.35) {
        direction = smoothedVelocity >= 0 ? 1 : -1;
      }

      const boost = Math.min(Math.abs(smoothedVelocity) * 0.44, 16);

      // Top row moves left when scrolling down (reverses when scrolling up)
      topX -= (baseSpeedTop + boost) * direction * dtFactor;
      if (topX <= -topWidth) topX += topWidth;
      else if (topX > 0) topX -= topWidth;

      // Bottom row glides in the exact opposite direction
      bottomX += (baseSpeedBottom + boost * 0.9) * direction * dtFactor;
      if (bottomX >= 0) bottomX -= bottomWidth;
      else if (bottomX < -bottomWidth) bottomX += bottomWidth;

      topTrack.style.transform = `translate3d(${topX.toFixed(2)}px, 0, 0)`;
      bottomTrack.style.transform = `translate3d(${bottomX.toFixed(2)}px, 0, 0)`;
    };

    gsap.ticker.add(onTick);
    return () => {
      gsap.ticker.remove(onTick);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  const renderTrackGroup = (items, refObj, variant, hidden = false) => (
    <div
      ref={refObj}
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-6 pr-6 sm:gap-9 sm:pr-9"
    >
      {items.map((item) => (
        <div key={item} className="flex shrink-0 items-center gap-6 sm:gap-9">
          <span
            className={
              variant === 'top'
                ? 'font-display text-xs font-extrabold tracking-[0.26em] text-ink/85 whitespace-nowrap uppercase transition-colors duration-300 dark:text-slate-100/90 sm:text-sm'
                : 'font-mono text-[11px] font-semibold tracking-[0.28em] text-ink-soft/65 whitespace-nowrap uppercase transition-colors duration-300 dark:text-slate-400/80 sm:text-xs'
            }
          >
            {item}
          </span>
          <span
            className={
              variant === 'top'
                ? 'text-[10px] text-bd-green/85 dark:text-emerald-400/85'
                : 'text-[10px] text-mist/70 dark:text-sky-400/65'
            }
            aria-hidden="true"
          >
            {variant === 'top' ? '·' : '✦'}
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
      className={`relative my-10 overflow-hidden border-y border-line/90 bg-white/60 py-3.5 backdrop-blur-sm transition-colors duration-300 dark:border-white/10 dark:bg-[#131C2E]/60 sm:my-14 sm:py-4 ${className}`}
    >
      {/* Left & right atmospheric edge fades */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-canvas to-transparent dark:from-[#0B111E] sm:w-24"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-canvas to-transparent dark:from-[#0B111E] sm:w-24"
      />

      {/* Row 1: Primary editorial track */}
      <div ref={topTrackRef} data-marquee-row="top" className="flex w-max will-change-transform">
        {renderTrackGroup(topItems, topGroupRef, 'top', false)}
        {renderTrackGroup(topItems, null, 'top', true)}
      </div>

      {/* Hairline center rule */}
      <div aria-hidden="true" className="my-2.5 h-px w-full bg-line/70 dark:bg-white/[0.06]" />

      {/* Row 2: Opposite-direction counter track */}
      <div ref={bottomTrackRef} data-marquee-row="bottom" className="flex w-max will-change-transform">
        {renderTrackGroup(bottomItems, bottomGroupRef, 'bottom', false)}
        {renderTrackGroup(bottomItems, null, 'bottom', true)}
      </div>
    </div>
  );
}

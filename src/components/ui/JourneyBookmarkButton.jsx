import { useRef } from 'react';
import { Check, Plus } from 'lucide-react';
import { useMagnetic, useShowcase } from '@hooks';
import { gsap, MEDIA } from '@animations';

/**
 * Circular or pill `+` / `✓` Journey Bookmark toggle button with GSAP spring bounce
 * (`scale: 0.8 -> 1.15 -> 1`, `back.out(2)`).
 */
export function JourneyBookmarkButton({
  spotId,
  spotName,
  showLabel = false,
  tone = 'default',
  className = '',
}) {
  const { isInJourney, toggleJourneySpot } = useShowcase();
  const saved = isInJourney(spotId);
  const magneticRef = useMagnetic({ strengthX: 9, strengthY: 9 });
  const iconWrapRef = useRef(null);

  const handleClick = (e) => {
    e.stopPropagation();
    toggleJourneySpot(spotId);

    const target = iconWrapRef.current ?? magneticRef.current;
    if (!target || window.matchMedia(MEDIA.reduceMotion).matches) return;

    const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });
    tl.to(target, { scale: 0.8, duration: 0.1, ease: 'power2.in' });
    tl.to(target, { scale: 1.15, duration: 0.18, ease: 'power2.out' });
    tl.to(target, { scale: 1, duration: 0.42, ease: 'back.out(2)', clearProps: 'transform' });
  };

  const baseTone = saved
    ? 'border-emerald-500/70 bg-bd-green text-white shadow-[0_8px_22px_-8px_rgba(0,106,78,0.65)] dark:border-emerald-400/60 dark:bg-emerald-500 dark:text-[#081214]'
    : tone === 'overlay'
      ? 'border-white/35 bg-black/45 text-white backdrop-blur-md hover:border-white/70 hover:bg-black/65'
      : 'border-line bg-canvas text-ink hover:border-haze hover:bg-white dark:border-white/15 dark:bg-white/[0.07] dark:text-slate-100 dark:hover:border-white/30 dark:hover:bg-white/[0.12]';

  return (
    <button
      ref={magneticRef}
      type="button"
      data-journey-bookmark={spotId}
      data-cursor="magnetic"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${spotName ?? 'destination'} from My Journey` : `Add ${spotName ?? 'destination'} to My Journey`}
      title={saved ? 'In My Journey (click to remove)' : 'Add to My Journey'}
      onClick={handleClick}
      className={`inline-flex shrink-0 items-center justify-center border transition-colors duration-200 active:scale-95 ${
        showLabel ? 'h-9 gap-1.5 rounded-full px-3 text-xs font-semibold' : 'h-10 w-10 rounded-full'
      } ${baseTone} ${className}`}
    >
      <span ref={iconWrapRef} className="inline-flex items-center justify-center will-change-transform">
        {saved ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <Plus className="h-4 w-4" strokeWidth={2.2} />}
      </span>
      {showLabel && <span>{saved ? 'In My Journey' : 'Add to Journey'}</span>}
    </button>
  );
}

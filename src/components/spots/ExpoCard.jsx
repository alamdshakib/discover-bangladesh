import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CHAPTERS } from '@data';
import { gsap, MEDIA } from '@animations';
import { getImageSrc } from '@utils';
import { SmartImage } from '../ui/SmartImage.jsx';

const chapterByCategory = Object.fromEntries(CHAPTERS.map((c) => [c.category, c]));

/**
 * Spatial 3D Expo Bento tile with perspective(1000px) ±8deg tilt,
 * translateZ(28px) floating badges, holographic specular sheen, and shutter unmask.
 */
export function ExpoCard({ spot, tileClass, onOpen }) {
  const chapter = chapterByCategory[spot.category];
  const large = tileClass.includes('col-span-2') && tileClass.includes('row-span-2');
  const cardRef = useRef(null);
  const sheenRef = useRef(null);
  const tiltRef = useRef(null);

  const ensureTilt = () => {
    if (tiltRef.current) return tiltRef.current;
    const el = cardRef.current;
    if (!el) return null;
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia(MEDIA.reduceMotion).matches) {
      return null;
    }
    tiltRef.current = {
      rx: gsap.quickTo(el, 'rotationX', { duration: 0.35, ease: 'power3.out' }),
      ry: gsap.quickTo(el, 'rotationY', { duration: 0.35, ease: 'power3.out' }),
    };
    return tiltRef.current;
  };

  useEffect(() => {
    const el = cardRef.current;
    return () => {
      tiltRef.current = null;
      if (el) gsap.killTweensOf(el);
    };
  }, []);

  const handleMove = (e) => {
    if (e.pointerType !== 'mouse' || !cardRef.current) return;
    if (!window.matchMedia(MEDIA.desktop).matches) return;
    const tilt = ensureTilt();
    if (!tilt) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / Math.max(rect.width, 1);
    const py = (e.clientY - rect.top) / Math.max(rect.height, 1);
    tilt.rx((0.5 - py) * 16); // ±8 deg
    tilt.ry((px - 0.5) * 16); // ±8 deg
    if (sheenRef.current) {
      sheenRef.current.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      sheenRef.current.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      sheenRef.current.style.opacity = '1';
    }
  };

  const handleLeave = () => {
    if (tiltRef.current) {
      tiltRef.current.rx(0);
      tiltRef.current.ry(0);
    }
    if (sheenRef.current) {
      sheenRef.current.style.opacity = '0';
    }
  };

  return (
    <button
      ref={cardRef}
      type="button"
      data-expo-card
      data-flip-id={spot.id}
      data-cursor="explore"
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onClick={() => onOpen(spot.id)}
      aria-label={`Open ${spot.name}, ${spot.district}`}
      style={{ transformPerspective: 1000 }}
      className={`group relative isolate rounded-3xl bg-ink text-left text-white will-change-transform active:scale-[0.97] dark:ring-1 dark:ring-white/10 lg:[transform-style:preserve-3d] ${tileClass}`}
    >
      {/* Clipped shutter photo window */}
      <span
        data-card-shutter
        className="pointer-events-none absolute inset-0 -z-10 block overflow-hidden rounded-3xl"
      >
        <span data-card-media className="absolute inset-x-0 -top-[10%] -bottom-[10%] block will-change-transform">
          <span data-card-shutter-img className="block h-full w-full scale-[1.12] will-change-transform">
            <SmartImage
              src={getImageSrc(spot.images.cover, 'card')}
              fallbackSrc={spot.images.cover}
              alt=""
              className="h-full w-full"
              imgClassName="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
            />
          </span>
        </span>
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
      </span>

      {/* Live holographic specular sheen */}
      <span
        ref={sheenRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-3xl opacity-0 transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(380px circle at var(--mx, 50%) var(--my, 50%), rgba(255, 255, 255, 0.28) 0%, rgba(16, 185, 129, 0.14) 30%, rgba(56, 189, 248, 0.12) 52%, transparent 68%)',
        }}
      />

      {/* translateZ(28px) lifted chapter badge */}
      <span className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold tracking-wide text-ink shadow-sm dark:border dark:border-white/15 dark:bg-[#131C2E]/85 dark:text-slate-100 sm:top-3 sm:left-3 lg:[transform:translateZ(28px)]">
        <span className={`h-1.5 w-1.5 rounded-full ${chapter?.dotClass ?? 'bg-ink'}`} aria-hidden="true" />
        {chapter?.number} {spot.category}
      </span>

      {/* translateZ(28px) lifted action icon */}
      <span className="absolute top-2.5 right-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink opacity-0 shadow-md transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:top-3 sm:right-3 lg:[transform:translateZ(28px)]">
        <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
      </span>

      {/* translateZ(28px) lifted title & tags */}
      <span className="absolute inset-x-0 bottom-0 z-20 p-3 sm:p-4 lg:[transform:translateZ(28px)]">
        <span
          className={`block font-display leading-[1.05] font-bold tracking-[-0.02em] ${
            large ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-base sm:text-lg'
          }`}
        >
          {spot.name}
        </span>
        <span className="mt-1 block truncate text-[11px] text-white/75 sm:text-xs">
          {spot.district} · {spot.division}
        </span>
        {large && <span className="mt-2 hidden max-w-md text-sm text-white/80 sm:block">{spot.tagline}</span>}
        <span className="mt-2 flex flex-wrap gap-1">
          {spot.seasons.map((season) => (
            <span
              key={season}
              className="rounded-full border border-white/25 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide uppercase sm:text-[10px]"
            >
              {season}
            </span>
          ))}
        </span>
      </span>
    </button>
  );
}

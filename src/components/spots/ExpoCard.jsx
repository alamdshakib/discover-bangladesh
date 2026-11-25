import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CHAPTERS } from '@data';
import { gsap, MEDIA } from '@animations';
import { getImageSrc } from '@utils';
import { SmartImage } from '../ui/SmartImage.jsx';

const chapterByCategory = Object.fromEntries(CHAPTERS.map((c) => [c.category, c]));

export function ExpoCard({ spot, tileClass, onOpen }) {
  const chapter = chapterByCategory[spot.category];
  const large = tileClass.includes('col-span-2') && tileClass.includes('row-span-2');
  const cardRef = useRef(null);
  const sheenRef = useRef(null);
  const tiltRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia(MEDIA.reduceMotion).matches;
    const isDesktop = window.matchMedia(MEDIA.desktop).matches;
    if (!finePointer || reduce || !isDesktop || !cardRef.current) return undefined;

    const el = cardRef.current;
    tiltRef.current = {
      rx: gsap.quickTo(el, 'rotateX', { duration: 0.35, ease: 'power3.out' }),
      ry: gsap.quickTo(el, 'rotateY', { duration: 0.35, ease: 'power3.out' }),
    };

    return () => {
      tiltRef.current = null;
      gsap.killTweensOf(el);
    };
  }, []);

  const handleMove = (e) => {
    if (e.pointerType !== 'mouse' || !tiltRef.current || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / Math.max(rect.width, 1);
    const py = (e.clientY - rect.top) / Math.max(rect.height, 1);
    tiltRef.current.rx((0.5 - py) * 11);
    tiltRef.current.ry((px - 0.5) * 11);
    if (sheenRef.current) {
      sheenRef.current.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      sheenRef.current.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      sheenRef.current.style.opacity = '1';
    }
  };

  const handleLeave = () => {
    if (cardRef.current && tiltRef.current) {
      gsap.to(cardRef.current, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.65,
        ease: 'elastic.out(1, 0.55)',
        overwrite: 'auto',
      });
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
      className={`group relative isolate overflow-hidden rounded-3xl bg-ink text-left text-white will-change-transform active:scale-[0.97] dark:ring-1 dark:ring-white/10 ${tileClass}`}
    >
      <SmartImage
        src={getImageSrc(spot.images.cover, 'card')}
        fallbackSrc={spot.images.cover}
        alt=""
        className="absolute inset-0 -z-10 h-full w-full"
        imgClassName="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
      />
      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />

      {/* Live specular sheen */}
      <span
        ref={sheenRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(255, 255, 255, 0.22), transparent 58%)',
        }}
      />

      <span className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold tracking-wide text-ink dark:border dark:border-white/15 dark:bg-[#131C2E]/85 dark:text-slate-100 sm:top-3 sm:left-3">
        <span className={`h-1.5 w-1.5 rounded-full ${chapter?.dotClass ?? 'bg-ink'}`} aria-hidden="true" />
        {chapter?.number} {spot.category}
      </span>
      <span className="absolute top-2.5 right-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:top-3 sm:right-3">
        <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
      </span>

      <span className="absolute inset-x-0 bottom-0 z-20 p-3 sm:p-4">
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

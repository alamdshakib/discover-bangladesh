import { ArrowUpRight } from 'lucide-react';
import { CHAPTERS } from '@data';
import { useMagnetic } from '@hooks';
import { getImageSrc } from '@utils';
import { SmartImage } from '../ui/SmartImage.jsx';

const chapterByCategory = Object.fromEntries(CHAPTERS.map((c) => [c.category, c]));

/**
 * Clean, completely level Expo Bento tile with -6px hover lift,
 * soft shadow elevation, crisp border highlight, 1.05 inner cover photo zoom,
 * shutter unmask entrance, and magnetic ↗ action icon.
 */
export function ExpoCard({ spot, tileClass, onOpen }) {
  const chapter = chapterByCategory[spot.category];
  const large = tileClass.includes('col-span-2') && tileClass.includes('row-span-2');
  const actionIconRef = useMagnetic({ strengthX: 9, strengthY: 9 });

  return (
    <button
      type="button"
      data-expo-card
      data-flip-id={spot.id}
      data-cursor="explore"
      onClick={() => onOpen(spot.id)}
      aria-label={`Open ${spot.name}, ${spot.district}`}
      className={`group relative isolate overflow-hidden rounded-3xl border border-slate-900/10 bg-ink text-left text-white shadow-sm transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:border-slate-400/70 hover:shadow-[0_26px_54px_-22px_rgba(15,23,42,0.38)] active:scale-[0.98] dark:border-white/10 dark:hover:border-white/28 dark:hover:shadow-[0_28px_58px_-20px_rgba(0,0,0,0.78)] ${tileClass}`}
    >
      {/* Clipped shutter photo window */}
      <span
        data-card-shutter
        className="pointer-events-none absolute inset-0 -z-10 block overflow-hidden rounded-3xl"
      >
        <span data-card-media className="absolute inset-x-0 -top-[10%] -bottom-[10%] block will-change-transform">
          <span data-card-shutter-img className="block h-full w-full scale-[1.14] will-change-transform">
            <SmartImage
              src={getImageSrc(spot.images.cover, 'card')}
              fallbackSrc={spot.images.cover}
              alt=""
              className="h-full w-full"
              imgClassName="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
            />
          </span>
        </span>
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
      </span>

      {/* Chapter badge */}
      <span className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold tracking-wide text-ink shadow-sm dark:border dark:border-white/15 dark:bg-[#131C2E]/85 dark:text-slate-100 sm:top-3 sm:left-3">
        <span className={`h-1.5 w-1.5 rounded-full ${chapter?.dotClass ?? 'bg-ink'}`} aria-hidden="true" />
        {chapter?.number} {spot.category}
      </span>

      {/* Magnetic ↗ action icon */}
      <span
        ref={actionIconRef}
        className="absolute top-2.5 right-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink opacity-0 shadow-md transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:top-3 sm:right-3"
      >
        <ArrowUpRight
          className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45"
          strokeWidth={2.2}
        />
      </span>

      {/* Title & tags */}
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

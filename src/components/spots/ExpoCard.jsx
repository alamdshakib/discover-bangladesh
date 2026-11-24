import { ArrowUpRight } from 'lucide-react';
import { CHAPTERS } from '@data';
import { getImageSrc } from '@utils';
import { SmartImage } from '../ui/SmartImage.jsx';

const chapterByCategory = Object.fromEntries(CHAPTERS.map((c) => [c.category, c]));

export function ExpoCard({ spot, tileClass, onOpen }) {
  const chapter = chapterByCategory[spot.category];
  const large = tileClass.includes('col-span-2') && tileClass.includes('row-span-2');

  return (
    <button
      type="button"
      data-expo-card
      data-flip-id={spot.id}
      onClick={() => onOpen(spot.id)}
      aria-label={`Open ${spot.name}, ${spot.district}`}
      className={`group relative isolate overflow-hidden rounded-3xl bg-ink text-left text-white transition-transform duration-300 active:scale-[0.97] ${tileClass}`}
    >
      <SmartImage
        src={getImageSrc(spot.images.cover, 'card')}
        fallbackSrc={spot.images.cover}
        alt=""
        className="absolute inset-0 -z-10 h-full w-full"
        imgClassName="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
      />
      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />

      <span className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold tracking-wide text-ink sm:top-3 sm:left-3">
        <span className={`h-1.5 w-1.5 rounded-full ${chapter?.dotClass ?? 'bg-ink'}`} aria-hidden="true" />
        {chapter?.number} {spot.category}
      </span>
      <span className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:top-3 sm:right-3">
        <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
      </span>

      <span className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
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
            <span key={season} className="rounded-full border border-white/25 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide uppercase sm:text-[10px]">
              {season}
            </span>
          ))}
        </span>
      </span>
    </button>
  );
}

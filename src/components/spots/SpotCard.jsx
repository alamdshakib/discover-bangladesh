import { useState } from 'react';
import { ArrowUpRight, CalendarDays, ChevronDown, MapPin } from 'lucide-react';
import { getImageSrc, getSeasonShort, getSpotImages } from '@utils';
import { SmartImage } from '../ui/SmartImage.jsx';
import { MetaPill } from '../ui/MetaPill.jsx';
import { TravelNotes } from './TravelNotes.jsx';

// Literal class names so Tailwind can detect them at build time.
const SPAN_CLASS = {
  4: 'lg:col-span-4',
  5: 'lg:col-span-5',
  6: 'lg:col-span-6',
  7: 'lg:col-span-7',
  12: 'md:col-span-2 lg:col-span-12',
};

/** Editorial bento card with hover/tap gallery switcher and expandable Travel Notes. */
export function SpotCard({ spot, span = 6, label, onOpen }) {
  const images = getSpotImages(spot);
  const [active, setActive] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);
  const wide = span === 12;

  const open = () => onOpen(spot.id);

  return (
    <article
      data-spot-card
      className={`group flex flex-col overflow-hidden rounded-4xl border border-line bg-card transition-[background-color,border-color,box-shadow] duration-300 hover:shadow-[0_40px_80px_-40px_rgba(15,23,42,0.4)] dark:border-white/10 dark:bg-[#131C2E] dark:hover:shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] ${
        SPAN_CLASS[span] ?? SPAN_CLASS[6]
      }`}
    >
      <div className={`relative overflow-hidden bg-line ${wide ? 'h-64 sm:h-80 lg:h-[420px]' : 'h-64 sm:h-72 lg:h-[340px]'}`}>
        <button
          type="button"
          onClick={open}
          aria-label={`Open ${spot.name} details`}
          className="absolute inset-0 block h-full w-full cursor-zoom-in"
        >
          <div data-card-media className="absolute inset-x-0 -top-[8%] -bottom-[8%]">
            <SmartImage
              src={getImageSrc(images[active], 'card')}
              fallbackSrc={images[active]}
              alt={`${spot.name} — photo ${active + 1} of ${images.length}`}
              className="h-full w-full"
              imgClassName="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
            />
          </div>
          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-ink/10" />
        </button>

        <div className="pointer-events-none absolute top-3 right-3 left-3 flex items-start justify-between gap-2 sm:top-4 sm:right-4 sm:left-4">
          <MetaPill tone="glass">{label}</MetaPill>
          <MetaPill tone="dark" icon={CalendarDays} className="shrink-0">
            {getSeasonShort(spot)}
          </MetaPill>
        </div>

        <div
          role="group"
          aria-label={`${spot.name} photos`}
          className="glass absolute bottom-3 left-3 flex gap-1 rounded-full border border-white/60 p-1 dark:border-white/15 sm:bottom-4 sm:left-4"
        >
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1} of ${spot.name}`}
              aria-pressed={i === active}
              className={`h-8 w-8 overflow-hidden rounded-full transition active:scale-95 sm:h-10 sm:w-10 ${
                i === active
                  ? 'ring-2 ring-ink ring-offset-1 ring-offset-white dark:ring-white dark:ring-offset-[#131C2E]'
                  : 'opacity-75 hover:opacity-100'
              }`}
            >
              <img
                src={getImageSrc(img, 'thumb')}
                alt=""
                loading="lazy"
                decoding="async"
                draggable={false}
                className="h-full w-full bg-line object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      <div className={`flex flex-1 flex-col p-5 sm:p-6 ${wide ? 'lg:flex-row lg:items-start lg:gap-10 lg:p-8' : ''}`}>
        <div className={wide ? 'lg:flex-1' : ''}>
          <div className="flex flex-wrap gap-1.5">
            <MetaPill icon={MapPin}>{spot.division}</MetaPill>
            <MetaPill>{spot.district}</MetaPill>
          </div>
          <h3 className="mt-3 font-display text-[1.6rem] leading-[1.08] font-bold tracking-[-0.03em] text-ink transition-colors duration-300 dark:text-slate-50 sm:text-[1.8rem]">
            <button type="button" onClick={open} className="text-left transition hover:text-ink-soft dark:hover:text-slate-300">
              {spot.name}
            </button>
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft transition-colors duration-300 dark:text-slate-400">
            {spot.tagline}
          </p>
        </div>

        <div className={`mt-auto pt-5 ${wide ? 'lg:mt-0 lg:w-[44%] lg:pt-0' : ''}`}>
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setNotesOpen((v) => !v)}
              aria-expanded={notesOpen}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas py-2 pr-2.5 pl-3.5 text-xs font-semibold text-ink transition-colors duration-300 hover:border-haze active:scale-95 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-100 dark:hover:border-white/25"
            >
              Travel Notes
              <span className="text-mist" aria-hidden="true">
                ·
              </span>
              <span className="font-display text-mist tabular-nums">2</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ${notesOpen ? 'rotate-180' : ''}`}
                strokeWidth={2.2}
              />
            </button>
            <button
              type="button"
              onClick={open}
              aria-label={`Explore ${spot.name}`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-[transform,background-color,color] duration-300 group-hover:rotate-45 active:scale-95 dark:bg-white dark:text-[#0B111E]"
            >
              <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
            </button>
          </div>
          <TravelNotes spot={spot} open={notesOpen} />
        </div>
      </div>
    </article>
  );
}

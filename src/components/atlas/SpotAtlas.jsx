import { useState } from 'react';
import { ArrowUpRight, Crosshair } from 'lucide-react';
import { CHAPTERS, SECTION_IDS } from '@data';
import { useShowcase } from '@hooks';
import { countByCategory, formatCoordinates, getImageSrc } from '@utils';
import { SmartImage } from '../ui/SmartImage.jsx';

// Geographic frame around Bangladesh (degrees).
const BOUNDS = { north: 26.7, south: 20.5, west: 88.0, east: 92.75 };
const LAT_LINES = [21, 22, 23, 24, 25, 26];
const LNG_LINES = [89, 90, 91, 92];
const chapterByCategory = Object.fromEntries(CHAPTERS.map((c) => [c.category, c]));

const project = ({ lat, lng }) => ({
  left: ((lng - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * 100,
  top: ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * 100,
});

/** Interactive coordinate atlas: every spot plotted by its verified GPS position. */
export function SpotAtlas() {
  const { spots, openSpot } = useShowcase();
  const [focusId, setFocusId] = useState(spots[0]?.id);
  const [category, setCategory] = useState(null);
  const focus = spots.find((s) => s.id === focusId) ?? spots[0];
  const counts = countByCategory(spots);

  return (
    <section id={SECTION_IDS.atlas} aria-labelledby="atlas-title" className="mt-24 scroll-mt-24 px-3 sm:mt-32 sm:px-5">
      <div className="mx-auto grid max-w-[1600px] gap-3 lg:grid-cols-[1fr_1.15fr] lg:gap-4">
        <div className="flex flex-col rounded-4xl border border-line bg-card p-5 sm:p-8 lg:p-10">
          <p className="text-[11px] font-semibold tracking-[0.24em] text-mist uppercase">Interactive Map</p>
          <h2
            id="atlas-title"
            className="mt-2 font-display leading-[0.9] font-black tracking-[-0.05em] text-ink"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 4.75rem)' }}
          >
            Coordinate Atlas
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
            Every destination plotted by its verified GPS coordinates. Hover or tap a point to preview, then open the full
            travel story.
          </p>

          <div className="mt-6 flex flex-wrap gap-1.5" role="group" aria-label="Highlight a landscape">
            {CHAPTERS.map((chapter) => {
              const on = category === chapter.category;
              return (
                <button
                  key={chapter.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setCategory(on ? null : chapter.category)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition active:scale-95 ${
                    on ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:border-haze'
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${chapter.dotClass}`} aria-hidden="true" />
                  {chapter.title}
                  <span className={on ? 'text-white/60' : 'text-mist'}>{counts[chapter.category] ?? 0}</span>
                </button>
              );
            })}
          </div>

          {focus && (
            <div className="mt-6 overflow-hidden rounded-3xl border border-line bg-canvas lg:mt-auto">
              <SmartImage
                src={getImageSrc(focus.images.cover, 'card')}
                fallbackSrc={focus.images.cover}
                alt={focus.name}
                className="h-44 w-full sm:h-56"
                imgClassName="h-full w-full object-cover"
              />
              <div className="flex items-end justify-between gap-4 p-4 sm:p-5">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold tracking-[0.18em] text-mist uppercase">
                    {chapterByCategory[focus.category]?.number} · {focus.category} · {focus.division}
                  </p>
                  <p className="mt-1 truncate font-display text-xl font-bold text-ink sm:text-2xl">{focus.name}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-soft tabular-nums">
                    <Crosshair className="h-3.5 w-3.5" strokeWidth={2} />
                    {formatCoordinates(focus.coordinates)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openSpot(focus.id)}
                  className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white transition hover:bg-ink-soft active:scale-95"
                >
                  Open
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative overflow-hidden rounded-4xl border border-line bg-[#eef2f6] p-3 sm:p-5">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[640px]">
            {LAT_LINES.map((lat) => {
              const { top } = project({ lat, lng: BOUNDS.west });
              return (
                <div key={lat} className="absolute inset-x-0 border-t border-dashed border-haze" style={{ top: `${top}%` }}>
                  <span className="absolute -top-2.5 left-1 bg-[#eef2f6] px-1 text-[10px] font-semibold text-mist tabular-nums">
                    {lat}°N
                  </span>
                </div>
              );
            })}
            {LNG_LINES.map((lng) => {
              const { left } = project({ lat: BOUNDS.north, lng });
              return (
                <div key={lng} className="absolute inset-y-0 border-l border-dashed border-haze" style={{ left: `${left}%` }}>
                  <span className="absolute bottom-1 -left-4 bg-[#eef2f6] px-1 text-[10px] font-semibold text-mist tabular-nums">
                    {lng}°E
                  </span>
                </div>
              );
            })}

            <span className="absolute top-[63%] left-[18%] text-[10px] font-semibold tracking-[0.3em] text-mist/70 uppercase sm:text-xs">
              Bay of Bengal ↓
            </span>

            {spots.map((spot) => {
              const pos = project(spot.coordinates);
              const chapter = chapterByCategory[spot.category];
              const isFocus = spot.id === focus?.id;
              const dimmed = category && spot.category !== category;
              return (
                <button
                  key={spot.id}
                  type="button"
                  onMouseEnter={() => setFocusId(spot.id)}
                  onFocus={() => setFocusId(spot.id)}
                  onClick={() => (isFocus ? openSpot(spot.id) : setFocusId(spot.id))}
                  aria-label={`${spot.name}, ${spot.district}`}
                  className={`group absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition duration-300 active:scale-95 ${
                    isFocus ? 'z-20' : 'z-10'
                  } ${dimmed ? 'opacity-25' : 'opacity-100'}`}
                  style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
                >
                  {isFocus && <span className={`absolute inset-0 animate-ping rounded-full opacity-40 ${chapter.dotClass}`} />}
                  <span
                    className={`relative rounded-full ring-2 ring-white transition-all ${chapter.dotClass} ${
                      isFocus ? 'h-4 w-4' : 'h-2.5 w-2.5 group-hover:h-3.5 group-hover:w-3.5'
                    }`}
                  />
                  {isFocus && (
                    <span className="pointer-events-none absolute bottom-full mb-1.5 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap text-white shadow-lg">
                      {spot.name}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

import { getImageSrc } from '@utils';
import { SmartImage } from '../ui/SmartImage.jsx';

const CONTOUR_PATHS = [
  'M -40 210 C 140 120, 320 260, 520 150 C 710 45, 920 190, 1240 95',
  'M -40 250 C 170 155, 360 295, 560 185 C 760 80, 960 225, 1240 135',
  'M -40 290 C 190 195, 400 325, 610 225 C 800 125, 1000 255, 1240 175',
  'M -40 165 C 120 80, 290 215, 480 110 C 680 15, 890 155, 1240 55',
];

/** Bold typographic banner with SVG topographic contour draw-in and masked reveals. */
export function ChapterHeader({ chapter, count, coverUrl }) {
  const kickerWords = chapter.kicker.split(' ');

  return (
    <header className="relative isolate overflow-hidden rounded-4xl border border-transparent bg-ink px-5 pt-6 pb-7 text-white transition-colors duration-300 dark:border-white/10 dark:bg-[#131C2E] sm:px-10 sm:pt-10 sm:pb-10 lg:px-14 lg:pt-12 lg:pb-14">
      <div data-chapter-bg aria-hidden="true" className="absolute inset-x-0 -top-[15%] -bottom-[15%] -z-10 opacity-35">
        <SmartImage
          src={getImageSrc(coverUrl, 'card')}
          fallbackSrc={coverUrl}
          alt=""
          className="h-full w-full bg-ink"
          imgClassName="h-full w-full object-cover grayscale-[35%]"
        />
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />

      {/* Custom architectural SVG topographic contour lines drawn on scroll entry */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 320"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-35"
      >
        {CONTOUR_PATHS.map((d, idx) => (
          <path
            key={idx}
            data-chapter-contour
            d={d}
            fill="none"
            stroke="rgba(255,255,255,0.42)"
            strokeWidth={idx === 1 ? 1.25 : 0.85}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      <div className="flex items-center justify-between gap-4 text-[11px] font-semibold tracking-[0.24em] uppercase">
        <span className="flex items-center gap-2 text-white/70">
          <span className={`h-2 w-2 rounded-full ${chapter.dotClass}`} aria-hidden="true" />
          Chapter {chapter.number}
        </span>
        <span className="rounded-full border border-white/20 px-3 py-1 text-white/80">
          {count} destinations
        </span>
      </div>

      {/* Draw-in architectural hairline divider */}
      <div
        data-chapter-rule
        aria-hidden="true"
        className="mt-5 h-px w-full origin-left bg-gradient-to-r from-white/35 via-white/15 to-transparent"
      />

      <div className="mt-7 flex flex-col gap-6 lg:mt-10 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="flex items-end gap-2.5 font-display sm:gap-5">
          <span className="inline-block overflow-hidden py-1">
            <span
              data-chapter-number
              className="block leading-[0.84] font-black tracking-[-0.06em] text-transparent [-webkit-text-stroke:1.5px_rgb(255_255_255/0.55)]"
              style={{ fontSize: 'clamp(2.5rem, 9.5vw, 9.5rem)' }}
            >
              {chapter.number}
            </span>
          </span>
          <span className="inline-block overflow-hidden py-1">
            <span
              data-chapter-title
              className="block leading-[0.84] font-black tracking-[-0.06em]"
              style={{ fontSize: 'clamp(2.5rem, 9.5vw, 9.5rem)' }}
            >
              {chapter.title}
            </span>
          </span>
        </h2>

        <div className="max-w-md lg:pb-2">
          <p className="flex flex-wrap gap-x-1.5 text-[11px] font-semibold tracking-[0.22em] text-white/60 uppercase">
            {kickerWords.map((word, idx) => (
              <span key={`${word}-${idx}`} className="inline-block overflow-hidden">
                <span data-chapter-word className="inline-block">
                  {word}
                </span>
              </span>
            ))}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/85 sm:text-base">{chapter.intro}</p>
        </div>
      </div>
    </header>
  );
}

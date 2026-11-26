import { getImageSrc } from '@utils';
import { SmartImage } from '../ui/SmartImage.jsx';

const CONTOUR_SETS = {
  Hills: {
    stroke: 'rgba(110, 231, 183, 0.42)',
    glow: 'radial-gradient(ellipse 65% 80% at 24% 52%, rgba(16, 185, 129, 0.24) 0%, rgba(16, 185, 129, 0.06) 45%, transparent 78%)',
    paths: [
      'M -40 230 C 120 110, 260 215, 430 115 C 600 20, 770 175, 960 85 C 1080 30, 1160 90, 1240 60',
      'M -40 265 C 150 145, 290 250, 460 155 C 630 60, 800 210, 990 120 C 1100 68, 1175 125, 1240 100',
      'M -40 300 C 180 185, 320 285, 500 195 C 670 105, 840 245, 1020 160 C 1125 110, 1190 160, 1240 140',
      'M -40 185 C 100 80, 240 175, 405 78 C 575 -15, 745 135, 935 45 C 1055 -10, 1150 55, 1240 25',
    ],
  },
  Sea: {
    stroke: 'rgba(125, 211, 252, 0.42)',
    glow: 'radial-gradient(ellipse 65% 80% at 24% 52%, rgba(56, 189, 248, 0.24) 0%, rgba(56, 189, 248, 0.06) 45%, transparent 78%)',
    paths: [
      'M -40 190 Q 180 130, 400 190 T 840 190 T 1240 180',
      'M -40 230 Q 210 170, 430 230 T 870 230 T 1240 220',
      'M -40 270 Q 240 215, 460 270 T 900 270 T 1240 260',
      'M -40 150 Q 150 95, 370 150 T 810 150 T 1240 140',
    ],
  },
  Forest: {
    stroke: 'rgba(134, 239, 172, 0.4)',
    glow: 'radial-gradient(ellipse 65% 80% at 24% 52%, rgba(34, 197, 94, 0.22) 0%, rgba(34, 197, 94, 0.06) 45%, transparent 78%)',
    paths: [
      'M -40 215 C 160 170, 270 260, 470 185 C 660 115, 810 235, 1010 155 C 1115 115, 1185 160, 1240 135',
      'M -40 250 C 190 205, 310 295, 510 220 C 700 150, 850 265, 1045 190 C 1140 152, 1195 195, 1240 175',
      'M -40 285 C 220 245, 350 325, 550 255 C 740 185, 890 295, 1080 225 C 1165 192, 1210 225, 1240 212',
      'M -40 175 C 130 130, 240 220, 435 145 C 625 75, 780 195, 975 115 C 1090 72, 1170 120, 1240 95',
    ],
  },
  Heritage: {
    stroke: 'rgba(252, 211, 77, 0.42)',
    glow: 'radial-gradient(ellipse 65% 80% at 24% 52%, rgba(245, 158, 11, 0.22) 0%, rgba(245, 158, 11, 0.06) 45%, transparent 78%)',
    paths: [
      'M -40 220 C 140 140, 300 140, 480 220 C 660 140, 820 140, 1000 220 C 1100 175, 1175 175, 1240 205',
      'M -40 255 C 140 175, 300 175, 480 255 C 660 175, 820 175, 1000 255 C 1100 210, 1175 210, 1240 240',
      'M -40 290 C 140 210, 300 210, 480 290 C 660 210, 820 210, 1000 290 C 1100 245, 1175 245, 1240 275',
      'M -40 185 C 140 105, 300 105, 480 185 C 660 105, 820 105, 1000 185 C 1100 140, 1175 140, 1240 170',
    ],
  },
};

/** Bold typographic banner with chapter-specific glow, self-drawing contours, and dual-speed inner parallax. */
export function ChapterHeader({ chapter, count, coverUrl }) {
  const kickerWords = chapter.kicker.split(' ');
  const contour = CONTOUR_SETS[chapter.category] ?? CONTOUR_SETS.Hills;

  return (
    <header
      data-chapter-banner
      className="relative isolate overflow-hidden rounded-4xl border border-transparent bg-ink px-5 pt-6 pb-7 text-white transition-colors duration-300 will-change-transform dark:border-white/10 dark:bg-[#131C2E] sm:px-10 sm:pt-10 sm:pb-10 lg:px-14 lg:pt-12 lg:pb-14"
    >
      <div
        data-chapter-bg
        aria-hidden="true"
        className="absolute inset-x-0 -top-[15%] -bottom-[15%] -z-10 opacity-35 will-change-transform"
      >
        <SmartImage
          src={getImageSrc(coverUrl, 'card')}
          fallbackSrc={coverUrl}
          alt=""
          className="h-full w-full bg-ink"
          imgClassName="h-full w-full object-cover grayscale-[35%]"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/40 dark:from-[#0f172a] dark:via-[#0f172a]/85 dark:to-[#0f172a]/40"
      />

      {/* Chapter-specific inner atmosphere glow shifted via ScrollTrigger */}
      <div
        data-chapter-glow
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-[15%] inset-y-0 -z-10 will-change-transform"
        style={{ background: contour.glow }}
      />

      {/* Custom chapter-specific SVG topographic contour lines drawn on scroll entry */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 320"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-45"
      >
        {contour.paths.map((d, idx) => (
          <path
            key={idx}
            data-chapter-contour
            d={d}
            fill="none"
            stroke={idx === 1 ? contour.stroke : 'rgba(255,255,255,0.36)'}
            strokeWidth={idx === 1 ? 1.45 : 0.9}
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

      {/* Draw-in architectural hairline divider (scaleX: 0 → 1) */}
      <div
        data-chapter-rule
        aria-hidden="true"
        className="mt-5 h-px w-full origin-left bg-gradient-to-r from-white/40 via-white/15 to-transparent"
      />

      <div className="mt-7 flex flex-col gap-6 lg:mt-10 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="flex items-end gap-2.5 font-display sm:gap-5">
          <span data-chapter-number-scrub className="inline-block will-change-transform">
            <span className="inline-block overflow-hidden py-1">
              <span
                data-chapter-number
                className="block leading-[0.84] font-black tracking-[-0.06em] text-transparent [-webkit-text-stroke:1.5px_rgb(255_255_255/0.55)] will-change-transform"
                style={{ fontSize: 'clamp(2.5rem, 9.5vw, 9.5rem)' }}
              >
                {chapter.number}
              </span>
            </span>
          </span>
          <span data-chapter-title-scrub className="inline-block will-change-transform">
            <span className="inline-block overflow-hidden py-1">
              <span
                data-chapter-title
                className="block leading-[0.84] font-black tracking-[-0.06em] will-change-transform"
                style={{ fontSize: 'clamp(2.5rem, 9.5vw, 9.5rem)' }}
              >
                {chapter.title}
              </span>
            </span>
          </span>
        </h2>

        <div data-chapter-desc className="max-w-md will-change-transform lg:pb-2">
          <p className="flex flex-wrap gap-x-1.5 text-[11px] font-semibold tracking-[0.22em] text-white/60 uppercase">
            {kickerWords.map((word, idx) => (
              <span key={`${word}-${idx}`} className="inline-block overflow-hidden">
                <span data-chapter-word className="inline-block will-change-transform">
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

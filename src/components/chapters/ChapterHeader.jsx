import { getImageSrc } from '@utils';
import { SmartImage } from '../ui/SmartImage.jsx';

/** Bold typographic banner that opens each editorial chapter. */
export function ChapterHeader({ chapter, count, coverUrl }) {
  return (
    <header className="relative isolate overflow-hidden rounded-4xl bg-ink px-5 pt-6 pb-7 text-white sm:px-10 sm:pt-10 sm:pb-10 lg:px-14 lg:pt-12 lg:pb-14">
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

      <div className="flex items-center justify-between gap-4 text-[11px] font-semibold tracking-[0.24em] uppercase">
        <span className="flex items-center gap-2 text-white/70">
          <span className={`h-2 w-2 rounded-full ${chapter.dotClass}`} aria-hidden="true" />
          Chapter {chapter.number}
        </span>
        <span className="rounded-full border border-white/20 px-3 py-1 text-white/80">
          {count} destinations
        </span>
      </div>

      <div className="mt-8 flex flex-col gap-6 lg:mt-12 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="flex items-end gap-3 font-display sm:gap-5">
          <span
            data-chapter-number
            className="leading-[0.8] font-black tracking-[-0.06em] text-transparent [-webkit-text-stroke:1.5px_rgb(255_255_255/0.55)]"
            style={{ fontSize: 'clamp(3.2rem, 10vw, 9.5rem)' }}
          >
            {chapter.number}
          </span>
          <span
            data-chapter-title
            className="leading-[0.8] font-black tracking-[-0.06em]"
            style={{ fontSize: 'clamp(3.2rem, 10vw, 9.5rem)' }}
          >
            {chapter.title}
          </span>
        </h2>

        <div className="max-w-md lg:pb-2">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-white/60 uppercase">{chapter.kicker}</p>
          <p className="mt-2 text-sm leading-relaxed text-white/85 sm:text-base">{chapter.intro}</p>
        </div>
      </div>
    </header>
  );
}

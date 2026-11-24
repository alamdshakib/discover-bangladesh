import { ArrowUp } from 'lucide-react';
import { SITE_META } from '@data';
import { scrollToTarget } from '@animations';

export function Footer() {
  return (
    <footer className="mt-24 px-3 pb-3 sm:mt-32 sm:px-5 sm:pb-5">
      <div className="mx-auto max-w-[1600px] overflow-hidden rounded-4xl bg-ink px-5 pt-10 pb-6 text-white sm:px-10 sm:pt-14 lg:px-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold tracking-[0.24em] text-white/50 uppercase">{SITE_META.edition}</p>
            <p className="mt-3 font-display text-2xl leading-tight font-bold tracking-[-0.02em] sm:text-3xl">
              {SITE_META.tagline}.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              A purely visual showcase and travel guide — no bookings, no pricing. Photography courtesy of Wikimedia
              Commons contributors; tap the credit on any photo for its source and license.
            </p>
          </div>
          <button
            type="button"
            onClick={() => scrollToTarget(0, { offset: 0 })}
            className="inline-flex h-12 w-fit items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-ink transition hover:bg-canvas active:scale-95"
          >
            <ArrowUp className="h-4 w-4" strokeWidth={2.2} />
            Back to top
          </button>
        </div>

        <p
          aria-hidden="true"
          className="mt-12 font-display leading-[0.8] font-black tracking-[-0.06em] text-transparent select-none [-webkit-text-stroke:1px_rgb(255_255_255/0.22)]"
          style={{ fontSize: 'clamp(3.5rem, 15vw, 15rem)' }}
        >
          BANGLADESH
        </p>

        <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-white/50 sm:flex-row sm:justify-between">
          <span>© 2026 {SITE_META.name}</span>
          <span>Hills · Sea · Forest · Heritage</span>
        </div>
      </div>
    </footer>
  );
}

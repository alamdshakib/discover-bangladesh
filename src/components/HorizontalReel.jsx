import { useLayoutEffect, useMemo, useRef } from 'react';
import { ArrowRight, Maximize2 } from 'lucide-react';
import { useShowcase } from '@hooks';
import { gsap, MEDIA, ScrollTrigger } from '@animations';
import { getImageSrc } from '@utils';
import { SmartImage } from './ui/SmartImage.jsx';

const REEL_IDS = [
  'sajek-valley',
  'coxs-bazar',
  'sundarbans',
  'tanguar-haor',
  'saint-martins-island',
  'nafakhum-waterfall',
  'paharpur-buddhist-vihara',
  'sreemangal-tea-gardens',
];

/**
 * GSAP Pinned Horizontal Gallery ("Golden Hour Reel") positioned between the 4 Chapters
 * and Coordinate Atlas Map. Desktop (lg+) pins vertically and glides horizontally with
 * inner X parallax; Mobile (< 1024px) & reduced-motion use native horizontal snap scroll.
 */
export function HorizontalReel() {
  const { spots, openLightbox, openSpot } = useShowcase();
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const progressBarRef = useRef(null);
  const counterRef = useRef(null);

  const reelSpots = useMemo(() => {
    const byId = new Map(spots.map((s) => [s.id, s]));
    const curated = REEL_IDS.map((id) => byId.get(id)).filter(Boolean);
    return curated.length === 8 ? curated : spots.slice(0, 8);
  }, [spots]);

  const totalStr = String(reelSpots.length).padStart(2, '0');

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pinEl = pinRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !pinEl || !viewport || !track) return undefined;

    const mm = gsap.matchMedia(sectionRef);

    mm.add({ isDesktop: MEDIA.desktop, motion: MEDIA.motion }, (ctx) => {
      const { isDesktop, motion } = ctx.conditions;

      // Reset mobile inline transform if resizing between desktop <-> mobile
      gsap.set(track, { clearProps: 'transform' });

      if (!isDesktop || !motion) {
        if (progressBarRef.current) {
          gsap.set(progressBarRef.current, { scaleX: reelSpots.length ? 1 / reelSpots.length : 0.125 });
        }
        if (counterRef.current) {
          counterRef.current.textContent = `01 / ${totalStr}`;
        }
        return undefined;
      }

      const getScrollAmount = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

      const updateHud = (progress) => {
        const clamped = Math.max(0, Math.min(1, progress));
        if (progressBarRef.current) {
          progressBarRef.current.style.transform = `scaleX(${clamped.toFixed(4)})`;
        }
        if (counterRef.current) {
          const activeIndex = Math.min(reelSpots.length, Math.max(1, Math.round(clamped * (reelSpots.length - 1)) + 1));
          counterRef.current.textContent = `${String(activeIndex).padStart(2, '0')} / ${totalStr}`;
        }
      };

      const horizontalTween = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: pinEl,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          start: 'top top',
          end: () => `+=${Math.max(getScrollAmount(), 640)}`,
          onUpdate: (self) => updateHud(self.progress),
        },
      });

      // Inner photographic X parallax across every horizontal frame (zero skew, zero 3D tilt)
      const cards = track.querySelectorAll('[data-reel-card]');
      cards.forEach((cardEl) => {
        const imgEl = cardEl.querySelector('[data-reel-img]');
        if (!imgEl) return;
        gsap.fromTo(
          imgEl,
          { xPercent: -10 },
          {
            xPercent: 10,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: {
              trigger: cardEl,
              containerAnimation: horizontalTween,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          }
        );
      });

      const refreshRaf = window.requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        window.cancelAnimationFrame(refreshRaf);
      };
    });

    // Keep ScrollTrigger trigger offsets downstream (Atlas + Footer) accurate after cleanup
    return () => {
      mm.revert();
      window.requestAnimationFrame(() => ScrollTrigger.refresh());
    };
  }, [reelSpots.length, totalStr]);

  // Mobile native horizontal snap progress tracker
  const handleMobileScroll = () => {
    if (window.innerWidth >= 1024) return;
    const viewport = viewportRef.current;
    if (!viewport) return;
    const maxScroll = Math.max(1, viewport.scrollWidth - viewport.clientWidth);
    const ratio = Math.max(0, Math.min(1, viewport.scrollLeft / maxScroll));
    if (progressBarRef.current) {
      progressBarRef.current.style.transform = `scaleX(${Math.max(0.125, ratio).toFixed(4)})`;
    }
    if (counterRef.current) {
      const idx = Math.min(reelSpots.length, Math.max(1, Math.round(ratio * (reelSpots.length - 1)) + 1));
      counterRef.current.textContent = `${String(idx).padStart(2, '0')} / ${totalStr}`;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="golden-hour-reel"
      data-horizontal-reel
      aria-label="Golden Hour Reel photographic showcase"
      className="relative mt-20 overflow-x-clip border-y border-line/80 bg-white/40 transition-colors duration-300 dark:border-white/10 dark:bg-[#0d1526]/65 sm:mt-28"
    >
      <div
        ref={pinRef}
        data-reel-pin
        className="flex flex-col justify-center py-12 sm:py-16 lg:min-h-[100svh] lg:pt-20 lg:pb-8"
      >
        {/* Editorial Header Row */}
        <div className="mx-auto flex w-full max-w-[1600px] items-end justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.24em] text-bd-green uppercase dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-bd-green dark:bg-emerald-400" aria-hidden="true" />
              Golden Hour Reel
            </p>
            <h2
              className="mt-1.5 font-display leading-[0.94] font-black tracking-[-0.045em] text-ink transition-colors duration-300 dark:text-slate-50"
              style={{ fontSize: 'clamp(1.85rem, 4.2vw, 3.6rem)' }}
            >
              Eight frames across Bengal.
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span
              ref={counterRef}
              data-reel-counter
              className="rounded-full border border-line bg-white/90 px-3.5 py-1.5 font-mono text-xs font-semibold text-ink tabular-nums shadow-sm transition-colors duration-300 dark:border-white/15 dark:bg-[#131C2E] dark:text-slate-100"
            >
              01 / {totalStr}
            </span>
          </div>
        </div>

        {/* Horizontal Reel Track (Pinned scrub on lg+, native horizontal snap carousel on mobile) */}
        <div
          ref={viewportRef}
          data-reel-viewport
          onScroll={handleMobileScroll}
          className="no-scrollbar mt-6 w-full max-lg:snap-x max-lg:snap-mandatory max-lg:overflow-x-auto sm:mt-8 lg:overflow-hidden"
        >
          <div
            ref={trackRef}
            data-reel-track
            className="flex w-max items-stretch gap-4 px-4 will-change-transform sm:gap-6 sm:px-6 lg:px-[max(2rem,calc((100vw-1600px)/2+2rem))]"
          >
            {reelSpots.map((spot, idx) => {
              const numLabel = `${String(idx + 1).padStart(2, '0')} / ${totalStr}`;
              return (
                <article
                  key={spot.id}
                  data-reel-card
                  className="group relative flex h-[clamp(300px,46svh,440px)] w-[82vw] shrink-0 overflow-hidden rounded-3xl border border-line bg-ink shadow-[0_24px_56px_-26px_rgba(15,23,42,0.42)] transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:border-slate-300/90 hover:shadow-[0_32px_68px_-24px_rgba(15,23,42,0.5)] max-lg:snap-center dark:border-white/12 dark:shadow-[0_28px_60px_-24px_rgba(0,0,0,0.85)] dark:hover:border-white/30 sm:w-[66vw] lg:w-[clamp(440px,44vw,620px)]"
                >
                  {/* Main Full-Bleed Frame Click -> Opens Cinema Lightbox */}
                  <button
                    type="button"
                    data-cursor="view"
                    data-reel-open={spot.id}
                    onClick={() => openLightbox(spot.id, 0)}
                    aria-label={`Open ${spot.name} in Cinema Lightbox`}
                    className="relative block h-full w-full cursor-zoom-in text-left"
                  >
                    <div className="h-full w-full overflow-hidden">
                      <div
                        data-reel-img
                        className="h-full w-full scale-[1.24] will-change-transform"
                      >
                        <SmartImage
                          src={getImageSrc(spot.images.cover, 'full')}
                          fallbackSrc={spot.images.cover}
                          alt={`${spot.name}, ${spot.district}`}
                          loading={idx < 3 ? 'eager' : 'lazy'}
                          className="h-full w-full"
                          imgClassName="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        />
                      </div>
                    </div>

                    {/* Natural Dark Editorial Vignette */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050912]/90 via-[#050912]/20 to-[#050912]/25"
                    />

                    {/* Top Floating Index & Lightbox Expand Indicator */}
                    <span className="pointer-events-none absolute top-4 left-4 z-10 rounded-full border border-white/25 bg-black/45 px-3 py-1 font-mono text-[11px] font-semibold tracking-wider text-white/95 tabular-nums backdrop-blur-md">
                      {numLabel}
                    </span>

                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white opacity-80 backdrop-blur-md transition duration-300 group-hover:scale-105 group-hover:bg-white group-hover:text-ink group-hover:opacity-100"
                    >
                      <Maximize2 className="h-3.5 w-3.5" strokeWidth={2.2} />
                    </span>

                    {/* Bottom-Left Destination Title & Division */}
                    <span className="pointer-events-none absolute bottom-4 left-4 z-10 max-w-[68%] text-white sm:bottom-5 sm:left-5">
                      <span className="block text-[10px] font-semibold tracking-[0.2em] text-emerald-300/95 uppercase">
                        {spot.division} Division
                      </span>
                      <span className="mt-0.5 block truncate font-display text-xl leading-tight font-bold tracking-[-0.02em] sm:text-2xl">
                        {spot.name}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-white/75">{spot.district}</span>
                    </span>
                  </button>

                  {/* Separate Action Pill -> Opens Spot Detail Modal (zero nested button elements) */}
                  <button
                    type="button"
                    data-cursor="magnetic"
                    onClick={() => openSpot(spot.id)}
                    aria-label={`View ${spot.name} travel guide details`}
                    className="glass-dark absolute right-4 bottom-4 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/25 px-3.5 py-2 text-xs font-semibold text-white transition hover:border-white/50 hover:bg-ink active:scale-95 sm:right-5 sm:bottom-5"
                  >
                    <span>Guide</span>
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
                  </button>
                </article>
              );
            })}
          </div>
        </div>

        {/* Live Bottom Horizontal Progress Bar & Instruction */}
        <div className="mx-auto mt-6 flex w-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:mt-7 lg:px-8">
          <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-line dark:bg-white/15">
            <div
              ref={progressBarRef}
              data-reel-progress-bar
              className="h-full w-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-bd-green via-emerald-500 to-sky-400 shadow-[0_0_10px_rgba(16,185,129,0.45)] will-change-transform"
            />
          </div>
          <p className="hidden shrink-0 text-[11px] font-medium tracking-wider text-ink-soft uppercase dark:text-slate-400 lg:block">
            Scroll to glide · Click any frame for Cinema View
          </p>
          <p className="shrink-0 text-[11px] font-medium tracking-wider text-ink-soft uppercase dark:text-slate-400 lg:hidden">
            Swipe · Tap photo
          </p>
        </div>
      </div>
    </section>
  );
}

import { useLayoutEffect, useRef } from 'react';
import { ArrowDownRight, Map, MapPin } from 'lucide-react';
import { SITE_META, SECTION_IDS } from '@data';
import { useShowcase } from '@hooks';
import { gsap, MEDIA, scrollToTarget } from '@animations';
import { getImageSrc } from '@utils';
import { SmartImage } from '../ui/SmartImage.jsx';

const HERO_SPOT_ID = 'sajek-valley';

export function Hero() {
  const { spots, openSpot } = useShowcase();
  const scopeRef = useRef(null);
  const heroSpot = spots.find((s) => s.id === HERO_SPOT_ID) ?? spots[0];

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(scopeRef);

    mm.add({ isDesktop: MEDIA.desktop, reduce: MEDIA.reduceMotion }, (ctx) => {
      const { isDesktop, reduce } = ctx.conditions;
      if (reduce) return;

      // Intro reveal (all devices)
      gsap.from('[data-hero-reveal]', {
        y: 48,
        opacity: 0,
        duration: 1.1,
        stagger: 0.08,
        ease: 'expo.out',
      });
      gsap.from('[data-hero-frame]', { opacity: 0, duration: 1.05, delay: 0.12, ease: 'expo.out' });
      gsap.from('[data-hero-copy] > *', { y: 24, opacity: 0, duration: 0.9, delay: 0.55, stagger: 0.08 });

      if (isDesktop) {
        // Reverse scrubbed hero: starts large & full width, smoothly shrinks and rounds inward on scroll.
        const scrub = { trigger: scopeRef.current, start: 'top top', end: 'bottom 25%', scrub: 0.6 };
        gsap.fromTo(
          '[data-hero-frame]',
          { scale: 1, borderRadius: '1.75rem', transformOrigin: 'center top' },
          { scale: 0.89, borderRadius: '2.75rem', ease: 'none', scrollTrigger: scrub }
        );
        gsap.fromTo(
          '[data-hero-media]',
          { scale: 1.04, yPercent: -3 },
          { scale: 1.12, yPercent: 5, ease: 'none', scrollTrigger: scrub }
        );
        gsap.to('[data-hero-title]', { y: -12, opacity: 0.55, ease: 'none', scrollTrigger: scrub });
      } else {
        // Light parallax only — no pinning, natural touch scrolling.
        gsap.fromTo(
          '[data-hero-media]',
          { scale: 1.04, yPercent: -2 },
          {
            scale: 1.08,
            yPercent: 4,
            ease: 'none',
            scrollTrigger: { trigger: '[data-hero-frame]', start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section id={SECTION_IDS.top} ref={scopeRef} className="relative px-3 pt-28 sm:px-5 sm:pt-32">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-4 px-1 sm:px-3 lg:flex-row lg:items-end lg:justify-between">
          <p
            data-hero-reveal
            className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.24em] text-ink-soft uppercase"
          >
            <span className="h-2 w-2 rounded-full bg-bd-green" aria-hidden="true" />
            {SITE_META.edition}
          </p>
          <p data-hero-reveal className="max-w-md text-sm leading-relaxed text-ink-soft">
            {SITE_META.description}
          </p>
        </div>

        <h1
          data-hero-title
          className="mt-5 flex flex-wrap items-end gap-x-5 gap-y-2 px-0.5 font-display text-ink sm:px-2"
        >
          <span
            data-hero-reveal
            className="block leading-[0.88] font-black tracking-[-0.06em]"
            style={{ fontSize: 'clamp(3.4rem, 14.5vw, 14.5rem)' }}
          >
            DISCOVER
          </span>
          <span
            data-hero-reveal
            className="mb-[0.35em] flex items-center gap-3 font-bold tracking-[0.45em] text-mist"
            style={{ fontSize: 'clamp(0.8rem, 1.55vw, 1.5rem)' }}
          >
            <span className="h-px w-8 bg-mist sm:w-12" aria-hidden="true" />
            BANGLADESH
          </span>
        </h1>

        <div
          data-hero-frame
          className="relative mt-6 h-[clamp(460px,72svh,820px)] w-full overflow-hidden rounded-[1.75rem] bg-ink will-change-transform sm:mt-8"
        >
          <div data-hero-media className="absolute inset-0 will-change-transform">
            <SmartImage
              src={getImageSrc(heroSpot.images.cover, 'full')}
              alt={`${heroSpot.name}, ${heroSpot.district} — misty hills at sunrise`}
              loading="eager"
              fetchPriority="high"
              className="h-full w-full"
              imgClassName="h-full w-full object-cover"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-ink/10"
          />

          <button
            type="button"
            onClick={() => openSpot(heroSpot.id)}
            className="glass absolute top-4 right-4 z-10 flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-full border border-white/60 py-1.5 pr-3.5 pl-2 text-xs font-semibold text-ink transition active:scale-95 sm:top-6 sm:right-6"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-white">
              <MapPin className="h-3.5 w-3.5" strokeWidth={2.2} />
            </span>
            <span className="truncate">
              {heroSpot.name}, {heroSpot.district}
            </span>
          </button>

          <div
            data-hero-copy
            className="absolute inset-x-0 bottom-0 flex flex-col gap-6 p-5 text-white sm:p-10 lg:flex-row lg:items-end lg:justify-between lg:p-14"
          >
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold tracking-[0.24em] text-white/70 uppercase">
                Hills · Sea · Forest · Heritage
              </p>
              <p
                className="mt-3 font-display leading-[1.02] font-bold tracking-[-0.03em]"
                style={{ fontSize: 'clamp(1.65rem, 3.6vw, 3.4rem)' }}
              >
                Rivers, ridges, mangroves &amp; a thousand years of living heritage.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => scrollToTarget(`#${SECTION_IDS.showcase}`)}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-ink transition hover:bg-canvas active:scale-95"
              >
                Explore Destinations
                <ArrowDownRight className="h-4 w-4" strokeWidth={2.2} />
              </button>
              <button
                type="button"
                onClick={() => scrollToTarget(`#${SECTION_IDS.atlas}`)}
                className="glass-dark inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-sm font-semibold text-white transition hover:bg-ink active:scale-95"
              >
                <Map className="h-4 w-4" strokeWidth={2} />
                Interactive Map
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

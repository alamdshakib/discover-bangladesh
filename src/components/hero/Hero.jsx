import { useLayoutEffect, useRef } from 'react';
import { ArrowDownRight, Map, MapPin } from 'lucide-react';
import { SITE_META, SECTION_IDS } from '@data';
import { useShowcase } from '@hooks';
import { gsap, MEDIA, scrollToTarget } from '@animations';
import { getImageSrc } from '@utils';
import { SmartImage } from '../ui/SmartImage.jsx';
import { HeroTerrain3D } from '../HeroTerrain3D.jsx';

const HERO_SPOT_ID = 'sajek-valley';

export function Hero() {
  const { spots, openSpot } = useShowcase();
  const scopeRef = useRef(null);
  const heroSpot = spots.find((s) => s.id === HERO_SPOT_ID) ?? spots[0];

  useLayoutEffect(() => {
    let cleanupWait = null;
    const mm = gsap.matchMedia(scopeRef);

    mm.add({ isDesktop: MEDIA.desktop, reduce: MEDIA.reduceMotion }, (ctx) => {
      const { isDesktop, reduce } = ctx.conditions;
      if (reduce) return;

      const scope = scopeRef.current;
      const lines = scope.querySelectorAll('[data-hero-line]');
      const frame = scope.querySelector('[data-hero-frame]');
      const copyItems = scope.querySelectorAll('[data-hero-copy] > *');

      gsap.set(lines, { yPercent: 115, rotateX: 12, opacity: 0, transformOrigin: 'bottom center' });
      gsap.set(frame, { opacity: 0, y: 18 });
      gsap.set(copyItems, { y: 24, opacity: 0 });

      const playEntrance = () => {
        const tl = gsap.timeline();
        tl.to(
          lines,
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            duration: 1.05,
            stagger: 0.08,
            ease: 'power4.out',
            clearProps: 'transform',
          },
          0
        );
        tl.to(frame, { opacity: 1, y: 0, duration: 1.0, ease: 'expo.out', clearProps: 'transform' }, 0.14);
        tl.to(copyItems, { y: 0, opacity: 1, duration: 0.85, stagger: 0.08, ease: 'power3.out', clearProps: 'transform' }, 0.42);
      };

      // Hand off smoothly from the cinematic intro at the exact millisecond curtains split.
      const introActive = Boolean(document.querySelector('[data-cinematic-intro]'));
      if (introActive) {
        let played = false;
        const trigger = () => {
          if (played) return;
          played = true;
          playEntrance();
        };
        window.addEventListener('db:intro-done', trigger, { once: true });
        const fallbackId = window.setTimeout(trigger, 4200);
        cleanupWait = () => {
          window.removeEventListener('db:intro-done', trigger);
          window.clearTimeout(fallbackId);
        };
      } else {
        playEntrance();
      }

      // Slow ambient Ken Burns drift on the hero photograph
      gsap.fromTo(
        scope.querySelector('[data-hero-kenburns]'),
        { scale: 1.0 },
        { scale: 1.075, duration: 18, ease: 'sine.inOut', repeat: -1, yoyo: true }
      );

      if (isDesktop) {
        // Reverse scrubbed hero: starts large & full width, smoothly shrinks & rounds inward on scroll
        // while counter-parallaxing the internal photo and floating metadata layers independently.
        const scrub = { trigger: scope, start: 'top top', end: 'bottom 22%', scrub: 1 };
        gsap.fromTo(
          '[data-hero-frame]',
          { scale: 1, borderRadius: '1.75rem', transformOrigin: 'center top' },
          { scale: 0.9, borderRadius: '2.75rem', ease: 'none', scrollTrigger: scrub }
        );
        gsap.fromTo(
          '[data-hero-media]',
          { scale: 1.08, yPercent: -6 },
          { scale: 1.14, yPercent: 12, ease: 'none', scrollTrigger: scrub }
        );
        gsap.to('[data-hero-pill]', { y: -26, ease: 'none', scrollTrigger: scrub });
        gsap.to('[data-hero-copy]', { y: 22, ease: 'none', scrollTrigger: scrub });
        gsap.to('[data-hero-title]', { y: -16, opacity: 0.5, ease: 'none', scrollTrigger: scrub });
      } else {
        // Light touch-friendly parallax — no pinning, zero clipping.
        gsap.fromTo(
          '[data-hero-media]',
          { scale: 1.06, yPercent: -3 },
          {
            scale: 1.1,
            yPercent: 6,
            ease: 'none',
            scrollTrigger: { trigger: '[data-hero-frame]', start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
      }
    });

    return () => {
      cleanupWait?.();
      mm.revert();
    };
  }, []);

  return (
    <section
      id={SECTION_IDS.top}
      ref={scopeRef}
      className="relative isolate overflow-x-clip px-3 pt-28 sm:px-5 sm:pt-32"
    >
      {/* WebGL 3D procedural topographic terrain & atmospheric mist */}
      <HeroTerrain3D sectionRef={scopeRef} />

      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-4 px-1 sm:px-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="overflow-hidden [perspective:900px]">
            <p
              data-hero-line
              className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.24em] text-ink-soft uppercase transition-colors duration-300 dark:text-slate-400"
            >
              <span className="h-2 w-2 rounded-full bg-bd-green" aria-hidden="true" />
              {SITE_META.edition}
            </p>
          </div>
          <div className="overflow-hidden [perspective:900px]">
            <p
              data-hero-line
              className="max-w-md text-sm leading-relaxed text-ink-soft transition-colors duration-300 dark:text-slate-400"
            >
              {SITE_META.description}
            </p>
          </div>
        </div>

        <h1
          data-hero-title
          className="mt-5 flex flex-wrap items-end gap-x-5 gap-y-2 px-0.5 font-display text-ink transition-colors duration-300 dark:text-slate-50 sm:px-2"
        >
          <span className="inline-block overflow-hidden py-1 [perspective:900px]">
            <span
              data-hero-line
              className="block leading-[0.88] font-black tracking-[-0.06em]"
              style={{ fontSize: 'clamp(2.85rem, 13.8vw, 14.5rem)' }}
            >
              DISCOVER
            </span>
          </span>
          <span className="inline-block overflow-hidden py-1 [perspective:900px]">
            <span
              data-hero-line
              className="mb-[0.35em] flex items-center gap-3 font-bold tracking-[0.32em] text-mist transition-colors duration-300 dark:text-slate-400 sm:tracking-[0.45em]"
              style={{ fontSize: 'clamp(0.8rem, 1.55vw, 1.5rem)' }}
            >
              <span className="h-px w-8 bg-mist dark:bg-slate-600 sm:w-12" aria-hidden="true" />
              BANGLADESH
            </span>
          </span>
        </h1>

        <div
          data-hero-frame
          data-cursor="explore"
          className="relative mt-6 h-[clamp(460px,72svh,820px)] w-full overflow-hidden rounded-[1.75rem] bg-ink shadow-[0_32px_90px_-36px_rgba(15,23,42,0.45)] will-change-transform dark:shadow-[0_32px_90px_-32px_rgba(0,0,0,0.85)] dark:ring-1 dark:ring-white/10 sm:mt-8"
        >
          <div data-hero-media className="absolute inset-0 will-change-transform">
            <div data-hero-kenburns className="h-full w-full will-change-transform">
              <SmartImage
                src={getImageSrc(heroSpot.images.cover, 'full')}
                alt={`${heroSpot.name}, ${heroSpot.district} — misty hills at sunrise`}
                loading="eager"
                fetchPriority="high"
                className="h-full w-full"
                imgClassName="h-full w-full object-cover"
              />
            </div>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-ink/10"
          />

          <button
            type="button"
            data-hero-pill
            data-cursor="explore"
            onClick={() => openSpot(heroSpot.id)}
            className="glass absolute top-4 right-4 z-10 flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-full border border-white/60 py-1.5 pr-3.5 pl-2 text-xs font-semibold text-ink transition-colors duration-300 will-change-transform active:scale-95 dark:border-white/15 dark:text-slate-50 sm:top-6 sm:right-6"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-colors duration-300 dark:bg-white dark:text-[#0B111E]">
              <MapPin className="h-3.5 w-3.5" strokeWidth={2.2} />
            </span>
            <span className="truncate">
              {heroSpot.name}, {heroSpot.district}
            </span>
          </button>

          <div
            data-hero-copy
            className="absolute inset-x-0 bottom-0 flex flex-col gap-6 p-5 text-white will-change-transform sm:p-10 lg:flex-row lg:items-end lg:justify-between lg:p-14"
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

            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                type="button"
                data-cursor="magnetic"
                onClick={() => scrollToTarget(`#${SECTION_IDS.showcase}`)}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-4 text-xs font-semibold text-ink transition hover:bg-canvas active:scale-95 sm:h-12 sm:px-6 sm:text-sm"
              >
                Explore Destinations
                <ArrowDownRight className="h-4 w-4" strokeWidth={2.2} />
              </button>
              <button
                type="button"
                data-cursor="magnetic"
                onClick={() => scrollToTarget(`#${SECTION_IDS.atlas}`)}
                className="glass-dark inline-flex h-11 items-center gap-2 rounded-full border border-white/20 px-4 text-xs font-semibold text-white transition hover:bg-ink active:scale-95 sm:h-12 sm:px-6 sm:text-sm"
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

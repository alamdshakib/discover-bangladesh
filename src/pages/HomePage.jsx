import { useEffect, useRef } from 'react';
import { ArrowDownRight, MapPin } from 'lucide-react';
import { gsap, MOTION } from '@animations';
import { FEATURED_REGIONS, SITE_META } from '@data';

export function HomePage() {
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-hero-reveal]', {
        y: 36,
        opacity: 0,
        duration: 1.05,
        stagger: MOTION.stagger,
        ease: MOTION.slowEase,
        clearProps: 'transform',
      });

      gsap.from('[data-region-card]', {
        y: 32,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: MOTION.ease,
        scrollTrigger: {
          trigger: '#regions',
          start: 'top 78%',
          once: true,
        },
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef}>
      <section
        id="landscapes"
        className="relative flex min-h-screen flex-col justify-end overflow-hidden px-6 pt-32 pb-20 md:px-10"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(212,163,89,0.14),transparent_48%),radial-gradient(circle_at_20%_75%,rgba(35,73,58,0.45),transparent_55%)]"
        />

        <div className="relative mx-auto w-full max-w-7xl">
          <p
            data-hero-reveal
            className="mb-6 text-xs font-medium tracking-[0.28em] text-ochre uppercase"
          >
            23.6850° N, 90.3563° E — Land of Rivers
          </p>

          <h1
            data-hero-reveal
            className="max-w-4xl font-display text-5xl leading-[0.98] font-normal tracking-tight text-parchment sm:text-7xl lg:text-[6.25rem]"
          >
            Explore the Quiet <span className="italic text-ochre">Beauty</span>{' '}
            of Bengal.
          </h1>

          <div
            data-hero-reveal
            className="mt-10 flex flex-col items-start justify-between gap-8 border-t border-parchment/15 pt-8 md:flex-row md:items-end"
          >
            <p className="max-w-xl text-sm leading-relaxed text-mist md:text-base">
              {SITE_META.description}
            </p>

            <a
              href="#regions"
              className="group inline-flex items-center gap-2 text-xs font-medium tracking-[0.22em] text-parchment uppercase transition-colors hover:text-ochre"
            >
              <span>Begin the Journey</span>
              <ArrowDownRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                strokeWidth={1.5}
              />
            </a>
          </div>
        </div>
      </section>

      <section
        id="regions"
        className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32"
      >
        <div className="mb-14 flex flex-col justify-between gap-4 border-b border-parchment/10 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs tracking-[0.24em] text-ochre uppercase">
              Curated Geography
            </p>
            <h2 className="mt-2 font-display text-4xl font-normal text-parchment md:text-5xl">
              Iconic Regions
            </h2>
          </div>
          <p className="max-w-md text-sm text-mist/85">
            Modular data-driven foundation ready for editorial photography,
            interactive maps, and seasonal travel stories.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {FEATURED_REGIONS.map((region) => (
            <article
              key={region.id}
              data-region-card
              className="group rounded-2xl border border-parchment/10 bg-bengal-forest/55 p-8 transition-colors hover:border-ochre/40 hover:bg-bengal-forest/80"
            >
              <div className="flex items-center justify-between text-xs tracking-[0.18em] text-mist/75 uppercase">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-ochre" strokeWidth={1.5} />
                  {region.division}
                </span>
                <span>{region.season}</span>
              </div>

              <h3 className="mt-5 font-display text-3xl font-normal text-parchment">
                {region.name}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-mist/90">
                {region.summary}
              </p>

              <p className="mt-6 text-[11px] tracking-[0.2em] text-ochre/80 uppercase">
                {region.coordinates}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

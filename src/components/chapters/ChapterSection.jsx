import { useLayoutEffect, useRef } from 'react';
import { gsap, MEDIA, ScrollTrigger } from '@animations';
import { getBentoSpans } from '@utils';
import { ChapterHeader } from './ChapterHeader.jsx';
import { SpotCard } from '../spots/SpotCard.jsx';

export function ChapterSection({ chapter, spots, onOpen }) {
  const scopeRef = useRef(null);
  const spans = getBentoSpans(spots.length);
  const coverUrl = spots[1]?.images.cover ?? spots[0]?.images.cover;

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(scopeRef);

    mm.add({ isDesktop: MEDIA.desktop, reduce: MEDIA.reduceMotion }, (ctx) => {
      const { isDesktop, reduce } = ctx.conditions;
      if (reduce) return;
      const scope = scopeRef.current;

      // 1. Custom SVG topographic contour lines draw themselves on scroll entry
      const contours = scope.querySelectorAll('[data-chapter-contour]');
      if (contours.length > 0) {
        contours.forEach((path) => {
          const len = typeof path.getTotalLength === 'function' ? path.getTotalLength() : 1400;
          gsap.fromTo(
            path,
            { strokeDasharray: len, strokeDashoffset: len },
            {
              strokeDashoffset: 0,
              duration: 1.5,
              ease: 'power2.out',
              immediateRender: false,
              scrollTrigger: { trigger: scope, start: 'top 86%', once: true },
            }
          );
        });
      }

      // 2. Architectural hairline divider draw-in
      const rule = scope.querySelector('[data-chapter-rule]');
      if (rule) {
        gsap.fromTo(
          rule,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            ease: 'power3.out',
            transformOrigin: 'left center',
            immediateRender: false,
            scrollTrigger: { trigger: scope, start: 'top 86%', once: true },
          }
        );
      }

      // 3. Masked word-by-word & display headline entrance
      gsap.from(scope.querySelectorAll('[data-chapter-number], [data-chapter-title], [data-chapter-word]'), {
        yPercent: 90,
        opacity: 0,
        duration: 0.95,
        stagger: 0.05,
        ease: 'power4.out',
        immediateRender: false,
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: scope, start: 'top 86%', once: true },
      });

      // 4. Cinematic Shutter Unmask Entrance via ScrollTrigger.batch()
      // Never pre-hides cards at opacity: 0 on mount; unveils cleanly on enter.
      const cardWraps = scope.querySelectorAll('[data-spot-card-wrap]');
      ScrollTrigger.batch(cardWraps, {
        start: 'top 90%',
        once: true,
        onEnter: (batch) => {
          const shutters = batch.map((w) => w.querySelector('[data-card-shutter]')).filter(Boolean);
          const shutterImgs = batch.map((w) => w.querySelector('[data-card-shutter-img]')).filter(Boolean);

          gsap.fromTo(
            batch,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.85,
              stagger: 0.08,
              ease: 'power3.out',
              overwrite: 'auto',
              clearProps: 'transform,opacity',
            }
          );

          if (shutters.length > 0) {
            gsap.fromTo(
              shutters,
              { clipPath: 'inset(100% 0% 0% 0%)' },
              {
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 1.05,
                stagger: 0.08,
                ease: 'power4.out',
                overwrite: 'auto',
                clearProps: 'clipPath',
              }
            );
          }

          if (shutterImgs.length > 0) {
            gsap.fromTo(
              shutterImgs,
              { scale: 1.25 },
              {
                scale: 1.12,
                duration: 1.15,
                stagger: 0.08,
                ease: 'power4.out',
                overwrite: 'auto',
              }
            );
          }
        },
      });

      // 5. Scroll-scrubbed inner window parallax (yPercent: -8 → 8) on every card cover photo
      scope.querySelectorAll('[data-spot-card-wrap]').forEach((wrap) => {
        const media = wrap.querySelector('[data-card-media]');
        if (media) {
          gsap.fromTo(
            media,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: 'none',
              immediateRender: false,
              scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          );
        }
      });

      if (!isDesktop) return;

      // 6. Kinetic chapter header parallax (desktop)
      const headerScrub = { trigger: scope, start: 'top bottom', end: 'top top', scrub: 0.8 };
      gsap.fromTo(
        scope.querySelector('[data-chapter-title]'),
        { x: 48 },
        { x: -16, ease: 'none', immediateRender: false, scrollTrigger: headerScrub }
      );
      gsap.fromTo(
        scope.querySelector('[data-chapter-number]'),
        { x: -24 },
        { x: 8, ease: 'none', immediateRender: false, scrollTrigger: headerScrub }
      );
      gsap.fromTo(
        scope.querySelector('[data-chapter-bg]'),
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: { trigger: scope.querySelector('header'), start: 'top bottom', end: 'bottom top', scrub: true },
        }
      );
    });

    return () => mm.revert();
  }, [spots.length]);

  return (
    <section id={chapter.id} ref={scopeRef} aria-labelledby={`${chapter.id}-title`} className="scroll-mt-36">
      <span id={`${chapter.id}-title`} className="sr-only">
        Chapter {chapter.number}: {chapter.title}
      </span>
      <ChapterHeader chapter={chapter} count={spots.length} coverUrl={coverUrl} />

      <div
        data-chapter-grid
        className="mt-3 grid grid-cols-1 gap-3 sm:mt-4 sm:gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-5"
      >
        {spots.map((spot, i) => (
          <SpotCard
            key={spot.id}
            spot={spot}
            span={spans[i]}
            label={`${chapter.number}.${String(i + 1).padStart(2, '0')} · ${chapter.title}`}
            onOpen={onOpen}
          />
        ))}
      </div>
    </section>
  );
}

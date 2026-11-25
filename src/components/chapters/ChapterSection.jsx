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
      contours.forEach((path) => {
        const len = typeof path.getTotalLength === 'function' ? path.getTotalLength() : 1400;
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      });
      if (contours.length > 0) {
        gsap.to(contours, {
          strokeDashoffset: 0,
          duration: 1.5,
          stagger: 0.14,
          ease: 'power2.out',
          scrollTrigger: { trigger: scope, start: 'top 84%', once: true },
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
            scrollTrigger: { trigger: scope, start: 'top 84%', once: true },
          }
        );
      }

      // 3. Masked word-by-word & display headline entrance
      gsap.from(scope.querySelectorAll('[data-chapter-number], [data-chapter-title], [data-chapter-word]'), {
        yPercent: 105,
        opacity: 0,
        duration: 1.0,
        stagger: 0.055,
        ease: 'power4.out',
        clearProps: 'transform',
        scrollTrigger: { trigger: scope, start: 'top 82%', once: true },
      });

      // 4. Scroll-batched wave entrance across visible card rows
      const cardWraps = scope.querySelectorAll('[data-spot-card-wrap]');
      gsap.set(cardWraps, { y: 54, scale: 0.95, opacity: 0 });
      ScrollTrigger.batch(cardWraps, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.9,
            stagger: 0.08,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
          }),
      });

      if (!isDesktop) return;

      // 5. Kinetic chapter header parallax
      const headerScrub = { trigger: scope, start: 'top bottom', end: 'top top', scrub: 0.8 };
      gsap.fromTo(scope.querySelector('[data-chapter-title]'), { x: 48 }, { x: -16, ease: 'none', scrollTrigger: headerScrub });
      gsap.fromTo(scope.querySelector('[data-chapter-number]'), { x: -24 }, { x: 8, ease: 'none', scrollTrigger: headerScrub });
      gsap.fromTo(
        scope.querySelector('[data-chapter-bg]'),
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: { trigger: scope.querySelector('header'), start: 'top bottom', end: 'bottom top', scrub: true },
        }
      );

      // 6. Scroll-scrubbed living editorial window parallax on every card cover photo
      scope.querySelectorAll('[data-spot-card-wrap]').forEach((wrap) => {
        const media = wrap.querySelector('[data-card-media]');
        if (media) {
          gsap.fromTo(
            media,
            { scale: 1.15, yPercent: -6 },
            {
              scale: 1.15,
              yPercent: 6,
              ease: 'none',
              scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          );
        }
      });
    });

    return () => mm.revert();
  }, [spots.length]);

  return (
    <section id={chapter.id} ref={scopeRef} aria-labelledby={`${chapter.id}-title`} className="scroll-mt-36">
      <span id={`${chapter.id}-title`} className="sr-only">
        Chapter {chapter.number}: {chapter.title}
      </span>
      <ChapterHeader chapter={chapter} count={spots.length} coverUrl={coverUrl} />

      <div data-chapter-grid className="mt-3 grid grid-cols-1 gap-3 sm:mt-4 sm:gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
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

import { useLayoutEffect, useRef } from 'react';
import { gsap, MEDIA } from '@animations';
import { getBentoSpans } from '@utils';
import { ChapterHeader } from './ChapterHeader.jsx';
import { SpotCard } from '../spots/SpotCard.jsx';

/** Subtle lag pattern for card depth (yPercent) on desktop. */
const DEPTH = [0, 3, 1.5];

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

      // Staggered card reveal (all devices)
      gsap.from(scope.querySelectorAll('[data-spot-card]'), {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: scope.querySelector('[data-chapter-grid]'), start: 'top 85%', once: true },
      });

      gsap.from(scope.querySelectorAll('[data-chapter-number], [data-chapter-title]'), {
        yPercent: 40,
        opacity: 0,
        duration: 1.1,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: { trigger: scope, start: 'top 80%', once: true },
      });

      if (!isDesktop) return;

      // Kinetic chapter transition: title drifts against its number while the backdrop parallaxes.
      const headerScrub = { trigger: scope, start: 'top bottom', end: 'top top', scrub: 0.8 };
      gsap.fromTo(scope.querySelector('[data-chapter-title]'), { x: 80 }, { x: -20, ease: 'none', scrollTrigger: headerScrub });
      gsap.fromTo(scope.querySelector('[data-chapter-number]'), { x: -40 }, { x: 10, ease: 'none', scrollTrigger: headerScrub });
      gsap.fromTo(
        scope.querySelector('[data-chapter-bg]'),
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: { trigger: scope.querySelector('header'), start: 'top bottom', end: 'bottom top', scrub: true },
        }
      );

      // Parallax depth: images drift inside their frames, alternate cards lag slightly.
      scope.querySelectorAll('[data-spot-card]').forEach((card, i) => {
        const media = card.querySelector('[data-card-media]');
        if (media) {
          gsap.fromTo(
            media,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: 'none',
              scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          );
        }
        const depth = DEPTH[i % DEPTH.length];
        if (depth) {
          gsap.fromTo(
            card,
            { yPercent: depth },
            {
              yPercent: 0,
              ease: 'none',
              scrollTrigger: { trigger: card, start: 'top bottom', end: 'center 60%', scrub: true },
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

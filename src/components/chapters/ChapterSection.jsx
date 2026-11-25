import { useLayoutEffect, useRef } from 'react';
import { gsap, MEDIA } from '@animations';
import { getBentoSpans } from '@utils';
import { ChapterHeader } from './ChapterHeader.jsx';
import { SpotCard } from '../spots/SpotCard.jsx';

export function ChapterSection({ chapter, spots, onOpen }) {
  const scopeRef = useRef(null);
  const spans = getBentoSpans(spots.length);
  const coverUrl = spots[1]?.images.cover ?? spots[0]?.images.cover;

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(scopeRef);

    mm.add(MEDIA.motion, () => {
      const scope = scopeRef.current;
      const banner = scope.querySelector('[data-chapter-banner]');
      const glow = scope.querySelector('[data-chapter-glow]');
      const numberScrub = scope.querySelector('[data-chapter-number-scrub]');
      const titleScrub = scope.querySelector('[data-chapter-title-scrub]');
      const bgScrub = scope.querySelector('[data-chapter-bg]');
      const bannerDesc = scope.querySelector('[data-chapter-desc]');
      const contours = scope.querySelectorAll('[data-chapter-contour]');
      const rule = scope.querySelector('[data-chapter-rule]');
      const headlineMasks = scope.querySelectorAll('[data-chapter-number], [data-chapter-title], [data-chapter-word]');

      if (banner) {
        // 1. Banner Scale & Inner Glow Expansion (scrub: 0.7)
        const expandTl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: banner,
            start: 'top 95%',
            end: 'top 25%',
            scrub: 0.7,
          },
        });

        expandTl.fromTo(
          banner,
          { scale: 0.93, transformOrigin: 'center top' },
          { scale: 1, immediateRender: false },
          0
        );

        if (glow) {
          expandTl.fromTo(
            glow,
            { opacity: 0.25, xPercent: -12 },
            { opacity: 0.95, xPercent: 8, immediateRender: false },
            0
          );
        }

        // 2. Dual-Speed Inner Parallax (scrub: 0.8) — 01 & Hills slide in opposition
        const innerScrubTl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: banner,
            start: 'top 95%',
            end: 'bottom 20%',
            scrub: 0.8,
          },
        });

        if (numberScrub) {
          innerScrubTl.fromTo(numberScrub, { x: -24 }, { x: 0, immediateRender: false }, 0);
        }
        if (titleScrub) {
          innerScrubTl.fromTo(titleScrub, { x: 20 }, { x: 0, immediateRender: false }, 0);
        }
        if (bgScrub) {
          innerScrubTl.fromTo(bgScrub, { yPercent: -10 }, { yPercent: 10, immediateRender: false }, 0);
        }

        // 3. Bidirectional Banner Details (contours, rule, headlines, right description)
        const detailsTl = gsap.timeline({
          scrollTrigger: {
            trigger: banner,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        });

        if (contours.length > 0) {
          contours.forEach((path) => {
            const len = typeof path.getTotalLength === 'function' ? path.getTotalLength() : 1400;
            detailsTl.fromTo(
              path,
              { strokeDasharray: len, strokeDashoffset: len },
              { strokeDashoffset: 0, duration: 1.35, ease: 'power2.out', immediateRender: false },
              0
            );
          });
        }

        if (rule) {
          detailsTl.fromTo(
            rule,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.9, ease: 'power3.out', transformOrigin: 'left center', immediateRender: false },
            0.05
          );
        }

        if (headlineMasks.length > 0) {
          detailsTl.fromTo(
            headlineMasks,
            { yPercent: 90, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.85,
              stagger: 0.045,
              ease: 'power4.out',
              immediateRender: false,
            },
            0.08
          );
        }

        if (bannerDesc) {
          detailsTl.fromTo(
            bannerDesc,
            { y: 22, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.78, ease: 'power3.out', immediateRender: false },
            0.16
          );
        }
      }

      // 4. Destination Cards — Bidirectional Level Entrance + Continuous Scrubbed Photo Parallax
      scope.querySelectorAll('[data-spot-card-wrap]').forEach((wrap) => {
        const shutter = wrap.querySelector('[data-card-shutter]');
        const media = wrap.querySelector('[data-card-media]');

        const cardTl = gsap.timeline({
          scrollTrigger: {
            trigger: wrap,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        });

        cardTl.fromTo(
          wrap,
          { y: 50, opacity: 0, scale: 0.97 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.65,
            ease: 'power3.out',
            immediateRender: false,
          },
          0
        );

        if (shutter) {
          cardTl.fromTo(
            shutter,
            { clipPath: 'inset(12% 0% 0% 0% round 2rem 2rem 0 0)' },
            {
              clipPath: 'inset(0% 0% 0% 0% round 2rem 2rem 0 0)',
              duration: 0.7,
              ease: 'power3.out',
              immediateRender: false,
            },
            0
          );
        }

        if (media) {
          gsap.fromTo(
            media,
            { yPercent: -7 },
            {
              yPercent: 7,
              ease: 'none',
              immediateRender: false,
              scrollTrigger: {
                trigger: wrap,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        }
      });
    });

    return () => mm.revert();
  }, [spots.length]);

  return (
    <section id={chapter.id} ref={scopeRef} aria-labelledby={`${chapter.id}-title`} className="scroll-mt-40">
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

import { useLayoutEffect, useMemo, useRef } from 'react';
import { gsap, MEDIA } from '@animations';

const STATEMENT_TEXT =
  'From cloud-kissed ridges in the east to the world’s largest mangrove delta in the south — forty-eight living stories carved by rivers and time.';

/**
 * Full-width editorial statement band placed between the Stats/Marquee corridor
 * and the 48-destination Showcase collection.
 * Each word illuminates sequentially from translucent muted ink (0.16) to full
 * contrast (1.0) via a bidirectional GSAP ScrollTrigger (`scrub: 0.6`).
 */
export function EditorialStatement() {
  const sectionRef = useRef(null);
  const progressRef = useRef(null);

  const words = useMemo(() => STATEMENT_TEXT.split(/\s+/), []);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(sectionRef);

    mm.add(MEDIA.motion, () => {
      const section = sectionRef.current;
      if (!section) return;

      const wordEls = section.querySelectorAll('[data-statement-word]');
      if (wordEls.length === 0) return;

      gsap.set(wordEls, { opacity: 0.16 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top 84%',
          end: 'bottom 44%',
          scrub: 0.6,
        },
      });

      tl.fromTo(
        wordEls,
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.08,
          immediateRender: true,
        },
        0
      );

      if (progressRef.current) {
        tl.fromTo(
          progressRef.current,
          { scaleX: 0 },
          { scaleX: 1, immediateRender: true },
          0
        );
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-editorial-statement
      aria-label="Editorial statement"
      className="relative px-4 py-14 sm:px-6 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="mx-auto max-w-5xl">
          {/* Swiss editorial eyebrow */}
          <div className="mb-6 flex items-center gap-3 sm:mb-8">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full transition-colors duration-500"
              style={{
                backgroundColor: 'var(--chapter-accent, #10b981)',
                boxShadow: '0 0 12px var(--chapter-glow, rgba(16, 185, 129, 0.25))',
              }}
            />
            <span className="font-mono text-[11px] font-semibold tracking-[0.26em] text-mist uppercase">
              Editorial Manifesto · Bengal Delta &amp; Highlands
            </span>
          </div>

          {/* Word-by-word scroll-scrubbed statement (zero skew / zero 3D tilt) */}
          <p
            data-statement-copy
            className="font-display leading-[1.12] font-extrabold tracking-[-0.04em] text-ink transition-colors duration-300 dark:text-slate-50"
            style={{ fontSize: 'clamp(1.7rem, 4.2vw, 3.75rem)' }}
          >
            {words.map((word, index) => (
              <span
                key={`${word}-${index}`}
                data-statement-word
                className="inline-block will-change-[opacity]"
              >
                {word}
                {index < words.length - 1 ? '\u00A0' : ''}
              </span>
            ))}
          </p>

          {/* Scrubbed architectural hairline progress rule */}
          <div className="mt-8 flex items-center gap-4 sm:mt-12">
            <div className="relative h-px flex-1 overflow-hidden bg-line dark:bg-white/10">
              <div
                ref={progressRef}
                data-statement-progress
                aria-hidden="true"
                className="h-full w-full origin-left scale-x-0 will-change-transform"
                style={{ backgroundColor: 'var(--chapter-accent, #10b981)' }}
              />
            </div>
            <span className="shrink-0 font-mono text-[10px] font-semibold tracking-[0.22em] text-mist uppercase tabular-nums sm:text-[11px]">
              04 Chapters · 48 Coordinates
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

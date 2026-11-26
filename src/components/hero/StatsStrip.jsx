import { useLayoutEffect, useRef } from 'react';
import { HOME_STATS, SPOT_CATEGORIES } from '@data';
import { useShowcase } from '@hooks';
import { gsap, MEDIA } from '@animations';

const CARD_TONES = [
  'border-line bg-card text-ink dark:border-white/10 dark:bg-[#131C2E] dark:text-slate-50',
  'border-slate-300/80 bg-slate-200/65 text-ink dark:border-white/10 dark:bg-[#182338] dark:text-slate-50',
  'border-ink bg-ink text-white dark:border-white/15 dark:bg-[#1E293B] dark:text-white',
  'border-line bg-card text-ink dark:border-white/10 dark:bg-[#131C2E] dark:text-slate-50',
];

/**
 * Bidirectional 4-card overview strip with staggered level elevation,
 * live odometer roll-up on every enter / enterBack, and luminous hairline sweep on the featured spots card.
 */
export function StatsStrip() {
  const { spots } = useShowcase();
  const scopeRef = useRef(null);

  const stats = HOME_STATS.map((stat) => {
    if (stat.key === 'spots') return { ...stat, value: spots.length };
    if (stat.key === 'landscapes') return { ...stat, value: SPOT_CATEGORIES.length };
    return stat;
  });

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(scopeRef);

    mm.add(MEDIA.motion, (ctx) => {
      const scope = scopeRef.current;
      const cards = scope.querySelectorAll('[data-stat-card]');
      const counters = scope.querySelectorAll('[data-count]');
      const sheen = scope.querySelector('[data-stat-sheen]');
      let activeTweens = [];

      const killCounters = () => {
        activeTweens.forEach((tw) => tw.kill());
        activeTweens = [];
      };

      const playCountersAndSheen = () => {
        killCounters();
        ctx.add(() => {
          counters.forEach((el) => {
            const target = Number(el.dataset.count) || 0;
            const proxy = { value: 0 };
            el.textContent = '00';
            const tw = gsap.to(proxy, {
              value: target,
              duration: 0.9,
              ease: 'power2.out',
              snap: { value: 1 },
              onUpdate: () => {
                el.textContent = String(Math.round(proxy.value)).padStart(2, '0');
              },
            });
            activeTweens.push(tw);
          });

          if (sheen) {
            const sheenTw = gsap.fromTo(
              sheen,
              { xPercent: -130, opacity: 0.9 },
              {
                xPercent: 180,
                opacity: 0,
                duration: 1.15,
                delay: 0.18,
                ease: 'power2.out',
                overwrite: 'auto',
              }
            );
            activeTweens.push(sheenTw);
          }
        });
      };

      gsap.fromTo(
        cards,
        { y: 44, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.72,
          stagger: 0.08,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: scope,
            start: 'top 90%',
            end: 'bottom 8%',
            toggleActions: 'play reverse play reverse',
            fastScrollEnd: true,
            onEnter: playCountersAndSheen,
            onEnterBack: playCountersAndSheen,
          },
        }
      );

      return killCounters;
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={scopeRef}
      data-stats-strip
      aria-label="Bangladesh at a glance"
      className="px-3 pt-4 sm:px-5 sm:pt-5"
    >
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const isFeatured = index === 2;
          return (
            <div
              key={stat.key}
              data-stat-card
              className={`relative flex min-h-[148px] flex-col justify-between overflow-hidden rounded-3xl border p-5 transition-colors duration-300 will-change-transform sm:min-h-[180px] sm:p-7 ${CARD_TONES[index]}`}
            >
              {/* Subtle luminous hairline sweep across the featured dark spots card (zero skew utility) */}
              {isFeatured && (
                <>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent"
                  />
                  <span
                    data-stat-sheen
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 w-1/2 opacity-0 will-change-transform"
                    style={{
                      background:
                        'linear-gradient(110deg, transparent 20%, rgba(255, 255, 255, 0.16) 50%, transparent 80%)',
                    }}
                  />
                </>
              )}

              <span
                className={`relative z-10 text-[10px] font-semibold tracking-[0.22em] uppercase sm:text-[11px] ${
                  isFeatured ? 'text-white/60' : 'text-mist dark:text-slate-400'
                }`}
              >
                {String(index + 1).padStart(2, '0')} / {stat.label}
              </span>
              <div className="relative z-10">
                <p
                  className="font-display leading-none font-black tracking-[-0.05em] tabular-nums"
                  style={{ fontSize: 'clamp(2.75rem, 6vw, 5rem)' }}
                >
                  <span data-count={stat.value}>{String(stat.value).padStart(2, '0')}</span>
                </p>
                <p
                  className={`mt-2 text-xs sm:text-sm ${
                    isFeatured ? 'text-white/70' : 'text-ink-soft dark:text-slate-400'
                  }`}
                >
                  {stat.note}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

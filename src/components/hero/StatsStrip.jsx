import { useLayoutEffect, useRef } from 'react';
import { HOME_STATS, SPOT_CATEGORIES } from '@data';
import { useShowcase } from '@hooks';
import { gsap, MEDIA } from '@animations';

const CARD_TONES = [
  'border-line bg-card text-ink',
  'border-mist/40 bg-mist/25 text-ink',
  'border-ink bg-ink text-white',
  'border-line bg-card text-ink',
];

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
    mm.add({ reduce: MEDIA.reduceMotion }, (ctx) => {
      if (ctx.conditions.reduce) return;

      gsap.from('[data-stat-card]', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: { trigger: scopeRef.current, start: 'top 88%', once: true },
      });

      scopeRef.current.querySelectorAll('[data-count]').forEach((el) => {
        const target = Number(el.dataset.count);
        const counter = { value: 0 };
        el.textContent = '0';
        gsap.to(counter, {
          value: target,
          duration: 1.6,
          ease: 'power2.out',
          snap: { value: 1 },
          onUpdate: () => {
            el.textContent = String(Math.round(counter.value)).padStart(2, '0');
          },
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={scopeRef} aria-label="Bangladesh at a glance" className="px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.key}
            data-stat-card
            className={`flex min-h-[148px] flex-col justify-between rounded-3xl border p-5 sm:min-h-[180px] sm:p-7 ${CARD_TONES[index]}`}
          >
            <span
              className={`text-[10px] font-semibold tracking-[0.22em] uppercase sm:text-[11px] ${
                index === 2 ? 'text-white/60' : 'text-mist'
              }`}
            >
              {String(index + 1).padStart(2, '0')} / {stat.label}
            </span>
            <div>
              <p
                className="font-display leading-none font-black tracking-[-0.05em] tabular-nums"
                style={{ fontSize: 'clamp(2.75rem, 6vw, 5rem)' }}
              >
                <span data-count={stat.value}>{String(stat.value).padStart(2, '0')}</span>
              </p>
              <p className={`mt-2 text-xs sm:text-sm ${index === 2 ? 'text-white/70' : 'text-ink-soft'}`}>
                {stat.note}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

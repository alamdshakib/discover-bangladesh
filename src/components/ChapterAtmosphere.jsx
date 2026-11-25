import { useEffect, useState } from 'react';
import { ScrollTrigger } from '@animations';

const CHAPTER_THEMES = [
  {
    id: 'chapter-hills',
    label: 'Hills',
    lightGrad: 'radial-gradient(60% 55% at 18% 22%, rgba(16, 185, 129, 0.11), transparent 72%)',
    darkGrad: 'radial-gradient(58% 55% at 18% 22%, rgba(16, 185, 129, 0.18), transparent 72%)',
  },
  {
    id: 'chapter-sea',
    label: 'Sea',
    lightGrad: 'radial-gradient(62% 55% at 82% 28%, rgba(14, 165, 233, 0.11), transparent 72%)',
    darkGrad: 'radial-gradient(60% 55% at 82% 28%, rgba(14, 165, 233, 0.19), transparent 72%)',
  },
  {
    id: 'chapter-forest',
    label: 'Forest',
    lightGrad: 'radial-gradient(60% 55% at 24% 34%, rgba(34, 197, 94, 0.10), transparent 72%)',
    darkGrad: 'radial-gradient(58% 55% at 24% 34%, rgba(34, 197, 94, 0.17), transparent 72%)',
  },
  {
    id: 'chapter-heritage',
    label: 'Heritage',
    lightGrad: 'radial-gradient(62% 55% at 78% 30%, rgba(217, 119, 6, 0.11), transparent 72%)',
    darkGrad: 'radial-gradient(60% 55% at 78% 30%, rgba(217, 119, 6, 0.19), transparent 72%)',
  },
];

/**
 * Fixed full-screen chapter-reactive ambient radial glow layer behind page content.
 * Smoothly crossfades via ScrollTrigger as the user transitions across chapters 01–04.
 */
export function ChapterAtmosphere() {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const triggers = [];

    const bind = () => {
      triggers.forEach((t) => t.kill());
      triggers.length = 0;

      CHAPTER_THEMES.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return;
        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: 'top 58%',
            end: 'bottom 42%',
            onEnter: () => setActiveId(id),
            onEnterBack: () => setActiveId(id),
            onLeave: () => setActiveId((prev) => (prev === id ? null : prev)),
            onLeaveBack: () => setActiveId((prev) => (prev === id ? null : prev)),
          })
        );
      });
    };

    bind();
    const timer = window.setTimeout(bind, 450);

    return () => {
      window.clearTimeout(timer);
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      data-chapter-atmosphere
      className="pointer-events-none fixed inset-0 -z-20 overflow-hidden"
    >
      {CHAPTER_THEMES.map((theme) => {
        const isActive = activeId === theme.id;
        return (
          <div key={theme.id} className="absolute inset-0">
            {/* Light mode ultra-soft pastel tint */}
            <div
              className={`absolute inset-0 transition-opacity duration-1000 ease-out dark:opacity-0 ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: theme.lightGrad }}
            />
            {/* Dark mode moody radial spotlight */}
            <div
              className={`absolute inset-0 opacity-0 transition-opacity duration-1000 ease-out ${
                isActive ? 'dark:opacity-100' : 'dark:opacity-0'
              }`}
              style={{ backgroundImage: theme.darkGrad }}
            />
          </div>
        );
      })}
    </div>
  );
}

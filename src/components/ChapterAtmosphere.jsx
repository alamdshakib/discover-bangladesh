import { useEffect, useState } from 'react';
import { ScrollTrigger } from '@animations';

const CHAPTER_THEMES = [
  {
    id: 'chapter-hills',
    label: 'Hills',
    lightGrad:
      'radial-gradient(58% 52% at 16% 20%, rgba(16, 185, 129, 0.13), transparent 72%), radial-gradient(45% 42% at 86% 78%, rgba(5, 150, 105, 0.08), transparent 70%)',
    darkGrad:
      'radial-gradient(58% 52% at 16% 20%, rgba(16, 185, 129, 0.21), transparent 72%), radial-gradient(45% 42% at 86% 78%, rgba(20, 184, 166, 0.12), transparent 70%)',
  },
  {
    id: 'chapter-sea',
    label: 'Sea',
    lightGrad:
      'radial-gradient(60% 54% at 84% 24%, rgba(14, 165, 233, 0.13), transparent 72%), radial-gradient(45% 42% at 18% 76%, rgba(2, 132, 199, 0.08), transparent 70%)',
    darkGrad:
      'radial-gradient(60% 54% at 84% 24%, rgba(14, 165, 233, 0.22), transparent 72%), radial-gradient(45% 42% at 18% 76%, rgba(56, 189, 248, 0.12), transparent 70%)',
  },
  {
    id: 'chapter-forest',
    label: 'Forest',
    lightGrad:
      'radial-gradient(58% 52% at 22% 30%, rgba(34, 197, 94, 0.12), transparent 72%), radial-gradient(46% 42% at 82% 74%, rgba(101, 163, 13, 0.08), transparent 70%)',
    darkGrad:
      'radial-gradient(58% 52% at 22% 30%, rgba(34, 197, 94, 0.19), transparent 72%), radial-gradient(46% 42% at 82% 74%, rgba(132, 204, 22, 0.12), transparent 70%)',
  },
  {
    id: 'chapter-heritage',
    label: 'Heritage',
    lightGrad:
      'radial-gradient(60% 54% at 80% 26%, rgba(217, 119, 6, 0.13), transparent 72%), radial-gradient(46% 42% at 20% 78%, rgba(234, 88, 12, 0.08), transparent 70%)',
    darkGrad:
      'radial-gradient(60% 54% at 80% 26%, rgba(217, 119, 6, 0.22), transparent 72%), radial-gradient(46% 42% at 20% 78%, rgba(245, 158, 11, 0.12), transparent 70%)',
  },
];

/**
 * Fixed chapter-reactive ambient environmental aura behind page content.
 * Smoothly crossfades Emerald (Hills) → Coastal Azure (Sea) → Rainforest Moss (Forest)
 * → Warm Terracotta Gold (Heritage) via ScrollTrigger for both Light and Dark modes.
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
            start: 'top 60%',
            end: 'bottom 40%',
            onEnter: () => setActiveId(id),
            onEnterBack: () => setActiveId(id),
            onLeave: () => setActiveId((prev) => (prev === id ? null : prev)),
            onLeaveBack: () => setActiveId((prev) => (prev === id ? null : prev)),
          })
        );
      });
    };

    bind();
    ScrollTrigger.addEventListener('refresh', bind);

    return () => {
      ScrollTrigger.removeEventListener('refresh', bind);
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      data-chapter-atmosphere={activeId ?? 'none'}
      className="pointer-events-none fixed inset-0 -z-20 overflow-hidden"
    >
      {CHAPTER_THEMES.map((theme) => {
        const isActive = activeId === theme.id;
        return (
          <div key={theme.id} className="absolute inset-0">
            {/* Light mode soft editorial atmospheric tint */}
            <div
              className={`absolute inset-0 transition-opacity duration-1000 ease-out dark:opacity-0 ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: theme.lightGrad }}
            />
            {/* Dark mode moody radial environmental aura */}
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

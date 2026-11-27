import { useLayoutEffect, useState } from 'react';
import { gsap, MEDIA, ScrollTrigger } from '@animations';
import { useShowcase } from '@hooks';

const DEFAULT_PALETTE = {
  id: 'default',
  accent: '#10b981',
  glow: 'rgba(16, 185, 129, 0.16)',
};

const CHAPTER_PALETTES = [
  {
    id: 'chapter-hills',
    label: 'Hills',
    accent: '#10b981', // Emerald Green
    glow: 'rgba(16, 185, 129, 0.2)',
  },
  {
    id: 'chapter-sea',
    label: 'Sea',
    accent: '#0ea5e9', // Deep Ocean Blue
    glow: 'rgba(14, 165, 233, 0.2)',
  },
  {
    id: 'chapter-forest',
    label: 'Forest',
    accent: '#22c55e', // Moss / Rainforest Green
    glow: 'rgba(34, 197, 94, 0.2)',
  },
  {
    id: 'chapter-heritage',
    label: 'Heritage',
    accent: '#d97706', // Warm Terracotta Gold
    glow: 'rgba(217, 119, 6, 0.2)',
  },
];

/**
 * Full-page chapter color morphing controller & ambient atmospheric radial aura.
 * Uses `gsap.context()` and `ScrollTrigger` across the 4 chapter sections (`Hills`, `Sea`, `Forest`, `Heritage`)
 * to smoothly transition `--chapter-accent` and `--chapter-glow` on `[data-page-wrapper]` (and `document.documentElement`)
 * bidirectionally in both Light Mode and Dark Mode.
 */
export function ChapterAtmosphere() {
  const { viewMode } = useShowcase();
  const [activeId, setActiveId] = useState(null);

  useLayoutEffect(() => {
    const wrapper = document.querySelector('[data-page-wrapper]') ?? document.documentElement;
    const rootTargets = wrapper === document.documentElement ? [wrapper] : [wrapper, document.documentElement];
    const reduce = window.matchMedia(MEDIA.reduceMotion).matches;

    const applyTheme = (palette, immediate = false) => {
      gsap.to(rootTargets, {
        '--chapter-accent': palette.accent,
        '--chapter-glow': palette.glow,
        duration: immediate || reduce ? 0.01 : 0.72,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    let ctx = null;

    const buildContext = () => {
      ctx?.revert();
      ctx = gsap.context(() => {
        const resolvedNodes = CHAPTER_PALETTES.map((palette) => ({
          palette,
          el:
            document.getElementById(palette.id) ??
            document.querySelector(`[data-expo-chapter="${palette.id}"]`),
        })).filter((entry) => Boolean(entry.el));

        if (resolvedNodes.length === 0) {
          setActiveId(null);
          applyTheme(DEFAULT_PALETTE, true);
          return;
        }

        resolvedNodes.forEach(({ palette, el }, idx) => {
          ScrollTrigger.create({
            trigger: el,
            start: 'top 58%',
            end: 'bottom 42%',
            onEnter: () => {
              setActiveId(palette.id);
              applyTheme(palette);
            },
            onEnterBack: () => {
              setActiveId(palette.id);
              applyTheme(palette);
            },
            onLeave: () => {
              if (idx === resolvedNodes.length - 1) {
                setActiveId((prev) => (prev === palette.id ? null : prev));
              }
            },
            onLeaveBack: () => {
              if (idx === 0) {
                setActiveId(null);
                applyTheme(DEFAULT_PALETTE);
              }
            },
          });
        });
      }, wrapper);
    };

    // Rebuild triggers after initial mount and whenever Showcase commits a new view DOM (`Editorial` / `Expo` / `Index`)
    const rafId = window.requestAnimationFrame(() => {
      buildContext();
    });

    const handleViewRendered = () => {
      buildContext();
    };
    window.addEventListener('db:view-rendered', handleViewRendered);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('db:view-rendered', handleViewRendered);
      ctx?.revert();
    };
  }, [viewMode]);

  const isActive = Boolean(activeId);

  return (
    <div
      aria-hidden="true"
      data-chapter-atmosphere={activeId ?? 'none'}
      className="pointer-events-none fixed inset-0 -z-20 overflow-hidden"
    >
      {/* Light Mode: ultra-refined whisper radial glow preserving crisp #1e293b slate ink contrast */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-out dark:opacity-0 ${
          isActive ? 'opacity-85' : 'opacity-40'
        }`}
        style={{
          backgroundImage:
            'radial-gradient(58% 52% at 18% 22%, var(--chapter-glow, rgba(16, 185, 129, 0.16)), transparent 72%), radial-gradient(48% 44% at 84% 78%, var(--chapter-glow, rgba(16, 185, 129, 0.16)), transparent 72%)',
        }}
      />

      {/* Dark Mode: luminous Midnight Atlas radial aura */}
      <div
        className={`absolute inset-0 opacity-0 transition-opacity duration-700 ease-out ${
          isActive ? 'dark:opacity-100' : 'dark:opacity-50'
        }`}
        style={{
          backgroundImage:
            'radial-gradient(60% 54% at 18% 22%, var(--chapter-glow, rgba(16, 185, 129, 0.2)), transparent 74%), radial-gradient(48% 44% at 84% 78%, var(--chapter-glow, rgba(16, 185, 129, 0.2)), transparent 74%)',
        }}
      />
    </div>
  );
}

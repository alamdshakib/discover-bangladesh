import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@animations';

/**
 * Initializes Lenis smooth scrolling synchronized with GSAP's ticker and ScrollTrigger.
 * Automatically disables smooth scroll interpolation when the user prefers reduced motion.
 */
export function useLenis(options = {}) {
  const { duration = 1.2, smoothWheel = true } = options;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return undefined;

    const lenis = new Lenis({
      duration,
      smoothWheel,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on('scroll', ScrollTrigger.update);

    const onTick = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, [duration, smoothWheel]);
}

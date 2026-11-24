import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, setLenis } from '@animations';

/**
 * Initializes Lenis smooth scrolling synchronized with GSAP's ticker and ScrollTrigger.
 * Disabled entirely for users who prefer reduced motion (native scrolling is used instead).
 */
export function useLenis({ duration = 1.15 } = {}) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return undefined;

    const lenis = new Lenis({
      duration,
      smoothWheel: true,
      // Touch devices keep native momentum scrolling for natural feel.
      syncTouch: false,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);

    const onTick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      setLenis(null);
    };
  }, [duration]);
}

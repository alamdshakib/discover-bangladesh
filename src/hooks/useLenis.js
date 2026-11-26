import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, setLenis, updateScrollState } from '@animations';

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
    lenis.on('scroll', (e) => {
      updateScrollState({
        scroll: e.scroll,
        limit: e.limit,
        progress: e.progress,
        velocity: e.velocity,
        direction: e.direction,
      });
      ScrollTrigger.update();
    });

    const onTick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Ensure ScrollTrigger positions stay synchronized once layout, web fonts, or viewport width settle
    const rafRefresh = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    let fontsCancelled = false;
    document.fonts?.ready?.then(() => {
      if (!fontsCancelled) ScrollTrigger.refresh();
    });

    let lastWidth = window.innerWidth;
    let resizeTimer = null;
    const onResize = () => {
      if (Math.abs(window.innerWidth - lastWidth) < 2) return;
      lastWidth = window.innerWidth;
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        lenis.resize?.();
        ScrollTrigger.refresh();
      }, 150);
    };
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      fontsCancelled = true;
      window.cancelAnimationFrame(rafRefresh);
      if (resizeTimer) window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      gsap.ticker.remove(onTick);
      lenis.destroy();
      setLenis(null);
      updateScrollState({ velocity: 0 });
    };
  }, [duration]);
}

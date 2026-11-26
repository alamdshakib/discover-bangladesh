import { useEffect } from 'react';
import { pauseScroll, resumeScroll } from '@animations';

let lockCount = 0;
let savedStyles = null;

/**
 * Reference-counted page scroll lock (Lenis + native) while `active` is true.
 * Safely supports nested overlays (e.g., CinemaLightbox opened atop SpotDetail).
 */
export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined;

    const { body, documentElement } = document;
    lockCount += 1;

    if (lockCount === 1) {
      const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
      savedStyles = {
        overflow: body.style.overflow,
        paddingRight: body.style.paddingRight,
      };
      pauseScroll();
      body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0 && savedStyles) {
        body.style.overflow = savedStyles.overflow;
        body.style.paddingRight = savedStyles.paddingRight;
        savedStyles = null;
        resumeScroll();
      }
    };
  }, [active]);
}

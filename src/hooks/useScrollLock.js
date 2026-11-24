import { useEffect } from 'react';
import { pauseScroll, resumeScroll } from '@animations';

/** Locks page scrolling (Lenis + native) while `active` is true. */
export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined;

    const { body, documentElement } = document;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    const previous = {
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };

    pauseScroll();
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      body.style.overflow = previous.overflow;
      body.style.paddingRight = previous.paddingRight;
      resumeScroll();
    };
  }, [active]);
}

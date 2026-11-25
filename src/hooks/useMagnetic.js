import { useEffect, useRef } from 'react';
import { gsap, MEDIA } from '@animations';

/**
 * Reusable tactile magnetic hover hook for buttons, pills, and switches.
 * Physically pulls the element toward the cursor on fine-pointer desktop devices
 * and springs back with `elastic.out(1, 0.4)` on mouseleave.
 */
export function useMagnetic({ strengthX = 12, strengthY = 10, externalRef } = {}) {
  const localRef = useRef(null);
  const targetRef = externalRef ?? localRef;

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return undefined;

    const finePointer = window.matchMedia('(pointer: fine)');
    const reduceMotion = window.matchMedia(MEDIA.reduceMotion);
    if (!finePointer.matches || reduceMotion.matches) return undefined;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.28, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.28, ease: 'power3.out' });

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      if (el.hasAttribute('disabled')) return;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      xTo(relX * strengthX * 2);
      yTo(relY * strengthY * 2);
    };

    const onLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.4)',
        overwrite: 'auto',
      });
    };

    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave);

    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: 'x,y' });
    };
  }, [strengthX, strengthY, targetRef]);

  return targetRef;
}

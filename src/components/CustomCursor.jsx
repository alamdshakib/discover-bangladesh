import { useEffect, useRef, useState } from 'react';
import { gsap, MEDIA } from '@animations';

const CURSOR_CONFIG = {
  default: { label: '', width: 34, height: 34, dotScale: 1, filled: false },
  explore: { label: 'EXPLORE ↗', width: 108, height: 36, dotScale: 0, filled: true },
  fly: { label: 'FLY TO SPOT', width: 118, height: 36, dotScale: 0, filled: true },
  view: { label: 'VIEW', width: 68, height: 34, dotScale: 0, filled: true },
  magnetic: { label: '', width: 46, height: 46, dotScale: 0.45, filled: false },
};

/**
 * Tactile context-aware morphing cursor enabled strictly on desktop fine-pointer devices.
 * Driven by dual gsap.quickTo trackers for zero-jank 60fps pointer inertia.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState('default');
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const visibleRef = useRef(false);
  const modeRef = useRef('default');

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)');
    const reduceMotion = window.matchMedia(MEDIA.reduceMotion);
    const evaluate = () => setEnabled(finePointer.matches && !reduceMotion.matches);
    evaluate();
    finePointer.addEventListener('change', evaluate);
    reduceMotion.addEventListener('change', evaluate);
    return () => {
      finePointer.removeEventListener('change', evaluate);
      reduceMotion.removeEventListener('change', evaluate);
    };
  }, []);

  useEffect(() => {
    if (!enabled || !dotRef.current || !ringRef.current) return undefined;

    const dot = dotRef.current;
    const ring = ringRef.current;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.32, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.32, ease: 'power3.out' });

    const setCursorMode = (next) => {
      const normalized = CURSOR_CONFIG[next] ? next : 'default';
      if (modeRef.current === normalized) return;
      modeRef.current = normalized;
      setMode(normalized);
    };

    const resolveTargetMode = (target) => {
      if (!(target instanceof Element)) return 'default';
      const match = target.closest('[data-cursor]');
      return match?.getAttribute('data-cursor') || 'default';
    };

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      if (!visibleRef.current) {
        visibleRef.current = true;
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
        gsap.to([dot, ring], { opacity: 1, duration: 0.25, ease: 'power2.out' });
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      setCursorMode(resolveTargetMode(e.target));
    };

    const onDown = () => {
      gsap.to(ring, { scale: 0.88, duration: 0.14, ease: 'power2.out' });
      gsap.to(dot, { scale: 0.75, duration: 0.14, ease: 'power2.out' });
    };

    const onUp = () => {
      const cfg = CURSOR_CONFIG[modeRef.current] ?? CURSOR_CONFIG.default;
      gsap.to(ring, { scale: 1, duration: 0.26, ease: 'elastic.out(1, 0.6)' });
      gsap.to(dot, { scale: cfg.dotScale, duration: 0.2, ease: 'power2.out' });
    };

    const onLeaveDoc = () => {
      visibleRef.current = false;
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeaveDoc);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeaveDoc);
      gsap.killTweensOf([dot, ring]);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !dotRef.current || !ringRef.current) return;
    const cfg = CURSOR_CONFIG[mode] ?? CURSOR_CONFIG.default;
    gsap.to(ringRef.current, {
      width: cfg.width,
      height: cfg.height,
      duration: 0.34,
      ease: 'power3.out',
      overwrite: 'auto',
    });
    gsap.to(dotRef.current, {
      scale: cfg.dotScale,
      duration: 0.22,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, [enabled, mode]);

  if (!enabled) return null;

  const cfg = CURSOR_CONFIG[mode] ?? CURSOR_CONFIG.default;

  return (
    <div aria-hidden="true" data-custom-cursor className="pointer-events-none fixed inset-0 z-[110] overflow-hidden">
      {/* Lagging outer ring / glassmorphic pill badge */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 flex items-center justify-center rounded-full transition-[background-color,border-color,color,box-shadow] duration-200 ${
          cfg.filled
            ? 'border border-white/50 bg-ink/85 text-white shadow-[0_12px_32px_-8px_rgba(15,23,42,0.5)] backdrop-blur-md dark:border-white/25 dark:bg-white/90 dark:text-[#0B111E]'
            : mode === 'magnetic'
              ? 'border border-ink/50 bg-ink/[0.06] backdrop-blur-[2px] dark:border-white/60 dark:bg-white/[0.08]'
              : 'border border-ink/35 bg-transparent dark:border-white/40'
        }`}
        style={{ width: 34, height: 34 }}
      >
        {cfg.label && (
          <span className="px-2 font-display text-[10px] font-bold tracking-[0.16em] whitespace-nowrap uppercase">
            {cfg.label}
          </span>
        )}
      </div>

      {/* Crisp 6px inner tracker dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 h-1.5 w-1.5 rounded-full bg-ink transition-colors duration-200 dark:bg-white"
      />
    </div>
  );
}

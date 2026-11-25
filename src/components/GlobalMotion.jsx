import { useEffect, useRef, useState } from 'react';
import { getScrollState, gsap, MEDIA } from '@animations';

const CURSOR_CONFIG = {
  default: { label: '', width: 34, height: 34, dotScale: 1, filled: false },
  explore: { label: 'EXPLORE ↗', width: 110, height: 36, dotScale: 0, filled: true },
  fly: { label: 'FLY TO SPOT', width: 120, height: 36, dotScale: 0, filled: true },
  view: { label: 'VIEW', width: 68, height: 34, dotScale: 0, filled: true },
  magnetic: { label: '', width: 46, height: 46, dotScale: 0.45, filled: false },
};

const INTERACTIVE_SELECTOR =
  'a[href], button:not([disabled]), [role="switch"], [role="radio"], [data-cursor="magnetic"]';

/**
 * Global tactile motion-physics controller mounted once at the root of App:
 * 1. Top 2px luminous gradient reading progress beam (`z-[60]`).
 * 2. 60fps GSAP `quickTo` dual-layer morphing & magnetically stretching cursor (`pointer: fine` only).
 * 3. Lenis scroll-velocity dynamic skew (`skewY` capped at ±2.5deg) with spring settle across content grids & headings.
 */
export function GlobalMotion() {
  const [finePointerEnabled, setFinePointerEnabled] = useState(false);
  const [mode, setMode] = useState('default');

  const beamRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const visibleRef = useRef(false);
  const modeRef = useRef('default');

  // Detect fine-pointer desktop devices and respect prefers-reduced-motion
  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)');
    const reduceMotion = window.matchMedia(MEDIA.reduceMotion);
    const evaluate = () => setFinePointerEnabled(finePointer.matches && !reduceMotion.matches);
    evaluate();
    finePointer.addEventListener('change', evaluate);
    reduceMotion.addEventListener('change', evaluate);
    return () => {
      finePointer.removeEventListener('change', evaluate);
      reduceMotion.removeEventListener('change', evaluate);
    };
  }, []);

  // 1 & 3: Top Reading Progress Beam + Scroll-Velocity Dynamic Skew (±2.5deg spring)
  useEffect(() => {
    const reduceMotion = window.matchMedia(MEDIA.reduceMotion).matches;
    let skewNodes = [];

    const refreshTargets = () => {
      skewNodes = Array.from(document.querySelectorAll('[data-velocity-skew]'));
    };
    refreshTargets();

    const mutationObserver = new MutationObserver(refreshTargets);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    let smoothedProgress = 0;
    let currentSkew = 0;
    let skewVelocity = 0;
    let isSkewResting = true;
    let lastFallbackScroll = window.scrollY || 0;

    const onTick = () => {
      const state = getScrollState();

      // Reading progress beam update (GPU scaleX)
      smoothedProgress += (state.progress - smoothedProgress) * 0.22;
      const clampedProgress = Math.max(0, Math.min(1, smoothedProgress));
      if (beamRef.current) {
        beamRef.current.style.transform = `scaleX(${clampedProgress.toFixed(4)})`;
      }

      if (reduceMotion) return;

      // Velocity calculation (uses Lenis velocity, with fallback window delta)
      const currentScroll = window.scrollY || 0;
      const fallbackVel = (currentScroll - lastFallbackScroll) * 0.65;
      lastFallbackScroll = currentScroll;
      const rawVelocity = Math.abs(state.velocity) > 0.01 ? state.velocity : fallbackVel;

      // Cap dynamic skew strictly within ±2.5deg and spring smoothly back to 0deg on stop
      const targetSkew = Math.max(-2.5, Math.min(2.5, rawVelocity * 0.085));
      skewVelocity += (targetSkew - currentSkew) * 0.18;
      skewVelocity *= 0.72;
      currentSkew = Math.max(-2.5, Math.min(2.5, currentSkew + skewVelocity));

      if (Math.abs(currentSkew) < 0.004 && Math.abs(skewVelocity) < 0.004 && Math.abs(targetSkew) < 0.004) {
        if (!isSkewResting) {
          isSkewResting = true;
          currentSkew = 0;
          skewVelocity = 0;
          for (let i = 0; i < skewNodes.length; i += 1) {
            skewNodes[i].style.transform = '';
          }
        }
        return;
      }

      isSkewResting = false;
      const skewTransform = `skewY(${currentSkew.toFixed(3)}deg)`;
      for (let i = 0; i < skewNodes.length; i += 1) {
        skewNodes[i].style.transform = skewTransform;
      }
    };

    gsap.ticker.add(onTick);
    return () => {
      gsap.ticker.remove(onTick);
      mutationObserver.disconnect();
      for (let i = 0; i < skewNodes.length; i += 1) {
        skewNodes[i].style.transform = '';
      }
    };
  }, []);

  // 2: Morphing & Magnetically Stretching Dual-Layer Cursor (Desktop pointer: fine)
  useEffect(() => {
    if (!finePointerEnabled || !dotRef.current || !ringRef.current) return undefined;

    const dot = dotRef.current;
    const ring = ringRef.current;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.11, ease: 'power3.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.11, ease: 'power3.out' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.3, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.3, ease: 'power3.out' });
    const ringScaleX = gsap.quickTo(ring, 'scaleX', { duration: 0.25, ease: 'power3.out' });
    const ringScaleY = gsap.quickTo(ring, 'scaleY', { duration: 0.25, ease: 'power3.out' });
    const ringRotate = gsap.quickTo(ring, 'rotation', { duration: 0.25, ease: 'power3.out' });

    const setCursorMode = (next) => {
      const normalized = CURSOR_CONFIG[next] ? next : 'default';
      if (modeRef.current === normalized) return;
      modeRef.current = normalized;
      setMode(normalized);
      if (normalized !== 'magnetic') {
        gsap.to(ring, {
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          duration: 0.45,
          ease: 'elastic.out(1, 0.45)',
          overwrite: 'auto',
        });
      }
    };

    const resolveContext = (target) => {
      if (!(target instanceof Element)) return { mode: 'default', magnetEl: null };
      const explicit = target.closest('[data-cursor]');
      if (explicit) {
        const attr = explicit.getAttribute('data-cursor') || 'default';
        if (attr === 'explore' || attr === 'fly' || attr === 'view') {
          return { mode: attr, magnetEl: null };
        }
        if (attr === 'magnetic') {
          return { mode: 'magnetic', magnetEl: explicit };
        }
      }
      const interactive = target.closest(INTERACTIVE_SELECTOR);
      if (interactive) {
        return { mode: 'magnetic', magnetEl: interactive };
      }
      return { mode: 'default', magnetEl: null };
    };

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      if (!visibleRef.current) {
        visibleRef.current = true;
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
        gsap.to([dot, ring], { opacity: 1, duration: 0.22, ease: 'power2.out' });
      }

      dotX(e.clientX);
      dotY(e.clientY);

      const { mode: nextMode, magnetEl } = resolveContext(e.target);
      setCursorMode(nextMode);

      if (nextMode === 'magnetic' && magnetEl) {
        const rect = magnetEl.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        const maxRadius = Math.max(rect.width, rect.height, 48);
        const stretch = Math.min(0.18, (dist / maxRadius) * 0.2);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

        // Pull ring magnetically toward button center + apply subtle elastic stretch
        ringX(cx + dx * 0.36);
        ringY(cy + dy * 0.36);
        ringScaleX(1 + stretch);
        ringScaleY(1 - stretch * 0.45);
        ringRotate(angle);
      } else {
        ringX(e.clientX);
        ringY(e.clientY);
      }
    };

    const onDown = () => {
      gsap.to(ring, { scale: 0.86, duration: 0.14, ease: 'power2.out' });
      gsap.to(dot, { scale: 0.72, duration: 0.14, ease: 'power2.out' });
    };

    const onUp = () => {
      const cfg = CURSOR_CONFIG[modeRef.current] ?? CURSOR_CONFIG.default;
      gsap.to(ring, { scale: 1, duration: 0.32, ease: 'elastic.out(1, 0.5)' });
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
  }, [finePointerEnabled]);

  // Smooth morph transitions between cursor pill states
  useEffect(() => {
    if (!finePointerEnabled || !dotRef.current || !ringRef.current) return;
    const cfg = CURSOR_CONFIG[mode] ?? CURSOR_CONFIG.default;
    gsap.to(ringRef.current, {
      width: cfg.width,
      height: cfg.height,
      duration: 0.32,
      ease: 'power3.out',
      overwrite: 'auto',
    });
    gsap.to(dotRef.current, {
      scale: cfg.dotScale,
      duration: 0.22,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, [finePointerEnabled, mode]);

  const cfg = CURSOR_CONFIG[mode] ?? CURSOR_CONFIG.default;

  return (
    <>
      {/* Top 2px Luminous Reading Progress Beam (`z-[60]`) */}
      <div
        aria-hidden="true"
        data-reading-progress
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] overflow-hidden bg-transparent"
      >
        <div
          ref={beamRef}
          className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-emerald-500 via-sky-400 to-amber-400 shadow-[0_0_12px_rgba(16,185,129,0.75)] will-change-transform"
        />
      </div>

      {/* Desktop Fine-Pointer Morphing Magnetic Cursor */}
      {finePointerEnabled && (
        <div aria-hidden="true" data-custom-cursor className="pointer-events-none fixed inset-0 z-[110] overflow-hidden">
          <div
            ref={ringRef}
            className={`fixed top-0 left-0 flex items-center justify-center rounded-full transition-[background-color,border-color,color,box-shadow] duration-200 will-change-transform ${
              cfg.filled
                ? 'border border-white/50 bg-ink/88 text-white shadow-[0_12px_32px_-8px_rgba(15,23,42,0.5)] backdrop-blur-md dark:border-white/25 dark:bg-white/92 dark:text-[#0B111E]'
                : mode === 'magnetic'
                  ? 'border border-ink/55 bg-ink/[0.07] backdrop-blur-[2px] dark:border-white/60 dark:bg-white/[0.09]'
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

          <div
            ref={dotRef}
            className="fixed top-0 left-0 h-1.5 w-1.5 rounded-full bg-ink transition-colors duration-200 will-change-transform dark:bg-white"
          />
        </div>
      )}
    </>
  );
}

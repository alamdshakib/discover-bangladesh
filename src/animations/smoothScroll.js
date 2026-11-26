/**
 * Tiny store for the active Lenis instance and live scroll telemetry so
 * 60fps motion components (Marquee, Compass HUD) read scroll velocity and
 * progress directly without React re-renders.
 */
let lenisInstance = null;
let scrollPaused = false;

const scrollState = {
  scroll: 0,
  limit: 1,
  progress: 0,
  velocity: 0,
  direction: 1,
};

const NAV_OFFSET = -96;

export function setLenis(instance) {
  lenisInstance = instance;
  if (instance) {
    if (scrollPaused) instance.stop();
    else instance.start();
  }
}

export function getLenis() {
  return lenisInstance;
}

export function updateScrollState({ scroll, limit, progress, velocity, direction }) {
  if (typeof scroll === 'number') scrollState.scroll = scroll;
  if (typeof limit === 'number') scrollState.limit = Math.max(limit, 1);
  if (typeof progress === 'number') scrollState.progress = Math.max(0, Math.min(1, progress));
  if (typeof velocity === 'number') scrollState.velocity = velocity;
  if (typeof direction === 'number' && direction !== 0) scrollState.direction = direction;
}

export function getScrollState() {
  if (!lenisInstance && typeof window !== 'undefined') {
    const doc = document.documentElement;
    const limit = Math.max(doc.scrollHeight - window.innerHeight, 1);
    const scroll = window.scrollY || 0;
    scrollState.scroll = scroll;
    scrollState.limit = limit;
    scrollState.progress = Math.max(0, Math.min(1, scroll / limit));
  }
  return scrollState;
}

export function scrollToTarget(target, { offset = NAV_OFFSET, immediate = false } = {}) {
  const element =
    typeof target === 'string' ? document.querySelector(target) : target;

  if (lenisInstance) {
    lenisInstance.scrollTo(element ?? target, { offset, immediate, duration: 1.3 });
    return;
  }

  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' });
    return;
  }

  if (element) {
    const top = element.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: immediate ? 'auto' : 'smooth' });
  }
}

export function pauseScroll() {
  scrollPaused = true;
  lenisInstance?.stop();
}

export function resumeScroll() {
  scrollPaused = false;
  lenisInstance?.start();
}

/**
 * Tiny store for the active Lenis instance so any component can
 * scroll smoothly or pause scrolling without prop drilling.
 */
let lenisInstance = null;

const NAV_OFFSET = -96;

export function setLenis(instance) {
  lenisInstance = instance;
}

export function getLenis() {
  return lenisInstance;
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
  lenisInstance?.stop();
}

export function resumeScroll() {
  lenisInstance?.start();
}

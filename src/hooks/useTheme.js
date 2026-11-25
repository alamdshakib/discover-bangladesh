import { useCallback, useSyncExternalStore } from 'react';
import { gsap, MEDIA } from '@animations';

const STORAGE_KEY = 'discover-bd-theme';
const DARK_THEME_COLOR = '#0B111E';
const LIGHT_THEME_COLOR = '#F4F6F8';

const listeners = new Set();
let mediaListenerAttached = false;

function getStoredTheme() {
  try {
    const val = window.localStorage.getItem(STORAGE_KEY);
    return val === 'dark' || val === 'light' ? val : null;
  } catch {
    return null;
  }
}

function getThemeSnapshot() {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function applyThemeToDocument(nextTheme) {
  const isDark = nextTheme === 'dark';
  const root = document.documentElement;
  root.classList.toggle('dark', isDark);

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', isDark ? DARK_THEME_COLOR : LIGHT_THEME_COLOR);
  }
}

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function attachMediaListener() {
  if (mediaListenerAttached || typeof window === 'undefined') return;
  mediaListenerAttached = true;

  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const onSystemChange = (event) => {
    if (getStoredTheme() !== null) return;
    applyThemeToDocument(event.matches ? 'dark' : 'light');
    notifyListeners();
  };

  mql.addEventListener('change', onSystemChange);
}

function subscribe(listener) {
  attachMediaListener();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function resolveOrigin(origin) {
  const fallbackX = typeof window !== 'undefined' ? window.innerWidth - 64 : 0;
  const fallbackY = 36;
  if (!origin) return { x: fallbackX, y: fallbackY };

  if (origin.currentTarget instanceof Element) {
    const rect = origin.currentTarget.getBoundingClientRect();
    if (rect.width > 0 || rect.height > 0) {
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }
  }
  if (typeof origin.x === 'number' && typeof origin.y === 'number') {
    return { x: origin.x, y: origin.y };
  }
  if (typeof origin.clientX === 'number' && typeof origin.clientY === 'number' && (origin.clientX || origin.clientY)) {
    return { x: origin.clientX, y: origin.clientY };
  }
  return { x: fallbackX, y: fallbackY };
}

/**
 * Synchronized light/dark theme state backed by `html.dark` and `localStorage`.
 * Expands the new theme outward in a crisp circular shockwave from the toggle button's
 * exact coordinates using the View Transitions API (with a GSAP radial overlay fallback).
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, () => 'light');
  const isDark = theme === 'dark';

  const commitTheme = useCallback((nextTheme) => {
    const resolved = nextTheme === 'dark' ? 'dark' : 'light';
    applyThemeToDocument(resolved);
    try {
      window.localStorage.setItem(STORAGE_KEY, resolved);
    } catch {
      // Ignore storage errors in restricted environments
    }
    notifyListeners();
  }, []);

  const setTheme = useCallback(
    (nextTheme, origin) => {
      const resolved = nextTheme === 'dark' ? 'dark' : 'light';
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        commitTheme(resolved);
        return;
      }

      const reduceMotion = window.matchMedia(MEDIA.reduceMotion).matches;
      if (reduceMotion || !origin) {
        commitTheme(resolved);
        return;
      }

      const { x, y } = resolveOrigin(origin);
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      // Primary path: Native View Transitions API circular clip-path shockwave
      if (typeof document.startViewTransition === 'function') {
        const root = document.documentElement;
        root.classList.add('theme-transitioning');
        try {
          const transition = document.startViewTransition(() => {
            commitTheme(resolved);
          });

          transition.ready
            .then(() => {
              root.animate(
                {
                  clipPath: [
                    `circle(0px at ${x.toFixed(1)}px ${y.toFixed(1)}px)`,
                    `circle(${endRadius.toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px)`,
                  ],
                },
                {
                  duration: 620,
                  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                  pseudoElement: '::view-transition-new(root)',
                }
              );
            })
            .catch(() => {});

          transition.finished.finally(() => {
            root.classList.remove('theme-transitioning');
          });
          return;
        } catch {
          root.classList.remove('theme-transitioning');
        }
      }

      // Fallback path: Smooth GSAP radial shockwave overlay
      const overlay = document.createElement('div');
      overlay.setAttribute('data-theme-ripple', 'true');
      overlay.setAttribute('aria-hidden', 'true');
      overlay.style.cssText = [
        'position:fixed',
        'inset:0',
        'z-index:9998',
        'pointer-events:none',
        `background:${resolved === 'dark' ? DARK_THEME_COLOR : LIGHT_THEME_COLOR}`,
        `clip-path:circle(0px at ${x.toFixed(1)}px ${y.toFixed(1)}px)`,
      ].join(';');
      document.body.appendChild(overlay);

      const tl = gsap.timeline({
        onComplete: () => {
          overlay.remove();
        },
      });
      tl.to(overlay, {
        clipPath: `circle(${endRadius.toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px)`,
        duration: 0.5,
        ease: 'power3.out',
        onComplete: () => commitTheme(resolved),
      });
      tl.to(overlay, { opacity: 0, duration: 0.22, ease: 'power2.out' });
    },
    [commitTheme]
  );

  const toggleTheme = useCallback(
    (origin) => {
      setTheme(getThemeSnapshot() === 'dark' ? 'light' : 'dark', origin);
    },
    [setTheme]
  );

  return { theme, isDark, setTheme, toggleTheme };
}

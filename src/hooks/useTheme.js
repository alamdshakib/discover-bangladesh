import { useCallback, useSyncExternalStore } from 'react';

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

/**
 * Synchronized light/dark theme state backed by `html.dark` and `localStorage`.
 * Falls back to `prefers-color-scheme` when no explicit preference is saved.
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, () => 'light');
  const isDark = theme === 'dark';

  const setTheme = useCallback((nextTheme) => {
    const resolved = nextTheme === 'dark' ? 'dark' : 'light';
    applyThemeToDocument(resolved);
    try {
      window.localStorage.setItem(STORAGE_KEY, resolved);
    } catch {
      // Ignore storage errors in restricted environments
    }
    notifyListeners();
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(getThemeSnapshot() === 'dark' ? 'light' : 'dark');
  }, [setTheme]);

  return { theme, isDark, setTheme, toggleTheme };
}

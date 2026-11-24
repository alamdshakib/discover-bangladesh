import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@hooks';

/**
 * Sleek pill-shaped Sun/Moon theme toggle button.
 * Reads and persists the user's light/dark preference via useTheme().
 */
export function ThemeToggle({ className = '', showLabel = false }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      data-theme-toggle
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`group inline-flex h-10 items-center justify-center gap-2 rounded-full border border-line bg-white/90 text-xs font-semibold tracking-wide text-ink transition-colors duration-300 hover:bg-white active:scale-95 dark:border-white/15 dark:bg-white/10 dark:text-amber-300 dark:hover:bg-white/15 ${
        showLabel ? 'px-3.5' : 'w-10 px-0 sm:w-auto sm:px-3.5'
      } ${className}`}
    >
      <span className="relative flex h-4 w-4 items-center justify-center">
        <Sun
          className={`h-4 w-4 transition-all duration-300 ${
            isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
          }`}
          strokeWidth={2.2}
          aria-hidden="true"
        />
        <Moon
          className={`absolute h-4 w-4 text-ink transition-all duration-300 ${
            isDark ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
          strokeWidth={2.2}
          aria-hidden="true"
        />
      </span>
      <span className={showLabel ? 'inline' : 'hidden sm:inline'}>
        {isDark ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}

import { Search } from 'lucide-react';
import { useShowcase } from '@hooks';

/**
 * Spotlight Command Palette trigger bar (`Ctrl + K` / `⌘K`).
 * Clicking anywhere on the bar (or pressing `Ctrl+K` / `Cmd+K`) opens `CommandPalette` (`z-[90]`).
 */
export function SearchBar({ inline = false, onNavigate, className = '' }) {
  const { spots, openCommandPalette } = useShowcase();
  const isMac =
    typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent);

  const handleOpenSpotlight = () => {
    onNavigate?.();
    window.setTimeout(() => {
      openCommandPalette();
    }, inline ? 80 : 0);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        data-spotlight-trigger
        data-cursor="magnetic"
        onClick={handleOpenSpotlight}
        aria-label={`Search ${spots.length} destinations or run commands (${isMac ? 'Command K' : 'Control K'})`}
        className="group flex h-11 w-full items-center justify-between gap-2 rounded-full border border-line bg-white/90 pr-2 pl-4 text-left shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] transition-colors duration-300 hover:border-ink/35 hover:bg-white active:scale-[0.99] dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none dark:hover:border-white/25 dark:hover:bg-white/10"
      >
        <span className="flex min-w-0 items-center gap-2">
          <Search
            className="h-4 w-4 shrink-0 text-mist transition-colors group-hover:text-ink dark:group-hover:text-white"
            strokeWidth={2.2}
            aria-hidden="true"
          />
          <span className="truncate text-sm text-mist transition-colors group-hover:text-ink-soft dark:group-hover:text-slate-200">
            Search {spots.length} destinations…
          </span>
        </span>

        <kbd
          data-spotlight-kbd
          aria-hidden="true"
          className="inline-flex shrink-0 items-center gap-0.5 rounded-full border border-line bg-canvas px-2.5 py-1 font-mono text-[10px] font-bold tracking-wider text-ink-soft transition-colors group-hover:border-haze group-hover:text-ink dark:border-white/15 dark:bg-white/[0.08] dark:text-slate-300 dark:group-hover:text-white"
        >
          {isMac ? '⌘K' : 'Ctrl K'}
        </kbd>
      </button>
    </div>
  );
}

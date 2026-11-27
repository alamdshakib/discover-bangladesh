import { BookOpen, LayoutGrid, List } from 'lucide-react';

const VIEW_MODES = [
  { key: 'editorial', label: 'Editorial', icon: BookOpen },
  { key: 'expo', label: 'Expo Bento', icon: LayoutGrid },
  { key: 'index', label: 'Index', icon: List },
];

/**
 * Accessible 3-way view-mode switcher (`Editorial` | `Expo Bento` | `Index`)
 * used inside the floating Navbar pill. Supports legacy boolean `checked` fallback.
 */
export function ExpoSwitch({ value, checked, onChange, className = '' }) {
  const currentMode = value ?? (checked ? 'expo' : 'editorial');

  const handleSelect = (modeKey) => {
    if (!onChange) return;
    if (value !== undefined) {
      onChange(modeKey);
    } else {
      onChange(modeKey === 'expo');
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="Destination view mode"
      data-navbar-view-toggle
      className={`inline-flex shrink-0 items-center gap-0.5 rounded-full border border-line/90 bg-white/80 p-0.5 transition-colors duration-300 dark:border-white/12 dark:bg-white/[0.06] sm:p-1 ${className}`}
    >
      {VIEW_MODES.map(({ key, label, icon: Icon }) => {
        const selected = currentMode === key;
        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={label}
            title={label}
            data-nav-view-btn={key}
            data-cursor="magnetic"
            onClick={() => handleSelect(key)}
            className={`inline-flex items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 sm:px-2.5 lg:px-3 lg:text-xs ${
              selected
                ? 'bg-ink text-white shadow-xs dark:bg-white dark:text-[#0B111E]'
                : 'text-ink-soft hover:text-ink dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
            <span className="hidden lg:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

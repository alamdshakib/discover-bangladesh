import { LayoutGrid } from 'lucide-react';

/** Accessible Expo Mode toggle switch (role="switch"). */
export function ExpoSwitch({ checked, onChange, className = '', tone = 'light' }) {
  const labelColor = tone === 'dark' ? 'text-white' : 'text-ink dark:text-slate-100';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="Expo Mode"
      onClick={() => onChange(!checked)}
      className={`group inline-flex shrink-0 items-center gap-1.5 rounded-full py-1 pr-1 pl-2 transition-colors duration-300 active:scale-95 sm:gap-2.5 sm:py-1.5 sm:pr-1.5 sm:pl-3 ${className}`}
    >
      <span
        className={`flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.08em] uppercase sm:text-xs sm:tracking-[0.14em] ${labelColor}`}
      >
        <LayoutGrid className="hidden h-3.5 w-3.5 sm:inline-block" strokeWidth={2} />
        Expo
      </span>
      <span
        aria-hidden="true"
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors duration-300 sm:h-6 sm:w-11 ${
          checked
            ? 'border-ink bg-ink dark:border-white dark:bg-white'
            : 'border-haze bg-line dark:border-white/15 dark:bg-white/10'
        }`}
      >
        <span
          className={`absolute left-0.5 h-[14px] w-[14px] rounded-full shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-[18px] sm:w-[18px] ${
            checked
              ? 'translate-x-4 bg-white dark:bg-[#0B111E] sm:translate-x-5'
              : 'translate-x-0 bg-white ring-1 ring-haze dark:bg-slate-200 dark:ring-white/20'
          }`}
        />
      </span>
    </button>
  );
}

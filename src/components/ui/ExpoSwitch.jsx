import { LayoutGrid } from 'lucide-react';

/** Accessible Expo Mode toggle switch (role="switch"). */
export function ExpoSwitch({ checked, onChange, className = '', tone = 'light' }) {
  const labelColor = tone === 'dark' ? 'text-white' : 'text-ink';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="Expo Mode"
      onClick={() => onChange(!checked)}
      className={`group inline-flex items-center gap-2.5 rounded-full py-1.5 pr-1.5 pl-3 transition active:scale-95 ${className}`}
    >
      <span className={`flex items-center gap-1.5 text-xs font-semibold tracking-[0.14em] uppercase ${labelColor}`}>
        <LayoutGrid className="h-3.5 w-3.5" strokeWidth={2} />
        Expo
      </span>
      <span
        aria-hidden="true"
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-300 ${
          checked ? 'border-ink bg-ink' : 'border-haze bg-line'
        }`}
      >
        <span
          className={`absolute left-0.5 h-[18px] w-[18px] rounded-full shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            checked ? 'translate-x-5 bg-white' : 'translate-x-0 bg-white ring-1 ring-haze'
          }`}
        />
      </span>
    </button>
  );
}

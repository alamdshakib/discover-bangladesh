import { Check } from 'lucide-react';

/** Horizontally scrollable (mobile) / wrapping (desktop) row of multi-select filter pills. */
export function FilterPills({ label, options, selected, counts, onToggle, leading }) {
  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
      <span className="shrink-0 text-[11px] font-semibold tracking-[0.22em] text-mist uppercase lg:w-20">{label}</span>
      <div className="no-scrollbar -mx-4 flex snap-x gap-1.5 overflow-x-auto px-4 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
        {leading}
        {options.map((option) => {
          const isOn = selected.has(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={isOn}
              onClick={() => onToggle(option)}
              className={`flex shrink-0 snap-start items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors duration-200 active:scale-95 ${
                isOn
                  ? 'border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-[#0B111E]'
                  : 'border-line bg-white text-ink hover:border-haze dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200 dark:hover:border-white/25'
              }`}
            >
              {isOn && <Check className="h-3.5 w-3.5" strokeWidth={2.6} />}
              {option}
              <span className={`tabular-nums ${isOn ? 'text-white/60 dark:text-[#0B111E]/60' : 'text-mist'}`}>
                {counts[option] ?? 0}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

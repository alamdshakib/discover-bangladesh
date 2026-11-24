import { useId, useState } from 'react';
import { CalendarDays, Route } from 'lucide-react';
import { ScrollTrigger } from '@animations';
import { getSeasonReason, getSeasonWindow } from '@utils';

const TABS = [
  { key: 'time', index: 1, label: 'Best Time', icon: CalendarDays },
  { key: 'route', index: 2, label: 'Route Tip', icon: Route },
];

/** Expandable Travel Notes with [1] Best Time and [2] Route Tip tabs. */
export function TravelNotes({ spot, open }) {
  const [tab, setTab] = useState('time');
  const baseId = useId();

  return (
    <div
      className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      }`}
      onTransitionEnd={(e) => {
        if (e.propertyName === 'grid-template-rows') ScrollTrigger.refresh();
      }}
      inert={!open}
    >
      <div className="overflow-hidden">
        <div className="mt-4 rounded-3xl border border-line bg-canvas p-1.5 transition-colors duration-300 dark:border-white/10 dark:bg-[#0B111E]/85">
          <div role="tablist" aria-label={`Travel notes for ${spot.name}`} className="flex gap-1">
            {TABS.map(({ key, index, label }) => {
              const selected = tab === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${key}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel-${key}`}
                  onClick={() => setTab(key)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-colors duration-200 active:scale-95 ${
                    selected
                      ? 'bg-ink text-white dark:bg-white dark:text-[#0B111E]'
                      : 'text-ink-soft hover:bg-white dark:text-slate-400 dark:hover:bg-white/10'
                  }`}
                >
                  <span
                    className={`font-display ${
                      selected ? 'text-white/60 dark:text-[#0B111E]/60' : 'text-mist'
                    }`}
                  >
                    [{index}]
                  </span>
                  {label}
                </button>
              );
            })}
          </div>

          {TABS.map(({ key, icon: Icon }) => (
            <div
              key={key}
              role="tabpanel"
              id={`${baseId}-panel-${key}`}
              aria-labelledby={`${baseId}-tab-${key}`}
              hidden={tab !== key}
              className="animate-fade-in px-3 pt-3 pb-2"
            >
              <div className="flex gap-2.5">
                <Icon
                  className="mt-0.5 h-4 w-4 shrink-0 text-ink dark:text-slate-200"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                {key === 'time' ? (
                  <p className="text-sm leading-relaxed text-ink-soft dark:text-slate-400">
                    <span className="font-semibold text-ink dark:text-slate-100">{getSeasonWindow(spot)}</span>
                    {getSeasonReason(spot) && <> — {getSeasonReason(spot)}</>}
                  </p>
                ) : (
                  <p className="text-sm leading-relaxed text-ink-soft dark:text-slate-400">{spot.howToGo}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

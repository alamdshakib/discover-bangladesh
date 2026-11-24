/** Small metadata pill used on cards and in the detail drawer. */
export function MetaPill({ icon: Icon, children, tone = 'light', className = '' }) {
  const tones = {
    light: 'border-line bg-canvas text-ink-soft dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300',
    glass: 'glass border-white/60 text-ink dark:border-white/15 dark:text-slate-100',
    dark: 'glass-dark border-white/10 text-white',
    ink: 'border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-[#0B111E]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide whitespace-nowrap transition-colors duration-300 ${tones[tone]} ${className}`}
    >
      {Icon && <Icon className="h-3 w-3 shrink-0" strokeWidth={2.2} aria-hidden="true" />}
      {children}
    </span>
  );
}

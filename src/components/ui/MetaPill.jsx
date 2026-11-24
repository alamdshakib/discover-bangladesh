/** Small metadata pill used on cards and in the detail drawer. */
export function MetaPill({ icon: Icon, children, tone = 'light', className = '' }) {
  const tones = {
    light: 'border-line bg-canvas text-ink-soft',
    glass: 'glass border-white/60 text-ink',
    dark: 'glass-dark border-white/10 text-white',
    ink: 'border-ink bg-ink text-white',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide whitespace-nowrap ${tones[tone]} ${className}`}
    >
      {Icon && <Icon className="h-3 w-3 shrink-0" strokeWidth={2.2} aria-hidden="true" />}
      {children}
    </span>
  );
}

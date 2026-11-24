import { SITE_META } from '@data';

export function Footer() {
  return (
    <footer className="border-t border-parchment/10 bg-bengal-deep py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 text-xs text-mist/80 md:flex-row md:items-center md:px-10">
        <p className="font-display text-base text-parchment">
          {SITE_META.name} — {SITE_META.tagline}
        </p>
        <p className="tracking-wider uppercase">
          Editorial Visual Showcase &amp; Cultural Guide
        </p>
      </div>
    </footer>
  );
}

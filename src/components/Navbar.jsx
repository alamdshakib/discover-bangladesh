import { Compass } from 'lucide-react';
import { SITE_META } from '@data';

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-parchment/10 bg-bengal-deep/75 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <a
          href="#top"
          className="flex items-center gap-2.5 text-parchment transition-opacity hover:opacity-80"
        >
          <Compass className="h-5 w-5 text-ochre" strokeWidth={1.5} />
          <span className="font-display text-xl tracking-wide">
            {SITE_META.name}
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {SITE_META.navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-medium tracking-[0.2em] text-mist uppercase transition-colors hover:text-parchment"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <span className="text-[11px] tracking-[0.22em] text-ochre/90 uppercase">
          Travel Guide
        </span>
      </div>
    </header>
  );
}

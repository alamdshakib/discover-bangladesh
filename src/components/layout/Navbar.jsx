import { useEffect, useState } from 'react';
import { Map, Menu } from 'lucide-react';
import { SITE_META, SECTION_IDS } from '@data';
import { useShowcase } from '@hooks';
import { scrollToTarget } from '@animations';
import { SearchBar } from '../search/SearchBar.jsx';
import { ExpoSwitch } from '../ui/ExpoSwitch.jsx';
import { ThemeToggle } from '../ui/ThemeToggle.jsx';
import { MobileMenu } from './MobileMenu.jsx';

export function Navbar() {
  const { expoMode, setExpoMode } = useShowcase();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 isolate px-2.5 pt-2.5 sm:px-5 sm:pt-3">
        <div
          className={`glass mx-auto flex h-14 max-w-[1600px] items-center gap-1.5 rounded-full border border-white/70 pr-1.5 pl-3 transition-[background-color,border-color,box-shadow] duration-300 dark:border-white/10 sm:gap-3 sm:pl-5 ${
            scrolled
              ? 'shadow-[0_18px_40px_-24px_rgba(15,23,42,0.45)] dark:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.75)]'
              : 'shadow-none'
          }`}
        >
          <button
            type="button"
            data-cursor="magnetic"
            onClick={() => scrollToTarget(0, { offset: 0 })}
            className="flex shrink-0 items-center gap-1.5 transition active:scale-95"
            aria-label={`${SITE_META.name} — back to top`}
          >
            <span className="relative font-display text-[0.9rem] font-black tracking-[-0.04em] text-ink transition-colors duration-300 dark:text-slate-50 sm:text-[1.05rem]">
              DISCOVER
            </span>
            <span className="flex items-center gap-1 rounded-full bg-ink px-1.5 py-0.5 font-display text-[0.65rem] font-bold tracking-[0.12em] text-white transition-colors duration-300 dark:bg-white dark:text-[#0B111E] sm:px-2 sm:text-[0.7rem]">
              <span className="h-1.5 w-1.5 rounded-full bg-bd-red" aria-hidden="true" />
              BD
            </span>
          </button>

          <SearchBar className="mx-auto hidden w-full max-w-md md:block" />

          <div className="ml-auto flex items-center gap-1 sm:gap-2 md:ml-0">
            <ExpoSwitch
              checked={expoMode}
              onChange={setExpoMode}
              className="hover:bg-white/80 dark:hover:bg-white/10"
            />
            <ThemeToggle />
            <button
              type="button"
              data-cursor="magnetic"
              onClick={() => scrollToTarget(`#${SECTION_IDS.atlas}`)}
              className="hidden h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-ink-soft active:scale-95 dark:bg-white dark:text-[#0B111E] dark:hover:bg-slate-200 md:inline-flex"
            >
              <Map className="h-4 w-4" strokeWidth={2} />
              Explore Map
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-colors duration-300 active:scale-95 dark:bg-white dark:text-[#0B111E] sm:h-11 sm:w-11 md:hidden"
            >
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Map, Menu } from 'lucide-react';
import { SITE_META, SECTION_IDS } from '@data';
import { useMagnetic, useShowcase } from '@hooks';
import { gsap, MEDIA, scrollToTarget } from '@animations';
import { SearchBar } from '../search/SearchBar.jsx';
import { ExpoSwitch } from '../ui/ExpoSwitch.jsx';
import { ThemeToggle } from '../ui/ThemeToggle.jsx';
import { MobileMenu } from './MobileMenu.jsx';

export function Navbar() {
  const { viewMode, setViewMode } = useShowcase();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const logoRef = useMagnetic({ strengthX: 10, strengthY: 8 });
  const mapBtnRef = useMagnetic({ strengthX: 12, strengthY: 9 });
  const pulseDotRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      setScrolled(y > 24);

      const heroEl = document.getElementById(SECTION_IDS.top);
      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        setPastHero(rect.bottom < 120);
      } else {
        setPastHero(y > 560);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Subtle elastic spring bounce on hover over the DISCOVER BD red pulse dot
  const handleLogoEnter = () => {
    if (!pulseDotRef.current || window.matchMedia(MEDIA.reduceMotion).matches) return;
    const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });
    tl.to(pulseDotRef.current, {
      scale: 1.7,
      y: -2,
      duration: 0.16,
      ease: 'power2.out',
    });
    tl.to(pulseDotRef.current, {
      scale: 1,
      y: 0,
      duration: 0.62,
      ease: 'elastic.out(1.25, 0.32)',
      clearProps: 'transform',
    });
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 isolate px-2.5 pt-2.5 sm:px-5 sm:pt-3">
        <div
          data-navbar-pill
          data-past-hero={pastHero ? 'true' : 'false'}
          className={`glass mx-auto flex items-center gap-1.5 rounded-full border transition-[max-width,height,padding,background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:gap-2.5 ${
            pastHero
              ? 'h-12 max-w-[1600px] border-white/90 bg-white/86 pr-1.5 pl-2.5 shadow-[0_20px_46px_-20px_rgba(15,23,42,0.52)] backdrop-blur-2xl dark:border-white/20 dark:bg-[#131C2E]/92 dark:shadow-[0_20px_50px_-18px_rgba(0,0,0,0.88)] sm:h-[52px] sm:pl-4 md:max-w-[1220px] lg:max-w-[1340px]'
              : scrolled
                ? 'h-14 max-w-[1600px] border-white/75 pr-1.5 pl-3 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.45)] dark:border-white/12 dark:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.75)] sm:pl-5'
                : 'h-14 max-w-[1600px] border-white/70 pr-1.5 pl-3 shadow-none dark:border-white/10 sm:pl-5'
          }`}
          style={
            pastHero
              ? {
                  boxShadow:
                    '0 20px 46px -20px rgba(15, 23, 42, 0.48), 0 0 0 1px var(--chapter-glow, rgba(16, 185, 129, 0.16))',
                }
              : undefined
          }
        >
          <button
            ref={logoRef}
            type="button"
            data-cursor="magnetic"
            onPointerEnter={handleLogoEnter}
            onClick={() => scrollToTarget(0, { offset: 0 })}
            className="group flex shrink-0 items-center gap-1.5 transition active:scale-95"
            aria-label={`${SITE_META.name} — back to top`}
          >
            <span className="relative font-display text-[0.9rem] font-black tracking-[-0.04em] text-ink transition-colors duration-300 dark:text-slate-50 sm:text-[1.05rem]">
              DISCOVER
            </span>
            <span className="flex items-center gap-1 rounded-full bg-ink px-1.5 py-0.5 font-display text-[0.65rem] font-bold tracking-[0.12em] text-white transition-colors duration-300 dark:bg-white dark:text-[#0B111E] sm:px-2 sm:text-[0.7rem]">
              <span className="relative flex h-1.5 w-1.5 items-center justify-center" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bd-red opacity-65" />
                <span ref={pulseDotRef} data-brand-dot className="relative h-1.5 w-1.5 rounded-full bg-bd-red" />
              </span>
              BD
            </span>
          </button>

          <SearchBar className="mx-auto hidden w-full max-w-xs md:block lg:max-w-sm xl:max-w-md" />

          <div className="ml-auto flex items-center gap-1 sm:gap-2 md:ml-0">
            <ExpoSwitch
              value={viewMode}
              onChange={(nextMode) => {
                if (nextMode === viewMode) {
                  scrollToTarget(`#${SECTION_IDS.showcase}`, { offset: -88 });
                } else {
                  setViewMode(nextMode);
                }
              }}
            />
            <ThemeToggle />
            <button
              ref={mapBtnRef}
              type="button"
              data-cursor="magnetic"
              onClick={() => scrollToTarget(`#${SECTION_IDS.atlas}`)}
              className={`hidden shrink-0 items-center gap-2 rounded-full bg-ink font-semibold whitespace-nowrap text-white transition-all duration-300 hover:bg-ink-soft active:scale-95 dark:bg-white dark:text-[#0B111E] dark:hover:bg-slate-200 md:inline-flex ${
                pastHero ? 'h-10 px-4 text-xs' : 'h-11 px-5 text-sm'
              }`}
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
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-colors duration-300 active:scale-95 dark:bg-white dark:text-[#0B111E] sm:h-10 sm:w-10 md:hidden"
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

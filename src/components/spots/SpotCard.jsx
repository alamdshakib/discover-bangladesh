import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, CalendarDays, ChevronDown, MapPin } from 'lucide-react';
import { gsap, MEDIA } from '@animations';
import { useMagnetic } from '@hooks';
import { getImageSrc, getSeasonShort, getSpotImages } from '@utils';
import { SmartImage } from '../ui/SmartImage.jsx';
import { MetaPill } from '../ui/MetaPill.jsx';
import { TravelNotes } from './TravelNotes.jsx';

// Literal class names so Tailwind can detect them at build time.
const SPAN_CLASS = {
  4: 'lg:col-span-4',
  5: 'lg:col-span-5',
  6: 'lg:col-span-6',
  7: 'lg:col-span-7',
  12: 'md:col-span-2 lg:col-span-12',
};

/**
 * Spatial 3D editorial destination card with true perspective tilt, Z-axis floating
 * UI layers, live cursor specular sheen, smooth photo switcher, and magnetic action button.
 */
export function SpotCard({ spot, span = 6, label, onOpen }) {
  const images = getSpotImages(spot);
  const [active, setActive] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);
  const wide = span === 12;

  const cardRef = useRef(null);
  const sheenRef = useRef(null);
  const photoStageRef = useRef(null);
  const actionBtnRef = useMagnetic({ strengthX: 11, strengthY: 11 });
  const tiltRef = useRef(null);
  const hasSwitchedRef = useRef(false);

  const open = () => onOpen(spot.id);

  // Set up gsap.quickTo trackers for desktop 3D perspective tilt.
  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia(MEDIA.reduceMotion).matches;
    if (!finePointer || reduce) return undefined;

    const card = cardRef.current;
    if (!card) return undefined;

    tiltRef.current = {
      rx: gsap.quickTo(card, 'rotateX', { duration: 0.35, ease: 'power3.out' }),
      ry: gsap.quickTo(card, 'rotateY', { duration: 0.35, ease: 'power3.out' }),
    };

    return () => {
      tiltRef.current = null;
      gsap.killTweensOf(card);
    };
  }, []);

  // Subtle crossfade & scale settle when switching gallery thumbnails.
  useEffect(() => {
    if (!hasSwitchedRef.current) {
      hasSwitchedRef.current = true;
      return;
    }
    const stage = photoStageRef.current;
    if (!stage || window.matchMedia(MEDIA.reduceMotion).matches) return;
    gsap.fromTo(
      stage,
      { opacity: 0.72, scale: 1.04 },
      { opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out', overwrite: 'auto' }
    );
  }, [active]);

  const handleCardMove = (e) => {
    if (e.pointerType !== 'mouse' || !tiltRef.current || !cardRef.current) return;
    if (!window.matchMedia(MEDIA.desktop).matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / Math.max(rect.width, 1);
    const py = (e.clientY - rect.top) / Math.max(rect.height, 1);

    tiltRef.current.rx((0.5 - py) * 13); // ±6.5 deg
    tiltRef.current.ry((px - 0.5) * 13); // ±6.5 deg

    if (sheenRef.current) {
      sheenRef.current.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      sheenRef.current.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      sheenRef.current.style.opacity = '1';
    }
  };

  const handleCardLeave = () => {
    const card = cardRef.current;
    if (card && tiltRef.current) {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.75,
        ease: 'elastic.out(1, 0.5)',
        overwrite: 'auto',
      });
    }
    if (sheenRef.current) {
      sheenRef.current.style.opacity = '0';
    }
  };

  return (
    <div
      data-spot-card-wrap
      className={`[perspective:1100px] ${SPAN_CLASS[span] ?? SPAN_CLASS[6]}`}
    >
      <article
        ref={cardRef}
        data-spot-card
        onPointerMove={handleCardMove}
        onPointerLeave={handleCardLeave}
        className="group relative flex h-full flex-col rounded-4xl border border-line bg-card transition-[background-color,border-color,box-shadow] duration-300 will-change-transform hover:shadow-[0_40px_80px_-40px_rgba(15,23,42,0.42)] dark:border-white/10 dark:bg-[#131C2E] dark:hover:shadow-[0_40px_80px_-36px_rgba(0,0,0,0.85)] lg:[transform-style:preserve-3d]"
      >
        {/* Live cursor specular light sheen overlay */}
        <div
          ref={sheenRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-4xl opacity-0 transition-opacity duration-300"
          style={{
            background:
              'radial-gradient(520px circle at var(--mx, 50%) var(--my, 50%), rgba(255, 255, 255, 0.2), transparent 56%)',
          }}
        />

        {/* Media region — image clipped inside rounded-t-4xl while floating UI sits in 3D Z-space */}
        <div
          className={`relative lg:[transform-style:preserve-3d] ${
            wide ? 'h-64 sm:h-80 lg:h-[420px]' : 'h-64 sm:h-72 lg:h-[340px]'
          }`}
        >
          <div className="absolute inset-0 overflow-hidden rounded-t-4xl bg-line">
            <button
              type="button"
              data-cursor="explore"
              onClick={open}
              aria-label={`Open ${spot.name} details`}
              className="absolute inset-0 block h-full w-full cursor-zoom-in"
            >
              <div data-card-media className="absolute inset-x-0 -top-[8%] -bottom-[8%] will-change-transform">
                <div ref={photoStageRef} className="h-full w-full will-change-transform">
                  <SmartImage
                    src={getImageSrc(images[active], 'card')}
                    fallbackSrc={images[active]}
                    alt={`${spot.name} — photo ${active + 1} of ${images.length}`}
                    className="h-full w-full"
                    imgClassName="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
                  />
                </div>
              </div>
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-ink/10"
              />
            </button>
          </div>

          {/* Z-axis lifted top metadata pills */}
          <div className="pointer-events-none absolute top-3 right-3 left-3 z-10 flex items-start justify-between gap-2 sm:top-4 sm:right-4 sm:left-4 lg:[transform:translateZ(28px)]">
            <MetaPill tone="glass">{label}</MetaPill>
            <MetaPill tone="dark" icon={CalendarDays} className="shrink-0">
              {getSeasonShort(spot)}
            </MetaPill>
          </div>

          {/* Z-axis lifted thumbnail dock */}
          <div
            role="group"
            aria-label={`${spot.name} photos`}
            className="glass absolute bottom-3 left-3 z-10 flex gap-1 rounded-full border border-white/60 p-1 shadow-sm dark:border-white/15 sm:bottom-4 sm:left-4 lg:[transform:translateZ(32px)]"
          >
            {images.map((img, i) => (
              <button
                key={img}
                type="button"
                data-cursor="view"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-label={`Show photo ${i + 1} of ${spot.name}`}
                aria-pressed={i === active}
                className={`h-8 w-8 overflow-hidden rounded-full transition active:scale-95 sm:h-10 sm:w-10 ${
                  i === active
                    ? 'ring-2 ring-ink ring-offset-1 ring-offset-white dark:ring-white dark:ring-offset-[#131C2E]'
                    : 'opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src={getImageSrc(img, 'thumb')}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="h-full w-full bg-line object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Card copy & interactive footer */}
        <div
          className={`flex flex-1 flex-col p-5 sm:p-6 lg:[transform-style:preserve-3d] ${
            wide ? 'lg:flex-row lg:items-start lg:gap-10 lg:p-8' : ''
          }`}
        >
          <div className={wide ? 'lg:flex-1' : ''}>
            <div className="flex flex-wrap gap-1.5">
              <MetaPill icon={MapPin}>{spot.division}</MetaPill>
              <MetaPill>{spot.district}</MetaPill>
            </div>
            <h3 className="mt-3 font-display text-[1.6rem] leading-[1.08] font-bold tracking-[-0.03em] text-ink transition-colors duration-300 dark:text-slate-50 sm:text-[1.8rem]">
              <button
                type="button"
                data-cursor="explore"
                onClick={open}
                className="text-left transition hover:text-ink-soft dark:hover:text-slate-300"
              >
                {spot.name}
              </button>
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft transition-colors duration-300 dark:text-slate-400">
              {spot.tagline}
            </p>
          </div>

          <div
            className={`mt-auto pt-5 lg:[transform-style:preserve-3d] ${
              wide ? 'lg:mt-0 lg:w-[44%] lg:pt-0' : ''
            }`}
          >
            <div className="flex items-center justify-between gap-3 lg:[transform-style:preserve-3d]">
              <button
                type="button"
                data-cursor="magnetic"
                onClick={() => setNotesOpen((v) => !v)}
                aria-expanded={notesOpen}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas py-2 pr-2.5 pl-3.5 text-xs font-semibold text-ink transition-colors duration-300 hover:border-haze active:scale-95 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-100 dark:hover:border-white/25"
              >
                Travel Notes
                <span className="text-mist" aria-hidden="true">
                  ·
                </span>
                <span className="font-display text-mist tabular-nums">2</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${notesOpen ? 'rotate-180' : ''}`}
                  strokeWidth={2.2}
                />
              </button>

              <div className="lg:[transform:translateZ(34px)]">
                <button
                  ref={actionBtnRef}
                  type="button"
                  data-cursor="magnetic"
                  onClick={open}
                  aria-label={`Explore ${spot.name}`}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-white shadow-md transition-[background-color,color] duration-300 active:scale-95 dark:bg-white dark:text-[#0B111E]"
                >
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45"
                    strokeWidth={2.2}
                  />
                </button>
              </div>
            </div>
            <TravelNotes spot={spot} open={notesOpen} />
          </div>
        </div>
      </article>
    </div>
  );
}

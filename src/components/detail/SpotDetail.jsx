import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  Navigation,
  Route,
  X,
} from 'lucide-react';
import { CHAPTERS } from '@data';
import { useMediaQuery, useScrollLock, useShowcase } from '@hooks';
import { gsap, MEDIA } from '@animations';
import {
  formatCoordinates,
  getCommonsPage,
  getImageSrc,
  getMapsUrl,
  getSeasonReason,
  getSeasonWindow,
  getSpotImages,
} from '@utils';
import { SmartImage } from '../ui/SmartImage.jsx';
import { MetaPill } from '../ui/MetaPill.jsx';

const chapterByCategory = Object.fromEntries(CHAPTERS.map((c) => [c.category, c]));
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Swipeable / button-driven photo gallery built on native scroll-snap. */
function DetailGallery({ spot }) {
  const images = getSpotImages(spot);
  const [index, setIndex] = useState(0);
  const stripRef = useRef(null);

  const goTo = useCallback(
    (i) => {
      const strip = stripRef.current;
      if (!strip) return;
      const next = (i + images.length) % images.length;
      strip.scrollTo({ left: next * strip.clientWidth, behavior: 'smooth' });
    },
    [images.length]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goTo(index + 1);
      if (e.key === 'ArrowLeft') goTo(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo, index]);

  const credit = getCommonsPage(images[index]);

  return (
    <div className="relative h-[44svh] shrink-0 bg-ink sm:h-[50svh] lg:h-full lg:w-[56%]">
      <div
        ref={stripRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          setIndex(Math.round(el.scrollLeft / Math.max(el.clientWidth, 1)));
        }}
        className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
        aria-roledescription="carousel"
        aria-label={`${spot.name} photo gallery`}
      >
        {images.map((url, i) => (
          <div
            key={url}
            className="relative h-full w-full shrink-0 snap-center"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${images.length}`}
          >
            <SmartImage
              src={getImageSrc(url, 'full')}
              alt={`${spot.name} — photo ${i + 1} of ${images.length}`}
              loading={i === 0 ? 'eager' : 'lazy'}
              className="h-full w-full bg-ink"
              imgClassName="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
        <div className="flex items-center gap-1.5" role="group" aria-label="Choose photo">
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === index ? 'true' : undefined}
              className={`overflow-hidden rounded-xl transition active:scale-95 ${
                i === index ? 'h-12 w-16 ring-2 ring-white sm:h-14 sm:w-20' : 'h-10 w-12 opacity-70 hover:opacity-100 sm:h-12 sm:w-14'
              }`}
            >
              <img src={getImageSrc(url, 'thumb')} alt="" className="h-full w-full bg-ink-soft object-cover" />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous photo"
            className="glass hidden h-10 w-10 items-center justify-center rounded-full text-ink transition active:scale-95 sm:flex"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          </button>
          <span className="glass-dark rounded-full px-3 py-2 text-xs font-semibold text-white tabular-nums">
            {index + 1} / {images.length}
          </span>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next photo"
            className="glass hidden h-10 w-10 items-center justify-center rounded-full text-ink transition active:scale-95 sm:flex"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
      </div>

      {credit && (
        <a
          href={credit}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-dark absolute top-4 left-4 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white/90 transition hover:text-white"
        >
          Photo · Wikimedia Commons
          <ExternalLink className="h-3 w-3" strokeWidth={2.2} />
        </a>
      )}
    </div>
  );
}

function InfoCard({ icon: Icon, title, children, className = '' }) {
  return (
    <div className={`rounded-3xl border border-line bg-white p-4 sm:p-5 ${className}`}>
      <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-mist uppercase">
        <Icon className="h-3.5 w-3.5 text-ink" strokeWidth={2.2} aria-hidden="true" />
        {title}
      </p>
      <div className="mt-2.5">{children}</div>
    </div>
  );
}

function DetailInfo({ spot, titleId, nextSpot, onNext }) {
  const chapter = chapterByCategory[spot.category];

  return (
    <div className="p-5 pb-10 sm:p-8 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain lg:p-10" data-lenis-prevent>
      <div className="flex flex-wrap gap-1.5 pr-12">
        <MetaPill tone="ink">
          {chapter?.number} · {spot.category}
        </MetaPill>
        <MetaPill icon={MapPin}>{spot.division} Division</MetaPill>
        <MetaPill>{spot.district}</MetaPill>
      </div>

      <h2
        id={titleId}
        className="mt-4 font-display leading-[0.95] font-black tracking-[-0.045em] text-ink"
        style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}
      >
        {spot.name}
      </h2>
      <p className="mt-3 text-base leading-snug text-ink-soft sm:text-lg">{spot.tagline}</p>
      <p className="mt-5 text-sm leading-relaxed text-ink-soft sm:text-[15px]">{spot.description}</p>

      <h3 className="mt-8 text-[11px] font-semibold tracking-[0.2em] text-mist uppercase">Highlights</h3>
      <ol className="mt-2">
        {spot.highlights.map((item, i) => (
          <li key={item} className="flex gap-4 border-t border-line py-3.5 text-sm leading-relaxed text-ink">
            <span className="font-display text-sm font-bold text-mist tabular-nums">{String(i + 1).padStart(2, '0')}</span>
            {item}
          </li>
        ))}
      </ol>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <InfoCard icon={CalendarDays} title="Best Time">
          <p className="text-sm font-semibold text-ink">{getSeasonWindow(spot)}</p>
          {getSeasonReason(spot) && <p className="mt-1 text-xs leading-relaxed text-ink-soft">{getSeasonReason(spot)}</p>}
          <div className="mt-3 flex flex-wrap gap-1">
            {spot.seasons.map((s) => (
              <MetaPill key={s}>{s}</MetaPill>
            ))}
          </div>
        </InfoCard>

        <InfoCard icon={Navigation} title="Coordinates">
          <p className="font-display text-sm font-semibold text-ink tabular-nums">{formatCoordinates(spot.coordinates)}</p>
          <a
            href={getMapsUrl(spot.coordinates)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-xs font-semibold text-white transition hover:bg-ink-soft active:scale-95"
          >
            Open in Google Maps
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.2} />
          </a>
        </InfoCard>

        <InfoCard icon={Route} title="Route Guide" className="sm:col-span-2">
          <p className="text-sm leading-relaxed text-ink-soft">{spot.howToGo}</p>
        </InfoCard>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="group mt-6 flex w-full items-center justify-between gap-4 rounded-3xl border border-line bg-white p-3 pr-5 text-left transition hover:border-haze active:scale-[0.98]"
      >
        <span className="flex min-w-0 items-center gap-3">
          <img
            src={getImageSrc(nextSpot.images.cover, 'thumb')}
            alt=""
            className="h-14 w-14 shrink-0 rounded-2xl bg-line object-cover"
          />
          <span className="min-w-0">
            <span className="block text-[11px] font-semibold tracking-[0.2em] text-mist uppercase">Next destination</span>
            <span className="block truncate font-display text-lg font-bold text-ink">{nextSpot.name}</span>
          </span>
        </span>
        <ArrowRight className="h-5 w-5 shrink-0 text-ink transition group-hover:translate-x-1" strokeWidth={2} />
      </button>
    </div>
  );
}

function DetailDialog() {
  const { activeSpot: spot, spots, openSpot, closeSpot } = useShowcase();
  const isDesktop = useMediaQuery(MEDIA.desktop);
  const titleId = useId();
  const backdropRef = useRef(null);
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const closingRef = useRef(false);
  const dragRef = useRef(null);

  useScrollLock(true);

  const currentIndex = spots.findIndex((s) => s.id === spot.id);
  const nextSpot = spots[(currentIndex + 1) % spots.length];

  // Entrance animation (modal on desktop, slide-up sheet on mobile).
  useLayoutEffect(() => {
    const reduce = window.matchMedia(MEDIA.reduceMotion).matches;
    const d = reduce ? 0 : 1;
    const ctx = gsap.context(() => {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 * d });
      if (isDesktop) {
        gsap.fromTo(
          panelRef.current,
          { opacity: 0, y: 40, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.65 * d, ease: 'expo.out' }
        );
      } else {
        gsap.fromTo(panelRef.current, { yPercent: 100, y: 0 }, { yPercent: 0, duration: 0.6 * d, ease: 'expo.out' });
      }
    });
    return () => ctx.revert();
  }, [isDesktop]);

  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    const reduce = window.matchMedia(MEDIA.reduceMotion).matches;
    if (reduce) {
      closeSpot();
      return;
    }
    const tl = gsap.timeline({ onComplete: closeSpot });
    tl.to(backdropRef.current, { opacity: 0, duration: 0.3 }, 0);
    tl.to(
      panelRef.current,
      isDesktop
        ? { opacity: 0, y: 30, scale: 0.97, duration: 0.28, ease: 'power2.in' }
        : { yPercent: 100, duration: 0.38, ease: 'power3.in' },
      0
    );
  }, [closeSpot, isDesktop]);

  // Focus management, Escape to close, and a simple focus trap.
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeRef.current?.focus({ preventScroll: true });

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        requestClose();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const nodes = [...panelRef.current.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus({ preventScroll: true });
    };
  }, [requestClose]);

  // Touch-swipe-down to dismiss (mobile bottom sheet).
  const onDragStart = (e) => {
    if (isDesktop) return;
    dragRef.current = { startY: e.clientY, startTime: performance.now(), dy: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onDragMove = (e) => {
    const drag = dragRef.current;
    if (!drag) return;
    drag.dy = Math.max(0, e.clientY - drag.startY);
    gsap.set(panelRef.current, { y: drag.dy });
    gsap.set(backdropRef.current, { opacity: 1 - Math.min(drag.dy / 700, 0.6) });
  };
  const onDragEnd = () => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag) return;
    const velocity = drag.dy / Math.max(performance.now() - drag.startTime, 1);
    if (drag.dy > 120 || (drag.dy > 30 && velocity > 0.6)) {
      requestClose();
    } else {
      gsap.to(panelRef.current, { y: 0, duration: 0.4, ease: 'power3.out' });
      gsap.to(backdropRef.current, { opacity: 1, duration: 0.3 });
    }
  };

  return (
    <div className="fixed inset-0 z-[100]">
      <div ref={backdropRef} onClick={requestClose} aria-hidden="true" className="absolute inset-0 bg-ink/45 backdrop-blur-md" />

      <div className="pointer-events-none absolute inset-0 flex items-end justify-center lg:items-center lg:p-8">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="pointer-events-auto relative flex h-[92svh] w-full flex-col overflow-hidden rounded-t-4xl bg-canvas shadow-[0_-20px_60px_-20px_rgba(15,23,42,0.5)] lg:h-[min(86vh,860px)] lg:max-w-6xl lg:flex-row lg:rounded-4xl lg:border lg:border-white/70 lg:bg-white/80 lg:shadow-[0_50px_120px_-40px_rgba(15,23,42,0.7)] lg:backdrop-blur-2xl"
        >
          <div
            onPointerDown={onDragStart}
            onPointerMove={onDragMove}
            onPointerUp={onDragEnd}
            onPointerCancel={onDragEnd}
            className="flex h-8 shrink-0 cursor-grab touch-none items-center justify-center active:cursor-grabbing lg:hidden"
            aria-hidden="true"
          >
            <span className="h-1.5 w-12 rounded-full bg-haze" />
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={requestClose}
            aria-label="Close details"
            className="absolute top-10 right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-md transition hover:bg-canvas active:scale-95 lg:top-5 lg:right-5 lg:h-11 lg:w-11 lg:bg-ink lg:text-white lg:hover:bg-ink-soft"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>

          <div
            key={spot.id}
            className="flex min-h-0 flex-1 animate-fade-in flex-col overflow-y-auto overscroll-contain lg:flex-row lg:overflow-hidden"
            data-lenis-prevent
          >
            <DetailGallery spot={spot} />
            <DetailInfo spot={spot} titleId={titleId} nextSpot={nextSpot} onNext={() => openSpot(nextSpot.id)} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Spot detail: glassmorphic modal on desktop, touch-swipeable bottom sheet on mobile. */
export function SpotDetail() {
  const { activeSpot } = useShowcase();
  if (!activeSpot) return null;
  return createPortal(<DetailDialog />, document.body);
}

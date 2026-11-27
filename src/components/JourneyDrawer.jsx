import { Fragment, useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Compass,
  Link2,
  Map as MapIcon,
  Route,
  Trash2,
  X,
} from 'lucide-react';
import { useMagnetic, useScrollLock, useShowcase } from '@hooks';
import { gsap, MEDIA } from '@animations';
import { getImageSrc } from '@utils';

function JourneyDrawerDialog({ onClose }) {
  const {
    journeySpots,
    journeyMetrics,
    moveJourneySpot,
    removeJourneySpot,
    clearJourney,
    openSpot,
    visualizeJourneyOnMap,
  } = useShowcase();

  const [copied, setCopied] = useState(false);
  const titleId = useId();
  const backdropRef = useRef(null);
  const drawerRef = useRef(null);
  const closeBtnRef = useRef(null);
  const copyBtnRef = useRef(null);
  const closingRef = useRef(false);
  const copyTimerRef = useRef(null);

  useScrollLock(true);

  useLayoutEffect(() => {
    const reduce = window.matchMedia(MEDIA.reduceMotion).matches;
    if (reduce) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
      gsap.fromTo(
        drawerRef.current,
        { xPercent: 100 },
        { xPercent: 0, duration: 0.48, ease: 'power4.out', clearProps: 'transform' }
      );
    });
    return () => ctx.revert();
  }, []);

  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    const reduce = window.matchMedia(MEDIA.reduceMotion).matches;
    if (reduce) {
      onClose();
      return;
    }

    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(backdropRef.current, { opacity: 0, duration: 0.28, ease: 'power2.in' }, 0);
    tl.to(drawerRef.current, { xPercent: 100, duration: 0.32, ease: 'power3.in' }, 0);
  }, [onClose]);

  useEffect(() => {
    const prevFocus = document.activeElement;
    closeBtnRef.current?.focus({ preventScroll: true });
    const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const onKey = (e) => {
      if (
        document.querySelector(
          '[data-trip-finder], [data-command-palette], [data-spot-detail], [data-cinema-lightbox]'
        )
      ) {
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        requestClose();
        return;
      }
      if (e.key !== 'Tab' || !drawerRef.current) return;
      const nodes = [...drawerRef.current.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null);
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
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
      if (prevFocus instanceof HTMLElement && prevFocus.isConnected) {
        prevFocus.focus({ preventScroll: true });
      }
    };
  }, [requestClose]);

  const handleCopyLink = async () => {
    const url = new URL(window.location.href);
    if (journeySpots.length > 0) {
      url.searchParams.set('trip', journeySpots.map((s) => s.id).join(','));
    }
    const shareUrl = url.toString();

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const input = document.createElement('input');
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
    } catch {
      // Fallback silent catch if clipboard permission is blocked in non-HTTPS contexts
    }

    setCopied(true);
    if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    copyTimerRef.current = window.setTimeout(() => setCopied(false), 2200);

    if (copyBtnRef.current && !window.matchMedia(MEDIA.reduceMotion).matches) {
      gsap.fromTo(
        copyBtnRef.current,
        { scale: 0.94 },
        { scale: 1, duration: 0.4, ease: 'back.out(2)', clearProps: 'transform' }
      );
    }
  };

  const stopCount = journeySpots.length;

  return (
    <div data-journey-drawer className="fixed inset-0 z-[70] flex justify-end">
      <div
        ref={backdropRef}
        onClick={requestClose}
        aria-hidden="true"
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm dark:bg-black/65"
      />

      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-white/60 bg-canvas/92 shadow-[-24px_0_70px_-20px_rgba(15,23,42,0.5)] backdrop-blur-2xl will-change-transform dark:border-white/10 dark:bg-[#0B111E]/95 dark:shadow-[-24px_0_70px_-20px_rgba(0,0,0,0.9)]"
      >
        {/* Drawer Header */}
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 pt-5 pb-4 dark:border-white/10 sm:px-6">
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.22em] text-bd-green uppercase dark:text-emerald-400">
              <Compass className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden="true" />
              Custom Itinerary
            </p>
            <h2
              id={titleId}
              className="mt-1 font-display text-2xl font-black tracking-tight text-ink dark:text-slate-50"
            >
              My Journey
            </h2>
            <p className="mt-1 text-xs font-medium text-ink-soft tabular-nums dark:text-slate-400">
              {stopCount} {stopCount === 1 ? 'stop selected' : 'stops selected'}
              {stopCount >= 2 ? ` · ${journeyMetrics.totalKm} km total flight distance` : ' · Add 1 more stop to plot route'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {stopCount > 0 && (
              <button
                type="button"
                data-journey-clear
                data-cursor="magnetic"
                onClick={clearJourney}
                aria-label="Clear all stops"
                className="inline-flex h-9 items-center gap-1 rounded-full border border-line bg-white px-3 text-xs font-semibold text-ink-soft transition hover:border-bd-red/40 hover:text-bd-red active:scale-95 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                Clear
              </button>
            )}
            <button
              ref={closeBtnRef}
              type="button"
              data-journey-drawer-close
              data-cursor="magnetic"
              onClick={requestClose}
              aria-label="Close My Journey drawer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white transition hover:bg-ink-soft active:scale-95 dark:bg-white dark:text-[#0B111E]"
            >
              <X className="h-4 w-4" strokeWidth={2.2} />
            </button>
          </div>
        </div>

        {/* Ordered Stops List with Live Haversine Leg Distances */}
        <div
          data-lenis-prevent
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6"
        >
          {stopCount === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-white text-mist dark:border-white/10 dark:bg-[#131C2E]">
                <Route className="h-6 w-6" strokeWidth={1.8} />
              </div>
              <p className="mt-4 font-display text-lg font-bold text-ink dark:text-slate-100">Your trip is empty</p>
              <p className="mt-1 max-w-xs text-xs leading-relaxed text-ink-soft dark:text-slate-400">
                Tap the <strong className="font-semibold text-ink dark:text-white">+</strong> bookmark button on any
                destination card to build a shareable route across Bangladesh.
              </p>
            </div>
          ) : (
            <ol className="flex flex-col">
              {journeySpots.map((spot, idx) => {
                const legKm = journeyMetrics.legDistances[idx];
                return (
                  <Fragment key={spot.id}>
                    <li
                      data-journey-stop-item={spot.id}
                      className="flex items-center gap-3 rounded-3xl border border-line bg-white p-2.5 pr-3 shadow-sm transition-colors dark:border-white/10 dark:bg-[#131C2E]"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink font-display text-xs font-bold text-white tabular-nums dark:bg-white dark:text-[#0B111E]">
                        {idx + 1}
                      </span>

                      <button
                        type="button"
                        onClick={() => openSpot(spot.id)}
                        className="flex min-w-0 flex-1 items-center gap-3 text-left"
                      >
                        <img
                          src={getImageSrc(spot.images.cover, 'thumb')}
                          alt=""
                          className="h-12 w-12 shrink-0 rounded-2xl bg-line object-cover"
                        />
                        <span className="min-w-0">
                          <span className="block truncate font-display text-sm font-bold text-ink dark:text-slate-50">
                            {spot.name}
                          </span>
                          <span className="block truncate text-[11px] text-ink-soft dark:text-slate-400">
                            {spot.district} · {spot.division}
                          </span>
                        </span>
                      </button>

                      {/* Reorder & Remove Controls */}
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          data-journey-move-up={spot.id}
                          disabled={idx === 0}
                          onClick={() => moveJourneySpot(idx, -1)}
                          aria-label={`Move ${spot.name} up`}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-ink transition hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
                        >
                          <ChevronUp className="h-3.5 w-3.5" strokeWidth={2.2} />
                        </button>
                        <button
                          type="button"
                          data-journey-move-down={spot.id}
                          disabled={idx === stopCount - 1}
                          onClick={() => moveJourneySpot(idx, 1)}
                          aria-label={`Move ${spot.name} down`}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-ink transition hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
                        >
                          <ChevronDown className="h-3.5 w-3.5" strokeWidth={2.2} />
                        </button>
                        <button
                          type="button"
                          data-journey-remove={spot.id}
                          onClick={() => removeJourneySpot(spot.id)}
                          aria-label={`Remove ${spot.name} from My Journey`}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-mist transition hover:bg-canvas hover:text-bd-red dark:hover:bg-white/10"
                        >
                          <X className="h-3.5 w-3.5" strokeWidth={2.2} />
                        </button>
                      </div>
                    </li>

                    {typeof legKm === 'number' && (
                      <div className="my-1.5 flex items-center gap-2 pl-6">
                        <span className="h-5 w-px bg-bd-green/45 dark:bg-emerald-400/45" aria-hidden="true" />
                        <span
                          data-journey-leg-km={idx}
                          className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/[0.08] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-bd-green tabular-nums dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-300"
                        >
                          <Route className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                          {legKm} km
                        </span>
                      </div>
                    )}
                  </Fragment>
                );
              })}
            </ol>
          )}
        </div>

        {/* Drawer Actions Footer */}
        {stopCount > 0 && (
          <div className="flex flex-col gap-2.5 border-t border-line bg-white/75 p-5 dark:border-white/10 dark:bg-[#131C2E]/85 sm:px-6">
            <button
              ref={copyBtnRef}
              type="button"
              data-journey-copy
              data-cursor="magnetic"
              onClick={handleCopyLink}
              className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border text-sm font-semibold transition-colors duration-200 active:scale-[0.98] ${
                copied
                  ? 'border-emerald-500/50 bg-bd-green text-white dark:bg-emerald-500 dark:text-[#081214]'
                  : 'border-line bg-white text-ink hover:border-haze hover:bg-canvas dark:border-white/15 dark:bg-white/[0.07] dark:text-slate-100 dark:hover:bg-white/12'
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" strokeWidth={2.4} />
                  Copied ✓
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4" strokeWidth={2.1} />
                  Copy Shareable Trip Link
                </>
              )}
            </button>

            <button
              type="button"
              data-journey-visualize
              data-cursor="magnetic"
              disabled={stopCount < 2}
              onClick={visualizeJourneyOnMap}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white shadow-lg transition hover:bg-ink-soft active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 dark:bg-white dark:text-[#0B111E] dark:hover:bg-slate-200"
            >
              <MapIcon className="h-4 w-4" strokeWidth={2} />
              {stopCount < 2 ? 'Add 1 More Stop for Map Route' : 'Visualize Route on Map'}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

/**
 * Floating bottom glassmorphic Journey Dock (`My Journey · 3 Stops · 642 km →`, `z-[65]`)
 * + slide-over Custom Trip Builder Drawer (`z-[70]`).
 */
export function JourneyDrawer() {
  const { journeySpots, journeyMetrics, journeyDrawerOpen, setJourneyDrawerOpen } = useShowcase();
  const dockRef = useMagnetic({ strengthX: 10, strengthY: 7 });
  const hasEnteredRef = useRef(false);

  const count = journeySpots.length;
  const dockVisible = count > 0 && !journeyDrawerOpen;

  useLayoutEffect(() => {
    const el = dockRef.current;
    if (!el || !dockVisible) {
      hasEnteredRef.current = false;
      return undefined;
    }
    if (window.matchMedia(MEDIA.reduceMotion).matches) return undefined;

    if (!hasEnteredRef.current) {
      hasEnteredRef.current = true;
      gsap.fromTo(
        el,
        { y: 36, scale: 0.92, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.52, ease: 'back.out(1.6)', clearProps: 'transform,opacity' }
      );
    } else {
      gsap.fromTo(
        el,
        { scale: 0.96 },
        { scale: 1, duration: 0.35, ease: 'back.out(1.8)', clearProps: 'transform' }
      );
    }
    return undefined;
  }, [dockVisible, count, dockRef]);

  return (
    <>
      {dockVisible && (
        <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[65] flex justify-center px-3 sm:bottom-6">
          <button
            ref={dockRef}
            type="button"
            data-journey-dock
            data-cursor="magnetic"
            onClick={() => setJourneyDrawerOpen(true)}
            className="glass pointer-events-auto inline-flex max-w-[calc(100vw-2rem)] items-center gap-2.5 rounded-full border border-white/80 py-2.5 pr-4 pl-3.5 text-xs font-semibold text-ink shadow-[0_22px_48px_-14px_rgba(15,23,42,0.45),0_0_0_1px_rgba(16,185,129,0.2)] backdrop-blur-2xl transition-colors duration-300 will-change-transform hover:border-emerald-500/50 active:scale-95 dark:border-emerald-400/30 dark:bg-[#131C2E]/92 dark:text-slate-50 dark:shadow-[0_22px_50px_-14px_rgba(0,0,0,0.88),0_0_24px_-8px_rgba(16,185,129,0.28)] sm:gap-3 sm:py-3 sm:pr-5 sm:pl-4 sm:text-sm"
          >
            <span className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bd-green opacity-65 dark:bg-emerald-400" />
              <span className="relative h-2 w-2 rounded-full bg-bd-green dark:bg-emerald-400" />
            </span>

            <span className="truncate whitespace-nowrap tabular-nums">
              <span className="font-bold">My Journey</span>
              <span className="mx-1.5 text-mist">·</span>
              <span>
                {count} {count === 1 ? 'Stop' : 'Stops'}
              </span>
              {count >= 2 && (
                <>
                  <span className="mx-1.5 text-mist">·</span>
                  <span className="font-mono text-bd-green dark:text-emerald-400">{journeyMetrics.totalKm} km</span>
                </>
              )}
            </span>

            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-white dark:bg-white dark:text-[#0B111E]">
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
            </span>
          </button>
        </div>
      )}

      {journeyDrawerOpen &&
        createPortal(<JourneyDrawerDialog onClose={() => setJourneyDrawerOpen(false)} />, document.body)}
    </>
  );
}

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Compass, ExternalLink, MapPin, X, ZoomIn, ZoomOut } from 'lucide-react';
import { useScrollLock, useShowcase } from '@hooks';
import { gsap, MEDIA } from '@animations';
import { formatCoordinates, getCommonsPage, getImageSrc, getSpotImages } from '@utils';

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const ZOOM_SCALE = 1.75;

function CinemaLightboxDialog({ spot, initialIndex, onClose }) {
  const images = getSpotImages(spot);
  const safeInitial = Math.max(0, Math.min(images.length - 1, initialIndex || 0));

  const [index, setIndex] = useState(safeInitial);
  const [zoomed, setZoomed] = useState(false);

  const titleId = useId();
  const rootRef = useRef(null);
  const backdropRef = useRef(null);
  const stageShellRef = useRef(null);
  const stageRef = useRef(null);
  const slideWrapRef = useRef(null);
  const zoomLayerRef = useRef(null);
  const hudTopRef = useRef(null);
  const hudBottomRef = useRef(null);
  const closeBtnRef = useRef(null);

  const indexRef = useRef(safeInitial);
  const zoomedRef = useRef(false);
  const closingRef = useRef(false);
  const panPosRef = useRef({ x: 0, y: 0 });
  const quickPanRef = useRef(null);
  const pointerTrackRef = useRef(null);
  const isFirstPhotoRender = useRef(true);

  useScrollLock(true);

  useEffect(() => {
    zoomedRef.current = zoomed;
  }, [zoomed]);

  // Entrance choreography: fluid obsidian backdrop blur + circular iris / scale open
  useLayoutEffect(() => {
    const reduce = window.matchMedia(MEDIA.reduceMotion).matches;
    if (reduce) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0, backdropFilter: 'blur(0px)' },
        { opacity: 1, backdropFilter: 'blur(20px)', duration: 0.42, ease: 'power2.out' }
      );
      gsap.fromTo(
        stageShellRef.current,
        { clipPath: 'circle(12% at 50% 50%)', scale: 0.9, opacity: 0 },
        {
          clipPath: 'circle(100% at 50% 50%)',
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'power4.out',
          clearProps: 'clipPath,transform',
        }
      );
      gsap.fromTo(
        [hudTopRef.current, hudBottomRef.current],
        { y: (i) => (i === 0 ? -16 : 16), opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.48,
          delay: 0.14,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // Initialize quickTo smooth zoom-pan trackers
  useLayoutEffect(() => {
    const layer = zoomLayerRef.current;
    if (!layer) return undefined;
    quickPanRef.current = {
      x: gsap.quickTo(layer, 'x', { duration: 0.35, ease: 'power3.out' }),
      y: gsap.quickTo(layer, 'y', { duration: 0.35, ease: 'power3.out' }),
    };
    return () => {
      quickPanRef.current = null;
      gsap.killTweensOf(layer);
    };
  }, []);

  // Animate zoom scale (1x <-> 1.75x)
  useEffect(() => {
    const layer = zoomLayerRef.current;
    if (!layer) return;
    const reduce = window.matchMedia(MEDIA.reduceMotion).matches;
    if (zoomed) {
      gsap.to(layer, {
        scale: ZOOM_SCALE,
        duration: reduce ? 0 : 0.42,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    } else {
      panPosRef.current = { x: 0, y: 0 };
      gsap.to(layer, {
        scale: 1,
        x: 0,
        y: 0,
        duration: reduce ? 0 : 0.38,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }
  }, [zoomed]);

  const directionRef = useRef(1);

  const goTo = useCallback(
    (targetIdx) => {
      const next = ((targetIdx % images.length) + images.length) % images.length;
      if (next === indexRef.current) return;
      directionRef.current = targetIdx >= indexRef.current ? 1 : -1;
      indexRef.current = next;
      zoomedRef.current = false;
      setZoomed(false);
      setIndex(next);
    },
    [images.length]
  );

  // Smooth directional crossfade slide whenever index changes
  useLayoutEffect(() => {
    if (isFirstPhotoRender.current) {
      isFirstPhotoRender.current = false;
      return;
    }
    const wrap = slideWrapRef.current;
    if (!wrap || window.matchMedia(MEDIA.reduceMotion).matches) return;
    gsap.fromTo(
      wrap,
      { x: directionRef.current * 48, opacity: 0, scale: 0.97 },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.45,
        ease: 'power3.out',
        overwrite: 'auto',
        clearProps: 'transform,opacity',
      }
    );
  }, [index]);

  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    const reduce = window.matchMedia(MEDIA.reduceMotion).matches;
    if (reduce) {
      onClose();
      return;
    }

    const tl = gsap.timeline({ onComplete: onClose });
    tl.to([hudTopRef.current, hudBottomRef.current], { opacity: 0, duration: 0.2, ease: 'power2.in' }, 0);
    tl.to(backdropRef.current, { opacity: 0, backdropFilter: 'blur(0px)', duration: 0.32, ease: 'power2.in' }, 0);
    tl.to(
      stageShellRef.current,
      {
        clipPath: 'circle(14% at 50% 50%)',
        scale: 0.9,
        opacity: 0,
        duration: 0.32,
        ease: 'power3.in',
      },
      0
    );
  }, [onClose]);

  // Keyboard navigation + focus restoration & trap
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeBtnRef.current?.focus({ preventScroll: true });

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        requestClose();
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        e.stopPropagation();
        goTo(indexRef.current + 1);
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        e.stopPropagation();
        goTo(indexRef.current - 1);
        return;
      }
      if (e.key !== 'Tab' || !rootRef.current) return;
      const nodes = [...rootRef.current.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null);
      if (!nodes.length) return;
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

    window.addEventListener('keydown', onKey, true);
    return () => {
      window.removeEventListener('keydown', onKey, true);
      if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [goTo, requestClose]);

  // Clamp zoom pan bounds so the image never drifts completely off-screen
  const clampPan = (x, y) => {
    const stage = stageRef.current;
    if (!stage) return { x, y };
    const maxX = stage.clientWidth * 0.28;
    const maxY = stage.clientHeight * 0.26;
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  };

  const handleStagePointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    pointerTrackRef.current = {
      pointerId: e.pointerId,
      pointerType: e.pointerType,
      startX: e.clientX,
      startY: e.clientY,
      basePanX: panPosRef.current.x,
      basePanY: panPosRef.current.y,
      moved: false,
    };
  };

  const handleStagePointerMove = (e) => {
    const track = pointerTrackRef.current;
    const stage = stageRef.current;
    if (!stage) return;

    // Desktop mouse hover pan while zoomed
    if (e.pointerType === 'mouse' && zoomedRef.current && quickPanRef.current) {
      const rect = stage.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
      const ny = (e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
      const clamped = clampPan(-nx * rect.width * 0.52, -ny * rect.height * 0.48);
      panPosRef.current = clamped;
      quickPanRef.current.x(clamped.x);
      quickPanRef.current.y(clamped.y);
      return;
    }

    if (!track || track.pointerId !== e.pointerId) return;
    const dx = e.clientX - track.startX;
    const dy = e.clientY - track.startY;
    if (Math.hypot(dx, dy) > 8) track.moved = true;

    // Touch pan while zoomed
    if (track.pointerType !== 'mouse' && zoomedRef.current && quickPanRef.current) {
      const clamped = clampPan(track.basePanX + dx, track.basePanY + dy);
      panPosRef.current = clamped;
      quickPanRef.current.x(clamped.x);
      quickPanRef.current.y(clamped.y);
    }
  };

  const handleStagePointerUp = (e) => {
    const track = pointerTrackRef.current;
    pointerTrackRef.current = null;
    if (!track || track.pointerId !== e.pointerId) return;

    const dx = e.clientX - track.startX;
    const dy = e.clientY - track.startY;

    // Touch horizontal swipe when not zoomed -> switch slide
    if (track.pointerType !== 'mouse' && !zoomedRef.current && Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) goTo(indexRef.current + 1);
      else goTo(indexRef.current - 1);
      return;
    }

    // Crisp tap/click (< 8px travel) -> toggle 1x <-> 1.75x zoom
    if (!track.moved) {
      setZoomed((z) => !z);
    }
  };

  const currentUrl = images[index];
  const credit = getCommonsPage(currentUrl);

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      data-cinema-lightbox
      className="fixed inset-0 z-[105] flex flex-col justify-between text-white select-none"
    >
      {/* Obsidian Blurred Backdrop */}
      <div
        ref={backdropRef}
        onClick={requestClose}
        aria-hidden="true"
        className="absolute inset-0 bg-[#05080f]/94 backdrop-blur-xl"
      />

      {/* Top Minimal Obsidian HUD Bar */}
      <header
        ref={hudTopRef}
        className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-4 pt-4 pb-2 sm:px-8 sm:pt-6"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-white/65">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2} aria-hidden="true" />
              <span>
                {spot.district} · {spot.division}
              </span>
            </span>
            <span className="text-white/25" aria-hidden="true">
              ·
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-white/75 tabular-nums">
              <Compass className="h-3.5 w-3.5 text-sky-400" strokeWidth={2} aria-hidden="true" />
              {formatCoordinates(spot.coordinates)}
            </span>
          </div>
          <h2
            id={titleId}
            className="mt-1 truncate font-display text-lg font-bold tracking-tight text-white sm:text-2xl"
          >
            {spot.name}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span
            data-lightbox-counter
            className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 font-mono text-xs font-semibold text-white/90 tabular-nums backdrop-blur-md"
          >
            {index + 1} / {images.length}
          </span>

          <button
            type="button"
            data-cursor="magnetic"
            data-lightbox-zoom-btn
            aria-pressed={zoomed}
            aria-label={zoomed ? 'Reset zoom to 1x' : 'Zoom photo to 1.75x'}
            onClick={() => setZoomed((z) => !z)}
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.08] px-3.5 text-xs font-semibold text-white backdrop-blur-md transition hover:border-white/35 hover:bg-white/[0.15] active:scale-95"
          >
            {zoomed ? <ZoomOut className="h-4 w-4" strokeWidth={2} /> : <ZoomIn className="h-4 w-4" strokeWidth={2} />}
            <span className="tabular-nums">{zoomed ? '1.75x' : '1x'}</span>
          </button>

          <button
            ref={closeBtnRef}
            type="button"
            data-cursor="magnetic"
            data-lightbox-close
            onClick={requestClose}
            aria-label="Close cinema lightbox"
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-4 text-xs font-semibold text-ink shadow-lg transition hover:bg-canvas active:scale-95"
          >
            <X className="h-4 w-4" strokeWidth={2.2} />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </header>

      {/* Center Interactive Cinema Stage */}
      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-3 py-2 sm:px-14 sm:py-4">
        {/* Previous Photo */}
        <button
          type="button"
          data-cursor="magnetic"
          data-lightbox-prev
          onClick={() => goTo(index - 1)}
          aria-label="Previous photo"
          className="absolute left-3 z-20 hidden h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition hover:border-white/45 hover:bg-black/75 active:scale-95 sm:flex lg:left-6"
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={2} />
        </button>

        {/* Main Masked Frame */}
        <div
          ref={stageShellRef}
          className="relative flex h-full w-full max-w-[1380px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#080d17]/75 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] will-change-transform sm:rounded-3xl"
        >
          <div
            ref={stageRef}
            data-lightbox-stage
            onPointerDown={handleStagePointerDown}
            onPointerMove={handleStagePointerMove}
            onPointerUp={handleStagePointerUp}
            onPointerCancel={() => {
              pointerTrackRef.current = null;
            }}
            className={`relative flex h-full w-full touch-pan-y items-center justify-center overflow-hidden ${
              zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
            }`}
          >
            <div ref={slideWrapRef} className="flex h-full w-full items-center justify-center will-change-transform">
              <div
                ref={zoomLayerRef}
                data-lightbox-zoom
                className="flex h-full w-full items-center justify-center will-change-transform"
              >
                <img
                  src={getImageSrc(currentUrl, 'full')}
                  alt={`${spot.name} — photo ${index + 1} of ${images.length}`}
                  draggable={false}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Next Photo */}
        <button
          type="button"
          data-cursor="magnetic"
          data-lightbox-next
          onClick={() => goTo(index + 1)}
          aria-label="Next photo"
          className="absolute right-3 z-20 hidden h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition hover:border-white/45 hover:bg-black/75 active:scale-95 sm:flex lg:right-6"
        >
          <ChevronRight className="h-6 w-6" strokeWidth={2} />
        </button>
      </div>

      {/* Bottom Minimal HUD: Thumbnails, Mobile Nav, Credit & Hint */}
      <footer
        ref={hudBottomRef}
        className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-4 pt-2 pb-4 sm:px-8 sm:pb-6"
      >
        <div className="flex items-center gap-2">
          {credit && (
            <a
              href={credit}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="magnetic"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[11px] font-medium text-white/80 transition hover:border-white/35 hover:text-white"
            >
              Wikimedia Commons
              <ExternalLink className="h-3 w-3" strokeWidth={2} />
            </a>
          )}
        </div>

        {/* Centered Thumbnail Strip */}
        <div className="flex items-center gap-2" role="group" aria-label="Lightbox thumbnails">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous photo"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] text-white sm:hidden"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </button>

          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              data-cursor="view"
              onClick={() => goTo(i)}
              aria-label={`View photo ${i + 1}`}
              aria-current={i === index ? 'true' : undefined}
              className={`overflow-hidden rounded-lg transition active:scale-95 ${
                i === index
                  ? 'h-11 w-16 ring-2 ring-white sm:h-12 sm:w-20'
                  : 'h-9 w-12 opacity-55 hover:opacity-95 sm:h-10 sm:w-14'
              }`}
            >
              <img src={getImageSrc(url, 'thumb')} alt="" draggable={false} className="h-full w-full object-cover" />
            </button>
          ))}

          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next photo"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] text-white sm:hidden"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <p className="hidden text-[11px] tracking-wide text-white/50 lg:block">
          Click photo to zoom · Arrow keys to navigate · Esc to close
        </p>
      </footer>
    </div>
  );
}

/** Pro Full-Screen Obsidian Cinema Lightbox (`z-[105]`). */
export function CinemaLightbox() {
  const { lightbox, closeLightbox } = useShowcase();
  if (!lightbox?.spot) return null;

  return createPortal(
    <CinemaLightboxDialog
      key={`${lightbox.spot.id}-${lightbox.index}`}
      spot={lightbox.spot}
      initialIndex={lightbox.index}
      onClose={closeLightbox}
    />,
    document.body
  );
}

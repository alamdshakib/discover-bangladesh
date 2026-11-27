import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowDownRight, Compass, Map, MapPin, Sparkles } from 'lucide-react';
import { SECTION_IDS, SITE_META } from '@data';
import { useBangladeshTime, useLiveWeather, useMagnetic, useShowcase } from '@hooks';
import { gsap, MEDIA, scrollToTarget } from '@animations';
import { formatCoordinates, getImageSrc } from '@utils';
import { SmartImage } from '../ui/SmartImage.jsx';
import { WeatherConditionIcon } from '../ui/WeatherBadge.jsx';

const SLIDE_DURATION = 6; // seconds per destination slide

const HERO_CAROUSEL_SPEC = [
  { id: 'sajek-valley', shortLabel: 'Sajek' },
  { id: 'coxs-bazar', shortLabel: "Cox's Bazar" },
  { id: 'sundarbans', shortLabel: 'Sundarbans' },
  { id: 'tanguar-haor', shortLabel: 'Tanguar Haor' },
];

const DISCOVER_LETTERS = 'DISCOVER'.split('');

// Ultra-fine SVG fractalNoise texture for 3.5% photographic cinema grain (zero external fetch)
const FILM_GRAIN_DATA_URI =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/**
 * National Geographic × Apple Editorial Hero Stage:
 * - 100% real full-bleed photography with continuous Ken Burns slow drift (`scale: 1.0 → 1.09`).
 * - Unified top telemetry HUD (odometer GPS badge + single combined Location & Live Weather/BST pill).
 * - Monumental baseline-masked DISCOVER / BANGLADESH typography synchronized with CinematicIntro handoff.
 * - Calm desktop cinema-gimbal parallax (`gsap.quickTo`, ±10px photo / ±6px text, zero tilt/skew wobble).
 * - Interactive 4-thumbnail glassmorphic mini filmstrip switcher with expanding active frame & 6s progress bar.
 * - Bidirectional ScrollTrigger exit (`scrub: 0.8`: inward frame scale, letter-spacing widen, photo counter-pan).
 */
export function Hero() {
  const { spots, openSpot, openTripFinder } = useShowcase();
  const scopeRef = useRef(null);
  const frameRef = useRef(null);

  // Calm 2-plane cinema-gimbal parallax refs
  const photoPlaneRef = useRef(null);
  const typePlaneRef = useRef(null);

  // Carousel refs
  const slideRefs = useRef([]);
  const zoomRefs = useRef([]);
  const progressFillRefs = useRef([]);
  const timerTweenRef = useRef(null);
  const goToSlideRef = useRef(null);
  const activeIdxRef = useRef(0);
  const inViewRef = useRef(true);

  // Odometer & location swap refs
  const coordTextRef = useRef(null);
  const coordProxyRef = useRef({ lat: 23.3819, lng: 92.2938 });
  const locationLabelRef = useRef(null);

  // Magnetic CTA controls
  const exploreBtnRef = useMagnetic({ strengthX: 14, strengthY: 9 });
  const atlasBtnRef = useMagnetic({ strengthX: 12, strengthY: 8 });
  const finderBtnRef = useMagnetic({ strengthX: 10, strengthY: 7 });

  const heroSlides = useMemo(() => {
    const resolved = HERO_CAROUSEL_SPEC.map((item) => {
      const spot = spots.find((s) => s.id === item.id);
      return spot ? { ...spot, shortLabel: item.shortLabel } : null;
    }).filter(Boolean);
    return resolved.length > 0 ? resolved : spots.slice(0, 4).map((s) => ({ ...s, shortLabel: s.name }));
  }, [spots]);

  const [activeIdx, setActiveIdx] = useState(0);
  const activeSpot = heroSlides[activeIdx] ?? heroSlides[0];
  const { weather, loading: weatherLoading } = useLiveWeather(activeSpot);
  const bstTime = useBangladeshTime();

  useEffect(() => {
    const first = heroSlides[0];
    if (first?.coordinates) {
      coordProxyRef.current = { lat: first.coordinates.lat, lng: first.coordinates.lng };
    }
  }, [heroSlides]);

  // 6-second linear progress bar on the active filmstrip thumbnail
  const startSlideProgress = useCallback(
    (idx) => {
      timerTweenRef.current?.kill();
      const reduce = window.matchMedia(MEDIA.reduceMotion).matches;

      progressFillRefs.current.forEach((bar, i) => {
        if (!bar) return;
        gsap.killTweensOf(bar);
        gsap.set(bar, { scaleX: i === idx && reduce ? 1 : 0, transformOrigin: 'left center' });
      });

      if (reduce) return;

      const activeBar = progressFillRefs.current[idx];
      if (!activeBar) return;

      timerTweenRef.current = gsap.fromTo(
        activeBar,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          duration: SLIDE_DURATION,
          ease: 'none',
          paused: !inViewRef.current,
          onComplete: () => {
            const next = (idx + 1) % heroSlides.length;
            goToSlideRef.current?.(next);
          },
        }
      );
    },
    [heroSlides.length]
  );

  const goToSlide = useCallback(
    (nextIdx) => {
      if (!heroSlides.length) return;
      const clamped = ((nextIdx % heroSlides.length) + heroSlides.length) % heroSlides.length;
      const prevIdx = activeIdxRef.current;
      const reduce = window.matchMedia(MEDIA.reduceMotion).matches;

      if (clamped === prevIdx) {
        startSlideProgress(clamped);
        return;
      }

      const forward =
        (clamped > prevIdx && !(prevIdx === 0 && clamped === heroSlides.length - 1)) ||
        (prevIdx === heroSlides.length - 1 && clamped === 0);

      activeIdxRef.current = clamped;
      setActiveIdx(clamped);

      const nextSpot = heroSlides[clamped];
      const incomingSlide = slideRefs.current[clamped];
      const outgoingSlide = slideRefs.current[prevIdx];
      const incomingZoom = zoomRefs.current[clamped];

      // 1. Silky directional clip-path wipe + continuous Ken Burns slow drift (`scale: 1.0 → 1.09`)
      if (incomingSlide) {
        slideRefs.current.forEach((el, i) => {
          if (!el) return;
          if (i !== clamped && i !== prevIdx) {
            gsap.set(el, { opacity: 0, zIndex: 0, clipPath: 'inset(0% 0% 0% 0%)' });
          }
        });

        if (outgoingSlide) {
          gsap.set(outgoingSlide, { opacity: 1, zIndex: 1, clipPath: 'inset(0% 0% 0% 0%)' });
        }

        if (reduce) {
          gsap.set(incomingSlide, { opacity: 1, zIndex: 2, clipPath: 'inset(0% 0% 0% 0%)' });
          if (outgoingSlide) gsap.set(outgoingSlide, { opacity: 0, zIndex: 0 });
        } else {
          const startClip = forward ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)';
          gsap.killTweensOf(incomingSlide);
          gsap.fromTo(
            incomingSlide,
            { opacity: 1, zIndex: 2, clipPath: startClip },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 1.05,
              ease: 'expo.inOut',
              onComplete: () => {
                gsap.set(incomingSlide, { clipPath: 'inset(0% 0% 0% 0%)' });
                if (outgoingSlide && activeIdxRef.current === clamped) {
                  gsap.set(outgoingSlide, { opacity: 0, zIndex: 0 });
                }
              },
            }
          );

          if (incomingZoom) {
            gsap.killTweensOf(incomingZoom);
            gsap.fromTo(
              incomingZoom,
              { scale: 1.0 },
              { scale: 1.09, duration: SLIDE_DURATION + 1.2, ease: 'none', overwrite: 'auto' }
            );
          }
        }
      }

      // 2. GPS coordinate odometer roll on top-left badge
      if (nextSpot?.coordinates && coordTextRef.current) {
        if (reduce) {
          coordProxyRef.current = { ...nextSpot.coordinates };
          coordTextRef.current.textContent = formatCoordinates(nextSpot.coordinates);
        } else {
          gsap.to(coordProxyRef.current, {
            lat: nextSpot.coordinates.lat,
            lng: nextSpot.coordinates.lng,
            duration: 0.85,
            ease: 'power3.out',
            overwrite: 'auto',
            onUpdate: () => {
              if (coordTextRef.current) {
                coordTextRef.current.textContent = formatCoordinates(coordProxyRef.current);
              }
            },
          });
        }
      }

      // 3. Subtle kinetic vertical swap on unified location label
      if (locationLabelRef.current && !reduce) {
        gsap.fromTo(
          locationLabelRef.current,
          { y: 7, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.42, ease: 'power3.out', clearProps: 'transform,opacity' }
        );
      }

      startSlideProgress(clamped);
    },
    [heroSlides, startSlideProgress]
  );

  useEffect(() => {
    goToSlideRef.current = goToSlide;
  }, [goToSlide]);

  // Initialize slide 0 Ken Burns + 6s auto-carousel + off-screen IntersectionObserver pause
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope || !heroSlides.length) return undefined;

    const reduce = window.matchMedia(MEDIA.reduceMotion).matches;
    const firstSlide = slideRefs.current[0];
    const firstZoom = zoomRefs.current[0];

    slideRefs.current.forEach((el, idx) => {
      if (!el) return;
      gsap.set(el, {
        opacity: idx === 0 ? 1 : 0,
        zIndex: idx === 0 ? 2 : 0,
        clipPath: 'inset(0% 0% 0% 0%)',
      });
    });

    if (!reduce && firstZoom) {
      gsap.fromTo(firstZoom, { scale: 1.0 }, { scale: 1.09, duration: SLIDE_DURATION + 1.2, ease: 'none' });
    }
    if (firstSlide) {
      startSlideProgress(0);
    }

    const io = new IntersectionObserver(
      (entries) => {
        const visible = Boolean(entries[0]?.isIntersecting);
        inViewRef.current = visible;
        if (!timerTweenRef.current) return;
        if (visible) timerTweenRef.current.play();
        else timerTweenRef.current.pause();
      },
      { threshold: 0.08 }
    );
    io.observe(scope);

    return () => {
      io.disconnect();
      timerTweenRef.current?.kill();
    };
  }, [heroSlides.length, startSlideProgress]);

  // Standalone Entrance Choreography (decoupled from MatchMedia ctx so natural intro completion can never stick hidden)
  useLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope || window.matchMedia(MEDIA.reduceMotion).matches) return undefined;

    let entranceCtx = null;
    let played = false;

    const runEntrance = () => {
      if (played || !scopeRef.current) return;
      played = true;

      entranceCtx?.revert();
      entranceCtx = gsap.context(() => {
        const root = scopeRef.current;
        const discoverChars = root.querySelectorAll('[data-hero-discover-char]');
        const subtitleNode = root.querySelector('[data-hero-subtitle-reveal]');
        const hudNodes = root.querySelectorAll('[data-hero-hud-reveal]');
        const ctas = root.querySelectorAll('[data-hero-cta]');

        const tl = gsap.timeline({
          defaults: { overwrite: 'auto' },
          onComplete: () => {
            gsap.set([discoverChars, subtitleNode, hudNodes, ctas], {
              clearProps: 'transform,opacity',
            });
          },
        });

        tl.fromTo(
          discoverChars,
          { yPercent: 105, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.035,
            ease: 'power4.out',
            clearProps: 'transform,opacity',
          },
          0.02
        );

        if (subtitleNode) {
          tl.fromTo(
            subtitleNode,
            { yPercent: 110, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.75,
              ease: 'power4.out',
              clearProps: 'transform,opacity',
            },
            0.2
          );
        }

        tl.fromTo(
          hudNodes,
          { y: 14, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.68,
            stagger: 0.05,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
          },
          0.14
        );

        tl.fromTo(
          ctas,
          { y: 14, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.62,
            stagger: 0.05,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
          },
          0.24
        );
      }, scopeRef);
    };

    const introStillActive =
      Boolean(document.querySelector('[data-cinematic-intro]')) && !window.__dbIntroDone;

    if (!introStillActive) {
      runEntrance();
      return () => {
        entranceCtx?.revert();
      };
    }

    const onIntroDone = () => runEntrance();
    window.addEventListener('db:intro-done', onIntroDone, { once: true });
    const fallbackId = window.setTimeout(runEntrance, 2900);

    return () => {
      window.removeEventListener('db:intro-done', onIntroDone);
      window.clearTimeout(fallbackId);
      entranceCtx?.revert();
    };
  }, []);

  // Sunbeam Ambient + Bidirectional Scrubbed Exit + Calm Desktop Mouse Gimbal
  useLayoutEffect(() => {
    const mm = gsap.matchMedia(scopeRef);

    mm.add(
      {
        isDesktop: MEDIA.desktop,
        finePointer: '(pointer: fine)',
        motion: MEDIA.motion,
      },
      (ctx) => {
        const { isDesktop, finePointer, motion } = ctx.conditions;
        if (!motion) return undefined;

        const scope = scopeRef.current;
        const frame = frameRef.current;
        const discoverSpreadNodes = scope.querySelectorAll('[data-hero-discover-spread]');

        // 1. Ultra-subtle breathing diagonal morning sunbeam light leak (paused off-screen)
        const sunbeamEl = scope.querySelector('[data-hero-sunbeams]');
        const ambientTl = gsap.timeline();
        if (sunbeamEl) {
          ambientTl.fromTo(
            sunbeamEl,
            { opacity: 0.42, xPercent: -4 },
            {
              opacity: 0.82,
              xPercent: 5,
              duration: 9,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
            },
            0
          );
        }

        const ambientIo = new IntersectionObserver(
          (entries) => {
            if (entries[0]?.isIntersecting) ambientTl.play();
            else ambientTl.pause();
          },
          { threshold: 0.02 }
        );
        ambientIo.observe(scope);

        // 2. Continuous Bidirectional Scroll-Scrubbed Exit (`scrub: 0.8`)
        const maxSpreadPx = isDesktop ? 16 : 6;
        const scrubTl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: frame,
            start: 'top 14%',
            end: 'bottom top',
            scrub: 0.8,
          },
        });

        scrubTl.fromTo(
          frame,
          { scale: 1, borderRadius: '28px', transformOrigin: 'center top' },
          { scale: 0.94, borderRadius: '36px', immediateRender: false },
          0
        );

        scrubTl.fromTo(
          scope.querySelector('[data-hero-scroll-photo]'),
          { yPercent: -5 },
          { yPercent: 11, immediateRender: false },
          0
        );

        scrubTl.fromTo(
          scope.querySelector('[data-hero-scroll-type]'),
          { yPercent: 0, opacity: 1 },
          { yPercent: -18, opacity: 0.2, immediateRender: false },
          0
        );

        discoverSpreadNodes.forEach((node, idx) => {
          const centeredOffset = idx - (DISCOVER_LETTERS.length - 1) / 2;
          scrubTl.fromTo(
            node,
            { x: 0 },
            { x: centeredOffset * maxSpreadPx, immediateRender: false },
            0
          );
        });

        // 3. Calm Cinema-Gimbal Desktop Mouse Parallax (`gsap.quickTo`, ±10px photo / ±6px text, zero tilt)
        let cleanupMouse = null;
        if (isDesktop && finePointer && frame) {
          const photoEl = photoPlaneRef.current;
          const typeEl = typePlaneRef.current;

          const photoX = photoEl ? gsap.quickTo(photoEl, 'x', { duration: 0.95, ease: 'power3.out' }) : null;
          const photoY = photoEl ? gsap.quickTo(photoEl, 'y', { duration: 0.95, ease: 'power3.out' }) : null;
          const typeX = typeEl ? gsap.quickTo(typeEl, 'x', { duration: 0.8, ease: 'power3.out' }) : null;
          const typeY = typeEl ? gsap.quickTo(typeEl, 'y', { duration: 0.8, ease: 'power3.out' }) : null;

          const onPointerMove = (e) => {
            const rect = frame.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

            photoX?.(-nx * 10);
            photoY?.(-ny * 10);
            typeX?.(nx * 6);
            typeY?.(ny * 6);
          };

          const onPointerLeave = () => {
            photoX?.(0);
            photoY?.(0);
            typeX?.(0);
            typeY?.(0);
          };

          frame.addEventListener('pointermove', onPointerMove, { passive: true });
          frame.addEventListener('pointerleave', onPointerLeave, { passive: true });
          cleanupMouse = () => {
            frame.removeEventListener('pointermove', onPointerMove);
            frame.removeEventListener('pointerleave', onPointerLeave);
          };
        }

        return () => {
          ambientIo.disconnect();
          cleanupMouse?.();
        };
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      id={SECTION_IDS.top}
      ref={scopeRef}
      data-hero-section
      className="relative overflow-x-clip px-3 pt-24 sm:px-5 md:pt-28"
    >
      <div className="relative z-10 mx-auto max-w-[1600px]">
        {/* Refined Top Editorial Framing Line (clears fixed z-50 Navbar cleanly) */}
        <div
          data-hero-top-bar
          className="mb-3 flex items-center justify-between gap-4 px-1.5 sm:mb-3.5 sm:px-3"
        >
          <p className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.24em] text-ink-soft uppercase transition-colors duration-300 sm:text-[11px] dark:text-slate-300">
            <span className="h-2 w-2 shrink-0 rounded-full bg-bd-green dark:bg-emerald-400" aria-hidden="true" />
            <span>{SITE_META.edition}</span>
          </p>
          <p className="hidden truncate text-xs text-ink-soft transition-colors duration-300 sm:block dark:text-slate-400">
            {SITE_META.description}
          </p>
        </div>

        {/* Expansive Museum-Grade Full-Bleed Real Photography Stage */}
        <div
          ref={frameRef}
          data-hero-frame
          className="relative flex min-h-[78svh] w-full flex-col justify-between overflow-hidden rounded-[28px] bg-[#06090f] shadow-[0_34px_95px_-34px_rgba(15,23,42,0.5)] ring-1 ring-slate-900/10 [container-type:inline-size] will-change-transform lg:h-[84vh] lg:min-h-[620px] dark:shadow-[0_36px_100px_-30px_rgba(0,0,0,0.9)] dark:ring-white/12"
        >
          {/* Semantic H1 for accessibility & SEO */}
          <h1 className="sr-only">Discover Bangladesh</h1>

          {/* =========================================================
              LAYER 1: 100% Real Full-Bleed Photography & Ken Burns Drift
              ========================================================= */}
          <div data-hero-scroll-photo className="absolute -inset-y-[6%] inset-x-0 z-10 will-change-transform">
            <div
              ref={photoPlaneRef}
              data-hero-plane-photo
              className="relative h-full w-full scale-[1.06] will-change-transform"
            >
              {heroSlides.map((spot, idx) => (
                <div
                  key={spot.id}
                  ref={(el) => {
                    slideRefs.current[idx] = el;
                  }}
                  data-hero-slide={spot.id}
                  data-active={idx === activeIdx ? 'true' : 'false'}
                  className="absolute inset-0 h-full w-full will-change-[clip-path,opacity]"
                  style={{ opacity: idx === 0 ? 1 : 0, zIndex: idx === 0 ? 2 : 0 }}
                >
                  <div
                    ref={(el) => {
                      zoomRefs.current[idx] = el;
                    }}
                    className="h-full w-full will-change-transform"
                  >
                    <SmartImage
                      src={getImageSrc(spot.images.cover, 'full')}
                      alt={`${spot.name}, ${spot.district} — real landscape photography`}
                      loading={idx === 0 ? 'eager' : 'lazy'}
                      fetchPriority={idx === 0 ? 'high' : 'auto'}
                      className="h-full w-full"
                      imgClassName="h-full w-full object-cover object-center"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ultra-Subtle Diagonal Morning Sunbeam Light Leak */}
          <div
            data-hero-sunbeams
            aria-hidden="true"
            className="pointer-events-none absolute -inset-[20%] z-[14] mix-blend-screen will-change-transform"
            style={{
              transform: 'rotate(-20deg)',
              background:
                'radial-gradient(ellipse 48% 20% at 30% 24%, rgba(255, 250, 232, 0.18) 0%, rgba(255, 250, 232, 0) 74%), radial-gradient(ellipse 42% 16% at 64% 34%, rgba(186, 230, 253, 0.11) 0%, rgba(186, 230, 253, 0) 76%)',
            }}
          />

          {/* Fine 3.5% Photographic Cinema Grain */}
          <div
            aria-hidden="true"
            className="cinema-grain pointer-events-none absolute -inset-[8%] z-[15] opacity-[0.035] mix-blend-overlay"
            style={{ backgroundImage: FILM_GRAIN_DATA_URI, backgroundSize: '180px 180px' }}
          />

          {/* Natural Photographic Vignette — Top & Bottom Only so the Center Sky Stays Luminous */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-[16] h-[34%]"
            style={{
              background:
                'linear-gradient(to bottom, rgba(6, 9, 15, 0.52) 0%, rgba(6, 9, 15, 0.16) 58%, rgba(6, 9, 15, 0) 100%)',
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[16] h-[54%]"
            style={{
              background:
                'linear-gradient(to top, rgba(6, 9, 15, 0.9) 0%, rgba(6, 9, 15, 0.48) 46%, rgba(6, 9, 15, 0) 100%)',
            }}
          />

          {/* =========================================================
              LAYER 2: Crisp Top Telemetry Bar (GPS Odometer + Unified Location & Live Weather Pill)
              ========================================================= */}
          <div className="relative z-30 flex flex-wrap items-center justify-between gap-2 p-3.5 sm:p-6">
            {/* Top-Left: Coordinate Badge with Pulsing Emerald Live Dot */}
            <div
              data-hero-hud-reveal
              data-hero-coord-badge
              className="glass-dark hidden items-center gap-2 rounded-full border border-white/20 px-3.5 py-2 font-mono text-[11px] font-semibold tracking-wider text-white/95 tabular-nums shadow-lg sm:inline-flex"
            >
              <span className="relative flex h-2 w-2 shrink-0 items-center justify-center" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              </span>
              <Compass className="h-3.5 w-3.5 text-white/75" strokeWidth={2} aria-hidden="true" />
              <span ref={coordTextRef} data-hero-coord-text>
                {formatCoordinates(activeSpot.coordinates)}
              </span>
            </div>

            {/* Top-Right: Unified Sleek Glass Pill (Active Location + Live Weather & BST Time) */}
            <div
              data-hero-hud-reveal
              data-hero-unified-hud
              className="glass-dark ml-auto flex max-w-full items-center gap-2 rounded-full border border-white/20 py-1.5 pr-3 pl-2 text-white shadow-lg sm:gap-2.5 sm:py-1.5 sm:pr-4 sm:pl-2"
            >
              <button
                type="button"
                data-hero-pill
                data-cursor="explore"
                onClick={() => openSpot(activeSpot.id)}
                className="group flex min-w-0 items-center gap-1.5 rounded-full py-0.5 pr-1 text-left transition hover:text-emerald-200 active:scale-95 sm:gap-2"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-ink transition-transform duration-200 group-hover:scale-105">
                  <MapPin className="h-3.5 w-3.5" strokeWidth={2.2} />
                </span>
                <span
                  ref={locationLabelRef}
                  data-hero-location-label
                  className="truncate text-[11px] font-semibold text-white will-change-transform sm:text-xs"
                >
                  {activeSpot.name}, {activeSpot.district}
                </span>
              </button>

              <span aria-hidden="true" className="h-4 w-px shrink-0 bg-white/20" />

              {/* Integrated Live Weather & BST Time */}
              {weatherLoading && !weather ? (
                <span
                  data-hero-live-weather
                  aria-hidden="true"
                  className="h-4 w-24 animate-pulse rounded-full bg-white/20 sm:w-32"
                />
              ) : (
                <span
                  data-hero-live-weather
                  className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-white/90 whitespace-nowrap tabular-nums sm:text-xs"
                >
                  <WeatherConditionIcon
                    icon={weather?.icon}
                    className="h-3.5 w-3.5 shrink-0 text-amber-300"
                  />
                  <span className="font-semibold text-white">{weather?.temperature ?? '--'}°C</span>
                  <span className="hidden text-white/80 md:inline">{weather?.label ?? 'Clear'}</span>
                  <span className="hidden text-white/30 lg:inline" aria-hidden="true">
                    ·
                  </span>
                  <span className="hidden text-emerald-300/95 lg:inline">{bstTime}</span>
                </span>
              )}
            </div>
          </div>

          {/* =========================================================
              LAYER 3: Monumental Kinetic Centerpiece Typography (DISCOVER / BANGLADESH)
              ========================================================= */}
          <div
            aria-hidden="true"
            data-hero-scroll-type
            className="pointer-events-none relative z-20 my-auto flex justify-center px-3 py-6 select-none will-change-transform sm:px-8"
          >
            <div
              ref={typePlaneRef}
              data-hero-plane-type
              className="flex w-full max-w-[1440px] flex-col items-center will-change-transform"
            >
              <div
                className="flex w-full items-end justify-between leading-[0.86] font-black tracking-tight"
                style={{
                  fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif",
                  fontSize: 'clamp(2.35rem, 12.8cqw, 13rem)',
                  filter: 'drop-shadow(0 16px 36px rgba(6, 9, 15, 0.5))',
                }}
              >
                {DISCOVER_LETTERS.map((char, idx) => (
                  <span
                    key={`${char}-${idx}`}
                    data-hero-discover-spread
                    className="inline-block overflow-hidden py-[0.04em] will-change-transform"
                  >
                    <span
                      data-hero-discover-char
                      className="inline-block bg-clip-text px-[0.02em] pb-[0.04em] text-transparent will-change-transform"
                      style={{
                        backgroundImage:
                          'linear-gradient(180deg, rgba(255, 255, 255, 0.99) 0%, rgba(241, 245, 249, 0.94) 56%, rgba(203, 221, 238, 0.74) 100%)',
                        WebkitBackgroundClip: 'text',
                      }}
                    >
                      {char}
                    </span>
                  </span>
                ))}
              </div>

              <div className="mt-2.5 overflow-hidden py-1 sm:mt-3.5">
                <div
                  data-hero-subtitle-reveal
                  className="flex items-center gap-3 font-bold tracking-[0.38em] text-white/95 uppercase will-change-transform sm:gap-5"
                  style={{
                    fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif",
                    fontSize: 'clamp(0.68rem, 1.3cqw, 1.2rem)',
                    textShadow: '0 4px 22px rgba(6, 9, 15, 0.75)',
                  }}
                >
                  <span className="h-px w-6 bg-gradient-to-r from-transparent to-white/70 sm:w-12" />
                  <span>BANGLADESH</span>
                  <span className="h-px w-6 bg-gradient-to-l from-transparent to-white/70 sm:w-12" />
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
              LAYER 4: Bottom Editorial Story + Magnetic CTAs + 4-Thumbnail Mini Filmstrip
              ========================================================= */}
          <div
            data-hero-copy
            className="relative z-30 flex flex-col gap-5 p-4 text-white sm:p-7 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:pb-9"
          >
            {/* Bottom-Left Editorial Copy & Magnetic CTAs */}
            <div className="max-w-xl">
              <p
                data-hero-hud-reveal
                className="text-[10px] font-semibold tracking-[0.24em] text-emerald-300/95 uppercase sm:text-[11px]"
              >
                Hills · Sea · Forest · Heritage
              </p>
              <p
                data-hero-hud-reveal
                className="mt-1.5 font-display leading-[1.1] font-bold tracking-[-0.025em] text-white sm:mt-2"
                style={{ fontSize: 'clamp(1.2rem, 2.35vw, 2.25rem)' }}
              >
                Rivers, ridges, mangroves &amp; a thousand years of living heritage.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-5 sm:gap-2.5">
                {/* Primary Liquid Fill Magnetic CTA */}
                <button
                  ref={exploreBtnRef}
                  type="button"
                  data-hero-cta
                  data-hero-liquid-cta
                  data-cursor="magnetic"
                  onClick={() => scrollToTarget(`#${SECTION_IDS.showcase}`)}
                  className="group relative inline-flex h-10 items-center gap-2 overflow-hidden rounded-full bg-white px-4 text-xs font-semibold text-ink shadow-[0_14px_34px_-12px_rgba(255,255,255,0.42)] transition-colors duration-300 hover:text-white active:scale-95 sm:h-11 sm:px-5.5 sm:text-sm"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 translate-y-[104%] rounded-full bg-gradient-to-r from-[#0b192c] via-[#006a4e] to-[#0f2942] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"
                  />
                  <span className="relative z-10">Explore Destinations</span>
                  <ArrowDownRight
                    className="relative z-10 h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                    strokeWidth={2.2}
                  />
                </button>

                {/* Frosted Glass Interactive Map CTA with Pulsing Emerald Radar Dot */}
                <button
                  ref={atlasBtnRef}
                  type="button"
                  data-hero-cta
                  data-cursor="magnetic"
                  onClick={() => scrollToTarget(`#${SECTION_IDS.atlas}`)}
                  className="glass-dark group inline-flex h-10 items-center gap-2 rounded-full border border-white/25 px-4 text-xs font-semibold text-white transition hover:border-emerald-300/50 hover:bg-ink/90 active:scale-95 sm:h-11 sm:px-5 sm:text-sm"
                >
                  <span className="relative flex h-2 w-2 items-center justify-center" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                  </span>
                  <Map className="h-3.5 w-3.5 text-white/85 sm:h-4 sm:w-4" strokeWidth={2} />
                  <span>Interactive Map</span>
                </button>

                {/* Subtle Secondary Smart Trip Finder Pill */}
                <button
                  ref={finderBtnRef}
                  type="button"
                  data-hero-cta
                  data-hero-trip-finder
                  data-cursor="magnetic"
                  onClick={openTripFinder}
                  className="glass-dark group inline-flex h-10 items-center gap-1.5 rounded-full border border-emerald-300/35 px-3.5 text-xs font-semibold text-white transition hover:border-emerald-300/70 hover:bg-emerald-500/20 active:scale-95 sm:h-11 sm:px-4.5 sm:text-sm"
                >
                  <Sparkles
                    className="h-3.5 w-3.5 text-emerald-300 transition-transform duration-300 group-hover:rotate-12"
                    strokeWidth={2.2}
                  />
                  <span>Find My Trip</span>
                </button>
              </div>
            </div>

            {/* Bottom-Right: Interactive Glassmorphic 4-Thumbnail Mini Filmstrip Switcher */}
            <div
              data-hero-hud-reveal
              data-hero-filmstrip
              role="tablist"
              aria-label="Featured Bangladesh destinations"
              className="glass-dark flex w-full items-center gap-1.5 rounded-2xl border border-white/20 p-1.5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.85)] sm:w-auto sm:gap-2 sm:p-2 lg:mr-14"
            >
              {heroSlides.map((spot, idx) => {
                const isCurrent = idx === activeIdx;
                return (
                  <button
                    key={spot.id}
                    type="button"
                    role="tab"
                    aria-selected={isCurrent}
                    aria-label={`View ${spot.name}`}
                    data-hero-story-btn={idx}
                    data-cursor="magnetic"
                    onClick={() => goToSlide(idx)}
                    className={`group relative h-14 overflow-hidden rounded-xl border text-left transition-[width,flex-grow,border-color,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-95 sm:h-16 ${
                      isCurrent
                        ? 'flex-[1.55] border-white/75 opacity-100 shadow-md sm:w-[118px] sm:flex-none'
                        : 'flex-1 border-white/15 opacity-70 hover:border-white/40 hover:opacity-95 sm:w-[80px] sm:flex-none'
                    }`}
                  >
                    <img
                      src={getImageSrc(spot.images.cover, 'thumb')}
                      alt=""
                      loading="eager"
                      decoding="async"
                      draggable={false}
                      className={`h-full w-full object-cover transition-transform duration-500 ${
                        isCurrent ? 'scale-105' : 'scale-100 group-hover:scale-105'
                      }`}
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                    />
                    <span className="absolute right-1.5 bottom-2 left-1.5 block truncate font-display text-[10px] leading-none font-bold tracking-wide text-white drop-shadow-sm sm:right-2 sm:bottom-2.5 sm:left-2 sm:text-[11px]">
                      {spot.shortLabel}
                    </span>

                    {/* 6-Second Linear Progress Bar Along Active Thumbnail Bottom Edge */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-[3px] bg-white/20"
                    >
                      <span
                        ref={(el) => {
                          progressFillRefs.current[idx] = el;
                        }}
                        data-hero-story-fill={idx}
                        className="block h-full w-full origin-left scale-x-0 bg-emerald-400 shadow-[0_0_8px_#34d399] will-change-transform"
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

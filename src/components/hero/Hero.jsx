import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowDownRight, Compass, Map, MapPin } from 'lucide-react';
import { SITE_META, SECTION_IDS } from '@data';
import { useBangladeshTime, useLiveWeather, useMagnetic, useShowcase } from '@hooks';
import { gsap, MEDIA, scrollToTarget } from '@animations';
import { formatCoordinates, getImageSrc } from '@utils';
import { SmartImage } from '../ui/SmartImage.jsx';
import { HeroTerrain3D } from '../HeroTerrain3D.jsx';

const SLIDE_DURATION = 6; // seconds per destination slide

const HERO_CAROUSEL_SPEC = [
  { id: 'sajek-valley', shortLabel: 'Sajek' },
  { id: 'coxs-bazar', shortLabel: "Cox's Bazar" },
  { id: 'sundarbans', shortLabel: 'Sundarbans' },
  { id: 'tanguar-haor', shortLabel: 'Tanguar Haor' },
];

const DISCOVER_LETTERS = 'DISCOVER'.split('');
const SHOWCASE_WORDS = [
  'Rivers,',
  'ridges,',
  'mangroves',
  '&',
  'a',
  'thousand',
  'years',
  'of',
  'living',
  'heritage.',
];

// Ultra-fine SVG fractalNoise texture for 4% photographic cinema film grain (zero external fetch)
const FILM_GRAIN_DATA_URI =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function Hero() {
  const { spots, openSpot } = useShowcase();
  const scopeRef = useRef(null);
  const frameRef = useRef(null);

  // 3-plane mouse camera gimbal refs
  const photoPlaneRef = useRef(null);
  const typePlaneRef = useRef(null);
  const hudTopPlaneRef = useRef(null);
  const hudBottomPlaneRef = useRef(null);

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

  // Magnetic controls
  const exploreBtnRef = useMagnetic({ strengthX: 14, strengthY: 9 });
  const atlasBtnRef = useMagnetic({ strengthX: 12, strengthY: 8 });
  const pillBtnRef = useMagnetic({ strengthX: 10, strengthY: 7 });

  const heroSlides = useMemo(() => {
    const resolved = HERO_CAROUSEL_SPEC.map((item) => {
      const spot = spots.find((s) => s.id === item.id);
      return spot ? { ...spot, shortLabel: item.shortLabel } : null;
    }).filter(Boolean);
    return resolved.length > 0 ? resolved : spots.slice(0, 4).map((s) => ({ ...s, shortLabel: s.name }));
  }, [spots]);

  const [activeIdx, setActiveIdx] = useState(0);
  const activeSpot = heroSlides[activeIdx] ?? heroSlides[0];
  const { weather, loading: weatherLoading } = useLiveWeather(activeSpot?.coordinates);
  const bstTime = useBangladeshTime();

  // Keep initial coordinate proxy synced on first mount
  useEffect(() => {
    const first = heroSlides[0];
    if (first?.coordinates) {
      coordProxyRef.current = { lat: first.coordinates.lat, lng: first.coordinates.lng };
    }
  }, [heroSlides]);

  // Core slide progress starter + cinematic wipe / Ken Burns / coordinate odometer choreography
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

      activeIdxRef.current = clamped;
      setActiveIdx(clamped);

      const nextSpot = heroSlides[clamped];
      const incomingSlide = slideRefs.current[clamped];
      const outgoingSlide = slideRefs.current[prevIdx];
      const incomingZoom = zoomRefs.current[clamped];

      // 1. Silky iris / curtain clip-path wipe + slow Ken Burns zoom drift (1.0 -> 1.10)
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
          // Alternate sleek horizontal curtain wipe and expanding circular cinema iris
          const useIris = clamped % 2 === 1;
          const startClip = useIris ? 'circle(0% at 50% 52%)' : 'inset(0% 0% 0% 100%)';
          const endClip = useIris ? 'circle(145% at 50% 52%)' : 'inset(0% 0% 0% 0%)';

          gsap.killTweensOf(incomingSlide);
          gsap.fromTo(
            incomingSlide,
            { opacity: 1, zIndex: 2, clipPath: startClip },
            {
              clipPath: endClip,
              duration: 1.18,
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
              { scale: 1.1, duration: SLIDE_DURATION + 1.4, ease: 'none', overwrite: 'auto' }
            );
          }
        }
      }

      // 2. Odometer coordinate ticker on top-left GPS badge
      if (nextSpot?.coordinates && coordTextRef.current) {
        if (reduce) {
          coordProxyRef.current = { ...nextSpot.coordinates };
          coordTextRef.current.textContent = formatCoordinates(nextSpot.coordinates);
        } else {
          gsap.to(coordProxyRef.current, {
            lat: nextSpot.coordinates.lat,
            lng: nextSpot.coordinates.lng,
            duration: 0.92,
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

      // 3. Top-right location pill vertical kinetic swap
      if (locationLabelRef.current && !reduce) {
        gsap.fromTo(
          locationLabelRef.current,
          { y: 9, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.48, ease: 'power3.out', clearProps: 'transform,opacity' }
        );
      }

      // 4. Restart 6s story progress bar
      startSlideProgress(clamped);
    },
    [heroSlides, startSlideProgress]
  );

  useEffect(() => {
    goToSlideRef.current = goToSlide;
  }, [goToSlide]);

  // Initialize first slide Ken Burns + 6s auto-carousel + IntersectionObserver pause off-screen
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
      gsap.fromTo(firstZoom, { scale: 1.0 }, { scale: 1.1, duration: SLIDE_DURATION + 1.4, ease: 'none' });
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
  }, [goToSlide, heroSlides.length, startSlideProgress]);

  // GSAP context-scoped Entrance + Ambient Sunbeams/Mist + 3-Plane Mouse Gimbal + ScrollTrigger Kinetic Split
  useLayoutEffect(() => {
    let cleanupWait = null;
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
        const headerSplits = scope.querySelectorAll('[data-hero-header-split]');
        const discoverChars = scope.querySelectorAll('[data-hero-discover-char]');
        const discoverSpreadNodes = scope.querySelectorAll('[data-hero-discover-spread]');
        const subtitleNode = scope.querySelector('[data-hero-subtitle-reveal]');
        const showcaseWords = scope.querySelectorAll('[data-hero-word]');
        const frameEntrance = scope.querySelector('[data-hero-frame-entrance]');
        const ctas = scope.querySelectorAll('[data-hero-cta]');

        // 1. Load Entrance Choreography (synced with CinematicIntro, never permanently hides content)
        const playEntrance = () => {
          ctx.add(() => {
            const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });

            tl.fromTo(
              headerSplits,
              { yPercent: 105, opacity: 0 },
              {
                yPercent: 0,
                opacity: 1,
                duration: 0.82,
                stagger: 0.08,
                ease: 'power3.out',
                clearProps: 'transform,opacity',
              },
              0
            );

            tl.fromTo(
              frameEntrance,
              { opacity: 0, y: 18 },
              {
                opacity: 1,
                y: 0,
                duration: 0.88,
                ease: 'expo.out',
                clearProps: 'transform,opacity',
              },
              0.04
            );

            tl.fromTo(
              discoverChars,
              {
                yPercent: 112,
                rotateX: -38,
                opacity: 0,
                transformPerspective: 950,
                transformOrigin: '50% 100% -20px',
              },
              {
                yPercent: 0,
                rotateX: 0,
                opacity: 1,
                duration: 1.04,
                stagger: 0.045,
                ease: 'power4.out',
                clearProps: 'transform,opacity',
              },
              0.12
            );

            if (subtitleNode) {
              tl.fromTo(
                subtitleNode,
                { yPercent: 115, opacity: 0 },
                {
                  yPercent: 0,
                  opacity: 1,
                  duration: 0.88,
                  ease: 'power4.out',
                  clearProps: 'transform,opacity',
                },
                0.36
              );
            }

            tl.fromTo(
              showcaseWords,
              { rotateX: -35, yPercent: 110, opacity: 0, transformOrigin: '50% 100% -12px' },
              {
                rotateX: 0,
                yPercent: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.03,
                ease: 'power4.out',
                clearProps: 'transform,opacity',
              },
              0.3
            );

            tl.fromTo(
              ctas,
              { y: 16, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.7,
                stagger: 0.07,
                ease: 'power3.out',
                clearProps: 'transform,opacity',
              },
              0.44
            );
          });
        };

        const introActive = Boolean(document.querySelector('[data-cinematic-intro]'));
        if (introActive) {
          let played = false;
          const trigger = () => {
            if (played) return;
            played = true;
            playEntrance();
          };
          window.addEventListener('db:intro-done', trigger, { once: true });
          const fallbackId = window.setTimeout(trigger, 3900);
          cleanupWait = () => {
            window.removeEventListener('db:intro-done', trigger);
            window.clearTimeout(fallbackId);
          };
        } else {
          playEntrance();
        }

        // 2. Atmospheric Real-World Lighting: Drifting Volumetric Sunbeams & Horizon Mist Glow
        gsap.fromTo(
          scope.querySelector('[data-hero-sunbeams]'),
          { xPercent: -7, opacity: 0.58, scale: 1 },
          {
            xPercent: 9,
            opacity: 0.95,
            scale: 1.06,
            duration: 11,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          }
        );

        gsap.fromTo(
          scope.querySelector('[data-hero-mist-glow]'),
          { xPercent: -10, opacity: 0.55 },
          {
            xPercent: 10,
            opacity: 0.88,
            duration: 16,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          }
        );

        // Kinetic Scroll Prompt flowing vertical light drop
        gsap.fromTo(
          scope.querySelector('[data-hero-light-drop]'),
          { yPercent: -130, opacity: 0 },
          {
            yPercent: 240,
            opacity: 1,
            duration: 1.45,
            ease: 'power2.inOut',
            repeat: -1,
          }
        );

        // 3. Hero -> Stats Continuous Bidirectional Scrubbed Depth (scrub: 0.8)
        const maxSpreadPx = isDesktop ? 20 : 7;
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

        // Background real photograph shifts gently for crisp parallax depth
        scrubTl.fromTo(
          scope.querySelector('[data-hero-scroll-photo]'),
          { yPercent: -6 },
          { yPercent: 12, immediateRender: false },
          0
        );

        // Giant DISCOVER BANGLADESH glides softly upward & fades while letters expand outward
        scrubTl.fromTo(
          scope.querySelector('[data-hero-scroll-type]'),
          { yPercent: 0, opacity: 1 },
          { yPercent: -24, opacity: 0.14, immediateRender: false },
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

        // 4. Live 3-Plane Level Mouse Camera Depth on Desktop (gsap.quickTo, zero tilt wobble)
        let cleanupMouse = null;
        if (isDesktop && finePointer && frame) {
          const photoEl = photoPlaneRef.current;
          const typeEl = typePlaneRef.current;
          const hudTopEl = hudTopPlaneRef.current;
          const hudBottomEl = hudBottomPlaneRef.current;

          const photoX = photoEl ? gsap.quickTo(photoEl, 'x', { duration: 0.9, ease: 'power3.out' }) : null;
          const photoY = photoEl ? gsap.quickTo(photoEl, 'y', { duration: 0.9, ease: 'power3.out' }) : null;

          const typeX = typeEl ? gsap.quickTo(typeEl, 'x', { duration: 0.75, ease: 'power3.out' }) : null;
          const typeY = typeEl ? gsap.quickTo(typeEl, 'y', { duration: 0.75, ease: 'power3.out' }) : null;

          const hudTopX = hudTopEl ? gsap.quickTo(hudTopEl, 'x', { duration: 0.65, ease: 'power3.out' }) : null;
          const hudTopY = hudTopEl ? gsap.quickTo(hudTopEl, 'y', { duration: 0.65, ease: 'power3.out' }) : null;
          const hudBotX = hudBottomEl ? gsap.quickTo(hudBottomEl, 'x', { duration: 0.65, ease: 'power3.out' }) : null;
          const hudBotY = hudBottomEl ? gsap.quickTo(hudBottomEl, 'y', { duration: 0.65, ease: 'power3.out' }) : null;

          const onPointerMove = (e) => {
            const rect = frame.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // [-1, 1]
            const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // [-1, 1]

            // Plane 1: Real Photo opposite camera gimbal (±14px)
            photoX?.(-nx * 14);
            photoY?.(-ny * 14);

            // Plane 2: Monumental Typography opposite drift (±8px, completely level)
            typeX?.(-nx * 8);
            typeY?.(-ny * 8);

            // Plane 3: Foreground Pills & Bottom Controls (±4px)
            hudTopX?.(nx * 4);
            hudTopY?.(ny * 4);
            hudBotX?.(nx * 4);
            hudBotY?.(ny * 4);
          };

          const onPointerLeave = () => {
            photoX?.(0);
            photoY?.(0);
            typeX?.(0);
            typeY?.(0);
            hudTopX?.(0);
            hudTopY?.(0);
            hudBotX?.(0);
            hudBotY?.(0);
          };

          frame.addEventListener('pointermove', onPointerMove, { passive: true });
          frame.addEventListener('pointerleave', onPointerLeave, { passive: true });
          cleanupMouse = () => {
            frame.removeEventListener('pointermove', onPointerMove);
            frame.removeEventListener('pointerleave', onPointerLeave);
          };
        }

        return () => {
          cleanupMouse?.();
        };
      }
    );

    return () => {
      cleanupWait?.();
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
      {/* Ambient procedural terrain strictly in z-0 background */}
      <HeroTerrain3D sectionRef={scopeRef} />

      <div className="relative z-10 mx-auto max-w-[1600px]">
        {/* Editorial Header Bar — guaranteed clean clearance below fixed z-50 Navbar */}
        <div
          data-hero-top-bar
          className="flex flex-col gap-3 px-1 pt-2 sm:px-3 md:pt-3 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="overflow-hidden py-0.5">
            <p
              data-hero-header-split
              className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.24em] text-ink-soft uppercase transition-colors duration-300 will-change-transform dark:text-slate-300"
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-bd-green dark:bg-emerald-400" aria-hidden="true" />
              {SITE_META.edition}
            </p>
          </div>
          <div className="overflow-hidden py-0.5">
            <p
              data-hero-header-split
              className="max-w-lg text-xs leading-relaxed text-ink-soft transition-colors duration-300 will-change-transform sm:text-sm lg:text-right dark:text-slate-400"
            >
              {SITE_META.description}
            </p>
          </div>
        </div>

        {/* 100% Full-Real National Geographic / Awwwards Cinematic Photography Stage */}
        <div data-hero-frame-entrance className="mt-4 will-change-transform sm:mt-5">
          <div
            ref={frameRef}
            data-hero-frame
            className="relative h-[clamp(540px,80svh,850px)] w-full overflow-hidden rounded-[28px] bg-[#060a12] shadow-[0_34px_95px_-34px_rgba(15,23,42,0.52)] ring-1 ring-slate-900/10 [container-type:inline-size] will-change-transform dark:shadow-[0_36px_100px_-30px_rgba(0,0,0,0.9)] dark:ring-white/12"
          >
            {/* Semantic H1 for screen readers and SEO */}
            <h1 className="sr-only">Discover Bangladesh</h1>

            {/* =========================================================
                PLANE 1: Full-Bleed Real Photography & 4-Spot Auto-Carousel
                ========================================================= */}
            <div data-hero-scroll-photo className="absolute -inset-y-[6%] inset-x-0 z-10 will-change-transform">
              <div
                ref={photoPlaneRef}
                data-hero-plane-photo
                className="relative h-full w-full scale-[1.08] will-change-transform"
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
                        alt={`${spot.name}, ${spot.district} — editorial landscape`}
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

            {/* Atmospheric Real-World Lighting: Volumetric Diagonal Morning Sunbeams */}
            <div
              data-hero-sunbeams
              aria-hidden="true"
              className="pointer-events-none absolute -inset-[22%] z-[14] mix-blend-screen will-change-transform"
              style={{
                transform: 'rotate(-22deg)',
                background:
                  'radial-gradient(ellipse 52% 24% at 32% 24%, rgba(255, 249, 230, 0.22) 0%, rgba(255, 249, 230, 0) 72%), radial-gradient(ellipse 46% 18% at 62% 36%, rgba(186, 230, 253, 0.14) 0%, rgba(186, 230, 253, 0) 75%), radial-gradient(ellipse 38% 14% at 48% 18%, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0) 70%)',
              }}
            />

            {/* Purely Photographic Soft Translucent Horizon Mist Glow (zero vector shapes) */}
            <div
              data-hero-mist-glow
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-[16%] top-[28%] z-[15] h-[42%] mix-blend-screen will-change-transform"
              style={{
                background:
                  'radial-gradient(ellipse 58% 46% at 50% 50%, rgba(226, 240, 252, 0.14) 0%, rgba(186, 224, 248, 0.06) 48%, rgba(6, 10, 18, 0) 78%)',
              }}
            />

            {/* Ultra-fine 4% Cinema Film Grain Texture */}
            <div
              aria-hidden="true"
              className="cinema-grain pointer-events-none absolute -inset-[8%] z-[16] opacity-[0.04] mix-blend-overlay"
              style={{ backgroundImage: FILM_GRAIN_DATA_URI, backgroundSize: '180px 180px' }}
            />

            {/* Natural Photographic Dark Vignette (zero fake waves, crisp foreground legibility) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[18]"
              style={{
                background:
                  'linear-gradient(to top, rgba(6, 10, 18, 0.88) 0%, rgba(6, 10, 18, 0.32) 42%, rgba(6, 10, 18, 0.16) 72%, rgba(6, 10, 18, 0.24) 100%)',
              }}
            />

            {/* =========================================================
                PLANE 2: Monumental Kinetic Sky Typography (DISCOVER + BANGLADESH)
                ========================================================= */}
            <div
              aria-hidden="true"
              data-hero-scroll-type
              className="pointer-events-none absolute inset-x-0 top-[18%] z-20 flex justify-center px-3 select-none will-change-transform sm:top-[17%] sm:px-8 lg:top-[16%]"
            >
              <div
                ref={typePlaneRef}
                data-hero-plane-type
                className="flex w-full max-w-[1440px] flex-col items-center will-change-transform"
              >
                <div
                  className="flex w-full items-end justify-between leading-[0.86] font-black tracking-[-0.04em] [perspective:1000px]"
                  style={{
                    fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif",
                    fontSize: 'clamp(2.25rem, 12.6cqw, 12.8rem)',
                  }}
                >
                  {DISCOVER_LETTERS.map((char, idx) => (
                    <span
                      key={`${char}-${idx}`}
                      data-hero-discover-spread
                      className="inline-block will-change-transform"
                    >
                      <span
                        data-hero-discover-char
                        className="inline-block bg-clip-text px-[0.02em] pb-[0.04em] text-transparent will-change-transform"
                        style={{
                          backgroundImage:
                            'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(241, 245, 249, 0.92) 58%, rgba(203, 221, 238, 0.72) 100%)',
                          WebkitBackgroundClip: 'text',
                          filter: 'drop-shadow(0 14px 36px rgba(6, 10, 18, 0.52))',
                        }}
                      >
                        {char}
                      </span>
                    </span>
                  ))}
                </div>

                <div className="mt-2 overflow-hidden py-1 sm:mt-3">
                  <div
                    data-hero-subtitle-reveal
                    className="flex items-center gap-2.5 font-bold tracking-[0.34em] text-white/90 uppercase will-change-transform sm:gap-4 sm:tracking-[0.54em]"
                    style={{
                      fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif",
                      fontSize: 'clamp(0.66rem, 1.35cqw, 1.25rem)',
                      textShadow: '0 4px 20px rgba(6, 10, 18, 0.72)',
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
                PLANE 3A: Top Floating Odometer Coordinate & Location Pills
                ========================================================= */}
            <div
              ref={hudTopPlaneRef}
              data-hero-plane-hud-top
              className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between p-4 will-change-transform sm:p-6"
            >
              {/* Odometer GPS Coordinates Pill */}
              <div
                data-hero-coord-badge
                className="glass-dark hidden items-center gap-2 rounded-full border border-white/20 px-3.5 py-1.5 font-mono text-[11px] font-semibold tracking-wider text-white/95 tabular-nums shadow-lg sm:inline-flex"
              >
                <Compass className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2.2} aria-hidden="true" />
                <span ref={coordTextRef} data-hero-coord-text>
                  {formatCoordinates(activeSpot.coordinates)}
                </span>
              </div>

              {/* Live Weather + BST Time HUD & Active Destination Pill */}
              <div className="pointer-events-auto ml-auto flex max-w-full flex-wrap items-center justify-end gap-2">
                {weatherLoading && !weather ? (
                  <div
                    data-hero-live-weather
                    aria-hidden="true"
                    className="glass-dark h-8 w-[198px] animate-pulse rounded-full border border-white/20 sm:h-9 sm:w-[218px]"
                  />
                ) : (
                  <div
                    data-hero-live-weather
                    className="glass-dark inline-flex h-8 max-w-full items-center gap-1.5 rounded-full border border-white/20 px-3 text-[11px] font-medium text-white/95 shadow-lg tabular-nums sm:h-9 sm:gap-2 sm:px-3.5"
                  >
                    <span className="relative flex h-2 w-2 shrink-0 items-center justify-center" aria-hidden="true">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                    </span>
                    <span className="truncate whitespace-nowrap">
                      <span className="font-semibold text-emerald-300">Live</span>
                      <span className="mx-1 text-white/35">·</span>
                      <span className="font-semibold">{weather?.temperature ?? '--'}°C</span> {weather?.label ?? 'Clear'}
                      <span className="mx-1 text-white/35">·</span>
                      <span className="text-white/80">{bstTime}</span>
                    </span>
                  </div>
                )}

                <button
                  ref={pillBtnRef}
                  type="button"
                  data-hero-pill
                  data-cursor="explore"
                  onClick={() => openSpot(activeSpot.id)}
                  className="glass flex max-w-full items-center gap-2 rounded-full border border-white/65 py-1.5 pr-3.5 pl-2 text-xs font-semibold text-ink shadow-lg transition-colors duration-300 active:scale-95 dark:border-white/15 dark:text-slate-50"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-colors duration-300 dark:bg-white dark:text-[#0B111E]">
                    <MapPin className="h-3.5 w-3.5" strokeWidth={2.2} />
                  </span>
                  <span ref={locationLabelRef} data-hero-location-label className="truncate will-change-transform">
                    {activeSpot.name}, {activeSpot.district}
                  </span>
                </button>
              </div>
            </div>

            {/* =========================================================
                PLANE 3B: Bottom Editorial Copy, Tactile CTAs & 4-Spot Story Progress
                ========================================================= */}
            <div
              ref={hudBottomPlaneRef}
              data-hero-plane-hud-bottom
              data-hero-copy
              className="absolute inset-x-0 bottom-0 z-30 flex flex-col gap-5 p-4 text-white will-change-transform sm:p-8 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:pb-10"
            >
              <div className="max-w-xl">
                <p className="text-[10px] font-semibold tracking-[0.24em] text-emerald-300/95 uppercase sm:text-[11px]">
                  Hills · Sea · Forest · Heritage
                </p>
                <p
                  className="mt-1.5 flex flex-wrap gap-x-[0.25em] gap-y-0.5 font-display leading-[1.08] font-bold tracking-[-0.025em] text-white sm:mt-2"
                  style={{ fontSize: 'clamp(1.22rem, 2.45vw, 2.35rem)' }}
                >
                  {SHOWCASE_WORDS.map((word, idx) => (
                    <span key={`${word}-${idx}`} className="inline-block overflow-hidden py-0.5 [perspective:900px]">
                      <span data-hero-word className="inline-block will-change-transform">
                        {word}
                      </span>
                    </span>
                  ))}
                </p>

                <div className="mt-3.5 flex flex-wrap items-center gap-2 sm:mt-5 sm:gap-3">
                  {/* Liquid Fill Hover CTA */}
                  <button
                    ref={exploreBtnRef}
                    type="button"
                    data-hero-cta
                    data-hero-liquid-cta
                    data-cursor="magnetic"
                    onClick={() => scrollToTarget(`#${SECTION_IDS.showcase}`)}
                    className="group relative inline-flex h-10 items-center gap-2 overflow-hidden rounded-full bg-white px-4 text-xs font-semibold text-ink shadow-[0_14px_34px_-12px_rgba(255,255,255,0.4)] transition-colors duration-300 hover:text-white active:scale-95 sm:h-11 sm:px-5.5 sm:text-sm"
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

                  {/* Live Radar Pulse Interactive Map Pill */}
                  <button
                    ref={atlasBtnRef}
                    type="button"
                    data-hero-cta
                    data-cursor="magnetic"
                    onClick={() => scrollToTarget(`#${SECTION_IDS.atlas}`)}
                    className="glass-dark group inline-flex h-10 items-center gap-2 rounded-full border border-white/25 px-4 text-xs font-semibold text-white transition hover:border-emerald-300/45 hover:bg-ink/90 active:scale-95 sm:h-11 sm:px-5.5 sm:text-sm"
                  >
                    <span className="relative flex h-2 w-2 items-center justify-center" aria-hidden="true">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                    </span>
                    <Map className="h-3.5 w-3.5 text-white/85 sm:h-4 sm:w-4" strokeWidth={2} />
                    <span>Interactive Map</span>
                  </button>
                </div>
              </div>

              {/* Bottom-Right: Kinetic Scroll Prompt + 4-Destination Story Progress Bars (clears desktop Compass HUD) */}
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:items-end lg:mr-14">
                <button
                  type="button"
                  data-hero-cta
                  data-hero-scroll-cue
                  data-cursor="magnetic"
                  onClick={() => scrollToTarget(`#${SECTION_IDS.showcase}`)}
                  className="hidden w-fit items-center gap-2.5 rounded-full border border-white/18 bg-black/25 px-3.5 py-1.5 text-[10px] font-semibold tracking-[0.18em] text-white/85 uppercase backdrop-blur-md transition hover:border-white/35 hover:bg-black/40 hover:text-white sm:inline-flex"
                >
                  <span>Scroll to explore</span>
                  <span
                    aria-hidden="true"
                    className="relative inline-flex h-4 w-[3px] overflow-hidden rounded-full bg-white/20"
                  >
                    <span
                      data-hero-light-drop
                      className="block h-2 w-full rounded-full bg-emerald-300 shadow-[0_0_8px_#6ee7b7] will-change-transform"
                    />
                  </span>
                </button>

                {/* 4-Destination Clickable Story Progress Indicators */}
                <div
                  role="tablist"
                  aria-label="Featured Bangladesh destinations"
                  className="grid w-full grid-cols-4 gap-2 sm:w-[340px] md:w-[380px]"
                >
                  {heroSlides.map((spot, idx) => {
                    const isCurrent = idx === activeIdx;
                    return (
                      <button
                        key={spot.id}
                        type="button"
                        role="tab"
                        aria-selected={isCurrent}
                        data-hero-story-btn={idx}
                        data-cursor="magnetic"
                        onClick={() => goToSlide(idx)}
                        className={`group flex flex-col gap-1.5 rounded-lg px-1 py-1 text-left transition-opacity ${
                          isCurrent ? 'opacity-100' : 'opacity-60 hover:opacity-90'
                        }`}
                      >
                        <span className="flex items-center gap-1 truncate text-[10px] font-semibold tracking-wider text-white uppercase tabular-nums">
                          <span className="font-mono text-emerald-300/90">0{idx + 1}</span>
                          <span className="truncate">{spot.shortLabel}</span>
                        </span>
                        <span className="relative h-[2.5px] w-full overflow-hidden rounded-full bg-white/25">
                          <span
                            ref={(el) => {
                              progressFillRefs.current[idx] = el;
                            }}
                            data-hero-story-fill={idx}
                            className="block h-full w-full origin-left scale-x-0 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] will-change-transform"
                          />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

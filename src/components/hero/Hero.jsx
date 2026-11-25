import { useLayoutEffect, useRef } from 'react';
import { ArrowDown, ArrowDownRight, Compass, Map, MapPin } from 'lucide-react';
import { SITE_META, SECTION_IDS } from '@data';
import { useMagnetic, useShowcase } from '@hooks';
import { gsap, MEDIA, scrollToTarget } from '@animations';
import { formatCoordinates, getImageSrc } from '@utils';
import { SmartImage } from '../ui/SmartImage.jsx';
import { HeroTerrain3D } from '../HeroTerrain3D.jsx';

const HERO_SPOT_ID = 'sajek-valley';
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

export function Hero() {
  const { spots, openSpot } = useShowcase();
  const scopeRef = useRef(null);
  const exploreBtnRef = useMagnetic({ strengthX: 12, strengthY: 8 });
  const atlasBtnRef = useMagnetic({ strengthX: 12, strengthY: 8 });
  const pillBtnRef = useMagnetic({ strengthX: 10, strengthY: 7 });
  const heroSpot = spots.find((s) => s.id === HERO_SPOT_ID) ?? spots[0];

  useLayoutEffect(() => {
    let cleanupWait = null;
    const mm = gsap.matchMedia(scopeRef);

    mm.add({ isDesktop: MEDIA.desktop, reduce: MEDIA.reduceMotion }, (ctx) => {
      const { reduce } = ctx.conditions;
      if (reduce) return;

      const scope = scopeRef.current;
      const headerSplits = scope.querySelectorAll('[data-hero-header-split]');
      const discoverChars = scope.querySelectorAll('[data-hero-discover-char]');
      const subtitleNode = scope.querySelector('[data-hero-subtitle-reveal]');
      const showcaseWords = scope.querySelectorAll('[data-hero-word]');
      const frameEntrance = scope.querySelector('[data-hero-frame-entrance]');
      const ctas = scope.querySelectorAll('[data-hero-cta]');

      // Choreographed load entrance: DISCOVER letters rise smoothly up from behind the mountain ridges
      // (yPercent: 120, rotateX: -35deg, opacity: 0 -> 0, 0, 1, stagger: 0.045, power4.out).
      // Never locks elements at opacity: 0 on mount; always restores clean inline styles.
      const playEntrance = () => {
        ctx.add(() => {
          const tl = gsap.timeline({
            defaults: { overwrite: 'auto' },
          });

          tl.fromTo(
            headerSplits,
            { yPercent: 105, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.85,
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
              duration: 0.9,
              ease: 'expo.out',
              clearProps: 'transform,opacity',
            },
            0.05
          );

          tl.fromTo(
            discoverChars,
            {
              yPercent: 120,
              rotateX: -35,
              opacity: 0,
              transformPerspective: 900,
              transformOrigin: '50% 100% -20px',
            },
            {
              yPercent: 0,
              rotateX: 0,
              opacity: 1,
              duration: 1.08,
              stagger: 0.045,
              ease: 'power4.out',
              clearProps: 'transform,opacity',
            },
            0.12
          );

          if (subtitleNode) {
            tl.fromTo(
              subtitleNode,
              { yPercent: 120, rotateX: -35, opacity: 0, transformPerspective: 800 },
              {
                yPercent: 0,
                rotateX: 0,
                opacity: 1,
                duration: 0.95,
                ease: 'power4.out',
                clearProps: 'transform,opacity',
              },
              0.38
            );
          }

          tl.fromTo(
            showcaseWords,
            { rotateX: -35, yPercent: 110, opacity: 0, transformOrigin: '50% 100% -12px' },
            {
              rotateX: 0,
              yPercent: 0,
              opacity: 1,
              duration: 0.82,
              stagger: 0.03,
              ease: 'power4.out',
              clearProps: 'transform,opacity',
            },
            0.32
          );

          tl.fromTo(
            ctas,
            { y: 16, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.72,
              stagger: 0.07,
              ease: 'power3.out',
              clearProps: 'transform,opacity',
            },
            0.46
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

      // Layer 1 ambient Sajek sky & clouds slow zoom drift
      gsap.fromTo(
        scope.querySelector('[data-hero-kenburns]'),
        { scale: 1.03 },
        { scale: 1.11, duration: 20, ease: 'sine.inOut', repeat: -1, yoyo: true }
      );

      // Layer 3 continuous drifting translucent mountain mist ribbons
      gsap.fromTo(
        scope.querySelector('[data-hero-mist-a]'),
        { xPercent: -12 },
        { xPercent: 12, duration: 16, ease: 'sine.inOut', repeat: -1, yoyo: true }
      );
      gsap.fromTo(
        scope.querySelector('[data-hero-mist-b]'),
        { xPercent: 10 },
        { xPercent: -14, duration: 22, ease: 'sine.inOut', repeat: -1, yoyo: true }
      );

      // Animated "Scroll to explore ↓" pulse cue
      gsap.fromTo(
        scope.querySelector('[data-hero-scroll-arrow]'),
        { y: -3, opacity: 0.65 },
        { y: 4, opacity: 1, duration: 1.15, ease: 'sine.inOut', repeat: -1, yoyo: true }
      );

      // Unified 3-Layer Mountain Depth-Masking ScrollTrigger Timeline (scrub: 1)
      const scrubTl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: scope.querySelector('[data-hero-frame]'),
          start: 'top 18%',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Layer 1 (Back Sky): drifts gently for deep horizon separation
      scrubTl.fromTo(
        scope.querySelector('[data-hero-sky]'),
        { scale: 1.12, yPercent: -5 },
        { scale: 1.12, yPercent: 11, immediateRender: false },
        0
      );

      // Distant atmospheric ridge: slight slow shift
      scrubTl.fromTo(
        scope.querySelector('[data-hero-ridge-back]'),
        { yPercent: 0 },
        { yPercent: 4, immediateRender: false },
        0
      );

      // Layer 2 (Middle Monumental DISCOVER BANGLADESH): physically sinks deeper behind the mountain peaks
      scrubTl.fromTo(
        scope.querySelector('[data-hero-mountain-title]'),
        { yPercent: 0, scale: 1, opacity: 1 },
        { yPercent: 45, scale: 0.92, opacity: 0.35, immediateRender: false },
        0
      );

      scrubTl.fromTo(
        scope.querySelector('[data-hero-mountain-subtitle]'),
        { yPercent: 0, y: 0, scale: 1, opacity: 1 },
        { yPercent: 45, y: 58, scale: 0.92, opacity: 0.25, immediateRender: false },
        0
      );

      // Layer 3 (Mid & Front Mountain Ridges): glide upward faster to amplify 3D parallax separation
      scrubTl.fromTo(
        scope.querySelector('[data-hero-ridge-mid]'),
        { yPercent: 0 },
        { yPercent: -4, immediateRender: false },
        0
      );

      scrubTl.fromTo(
        scope.querySelector('[data-hero-ridge-front]'),
        { yPercent: 0 },
        { yPercent: -8, immediateRender: false },
        0
      );

      // Floating top coordinate & location pills
      scrubTl.fromTo(
        scope.querySelector('[data-hero-coord-badge]'),
        { y: 0 },
        { y: 28, immediateRender: false },
        0
      );

      scrubTl.fromTo(
        scope.querySelector('[data-hero-pill-wrap]'),
        { y: 0 },
        { y: -24, immediateRender: false },
        0
      );
    });

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
      {/* Subtle procedural topographic backdrop strictly in z-0 */}
      <HeroTerrain3D sectionRef={scopeRef} />

      <div className="relative z-10 mx-auto max-w-[1600px]">
        {/* Top editorial eyebrow + description bar — cleanly padded below fixed z-50 Navbar */}
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

        {/* 3-Layer Mountain Depth-Masking Parallax Stage */}
        <div data-hero-frame-entrance className="mt-4 will-change-transform sm:mt-5">
          <div
            data-hero-frame
            className="relative h-[clamp(560px,80svh,850px)] w-full overflow-hidden rounded-[28px] bg-[#0b1626] shadow-[0_34px_95px_-34px_rgba(15,23,42,0.52)] ring-1 ring-slate-900/10 [container-type:inline-size] will-change-transform dark:shadow-[0_36px_100px_-30px_rgba(0,0,0,0.9)] dark:ring-white/12"
          >
            {/* Accessible semantic H1 */}
            <h1 className="sr-only">Discover Bangladesh</h1>

            {/* LAYER 1 (z-10, Back — Sajek Valley Sky & Clouds with Slow Ambient Drift) */}
            <div data-hero-sky className="absolute inset-0 z-10 will-change-transform">
              <div data-hero-kenburns className="h-full w-full will-change-transform">
                <SmartImage
                  src={getImageSrc(heroSpot.images.cover, 'full')}
                  alt={`${heroSpot.name}, ${heroSpot.district} — misty hills at sunrise`}
                  loading="eager"
                  fetchPriority="high"
                  className="h-full w-full"
                  imgClassName="h-full w-full object-cover object-[50%_28%]"
                />
              </div>
              {/* Soft atmospheric sky & horizon toning so mist-white DISCOVER gleams over Sajek sky */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0b1c31]/52 via-[#122a44]/24 to-[#08121f]/80 dark:from-[#07111f]/65 dark:via-[#0d2036]/32 dark:to-[#060c16]/88"
              />
              {/* Subtle golden-emerald zenith bloom */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[55%]"
                style={{
                  background:
                    'radial-gradient(ellipse 68% 58% at 50% 34%, rgba(226, 244, 255, 0.16) 0%, rgba(16, 185, 129, 0.08) 45%, rgba(11, 22, 38, 0) 78%)',
                }}
              />
            </div>

            {/* Distant Atmospheric Horizon Ridge (z-[15] — sits behind DISCOVER) */}
            <svg
              data-hero-ridge-back
              aria-hidden="true"
              viewBox="0 0 1440 420"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-[64%] w-full will-change-transform sm:h-[59%]"
            >
              <defs>
                <linearGradient id="hero-far-ridge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#28435f" stopOpacity="0.56" />
                  <stop offset="100%" stopColor="#122236" stopOpacity="0.86" />
                </linearGradient>
              </defs>
              <path
                fill="url(#hero-far-ridge)"
                d="M0,196 L64,174 Q118,154 168,126 L224,96 Q256,80 292,98 L358,132 Q404,154 452,124 L526,74 Q562,52 602,72 L684,116 Q736,142 792,118 L868,84 Q912,66 958,88 L1038,128 Q1082,146 1128,114 L1198,68 Q1236,46 1278,68 L1356,112 Q1398,134 1440,144 L1440,420 L0,420 Z"
              />
            </svg>

            {/* LAYER 2 (z-20, Middle — Monumental DISCOVER Typography Embedded Along the Mountain Ridge) */}
            <div
              aria-hidden="true"
              data-hero-mountain-title
              className="pointer-events-none absolute inset-x-0 bottom-[53.5%] z-20 flex justify-center px-3 select-none will-change-transform sm:bottom-[42%] sm:px-6 lg:bottom-[40.5%]"
            >
              <div
                className="flex w-full max-w-[1460px] items-end justify-between leading-[0.84] font-black tracking-[-0.045em] [perspective:1000px]"
                style={{
                  fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif",
                  fontSize: 'clamp(2.35rem, 13.4cqw, 13.6rem)',
                }}
              >
                {DISCOVER_LETTERS.map((char, idx) => (
                  <span
                    key={`${char}-${idx}`}
                    data-hero-discover-char
                    className="inline-block bg-clip-text px-[0.02em] pb-[0.04em] text-transparent will-change-transform"
                    style={{
                      backgroundImage:
                        'linear-gradient(180deg, rgba(255, 255, 255, 0.99) 0%, rgba(241, 245, 249, 0.94) 56%, rgba(186, 210, 232, 0.68) 100%)',
                      WebkitBackgroundClip: 'text',
                      filter: 'drop-shadow(0 12px 34px rgba(8, 18, 34, 0.42))',
                    }}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>

            {/* LAYER 3A (z-[26], Mid-Ground Sajek Mountain Silhouette — physically overlaps the lower edge of DISCOVER) */}
            <svg
              data-hero-ridge-mid
              aria-hidden="true"
              viewBox="0 0 1440 420"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-x-0 bottom-[-4%] z-[26] h-[60.5%] w-full will-change-transform sm:h-[50%] lg:h-[49%]"
            >
              <defs>
                <linearGradient id="hero-mid-ridge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1b324a" />
                  <stop offset="44%" stopColor="#112134" />
                  <stop offset="100%" stopColor="#091320" />
                </linearGradient>
              </defs>
              <path
                fill="url(#hero-mid-ridge)"
                stroke="rgba(226, 238, 250, 0.25)"
                strokeWidth="1.25"
                d="M0,42 L46,30 L92,14 Q114,6 138,16 L194,36 L242,24 L296,8 Q318,2 344,14 L408,36 L458,22 L516,10 Q542,4 568,16 L628,34 L684,16 Q712,8 742,18 L802,36 L858,20 L918,6 Q944,0 972,12 L1038,36 L1094,22 L1154,8 Q1180,2 1208,14 L1274,36 L1332,18 Q1358,10 1388,20 L1440,34 L1440,420 L0,420 Z"
              />
            </svg>

            {/* Continuous Drifting Valley Mist Layer A (z-[27], glides horizontally across the mid-ridge) */}
            <div
              data-hero-mist-a
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-[18%] bottom-[38%] z-[27] h-[22%] opacity-75 will-change-transform sm:bottom-[29%]"
              style={{
                background:
                  'radial-gradient(ellipse 36% 48% at 26% 52%, rgba(226, 240, 252, 0.24) 0%, rgba(226, 240, 252, 0) 75%), radial-gradient(ellipse 40% 52% at 72% 48%, rgba(203, 229, 248, 0.20) 0%, rgba(203, 229, 248, 0) 76%)',
              }}
            />

            {/* Sleek Tracked BANGLADESH Subtitle (z-[28], nestled along the misty valley saddle, sinks behind Front Ridge on scroll) */}
            <div
              aria-hidden="true"
              data-hero-mountain-subtitle
              className="pointer-events-none absolute inset-x-0 bottom-[45.5%] z-[28] flex justify-center px-4 select-none will-change-transform sm:bottom-[35.5%] lg:bottom-[34.5%]"
            >
              <div className="overflow-hidden py-1 [perspective:800px]">
                <div
                  data-hero-subtitle-reveal
                  className="flex items-center gap-2.5 font-bold tracking-[0.34em] text-white/90 uppercase will-change-transform sm:gap-4 sm:tracking-[0.52em]"
                  style={{
                    fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif",
                    fontSize: 'clamp(0.68rem, 1.45cqw, 1.32rem)',
                    textShadow: '0 4px 18px rgba(6, 13, 24, 0.75)',
                  }}
                >
                  <span className="h-px w-6 bg-gradient-to-r from-transparent to-emerald-300/70 sm:w-12" />
                  <span>BANGLADESH</span>
                  <span className="h-px w-6 bg-gradient-to-l from-transparent to-emerald-300/70 sm:w-12" />
                </div>
              </div>
            </div>

            {/* LAYER 3B (z-30, Front Pine/Slate Mountain Ridge Silhouette + Deep Editorial Vignette) */}
            <svg
              data-hero-ridge-front
              aria-hidden="true"
              viewBox="0 0 1440 420"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-x-0 bottom-[-6%] z-30 h-[48.5%] w-full will-change-transform sm:h-[39.5%] lg:h-[38.5%]"
            >
              <defs>
                <linearGradient id="hero-front-ridge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0f1f30" />
                  <stop offset="38%" stopColor="#0a1523" />
                  <stop offset="100%" stopColor="#050b14" />
                </linearGradient>
              </defs>
              <path
                fill="url(#hero-front-ridge)"
                stroke="rgba(148, 184, 209, 0.17)"
                strokeWidth="1.1"
                d="M0,44 L78,24 Q112,16 148,26 L236,48 L318,28 L396,12 Q428,6 464,18 L556,46 L642,32 L728,16 Q762,10 798,22 L892,48 L978,28 L1062,12 Q1096,6 1132,18 L1228,46 L1316,26 Q1356,16 1398,26 L1440,36 L1440,420 L0,420 Z"
              />
            </svg>

            {/* Continuous Drifting Valley Mist Layer B (z-[31], glides across front mountain crest) */}
            <div
              data-hero-mist-b
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-[18%] bottom-[29%] z-[31] h-[18%] opacity-70 will-change-transform sm:bottom-[21%]"
              style={{
                background:
                  'radial-gradient(ellipse 42% 45% at 46% 50%, rgba(186, 224, 245, 0.16) 0%, rgba(186, 224, 245, 0) 74%), radial-gradient(ellipse 30% 42% at 84% 55%, rgba(16, 185, 129, 0.10) 0%, rgba(16, 185, 129, 0) 74%)',
              }}
            />

            {/* Crisp bottom vignette over front ridge for effortless foreground HUD readability */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 z-[32] h-[42%] bg-gradient-to-t from-[#050b14]/95 via-[#07101d]/75 to-transparent sm:h-[36%]"
            />

            {/* LAYER 4 (z-40, Foreground Editorial HUD) */}
            {/* Top-left coordinates pill */}
            <div
              data-hero-coord-badge
              className="glass-dark pointer-events-none absolute top-4 left-4 z-40 hidden items-center gap-2 rounded-full border border-white/20 px-3.5 py-1.5 font-mono text-[11px] font-semibold tracking-wider text-white/90 tabular-nums will-change-transform sm:top-6 sm:left-6 sm:inline-flex"
            >
              <Compass className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2.2} aria-hidden="true" />
              <span>{formatCoordinates(heroSpot.coordinates)}</span>
            </div>

            {/* Top-right Sajek Valley location pill */}
            <div
              data-hero-pill-wrap
              className="absolute top-4 right-4 z-40 max-w-[calc(100%-2rem)] will-change-transform sm:top-6 sm:right-6"
            >
              <button
                ref={pillBtnRef}
                type="button"
                data-hero-pill
                data-cursor="explore"
                onClick={() => openSpot(heroSpot.id)}
                className="glass flex max-w-full items-center gap-2 rounded-full border border-white/65 py-1.5 pr-3.5 pl-2 text-xs font-semibold text-ink transition-colors duration-300 active:scale-95 dark:border-white/15 dark:text-slate-50"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-colors duration-300 dark:bg-white dark:text-[#0B111E]">
                  <MapPin className="h-3.5 w-3.5" strokeWidth={2.2} />
                </span>
                <span className="truncate">
                  {heroSpot.name}, {heroSpot.district}
                </span>
              </button>
            </div>

            {/* Bottom Editorial Headline, CTAs & Scroll Cue */}
            <div
              data-hero-copy
              className="absolute inset-x-0 bottom-0 z-40 flex flex-col gap-4 p-4 text-white sm:gap-5 sm:p-8 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:pb-10"
            >
              <div className="max-w-xl">
                <p className="text-[10px] font-semibold tracking-[0.24em] text-emerald-300/90 uppercase sm:text-[11px]">
                  Hills · Sea · Forest · Heritage
                </p>
                <p
                  className="mt-1.5 flex flex-wrap gap-x-[0.25em] gap-y-0.5 font-display leading-[1.08] font-bold tracking-[-0.025em] text-white sm:mt-2"
                  style={{ fontSize: 'clamp(1.2rem, 2.4vw, 2.35rem)' }}
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
                  <button
                    ref={exploreBtnRef}
                    type="button"
                    data-hero-cta
                    data-cursor="magnetic"
                    onClick={() => scrollToTarget(`#${SECTION_IDS.showcase}`)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-3.5 text-xs font-semibold text-ink transition hover:bg-canvas active:scale-95 sm:h-11 sm:gap-2 sm:px-5 sm:text-sm"
                  >
                    Explore Destinations
                    <ArrowDownRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.2} />
                  </button>
                  <button
                    ref={atlasBtnRef}
                    type="button"
                    data-hero-cta
                    data-cursor="magnetic"
                    onClick={() => scrollToTarget(`#${SECTION_IDS.atlas}`)}
                    className="glass-dark inline-flex h-9 items-center gap-1.5 rounded-full border border-white/20 px-3.5 text-xs font-semibold text-white transition hover:bg-ink active:scale-95 sm:h-11 sm:gap-2 sm:px-5 sm:text-sm"
                  >
                    <Map className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
                    Interactive Map
                  </button>
                </div>
              </div>

              {/* Bottom-right animated "Scroll to explore ↓" indicator (with right clearance for desktop Compass HUD) */}
              <button
                type="button"
                data-hero-cta
                data-hero-scroll-cue
                data-cursor="magnetic"
                onClick={() => scrollToTarget(`#${SECTION_IDS.showcase}`)}
                className="group hidden w-fit items-center gap-2.5 self-start rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-2 text-[11px] font-semibold tracking-[0.16em] text-white/80 uppercase backdrop-blur-md transition hover:border-white/30 hover:bg-white/[0.12] hover:text-white sm:inline-flex lg:mr-14 lg:self-end"
              >
                <span>Scroll to explore</span>
                <span
                  data-hero-scroll-arrow
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/12 text-emerald-300 will-change-transform"
                  aria-hidden="true"
                >
                  <ArrowDown className="h-3 w-3" strokeWidth={2.4} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

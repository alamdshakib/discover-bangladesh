import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Compass,
  Landmark,
  MapPin,
  Mountain,
  Plus,
  RotateCcw,
  Route,
  Sparkles,
  Trees,
  Waves,
  X,
} from 'lucide-react';
import { useScrollLock, useShowcase } from '@hooks';
import { gsap, MEDIA } from '@animations';
import { computeJourneyMetrics, getImageSrc, getSeasonShort, isBestRightNow } from '@utils';
import { LiveWeatherPill } from './ui/WeatherBadge.jsx';

const QUIZ_STEPS = [
  {
    key: 'duration',
    stepLabel: 'Step 01 of 03',
    title: 'How long is your escape?',
    subtitle: 'We match highway reach, train corridors, and expedition depth to your window.',
    options: [
      {
        value: 'weekend',
        label: 'Weekend (1–2 Days)',
        desc: 'Quick high-impact escapes within easy highway, rail, or short-hop reach.',
        badge: 'Fast Reach',
      },
      {
        value: 'short',
        label: 'Short Break (3–4 Days)',
        desc: 'Sweet-spot window for tea valleys, coastal drives, haors, or hill ridges.',
        badge: 'Most Popular',
      },
      {
        value: 'deep',
        label: 'Deep Explore (5+ Days)',
        desc: 'Far-flung highland treks, coral islands, and multi-stop delta journeys.',
        badge: 'Expedition',
      },
    ],
  },
  {
    key: 'vibe',
    stepLabel: 'Step 02 of 03',
    title: 'Which landscape calls to you?',
    subtitle: 'Choose a signature Bengal terrain or let us curate a cross-chapter trio.',
    options: [
      {
        value: 'hills',
        label: 'Misty Hills',
        desc: 'Cloud-kissed ridges, indigenous highland villages & canyon waterfalls.',
        icon: Mountain,
      },
      {
        value: 'sea',
        label: 'Endless Sea',
        desc: 'Golden Bay of Bengal shores, coral boulders & dual-horizon beaches.',
        icon: Waves,
      },
      {
        value: 'forest',
        label: 'Wild Forests & Haors',
        desc: 'Tidal mangroves, submerged swamp cathedrals, tea hills & wetlands.',
        icon: Trees,
      },
      {
        value: 'heritage',
        label: 'Living Heritage',
        desc: 'Ancient Buddhist viharas, Mughal citadels, mosques & Zamindar palaces.',
        icon: Landmark,
      },
      {
        value: 'surprise',
        label: 'Surprise Mix',
        desc: 'A curated contrast spanning three distinct chapters of Bangladesh.',
        icon: Sparkles,
      },
    ],
  },
  {
    key: 'pace',
    stepLabel: 'Step 03 of 03',
    title: 'What is your travel pace & style?',
    subtitle: 'Tailors trail intensity, transport rhythm, and destination atmosphere.',
    options: [
      {
        value: 'budget',
        label: 'Backpacker / Budget',
        desc: 'Trail-forward adventures, local boats, canyon treks & raw wilderness.',
        badge: 'Trail & Local',
      },
      {
        value: 'balanced',
        label: 'Balanced Comfort',
        desc: 'Iconic viewpoints, smooth intercity links & unhurried cultural stops.',
        badge: 'All-Rounder',
      },
      {
        value: 'luxury',
        label: 'Relaxed / Luxury',
        desc: 'Serene panoramas, direct flight or express access & tranquil estates.',
        badge: 'Unhurried',
      },
    ],
  },
];

const VIBE_TO_CATEGORY = {
  hills: 'Hills',
  sea: 'Sea',
  forest: 'Forest',
  heritage: 'Heritage',
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Scores all 48 destinations against `{ duration, vibe, pace }` and returns the Top 3
 * with differentiated match percentages (`88%`–`98%`) and a custom route tip.
 */
function recommendTopSpots(spots, answers) {
  const { duration = 'short', vibe = 'surprise', pace = 'balanced' } = answers;
  const targetCategory = VIBE_TO_CATEGORY[vibe] ?? null;

  const scored = spots.map((spot) => {
    const corpus = `${spot.name} ${spot.tagline} ${spot.description} ${spot.howToGo} ${(spot.highlights || []).join(' ')}`.toLowerCase();
    let score = 40;

    // 1. Landscape / Vibe alignment (up to +44 pts)
    if (targetCategory) {
      if (spot.category === targetCategory) {
        score += 44;
      } else {
        // Cross-landscape affinity
        if (vibe === 'hills' && /(hill|cliff|ridge|waterfall|canyon)/.test(corpus)) score += 16;
        if (vibe === 'sea' && /(island|coast|bay|beach|estuary)/.test(corpus)) score += 16;
        if (vibe === 'forest' && /(haor|wetland|mangrove|forest|tea|sanctuary|lake)/.test(corpus)) score += 16;
        if (vibe === 'heritage' && /(temple|mosque|palace|fort|monastery|ancient|ruins)/.test(corpus)) score += 16;
      }
    } else {
      // Surprise Mix rewards iconic multi-sensory appeal
      score += 34;
      if (spot.highlights?.length >= 3) score += 4;
    }

    // 2. Duration & reachability fit (up to +24 pts)
    const isRemote = /(trek|escort|thanchi|remote|offshore|cruiser|overnight boat|chander gari)/.test(corpus);
    const isQuickReach =
      spot.division === 'Dhaka' ||
      spot.division === 'Mymensingh' ||
      /(1 to 2 hours|day trip|express|airport|fly directly|short drive|narayanganj|gazipur|manikganj|tangail|cumilla|comilla|sitakunda)/.test(
        corpus
      );

    if (duration === 'weekend') {
      if (isQuickReach) score += 23;
      else if (!isRemote) score += 14;
      else score -= 10;
    } else if (duration === 'short') {
      if (!isRemote && !isQuickReach) score += 22;
      else score += 15;
    } else {
      // Deep Explore (5+ Days)
      if (isRemote) score += 24;
      else if (spot.division === 'Chattogram' || spot.division === 'Khulna' || spot.division === 'Sylhet') score += 17;
      else score += 9;
    }

    // 3. Pace & travel style fit (up to +20 pts)
    const isAdventure = /(trek|trail|canyon|waterfall|kayak|camp|boat|climb|wilderness|haor|coral)/.test(corpus);
    const isSerene = /(fly|airport|tea|palace|sunset|panoram|tranquil|serene|cruise|garden|estate|express)/.test(corpus);

    if (pace === 'budget') {
      score += isAdventure ? 19 : 11;
    } else if (pace === 'luxury') {
      score += isSerene ? 19 : 10;
      if (/(strenuous|steep trek|slippery)/.test(corpus)) score -= 8;
    } else {
      // Balanced Comfort
      score += !/(strenuous|multi-day trek)/.test(corpus) ? 18 : 11;
    }

    // 4. Real-world Bangladesh season bonus (+6 pts)
    if (isBestRightNow(spot)) {
      score += 6;
    }

    return { spot, rawScore: score };
  });

  scored.sort((a, b) => b.rawScore - a.rawScore);

  let chosen = [];
  if (vibe === 'surprise') {
    // Pick the highest-scoring spot from 3 distinct landscape chapters for a true Surprise Mix
    const usedCategories = new Set();
    for (const entry of scored) {
      if (!usedCategories.has(entry.spot.category)) {
        usedCategories.add(entry.spot.category);
        chosen.push(entry);
      }
      if (chosen.length === 3) break;
    }
  } else {
    chosen = scored.slice(0, 3);
  }

  const topRaw = chosen[0]?.rawScore || 100;
  const recommendations = chosen.map((entry, idx) => {
    const ratio = entry.rawScore / Math.max(topRaw, 1);
    const computed = Math.round(97 * ratio) - idx * 2;
    const matchPct = Math.max(87, Math.min(98, computed));
    return {
      spot: entry.spot,
      matchPct,
    };
  });

  return recommendations;
}

function buildRoutePlan(recommendations, answers) {
  const spots = recommendations.map((r) => r.spot);
  if (spots.length === 0) return [];
  const { totalKm } = computeJourneyMetrics(spots);

  if (answers.duration === 'weekend') {
    return [
      {
        day: 'Day 01',
        text: `Start early at ${spots[0].name} (${spots[0].district}) for golden-hour light and its signature viewpoints.`,
      },
      {
        day: 'Day 02',
        text: `Pair with ${spots[1]?.name ?? spots[0].name} on your return leg — or save ${spots[2]?.name ?? 'stop 3'} for your next weekend (~${totalKm} km across all 3 pins).`,
      },
    ];
  }

  if (answers.duration === 'short') {
    return [
      {
        day: 'Days 01–02',
        text: `Anchor your trip in ${spots[0].name} (${spots[0].division}) for unhurried sunrise and twilight exploration.`,
      },
      {
        day: 'Day 03',
        text: `Transit toward ${spots[1]?.name ?? spots[0].name} (${spots[1]?.district ?? ''}) for a mid-journey shift in scenery.`,
      },
      {
        day: 'Day 04',
        text: `Wrap up at ${spots[2]?.name ?? spots[0].name} before returning (~${totalKm} km total air-line span).`,
      },
    ];
  }

  return [
    {
      day: 'Days 01–02',
      text: `Open the expedition at ${spots[0].name} (${spots[0].district}) — take time for deeper trails and local waterways.`,
    },
    {
      day: 'Days 03–04',
      text: `Continue to ${spots[1]?.name ?? spots[0].name} (${spots[1]?.division ?? ''}) for full-day immersion.`,
    },
    {
      day: 'Days 05+',
      text: `Conclude at ${spots[2]?.name ?? spots[0].name}, linking a ${totalKm} km grand arc across Bangladesh.`,
    },
  ];
}

function TripFinderDialog({ onClose }) {
  const {
    spots,
    openSpot,
    isInJourney,
    toggleJourneySpot,
    addManyToJourney,
    setJourneyDrawerOpen,
  } = useShowcase();

  const [stepIndex, setStepIndex] = useState(0); // 0, 1, 2, or 3 (results)
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState({
    duration: null,
    vibe: null,
    pace: null,
  });

  const titleId = useId();
  const backdropRef = useRef(null);
  const panelRef = useRef(null);
  const stageRef = useRef(null);
  const closeBtnRef = useRef(null);
  const closingRef = useRef(false);
  const isInitialStageRef = useRef(true);

  useScrollLock(true);

  const recommendations = useMemo(() => {
    if (stepIndex < 3) return [];
    return recommendTopSpots(spots, answers);
  }, [spots, stepIndex, answers]);

  const routePlan = useMemo(() => buildRoutePlan(recommendations, answers), [recommendations, answers]);
  const allRecommendedInJourney =
    recommendations.length > 0 && recommendations.every(({ spot }) => isInJourney(spot.id));

  // Modal open entrance animation
  useLayoutEffect(() => {
    const reduce = window.matchMedia(MEDIA.reduceMotion).matches;
    if (reduce) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.fromTo(
        panelRef.current,
        { y: 24, scale: 0.96, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.42, ease: 'power3.out', clearProps: 'transform,opacity' }
      );
    });

    return () => ctx.revert();
  }, []);

  // Directional GSAP slide transition (`x: 32 -> 0, opacity: 0 -> 1`) between steps & results
  useLayoutEffect(() => {
    if (isInitialStageRef.current) {
      isInitialStageRef.current = false;
      return undefined;
    }
    const stage = stageRef.current;
    if (!stage || window.matchMedia(MEDIA.reduceMotion).matches) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        stage,
        { x: direction >= 0 ? 32 : -32, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.38, ease: 'power3.out', clearProps: 'transform,opacity' }
      );

      if (stepIndex === 3) {
        const cards = stage.querySelectorAll('[data-trip-result-card]');
        if (cards.length > 0) {
          gsap.fromTo(
            cards,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.45,
              stagger: 0.07,
              delay: 0.06,
              ease: 'power3.out',
              clearProps: 'transform,opacity',
            }
          );
        }
      }
    }, stageRef);

    return () => ctx.revert();
  }, [stepIndex, direction]);

  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;

    if (window.matchMedia(MEDIA.reduceMotion).matches) {
      onClose();
      return;
    }

    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(backdropRef.current, { opacity: 0, duration: 0.22, ease: 'power2.in' }, 0);
    tl.to(panelRef.current, { y: 16, scale: 0.97, opacity: 0, duration: 0.24, ease: 'power2.in' }, 0);
  }, [onClose]);

  // Escape & Tab focus trap (respecting higher z-index overlays like CommandPalette or SpotDetail)
  useEffect(() => {
    const prevFocus = document.activeElement;
    closeBtnRef.current?.focus({ preventScroll: true });

    const onKeyDown = (e) => {
      if (document.querySelector('[data-command-palette], [data-spot-detail], [data-cinema-lightbox]')) return;
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

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (prevFocus instanceof HTMLElement && prevFocus.isConnected) {
        prevFocus.focus({ preventScroll: true });
      }
    };
  }, [requestClose]);

  const handleSelectOption = (stepKey, optionValue) => {
    setAnswers((prev) => ({ ...prev, [stepKey]: optionValue }));
    setDirection(1);
    setStepIndex((prev) => Math.min(3, prev + 1));
  };

  const handleBack = () => {
    setDirection(-1);
    setStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleRetake = () => {
    setDirection(-1);
    setAnswers({ duration: null, vibe: null, pace: null });
    setStepIndex(0);
  };

  const handleAddAllToJourney = () => {
    const ids = recommendations.map(({ spot }) => spot.id);
    addManyToJourney(ids);
  };

  const handleViewJourneyDrawer = () => {
    onClose();
    window.setTimeout(() => setJourneyDrawerOpen(true), 60);
  };

  const currentStep = stepIndex < 3 ? QUIZ_STEPS[stepIndex] : null;

  return (
    <div data-trip-finder className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-5">
      <div
        ref={backdropRef}
        onClick={requestClose}
        aria-hidden="true"
        className="absolute inset-0 bg-ink/45 backdrop-blur-md dark:bg-black/72"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-lenis-prevent
        className="glass relative z-10 flex max-h-[92svh] w-full flex-col overflow-hidden rounded-t-4xl border border-white/80 bg-white/90 shadow-[0_40px_110px_-30px_rgba(15,23,42,0.55)] backdrop-blur-2xl sm:max-w-3xl sm:rounded-4xl dark:border-white/15 dark:bg-[#131C2E]/94 dark:shadow-[0_44px_120px_-28px_rgba(0,0,0,0.9)]"
      >
        {/* Top Modal Header & 3-Segment Progress Bar */}
        <div className="shrink-0 border-b border-line/80 px-5 pt-5 pb-4 sm:px-7 sm:pt-6 dark:border-white/10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {stepIndex > 0 && (
                <button
                  type="button"
                  data-trip-back
                  data-cursor="magnetic"
                  onClick={handleBack}
                  aria-label="Previous step"
                  className="inline-flex h-8 items-center gap-1 rounded-full border border-line bg-white px-3 text-xs font-semibold text-ink transition hover:border-haze active:scale-95 dark:border-white/15 dark:bg-white/[0.06] dark:text-slate-200"
                >
                  <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.2} />
                  <span>Back</span>
                </button>
              )}
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold tracking-[0.2em] text-mist uppercase">
                <Sparkles className="h-3.5 w-3.5 text-bd-green dark:text-emerald-400" strokeWidth={2.2} />
                {currentStep ? currentStep.stepLabel : 'Curated Matches · 48 Spots Scored'}
              </span>
            </div>

            <button
              ref={closeBtnRef}
              type="button"
              data-trip-close
              data-cursor="magnetic"
              onClick={requestClose}
              aria-label="Close Smart Trip Finder"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-white transition hover:bg-ink-soft active:scale-95 dark:bg-white dark:text-[#0B111E]"
            >
              <X className="h-4 w-4" strokeWidth={2.2} />
            </button>
          </div>

          {/* 3-Step Segmented Progress Track */}
          <div className="mt-3.5 grid grid-cols-3 gap-2" aria-hidden="true">
            {[0, 1, 2].map((idx) => {
              const active = stepIndex >= idx;
              return (
                <div key={idx} className="h-1.5 overflow-hidden rounded-full bg-line dark:bg-white/10">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      active ? 'w-full' : 'w-0'
                    }`}
                    style={{ backgroundColor: 'var(--chapter-accent, #10b981)' }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Scrollable Step / Results Stage */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7 sm:py-6" data-lenis-prevent>
          <div ref={stageRef} key={stepIndex} data-trip-stage={stepIndex} className="will-change-transform">
            {currentStep ? (
              <div>
                <h2
                  id={titleId}
                  className="font-display text-2xl leading-tight font-black tracking-[-0.03em] text-ink sm:text-3xl dark:text-slate-50"
                >
                  {currentStep.title}
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-soft sm:text-sm dark:text-slate-400">
                  {currentStep.subtitle}
                </p>

                <div
                  className={`mt-5 grid gap-3 ${
                    currentStep.options.length > 3 ? 'sm:grid-cols-2' : 'grid-cols-1'
                  }`}
                >
                  {currentStep.options.map((opt) => {
                    const Icon = opt.icon ?? Compass;
                    const selected = answers[currentStep.key] === opt.value;
                    const isSurprise = opt.value === 'surprise';

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        data-trip-option={`${currentStep.key}:${opt.value}`}
                        data-cursor="magnetic"
                        onClick={() => handleSelectOption(currentStep.key, opt.value)}
                        className={`group flex items-start justify-between gap-3.5 rounded-3xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] sm:p-5 ${
                          isSurprise ? 'sm:col-span-2' : ''
                        } ${
                          selected
                            ? 'border-emerald-500 bg-emerald-500/[0.08] shadow-sm dark:border-emerald-400/70 dark:bg-emerald-400/[0.12]'
                            : 'border-line bg-white/85 hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white/25 dark:hover:bg-white/[0.07]'
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-canvas text-ink transition-colors group-hover:bg-ink group-hover:text-white dark:bg-white/10 dark:text-emerald-300 dark:group-hover:bg-white dark:group-hover:text-[#0B111E]">
                            <Icon className="h-4 w-4" strokeWidth={2.1} aria-hidden="true" />
                          </span>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-display text-base font-bold tracking-tight text-ink sm:text-lg dark:text-slate-50">
                                {opt.label}
                              </span>
                              {opt.badge && (
                                <span className="rounded-full border border-line bg-canvas px-2 py-0.5 text-[10px] font-bold tracking-wider text-mist uppercase dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
                                  {opt.badge}
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-xs leading-relaxed text-ink-soft sm:text-[13px] dark:text-slate-400">
                              {opt.desc}
                            </p>
                          </div>
                        </div>

                        <ArrowRight
                          className="mt-1 h-4 w-4 shrink-0 text-mist transition-transform duration-200 group-hover:translate-x-1 group-hover:text-ink dark:group-hover:text-white"
                          strokeWidth={2.2}
                          aria-hidden="true"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* STEP 4: Smart Result Reveal — Top 3 Recommended Destinations */
              <div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2
                      id={titleId}
                      className="font-display text-2xl leading-tight font-black tracking-[-0.03em] text-ink sm:text-3xl dark:text-slate-50"
                    >
                      Your Top 3 Bangladesh Matches
                    </h2>
                    <p className="mt-1 text-xs text-ink-soft sm:text-sm dark:text-slate-400">
                      Ranked across all {spots.length} destinations for your window, terrain vibe, and pace.
                    </p>
                  </div>
                </div>

                {/* Top 3 Destination Cards */}
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {recommendations.map(({ spot, matchPct }, idx) => {
                    const saved = isInJourney(spot.id);
                    return (
                      <article
                        key={spot.id}
                        data-trip-result-card={spot.id}
                        className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-[#0E1626]"
                      >
                        <div className="relative h-36 w-full overflow-hidden bg-line sm:h-40">
                          <img
                            src={getImageSrc(spot.images.cover, 'card')}
                            alt={spot.name}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

                          {/* Match % Badge */}
                          <span
                            data-trip-match-badge
                            className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full border border-emerald-300/40 bg-emerald-500/90 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm backdrop-blur-sm tabular-nums"
                          >
                            <Sparkles className="h-3 w-3" strokeWidth={2.4} aria-hidden="true" />
                            {matchPct}% Match
                          </span>

                          {/* Individual Journey Bookmark Toggle */}
                          <button
                            type="button"
                            onClick={() => toggleJourneySpot(spot.id)}
                            aria-pressed={saved}
                            aria-label={saved ? `Remove ${spot.name} from Journey` : `Add ${spot.name} to Journey`}
                            className={`absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full border transition active:scale-95 ${
                              saved
                                ? 'border-emerald-400 bg-bd-green text-white'
                                : 'border-white/35 bg-black/45 text-white backdrop-blur-sm hover:bg-black/70'
                            }`}
                          >
                            {saved ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : <Plus className="h-3.5 w-3.5" strokeWidth={2.2} />}
                          </button>

                          <div className="absolute right-3 bottom-2.5 left-3 flex items-center justify-between gap-1 text-[11px] font-semibold text-white/90">
                            <span className="inline-flex items-center gap-1 truncate">
                              <MapPin className="h-3 w-3 shrink-0 text-emerald-300" strokeWidth={2.2} />
                              <span className="truncate">{spot.district}</span>
                            </span>
                            <span className="shrink-0 rounded-full bg-white/20 px-2 py-0.5 text-[10px] backdrop-blur-xs">
                              #{idx + 1} · {spot.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                          <h3 className="font-display text-base leading-snug font-bold text-ink dark:text-slate-50">
                            {spot.name}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-soft dark:text-slate-400">
                            {spot.tagline}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 rounded-full border border-line bg-canvas px-2 py-0.5 text-[10px] font-semibold text-ink-soft tabular-nums dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">
                              <CalendarDays className="h-2.5 w-2.5 text-mist" strokeWidth={2} />
                              {getSeasonShort(spot)}
                            </span>
                            <LiveWeatherPill spot={spot} variant="expo" className="!border-emerald-500/25 !bg-emerald-500/15 !text-ink dark:!text-emerald-200" />
                          </div>

                          <button
                            type="button"
                            data-trip-open-guide={spot.id}
                            data-cursor="magnetic"
                            onClick={() => openSpot(spot.id)}
                            className="mt-auto pt-3.5"
                          >
                            <span className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-ink-soft active:scale-95 dark:bg-white dark:text-[#0B111E] dark:hover:bg-slate-200">
                              <span>Open Guide</span>
                              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
                            </span>
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* Suggested Mini Day-by-Day Route Tip */}
                <div className="mt-4 rounded-3xl border border-line bg-canvas/85 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                  <div className="flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-ink uppercase dark:text-emerald-300">
                    <Route className="h-3.5 w-3.5 text-bd-green dark:text-emerald-400" strokeWidth={2.2} />
                    <span>Suggested Day-by-Day Route Tip</span>
                  </div>
                  <div className="mt-2.5 grid gap-2 sm:grid-cols-3">
                    {routePlan.map((leg) => (
                      <div
                        key={leg.day}
                        className="rounded-2xl border border-line/80 bg-white/90 p-3 dark:border-white/10 dark:bg-[#131C2E]"
                      >
                        <p className="font-mono text-[10px] font-bold tracking-[0.18em] text-bd-green uppercase dark:text-emerald-400">
                          {leg.day}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-ink-soft dark:text-slate-300">{leg.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions: Add All to Journey + Retake Quiz */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    data-trip-retake
                    data-cursor="magnetic"
                    onClick={handleRetake}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-xs font-semibold text-ink transition hover:border-haze active:scale-95 sm:h-11 sm:px-5 sm:text-sm dark:border-white/15 dark:bg-white/[0.06] dark:text-slate-100 dark:hover:border-white/30"
                  >
                    <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.2} />
                    <span>Retake Quiz</span>
                  </button>

                  <div className="flex flex-wrap items-center gap-2">
                    {allRecommendedInJourney ? (
                      <button
                        type="button"
                        data-trip-view-journey
                        data-cursor="magnetic"
                        onClick={handleViewJourneyDrawer}
                        className="inline-flex h-10 items-center gap-2 rounded-full bg-bd-green px-5 text-xs font-semibold text-white shadow-md transition hover:opacity-95 active:scale-95 sm:h-11 sm:text-sm dark:bg-emerald-500 dark:text-[#071314]"
                      >
                        <Check className="h-4 w-4" strokeWidth={2.5} />
                        <span>Added · Open My Journey →</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        data-trip-add-all
                        data-cursor="magnetic"
                        onClick={handleAddAllToJourney}
                        className="inline-flex h-10 items-center gap-2 rounded-full bg-bd-green px-5 text-xs font-semibold text-white shadow-[0_12px_28px_-10px_rgba(0,106,78,0.65)] transition hover:opacity-95 active:scale-95 sm:h-11 sm:text-sm dark:bg-emerald-500 dark:text-[#071314]"
                      >
                        <Plus className="h-4 w-4" strokeWidth={2.4} />
                        <span>Add All to Journey</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 3-Step "Smart Trip Finder" Quiz Modal (`z-[80]`).
 */
export function TripFinderModal() {
  const { tripFinderOpen, closeTripFinder } = useShowcase();
  if (!tripFinderOpen) return null;
  return createPortal(<TripFinderDialog onClose={closeTripFinder} />, document.body);
}

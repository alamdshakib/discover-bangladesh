import { useCallback, useEffect, useMemo, useState } from 'react';
import { SECTION_IDS, spotsData } from '@data';
import { scrollToTarget } from '@animations';
import { computeJourneyMetrics, resolveTripSlug } from '@utils';
import { ShowcaseContext } from './showcaseContext.js';

const STORAGE_KEY = 'db_my_journey';
const spotsById = new Map(spotsData.map((spot) => [spot.id, spot]));

function dedupeValidIds(rawIds) {
  const seen = new Set();
  const next = [];
  rawIds.forEach((raw) => {
    const resolved = resolveTripSlug(raw, spotsData);
    if (resolved && spotsById.has(resolved) && !seen.has(resolved)) {
      seen.add(resolved);
      next.push(resolved);
    }
  });
  return next;
}

function readInitialJourneyIds() {
  if (typeof window === 'undefined') return [];
  try {
    const params = new URLSearchParams(window.location.search);
    const tripParam = params.get('trip');
    if (tripParam) {
      const fromUrl = dedupeValidIds(tripParam.split(','));
      if (fromUrl.length > 0) return fromUrl;
    }
  } catch {
    // Ignore malformed query strings
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return dedupeValidIds(parsed);
    }
  } catch {
    // Ignore localStorage access restrictions
  }
  return [];
}

export function ShowcaseProvider({ children }) {
  const [expoMode, setExpoMode] = useState(false);
  const [activeSpotId, setActiveSpotId] = useState(null);
  const [lightboxState, setLightboxState] = useState(null);

  const [journeyIds, setJourneyIds] = useState(() => readInitialJourneyIds());
  const [routeMode, setRouteMode] = useState(() => readInitialJourneyIds().length >= 2);
  const [journeyDrawerOpen, setJourneyDrawerOpen] = useState(false);

  // Sync journey to localStorage (`db_my_journey`) & shareable URL `?trip=...`
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(journeyIds));
    } catch {
      // Ignore storage quota errors
    }

    try {
      const url = new URL(window.location.href);
      if (journeyIds.length > 0) url.searchParams.set('trip', journeyIds.join(','));
      else url.searchParams.delete('trip');
      const nextRelative = `${url.pathname}${url.search}${url.hash}`;
      const curRelative = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (nextRelative !== curRelative) {
        window.history.replaceState(null, '', nextRelative);
      }
    } catch {
      // Ignore history API restrictions
    }
  }, [journeyIds]);

  const toggleExpo = useCallback(() => setExpoMode((v) => !v), []);
  const openSpot = useCallback((id) => {
    if (spotsById.has(id)) setActiveSpotId(id);
  }, []);
  const closeSpot = useCallback(() => setActiveSpotId(null), []);

  const openLightbox = useCallback((spotId, index = 0) => {
    if (!spotsById.has(spotId)) return;
    setLightboxState({ spotId, index });
  }, []);
  const closeLightbox = useCallback(() => setLightboxState(null), []);

  const toggleJourneySpot = useCallback((id) => {
    if (!spotsById.has(id)) return;
    setJourneyIds((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((item) => item !== id);
        if (next.length < 2) setRouteMode(false);
        return next;
      }
      return [...prev, id];
    });
  }, []);

  const moveJourneySpot = useCallback((index, direction) => {
    setJourneyIds((prev) => {
      const target = index + direction;
      if (index < 0 || index >= prev.length || target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(index, 1);
      copy.splice(target, 0, moved);
      return copy;
    });
  }, []);

  const removeJourneySpot = useCallback((id) => {
    setJourneyIds((prev) => {
      const next = prev.filter((item) => item !== id);
      if (next.length < 2) setRouteMode(false);
      return next;
    });
  }, []);

  const clearJourney = useCallback(() => {
    setJourneyIds([]);
    setRouteMode(false);
  }, []);

  const visualizeJourneyOnMap = useCallback(() => {
    setJourneyDrawerOpen(false);
    setRouteMode(true);
    window.setTimeout(() => {
      scrollToTarget(`#${SECTION_IDS.atlas}`, { offset: -96 });
    }, 80);
  }, []);

  const value = useMemo(() => {
    const activeSpot = activeSpotId ? spotsById.get(activeSpotId) ?? null : null;
    const lightboxSpot = lightboxState ? spotsById.get(lightboxState.spotId) ?? null : null;
    const lightbox = lightboxSpot ? { spot: lightboxSpot, index: lightboxState.index ?? 0 } : null;

    const journeySpots = journeyIds.map((id) => spotsById.get(id)).filter(Boolean);
    const journeySet = new Set(journeyIds);
    const journeyMetrics = computeJourneyMetrics(journeySpots);

    return {
      spots: spotsData,
      expoMode,
      setExpoMode,
      toggleExpo,
      activeSpot,
      openSpot,
      closeSpot,
      lightbox,
      openLightbox,
      closeLightbox,
      journeyIds,
      journeySpots,
      journeyMetrics,
      isInJourney: (id) => journeySet.has(id),
      toggleJourneySpot,
      moveJourneySpot,
      removeJourneySpot,
      clearJourney,
      routeMode,
      setRouteMode,
      journeyDrawerOpen,
      setJourneyDrawerOpen,
      visualizeJourneyOnMap,
    };
  }, [
    expoMode,
    toggleExpo,
    activeSpotId,
    openSpot,
    closeSpot,
    lightboxState,
    openLightbox,
    closeLightbox,
    journeyIds,
    toggleJourneySpot,
    moveJourneySpot,
    removeJourneySpot,
    clearJourney,
    routeMode,
    journeyDrawerOpen,
    visualizeJourneyOnMap,
  ]);

  return <ShowcaseContext.Provider value={value}>{children}</ShowcaseContext.Provider>;
}

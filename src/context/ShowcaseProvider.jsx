import { useCallback, useMemo, useState } from 'react';
import { spotsData } from '@data';
import { ShowcaseContext } from './showcaseContext.js';

const spotsById = new Map(spotsData.map((spot) => [spot.id, spot]));

export function ShowcaseProvider({ children }) {
  const [expoMode, setExpoMode] = useState(false);
  const [activeSpotId, setActiveSpotId] = useState(null);
  const [lightboxState, setLightboxState] = useState(null);

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

  const value = useMemo(() => {
    const activeSpot = activeSpotId ? spotsById.get(activeSpotId) ?? null : null;
    const lightboxSpot = lightboxState ? spotsById.get(lightboxState.spotId) ?? null : null;
    const lightbox = lightboxSpot ? { spot: lightboxSpot, index: lightboxState.index ?? 0 } : null;

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
    };
  }, [expoMode, toggleExpo, activeSpotId, openSpot, closeSpot, lightboxState, openLightbox, closeLightbox]);

  return <ShowcaseContext.Provider value={value}>{children}</ShowcaseContext.Provider>;
}

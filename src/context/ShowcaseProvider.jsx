import { useCallback, useMemo, useState } from 'react';
import { spotsData } from '@data';
import { ShowcaseContext } from './showcaseContext.js';

const spotsById = new Map(spotsData.map((spot) => [spot.id, spot]));

export function ShowcaseProvider({ children }) {
  const [expoMode, setExpoMode] = useState(false);
  const [activeSpotId, setActiveSpotId] = useState(null);

  const toggleExpo = useCallback(() => setExpoMode((v) => !v), []);
  const openSpot = useCallback((id) => {
    if (spotsById.has(id)) setActiveSpotId(id);
  }, []);
  const closeSpot = useCallback(() => setActiveSpotId(null), []);

  const value = useMemo(
    () => ({
      spots: spotsData,
      expoMode,
      setExpoMode,
      toggleExpo,
      activeSpot: activeSpotId ? spotsById.get(activeSpotId) : null,
      openSpot,
      closeSpot,
    }),
    [expoMode, toggleExpo, activeSpotId, openSpot, closeSpot]
  );

  return <ShowcaseContext.Provider value={value}>{children}</ShowcaseContext.Provider>;
}

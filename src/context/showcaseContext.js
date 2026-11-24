import { createContext } from 'react';

/**
 * Global showcase state: Expo Mode toggle and the currently opened spot.
 * Provided by <ShowcaseProvider>, consumed via useShowcase().
 */
export const ShowcaseContext = createContext(null);

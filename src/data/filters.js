import { BANGLADESH_DIVISIONS, SEASON_TAGS } from './spotsData.js';

/**
 * Expo Mode filter groups.
 * Tags inside a group are OR-ed; groups are AND-ed together.
 */
export const FILTER_GROUPS = [
  { key: 'division', label: 'Division', field: 'division', options: BANGLADESH_DIVISIONS },
  { key: 'season', label: 'Season', field: 'seasons', options: SEASON_TAGS },
];

export const HOME_STATS = [
  { key: 'divisions', value: 8, label: 'Divisions', note: 'Every administrative division' },
  { key: 'districts', value: 64, label: 'Districts', note: 'One connected delta' },
  { key: 'spots', value: null, label: 'Curated Spots', note: 'Verified photo stories' },
  { key: 'landscapes', value: null, label: 'Landscapes', note: 'Hills · Sea · Forest · Heritage' },
];

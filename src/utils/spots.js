/**
 * Pure helpers for working with spotsData. No React, no DOM — easy to unit test.
 */

/** Wikimedia thumbnail widths verified to load (HTTP 200) for every spot image. */
export const IMAGE_WIDTHS = {
  thumb: 330,
  card: 960,
  full: 1280,
};

/**
 * Returns a sized variant of a verified Wikimedia thumbnail URL.
 * Falls back to the original URL for non-Wikimedia sources.
 */
export function getImageSrc(url, size = 'card') {
  const width = IMAGE_WIDTHS[size] ?? IMAGE_WIDTHS.card;
  if (typeof url !== 'string' || !url.includes('/1280px-')) return url;
  return url.replace('/1280px-', `/${width}px-`);
}

/** All four images of a spot, cover first. */
export function getSpotImages(spot) {
  return [spot.images.cover, ...spot.images.gallery];
}

/** "November to March (cool breeze…)" → "November to March" */
export function getSeasonWindow(spot) {
  return spot.bestTime.split(' (')[0].trim();
}

const MONTH_NAMES = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];

const MONTH_NAME_MAP = Object.fromEntries(MONTH_NAMES.map((m, idx) => [m, idx]));

const MONTH_RANGE_RE =
  /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+to\s+(January|February|March|April|May|June|July|August|September|October|November|December)\b/i;

const MONTH_RANGES_GLOBAL_RE =
  /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+to\s+(January|February|March|April|May|June|July|August|September|October|November|December)\b/gi;

/** Current 0-11 month index in Bangladesh Standard Time (Asia/Dhaka). */
export function getBangladeshMonth(date = new Date()) {
  try {
    const label = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Dhaka', month: 'long' }).format(date);
    const idx = MONTH_NAME_MAP[label.toLowerCase()];
    if (typeof idx === 'number') return idx;
  } catch {
    // Fallback to local clock month when Intl timezone data is unavailable
  }
  return date.getMonth();
}

/** True when the current Bangladesh month falls within any recommended visiting window of `spot`. */
export function isBestRightNow(spot, date = new Date()) {
  const month = getBangladeshMonth(date);
  const text = spot?.bestTime ?? '';
  const matches = [...text.matchAll(MONTH_RANGES_GLOBAL_RE)];

  if (matches.length === 0) {
    return Boolean(spot?.seasons?.includes('Year-Round'));
  }

  return matches.some((m) => {
    const start = MONTH_NAME_MAP[m[1].toLowerCase()];
    const end = MONTH_NAME_MAP[m[2].toLowerCase()];
    if (typeof start !== 'number' || typeof end !== 'number') return false;
    return start <= end ? month >= start && month <= end : month >= start || month <= end;
  });
}

export const SEASON_FILTER_OPTIONS = [
  { key: 'all', label: 'All (24)' },
  { key: 'best-now', label: 'Best Right Now' },
  { key: 'winter', label: 'Winter (Nov–Feb)' },
  { key: 'monsoon', label: 'Monsoon (Jun–Sep)' },
  { key: 'year-round', label: 'Year-Round' },
];

/** Filter spots by the interactive Season & Vibe bar selection. */
export function filterSpotsBySeasonVibe(spots, filterKey, date = new Date()) {
  switch (filterKey) {
    case 'best-now':
      return spots.filter((spot) => isBestRightNow(spot, date));
    case 'winter':
      return spots.filter((spot) => spot.seasons?.includes('Winter'));
    case 'monsoon':
      return spots.filter((spot) => spot.seasons?.includes('Monsoon'));
    case 'year-round':
      return spots.filter((spot) => spot.seasons?.includes('Year-Round'));
    case 'all':
    default:
      return spots;
  }
}

/** Compact pill label for card headers ("Nov – Mar", "Jul – Sep", "Year-round"). */
export function getSeasonShort(spot) {
  if (spot.seasons?.includes('Year-Round') && spot.bestTime.includes(';')) {
    return 'Year-round';
  }
  const match = spot.bestTime.match(MONTH_RANGE_RE);
  if (match) {
    return `${match[1].slice(0, 3)} – ${match[2].slice(0, 3)}`;
  }
  return 'Year-round';
}

/** The parenthetical reason from bestTime, if present. */
export function getSeasonReason(spot) {
  const match = spot.bestTime.match(/\((.+)\)\s*$/);
  return match ? match[1] : '';
}

/** Wikimedia Commons file page for a thumbnail URL (used for photo attribution). */
export function getCommonsPage(url) {
  const match = typeof url === 'string' ? url.match(/\/commons\/thumb\/[^/]+\/[^/]+\/([^/]+)\//) : null;
  return match ? `https://commons.wikimedia.org/wiki/File:${match[1]}` : null;
}

export function getMapsUrl({ lat, lng }) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

export function formatCoordinates({ lat, lng }) {
  const ns = lat >= 0 ? 'N' : 'S';
  const ew = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${ns}, ${Math.abs(lng).toFixed(4)}° ${ew}`;
}

export function groupByCategory(spots, categories) {
  const groups = Object.fromEntries(categories.map((c) => [c, []]));
  spots.forEach((spot) => {
    if (groups[spot.category]) groups[spot.category].push(spot);
  });
  return groups;
}

export function countByCategory(spots) {
  return spots.reduce((acc, spot) => {
    acc[spot.category] = (acc[spot.category] || 0) + 1;
    return acc;
  }, {});
}

/**
 * Multi-tag filtering. `active` is a map of groupKey → Set of tags.
 * Tags inside a group are OR-ed, groups are AND-ed.
 */
export function filterSpots(spots, groups, active) {
  return spots.filter((spot) =>
    groups.every((group) => {
      const selected = active[group.key];
      if (!selected || selected.size === 0) return true;
      const value = spot[group.field];
      const values = Array.isArray(value) ? value : [value];
      return values.some((v) => selected.has(v));
    })
  );
}

const normalize = (text) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, '');

/** Ranked instant search across name, district, division, category, and tagline. */
export function searchSpots(spots, query, limit = 6) {
  const q = normalize(query.trim());
  if (!q) return [];

  return spots
    .map((spot) => {
      const name = normalize(spot.name);
      let score = 0;
      if (name.startsWith(q)) score += 100;
      else if (name.includes(q)) score += 60;
      if (normalize(spot.district).includes(q)) score += 30;
      if (normalize(spot.division).includes(q)) score += 25;
      if (normalize(spot.category).includes(q)) score += 20;
      if (normalize(spot.tagline).includes(q)) score += 10;
      return { spot, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.spot);
}

/** Bento rhythm for the Expo matrix tile at `index` within the current filtered list. */
export function getExpoTileClass(index) {
  const step = index % 9;
  if (step === 0) return 'col-span-2 row-span-2';
  if (step === 5) return 'row-span-2';
  if (step === 7) return 'col-span-2';
  return '';
}

/**
 * Bento column spans (out of 12) for an editorial chapter grid.
 * Rows cycle through a rhythm; an incomplete final row is stretched to fill 12 columns.
 */
const BENTO_ROWS = [
  [7, 5],
  [4, 4, 4],
  [5, 7],
  [6, 6],
];

export function getBentoSpans(count) {
  const spans = [];
  let row = 0;
  while (spans.length < count) {
    const pattern = BENTO_ROWS[row % BENTO_ROWS.length];
    const remaining = count - spans.length;
    if (remaining >= pattern.length) {
      spans.push(...pattern);
    } else {
      const even = Math.floor(12 / remaining);
      for (let i = 0; i < remaining; i++) spans.push(even);
    }
    row++;
  }
  return spans;
}

const EARTH_RADIUS_KM = 6371;
const toRad = (deg) => (deg * Math.PI) / 180;

/** Spherical Haversine distance in whole kilometers between two `{ lat, lng }` coordinates. */
export function haversineKm(a, b) {
  if (!a || !b) return 0;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;
  return Math.round(2 * EARTH_RADIUS_KM * Math.atan2(Math.sqrt(h), Math.sqrt(Math.max(0, 1 - h))));
}

/** Computes consecutive leg distances and total Haversine distance across ordered journey spots. */
export function computeJourneyMetrics(journeySpots) {
  const legDistances = [];
  let totalKm = 0;
  for (let i = 0; i < journeySpots.length - 1; i += 1) {
    const legKm = haversineKm(journeySpots[i].coordinates, journeySpots[i + 1].coordinates);
    legDistances.push(legKm);
    totalKm += legKm;
  }
  return { legDistances, totalKm };
}

/** Resolves an exact spot ID or short slug alias (e.g. `sajek` -> `sajek-valley`) from `?trip=` URLs. */
export function resolveTripSlug(token, spots) {
  const clean = String(token || '')
    .trim()
    .toLowerCase();
  if (!clean) return null;
  const exact = spots.find((s) => s.id === clean);
  if (exact) return exact.id;
  const prefixMatches = spots.filter((s) => s.id.startsWith(`${clean}-`) || s.id.startsWith(clean));
  if (prefixMatches.length >= 1) return prefixMatches[0].id;
  return null;
}

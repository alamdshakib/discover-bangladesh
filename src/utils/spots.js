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

/** "November to March" → "Nov – Mar" (compact pill label). */
export function getSeasonShort(spot) {
  const window = getSeasonWindow(spot);
  const parts = window.split(/\s+to\s+/i);
  if (parts.length !== 2) return window;
  return parts.map((p) => p.trim().slice(0, 3)).join(' – ');
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

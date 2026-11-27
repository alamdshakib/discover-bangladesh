import { useEffect, useState, useSyncExternalStore } from 'react';
import { spotsData } from '@data';
import { getBangladeshMonth, getCoordCacheKey, getSpotLatLng } from '@utils';

const CACHE_TTL_MS = 15 * 60 * 1000;
const FALLBACK_TTL_MS = 2 * 60 * 1000;
const FETCH_TIMEOUT_MS = 8000;

const weatherCache = new Map(); // coordKey -> { weather, expiresAt }
const inFlight = new Map(); // key -> Promise<void>
const listeners = new Set();
let batchExpiresAt = 0;
let batchInFlight = null;

function notifyWeatherListeners() {
  listeners.forEach((listener) => listener());
}

function subscribeWeather(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function mapWmoWeather(code, isDay = 1) {
  if (code === 0) return { label: 'Clear', icon: isDay ? 'sun' : 'moon' };
  if (code === 1) return { label: 'Mostly Clear', icon: isDay ? 'sun' : 'moon' };
  if (code === 2) return { label: 'Partly Cloudy', icon: 'cloud-sun' };
  if (code === 3) return { label: 'Overcast', icon: 'cloud' };
  if (code === 45 || code === 48) return { label: 'Misty', icon: 'fog' };
  if (code === 51 || code === 53 || code === 55 || code === 61 || code === 80) {
    return { label: 'Light Rain', icon: 'rain' };
  }
  if (code === 63 || code === 65 || code === 81 || code === 82) {
    return { label: 'Rain', icon: 'rain' };
  }
  if (code >= 95) return { label: 'Thunderstorm', icon: 'storm' };
  return { label: 'Showers', icon: 'cloud-sun' };
}

function getSeasonalFallbackWeather(lat) {
  const month = getBangladeshMonth();
  const isHillCool = lat > 23.0;
  let temperature = 26;
  let windspeed = 9;
  let label = 'Clear';
  let icon = 'sun';

  if (month === 11 || month === 0 || month === 1) {
    temperature = isHillCool ? 20 : 23;
    windspeed = 7;
    label = isHillCool ? 'Misty' : 'Clear';
    icon = isHillCool ? 'cloud-sun' : 'sun';
  } else if (month >= 5 && month <= 8) {
    temperature = 29;
    windspeed = 14;
    label = 'Showers';
    icon = 'rain';
  } else if (month >= 9 && month <= 10) {
    temperature = isHillCool ? 22 : 25;
    windspeed = 8;
    label = 'Mostly Clear';
    icon = 'cloud-sun';
  }

  return { temperature, windspeed, label, icon, isFallback: true };
}

function parseCurrentWeatherNode(node) {
  const cw = node?.current_weather;
  if (!cw || typeof cw.temperature !== 'number') return null;
  const mapped = mapWmoWeather(cw.weathercode, cw.is_day);
  return {
    temperature: Math.round(cw.temperature),
    windspeed: Math.round(cw.windspeed ?? 0),
    weathercode: cw.weathercode ?? 0,
    label: mapped.label,
    icon: mapped.icon,
    isFallback: false,
  };
}

function getFreshCached(key) {
  if (!key) return null;
  const entry = weatherCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    weatherCache.delete(key);
    return null;
  }
  return entry.weather;
}

/**
 * Batch-fetches current live weather for ALL 48 spots in a single comma-separated Open-Meteo call,
 * populating the shared 15-minute in-memory cache with zero 429 rate-limit pressure.
 */
export function prefetchAllSpotsWeather() {
  if (typeof window === 'undefined') return Promise.resolve();
  if (Date.now() < batchExpiresAt && weatherCache.size > 0) return Promise.resolve();
  if (batchInFlight) return batchInFlight;

  const uniqueEntries = [];
  const seenKeys = new Set();

  spotsData.forEach((spot) => {
    const coords = getSpotLatLng(spot);
    if (!coords) return;
    const key = getCoordCacheKey(coords);
    if (!key || seenKeys.has(key)) return;
    seenKeys.add(key);
    uniqueEntries.push({ key, lat: coords.lat, lng: coords.lng });
  });

  if (uniqueEntries.length === 0) return Promise.resolve();

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller ? window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS) : null;

  const lats = uniqueEntries.map((e) => e.lat.toFixed(4)).join(',');
  const lngs = uniqueEntries.map((e) => e.lng.toFixed(4)).join(',');
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lngs}&current_weather=true`;

  batchInFlight = fetch(url, controller ? { signal: controller.signal } : undefined)
    .then((res) => {
      if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
      return res.json();
    })
    .then((payload) => {
      const nodes = Array.isArray(payload) ? payload : [payload];
      const expiresAt = Date.now() + CACHE_TTL_MS;

      uniqueEntries.forEach((entry, index) => {
        const parsed = parseCurrentWeatherNode(nodes[index]);
        const weather = parsed ?? getSeasonalFallbackWeather(entry.lat);
        weatherCache.set(entry.key, {
          weather,
          expiresAt: parsed ? expiresAt : Date.now() + FALLBACK_TTL_MS,
        });
      });

      batchExpiresAt = expiresAt;
      notifyWeatherListeners();
    })
    .catch(() => {
      const expiresAt = Date.now() + FALLBACK_TTL_MS;
      uniqueEntries.forEach((entry) => {
        if (!getFreshCached(entry.key)) {
          weatherCache.set(entry.key, {
            weather: getSeasonalFallbackWeather(entry.lat),
            expiresAt,
          });
        }
      });
      batchExpiresAt = expiresAt;
      notifyWeatherListeners();
    })
    .finally(() => {
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      batchInFlight = null;
    });

  return batchInFlight;
}

function fetchSingleCoordWeather(lat, lng, key) {
  const existing = inFlight.get(key);
  if (existing) return existing;

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller ? window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS) : null;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(
    4
  )}&current_weather=true`;

  const promise = fetch(url, controller ? { signal: controller.signal } : undefined)
    .then((res) => {
      if (!res.ok) throw new Error('Open-Meteo unavailable');
      return res.json();
    })
    .then((data) => {
      const parsed = parseCurrentWeatherNode(Array.isArray(data) ? data[0] : data);
      if (!parsed) throw new Error('Malformed Open-Meteo payload');
      weatherCache.set(key, { weather: parsed, expiresAt: Date.now() + CACHE_TTL_MS });
      notifyWeatherListeners();
    })
    .catch(() => {
      weatherCache.set(key, {
        weather: getSeasonalFallbackWeather(lat),
        expiresAt: Date.now() + FALLBACK_TTL_MS,
      });
      notifyWeatherListeners();
    })
    .finally(() => {
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      inFlight.delete(key);
    });

  inFlight.set(key, promise);
  return promise;
}

function formatDhakaTime() {
  try {
    const formatted = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Dhaka',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date());
    return `${formatted} BST`;
  } catch {
    return 'BST';
  }
}

/**
 * Reads live current weather from the shared 48-spot batched Open-Meteo cache (15-min TTL).
 * Accepts a full `spot` object, `{ lat, lng }`, `[lng, lat]`, or `(lat, lng)` arguments.
 */
export function useLiveWeather(spotOrCoords, maybeLng) {
  const coords = getSpotLatLng(spotOrCoords, maybeLng);
  const coordKey = coords ? `${coords.lat.toFixed(3)},${coords.lng.toFixed(3)}` : null;

  const weather = useSyncExternalStore(
    subscribeWeather,
    () => getFreshCached(coordKey),
    () => null
  );

  useEffect(() => {
    if (!coordKey || !coords) return;
    if (getFreshCached(coordKey)) return;

    // Warm all 48 spots in one batched request first; fall back to single fetch only for custom coordinates
    prefetchAllSpotsWeather().then(() => {
      if (!getFreshCached(coordKey)) {
        fetchSingleCoordWeather(coords.lat, coords.lng, coordKey);
      }
    });
  }, [coordKey, coords]);

  const loading = Boolean(coordKey && !weather);
  return { weather, loading };
}

/** Live formatted Bangladesh Standard Time (`Asia/Dhaka`), refreshed every 30s. */
export function useBangladeshTime() {
  const [time, setTime] = useState(() => formatDhakaTime());

  useEffect(() => {
    const id = window.setInterval(() => setTime(formatDhakaTime()), 30000);
    return () => window.clearInterval(id);
  }, []);

  return time;
}

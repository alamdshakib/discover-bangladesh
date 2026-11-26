import { useEffect, useState } from 'react';
import { getBangladeshMonth } from '@utils';

const CACHE_TTL_MS = 15 * 60 * 1000;
const FETCH_TIMEOUT_MS = 6000;

const weatherCache = new Map(); // key -> { weather, expiresAt }
const inFlight = new Map(); // key -> Promise<object>

function mapWmoWeather(code, isDay = 1) {
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

function getFreshCached(key) {
  const entry = weatherCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    weatherCache.delete(key);
    return null;
  }
  return entry.weather;
}

function fetchSpotWeather(lat, lng, key) {
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
      const cw = data?.current_weather;
      if (!cw || typeof cw.temperature !== 'number') {
        throw new Error('Malformed Open-Meteo payload');
      }
      const mapped = mapWmoWeather(cw.weathercode, cw.is_day);
      const weather = {
        temperature: Math.round(cw.temperature),
        windspeed: Math.round(cw.windspeed ?? 0),
        label: mapped.label,
        icon: mapped.icon,
        isFallback: false,
      };
      weatherCache.set(key, { weather, expiresAt: Date.now() + CACHE_TTL_MS });
      return weather;
    })
    .catch(() => {
      const fallback = getSeasonalFallbackWeather(lat);
      weatherCache.set(key, { weather: fallback, expiresAt: Date.now() + 2 * 60 * 1000 });
      return fallback;
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
 * Fetches live current weather from the keyless Open-Meteo API for `coordinates`,
 * cached in-memory for 15 minutes with graceful seasonal offline fallback.
 */
export function useLiveWeather(coordinates) {
  const lat = coordinates?.lat;
  const lng = coordinates?.lng;
  const hasCoords = typeof lat === 'number' && typeof lng === 'number';
  const coordKey = hasCoords ? `${lat.toFixed(3)},${lng.toFixed(3)}` : null;

  const cachedSync = coordKey ? getFreshCached(coordKey) : null;
  const [asyncResult, setAsyncResult] = useState(null);

  useEffect(() => {
    if (!coordKey || getFreshCached(coordKey)) return undefined;
    let cancelled = false;
    fetchSpotWeather(lat, lng, coordKey).then((weather) => {
      if (!cancelled) setAsyncResult({ key: coordKey, weather });
    });
    return () => {
      cancelled = true;
    };
  }, [coordKey, lat, lng]);

  const weather = cachedSync ?? (asyncResult?.key === coordKey ? asyncResult.weather : null);
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

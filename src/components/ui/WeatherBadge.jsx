import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Moon,
  Sun,
} from 'lucide-react';
import { useLiveWeather } from '@hooks';

export function WeatherConditionIcon({ icon, className = 'h-3.5 w-3.5' }) {
  switch (icon) {
    case 'sun':
      return <Sun className={className} strokeWidth={2.2} aria-hidden="true" />;
    case 'moon':
      return <Moon className={className} strokeWidth={2.2} aria-hidden="true" />;
    case 'cloud':
      return <Cloud className={className} strokeWidth={2.2} aria-hidden="true" />;
    case 'fog':
      return <CloudFog className={className} strokeWidth={2.2} aria-hidden="true" />;
    case 'rain':
      return <CloudRain className={className} strokeWidth={2.2} aria-hidden="true" />;
    case 'storm':
      return <CloudLightning className={className} strokeWidth={2.2} aria-hidden="true" />;
    case 'cloud-sun':
    default:
      return <CloudSun className={className} strokeWidth={2.2} aria-hidden="true" />;
  }
}

/**
 * Compact live weather micro-pill for Editorial cards, Expo tiles, and Atlas preview.
 * Reads synchronously from the shared 48-spot batched Open-Meteo store.
 */
export function LiveWeatherPill({
  spot,
  variant = 'card',
  showLabel = false,
  className = '',
  ...rest
}) {
  const { weather } = useLiveWeather(spot);

  if (!weather) {
    if (variant === 'expo') {
      return (
        <span
          aria-hidden="true"
          className={`inline-flex h-[19px] w-11 animate-pulse rounded-full bg-white/20 ${className}`}
        />
      );
    }
    return (
      <span
        aria-hidden="true"
        className={`inline-flex h-6 w-14 animate-pulse rounded-full bg-line dark:bg-white/10 ${className}`}
      />
    );
  }

  const tooltip = `${weather.temperature}°C · ${weather.label} · ${weather.windspeed} km/h wind`;

  if (variant === 'expo') {
    return (
      <span
        title={tooltip}
        aria-label={`Live weather: ${weather.temperature} degrees Celsius, ${weather.label}`}
        className={`inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/40 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-white whitespace-nowrap tabular-nums backdrop-blur-sm sm:text-[10px] ${className}`}
        {...rest}
      >
        <WeatherConditionIcon icon={weather.icon} className="h-2.5 w-2.5 shrink-0 text-amber-300" />
        <span>{weather.temperature}°C</span>
      </span>
    );
  }

  if (variant === 'atlas') {
    return (
      <span
        title={tooltip}
        aria-label={`Live weather: ${weather.temperature} degrees Celsius, ${weather.label}`}
        className={`glass-dark inline-flex items-center gap-1.5 rounded-full border border-white/20 px-2.5 py-1 text-[11px] font-semibold text-white whitespace-nowrap shadow-md tabular-nums ${className}`}
        {...rest}
      >
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" aria-hidden="true" />
        <WeatherConditionIcon icon={weather.icon} className="h-3.5 w-3.5 shrink-0 text-amber-300" />
        <span>{weather.temperature}°C</span>
        {showLabel && (
          <>
            <span className="text-white/35" aria-hidden="true">
              ·
            </span>
            <span className="font-medium text-white/90">{weather.label}</span>
          </>
        )}
      </span>
    );
  }

  return (
    <span
      title={tooltip}
      aria-label={`Live weather: ${weather.temperature} degrees Celsius, ${weather.label}`}
      className={`inline-flex items-center gap-1 rounded-full border border-emerald-600/20 bg-emerald-500/[0.08] px-2.5 py-1 text-[11px] font-semibold tracking-wide text-ink whitespace-nowrap tabular-nums transition-colors duration-300 dark:border-emerald-400/25 dark:bg-emerald-400/[0.12] dark:text-emerald-100 ${className}`}
      {...rest}
    >
      <WeatherConditionIcon
        icon={weather.icon}
        className="h-3 w-3 shrink-0 text-bd-green dark:text-emerald-300"
      />
      <span>{weather.temperature}°C</span>
      {showLabel && (
        <>
          <span className="text-mist dark:text-emerald-300/50" aria-hidden="true">
            ·
          </span>
          <span>{weather.label}</span>
        </>
      )}
    </span>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ApiError } from "@/lib/api/http";
import {
  advisoryIcon,
  advisoryLabel,
  getWeatherForecast,
  rainPeakLabel,
  type WeatherAdvisory,
  type WeatherDay,
  type WeatherForecast,
} from "@/lib/api/weather";
import { WeatherSkeleton } from "./WeatherSkeleton";
import styles from "./weather.module.css";

type TripWeatherAdvisoryWidgetProps = {
  latitude?: number | null;
  longitude?: number | null;
  /** Trip start date YYYY-MM-DD — pick matching day client-side */
  date?: string | null;
  /** Forecast window length (default 3) */
  days?: number | null;
  className?: string;
  onForecastLoaded?: (forecast: WeatherForecast | null) => void;
};

function advisoryToneClass(advisory: WeatherAdvisory): string {
  switch (advisory) {
    case "clear":
      return styles.bannerClear;
    case "cloudy":
      return styles.bannerCloudy;
    case "rain":
      return styles.bannerRain;
    case "storm":
      return styles.bannerStorm;
    default:
      return styles.bannerOther;
  }
}

function formatTemp(day: WeatherDay): string | null {
  if (day.tempMinC == null && day.tempMaxC == null) return null;
  if (day.tempMinC != null && day.tempMaxC != null) {
    return `${Math.round(day.tempMinC)}°–${Math.round(day.tempMaxC)}°C`;
  }
  if (day.tempMaxC != null) return `cao ${Math.round(day.tempMaxC)}°C`;
  return `thấp ${Math.round(day.tempMinC!)}°C`;
}

function formatDayLabel(dateStr: string) {
  try {
    const [y, m, d] = dateStr.slice(0, 10).split("-").map(Number);
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    }).format(new Date(y!, (m ?? 1) - 1, d));
  } catch {
    return dateStr;
  }
}

function pickActiveDay(
  days: WeatherDay[],
  preferredDate: string,
): WeatherDay | null {
  if (!days.length) return null;
  if (preferredDate) {
    const hit = days.find((d) => d.date === preferredDate);
    if (hit) return hit;
  }
  return days[0] ?? null;
}

/**
 * Banner-only weather tip from Open-Meteo via `/weather/forecast`.
 * Fail-soft: hide on hard failure; never blocks trip actions.
 *
 * Note: do NOT send `date` to the API — BE then fetches 16 days and may 404.
 * We fetch a short window and pick the trip day on the client.
 */
export function TripWeatherAdvisoryWidget({
  latitude,
  longitude,
  date,
  days,
  className = "",
  onForecastLoaded,
}: TripWeatherAdvisoryWidgetProps) {
  const lat = Number(latitude);
  const lng = Number(longitude);
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);
  const dateKey =
    date && /^\d{4}-\d{2}-\d{2}/.test(date) ? date.slice(0, 10) : "";
  // Match itinerary length (1-day trip → 1 forecast day). Never inflate to 3.
  const daysKey = Math.min(16, Math.max(1, Math.round(Number(days)) || 1));

  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState(hasCoords);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const onLoadedRef = useRef(onForecastLoaded);
  onLoadedRef.current = onForecastLoaded;

  useEffect(() => {
    if (!hasCoords) {
      setForecast(null);
      setLoading(false);
      onLoadedRef.current?.(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setForecast(null);

    void (async () => {
      const load = async (): Promise<WeatherForecast> => {
        // 1-day trip with known date → ask BE for that exact day.
        if (daysKey === 1 && dateKey) {
          return getWeatherForecast({
            latitude: lat,
            longitude: lng,
            date: dateKey,
          });
        }
        // Multi-day: fetch a window then keep only trip dates.
        const windowDays =
          dateKey != null && dateKey !== ""
            ? Math.min(16, Math.max(daysKey + 2, daysKey))
            : daysKey;
        const raw = await getWeatherForecast({
          latitude: lat,
          longitude: lng,
          days: windowDays,
        });
        if (!dateKey) return { ...raw, days: raw.days.slice(0, daysKey) };
        const startIdx = raw.days.findIndex((d) => d.date === dateKey);
        if (startIdx < 0) {
          return { ...raw, days: raw.days.slice(0, daysKey) };
        }
        return {
          ...raw,
          days: raw.days.slice(startIdx, startIdx + daysKey),
        };
      };

      try {
        // No `date` query — avoids BE 16-day fetch + 404 outside window.
        let data: WeatherForecast;
        try {
          data = await load();
        } catch (first) {
          // Auth may still be hydrating right after itinerary mounts.
          const status = first instanceof ApiError ? first.status : 0;
          if (status === 401) {
            await new Promise((r) => setTimeout(r, 600));
            if (cancelled) return;
            data = await load();
          } else if (status === 502 || status === 503 || status === 504) {
            await new Promise((r) => setTimeout(r, 400));
            if (cancelled) return;
            data = await getWeatherForecast({
              latitude: lat,
              longitude: lng,
              days: Math.min(7, daysKey),
            });
            // Keep same trip-window trim as load()
            if (dateKey) {
              const startIdx = data.days.findIndex((d) => d.date === dateKey);
              if (startIdx >= 0) {
                data = {
                  ...data,
                  days: data.days.slice(startIdx, startIdx + daysKey),
                };
              } else {
                data = { ...data, days: data.days.slice(0, daysKey) };
              }
            } else {
              data = { ...data, days: data.days.slice(0, daysKey) };
            }
          } else {
            throw first;
          }
        }
        if (cancelled) return;
        const preferred = pickActiveDay(data.days, dateKey);
        setForecast(data);
        setSelectedDate(preferred?.date ?? data.days[0]?.date ?? null);
        onLoadedRef.current?.(data);
      } catch (err) {
        if (cancelled) return;
        console.warn("Weather forecast unavailable:", err);
        setForecast(null);
        onLoadedRef.current?.(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hasCoords, lat, lng, dateKey, daysKey]);

  const activeDay = useMemo(() => {
    if (!forecast?.days?.length) return null;
    if (selectedDate) {
      const hit = forecast.days.find((d) => d.date === selectedDate);
      if (hit) return hit;
    }
    return pickActiveDay(forecast.days, dateKey);
  }, [forecast, selectedDate, dateKey]);

  if (!hasCoords) return null;
  if (loading && !forecast) {
    return (
      <div className={`${styles.weatherMount} ${className}`.trim()}>
        <WeatherSkeleton />
      </div>
    );
  }
  if (!forecast || !activeDay) return null;

  const tip = activeDay.message || activeDay.summary;
  const temp = formatTemp(activeDay);
  const rain =
    activeDay.precipitationMm != null && activeDay.precipitationMm > 0
      ? `${activeDay.precipitationMm.toFixed(1)} mm mưa`
      : null;
  const peak = rainPeakLabel(activeDay.rainPeak);
  const chance =
    !peak &&
    activeDay.precipProbabilityMax != null &&
    activeDay.precipProbabilityMax >= 40
      ? `Xác suất mưa ~${Math.round(activeDay.precipProbabilityMax)}%`
      : null;

  return (
    <section
      className={`${styles.weatherMount} ${styles.weatherCard} ${styles.weatherGlass} ${className}`.trim()}
      aria-label="Gợi ý thời tiết"
    >
      <div
        className={`${styles.advisoryBanner} ${advisoryToneClass(activeDay.advisory)}`}
        role="status"
      >
        <span className={styles.bannerIcon} aria-hidden="true">
          {advisoryIcon(activeDay.advisory)}
        </span>
        <div className={styles.bannerBody}>
          <p className={styles.bannerEyebrow}>
            Thời tiết · {advisoryLabel(activeDay.advisory)}
            {activeDay.summary ? ` · ${activeDay.summary}` : ""}
          </p>
          {tip ? <p className={styles.bannerMessage}>{tip}</p> : null}
          {peak ? <p className={styles.bannerPeak}>{peak}</p> : null}
          <p className={styles.bannerMeta}>
            {[temp, rain, chance, formatDayLabel(activeDay.date)]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      </div>

      {forecast.days.length > 1 ? (
        <div className={styles.daysStrip} role="list">
          {forecast.days.map((day) => {
            const on = day.date === activeDay.date;
            return (
              <button
                key={day.date}
                type="button"
                role="listitem"
                className={`${styles.dayChip} ${on ? styles.dayChipOn : ""} ${advisoryToneClass(day.advisory)}`}
                aria-pressed={on}
                onClick={() => setSelectedDate(day.date)}
              >
                <span className={styles.dayChipIcon} aria-hidden="true">
                  {advisoryIcon(day.advisory)}
                </span>
                <span className={styles.dayChipDate}>
                  {formatDayLabel(day.date)}
                </span>
                <span className={styles.dayChipTemp}>
                  {day.tempMinC != null && day.tempMaxC != null
                    ? `${Math.round(day.tempMinC)}°/${Math.round(day.tempMaxC)}°`
                    : day.summary || advisoryLabel(day.advisory)}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

import { apiFetch, apiErrorFromBody, ApiError } from "@/lib/api/http";

export type WeatherAdvisory = "clear" | "cloudy" | "rain" | "storm" | "other";

export type RainPeakWindow = {
  start: string;
  end: string;
  totalMm: number;
  maxHourMm: number;
};

export type WeatherDay = {
  date: string;
  weatherCode: number;
  summary: string;
  tempMaxC: number | null;
  tempMinC: number | null;
  precipitationMm: number | null;
  precipProbabilityMax: number | null;
  advisory: WeatherAdvisory;
  message: string;
  rainPeak: RainPeakWindow | null;
};

export type WeatherForecast = {
  latitude: number;
  longitude: number;
  timezone: string;
  days: WeatherDay[];
  source: "open-meteo";
};

export type GetWeatherForecastParams = {
  latitude: number;
  longitude: number;
  /** YYYY-MM-DD — ask for a specific day within the forecast window */
  date?: string;
  /** default 7, max 16 */
  days?: number;
};

function normalizeAdvisory(raw: unknown): WeatherAdvisory {
  const v = String(raw || "").toLowerCase();
  if (
    v === "clear" ||
    v === "cloudy" ||
    v === "rain" ||
    v === "storm" ||
    v === "other"
  ) {
    return v;
  }
  return "other";
}

function toNum(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function normalizeRainPeak(raw: unknown): RainPeakWindow | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const start = typeof o.start === "string" ? o.start.trim() : "";
  const end = typeof o.end === "string" ? o.end.trim() : "";
  if (!/^\d{2}:\d{2}$/.test(start) || !/^\d{2}:\d{2}$/.test(end)) return null;
  return {
    start,
    end,
    totalMm: toNum(o.totalMm) ?? 0,
    maxHourMm: toNum(o.maxHourMm) ?? 0,
  };
}

function normalizeDay(raw: Record<string, unknown>): WeatherDay | null {
  const date = typeof raw.date === "string" ? raw.date.slice(0, 10) : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  return {
    date,
    weatherCode: Number(raw.weatherCode) || 0,
    summary: typeof raw.summary === "string" ? raw.summary : "",
    tempMaxC: toNum(raw.tempMaxC),
    tempMinC: toNum(raw.tempMinC),
    precipitationMm: toNum(raw.precipitationMm),
    precipProbabilityMax: toNum(raw.precipProbabilityMax),
    advisory: normalizeAdvisory(raw.advisory),
    message:
      typeof raw.message === "string" && raw.message.trim()
        ? raw.message.trim()
        : typeof raw.summary === "string"
          ? raw.summary
          : "",
    rainPeak: normalizeRainPeak(raw.rainPeak),
  };
}

/**
 * Open-Meteo forecast via gateway → `GET /weather/forecast`.
 * Advisory / banner only — never gate generate / suggest / save.
 */
export async function getWeatherForecast(
  params: GetWeatherForecastParams,
): Promise<WeatherForecast> {
  const lat = Number(params.latitude);
  const lng = Number(params.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new ApiError("Thiếu tọa độ để lấy dự báo thời tiết", 400);
  }

  const qs = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
  });
  if (params.date && /^\d{4}-\d{2}-\d{2}$/.test(params.date.slice(0, 10))) {
    qs.set("date", params.date.slice(0, 10));
  }
  if (params.days != null) {
    const n = Math.min(16, Math.max(1, Math.round(Number(params.days)) || 7));
    qs.set("days", String(n));
  }

  const res = await apiFetch(`/api/weather/forecast?${qs.toString()}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as Record<
    string,
    unknown
  > & {
    error?: string;
    days?: unknown[];
  };
  if (!res.ok) {
    throw apiErrorFromBody(
      data,
      res.status,
      data.error || `Không tải được dự báo thời tiết (${res.status})`,
    );
  }

  const daysRaw = Array.isArray(data.days) ? data.days : [];
  const days = daysRaw
    .map((d) =>
      d && typeof d === "object"
        ? normalizeDay(d as Record<string, unknown>)
        : null,
    )
    .filter((d): d is WeatherDay => Boolean(d));

  if (!days.length) {
    throw new ApiError("Không có ngày dự báo trong phản hồi", 404);
  }

  return {
    latitude: Number(data.latitude) || lat,
    longitude: Number(data.longitude) || lng,
    timezone:
      typeof data.timezone === "string" && data.timezone
        ? data.timezone
        : "Asia/Ho_Chi_Minh",
    days,
    source: "open-meteo",
  };
}

export function advisoryIcon(advisory: WeatherAdvisory): string {
  switch (advisory) {
    case "clear":
      return "☀️";
    case "cloudy":
      return "☁️";
    case "rain":
      return "🌧️";
    case "storm":
      return "⛈️";
    default:
      return "🌤️";
  }
}

export function advisoryLabel(advisory: WeatherAdvisory): string {
  switch (advisory) {
    case "clear":
      return "Quang đãng";
    case "cloudy":
      return "Nhiều mây";
    case "rain":
      return "Mưa";
    case "storm":
      return "Dông bão";
    default:
      return "Thời tiết";
  }
}

export function rainPeakLabel(peak: RainPeakWindow | null | undefined): string | null {
  if (!peak?.start || !peak?.end) return null;
  return `Mưa cao điểm ${peak.start}–${peak.end}`;
}

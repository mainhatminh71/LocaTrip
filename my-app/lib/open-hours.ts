/**
 * Client-side open-hours checks (aligned with trip-service isPlaceOpen).
 * Used in reorder confirm UI so users see CLOSED / CLOSES_EARLY without
 * relying only on API warnings.
 */

const DAY_MAP_VN = [
  "Chủ Nhật",
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
];
const DAY_MAP_EN = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function timeStringToMinutes(time: string): number {
  const m = String(time || "")
    .trim()
    .match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return NaN;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (!Number.isFinite(h) || !Number.isFinite(min)) return NaN;
  return h * 60 + min;
}

export function minutesToTimeString(total: number): string {
  const t = Math.max(0, Math.round(total));
  const h = Math.floor(t / 60) % 24;
  const m = t % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function parseVisitWindow(time: string): {
  startMin: number;
  endMin: number;
} | null {
  const parts = String(time || "")
    .split("-")
    .map((s) => s.trim());
  if (parts.length < 2) return null;
  const startMin = timeStringToMinutes(parts[0]!);
  const endMin = timeStringToMinutes(parts[1]!);
  if (!Number.isFinite(startMin) || !Number.isFinite(endMin)) return null;
  return { startMin, endMin };
}

/** Resolve weekday index (0=Sun … 6=Sat). */
export function resolveDayOfWeekIndex(opts: {
  tripDate?: string;
  dayNumber?: number;
  dayOfWeekIndex?: number;
}): number {
  if (
    opts.dayOfWeekIndex != null &&
    Number.isFinite(Number(opts.dayOfWeekIndex))
  ) {
    const i = Math.floor(Number(opts.dayOfWeekIndex));
    if (i >= 0 && i <= 6) return i;
  }
  const dayNumber = Math.max(1, Math.floor(Number(opts.dayNumber) || 1));
  let startDow: number;
  const tripDate = opts.tripDate?.trim();
  if (tripDate && /^\d{4}-\d{2}-\d{2}$/.test(tripDate)) {
    const [y, m, d] = tripDate.split("-").map(Number);
    startDow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  } else {
    // Approximate "today" in VN without a heavy TZ lib.
    const vn = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }),
    );
    startDow = vn.getDay();
  }
  return (startDow + (dayNumber - 1)) % 7;
}

export function isPlaceOpen(
  openHours: unknown,
  dayIndex: number,
  timeMinutes: number,
): boolean {
  if (openHours == null) return true;

  const vnKey = DAY_MAP_VN[dayIndex];
  const enKey = DAY_MAP_EN[dayIndex];

  let hoursArray: unknown = null;
  if (Array.isArray(openHours)) {
    hoursArray = openHours;
  } else if (typeof openHours === "object") {
    const obj = openHours as Record<string, unknown>;
    hoursArray =
      obj[vnKey!] ||
      obj[enKey!] ||
      obj[enKey!.toLowerCase()] ||
      obj[vnKey!.toLowerCase()];
  } else if (typeof openHours === "string") {
    hoursArray = [openHours];
  }

  if (
    hoursArray == null ||
    (Array.isArray(hoursArray) && hoursArray.length === 0)
  ) {
    return true;
  }

  const hourStrings: string[] = Array.isArray(hoursArray)
    ? hoursArray.map(String)
    : [String(hoursArray)];

  for (const rangeStr of hourStrings) {
    const norm = rangeStr.toLowerCase().trim();
    if (
      norm.includes("open 24 hours") ||
      norm.includes("mở cửa cả ngày") ||
      norm.includes("24/7") ||
      norm.includes("mở cả ngày")
    ) {
      return true;
    }
    if (norm.includes("closed") || norm.includes("đóng cửa")) {
      continue;
    }

    const parts = rangeStr.split(/[-–—]/).map((s) => s.trim());
    if (parts.length === 2) {
      const startMin = timeStringToMinutes(parts[0]!);
      const endMin = timeStringToMinutes(parts[1]!);
      if (Number.isNaN(startMin) || Number.isNaN(endMin)) continue;

      if (startMin <= endMin) {
        if (timeMinutes >= startMin && timeMinutes <= endMin) return true;
      } else if (timeMinutes >= startMin || timeMinutes <= endMin) {
        return true;
      }
    }
  }

  return false;
}

export type OpenHoursIssue = {
  type: "CLOSED" | "CLOSES_EARLY";
  placeId?: string;
  title: string;
  message: string;
  startLabel: string;
  endLabel: string;
};

export type VisitOpenHoursStatus = {
  placeId?: string;
  title: string;
  startLabel: string;
  endLabel: string;
  /** null = no openHours data */
  status: "ok" | "closed" | "closes_early" | "unknown";
  message?: string;
};

export function checkVisitOpenHours(opts: {
  title: string;
  placeId?: string;
  time: string;
  openHours: unknown;
  dayOfWeekIndex: number;
}): VisitOpenHoursStatus {
  const window = parseVisitWindow(opts.time);
  const startLabel = window
    ? minutesToTimeString(window.startMin)
    : opts.time.split("-")[0]?.trim() || "—";
  const endLabel = window
    ? minutesToTimeString(window.endMin)
    : opts.time.split("-")[1]?.trim() || "—";
  const base = {
    placeId: opts.placeId,
    title: opts.title,
    startLabel,
    endLabel,
  };

  if (opts.openHours == null) {
    return { ...base, status: "unknown" };
  }
  if (!window) {
    return { ...base, status: "unknown" };
  }

  const openAtStart = isPlaceOpen(
    opts.openHours,
    opts.dayOfWeekIndex,
    window.startMin,
  );
  const openAtEnd = isPlaceOpen(
    opts.openHours,
    opts.dayOfWeekIndex,
    Math.max(window.startMin, window.endMin - 1),
  );

  if (!openAtStart) {
    return {
      ...base,
      status: "closed",
      message: `${opts.title} có thể đang đóng cửa lúc ${startLabel} theo thứ tự mới.`,
    };
  }
  if (!openAtEnd) {
    return {
      ...base,
      status: "closes_early",
      message: `${opts.title} có thể đóng cửa trước khi kết thúc visit (${startLabel}–${endLabel}).`,
    };
  }
  return { ...base, status: "ok" };
}

export function issuesFromStatuses(
  statuses: VisitOpenHoursStatus[],
): OpenHoursIssue[] {
  const out: OpenHoursIssue[] = [];
  for (const s of statuses) {
    if (s.status === "closed") {
      out.push({
        type: "CLOSED",
        placeId: s.placeId,
        title: s.title,
        message: s.message || `${s.title} đóng cửa lúc ${s.startLabel}.`,
        startLabel: s.startLabel,
        endLabel: s.endLabel,
      });
    } else if (s.status === "closes_early") {
      out.push({
        type: "CLOSES_EARLY",
        placeId: s.placeId,
        title: s.title,
        message:
          s.message ||
          `${s.title} đóng sớm trước ${s.endLabel}.`,
        startLabel: s.startLabel,
        endLabel: s.endLabel,
      });
    }
  }
  return out;
}

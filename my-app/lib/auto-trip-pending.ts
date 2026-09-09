import type { AutoTripDraft } from "@/lib/auto-trip-form";

export const AUTO_TRIP_PENDING_KEY = "locatrip.autoTrip.pendingForm";

export type PendingAutoTripForm = {
  draft: AutoTripDraft;
  locationOverride?: { latitude: number; longitude: number } | null;
  /** After login / nạp xu, auto-run generate with this draft. */
  resumeGenerate: boolean;
  regenerate?: boolean;
  savedAt: string;
};

function write(data: PendingAutoTripForm) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(data);
  try {
    localStorage.setItem(AUTO_TRIP_PENDING_KEY, raw);
  } catch {
    /* ignore */
  }
  try {
    sessionStorage.setItem(AUTO_TRIP_PENDING_KEY, raw);
  } catch {
    /* ignore */
  }
}

export function savePendingAutoTripForm(
  partial: Omit<PendingAutoTripForm, "savedAt">,
): void {
  write({
    ...partial,
    savedAt: new Date().toISOString(),
  });
}

export function loadPendingAutoTripForm(): PendingAutoTripForm | null {
  if (typeof window === "undefined") return null;
  try {
    const raw =
      localStorage.getItem(AUTO_TRIP_PENDING_KEY) ||
      sessionStorage.getItem(AUTO_TRIP_PENDING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingAutoTripForm;
    if (!parsed?.draft || typeof parsed.draft !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearPendingAutoTripForm(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(AUTO_TRIP_PENDING_KEY);
  } catch {
    /* ignore */
  }
  try {
    sessionStorage.removeItem(AUTO_TRIP_PENDING_KEY);
  } catch {
    /* ignore */
  }
}

export function hasPendingGenerateResume(): boolean {
  const p = loadPendingAutoTripForm();
  return Boolean(p?.resumeGenerate && p.draft);
}

/** Path back to book-a-trip after login / top-up. */
export const BOOK_A_TRIP_RESUME_PATH = "/book-a-trip/?resume=generate";

export type TripServiceFeedback = {
  tripId: string;
  rating: number;
  comment: string;
  savedAt: string;
  mode?: "save" | "update";
};

const STORAGE_KEY = "locatrip.tripServiceFeedback.v1";

export function readTripServiceFeedbacks(): TripServiceFeedback[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as TripServiceFeedback[]) : [];
  } catch {
    return [];
  }
}

export function saveTripServiceFeedback(
  entry: TripServiceFeedback,
): TripServiceFeedback[] {
  const next = [entry, ...readTripServiceFeedbacks()].slice(0, 50);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}

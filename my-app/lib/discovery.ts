/** Discovery API types + client persistence (LocalTrip `/discovery`). */

export type BudgetLevel = "budget" | "mid-range" | "luxury";
export type Pace = "relaxed" | "moderate" | "active";

export type QuestionKind = "single" | "multi";

export type DiscoveryQuestionOption = {
  id: string;
  label: string;
};

export type DiscoveryQuestion = {
  id: string;
  prompt: string;
  kind: QuestionKind;
  options: DiscoveryQuestionOption[];
};

export type DiscoverySessionStatus =
  | "active"
  | "ready_to_plan"
  | "converted"
  | "expired";

export type DiscoverySession = {
  id: string;
  version: number;
  status: DiscoverySessionStatus;
  location: {
    center: { lat: number; lon: number };
    radiusKm: number;
    cityHint?: string;
  };
  hardConstraints: {
    durationDays: number;
    budgetLevel: BudgetLevel;
    pace: Pace;
    startTimePerDay: string;
    endTimePerDay: string;
  };
  softPreferences: {
    tags: string[];
    tripType?: string;
    targetCustomer?: string;
  };
  answered: Array<{ questionId: string; answer: unknown; answeredAt: string }>;
  skipped: Array<{ questionId: string; skippedAt: string }>;
  pinnedPlaceIds: string[];
  excludedPlaceIds: string[];
};

export type RecommendedPlace = {
  placeId: string;
  title: string;
  category?: string;
  latitude?: number;
  longitude?: number;
  reviewRating?: number;
  reviewCount?: number;
  tags: string[];
  thumbnail?: string;
  score: number;
  pinned: boolean;
};

export type DiscoveryView = {
  session: DiscoverySession;
  nextQuestion: DiscoveryQuestion | null;
  recommendations?: RecommendedPlace[];
  trip?: unknown;
};

export type CreateSessionBody = {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  durationDays?: number;
  budgetLevel?: BudgetLevel;
  pace?: Pace;
  startTimePerDay?: string;
  endTimePerDay?: string;
  anonymousId?: string;
  cityHint?: string;
};

/** Matches server MVP catalog length (UI progress only). */
export const DISCOVERY_QUESTION_TOTAL = 6;

export const ANON_KEY = "localtrip.anonymousId";
export const SESSION_KEY = "localtrip.discoverySessionId";
export const TRIP_KEY = "localtrip.discoveryTrip";

export function getOrCreateAnonymousId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(ANON_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(ANON_KEY, id);
  }
  return id;
}

export function persistSessionId(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) localStorage.setItem(SESSION_KEY, id);
  else localStorage.removeItem(SESSION_KEY);
}

export function loadSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}

export function persistDiscoveryTrip(trip: unknown) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(TRIP_KEY, JSON.stringify(trip));
}

export function loadDiscoveryTrip(): unknown | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(TRIP_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

export function progressFromSession(session: DiscoverySession | null): {
  done: number;
  total: number;
} {
  if (!session) return { done: 0, total: DISCOVERY_QUESTION_TOTAL };
  const done = session.answered.length + session.skipped.length;
  return {
    done: Math.min(done, DISCOVERY_QUESTION_TOTAL),
    total: DISCOVERY_QUESTION_TOTAL,
  };
}

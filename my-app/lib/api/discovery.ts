import type {
  CreateSessionBody,
  DiscoveryView,
  RecommendedPlace,
} from "@/lib/discovery";

async function parse(res: Response): Promise<unknown> {
  const data = (await res.json()) as { error?: string } & Record<string, unknown>;
  if (!res.ok) {
    throw new Error(data.error || `Lỗi ${res.status}`);
  }
  return data;
}

export async function createDiscoverySession(
  body: CreateSessionBody,
): Promise<DiscoveryView> {
  const res = await fetch("/api/discovery/sessions/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await parse(res)) as DiscoveryView;
}

export async function getDiscoverySession(
  sessionId: string,
): Promise<DiscoveryView> {
  const res = await fetch(
    `/api/discovery/sessions/${encodeURIComponent(sessionId)}/`,
    { cache: "no-store" },
  );
  return (await parse(res)) as DiscoveryView;
}

export async function answerDiscovery(
  sessionId: string,
  questionId: string,
  answer: string | string[],
): Promise<DiscoveryView> {
  const res = await fetch(
    `/api/discovery/sessions/${encodeURIComponent(sessionId)}/answers/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId, answer }),
    },
  );
  return (await parse(res)) as DiscoveryView;
}

export async function skipDiscovery(
  sessionId: string,
  questionId: string,
): Promise<DiscoveryView> {
  const res = await fetch(
    `/api/discovery/sessions/${encodeURIComponent(sessionId)}/skip/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId }),
    },
  );
  return (await parse(res)) as DiscoveryView;
}

export async function pinDiscoveryPlace(
  sessionId: string,
  placeId: string,
): Promise<DiscoveryView> {
  const res = await fetch(
    `/api/discovery/sessions/${encodeURIComponent(sessionId)}/pins/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ placeId }),
    },
  );
  return (await parse(res)) as DiscoveryView;
}

export async function excludeDiscoveryPlace(
  sessionId: string,
  placeId: string,
): Promise<DiscoveryView> {
  const res = await fetch(
    `/api/discovery/sessions/${encodeURIComponent(sessionId)}/exclusions/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ placeId }),
    },
  );
  return (await parse(res)) as DiscoveryView;
}

export async function generateDiscoveryTrip(
  sessionId: string,
): Promise<DiscoveryView> {
  const res = await fetch(
    `/api/discovery/sessions/${encodeURIComponent(sessionId)}/generate-trip/`,
    { method: "POST" },
  );
  return (await parse(res)) as DiscoveryView;
}

export type ExtendDayView = DiscoveryView & {
  extendedDay?: { day: number; schedule: unknown[] };
};

export async function extendDiscoveryDay(
  sessionId: string,
  body: {
    excludePlaceIds: string[];
    hotelPlaceId?: string;
    nextDayNumber: number;
  },
): Promise<ExtendDayView> {
  const res = await fetch(
    `/api/discovery/sessions/${encodeURIComponent(sessionId)}/extend-day/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  return (await parse(res)) as ExtendDayView;
}

export type { RecommendedPlace };

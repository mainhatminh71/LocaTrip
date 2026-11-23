import { copyText } from "@/lib/ui/clipboard";

export type SharePayload = {
  title: string;
  text?: string;
  url: string;
};

export type ShareResult =
  | { ok: true; method: "share" | "clipboard" }
  | { ok: false; cancelled?: boolean };

/**
 * Prefer native Web Share sheet; fall back to copying the URL.
 * Treats user-dismissed share sheets as cancelled (not an error).
 */
export async function shareOrCopy(payload: SharePayload): Promise<ShareResult> {
  const title = payload.title.trim();
  const url = payload.url.trim();
  if (!url) return { ok: false };

  const text = (payload.text || "").trim();

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({
        title: title || undefined,
        text: text || undefined,
        url,
      });
      return { ok: true, method: "share" };
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return { ok: false, cancelled: true };
      }
      /* fall through to clipboard */
    }
  }

  const copied = await copyText(url);
  return copied ? { ok: true, method: "clipboard" } : { ok: false };
}

/** Canonical public place URL for sharing. */
export function placeSharePath(placeId: string): string {
  return `/places/${encodeURIComponent(placeId.trim())}`;
}

/** Legacy public trip-by-id URL (owner Mongo snapshot). */
export function tripSharePath(tripId: string): string {
  return `/trips/${encodeURIComponent(tripId.trim())}`;
}

/** Community feed detail URL for a published shared trip. */
export function sharedTripPath(sharedId: string): string {
  return `/shared-trips/${encodeURIComponent(sharedId.trim())}`;
}

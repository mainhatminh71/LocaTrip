import { getPlaceById } from "@/lib/api/trips";
import type { ScheduleItem, ScheduledVisit } from "@/lib/trip";

/**
 * Attach `openHours` onto visit places that are missing it (via place detail API).
 * Keeps other schedule items unchanged. Failures are ignored per place.
 */
export async function enrichScheduleOpenHours(
  schedule: ScheduleItem[],
): Promise<ScheduleItem[]> {
  const needIds = [
    ...new Set(
      schedule
        .filter((i): i is ScheduledVisit => i.type === "visit")
        .filter((i) => Boolean(i.place?.placeId?.trim()) && i.place.openHours == null)
        .map((i) => i.place.placeId!.trim()),
    ),
  ];

  if (needIds.length === 0) return schedule;

  const hoursById = new Map<string, unknown>();
  await Promise.all(
    needIds.map(async (placeId) => {
      try {
        const detail = await getPlaceById(placeId);
        if (detail?.openHours != null) {
          hoursById.set(placeId, detail.openHours);
        }
      } catch {
        // ignore — BE may still load from Mongo
      }
    }),
  );

  if (hoursById.size === 0) return schedule;

  return schedule.map((item) => {
    if (item.type !== "visit") return item;
    const placeId = item.place?.placeId?.trim() || "";
    if (!placeId || item.place.openHours != null) return item;
    const hours = hoursById.get(placeId);
    if (hours == null) return item;
    return {
      ...item,
      place: { ...item.place, openHours: hours },
    };
  });
}

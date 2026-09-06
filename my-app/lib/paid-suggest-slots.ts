/** Slot markers from BE `paidSuggestSlots` / suggest-replace cache. */
export type PaidSuggestSlot = {
  dayIndex: number;
  scheduleIndex: number;
  placeId: string;
};

/** True when BE already cached a paid suggest for this slot+place. */
export function isPaidSuggestSlot(
  slots: PaidSuggestSlot[] | undefined | null,
  opts: { dayIndex: number; scheduleIndex: number; placeId?: string | null },
): boolean {
  if (!slots?.length) return false;
  const pid = (opts.placeId || "").trim();
  if (!pid) return false;
  return slots.some(
    (s) =>
      s.dayIndex === opts.dayIndex &&
      s.scheduleIndex === opts.scheduleIndex &&
      s.placeId === pid,
  );
}

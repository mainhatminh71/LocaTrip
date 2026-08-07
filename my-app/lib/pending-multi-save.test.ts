import assert from "node:assert/strict";
import { titleForPendingOption } from "@/lib/auto-trip-form";

/** Simulate mapping N generate options → N Pending create payloads (titles). */
function pendingTitlesForOptions(
  baseTitle: string,
  optionTitles: string[],
): string[] {
  const total = optionTitles.length;
  return optionTitles.map((t, i) =>
    titleForPendingOption(baseTitle, t, i, total),
  );
}

const titles = pendingTitlesForOptions("Weekend Đà Lạt", [
  "Lộ trình 1: Trung tâm",
  "Lộ trình 2: Hồ Xuân Hương",
  "Lộ trình 3: Langbiang vibe",
]);

assert.equal(titles.length, 3);
assert.deepEqual(titles, [
  "Weekend Đà Lạt · Trung tâm",
  "Weekend Đà Lạt · Hồ Xuân Hương",
  "Weekend Đà Lạt · Langbiang vibe",
]);
assert.ok(new Set(titles).size === 3, "titles must be distinct for multi-save");

console.log("pending-multi-save.test.ts: ok");

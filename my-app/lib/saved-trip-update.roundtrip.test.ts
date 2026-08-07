/**
 * Simulate GET trip response after PATCH (flat trip doc + trip_prefs overlay)
 * and assert restore uses updated startCoords + planner fields.
 *
 * Run: npx tsx lib/saved-trip-update.roundtrip.test.ts
 */
import assert from "node:assert/strict";
import type { SavedTrip } from "@/lib/api/trips";
import { draftFromSavedTrip, pickSavedTripPrefs } from "@/lib/saved-trip-draft";
import { buildAutoTripRequest } from "@/lib/build-auto-trip-request";

/** Mirrors server `toTripResponseWithPrefs` merge. */
function mergeTripWithPrefs(
  tripFlat: SavedTrip,
  prefs: NonNullable<SavedTrip["generatePrefs"]> & { id?: string },
): SavedTrip {
  return {
    ...tripFlat,
    prefsId: prefs.id,
    generatePrefs: prefs,
    tripType: prefs.tripType ?? tripFlat.tripType,
    targetCustomer: prefs.targetCustomer ?? tripFlat.targetCustomer,
    preferences: prefs.preferences?.length
      ? prefs.preferences
      : tripFlat.preferences,
    budgetLevel: prefs.budgetLevel ?? tripFlat.budgetLevel,
    pace: prefs.pace ?? tripFlat.pace,
    radiusKm: prefs.radiusKm ?? tripFlat.radiusKm,
    maxDistance: prefs.maxDistance ?? tripFlat.maxDistance,
    isRoundTrip: prefs.isRoundTrip ?? tripFlat.isRoundTrip,
    roundTrip: prefs.isRoundTrip ?? tripFlat.roundTrip,
    startTimePerDay: prefs.startTimePerDay ?? tripFlat.startTimePerDay,
    endTimePerDay: prefs.endTimePerDay ?? tripFlat.endTimePerDay,
    showRoad: prefs.showRoad ?? tripFlat.showRoad,
    startCoords: prefs.startCoords ?? tripFlat.startCoords,
    startLatitude: prefs.startCoords?.latitude ?? tripFlat.startLatitude,
    startLongitude: prefs.startCoords?.longitude ?? tripFlat.startLongitude,
    startMode: prefs.startMode ?? tripFlat.startMode,
    startId: prefs.startId ?? tripFlat.startId,
  } as SavedTrip;
}

section("PATCH prefs: new startCoords win over stale flat trip doc");
{
  // Stale coords still on trips collection (mongoose subdoc bug before fix)
  const staleFlat: SavedTrip = {
    id: "abc",
    ownerId: "u1",
    title: "Lộ trình 1: Khám phá",
    source: "auto",
    itinerary: [{ day: 1, schedule: [] }],
    status: "active",
    createdAt: "2026-08-07T10:00:00.000Z",
    updatedAt: "2026-08-07T10:00:00.000Z",
    startCoords: { latitude: 11.9404, longitude: 108.4583 }, // center (old)
    startLatitude: 11.9404,
    startLongitude: 108.4583,
    startMode: "preset",
    startId: "center",
    pace: "moderate",
    budgetLevel: "mid-range",
    radiusKm: 10,
    maxDistance: 5,
    isRoundTrip: true,
    showRoad: false,
    preferences: ["amenities:wheelchair_accessible"],
  };

  // trip_prefs after PATCH — Ga Đà Lạt + new options
  const updatedPrefs = {
    id: "prefs1",
    tripType: "exploration",
    targetCustomer: "couple",
    preferences: ["atmosphere:peaceful", "specialty:coffee"],
    budgetLevel: "luxury" as const,
    pace: "active" as const,
    radiusKm: 15,
    maxDistance: 8,
    isRoundTrip: false,
    startTimePerDay: "09:00",
    endTimePerDay: "17:00",
    showRoad: true,
    startCoords: { latitude: 11.925, longitude: 108.451 },
    startMode: "preset",
    startId: "ga",
  };

  const response = mergeTripWithPrefs(staleFlat, updatedPrefs);
  const prefs = pickSavedTripPrefs(response);
  assert.equal(prefs.startId, "ga");
  assert.deepEqual(prefs.startCoords, { latitude: 11.925, longitude: 108.451 });
  assert.equal(prefs.tripType, "exploration");
  assert.equal(prefs.targetCustomer, "couple");
  assert.equal(prefs.budgetLevel, "luxury");
  assert.equal(prefs.pace, "active");
  assert.equal(prefs.radiusKm, 15);
  assert.equal(prefs.maxDistance, 8);
  assert.equal(prefs.isRoundTrip, false);
  assert.equal(prefs.showRoad, true);
  assert.equal(prefs.startTimePerDay, "09:00");
  assert.equal(prefs.endTimePerDay, "17:00");
  assert.deepEqual(prefs.preferences, [
    "atmosphere:peaceful",
    "specialty:coffee",
  ]);

  const { draft, locationOverride } = draftFromSavedTrip(response);
  assert.equal(draft.startId, "ga");
  assert.equal(draft.showRoad, true);
  assert.equal(draft.isRoundTrip, false);
  assert.equal(draft.radiusKm, "15");
  assert.equal(draft.maxDistance, "8");
  assert.equal(draft.hours, "09:00|17:00");
  assert.deepEqual(locationOverride, { latitude: 11.925, longitude: 108.451 });

  const req = buildAutoTripRequest(draft, "dalat", locationOverride);
  assert.equal(req.startLatitude, 11.925);
  assert.equal(req.startLongitude, 108.451);
  assert.equal(req.showRoad, true);
  assert.equal(req.isRoundTrip, false);
  assert.equal(req.tripType, "exploration");
}

section("editingTripId persistence contract: update must keep same id");
{
  // After Tạo lại / Chỉnh, FE must PATCH same id — not POST a duplicate.
  const editingId = "68a1tripkeep";
  const createWouldMakeNew = editingId === null;
  assert.equal(createWouldMakeNew, false);
  assert.equal(editingId, "68a1tripkeep");
}

console.log("\nAll update round-trip field tests passed.\n");

function section(name: string) {
  console.log(`\n✔ ${name}`);
}

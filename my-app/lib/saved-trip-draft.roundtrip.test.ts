/**
 * Manual round-trip checks for saved-trip prefs restore.
 * Run: npx tsx lib/saved-trip-draft.roundtrip.test.ts
 */
import assert from "node:assert/strict";
import type { SavedTrip } from "@/lib/api/trips";
import { draftFromSavedTrip, pickSavedTripPrefs } from "@/lib/saved-trip-draft";
import { buildAutoTripRequest } from "@/lib/build-auto-trip-request";

function baseTrip(overrides: Partial<SavedTrip> = {}): SavedTrip {
  return {
    id: "trip-1",
    ownerId: "user-1",
    title: "Test Đà Lạt",
    source: "auto",
    itinerary: [{ day: 1, schedule: [] }],
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function section(name: string) {
  console.log(`\n✔ ${name}`);
}

section("pickSavedTripPrefs: flat + nested + string coords");
{
  const trip = baseTrip({
    tripType: "exploration",
    pace: "moderate",
    budgetLevel: "mid-range",
    radiusKm: 10,
    maxDistance: 5,
    isRoundTrip: true,
    showRoad: false,
    startMode: "preset",
    startId: "ga",
    startLatitude: 11.925,
    startLongitude: 108.451,
    preferences: ["atmosphere:peaceful", "specialty:local_specialty"],
    generatePrefs: {
      // nested should fill missing / nested coords as strings
      startCoords: { latitude: "11.925" as unknown as number, longitude: "108.451" as unknown as number },
      showRoad: false,
    },
  });
  const prefs = pickSavedTripPrefs(trip);
  assert.equal(prefs.tripType, "exploration");
  assert.equal(prefs.pace, "moderate");
  assert.equal(prefs.budgetLevel, "mid-range");
  assert.equal(prefs.radiusKm, 10);
  assert.equal(prefs.maxDistance, 5);
  assert.equal(prefs.isRoundTrip, true);
  assert.equal(prefs.showRoad, false);
  assert.equal(prefs.startMode, "preset");
  assert.equal(prefs.startId, "ga");
  assert.deepEqual(prefs.startCoords, { latitude: 11.925, longitude: 108.451 });
  assert.ok(prefs.preferences?.includes("atmosphere:peaceful"));
}

section("draftFromSavedTrip: preset restores startCoords override");
{
  const trip = baseTrip({
    tripType: "exploration",
    targetCustomer: "couple",
    pace: "active",
    budgetLevel: "luxury",
    radiusKm: 15,
    maxDistance: 8,
    isRoundTrip: false,
    showRoad: true,
    startMode: "preset",
    startId: "xuan-huong",
    startCoords: { latitude: 11.9415, longitude: 108.438 },
    startTimePerDay: "14:00",
    endTimePerDay: "21:30",
    preferences: [
      "atmosphere:romantic",
      "specialty:coffee",
      "feature:scenic_view",
      "amenities:wheelchair_accessible",
    ],
  });
  const { draft, locationOverride } = draftFromSavedTrip(trip);
  assert.equal(draft.tripType, "exploration");
  assert.equal(draft.targetCustomer, "couple");
  assert.equal(draft.pace, "active");
  assert.equal(draft.budgetLevel, "luxury");
  assert.equal(draft.radiusKm, "15");
  assert.equal(draft.maxDistance, "8");
  assert.equal(draft.isRoundTrip, false);
  assert.equal(draft.showRoad, true);
  assert.equal(draft.startMode, "preset");
  assert.equal(draft.startId, "xuan-huong");
  assert.equal(draft.hours, "14:00|21:30");
  assert.equal(draft.hoursMode, "preset");
  assert.ok(draft.atmosphere.includes("atmosphere:romantic"));
  assert.ok(draft.food.includes("specialty:coffee"));
  assert.ok(draft.activities.includes("feature:scenic_view"));
  assert.ok(draft.constraints.includes("amenities:wheelchair_accessible"));
  assert.deepEqual(locationOverride, { latitude: 11.9415, longitude: 108.438 });

  const req = buildAutoTripRequest(draft, "dalat", locationOverride);
  assert.equal(req.startLatitude, 11.9415);
  assert.equal(req.startLongitude, 108.438);
  assert.equal(req.radiusKm, 15);
  assert.equal(req.maxDistance, 8);
  assert.equal(req.isRoundTrip, false);
  assert.equal(req.showRoad, true);
  assert.equal(req.budgetLevel, "luxury");
  assert.equal(req.pace, "active");
  assert.equal(req.tripType, "exploration");
  assert.equal(req.startTimePerDay, "14:00");
  assert.equal(req.endTimePerDay, "21:30");
  assert.ok(req.preferences.includes("atmosphere:romantic"));
}

section("draftFromSavedTrip: GPS restores saved coords (not browser)");
{
  const trip = baseTrip({
    tripType: "relaxation",
    preferences: ["atmosphere:peaceful"],
    startMode: "gps",
    startCoords: { latitude: 11.95, longitude: 108.44 },
    generatePrefs: {
      startMode: "gps",
      startCoords: { latitude: 11.95, longitude: 108.44 },
      showRoad: false,
      radiusKm: 10,
      maxDistance: 5,
      isRoundTrip: true,
      pace: "relaxed",
      budgetLevel: "budget",
    },
  });
  const { draft, locationOverride } = draftFromSavedTrip(trip);
  assert.equal(draft.startMode, "gps");
  assert.deepEqual(locationOverride, { latitude: 11.95, longitude: 108.44 });
  const req = buildAutoTripRequest(draft, "dalat", locationOverride);
  assert.equal(req.startLatitude, 11.95);
  assert.equal(req.startLongitude, 108.44);
  // Road polyline is always on (prefs toggle removed).
  assert.equal(req.showRoad, true);
}

section("draftFromSavedTrip: nested generatePrefs wins when flat missing");
{
  const trip = baseTrip({
    generatePrefs: {
      tripType: "family_fun",
      targetCustomer: "family",
      preferences: ["amenities:kid_friendly"],
      budgetLevel: "mid-range",
      pace: "moderate",
      radiusKm: 12,
      maxDistance: 6,
      isRoundTrip: true,
      showRoad: true,
      startTimePerDay: "09:00",
      endTimePerDay: "17:00",
      startMode: "preset",
      startId: "center",
      startCoords: { latitude: 11.9404, longitude: 108.4583 },
    },
  });
  const { draft, locationOverride } = draftFromSavedTrip(trip);
  assert.equal(draft.tripType, "family_fun");
  assert.equal(draft.targetCustomer, "family");
  assert.equal(draft.radiusKm, "12");
  assert.equal(draft.maxDistance, "6");
  assert.equal(draft.showRoad, true);
  assert.equal(draft.startId, "center");
  assert.equal(draft.hours, "09:00|17:00");
  assert.deepEqual(locationOverride, {
    latitude: 11.9404,
    longitude: 108.4583,
  });
}

console.log("\nAll saved-trip draft field tests passed.\n");

import assert from "node:assert/strict";
import { reorderVisitIds, visitOrderForDay } from "@/lib/itinerary-map";
import type { ScheduleItem } from "@/lib/trip";

const schedule: ScheduleItem[] = [
  {
    type: "travel",
    time: "08:30",
    durationMin: 10,
  },
  {
    type: "visit",
    time: "08:40",
    place: {
      placeId: "a",
      title: "A",
      latitude: 11.9,
      longitude: 108.4,
    },
  },
  {
    type: "travel",
    time: "09:40",
    durationMin: 15,
  },
  {
    type: "visit",
    time: "09:55",
    place: {
      placeId: "b",
      title: "B",
      latitude: 11.91,
      longitude: 108.41,
    },
  },
  {
    type: "visit",
    time: "11:00",
    place: {
      placeId: "c",
      title: "C",
      latitude: 11.92,
      longitude: 108.42,
    },
  },
];

assert.deepEqual(
  visitOrderForDay(schedule),
  ["a", "b", "c"],
  "visitOrderForDay skips travel",
);

assert.deepEqual(
  reorderVisitIds(["a", "b", "c"], "a", "c", true),
  ["b", "c", "a"],
  "move a after c",
);

assert.deepEqual(
  reorderVisitIds(["a", "b", "c"], "c", "a", false),
  ["c", "a", "b"],
  "move c before a",
);

assert.equal(
  reorderVisitIds(["a", "b", "c"], "a", "a", true),
  null,
  "same id → null",
);

assert.deepEqual(
  reorderVisitIds(["a", "b", "c"], "a", "b", true),
  ["b", "a", "c"],
  "move a after b",
);

console.log("itinerary-reorder.test.ts: ok");

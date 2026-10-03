import assert from "node:assert/strict";
import {
  moveVisitToIndex,
  reorderVisitIds,
  swapVisitIds,
  visitOrderForDay,
} from "@/lib/itinerary-map";
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

assert.deepEqual(
  moveVisitToIndex(["a", "b", "c", "d"], "a", 3),
  ["b", "c", "d", "a"],
  "move first to last index",
);

assert.deepEqual(
  moveVisitToIndex(["a", "b", "c", "d"], "d", 0),
  ["d", "a", "b", "c"],
  "move last to first",
);

assert.equal(
  moveVisitToIndex(["a", "b", "c"], "b", 1),
  null,
  "same index → null",
);

assert.deepEqual(
  swapVisitIds(["a", "b", "c", "d"], "a", "d"),
  ["d", "b", "c", "a"],
  "swap 1 with 4",
);

assert.equal(
  swapVisitIds(["a", "b", "c"], "a", "a"),
  null,
  "swap same id → null",
);

console.log("itinerary-reorder.test.ts: ok");

import assert from "node:assert/strict";
import { titleForPendingOption } from "@/lib/auto-trip-form";

assert.equal(
  titleForPendingOption("Me With Dalat", "Lộ trình 1: Trung tâm", 0, 1),
  "Me With Dalat",
);

assert.equal(
  titleForPendingOption("Me With Dalat", "Lộ trình 1: Trung tâm", 0, 3),
  "Me With Dalat · Trung tâm",
);

assert.equal(
  titleForPendingOption("Me With Dalat", "Lộ trình 2:", 1, 2),
  "Me With Dalat · Lộ trình 2",
);

assert.ok(titleForPendingOption("x".repeat(100), "y".repeat(50), 0, 2).length <= 120);

console.log("title-for-pending-option.test.ts: ok");

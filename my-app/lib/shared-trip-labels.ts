import {
  FORM_ACTIVITY_OPTIONS,
  FORM_ATMOSPHERE_OPTIONS,
  FORM_CONSTRAINT_OPTIONS,
  FORM_FOOD_OPTIONS,
  FORM_TARGET_CUSTOMER_OPTIONS,
  FORM_TRIP_TYPE_OPTIONS,
  labelForValue,
} from "@/lib/auto-trip-form";

export type SharedStyleChip = {
  key: string;
  /** e.g. "Loại chuyến" */
  group: string;
  /** e.g. "Nghỉ dưỡng" */
  label: string;
};

const TRIP_TYPES = new Set(FORM_TRIP_TYPE_OPTIONS.map((o) => o.value));
const TARGETS = new Set(FORM_TARGET_CUSTOMER_OPTIONS.map((o) => o.value));
const ATMOS = new Set(FORM_ATMOSPHERE_OPTIONS.map((o) => o.value));
const FOOD = new Set(FORM_FOOD_OPTIONS.map((o) => o.value));
const ACTIVITY = new Set(FORM_ACTIVITY_OPTIONS.map((o) => o.value));
const CONSTRAINT = new Set(FORM_CONSTRAINT_OPTIONS.map((o) => o.value));

function groupFor(value: string): string {
  if (TRIP_TYPES.has(value)) return "Loại chuyến";
  if (TARGETS.has(value)) return "Đối tượng";
  if (ATMOS.has(value) || value.startsWith("atmosphere:")) return "Không khí";
  if (FOOD.has(value) || value.startsWith("specialty:")) return "Ẩm thực";
  if (ACTIVITY.has(value) || value.startsWith("feature:") || value.startsWith("amenities:")) {
    if (CONSTRAINT.has(value)) return "Ràng buộc";
    return "Hoạt động";
  }
  if (CONSTRAINT.has(value)) return "Ràng buộc";
  return "Phong cách";
}

/** Clear, grouped labels for shared-trip style chips / filters. */
export function sharedStyleChips(input: {
  tripType?: string;
  targetCustomer?: string;
  preferences?: string[];
  limit?: number;
}): SharedStyleChip[] {
  const values = [
    input.tripType,
    input.targetCustomer,
    ...(input.preferences || []),
  ]
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter(Boolean);

  const seen = new Set<string>();
  const out: SharedStyleChip[] = [];
  const limit = input.limit ?? 12;

  for (const value of values) {
    if (seen.has(value)) continue;
    seen.add(value);
    out.push({
      key: value,
      group: groupFor(value),
      label: labelForValue(value),
    });
    if (out.length >= limit) break;
  }
  return out;
}

export function sharedStyleChipText(chip: SharedStyleChip): string {
  return `${chip.group}: ${chip.label}`;
}

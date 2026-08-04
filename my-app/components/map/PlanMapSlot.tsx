"use client";

import { MapboxMap } from "@/components/map/MapboxMap";

type PlanMapSlotProps = {
  className?: string;
};

/**
 * Map region inside generated-plan layout — fills its parent slot only
 * (not the whole viewport).
 */
export function PlanMapSlot({ className }: PlanMapSlotProps) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        minHeight: 420,
        overflow: "hidden",
        borderRadius: 24,
      }}
    >
      <MapboxMap className="absolute inset-0 h-full w-full" />
    </div>
  );
}

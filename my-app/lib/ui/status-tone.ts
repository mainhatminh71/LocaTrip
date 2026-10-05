import type { PaymentStatus } from "@/lib/api/payments";
import type { TripProgressStatus } from "@/lib/api/trips";

export type StatusTone = "paid" | "wait" | "muted" | "pending" | "ongoing" | "done";

export function paymentStatusTone(status: PaymentStatus): StatusTone {
  if (status === "paid") return "paid";
  if (status === "awaiting_transfer") return "wait";
  return "muted";
}

export function tripStatusTone(
  status?: TripProgressStatus | null,
): StatusTone {
  if (status === "Pending") return "pending";
  if (status === "OnGoing") return "ongoing";
  if (status === "Done") return "done";
  return "muted";
}

export function initialsFromName(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

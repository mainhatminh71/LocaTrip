import type { Metadata } from "next";
import { GeneratedPlanView } from "@/components/generated-plan/GeneratedPlanView";

export const metadata: Metadata = {
  title: "Lịch trình | LocaTrip",
  description: "Xem lịch trình đã tạo bởi LocaTrip.",
};

export default function GeneratedPlanPage() {
  return <GeneratedPlanView />;
}

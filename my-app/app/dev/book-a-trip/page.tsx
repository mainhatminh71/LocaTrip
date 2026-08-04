import type { Metadata } from "next";
import { BookATripView } from "@/components/book-a-trip/BookATripView";

export const metadata: Metadata = {
  title: "Lên kế hoạch Đà Lạt | LocaTrip (dev)",
  description:
    "React book-a-trip preview — same global tokens as production.",
};

export default function BookATripDevPage() {
  return <BookATripView />;
}

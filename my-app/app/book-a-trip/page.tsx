import type { Metadata } from "next";
import { BookATripView } from "@/components/book-a-trip/BookATripView";

export const metadata: Metadata = {
  title: "Lên kế hoạch Đà Lạt | LocaTrip",
  description:
    "Chia sẻ nhu cầu — LocaTrip thiết kế trải nghiệm tốt nhất dành cho bạn.",
};

/** Book-a-trip — uses global Framer tokens/fonts from app/globals.css */
export default function BookATripPage() {
  return <BookATripView />;
}

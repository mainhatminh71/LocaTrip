import type { Metadata } from "next";
import { BookATripClient } from "@/components/book-a-trip/BookATripClient";

export const metadata: Metadata = {
  title: "Lên kế hoạch Đà Lạt | LocaTrip",
  description:
    "Thiết lập chuyến đi Đà Lạt, trả lời câu hỏi và xem gợi ý địa điểm trước khi tạo lịch trình.",
};

export default function BookATripPage() {
  return <BookATripClient />;
}

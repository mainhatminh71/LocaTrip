import type { Metadata } from "next";
import { BookATripClient } from "@/components/book-a-trip/BookATripClient";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Lên kế hoạch Đà Lạt",
  description:
    "Thiết lập chuyến đi Đà Lạt, trả lời câu hỏi và xem gợi ý địa điểm trước khi tạo lịch trình trên bản đồ.",
  path: "/book-a-trip/",
});

export default function BookATripPage() {
  return <BookATripClient />;
}

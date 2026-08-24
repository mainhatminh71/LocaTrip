import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Đăng nhập",
  description: "Đăng nhập LocaTrip để lưu và chỉnh sửa chuyến đi.",
  path: "/login/",
  noIndex: true,
});

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

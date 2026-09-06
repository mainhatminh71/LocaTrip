import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Ví xu",
  description: "Số dư xu LocaTrip, nạp qua QR và lịch sử giao dịch.",
  path: "/wallet",
  noIndex: true,
});

export default function WalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

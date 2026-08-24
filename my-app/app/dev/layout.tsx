import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Dev",
  description: "Trang thử nghiệm LocaTrip.",
  path: "/dev/",
  noIndex: true,
});

export default function DevLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

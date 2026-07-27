import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LocaTrip - Productive Travel Planer Website",
  description:
    "Khám phá bản sắc nơi bạn đang đặt chân. Du lịch là để tận hưởng, không phải vội vã.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full">
      <body className="m-0 min-h-full p-0">{children}</body>
    </html>
  );
}

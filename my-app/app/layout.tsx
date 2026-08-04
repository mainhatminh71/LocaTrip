import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LocaTrip",
  description: "LocaTrip travel planner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="bg-white text-lt-ink antialiased">{children}</body>
    </html>
  );
}

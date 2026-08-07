import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { AuthModalProvider } from "@/components/auth/AuthModalProvider";
import { AccountFab } from "@/components/auth/AccountFab";
import "./globals.css";

export const metadata: Metadata = {
  title: "LocaTrip",
  description: "LocaTrip travel planner",
  icons: {
    icon: [{ url: "/media/logo.png", type: "image/png" }],
    apple: [{ url: "/media/logo.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="bg-white text-lt-ink antialiased">
        <AuthProvider>
          <AuthModalProvider>
            {children}
            <AccountFab />
          </AuthModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

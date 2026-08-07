import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { AuthModalProvider } from "@/components/auth/AuthModalProvider";
import { AccountFab } from "@/components/auth/AccountFab";
import { ImmersiveUiProvider } from "@/components/layout/ImmersiveUiContext";
import { ToastProvider } from "@/components/ui/ToastProvider";
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
            <ImmersiveUiProvider>
              <ToastProvider>
                {children}
                <AccountFab />
              </ToastProvider>
            </ImmersiveUiProvider>
          </AuthModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

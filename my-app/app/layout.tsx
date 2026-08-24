import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { AuthModalProvider } from "@/components/auth/AuthModalProvider";
import { AccountFab } from "@/components/auth/AccountFab";
import { ImmersiveUiProvider } from "@/components/layout/ImmersiveUiContext";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  DEFAULT_OG_IMAGE,
  SITE_DEFAULT_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Lên kế hoạch chuyến đi Đà Lạt`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "LocaTrip",
    "Đà Lạt",
    "lịch trình Đà Lạt",
    "du lịch Đà Lạt",
    "lên kế hoạch chuyến đi",
    "bản đồ lộ trình",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { telephone: false, email: false, address: false },
  icons: {
    icon: [{ url: "/media/logo.png", type: "image/png" }],
    apple: [{ url: "/media/logo.png", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: `${SITE_URL}/`,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Lên kế hoạch chuyến đi Đà Lạt`,
    description: SITE_DEFAULT_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Lên kế hoạch chuyến đi Đà Lạt`,
    description: SITE_DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
  alternates: {
    canonical: `${SITE_URL}/`,
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
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
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

import type { Metadata } from "next";

/** Canonical public origin (trailing slash stripped). */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL || "https://locatrip.app"
).replace(/\/$/, "");

export const SITE_NAME = "LocaTrip";

export const SITE_DEFAULT_DESCRIPTION =
  "Lên kế hoạch chuyến đi Đà Lạt thông minh — gợi ý địa điểm, lộ trình và bản đồ theo tiêu chí của bạn.";

/** Absolute URL for Open Graph / JSON-LD (respects trailingSlash on paths). */
export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return `${SITE_URL}/`;
  const withSlash = path.startsWith("/") ? path : `/${path}`;
  const normalized = withSlash.endsWith("/") ? withSlash : `${withSlash}/`;
  return `${SITE_URL}${normalized}`;
}

export function absoluteAsset(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}

/** Default social share image (landscape). */
export const DEFAULT_OG_IMAGE = absoluteAsset("/media/cta-banner.jpg");

type BuildMetaInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article";
  /** Bypass root `title.template` (use on homepage). */
  absoluteTitle?: boolean;
};

/**
 * Shared Metadata builder — title, description, canonical, Open Graph, Twitter.
 */
export function buildPageMetadata({
  title,
  description,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
  type = "website",
  absoluteTitle = false,
}: BuildMetaInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = absoluteAsset(image);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      locale: "vi_VN",
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    logo: absoluteAsset("/media/logo.png"),
    description: SITE_DEFAULT_DESCRIPTION,
    areaServed: {
      "@type": "City",
      name: "Đà Lạt",
      containedInPlace: { "@type": "Country", name: "Vietnam" },
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description: SITE_DEFAULT_DESCRIPTION,
    inLanguage: "vi-VN",
    publisher: { "@type": "Organization", name: SITE_NAME },
  };
}

export function blogPostingJsonLd(input: {
  title: string;
  description: string;
  path: string;
  image: string;
  author: string;
  datePublished?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    image: absoluteAsset(input.image),
    author: { "@type": "Person", name: input.author },
    datePublished: input.datePublished,
    mainEntityOfPage: absoluteUrl(input.path),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteAsset("/media/logo.png"),
      },
    },
  };
}

export function tourJsonLd(input: {
  title: string;
  description: string;
  path: string;
  image: string;
  priceLabel?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: input.title,
    description: input.description,
    image: absoluteAsset(input.image),
    url: absoluteUrl(input.path),
    touristType: "Leisure",
    itinerary: {
      "@type": "ItemList",
      name: input.title,
    },
    offers: input.priceLabel
      ? {
          "@type": "Offer",
          priceCurrency: "VND",
          // Keep display label; Google ignores non-numeric prices gracefully.
          description: input.priceLabel,
          availability: "https://schema.org/InStock",
          url: absoluteUrl(input.path),
        }
      : undefined,
  };
}

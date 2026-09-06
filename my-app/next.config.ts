import type { NextConfig } from "next";

/** Helps Next define-plugin inline public Mapbox config when OpenNext allows it. */
const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN:
      process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "",
    NEXT_PUBLIC_MAPBOX_STYLE:
      process.env.NEXT_PUBLIC_MAPBOX_STYLE ??
      "mapbox://styles/mapbox/outdoors-v12",
  },
  trailingSlash: false,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  // Avoid Turbopack mis-detecting monorepo root.
  turbopack: {
    root: process.cwd(),
  },
  images: {
    // OpenNext IMAGES binding re-transforms on most hits (~1s+ TTFB) and
    // /cdn-cgi/image requires Image Resizing (not enabled on locatrip.app).
    // Serve pre-compressed static assets from Workers ASSETS instead.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "framerusercontent.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;

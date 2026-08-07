import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
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

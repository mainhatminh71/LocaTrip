import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const BASE = "/scrape/locatrip.framer.website";

/** Routes scraped from locatrip.framer.website */
const STATIC_DIRS = new Set([
  "about",
  "blogs",
  "book-a-trip",
  "destinations",
  "generated-plan",
  "policies",
  "tours",
  "404",
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Local CDN mirror
  if (pathname.startsWith("/framerusercontent.com/")) {
    return NextResponse.rewrite(
      new URL(`/scrape${pathname}`, request.url),
    );
  }
  if (pathname.startsWith("/fonts.gstatic.com/")) {
    return NextResponse.rewrite(
      new URL(`/scrape${pathname}`, request.url),
    );
  }

  // Don't touch Next/static internals or the scrape tree itself
  if (
    pathname.startsWith("/scrape/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (pathname === "/" || pathname === "") {
    return NextResponse.rewrite(new URL(`${BASE}/index.html`, request.url));
  }

  const parts = pathname.split("/").filter(Boolean);
  const root = parts[0] ?? "";

  if (STATIC_DIRS.has(root) || parts.length >= 1) {
    const candidate = `${BASE}${pathname.replace(/\/$/, "")}/index.html`;
    return NextResponse.rewrite(new URL(candidate, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/about/:path*",
    "/blogs/:path*",
    "/book-a-trip/:path*",
    "/destinations/:path*",
    "/generated-plan/:path*",
    "/policies/:path*",
    "/tours/:path*",
    "/404/:path*",
    "/framerusercontent.com/:path*",
    "/fonts.gstatic.com/:path*",
  ],
};

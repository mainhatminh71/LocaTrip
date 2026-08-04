import { SCRAPE_SITE, servePublicFile } from "@/lib/serve-public";

/**
 * Marketing homepage = scraped Framer UI (pixel-faithful).
 * React sections under components/ are for gradual port / app features.
 */
export async function GET() {
  const res = await servePublicFile([
    [...SCRAPE_SITE, "index.html"],
    ["index.html"],
  ]);
  return res ?? new Response("Homepage not found", { status: 404 });
}

import { SCRAPE_SITE, servePublicFile } from "@/lib/serve-public";

/** Serve scraped Framer homepage from disk (no redirect / no self-fetch). */
export async function GET() {
  const res = await servePublicFile([
    [...SCRAPE_SITE, "index.html"],
    ["index.html"],
  ]);
  return res ?? new Response("Homepage not found", { status: 404 });
}

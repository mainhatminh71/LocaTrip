import { SCRAPE_SITE, servePublicFile } from "@/lib/serve-public";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string[] }> };

/**
 * Fallback for marketing routes not yet ported to React pages
 * (/about, /tours, …) — serve scraped Framer HTML from disk.
 * React routes (/generated-plan, /map, /dev/home) take precedence via App Router.
 * `/` is served by app/route.ts (Framer scrape).
 */
export async function GET(_request: Request, context: Ctx) {
  const { slug } = await context.params;

  const candidates: string[][] = [
    [...slug, "index.html"],
    [...slug],
    [...SCRAPE_SITE, ...slug, "index.html"],
    [...SCRAPE_SITE, ...slug],
  ];

  const res = await servePublicFile(candidates);
  return res ?? new Response("Not found", { status: 404 });
}

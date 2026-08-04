import { SCRAPE_SITE, servePublicFile } from "@/lib/serve-public";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string[] }> };

/** Map /about, /tours/..., etc. to scraped Framer HTML assets on disk. */
export async function GET(_request: Request, context: Ctx) {
  const { slug } = await context.params;

  // Let /scrape/** fall through to Next static serving when possible;
  // if this handler still runs, read the file from public/scrape directly.
  const candidates: string[][] = [
    [...slug, "index.html"],
    [...slug],
    [...SCRAPE_SITE, ...slug, "index.html"],
    [...SCRAPE_SITE, ...slug],
  ];

  const res = await servePublicFile(candidates);
  return res ?? new Response("Not found", { status: 404 });
}

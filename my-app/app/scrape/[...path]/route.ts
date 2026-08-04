import { servePublicFile } from "@/lib/serve-public";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ path: string[] }> };

/** Explicit scrape asset/HTML fallback under /scrape/... */
export async function GET(_request: Request, context: Ctx) {
  const { path } = await context.params;
  const candidates: string[][] = [
    ["scrape", ...path, "index.html"],
    ["scrape", ...path],
  ];
  const res = await servePublicFile(candidates);
  return res ?? new Response("Not found", { status: 404 });
}

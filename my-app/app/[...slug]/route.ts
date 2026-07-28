export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string[] }> };

/** Map /about, /tours/..., etc. to scraped Framer HTML assets. */
export async function GET(request: Request, context: Ctx) {
  const { slug } = await context.params;
  const rel = slug.join("/");

  const candidates = [
    `/scrape/locatrip.framer.website/${rel}/index.html`,
    `/scrape/locatrip.framer.website/${rel}`,
    `/${rel}/index.html`,
    `/${rel}`,
  ];

  for (const candidate of candidates) {
    const asset = await fetch(new URL(candidate, request.url));
    if (!asset.ok) continue;

    const contentType =
      asset.headers.get("content-type") ||
      (candidate.endsWith(".html")
        ? "text/html; charset=utf-8"
        : "application/octet-stream");

    return new Response(await asset.arrayBuffer(), {
      status: 200,
      headers: {
        "content-type": contentType,
        "cache-control": "public, max-age=60",
      },
    });
  }

  return new Response("Not found", { status: 404 });
}

import { readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

/**
 * Visual reference only: Chrome-saved Framer homepage.
 * Do not build product logic here — develop on React `/`.
 */
export async function GET() {
  const filePath = path.join(
    process.cwd(),
    "public",
    "homepage-exact",
    "index.html",
  );
  try {
    const html = await readFile(filePath, "utf8");
    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new Response(
      "Missing public/homepage-exact. Run: node scripts/import-saved-homepage.mjs",
      { status: 404 },
    );
  }
}

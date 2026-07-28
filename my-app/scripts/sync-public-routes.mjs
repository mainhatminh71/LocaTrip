/**
 * Materialize scraped Framer pages at public URL paths so Cloudflare Assets
 * can serve /about, /tours, etc. without Next rewrites.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(root, "..");
const publicDir = path.join(appRoot, "public");
const scrapeSite = path.join(publicDir, "scrape", "locatrip.framer.website");
const scrapeCdn = path.join(publicDir, "scrape", "framerusercontent.com");
const scrapeFonts = path.join(publicDir, "scrape", "fonts.gstatic.com");

function rmrf(p) {
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else {
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.copyFileSync(from, to);
    }
  }
}

// Clean previously synced route folders (keep /scrape source of truth)
const routeDirs = [
  "about",
  "blogs",
  "book-a-trip",
  "destinations",
  "generated-plan",
  "policies",
  "tours",
  "404",
  "framerusercontent.com",
  "fonts.gstatic.com",
];
for (const d of routeDirs) rmrf(path.join(publicDir, d));
rmrf(path.join(publicDir, "index.html"));

// Copy site pages to public root paths
copyDir(scrapeSite, publicDir);

// Restore scrape tree if copyDir flattened over it — scrape must remain
// Actually copyDir(scrapeSite, publicDir) copies index.html + about/ + ...
// It may also try to nest scrape/ if present inside scrapeSite — it isn't.

// CDN mirrors at URL roots expected by relative HTML links
copyDir(scrapeCdn, path.join(publicDir, "framerusercontent.com"));
copyDir(scrapeFonts, path.join(publicDir, "fonts.gstatic.com"));

console.log("[sync-routes] public routes ready");

/**
 * Patch scraped Framer HTML so absolute CDN URLs point to local /framerusercontent.com
 * when those files exist under public/scrape.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scrapeRoot = path.resolve(__dirname, "..", "..", "my-app", "public", "scrape");
const htmlRoot = path.join(scrapeRoot, "locatrip.framer.website");

function existsLocal(absUrl) {
  try {
    const u = new URL(absUrl);
    const local = path.join(scrapeRoot, u.hostname, decodeURIComponent(u.pathname).replace(/^\//, ""));
    // website-scraper often renames query strings into filename
    if (fs.existsSync(local)) return true;
    const dir = path.dirname(local);
    const base = path.basename(local);
    if (!fs.existsSync(dir)) return false;
    return fs.readdirSync(dir).some((f) => f.startsWith(base.split("?")[0].split("_")[0]) || f.includes(path.parse(base).name.slice(0, 12)));
  } catch {
    return false;
  }
}

function toLocalPath(absUrl) {
  const u = new URL(absUrl);
  return `/${u.hostname}${u.pathname}${u.search}`;
}

let patchedFiles = 0;
let replacements = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".html")) {
      let html = fs.readFileSync(full, "utf8");
      const before = html;
      html = html.replace(
        /https:\/\/framerusercontent\.com\/[^"'\\\s>]+/g,
        (url) => {
          const clean = url.replace(/&amp;/g, "&");
          // Always rewrite sites/*.mjs and images we mirrored
          if (
            clean.includes("/sites/") ||
            clean.includes("/images/") ||
            clean.includes("/assets/")
          ) {
            replacements += 1;
            return toLocalPath(clean).replace(/&/g, "&amp;");
          }
          return url;
        },
      );
      if (html !== before) {
        fs.writeFileSync(full, html);
        patchedFiles += 1;
      }
    }
  }
}

walk(htmlRoot);
console.log(`[patch] files=${patchedFiles} replacements=${replacements}`);

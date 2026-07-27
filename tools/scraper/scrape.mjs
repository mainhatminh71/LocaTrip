import scrape from "website-scraper";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..", "..");
const outDir = path.join(root, "locatrip-scrape");

if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
}

const SITE = "https://locatrip.framer.website";

const options = {
  urls: [SITE, `${SITE}/`],
  directory: outDir,
  recursive: true,
  maxRecursiveDepth: 2,
  maxDepth: 3,
  prettifyUrls: true,
  filenameGenerator: "bySiteStructure",
  requestConcurrency: 6,
  ignoreErrors: true,
  urlFilter: (url) => {
    try {
      const u = new URL(url);
      const host = u.hostname;
      return (
        host === "locatrip.framer.website" ||
        host.endsWith(".framer.website") ||
        host === "framerusercontent.com" ||
        host.endsWith(".framerusercontent.com") ||
        host === "fonts.gstatic.com" ||
        host === "fonts.googleapis.com"
      );
    } catch {
      return false;
    }
  },
  sources: [
    { selector: "img", attr: "src" },
    { selector: "img", attr: "srcset" },
    { selector: "source", attr: "src" },
    { selector: "source", attr: "srcset" },
    { selector: "video", attr: "src" },
    { selector: "video", attr: "poster" },
    { selector: "audio", attr: "src" },
    { selector: "link[rel='stylesheet']", attr: "href" },
    { selector: "link[rel='preload']", attr: "href" },
    { selector: "link[rel='icon']", attr: "href" },
    { selector: "link[rel='apple-touch-icon']", attr: "href" },
    { selector: "link[as='image']", attr: "href" },
    { selector: "link[as='font']", attr: "href" },
    { selector: "link[as='script']", attr: "href" },
    { selector: "link[as='style']", attr: "href" },
    { selector: "meta[property='og:image']", attr: "content" },
    { selector: "script", attr: "src" },
    { selector: "a", attr: "href" },
  ],
  subdirectories: [
    { directory: "img", extensions: [".jpg", ".jpeg", ".png", ".svg", ".gif", ".webp", ".avif", ".ico"] },
    { directory: "js", extensions: [".js", ".mjs"] },
    { directory: "css", extensions: [".css"] },
    { directory: "font", extensions: [".woff", ".woff2", ".ttf", ".eot", ".otf"] },
    { directory: "media", extensions: [".mp4", ".webm", ".mp3"] },
  ],
  request: {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    },
  },
};

console.log(`[scrape] start → ${outDir}`);
const started = Date.now();

try {
  const result = await scrape(options);
  console.log(`[scrape] done in ${((Date.now() - started) / 1000).toFixed(1)}s`);
  console.log(`[scrape] resources: ${result.length}`);
  for (const r of result.slice(0, 30)) {
    console.log(`  - ${r.url} → ${r.filename}`);
  }
  if (result.length > 30) console.log(`  ... +${result.length - 30} more`);
} catch (err) {
  console.error("[scrape] failed:", err);
  process.exit(1);
}

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import scrape from "website-scraper";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..", "..");
const scrapeRoot = path.join(root, "locatrip-scrape");
const htmlDir = path.join(scrapeRoot, "locatrip.framer.website");

function collectUrls(dir, urls = new Set()) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectUrls(full, urls);
    else if (entry.name.endsWith(".html")) {
      const html = fs.readFileSync(full, "utf8");
      for (const m of html.matchAll(/https:\/\/framerusercontent\.com\/[^"'\\\s>]+/g)) {
        urls.add(m[0].replace(/&amp;/g, "&").replace(/\\u002F/g, "/"));
      }
      for (const m of html.matchAll(/https:\/\/fonts\.gstatic\.com\/[^"'\\\s>]+/g)) {
        urls.add(m[0]);
      }
    }
  }
  return urls;
}

const urls = [...collectUrls(htmlDir)];
console.log(`[deep] found ${urls.length} absolute CDN urls in HTML`);

const sites = urls.filter((u) => u.includes("/sites/"));
const fonts = urls.filter((u) => u.includes("fonts.gstatic.com") || u.includes("/assets/") && u.endsWith(".woff2"));
const images = urls.filter((u) => u.includes("/images/") || u.includes("/assets/"));
const wanted = [...new Set([...sites, ...fonts.slice(0, 80), ...images])];

console.log(`[deep] downloading ${wanted.length} resources…`);

const tmp = path.join(root, "locatrip-scrape-deep-tmp");
if (fs.existsSync(tmp)) fs.rmSync(tmp, { recursive: true, force: true });

await scrape({
  urls: wanted.map((url) => ({ url, filename: undefined })),
  directory: tmp,
  filenameGenerator: "bySiteStructure",
  requestConcurrency: 8,
  ignoreErrors: true,
  maxDepth: 2,
  urlFilter: (url) =>
    url.includes("framerusercontent.com") || url.includes("fonts.gstatic.com"),
  request: {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    },
  },
});

function mergeCopy(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) mergeCopy(from, to);
    else {
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.copyFileSync(from, to);
    }
  }
}

mergeCopy(path.join(tmp, "framerusercontent.com"), path.join(scrapeRoot, "framerusercontent.com"));
mergeCopy(path.join(tmp, "fonts.gstatic.com"), path.join(scrapeRoot, "fonts.gstatic.com"));
fs.rmSync(tmp, { recursive: true, force: true });

const mjs = [];
function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f);
    else if (/\.(mjs|js|woff2)$/.test(e.name)) mjs.push(f);
  }
}
walk(scrapeRoot);
console.log(`[deep] total js/font files now: ${mjs.length}`);
console.log(mjs.slice(0, 40).map((p) => path.relative(scrapeRoot, p)).join("\n"));

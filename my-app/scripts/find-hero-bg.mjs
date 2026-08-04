import fs from "node:fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(
  process.env.USERPROFILE,
  "Downloads",
  "LocaTrip - Productive Travel Planer Website.html",
);
const html = fs.readFileSync(htmlPath, "utf8");

// Find "bản sắc" and dump nearby img urls within ±3000 chars
const key = "bản sắc";
let i = html.indexOf(key);
console.log("first bản sắc at", i);
while (i !== -1) {
  const slice = html.slice(Math.max(0, i - 5000), i + 3000);
  const imgs = [
    ...slice.matchAll(
      /(?:srcset|src|url\()[=:"'\s]*([^"'\\\s)]+\.(?:jpg|jpeg|png|webp))/gi,
    ),
  ].map((m) => m[1]);
  console.log("\n--- context imgs ---");
  console.log([...new Set(imgs)].slice(0, 20).join("\n"));
  i = html.indexOf(key, i + 1);
  if (i > 0 && i < html.indexOf(key) + 200000) break; // first few only
}

// Also search for framer name Hero
for (const name of ["Hero", "hero", "Background", "Banner", "Floating"]) {
  const re = new RegExp(`data-framer-name="${name}[^"]*"`, "g");
  const hits = [...html.matchAll(re)];
  console.log(name, "hits", hits.length, hits.slice(0, 3).map((h) => h[0]));
}

// Search background-image in early main
const main = html.indexOf('id="main"');
const chunk = html.slice(main, main + 120000);
const bgs = [
  ...chunk.matchAll(/background-image:\s*url\(([^)]+)\)/g),
].map((m) => m[1].replace(/['"]/g, ""));
console.log("\nbg images early main:\n", [...new Set(bgs)].slice(0, 25).join("\n"));

// img tags with sizes that look like full bleed
const imgs2 = [...chunk.matchAll(/<img[^>]+>/g)].slice(0, 15);
for (const tag of imgs2) {
  const src = (tag[0].match(/src="([^"]+)"/) || [])[1];
  const sizes = (tag[0].match(/sizes="([^"]+)"/) || [])[1];
  const w = (tag[0].match(/width="([^"]+)"/) || [])[1];
  console.log("IMG", w, sizes?.slice(0, 40), src?.slice(-60));
}

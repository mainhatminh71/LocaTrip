import fs from "node:fs";
import path from "node:path";

const src = path.join(
  process.env.USERPROFILE || "",
  "Downloads",
  "LocaTrip - Productive Travel Planer Website.html",
);
const html = fs.readFileSync(src, "utf8");

// Find img/srcset near hero-ish keywords
const idxs = [];
for (const key of [
  "bản sắc",
  "Khám phá",
  "Khu vực",
  "124k",
  "travellers",
  "followers",
]) {
  let i = 0;
  while ((i = html.indexOf(key, i)) !== -1) {
    idxs.push({ key, i });
    i += key.length;
  }
}
console.log("keyword hits", idxs.length);

// Extract all image URLs with surrounding context snippets
const re =
  /(?:src|srcset|url\(|background-image:\s*url\()["']?(https:\/\/framerusercontent\.com\/images\/[A-Za-z0-9._%-]+)/g;
const urls = [];
let m;
while ((m = re.exec(html))) {
  urls.push({ url: m[1], at: m.index });
}

// Also local asset refs
const re2 = /\/homepage-exact\/assets\/[^"'\\\s>]+|\.\/LocaTrip[^"'\\\s>]+_files\/[^"'\\\s>]+/g;
const locals = [...html.matchAll(re2)].map((x) => x[0]);

// Find hero background candidates by looking at large images near start of main
const mainIdx = html.indexOf('id="main"');
const heroSlice = html.slice(mainIdx, mainIdx + 80000);
const heroImgs = [
  ...heroSlice.matchAll(
    /https:\/\/framerusercontent\.com\/images\/([A-Za-z0-9]+)(?:\.[a-z]+)?/g,
  ),
].map((x) => x[0]);
console.log("unique hero-slice imgs", [...new Set(heroImgs)].slice(0, 30));

// Dump first appearance order of images in #main
const order = [];
const seen = new Set();
for (const u of heroImgs) {
  if (!seen.has(u)) {
    seen.add(u);
    order.push(u);
  }
}
fs.writeFileSync(
  path.join(process.cwd(), "scripts", "_hero-imgs-order.txt"),
  order.join("\n"),
);
console.log("wrote", order.length);

// Check local homepage-exact assets that look like hero bg
const assetsDir = path.join(process.cwd(), "public/homepage-exact/assets");
if (fs.existsSync(assetsDir)) {
  const big = fs
    .readdirSync(assetsDir)
    .map((n) => ({ n, s: fs.statSync(path.join(assetsDir, n)).size }))
    .filter((x) => x.s > 1_000_000)
    .sort((a, b) => b.s - a.s);
  console.log(
    "big local assets:\n",
    big
      .slice(0, 15)
      .map((x) => `${(x.s / 1e6).toFixed(1)}MB ${x.n}`)
      .join("\n"),
  );
}

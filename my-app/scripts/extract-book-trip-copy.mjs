import fs from "node:fs";
import path from "node:path";

const html = fs.readFileSync(
  path.join(
    process.cwd(),
    "public/scrape/locatrip.framer.website/book-a-trip/index.html",
  ),
  "utf8",
);

const text = html
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, "\n")
  .replace(/&nbsp;/g, " ")
  .replace(/&amp;/g, "&")
  .replace(/&#x27;/g, "'")
  .split("\n")
  .map((s) => s.trim())
  .filter(Boolean);

const uniq = [];
for (const t of text) {
  if (t.length < 2 || t.length > 160) continue;
  if (/framer|http|function|const |undefined/i.test(t)) continue;
  if (!uniq.includes(t)) uniq.push(t);
}
console.log(uniq.join("\n"));

const imgs = [
  ...new Set(
    [
      ...html.matchAll(
        /(?:src|srcset)=["']([^"']+\.(?:png|jpg|jpeg|webp))/gi,
      ),
    ].map((m) => m[1].replace(/^\.\.\/\.\.\//, "/scrape/").replace(/^\.\.\//, "/scrape/locatrip.framer.website/")),
  ),
];
console.log("\n---IMGS---");
imgs.slice(0, 40).forEach((u) => console.log(u));

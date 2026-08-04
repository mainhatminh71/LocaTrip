import fs from "node:fs";
import path from "node:path";

const src = path.join(
  process.env.USERPROFILE || "",
  "Downloads",
  "LocaTrip - Productive Travel Planer Website.html",
);
const html = fs.readFileSync(src, "utf8");

const text = html
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, "\n")
  .replace(/&nbsp;/g, " ")
  .replace(/&amp;/g, "&")
  .replace(/&#x27;/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
  .split("\n")
  .map((s) => s.trim())
  .filter(Boolean);

const uniq = [];
for (const t of text) {
  if (t.length < 2 || t.length > 180) continue;
  if (/^[{}\[\]0-9.\spx%#,;:_-]+$/.test(t)) continue;
  if (/framer|http|function|const |var |undefined|null|true|false/i.test(t))
    continue;
  if (!uniq.includes(t)) uniq.push(t);
}

fs.writeFileSync(
  path.join(process.cwd(), "scripts", "_extracted-home-copy.txt"),
  uniq.join("\n"),
  "utf8",
);

// framerusercontent image urls
const imgs = [
  ...new Set(
    [...html.matchAll(/https:\/\/framerusercontent\.com\/images\/[A-Za-z0-9]+(?:\.[a-z]+)?/g)].map(
      (m) => m[0],
    ),
  ),
];
fs.writeFileSync(
  path.join(process.cwd(), "scripts", "_extracted-home-images.txt"),
  imgs.join("\n"),
  "utf8",
);

console.log("copy lines", uniq.length);
console.log("images", imgs.length);
console.log(uniq.slice(0, 80).join(" | "));

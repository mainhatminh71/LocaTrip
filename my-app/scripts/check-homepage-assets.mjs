import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(
  path.join(root, "public/homepage-exact/index.html"),
  "utf8",
);
const re = /\/homepage-exact\/assets\/[^"'\\\s>]+/g;
const refs = [...new Set(html.match(re) || [])];
const missing = [];
for (const r of refs) {
  const decoded = decodeURIComponent(r);
  const ok =
    fs.existsSync(path.join(root, "public" + decoded)) ||
    fs.existsSync(path.join(root, "public" + r));
  if (!ok) missing.push(r);
}
console.log("refs", refs.length, "missing", missing.length);
missing.slice(0, 20).forEach((m) => console.log(m));
const idx = html.indexOf("__framer-editorbar");
console.log("editorbar idx", idx);
if (idx >= 0) console.log(html.slice(Math.max(0, idx - 80), idx + 120));
console.log("has patch", html.includes("locatrip-exact-home-fix"));

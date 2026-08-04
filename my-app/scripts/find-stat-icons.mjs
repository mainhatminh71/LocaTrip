import fs from "node:fs";
import path from "node:path";

const html = fs.readFileSync(
  path.join(
    process.env.USERPROFILE,
    "Downloads",
    "LocaTrip - Productive Travel Planer Website.html",
  ),
  "utf8",
);
const i = html.indexOf("124k");
console.log("idx", i);
const slice = html.slice(Math.max(0, i - 4000), i + 1500);
const imgs = [...slice.matchAll(/src="([^"]+)"/g)].map((m) => m[1]);
console.log("srcs:\n", imgs.join("\n"));
const files = [...slice.matchAll(/Website_files\/([^"'\s>]+)/g)].map(
  (m) => m[1],
);
console.log("files:\n", files.join("\n"));

// list all svgs content titles
const dir = path.join(process.cwd(), "public/homepage-exact/assets");
for (const n of fs.readdirSync(dir).filter((x) => x.endsWith(".svg"))) {
  const t = fs.readFileSync(path.join(dir, n), "utf8").slice(0, 120);
  console.log(n, t.replace(/\s+/g, " ").slice(0, 100));
}

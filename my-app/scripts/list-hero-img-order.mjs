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
const main = html.indexOf('id="main"');
const chunk = html.slice(main, main + 150000);
const imgs = [...chunk.matchAll(/<img[^>]+>/g)];
for (const tag of imgs.slice(0, 20)) {
  const src = (tag[0].match(/src="([^"]+)"/) || [])[1] || "";
  const name = src.split("/").pop();
  console.log(name);
}

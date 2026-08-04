/**
 * Sync exact Framer hero assets from Chrome-save _files → public/home
 * (same hashes / order as the saved HTML <img> list).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(
  process.env.USERPROFILE || "",
  "Downloads",
  "LocaTrip - Productive Travel Planer Website_files",
);
const outDir = path.join(root, "public", "home");

const map = [
  ["Q5Q0XrMuClqfubvjeQIYmOyv2E(3).jpg", "hero-bg.jpg"],
  ["v49oOI48d3RXwd8vqkpLaDPhHQ(2).png", "float-1.png"],
  ["hKQgE9HtZpQYmCrB9TUKknwClUc(2).png", "float-2.png"],
  ["fSxFhc30UAjyiM1I8zi9IF1xuI(2).png", "float-3.png"],
  ["2YK8HCPs0G7EfCyYs6iAfiJk4w(2).png", "float-4.png"],
  ["558RNrhUApov3HeiOMs9CTGdiY(2).png", "logo.png"],
  ["UOUuToFyBUEcovHRhHOL4CD6HU(2).svg", "icon-people.svg"],
  ["FnT7bORJrex7gGFusO6uKFvL5gs(2).svg", "icon-pin.svg"],
  ["zY4taqI0GsmZlS5BJPqQpvA7pKc(2).svg", "icon-bird.svg"],
];

if (!fs.existsSync(srcDir)) {
  console.error("Missing _files:", srcDir);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });
for (const [from, to] of map) {
  const a = path.join(srcDir, from);
  if (!fs.existsSync(a)) {
    console.warn("skip missing", from);
    continue;
  }
  fs.copyFileSync(a, path.join(outDir, to));
  console.log("ok", to);
}

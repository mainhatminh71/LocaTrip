import { chromium } from "playwright";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "tmp-nav-shots");
fs.mkdirSync(OUT, { recursive: true });
const SCRAPE_ROOT = path.join(__dirname, "..", "..", "locatrip-scrape");

function contentType(p) {
  if (p.endsWith(".html")) return "text/html; charset=utf-8";
  if (p.endsWith(".css")) return "text/css";
  if (p.endsWith(".js") || p.endsWith(".mjs")) return "text/javascript";
  if (p.endsWith(".png")) return "image/png";
  if (p.endsWith(".jpg") || p.endsWith(".jpeg")) return "image/jpeg";
  if (p.endsWith(".woff2")) return "font/woff2";
  return "application/octet-stream";
}

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  if (urlPath.endsWith("/")) urlPath += "index.html";
  const filePath = path.join(SCRAPE_ROOT, urlPath.replace(/^\//, ""));
  if (!filePath.startsWith(SCRAPE_ROOT) || !fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end("missing");
    return;
  }
  res.writeHead(200, { "Content-Type": contentType(filePath) });
  fs.createReadStream(filePath).pipe(res);
});
await new Promise((r) => server.listen(3456, r));

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
});

await page.goto(
  "http://127.0.0.1:3456/locatrip.framer.website/book-a-trip/",
  { waitUntil: "networkidle", timeout: 90000 },
);
await page.waitForTimeout(2000);

// Measure closed capsule
const closed = await page.evaluate(() => {
  const nav = document.querySelector('[data-framer-name="Black-dekstop"]');
  const capsule = document.querySelector(
    '[data-framer-name="Black-dekstop"] [data-framer-name="Container"]',
  );
  const menu = document.querySelector('[data-framer-name="Menu"]');
  return {
    nav: nav?.getBoundingClientRect().toJSON(),
    capsule: capsule?.getBoundingClientRect().toJSON(),
    menu: menu?.getBoundingClientRect().toJSON(),
  };
});
console.log("CLOSED", JSON.stringify(closed, null, 2));

await page.locator('[data-framer-name="Menu"]').first().click({ timeout: 8000 });
await page.waitForTimeout(1500);

const open = await page.evaluate(() => {
  const all = [...document.querySelectorAll("[data-framer-name]")].map((el) => {
    const r = el.getBoundingClientRect();
    return {
      name: el.getAttribute("data-framer-name"),
      x: Math.round(r.x),
      y: Math.round(r.y),
      w: Math.round(r.width),
      h: Math.round(r.height),
      vis: getComputedStyle(el).visibility,
      op: getComputedStyle(el).opacity,
      display: getComputedStyle(el).display,
    };
  });
  return all.filter((a) => a.w > 5 && a.h > 5 && a.op !== "0" && Number(a.op) > 0.05);
});
console.log(
  "OPEN visible named",
  open.filter((o) =>
    /Menu|Close|Open|Logo|Container|Black|Blur|Bottom|Image|Nav|Social|Facebook|Get|Buy/i.test(
      o.name,
    ),
  ),
);

await page.screenshot({
  path: path.join(OUT, "framer-open-full.png"),
  fullPage: false,
});
await page.screenshot({
  path: path.join(OUT, "framer-open-top.png"),
  clip: { x: 0, y: 0, width: 1440, height: 120 },
});

await browser.close();
server.close();
console.log("done");

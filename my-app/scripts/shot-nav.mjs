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
  if (p.endsWith(".svg")) return "image/svg+xml";
  if (p.endsWith(".woff2")) return "font/woff2";
  return "application/octet-stream";
}

async function startScrapeServer() {
  const server = http.createServer((req, res) => {
    let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    if (urlPath.endsWith("/")) urlPath += "index.html";
    const filePath = path.join(SCRAPE_ROOT, urlPath.replace(/^\//, ""));
    if (!filePath.startsWith(SCRAPE_ROOT) || !fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end("missing " + urlPath);
      return;
    }
    res.writeHead(200, { "Content-Type": contentType(filePath) });
    fs.createReadStream(filePath).pipe(res);
  });
  await new Promise((r) => server.listen(3456, r));
  return server;
}

const server = await startScrapeServer();
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});

const framer = await context.newPage();
await framer.goto(
  "http://127.0.0.1:3456/locatrip.framer.website/book-a-trip/",
  { waitUntil: "networkidle", timeout: 90000 },
);
await framer.waitForTimeout(1500);
await framer.screenshot({
  path: path.join(OUT, "framer-closed.png"),
  clip: { x: 0, y: 0, width: 1440, height: 140 },
});

const react = await context.newPage();
await react.goto("http://localhost:3000/book-a-trip/", {
  waitUntil: "networkidle",
  timeout: 90000,
});
await react.waitForTimeout(1500);
await react.screenshot({
  path: path.join(OUT, "react-closed.png"),
  clip: { x: 0, y: 0, width: 1440, height: 140 },
});

await react.click('button[aria-label="Mở menu"]');
await react.waitForTimeout(900);
await react.screenshot({
  path: path.join(OUT, "react-open.png"),
  fullPage: false,
});

try {
  await framer.locator('[data-framer-name="Menu"]').first().click({ timeout: 8000 });
  await framer.waitForTimeout(1200);
  await framer.screenshot({
    path: path.join(OUT, "framer-open.png"),
    fullPage: false,
  });
} catch (e) {
  console.log("framer open click failed:", e.message);
}

await browser.close();
server.close();
console.log("wrote shots to", OUT);

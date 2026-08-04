import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "tmp-nav-shots");
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/book-a-trip/", {
  waitUntil: "networkidle",
  timeout: 60000,
});
await page.waitForTimeout(800);
await page.screenshot({
  path: path.join(OUT, "react-closed.png"),
  clip: { x: 0, y: 0, width: 1440, height: 140 },
});
await page.click('button[aria-label="Mở menu"]');
await page.waitForTimeout(900);

const m = await page.evaluate(() => {
  const pick = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: Math.round(r.x),
      y: Math.round(r.y),
      w: Math.round(r.width),
      h: Math.round(r.height),
    };
  };
  return {
    capsule: pick('[data-framer-name="Container"]'),
    overlayTop: pick('[data-framer-name="Dekstop Transparent"]'),
    overlayLogo: pick('[data-framer-name="Dekstop Transparent"] [data-framer-name="Logo"]'),
    overlayClose: pick('[data-framer-name="Dekstop Transparent"] [data-framer-name="Menu"]'),
    photo: pick('[data-framer-name="Wrapper-photo-nav"]'),
    rightMenu: pick('[data-framer-name="Right Menu"]'),
    bottom: pick('[data-framer-name="Bottom-menu"]'),
    social: pick('[data-framer-name="Social Wrapper"]'),
    contact: pick('[data-framer-name="Get In Touch"]'),
    links: [...document.querySelectorAll('[data-framer-name="Desktop Navlinks"]')].map(
      (el) => {
        const r = el.getBoundingClientRect();
        return { y: Math.round(r.y), h: Math.round(r.height), t: el.textContent?.trim() };
      },
    ),
  };
});
console.log(JSON.stringify(m, null, 2));
await page.screenshot({ path: path.join(OUT, "react-open.png"), fullPage: false });
await browser.close();

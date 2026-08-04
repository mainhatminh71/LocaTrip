/**
 * Measure book-a-trip hero vs Framer scrape dimensions.
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "tmp-nav-shots");
fs.mkdirSync(OUT, { recursive: true });

async function measure(url, label) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(1200);
  const m = await page.evaluate(() => {
    const r = (el) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return {
        x: Math.round(b.x),
        y: Math.round(b.y),
        w: Math.round(b.width),
        h: Math.round(b.height),
      };
    };
    const header = document.querySelector('[data-framer-name="Header"]') || document.querySelector("header");
    const title = document.querySelector('[data-framer-name="Main Title"]') || header?.querySelector("h1");
    const sub = document.querySelector('[data-framer-name="Sub Title"]') || header?.querySelector("p");
    const bg = document.querySelector('[data-framer-name="Background Image"]');
    const img = bg?.querySelector("img") || header?.querySelector("img");
    const cs = title ? getComputedStyle(title) : null;
    const ps = sub ? getComputedStyle(sub) : null;
    return {
      header: r(header),
      bg: r(bg),
      img: r(img),
      title: r(title),
      sub: r(sub),
      titleText: title?.textContent?.trim(),
      subText: sub?.textContent?.trim(),
      titleFont: cs && {
        ff: cs.fontFamily,
        fs: cs.fontSize,
        fw: cs.fontWeight,
        lh: cs.lineHeight,
        ls: cs.letterSpacing,
        ta: cs.textAlign,
      },
      subFont: ps && {
        ff: ps.fontFamily,
        fs: ps.fontSize,
        fw: ps.fontWeight,
        lh: ps.lineHeight,
        ls: ps.letterSpacing,
      },
      imgOpacity: img ? getComputedStyle(img).opacity : null,
      imgTransform: img ? getComputedStyle(img).transform : null,
    };
  });
  console.log(label, JSON.stringify(m, null, 2));
  await page.screenshot({
    path: path.join(OUT, `${label}-hero.png`),
    clip: { x: 0, y: 0, width: 1440, height: 500 },
  });
  await browser.close();
  return m;
}

await measure("http://localhost:3000/book-a-trip/", "react");
// Serve scrape via local static if possible — use file through http from next public?
// Try scrape path via playwright file + wait
await measure(
  "http://localhost:3000/scrape/locatrip.framer.website/book-a-trip/",
  "scrape",
).catch(async () => {
  console.log("scrape route missing — skip");
});

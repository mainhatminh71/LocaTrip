import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(
  "http://localhost:3000/scrape/locatrip.framer.website/book-a-trip/",
  { waitUntil: "networkidle", timeout: 90000 },
);
await page.waitForTimeout(1000);

const m = await page.evaluate(() => {
  const r = (el) => {
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return {
      y: Math.round(b.y + window.scrollY),
      h: Math.round(b.height),
      w: Math.round(b.width),
      name: el.getAttribute("data-framer-name"),
      tag: el.tagName,
      cls: (el.className?.toString?.() || "").slice(0, 30),
    };
  };
  const root = document.querySelector("[data-framer-root]") || document.body;
  const top = [...root.children].map(r);
  // also main children
  const main = document.querySelector("#main > div") || document.querySelector("[data-framer-root]");
  const kids = main ? [...main.children].map(r) : [];
  const footer = document.querySelector("footer");
  const ticker = [...document.querySelectorAll("h5, p")].find((el) =>
    el.textContent?.includes("Tours tùy chỉnh"),
  );
  return {
    rootKids: kids,
    footer: r(footer),
    ticker: ticker
      ? { ...r(ticker), text: ticker.textContent?.slice(0, 80), parent: r(ticker.parentElement) }
      : null,
  };
});
console.log(JSON.stringify(m, null, 2));
await browser.close();

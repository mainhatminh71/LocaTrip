import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(
  "http://localhost:3000/scrape/locatrip.framer.website/book-a-trip/",
  { waitUntil: "networkidle", timeout: 90000 },
);
await page.waitForTimeout(1500);

const m = await page.evaluate(() => {
  const r = (el) => {
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return {
      y: Math.round(b.y + window.scrollY),
      h: Math.round(b.height),
      w: Math.round(b.width),
    };
  };
  const conv = document.querySelector('[data-framer-name="Conversion"]');
  conv?.scrollIntoView();
  return {
    conversion: r(conv),
    children: [...(conv?.children || [])].map((c) => ({
      name: c.getAttribute("data-framer-name"),
      className: c.className?.toString?.().slice(0, 40),
      tag: c.tagName,
      ...r(c),
    })),
  };
});
console.log(JSON.stringify(m, null, 2));
await browser.close();

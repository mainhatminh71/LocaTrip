import { chromium } from "playwright";

const b = await chromium.launch({ headless: true });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:3000/book-a-trip/", { waitUntil: "networkidle" });
await p.click('button[aria-label="Mở menu"]');
await p.waitForTimeout(500);
const s = await p.evaluate(() => {
  const el = document.querySelector('[data-framer-name="Nav Background"]');
  if (!el) return null;
  const cs = getComputedStyle(el);
  return {
    bf: cs.backdropFilter,
    bg: cs.backgroundColor,
    className: el.className,
  };
});
console.log(s);
await p.screenshot({
  path: "scripts/tmp-nav-shots/react-open.png",
  fullPage: false,
});
await b.close();

import { chromium } from "playwright";

const b = await chromium.launch({ headless: true });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:3000/book-a-trip/", {
  waitUntil: "networkidle",
});
await p.click('button[aria-label="Mở menu"]');
await p.waitForTimeout(1000);
const info = await p.evaluate(() => {
  const feat = document.querySelector('[class*="featureCol"]');
  const img = feat?.querySelector("img");
  const links = document.querySelector('[class*="linksCol"]');
  const inner = document.querySelector('[class*="overlayInner"]');
  return {
    feat: feat
      ? {
          display: getComputedStyle(feat).display,
          ...feat.getBoundingClientRect().toJSON(),
        }
      : null,
    img: img
      ? {
          src: img.currentSrc || img.src,
          w: img.getBoundingClientRect().width,
          h: img.getBoundingClientRect().height,
          complete: img.complete,
          nat: img.naturalWidth,
        }
      : null,
    links: links ? links.getBoundingClientRect().toJSON() : null,
    inner: inner ? inner.getBoundingClientRect().toJSON() : null,
  };
});
console.log(JSON.stringify(info, null, 2));
await b.close();

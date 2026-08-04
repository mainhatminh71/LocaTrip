import { chromium } from "playwright";

const b = await chromium.launch({ headless: true });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:3000/book-a-trip/", { waitUntil: "networkidle" });
await p.click('button[aria-label="Mở menu"]');
await p.waitForTimeout(400);

const info = await p.evaluate(() => {
  const el = document.querySelector('[data-framer-name="Nav Background"]');
  const sheets = [];
  for (const sheet of document.styleSheets) {
    let rules;
    try {
      rules = [...sheet.cssRules];
    } catch {
      continue;
    }
    for (const rule of rules) {
      if (
        rule.selectorText &&
        el &&
        el.className
          .split(" ")
          .some((c) => c && rule.selectorText.includes(c))
      ) {
        if (String(rule.cssText).includes("backdrop") || String(rule.cssText).includes("background-color")) {
          sheets.push(rule.cssText.slice(0, 300));
        }
      }
    }
  }
  return sheets;
});
console.log(info);
await b.close();

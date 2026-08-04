import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("pageerror", (e) => console.log("PAGEERR", e.message));
page.on("console", (m) => {
  if (m.type() === "error") console.log("ERR", m.text());
});

await page.goto("http://127.0.0.1:3000/book-a-trip/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.waitForTimeout(2500);

const pe = await page.evaluate(() => {
  const root = document.querySelector('[class*="site-nav-module"]');
  const btn = document.querySelector('button[data-framer-name="Menu"]');
  const cs = root ? getComputedStyle(root) : null;
  return {
    rootPe: cs?.pointerEvents,
    btnPe: btn ? getComputedStyle(btn).pointerEvents : null,
    reactProps: btn
      ? Object.keys(btn)
          .filter((k) => k.startsWith("__react"))
          .join(",")
      : null,
  };
});
console.log(pe);

await page.evaluate(() => {
  const btn = document.querySelector('button[data-framer-name="Menu"]');
  if (!btn) return;
  btn.addEventListener("click", () => console.log("NATIVE_CLICK"), { once: true });
});

await page.locator('button[data-framer-name="Menu"]').click({ timeout: 5000 });
await page.waitForTimeout(800);

const state = await page.evaluate(() => ({
  expanded: document
    .querySelector('button[data-framer-name="Menu"]')
    ?.getAttribute("aria-expanded"),
  overlay: !!document.querySelector('[data-framer-name="Nav Background"]'),
  dialog: !!document.querySelector('[role="dialog"]'),
}));
console.log(state);
await browser.close();

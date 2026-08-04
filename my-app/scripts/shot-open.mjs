import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "tmp-nav-shots");

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
});
await page.goto("http://localhost:3000/book-a-trip/", {
  waitUntil: "networkidle",
  timeout: 60000,
});
await page.waitForTimeout(1000);
await page.screenshot({
  path: path.join(OUT, "react-closed.png"),
  clip: { x: 0, y: 0, width: 1440, height: 140 },
});

const before = await page.locator('[data-framer-name="Nav Background"]').count();
await page.click('button[aria-label="Mở menu"]');
await page.waitForTimeout(800);
const after = await page.locator('[data-framer-name="Nav Background"]').count();
const expanded = await page.getAttribute(
  'button[aria-label="Đóng menu"], button[aria-label="Mở menu"]',
  "aria-expanded",
);
console.log({ before, after, expanded });
await page.screenshot({
  path: path.join(OUT, "react-open.png"),
  fullPage: false,
});
await browser.close();

import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const failed = [];
page.on("response", (r) => {
  if (r.status() >= 400) failed.push(`${r.status()} ${r.url().slice(0, 120)}`);
});
page.on("pageerror", (e) => console.log("PAGEERR", e.message));

await page.goto("http://127.0.0.1:3000/book-a-trip/", {
  waitUntil: "networkidle",
  timeout: 60000,
});
await page.waitForTimeout(2000);

const scripts = await page.evaluate(() =>
  [...document.querySelectorAll("script[src]")]
    .map((s) => s.src)
    .slice(0, 12),
);
console.log("scripts", scripts);
console.log("failed", failed.slice(0, 20));

const hasReact = await page.evaluate(() => {
  return {
    nextData: !!document.getElementById("__NEXT_DATA__"),
    nextF: typeof window.next,
    keys: Object.keys(window).filter((k) => /next|react/i.test(k)).slice(0, 20),
  };
});
console.log(hasReact);
await browser.close();

import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push("console:" + m.text());
});

await page.goto("http://127.0.0.1:3000/book-a-trip/", {
  waitUntil: "load",
  timeout: 60000,
});
await page.waitForTimeout(4000);
console.log("errors", errors);
const bodyReact = await page.evaluate(() => {
  const el = document.querySelector('[class*="book-a-trip-module"]');
  return el
    ? Object.keys(el).filter((k) => k.includes("react") || k.startsWith("__"))
    : [];
});
console.log("page keys", bodyReact);

// Check if form select works (also client)
const selectCount = await page.locator("select").count();
console.log("selects", selectCount);

await browser.close();

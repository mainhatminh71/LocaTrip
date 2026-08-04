import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("pageerror", (e) => console.log("PAGEERR", e.message));

await page.goto("http://localhost:3000/book-a-trip/", {
  waitUntil: "networkidle",
  timeout: 60000,
});

// Wait for React fiber on button
try {
  await page.waitForFunction(
    () => {
      const btn = document.querySelector('button[data-framer-name="Menu"]');
      if (!btn) return false;
      return Object.keys(btn).some(
        (k) =>
          k.startsWith("__reactFiber") ||
          k.startsWith("__reactProps") ||
          k.startsWith("__reactInternalInstance"),
      );
    },
    { timeout: 15000 },
  );
  console.log("hydrated");
} catch {
  console.log("NOT hydrated in 15s");
}

const keys = await page.evaluate(() => {
  const btn = document.querySelector('button[data-framer-name="Menu"]');
  return btn ? Object.keys(btn).filter((k) => k.includes("react") || k.startsWith("__")) : [];
});
console.log("btn keys", keys);

await page.locator('button[data-framer-name="Menu"]').click();
await page.waitForTimeout(500);
console.log(
  "expanded",
  await page.locator('button[data-framer-name="Menu"]').getAttribute("aria-expanded"),
);
console.log(
  "dialog",
  await page.locator('[role="dialog"]').count(),
);

await browser.close();

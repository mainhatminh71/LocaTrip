import { chromium } from "playwright";

const b = await chromium.launch({ headless: true });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
p.on("pageerror", (e) => console.log("PAGEERR", e.message));
p.on("console", (m) => {
  if (m.type() === "error") console.log("CON", m.text());
});
await p.goto("http://127.0.0.1:3000/book-a-trip/", {
  waitUntil: "networkidle",
  timeout: 60000,
});
await p.waitForTimeout(2000);
const info = await p.evaluate(() => {
  const btn = document.querySelector(
    'button[aria-label="Mở menu"], button[aria-label="Đóng menu"]',
  );
  const text = document.body.innerText;
  const hasLoca = text.includes("LOCA");
  const fixed = [...document.querySelectorAll("body *")]
    .filter((d) => getComputedStyle(d).position === "fixed")
    .map((d) => {
      const r = d.getBoundingClientRect();
      return {
        tag: d.tagName,
        cls: String(d.className).slice(0, 100),
        op: getComputedStyle(d).opacity,
        z: getComputedStyle(d).zIndex,
        t: Math.round(r.top),
        h: Math.round(r.height),
        w: Math.round(r.width),
        vis: getComputedStyle(d).visibility,
        display: getComputedStyle(d).display,
      };
    })
    .filter((x) => x.w > 10 && x.h > 5)
    .slice(0, 15);
  return {
    btn: !!btn,
    hasLoca,
    title: document.title,
    fixed,
    htmlSnippet: document.body.innerHTML.slice(0, 500),
  };
});
console.log(JSON.stringify(info, null, 2));
await p.screenshot({
  path: "scripts/tmp-nav-shots/react-debug.png",
  clip: { x: 0, y: 0, width: 1440, height: 220 },
});
await b.close();

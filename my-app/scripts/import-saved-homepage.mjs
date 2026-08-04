/**
 * Import Chrome "Save Page" homepage into public/homepage-exact
 * and patch asset paths so Next can serve it 1:1.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const srcHtml = path.join(
  process.env.USERPROFILE || "",
  "Downloads",
  "LocaTrip - Productive Travel Planer Website.html",
);
const srcFiles = path.join(
  process.env.USERPROFILE || "",
  "Downloads",
  "LocaTrip - Productive Travel Planer Website_files",
);

const outDir = path.join(root, "public", "homepage-exact");
const outAssets = path.join(outDir, "assets");
const outHtml = path.join(outDir, "index.html");

if (!fs.existsSync(srcHtml)) {
  console.error("Missing saved HTML:", srcHtml);
  process.exit(1);
}
if (!fs.existsSync(srcFiles)) {
  console.error("Missing _files folder:", srcFiles);
  process.exit(1);
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outAssets, { recursive: true });

for (const name of fs.readdirSync(srcFiles)) {
  fs.cpSync(path.join(srcFiles, name), path.join(outAssets, name), {
    recursive: true,
  });
}

let html = fs.readFileSync(srcHtml, "utf8");

const ASSET = "/homepage-exact/assets/";
const oldRel = "./LocaTrip - Productive Travel Planer Website_files/";
const oldEnc = "./LocaTrip%20-%20Productive%20Travel%20Planer%20Website_files/";

html = html.split(oldRel).join(ASSET);
html = html.split(oldEnc).join(ASSET);

// URL-encode ( ) in asset filenames so browsers resolve Chrome-renamed files
html = html.replace(
  /\/homepage-exact\/assets\/([^"'\\\s>]+)/g,
  (_m, file) => {
    const encoded = String(file)
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29");
    return `/homepage-exact/assets/${encoded}`;
  },
);

// Strip Framer editor chrome from Chrome save
html = html.replace(
  /<script>try\{if\(localStorage\.getItem\("__framer_force_showing_editorbar_since"\)\)[\s\S]*?<\/script>/i,
  "",
);
html = html.replace(
  /<link rel="modulepreload" href="https:\/\/framer\.com\/edit\/init\.mjs">/gi,
  "",
);
// Chrome save can embed multiple editorbar style blocks
html = html.replace(/<style>[\s\S]*?#__framer-editorbar[\s\S]*?<\/style>/gi, "");
html = html.replace(
  /<div id="__framer-editorbar-container"[\s\S]*?<\/div>\s*<iframe id="__framer-editorbar"[\s\S]*?<\/iframe>/i,
  "",
);
html = html.replace(
  /<div id="__framer-badge-container"[\s\S]*?<\/div>/i,
  "",
);

const patch = `
<style id="locatrip-exact-home-fix">
html, body {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  overflow-x: hidden !important;
}
#main, #main > div {
  width: 100% !important;
  max-width: 100% !important;
}
#__framer-editorbar-container,
#__framer-badge-container,
iframe#__framer-editorbar { display: none !important; }
</style>
<script>
(function () {
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href === '/' || href === 'https://locatrip.framer.website/' || href === 'https://locatrip.framer.website') {
      e.preventDefault();
      window.location.href = '/';
      return;
    }
    if (href.indexOf('/book-a-trip') !== -1) {
      e.preventDefault();
      window.location.href = '/book-a-trip/';
    }
  }, true);
})();
</script>`;

if (/<\/body>/i.test(html)) {
  html = html.replace(/<\/body>/i, `${patch}</body>`);
} else {
  html += patch;
}

fs.writeFileSync(outHtml, html, "utf8");
console.log("Wrote", outHtml);
console.log("Assets:", fs.readdirSync(outAssets).length);

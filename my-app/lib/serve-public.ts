import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const publicDir = path.join(process.cwd(), "public");

function safeJoin(...parts: string[]): string | null {
  const resolved = path.resolve(publicDir, ...parts);
  const rel = path.relative(publicDir, resolved);
  if (rel.startsWith("..") || path.isAbsolute(rel)) return null;
  return resolved;
}

function contentType(filePath: string): string {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".js") || filePath.endsWith(".mjs"))
    return "text/javascript; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".json")) return "application/json";
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg"))
    return "image/jpeg";
  if (filePath.endsWith(".webp")) return "image/webp";
  if (filePath.endsWith(".woff2")) return "font/woff2";
  if (filePath.endsWith(".woff")) return "font/woff";
  return "application/octet-stream";
}

/**
 * On /generated-plan only: replace the Framer map placeholder Image
 * (div.framer-1uenxnk[data-framer-name="Image"] / r06DmcDyolPjHV06YcJ62GTWIOA.png)
 * with Mapbox, keeping that element's size/layout.
 */
function generatedPlanMapboxSnippet(): string {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "";
  const style =
    process.env.NEXT_PUBLIC_MAPBOX_STYLE ??
    "mapbox://styles/mapbox/outdoors-v12";
  if (!token) return "";

  const safeToken = token.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  const safeStyle = style.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

  return `
<link href="https://api.mapbox.com/mapbox-gl-js/v3.9.4/mapbox-gl.css" rel="stylesheet" />
<script src="https://api.mapbox.com/mapbox-gl-js/v3.9.4/mapbox-gl.js"></script>
<script>
(function () {
  var TOKEN = '${safeToken}';
  var STYLE = '${safeStyle}';
  var PLACEHOLDER = 'r06DmcDyolPjHV06YcJ62GTWIOA';
  if (!window.mapboxgl || !TOKEN) return;
  mapboxgl.accessToken = TOKEN;

  var replaced = new WeakSet();

  function findHosts(scope) {
    var root = scope && scope.querySelectorAll ? scope : document;
    var hosts = [];

    // Exact Framer Image block from DevTools
    root.querySelectorAll('.framer-1uenxnk[data-framer-name="Image"]').forEach(function (el) {
      hosts.push(el);
    });

    // Fallback: img that uses the placeholder map asset
    root.querySelectorAll('img[src*="' + PLACEHOLDER + '"], img[srcset*="' + PLACEHOLDER + '"]').forEach(function (img) {
      var host = img.closest('[data-framer-name="Image"]') || img.parentElement;
      if (host) hosts.push(host);
    });

    return hosts;
  }

  function mountMapbox(host) {
    if (!host || replaced.has(host)) return;
    replaced.add(host);

    var w = host.offsetWidth || host.getBoundingClientRect().width;
    var h = host.offsetHeight || host.getBoundingClientRect().height;
    if (w < 40 || h < 40) {
      replaced.delete(host);
      setTimeout(scan, 200);
      return;
    }

    var cs = window.getComputedStyle(host);
    if (cs.position === 'static') host.style.position = 'relative';
    host.style.overflow = 'hidden';
    host.innerHTML = '';

    var el = document.createElement('div');
    el.setAttribute('data-locatrip-mapbox', '1');
    el.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
    host.appendChild(el);

    var map = new mapboxgl.Map({
      container: el,
      style: STYLE,
      center: [108.44, 11.94],
      zoom: 12
    });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
    map.once('load', function () { map.resize(); });
  }

  function scan(scope) {
    findHosts(scope).forEach(mountMapbox);
  }

  scan();
  var obs = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      m.addedNodes && m.addedNodes.forEach(function (n) {
        if (n.nodeType === 1) scan(n);
      });
    });
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(scan, 300);
  setTimeout(scan, 1000);
  setTimeout(scan, 2500);
})();
</script>`;
}

function maybeInjectGeneratedPlanMapbox(
  html: Buffer,
  filePath: string,
): Buffer {
  const normalized = filePath.replace(/\\/g, "/");
  if (!normalized.includes("/generated-plan/")) return html;

  const snippet = generatedPlanMapboxSnippet();
  if (!snippet) return html;

  const text = html.toString("utf8");
  if (text.includes("data-locatrip-mapbox")) return html;
  if (/<\/body>/i.test(text)) {
    return Buffer.from(text.replace(/<\/body>/i, `${snippet}</body>`), "utf8");
  }
  return Buffer.from(text + snippet, "utf8");
}

/** Read first existing candidate under public/, safely. */
export async function servePublicFile(
  candidates: string[][],
): Promise<Response | null> {
  for (const parts of candidates) {
    const filePath = safeJoin(...parts);
    if (!filePath || !existsSync(filePath)) continue;
    let body = await readFile(filePath);
    const type = contentType(filePath);
    if (type.startsWith("text/html")) {
      body = maybeInjectGeneratedPlanMapbox(body, filePath);
    }
    return new Response(body, {
      status: 200,
      headers: {
        "content-type": type,
        "cache-control": "public, max-age=60",
      },
    });
  }
  return null;
}

export const SCRAPE_SITE = ["scrape", "locatrip.framer.website"] as const;

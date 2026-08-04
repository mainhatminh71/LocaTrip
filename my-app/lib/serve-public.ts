import { existsSync, readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const publicDir = path.join(process.cwd(), "public");

function readEnvLocal(key: string): string {
  const fromProcess = process.env[key]?.trim();
  if (fromProcess) return fromProcess;

  const candidates = [
    path.join(process.cwd(), ".env.local"),
    path.join(process.cwd(), "my-app", ".env.local"),
    path.join(publicDir, "..", ".env.local"),
  ];

  for (const envPath of candidates) {
    try {
      if (!existsSync(envPath)) continue;
      const text = readFileSync(envPath, "utf8");
      const line = text.split(/\r?\n/).find((l) => l.startsWith(`${key}=`));
      if (!line) continue;
      const value = line
        .slice(key.length + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
      if (value) return value;
    } catch {
      /* try next */
    }
  }
  return "";
}

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

function injectBeforeBodyClose(html: string, snippet: string): string {
  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, `${snippet}</body>`);
  }
  return html + snippet;
}

/**
 * Replace Framer map placeholder Image on /generated-plan with Mapbox
 * + overlay itinerary from sessionStorage (auto trip result).
 */
function generatedPlanMapboxSnippet(): string {
  const token = readEnvLocal("NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN");
  const style =
    readEnvLocal("NEXT_PUBLIC_MAPBOX_STYLE") ||
    "mapbox://styles/mapbox/outdoors-v12";

  const safeToken = token.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  const safeStyle = style.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

  const mapAssets = token
    ? `
<link href="https://api.mapbox.com/mapbox-gl-js/v3.9.4/mapbox-gl.css" rel="stylesheet" />
<script src="https://api.mapbox.com/mapbox-gl-js/v3.9.4/mapbox-gl.js"></script>`
    : "";

  return `
${mapAssets}
<style>
#locatrip-itinerary-panel {
  position: fixed; right: 16px; bottom: 16px; z-index: 99999;
  width: min(420px, calc(100vw - 32px)); max-height: min(58vh, 560px);
  overflow: auto; background: rgba(255,255,255,0.96); color: #191919;
  border-radius: 20px; box-shadow: 0 12px 40px rgba(0,0,0,0.18);
  padding: 16px 18px; font-family: "Cal Sans", "Segoe UI", sans-serif;
  backdrop-filter: blur(8px);
}
#locatrip-itinerary-panel h2 { margin: 0 0 6px; font-size: 17px; }
#locatrip-itinerary-panel .meta { margin: 0 0 12px; font-size: 12px; color: #666; }
#locatrip-itinerary-panel .opts { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
#locatrip-itinerary-panel .opts button {
  border: 1px solid #ddd; background: #f6f6f6; border-radius: 999px;
  padding: 6px 10px; font-size: 12px; cursor: pointer;
}
#locatrip-itinerary-panel .opts button.active { background: #0a6b7c; color: #fff; border-color: #0a6b7c; }
#locatrip-itinerary-panel ol { margin: 0; padding: 0; list-style: none; }
#locatrip-itinerary-panel li { padding: 10px 0; border-top: 1px solid #eee; font-size: 13px; }
#locatrip-itinerary-panel li .t { font-weight: 600; }
#locatrip-itinerary-panel li .time { color: #0a6b7c; font-size: 12px; }
#locatrip-itinerary-panel .travel { color: #777; font-size: 12px; border-top-style: dashed; }
#locatrip-itinerary-panel .empty a { color: #0a6b7c; }
</style>
<script>
(function () {
  var STORAGE_KEY = 'locatrip.autoTrip';
  var TOKEN = '${safeToken}';
  var STYLE = '${safeStyle}';
  var PLACEHOLDER = 'r06DmcDyolPjHV06YcJ62GTWIOA';

  function loadStored() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function renderPanel(stored) {
    if (document.getElementById('locatrip-itinerary-panel')) return;
    var panel = document.createElement('div');
    panel.id = 'locatrip-itinerary-panel';

    if (!stored || !stored.result || !stored.result.itineraries || !stored.result.itineraries.length) {
      panel.innerHTML = '<div class="empty"><h2>Chưa có lịch trình</h2><p class="meta">Hãy điền form trên trang book-a-trip.</p><p><a href="/book-a-trip/">← Quay lại form</a></p></div>';
      document.body.appendChild(panel);
      return;
    }

    var options = stored.result.itineraries;
    var active = 0;

    function paint() {
      var opt = options[active];
      var day = (opt.itinerary && opt.itinerary[0]) || { schedule: [] };
      var optsHtml = options.map(function (o, i) {
        return '<button type="button" data-i="' + i + '" class="' + (i === active ? 'active' : '') + '">Lộ trình ' + o.optionId + '</button>';
      }).join('');
      var items = (day.schedule || []).map(function (item) {
        if (item.type === 'travel') {
          return '<li class="travel">' + (item.instruction || 'Di chuyển') + ' · ' + item.distanceKm + ' km · ~' + item.durationMin + ' phút</li>';
        }
        var p = item.place || {};
        return '<li><div class="t">' + (p.title || '') + '</div><div class="time">' + (item.time || '') + '</div><div>' + [p.category, p.address].filter(Boolean).join(' · ') + '</div></li>';
      }).join('');
      panel.innerHTML =
        '<h2>' + (opt.title || 'Lịch trình') + '</h2>' +
        '<p class="meta">' + (opt.summary || '') + (opt.totalEstimatedCost ? ' · ' + opt.totalEstimatedCost : '') + '</p>' +
        '<div class="opts">' + optsHtml + '</div>' +
        '<ol>' + items + '</ol>' +
        '<p class="meta" style="margin-top:12px"><a href="/book-a-trip/">Chỉnh lại form</a></p>';
      panel.querySelectorAll('.opts button').forEach(function (b) {
        b.addEventListener('click', function () {
          active = parseInt(b.getAttribute('data-i'), 10) || 0;
          paint();
        });
      });
    }

    document.body.appendChild(panel);
    paint();
  }

  function findHosts(scope) {
    var root = scope && scope.querySelectorAll ? scope : document;
    var hosts = [];
    root.querySelectorAll('.framer-1uenxnk[data-framer-name="Image"]').forEach(function (el) {
      hosts.push(el);
    });
    root.querySelectorAll('img[src*="' + PLACEHOLDER + '"], img[srcset*="' + PLACEHOLDER + '"]').forEach(function (img) {
      var host = img.closest('[data-framer-name="Image"]') || img.parentElement;
      if (host) hosts.push(host);
    });
    return hosts;
  }

  var replaced = typeof WeakSet !== 'undefined' ? new WeakSet() : null;

  function mountMapbox(host) {
    if (!host || !window.mapboxgl || !TOKEN) return;
    if (replaced && replaced.has(host)) return;
    if (replaced) replaced.add(host);

    var w = host.offsetWidth || host.getBoundingClientRect().width;
    var h = host.offsetHeight || host.getBoundingClientRect().height;
    if (w < 40 || h < 40) {
      if (replaced) replaced.delete(host);
      setTimeout(scanMaps, 200);
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

    mapboxgl.accessToken = TOKEN;
    var map = new mapboxgl.Map({
      container: el,
      style: STYLE,
      center: [108.44, 11.94],
      zoom: 12
    });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
    map.once('load', function () { map.resize(); });
  }

  function scanMaps(scope) {
    findHosts(scope).forEach(mountMapbox);
  }

  renderPanel(loadStored());

  if (TOKEN && window.mapboxgl) {
    scanMaps();
    var obs = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        m.addedNodes && m.addedNodes.forEach(function (n) {
          if (n.nodeType === 1) scanMaps(n);
        });
      });
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(scanMaps, 300);
    setTimeout(scanMaps, 1000);
    setTimeout(scanMaps, 2500);
  }
})();
</script>`;
}

function maybeInjectScrapeEnhancements(html: Buffer, filePath: string): Buffer {
  const normalized = filePath.replace(/\\/g, "/");
  let text = html.toString("utf8");

  // /book-a-trip is React (app/book-a-trip/page.tsx) — Framer UI port.

  if (normalized.includes("/generated-plan/")) {
    if (!text.includes("locatrip-itinerary-panel")) {
      text = injectBeforeBodyClose(text, generatedPlanMapboxSnippet());
    }
  }

  return Buffer.from(text, "utf8");
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
      body = maybeInjectScrapeEnhancements(body, filePath);
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

/**
 * Bundle-tag scenic planner + on-road drawing via OSRM.
 *
 * Tags decide WHERE to prefer (lake/forest/…).
 * OSRM draws the actual drivable line so the path stays on roads.
 * If no preferred tag fits the A→B trip, scenic_matched=false (UI must offer options).
 */
(() => {
  const DRIVABLE = new Set([
    "motorway",
    "trunk",
    "primary",
    "secondary",
    "tertiary",
    "unclassified",
    "residential",
    "living_street",
    "road",
    "service",
  ]);

  const SNAP = 5;
  const BRIDGE_M = 15;
  const BRIDGE_PENALTY = 25;
  const SLOW = new Set(["service", "living_street"]);
  const SLOW_PENALTY = 3.5;
  const MAX_SNAP_M = 400;
  const DEFAULT_MAX_EXTRA_M = 8000; // allow up to +8 km to catch a lake/tag
  const OSRM_URL = "https://router.project-osrm.org/route/v1/driving";

  function snap(lat, lon) {
    return `${lat.toFixed(SNAP)},${lon.toFixed(SNAP)}`;
  }

  function parseKey(key) {
    const [lat, lon] = key.split(",").map(Number);
    return { lat, lon };
  }

  function haversineM(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const toRad = Math.PI / 180;
    const φ1 = lat1 * toRad;
    const φ2 = lat2 * toRad;
    const Δφ = (lat2 - lat1) * toRad;
    const Δλ = (lon2 - lon1) * toRad;
    const a =
      Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  }

  function pathLengthM(coords) {
    let total = 0;
    for (let i = 0; i < coords.length - 1; i += 1) {
      const [lon1, lat1] = coords[i];
      const [lon2, lat2] = coords[i + 1];
      total += haversineM(lat1, lon1, lat2, lon2);
    }
    return total;
  }

  function largestComponentNodes(adj) {
    const seen = new Set();
    let best = [];
    for (const start of adj.keys()) {
      if (seen.has(start)) continue;
      const q = [start];
      seen.add(start);
      const comp = [start];
      while (q.length) {
        const u = q.pop();
        for (const e of adj.get(u) || []) {
          if (seen.has(e.to)) continue;
          seen.add(e.to);
          q.push(e.to);
          comp.push(e.to);
        }
      }
      if (comp.length > best.length) best = comp;
    }
    return new Set(best);
  }

  function edgeBaseCost(edge) {
    let c = edge.length;
    if (edge.isBridge) c *= BRIDGE_PENALTY;
    if (edge.slow) c *= SLOW_PENALTY;
    return c;
  }

  function buildGraph(bundle) {
    const features = bundle?.roads?.features || [];
    const adj = new Map();
    const nodes = new Set();
    const roads = [];
    const tagIndex = []; // unique scenic anchors from road.natural_tags

    function addEdge(u, v, edge) {
      if (!adj.has(u)) adj.set(u, []);
      adj.get(u).push({ ...edge, to: v });
      nodes.add(u);
      nodes.add(v);
    }

    const seenTag = new Set();

    for (const f of features) {
      const geom = f.geometry;
      const props = f.properties || {};
      if (!geom || geom.type !== "LineString") continue;
      if (!DRIVABLE.has(props.highway)) continue;
      const coords = geom.coordinates || [];
      if (coords.length < 2) continue;

      const tags = Array.isArray(props.natural_tags) ? props.natural_tags : [];
      const roadId = props.id;
      const slow = SLOW.has(props.highway);
      const lengthM = pathLengthM(coords) || 1;

      roads.push({
        id: roadId,
        highway: props.highway,
        coordinates: coords,
        natural_tags: tags,
        length_m: lengthM,
      });

      for (const t of tags) {
        if (!t || t.lat == null || t.lon == null || !t.feature_type) continue;
        const key =
          t.feature_osm_id != null
            ? `osm:${t.feature_osm_id}`
            : `${t.feature_type}:${Number(t.lat).toFixed(5)},${Number(t.lon).toFixed(5)}`;
        if (seenTag.has(key)) continue;
        seenTag.add(key);
        tagIndex.push({
          key,
          tag: t.tag,
          tags: [t.tag].filter(Boolean),
          feature_type: t.feature_type,
          feature_osm_id: t.feature_osm_id,
          feature_name: t.feature_name,
          lat: Number(t.lat),
          lon: Number(t.lon),
          name: t.feature_name || t.tag || t.feature_type,
          id: t.feature_osm_id != null ? t.feature_osm_id : seenTag.size,
        });
      }

      for (let i = 0; i < coords.length - 1; i += 1) {
        const [lon0, lat0] = coords[i];
        const [lon1, lat1] = coords[i + 1];
        const u = snap(lat0, lon0);
        const v = snap(lat1, lon1);
        if (u === v) continue;
        const seg = haversineM(lat0, lon0, lat1, lon1);
        if (seg < 0.5) continue;
        const base = {
          length: seg,
          roadId,
          coords: [
            [lon0, lat0],
            [lon1, lat1],
          ],
          tags,
          slow,
          isBridge: false,
        };
        addEdge(u, v, base);
        addEdge(v, u, {
          ...base,
          coords: [
            [lon1, lat1],
            [lon0, lat0],
          ],
        });
      }
    }

    const nodeList = [...nodes];
    const cell = Math.max(BRIDGE_M / 111000, 1e-5);
    const buckets = new Map();
    for (const key of nodeList) {
      const { lat, lon } = parseKey(key);
      const bk = `${Math.floor(lat / cell)},${Math.floor(lon / cell)}`;
      if (!buckets.has(bk)) buckets.set(bk, []);
      buckets.get(bk).push(key);
    }
    for (const key of nodeList) {
      const { lat, lon } = parseKey(key);
      const i0 = Math.floor(lat / cell);
      const j0 = Math.floor(lon / cell);
      for (let di = -1; di <= 1; di += 1) {
        for (let dj = -1; dj <= 1; dj += 1) {
          for (const other of buckets.get(`${i0 + di},${j0 + dj}`) || []) {
            if (other <= key) continue;
            const o = parseKey(other);
            const d = haversineM(lat, lon, o.lat, o.lon);
            if (d <= 0 || d > BRIDGE_M) continue;
            const bridge = {
              length: d,
              roadId: -1,
              coords: [
                [lon, lat],
                [o.lon, o.lat],
              ],
              tags: [],
              slow: false,
              isBridge: true,
            };
            addEdge(key, other, bridge);
            addEdge(other, key, {
              ...bridge,
              coords: [
                [o.lon, o.lat],
                [lon, lat],
              ],
            });
          }
        }
      }
    }

    const mainNodes = largestComponentNodes(adj);
    return { adj, nodes: [...nodes], mainNodes, roads, tagIndex };
  }

  function nearestNode(graph, lat, lon) {
    const pool = graph.mainNodes?.size ? graph.mainNodes : new Set(graph.nodes);
    let best = null;
    let bestD = Infinity;
    for (const key of pool) {
      const p = parseKey(key);
      const d = haversineM(lat, lon, p.lat, p.lon);
      if (d < bestD) {
        bestD = d;
        best = key;
      }
    }
    if (best == null || bestD > MAX_SNAP_M) return { key: null, dist: bestD };
    return { key: best, dist: bestD };
  }

  function dijkstraLength(graph, source, target) {
    if (!source || !target) return null;
    if (source === target) return 0;
    const dist = new Map([[source, 0]]);
    const heap = [[0, source]];
    const push = (item) => {
      heap.push(item);
      let i = heap.length - 1;
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (heap[p][0] <= heap[i][0]) break;
        const t = heap[p];
        heap[p] = heap[i];
        heap[i] = t;
        i = p;
      }
    };
    const pop = () => {
      const top = heap[0];
      const last = heap.pop();
      if (!heap.length) return top;
      heap[0] = last;
      let i = 0;
      for (;;) {
        const l = i * 2 + 1;
        const r = l + 1;
        let s = i;
        if (l < heap.length && heap[l][0] < heap[s][0]) s = l;
        if (r < heap.length && heap[r][0] < heap[s][0]) s = r;
        if (s === i) break;
        const t = heap[i];
        heap[i] = heap[s];
        heap[s] = t;
        i = s;
      }
      return top;
    };
    while (heap.length) {
      const [du, u] = pop();
      if (du > (dist.get(u) ?? Infinity)) continue;
      if (u === target) return du;
      for (const e of graph.adj.get(u) || []) {
        if (graph.mainNodes?.size && !graph.mainNodes.has(e.to)) continue;
        const alt = du + edgeBaseCost(e);
        if (alt < (dist.get(e.to) ?? Infinity)) {
          dist.set(e.to, alt);
          push([alt, e.to]);
        }
      }
    }
    return null;
  }

  /** Progress 0..1 of point P along segment A→B, and distance to that segment (m). */
  function corridorMetrics(p, a, b) {
    const ab = haversineM(a.lat, a.lon, b.lat, b.lon) || 1;
    // Equirectangular local projection
    const x = (p.lon - a.lon) * Math.cos(((a.lat + b.lat) / 2) * (Math.PI / 180));
    const y = p.lat - a.lat;
    const bx = (b.lon - a.lon) * Math.cos(((a.lat + b.lat) / 2) * (Math.PI / 180));
    const by = b.lat - a.lat;
    const denom = bx * bx + by * by || 1e-12;
    let t = (x * bx + y * by) / denom;
    t = Math.max(0, Math.min(1, t));
    const projLat = a.lat + t * (b.lat - a.lat);
    const projLon = a.lon + t * (b.lon - a.lon);
    const dist = haversineM(p.lat, p.lon, projLat, projLon);
    return { progress: t, distM: dist, abM: ab };
  }

  function pickScenicVias(graph, origin, destination, prefs, maxExtraM) {
    const want = new Set(prefs || []);
    if (!want.size) return [];

    const src = nearestNode(graph, origin.lat, origin.lon);
    const dst = nearestNode(graph, destination.lat, destination.lon);
    if (!src.key || !dst.key) return [];

    const fastLen = dijkstraLength(graph, src.key, dst.key);
    if (fastLen == null) return [];

    const candidates = (graph.tagIndex || [])
      .filter((t) => want.has(t.feature_type))
      .map((t) => {
        const m = corridorMetrics(t, origin, destination);
        return { ...t, ...m };
      })
      // Between A and B, not the endpoints themselves.
      .filter((t) => t.progress > 0.08 && t.progress < 0.92)
      // Not too far off the A–B corridor (km-scale).
      .filter((t) => t.distM < 12000)
      .sort((a, b) => a.distM - b.distM || Math.abs(a.progress - 0.5) - Math.abs(b.progress - 0.5));

    const vias = [];
    const usedKeys = new Set();

    for (const c of candidates.slice(0, 40)) {
      if (usedKeys.has(c.key)) continue;
      const viaNode = nearestNode(graph, c.lat, c.lon);
      if (!viaNode.key) continue;
      // Skip if via is essentially A or B.
      if (viaNode.key === src.key || viaNode.key === dst.key) continue;

      const leg1 = dijkstraLength(graph, src.key, viaNode.key);
      const leg2 = dijkstraLength(graph, viaNode.key, dst.key);
      if (leg1 == null || leg2 == null) continue;
      const total = leg1 + leg2;
      if (total > fastLen + maxExtraM) continue;

      usedKeys.add(c.key);
      const roadPt = parseKey(viaNode.key);
      vias.push({
        ...c,
        // Snap via onto a road node so OSRM never cuts across the lake.
        lat: roadPt.lat,
        lon: roadPt.lon,
        node: viaNode.key,
        detour_m: total - fastLen,
        route_m: total,
        shore_lat: c.lat,
        shore_lon: c.lon,
      });
      // One strong scenic via is enough for demo clarity.
      if (vias.length >= 1) break;
    }

    // If corridor filter found nothing, try absolute nearest preferred tag to mid-point.
    if (!vias.length) {
      const mid = {
        lat: (origin.lat + destination.lat) / 2,
        lon: (origin.lon + destination.lon) / 2,
      };
      const nearest = (graph.tagIndex || [])
        .filter((t) => want.has(t.feature_type))
        .map((t) => ({
          ...t,
          dMid: haversineM(mid.lat, mid.lon, t.lat, t.lon),
          dA: haversineM(origin.lat, origin.lon, t.lat, t.lon),
          dB: haversineM(destination.lat, destination.lon, t.lat, t.lon),
        }))
        .filter((t) => t.dA > 250 && t.dB > 250)
        .sort((a, b) => a.dMid - b.dMid);

      for (const c of nearest.slice(0, 25)) {
        const viaNode = nearestNode(graph, c.lat, c.lon);
        if (!viaNode.key || viaNode.key === src.key || viaNode.key === dst.key) continue;
        const leg1 = dijkstraLength(graph, src.key, viaNode.key);
        const leg2 = dijkstraLength(graph, viaNode.key, dst.key);
        if (leg1 == null || leg2 == null) continue;
        const total = leg1 + leg2;
        if (total > fastLen + maxExtraM) continue;
        const roadPt = parseKey(viaNode.key);
        vias.push({
          ...c,
          lat: roadPt.lat,
          lon: roadPt.lon,
          node: viaNode.key,
          detour_m: total - fastLen,
          route_m: total,
          progress: 0.5,
          distM: c.dMid,
          shore_lat: c.lat,
          shore_lon: c.lon,
        });
        break;
      }
    }

    return { vias, fastLen, src, dst };
  }

  async function routeOsrm(points) {
    if (!points || points.length < 2) throw new Error("OSRM cần ≥2 điểm");
    const coordStr = points.map((p) => `${p.lon},${p.lat}`).join(";");
    const url = `${OSRM_URL}/${coordStr}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`OSRM HTTP ${res.status}`);
    const payload = await res.json();
    const route = (payload.routes || [])[0];
    if (!route) throw new Error("OSRM không trả route");
    return {
      geometry: route.geometry,
      distance_meters: Number(route.distance) || 0,
      duration_seconds: Number(route.duration) || 0,
    };
  }

  /**
   * Main entry used by the UI.
   * Scenic = try to pass near a preferred tag (e.g. lake); else scenic_matched=false.
   */
  async function route(graph, origin, destination, mode, preferences, opts = {}) {
    const prefs = preferences || [];
    const maxExtraM = opts.maxExtraM != null ? opts.maxExtraM : DEFAULT_MAX_EXTRA_M;
    const relax = Boolean(opts.relaxPreferences);
    const useScenic = mode === "scenic" && !relax && prefs.length > 0;

    const srcHit = nearestNode(graph, origin.lat, origin.lon);
    const dstHit = nearestNode(graph, destination.lat, destination.lon);
    if (!srcHit.key || !dstHit.key) {
      throw new Error("A/B quá xa mạng đường trong bundle.");
    }

    let vias = [];
    let fastLen = dijkstraLength(graph, srcHit.key, dstHit.key);
    if (fastLen == null) fastLen = haversineM(origin.lat, origin.lon, destination.lat, destination.lon) * 1.3;

    if (useScenic) {
      const picked = pickScenicVias(graph, origin, destination, prefs, maxExtraM);
      vias = picked.vias || [];
      if (picked.fastLen != null) fastLen = picked.fastLen;
    }

    const waypoints = [origin, ...vias.map((v) => ({ lat: v.lat, lon: v.lon, name: v.name })), destination];
    const scenicMatched = useScenic && vias.length > 0;

    let osrm;
    try {
      osrm = await routeOsrm(waypoints);
    } catch (err) {
      // Fallback: straight legs (still better than fake zig-zag graph draw).
      const coordinates = waypoints.map((p) => [p.lon, p.lat]);
      let dist = 0;
      for (let i = 0; i < waypoints.length - 1; i += 1) {
        dist += haversineM(
          waypoints[i].lat,
          waypoints[i].lon,
          waypoints[i + 1].lat,
          waypoints[i + 1].lon
        );
      }
      osrm = {
        geometry: { type: "LineString", coordinates },
        distance_meters: dist,
        duration_seconds: dist / 8,
        fallback: true,
      };
    }

    const detourExtraM = Math.max(0, osrm.distance_meters - fastLen);
    const sightings = vias.map((v) => ({
      id: v.id,
      feature_type: v.feature_type,
      name: v.name,
      lat: v.lat,
      lon: v.lon,
      tags: v.tags || (v.tag ? [v.tag] : []),
      distance_meters: v.distM != null ? Math.round(v.distM) : null,
      weight: 1,
    }));

    let summary;
    if (mode === "fast" || relax) {
      summary = `Đường đi được (OSRM) từ ${origin.name} đến ${destination.name}.`;
    } else if (scenicMatched) {
      const names = sightings.map((s) => s.name).join(", ");
      summary =
        `Ưu tiên đi gần ${prefs.map(labelPref).join(", ")}: qua ${names}. ` +
        `Route vẽ trên đường thật (OSRM).`;
    } else {
      summary =
        `Không tìm được đoạn gần ${prefs.map(labelPref).join(", ")} ` +
        `trong giới hạn +${(maxExtraM / 1000).toFixed(0)} km so với đường nhanh — ` +
        `chưa phải hành trình ngắm cảnh đúng yêu cầu.`;
    }

    return {
      mode,
      preferences: useScenic ? prefs : [],
      origin,
      destination,
      waypoints: vias,
      sightings,
      distance_meters: osrm.distance_meters,
      duration_seconds: osrm.duration_seconds,
      scenic_score: sightings.length,
      detour_percent: fastLen > 0 ? Math.round((detourExtraM / fastLen) * 100) : 0,
      detour_extra_km: Math.round((detourExtraM / 1000) * 100) / 100,
      max_extra_km: maxExtraM / 1000,
      fast_distance_meters: fastLen,
      scenic_matched: mode === "scenic" ? scenicMatched || relax : true,
      relax_preferences: relax,
      geometry: osrm.geometry,
      summary,
      engine: osrm.fallback ? "osrm-fallback" : "osrm+bundle-tags",
      bridge_meters: 0,
    };
  }

  function labelPref(t) {
    const map = {
      lake: "hồ",
      waterfall: "thác",
      forest: "rừng",
      wood: "rừng cây",
      stream: "suối",
      park: "công viên",
      garden: "vườn",
      mountain: "núi",
      peak: "đỉnh",
      viewpoint: "viewpoint",
    };
    return map[t] || t;
  }

  window.TagRouter = {
    buildGraph,
    route,
    DRIVABLE,
  };
})();

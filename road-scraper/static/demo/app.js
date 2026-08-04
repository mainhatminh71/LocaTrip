(() => {
  const COLORS = {
    lake: "#2a7f9e",
    waterfall: "#3d8bfd",
    peak: "#6b4f3a",
    hill: "#8a6a4b",
    mountain: "#6b4f3a",
    viewpoint: "#c45c26",
    forest: "#2f6b3a",
    wood: "#3d7a48",
    river: "#3d8bfd",
    village: "#8a5a2b",
    cliff: "#5c5c5c",
    national_park: "#1f6b3a",
    default: "#033d4a",
  };

  const TYPE_VI = {
    lake: "Hồ",
    waterfall: "Thác",
    forest: "Rừng",
    wood: "Rừng cây",
    mountain: "Núi",
    peak: "Đỉnh",
    viewpoint: "Viewpoint",
    river: "Sông",
    stream: "Suối",
    park: "Công viên",
    garden: "Vườn",
    village: "Làng",
    cliff: "Vách đá",
    national_park: "Vườn QG",
  };

  const TYPE_ORDER = [
    "lake",
    "waterfall",
    "viewpoint",
    "peak",
    "mountain",
    "wood",
    "forest",
    "village",
    "river",
    "cliff",
    "national_park",
  ];

  const map = L.map("map", { zoomControl: false }).setView([11.94, 108.44], 12);
  L.control.zoom({ position: "topright" }).addTo(map);

  function addCartoBasemap() {
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; OSM &copy; CARTO",
      maxZoom: 19,
    }).addTo(map);
  }

  function addMapboxBasemap(token, styleId) {
    const id = styleId || "mapbox/outdoors-v12";
    L.tileLayer(
      `https://api.mapbox.com/styles/v1/${id}/tiles/{z}/{x}/{y}?access_token=${encodeURIComponent(token)}`,
      {
        attribution:
          '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
        tileSize: 512,
        zoomOffset: -1,
        maxZoom: 22,
      },
    ).addTo(map);
  }

  async function addBasemap() {
    try {
      const res = await fetch("/api/demo/config");
      if (!res.ok) throw new Error("config unavailable");
      const cfg = await res.json();
      if (cfg.mapboxAccessToken) {
        addMapboxBasemap(cfg.mapboxAccessToken, cfg.mapboxStyle);
        return;
      }
    } catch (_) {
      /* fall through */
    }
    addCartoBasemap();
  }

  addBasemap();

  const featureLayer = L.layerGroup().addTo(map);
  let routeLayer = null;
  let mode = "scenic";
  let places = [];
  let allFeatures = null;
  let roadGraph = null;
  let activeTypes = new Set(); // empty = all types
  let originPlace = null;
  let destinationPlace = null;
  /** @type {{ geometry: object, originId: number, destinationId: number, sightingIds: Set<number> } | null} */
  let lastRoute = null;
  const ROUTE_TAG_MAX_M = 450;

  const statsEl = document.getElementById("stats");
  const goBtn = document.getElementById("go");
  const scenicOptions = document.getElementById("scenic-options");
  const placeListEl = document.getElementById("place-list");
  const placeCountEl = document.getElementById("place-count");
  const typeFiltersEl = document.getElementById("type-filters");
  const placeFilterQ = document.getElementById("place-filter-q");
  const browserNote = document.getElementById("browser-note");
  const networkStatus = document.getElementById("network-status");
  const scenicModal = document.getElementById("scenic-modal");
  const scenicModalBody = document.getElementById("scenic-modal-body");
  const detourRange = document.getElementById("detour-budget-range");
  const detourInput = document.getElementById("detour-budget-input");
  const detourLabel = document.getElementById("detour-budget-label");
  let pendingRouteData = null;
  let maxExtraKm = 8;

  function clampDetourKm(value) {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.min(40, Math.round(n * 10) / 10);
  }

  function setMaxExtraKm(value, { silent = false } = {}) {
    maxExtraKm = clampDetourKm(value);
    if (detourRange) detourRange.value = String(Math.min(25, maxExtraKm));
    if (detourInput) detourInput.value = String(maxExtraKm);
    if (detourLabel) detourLabel.textContent = `+${maxExtraKm} km`;
    document.querySelectorAll(".detour-preset").forEach((btn) => {
      btn.classList.toggle("is-active", Number(btn.dataset.km) === maxExtraKm);
    });
    if (!silent) {
      // keep UI in sync only
    }
    return maxExtraKm;
  }

  setMaxExtraKm(8, { silent: true });

  detourRange?.addEventListener("input", () => {
    setMaxExtraKm(detourRange.value);
  });
  detourInput?.addEventListener("change", () => {
    setMaxExtraKm(detourInput.value);
  });
  document.querySelectorAll(".detour-preset").forEach((btn) => {
    btn.addEventListener("click", () => setMaxExtraKm(btn.dataset.km));
  });

  document.querySelectorAll(".mode-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".mode-btn").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      mode = btn.dataset.mode;
      scenicOptions.classList.toggle("is-hidden", mode !== "scenic");
      // Switching mode while a route is on screen: hide/show corridor tags.
      if (routeLayer && mode === "fast") {
        // Drop scenic sighting markers; keep only A/B + line by redrawing from lastRoute.
        routeLayer.eachLayer((layer) => {
          if (layer instanceof L.Marker && layer.options.zIndexOffset === 800) {
            routeLayer.removeLayer(layer);
          }
        });
      }
      refreshMapLabels(
        lastRoute
          ? new Set([lastRoute.originId, lastRoute.destinationId, ...lastRoute.sightingIds])
          : new Set()
      );
    });
  });

  document.querySelectorAll("#prefs input").forEach((input) => {
    input.addEventListener("change", () => refreshMapLabels());
  });

  document.getElementById("scenic-modal-close")?.addEventListener("click", () => closeScenicModal());
  document.getElementById("scenic-go-fast")?.addEventListener("click", () => {
    closeScenicModal();
    drawRoute({ relaxPreferences: true, skipMatchPrompt: true });
  });
  document.getElementById("scenic-expand-go")?.addEventListener("click", () => {
    const add = Number(document.getElementById("scenic-expand-km")?.value);
    if (!Number.isFinite(add) || add <= 0) return;
    setMaxExtraKm(maxExtraKm + add);
    closeScenicModal();
    drawRoute({ skipMatchPrompt: true });
  });
  scenicModal?.addEventListener("click", (event) => {
    if (event.target === scenicModal) closeScenicModal();
  });

  placeFilterQ.addEventListener("input", () => renderPlaceBrowser());
  document.getElementById("filter-clear-q")?.addEventListener("click", () => {
    placeFilterQ.value = "";
    renderPlaceBrowser();
    placeFilterQ.focus();
  });

  goBtn.addEventListener("click", () => drawRoute());

  function selectedPreferences() {
    return [...document.querySelectorAll("#prefs input:checked")].map((el) => el.value);
  }

  function openScenicModal(data) {
    pendingRouteData = data;
    const prefs = (data.preferences || []).map((t) => typeLabel(t)).join(", ") || "đã chọn";
    const cap = data.max_extra_km ?? maxExtraKm;
    scenicModalBody.textContent =
      `Bạn chọn ngắm: ${prefs}, nhưng trong +${cap} km so với đường nhanh nhất ` +
      `chưa tìm được đoạn đường gần loại cảnh đó. ` +
      `Có thể đi đường thường (bỏ ưu tiên), hoặc nới thêm km rồi thử lại.`;
    const expand = document.getElementById("scenic-expand-km");
    if (expand) expand.value = "5";
    scenicModal.hidden = false;
  }

  function closeScenicModal() {
    if (scenicModal) scenicModal.hidden = true;
  }

  function applyRouteToMap(data) {
    renderStats(data);

    const sightings = mode === "scenic" ? data.sightings || [] : [];
    lastRoute = {
      geometry: data.geometry,
      originId: data.origin.id,
      destinationId: data.destination.id,
      sightingIds: new Set(sightings.map((s) => s.id)),
      mode,
    };
    const highlightIds = new Set([
      data.origin.id,
      data.destination.id,
      ...sightings.map((s) => s.id),
    ]);
    refreshMapLabels(highlightIds);

    if (routeLayer) {
      map.removeLayer(routeLayer);
    }
    routeLayer = L.layerGroup().addTo(map);

    let routeGeo = null;
    if (data.geometry) {
      const routeColor = mode === "scenic" ? "#c45c26" : "#033d4a";
      routeGeo = L.geoJSON(data.geometry, {
        style: { color: routeColor, weight: 5, opacity: 0.9 },
      }).addTo(routeLayer);
      addRouteDirectionArrows(data.geometry, routeColor);
    }

    [
      { role: "A", place: data.origin },
      { role: "B", place: data.destination },
    ].forEach(({ role, place }) => {
      L.marker([place.lat, place.lon], {
        icon: nameTagIcon(`${role}: ${place.name}`, place.feature_type, { emphasize: true }),
        zIndexOffset: 900,
      })
        .bindPopup(`<strong>${escapeHtml(place.name)}</strong>`)
        .addTo(routeLayer);
    });

    // Scenic only: show pass-by tags on the journey.
    if (mode === "scenic") {
      sightings.forEach((s) => {
        if (s.lat == null || s.lon == null) return;
        L.marker([s.lat, s.lon], {
          icon: nameTagIcon(s.name, s.feature_type, { emphasize: true }),
          zIndexOffset: 800,
        })
          .bindPopup(
            `<strong>${escapeHtml(s.name)}</strong><br/>` +
              `${escapeHtml(typeLabel(s.feature_type))}` +
              `${(s.tags || []).length ? `<br/><em>${escapeHtml(s.tags.join(", "))}</em>` : ""}`
          )
          .addTo(routeLayer);
      });
    }

    if (routeGeo) {
      map.fitBounds(routeGeo.getBounds(), { padding: [60, 60] });
    } else {
      map.fitBounds(
        [
          [data.origin.lat, data.origin.lon],
          [data.destination.lat, data.destination.lon],
        ],
        { padding: [60, 60] }
      );
    }
  }

  function colorFor(type) {
    return COLORS[type] || COLORS.default;
  }

  function escapeHtml(text) {
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function typeLabel(type) {
    return TYPE_VI[type] || type;
  }

  function countsByType() {
    const counts = {};
    places.forEach((p) => {
      counts[p.feature_type] = (counts[p.feature_type] || 0) + 1;
    });
    return counts;
  }

  function buildTypeFilters() {
    const counts = countsByType();
    const types = TYPE_ORDER.filter((t) => counts[t]).concat(
      Object.keys(counts).filter((t) => !TYPE_ORDER.includes(t)).sort()
    );

    const allCount = places.length;
    typeFiltersEl.innerHTML =
      `<button type="button" class="type-chip type-chip-all" data-type="__all__" aria-pressed="true">
        <span class="type-chip-label">Tất cả</span>
        <span class="type-chip-count">${allCount}</span>
      </button>` +
      types
        .map(
          (t) => `
        <button type="button" class="type-chip" data-type="${t}" style="--chip:${colorFor(t)}">
          <span class="type-chip-dot"></span>
          <span class="type-chip-label">${escapeHtml(typeLabel(t))}</span>
          <span class="type-chip-count">${counts[t]}</span>
        </button>`
        )
        .join("");

    typeFiltersEl.querySelectorAll(".type-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        const t = btn.dataset.type;
        if (t === "__all__") {
          activeTypes = new Set();
        } else if (activeTypes.has(t)) {
          activeTypes.delete(t);
        } else {
          activeTypes.add(t);
        }
        syncTypeFilterButtons();
        renderPlaceBrowser();
      });
    });
    syncTypeFilterButtons();
  }

  function syncTypeFilterButtons() {
    const none = activeTypes.size === 0;
    typeFiltersEl.querySelectorAll(".type-chip").forEach((btn) => {
      const t = btn.dataset.type;
      if (t === "__all__") {
        btn.classList.toggle("is-active", none);
        btn.classList.remove("is-dim");
        btn.setAttribute("aria-pressed", none ? "true" : "false");
        return;
      }
      const selected = activeTypes.has(t);
      btn.classList.toggle("is-active", selected);
      btn.classList.toggle("is-dim", !none && !selected);
      btn.setAttribute("aria-pressed", selected ? "true" : "false");
    });
  }

  function filteredPlaces() {
    const q = normalizeText(placeFilterQ.value.trim());
    return places.filter((p) => {
      if (activeTypes.size && !activeTypes.has(p.feature_type)) return false;
      if (!q) return true;
      const hay = normalizeText(`${p.name} ${p.feature_type} ${typeLabel(p.feature_type)}`);
      return hay.includes(q);
    });
  }

  function setEndpoint(role, place) {
    if (!place) return;
    if (role === "A") {
      originPlace = place;
      document.getElementById("origin-id").value = String(place.id);
      document.getElementById("origin-name").textContent = place.name;
      document.getElementById("origin-type").textContent = typeLabel(place.feature_type);
      document.getElementById("origin-chip").style.setProperty("--chip", colorFor(place.feature_type));
      document.getElementById("origin-chip").classList.add("is-set");
    } else {
      destinationPlace = place;
      document.getElementById("destination-id").value = String(place.id);
      document.getElementById("destination-name").textContent = place.name;
      document.getElementById("destination-type").textContent = typeLabel(place.feature_type);
      document.getElementById("destination-chip").style.setProperty("--chip", colorFor(place.feature_type));
      document.getElementById("destination-chip").classList.add("is-set");
    }
    // New A/B → clear old route filter until user redraws.
    lastRoute = null;
    if (routeLayer) {
      map.removeLayer(routeLayer);
      routeLayer = null;
    }
    renderPlaceBrowser();
    refreshMapLabels();
    map.panTo([place.lat, place.lon], { animate: true });
  }

  function renderPlaceBrowser() {
    const items = filteredPlaces();
    placeCountEl.textContent = `${items.length}/${places.length}`;
    if (browserNote) {
      browserNote.textContent = activeTypes.size
        ? `Đang lọc ${[...activeTypes].map(typeLabel).join(", ")} — bấm A / B để chọn`
        : "Lọc loại → tìm tên → bấm A hoặc B";
    }

    if (!items.length) {
      placeListEl.innerHTML =
        `<li class="place-empty">Không có địa điểm khớp. Bấm <strong>Tất cả</strong> hoặc xóa ô tìm.</li>`;
      return;
    }

    placeListEl.innerHTML = items
      .map((p) => {
        const isA = originPlace && originPlace.id === p.id;
        const isB = destinationPlace && destinationPlace.id === p.id;
        return `
          <li class="place-row ${isA || isB ? "is-selected" : ""}" data-id="${p.id}">
            <button type="button" class="place-main" data-focus="${p.id}" title="${escapeHtml(p.name)}">
              <span class="place-dot" style="background:${colorFor(p.feature_type)}"></span>
              <span class="place-meta">
                <strong>${escapeHtml(p.name)}</strong>
                <em>${escapeHtml(typeLabel(p.feature_type))}</em>
              </span>
            </button>
            <span class="place-actions">
              <button type="button" class="ab-btn ${isA ? "is-on" : ""}" data-set-a="${p.id}" title="Chọn làm điểm A">A</button>
              <button type="button" class="ab-btn ${isB ? "is-on" : ""}" data-set-b="${p.id}" title="Chọn làm điểm B">B</button>
            </span>
          </li>`;
      })
      .join("");
  }

  placeListEl.addEventListener("click", (event) => {
    const aBtn = event.target.closest("[data-set-a]");
    const bBtn = event.target.closest("[data-set-b]");
    const focusBtn = event.target.closest("[data-focus]");
    if (aBtn) {
      const place = places.find((p) => String(p.id) === aBtn.dataset.setA);
      setEndpoint("A", place);
      return;
    }
    if (bBtn) {
      const place = places.find((p) => String(p.id) === bBtn.dataset.setB);
      setEndpoint("B", place);
      return;
    }
    if (focusBtn) {
      const place = places.find((p) => String(p.id) === focusBtn.dataset.focus);
      if (place) map.flyTo([place.lat, place.lon], 14, { duration: 0.6 });
    }
  });

  function nameTagIcon(name, type, { emphasize = false } = {}) {
    const color = colorFor(type);
    const cls = emphasize ? "map-tag is-emphasis" : "map-tag";
    return L.divIcon({
      className: "map-tag-wrap",
      html: `
        <div class="${cls}" style="--tag:${color}">
          <span class="map-tag-dot"></span>
          <span class="map-tag-text">
            <strong>${escapeHtml(name)}</strong>
            <em>${escapeHtml(typeLabel(type))}</em>
          </span>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 12],
    });
  }

  function centroidOf(geometry) {
    if (!geometry) return null;
    if (geometry.type === "Point") {
      const [lon, lat] = geometry.coordinates;
      return [lat, lon];
    }
    try {
      const layer = L.geoJSON(geometry);
      const c = layer.getBounds().getCenter();
      return [c.lat, c.lng];
    } catch (_) {
      return null;
    }
  }

  function pointToRouteDistanceM(lat, lon, geometry) {
    const coords = geometry?.coordinates;
    if (!coords || coords.length < 2) return Infinity;
    let best = Infinity;
    for (let i = 0; i < coords.length - 1; i += 1) {
      const [lon1, lat1] = coords[i];
      const [lon2, lat2] = coords[i + 1];
      // Approximate closest point on segment in lon/lat space, then haversine.
      const dx = lon2 - lon1;
      const dy = lat2 - lat1;
      let t = 0;
      if (dx !== 0 || dy !== 0) {
        t = Math.max(0, Math.min(1, ((lon - lon1) * dx + (lat - lat1) * dy) / (dx * dx + dy * dy)));
      }
      const plat = lat1 + t * dy;
      const plon = lon1 + t * dx;
      best = Math.min(best, haversineM(lat, lon, plat, plon));
    }
    return best;
  }

  function refreshMapLabels(highlightIds = new Set()) {
    if (!allFeatures) return;
    featureLayer.clearLayers();

    const prefs = new Set(selectedPreferences());
    const hasRoute = Boolean(lastRoute?.geometry);
    // Fastest journey: no scenic tags on the map (A/B stay on routeLayer).
    if (hasRoute && mode === "fast") {
      return [];
    }

    const showAllTypes = !hasRoute && (mode === "fast" || prefs.size === 0);
    const alongRouteOnly = hasRoute && mode === "scenic";
    const bounds = [];

    allFeatures.features.forEach((f) => {
      if (!f.geometry) return;
      const type = f.properties.feature_type;
      const name = f.properties.name;
      const id = f.properties.id;
      if (!name) return;
      if (!showAllTypes && prefs.size > 0 && !prefs.has(type)) return;
      // Scenic journey: only preferred types (if any checked).
      if (alongRouteOnly && prefs.size > 0 && !prefs.has(type)) return;

      const ll = centroidOf(f.geometry);
      if (!ll) return;

      const isEndpoint =
        lastRoute && (id === lastRoute.originId || id === lastRoute.destinationId);

      // Scenic + route drawn: only tags near the path (A/B already on routeLayer).
      if (alongRouteOnly) {
        if (isEndpoint) return; // avoid duplicate A/B cards
        const dist = pointToRouteDistanceM(ll[0], ll[1], lastRoute.geometry);
        if (dist > ROUTE_TAG_MAX_M) return;
      }

      const emphasize =
        highlightIds.has(id) ||
        (lastRoute && lastRoute.sightingIds.has(id)) ||
        Boolean(isEndpoint);
      const place = places.find((p) => p.id === id);
      const marker = L.marker(ll, {
        icon: nameTagIcon(name, type, { emphasize }),
        zIndexOffset: emphasize ? 600 : 200,
      });

      const popup = L.popup().setContent(`
        <strong>${escapeHtml(name)}</strong><br/>
        ${escapeHtml(typeLabel(type))}<br/>
        <span class="popup-actions">
          <button type="button" class="popup-ab" data-popup-a="${id}">Đặt A</button>
          <button type="button" class="popup-ab" data-popup-b="${id}">Đặt B</button>
        </span>
      `);
      marker.bindPopup(popup);
      marker.on("popupopen", () => {
        const node = popup.getElement();
        if (!node) return;
        node.querySelector("[data-popup-a]")?.addEventListener("click", () => {
          if (place) setEndpoint("A", place);
          map.closePopup();
        });
        node.querySelector("[data-popup-b]")?.addEventListener("click", () => {
          if (place) setEndpoint("B", place);
          map.closePopup();
        });
      });
      marker.addTo(featureLayer);
      bounds.push(ll);

      if (f.geometry.type !== "Point") {
        L.geoJSON(f, {
          style: {
            color: colorFor(type),
            weight: emphasize ? 4 : 2,
            fillColor: colorFor(type),
            fillOpacity: emphasize ? 0.28 : 0.14,
          },
          interactive: false,
        }).addTo(featureLayer);
      }
    });

    return bounds;
  }

  function formatKm(meters) {
    return `${(meters / 1000).toFixed(1)} km`;
  }

  function formatMin(seconds) {
    return `${Math.round(seconds / 60)} phút`;
  }

  function bearingDeg(lat1, lon1, lat2, lon2) {
    const toRad = Math.PI / 180;
    const φ1 = lat1 * toRad;
    const φ2 = lat2 * toRad;
    const Δλ = (lon2 - lon1) * toRad;
    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
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

  function arrowIcon(rotation, color) {
    return L.divIcon({
      className: "route-arrow-wrap",
      html: `<div class="route-arrow" style="--rot:${rotation}deg;--arrow:${color}"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });
  }

  function addRouteDirectionArrows(geometry, color) {
    if (!geometry || geometry.type !== "LineString") return;
    const coords = geometry.coordinates || [];
    if (coords.length < 2) return;

    const spacingM = 280;
    let since = 0;
    let armed = false;
    let traveled = 0;

    for (let i = 0; i < coords.length - 1; i += 1) {
      const [lon1, lat1] = coords[i];
      const [lon2, lat2] = coords[i + 1];
      const seg = haversineM(lat1, lon1, lat2, lon2);
      if (seg < 1) continue;

      traveled += seg;
      if (!armed) {
        if (traveled < 80) continue;
        armed = true;
        since = 0;
      }

      since += seg;
      if (since < spacingM && i !== coords.length - 2) continue;
      since = 0;

      const rot = bearingDeg(lat1, lon1, lat2, lon2);
      const t = 0.65;
      const lat = lat1 + (lat2 - lat1) * t;
      const lon = lon1 + (lon2 - lon1) * t;
      L.marker([lat, lon], {
        icon: arrowIcon(rot, color),
        interactive: false,
        keyboard: false,
        zIndexOffset: 500,
      }).addTo(routeLayer);
    }
  }

  function renderStats(data) {
    const sightings = data.sightings || [];
    const list = sightings
      .map((s) => {
        const tagBits = (s.tags || []).length ? ` · ${s.tags.join(", ")}` : "";
        return `<li>${escapeHtml(s.name)} <em>(${typeLabel(s.feature_type)}${
          s.distance_meters != null ? ` · ~${s.distance_meters}m` : ""
        }${escapeHtml(tagBits)})</em></li>`;
      })
      .join("");

    const actualDetour =
      data.mode === "scenic"
        ? `+${Number(data.detour_extra_km || 0)} km`
        : "—";
    const limitDetour =
      data.mode === "scenic"
        ? `≤+${Number(data.max_extra_km ?? maxExtraKm)} km`
        : "";

    statsEl.classList.remove("is-empty");
    statsEl.innerHTML = `
      <div class="stats-grid">
        <div class="stat"><span>Khoảng cách</span><strong>${formatKm(data.distance_meters)}</strong></div>
        <div class="stat"><span>Thời gian</span><strong>${formatMin(data.duration_seconds)}</strong></div>
        <div class="stat">
          <span>Lệch so với nhanh</span>
          <strong>${actualDetour}</strong>
          ${limitDetour ? `<em class="stat-sub">giới hạn ${escapeHtml(limitDetour)}</em>` : ""}
        </div>
        <div class="stat"><span>Khớp cảnh</span><strong>${
          data.mode === "scenic"
            ? data.scenic_matched
              ? "Có"
              : "Chưa"
            : "—"
        }</strong></div>
      </div>
      <p class="summary">${escapeHtml(data.summary)}</p>
      ${list ? `<ul class="waypoints">${list}</ul>` : ""}
    `;
  }

  async function drawRoute({ relaxPreferences = false, skipMatchPrompt = false } = {}) {
    const origin = originPlace;
    const destination = destinationPlace;
    if (!origin || !destination) {
      statsEl.classList.remove("is-empty");
      statsEl.innerHTML = `<p class="hint">Chọn Điểm A và Điểm B từ danh sách (nút A / B).</p>`;
      return;
    }
    if (!roadGraph) {
      statsEl.classList.remove("is-empty");
      statsEl.innerHTML = `<p class="hint">Chưa load được dalat_bundle — chạy export-json rồi restart server.</p>`;
      return;
    }

    const preferences = selectedPreferences();
    if (mode === "scenic" && preferences.length === 0 && !relaxPreferences) {
      statsEl.classList.remove("is-empty");
      statsEl.innerHTML = `<p class="hint">Chọn ít nhất một loại cảnh (vd. Hồ) — hoặc bỏ sang mode Nhanh nhất.</p>`;
      return;
    }

    goBtn.disabled = true;
    goBtn.textContent = "Đang dò…";
    try {
      const data = await window.TagRouter.route(
        roadGraph,
        origin,
        destination,
        mode,
        preferences,
        {
          relaxPreferences: Boolean(relaxPreferences),
          maxExtraM: Math.max(0, maxExtraKm) * 1000,
        }
      );

      // Scenic without matching tag → still preview path, but force a choice.
      if (
        mode === "scenic" &&
        !relaxPreferences &&
        !skipMatchPrompt &&
        data.scenic_matched === false
      ) {
        applyRouteToMap(data);
        openScenicModal(data);
        return;
      }

      applyRouteToMap(data);
    } catch (err) {
      statsEl.classList.remove("is-empty");
      statsEl.innerHTML = `<p class="hint">Lỗi: ${escapeHtml(err.message)}</p>`;
    } finally {
      goBtn.disabled = false;
      goBtn.textContent = "Vẽ hành trình";
    }
  }

  async function boot() {
    if (networkStatus) networkStatus.textContent = "Đang tải dalat_bundle…";

    const [featuresRes, placesRes, bundleRes] = await Promise.all([
      fetch("/api/demo/features"),
      fetch("/api/demo/places"),
      fetch("/api/demo/bundle"),
    ]);

    if (!featuresRes.ok) {
      throw new Error(`features HTTP ${featuresRes.status}`);
    }
    if (!placesRes.ok) {
      throw new Error(`places HTTP ${placesRes.status}`);
    }
    if (!bundleRes.ok) {
      const err = await bundleRes.json().catch(() => ({}));
      throw new Error(
        err.detail ||
          `bundle HTTP ${bundleRes.status} — chạy: python -m app.cli export-json`
      );
    }

    allFeatures = await featuresRes.json();
    places = await placesRes.json();
    if (networkStatus) networkStatus.textContent = "Đang build graph từ bundle…";
    const bundle = await bundleRes.json();

    if (!window.TagRouter) {
      throw new Error("Thiếu tag_router.js");
    }
    roadGraph = window.TagRouter.buildGraph(bundle);
    if (networkStatus) {
      const tagged = (bundle.counts && bundle.counts.roads_with_natural_tags) || "—";
      networkStatus.textContent = `Bundle OK · ${roadGraph.roads.length} đoạn đi được · ${tagged} road có tag`;
    }

    buildTypeFilters();
    renderPlaceBrowser();

    if (places.length >= 2) {
      setEndpoint("A", places[0]);
      setEndpoint("B", places[Math.min(places.length - 1, 3)] || places[1]);
    }

    const bounds = refreshMapLabels();
    if (bounds && bounds.length) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }

  boot().catch((err) => {
    statsEl.classList.remove("is-empty");
    statsEl.innerHTML = `<p class="hint">Không tải được data: ${escapeHtml(err.message)}</p>`;
    if (networkStatus) networkStatus.textContent = `Lỗi: ${err.message}`;
  });
})();

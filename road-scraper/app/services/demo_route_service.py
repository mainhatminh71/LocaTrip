"""Demo A→B routing: fastest vs scenic corridor (detour budget, no POI visits)."""

from __future__ import annotations

import logging
import math
from typing import Any, Literal

import httpx
from sqlalchemy.orm import Session

from app.core.scenic_weights import weight_for
from app.repositories.demo_repository import DemoRepository
from app.services.road_graph import RoadGraph, edges_to_geojson

logger = logging.getLogger(__name__)

Mode = Literal["fast", "scenic"]
Intensity = Literal["light", "balanced", "max"]

# Default: scenic may be up to this many km longer than the fastest path.
# Absolute km (not radius): clearer for users than a corridor buffer.
DEFAULT_MAX_EXTRA_KM = 5.0
CORRIDOR_BUFFER_M = 180.0
PASS_BY_MAX_KM = 0.35

DEFAULT_PREFERENCES = (
    "lake",
    "waterfall",
    "forest",
    "wood",
    "mountain",
    "peak",
    "viewpoint",
    "river",
    "village",
)

# Process-level cache of base road edges (geometry + length), no scenic scores.
_EDGE_CACHE: list[dict[str, Any]] | None = None


class DemoRouteService:
    """Route on crawled roads: scenic = prefer corridors within extra-km budget."""

    def __init__(self, db: Session) -> None:
        self._repo = DemoRepository(db)

    def build_route(
        self,
        origin_id: int,
        destination_id: int,
        mode: Mode,
        intensity: Intensity = "balanced",
        preferences: list[str] | None = None,
        max_extra_km: float = DEFAULT_MAX_EXTRA_KM,
        relax_preferences: bool = False,
    ) -> dict[str, Any]:
        origin = self._repo.place_by_id(origin_id)
        destination = self._repo.place_by_id(destination_id)
        if origin is None or destination is None:
            raise ValueError("Origin or destination not found in natural_features")
        if origin_id == destination_id:
            raise ValueError("Origin and destination must be different")

        prefs = tuple(preferences) if preferences else DEFAULT_PREFERENCES
        if not prefs:
            prefs = DEFAULT_PREFERENCES

        # Option 1 in the UI: drop preferred scene types → fastest under the same length idea.
        extra_km = max(0.0, float(max_extra_km))
        max_extra_m = extra_km * 1000.0

        effective_mode: Mode = "fast" if (mode == "fast" or relax_preferences) else "scenic"

        local = self._route_local_graph(
            origin,
            destination,
            mode=effective_mode,
            preferences=prefs,
            max_extra_m=max_extra_m,
            apply_scenic=effective_mode == "scenic",
        )

        if local is None:
            logger.warning("Local road graph failed — falling back to OSRM A→B")
            return self._route_osrm_fallback(
                origin, destination, mode, prefs, max_extra_km=extra_km
            )

        geometry = local["geometry"]
        coordinates = geometry.get("coordinates") or []
        sightings: list[dict[str, Any]] = []
        if mode == "scenic" and not relax_preferences:
            path_edges = local.get("edges") or []
            sightings = self._sightings_from_path_tags(
                path_edges,
                preferences=prefs,
                exclude_feature_types=set(),
                route_coordinates=coordinates,
            )
            # Fallback: named features near the polyline if path roads lack tags.
            if not sightings and coordinates:
                sightings = self._find_pass_by_sightings(
                    coordinates,
                    preferences=prefs,
                    exclude_ids={origin["id"], destination["id"]},
                )

        # Popup trigger: user-visible tags along the route for preferred types.
        # Corridor-score-only improvement is NOT enough (map would still look empty).
        scenic_matched = (
            mode != "scenic"
            or relax_preferences
            or bool(sightings)
        )

        detour_extra_m = float(local.get("detour_extra_m") or max(0.0, local["length_m"] - local.get("fast_length_m", local["length_m"])))
        detour_pct = round(local.get("detour_ratio", 0.0) * 100)
        duration = local["length_m"] / 8.0

        return {
            "mode": mode,
            "intensity": None,
            "preferences": list(prefs) if mode == "scenic" else [],
            "origin": origin,
            "destination": destination,
            "waypoints": [],
            "sightings": sightings,
            "distance_meters": local["length_m"],
            "duration_seconds": duration,
            "scenic_score": local["scenic_score"] if mode == "scenic" else 0.0,
            "detour_percent": detour_pct if mode == "scenic" else 0,
            "detour_extra_km": round(detour_extra_m / 1000.0, 2) if mode == "scenic" else 0.0,
            "max_extra_km": extra_km if mode == "scenic" else None,
            "fast_distance_meters": float(local.get("fast_length_m") or local["length_m"]),
            "scenic_matched": scenic_matched if mode == "scenic" else True,
            "relax_preferences": relax_preferences if mode == "scenic" else False,
            "geometry": geometry,
            "summary": self._summary(
                mode,
                prefs,
                origin,
                destination,
                sightings,
                detour_pct,
                local["scenic_score"],
                extra_km=extra_km,
                scenic_matched=scenic_matched,
                relax_preferences=relax_preferences,
                detour_extra_km=round(detour_extra_m / 1000.0, 2),
            ),
        }

    def _route_local_graph(
        self,
        origin: dict[str, Any],
        destination: dict[str, Any],
        *,
        mode: Mode,
        preferences: tuple[str, ...],
        max_extra_m: float,
        apply_scenic: bool = True,
    ) -> dict[str, Any] | None:
        edges = self._base_edges()
        if not edges:
            return None

        scores: dict[int, float] = {}
        if mode == "scenic" and apply_scenic:
            scores = self._repo.road_corridor_scores(
                preferences,
                buffer_meters=CORRIDOR_BUFFER_M,
            )

        scored_rows = [
            {**edge, "scenic": scores.get(int(edge["id"]), 0.0)} for edge in edges
        ]
        graph = RoadGraph.from_edges(scored_rows)
        src = graph.nearest_node(origin["lat"], origin["lon"])
        dst = graph.nearest_node(destination["lat"], destination["lon"])
        if src is None or dst is None:
            return None

        if mode == "fast" or not apply_scenic:
            result = graph.shortest_path(src, dst, scenic_bias=0.0)
            if result is None:
                return None
            path_edges, length_m, scenic = result
            return {
                "edges": path_edges,
                "length_m": length_m,
                "scenic_score": scenic,
                "fast_length_m": length_m,
                "detour_ratio": 0.0,
                "detour_extra_m": 0.0,
                "scenic_improved": False,
                "geometry": edges_to_geojson(path_edges),
            }

        return graph.route_with_detour_budget(
            src,
            dst,
            max_extra_m=max_extra_m,
        )

    def _base_edges(self) -> list[dict[str, Any]]:
        global _EDGE_CACHE
        if _EDGE_CACHE is None:
            _EDGE_CACHE = self._repo.load_drivable_road_edges()
            logger.info("Loaded %s drivable road edges into graph cache", len(_EDGE_CACHE))
        return _EDGE_CACHE

    def _sightings_from_path_tags(
        self,
        path_edges: list[Any],
        preferences: tuple[str, ...],
        exclude_feature_types: set[str],
        route_coordinates: list[list[float]],
    ) -> list[dict[str, Any]]:
        """Build map tags from natural_tags attached to roads on the path."""
        _ = exclude_feature_types
        road_ids = {int(e.road_id) for e in path_edges if getattr(e, "road_id", 0) > 0}
        if not road_ids:
            return []

        prefs = set(preferences)
        tag_points = self._repo.natural_tags_for_roads(road_ids)
        line = _downsample_line(route_coordinates, max_points=80) if route_coordinates else []

        # One sighting per feature (keep all matching tag names).
        by_feature: dict[Any, dict[str, Any]] = {}
        for point in tag_points:
            feature_type = point.get("feature_type")
            if feature_type not in prefs:
                continue
            try:
                lat = float(point["lat"])
                lon = float(point["lon"])
            except (KeyError, TypeError, ValueError):
                continue

            osm_id = point.get("feature_osm_id")
            key = osm_id if osm_id is not None else (feature_type, round(lat, 5), round(lon, 5))
            tag_name = str(point.get("tag") or "")
            entry = by_feature.get(key)
            if entry is None:
                progress = 0.0
                dist_m = float(point.get("distance_m") or 0.0)
                if line:
                    dist_km, progress = _point_to_polyline_km(lat, lon, line)
                    dist_m = dist_km * 1000.0
                    if progress <= 0.02 or progress >= 0.98:
                        continue
                name = point.get("feature_name") or tag_name or str(feature_type)
                entry = {
                    "id": int(osm_id) if osm_id is not None else hash(key) % 10_000_000,
                    "feature_type": feature_type,
                    "name": name,
                    "lat": lat,
                    "lon": lon,
                    "weight": weight_for(str(feature_type)),
                    "tags": [],
                    "distance_meters": round(dist_m),
                    "progress": round(progress, 3),
                }
                by_feature[key] = entry
            if tag_name and tag_name not in entry["tags"]:
                entry["tags"].append(tag_name)

        found = list(by_feature.values())
        found.sort(key=lambda item: item.get("progress", 0.0))
        return found

    def _find_pass_by_sightings(
        self,
        coordinates: list[list[float]],
        preferences: tuple[str, ...],
        exclude_ids: set[int],
    ) -> list[dict[str, Any]]:
        line = _downsample_line(coordinates, max_points=80)
        candidates = self._repo.scenic_candidates(preferences)
        found: list[dict[str, Any]] = []

        for place in candidates:
            if place["id"] in exclude_ids:
                continue
            dist_km, progress = _point_to_polyline_km(place["lat"], place["lon"], line)
            if dist_km > PASS_BY_MAX_KM:
                continue
            if progress <= 0.02 or progress >= 0.98:
                continue
            found.append(
                {
                    **place,
                    "distance_meters": round(dist_km * 1000),
                    "progress": round(progress, 3),
                }
            )

        found.sort(key=lambda item: item["progress"])
        return found

    def _route_osrm_fallback(
        self,
        origin: dict[str, Any],
        destination: dict[str, Any],
        mode: Mode,
        prefs: tuple[str, ...],
        max_extra_km: float = DEFAULT_MAX_EXTRA_KM,
    ) -> dict[str, Any]:
        osrm = self._route_osrm([origin, destination])
        geometry = osrm.get("geometry") or {"type": "LineString", "coordinates": []}
        coordinates = geometry.get("coordinates") or []
        sightings: list[dict[str, Any]] = []
        if mode == "scenic" and coordinates:
            sightings = self._find_pass_by_sightings(
                coordinates,
                preferences=prefs,
                exclude_ids={origin["id"], destination["id"]},
            )
        scenic_matched = bool(sightings) if mode == "scenic" else True
        return {
            "mode": mode,
            "intensity": None,
            "preferences": list(prefs) if mode == "scenic" else [],
            "origin": origin,
            "destination": destination,
            "waypoints": [],
            "sightings": sightings,
            "distance_meters": osrm["distance"],
            "duration_seconds": osrm["duration"],
            "scenic_score": sum(s["weight"] for s in sightings),
            "detour_percent": 0,
            "detour_extra_km": 0.0,
            "max_extra_km": max_extra_km if mode == "scenic" else None,
            "fast_distance_meters": osrm["distance"],
            "scenic_matched": scenic_matched,
            "relax_preferences": False,
            "geometry": geometry,
            "summary": self._summary(
                mode,
                prefs,
                origin,
                destination,
                sightings,
                0,
                0.0,
                extra_km=max_extra_km,
                scenic_matched=scenic_matched,
                relax_preferences=False,
                detour_extra_km=0.0,
            )
            + " (OSRM fallback)",
        }

    def _route_osrm(self, places: list[dict[str, Any]]) -> dict[str, Any]:
        coord_str = ";".join(f"{p['lon']},{p['lat']}" for p in places)
        url = (
            f"https://router.project-osrm.org/route/v1/driving/{coord_str}"
            "?overview=full&geometries=geojson"
        )
        try:
            with httpx.Client(timeout=20.0) as client:
                response = client.get(url)
                response.raise_for_status()
                payload = response.json()
            routes = payload.get("routes") or []
            if not routes:
                raise ValueError("OSRM returned no routes")
            route = routes[0]
            return {
                "distance": float(route.get("distance") or 0),
                "duration": float(route.get("duration") or 0),
                "geometry": route.get("geometry"),
            }
        except Exception:
            logger.exception("OSRM failed — using straight fallback geometry")
            return self._fallback_geometry(places)

    @staticmethod
    def _fallback_geometry(places: list[dict[str, Any]]) -> dict[str, Any]:
        coordinates = [[p["lon"], p["lat"]] for p in places]
        distance = 0.0
        for i in range(len(places) - 1):
            distance += (
                _haversine_km(
                    places[i]["lat"],
                    places[i]["lon"],
                    places[i + 1]["lat"],
                    places[i + 1]["lon"],
                )
                * 1000
            )
        return {
            "distance": distance,
            "duration": distance / 8.0,
            "geometry": {"type": "LineString", "coordinates": coordinates},
        }

    @staticmethod
    def _summary(
        mode: Mode,
        preferences: tuple[str, ...],
        origin: dict[str, Any],
        destination: dict[str, Any],
        sightings: list[dict[str, Any]],
        detour_pct: int,
        corridor_score: float,
        *,
        extra_km: float = DEFAULT_MAX_EXTRA_KM,
        scenic_matched: bool = True,
        relax_preferences: bool = False,
        detour_extra_km: float = 0.0,
    ) -> str:
        if mode == "fast":
            return (
                f"Đường nhanh nhất từ {origin['name']} đến {destination['name']} "
                "(ưu tiên thời gian)."
            )

        if relax_preferences:
            return (
                f"Giữ giới hạn +{extra_km:g} km so với đường nhanh nhất, "
                f"không ưu tiên loại cảnh đã chọn. "
                f"Từ {origin['name']} đến {destination['name']}."
            )

        base = f"Hành lang ngắm cảnh từ {origin['name']} đến {destination['name']}"
        base += f" (tối đa +{extra_km:g} km so với nhanh nhất"
        if detour_extra_km > 0:
            base += f", thực tế +{detour_extra_km:g} km"
        base += "). Tiến về đích — scenic chỉ là bonus trên corridor."

        if not scenic_matched:
            base += " Trong giới hạn này chưa khớp loại cảnh đã chọn."
        elif sightings:
            names = ", ".join(s["name"] for s in sightings)
            base += f" Đi ngang: {names}."
        elif corridor_score > 0:
            base += " Đã ưu tiên đoạn đường gần loại cảnh đã chọn."
        else:
            base += " Chưa thấy corridor khớp loại cảnh đã chọn."
        return base


def _downsample_line(coordinates: list[list[float]], max_points: int = 80) -> list[tuple[float, float]]:
    if not coordinates:
        return []
    if len(coordinates) <= max_points:
        return [(lat, lon) for lon, lat in coordinates]
    step = max(1, len(coordinates) // max_points)
    sampled = [(lat, lon) for lon, lat in coordinates[::step]]
    last = coordinates[-1]
    if sampled[-1] != (last[1], last[0]):
        sampled.append((last[1], last[0]))
    return sampled


def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    r = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlmb = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dlmb / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


def _point_to_segment_km(
    lat: float,
    lon: float,
    lat1: float,
    lon1: float,
    lat2: float,
    lon2: float,
) -> float:
    x, y = lon, lat
    x1, y1 = lon1, lat1
    x2, y2 = lon2, lat2
    dx, dy = x2 - x1, y2 - y1
    if dx == 0 and dy == 0:
        return _haversine_km(lat, lon, lat1, lon1)
    t = max(0.0, min(1.0, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)))
    return _haversine_km(lat, lon, y1 + t * dy, x1 + t * dx)


def _point_to_polyline_km(
    lat: float,
    lon: float,
    line: list[tuple[float, float]],
) -> tuple[float, float]:
    if len(line) < 2:
        if not line:
            return 999.0, 0.0
        return _haversine_km(lat, lon, line[0][0], line[0][1]), 0.0

    segment_lengths: list[float] = []
    for i in range(len(line) - 1):
        segment_lengths.append(
            _haversine_km(line[i][0], line[i][1], line[i + 1][0], line[i + 1][1])
        )
    total = sum(segment_lengths) or 1.0

    best_dist = 999.0
    best_progress = 0.0
    traveled = 0.0
    for i in range(len(line) - 1):
        lat1, lon1 = line[i]
        lat2, lon2 = line[i + 1]
        dist = _point_to_segment_km(lat, lon, lat1, lon1, lat2, lon2)
        dx, dy = lon2 - lon1, lat2 - lat1
        if dx == 0 and dy == 0:
            t = 0.0
        else:
            t = max(0.0, min(1.0, ((lon - lon1) * dx + (lat - lat1) * dy) / (dx * dx + dy * dy)))
        progress = (traveled + t * segment_lengths[i]) / total
        if dist < best_dist:
            best_dist = dist
            best_progress = progress
        traveled += segment_lengths[i]

    return best_dist, best_progress

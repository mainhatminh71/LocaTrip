"""GeoJSON and place listings for the scenic demo UI."""

from __future__ import annotations

import json
import re
from typing import Any, Iterable

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.scenic_weights import FEATURE_TYPES, weight_for

_NAMED_FILTER = """
    geometry IS NOT NULL
    AND name IS NOT NULL
    AND TRIM(name) <> ''
"""

_TYPE_LABELS = {
    "lake": "Hồ",
    "river": "Sông",
    "waterfall": "Thác",
    "forest": "Rừng",
    "wood": "Rừng cây",
    "mountain": "Núi",
    "hill": "Đồi",
    "peak": "Đỉnh",
    "valley": "Thung lũng",
    "cliff": "Vách đá",
    "beach": "Bãi biển",
    "coastline": "Bờ biển",
    "viewpoint": "Điểm ngắm",
    "national_park": "Vườn quốc gia",
    "village": "Làng",
    "town": "Thị trấn",
    "hamlet": "Xóm",
}

# Names that are placeholders / auto defaults — never show in A/B or map tags.
_PLACEHOLDER_NAME = re.compile(
    r"^(điểm ngắm\s*#?\d*|unnamed\b.*|viewpoint\s*#?\d*|thác\s*#\d+|hồ\s*#\d+|"
    r"rừng\s*#\d+|đỉnh\s*#\d+|núi\s*#\d+|peak\s*#?\d*|lake\s*#?\d*|forest\s*#?\d*|"
    r"viewpoint|lake|peak|forest|wood|mountain|waterfall)$",
    re.IGNORECASE,
)


def is_real_place_name(name: str | None, feature_type: str | None = None) -> bool:
    """True when OSM name is a concrete place label, not a fallback."""
    if not name or not str(name).strip():
        return False
    text_name = str(name).strip()
    if len(text_name) < 2:
        return False
    if _PLACEHOLDER_NAME.match(text_name):
        return False
    if text_name.lower().startswith("viewpoint"):
        # OSM often uses English "Viewpoint (...)" as a weak label.
        return False
    if feature_type and text_name.lower() == feature_type.lower():
        return False
    if "#" in text_name and re.search(r"#\d+$", text_name):
        # e.g. "Điểm ngắm #12", "Thác #24"
        prefix = text_name.split("#", 1)[0].strip().lower()
        if prefix in {v.lower() for v in _TYPE_LABELS.values()} | set(_TYPE_LABELS):
            return False
    return True


def _normalize_place_key(name: str) -> str:
    """Collapse near-identical names so park/garden duplicates merge."""
    text_name = str(name).strip().lower()
    text_name = re.sub(r"\s+", " ", text_name)
    return text_name


# Prefer richer destination types when the same OSM name appears twice.
_TYPE_RANK: dict[str, int] = {
    "lake": 100,
    "waterfall": 95,
    "national_park": 90,
    "viewpoint": 85,
    "peak": 80,
    "mountain": 78,
    "park": 70,
    "garden": 65,
    "village": 60,
    "river": 55,
    "stream": 50,
    "wood": 45,
    "forest": 44,
    "cliff": 40,
}


def dedupe_places_by_name(places: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Keep one row per place name (best feature_type / weight)."""
    best: dict[str, dict[str, Any]] = {}
    for place in places:
        key = _normalize_place_key(place.get("name") or "")
        if not key:
            continue
        current = best.get(key)
        if current is None:
            best[key] = place
            continue
        cur_rank = _TYPE_RANK.get(str(current.get("feature_type")), 0)
        new_rank = _TYPE_RANK.get(str(place.get("feature_type")), 0)
        cur_w = float(current.get("weight") or 0)
        new_w = float(place.get("weight") or 0)
        if new_rank > cur_rank or (new_rank == cur_rank and new_w > cur_w):
            best[key] = place
        elif new_rank == cur_rank and new_w == cur_w:
            # Stable: keep lower id.
            if int(place.get("id") or 0) < int(current.get("id") or 0):
                best[key] = place
    out = list(best.values())
    out.sort(key=lambda p: (str(p.get("name") or "").lower(), str(p.get("feature_type") or "")))
    return out


class DemoRepository:
    """Read-only spatial queries for the demo map."""

    def __init__(self, db: Session) -> None:
        self._db = db

    def features_geojson(self) -> dict[str, Any]:
        """Named natural features only (real OSM names)."""
        rows = self._db.execute(
            text(
                f"""
                SELECT
                    id,
                    osm_id,
                    feature_type,
                    TRIM(name) AS name,
                    ST_AsGeoJSON(geometry)::json AS geom,
                    raw_tags
                FROM natural_features
                WHERE {_NAMED_FILTER}
                ORDER BY feature_type, name, id
                """
            )
        ).mappings().all()

        features = []
        for row in rows:
            if not is_real_place_name(row["name"], row["feature_type"]):
                continue
            geom = row["geom"]
            if isinstance(geom, str):
                geom = json.loads(geom)
            features.append(
                {
                    "type": "Feature",
                    "geometry": geom,
                    "properties": {
                        "id": row["id"],
                        "osm_id": row["osm_id"],
                        "feature_type": row["feature_type"],
                        "name": row["name"],
                        "weight": weight_for(row["feature_type"]),
                    },
                }
            )

        # Dedupe by name — same garden often also tagged as park.
        by_name: dict[str, dict[str, Any]] = {}
        for feat in features:
            props = feat["properties"]
            key = _normalize_place_key(props["name"])
            prev = by_name.get(key)
            if prev is None:
                by_name[key] = feat
                continue
            prev_rank = _TYPE_RANK.get(prev["properties"]["feature_type"], 0)
            new_rank = _TYPE_RANK.get(props["feature_type"], 0)
            if new_rank > prev_rank or (
                new_rank == prev_rank and props["weight"] > prev["properties"]["weight"]
            ):
                by_name[key] = feat
        return {"type": "FeatureCollection", "features": list(by_name.values())}

    def places(self) -> list[dict[str, Any]]:
        """Searchable A/B destinations — real names only, deduped by name."""
        rows = self._db.execute(
            text(
                f"""
                SELECT
                    id,
                    feature_type,
                    TRIM(name) AS name,
                    ST_Y(ST_Centroid(geometry)) AS lat,
                    ST_X(ST_Centroid(geometry)) AS lon
                FROM natural_features
                WHERE {_NAMED_FILTER}
                ORDER BY name, feature_type, id
                """
            )
        ).mappings().all()

        raw = [
            self._row_to_place(row)
            for row in rows
            if is_real_place_name(row["name"], row["feature_type"])
        ]
        return dedupe_places_by_name(raw)

    def scenic_candidates(self, feature_types: Iterable[str]) -> list[dict[str, Any]]:
        """Named scenic features of preferred types (for pass-by annotations)."""
        types = [t for t in feature_types if t]
        if not types:
            return []

        rows = self._db.execute(
            text(
                """
                SELECT
                    id,
                    feature_type,
                    NULLIF(TRIM(name), '') AS name,
                    ST_Y(ST_Centroid(geometry)) AS lat,
                    ST_X(ST_Centroid(geometry)) AS lon
                FROM natural_features
                WHERE geometry IS NOT NULL
                  AND feature_type = ANY(:types)
                ORDER BY name NULLS LAST, feature_type, id
                """
            ),
            {"types": types},
        ).mappings().all()

        return [
            self._row_to_place(row)
            for row in rows
            if is_real_place_name(row["name"], row["feature_type"])
        ]

    def place_by_id(self, place_id: int) -> dict[str, Any] | None:
        for place in self.places():
            if place["id"] == place_id:
                return place
        return None

    def load_drivable_road_edges(self) -> list[dict[str, Any]]:
        """LINESTRINGs usable for demo driving graph (cached by caller)."""
        rows = self._db.execute(
            text(
                """
                SELECT
                    id,
                    highway,
                    oneway,
                    ST_Length(geometry::geography) AS length_m,
                    ST_AsGeoJSON(geometry)::json AS geom
                FROM roads
                WHERE geometry IS NOT NULL
                  AND highway = ANY(:highways)
                """
            ),
            {"highways": list(_DRIVABLE_HIGHWAYS)},
        ).mappings().all()

        edges: list[dict[str, Any]] = []
        for row in rows:
            geom = row["geom"]
            if not geom or geom.get("type") != "LineString":
                continue
            coords = geom.get("coordinates") or []
            if len(coords) < 2:
                continue
            edges.append(
                {
                    "id": int(row["id"]),
                    "highway": row["highway"],
                    "oneway": row["oneway"],
                    "length_m": float(row["length_m"] or 0.0),
                    "coordinates": coords,
                }
            )
        return edges

    def road_corridor_scores(
        self,
        preferences: Iterable[str],
        buffer_meters: float = 180.0,
    ) -> dict[int, float]:
        """Scenic corridor score per road from attached natural_tags.

        Preferences are feature_type values (lake, forest, …). Each matching
        nearby feature contributes once (via feature_osm_id), using its weight.
        ``buffer_meters`` is unused — tags were already built within enrich buffer.
        """
        _ = buffer_meters
        allowed = set(FEATURE_TYPES)
        types = {t for t in preferences if t in allowed}
        if not types:
            return {}

        rows = self._db.execute(
            text(
                """
                SELECT id, natural_tags
                FROM roads
                WHERE geometry IS NOT NULL
                  AND highway = ANY(:highways)
                  AND natural_tags IS NOT NULL
                  AND jsonb_typeof(natural_tags) = 'array'
                  AND jsonb_array_length(natural_tags) > 0
                """
            ),
            {"highways": list(_DRIVABLE_HIGHWAYS)},
        ).mappings().all()

        scores: dict[int, float] = {}
        for row in rows:
            tags = row["natural_tags"] or []
            if not isinstance(tags, list):
                continue
            seen: set[Any] = set()
            score = 0.0
            for item in tags:
                if not isinstance(item, dict):
                    continue
                feature_type = item.get("feature_type")
                if feature_type not in types:
                    continue
                osm_id = item.get("feature_osm_id")
                key = osm_id if osm_id is not None else (
                    feature_type,
                    round(float(item.get("lat") or 0), 5),
                    round(float(item.get("lon") or 0), 5),
                )
                if key in seen:
                    continue
                seen.add(key)
                score += float(weight_for(str(feature_type)))
            if score > 0:
                scores[int(row["id"])] = score
        return scores

    def natural_tags_for_roads(self, road_ids: Iterable[int]) -> list[dict[str, Any]]:
        """Flatten natural_tag points for the given road ids."""
        ids = sorted({int(i) for i in road_ids if int(i) > 0})
        if not ids:
            return []
        rows = self._db.execute(
            text(
                """
                SELECT id, natural_tags
                FROM roads
                WHERE id = ANY(:ids)
                  AND natural_tags IS NOT NULL
                """
            ),
            {"ids": ids},
        ).mappings().all()
        out: list[dict[str, Any]] = []
        for row in rows:
            tags = row["natural_tags"] or []
            if not isinstance(tags, list):
                continue
            for item in tags:
                if isinstance(item, dict) and item.get("tag") is not None:
                    out.append(dict(item))
        return out

    def _row_to_place(self, row: Any) -> dict[str, Any]:
        return {
            "id": row["id"],
            "feature_type": row["feature_type"],
            "name": row["name"],
            "lat": float(row["lat"]),
            "lon": float(row["lon"]),
            "weight": weight_for(row["feature_type"]),
        }


_DRIVABLE_HIGHWAYS = (
    "motorway",
    "trunk",
    "primary",
    "secondary",
    "tertiary",
    "unclassified",
    "residential",
    "living_street",
    "service",
    "track",
    "road",
    "motorway_link",
    "trunk_link",
    "primary_link",
    "secondary_link",
    "tertiary_link",
)

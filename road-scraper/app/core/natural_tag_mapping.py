"""Map OSM natural / landuse features → road natural_tags (pass-by scenery only).

Each stored natural_tag is a point object (not a bare string):

    {"tag": "lake_view", "lat": 11.94, "lon": 108.45, "feature_type": "lake", ...}

So routing can prefer tagged corridors and the UI/export can place each tag on the map.
"""

from __future__ import annotations

from typing import Any, Iterable

# feature_type in natural_features → scenic tag tokens for nearby roads.
FEATURE_TYPE_TO_TAGS: dict[str, tuple[str, ...]] = {
    "lake": ("lake_view", "nature"),
    "river": ("river", "nature"),
    "waterfall": ("waterfall_nearby", "scenic", "nature"),
    "forest": ("forest", "greenery", "nature"),
    "wood": ("forest", "pine_forest", "greenery", "nature"),
    "mountain": ("mountain_view", "scenic", "nature"),
    "hill": ("hill", "nature"),
    "peak": ("mountain_view", "scenic", "nature"),
    "valley": ("valley_view", "nature"),
    "cliff": ("cliff_view", "scenic", "nature"),
    "beach": ("nature", "scenic"),
    "coastline": ("nature",),
    "viewpoint": ("scenic", "mountain_view"),
    "national_park": ("park", "forest", "nature", "scenic"),
    "park": ("park", "garden", "greenery"),
    "garden": ("garden", "flower_garden", "greenery"),
    "grassland": ("greenery", "nature"),
    "meadow": ("greenery", "nature"),
    "farmland": ("farmland", "nature"),
    "orchard": ("orchard", "farmland", "nature"),
    "vineyard": ("vineyard", "farmland", "nature"),
    "stream": ("creek", "nature"),
    "scrub": ("greenery", "nature"),
    "village": ("nature",),
    "town": ("nature",),
    "hamlet": ("nature",),
}

# Extra tags inferred from OSM raw_tags on the nearby feature.
_RAW_TAG_RULES: tuple[tuple[str, str, str], ...] = (
    ("leaf_type", "needleleaved", "pine_forest"),
    ("leaf_type", "evergreen", "pine_forest"),
    ("trees", "pine", "pine_forest"),
    ("genus", "Pinus", "pine_forest"),
    ("crop", "tea", "tea_hill"),
    ("produce", "tea", "tea_hill"),
    ("crop", "coffee", "coffee_farm"),
    ("produce", "coffee", "coffee_farm"),
    ("landuse", "plantation", "farmland"),
    ("natural", "heath", "greenery"),
    ("tourism", "attraction", "scenic"),
    ("historic", "castle", "landmark"),
    ("historic", "manor", "old_villa"),
    ("building", "villa", "old_villa"),
)


def tags_for_feature(feature_type: str, raw_tags: dict[str, Any] | None = None) -> list[str]:
    """Derive natural_tags from a nearby feature (type + optional OSM tags)."""
    tags: list[str] = list(FEATURE_TYPE_TO_TAGS.get(feature_type, ("nature",)))
    raw = raw_tags or {}
    for key, expected, tag in _RAW_TAG_RULES:
        value = raw.get(key)
        if value is None:
            continue
        if str(value).strip().lower() == expected.lower():
            tags.append(tag)
    # Name heuristics (OSM often encodes crop / pine in the name).
    name = str(raw.get("name") or "").lower()
    if "thông" in name or "pine" in name:
        tags.append("pine_forest")
    if "hoa" in name or "flower" in name:
        tags.append("flower_garden")
    if "chè" in name or "tea" in name:
        tags.append("tea_hill")
    if "cà phê" in name or "cafe" in name or "coffee" in name:
        tags.append("coffee_farm")
    if "sương" in name or "fog" in name or "mist" in name:
        tags.append("fog")
    return dedupe_tags(tags)


def dedupe_tags(tags: Iterable[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for tag in tags:
        t = str(tag).strip().lower().replace(" ", "_")
        if not t or t in seen:
            continue
        seen.add(t)
        out.append(t)
    return sorted(out)


def tag_points_for_feature(
    feature_type: str,
    *,
    lat: float,
    lon: float,
    raw_tags: dict[str, Any] | None = None,
    feature_osm_id: int | None = None,
    feature_name: str | None = None,
    distance_m: float | None = None,
) -> list[dict[str, Any]]:
    """Build natural_tag point objects for one nearby feature."""
    name = (feature_name or "").strip() or None
    dist = round(float(distance_m), 1) if distance_m is not None else None
    osm_id = int(feature_osm_id) if feature_osm_id is not None else None
    points: list[dict[str, Any]] = []
    for tag in tags_for_feature(feature_type, raw_tags):
        points.append(
            {
                "tag": tag,
                "lat": round(float(lat), 7),
                "lon": round(float(lon), 7),
                "feature_type": feature_type,
                "feature_osm_id": osm_id,
                "feature_name": name,
                "distance_m": dist,
            }
        )
    return points


def dedupe_tag_points(points: Iterable[dict[str, Any]]) -> list[dict[str, Any]]:
    """Unique by (tag, feature_osm_id, rounded lat/lon); sorted for stable JSON."""
    seen: set[tuple[Any, ...]] = set()
    out: list[dict[str, Any]] = []
    for raw in points:
        if not isinstance(raw, dict):
            continue
        tag = str(raw.get("tag") or "").strip().lower().replace(" ", "_")
        try:
            lat = float(raw["lat"])
            lon = float(raw["lon"])
        except (KeyError, TypeError, ValueError):
            continue
        if not tag:
            continue
        osm_id = raw.get("feature_osm_id")
        key = (tag, osm_id, round(lat, 5), round(lon, 5))
        if key in seen:
            continue
        seen.add(key)
        point = {
            "tag": tag,
            "lat": round(lat, 7),
            "lon": round(lon, 7),
            "feature_type": raw.get("feature_type"),
            "feature_osm_id": int(osm_id) if osm_id is not None else None,
            "feature_name": (str(raw["feature_name"]).strip() or None)
            if raw.get("feature_name")
            else None,
            "distance_m": (
                round(float(raw["distance_m"]), 1)
                if raw.get("distance_m") is not None
                else None
            ),
        }
        out.append(point)
    out.sort(
        key=lambda p: (
            str(p.get("tag") or ""),
            int(p.get("feature_osm_id") or 0),
            float(p["lat"]),
            float(p["lon"]),
        )
    )
    return out


def tag_names(points: Iterable[Any]) -> list[str]:
    """Unique tag strings from either legacy strings or point objects."""
    names: list[str] = []
    for item in points or []:
        if isinstance(item, str):
            names.append(item)
        elif isinstance(item, dict) and item.get("tag"):
            names.append(str(item["tag"]))
    return dedupe_tags(names)

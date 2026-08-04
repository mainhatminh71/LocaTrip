"""Normalize Overpass road elements into RoadCreate schemas."""

from __future__ import annotations

import logging
import math
from typing import Any

from app.schemas.road import RoadCreate
from app.utils.geo import element_to_wkt

logger = logging.getLogger(__name__)


def normalize_road_element(element: dict[str, Any], *, require_name: bool = False) -> RoadCreate | None:
    """Convert one Overpass element into a RoadCreate, or None if invalid."""
    osm_id = element.get("id")
    tags = element.get("tags") or {}

    if not isinstance(osm_id, int):
        logger.warning("Skipping element without integer id: %s", element.get("id"))
        return None

    if not isinstance(tags, dict):
        tags = {}

    highway = _as_optional_str(tags.get("highway"), 64)
    raw_name = tags.get("name")
    if isinstance(raw_name, str) and raw_name.strip():
        name = raw_name.strip()[:255]
    elif require_name:
        logger.warning("Skipping osm_id=%s without name", osm_id)
        return None
    else:
        name = f"Unnamed {highway or 'road'} ({osm_id})"[:255]

    wkt = element_to_wkt(element)
    if wkt and wkt.startswith("POLYGON"):
        wkt = None
    if wkt and wkt.startswith("POINT"):
        wkt = None

    length_m = _geometry_length_m(element)

    return RoadCreate(
        osm_id=osm_id,
        name=name,
        highway=highway,
        surface=_as_optional_str(tags.get("surface"), 64),
        oneway=_as_optional_str(tags.get("oneway"), 16),
        maxspeed=_as_optional_str(tags.get("maxspeed"), 32),
        bridge=_as_optional_str(tags.get("bridge"), 16),
        tunnel=_as_optional_str(tags.get("tunnel"), 16),
        lit=_as_optional_str(tags.get("lit"), 16),
        lanes=_as_optional_str(tags.get("lanes"), 16),
        incline=_as_optional_str(tags.get("incline"), 32),
        length_m=length_m,
        source="openstreetmap",
        raw_tags=dict(tags),
        natural_tags=[],
        wkt=wkt,
    )


def normalize_road_elements(
    elements: list[dict[str, Any]],
    *,
    require_name: bool = False,
) -> tuple[list[RoadCreate], int]:
    """Normalize many elements. Returns (valid_roads, failed_count)."""
    roads: list[RoadCreate] = []
    failed = 0

    for element in elements:
        try:
            road = normalize_road_element(element, require_name=require_name)
            if road is None:
                failed += 1
                continue
            roads.append(road)
        except Exception:
            failed += 1
            logger.exception("Failed to normalize element %s", element.get("id"))

    return roads, failed


def _as_optional_str(value: Any, max_len: int) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    if not text:
        return None
    return text[:max_len]


def _geometry_length_m(element: dict[str, Any]) -> float | None:
    """Haversine length along Overpass geometry nodes (lon/lat)."""
    geometry = element.get("geometry")
    if not isinstance(geometry, list) or len(geometry) < 2:
        return None
    total = 0.0
    for i in range(len(geometry) - 1):
        a = geometry[i]
        b = geometry[i + 1]
        try:
            lat1, lon1 = float(a["lat"]), float(a["lon"])
            lat2, lon2 = float(b["lat"]), float(b["lon"])
        except (KeyError, TypeError, ValueError):
            return None
        total += _haversine_m(lat1, lon1, lat2, lon2)
    return round(total, 2) if total > 0 else None


def _haversine_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    r = 6371000.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlmb = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dlmb / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))

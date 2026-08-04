"""Convert Overpass elements into PostGIS WKT (SRID 4326)."""

from __future__ import annotations

from typing import Any


def element_to_wkt(element: dict[str, Any]) -> str | None:
    """Build WKT from an Overpass element (node / way geom / center).

    Returns POINT, LINESTRING, or POLYGON text without SRID prefix.
    """
    etype = element.get("type")

    if etype == "node" and "lat" in element and "lon" in element:
        return f"POINT({element['lon']} {element['lat']})"

    geometry = element.get("geometry")
    if isinstance(geometry, list) and len(geometry) >= 2:
        return _coords_to_wkt(geometry)

    center = element.get("center")
    if isinstance(center, dict) and "lat" in center and "lon" in center:
        return f"POINT({center['lon']} {center['lat']})"

    return None


def _coords_to_wkt(points: list[dict[str, Any]]) -> str | None:
    try:
        coords = [(float(p["lon"]), float(p["lat"])) for p in points]
    except (KeyError, TypeError, ValueError):
        return None

    if len(coords) == 1:
        lon, lat = coords[0]
        return f"POINT({lon} {lat})"

    if len(coords) == 2:
        return "LINESTRING(" + ", ".join(f"{lon} {lat}" for lon, lat in coords) + ")"

    # Closed ring → polygon; otherwise linestring (rivers, cliffs).
    first, last = coords[0], coords[-1]
    closed = abs(first[0] - last[0]) < 1e-9 and abs(first[1] - last[1]) < 1e-9
    if closed and len(coords) >= 4:
        ring = ", ".join(f"{lon} {lat}" for lon, lat in coords)
        return f"POLYGON(({ring}))"

    return "LINESTRING(" + ", ".join(f"{lon} {lat}" for lon, lat in coords) + ")"

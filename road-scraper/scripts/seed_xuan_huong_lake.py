"""Inspect lakes + upsert Hồ Xuân Hương, then enrich + export."""

from __future__ import annotations

import json
import math
from pathlib import Path

import httpx
from sqlalchemy import text

from app.database.session import SessionLocal
from app.schemas.natural_feature import NaturalFeatureCreate
from app.repositories.natural_feature_repository import NaturalFeatureRepository
from app.services.scenic_analysis_service import ScenicAnalysisService
from app.services.export_service import ExportService
from app.services.dalat_roads_export_service import DalatRoadsExportService

# Approximate center of Hồ Xuân Hương, Đà Lạt.
XH_LON, XH_LAT = 108.4415, 11.9405


def inspect(db) -> None:
    rows = db.execute(
        text(
            """
            SELECT id, osm_id, feature_type, name,
                   ST_Y(ST_Centroid(geometry)) AS lat,
                   ST_X(ST_Centroid(geometry)) AS lon
            FROM natural_features
            WHERE feature_type = 'lake'
            ORDER BY id
            """
        )
    ).mappings().all()
    print("lakes in DB:", len(rows))
    for r in rows:
        print(" ", dict(r))

    near = db.execute(
        text(
            """
            SELECT id, osm_id, feature_type, name,
                   ST_Y(ST_Centroid(geometry)) AS lat,
                   ST_X(ST_Centroid(geometry)) AS lon,
                   raw_tags
            FROM natural_features
            WHERE geometry IS NOT NULL
              AND ST_DWithin(
                    geometry,
                    ST_SetSRID(ST_MakePoint(:lon, :lat), 4326),
                    0.012
                  )
            ORDER BY feature_type, id
            """
        ),
        {"lon": XH_LON, "lat": XH_LAT},
    ).mappings().all()
    print("near Xuân Hương:", len(near))
    for r in near:
        d = dict(r)
        tags = d.pop("raw_tags")
        print(" ", d, "name_tag=", (tags or {}).get("name"))


def fetch_xuan_huong_from_overpass() -> dict | None:
    """Pull Hồ Xuân Hương polygon from Overpass (by name / water near center)."""
    query = f"""
    [out:json][timeout:90];
    (
      way["name"~"Xu[âa]n H[ươuo]ng", i]({XH_LAT - 0.02},{XH_LON - 0.02},{XH_LAT + 0.02},{XH_LON + 0.02});
      relation["name"~"Xu[âa]n H[ươuo]ng", i]({XH_LAT - 0.02},{XH_LON - 0.02},{XH_LAT + 0.02},{XH_LON + 0.02});
      way["name:en"~"Xuan Huong", i]({XH_LAT - 0.02},{XH_LON - 0.02},{XH_LAT + 0.02},{XH_LON + 0.02});
      relation["name:en"~"Xuan Huong", i]({XH_LAT - 0.02},{XH_LON - 0.02},{XH_LAT + 0.02},{XH_LON + 0.02});
      way["natural"="water"]({XH_LAT - 0.008},{XH_LON - 0.008},{XH_LAT + 0.008},{XH_LON + 0.008});
      relation["natural"="water"]({XH_LAT - 0.008},{XH_LON - 0.008},{XH_LAT + 0.008},{XH_LON + 0.008});
    );
    out body geom;
    """
    urls = [
        "https://overpass-api.de/api/interpreter",
        "https://lz4.overpass-api.de/api/interpreter",
    ]
    for url in urls:
        try:
            print("Overpass:", url)
            with httpx.Client(timeout=120.0) as client:
                res = client.post(url, data={"data": query})
                res.raise_for_status()
                payload = res.json()
            elements = payload.get("elements") or []
            print(" elements:", len(elements))
            best = pick_best_lake(elements)
            if best:
                return best
        except Exception as exc:
            print(" overpass fail:", exc)
    return None


def pick_best_lake(elements: list[dict]) -> dict | None:
    named = []
    waters = []
    for el in elements:
        tags = el.get("tags") or {}
        name = (tags.get("name") or tags.get("name:vi") or tags.get("name:en") or "").strip()
        geom = el.get("geometry") or []
        if len(geom) < 3 and el.get("type") != "relation":
            # relations may use members; skip incomplete
            if el.get("type") == "way" and len(geom) < 3:
                continue
        lower = name.lower()
        if "xuân hương" in lower or "xuan huong" in lower:
            named.append(el)
        if tags.get("natural") == "water" or tags.get("water") in {"lake", "pond", "reservoir"}:
            waters.append(el)

    if named:
        # Prefer largest ring by point count.
        named.sort(key=lambda e: len(e.get("geometry") or []), reverse=True)
        return named[0]
    if waters:
        waters.sort(key=lambda e: len(e.get("geometry") or []), reverse=True)
        return waters[0]
    return None


def element_to_wkt_polygon(el: dict) -> str | None:
    geom = el.get("geometry") or []
    if len(geom) < 3:
        return None
    coords = [(float(p["lon"]), float(p["lat"])) for p in geom if "lon" in p and "lat" in p]
    if len(coords) < 3:
        return None
    # Close ring.
    if coords[0] != coords[-1]:
        coords.append(coords[0])
    ring = ", ".join(f"{lon} {lat}" for lon, lat in coords)
    return f"POLYGON(({ring}))"


def fallback_approx_polygon() -> tuple[str, dict]:
    """Hand-traced approx outline of Hồ Xuân Hương if Overpass fails."""
    # Rough outline around the lake (lon lat), clockwise-ish.
    pts = [
        (108.4378, 11.9438),
        (108.4395, 11.9446),
        (108.4418, 11.9448),
        (108.4440, 11.9442),
        (108.4455, 11.9428),
        (108.4462, 11.9410),
        (108.4458, 11.9390),
        (108.4445, 11.9375),
        (108.4425, 11.9368),
        (108.4402, 11.9370),
        (108.4385, 11.9382),
        (108.4375, 11.9400),
        (108.4372, 11.9420),
        (108.4378, 11.9438),
    ]
    ring = ", ".join(f"{lon} {lat}" for lon, lat in pts)
    wkt = f"POLYGON(({ring}))"
    tags = {
        "name": "Hồ Xuân Hương",
        "name:en": "Xuan Huong Lake",
        "natural": "water",
        "water": "lake",
        "source": "manual_seed",
    }
    return wkt, tags


def upsert_xuan_huong(db) -> NaturalFeatureCreate:
    el = fetch_xuan_huong_from_overpass()
    if el is not None:
        wkt = element_to_wkt_polygon(el)
        tags = dict(el.get("tags") or {})
        osm_id = int(el["id"])
        name = (
            tags.get("name")
            or tags.get("name:vi")
            or tags.get("name:en")
            or "Hồ Xuân Hương"
        )
        if "Xuân Hương" not in name and "Xuan Huong" not in name:
            name = "Hồ Xuân Hương"
            tags["name"] = name
        if not wkt:
            print("Overpass element had no usable geom — using approx polygon")
            wkt, extra = fallback_approx_polygon()
            tags.update(extra)
            osm_id = 900000001  # synthetic stable id
        print(f"Using OSM {el.get('type')}/{osm_id} name={name!r} pts={len(el.get('geometry') or [])}")
    else:
        print("Overpass empty — seeding approx Hồ Xuân Hương polygon")
        wkt, tags = fallback_approx_polygon()
        osm_id = 900000001
        name = "Hồ Xuân Hương"

    feature = NaturalFeatureCreate(
        osm_id=osm_id,
        feature_type="lake",
        name=name,
        wkt=wkt,
        raw_tags=tags,
    )
    inserted, updated = NaturalFeatureRepository(db).upsert_many([feature])
    print(f"upsert lake: inserted={inserted} updated={updated}")
    return feature


def main() -> None:
    db = SessionLocal()
    try:
        print("=== before ===")
        inspect(db)
        print("=== upsert ===")
        upsert_xuan_huong(db)
        print("=== after ===")
        inspect(db)

        print("=== enrich-tags ===")
        stats = ScenicAnalysisService(db).enrich_natural_tags(buffer_meters=80.0)
        print(stats)

        print("=== export ===")
        paths = ExportService(db).export_all()
        print({k: str(v) for k, v in paths.items()})
        result = DalatRoadsExportService(db).export_and_validate()
        print(
            "output roads",
            result.get("total_roads"),
            "tagged",
            result.get("roads_with_natural_tags"),
            "tags",
            result.get("natural_tag_values"),
        )

        # Verify Xuân Hương linked to nearby roads
        n = db.execute(
            text(
                """
                SELECT COUNT(*) FROM roads
                WHERE natural_tags::text ILIKE '%lake_view%'
                  AND natural_tags::text ILIKE '%Xuân Hương%'
                """
            )
        ).scalar()
        print("roads mentioning Xuân Hương in tags:", n)
        sample = db.execute(
            text(
                """
                SELECT osm_id, name, natural_tags
                FROM roads
                WHERE natural_tags @> '[{"feature_type":"lake"}]'::jsonb
                ORDER BY id
                LIMIT 8
                """
            )
        ).mappings().all()
        print("sample lake-tagged roads:")
        for r in sample:
            print(" ", r["osm_id"], r["name"], r["natural_tags"][:2])
    finally:
        db.close()


if __name__ == "__main__":
    main()

"""CLI entrypoint for Đà Lạt road + scenic feature crawls.

Usage:
    python -m app.cli crawl --full --grid 4
    python -m app.cli crawl-natural
    python -m app.cli enrich-tags
    python -m app.cli export-dalat-roads
    python -m app.cli crawl-dalat-roads
"""

from __future__ import annotations

import argparse
import sys
import time

from app.core.logging import setup_logging
from app.core.natural_tag_mapping import tags_for_feature
from app.core.scenic_weights import FEATURE_TYPES
from app.database.session import SessionLocal
from app.services.dalat_roads_export_service import DalatRoadsExportService
from app.services.export_service import ExportService
from app.services.natural_feature_service import NaturalFeatureService
from app.services.road_service import RoadService
from app.services.scenic_analysis_service import ScenicAnalysisService


def crawl_roads(*, full: bool = False, grid_size: int | None = None) -> int:
    """Run one road crawl and print stats."""
    setup_logging()
    db = SessionLocal()
    try:
        stats = RoadService(db).crawl_roads(full=full, grid_size=grid_size)
        print(
            f"roads done | full={full} fetched={stats.fetched} inserted={stats.inserted} "
            f"updated={stats.updated} failed={stats.failed} duration={stats.duration_seconds}s"
        )
        return 0 if stats.failed == 0 or stats.fetched > 0 else 1
    finally:
        db.close()


def crawl_natural(feature_type: str | None) -> int:
    """Crawl one or all natural feature categories."""
    setup_logging()
    db = SessionLocal()
    try:
        service = NaturalFeatureService(db)
        results = (
            [service.crawl_feature(feature_type)]
            if feature_type
            else service.crawl_all()
        )
        exit_code = 0
        for stats in results:
            print(
                f"{stats.feature_type} | fetched={stats.fetched} inserted={stats.inserted} "
                f"updated={stats.updated} failed={stats.failed} duration={stats.duration_seconds}s"
            )
            if stats.fetched == 0 and stats.failed > 0:
                exit_code = 1
        return exit_code
    finally:
        db.close()


def enrich_tags(*, buffer_meters: float = 80.0) -> int:
    """Attach pass-by natural_tags to roads from nearby natural_features."""
    setup_logging()
    db = SessionLocal()
    try:
        stats = ScenicAnalysisService(db).enrich_natural_tags(buffer_meters=buffer_meters)
        print(
            "enrich-tags | "
            f"geom_roads={stats['roads_with_geometry']} tagged={stats['roads_with_tags']} "
            f"pairs={stats['nearby_pairs_considered']} links={stats['linked_pairs']} "
            f"buffer={stats['buffer_meters']}m duration={stats['duration_seconds']}s"
        )
        _sample_verify_tags(db, sample_size=100)
        return 0
    finally:
        db.close()


def _sample_verify_tags(db, sample_size: int = 100) -> None:
    """Spot-check random tagged roads; fix mapping issues loudly."""
    from sqlalchemy import text

    rows = db.execute(
        text(
            """
            SELECT osm_id, name, highway, natural_tags
            FROM roads
            WHERE jsonb_array_length(natural_tags) > 0
            ORDER BY random()
            LIMIT :n
            """
        ),
        {"n": sample_size},
    ).mappings().all()
    bad = 0
    for row in rows:
        tags = row["natural_tags"] or []
        if not isinstance(tags, list) or not tags:
            bad += 1
            continue
        keys: set[tuple] = set()
        for item in tags:
            if not isinstance(item, dict):
                bad += 1
                print(f"WARN non-object tag osm_id={row['osm_id']}: {item!r}")
                continue
            tag = item.get("tag")
            lat = item.get("lat")
            lon = item.get("lon")
            if not isinstance(tag, str) or " " in tag or tag != tag.lower():
                bad += 1
                print(f"WARN bad tag osm_id={row['osm_id']}: {tag!r}")
            try:
                float(lat)
                float(lon)
            except (TypeError, ValueError):
                bad += 1
                print(f"WARN bad lat/lon osm_id={row['osm_id']}: {item!r}")
                continue
            key = (tag, item.get("feature_osm_id"), round(float(lat), 5), round(float(lon), 5))
            if key in keys:
                bad += 1
                print(f"WARN duplicate tag point osm_id={row['osm_id']}: {item}")
            keys.add(key)
    print(f"sample-verify | checked={len(rows)} issues={bad}")
    # Mapping smoke test
    assert "lake_view" in tags_for_feature("lake")
    assert "forest" in tags_for_feature("wood")
    assert "creek" in tags_for_feature("stream")


def export_json() -> int:
    """Export roads + natural_features from PostgreSQL to exports/*.json."""
    setup_logging()
    db = SessionLocal()
    try:
        paths = ExportService(db).export_all()
        for key, path in paths.items():
            print(f"wrote {key}: {path.resolve()}")
        return 0
    finally:
        db.close()


def export_dalat_roads() -> int:
    """Export enriched roads to output/dalat_roads.json and validate."""
    setup_logging()
    db = SessionLocal()
    try:
        result = DalatRoadsExportService(db).export_and_validate()
        print("export-dalat-roads OK")
        for key in (
            "total_roads",
            "roads_with_name",
            "roads_with_natural_tags",
            "unique_natural_tags",
            "avg_tags_per_road",
            "file_size_bytes",
            "export_seconds",
            "path",
        ):
            print(f"  {key}: {result.get(key)}")
        print(f"  natural_tag_values: {result.get('natural_tag_values')}")
        return 0
    except Exception as exc:
        print(f"export-dalat-roads FAILED: {exc}")
        return 1
    finally:
        db.close()


def crawl_full() -> int:
    """Legacy: roads grid3 + natural + exports/."""
    setup_logging()
    code = crawl_roads(full=True, grid_size=3)
    code = max(code, crawl_natural(None))
    code = max(code, export_json())
    return code


def crawl_dalat_roads(*, grid: int = 4, buffer_meters: float = 80.0) -> int:
    """Full pipeline: dense road crawl → natural features → tags → output JSON."""
    setup_logging()
    pipeline_started = time.perf_counter()
    print(f"=== crawl-dalat-roads grid={grid} buffer={buffer_meters}m ===")

    code = crawl_roads(full=True, grid_size=grid)
    code = max(code, crawl_natural(None))
    code = max(code, enrich_tags(buffer_meters=buffer_meters))
    code = max(code, export_dalat_roads())
    # Keep legacy exports in sync too.
    code = max(code, export_json())

    elapsed = round(time.perf_counter() - pipeline_started, 2)
    print(f"=== crawl-dalat-roads finished exit={code} total_seconds={elapsed} ===")
    return code


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="LocaTrip road-scraper — crawl Đà Lạt roads & scenic features",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    roads = sub.add_parser("crawl", help="Crawl roads from Overpass")
    roads.add_argument(
        "--full",
        action="store_true",
        help="All highways (incl. unnamed) with geometry",
    )
    roads.add_argument("--grid", type=int, default=None, help="Tile grid size (default 2, full=3)")

    natural = sub.add_parser("crawl-natural", help="Crawl scenic / place features")
    natural.add_argument(
        "--type",
        dest="feature_type",
        choices=list(FEATURE_TYPES),
        default=None,
        help="Single feature type (default: all)",
    )

    enrich = sub.add_parser("enrich-tags", help="Set roads.natural_tags from nearby features")
    enrich.add_argument("--buffer", type=float, default=80.0, help="Pass-by buffer meters")

    sub.add_parser(
        "crawl-full",
        help="Full crawl: all roads+geom + mountain/lake/village/... then exports/",
    )
    dalat = sub.add_parser(
        "crawl-dalat-roads",
        help="Dense roads + natural + enrich tags + output/dalat_roads.json",
    )
    dalat.add_argument("--grid", type=int, default=4, help="Road tile grid (default 4)")
    dalat.add_argument("--buffer", type=float, default=80.0, help="Tag buffer meters")

    sub.add_parser("export-json", help="Export DB roads & features to exports/*.json")
    sub.add_parser("export-dalat-roads", help="Export enriched roads to output/dalat_roads.json")

    args = parser.parse_args(argv)
    if args.command == "crawl":
        return crawl_roads(full=args.full, grid_size=args.grid)
    if args.command == "crawl-natural":
        return crawl_natural(args.feature_type)
    if args.command == "enrich-tags":
        return enrich_tags(buffer_meters=args.buffer)
    if args.command == "crawl-full":
        return crawl_full()
    if args.command == "crawl-dalat-roads":
        return crawl_dalat_roads(grid=args.grid, buffer_meters=args.buffer)
    if args.command == "export-json":
        return export_json()
    if args.command == "export-dalat-roads":
        return export_dalat_roads()
    parser.error(f"Unknown command: {args.command}")
    return 2


if __name__ == "__main__":
    sys.exit(main())

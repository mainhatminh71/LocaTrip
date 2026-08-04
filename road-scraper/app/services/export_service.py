"""Export crawled Đà Lạt data from PostgreSQL to JSON files."""

from __future__ import annotations

import json
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config.settings import get_settings
from app.core.natural_tag_mapping import dedupe_tag_points
from app.repositories.road_repository import RoadRepository

logger = logging.getLogger(__name__)


class ExportService:
    """Dump roads + natural_features to JSON (and GeoJSON FeatureCollections)."""

    def __init__(self, db: Session, output_dir: Path | None = None) -> None:
        self._db = db
        self._output_dir = output_dir or Path("exports")

    def export_all(self) -> dict[str, Path]:
        """Write roads / features / bundle JSON files. Returns written paths."""
        self._output_dir.mkdir(parents=True, exist_ok=True)
        settings = get_settings()

        roads = RoadRepository(self._db).export_geojson_rows()
        features = self._export_features()

        roads_with_tags = 0
        roads_fc = {
            "type": "FeatureCollection",
            "features": [],
        }
        for row in roads:
            tags = dedupe_tag_points(row.get("natural_tags") or [])
            if tags:
                roads_with_tags += 1
            roads_fc["features"].append(
                {
                    "type": "Feature",
                    "geometry": row.get("geometry"),
                    "properties": {
                        "id": row["id"],
                        "osm_id": row["osm_id"],
                        "name": row["name"],
                        "highway": row["highway"],
                        "surface": row["surface"],
                        "oneway": row["oneway"],
                        "maxspeed": row["maxspeed"],
                        "source": row["source"],
                        "raw_tags": row["raw_tags"],
                        # Linked pass-by scenery: each tag has its own lat/lon.
                        "natural_tags": tags,
                    },
                }
            )

        features_fc = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": row.get("geometry"),
                    "properties": {
                        "id": row["id"],
                        "osm_id": row["osm_id"],
                        "feature_type": row["feature_type"],
                        "name": row["name"],
                        "raw_tags": row["raw_tags"],
                    },
                }
                for row in features
            ],
        }

        bundle = {
            "exported_at": datetime.now(timezone.utc).isoformat(),
            "region": settings.crawl_region,
            "bbox": {
                "south": settings.bbox_south,
                "west": settings.bbox_west,
                "north": settings.bbox_north,
                "east": settings.bbox_east,
            },
            "counts": {
                "roads": len(roads),
                "natural_features": len(features),
                "roads_with_natural_tags": roads_with_tags,
            },
            "roads": roads_fc,
            "natural_features": features_fc,
            "schema": {
                "natural_tags": {
                    "description": (
                        "Attached on each road: pass-by scenic tags with coordinates "
                        "(closest point of the nearby feature to the road)."
                    ),
                    "item": {
                        "tag": "string",
                        "lat": "number",
                        "lon": "number",
                        "feature_type": "string|null",
                        "feature_osm_id": "number|null",
                        "feature_name": "string|null",
                        "distance_m": "number|null",
                    },
                }
            },
        }

        paths = {
            "roads": self._output_dir / "dalat_roads.json",
            "features": self._output_dir / "dalat_features.json",
            "bundle": self._output_dir / "dalat_bundle.json",
        }
        self._write(paths["roads"], roads_fc)
        self._write(paths["features"], features_fc)
        self._write(paths["bundle"], bundle)

        logger.info(
            "Exported JSON | roads=%s tagged=%s features=%s -> %s",
            len(roads),
            roads_with_tags,
            len(features),
            self._output_dir.resolve(),
        )
        return paths

    def _export_features(self) -> list[dict[str, Any]]:
        rows = self._db.execute(
            text(
                """
                SELECT
                    id,
                    osm_id,
                    feature_type,
                    name,
                    raw_tags,
                    ST_AsGeoJSON(geometry)::json AS geometry
                FROM natural_features
                ORDER BY feature_type, id
                """
            )
        ).mappings().all()
        return [dict(row) for row in rows]

    @staticmethod
    def _write(path: Path, payload: dict[str, Any]) -> None:
        path.write_text(
            json.dumps(payload, ensure_ascii=False, indent=2, default=str),
            encoding="utf-8",
        )

"""Link roads to nearby natural features and store pass-by natural_tags.

Natural tags describe scenery along a road corridor (bonus for routing).
They are NEVER destinations / waypoints for forced detours.

Each natural_tags entry is a point:

    {"tag": "lake_view", "lat": ..., "lon": ..., "feature_type": "lake", ...}
"""

from __future__ import annotations

import logging
import time
from typing import Any

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.natural_tag_mapping import dedupe_tag_points, tag_points_for_feature
from app.core.scenic_weights import weight_for
from app.repositories.road_repository import RoadRepository

logger = logging.getLogger(__name__)

# Distance band for "đi ngang qua" scenery (meters).
DEFAULT_BUFFER_METERS = 80.0


class ScenicAnalysisService:
    """Link roads ↔ nearby natural_features and write roads.natural_tags."""

    def __init__(self, db: Session) -> None:
        self._db = db
        self._roads = RoadRepository(db)

    def enrich_natural_tags(self, buffer_meters: float = DEFAULT_BUFFER_METERS) -> dict[str, Any]:
        """Set roads.natural_tags from nearby natural_features (pass-by only)."""
        started = time.perf_counter()
        # Use geometry degrees for GiST index friendliness (~111km per degree lat).
        buffer_deg = float(buffer_meters) / 111_000.0
        rows = self._db.execute(
            text(
                """
                SELECT
                    r.id AS road_id,
                    nf.osm_id AS feature_osm_id,
                    nf.feature_type,
                    NULLIF(TRIM(nf.name), '') AS feature_name,
                    nf.raw_tags,
                    ST_Y(ST_ClosestPoint(nf.geometry, r.geometry)) AS lat,
                    ST_X(ST_ClosestPoint(nf.geometry, r.geometry)) AS lon,
                    ST_Distance(r.geometry, nf.geometry) * 111000.0 AS distance_m
                FROM roads r
                JOIN natural_features nf
                  ON nf.geometry IS NOT NULL
                 AND ST_DWithin(r.geometry, nf.geometry, :buffer_deg)
                WHERE r.geometry IS NOT NULL
                """
            ),
            {"buffer_deg": buffer_deg},
        ).mappings().all()

        by_road: dict[int, list[dict[str, Any]]] = {}
        for row in rows:
            road_id = int(row["road_id"])
            if row["lat"] is None or row["lon"] is None:
                continue
            points = tag_points_for_feature(
                row["feature_type"],
                lat=float(row["lat"]),
                lon=float(row["lon"]),
                raw_tags=row["raw_tags"] or {},
                feature_osm_id=int(row["feature_osm_id"]) if row["feature_osm_id"] is not None else None,
                feature_name=row["feature_name"],
                distance_m=float(row["distance_m"]) if row["distance_m"] is not None else None,
            )
            by_road.setdefault(road_id, []).extend(points)

        self._roads.clear_all_natural_tags()
        road_tags = {rid: dedupe_tag_points(pts) for rid, pts in by_road.items()}
        updated = self._roads.set_natural_tags_bulk(road_tags)

        link_stats = self.link_nearby_features(buffer_meters=buffer_meters)

        duration = round(time.perf_counter() - started, 2)
        tagged = self._roads.count_with_natural_tags()
        total = self._roads.count_with_geometry()
        stats = {
            "roads_with_geometry": total,
            "roads_with_tags": tagged,
            "roads_updated": updated,
            "nearby_pairs_considered": len(rows),
            "buffer_meters": buffer_meters,
            "linked_pairs": link_stats["linked_pairs"],
            "duration_seconds": duration,
        }
        logger.info("Natural tag enrichment done: %s", stats)
        return stats

    def link_nearby_features(self, buffer_meters: float = DEFAULT_BUFFER_METERS) -> dict[str, Any]:
        """Populate road_scenic_feature rows for features within buffer."""
        started = time.perf_counter()
        buffer_deg = float(buffer_meters) / 111_000.0
        self._db.execute(text("DELETE FROM road_scenic_feature"))
        self._db.execute(
            text(
                """
                INSERT INTO road_scenic_feature (road_id, feature_id, distance, weight)
                SELECT
                    r.id,
                    nf.id,
                    ST_Distance(r.geometry, nf.geometry) * 111000.0 AS distance,
                    1.0 AS weight
                FROM roads r
                JOIN natural_features nf
                  ON nf.geometry IS NOT NULL
                 AND ST_DWithin(r.geometry, nf.geometry, :buffer_deg)
                WHERE r.geometry IS NOT NULL
                ON CONFLICT ON CONSTRAINT uq_road_scenic_feature DO NOTHING
                """
            ),
            {"buffer_deg": buffer_deg},
        )
        self._db.commit()
        linked = int(
            self._db.scalar(text("SELECT COUNT(*) FROM road_scenic_feature")) or 0
        )
        duration = round(time.perf_counter() - started, 2)
        logger.info(
            "Linked road↔feature pairs=%s buffer=%sm duration=%ss",
            linked,
            buffer_meters,
            duration,
        )
        return {"linked_pairs": linked, "buffer_meters": buffer_meters, "duration_seconds": duration}

    def compute_scenic_score(self, road_id: int) -> float:
        """Sum weights of linked features for a road."""
        value = self._db.scalar(
            text(
                """
                SELECT COALESCE(SUM(weight), 0)
                FROM road_scenic_feature
                WHERE road_id = :road_id
                """
            ),
            {"road_id": road_id},
        )
        return float(value or 0.0)

    @staticmethod
    def preview_weight(feature_type: str) -> int:
        return weight_for(feature_type)

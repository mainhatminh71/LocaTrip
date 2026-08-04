"""Persistence helpers for the roads table."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from geoalchemy2 import WKTElement
from sqlalchemy import func, select, text, update
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.models.road import Road
from app.schemas.road import RoadCreate


class RoadRepository:
    """Database access for roads. No business / crawl logic here."""

    def __init__(self, db: Session) -> None:
        self._db = db

    def list_roads(self, limit: int = 100, offset: int = 0) -> list[Road]:
        """Return roads ordered by id ascending."""
        stmt = select(Road).order_by(Road.id.asc()).offset(offset).limit(limit)
        return list(self._db.scalars(stmt).all())

    def count(self) -> int:
        return int(self._db.scalar(select(func.count()).select_from(Road)) or 0)

    def count_with_geometry(self) -> int:
        return int(
            self._db.scalar(
                select(func.count()).select_from(Road).where(Road.geometry.is_not(None))
            )
            or 0
        )

    def count_with_natural_tags(self) -> int:
        return int(
            self._db.scalar(
                text(
                    """
                    SELECT COUNT(*) FROM roads
                    WHERE natural_tags IS NOT NULL
                      AND jsonb_typeof(natural_tags) = 'array'
                      AND jsonb_array_length(natural_tags) > 0
                    """
                )
            )
            or 0
        )

    def upsert_many(self, roads: list[RoadCreate]) -> tuple[int, int]:
        """Insert or update roads by osm_id.

        Returns:
            (inserted_count, updated_count)
        """
        if not roads:
            return 0, 0

        now = datetime.now(timezone.utc)
        inserted = 0
        updated = 0

        for road in roads:
            existing = self._db.scalar(select(Road).where(Road.osm_id == road.osm_id))
            geom = WKTElement(road.wkt, srid=4326) if road.wkt else None

            values = dict(
                osm_id=road.osm_id,
                name=road.name,
                highway=road.highway,
                surface=road.surface,
                oneway=road.oneway,
                maxspeed=road.maxspeed,
                bridge=road.bridge,
                tunnel=road.tunnel,
                lit=road.lit,
                lanes=road.lanes,
                incline=road.incline,
                length_m=road.length_m,
                source=road.source,
                raw_tags=road.raw_tags,
                natural_tags=list(road.natural_tags or []),
                geometry=geom,
                updated_at=now,
            )

            if existing is None:
                stmt = insert(Road).values(**values, created_at=now)
                self._db.execute(stmt)
                inserted += 1
            else:
                existing.name = road.name
                existing.highway = road.highway
                existing.surface = road.surface
                existing.oneway = road.oneway
                existing.maxspeed = road.maxspeed
                existing.bridge = road.bridge
                existing.tunnel = road.tunnel
                existing.lit = road.lit
                existing.lanes = road.lanes
                existing.incline = road.incline
                if road.length_m is not None:
                    existing.length_m = road.length_m
                existing.source = road.source
                existing.raw_tags = road.raw_tags
                # Keep existing natural_tags unless caller explicitly set new ones.
                if road.natural_tags:
                    existing.natural_tags = list(road.natural_tags)
                if geom is not None:
                    existing.geometry = geom
                existing.updated_at = now
                updated += 1

        self._db.commit()
        # Backfill length from PostGIS when crawler length missing.
        self._db.execute(
            text(
                """
                UPDATE roads
                SET length_m = ST_Length(geometry::geography)
                WHERE geometry IS NOT NULL
                  AND (length_m IS NULL OR length_m <= 0)
                """
            )
        )
        self._db.commit()
        return inserted, updated

    def set_natural_tags_bulk(self, road_tags: dict[int, list[dict[str, Any]]]) -> int:
        """Update natural_tags (tag+lat/lon points) for many road ids."""
        if not road_tags:
            return 0
        updated = 0
        now = datetime.now(timezone.utc)
        for road_id, tags in road_tags.items():
            result = self._db.execute(
                update(Road)
                .where(Road.id == road_id)
                .values(natural_tags=tags, updated_at=now)
            )
            updated += int(result.rowcount or 0)
        self._db.commit()
        return updated

    def clear_all_natural_tags(self) -> None:
        self._db.execute(text("UPDATE roads SET natural_tags = '[]'::jsonb"))
        self._db.commit()

    def export_enriched_rows(self) -> list[dict[str, Any]]:
        """Rows for output/dalat_roads.json (LINESTRING geometry required)."""
        rows = self._db.execute(
            text(
                """
                SELECT
                    osm_id,
                    name,
                    highway,
                    length_m,
                    oneway,
                    lanes,
                    maxspeed,
                    surface,
                    bridge,
                    tunnel,
                    lit,
                    incline,
                    natural_tags,
                    source,
                    ST_AsGeoJSON(geometry)::json AS geometry
                FROM roads
                WHERE geometry IS NOT NULL
                ORDER BY osm_id
                """
            )
        ).mappings().all()
        return [dict(row) for row in rows]

    def export_geojson_rows(self) -> list[dict]:
        """Dump roads with GeoJSON geometry for legacy exports/."""
        rows = self._db.execute(
            text(
                """
                SELECT
                    id,
                    osm_id,
                    name,
                    highway,
                    surface,
                    oneway,
                    maxspeed,
                    bridge,
                    tunnel,
                    lit,
                    lanes,
                    incline,
                    length_m,
                    natural_tags,
                    source,
                    raw_tags,
                    ST_AsGeoJSON(geometry)::json AS geometry
                FROM roads
                ORDER BY id
                """
            )
        ).mappings().all()
        return [dict(row) for row in rows]

"""Persistence for natural_features."""

from __future__ import annotations

from datetime import datetime, timezone

from geoalchemy2 import WKTElement
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.natural_feature import NaturalFeature
from app.schemas.natural_feature import NaturalFeatureCreate


class NaturalFeatureRepository:
    """Database access for natural_features."""

    def __init__(self, db: Session) -> None:
        self._db = db

    def list_features(
        self,
        feature_type: str | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[NaturalFeature]:
        stmt = select(NaturalFeature).order_by(NaturalFeature.id.asc())
        if feature_type:
            stmt = stmt.where(NaturalFeature.feature_type == feature_type)
        stmt = stmt.offset(offset).limit(limit)
        return list(self._db.scalars(stmt).all())

    def upsert_many(self, features: list[NaturalFeatureCreate]) -> tuple[int, int]:
        """Insert or update by (osm_id, feature_type). Returns (inserted, updated)."""
        if not features:
            return 0, 0

        now = datetime.now(timezone.utc)
        inserted = 0
        updated = 0

        for feature in features:
            existing = self._db.scalar(
                select(NaturalFeature).where(
                    NaturalFeature.osm_id == feature.osm_id,
                    NaturalFeature.feature_type == feature.feature_type,
                )
            )
            geom = WKTElement(feature.wkt, srid=4326) if feature.wkt else None

            if existing is None:
                row = NaturalFeature(
                    osm_id=feature.osm_id,
                    feature_type=feature.feature_type,
                    name=feature.name,
                    geometry=geom,
                    raw_tags=feature.raw_tags,
                    created_at=now,
                    updated_at=now,
                )
                self._db.add(row)
                inserted += 1
            else:
                existing.name = feature.name
                existing.geometry = geom
                existing.raw_tags = feature.raw_tags
                existing.updated_at = now
                updated += 1

        self._db.commit()
        return inserted, updated

"""ORM model for OSM natural / scenic features."""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from geoalchemy2 import Geometry
from sqlalchemy import BigInteger, DateTime, String, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base

if TYPE_CHECKING:
    from app.models.road_scenic_feature import RoadScenicFeature


class NaturalFeature(Base):
    """A scenic natural feature near roads (lake, forest, viewpoint, …).

    ``geometry`` is PostGIS GEOMETRY(4326) so POINT / LINESTRING / POLYGON
    can coexist until typed constraints are introduced per feature_type.
    """

    __tablename__ = "natural_features"
    __table_args__ = (
        UniqueConstraint("osm_id", "feature_type", name="uq_natural_features_osm_type"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    osm_id: Mapped[int] = mapped_column(BigInteger, nullable=False, index=True)
    feature_type: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    geometry: Mapped[object | None] = mapped_column(
        Geometry(geometry_type="GEOMETRY", srid=4326, spatial_index=False),
        nullable=True,
    )
    raw_tags: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    road_links: Mapped[list[RoadScenicFeature]] = relationship(
        "RoadScenicFeature",
        back_populates="feature",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<NaturalFeature type={self.feature_type} osm_id={self.osm_id}>"

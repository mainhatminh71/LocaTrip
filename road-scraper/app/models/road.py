"""ORM model for crawled road records."""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING, Any

from geoalchemy2 import Geometry
from sqlalchemy import BigInteger, DateTime, Float, String, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base

if TYPE_CHECKING:
    from app.models.road_scenic_feature import RoadScenicFeature


class Road(Base):
    """A highway way from OpenStreetMap with optional pass-by natural_tags.

    natural_tags is a JSON array of point objects:
    [{"tag": "lake_view", "lat": ..., "lon": ..., "feature_type": "lake", ...}]
    """

    __tablename__ = "roads"
    __table_args__ = (UniqueConstraint("osm_id", name="uq_roads_osm_id"),)

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    osm_id: Mapped[int] = mapped_column(BigInteger, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    highway: Mapped[str | None] = mapped_column(String(64), nullable=True)
    surface: Mapped[str | None] = mapped_column(String(64), nullable=True)
    oneway: Mapped[str | None] = mapped_column(String(16), nullable=True)
    maxspeed: Mapped[str | None] = mapped_column(String(32), nullable=True)
    bridge: Mapped[str | None] = mapped_column(String(16), nullable=True)
    tunnel: Mapped[str | None] = mapped_column(String(16), nullable=True)
    lit: Mapped[str | None] = mapped_column(String(16), nullable=True)
    lanes: Mapped[str | None] = mapped_column(String(16), nullable=True)
    incline: Mapped[str | None] = mapped_column(String(32), nullable=True)
    length_m: Mapped[float | None] = mapped_column(Float, nullable=True)
    source: Mapped[str] = mapped_column(String(64), nullable=False, default="openstreetmap")
    raw_tags: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)
    # Pass-by scenery tokens only — never routing destinations.
    natural_tags: Mapped[list[Any]] = mapped_column(JSONB, nullable=False, default=list)
    geometry: Mapped[object | None] = mapped_column(
        Geometry(geometry_type="LINESTRING", srid=4326, spatial_index=False),
        nullable=True,
    )
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

    scenic_links: Mapped[list[RoadScenicFeature]] = relationship(
        "RoadScenicFeature",
        back_populates="road",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Road osm_id={self.osm_id} name={self.name!r}>"

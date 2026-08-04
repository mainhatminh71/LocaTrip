"""Road ↔ natural feature proximity link (scenic analysis).

Populated later by buffer / ST_DWithin — model exists so scoring can plug in
without schema redesign.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import Float, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base

if TYPE_CHECKING:
    from app.models.natural_feature import NaturalFeature
    from app.models.road import Road


class RoadScenicFeature(Base):
    """Association between a road and a nearby scenic feature."""

    __tablename__ = "road_scenic_feature"
    __table_args__ = (
        UniqueConstraint("road_id", "feature_id", name="uq_road_scenic_feature"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    road_id: Mapped[int] = mapped_column(ForeignKey("roads.id", ondelete="CASCADE"), nullable=False)
    feature_id: Mapped[int] = mapped_column(
        ForeignKey("natural_features.id", ondelete="CASCADE"),
        nullable=False,
    )
    distance: Mapped[float | None] = mapped_column(Float, nullable=True)
    weight: Mapped[float | None] = mapped_column(Float, nullable=True)

    road: Mapped[Road] = relationship("Road", back_populates="scenic_links")
    feature: Mapped[NaturalFeature] = relationship("NaturalFeature", back_populates="road_links")

    def __repr__(self) -> str:
        return f"<RoadScenicFeature road={self.road_id} feature={self.feature_id}>"

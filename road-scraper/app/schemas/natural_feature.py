"""Schemas for natural features and scenic crawl results."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class NaturalFeatureCreate(BaseModel):
    """Normalized natural feature ready for persistence."""

    osm_id: int
    feature_type: str
    name: str | None = None
    wkt: str | None = None
    raw_tags: dict[str, Any] = Field(default_factory=dict)


class NaturalFeatureRead(BaseModel):
    """API representation (geometry omitted as WKT for simplicity)."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    osm_id: int
    feature_type: str
    name: str | None
    raw_tags: dict[str, Any]
    created_at: datetime
    updated_at: datetime


class NaturalCrawlStats(BaseModel):
    """Per-category or aggregate natural crawl summary."""

    feature_type: str
    fetched: int
    inserted: int
    updated: int
    failed: int
    duration_seconds: float

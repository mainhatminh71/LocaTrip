"""Pydantic schemas for roads and crawl results."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class NaturalTagPoint(BaseModel):
    """Pass-by scenic tag anchored at a map coordinate."""

    tag: str
    lat: float
    lon: float
    feature_type: str | None = None
    feature_osm_id: int | None = None
    feature_name: str | None = None
    distance_m: float | None = None


class RoadCreate(BaseModel):
    """Normalized road payload ready for persistence."""

    osm_id: int
    name: str
    highway: str | None = None
    surface: str | None = None
    oneway: str | None = None
    maxspeed: str | None = None
    bridge: str | None = None
    tunnel: str | None = None
    lit: str | None = None
    lanes: str | None = None
    incline: str | None = None
    length_m: float | None = None
    source: str = "openstreetmap"
    raw_tags: dict[str, Any] = Field(default_factory=dict)
    natural_tags: list[dict[str, Any]] = Field(default_factory=list)
    wkt: str | None = None


class RoadRead(BaseModel):
    """Road record returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    osm_id: int
    name: str
    highway: str | None
    surface: str | None
    oneway: str | None
    maxspeed: str | None
    bridge: str | None = None
    tunnel: str | None = None
    lit: str | None = None
    lanes: str | None = None
    incline: str | None = None
    length_m: float | None = None
    source: str
    raw_tags: dict[str, Any]
    natural_tags: list[dict[str, Any]] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime


class CrawlStats(BaseModel):
    """Summary returned after a crawl run."""

    fetched: int
    inserted: int
    updated: int
    failed: int
    duration_seconds: float

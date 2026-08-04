"""Demo UI API: GeoJSON places and A→B routing with pass-by scenic tags."""

from __future__ import annotations

from pathlib import Path
from typing import Any, Literal

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.config.settings import get_settings
from app.database.session import get_db
from app.repositories.demo_repository import DemoRepository
from app.services.demo_route_service import DemoRouteService

router = APIRouter(prefix="/api/demo", tags=["demo"])

EXPORTS_DIR = Path(__file__).resolve().parent.parent.parent / "exports"
BUNDLE_PATH = EXPORTS_DIR / "dalat_bundle.json"


class RouteRequest(BaseModel):
    origin_id: int
    destination_id: int
    mode: Literal["fast", "scenic"] = "scenic"
    intensity: Literal["light", "balanced", "max"] = "balanced"
    preferences: list[str] = Field(
        default_factory=lambda: [
            "lake",
            "waterfall",
            "forest",
            "wood",
            "mountain",
            "peak",
            "viewpoint",
            "river",
            "village",
        ]
    )
    # Absolute extra km vs fastest path (not a spatial radius).
    max_extra_km: float = Field(default=5.0, ge=0.0, le=50.0)
    # Keep length idea but ignore preferred scene types (UI option 1).
    relax_preferences: bool = False


class RouteResponse(BaseModel):
    mode: str
    intensity: str | None = None
    preferences: list[str] = Field(default_factory=list)
    origin: dict[str, Any]
    destination: dict[str, Any]
    waypoints: list[dict[str, Any]] = Field(default_factory=list)
    sightings: list[dict[str, Any]] = Field(default_factory=list)
    distance_meters: float
    duration_seconds: float
    scenic_score: float
    detour_percent: int = 0
    detour_extra_km: float = 0.0
    max_extra_km: float | None = None
    fast_distance_meters: float | None = None
    scenic_matched: bool = True
    relax_preferences: bool = False
    geometry: dict[str, Any] | None
    summary: str


@router.get("/config")
def demo_config() -> dict[str, str]:
    """Public client config (Mapbox token for basemap tiles)."""
    settings = get_settings()
    return {
        "mapboxAccessToken": settings.mapbox_access_token,
        "mapboxStyle": settings.mapbox_style,
    }


@router.get("/features")
def demo_features(db: Session = Depends(get_db)) -> dict[str, Any]:
    """GeoJSON of scenic features from PostgreSQL."""
    return DemoRepository(db).features_geojson()


@router.get("/places")
def demo_places(db: Session = Depends(get_db)) -> list[dict[str, Any]]:
    """Places searchable as A / B (named natural_features only)."""
    return DemoRepository(db).places()


@router.get("/bundle")
def demo_bundle() -> FileResponse:
    """Serve exports/dalat_bundle.json for client-side tag routing."""
    if not BUNDLE_PATH.is_file():
        raise HTTPException(
            status_code=404,
            detail=(
                f"Missing {BUNDLE_PATH.name}. "
                "Run: python -m app.cli export-json"
            ),
        )
    return FileResponse(
        path=BUNDLE_PATH,
        media_type="application/json",
        filename="dalat_bundle.json",
        headers={"Cache-Control": "no-cache"},
    )


@router.post("/route", response_model=RouteResponse)
def demo_route(body: RouteRequest, db: Session = Depends(get_db)) -> RouteResponse:
    """A→B on local roads; scenic prefers corridors within max_extra_km."""
    try:
        result = DemoRouteService(db).build_route(
            origin_id=body.origin_id,
            destination_id=body.destination_id,
            mode=body.mode,
            intensity=body.intensity,
            preferences=body.preferences,
            max_extra_km=body.max_extra_km,
            relax_preferences=body.relax_preferences,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return RouteResponse(**result)

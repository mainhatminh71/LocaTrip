"""FastAPI route handlers."""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.scenic_weights import FEATURE_TYPES, SCENIC_WEIGHTS
from app.database.session import get_db
from app.schemas.natural_feature import NaturalCrawlStats, NaturalFeatureRead
from app.schemas.road import CrawlStats, RoadRead
from app.services.natural_feature_service import NaturalFeatureService
from app.services.road_service import RoadService

router = APIRouter()


@router.get("/health")
def health() -> dict[str, str]:
    """Liveness probe."""
    return {"status": "ok"}


@router.post("/crawl/roads", response_model=CrawlStats)
def crawl_roads(db: Session = Depends(get_db)) -> CrawlStats:
    """Trigger a road crawl from OpenStreetMap Overpass."""
    return RoadService(db).crawl_roads()


@router.get("/roads", response_model=list[RoadRead])
def list_roads(
    limit: int = Query(default=100, ge=1, le=1000),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
) -> list[RoadRead]:
    """List stored roads."""
    return RoadService(db).list_roads(limit=limit, offset=offset)


@router.post("/crawl/natural/{feature_type}", response_model=NaturalCrawlStats)
def crawl_natural_feature(feature_type: str, db: Session = Depends(get_db)) -> NaturalCrawlStats:
    """Crawl one scenic feature category for Đà Lạt."""
    if feature_type not in FEATURE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown feature_type. Allowed: {list(FEATURE_TYPES)}",
        )
    return NaturalFeatureService(db).crawl_feature(feature_type)


@router.post("/crawl/natural", response_model=list[NaturalCrawlStats])
def crawl_all_natural(db: Session = Depends(get_db)) -> list[NaturalCrawlStats]:
    """Crawl all scenic feature categories (can take several minutes)."""
    return NaturalFeatureService(db).crawl_all()


@router.get("/natural-features", response_model=list[NaturalFeatureRead])
def list_natural_features(
    feature_type: str | None = Query(default=None),
    limit: int = Query(default=100, ge=1, le=1000),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
) -> list[NaturalFeatureRead]:
    """List stored natural / scenic features."""
    if feature_type is not None and feature_type not in FEATURE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown feature_type. Allowed: {list(FEATURE_TYPES)}",
        )
    return NaturalFeatureService(db).list_features(
        feature_type=feature_type,
        limit=limit,
        offset=offset,
    )


@router.get("/scenic/weights")
def scenic_weights() -> dict[str, int]:
    """Configured scenic weights (scoring not applied yet)."""
    return dict(SCENIC_WEIGHTS)

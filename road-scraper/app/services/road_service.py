"""Business orchestration for road crawling."""

from __future__ import annotations

import logging
import time

from sqlalchemy.orm import Session

from app.config.settings import Settings, get_settings
from app.crawlers.road_crawler import RoadCrawler
from app.repositories.road_repository import RoadRepository
from app.schemas.road import CrawlStats, RoadRead
from app.services.road_normalizer import normalize_road_elements

logger = logging.getLogger(__name__)


class RoadService:
    """Coordinates crawler → normalize → repository."""

    def __init__(
        self,
        db: Session,
        settings: Settings | None = None,
        crawler: RoadCrawler | None = None,
    ) -> None:
        self._db = db
        self._settings = settings or get_settings()
        self._crawler = crawler or RoadCrawler(self._settings)
        self._repo = RoadRepository(db)

    def crawl_roads(self, *, full: bool = False, grid_size: int | None = None) -> CrawlStats:
        """Crawl roads from Overpass and persist results.

        ``full=True`` fetches all highways (including unnamed) with geometry.
        """
        started = time.perf_counter()
        crawler = self._crawler
        if full or grid_size is not None:
            crawler = RoadCrawler(self._settings, full=full, grid_size=grid_size or 3)

        logger.info("Road crawl started | full=%s", full)

        fetched = 0
        inserted = 0
        updated = 0
        failed = 0

        try:
            elements = crawler.fetch()
            fetched = len(elements)
            roads, normalize_failed = normalize_road_elements(
                elements,
                require_name=not full,
            )
            failed += normalize_failed

            try:
                inserted, updated = self._repo.upsert_many(roads)
            except Exception:
                self._db.rollback()
                failed += len(roads)
                logger.exception("PostgreSQL error while saving roads")
        except Exception:
            logger.exception("Road crawl failed before persistence")
            failed = max(failed, 1)

        duration = time.perf_counter() - started
        stats = CrawlStats(
            fetched=fetched,
            inserted=inserted,
            updated=updated,
            failed=failed,
            duration_seconds=round(duration, 3),
        )
        logger.info(
            "Road crawl finished | fetched=%s inserted=%s updated=%s failed=%s duration=%.3fs",
            stats.fetched,
            stats.inserted,
            stats.updated,
            stats.failed,
            stats.duration_seconds,
        )
        return stats

    def list_roads(self, limit: int = 100, offset: int = 0) -> list[RoadRead]:
        """Return stored roads as API schemas."""
        rows = self._repo.list_roads(limit=limit, offset=offset)
        return [RoadRead.model_validate(row) for row in rows]

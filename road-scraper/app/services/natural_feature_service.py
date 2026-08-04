"""Orchestrate natural / scenic feature crawls."""

from __future__ import annotations

import logging
import time

from sqlalchemy.orm import Session

from app.config.settings import Settings, get_settings
from app.core.scenic_weights import FEATURE_TYPES
from app.crawlers.natural import get_natural_crawler_class
from app.repositories.natural_feature_repository import NaturalFeatureRepository
from app.schemas.natural_feature import NaturalCrawlStats, NaturalFeatureRead
from app.services.natural_normalizer import normalize_natural_elements

logger = logging.getLogger(__name__)


class NaturalFeatureService:
    """Coordinates natural crawlers → normalize → repository."""

    def __init__(self, db: Session, settings: Settings | None = None) -> None:
        self._db = db
        self._settings = settings or get_settings()
        self._repo = NaturalFeatureRepository(db)

    def crawl_feature(self, feature_type: str) -> NaturalCrawlStats:
        """Crawl one scenic category for the configured Đà Lạt bbox."""
        started = time.perf_counter()
        logger.info("Natural crawl started | feature_type=%s", feature_type)

        fetched = inserted = updated = failed = 0
        try:
            crawler_cls = get_natural_crawler_class(feature_type)
            crawler = crawler_cls(self._settings)
            elements = crawler.fetch()
            fetched = len(elements)
            features, normalize_failed = normalize_natural_elements(elements, feature_type)
            failed += normalize_failed
            try:
                inserted, updated = self._repo.upsert_many(features)
            except Exception:
                self._db.rollback()
                failed += len(features)
                logger.exception("PostgreSQL error saving %s", feature_type)
        except Exception:
            logger.exception("Natural crawl failed | feature_type=%s", feature_type)
            failed = max(failed, 1)

        duration = time.perf_counter() - started
        stats = NaturalCrawlStats(
            feature_type=feature_type,
            fetched=fetched,
            inserted=inserted,
            updated=updated,
            failed=failed,
            duration_seconds=round(duration, 3),
        )
        logger.info(
            "Natural crawl finished | %s fetched=%s inserted=%s updated=%s failed=%s duration=%.3fs",
            stats.feature_type,
            stats.fetched,
            stats.inserted,
            stats.updated,
            stats.failed,
            stats.duration_seconds,
        )
        return stats

    def crawl_all(self) -> list[NaturalCrawlStats]:
        """Crawl every registered scenic feature category."""
        return [self.crawl_feature(feature_type) for feature_type in FEATURE_TYPES]

    def list_features(
        self,
        feature_type: str | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[NaturalFeatureRead]:
        rows = self._repo.list_features(feature_type=feature_type, limit=limit, offset=offset)
        return [NaturalFeatureRead.model_validate(row) for row in rows]

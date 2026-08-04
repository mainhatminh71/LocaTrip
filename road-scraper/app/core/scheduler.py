"""Optional APScheduler job for periodic road crawls."""

from __future__ import annotations

import logging

from apscheduler.schedulers.background import BackgroundScheduler

from app.config.settings import Settings
from app.database.session import SessionLocal
from app.services.road_service import RoadService

logger = logging.getLogger(__name__)


def start_scheduler(settings: Settings) -> BackgroundScheduler | None:
    """Start a background scheduler when enabled via settings.

    Disabled by default so local/dev runs stay simple.
    """
    interval = getattr(settings, "crawl_interval_minutes", 0) or 0
    if interval <= 0:
        return None

    scheduler = BackgroundScheduler()

    def _job() -> None:
        db = SessionLocal()
        try:
            RoadService(db).crawl_roads()
        finally:
            db.close()

    scheduler.add_job(_job, "interval", minutes=interval, id="crawl_roads")
    scheduler.start()
    logger.info("APScheduler started | crawl every %s minutes", interval)
    return scheduler

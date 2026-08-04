"""Logging setup for road-scraper."""

import logging
import sys

from app.config.settings import get_settings


def setup_logging() -> None:
    """Configure root logging once at application startup."""
    settings = get_settings()
    level = getattr(logging, settings.log_level.upper(), logging.INFO)

    logging.basicConfig(
        level=level,
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        handlers=[logging.StreamHandler(sys.stdout)],
        force=True,
    )

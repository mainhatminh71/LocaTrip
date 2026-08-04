"""Crawler contracts and implementations."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any


class BaseCrawler(ABC):
    """Minimal crawler interface.

    New crawlers (Nature, Tourism, Wikipedia, Weather) only need to
    implement ``fetch`` and return raw normalized-ready records.
    """

    @abstractmethod
    def fetch(self) -> list[dict[str, Any]]:
        """Fetch remote data and return a list of raw element dicts."""

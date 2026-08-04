"""OpenStreetMap Overpass road crawler for Đà Lạt."""

from __future__ import annotations

import logging
from typing import Any

from app.config.settings import Settings
from app.crawlers.base import BaseCrawler
from app.utils.http import HttpClient

logger = logging.getLogger(__name__)


class RoadCrawler(BaseCrawler):
    """Fetch highway ways in the configured Đà Lạt bbox via Overpass.

    ``full=True`` pulls all highways (named + unnamed) with geometry.
    """

    def __init__(
        self,
        settings: Settings,
        http_client: HttpClient | None = None,
        *,
        full: bool = False,
        grid_size: int | None = None,
    ) -> None:
        self._settings = settings
        self._http = http_client or HttpClient(settings)
        self._full = full
        self._grid_size = grid_size

    def fetch(self) -> list[dict[str, Any]]:
        """Call Overpass (tiled) and return deduplicated ``elements``."""
        s = self._settings
        tiles = self._bbox_tiles(s, self._grid_size)
        logger.info(
            "RoadCrawler: region=%s full=%s tiles=%s bbox=(%.4f,%.4f,%.4f,%.4f)",
            s.crawl_region,
            self._full,
            len(tiles),
            s.bbox_south,
            s.bbox_west,
            s.bbox_north,
            s.bbox_east,
        )

        by_id: dict[int, dict[str, Any]] = {}
        for index, (south, west, north, east) in enumerate(tiles, start=1):
            query = self._build_query(s, south, west, north, east, full=self._full)
            logger.info(
                "RoadCrawler: tile %s/%s (%.4f,%.4f,%.4f,%.4f)",
                index,
                len(tiles),
                south,
                west,
                north,
                east,
            )
            try:
                payload = self._http.post_form(None, {"data": query})
            except Exception:
                logger.exception("RoadCrawler: tile %s failed — continuing", index)
                continue

            elements = payload.get("elements", [])
            if not isinstance(elements, list):
                continue

            for element in elements:
                osm_id = element.get("id")
                if isinstance(osm_id, int):
                    by_id[osm_id] = element

            logger.info(
                "RoadCrawler: tile %s fetched %s (unique total=%s)",
                index,
                len(elements),
                len(by_id),
            )

        logger.info("RoadCrawler: fetched %s unique elements", len(by_id))
        return list(by_id.values())

    @staticmethod
    def _build_query(
        settings: Settings,
        south: float,
        west: float,
        north: float,
        east: float,
        *,
        full: bool,
    ) -> str:
        timeout = max(60, int(settings.overpass_timeout_seconds) - 10)
        name_filter = "" if full else '["name"]'
        # Full crawl needs geometry for PostGIS + scenic buffering later.
        out_mode = "out geom;" if full else "out tags;"
        return f"""
[out:json][timeout:{timeout}];
way
["highway"]
{name_filter}
({south},{west},{north},{east});
{out_mode}
""".strip()

    @staticmethod
    def _bbox_tiles(
        settings: Settings,
        grid_size: int | None = None,
    ) -> list[tuple[float, float, float, float]]:
        grid = max(1, grid_size or settings.crawl_grid_size)
        south, west = settings.bbox_south, settings.bbox_west
        north, east = settings.bbox_north, settings.bbox_east
        lat_step = (north - south) / grid
        lon_step = (east - west) / grid

        tiles: list[tuple[float, float, float, float]] = []
        for row in range(grid):
            for col in range(grid):
                tiles.append(
                    (
                        south + row * lat_step,
                        west + col * lon_step,
                        south + (row + 1) * lat_step,
                        west + (col + 1) * lon_step,
                    )
                )
        return tiles

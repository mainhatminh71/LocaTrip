"""Base crawler for one natural feature category (Overpass)."""

from __future__ import annotations

import logging
from typing import Any

from app.config.settings import Settings
from app.crawlers.base import BaseCrawler
from app.crawlers.feature_specs import FEATURE_SPECS, FeatureSpec
from app.utils.http import HttpClient

logger = logging.getLogger(__name__)


class NaturalFeatureCrawler(BaseCrawler):
    """Fetch OSM elements for a single scenic feature_type.

    Subclasses only set ``feature_type``. Query building and HTTP stay here.
    """

    feature_type: str = ""

    def __init__(
        self,
        settings: Settings,
        http_client: HttpClient | None = None,
        feature_type: str | None = None,
    ) -> None:
        self._settings = settings
        self._http = http_client or HttpClient(settings)
        resolved = feature_type or self.feature_type
        if resolved not in FEATURE_SPECS:
            raise ValueError(f"Unknown feature_type: {resolved}")
        self._spec: FeatureSpec = FEATURE_SPECS[resolved]

    @property
    def spec(self) -> FeatureSpec:
        return self._spec

    def fetch(self) -> list[dict[str, Any]]:
        """Fetch tiled Overpass results for this feature category."""
        s = self._settings
        tiles = self._bbox_tiles(s)
        logger.info(
            "%s: region=%s tiles=%s preferred_geom=%s",
            self._spec.feature_type,
            s.crawl_region,
            len(tiles),
            self._spec.preferred_geometry,
        )

        by_id: dict[int, dict[str, Any]] = {}
        for index, (south, west, north, east) in enumerate(tiles, start=1):
            query = self._build_query(s, south, west, north, east)
            try:
                payload = self._http.post_form(None, {"data": query})
            except Exception:
                logger.exception(
                    "%s: tile %s/%s failed — continuing",
                    self._spec.feature_type,
                    index,
                    len(tiles),
                )
                continue

            elements = payload.get("elements", [])
            if not isinstance(elements, list):
                continue
            for element in elements:
                osm_id = element.get("id")
                if isinstance(osm_id, int):
                    by_id[osm_id] = element

            logger.info(
                "%s: tile %s/%s fetched=%s unique=%s",
                self._spec.feature_type,
                index,
                len(tiles),
                len(elements),
                len(by_id),
            )

        logger.info("%s: fetched %s unique elements", self._spec.feature_type, len(by_id))
        return list(by_id.values())

    def _build_query(
        self,
        settings: Settings,
        south: float,
        west: float,
        north: float,
        east: float,
    ) -> str:
        timeout = max(60, int(settings.overpass_timeout_seconds) - 10)
        bbox = f"({south},{west},{north},{east})"
        body = "\n  ".join(f"{selector}{bbox};" for selector in self._spec.selectors)
        return f"""
[out:json][timeout:{timeout}];
(
  {body}
);
out geom;
""".strip()

    @staticmethod
    def _bbox_tiles(settings: Settings) -> list[tuple[float, float, float, float]]:
        grid = max(1, settings.crawl_grid_size)
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

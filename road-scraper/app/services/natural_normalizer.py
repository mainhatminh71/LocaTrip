"""Normalize Overpass natural feature elements."""

from __future__ import annotations

import logging
from typing import Any

from app.schemas.natural_feature import NaturalFeatureCreate
from app.utils.geo import element_to_wkt

logger = logging.getLogger(__name__)


def normalize_natural_element(
    element: dict[str, Any],
    feature_type: str,
) -> NaturalFeatureCreate | None:
    """Convert one Overpass element into NaturalFeatureCreate."""
    osm_id = element.get("id")
    if not isinstance(osm_id, int):
        return None

    tags = element.get("tags") or {}
    if not isinstance(tags, dict):
        tags = {}

    name = tags.get("name")
    if isinstance(name, str):
        name = name.strip()[:255] or None
    else:
        name = None

    wkt = element_to_wkt(element)
    return NaturalFeatureCreate(
        osm_id=osm_id,
        feature_type=feature_type,
        name=name,
        wkt=wkt,
        raw_tags=dict(tags),
    )


def normalize_natural_elements(
    elements: list[dict[str, Any]],
    feature_type: str,
) -> tuple[list[NaturalFeatureCreate], int]:
    """Normalize many elements. Returns (valid, failed_count)."""
    features: list[NaturalFeatureCreate] = []
    failed = 0
    for element in elements:
        try:
            feature = normalize_natural_element(element, feature_type)
            if feature is None:
                failed += 1
                continue
            features.append(feature)
        except Exception:
            failed += 1
            logger.exception(
                "Failed to normalize %s element %s",
                feature_type,
                element.get("id"),
            )
    return features, failed

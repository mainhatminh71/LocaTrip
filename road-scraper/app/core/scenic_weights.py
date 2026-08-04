"""Scenic score weights + feature type registry for crawl/enrichment."""

from __future__ import annotations

# Points added to a road's scenic score when a feature is nearby.
SCENIC_WEIGHTS: dict[str, int] = {
    "lake": 5,
    "river": 4,
    "waterfall": 10,
    "forest": 3,
    "wood": 3,
    "mountain": 6,
    "hill": 4,
    "peak": 8,
    "valley": 5,
    "cliff": 6,
    "beach": 5,
    "coastline": 4,
    "viewpoint": 8,
    "national_park": 7,
    "village": 2,
    "town": 2,
    "hamlet": 1,
    "park": 4,
    "garden": 4,
    "grassland": 2,
    "meadow": 2,
    "farmland": 2,
    "orchard": 3,
    "vineyard": 3,
    "stream": 3,
    "scrub": 2,
}

FEATURE_TYPES: tuple[str, ...] = tuple(SCENIC_WEIGHTS.keys())


def weight_for(feature_type: str) -> int:
    """Return configured scenic weight for a feature type (default 1)."""
    return SCENIC_WEIGHTS.get(feature_type, 1)

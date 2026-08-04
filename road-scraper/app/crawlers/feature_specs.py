"""Overpass query definitions for scenic / natural feature categories."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class FeatureSpec:
    """How to crawl one natural feature category from OSM."""

    feature_type: str
    # Overpass selectors without the bbox, e.g. way["natural"="wood"]
    selectors: tuple[str, ...]
    # Preferred geometry kind for documentation / future validation.
    preferred_geometry: str  # POINT | LINESTRING | POLYGON


FEATURE_SPECS: dict[str, FeatureSpec] = {
    "lake": FeatureSpec(
        feature_type="lake",
        selectors=(
            'way["natural"="water"]["water"="lake"]',
            'relation["natural"="water"]["water"="lake"]',
            'way["natural"="lake"]',
            'relation["natural"="lake"]',
            # Hồ Xuân Hương etc. often tagged natural=water without water=lake.
            'way["natural"="water"]["name"]',
            'relation["natural"="water"]["name"]',
            'way["natural"="water"]["water"="pond"]',
            'way["natural"="water"]["water"="reservoir"]',
            'relation["natural"="water"]["water"="reservoir"]',
        ),
        preferred_geometry="POLYGON",
    ),
    "river": FeatureSpec(
        feature_type="river",
        selectors=(
            'way["waterway"="river"]',
            'relation["waterway"="river"]',
        ),
        preferred_geometry="LINESTRING",
    ),
    "waterfall": FeatureSpec(
        feature_type="waterfall",
        selectors=(
            'node["waterway"="waterfall"]',
            'way["waterway"="waterfall"]',
            'node["natural"="waterfall"]',
        ),
        preferred_geometry="POINT",
    ),
    "forest": FeatureSpec(
        feature_type="forest",
        selectors=(
            'way["landuse"="forest"]',
            'relation["landuse"="forest"]',
        ),
        preferred_geometry="POLYGON",
    ),
    "wood": FeatureSpec(
        feature_type="wood",
        selectors=(
            'way["natural"="wood"]',
            'relation["natural"="wood"]',
        ),
        preferred_geometry="POLYGON",
    ),
    "mountain": FeatureSpec(
        feature_type="mountain",
        selectors=(
            'node["natural"="mountain_range"]',
            'way["natural"="mountain_range"]',
            'node["place"="mountain"]',
        ),
        preferred_geometry="POINT",
    ),
    "hill": FeatureSpec(
        feature_type="hill",
        selectors=(
            'node["natural"="hill"]',
            'way["natural"="hill"]',
        ),
        preferred_geometry="POINT",
    ),
    "peak": FeatureSpec(
        feature_type="peak",
        selectors=('node["natural"="peak"]',),
        preferred_geometry="POINT",
    ),
    "valley": FeatureSpec(
        feature_type="valley",
        selectors=(
            'way["natural"="valley"]',
            'node["natural"="valley"]',
            'relation["natural"="valley"]',
        ),
        preferred_geometry="LINESTRING",
    ),
    "cliff": FeatureSpec(
        feature_type="cliff",
        selectors=(
            'way["natural"="cliff"]',
            'node["natural"="cliff"]',
        ),
        preferred_geometry="LINESTRING",
    ),
    "beach": FeatureSpec(
        feature_type="beach",
        selectors=(
            'way["natural"="beach"]',
            'node["natural"="beach"]',
        ),
        preferred_geometry="POLYGON",
    ),
    "coastline": FeatureSpec(
        feature_type="coastline",
        selectors=('way["natural"="coastline"]',),
        preferred_geometry="LINESTRING",
    ),
    "viewpoint": FeatureSpec(
        feature_type="viewpoint",
        selectors=(
            'node["tourism"="viewpoint"]',
            'way["tourism"="viewpoint"]',
        ),
        preferred_geometry="POINT",
    ),
    "national_park": FeatureSpec(
        feature_type="national_park",
        selectors=(
            'relation["boundary"="national_park"]',
            'way["boundary"="national_park"]',
            'relation["leisure"="nature_reserve"]',
            'way["leisure"="nature_reserve"]',
        ),
        preferred_geometry="POLYGON",
    ),
    "village": FeatureSpec(
        feature_type="village",
        selectors=('node["place"="village"]', 'way["place"="village"]'),
        preferred_geometry="POINT",
    ),
    "town": FeatureSpec(
        feature_type="town",
        selectors=('node["place"="town"]', 'way["place"="town"]'),
        preferred_geometry="POINT",
    ),
    "hamlet": FeatureSpec(
        feature_type="hamlet",
        selectors=('node["place"="hamlet"]', 'way["place"="hamlet"]'),
        preferred_geometry="POINT",
    ),
    "park": FeatureSpec(
        feature_type="park",
        selectors=(
            'way["leisure"="park"]',
            'relation["leisure"="park"]',
            'way["leisure"="garden"]',
            'relation["leisure"="garden"]',
        ),
        preferred_geometry="POLYGON",
    ),
    "garden": FeatureSpec(
        feature_type="garden",
        selectors=(
            'way["leisure"="garden"]',
            'node["leisure"="garden"]',
            'way["landuse"="flowerbed"]',
        ),
        preferred_geometry="POLYGON",
    ),
    "grassland": FeatureSpec(
        feature_type="grassland",
        selectors=(
            'way["natural"="grassland"]',
            'relation["natural"="grassland"]',
            'way["landuse"="grass"]',
        ),
        preferred_geometry="POLYGON",
    ),
    "meadow": FeatureSpec(
        feature_type="meadow",
        selectors=(
            'way["landuse"="meadow"]',
            'relation["landuse"="meadow"]',
        ),
        preferred_geometry="POLYGON",
    ),
    "farmland": FeatureSpec(
        feature_type="farmland",
        selectors=(
            'way["landuse"="farmland"]',
            'relation["landuse"="farmland"]',
            'way["landuse"="farmyard"]',
        ),
        preferred_geometry="POLYGON",
    ),
    "orchard": FeatureSpec(
        feature_type="orchard",
        selectors=(
            'way["landuse"="orchard"]',
            'relation["landuse"="orchard"]',
        ),
        preferred_geometry="POLYGON",
    ),
    "vineyard": FeatureSpec(
        feature_type="vineyard",
        selectors=(
            'way["landuse"="vineyard"]',
            'relation["landuse"="vineyard"]',
        ),
        preferred_geometry="POLYGON",
    ),
    "stream": FeatureSpec(
        feature_type="stream",
        selectors=(
            'way["waterway"="stream"]',
            'way["waterway"="brook"]',
            'way["waterway"="ditch"]',
        ),
        preferred_geometry="LINESTRING",
    ),
    "scrub": FeatureSpec(
        feature_type="scrub",
        selectors=(
            'way["natural"="scrub"]',
            'relation["natural"="scrub"]',
        ),
        preferred_geometry="POLYGON",
    ),
}

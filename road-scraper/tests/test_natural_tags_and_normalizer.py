"""Unit tests for natural tag mapping and road normalizer enrichment fields."""

from __future__ import annotations

from app.core.natural_tag_mapping import (
    dedupe_tag_points,
    dedupe_tags,
    tag_names,
    tag_points_for_feature,
    tags_for_feature,
)
from app.services.road_normalizer import normalize_road_element


def test_tags_for_lake_and_wood() -> None:
    assert "lake_view" in tags_for_feature("lake")
    assert "pine_forest" in tags_for_feature("wood")
    assert "creek" in tags_for_feature("stream")
    assert "park" in tags_for_feature("park")


def test_raw_tag_pine_and_tea() -> None:
    tags = tags_for_feature("forest", {"leaf_type": "needleleaved", "name": "Đồi chè"})
    assert "pine_forest" in tags
    assert "tea_hill" in tags


def test_dedupe_tags() -> None:
    assert dedupe_tags(["forest", "Forest", " forest ", "forest"]) == ["forest"]


def test_tag_points_include_coords() -> None:
    points = tag_points_for_feature(
        "lake",
        lat=11.94,
        lon=108.44,
        feature_osm_id=42,
        feature_name="Hồ Xuân Hương",
        distance_m=35.2,
    )
    assert points
    assert all(p["lat"] == 11.94 and p["lon"] == 108.44 for p in points)
    assert any(p["tag"] == "lake_view" for p in points)
    assert points[0]["feature_osm_id"] == 42
    assert points[0]["feature_name"] == "Hồ Xuân Hương"


def test_dedupe_tag_points_and_names() -> None:
    pts = [
        {"tag": "lake_view", "lat": 11.94, "lon": 108.44, "feature_osm_id": 1},
        {"tag": "lake_view", "lat": 11.94, "lon": 108.44, "feature_osm_id": 1},
        {"tag": "nature", "lat": 11.94, "lon": 108.44, "feature_osm_id": 1},
    ]
    deduped = dedupe_tag_points(pts)
    assert len(deduped) == 2
    assert tag_names(deduped) == ["lake_view", "nature"]


def test_normalize_promotes_bridge_lanes_geometry_length() -> None:
    element = {
        "type": "way",
        "id": 999001,
        "tags": {
            "highway": "residential",
            "name": "Test Road",
            "bridge": "yes",
            "lanes": "2",
            "lit": "yes",
            "tunnel": "no",
            "incline": "5%",
            "surface": "asphalt",
            "oneway": "yes",
            "maxspeed": "40",
        },
        "geometry": [
            {"lat": 11.94, "lon": 108.44},
            {"lat": 11.941, "lon": 108.441},
            {"lat": 11.942, "lon": 108.442},
        ],
    }
    road = normalize_road_element(element, require_name=False)
    assert road is not None
    assert road.bridge == "yes"
    assert road.lanes == "2"
    assert road.lit == "yes"
    assert road.tunnel == "no"
    assert road.incline == "5%"
    assert road.wkt is not None and road.wkt.startswith("LINESTRING")
    assert road.length_m is not None and road.length_m > 0

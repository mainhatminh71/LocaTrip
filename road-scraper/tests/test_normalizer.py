"""Unit tests for road normalization."""

from app.services.road_normalizer import normalize_road_element, normalize_road_elements


def test_normalize_valid_element() -> None:
    element = {
        "type": "way",
        "id": 123,
        "tags": {
            "name": "Test Road",
            "highway": "residential",
            "surface": "asphalt",
            "oneway": "yes",
            "maxspeed": "40",
        },
    }
    road = normalize_road_element(element)
    assert road is not None
    assert road.osm_id == 123
    assert road.name == "Test Road"
    assert road.highway == "residential"


def test_normalize_skips_missing_name() -> None:
    element = {"type": "way", "id": 1, "tags": {"highway": "path"}}
    assert normalize_road_element(element) is None


def test_normalize_batch_counts_failures() -> None:
    elements = [
        {"type": "way", "id": 1, "tags": {"name": "A", "highway": "primary"}},
        {"type": "way", "id": 2, "tags": {"highway": "path"}},
    ]
    roads, failed = normalize_road_elements(elements)
    assert len(roads) == 1
    assert failed == 1

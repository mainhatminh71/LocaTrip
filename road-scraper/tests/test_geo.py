"""Unit tests for Overpass → WKT conversion."""

from app.utils.geo import element_to_wkt


def test_node_point() -> None:
    assert element_to_wkt({"type": "node", "lat": 11.94, "lon": 108.44}) == "POINT(108.44 11.94)"


def test_closed_ring_polygon() -> None:
    geom = [
        {"lon": 0, "lat": 0},
        {"lon": 1, "lat": 0},
        {"lon": 1, "lat": 1},
        {"lon": 0, "lat": 1},
        {"lon": 0, "lat": 0},
    ]
    wkt = element_to_wkt({"type": "way", "geometry": geom})
    assert wkt is not None
    assert wkt.startswith("POLYGON")


def test_open_linestring() -> None:
    geom = [{"lon": 0, "lat": 0}, {"lon": 1, "lat": 1}, {"lon": 2, "lat": 2}]
    wkt = element_to_wkt({"type": "way", "geometry": geom})
    assert wkt is not None
    assert wkt.startswith("LINESTRING")

"""Basic API tests using TestClient (DB required)."""

from fastapi.testclient import TestClient

from app.main import create_app

client = TestClient(create_app())


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_list_roads() -> None:
    response = client.get("/roads?limit=5")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

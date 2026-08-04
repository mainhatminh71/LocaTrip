"""Application settings loaded from environment variables."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration for road-scraper."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "road-scraper"
    app_env: str = "development"
    log_level: str = "INFO"

    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_db: str = "locatrip"
    postgres_user: str = "postgres"
    postgres_password: str = "12345"
    database_url: str = (
        "postgresql+psycopg://postgres:12345@localhost:5432/locatrip"
    )

    overpass_url: str = "https://overpass-api.de/api/interpreter"
    # Comma-separated Overpass mirrors (tried in order on failure).
    overpass_urls: str = (
        "https://overpass-api.de/api/interpreter,"
        "https://lz4.overpass-api.de/api/interpreter,"
        "https://z.overpass-api.de/api/interpreter"
    )
    overpass_timeout_seconds: float = 120.0
    http_max_retries: int = 4

    # Đà Lạt crawl area (Overpass bbox: south, west, north, east).
    crawl_region: str = "dalat"
    bbox_south: float = 11.88
    bbox_west: float = 108.38
    bbox_north: float = 12.00
    bbox_east: float = 108.52
    # Split bbox into NxN tiles to avoid Overpass 504 on large queries.
    crawl_grid_size: int = 2

    # Set > 0 to enable periodic crawls via APScheduler.
    crawl_interval_minutes: int = 0

    # Public Mapbox token for the scenic demo basemap (pk.*).
    mapbox_access_token: str = ""
    mapbox_style: str = "mapbox/outdoors-v12"

    def overpass_endpoints(self) -> list[str]:
        """Return unique Overpass endpoints to try."""
        urls = [u.strip() for u in self.overpass_urls.split(",") if u.strip()]
        if self.overpass_url and self.overpass_url not in urls:
            urls.insert(0, self.overpass_url)
        return urls or [self.overpass_url]


@lru_cache
def get_settings() -> Settings:
    """Return a cached Settings instance."""
    return Settings()

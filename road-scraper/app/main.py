"""FastAPI application factory."""

from contextlib import asynccontextmanager
from collections.abc import AsyncIterator
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.api.demo_routes import router as demo_router
from app.api.routes import router
from app.config.settings import get_settings
from app.core.logging import setup_logging
from app.core.scheduler import start_scheduler

STATIC_DIR = Path(__file__).resolve().parent.parent / "static"
EXPORTS_DIR = Path(__file__).resolve().parent.parent / "exports"


def create_app() -> FastAPI:
    """Build and configure the FastAPI application."""
    setup_logging()
    settings = get_settings()

    @asynccontextmanager
    async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
        scheduler = start_scheduler(settings)
        yield
        if scheduler is not None:
            scheduler.shutdown(wait=False)

    app = FastAPI(
        title=settings.app_name,
        description="Internal OSM road crawler for LocaTrip",
        version="1.0.0",
        lifespan=lifespan,
    )
    app.include_router(router)
    app.include_router(demo_router)

    if EXPORTS_DIR.exists():
        # Serve dalat_bundle.json for the demo's client-side tag router.
        app.mount("/exports", StaticFiles(directory=EXPORTS_DIR), name="exports")

    if STATIC_DIR.exists():
        app.mount("/demo", StaticFiles(directory=STATIC_DIR / "demo", html=True), name="demo")

        @app.get("/")
        def root() -> FileResponse:
            return FileResponse(STATIC_DIR / "demo" / "index.html")

    return app

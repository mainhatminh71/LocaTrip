"""Shared HTTP client with retries for external APIs."""

from __future__ import annotations

import logging
import time
from typing import Any

import httpx

from app.config.settings import Settings

logger = logging.getLogger(__name__)


class HttpClient:
    """Thin httpx wrapper with exponential backoff and endpoint failover."""

    def __init__(self, settings: Settings) -> None:
        self._timeout = settings.overpass_timeout_seconds
        self._max_retries = settings.http_max_retries
        self._endpoints = settings.overpass_endpoints()
        self._headers = {
            "User-Agent": f"{settings.app_name}/1.0 (LocaTrip internal crawler)",
            "Accept": "application/json",
        }

    def post_form(self, url: str | None, data: dict[str, str]) -> dict[str, Any]:
        """POST form-urlencoded data and return parsed JSON.

        Tries configured Overpass mirrors and retries with exponential backoff.
        """
        endpoints = self._endpoints if url is None else [url, *[e for e in self._endpoints if e != url]]
        last_error: Exception | None = None
        attempt = 0

        for endpoint in endpoints:
            for _ in range(self._max_retries):
                attempt += 1
                try:
                    logger.info("HTTP POST %s (attempt %s)", endpoint, attempt)
                    with httpx.Client(timeout=self._timeout, headers=self._headers) as client:
                        response = client.post(endpoint, data=data)
                        response.raise_for_status()
                        payload = response.json()
                        if not isinstance(payload, dict):
                            raise ValueError("Overpass response is not a JSON object")
                        return payload
                except (httpx.TimeoutException, httpx.NetworkError, httpx.HTTPStatusError, ValueError) as exc:
                    last_error = exc
                    wait_seconds = min(2 ** (attempt - 1), 16)
                    logger.warning(
                        "HTTP failed on %s: %s — wait %ss then retry/failover",
                        endpoint,
                        exc,
                        wait_seconds,
                    )
                    time.sleep(wait_seconds)

        assert last_error is not None
        raise last_error

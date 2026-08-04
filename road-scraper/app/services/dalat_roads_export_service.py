"""Export enriched Đà Lạt roads to output/dalat_roads.json with validation."""

from __future__ import annotations

import json
import logging
import time
from pathlib import Path
from typing import Any

from sqlalchemy.orm import Session

from app.core.natural_tag_mapping import dedupe_tag_points, tag_names
from app.repositories.road_repository import RoadRepository

logger = logging.getLogger(__name__)

REQUIRED_FIELDS = (
    "osm_way_id",
    "road_name",
    "highway_type",
    "length",
    "one_way",
    "lanes",
    "maxspeed",
    "surface",
    "bridge",
    "tunnel",
    "lit",
    "incline",
    "geometry",
    "natural_tags",
    "source",
)


class DalatRoadsExportService:
    """Build the required output/dalat_roads.json artifact."""

    def __init__(self, db: Session, output_dir: Path | None = None) -> None:
        self._db = db
        self._roads = RoadRepository(db)
        self._output_dir = output_dir or Path("output")

    def export_and_validate(self) -> dict[str, Any]:
        started = time.perf_counter()
        self._output_dir.mkdir(parents=True, exist_ok=True)
        out_path = self._output_dir / "dalat_roads.json"

        rows = self._roads.export_enriched_rows()
        payload = [self._row_to_export(row) for row in rows]

        with out_path.open("w", encoding="utf-8") as fh:
            json.dump(payload, fh, ensure_ascii=False, indent=2)

        export_seconds = round(time.perf_counter() - started, 2)
        validation = self.validate_file(out_path)
        validation["export_seconds"] = export_seconds
        validation["path"] = str(out_path.resolve())
        validation["file_size_bytes"] = out_path.stat().st_size
        if not validation["ok"]:
            raise RuntimeError(f"JSON validation failed: {validation['errors']}")
        logger.info("Exported %s roads → %s", validation["total_roads"], out_path)
        return validation

    def _row_to_export(self, row: dict[str, Any]) -> dict[str, Any]:
        geom = row.get("geometry") or {}
        coords_lonlat = geom.get("coordinates") if isinstance(geom, dict) else None
        # Spec wants [lat, lon] pairs.
        geometry: list[list[float]] | None = None
        if isinstance(coords_lonlat, list) and coords_lonlat:
            geometry = []
            for pair in coords_lonlat:
                if not isinstance(pair, (list, tuple)) or len(pair) < 2:
                    continue
                lon, lat = float(pair[0]), float(pair[1])
                geometry.append([lat, lon])
            if not geometry:
                geometry = None

        tags = dedupe_tag_points(row.get("natural_tags") or [])

        oneway_raw = row.get("oneway")
        one_way = self._parse_one_way(oneway_raw)

        return {
            "osm_way_id": int(row["osm_id"]),
            "road_name": row.get("name"),
            "highway_type": row.get("highway"),
            "length": float(row["length_m"]) if row.get("length_m") is not None else None,
            "one_way": one_way,
            "lanes": self._parse_int_or_null(row.get("lanes")),
            "maxspeed": self._parse_int_or_null(row.get("maxspeed")),
            "surface": row.get("surface"),
            "bridge": self._parse_bool_flag(row.get("bridge")),
            "tunnel": self._parse_bool_flag(row.get("tunnel")),
            "lit": self._parse_bool_flag(row.get("lit")),
            "incline": row.get("incline"),
            "geometry": geometry,
            "natural_tags": tags,
            "source": row.get("source") or "OpenStreetMap",
        }

    @staticmethod
    def _parse_one_way(value: Any) -> bool | None:
        if value is None or value == "":
            return False
        text = str(value).strip().lower()
        if text in {"yes", "true", "1"}:
            return True
        if text in {"no", "false", "0"}:
            return False
        if text in {"-1", "reverse"}:
            return True
        return None

    @staticmethod
    def _parse_bool_flag(value: Any) -> bool | None:
        if value is None or value == "":
            return False
        text = str(value).strip().lower()
        if text in {"yes", "true", "1"}:
            return True
        if text in {"no", "false", "0"}:
            return False
        # OSM sometimes uses "culvert" etc. for bridge/tunnel — treat as true-ish.
        return True

    @staticmethod
    def _parse_int_or_null(value: Any) -> int | None:
        if value is None or value == "":
            return None
        try:
            return int(str(value).strip().split()[0])
        except (TypeError, ValueError):
            return None

    def validate_file(self, path: Path) -> dict[str, Any]:
        errors: list[str] = []
        with path.open("r", encoding="utf-8") as fh:
            data = json.load(fh)

        if not isinstance(data, list):
            return {"ok": False, "errors": ["root must be a JSON array"]}

        osm_ids: set[int] = set()
        named = 0
        with_tags = 0
        tag_set: set[str] = set()
        tag_total = 0

        for i, obj in enumerate(data):
            if not isinstance(obj, dict):
                errors.append(f"index {i}: not an object")
                continue
            for field in REQUIRED_FIELDS:
                if field not in obj:
                    errors.append(f"index {i}: missing field {field}")
            osm_id = obj.get("osm_way_id")
            if not isinstance(osm_id, int):
                errors.append(f"index {i}: osm_way_id must be int")
            elif osm_id in osm_ids:
                errors.append(f"duplicate osm_way_id={osm_id}")
            else:
                osm_ids.add(osm_id)

            geom = obj.get("geometry")
            if not isinstance(geom, list) or len(geom) < 2:
                errors.append(f"index {i}: geometry must be array of >=2 [lat,lon]")
            else:
                for pt in geom:
                    if not isinstance(pt, list) or len(pt) < 2:
                        errors.append(f"index {i}: bad geometry point")
                        break

            tags = obj.get("natural_tags")
            if not isinstance(tags, list):
                errors.append(f"index {i}: natural_tags must be array")
            else:
                keys: set[tuple[Any, ...]] = set()
                for j, item in enumerate(tags):
                    if not isinstance(item, dict):
                        errors.append(f"index {i}: natural_tags[{j}] must be object")
                        continue
                    if "tag" not in item or "lat" not in item or "lon" not in item:
                        errors.append(f"index {i}: natural_tags[{j}] needs tag/lat/lon")
                        continue
                    try:
                        lat = float(item["lat"])
                        lon = float(item["lon"])
                    except (TypeError, ValueError):
                        errors.append(f"index {i}: natural_tags[{j}] bad lat/lon")
                        continue
                    key = (item["tag"], item.get("feature_osm_id"), round(lat, 5), round(lon, 5))
                    if key in keys:
                        errors.append(f"index {i}: duplicate natural_tags entry")
                    keys.add(key)
                if tags:
                    with_tags += 1
                    names = tag_names(tags)
                    tag_total += len(names)
                    tag_set.update(names)

            name = obj.get("road_name") or ""
            if name and not str(name).startswith("Unnamed "):
                named += 1

        total = len(data)
        avg_tags = (tag_total / total) if total else 0.0
        return {
            "ok": len(errors) == 0,
            "errors": errors[:50],
            "error_count": len(errors),
            "total_roads": total,
            "roads_with_name": named,
            "roads_with_natural_tags": with_tags,
            "unique_natural_tags": len(tag_set),
            "avg_tags_per_road": round(avg_tags, 3),
            "natural_tag_values": sorted(tag_set),
        }

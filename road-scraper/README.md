# road-scraper

Hệ thống nội bộ LocaTrip: **cào đường + scenic / natural features Đà Lạt** từ OpenStreetMap, lưu PostgreSQL + PostGIS, chuẩn bị cho scenic route recommendation.

## Pipeline (hiện tại + tương lai)

```
RoadCrawler ──────────────► roads (LINESTRING geometry sẵn sàng)
NaturalFeatureCrawlers ───► natural_features (POINT/LINE/POLYGON)
                                    │
                    (sau này)       ▼
                    buffer / ST_DWithin
                                    ▼
                            road_scenic_feature (distance, weight)
                                    ▼
                            Scenic Score (weights đã khai báo sẵn)
```

## Feature categories

Mỗi loại có crawler riêng (`LakeCrawler`, `ViewpointCrawler`, …):

lake, river, waterfall, forest, wood, mountain, hill, peak,
valley, cliff, beach, coastline, viewpoint, national_park

Weights (chưa tính score): xem `app/core/scenic_weights.py` hoặc `GET /scenic/weights`.

## Setup

```bash
py -3.12 -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
alembic upgrade head
```

## Crawl

```bash
# Đường (có tên)
python -m app.cli crawl

# Toàn bộ đường Đà Lạt + geometry (Overpass)
python -m app.cli crawl --full --grid 3

# Scenic / place tags: lake, mountain, village, waterfall, …
python -m app.cli crawl-natural
python -m app.cli crawl-natural --type village

# Full: roads + features + xuất JSON
python -m app.cli crawl-full

# Chỉ xuất JSON từ DB
python -m app.cli export-json
```

JSON nằm ở `exports/`:

- `dalat_roads.json` — GeoJSON đường
- `dalat_features.json` — GeoJSON lake/mountain/village/…
- `dalat_bundle.json` — gộp cả hai

## Demo UI (scenic vs nhanh)

```bash
uvicorn main:app --reload --port 8000
```

Mở http://127.0.0.1:8000/

- Bản đồ load điểm từ bảng `natural_features`
- Chọn A / B, chế độ **Nhanh nhất** hoặc **Ngắm cảnh**
- Ngắm cảnh: chèn waypoint scenic trên hành trình (OSRM)

| Method | Path | Mô tả |
|--------|------|--------|
| GET | `/health` | Health |
| POST | `/crawl/roads` | Crawl roads |
| GET | `/roads` | List roads |
| POST | `/crawl/natural/{feature_type}` | Crawl 1 loại |
| POST | `/crawl/natural` | Crawl tất cả loại |
| GET | `/natural-features` | List features |
| GET | `/scenic/weights` | Trọng số scenic (chưa apply) |

## Xem data trong pgAdmin

`locatrip` → Schemas → public → Tables:

- `roads`
- `natural_features`
- `road_scenic_feature` (trống đến khi implement linking)

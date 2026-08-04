"""Per-category natural feature crawlers (Open/Closed: add class, register)."""

from __future__ import annotations

from app.crawlers.natural_feature_crawler import NaturalFeatureCrawler


class LakeCrawler(NaturalFeatureCrawler):
    feature_type = "lake"


class RiverCrawler(NaturalFeatureCrawler):
    feature_type = "river"


class WaterfallCrawler(NaturalFeatureCrawler):
    feature_type = "waterfall"


class ForestCrawler(NaturalFeatureCrawler):
    feature_type = "forest"


class WoodCrawler(NaturalFeatureCrawler):
    feature_type = "wood"


class MountainCrawler(NaturalFeatureCrawler):
    feature_type = "mountain"


class HillCrawler(NaturalFeatureCrawler):
    feature_type = "hill"


class PeakCrawler(NaturalFeatureCrawler):
    feature_type = "peak"


class ValleyCrawler(NaturalFeatureCrawler):
    feature_type = "valley"


class CliffCrawler(NaturalFeatureCrawler):
    feature_type = "cliff"


class BeachCrawler(NaturalFeatureCrawler):
    feature_type = "beach"


class CoastlineCrawler(NaturalFeatureCrawler):
    feature_type = "coastline"


class ViewpointCrawler(NaturalFeatureCrawler):
    feature_type = "viewpoint"


class NationalParkCrawler(NaturalFeatureCrawler):
    feature_type = "national_park"


class VillageCrawler(NaturalFeatureCrawler):
    feature_type = "village"


class TownCrawler(NaturalFeatureCrawler):
    feature_type = "town"


class HamletCrawler(NaturalFeatureCrawler):
    feature_type = "hamlet"


class ParkCrawler(NaturalFeatureCrawler):
    feature_type = "park"


class GardenCrawler(NaturalFeatureCrawler):
    feature_type = "garden"


class GrasslandCrawler(NaturalFeatureCrawler):
    feature_type = "grassland"


class MeadowCrawler(NaturalFeatureCrawler):
    feature_type = "meadow"


class FarmlandCrawler(NaturalFeatureCrawler):
    feature_type = "farmland"


class OrchardCrawler(NaturalFeatureCrawler):
    feature_type = "orchard"


class VineyardCrawler(NaturalFeatureCrawler):
    feature_type = "vineyard"


class StreamCrawler(NaturalFeatureCrawler):
    feature_type = "stream"


class ScrubCrawler(NaturalFeatureCrawler):
    feature_type = "scrub"


CRAWLER_BY_TYPE: dict[str, type[NaturalFeatureCrawler]] = {
    "lake": LakeCrawler,
    "river": RiverCrawler,
    "waterfall": WaterfallCrawler,
    "forest": ForestCrawler,
    "wood": WoodCrawler,
    "mountain": MountainCrawler,
    "hill": HillCrawler,
    "peak": PeakCrawler,
    "valley": ValleyCrawler,
    "cliff": CliffCrawler,
    "beach": BeachCrawler,
    "coastline": CoastlineCrawler,
    "viewpoint": ViewpointCrawler,
    "national_park": NationalParkCrawler,
    "village": VillageCrawler,
    "town": TownCrawler,
    "hamlet": HamletCrawler,
    "park": ParkCrawler,
    "garden": GardenCrawler,
    "grassland": GrasslandCrawler,
    "meadow": MeadowCrawler,
    "farmland": FarmlandCrawler,
    "orchard": OrchardCrawler,
    "vineyard": VineyardCrawler,
    "stream": StreamCrawler,
    "scrub": ScrubCrawler,
}


def get_natural_crawler_class(feature_type: str) -> type[NaturalFeatureCrawler]:
    try:
        return CRAWLER_BY_TYPE[feature_type]
    except KeyError as exc:
        raise ValueError(f"No crawler for feature_type={feature_type}") from exc

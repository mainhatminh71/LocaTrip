"""In-memory road graph for corridor A→B routing (no POI waypoints).

Scenic routing hard constraints
-------------------------------
Scenic edges are bonuses only. Routes must keep making forward progress
toward the destination. Forbidden: dead-end spurs, U-turns / return to the
same intersection, sightseeing loops, and branches that do not help reach
the destination. If no valid scenic improvement exists, fall back to the
shortest path.
"""

from __future__ import annotations

import heapq
import math
from collections import deque
from dataclasses import dataclass, field
from typing import Iterable


NodeKey = tuple[float, float]  # (lat, lon) rounded

# Allow tiny remaining-distance noise from snapped geometry (~node grid).
PROGRESS_SLACK_M = 25.0
# Scenic may discount travel cost, but never below this fraction of real length.
MIN_COST_FRACTION = 0.55
# How strongly a scenic corridor can bias cost (bonus only).
DEFAULT_SCENIC_LAMBDA = 12.0


def _snap(lat: float, lon: float, ndigits: int = 4) -> NodeKey:
    # ~11m grid — merges nearly-coincident OSM way endpoints.
    return (round(lat, ndigits), round(lon, ndigits))


@dataclass
class Edge:
    road_id: int
    u: NodeKey
    v: NodeKey
    length_m: float
    scenic: float
    coords: list[list[float]]  # [lon, lat] along u→v


@dataclass
class RoadGraph:
    """Undirected/oneway-aware graph built from crawled LINESTRINGs."""

    adj: dict[NodeKey, list[tuple[NodeKey, Edge]]] = field(default_factory=dict)
    rev_adj: dict[NodeKey, list[tuple[NodeKey, Edge]]] = field(default_factory=dict)
    nodes: list[NodeKey] = field(default_factory=list)
    main_nodes: list[NodeKey] = field(default_factory=list)

    @classmethod
    def from_edges(cls, rows: Iterable[dict], bridge_meters: float = 40.0) -> RoadGraph:
        """Build graph from road rows.

        Each LINESTRING is split into consecutive vertex segments so drawing the
        path cannot show an OSM spur/loop that is only an artifact of a long way.
        """
        graph = cls()
        for row in rows:
            coords = row.get("coordinates") or []
            if len(coords) < 2:
                continue

            scenic = float(row.get("scenic") or 0.0)
            road_id = int(row["id"])
            total_len = float(row["length_m"] or 0.0)
            if total_len <= 0:
                total_len = _path_length_m(coords)
            if total_len <= 0:
                total_len = 1.0

            for i in range(len(coords) - 1):
                c0 = coords[i]
                c1 = coords[i + 1]
                lon0, lat0 = float(c0[0]), float(c0[1])
                lon1, lat1 = float(c1[0]), float(c1[1])
                start = _snap(lat0, lon0)
                end = _snap(lat1, lon1)
                if start == end:
                    continue

                seg_len = _haversine_m(lat0, lon0, lat1, lon1)
                if seg_len < 1.0:
                    continue

                # Distribute road scenic score along its length (avoid dense-vertex bias).
                seg_scenic = scenic * (seg_len / total_len)

                forward_coords = [[start[1], start[0]], [end[1], end[0]]]
                backward_coords = [[end[1], end[0]], [start[1], start[0]]]

                forward = Edge(
                    road_id=road_id,
                    u=start,
                    v=end,
                    length_m=seg_len,
                    scenic=seg_scenic,
                    coords=forward_coords,
                )
                backward = Edge(
                    road_id=road_id,
                    u=end,
                    v=start,
                    length_m=seg_len,
                    scenic=seg_scenic,
                    coords=backward_coords,
                )
                graph._add(forward)
                graph._add(backward)

        graph.nodes = list(graph.adj.keys())
        if bridge_meters > 0:
            graph._bridge_nearby_nodes(bridge_meters)
            graph.nodes = list(graph.adj.keys())
        graph.main_nodes = graph._largest_component_nodes()
        return graph

    def _add(self, edge: Edge) -> None:
        self.adj.setdefault(edge.u, []).append((edge.v, edge))
        self.rev_adj.setdefault(edge.v, []).append((edge.u, edge))

    def _largest_component_nodes(self) -> list[NodeKey]:
        seen: set[NodeKey] = set()
        best: list[NodeKey] = []
        for node in self.nodes:
            if node in seen:
                continue
            q: deque[NodeKey] = deque([node])
            seen.add(node)
            comp = [node]
            while q:
                u = q.popleft()
                for v, _ in self.adj.get(u, []):
                    if v not in seen:
                        seen.add(v)
                        q.append(v)
                        comp.append(v)
            if len(comp) > len(best):
                best = comp
        return best

    def _bridge_nearby_nodes(self, max_m: float) -> None:
        """Connect near-miss OSM endpoints so the local graph is traversable."""
        if not self.adj:
            return
        cell = max(max_m / 111_000.0, 1e-5)
        buckets: dict[tuple[int, int], list[NodeKey]] = {}
        nodes = list(self.adj.keys())
        for node in nodes:
            key = (int(node[0] / cell), int(node[1] / cell))
            buckets.setdefault(key, []).append(node)

        for node in nodes:
            i = int(node[0] / cell)
            j = int(node[1] / cell)
            for di in (-1, 0, 1):
                for dj in (-1, 0, 1):
                    for other in buckets.get((i + di, j + dj), []):
                        if other <= node:
                            continue
                        dist = _haversine_m(node[0], node[1], other[0], other[1])
                        if dist <= 0 or dist > max_m:
                            continue
                        coords = [[node[1], node[0]], [other[1], other[0]]]
                        self._add(
                            Edge(
                                road_id=-1,
                                u=node,
                                v=other,
                                length_m=dist,
                                scenic=0.0,
                                coords=coords,
                            )
                        )
                        self._add(
                            Edge(
                                road_id=-1,
                                u=other,
                                v=node,
                                length_m=dist,
                                scenic=0.0,
                                coords=list(reversed(coords)),
                            )
                        )

    def nearest_node(self, lat: float, lon: float) -> NodeKey | None:
        # Prefer the giant connected component so peaks on dead-end tracks still route.
        pool = self.main_nodes or self.nodes
        if not pool:
            return None
        best = None
        best_d = 1e18
        for node in pool:
            d = _haversine_m(lat, lon, node[0], node[1])
            if d < best_d:
                best_d = d
                best = node
        return best

    def shortest_path(
        self,
        source: NodeKey,
        target: NodeKey,
        *,
        scenic_bias: float = 0.0,
    ) -> tuple[list[Edge], float, float] | None:
        """Plain Dijkstra by length (scenic_bias kept for API compat; unused)."""
        _ = scenic_bias
        return self._dijkstra_length(source, target)

    def distances_to(self, target: NodeKey) -> dict[NodeKey, float]:
        """Shortest-path distance from every node TO target (via reverse edges)."""
        dist: dict[NodeKey, float] = {target: 0.0}
        heap: list[tuple[float, NodeKey]] = [(0.0, target)]
        while heap:
            d_u, u = heapq.heappop(heap)
            if d_u > dist.get(u, 1e18):
                continue
            for pred, edge in self.rev_adj.get(u, []):
                alt = d_u + edge.length_m
                if alt < dist.get(pred, 1e18):
                    dist[pred] = alt
                    heapq.heappush(heap, (alt, pred))
        return dist

    def _dijkstra_length(
        self,
        source: NodeKey,
        target: NodeKey,
    ) -> tuple[list[Edge], float, float] | None:
        if source not in self.adj or target not in self.adj:
            return None
        if source == target:
            return [], 0.0, 0.0

        dist: dict[NodeKey, float] = {source: 0.0}
        prev: dict[NodeKey, tuple[NodeKey, Edge]] = {}
        heap: list[tuple[float, NodeKey]] = [(0.0, source)]

        while heap:
            cost_u, u = heapq.heappop(heap)
            if cost_u > dist.get(u, 1e18):
                continue
            if u == target:
                break
            for v, edge in self.adj.get(u, []):
                alt = cost_u + edge.length_m
                if alt < dist.get(v, 1e18):
                    dist[v] = alt
                    prev[v] = (u, edge)
                    heapq.heappush(heap, (alt, v))

        path = self._reconstruct(prev, source, target)
        if path is None:
            return None
        length_m = sum(e.length_m for e in path)
        scenic = sum(e.scenic for e in path)
        return path, length_m, scenic

    def _reconstruct(
        self,
        prev: dict[NodeKey, tuple[NodeKey, Edge]],
        source: NodeKey,
        target: NodeKey,
    ) -> list[Edge] | None:
        if source == target:
            return []
        if target not in prev:
            return None
        edges: list[Edge] = []
        node = target
        seen: set[NodeKey] = {target}
        while node != source:
            if node not in prev:
                return None
            parent, edge = prev[node]
            if parent in seen:
                return None  # cycle guard
            seen.add(parent)
            edges.append(edge)
            node = parent
        edges.reverse()
        return edges

    def _edge_allowed(
        self,
        u: NodeKey,
        v: NodeKey,
        edge: Edge,
        *,
        traveled_u: float,
        d_t: dict[NodeKey, float],
        length_limit: float,
        target: NodeKey,
    ) -> bool:
        """Hard filters: forward progress, no dead-end, stay within budget."""
        if v not in d_t:
            return False  # unreachable to destination (dead-end / island)

        remain_u = d_t[u]
        remain_v = d_t[v]

        # Must not significantly move away from the destination.
        if remain_v > remain_u + PROGRESS_SLACK_M:
            return False

        # Still able to finish within detour budget after taking this edge.
        if traveled_u + edge.length_m + remain_v > length_limit + 1.0:
            return False

        # Cul-de-sac: only way out is back, and it is not the destination.
        if v != target and self._is_dead_end_node(v, incoming=u):
            return False

        return True

    def _is_dead_end_node(self, node: NodeKey, incoming: NodeKey) -> bool:
        """True when every outgoing neighbor is the node we just came from."""
        nbrs = self.adj.get(node, [])
        if not nbrs:
            return True
        return all(v == incoming for v, _ in nbrs)

    def _scenic_step_cost(self, edge: Edge, *, forward: bool, scenic_lambda: float) -> float:
        """Length is primary; scenic only discounts when the edge advances."""
        if not forward or edge.scenic <= 0 or scenic_lambda <= 0:
            return edge.length_m
        discounted = edge.length_m - scenic_lambda * edge.scenic
        floor = edge.length_m * MIN_COST_FRACTION
        return max(floor, discounted)

    def scenic_path(
        self,
        source: NodeKey,
        target: NodeKey,
        *,
        detour_budget: float = 0.45,
        max_extra_m: float | None = None,
        scenic_lambda: float = DEFAULT_SCENIC_LAMBDA,
    ) -> dict | None:
        """Scenic corridor path with forward-progress hard constraints.

        Length cap is ``fast_len + max_extra_m`` when provided; otherwise the
        legacy ratio ``fast_len * (1 + detour_budget)``.
        Falls back to the shortest path when no valid scenic improvement exists.
        """
        fast = self._dijkstra_length(source, target)
        if fast is None:
            return None
        fast_edges, fast_len, fast_scenic = fast

        d_t = self.distances_to(target)
        if source not in d_t:
            return {
                "edges": fast_edges,
                "length_m": fast_len,
                "scenic_score": fast_scenic,
                "fast_length_m": fast_len,
                "fast_scenic_score": fast_scenic,
                "detour_ratio": 0.0,
                "detour_extra_m": 0.0,
                "scenic_improved": False,
                "geometry": edges_to_geojson(fast_edges),
                "fast_geometry": edges_to_geojson(fast_edges),
            }

        if max_extra_m is not None:
            length_limit = fast_len + max(0.0, float(max_extra_m))
        else:
            length_limit = fast_len * (1.0 + max(0.0, detour_budget))

        # Dijkstra on (scenic-discounted cost), tracking real meters traveled.
        best_cost: dict[NodeKey, float] = {source: 0.0}
        traveled: dict[NodeKey, float] = {source: 0.0}
        prev: dict[NodeKey, tuple[NodeKey, Edge]] = {}
        heap: list[tuple[float, float, NodeKey]] = [(0.0, 0.0, source)]  # cost, meters, node

        while heap:
            cost_u, meters_u, u = heapq.heappop(heap)
            if cost_u > best_cost.get(u, 1e18) + 1e-9:
                continue
            if u == target:
                break

            remain_u = d_t.get(u)
            if remain_u is None:
                continue

            for v, edge in self.adj.get(u, []):
                if not self._edge_allowed(
                    u,
                    v,
                    edge,
                    traveled_u=meters_u,
                    d_t=d_t,
                    length_limit=length_limit,
                    target=target,
                ):
                    continue

                remain_v = d_t[v]
                forward = remain_v < remain_u - 1e-6
                step = self._scenic_step_cost(
                    edge, forward=forward, scenic_lambda=scenic_lambda
                )
                alt_cost = cost_u + step
                alt_meters = meters_u + edge.length_m

                if alt_cost + 1e-9 < best_cost.get(v, 1e18):
                    best_cost[v] = alt_cost
                    traveled[v] = alt_meters
                    prev[v] = (u, edge)
                    heapq.heappush(heap, (alt_cost, alt_meters, v))

        scenic_improved = False
        scenic_edges = self._reconstruct(prev, source, target)
        if scenic_edges is None or not self._validate_forward_path(scenic_edges, d_t, target):
            scenic_edges, scenic_len, scenic_score = fast_edges, fast_len, fast_scenic
        else:
            scenic_len = sum(e.length_m for e in scenic_edges)
            scenic_score = sum(e.scenic for e in scenic_edges)
            if scenic_score > fast_scenic and scenic_len <= length_limit + 1.0:
                scenic_improved = True
            else:
                scenic_edges, scenic_len, scenic_score = fast_edges, fast_len, fast_scenic

        return {
            "edges": scenic_edges,
            "length_m": scenic_len,
            "scenic_score": scenic_score,
            "fast_length_m": fast_len,
            "fast_scenic_score": fast_scenic,
            "detour_ratio": (scenic_len / fast_len - 1.0) if fast_len > 0 else 0.0,
            "detour_extra_m": max(0.0, scenic_len - fast_len),
            "scenic_improved": scenic_improved,
            "geometry": edges_to_geojson(scenic_edges),
            "fast_geometry": edges_to_geojson(fast_edges),
        }

    def _validate_forward_path(
        self,
        edges: list[Edge],
        d_t: dict[NodeKey, float],
        target: NodeKey,
    ) -> bool:
        """Reject cycles, U-turn revisits, and significant retreats."""
        if not edges:
            return True

        nodes: list[NodeKey] = [edges[0].u]
        for edge in edges:
            nodes.append(edge.v)

        if len(nodes) != len(set(nodes)):
            return False  # revisited an intersection → loop / U-turn pattern

        if nodes[-1] != target:
            return False

        for edge in edges:
            if edge.u not in d_t or edge.v not in d_t:
                return False
            if d_t[edge.v] > d_t[edge.u] + PROGRESS_SLACK_M:
                return False
        return True

    def route_with_detour_budget(
        self,
        source: NodeKey,
        target: NodeKey,
        *,
        detour_budget: float = 0.45,
        max_extra_m: float | None = None,
        max_bias: float = 0.35,
    ) -> dict | None:
        """Public entry: progress-constrained scenic route (max_bias unused)."""
        _ = max_bias
        return self.scenic_path(
            source,
            target,
            detour_budget=detour_budget,
            max_extra_m=max_extra_m,
        )


def edges_to_geojson(edges: list[Edge]) -> dict:
    coordinates: list[list[float]] = []
    for edge in edges:
        if not edge.coords:
            continue
        if not coordinates:
            coordinates.extend(edge.coords)
        else:
            coordinates.extend(edge.coords[1:])
    return {"type": "LineString", "coordinates": coordinates}


def _path_length_m(coords: list[list[float]]) -> float:
    total = 0.0
    for i in range(len(coords) - 1):
        lon1, lat1 = coords[i]
        lon2, lat2 = coords[i + 1]
        total += _haversine_m(lat1, lon1, lat2, lon2)
    return total


def _haversine_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    r = 6371000.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlmb = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dlmb / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))

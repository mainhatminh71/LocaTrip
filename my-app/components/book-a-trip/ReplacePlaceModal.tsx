"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  getPlaceById,
  searchPlaces,
  type PlaceSearchHit,
} from "@/lib/api/trips";
import type { AlternativePlaceSuggestion } from "@/lib/trip";
import type { ItineraryStop } from "@/lib/itinerary-map";
import { LtBrandLoader, LtButtonLoading } from "./LtBrandLoader";
import styles from "./book-a-trip.module.css";

type ReplacePlaceModalProps = {
  stop: ItineraryStop;
  onClose: () => void;
  onPick: (alt: AlternativePlaceSuggestion) => void;
};

function toAltFromHit(
  hit: PlaceSearchHit,
  rank: number,
): AlternativePlaceSuggestion {
  return {
    rank,
    score: 0,
    placeId: hit.placeId,
    title: hit.title,
    category: hit.category,
    address: hit.address,
    reviewRating: hit.reviewRating,
    latitude: hit.latitude,
    longitude: hit.longitude,
    tags: hit.tags,
    distanceKm: 0,
    tradeOffMessage: "Kết quả tìm kiếm của bạn",
  };
}

function hasCoords(p: {
  latitude?: number | null;
  longitude?: number | null;
}): boolean {
  return (
    p.latitude != null &&
    p.longitude != null &&
    Number.isFinite(Number(p.latitude)) &&
    Number.isFinite(Number(p.longitude))
  );
}

export function ReplacePlaceModal({
  stop,
  onClose,
  onPick,
}: ReplacePlaceModalProps) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<PlaceSearchHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [pickingKey, setPickingKey] = useState<string | null>(null);

  const alternatives = stop.alternatives ?? [];

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setHits([]);
      setSearchError(null);
      setSearching(false);
      return;
    }

    let cancelled = false;
    const t = window.setTimeout(async () => {
      setSearching(true);
      setSearchError(null);
      try {
        const places = await searchPlaces(q, 12);
        if (!cancelled) setHits(places);
      } catch (err) {
        if (!cancelled) {
          setHits([]);
          setSearchError(
            err instanceof Error ? err.message : "Không tìm được địa điểm",
          );
        }
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 320);

    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [query]);

  const excludeIds = useMemo(() => {
    const ids = new Set<string>();
    if (stop.place.placeId) ids.add(stop.place.placeId);
    return ids;
  }, [stop.place.placeId]);

  const filteredHits = hits.filter(
    (h) => !h.placeId || !excludeIds.has(h.placeId),
  );

  async function resolveAndPick(
    raw: AlternativePlaceSuggestion,
    key: string,
  ) {
    setPickingKey(key);
    try {
      let alt = { ...raw };
      if (!hasCoords(alt) && alt.placeId) {
        try {
          const enriched = await getPlaceById(alt.placeId);
          if (enriched && hasCoords(enriched)) {
            alt = {
              ...alt,
              latitude: Number(enriched.latitude),
              longitude: Number(enriched.longitude),
              tags: enriched.tags ?? alt.tags,
              address: enriched.address ?? alt.address,
              category: enriched.category ?? alt.category,
              reviewRating: enriched.reviewRating ?? alt.reviewRating,
            };
          }
        } catch {
          // fall through — applyReplace uses stop coords as fallback
        }
      }
      if (hasCoords(alt)) {
        alt.latitude = Number(alt.latitude);
        alt.longitude = Number(alt.longitude);
      }
      onPick(alt);
    } finally {
      setPickingKey(null);
    }
  }

  return (
    <motion.div
      className={styles.replaceOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="replace-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.replaceSheet}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.detailCardHead}>
          <p className={styles.detailEyebrow}>Thay thế địa điểm</p>
          <button
            type="button"
            className={styles.detailClose}
            aria-label="Đóng"
            onClick={onClose}
          >
            <svg viewBox="0 0 14 14" aria-hidden="true">
              <path
                d="M3 3l8 8M11 3L3 11"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <h3 id="replace-title">{stop.place.title}</h3>
        <p className={styles.replaceHint}>
          Thời gian giữ theo lịch gốc; tạo lại để tính lại lộ trình.
        </p>

        <label className={styles.replaceSearch}>
          <span className={styles.replaceSearchLabel}>Tìm địa điểm</span>
          <input
            type="search"
            className={styles.replaceSearchInput}
            placeholder="Nhập tên quán, điểm đến…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </label>

        {searching ? (
          <div className={styles.replaceSearchStatus}>
            <LtBrandLoader size="sm" tone="onLight" label="Đang tìm…" />
          </div>
        ) : null}
        {searchError ? <p className={styles.error}>{searchError}</p> : null}

        {query.trim().length >= 2 ? (
          <div className={styles.replaceSection}>
            <p className={styles.replaceSectionTitle}>Kết quả tìm kiếm</p>
            {filteredHits.length === 0 && !searching ? (
              <p className={styles.autoHint}>Không thấy địa điểm phù hợp.</p>
            ) : (
              <ul className={styles.replaceList}>
                {filteredHits.map((hit, idx) => {
                  const key = `search-${hit.placeId ?? hit.title}-${idx}`;
                  const busy = pickingKey === key;
                  return (
                    <li key={key}>
                      <button
                        type="button"
                        className={styles.replaceItem}
                        disabled={!!pickingKey}
                        onClick={() =>
                          void resolveAndPick(toAltFromHit(hit, idx + 1), key)
                        }
                      >
                        {busy ? (
                          <LtButtonLoading label="Đang chọn…" onDark={false} />
                        ) : (
                          <>
                            <strong>{hit.title}</strong>
                            <span>
                              {hit.address || hit.category || "—"}
                              {hit.reviewRating != null
                                ? ` · ${hit.reviewRating.toFixed(1)}★`
                                : ""}
                              {!hasCoords(hit) ? " · sẽ lấy toạ độ khi chọn" : ""}
                            </span>
                          </>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ) : null}

        <div className={styles.replaceSection}>
          <p className={styles.replaceSectionTitle}>Gợi ý gần đây</p>
          {alternatives.length === 0 ? (
            <p className={styles.autoHint}>
              Chưa có gợi ý — dùng ô tìm kiếm phía trên.
            </p>
          ) : (
            <ul className={styles.replaceList}>
              {alternatives.map((alt) => {
                const key = `alt-${alt.placeId ?? alt.title}-${alt.rank}`;
                const busy = pickingKey === key;
                const missing = !hasCoords(alt);
                return (
                  <li key={key}>
                    <button
                      type="button"
                      className={styles.replaceItem}
                      disabled={!!pickingKey}
                      onClick={() => void resolveAndPick(alt, key)}
                    >
                      {busy ? (
                        <LtButtonLoading label="Đang chọn…" onDark={false} />
                      ) : (
                        <>
                          <strong>
                            #{alt.rank} {alt.title}
                          </strong>
                          <span>
                            {alt.distanceKm.toFixed(1)} km
                            {alt.savedKm != null
                              ? ` · gần hơn ${alt.savedKm} km`
                              : ""}
                            {alt.reviewRating != null
                              ? ` · ${alt.reviewRating.toFixed(1)}★`
                              : ""}
                          </span>
                          <em>{alt.tradeOffMessage}</em>
                          {missing ? (
                            <em>
                              Thiếu toạ độ trong gợi ý — sẽ bổ sung khi chọn
                            </em>
                          ) : null}
                        </>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <button
          type="button"
          className={styles.btnGhost}
          onClick={onClose}
          disabled={!!pickingKey}
        >
          Đóng
        </button>
      </motion.div>
    </motion.div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  getPlaceAlternatives,
  getPlaceById,
  localizeTripApiError,
  searchPlaces,
  suggestReplaceForTrip,
  type PlaceAlternative,
  type PlaceSearchHit,
} from "@/lib/api/trips";
import type { AlternativePlaceSuggestion } from "@/lib/trip";
import type { ItineraryStop } from "@/lib/itinerary-map";
import { LtBrandLoader, LtButtonLoading } from "./LtBrandLoader";
import { PlaceThumb } from "./PlaceThumb";
import styles from "./book-a-trip.module.css";

type ReplacePlaceModalProps = {
  stop: ItineraryStop;
  /** When set, load suggest-replace / alternatives and expect server replace via onPickServer. */
  tripId?: string | null;
  dayIndex: number;
  onClose: () => void;
  /** Local replace (no tripId yet). */
  onPick: (alt: AlternativePlaceSuggestion) => void;
  /** Saved trip: persist via replace-place then update UI. */
  onPickServer?: (newPlaceId: string) => Promise<void>;
};

function toAltFromHit(
  hit: PlaceSearchHit | PlaceAlternative,
  rank: number,
): AlternativePlaceSuggestion {
  const distanceKm =
    "distanceKm" in hit && hit.distanceKm != null ? hit.distanceKm : 0;
  const score = "score" in hit && hit.score != null ? hit.score : 0;
  return {
    rank,
    score,
    placeId: hit.placeId,
    title: hit.title,
    category: hit.category,
    address: hit.address,
    reviewRating: hit.reviewRating,
    latitude: hit.latitude,
    longitude: hit.longitude,
    tags: hit.tags,
    distanceKm,
    tradeOffMessage:
      distanceKm > 0
        ? `Cách ~${distanceKm.toFixed(1)} km`
        : "Kết quả tìm kiếm của bạn",
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

function AltRowContent({
  title,
  subtitle,
  thumb,
  note,
}: {
  title: string;
  subtitle: string;
  thumb?: string;
  note?: string;
}) {
  return (
    <span className={styles.replaceItemInner}>
      <PlaceThumb src={thumb} variant="tile" className={styles.replaceThumb} />
      <span className={styles.replaceItemText}>
        <strong>{title}</strong>
        <span>{subtitle}</span>
        {note ? <em>{note}</em> : null}
      </span>
    </span>
  );
}

export function ReplacePlaceModal({
  stop,
  tripId,
  dayIndex,
  onClose,
  onPick,
  onPickServer,
}: ReplacePlaceModalProps) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<PlaceSearchHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [pickingKey, setPickingKey] = useState<string | null>(null);
  const [serverAlts, setServerAlts] = useState<PlaceAlternative[]>([]);
  const [altsLoading, setAltsLoading] = useState(false);
  const [altsError, setAltsError] = useState<string | null>(null);

  const localAlternatives = stop.alternatives ?? [];
  const useServer = Boolean(tripId);

  useEffect(() => {
    if (!useServer || !tripId) {
      setServerAlts([]);
      setAltsError(null);
      setAltsLoading(false);
      return;
    }
    if (dayIndex < 0) {
      setAltsError("Không xác định được ngày trong lịch trình.");
      return;
    }

    let cancelled = false;
    setAltsLoading(true);
    setAltsError(null);
    void (async () => {
      try {
        let alts = await suggestReplaceForTrip(tripId, {
          dayIndex,
          scheduleIndex: stop.scheduleIndex,
          limit: 10,
        });
        if ((!alts.length || cancelled) && stop.place.placeId) {
          alts = await getPlaceAlternatives(stop.place.placeId, {
            limit: 10,
          });
        }
        if (!cancelled) setServerAlts(alts);
      } catch (err) {
        if (cancelled) return;
        const raw =
          err instanceof Error ? err.message : "Không tải được gợi ý thay thế";
        const msg = localizeTripApiError(raw);
        const isDoneBlocked =
          /hoàn thành|done trip/i.test(raw) || /hoàn thành/i.test(msg);
        // Do not fall back to nearby search when the trip itself is Done —
        // that looks editable then fails on pick with a confusing API error.
        if (!isDoneBlocked && stop.place.placeId) {
          try {
            const alts = await getPlaceAlternatives(stop.place.placeId, {
              limit: 10,
            });
            if (!cancelled) {
              setServerAlts(alts);
              setAltsError(null);
              return;
            }
          } catch {
            /* use error below */
          }
        }
        if (!cancelled) {
          setServerAlts([]);
          setAltsError(msg);
        }
      } finally {
        if (!cancelled) setAltsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [useServer, tripId, dayIndex, stop.scheduleIndex, stop.place.placeId]);

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
      if (useServer && onPickServer) {
        if (!raw.placeId) {
          setSearchError("Địa điểm thiếu mã — không thay được trên máy chủ.");
          return;
        }
        await onPickServer(raw.placeId);
        return;
      }

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
          // fall through
        }
      }
      if (hasCoords(alt)) {
        alt.latitude = Number(alt.latitude);
        alt.longitude = Number(alt.longitude);
      }
      onPick(alt);
    } catch (err) {
      setSearchError(
        localizeTripApiError(
          err instanceof Error ? err.message : "Không thay được điểm dừng",
        ),
      );
    } finally {
      setPickingKey(null);
    }
  }

  const suggestionRows: AlternativePlaceSuggestion[] = useServer
    ? serverAlts
        .filter((a) => a.placeId && !excludeIds.has(a.placeId))
        .map((a, i) => toAltFromHit(a, i + 1))
    : localAlternatives;

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
          {useServer
            ? "Gợi ý theo ngữ cảnh lịch trình đã lưu — chọn để cập nhật chuyến."
            : "Thời gian giữ theo lịch gốc; tạo lại để tính lại lộ trình."}
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
                          <AltRowContent
                            title={hit.title}
                            subtitle={[
                              hit.address || hit.category || "—",
                              hit.reviewRating != null
                                ? `${hit.reviewRating.toFixed(1)}★`
                                : null,
                              !hasCoords(hit) && !useServer
                                ? "sẽ lấy toạ độ khi chọn"
                                : null,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                            thumb={hit.thumbnail}
                          />
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
          {altsLoading ? (
            <div className={styles.replaceSearchStatus}>
              <LtBrandLoader size="sm" tone="onLight" label="Đang tải gợi ý…" />
            </div>
          ) : null}
          {altsError ? <p className={styles.error}>{altsError}</p> : null}
          {!altsLoading && suggestionRows.length === 0 ? (
            <p className={styles.autoHint}>
              Chưa có gợi ý — dùng ô tìm kiếm phía trên.
            </p>
          ) : (
            <ul className={styles.replaceList}>
              {suggestionRows.map((alt) => {
                const key = `alt-${alt.placeId ?? alt.title}-${alt.rank}`;
                const busy = pickingKey === key;
                const serverHit = serverAlts.find(
                  (a) => a.placeId === alt.placeId,
                );
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
                        <AltRowContent
                          title={`#${alt.rank} ${alt.title}`}
                          subtitle={[
                            `${(alt.distanceKm ?? 0).toFixed(1)} km`,
                            alt.savedKm != null
                              ? `gần hơn ${alt.savedKm} km`
                              : null,
                            alt.reviewRating != null
                              ? `${alt.reviewRating.toFixed(1)}★`
                              : null,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                          thumb={serverHit?.thumbnail}
                          note={alt.tradeOffMessage}
                        />
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

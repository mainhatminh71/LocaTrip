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
import { COSTS, withXuCost } from "@/lib/api/wallet";
import {
  handleInsufficientXu,
  requestWalletRefresh,
} from "@/lib/wallet/xu";
import type { AlternativePlaceSuggestion } from "@/lib/trip";
import type { ItineraryStop } from "@/lib/itinerary-map";
import {
  getSuggestReplaceCache,
  setSuggestReplaceCache,
  suggestReplaceCacheKey,
} from "@/lib/suggest-replace-cache";
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
  const [pendingPick, setPendingPick] = useState<{
    alt: AlternativePlaceSuggestion;
    key: string;
  } | null>(null);
  const [serverAlts, setServerAlts] = useState<PlaceAlternative[]>([]);
  const [altsLoading, setAltsLoading] = useState(false);
  const [altsError, setAltsError] = useState<string | null>(null);
  const [altsRequested, setAltsRequested] = useState(false);
  const [suggestFromCache, setSuggestFromCache] = useState(false);

  const localAlternatives = stop.alternatives ?? [];
  const useServer = Boolean(tripId);

  const suggestCacheKey =
    tripId && dayIndex >= 0
      ? suggestReplaceCacheKey({
          tripId,
          dayIndex,
          scheduleIndex: stop.scheduleIndex,
          placeId: stop.place.placeId,
        })
      : `local:${stop.key}`;

  useEffect(() => {
    setAltsError(null);
    setAltsLoading(false);
    setQuery("");
    setHits([]);
    setPendingPick(null);
    setPickingKey(null);

    if (tripId && dayIndex >= 0) {
      const hit = getSuggestReplaceCache(suggestCacheKey);
      if (hit?.serverAlts?.length || hit?.rows?.length) {
        setServerAlts(
          hit.serverAlts.length
            ? hit.serverAlts
            : hit.rows.map((r) => ({
                placeId: r.placeId || "",
                title: r.title,
                category: r.category,
                address: r.address,
                reviewRating: r.reviewRating,
                latitude: r.latitude,
                longitude: r.longitude,
                tags: r.tags,
                distanceKm: r.distanceKm,
                score: r.score,
              })),
        );
        setAltsRequested(true);
        setSuggestFromCache(hit.fromCache !== false);
        return;
      }
    }

    setServerAlts([]);
    setAltsRequested(false);
    setSuggestFromCache(false);
  }, [suggestCacheKey, tripId, dayIndex]);

  async function loadServerAlternatives() {
    if (!useServer || !tripId || altsLoading) return;
    if (dayIndex < 0) {
      setAltsError("Không xác định được ngày trong lịch trình.");
      setAltsRequested(true);
      return;
    }

    const cacheKey = suggestCacheKey;
    const cached = getSuggestReplaceCache(cacheKey);
    if (cached?.serverAlts?.length || cached?.rows?.length) {
      setServerAlts(
        cached.serverAlts.length
          ? cached.serverAlts
          : cached.rows.map((r) => ({
              placeId: r.placeId || "",
              title: r.title,
              category: r.category,
              address: r.address,
              reviewRating: r.reviewRating,
              latitude: r.latitude,
              longitude: r.longitude,
              tags: r.tags,
              distanceKm: r.distanceKm,
              score: r.score,
            })),
      );
      setAltsRequested(true);
      setSuggestFromCache(cached.fromCache !== false);
      setAltsError(null);
      setAltsLoading(false);
      return;
    }

    setAltsRequested(true);
    setAltsLoading(true);
    setAltsError(null);
    try {
      // BE fromCache skips debit; 402 only on first paid miss — no FE balance pre-check.
      const result = await suggestReplaceForTrip(tripId, {
        dayIndex,
        scheduleIndex: stop.scheduleIndex,
        limit: 10,
      });
      let alts = result.alternatives;
      setSuggestFromCache(result.fromCache);
      if (result.charged > 0) requestWalletRefresh();
      if (!alts.length && stop.place.placeId) {
        alts = await getPlaceAlternatives(stop.place.placeId, {
          limit: 10,
        });
      }
      setServerAlts(alts);
      if (alts.length) {
        setSuggestReplaceCache(cacheKey, {
          serverAlts: alts,
          rows: alts.map((a, i) => toAltFromHit(a, i + 1)),
          fromCache: result.fromCache || result.charged > 0,
        });
      }
    } catch (err) {
      if (handleInsufficientXu(err)) {
        setServerAlts([]);
        setSuggestFromCache(false);
        setAltsError("Không đủ xu để tìm địa điểm thay thế.");
        return;
      }
      const raw =
        err instanceof Error ? err.message : "Không tải được gợi ý thay thế";
      const msg = localizeTripApiError(raw);
      if (stop.place.placeId) {
        try {
          const alts = await getPlaceAlternatives(stop.place.placeId, {
            limit: 10,
          });
          setServerAlts(alts);
          setAltsError(null);
          if (alts.length) {
            setSuggestReplaceCache(cacheKey, {
              serverAlts: alts,
              rows: alts.map((a, i) => toAltFromHit(a, i + 1)),
              fromCache: false,
            });
          }
          return;
        } catch {
          /* use error below */
        }
      }
      setServerAlts([]);
      setAltsError(msg);
    } finally {
      setAltsLoading(false);
    }
  }

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

  function requestPick(raw: AlternativePlaceSuggestion, key: string) {
    if (pickingKey) return;
    setPendingPick({ alt: raw, key });
  }

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

  async function confirmPendingPick() {
    if (!pendingPick || pickingKey) return;
    const { alt, key } = pendingPick;
    setPendingPick(null);
    await resolveAndPick(alt, key);
  }

  const suggestionRows: AlternativePlaceSuggestion[] = !altsRequested
    ? []
    : useServer
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
      onClick={() => {
        if (pendingPick) {
          setPendingPick(null);
          return;
        }
        onClose();
      }}
    >
      <motion.div
        className={`${styles.replaceSheet} ${styles.replaceSheetSplit}`}
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

        <div className={styles.placeDetailBody}>
          <section
            className={styles.placeDetailHalf}
            aria-label="Địa điểm hiện tại"
          >
            <p className={styles.placeHalfLabel}>Địa điểm hiện tại</p>
            <div className={styles.replaceHalfScroll}>
              <h3 id="replace-title">{stop.place.title}</h3>
              {stop.place.address ? (
                <p className={styles.detailAddr}>{stop.place.address}</p>
              ) : null}
              <div className={styles.detailMeta}>
                {stop.place.reviewRating != null ? (
                  <span>{stop.place.reviewRating.toFixed(1)}★</span>
                ) : null}
                {stop.place.category ? (
                  <span>{stop.place.category}</span>
                ) : null}
                <span>
                  Điểm {stop.order} · {stop.time}
                </span>
              </div>
              <p className={styles.replaceHint}>
                {useServer
                  ? "Tìm gợi ý theo ngữ cảnh lịch trình đã lưu, hoặc tìm thủ công bên dưới."
                  : "Thời gian giữ theo lịch gốc; tạo lại để tính lại lộ trình."}
              </p>
              <label className={styles.replaceSearch}>
                <span className={styles.replaceSearchLabel}>
                  Tìm kiếm thủ công
                </span>
                <input
                  type="search"
                  className={styles.replaceSearchInput}
                  placeholder="Nhập tên quán, điểm đến…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              {searching ? (
                <div className={styles.replaceSearchStatus}>
                  <LtBrandLoader size="sm" tone="onLight" label="Đang tìm…" />
                </div>
              ) : null}
              {searchError ? (
                <p className={styles.error}>{searchError}</p>
              ) : null}
              {query.trim().length >= 2 ? (
                <div className={styles.replaceSection}>
                  <p className={styles.replaceSectionTitle}>Kết quả tìm kiếm</p>
                  {filteredHits.length === 0 && !searching ? (
                    <p className={styles.autoHint}>
                      Không thấy địa điểm phù hợp.
                    </p>
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
                                requestPick(toAltFromHit(hit, idx + 1), key)
                              }
                            >
                              {busy ? (
                                <LtButtonLoading
                                  label="Đang chọn…"
                                  onDark={false}
                                />
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
            </div>
          </section>

          <section
            className={`${styles.placeDetailHalf} ${styles.placeDetailHalfAlts}`}
            aria-label="Địa điểm thay thế"
          >
            <p className={styles.placeHalfLabel}>Địa điểm thay thế</p>
            <div className={styles.placeAltPane}>
              {!altsRequested ? (
                <div className={styles.placeAltIdle}>
                  <p className={styles.autoHint}>
                    {useServer
                      ? suggestFromCache
                        ? "Đã trả xu cho điểm này — xem lại gợi ý miễn phí."
                        : `Bấm để tìm gợi ý theo lịch trình (−${COSTS.tripSuggest} xu).`
                      : "Bấm để hiện các gợi ý gần đây (nếu có)."}
                  </p>
                  <button
                    type="button"
                    className={styles.btnPrimary}
                    disabled={altsLoading || !!pickingKey}
                    onClick={() => {
                      if (useServer) {
                        void loadServerAlternatives();
                      } else {
                        setAltsRequested(true);
                      }
                    }}
                  >
                    {useServer
                      ? suggestFromCache
                        ? "Đã trả — xem lại"
                        : withXuCost(
                            "Tìm địa điểm thay thế",
                            COSTS.tripSuggest,
                          )
                      : "Hiện gợi ý thay thế"}
                  </button>
                </div>
              ) : null}

              {altsRequested && altsLoading ? (
                <div className={styles.replaceSearchStatus}>
                  <LtBrandLoader
                    size="sm"
                    tone="onLight"
                    label="Đang tìm gợi ý…"
                  />
                </div>
              ) : null}
              {altsRequested && altsError ? (
                <div className={styles.placeAltIdle}>
                  <p className={styles.error}>{altsError}</p>
                  <button
                    type="button"
                    className={styles.btnGhost}
                    disabled={altsLoading}
                    onClick={() => void loadServerAlternatives()}
                  >
                    Thử lại
                  </button>
                </div>
              ) : null}
              {altsRequested &&
              !altsLoading &&
              !altsError &&
              suggestionRows.length === 0 ? (
                <p className={styles.autoHint}>
                  Chưa có gợi ý — dùng ô tìm kiếm thủ công phía trên.
                </p>
              ) : null}
              {altsRequested && suggestionRows.length > 0 ? (
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
                          onClick={() => requestPick(alt, key)}
                        >
                          {busy ? (
                            <LtButtonLoading
                              label="Đang chọn…"
                              onDark={false}
                            />
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
              ) : null}
            </div>
          </section>
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

      {pendingPick ? (
        <div
          className={styles.pickConfirmOverlay}
          role="presentation"
          onClick={(e) => {
            e.stopPropagation();
            if (!pickingKey) setPendingPick(null);
          }}
        >
          <div
            className={styles.pickConfirmCard}
            role="dialog"
            aria-modal="true"
            aria-labelledby="replace-pick-confirm-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="replace-pick-confirm-title">Thay thế địa điểm?</h3>
            <p>
              Bạn muốn chọn “{pendingPick.alt.title}” thay cho “
              {stop.place.title}”?
            </p>
            <div className={styles.pickConfirmActions}>
              <button
                type="button"
                className={styles.btnGhost}
                disabled={!!pickingKey}
                onClick={() => setPendingPick(null)}
              >
                Hủy
              </button>
              <button
                type="button"
                className={styles.btnPrimary}
                disabled={!!pickingKey}
                onClick={() => void confirmPendingPick()}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </motion.div>
  );
}

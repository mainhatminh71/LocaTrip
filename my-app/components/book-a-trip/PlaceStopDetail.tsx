"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  getPlaceAlternatives,
  getPlaceById,
  localizeTripApiError,
  searchPlaces,
  suggestReplaceForTrip,
  type PlaceAlternative,
  type PlaceDetail,
  type PlaceSearchHit,
} from "@/lib/api/trips";
import { COSTS, withXuCost } from "@/lib/api/wallet";
import {
  handleInsufficientXu,
  requestWalletRefresh,
} from "@/lib/wallet/xu";
import { tagChips } from "@/lib/itinerary-map";
import type { ItineraryStop } from "@/lib/itinerary-map";
import type { AlternativePlaceSuggestion } from "@/lib/trip";
import {
  getCachedPlaceDetail,
  setCachedPlaceDetail,
} from "@/lib/place-detail-cache";
import {
  getSuggestReplaceCache,
  setSuggestReplaceCache,
  suggestReplaceCacheKey,
} from "@/lib/suggest-replace-cache";
import { LtBrandLoader, LtButtonLoading } from "./LtBrandLoader";
import { PlaceThumb } from "./PlaceThumb";
import styles from "./book-a-trip.module.css";

function summarizeOpenHours(openHours: unknown): string | null {
  if (!openHours) return null;
  if (typeof openHours === "string") return openHours.slice(0, 220);
  if (Array.isArray(openHours)) {
    return openHours
      .map((x) => (typeof x === "string" ? x : null))
      .filter(Boolean)
      .slice(0, 7)
      .join(" · ");
  }
  if (typeof openHours === "object") {
    const entries = Object.entries(openHours as Record<string, unknown>)
      .map(([day, val]) => {
        if (val == null) return null;
        const text =
          typeof val === "string"
            ? val
            : Array.isArray(val)
              ? val.join(", ")
              : typeof val === "object" && val !== null && "text" in val
                ? String((val as { text?: string }).text || "")
                : JSON.stringify(val);
        return text ? `${day}: ${text}` : null;
      })
      .filter(Boolean)
      .slice(0, 7);
    return entries.length ? entries.join(" · ") : null;
  }
  return null;
}

function priceLabel(detail: PlaceDetail): string | null {
  const lo = detail.priceRangeLow;
  const hi = detail.priceRangeMax;
  if (lo == null && hi == null) return null;
  if (lo != null && hi != null) {
    return `${lo.toLocaleString("vi-VN")}–${hi.toLocaleString("vi-VN")}đ`;
  }
  if (lo != null) return `từ ${lo.toLocaleString("vi-VN")}đ`;
  return `đến ${Number(hi).toLocaleString("vi-VN")}đ`;
}

function busySummary(detail: PlaceDetail): string | null {
  const b = detail.busyProfile;
  if (!b) return null;
  const parts = [
    b.liveliness ? `Không khí: ${b.liveliness}` : null,
    b.peakHours?.length
      ? `Giờ đông: ${b.peakHours.slice(0, 4).join(", ")}`
      : null,
    b.peakDays?.length
      ? `Ngày đông: ${b.peakDays.slice(0, 4).join(", ")}`
      : null,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : null;
}

function hostLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Website";
  }
}

function PlaceInfoBody({
  thumbKey,
  thumbSrc,
  title,
  address,
  rating,
  reviewCount,
  category,
  price,
  duration,
  area,
  phone,
  website,
  menuLink,
  email,
  hours,
  busy,
  tags,
  reviews,
  loading,
  showContactEmpty,
}: {
  thumbKey: string;
  thumbSrc: string | null;
  title: string;
  address?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  category?: string | null;
  price?: string | null;
  duration?: string | null;
  area?: string | null;
  phone?: string;
  website?: string;
  menuLink?: string;
  email?: string;
  hours?: string | null;
  busy?: string | null;
  tags: string[];
  reviews: { name?: string; rating?: number; text?: string }[];
  loading?: boolean;
  showContactEmpty?: boolean;
}) {
  return (
    <>
      {loading ? (
        <div className={styles.placeDetailLoading}>
          <LtBrandLoader
            size="sm"
            tone="onLight"
            label="Đang tải địa điểm…"
          />
        </div>
      ) : null}

      <PlaceThumb
        key={thumbKey}
        src={thumbSrc}
        variant="detail"
        alt={title || ""}
      />

      <h3>{title}</h3>
      {address ? <p className={styles.detailAddr}>{address}</p> : null}

      <div className={styles.detailMeta}>
        {rating != null ? (
          <span>
            {rating.toFixed(1)}★
            {reviewCount != null ? ` (${reviewCount})` : ""}
          </span>
        ) : null}
        {category ? <span>{category}</span> : null}
        {price ? <span>{price}</span> : null}
        {duration ? <span>{duration}</span> : null}
        {area ? <span>{area}</span> : null}
      </div>

      {(phone || website || menuLink || email) && !loading ? (
        <ul className={styles.placeDetailLinks}>
          {phone ? (
            <li>
              <span className={styles.placeDetailLinkLabel}>Điện thoại</span>
              <a href={`tel:${phone}`}>{phone}</a>
            </li>
          ) : null}
          {website ? (
            <li>
              <span className={styles.placeDetailLinkLabel}>Website</span>
              <a href={website} target="_blank" rel="noreferrer">
                {hostLabel(website)}
              </a>
            </li>
          ) : null}
          {menuLink ? (
            <li>
              <span className={styles.placeDetailLinkLabel}>Thực đơn</span>
              <a href={menuLink} target="_blank" rel="noreferrer">
                Xem menu
              </a>
            </li>
          ) : null}
          {email ? (
            <li>
              <span className={styles.placeDetailLinkLabel}>Email</span>
              <a href={`mailto:${email}`}>{email}</a>
            </li>
          ) : null}
        </ul>
      ) : showContactEmpty ? (
        <p className={styles.placeDetailMuted}>
          Chưa có số điện thoại / website trong dữ liệu địa điểm.
        </p>
      ) : null}

      {hours ? (
        <p className={styles.placeDetailLine}>
          <strong>Giờ mở cửa</strong>
          <span>{hours}</span>
        </p>
      ) : null}
      {busy ? (
        <p className={styles.placeDetailLine}>
          <strong>Đông khách</strong>
          <span>{busy}</span>
        </p>
      ) : null}

      {tags.length > 0 ? (
        <div className={styles.tagChipRow}>
          {tags.map((t) => (
            <span key={t} className={styles.tagChip}>
              {t}
            </span>
          ))}
        </div>
      ) : null}

      {reviews.length > 0 ? (
        <div className={styles.placeReviewBlock}>
          <p className={styles.placeReviewTitle}>Đánh giá gần đây</p>
          <ul className={styles.placeReviewList}>
            {reviews.map((r, i) => (
              <li key={`${r.name || "r"}-${i}`}>
                <strong>
                  {r.name || "Khách"}
                  {r.rating != null ? ` · ${r.rating}★` : ""}
                </strong>
                {r.text ? <span>{r.text.slice(0, 180)}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}

function toAlt(
  hit: PlaceAlternative | AlternativePlaceSuggestion | PlaceSearchHit,
  rank: number,
): AlternativePlaceSuggestion {
  return {
    rank,
    score: "score" in hit && hit.score != null ? hit.score : 0,
    placeId: hit.placeId,
    title: hit.title,
    category: hit.category,
    address: hit.address,
    reviewRating: hit.reviewRating,
    latitude: hit.latitude,
    longitude: hit.longitude,
    tags: hit.tags,
    distanceKm:
      "distanceKm" in hit && hit.distanceKm != null ? hit.distanceKm : 0,
    tradeOffMessage:
      "tradeOffMessage" in hit && hit.tradeOffMessage
        ? hit.tradeOffMessage
        : hit.distanceKm != null
          ? `Cách ~${Number(hit.distanceKm).toFixed(1)} km`
          : "Gợi ý thay thế",
  };
}

type PlaceStopDetailProps = {
  stop: ItineraryStop;
  onClose: () => void;
  /** Saved trip id — use suggest-replace / replace-place. */
  tripId?: string | null;
  dayIndex: number;
  readOnly?: boolean;
  replaceBlockedLabel?: string;
  /** From GET trip `paidSuggestSlots` — survives browser reload. */
  suggestAlreadyPaid?: boolean;
  /** Notify parent after a paid or cached suggest so slots survive navigation. */
  onSuggestPaid?: (slot: {
    dayIndex: number;
    scheduleIndex: number;
    placeId: string;
  }) => void;
  onPickLocal: (alt: AlternativePlaceSuggestion) => void;
  onPickServer?: (newPlaceId: string) => Promise<void>;
};

export function PlaceStopDetail({
  stop,
  onClose,
  tripId,
  dayIndex,
  readOnly,
  replaceBlockedLabel,
  suggestAlreadyPaid = false,
  onSuggestPaid,
  onPickLocal,
  onPickServer,
}: PlaceStopDetailProps) {
  const placeId = stop.place.placeId?.trim() || "";
  const [detail, setDetail] = useState<PlaceDetail | null>(() =>
    placeId ? getCachedPlaceDetail(placeId) : null,
  );
  const [loading, setLoading] = useState(() =>
    Boolean(placeId && !getCachedPlaceDetail(placeId)),
  );
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [alts, setAlts] = useState<AlternativePlaceSuggestion[]>([]);
  const [altsLoading, setAltsLoading] = useState(false);
  const [altsError, setAltsError] = useState<string | null>(null);
  const [altsRequested, setAltsRequested] = useState(false);
  /** BE `fromCache` / paidSuggestSlots / local paid cache. */
  const [suggestFromCache, setSuggestFromCache] = useState(suggestAlreadyPaid);
  const [pickingKey, setPickingKey] = useState<string | null>(null);
  const [candidate, setCandidate] = useState<{
    alt: AlternativePlaceSuggestion;
    key: string;
    detail: PlaceDetail | null;
    loading: boolean;
    error: string | null;
  } | null>(null);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<PlaceSearchHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (candidate) {
        setCandidate(null);
        return;
      }
      onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, candidate]);

  useEffect(() => {
    if (!placeId) {
      setDetail(null);
      setLoading(false);
      setError(null);
      return;
    }

    const cached = getCachedPlaceDetail(placeId);
    if (cached) {
      setDetail(cached);
      setLoading(false);
      setError(null);
    } else {
      setLoading(true);
      setError(null);
    }

    let cancelled = false;
    void (async () => {
      try {
        const place = await getPlaceById(placeId);
        if (cancelled) return;
        if (!place) {
          if (!cached) {
            setDetail(null);
            setError("Không tìm thấy địa điểm.");
          }
        } else {
          setCachedPlaceDetail(placeId, place);
          setDetail(place);
          setError(null);
        }
      } catch (err) {
        if (cancelled) return;
        // Keep cached detail (incl. thumbnail) if refresh fails.
        if (!cached) {
          setDetail(null);
          setError(
            err instanceof Error ? err.message : "Không tải được địa điểm",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [placeId]);

  const suggestCacheKey =
    tripId && dayIndex >= 0
      ? suggestReplaceCacheKey({
          tripId,
          dayIndex,
          scheduleIndex: stop.scheduleIndex,
          placeId: placeId || stop.place.placeId,
        })
      : `local:${stop.key}`;

  useEffect(() => {
    setPickingKey(null);
    setCandidate(null);
    setAltsError(null);
    setAltsLoading(false);

    // Re-open same stop after a paid suggest → restore local cache immediately.
    if (tripId && dayIndex >= 0) {
      const hit = getSuggestReplaceCache(suggestCacheKey);
      if (hit?.rows?.length) {
        setAlts(hit.rows);
        setAltsRequested(true);
        setSuggestFromCache(hit.fromCache !== false || suggestAlreadyPaid);
        setQuery("");
        setHits([]);
        setSearchError(null);
        setSearching(false);
        return;
      }
    }

    setAlts([]);
    setAltsRequested(false);
    setSuggestFromCache(suggestAlreadyPaid);
    setQuery("");
    setHits([]);
    setSearchError(null);
    setSearching(false);
  }, [suggestCacheKey, tripId, dayIndex, suggestAlreadyPaid]);

  // Already paid on BE (survives reload) → fetch list automatically, no button.
  useEffect(() => {
    if (readOnly || !tripId || dayIndex < 0 || !suggestAlreadyPaid) return;
    if (altsRequested || altsLoading) return;
    const hit = getSuggestReplaceCache(suggestCacheKey);
    if (hit?.rows?.length) return;
    void loadAlternatives();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only auto-load once when slot is known-paid
  }, [suggestAlreadyPaid, suggestCacheKey, tripId, dayIndex, readOnly]);

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

  async function loadAlternatives() {
    if (readOnly || altsLoading) return;

    const cacheKey =
      tripId && dayIndex >= 0 ? suggestCacheKey : null;
    if (cacheKey) {
      const hit = getSuggestReplaceCache(cacheKey);
      if (hit?.rows?.length) {
        setAlts(hit.rows);
        setAltsRequested(true);
        setSuggestFromCache(hit.fromCache !== false);
        setAltsError(null);
        setAltsLoading(false);
        return;
      }
    }

    setAltsRequested(true);
    setAltsLoading(true);
    setAltsError(null);

    try {
      let rows: AlternativePlaceSuggestion[] = [];
      let serverAltsRaw: PlaceAlternative[] = [];
      let fromCache = false;
      let charged = 0;

      if (tripId && dayIndex >= 0) {
        // Do not pre-block on balance — BE returns fromCache without debit,
        // and 402 only on first paid miss.
        try {
          const result = await suggestReplaceForTrip(tripId, {
            dayIndex,
            scheduleIndex: stop.scheduleIndex,
            limit: 8,
          });
          fromCache = result.fromCache;
          charged = result.charged;
          serverAltsRaw = result.alternatives;
          rows = result.alternatives.map((a, i) => toAlt(a, i + 1));
          setSuggestFromCache(fromCache || charged > 0 || suggestAlreadyPaid);
          if (charged > 0) requestWalletRefresh();
          if ((fromCache || charged > 0) && placeId) {
            onSuggestPaid?.({
              dayIndex,
              scheduleIndex: stop.scheduleIndex,
              placeId,
            });
          }
        } catch (suggestErr) {
          if (handleInsufficientXu(suggestErr)) {
            setAlts([]);
            setSuggestFromCache(false);
            setAltsError("Không đủ xu để tìm địa điểm thay thế.");
            return;
          }
          // Non-402: fall through to free nearby alternatives
        }
      }

      if (!rows.length && placeId) {
        const nearby = await getPlaceAlternatives(placeId, { limit: 8 });
        if (!serverAltsRaw.length) serverAltsRaw = nearby;
        rows = nearby.map((a, i) => toAlt(a, i + 1));
      }

      if (!rows.length && stop.alternatives?.length) {
        rows = stop.alternatives.map((a, i) => toAlt(a, a.rank || i + 1));
      }

      setAlts(rows);
      if (!rows.length) {
        setAltsError(null);
      } else if (cacheKey && serverAltsRaw.length > 0 && tripId) {
        // Cache paid/BE results (fromCache or freshly charged) so reopen is free.
        setSuggestReplaceCache(cacheKey, {
          rows,
          serverAlts: serverAltsRaw,
          fromCache: fromCache || charged > 0,
        });
      }
    } catch (err) {
      if (stop.alternatives?.length) {
        setAlts(stop.alternatives.map((a, i) => toAlt(a, a.rank || i + 1)));
        setAltsError(null);
      } else {
        setAlts([]);
        setAltsError(
          localizeTripApiError(
            err instanceof Error ? err.message : "Không tải được gợi ý",
          ),
        );
      }
    } finally {
      setAltsLoading(false);
    }
  }

  function selectCandidate(alt: AlternativePlaceSuggestion, key: string) {
    if (readOnly || pickingKey) return;
    const pid = alt.placeId?.trim() || "";
    const cached = pid ? getCachedPlaceDetail(pid) : null;
    setCandidate({
      alt,
      key,
      detail: cached,
      loading: Boolean(pid && !cached),
      error: null,
    });
    if (!pid || cached) return;

    void (async () => {
      try {
        const d = await getPlaceById(pid);
        if (!d) {
          setCandidate((prev) =>
            prev?.key === key
              ? {
                  ...prev,
                  loading: false,
                  error: "Không tìm thấy chi tiết địa điểm.",
                }
              : prev,
          );
          return;
        }
        setCachedPlaceDetail(pid, d);
        setCandidate((prev) =>
          prev?.key === key
            ? { ...prev, detail: d, loading: false, error: null }
            : prev,
        );
      } catch (err) {
        setCandidate((prev) =>
          prev?.key === key
            ? {
                ...prev,
                loading: false,
                error: localizeTripApiError(
                  err instanceof Error
                    ? err.message
                    : "Không tải được chi tiết địa điểm",
                ),
              }
            : prev,
        );
      }
    })();
  }

  async function pickAlt(alt: AlternativePlaceSuggestion, key: string) {
    if (readOnly || pickingKey) return;
    setPickingKey(key);
    try {
      if (tripId && onPickServer && alt.placeId) {
        await onPickServer(alt.placeId);
      } else {
        onPickLocal(alt);
      }
      onClose();
    } catch (err) {
      setAltsError(
        localizeTripApiError(
          err instanceof Error ? err.message : "Không thay được điểm",
        ),
      );
    } finally {
      setPickingKey(null);
    }
  }

  const title = detail?.title || stop.place.title;
  const address = detail?.address || stop.place.address;
  const category = detail?.category || stop.place.category;
  const rating = detail?.reviewRating ?? stop.place.reviewRating;
  const tags = tagChips(detail?.tags ?? stop.place.tags, 10);
  // Prefer itinerary snapshot immediately so thumb shows while detail loads.
  const rawThumb = detail?.thumbnail || stop.place.thumbnail || null;
  const hours = summarizeOpenHours(detail?.openHours);
  const price = detail ? priceLabel(detail) : null;
  const busy = detail ? busySummary(detail) : null;
  const reviews = (detail?.userReviews || []).slice(0, 4);
  const phone = detail?.phone?.trim() || "";
  const website = detail?.website?.trim() || "";
  const menuLink = detail?.menuLink?.trim() || "";
  const email = detail?.emails?.trim() || "";
  const duration =
    detail?.estimatedVisitDurationMin != null
      ? `~${detail.estimatedVisitDurationMin} phút`
      : null;
  const area = detail?.areaType || stop.place.areaType || null;

  const sheet = (
    <div
      className={`${styles.placeDetailModalSheet}${
        candidate ? ` ${styles.placeDetailModalSheetWide}` : ""
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Chi tiết địa điểm"
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.placeDetailRoot}>
        <div className={styles.detailCardHead}>
          <p className={styles.detailEyebrow}>
            Điểm {stop.order} · {stop.time}
          </p>
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

        <div
          className={`${styles.placeDetailBody}${
            candidate ? ` ${styles.placeDetailBodyTriple}` : ""
          }`}
        >
          <section
            className={styles.placeDetailHalf}
            aria-label="Địa điểm hiện tại"
          >
            <p className={styles.placeHalfLabel}>Địa điểm hiện tại</p>
            <div className={styles.placeDetailScroll}>
              {error && !loading ? (
                <p className={styles.placeDetailMuted}>{error}</p>
              ) : null}
              <PlaceInfoBody
                thumbKey={`${stop.place.placeId || stop.key}:${rawThumb || "none"}`}
                thumbSrc={rawThumb}
                title={title || ""}
                address={address}
                rating={rating}
                reviewCount={detail?.reviewCount}
                category={category}
                price={price}
                duration={duration}
                area={area}
                phone={phone}
                website={website}
                menuLink={menuLink}
                email={email}
                hours={hours}
                busy={busy}
                tags={tags}
                reviews={reviews}
                loading={loading}
                showContactEmpty={!loading && !!detail}
              />
            </div>
          </section>

          {!readOnly ? (
            <section
              className={`${styles.placeDetailHalf} ${styles.placeDetailHalfAlts}`}
              aria-label="Địa điểm thay thế"
            >
              <p className={styles.placeHalfLabel}>Địa điểm thay thế</p>
              <div className={styles.placeAltPane}>
                {query.trim().length >= 2 ? (
                  <div className={styles.placeAltSection}>
                    <div className={styles.placeAltSectionHead}>
                      <span className={styles.placeAltBadgeManual}>
                        Thủ công
                      </span>
                      <p className={styles.placeAltSectionTitle}>
                        Kết quả tìm kiếm thủ công
                      </p>
                    </div>
                    <p className={styles.placeDetailMuted}>
                      Theo từ khóa “{query.trim()}” — không trừ xu.
                    </p>
                    {searching ? (
                      <div className={styles.placeDetailLoading}>
                        <LtBrandLoader
                          size="sm"
                          tone="onLight"
                          label="Đang tìm…"
                        />
                      </div>
                    ) : null}
                    {searchError ? (
                      <p className={styles.placeDetailMuted}>{searchError}</p>
                    ) : null}
                    {!searching && hits.length === 0 && !searchError ? (
                      <p className={styles.placeDetailMuted}>
                        Không thấy địa điểm phù hợp.
                      </p>
                    ) : null}
                    {hits.length > 0 ? (
                      <ul className={styles.placeAltList}>
                        {hits
                          .filter(
                            (h) =>
                              !h.placeId || !placeId || h.placeId !== placeId,
                          )
                          .map((hit, idx) => {
                            const alt = toAlt(hit, idx + 1);
                            const key = `search-${hit.placeId ?? hit.title}-${idx}`;
                            const selected = candidate?.key === key;
                            return (
                              <li key={key}>
                                <button
                                  type="button"
                                  className={`${styles.placeAltItem} ${styles.placeAltItemManual}${
                                    selected
                                      ? ` ${styles.placeAltItemSelected}`
                                      : ""
                                  }`}
                                  disabled={!!pickingKey}
                                  aria-pressed={selected}
                                  onClick={() => selectCandidate(alt, key)}
                                >
                                  <span className={styles.placeAltItemBadge}>
                                    Thủ công
                                  </span>
                                  <strong>{hit.title}</strong>
                                  <span>
                                    {[
                                      hit.address || hit.category || null,
                                      hit.reviewRating != null
                                        ? `${hit.reviewRating.toFixed(1)}★`
                                        : null,
                                    ]
                                      .filter(Boolean)
                                      .join(" · ")}
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                      </ul>
                    ) : null}
                  </div>
                ) : null}

                <div
                  className={`${styles.placeAltSection} ${
                    query.trim().length >= 2 ? styles.placeAltSectionFollow : ""
                  }`}
                >
                  <div className={styles.placeAltSectionHead}>
                    <span className={styles.placeAltBadgeSuggest}>
                      Hệ thống
                    </span>
                    <p className={styles.placeAltSectionTitle}>
                      Gợi ý theo lịch trình
                      {tripId && !suggestFromCache && !altsRequested
                        ? ` (−${COSTS.tripSuggest} xu)`
                        : ""}
                    </p>
                  </div>

                  {!altsRequested && !suggestAlreadyPaid ? (
                    <div className={styles.placeAltIdle}>
                      <p className={styles.placeDetailMuted}>
                        Gợi ý AI phù hợp ngữ cảnh chuyến đi
                        {tripId
                          ? ` — trừ ${COSTS.tripSuggest} xu khi bấm lần đầu.`
                          : "."}
                      </p>
                      <button
                        type="button"
                        className={styles.btnPrimary}
                        disabled={!!pickingKey || altsLoading}
                        onClick={() => void loadAlternatives()}
                      >
                        {tripId
                          ? withXuCost(
                              "Tìm địa điểm thay thế",
                              COSTS.tripSuggest,
                            )
                          : "Tìm địa điểm thay thế"}
                      </button>
                    </div>
                  ) : null}
                  {!altsRequested && suggestAlreadyPaid ? (
                    <div className={styles.placeDetailLoading}>
                      <LtBrandLoader
                        size="sm"
                        tone="onLight"
                        label="Đang tải gợi ý đã trả…"
                      />
                    </div>
                  ) : null}
                  {altsRequested && altsLoading ? (
                    <div className={styles.placeDetailLoading}>
                      <LtBrandLoader
                        size="sm"
                        tone="onLight"
                        label="Đang tìm gợi ý…"
                      />
                    </div>
                  ) : null}
                  {altsRequested && altsError ? (
                    <div className={styles.placeAltIdle}>
                      <p className={styles.placeDetailMuted}>{altsError}</p>
                      <button
                        type="button"
                        className={styles.btnGhost}
                        disabled={altsLoading}
                        onClick={() => void loadAlternatives()}
                      >
                        Thử lại
                      </button>
                    </div>
                  ) : null}
                  {altsRequested &&
                  !altsLoading &&
                  !altsError &&
                  alts.length === 0 ? (
                    <p className={styles.placeDetailMuted}>
                      Chưa có gợi ý hệ thống — thử tìm kiếm thủ công bên dưới.
                    </p>
                  ) : null}
                  {altsRequested && alts.length > 0 ? (
                    <ul className={styles.placeAltList}>
                      {alts.map((alt) => {
                        const key = `alt-${alt.placeId ?? alt.title}-${alt.rank}`;
                        const selected = candidate?.key === key;
                        const busyPick = pickingKey === key;
                        return (
                          <li key={key}>
                            <button
                              type="button"
                              className={`${styles.placeAltItem} ${styles.placeAltItemSuggest}${
                                selected
                                  ? ` ${styles.placeAltItemSelected}`
                                  : ""
                              }`}
                              disabled={!!pickingKey}
                              aria-pressed={selected}
                              onClick={() => selectCandidate(alt, key)}
                            >
                              {busyPick ? (
                                <LtButtonLoading
                                  label="Đang chọn…"
                                  onDark={false}
                                />
                              ) : (
                                <>
                                  <span
                                    className={styles.placeAltItemBadgeSuggest}
                                  >
                                    Gợi ý
                                  </span>
                                  <strong>
                                    #{alt.rank} {alt.title}
                                  </strong>
                                  <span>
                                    {(alt.distanceKm ?? 0) > 0
                                      ? `${alt.distanceKm.toFixed(1)} km`
                                      : null}
                                    {alt.reviewRating != null
                                      ? `${(alt.distanceKm ?? 0) > 0 ? " · " : ""}${alt.reviewRating.toFixed(1)}★`
                                      : null}
                                    {alt.category
                                      ? ` · ${alt.category}`
                                      : null}
                                  </span>
                                  {alt.tradeOffMessage ? (
                                    <em>{alt.tradeOffMessage}</em>
                                  ) : null}
                                </>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              </div>
            </section>
          ) : readOnly && replaceBlockedLabel ? (
            <p className={`${styles.placeDetailMuted} ${styles.placeHalfLabel}`}>
              {replaceBlockedLabel}
            </p>
          ) : null}

          {candidate ? (
            <section
              className={`${styles.placeDetailHalf} ${styles.placeDetailHalfPreview}`}
              aria-label="Địa điểm dự định"
            >
              <p className={styles.placeHalfLabel}>Địa điểm dự định</p>
              <div className={styles.placeDetailScroll}>
                {candidate.error && !candidate.loading ? (
                  <p className={styles.placeDetailMuted}>{candidate.error}</p>
                ) : null}
                <PlaceInfoBody
                  thumbKey={`${candidate.alt.placeId || candidate.key}:${candidate.detail?.thumbnail || "none"}`}
                  thumbSrc={candidate.detail?.thumbnail || null}
                  title={candidate.detail?.title || candidate.alt.title || ""}
                  address={
                    candidate.detail?.address || candidate.alt.address || null
                  }
                  rating={
                    candidate.detail?.reviewRating ??
                    candidate.alt.reviewRating ??
                    null
                  }
                  reviewCount={candidate.detail?.reviewCount}
                  category={
                    candidate.detail?.category || candidate.alt.category || null
                  }
                  price={
                    candidate.detail ? priceLabel(candidate.detail) : null
                  }
                  duration={
                    candidate.detail?.estimatedVisitDurationMin != null
                      ? `~${candidate.detail.estimatedVisitDurationMin} phút`
                      : null
                  }
                  area={candidate.detail?.areaType || null}
                  phone={candidate.detail?.phone?.trim() || ""}
                  website={candidate.detail?.website?.trim() || ""}
                  menuLink={candidate.detail?.menuLink?.trim() || ""}
                  email={candidate.detail?.emails?.trim() || ""}
                  hours={summarizeOpenHours(candidate.detail?.openHours)}
                  busy={
                    candidate.detail ? busySummary(candidate.detail) : null
                  }
                  tags={tagChips(
                    candidate.detail?.tags ?? candidate.alt.tags,
                    10,
                  )}
                  reviews={(candidate.detail?.userReviews || []).slice(0, 4)}
                  loading={candidate.loading}
                  showContactEmpty={!candidate.loading && !!candidate.detail}
                />
              </div>
              <div className={styles.placePreviewActions}>
                <button
                  type="button"
                  className={styles.btnGhost}
                  disabled={!!pickingKey}
                  onClick={() => setCandidate(null)}
                >
                  Bỏ chọn
                </button>
                <button
                  type="button"
                  className={styles.btnPrimary}
                  disabled={!!pickingKey || candidate.loading}
                  onClick={() => void pickAlt(candidate.alt, candidate.key)}
                >
                  {pickingKey === candidate.key ? (
                    <LtButtonLoading label="Đang chốt…" onDark />
                  ) : (
                    "Chốt thay thế"
                  )}
                </button>
              </div>
            </section>
          ) : null}
        </div>

        <div className={styles.placeDetailFooter}>
          {!readOnly ? (
            <label className={styles.placeManualSearch}>
              <span className={styles.placeManualSearchLabel}>
                Tìm kiếm thủ công
              </span>
              <input
                type="search"
                className={styles.placeManualSearchInput}
                placeholder="Gõ tên quán, điểm đến…"
                value={query}
                disabled={!!pickingKey}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          ) : (
            <button
              type="button"
              className={styles.btnGhost}
              onClick={onClose}
            >
              Đóng
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;

  return createPortal(
    <div className={styles.placeDetailModalRoot}>
      <button
        type="button"
        className={styles.placeDetailModalBackdrop}
        aria-label="Đóng chi tiết địa điểm"
        onClick={onClose}
      />
      {sheet}
    </div>,
    document.body,
  );
}

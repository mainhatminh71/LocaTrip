"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  getPlaceAlternatives,
  getPlaceById,
  localizeTripApiError,
  suggestReplaceForTrip,
  type PlaceAlternative,
  type PlaceDetail,
} from "@/lib/api/trips";
import { tagChips } from "@/lib/itinerary-map";
import type { ItineraryStop } from "@/lib/itinerary-map";
import type { AlternativePlaceSuggestion } from "@/lib/trip";
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

function toAlt(
  hit: PlaceAlternative | AlternativePlaceSuggestion,
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
  onPickLocal: (alt: AlternativePlaceSuggestion) => void;
  onPickServer?: (newPlaceId: string) => Promise<void>;
  /** Open search-focused replace sheet. */
  onSearchMore?: () => void;
};

export function PlaceStopDetail({
  stop,
  onClose,
  tripId,
  dayIndex,
  readOnly,
  replaceBlockedLabel,
  onPickLocal,
  onPickServer,
  onSearchMore,
}: PlaceStopDetailProps) {
  const placeId = stop.place.placeId?.trim() || "";
  const [detail, setDetail] = useState<PlaceDetail | null>(null);
  const [loading, setLoading] = useState(Boolean(placeId));
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [alts, setAlts] = useState<AlternativePlaceSuggestion[]>([]);
  const [altsLoading, setAltsLoading] = useState(false);
  const [altsError, setAltsError] = useState<string | null>(null);
  const [pickingKey, setPickingKey] = useState<string | null>(null);
  const [pendingPick, setPendingPick] = useState<{
    alt: AlternativePlaceSuggestion;
    key: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (pendingPick) {
        setPendingPick(null);
        return;
      }
      onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, pendingPick]);

  useEffect(() => {
    if (!placeId) {
      setDetail(null);
      setLoading(false);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    void (async () => {
      try {
        const place = await getPlaceById(placeId);
        if (cancelled) return;
        if (!place) {
          setDetail(null);
          setError("Không tìm thấy địa điểm.");
        } else {
          setDetail(place);
        }
      } catch (err) {
        if (!cancelled) {
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

  useEffect(() => {
    if (readOnly) {
      setAlts([]);
      return;
    }
    let cancelled = false;
    setAltsLoading(true);
    setAltsError(null);

    void (async () => {
      try {
        let rows: AlternativePlaceSuggestion[] = [];
        if (tripId && dayIndex >= 0) {
          try {
            const serverAlts = await suggestReplaceForTrip(tripId, {
              dayIndex,
              scheduleIndex: stop.scheduleIndex,
              limit: 8,
            });
            rows = serverAlts.map((a, i) => toAlt(a, i + 1));
          } catch (err) {
            const msg = localizeTripApiError(
              err instanceof Error ? err.message : "Không tải được gợi ý",
            );
            if (/hoàn thành|done trip/i.test(msg)) {
              if (!cancelled) {
                setAltsError(msg);
                setAlts([]);
              }
              return;
            }
            // fall through to place alternatives
          }
        }

        if (!rows.length && placeId) {
          const nearby = await getPlaceAlternatives(placeId, { limit: 8 });
          rows = nearby.map((a, i) => toAlt(a, i + 1));
        }

        if (!rows.length && stop.alternatives?.length) {
          rows = stop.alternatives.map((a, i) =>
            toAlt(a, a.rank || i + 1),
          );
        }

        if (!cancelled) setAlts(rows);
      } catch (err) {
        if (!cancelled) {
          if (stop.alternatives?.length) {
            setAlts(
              stop.alternatives.map((a, i) => toAlt(a, a.rank || i + 1)),
            );
            setAltsError(null);
          } else {
            setAlts([]);
            setAltsError(
              localizeTripApiError(
                err instanceof Error ? err.message : "Không tải được gợi ý",
              ),
            );
          }
        }
      } finally {
        if (!cancelled) setAltsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    readOnly,
    tripId,
    dayIndex,
    stop.scheduleIndex,
    stop.alternatives,
    placeId,
  ]);

  function requestPick(alt: AlternativePlaceSuggestion, key: string) {
    if (readOnly || pickingKey) return;
    setPendingPick({ alt, key });
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

  async function confirmPendingPick() {
    if (!pendingPick || pickingKey) return;
    const { alt, key } = pendingPick;
    setPendingPick(null);
    await pickAlt(alt, key);
  }

  const title = detail?.title || stop.place.title;
  const address = detail?.address || stop.place.address;
  const category = detail?.category || stop.place.category;
  const rating = detail?.reviewRating ?? stop.place.reviewRating;
  const tags = tagChips(detail?.tags ?? stop.place.tags, 10);
  // Prefer full detail thumb; itinerary snapshot may also carry one.
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
      className={styles.placeDetailModalSheet}
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

        <div className={styles.placeDetailScroll}>
          {loading ? (
            <div className={styles.placeDetailLoading}>
              <LtBrandLoader
                size="sm"
                tone="onLight"
                label="Đang tải địa điểm…"
              />
            </div>
          ) : null}

          {error && !loading ? (
            <p className={styles.placeDetailMuted}>{error}</p>
          ) : null}

          <PlaceThumb
            key={stop.place.placeId || stop.key}
            src={loading ? null : rawThumb}
            variant="detail"
            alt={title || ""}
          />

          <h3>{title}</h3>
          {address ? <p className={styles.detailAddr}>{address}</p> : null}

          <div className={styles.detailMeta}>
            {rating != null ? (
              <span>
                {rating.toFixed(1)}★
                {detail?.reviewCount != null ? ` (${detail.reviewCount})` : ""}
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
          ) : !loading && detail ? (
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

          {!readOnly ? (
            <div className={styles.placeAltBlock}>
              <p className={styles.placeReviewTitle}>Địa điểm thay thế</p>
              {altsLoading ? (
                <div className={styles.placeDetailLoading}>
                  <LtBrandLoader
                    size="sm"
                    tone="onLight"
                    label="Đang tải gợi ý…"
                  />
                </div>
              ) : null}
              {altsError ? (
                <p className={styles.placeDetailMuted}>{altsError}</p>
              ) : null}
              {!altsLoading && alts.length === 0 && !altsError ? (
                <p className={styles.placeDetailMuted}>
                  Chưa có gợi ý gần đây — dùng tìm kiếm bên dưới.
                </p>
              ) : null}
              {alts.length > 0 ? (
                <ul className={styles.placeAltList}>
                  {alts.map((alt) => {
                    const key = `alt-${alt.placeId ?? alt.title}-${alt.rank}`;
                    const busyPick = pickingKey === key;
                    return (
                      <li key={key}>
                        <button
                          type="button"
                          className={styles.placeAltItem}
                          disabled={!!pickingKey}
                          onClick={() => requestPick(alt, key)}
                        >
                          {busyPick ? (
                            <LtButtonLoading
                              label="Đang chọn…"
                              onDark={false}
                            />
                          ) : (
                            <>
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
          ) : null}

          {readOnly && replaceBlockedLabel ? (
            <p className={styles.placeDetailMuted}>{replaceBlockedLabel}</p>
          ) : null}
        </div>

        <div className={styles.placeDetailFooter}>
          {!readOnly && onSearchMore ? (
            <button
              type="button"
              className={styles.btnPrimary}
              disabled={!!pickingKey}
              onClick={onSearchMore}
            >
              Tìm địa điểm khác
            </button>
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
        onClick={() => {
          if (pendingPick) {
            setPendingPick(null);
            return;
          }
          onClose();
        }}
      />
      {sheet}
      {pendingPick ? (
        <div
          className={styles.pickConfirmOverlay}
          role="presentation"
          onClick={() => {
            if (!pickingKey) setPendingPick(null);
          }}
        >
          <div
            className={styles.pickConfirmCard}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pick-confirm-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="pick-confirm-title">Thay thế địa điểm?</h3>
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
    </div>,
    document.body,
  );
}

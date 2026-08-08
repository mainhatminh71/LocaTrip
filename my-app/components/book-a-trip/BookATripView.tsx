"use client";

import Image from "next/image";
import { LT_IMAGE_QUALITY } from "@/lib/image-quality";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createSavedTrip, generateAutoTrip } from "@/lib/api/trips";
import { ApiError } from "@/lib/api/http";
import { BOOK_TRIP_ASSETS, BOOK_TRIP_COPY } from "@/lib/book-a-trip-assets";
import {
  DEFAULT_AUTO_TRIP_DRAFT,
  previewSoftLabels,
  type AutoTripDraft,
} from "@/lib/auto-trip-form";
import { buildAutoTripRequest, buildPreferences, getBrowserLocation } from "@/lib/build-auto-trip-request";
import {
  START_PRESETS_BY_CITY,
  saveAutoTrip,
  type AlternativePlaceSuggestion,
  type AutoTripResult,
  type ItineraryOption,
} from "@/lib/trip";
import {
  buildRouteGeoJSON,
  cloneOption,
  extractStops,
  stopsForMap,
  summarizeOptionForCard,
  swapVisitPlace,
  tagChips,
} from "@/lib/itinerary-map";
import { visitDisplayTitle, visitKindLabel } from "@/lib/place-type";
import { useAuthActions } from "@/components/auth/useAuthActions";
import { useAuthModal } from "@/components/auth/AuthModalProvider";
import { AutoTripPrefsFields } from "./AutoTripPrefsFields";
import { ItineraryMap } from "./ItineraryMap";
import { LtButtonLoading } from "./LtBrandLoader";
import { ReplacePlaceModal } from "./ReplacePlaceModal";
import styles from "./book-a-trip.module.css";
import { useRouter } from "next/navigation";

type Phase = "form" | "options" | "itinerary";
type LeftTab = "itinerary" | "prefs";

export function BookATripView({
  onImmersiveChange,
}: {
  onImmersiveChange?: (immersive: boolean) => void;
}) {
  const [phase, setPhase] = useState<Phase>("form");
  const [leftTab, setLeftTab] = useState<LeftTab>("itinerary");
  const [draft, setDraft] = useState<AutoTripDraft>(DEFAULT_AUTO_TRIP_DRAFT);
  /** Snapshot of draft used for the last successful generate — prefs reset target. */
  const [committedDraft, setCommittedDraft] = useState<AutoTripDraft | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AutoTripResult | null>(null);
  const [selectedOption, setSelectedOption] = useState<ItineraryOption | null>(
    null,
  );
  const [selectedStopKey, setSelectedStopKey] = useState<string | null>(null);
  const [replaceTargetKey, setReplaceTargetKey] = useState<string | null>(null);
  const [mobileMapOpen, setMobileMapOpen] = useState(false);
  const [routeStale, setRouteStale] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);
  const [locating, setLocating] = useState(false);
  const [lastLocationOverride, setLastLocationOverride] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedTripId, setSavedTripId] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useAuthActions();
  const { openAuth } = useAuthModal();
  const router = useRouter();

  const startPresets = START_PRESETS_BY_CITY.dalat;
  const activeStart =
    startPresets.find((p) => p.id === draft.startId) ?? startPresets[0]!;

  const immersive = phase !== "form";

  useEffect(() => {
    onImmersiveChange?.(immersive);
  }, [immersive, onImmersiveChange]);

  useEffect(() => {
    return () => onImmersiveChange?.(false);
  }, [onImmersiveChange]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 980px)");
    const sync = () => setIsNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const preview = useMemo(() => previewSoftLabels(draft), [draft]);

  const itineraryStops = useMemo(
    () => (selectedOption ? extractStops(selectedOption.itinerary) : []),
    [selectedOption],
  );

  const selectedStop = useMemo(
    () => itineraryStops.find((s) => s.key === selectedStopKey) ?? null,
    [itineraryStops, selectedStopKey],
  );

  const mapStops = useMemo(
    () => (selectedOption ? stopsForMap(selectedOption.itinerary) : []),
    [selectedOption],
  );

  const routeGeoJSON = useMemo(() => {
    if (!selectedOption || routeStale) return null;
    return buildRouteGeoJSON(selectedOption.itinerary);
  }, [selectedOption, routeStale]);

  const replaceStop = useMemo(
    () => itineraryStops.find((s) => s.key === replaceTargetKey) ?? null,
    [itineraryStops, replaceTargetKey],
  );

  function patchDraft(partial: Partial<AutoTripDraft>) {
    setDraft((d) => ({ ...d, ...partial }));
  }

  /** tripType OR ≥1 soft preference — matches LocalTrip auto generate contract. */
  function assertPrefsOrTripType(): boolean {
    const prefs = buildPreferences(draft);
    if (!draft.tripType && prefs.length === 0) {
      setError(
        "Bạn phải chọn ít nhất 1 Chủ đề chuyến đi hoặc 1 Sở thích.",
      );
      return false;
    }
    return true;
  }

  function onSubmitForm(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (authLoading) return;
    if (!isAuthenticated) {
      openAuth({ next: "/book-a-trip/" });
      return;
    }
    if (!assertPrefsOrTripType()) return;
    try {
      // Validate radius / maxDistance early
      buildAutoTripRequest(draft, "dalat");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Thiếu thông tin hợp lệ");
      return;
    }
    if ((draft.startMode ?? "preset") === "gps") {
      void startGenerateFromGps();
      return;
    }
    void runGenerate(null);
  }

  async function runGenerate(
    locationOverride?: { latitude: number; longitude: number } | null,
  ) {
    setError(null);
    setLoading(true);
    try {
      const request = buildAutoTripRequest(draft, "dalat", locationOverride);
      if (locationOverride) setLastLocationOverride(locationOverride);
      else setLastLocationOverride(null);
      const data = await generateAutoTrip(request);
      setCommittedDraft(structuredClone(draft));
      saveAutoTrip({
        request,
        result: data,
        createdAt: new Date().toISOString(),
      });
      setResult(data);
      setSelectedStopKey(null);
      setReplaceTargetKey(null);
      setRouteStale(false);
      setMobileMapOpen(false);
      setLeftTab("itinerary");
      setSavedTripId(null);
      setSaveMessage(null);
      if (data.itineraries.length === 1) {
        setSelectedOption(cloneOption(data.itineraries[0]!));
        setPhase("itinerary");
      } else {
        setSelectedOption(null);
        setPhase("options");
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Không tạo được lịch trình";
      if (msg.includes("hết hạn") || msg.includes("Chưa đăng nhập")) {
        setError(`${msg}. Thử đăng nhập lại rồi tạo lịch.`);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
      setLocating(false);
    }
  }

  async function startGenerateFromGps() {
    setLocating(true);
    setError(null);
    try {
      const coords = await getBrowserLocation();
      await runGenerate(coords);
    } catch (err) {
      setLocating(false);
      setError(
        err instanceof Error
          ? `${err.message} Chọn điểm trong danh sách hoặc cho phép vị trí rồi thử lại.`
          : "Không lấy được vị trí hiện tại.",
      );
    }
  }

  /** Re-generate from prefs tab — GPS if selected, else preset. */
  function applyPrefsAndRegenerate() {
    setError(null);
    if (authLoading) return;
    if (!isAuthenticated) {
      openAuth({ next: "/book-a-trip/" });
      return;
    }
    if (!assertPrefsOrTripType()) return;
    try {
      buildAutoTripRequest(
        draft,
        "dalat",
        (draft.startMode ?? "preset") === "gps" ? lastLocationOverride : null,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Thiếu thông tin hợp lệ");
      return;
    }
    if ((draft.startMode ?? "preset") === "gps") {
      if (lastLocationOverride) {
        void runGenerate(lastLocationOverride);
        return;
      }
      void startGenerateFromGps();
      return;
    }
    void runGenerate(null);
  }

  function resetPrefsToLastApplied() {
    if (!committedDraft) return;
    setDraft({ ...DEFAULT_AUTO_TRIP_DRAFT, ...structuredClone(committedDraft) });
    setError(null);
  }

  function resetToForm() {
    setPhase("form");
    setLeftTab("itinerary");
    setResult(null);
    setSelectedOption(null);
    setCommittedDraft(null);
    setSelectedStopKey(null);
    setReplaceTargetKey(null);
    setRouteStale(false);
    setMobileMapOpen(false);
    setError(null);
    setSavedTripId(null);
    setSaveMessage(null);
  }

  function pickOption(opt: ItineraryOption) {
    setSelectedOption(cloneOption(opt));
    setSelectedStopKey(null);
    setReplaceTargetKey(null);
    setRouteStale(false);
    setMobileMapOpen(false);
    setLeftTab("itinerary");
    setSavedTripId(null);
    setSaveMessage(null);
    setPhase("itinerary");
  }

  function selectStop(key: string) {
    setSelectedStopKey(key);
  }

  function applyReplace(alt: AlternativePlaceSuggestion) {
    if (!selectedOption || !replaceStop) return;
    setSelectedOption(
      swapVisitPlace(
        selectedOption,
        replaceStop.day,
        replaceStop.scheduleIndex,
        alt,
        {
          latitude: replaceStop.place.latitude,
          longitude: replaceStop.place.longitude,
        },
      ),
    );
    setRouteStale(true);
    setReplaceTargetKey(null);
    setSelectedStopKey(replaceStop.key);
    setSavedTripId(null);
    setSaveMessage(null);
  }

  async function saveCurrentTrip() {
    if (!selectedOption || saving || savedTripId) return;
    if (!isAuthenticated) {
      openAuth({ next: "/book-a-trip/" });
      return;
    }
    setSaving(true);
    setSaveMessage(null);
    setError(null);
    try {
      const start = lastLocationOverride ?? {
        latitude: activeStart.latitude,
        longitude: activeStart.longitude,
      };
      const trip = await createSavedTrip({
        title: (selectedOption.title || "Chuyến đi Đà Lạt").slice(0, 120),
        source: "auto",
        itinerary: selectedOption.itinerary,
        durationDays: selectedOption.itinerary.length,
        pace: draft.pace,
        startCoords: start,
        summary: selectedOption.summary?.slice(0, 2000),
      });
      setSavedTripId(trip.id);
      setSaveMessage("Đã lưu chuyến đi.");
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Không lưu được chuyến đi";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className={immersive ? `${styles.page} ${styles.pageFocus}` : styles.page}
      id="top"
    >
      {!immersive ? (
        <header className={styles.hero} data-framer-name="Header">
          <div className={styles.heroBgWrap}>
            <Image
              src={activeStart.thumbnail || BOOK_TRIP_ASSETS.heroBg}
              alt=""
              fill
              priority
              className={styles.heroBg}
              sizes="100vw"
                    quality={LT_IMAGE_QUALITY}
                  />
          </div>
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <h1>{BOOK_TRIP_COPY.heroTitle}</h1>
              <p>{BOOK_TRIP_COPY.heroSub}</p>
            </div>
          </div>
        </header>
      ) : (
        <div className={styles.focusBar}>
          <button type="button" className={styles.focusReset} onClick={resetToForm}>
            Thiết lập lại
          </button>
          <div className={styles.focusBrand}>
            <Image
              src={BOOK_TRIP_ASSETS.logo}
              alt="LocaTrip"
              width={36}
              height={36}
                    quality={LT_IMAGE_QUALITY}
                  />
            <span>Gợi ý chuyến Đà Lạt</span>
          </div>
          <span className={styles.focusStep}>
            {phase === "options" ? "Chọn lộ trình" : "Lịch trình"}
          </span>
        </div>
      )}

      <section
        className={
          immersive
            ? `${styles.sheet} ${styles.sheetFocus} ${styles.autoSheet}${phase === "itinerary" ? ` ${styles.sheetItinerary}` : ""}`
            : `${styles.sheet} ${styles.autoSheet}`
        }
      >
        <AnimatePresence mode="wait">
          {phase === "form" ? (
            <motion.form
              key="form"
              className={styles.autoForm}
              onSubmit={onSubmitForm}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
            >
              <div className={styles.autoFormIntro}>
                <p className={styles.autoEyebrow}>Đà Lạt · 1 ngày</p>
                <h2>{BOOK_TRIP_COPY.leftTitle}</h2>
                <p>{BOOK_TRIP_COPY.leftSub}</p>
              </div>

              <AutoTripPrefsFields
                draft={draft}
                startPresets={[...startPresets]}
                activeStart={activeStart}
                onPatch={patchDraft}
              />

              <div className={styles.autoSticky}>
                {preview.length > 0 ? (
                  <p className={styles.autoPreview}>
                    Sẽ ưu tiên: {preview.slice(0, 6).join(", ")}
                    {preview.length > 6 ? "…" : ""}
                  </p>
                ) : (
                  <p className={styles.autoPreviewMuted}>
                    Chưa chọn Chủ đề chuyến đi hoặc Sở thích — cần ít nhất một
                    trong hai để tạo lịch.
                  </p>
                )}
                {error ? <p className={styles.error}>{error}</p> : null}
                <button
                  type="submit"
                  className={styles.btnPrimary}
                  disabled={loading || locating}
                >
                  {loading || locating ? (
                    <LtButtonLoading
                      label={
                        locating ? "Đang lấy vị trí…" : "Đang dựng lịch…"
                      }
                    />
                  ) : (
                    BOOK_TRIP_COPY.submit
                  )}
                </button>
              </div>
            </motion.form>
          ) : null}

          {phase === "options" && result ? (
            <motion.div
              key="options"
              className={styles.autoResult}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <h2 className={styles.autoResultTitle}>Chọn một lộ trình</h2>
              <p className={styles.autoHint}>
                So nhanh chuỗi điểm trong ngày — chọn một lộ trình để xem chi
                tiết trên bản đồ.
              </p>
              <ul className={styles.optionList}>
                {result.itineraries.map((opt, idx) => {
                  const card = summarizeOptionForCard(opt);
                  const metaParts = [
                    card.styleLabel,
                    card.stopCount > 0 ? `${card.stopCount} điểm` : null,
                    card.timeRange,
                  ].filter(Boolean);
                  return (
                    <li key={opt.optionId}>
                      <button
                        type="button"
                        className={styles.optionCard}
                        onClick={() => pickOption(opt)}
                      >
                        <span className={styles.optionIndex}>
                          Lộ trình {idx + 1}
                        </span>
                        <strong className={styles.optionTitle}>
                          {opt.title.replace(/^Lộ trình\s+\d+:\s*/i, "") ||
                            opt.title}
                        </strong>
                        {metaParts.length > 0 ? (
                          <span className={styles.optionMeta}>
                            {metaParts.join(" · ")}
                          </span>
                        ) : null}
                        {card.previewTitles.length > 0 ? (
                          <ol className={styles.optionStops}>
                            {card.previewTitles.map((title, i) => (
                              <li key={`${opt.optionId}-${i}`}>{title}</li>
                            ))}
                            {card.moreCount > 0 ? (
                              <li className={styles.optionMore}>
                                +{card.moreCount} điểm nữa
                              </li>
                            ) : null}
                          </ol>
                        ) : opt.summary ? (
                          <span className={styles.optionSummary}>
                            {opt.summary}
                          </span>
                        ) : null}
                        {opt.totalEstimatedCost ? (
                          <em className={styles.optionCost}>
                            {opt.totalEstimatedCost}
                          </em>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {error ? <p className={styles.error}>{error}</p> : null}
            </motion.div>
          ) : null}

          {phase === "itinerary" && selectedOption ? (
            <motion.div
              key="itinerary"
              className={styles.itinerarySplit}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className={styles.itineraryPane}>
                <div className={styles.leftTabs} role="tablist" aria-label="Cột lịch trình">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={leftTab === "itinerary"}
                    className={
                      leftTab === "itinerary"
                        ? styles.leftTabOn
                        : styles.leftTab
                    }
                    onClick={() => setLeftTab("itinerary")}
                  >
                    Lịch trình
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={leftTab === "prefs"}
                    className={
                      leftTab === "prefs" ? styles.leftTabOn : styles.leftTab
                    }
                    onClick={() => setLeftTab("prefs")}
                  >
                    Tiêu chí
                  </button>
                </div>

                {leftTab === "itinerary" ? (
                  <>
                <header className={styles.itineraryHead}>
                  <h2 className={styles.autoResultTitle}>
                    {selectedOption.title || "Lịch trình của bạn"}
                  </h2>
                  {selectedOption.summary ? (
                    <p className={styles.autoHint}>{selectedOption.summary}</p>
                  ) : null}
                  {routeStale ? (
                    <p className={styles.routeStaleNote}>
                      Thời gian giữ theo lịch gốc; tạo lại để tính lại lộ trình
                      trên bản đồ.
                    </p>
                  ) : null}
                </header>

                <div className={styles.days}>
                  {(selectedOption.itinerary || []).map((day) => (
                    <section key={day.day} className={styles.day}>
                      <h3>Ngày {day.day}</h3>
                      <ul>
                        {(day.schedule || []).map((item, i) => {
                          const key = `${day.day}-${i}`;
                          if (item.type === "travel") {
                            return (
                              <li key={key} className={styles.travelItem}>
                                <span className={styles.time}>{item.time}</span>
                                <span
                                  className={styles.travelRail}
                                  aria-hidden="true"
                                />
                                <div className={styles.travelBody}>
                                  <span className={styles.travelLabel}>
                                    Di chuyển
                                    {item.durationMin != null
                                      ? ` · ${item.durationMin} phút`
                                      : ""}
                                  </span>
                                  {item.instruction ? (
                                    <p className={styles.travelHint}>
                                      {item.instruction}
                                    </p>
                                  ) : null}
                                </div>
                              </li>
                            );
                          }
                          const stopOrder =
                            itineraryStops.find((s) => s.key === key)?.order ??
                            null;
                          const active = selectedStopKey === key;
                          const kind = visitKindLabel(item.place || {});
                          const title = visitDisplayTitle(item.place || {});
                          return (
                            <li key={key} className={styles.visitItem}>
                              <button
                                type="button"
                                className={
                                  active
                                    ? styles.stopRowActive
                                    : styles.stopRow
                                }
                                onClick={() => selectStop(key)}
                              >
                                <span className={styles.time}>{item.time}</span>
                                <span
                                  className={styles.stopOrder}
                                  aria-label={
                                    stopOrder != null
                                      ? `Điểm ${stopOrder}`
                                      : "Điểm dừng"
                                  }
                                >
                                  {stopOrder ?? "·"}
                                </span>
                                <div className={styles.scheduleBody}>
                                  <span className={styles.visitLabel}>
                                    {kind}
                                  </span>
                                  <strong>{title}</strong>
                                  {item.place?.address ? (
                                    <p className={styles.visitAddr}>
                                      {item.place.address}
                                    </p>
                                  ) : null}
                                  {item.place?.reviewRating != null ||
                                  (item.place?.category &&
                                    item.place.category !== kind) ||
                                  item.place?.areaType ? (
                                    <div className={styles.visitMeta}>
                                      {item.place?.reviewRating != null ? (
                                        <span>
                                          {item.place.reviewRating.toFixed(1)}★
                                        </span>
                                      ) : null}
                                      {item.place?.category &&
                                      item.place.category !== kind ? (
                                        <span>{item.place.category}</span>
                                      ) : null}
                                      {item.place?.areaType ? (
                                        <span>{item.place.areaType}</span>
                                      ) : null}
                                    </div>
                                  ) : null}
                                  {item.warning?.message ? (
                                    <p className={styles.visitWarn}>
                                      {item.warning.message}
                                    </p>
                                  ) : null}
                                </div>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                  ))}
                </div>

                {selectedStop ? (
                  <div className={styles.detailCardMobile}>
                    <div className={styles.detailCardHead}>
                      <p className={styles.detailEyebrow}>
                        Điểm {selectedStop.order} · {selectedStop.time}
                      </p>
                      <button
                        type="button"
                        className={styles.detailClose}
                        aria-label="Đóng"
                        onClick={() => setSelectedStopKey(null)}
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
                    <h3>{selectedStop.place.title}</h3>
                    {selectedStop.place.address ? (
                      <p className={styles.detailAddr}>
                        {selectedStop.place.address}
                      </p>
                    ) : null}
                    <div className={styles.detailMeta}>
                      {selectedStop.place.reviewRating != null ? (
                        <span>{selectedStop.place.reviewRating.toFixed(1)}★</span>
                      ) : null}
                      {selectedStop.place.category ? (
                        <span>{selectedStop.place.category}</span>
                      ) : null}
                    </div>
                    {tagChips(selectedStop.place.tags).length > 0 ? (
                      <div className={styles.tagChipRow}>
                        {tagChips(selectedStop.place.tags).map((t) => (
                          <span key={t} className={styles.tagChip}>
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <button
                      type="button"
                      className={styles.btnPrimary}
                      onClick={() => setReplaceTargetKey(selectedStop.key)}
                    >
                      Thay thế
                    </button>
                  </div>
                ) : null}

                <div className={styles.autoSticky}>
                  <button
                    type="button"
                    className={`${styles.btnGhost} ${styles.mapToggleBtn}`}
                    onClick={() => setMobileMapOpen(true)}
                  >
                    Bản đồ
                  </button>
                  {result && result.itineraries.length > 1 ? (
                    <button
                      type="button"
                      className={styles.btnGhost}
                      onClick={() => setPhase("options")}
                    >
                      Đổi lộ trình khác
                    </button>
                  ) : null}
                  {savedTripId ? (
                    <button
                      type="button"
                      className={styles.btnPrimary}
                      onClick={() => router.push(`/my-trips/${savedTripId}/`)}
                    >
                      Xem đã lưu
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={styles.btnPrimary}
                      disabled={saving}
                      onClick={() => void saveCurrentTrip()}
                    >
                      {saving ? (
                        <LtButtonLoading label="Đang lưu…" />
                      ) : (
                        "Lưu chuyến đi"
                      )}
                    </button>
                  )}
                  <button
                    type="button"
                    className={styles.btnGhost}
                    onClick={resetToForm}
                  >
                    Tạo lại
                  </button>
                </div>
                {saveMessage ? (
                  <p className={styles.saveOk}>{saveMessage}</p>
                ) : null}
                {error && phase === "itinerary" ? (
                  <p className={styles.error}>{error}</p>
                ) : null}
                  </>
                ) : (
                  <>
                    <header className={styles.itineraryHead}>
                      <h2 className={styles.autoResultTitle}>Chỉnh tiêu chí</h2>
                      <p className={styles.autoHint}>
                        Sửa lựa chọn rồi áp dụng để tạo lịch mới — map vẫn hiện
                        bên cạnh.
                      </p>
                    </header>
                    <AutoTripPrefsFields
                      draft={draft}
                      startPresets={[...startPresets]}
                      activeStart={activeStart}
                      compact
                      onPatch={patchDraft}
                    />
                    <div className={`${styles.autoSticky} ${styles.prefsSticky}`}>
                      {preview.length > 0 ? (
                        <p className={styles.autoPreview}>
                          Sẽ ưu tiên: {preview.slice(0, 6).join(", ")}
                          {preview.length > 6 ? "…" : ""}
                        </p>
                      ) : (
                        <p className={styles.autoPreviewMuted}>
                          Chưa chọn Chủ đề chuyến đi hoặc Sở thích — cần ít nhất
                          một trong hai để tạo lịch.
                        </p>
                      )}
                      {error ? <p className={styles.error}>{error}</p> : null}
                      <div className={styles.prefsStickyActions}>
                        <button
                          type="button"
                          className={styles.btnGhost}
                          onClick={resetPrefsToLastApplied}
                          disabled={loading || !committedDraft}
                        >
                          Reset lựa chọn
                        </button>
                        <button
                          type="button"
                          className={styles.btnPrimary}
                          disabled={loading || locating}
                          onClick={applyPrefsAndRegenerate}
                        >
                          {loading || locating ? (
                            <LtButtonLoading label="Đang dựng lịch…" />
                          ) : (
                            "Áp dụng & tạo lại"
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <aside className={styles.mapPane} aria-label="Bản đồ lộ trình">
                <div className={styles.mapPaneInner}>
                  {!isNarrow ? (
                    <ItineraryMap
                      stops={mapStops}
                      selectedKey={selectedStopKey}
                      routeGeoJSON={routeGeoJSON}
                      onSelectStop={selectStop}
                      busy={loading || locating}
                      busyLabel={
                        locating
                          ? "Đang lấy vị trí…"
                          : "Đang dựng lộ trình…"
                      }
                    />
                  ) : null}
                  {selectedStop ? (
                    <div className={styles.detailCardMap}>
                      <div className={styles.detailCardHead}>
                        <p className={styles.detailEyebrow}>
                          Điểm {selectedStop.order} · {selectedStop.time}
                        </p>
                        <button
                          type="button"
                          className={styles.detailClose}
                          aria-label="Đóng"
                          onClick={() => setSelectedStopKey(null)}
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
                      <h3>{selectedStop.place.title}</h3>
                      {selectedStop.place.address ? (
                        <p className={styles.detailAddr}>
                          {selectedStop.place.address}
                        </p>
                      ) : null}
                      <div className={styles.detailMeta}>
                        {selectedStop.place.reviewRating != null ? (
                          <span>
                            {selectedStop.place.reviewRating.toFixed(1)}★
                          </span>
                        ) : null}
                        {selectedStop.place.category ? (
                          <span>{selectedStop.place.category}</span>
                        ) : null}
                      </div>
                      {tagChips(selectedStop.place.tags).length > 0 ? (
                        <div className={styles.tagChipRow}>
                          {tagChips(selectedStop.place.tags).map((t) => (
                            <span key={t} className={styles.tagChip}>
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      <button
                        type="button"
                        className={styles.btnPrimary}
                        onClick={() => setReplaceTargetKey(selectedStop.key)}
                      >
                        Thay thế
                      </button>
                    </div>
                  ) : (
                    <p className={styles.mapHint}>
                      Chọn một điểm trên danh sách hoặc bản đồ để xem chi tiết
                    </p>
                  )}
                </div>
              </aside>

              <AnimatePresence>
                {mobileMapOpen && isNarrow ? (
                  <motion.div
                    className={styles.mobileMapOverlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className={styles.mobileMapSheet}>
                      <div className={styles.mobileMapBar}>
                        <span>Bản đồ lộ trình</span>
                        <button
                          type="button"
                          className={styles.focusBack}
                          onClick={() => setMobileMapOpen(false)}
                        >
                          Đóng
                        </button>
                      </div>
                      <div className={styles.mobileMapBody}>
                        <ItineraryMap
                          stops={mapStops}
                          selectedKey={selectedStopKey}
                          routeGeoJSON={routeGeoJSON}
                          onSelectStop={(key) => {
                            selectStop(key);
                            setMobileMapOpen(false);
                          }}
                          busy={loading || locating}
                          busyLabel={
                            locating
                              ? "Đang lấy vị trí…"
                              : "Đang dựng lộ trình…"
                          }
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <AnimatePresence>
                {replaceStop ? (
                  <ReplacePlaceModal
                    key="replace-modal"
                    stop={replaceStop}
                    onClose={() => setReplaceTargetKey(null)}
                    onPick={applyReplace}
                  />
                ) : null}
              </AnimatePresence>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>
    </div>
  );
}

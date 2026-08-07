"use client";

import Image from "next/image";
import { LT_IMAGE_QUALITY } from "@/lib/image-quality";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  createSavedTrip,
  createTripPrefs,
  generateAutoTrip,
  getPlaceById,
  getSavedTrip,
  updateSavedTrip,
  updateTripPrefs,
  type CreateSavedTripBody,
  type TripPrefsBody,
} from "@/lib/api/trips";
import { ApiError } from "@/lib/api/http";
import { BOOK_TRIP_ASSETS, BOOK_TRIP_COPY } from "@/lib/book-a-trip-assets";
import {
  DEFAULT_AUTO_TRIP_DRAFT,
  parseDraftHours,
  previewSoftLabels,
  todayYmd,
  validateTripTitleAndDate,
  type AutoTripDraft,
} from "@/lib/auto-trip-form";
import { draftFromSavedTrip } from "@/lib/saved-trip-draft";
import { buildAutoTripRequest, buildPreferences, getBrowserLocation } from "@/lib/build-auto-trip-request";
import {
  START_PRESETS_BY_CITY,
  loadAutoTrip,
  saveAutoTrip,
  saveAutoTripSelection,
  type AlternativePlaceSuggestion,
  type AutoTripResult,
  type ItineraryOption,
} from "@/lib/trip";
import {
  buildRouteGeoJSON,
  cloneOption,
  enrichItineraryCoords,
  extractStops,
  stopsForMap,
  summarizeOptionForCard,
  swapVisitPlace,
  tagChips,
} from "@/lib/itinerary-map";
import { visitDisplayTitle, visitKindLabel } from "@/lib/place-type";
import { useAuthActions } from "@/components/auth/useAuthActions";
import { useAuthModal } from "@/components/auth/AuthModalProvider";
import { AccountMenu } from "@/components/auth/AccountFab";
import { useToast } from "@/components/ui/ToastProvider";
import { AutoTripPrefsFields } from "./AutoTripPrefsFields";
import { ItineraryMap } from "./ItineraryMap";
import { LtBrandLoader, LtButtonLoading } from "./LtBrandLoader";
import { ReplacePlaceModal } from "./ReplacePlaceModal";
import styles from "./book-a-trip.module.css";
import { useRouter, useSearchParams } from "next/navigation";

type Phase = "form" | "options" | "itinerary";
type LeftTab = "itinerary" | "prefs";

const EDITING_TRIP_STORAGE_KEY = "locatrip.editingTripId";

function readStoredEditingTripId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(EDITING_TRIP_STORAGE_KEY)?.trim() || null;
  } catch {
    return null;
  }
}

function writeStoredEditingTripId(id: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (id) sessionStorage.setItem(EDITING_TRIP_STORAGE_KEY, id);
    else sessionStorage.removeItem(EDITING_TRIP_STORAGE_KEY);
  } catch {
    /* ignore quota / private mode */
  }
}

export function BookATripView({
  onImmersiveChange,
}: {
  onImmersiveChange?: (immersive: boolean) => void;
}) {
  const [phase, setPhase] = useState<Phase>("form");
  const [leftTab, setLeftTab] = useState<LeftTab>("itinerary");
  const [draft, setDraft] = useState<AutoTripDraft>(() => ({
    ...DEFAULT_AUTO_TRIP_DRAFT,
    date: todayYmd(),
  }));
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
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [savedTripId, setSavedTripId] = useState<string | null>(null);
  /** When set (from `?from=` / `?edit=`), user can PATCH this trip after regenerate. */
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [editingPrefsId, setEditingPrefsId] = useState<string | null>(null);

  useEffect(() => {
    const stored = readStoredEditingTripId();
    if (stored) setEditingTripId(stored);
  }, []);

  function setEditingTrip(id: string | null) {
    setEditingTripId(id);
    writeStoredEditingTripId(id);
  }
  const [prefillNotice, setPrefillNotice] = useState<string | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useAuthActions();
  const { openAuth } = useAuthModal();
  const { toastSuccess } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromTripId = searchParams.get("from")?.trim() || "";
  const editTripId = searchParams.get("edit")?.trim() || "";
  const prefillAppliedRef = useRef<string | null>(null);

  const startPresets = START_PRESETS_BY_CITY.dalat;
  const activeStart =
    startPresets.find((p) => p.id === draft.startId) ?? startPresets[0]!;

  const immersive = phase !== "form";

  useEffect(() => {
    onImmersiveChange?.(immersive);
  }, [immersive, onImmersiveChange]);

  /**
   * Load a saved trip into book-a-trip:
   * - `?edit=<id>` → open itinerary split (list + map) for editing
   * - `?from=<id>` → prefill form prefs only (regenerate)
   */
  useEffect(() => {
    const tripId = editTripId || fromTripId;
    if (!tripId || authLoading) return;
    const mode = editTripId ? "edit" : "from";
    const applyKey = `${mode}:${tripId}`;
    const nextPath =
      mode === "edit"
        ? `/book-a-trip/?edit=${encodeURIComponent(tripId)}`
        : `/book-a-trip/?from=${encodeURIComponent(tripId)}`;

    if (!isAuthenticated) {
      if (prefillAppliedRef.current !== `auth:${applyKey}`) {
        prefillAppliedRef.current = `auth:${applyKey}`;
        openAuth({ next: nextPath });
      }
      return;
    }
    if (prefillAppliedRef.current === applyKey) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    void (async () => {
      try {
        const trip = await getSavedTrip(tripId);
        if (cancelled) return;
        const { draft: nextDraft, locationOverride } = draftFromSavedTrip(trip);
        setDraft(nextDraft);
        setLastLocationOverride(locationOverride);
        setSelectedStopKey(null);
        setReplaceTargetKey(null);
        setRouteStale(false);
        setMobileMapOpen(false);
        setSavedTripId(null);
        setEditingTrip(trip.id);
        setEditingPrefsId(trip.prefsId || null);

        if (mode === "edit") {
          const enrichedItinerary = await enrichItineraryCoords(
            trip.itinerary || [],
            async (placeId) => {
              const place = await getPlaceById(placeId);
              return place
                ? {
                    latitude: place.latitude,
                    longitude: place.longitude,
                  }
                : null;
            },
          );
          if (cancelled) return;
          const option: ItineraryOption = {
            optionId: 1,
            title: trip.title,
            totalScore: 0,
            tripStyle: trip.pace || "",
            totalEstimatedCost: String(trip.totalEstimatedCost ?? ""),
            summary: trip.summary || "",
            itinerary: enrichedItinerary,
          };
          setCommittedDraft(structuredClone(nextDraft));
          setSelectedOption(cloneOption(option));
          setResult({
            totalItineraries: 1,
            itineraries: [option],
          });
          setLeftTab("itinerary");
          setPhase("itinerary");
          setPrefillNotice(null);
          // Keep `?edit=` so remount / Strict Mode can re-open the map view.
        } else {
          setCommittedDraft(null);
          setSelectedOption(null);
          setResult(null);
          setPhase("form");
          setPrefillNotice(
            `Đã nạp tiêu chí từ “${trip.title.slice(0, 80)}”. Chỉnh rồi tạo lịch trình.`,
          );
          // Keep `?from=` (like `?edit=`) so remount / Strict Mode keeps
          // editingTripId and PATCH updates the same trip instead of POST create.
        }
        prefillAppliedRef.current = applyKey;
      } catch (err) {
        if (cancelled) return;
        prefillAppliedRef.current = null;
        setError(
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Không tải được chuyến đi đã lưu",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    editTripId,
    fromTripId,
    isAuthenticated,
    authLoading,
    openAuth,
    router,
  ]);

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

  const mapStops = useMemo(() => {
    if (!selectedOption) return [];
    const visits = stopsForMap(selectedOption.itinerary);
    const start =
      lastLocationOverride ??
      ({
        latitude: activeStart.latitude,
        longitude: activeStart.longitude,
      } as const);
    if (
      !Number.isFinite(start.latitude) ||
      !Number.isFinite(start.longitude)
    ) {
      return visits;
    }
    const startLabel =
      (draft.startMode ?? "preset") === "gps"
        ? "Điểm bắt đầu (GPS)"
        : activeStart.label || "Điểm bắt đầu";
    return [
      {
        key: "__start__",
        lat: start.latitude,
        lng: start.longitude,
        order: 0,
        label: startLabel,
        kind: "start" as const,
      },
      ...visits,
    ];
  }, [selectedOption, lastLocationOverride, activeStart, draft.startMode]);

  const routeGeoJSON = useMemo(() => {
    if (!selectedOption || routeStale) return null;
    const start =
      lastLocationOverride ??
      ({
        latitude: activeStart.latitude,
        longitude: activeStart.longitude,
      } as const);
    return buildRouteGeoJSON(selectedOption.itinerary, start);
  }, [selectedOption, routeStale, lastLocationOverride, activeStart]);

  const replaceStop = useMemo(
    () => itineraryStops.find((s) => s.key === replaceTargetKey) ?? null,
    [itineraryStops, replaceTargetKey],
  );

  function patchDraft(partial: Partial<AutoTripDraft>) {
    setDraft((d) => ({ ...d, ...partial }));
    setPrefillNotice(null);
  }

  /** tripType OR ≥1 soft preference — matches LocalTrip auto generate contract. */
  function assertPrefsOrTripType(): boolean {
    const identityErr = validateTripTitleAndDate(draft, {
      allowPast: Boolean(editingTripId),
    });
    if (identityErr) {
      setError(identityErr);
      return false;
    }
    const prefs = buildPreferences(draft);
    if (!draft.tripType && prefs.length === 0) {
      setError(
        "Bạn phải chọn ít nhất 1 Chủ đề chuyến đi hoặc 1 Sở thích.",
      );
      return false;
    }
    return true;
  }

  function resolveGenerateLocation(): {
    latitude: number;
    longitude: number;
  } | null {
    // Prefer exact coords from last generate / restored trip.
    if (
      lastLocationOverride &&
      Number.isFinite(lastLocationOverride.latitude) &&
      Number.isFinite(lastLocationOverride.longitude)
    ) {
      return lastLocationOverride;
    }
    return null;
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
      buildAutoTripRequest(draft, "dalat", resolveGenerateLocation());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Thiếu thông tin hợp lệ");
      return;
    }
    const savedStart = resolveGenerateLocation();
    if ((draft.startMode ?? "preset") === "gps") {
      if (savedStart) {
        void runGenerate(savedStart);
        return;
      }
      void startGenerateFromGps();
      return;
    }
    void runGenerate(savedStart);
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
      const selectedOptionId =
        data.itineraries.length === 1
          ? data.itineraries[0]?.optionId
          : undefined;
      saveAutoTrip({
        request,
        result: data,
        createdAt: new Date().toISOString(),
        selectedOptionId,
      });
      setResult(data);
      setSelectedStopKey(null);
      setReplaceTargetKey(null);
      setRouteStale(false);
      setMobileMapOpen(false);
      setLeftTab("itinerary");
      setSavedTripId(null);
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
    const savedStart = resolveGenerateLocation();
    try {
      buildAutoTripRequest(draft, "dalat", savedStart);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Thiếu thông tin hợp lệ");
      return;
    }
    if ((draft.startMode ?? "preset") === "gps") {
      if (savedStart) {
        void runGenerate(savedStart);
        return;
      }
      void startGenerateFromGps();
      return;
    }
    void runGenerate(savedStart);
  }

  function resetPrefsToLastApplied() {
    if (!committedDraft) return;
    setDraft({ ...DEFAULT_AUTO_TRIP_DRAFT, ...structuredClone(committedDraft) });
    setError(null);
  }

  function resetToForm() {
    // Prevent `?edit=` effect from immediately re-opening the map view.
    if (editTripId) {
      prefillAppliedRef.current = `cleared:edit:${editTripId}`;
      router.replace("/book-a-trip/", { scroll: false });
    } else if (fromTripId) {
      router.replace("/book-a-trip/", { scroll: false });
    }
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
    setEditingTrip(null);
    setEditingPrefsId(null);
  }

  function pickOption(opt: ItineraryOption) {
    const cloned = cloneOption(opt);
    setSelectedOption(cloned);
    setSelectedStopKey(null);
    setReplaceTargetKey(null);
    setRouteStale(false);
    setMobileMapOpen(false);
    setLeftTab("itinerary");
    setSavedTripId(null);
    setPhase("itinerary");
    saveAutoTripSelection(opt.optionId);
  }

  function selectStop(key: string) {
    setSelectedStopKey(key);
  }

  function applyReplace(alt: AlternativePlaceSuggestion) {
    if (!selectedOption || !replaceStop) return;
    const next = swapVisitPlace(
      selectedOption,
      replaceStop.day,
      replaceStop.scheduleIndex,
      alt,
      {
        latitude: replaceStop.place.latitude,
        longitude: replaceStop.place.longitude,
      },
    );
    setSelectedOption(next);
    setRouteStale(true);
    setReplaceTargetKey(null);
    setSelectedStopKey(replaceStop.key);
    setSavedTripId(null);
    // Keep localStorage draft in sync with the edited option.
    if (result) {
      const itineraries = result.itineraries.map((o) =>
        o.optionId === next.optionId ? next : o,
      );
      const nextResult = { ...result, itineraries };
      setResult(nextResult);
      const prev = loadAutoTrip();
      if (prev) {
        saveAutoTrip({
          ...prev,
          result: nextResult,
          selectedOptionId: next.optionId,
        });
      }
    }
  }

  function buildSaveBody(option: ItineraryOption): CreateSavedTripBody {
    const start = lastLocationOverride ?? {
      latitude: activeStart.latitude,
      longitude: activeStart.longitude,
    };
    const { start: startTimePerDay, end: endTimePerDay } = parseDraftHours(
      draft.hours,
    );
    const radiusKm = Number(String(draft.radiusKm).trim().replace(",", "."));
    const maxDistance = Number(
      String(draft.maxDistance).trim().replace(",", "."),
    );
    const preferences = buildPreferences(draft);
    const generatePrefs = {
      tripType: draft.tripType || undefined,
      targetCustomer: draft.targetCustomer || undefined,
      preferences,
      budgetLevel: draft.budgetLevel,
      pace: draft.pace,
      radiusKm: Number.isFinite(radiusKm) ? radiusKm : undefined,
      maxDistance: Number.isFinite(maxDistance) ? maxDistance : undefined,
      isRoundTrip: draft.isRoundTrip,
      startTimePerDay,
      endTimePerDay,
      showRoad: draft.showRoad,
      startCoords: start,
      startMode: draft.startMode,
      startId: draft.startId,
      roundTrip: draft.isRoundTrip,
    };
    return {
      title: draft.title.trim().slice(0, 120),
      source: "auto",
      itinerary: option.itinerary,
      date: draft.date.trim().slice(0, 10),
      tripDate: draft.date.trim().slice(0, 10),
      // Saved trips are OnGoing until the travel day passes (server also enforces).
      tripStatus: "OnGoing",
      durationDays: option.itinerary.length,
      pace: draft.pace,
      startCoords: start,
      startLatitude: start.latitude,
      startLongitude: start.longitude,
      summary: option.summary?.slice(0, 2000),
      tripType: draft.tripType || undefined,
      targetCustomer: draft.targetCustomer || undefined,
      preferences,
      budgetLevel: draft.budgetLevel,
      radiusKm: generatePrefs.radiusKm,
      maxDistance: generatePrefs.maxDistance,
      isRoundTrip: draft.isRoundTrip,
      roundTrip: draft.isRoundTrip,
      showRoad: draft.showRoad,
      startTimePerDay,
      endTimePerDay,
      startMode: draft.startMode,
      startId: draft.startId,
      generatePrefs,
    };
  }

  async function persistTrip(
    mode: "create" | "update",
    option?: ItineraryOption | null,
  ) {
    const opt = option ?? selectedOption;
    if (!opt || saving) return;
    // After create, UI flips to "Xem đã lưu" — don't POST again.
    if (mode === "create" && savedTripId) return;
    if (mode === "update" && !editingTripId) return;
    if (!isAuthenticated) {
      openAuth({
        next: editingTripId
          ? `/book-a-trip/?edit=${encodeURIComponent(editingTripId)}`
          : "/book-a-trip/",
      });
      return;
    }
    const identityErr = validateTripTitleAndDate(draft, {
      allowPast: Boolean(editingTripId),
    });
    if (identityErr) {
      setError(identityErr);
      return;
    }
    const body = buildSaveBody(opt);

    setSaving(true);
    setError(null);
    try {
      const trip =
        mode === "update" && editingTripId
          ? await updateSavedTrip(editingTripId, body)
          : await createSavedTrip(body);
      if (mode === "update") {
        setEditingTrip(trip.id);
        setSavedTripId(null);
        toastSuccess("Đã cập nhật chuyến đi.");
      } else {
        setSavedTripId(trip.id);
        setEditingTrip(null);
        toastSuccess("Đã lưu chuyến đi.");
      }
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : mode === "update"
              ? "Không cập nhật được chuyến đi"
              : "Không lưu được chuyến đi";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  async function saveCurrentTrip() {
    await persistTrip("create");
  }

  async function updateCurrentTrip() {
    await persistTrip("update");
  }

  function buildPrefsOnlyBody(): TripPrefsBody {
    const start = resolveGenerateLocation() ?? {
      latitude: activeStart.latitude,
      longitude: activeStart.longitude,
    };
    const { start: startTimePerDay, end: endTimePerDay } = parseDraftHours(
      draft.hours,
    );
    const radiusKm = Number(String(draft.radiusKm).trim().replace(",", "."));
    const maxDistance = Number(
      String(draft.maxDistance).trim().replace(",", "."),
    );
    const preferences = buildPreferences(draft);
    const generatePrefs = {
      tripType: draft.tripType || undefined,
      targetCustomer: draft.targetCustomer || undefined,
      preferences,
      budgetLevel: draft.budgetLevel,
      pace: draft.pace,
      radiusKm: Number.isFinite(radiusKm) ? radiusKm : undefined,
      maxDistance: Number.isFinite(maxDistance) ? maxDistance : undefined,
      isRoundTrip: draft.isRoundTrip,
      startTimePerDay,
      endTimePerDay,
      showRoad: draft.showRoad,
      startCoords: start,
      startMode: draft.startMode,
      startId: draft.startId,
      roundTrip: draft.isRoundTrip,
    };
    return {
      ...generatePrefs,
      startLatitude: start.latitude,
      startLongitude: start.longitude,
      generatePrefs,
      tripId: editingTripId || savedTripId || null,
      label: (draft.title.trim() || selectedOption?.title || "Tiêu chí Đà Lạt").slice(
        0,
        120,
      ),
    };
  }

  /** Persist planner options only — does not regenerate itinerary. */
  async function savePrefsOnly() {
    if (savingPrefs || loading || locating) return;
    if (authLoading) return;
    if (!isAuthenticated) {
      openAuth({
        next: editingTripId
          ? `/book-a-trip/?edit=${encodeURIComponent(editingTripId)}`
          : "/book-a-trip/",
      });
      return;
    }
    if (!assertPrefsOrTripType()) return;

    setSavingPrefs(true);
    setError(null);
    try {
      const body = buildPrefsOnlyBody();
      const tripId = editingTripId || savedTripId;

      if (tripId) {
        // PATCH trip (no itinerary) → upserts trip_prefs on the server.
        const {
          label: _label,
          tripId: _tripId,
          generatePrefs,
          ...flat
        } = body;
        const trip = await updateSavedTrip(tripId, {
          ...flat,
          generatePrefs,
          source: "auto",
        });
        setEditingTrip(trip.id);
        if (trip.prefsId) setEditingPrefsId(trip.prefsId);
        setCommittedDraft(structuredClone(draft));
        toastSuccess("Đã lưu bộ tiêu chí.");
      } else if (editingPrefsId) {
        const prefs = await updateTripPrefs(editingPrefsId, body);
        setEditingPrefsId(prefs.id);
        setCommittedDraft(structuredClone(draft));
        toastSuccess("Đã cập nhật bộ tiêu chí.");
      } else {
        const prefs = await createTripPrefs(body);
        setEditingPrefsId(prefs.id);
        setCommittedDraft(structuredClone(draft));
        toastSuccess("Đã lưu bộ tiêu chí.");
      }
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Không lưu được bộ tiêu chí",
      );
    } finally {
      setSavingPrefs(false);
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
          <div className={styles.focusMeta}>
            <span className={styles.focusStep}>
              {phase === "options" ? "Chọn lộ trình" : "Lịch trình"}
            </span>
            <AccountMenu variant="bar" />
          </div>
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
          {editTripId && phase === "form" && !error ? (
            <motion.div
              key="opening-edit"
              className={styles.autoForm}
              style={{
                display: "grid",
                placeItems: "center",
                minHeight: "40vh",
                padding: "2rem",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <LtBrandLoader
                size="lg"
                tone="onLight"
                label="Đang mở lịch trình…"
              />
            </motion.div>
          ) : phase === "form" ? (
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

              {prefillNotice ? (
                <p className={styles.saveOk} role="status">
                  {prefillNotice}
                </p>
              ) : null}

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
                        <span className={styles.optionPending}>Đề xuất</span>
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
                    {draft.title.trim() ||
                      selectedOption.title ||
                      "Lịch trình của bạn"}
                  </h2>
                  {draft.date ? (
                    <p className={styles.tripSubtitle}>
                      Ngày đi:{" "}
                      {(() => {
                        try {
                          const [y, m, d] = draft.date
                            .slice(0, 10)
                            .split("-")
                            .map(Number);
                          return new Intl.DateTimeFormat("vi-VN", {
                            dateStyle: "medium",
                          }).format(new Date(y!, (m ?? 1) - 1, d));
                        } catch {
                          return draft.date;
                        }
                      })()}
                      {" · "}
                      {savedTripId || editingTripId ? "Đang đi" : "Đề xuất"}
                    </p>
                  ) : null}
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
                  ) : editingTripId ? (
                    <>
                      <button
                        type="button"
                        className={styles.btnPrimary}
                        disabled={saving}
                        onClick={() => void updateCurrentTrip()}
                      >
                        {saving ? (
                          <LtButtonLoading label="Đang cập nhật…" />
                        ) : (
                          "Cập nhật chuyến này"
                        )}
                      </button>
                      <button
                        type="button"
                        className={styles.btnGhost}
                        disabled={saving}
                        onClick={() => void saveCurrentTrip()}
                      >
                        Lưu thành chuyến mới
                      </button>
                    </>
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
                          disabled={loading || savingPrefs || !committedDraft}
                        >
                          Reset lựa chọn
                        </button>
                        <button
                          type="button"
                          className={styles.btnPrimary}
                          disabled={loading || locating || savingPrefs}
                          onClick={applyPrefsAndRegenerate}
                        >
                          {loading || locating ? (
                            <LtButtonLoading label="Đang dựng lịch…" />
                          ) : (
                            "Áp dụng & tạo lại"
                          )}
                        </button>
                      </div>
                      <button
                        type="button"
                        className={`${styles.btnGhost} ${styles.prefsSaveOptionsBtn}`}
                        disabled={loading || locating || savingPrefs}
                        onClick={() => void savePrefsOnly()}
                      >
                        {savingPrefs ? (
                          <LtButtonLoading label="Đang lưu tiêu chí…" />
                        ) : (
                          "Lưu bộ tiêu chí"
                        )}
                      </button>
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

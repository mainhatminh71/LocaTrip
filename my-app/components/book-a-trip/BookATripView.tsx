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
  replacePlaceInTrip,
  resolveTripProgressStatus,
  todayYmdHcm,
  TRIP_PROGRESS_OPTIONS,
  updateSavedTrip,
  updateTripPrefs,
  type CreateSavedTripBody,
  type TripPrefsBody,
  type TripProgressStatus,
} from "@/lib/api/trips";
import { ApiError } from "@/lib/api/http";
import { BOOK_TRIP_ASSETS, BOOK_TRIP_COPY } from "@/lib/book-a-trip-assets";
import {
  DEFAULT_AUTO_TRIP_DRAFT,
  parseDraftHours,
  previewSoftLabels,
  titleForPendingOption,
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
  dayArrayIndex,
  enrichItineraryCoords,
  extractStops,
  stopsForMap,
  summarizeOptionForCard,
  swapVisitPlace,
} from "@/lib/itinerary-map";
import { visitDisplayTitle, visitKindLabel } from "@/lib/place-type";
import { useAuthActions } from "@/components/auth/useAuthActions";
import { useAuthModal } from "@/components/auth/AuthModalProvider";
import { AccountMenu } from "@/components/auth/AccountFab";
import { useToast } from "@/components/ui/ToastProvider";
import { AutoTripPrefsFields } from "./AutoTripPrefsFields";
import { ItineraryMap } from "./ItineraryMap";
import { LtBrandLoader, LtButtonLoading } from "./LtBrandLoader";
import { PlaceStopDetail } from "./PlaceStopDetail";
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
  const [editingTripStatus, setEditingTripStatus] =
    useState<TripProgressStatus | null>(null);
  const [editingPrefsId, setEditingPrefsId] = useState<string | null>(null);
  /** optionId → saved Pending trip id after auto-save from generate. */
  const [optionTripIds, setOptionTripIds] = useState<Record<number, string>>(
    {},
  );
  const [savingGenerated, setSavingGenerated] = useState(false);

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
  const { toastSuccess, toastError } = useToast();
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
        setEditingTripStatus(
          resolveTripProgressStatus(trip) || trip.tripStatus || "OnGoing",
        );
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
    setSavingGenerated(false);
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
      setOptionTripIds({});

      // Persist every generate option as Pending (1..N POSTs).
      setSavingGenerated(true);
      const savedMap = await saveAllOptionsAsPending(
        data.itineraries,
        locationOverride ?? lastLocationOverride,
      );
      setOptionTripIds(savedMap);
      const savedCount = Object.keys(savedMap).length;
      const total = data.itineraries.length;

      if (savedCount === 0) {
        setError(
          "Đã tạo lộ trình nhưng không lưu được nháp Pending. Thử tạo lại hoặc kiểm tra API.",
        );
      } else if (savedCount < total) {
        toastError(
          `Chỉ lưu được ${savedCount}/${total} chuyến nháp. Các lộ trình còn lại có thể tạo lại từ danh sách.`,
        );
      } else {
        toastSuccess(
          total === 1
            ? "Đã tạo lịch và lưu nháp (Đề xuất)."
            : `Đã tạo lịch và lưu ${total} chuyến nháp (Đề xuất).`,
        );
      }

      if (data.itineraries.length === 1) {
        const only = data.itineraries[0]!;
        const tripId = savedMap[only.optionId];
        setSelectedOption(cloneOption(only));
        setPhase("itinerary");
        if (tripId) {
          setEditingTrip(tripId);
          setEditingTripStatus("Pending");
          setDraft((d) => ({ ...d, tripStatus: "Pending" }));
          router.replace(
            `/book-a-trip/?edit=${encodeURIComponent(tripId)}`,
            { scroll: false },
          );
        }
      } else {
        setSelectedOption(null);
        setPhase("options");
        setEditingTrip(null);
        setEditingTripStatus(null);
        if (editTripId || fromTripId) {
          router.replace("/book-a-trip/", { scroll: false });
        }
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
      setSavingGenerated(false);
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
    setEditingTripStatus(null);
    setEditingPrefsId(null);
    setOptionTripIds({});
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
    const linkedId = optionTripIds[opt.optionId];
    if (linkedId) {
      setEditingTrip(linkedId);
      setEditingTripStatus("Pending");
      setDraft((d) => ({ ...d, tripStatus: "Pending" }));
      router.replace(`/book-a-trip/?edit=${encodeURIComponent(linkedId)}`, {
        scroll: false,
      });
    }
  }

  function selectStop(key: string) {
    setSelectedStopKey(key);
  }

  const activeTripId = editingTripId || savedTripId;
  const dateIsPast =
    Boolean(activeTripId) &&
    Boolean(draft.date) &&
    draft.date.trim().slice(0, 10) < todayYmdHcm();
  const isTripDone = editingTripStatus === "Done" || dateIsPast;
  const isTripPending = !isTripDone && editingTripStatus === "Pending";
  const progressLabel =
    TRIP_PROGRESS_OPTIONS.find(
      (o) =>
        o.value ===
        (isTripDone
          ? "Done"
          : editingTripStatus ||
            (activeTripId ? "OnGoing" : "Pending")),
    )?.label || "Đề xuất";

  function applyReplace(alt: AlternativePlaceSuggestion) {
    const target = replaceStop ?? selectedStop;
    if (!selectedOption || !target) return;
    const next = swapVisitPlace(
      selectedOption,
      target.day,
      target.scheduleIndex,
      alt,
      {
        latitude: target.place.latitude,
        longitude: target.place.longitude,
      },
    );
    setSelectedOption(next);
    setRouteStale(true);
    setReplaceTargetKey(null);
    setSelectedStopKey(null);
    toastSuccess("Đã thay điểm dừng");
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

  async function applyServerReplace(newPlaceId: string) {
    const target = replaceStop ?? selectedStop;
    if (!selectedOption || !target || !activeTripId) return;
    const dayIndex = dayArrayIndex(selectedOption.itinerary, target.day);
    if (dayIndex < 0) {
      throw new Error("Không xác định được ngày trong lịch trình.");
    }
    const { itinerary } = await replacePlaceInTrip(activeTripId, {
      dayIndex,
      scheduleIndex: target.scheduleIndex,
      newPlaceId,
    });
    const next = cloneOption({
      ...selectedOption,
      itinerary,
    });
    setSelectedOption(next);
    setRouteStale(true);
    setReplaceTargetKey(null);
    setSelectedStopKey(null);
    toastSuccess("Đã thay điểm dừng");
    if (result) {
      const itineraries = result.itineraries.map((o) =>
        o.optionId === next.optionId ? next : o,
      );
      setResult({ ...result, itineraries });
    }
  }

  function buildSaveBody(
    option: ItineraryOption,
    tripStatus?: TripProgressStatus,
    opts?: {
      title?: string;
      locationOverride?: { latitude: number; longitude: number } | null;
      optionIndex?: number;
      optionTotal?: number;
    },
  ): CreateSavedTripBody {
    const start = opts?.locationOverride ??
      lastLocationOverride ?? {
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
    const total = opts?.optionTotal ?? 1;
    const index = opts?.optionIndex ?? 0;
    const title =
      opts?.title ??
      titleForPendingOption(draft.title, option.title, index, total);
    return {
      title,
      source: "auto",
      itinerary: option.itinerary,
      date: draft.date.trim().slice(0, 10),
      tripDate: draft.date.trim().slice(0, 10),
      ...(tripStatus ? { tripStatus } : {}),
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
      optionId: option.optionId,
      generatePrefs,
    };
  }

  /**
   * POST every generate option as Pending. Partial failures are reported;
   * returns map of optionId → tripId for successes.
   */
  async function saveAllOptionsAsPending(
    options: ItineraryOption[],
    locationOverride?: { latitude: number; longitude: number } | null,
  ): Promise<Record<number, string>> {
    const identityErr = validateTripTitleAndDate(draft, { allowPast: false });
    if (identityErr) {
      setError(identityErr);
      return {};
    }
    if (!isAuthenticated) {
      openAuth({ next: "/book-a-trip/" });
      return {};
    }

    const total = options.length;
    const settled = await Promise.allSettled(
      options.map((opt, index) =>
        createSavedTrip(
          buildSaveBody(opt, "Pending", {
            locationOverride,
            optionIndex: index,
            optionTotal: total,
          }),
        ).then((trip) => {
          warnIfStatusMismatch("Pending", trip.tripStatus);
          return { optionId: opt.optionId, tripId: trip.id };
        }),
      ),
    );

    const map: Record<number, string> = {};
    const failMsgs: string[] = [];
    settled.forEach((res, i) => {
      if (res.status === "fulfilled") {
        map[res.value.optionId] = res.value.tripId;
      } else {
        const reason = res.reason;
        failMsgs.push(
          options[i]?.title?.slice(0, 36) ||
            (reason instanceof Error ? reason.message : "lỗi"),
        );
      }
    });
    if (failMsgs.length && Object.keys(map).length > 0) {
      console.warn("[LocaTrip] Pending save partial failure:", failMsgs);
    }
    return map;
  }

  function warnIfStatusMismatch(
    expected: TripProgressStatus,
    actual?: TripProgressStatus,
  ) {
    if (!actual || actual === expected) return;
    const want =
      TRIP_PROGRESS_OPTIONS.find((o) => o.value === expected)?.label ||
      expected;
    const got =
      TRIP_PROGRESS_OPTIONS.find((o) => o.value === actual)?.label || actual;
    toastError(
      `Máy chủ trả về “${got}” thay vì “${want}”. Cần cập nhật LocalTrip API để nhận Pending / OnGoing.`,
    );
  }

  type PersistMode =
    | "createPending"
    | "confirmOnGoing"
    | "updatePending"
    | "updateOnGoing";

  async function persistTrip(
    mode: PersistMode,
    option?: ItineraryOption | null,
    tripIdOverride?: string | null,
  ): Promise<string | null> {
    const opt = option ?? selectedOption;
    if (!opt || saving) return null;
    const targetTripId = tripIdOverride || editingTripId;
    if (
      (mode === "confirmOnGoing" ||
        mode === "updatePending" ||
        mode === "updateOnGoing") &&
      !targetTripId
    ) {
      return null;
    }
    if (!isAuthenticated) {
      openAuth({
        next: targetTripId
          ? `/book-a-trip/?edit=${encodeURIComponent(targetTripId)}`
          : "/book-a-trip/",
      });
      return null;
    }
    const identityErr = validateTripTitleAndDate(draft, {
      allowPast: Boolean(targetTripId),
    });
    if (identityErr) {
      setError(identityErr);
      return null;
    }

    const statusForBody: TripProgressStatus | undefined =
      mode === "createPending"
        ? "Pending"
        : mode === "confirmOnGoing"
          ? "OnGoing"
          : undefined;
    const body = buildSaveBody(opt, statusForBody, {
      optionIndex: 0,
      optionTotal: 1,
    });

    setSaving(true);
    setError(null);
    try {
      if (mode === "createPending") {
        const trip = await createSavedTrip(body);
        warnIfStatusMismatch("Pending", trip.tripStatus);
        setEditingTrip(trip.id);
        setEditingTripStatus(trip.tripStatus || "Pending");
        setSavedTripId(trip.id);
        setDraft((d) => ({
          ...d,
          tripStatus: trip.tripStatus || "Pending",
        }));
        toastSuccess("Đã tạo nháp (Đề xuất).");
        return trip.id;
      }

      const tripId = targetTripId!;
      const trip = await updateSavedTrip(tripId, body);
      if (mode === "confirmOnGoing") {
        warnIfStatusMismatch("OnGoing", trip.tripStatus);
        setEditingTripStatus(trip.tripStatus || "OnGoing");
        setDraft((d) => ({
          ...d,
          tripStatus: trip.tripStatus || "OnGoing",
        }));
        toastSuccess("Đã lưu chính thức.");
      } else {
        setEditingTripStatus(trip.tripStatus || editingTripStatus);
        toastSuccess("Đã cập nhật chuyến đi.");
      }
      setEditingTrip(trip.id);
      setSavedTripId(null);
      return trip.id;
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Không lưu được chuyến đi";
      setError(msg);
      toastError(msg);
      return null;
    } finally {
      setSaving(false);
    }
  }

  /** Retry Pending save for one option that failed during generate. */
  async function retryPendingForOption(opt: ItineraryOption) {
    if (saving || optionTripIds[opt.optionId]) return;
    if (!result) return;
    setSaving(true);
    setError(null);
    try {
      const index = result.itineraries.findIndex(
        (o) => o.optionId === opt.optionId,
      );
      const trip = await createSavedTrip(
        buildSaveBody(opt, "Pending", {
          optionIndex: Math.max(0, index),
          optionTotal: result.itineraries.length,
        }),
      );
      warnIfStatusMismatch("Pending", trip.tripStatus);
      setOptionTripIds((prev) => ({ ...prev, [opt.optionId]: trip.id }));
      toastSuccess("Đã lưu nháp (Đề xuất).");
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Không lưu được nháp";
      setError(msg);
      toastError(msg);
    } finally {
      setSaving(false);
    }
  }

  async function confirmOfficialTrip(tripIdOverride?: string | null) {
    await persistTrip("confirmOnGoing", null, tripIdOverride);
  }

  async function updateCurrentTrip() {
    if (editingTripStatus === "Pending") {
      await persistTrip("updatePending");
      return;
    }
    await persistTrip("updateOnGoing");
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
                  disabled={loading || locating || savingGenerated}
                >
                  {loading || locating || savingGenerated ? (
                    <LtButtonLoading
                      label={
                        locating
                          ? "Đang lấy vị trí…"
                          : savingGenerated
                            ? "Đang lưu nháp…"
                            : "Đang dựng lịch…"
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
                Mỗi lộ trình đã được lưu nháp (Đề xuất). Chọn một cái để xem bản
                đồ và chỉnh.
              </p>
              <ul className={styles.optionList}>
                {result.itineraries.map((opt, idx) => {
                  const card = summarizeOptionForCard(opt);
                  const metaParts = [
                    card.styleLabel,
                    card.stopCount > 0 ? `${card.stopCount} điểm` : null,
                    card.timeRange,
                  ].filter(Boolean);
                  const savedId = optionTripIds[opt.optionId];
                  return (
                    <li key={opt.optionId} className={styles.optionCardWrap}>
                      <div className={styles.optionCardTop}>
                        {savedId ? (
                          <span className={styles.optionPending}>
                            Đã lưu nháp
                          </span>
                        ) : (
                          <button
                            type="button"
                            className={styles.btnGhost}
                            disabled={saving}
                            onClick={() => void retryPendingForOption(opt)}
                          >
                            {saving ? (
                              <LtButtonLoading
                                label="Đang lưu…"
                                onDark={false}
                              />
                            ) : (
                              "Lưu nháp lại"
                            )}
                          </button>
                        )}
                      </div>
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
                      {progressLabel}
                    </p>
                  ) : null}
                  {isTripDone ? (
                    <p className={styles.routeStaleNote}>
                      Chuyến đã hoàn thành — chỉ xem
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
                  {isTripDone ? (
                    <button
                      type="button"
                      className={styles.btnPrimary}
                      onClick={() =>
                        router.push(
                          `/my-trips/${encodeURIComponent(activeTripId || "")}/`,
                        )
                      }
                    >
                      Xem chuyến đã lưu
                    </button>
                  ) : isTripPending && editingTripId ? (
                    <>
                      <button
                        type="button"
                        className={styles.btnPrimary}
                        disabled={saving}
                        onClick={() => void confirmOfficialTrip()}
                      >
                        {saving ? (
                          <LtButtonLoading label="Đang lưu…" />
                        ) : (
                          "Lưu chính thức"
                        )}
                      </button>
                      <button
                        type="button"
                        className={styles.btnGhost}
                        disabled={saving}
                        onClick={() => void updateCurrentTrip()}
                      >
                        Cập nhật nháp
                      </button>
                    </>
                  ) : editingTripId ? (
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
                  ) : selectedOption &&
                    optionTripIds[selectedOption.optionId] ? (
                    <button
                      type="button"
                      className={styles.btnPrimary}
                      disabled={saving}
                      onClick={() => {
                        const id = optionTripIds[selectedOption.optionId];
                        if (!id) return;
                        setEditingTrip(id);
                        setEditingTripStatus("Pending");
                        void confirmOfficialTrip(id);
                      }}
                    >
                      {saving ? (
                        <LtButtonLoading label="Đang lưu…" />
                      ) : (
                        "Lưu chính thức"
                      )}
                    </button>
                  ) : selectedOption ? (
                    <button
                      type="button"
                      className={styles.btnPrimary}
                      disabled={saving}
                      onClick={() => void retryPendingForOption(selectedOption)}
                    >
                      {saving ? (
                        <LtButtonLoading label="Đang lưu nháp…" />
                      ) : (
                        "Lưu nháp lại"
                      )}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className={styles.btnGhost}
                    onClick={() => router.push("/my-trips/")}
                  >
                    Chuyến của tôi
                  </button>
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
                          disabled={
                            loading || locating || savingPrefs || savingGenerated
                          }
                          onClick={applyPrefsAndRegenerate}
                        >
                          {loading || locating || savingGenerated ? (
                            <LtButtonLoading
                              label={
                                savingGenerated
                                  ? "Đang lưu nháp…"
                                  : "Đang dựng lịch…"
                              }
                            />
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
                  {!selectedStop ? (
                    <p className={styles.mapHint}>
                      Chọn một điểm trên danh sách hoặc bản đồ để xem chi tiết
                    </p>
                  ) : null}
                </div>
              </aside>

              {selectedStop && selectedOption ? (
                <PlaceStopDetail
                  stop={selectedStop}
                  tripId={activeTripId}
                  dayIndex={dayArrayIndex(
                    selectedOption.itinerary,
                    selectedStop.day,
                  )}
                  readOnly={isTripDone}
                  replaceBlockedLabel={
                    isTripDone ? "Chuyến đã hoàn thành — chỉ xem" : undefined
                  }
                  onClose={() => setSelectedStopKey(null)}
                  onPickLocal={applyReplace}
                  onPickServer={
                    activeTripId
                      ? (newPlaceId) => applyServerReplace(newPlaceId)
                      : undefined
                  }
                  onSearchMore={
                    isTripDone
                      ? undefined
                      : () => {
                          setReplaceTargetKey(selectedStop.key);
                          setSelectedStopKey(null);
                        }
                  }
                />
              ) : null}

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
                {replaceStop && !isTripDone ? (
                  <ReplacePlaceModal
                    key="replace-modal"
                    stop={replaceStop}
                    tripId={activeTripId}
                    dayIndex={
                      selectedOption
                        ? dayArrayIndex(
                            selectedOption.itinerary,
                            replaceStop.day,
                          )
                        : -1
                    }
                    onClose={() => setReplaceTargetKey(null)}
                    onPick={applyReplace}
                    onPickServer={
                      activeTripId
                        ? (newPlaceId) => applyServerReplace(newPlaceId)
                        : undefined
                    }
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

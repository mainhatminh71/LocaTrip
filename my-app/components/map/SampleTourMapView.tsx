"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import { useSearchParams } from "next/navigation";
import { ItineraryMap, type MapStop } from "@/components/book-a-trip/ItineraryMap";
import { fetchDrivingRouteGeoJSON } from "@/lib/mapbox-directions";
import type { RouteFeatureCollection } from "@/lib/itinerary-map";
import { routeLegColor } from "@/lib/route-leg-colors";
import {
  buildSampleRouteGeoJSON,
  getSampleTour,
  isSampleMapStop,
  listSampleTours,
  sampleMapStops,
} from "@/lib/sample-tours";
import styles from "./sample-tour-map.module.css";

/**
 * Read-only sample itinerary on /map?tour=<slug>.
 * Matches generated trips: road routes, colored legs, rest breaks.
 */
export function SampleTourMapView() {
  const searchParams = useSearchParams();
  const slug = (searchParams.get("tour") || "").trim();
  const tour = slug ? getSampleTour(slug) : null;
  const fallback = listSampleTours()[0]!;
  const active = tour ?? fallback;
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedTravelKey, setSelectedTravelKey] = useState<string | null>(
    null,
  );
  const [routeGeoJSON, setRouteGeoJSON] =
    useState<RouteFeatureCollection | null>(null);

  const mappedStops = useMemo(() => sampleMapStops(active), [active]);

  const mapStops: MapStop[] = useMemo(
    () =>
      mappedStops.map((s, i) => ({
        key: `${active.slug}-visit-${i}`,
        lat: s.latitude!,
        lng: s.longitude!,
        order: i + 1,
        label: s.title,
        category: s.kind,
      })),
    [active.slug, mappedStops],
  );

  useEffect(() => {
    setSelectedKey(null);
    setSelectedTravelKey(null);
    setRouteGeoJSON(buildSampleRouteGeoJSON(active.stops));

    let cancelled = false;
    const points = mappedStops.map((s) => ({
      lng: s.longitude!,
      lat: s.latitude!,
    }));

    void (async () => {
      const geo = await fetchDrivingRouteGeoJSON(points);
      if (cancelled || !geo?.features.length) return;
      setRouteGeoJSON({
        type: "FeatureCollection",
        features: geo.features.map((f, i) => ({
          ...f,
          properties: {
            ...f.properties,
            legIndex: i,
            travelKey: `travel-${i}`,
            color: routeLegColor(i),
          },
        })),
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [active, mappedStops]);

  function selectStop(key: string) {
    setSelectedKey(key);
    setSelectedTravelKey(null);
  }

  function selectTravel(key: string) {
    setSelectedTravelKey(key);
    setSelectedKey(null);
  }

  let visitOrder = 0;
  let travelLegIndex = -1;

  return (
    <div className={styles.root}>
      <aside className={styles.panel}>
        <Link href="/tours/" className={styles.back}>
          ← Mẫu lịch trình
        </Link>
        <p className={styles.eyebrow}>
          {active.days} · {active.filter}
        </p>
        <h1 className={styles.title}>{active.title}</h1>
        <p className={styles.price}>{active.price}</p>
        <p className={styles.summary}>{active.summary}</p>

        <section className={styles.day}>
          <h2 className={styles.dayTitle}>Ngày 1</h2>
          <ul className={styles.timeline}>
            {active.stops.map((stop, i) => {
              const key = `${active.slug}-${i}`;
              const isRest = Boolean(stop.isRest) || !isSampleMapStop(stop);

              if (isRest) {
                return (
                  <li key={key}>
                    <div className={styles.restCard}>
                      <span className={styles.visitTime}>{stop.time}</span>
                      <span className={styles.restDot} aria-hidden>
                        ·
                      </span>
                      <span className={styles.visitBody}>
                        <span className={styles.visitKind}>{stop.kind}</span>
                        <strong>{stop.title}</strong>
                        {stop.note ? (
                          <span className={styles.visitMeta}>{stop.note}</span>
                        ) : null}
                      </span>
                    </div>
                  </li>
                );
              }

              const showTravel = stop.travelMin > 0;
              if (showTravel) travelLegIndex += 1;
              const thisTravelKey = `travel-${travelLegIndex}`;
              const legColor = routeLegColor(
                travelLegIndex >= 0 ? travelLegIndex : 0,
              );
              visitOrder += 1;
              const visitKey = `${active.slug}-visit-${visitOrder - 1}`;
              const activeRow = selectedKey === visitKey;
              const travelActive = selectedTravelKey === thisTravelKey;

              return (
                <li key={key}>
                  {showTravel ? (
                    <button
                      type="button"
                      className={
                        travelActive
                          ? styles.travelRowActive
                          : styles.travelRow
                      }
                      style={
                        {
                          "--travel-leg-color": legColor,
                        } as CSSProperties
                      }
                      onClick={() => selectTravel(thisTravelKey)}
                      aria-pressed={travelActive}
                    >
                      <span className={styles.travelTime}>Di chuyển</span>
                      <span className={styles.travelSwatch} aria-hidden />
                      <div className={styles.travelBody}>
                        <span className={styles.travelLabel}>
                          Di chuyển · {stop.travelMin} phút
                        </span>
                        <span className={styles.travelHint}>
                          Bấm để xem đoạn đường trên bản đồ
                        </span>
                      </div>
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className={
                      activeRow ? styles.visitCardOn : styles.visitCard
                    }
                    onClick={() => selectStop(visitKey)}
                  >
                    <span className={styles.visitTime}>{stop.time}</span>
                    <span className={styles.visitIndex}>{visitOrder}</span>
                    <span className={styles.visitBody}>
                      <span className={styles.visitKind}>{stop.kind}</span>
                      <strong>{stop.title}</strong>
                      {stop.address ? (
                        <span className={styles.visitAddr}>{stop.address}</span>
                      ) : null}
                      <span className={styles.visitMeta}>
                        {stop.rating != null
                          ? `${stop.rating.toFixed(1)}★`
                          : null}
                        {stop.note ? ` · ${stop.note}` : null}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {!tour && slug ? (
          <p className={styles.warn}>
            Không tìm thấy mẫu “{slug}” — đang hiện lịch trình mẫu mặc định.
          </p>
        ) : null}

        <div className={styles.actions}>
          <Link href="/tours/" className={styles.btnGhost}>
            Đổi mẫu khác
          </Link>
          <Link href="/book-a-trip/" className={styles.btnPrimary}>
            Tạo lịch riêng
          </Link>
        </div>
      </aside>

      <div className={styles.map}>
        <ItineraryMap
          className={styles.mapCanvas}
          stops={mapStops}
          selectedKey={selectedKey}
          selectedTravelKey={selectedTravelKey}
          routeGeoJSON={routeGeoJSON}
          onSelectStop={selectStop}
          onClearTravel={() => setSelectedTravelKey(null)}
        />
      </div>
    </div>
  );
}

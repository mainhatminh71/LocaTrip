"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ItineraryMap, type MapStop } from "@/components/book-a-trip/ItineraryMap";
import {
  buildSampleRouteGeoJSON,
  getSampleTour,
  listSampleTours,
} from "@/lib/sample-tours";
import styles from "./sample-tour-map.module.css";

/**
 * Read-only sample itinerary on /map?tour=<slug>.
 * Looks like a real day plan + route on map — all hardcoded, no LocalTrip API.
 */
export function SampleTourMapView() {
  const searchParams = useSearchParams();
  const slug = (searchParams.get("tour") || "").trim();
  const tour = slug ? getSampleTour(slug) : null;
  const fallback = listSampleTours()[0]!;
  const active = tour ?? fallback;
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const mapStops: MapStop[] = useMemo(
    () =>
      active.stops.map((s, i) => ({
        key: `${active.slug}-${i}`,
        lat: s.latitude,
        lng: s.longitude,
        order: i + 1,
        label: s.title,
        category: s.kind,
      })),
    [active],
  );

  const routeGeoJSON = useMemo(
    () => buildSampleRouteGeoJSON(active.stops),
    [active],
  );

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
        <p className={styles.hint}>
          Lịch trình mẫu — xem như chuyến thật trên bản đồ. Điểm dừng & lộ trình
          hardcode, không chỉnh tiêu chí, không gọi API.
        </p>

        <section className={styles.day}>
          <h2 className={styles.dayTitle}>Ngày 1</h2>
          <ul className={styles.timeline}>
            {active.stops.map((stop, i) => {
              const key = `${active.slug}-${i}`;
              const activeRow = selectedKey === key;
              return (
                <li key={key}>
                  {stop.travelMin > 0 ? (
                    <div className={styles.travelItem}>
                      <span className={styles.travelTime}>Di chuyển</span>
                      <span className={styles.travelRail} aria-hidden />
                      <div className={styles.travelBody}>
                        <span className={styles.travelLabel}>
                          Di chuyển · {stop.travelMin} phút
                        </span>
                      </div>
                    </div>
                  ) : null}
                  <button
                    type="button"
                    className={
                      activeRow ? styles.visitCardOn : styles.visitCard
                    }
                    onClick={() => setSelectedKey(key)}
                  >
                    <span className={styles.visitTime}>{stop.time}</span>
                    <span className={styles.visitIndex}>{i + 1}</span>
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
          routeGeoJSON={routeGeoJSON}
          onSelectStop={setSelectedKey}
        />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { TRIP_PROGRESS_OPTIONS } from "@/lib/api/trips";
import type { PublicTrip } from "@/lib/trips/fetch-public-trip";
import { absoluteUrl } from "@/lib/seo";
import { shareOrCopy, tripSharePath } from "@/lib/ui/share";
import { useToast } from "@/components/ui/ToastProvider";
import styles from "@/app/my-trips/my-trips.module.css";

function formatTripDay(ymd?: string) {
  if (!ymd || !/^\d{4}-\d{2}-\d{2}/.test(ymd)) return null;
  try {
    const [y, m, d] = ymd.slice(0, 10).split("-").map(Number);
    return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(
      new Date(y!, (m ?? 1) - 1, d),
    );
  } catch {
    return ymd.slice(0, 10);
  }
}

type Props = { trip: PublicTrip };

export function PublicTripView({ trip }: Props) {
  const { toastSuccess, toastError } = useToast();
  const [sharing, setSharing] = useState(false);

  async function onShare() {
    if (sharing) return;
    setSharing(true);
    try {
      const path = tripSharePath(trip.id);
      const url =
        typeof window !== "undefined"
          ? `${window.location.origin}${path}`
          : absoluteUrl(path);
      const title = trip.title.trim() || "Chuyến đi";
      const result = await shareOrCopy({
        title: `${title} · LocaTrip`,
        text: trip.summary?.trim() || title,
        url,
      });
      if (result.ok && result.method === "clipboard") {
        toastSuccess("Đã sao chép liên kết chuyến đi");
      } else if (!result.ok && !result.cancelled) {
        toastError("Không chia sẻ được. Thử lại sau.");
      }
    } finally {
      setSharing(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <Link href="/book-a-trip/" className={styles.btnGhost}>
          ← Lên lịch trình
        </Link>

        <article className={styles.detailCard}>
          <p className={styles.eyebrow}>Chuyến đi được chia sẻ</p>
          <h1 className={styles.title}>{trip.title}</h1>
          {trip.summary ? <p className={styles.sub}>{trip.summary}</p> : null}
          <p className={styles.meta}>
            {[
              TRIP_PROGRESS_OPTIONS.find((o) => o.value === trip.tripStatus)
                ?.label || null,
              formatTripDay(trip.date || trip.tripDate),
              trip.durationDays
                ? `${trip.durationDays} ngày`
                : `${trip.itinerary?.length || 0} ngày`,
              trip.pace || null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>

          {(trip.itinerary || []).map((day) => (
            <section key={day.day} className={styles.dayBlock}>
              <h2>Ngày {day.day}</h2>
              <ul>
                {(day.schedule || []).map((item, i) => (
                  <li key={`${day.day}-${i}`}>
                    <span className={styles.time}>{item.time}</span>
                    {item.type === "travel" ? (
                      <span className={styles.travel}>
                        Di chuyển
                        {item.durationMin != null
                          ? ` · ${item.durationMin} phút`
                          : ""}
                        {item.instruction ? ` — ${item.instruction}` : ""}
                      </span>
                    ) : (
                      <span>
                        <strong>{item.place?.title || "Địa điểm"}</strong>
                        {item.place?.address
                          ? ` — ${item.place.address}`
                          : ""}
                        {item.place?.placeId ? (
                          <>
                            {" · "}
                            <Link
                              href={`/places/${encodeURIComponent(item.place.placeId)}`}
                            >
                              Xem địa điểm
                            </Link>
                          </>
                        ) : null}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <div className={styles.actionsRow}>
            <button
              type="button"
              className={styles.btnPrimary}
              disabled={sharing}
              onClick={() => void onShare()}
            >
              {sharing ? "Đang chia sẻ…" : "Chia sẻ chuyến đi"}
            </button>
            <Link href="/book-a-trip/" className={styles.btnGhost}>
              Tạo lịch trình của bạn
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}

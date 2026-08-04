"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { PlanMapSlot } from "@/components/map/PlanMapSlot";
import {
  loadAutoTrip,
  type ScheduleItem,
  type StoredAutoTrip,
} from "@/lib/trip";
import styles from "./generated-plan.module.css";

function isVisit(
  item: ScheduleItem,
): item is Extract<ScheduleItem, { type: "visit" }> {
  return item.type === "visit";
}

export function GeneratedPlanView() {
  const [stored, setStored] = useState<StoredAutoTrip | null>(null);
  const [tab, setTab] = useState<"plan" | "map">("plan");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setStored(loadAutoTrip());
    setReady(true);
  }, []);

  const option = stored?.result.itineraries?.[0];

  return (
    <MarketingChrome>
      <main className={styles.page}>
        <header className={styles.hero}>
          <h1>Bắt đầu tạo lịch trình</h1>
          <p>Chia sẻ nơi bạn muốn đi và localtrip sẽ lo phần còn lại</p>
        </header>

        {!ready ? (
          <p className={styles.empty}>Đang tải…</p>
        ) : !option ? (
          <div className={styles.empty}>
            <h2>Chưa có lịch trình</h2>
            <p>Hãy điền form trên trang book-a-trip.</p>
            <Link href="/book-a-trip/" className={styles.cta}>
              ← Quay lại form
            </Link>
          </div>
        ) : (
          <div className={styles.shell}>
            <div className={styles.top}>
              <div>
                <h2>{option.title || "Lịch trình của bạn"}</h2>
                <p className={styles.summary}>{option.summary}</p>
              </div>
              <p className={styles.cost}>{option.totalEstimatedCost}</p>
            </div>

            <div className={styles.tabs}>
              <button
                type="button"
                className={tab === "plan" ? styles.tabOn : styles.tab}
                onClick={() => setTab("plan")}
              >
                Lịch Trình
              </button>
              <button
                type="button"
                className={tab === "map" ? styles.tabOn : styles.tab}
                onClick={() => setTab("map")}
              >
                Bản đồ hành trình
              </button>
            </div>

            {tab === "map" ? (
              <PlanMapSlot className={styles.map} />
            ) : (
              <div className={styles.days}>
                {option.itinerary.map((day) => (
                  <section key={day.day} className={styles.day}>
                    <h3>Ngày {day.day}</h3>
                    <ul>
                      {day.schedule.map((item, i) => (
                        <li key={`${day.day}-${i}`}>
                          <span className={styles.time}>{item.time}</span>
                          {isVisit(item) ? (
                            <div>
                              <strong>{item.place.title}</strong>
                              {item.place.address ? (
                                <p>{item.place.address}</p>
                              ) : null}
                            </div>
                          ) : (
                            <div>
                              <strong>Di chuyển · {item.durationMin} phút</strong>
                              <p>{item.instruction}</p>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            )}

            <div className={styles.actions}>
              <Link href="/book-a-trip/" className={styles.ctaGhost}>
                Chỉnh sửa
              </Link>
              <Link href="/book-a-trip/" className={styles.cta}>
                Tạo lại
              </Link>
            </div>
          </div>
        )}
      </main>
    </MarketingChrome>
  );
}

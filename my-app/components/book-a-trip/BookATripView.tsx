"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BOOK_TRIP_ASSETS, BOOK_TRIP_COPY } from "@/lib/book-a-trip-assets";
import {
  FRAMER_AREA_OPTIONS,
  FRAMER_BUS_OPTIONS,
  FRAMER_INTEREST_OPTIONS,
  FRAMER_PRIORITY_OPTIONS,
  FRAMER_STAY_OPTIONS,
  FRAMER_TRIP_LEG_OPTIONS,
  mapAreaToRadiusKm,
  mapAreaToStartId,
  mapBudgetMillion,
  mapInterestToPreferences,
  mapPeopleToCustomer,
  mapPriorityToPace,
  mapPriorityToTripType,
} from "@/lib/book-a-trip-form";
import {
  START_PRESETS,
  type AutoTripRequest,
  type AutoTripResult,
  saveAutoTrip,
} from "@/lib/trip";
import { SiteConversion } from "@/components/layout/SiteConversion";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import styles from "./book-a-trip.module.css";

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 3.8c.4-.5 1.1-.6 1.6-.3l2.1 1.3c.5.3.7.9.5 1.4L10.4 9c-.1.4 0 .8.3 1.1l3.2 3.2c.3.3.7.4 1.1.3l2.8-.8c.5-.2 1.1 0 1.4.5l1.3 2.1c.3.5.2 1.2-.3 1.6l-1.1 1c-.8.7-1.9 1-3 .6-2.5-.9-5.3-3.1-7.6-5.4S4.2 9.3 3.3 6.8c-.4-1.1-.1-2.2.6-3l1.1-1Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4.5 7.5 12 13l7.5-5.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s6.5-5 6.5-10.2A6.5 6.5 0 0 0 5.5 10.8C5.5 16 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="10.5" r="2.2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function BookATripView() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  /* Framer form state (Option A) — API mapping happens on submit only */
  const [departureDate, setDepartureDate] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [people, setPeople] = useState("");
  const [budgetMillion, setBudgetMillion] = useState("");
  const [area, setArea] = useState("");
  const [interest, setInterest] = useState("");
  const [priority, setPriority] = useState("");
  const [stay, setStay] = useState("");
  const [bus, setBus] = useState("");
  const [tripLeg, setTripLeg] = useState("");
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agree) {
      setError("Vui lòng đồng ý với các chính sách của LocaTrip");
      return;
    }
    if (!area || area === "Chọn khu vực") {
      setError("Vui lòng chọn khu vực");
      return;
    }
    if (!interest || interest === "Chọn sở thích") {
      setError("Vui lòng chọn sở thích");
      return;
    }
    setError(null);
    setLoading(true);

    const startId = mapAreaToStartId(area);
    const preset =
      START_PRESETS.find((p) => p.id === startId) ?? START_PRESETS[0];
    const preferences = mapInterestToPreferences(interest);

    const request: AutoTripRequest = {
      startLatitude: preset.latitude,
      startLongitude: preset.longitude,
      radiusKm: mapAreaToRadiusKm(area),
      budgetLevel: mapBudgetMillion(budgetMillion),
      tripType: mapPriorityToTripType(priority),
      targetCustomer: mapPeopleToCustomer(people),
      preferences,
      pace: mapPriorityToPace(priority),
      showRoad: true,
      startTimePerDay: "08:30",
      endTimePerDay: "21:30",
    };

    try {
      const res = await fetch("/api/trips/generate/auto/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      const data = (await res.json()) as AutoTripResult & { error?: string };
      if (!res.ok) throw new Error(data.error || `Lỗi ${res.status}`);
      if (!data.itineraries?.length) {
        throw new Error(
          "Không có lộ trình phù hợp. Thử đổi khu vực / sở thích / ngân sách.",
        );
      }
      saveAutoTrip({
        request,
        result: data,
        createdAt: new Date().toISOString(),
      });
      router.push("/generated-plan/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tạo được lịch trình");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      {/* Section 1 — Framer fixed nav (qWghg). Do not restyle other sections here. */}
      <SiteNav open={menuOpen} onOpenChange={setMenuOpen} />

      {/* Framer Header (framer-1wpwdg2): padding 200px 0 0, black, absolute BG image */}
      <header className={styles.hero} data-framer-name="Header">
        <div className={styles.heroBgWrap} data-framer-name="Background Image">
          <Image
            className={styles.heroBg}
            src={BOOK_TRIP_ASSETS.heroBg}
            alt=""
            fill
            priority
            sizes="100vw"
            data-framer-name="Image"
            style={{ opacity: 0.4, transform: "scale(1.15)" }}
          />
        </div>
        <div className={styles.heroInner} data-framer-name="Content">
          <div className={styles.heroCopy} data-framer-name="Titles">
            <h1 data-framer-name="Main Title">{BOOK_TRIP_COPY.heroTitle}</h1>
            <p data-framer-name="Sub Title">{BOOK_TRIP_COPY.heroSub}</p>
          </div>
        </div>
        {/* Framer framer-1qubwfb — white top-radius strip under header */}
        <div className={styles.heroCurve} aria-hidden />
      </header>

      <section className={styles.sheet}>
        <div className={styles.card}>
          <aside className={styles.left}>
            <h2 className={styles.leftTitle}>{BOOK_TRIP_COPY.leftTitle}</h2>
            <p className={styles.leftSub}>{BOOK_TRIP_COPY.leftSub}</p>
            <div className={styles.photoWrap}>
              <Image
                src={BOOK_TRIP_ASSETS.groupPhoto}
                alt="Du khách Đà Lạt"
                width={900}
                height={600}
                className={styles.photo}
                sizes="(max-width: 980px) 100vw, 480px"
                priority
              />
            </div>
            <p className={styles.supportTitle}>{BOOK_TRIP_COPY.supportTitle}</p>
            <div className={styles.supportGrid}>
              <div className={styles.supportItem}>
                <span>
                  <PhoneIcon />
                </span>
                {BOOK_TRIP_COPY.phone}
              </div>
              <div className={styles.supportItem}>
                <span>
                  <MailIcon />
                </span>
                {BOOK_TRIP_COPY.email}
              </div>
              <div className={styles.supportItem}>
                <span>
                  <PinIcon />
                </span>
                {BOOK_TRIP_COPY.address}
              </div>
            </div>
          </aside>

          <form className={styles.formShell} onSubmit={onSubmit} data-framer-name="Form">
            <div className={styles.secBlock}>
              <p className={styles.secTitle}>Thông tin cốt lõi</p>
              <div className={styles.fields}>
                <label className={styles.field}>
                  Ngày khởi hành
                  <input
                    type="date"
                    name="departureDate"
                    required
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  Thời lượng
                  <input
                    type="number"
                    name="durationDays"
                    required
                    min={1}
                    placeholder="Đơn vị: Ngày"
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  Đi mấy người?
                  <input
                    type="number"
                    name="people"
                    required
                    min={1}
                    max={10}
                    placeholder="Đi mấy người?"
                    value={people}
                    onChange={(e) => setPeople(e.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  Ngân sách
                  <input
                    type="number"
                    name="budgetMillion"
                    required
                    min={1}
                    max={50}
                    placeholder="Đơn vị: Triệu đồng"
                    value={budgetMillion}
                    onChange={(e) => setBudgetMillion(e.target.value)}
                  />
                </label>
              </div>
            </div>

            <div className={styles.secBlock}>
              <p className={styles.secTitle}>Cá nhân hóa</p>
              <div className={styles.fields}>
                <label className={styles.field}>
                  Khu vực
                  <select
                    name="area"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                  >
                    {FRAMER_AREA_OPTIONS.map((o) => (
                      <option key={o} value={o === "Chọn khu vực" ? "" : o} disabled={o === "Chọn khu vực"}>
                        {o}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={styles.field}>
                  Sở thích
                  <select
                    name="interest"
                    required
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                  >
                    {FRAMER_INTEREST_OPTIONS.map((o) => (
                      <option key={o} value={o === "Chọn sở thích" ? "" : o} disabled={o === "Chọn sở thích"}>
                        {o}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={styles.field}>
                  Ưu tiên trong chuyến đi
                  <select
                    name="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    {FRAMER_PRIORITY_OPTIONS.map((o) => (
                      <option
                        key={o}
                        value={o === "Loại hình lưu trú" ? "" : o}
                        disabled={o === "Loại hình lưu trú"}
                      >
                        {o}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={styles.field}>
                  Loại hình lưu trú ưu tiên
                  <select
                    name="stay"
                    value={stay}
                    onChange={(e) => setStay(e.target.value)}
                  >
                    {FRAMER_STAY_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className={styles.secBlock}>
              <p className={styles.secTitle}>Di chuyển</p>
              <div className={styles.fields}>
                <label className={styles.field}>
                  Nhà xe
                  <select
                    name="bus"
                    value={bus}
                    onChange={(e) => setBus(e.target.value)}
                  >
                    {FRAMER_BUS_OPTIONS.map((o) => (
                      <option key={o} value={o === "Chọn nhà xe" ? "" : o} disabled={o === "Chọn nhà xe"}>
                        {o}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={styles.field}>
                  Hành trình
                  <select
                    name="tripLeg"
                    value={tripLeg}
                    onChange={(e) => setTripLeg(e.target.value)}
                  >
                    {FRAMER_TRIP_LEG_OPTIONS.map((o) => (
                      <option key={o} value={o === "Chọn hành trình" ? "" : o} disabled={o === "Chọn hành trình"}>
                        {o}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <label className={styles.agree}>
              <input
                type="checkbox"
                name="Newsletter"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              {BOOK_TRIP_COPY.agree}
            </label>

            <button className={styles.submit} type="submit" disabled={loading}>
              {loading ? "Đang tạo…" : BOOK_TRIP_COPY.submit}
            </button>
            {error ? <p className={styles.error}>{error}</p> : null}
          </form>
        </div>
      </section>

      <SiteConversion ctaHref="#top" />
      <SiteFooter />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";
import { getMyVibe, type UserVibeResult } from "@/lib/api/trips";
import { labelForValue } from "@/lib/auto-trip-form";
import { VIBE_PREFS_STORAGE_KEY } from "@/lib/saved-trip-draft";
import { ApiError } from "@/lib/api/http";
import styles from "@/app/account/account.module.css";

export function UserVibeCard() {
  const router = useRouter();
  const auth = useAuth();
  const [vibe, setVibe] = useState<UserVibeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.isLoading) return;
    if (!auth.isAuthenticated || !auth.user?.access_token) {
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    void (async () => {
      try {
        const data = await getMyVibe();
        if (!cancelled) {
          setVibe(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : err instanceof Error
                ? err.message
                : "Không tải được phong cách đi chơi",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [auth.isLoading, auth.isAuthenticated, auth.user?.access_token]);

  function applyVibe() {
    if (!vibe?.suggestedPrefs) return;
    try {
      sessionStorage.setItem(
        VIBE_PREFS_STORAGE_KEY,
        JSON.stringify(vibe.suggestedPrefs),
      );
    } catch {
      // ignore quota / private mode
    }
    router.push("/book-a-trip/?vibe=1");
  }

  if (loading) {
    return (
      <section className={styles.vibeCard} aria-busy="true">
        <p className={styles.eyebrow}>Phong cách đi chơi</p>
        <p className={styles.sub}>Đang phân tích lịch đã lưu…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.vibeCard}>
        <p className={styles.eyebrow}>Phong cách đi chơi</p>
        <p className={styles.sub}>{error}</p>
      </section>
    );
  }

  if (!vibe || vibe.status === "insufficient") {
    return (
      <section className={styles.vibeCard}>
        <p className={styles.eyebrow}>Phong cách đi chơi</p>
        <h2 className={styles.vibeTitle}>Chưa đủ dữ liệu</h2>
        <p className={styles.sub}>
          {vibe?.message ||
            "Lưu thêm vài lịch trình để LocalTrip hiểu vibe của bạn."}
        </p>
        <p className={styles.vibeMeta}>
          Đã có {vibe?.sample.tripCount ?? 0} chuyến ·{" "}
          {vibe?.sample.placeVisitCount ?? 0} địa điểm
        </p>
        <div className={styles.actions}>
          <Link href="/book-a-trip/" className={styles.btnPrimary}>
            Tạo lịch mới
          </Link>
          <Link href="/my-trips/" className={styles.btnGhost}>
            Xem chuyến đã lưu
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.vibeCard}>
      <p className={styles.eyebrow}>Phong cách đi chơi của bạn</p>
      <h2 className={styles.vibeTitle}>{vibe.vibe?.label}</h2>
      <p className={styles.sub}>{vibe.vibe?.blurb}</p>
      {vibe.secondaryVibe ? (
        <p className={styles.vibeSecondary}>
          Gần với: {vibe.secondaryVibe.label}
        </p>
      ) : null}
      <p className={styles.vibeMeta}>
        Độ tin cậy {Math.round((vibe.confidence || 0) * 100)}% ·{" "}
        {vibe.sample.tripCount} chuyến · {vibe.sample.placeVisitCount} địa điểm
      </p>

      {vibe.topTags.length > 0 ? (
        <ul className={styles.vibeChips}>
          {vibe.topTags.slice(0, 8).map((t) => (
            <li key={t.tag}>{labelForValue(t.tag)}</li>
          ))}
        </ul>
      ) : null}

      {(() => {
        const namedPlaces = vibe.topPlaces.filter((p) => {
          const t = (p.title || "").trim();
          if (!t || t === p.placeId) return false;
          if (/^ChIJ[\w-]+$/.test(t)) return false;
          return true;
        });
        if (namedPlaces.length === 0) return null;
        return (
          <div className={styles.vibePlaces}>
            <p className={styles.vibePlacesLabel}>Địa điểm hay ghé</p>
            <ul>
              {namedPlaces.slice(0, 4).map((p) => (
                <li key={p.placeId}>
                  {p.title}
                  <span>×{p.count}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })()}

      <div className={styles.actions}>
        <button type="button" className={styles.btnPrimary} onClick={applyVibe}>
          Dùng cho chuyến mới
        </button>
        <Link href="/book-a-trip/" className={styles.btnGhost}>
          Tự chọn tiêu chí
        </Link>
      </div>
    </section>
  );
}

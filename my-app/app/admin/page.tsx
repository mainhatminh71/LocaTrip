"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { RequireAuth, RequireRole } from "@/components/auth/RequireAuth";
import { getAdminUsers, type AdminUserRow } from "@/lib/api/admin";
import { LtBrandLoader } from "@/components/book-a-trip/LtBrandLoader";
import styles from "./admin.module.css";

const PAGE_SIZE = 10;

function formatWhen(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    dateStyle: "short",
    timeStyle: "short",
  });
}

function formatVnd(n: number): string {
  return `${Math.round(n).toLocaleString("vi-VN")}₫`;
}

function UserDetailModal({
  user,
  onClose,
}: {
  user: AdminUserRow;
  onClose: () => void;
}) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className={styles.modalBackdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-user-detail-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modalCard}>
        <div className={styles.modalHead}>
          <div>
            <p className={styles.eyebrow}>Chi tiết user</p>
            <h2 id="admin-user-detail-title">{user.displayName}</h2>
            <p className={styles.sub}>{user.email || "—"}</p>
          </div>
          <button
            type="button"
            className={styles.modalClose}
            aria-label="Đóng"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className={styles.detailGrid}>
          <section>
            <h3>Keycloak / tài khoản</h3>
            <dl className={styles.dl}>
              <div>
                <dt>Sub</dt>
                <dd>
                  <code>{user.keycloak.sub || "—"}</code>
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{user.keycloak.email || "—"}</dd>
              </div>
              <div>
                <dt>Display name</dt>
                <dd>{user.keycloak.displayName || "—"}</dd>
              </div>
              <div>
                <dt>Role (app)</dt>
                <dd>{user.keycloak.appRole}</dd>
              </div>
              <div>
                <dt>User id (Mongo)</dt>
                <dd>
                  <code>{user.id}</code>
                </dd>
              </div>
              <div>
                <dt>Active</dt>
                <dd>{user.isActive ? "yes" : "no"}</dd>
              </div>
              <div>
                <dt>Created</dt>
                <dd>{formatWhen(user.createdAt)}</dd>
              </div>
              <div>
                <dt>Updated</dt>
                <dd>{formatWhen(user.updatedAt)}</dd>
              </div>
              <div>
                <dt>Last login</dt>
                <dd>{formatWhen(user.lastLoginAt)}</dd>
              </div>
            </dl>
          </section>
          <section>
            <h3>Ví & thanh toán</h3>
            <dl className={styles.dl}>
              <div>
                <dt>Số dư xu</dt>
                <dd>{user.wallet.balance}</dd>
              </div>
              <div>
                <dt>Xu đã nạp</dt>
                <dd>
                  {user.wallet.xuToppedUp} ({user.wallet.topupCount} lần)
                </dd>
              </div>
              <div>
                <dt>VND đã trả (paid)</dt>
                <dd>
                  {formatVnd(user.payments.vndPaid)} ({user.payments.paidCount}{" "}
                  lần)
                </dd>
              </div>
              <div>
                <dt>Số chuyến đi</dt>
                <dd>{user.trips.count}</dd>
              </div>
            </dl>
          </section>
          <section className={styles.feedbackSection}>
            <h3>Feedback gần đây</h3>
            {user.feedback.recent.length === 0 ? (
              <p className={styles.sub}>Chưa có feedback.</p>
            ) : (
              <ul className={styles.feedbackList}>
                {user.feedback.recent.map((f, i) => (
                  <li key={`${user.id}-fb-${i}`}>
                    <div className={styles.feedbackMeta}>
                      <strong>★{f.rating}</strong>
                      <span>{formatWhen(f.createdAt)}</span>
                      {f.tripTitle ? (
                        <span className={styles.muted}>{f.tripTitle}</span>
                      ) : null}
                    </div>
                    <p>{f.comment || "(không nội dung)"}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function UsersPanel() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminUsers();
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const hay = [u.email, u.displayName, u.keycloakSub, u.role, u.id]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [users, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);

  useEffect(() => {
    setPage(1);
  }, [query]);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const pageRows = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const selectedUser = useMemo(
    () => (selectedId ? users.find((u) => u.id === selectedId) ?? null : null),
    [selectedId, users],
  );

  const totals = useMemo(() => {
    return filtered.reduce(
      (acc, u) => {
        acc.trips += u.trips.count;
        acc.xu += u.wallet.xuToppedUp;
        acc.vnd += u.payments.vndPaid;
        acc.feedback += u.feedback.count;
        if (u.payments.paidCount > 0 || u.wallet.topupCount > 0) {
          acc.transactingUsers += 1;
        }
        return acc;
      },
      { trips: 0, xu: 0, vnd: 0, feedback: 0, transactingUsers: 0 },
    );
  }, [filtered]);

  const rangeStart = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(safePage * PAGE_SIZE, filtered.length);

  return (
    <div className={styles.panelWide}>
      <div className={styles.panelHead}>
        <div>
          <p className={styles.eyebrow}>Admin</p>
          <h1>Người dùng</h1>
          <p className={styles.sub}>
            Toàn bộ tài khoản: Keycloak, nạp xu/VND, feedback, số chuyến đi.
          </p>
        </div>
        <button
          type="button"
          className={styles.btnGhost}
          disabled={loading}
          onClick={() => void refresh()}
        >
          {loading ? "Đang tải…" : "Làm mới"}
        </button>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Users</span>
          <strong>{filtered.length}</strong>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Đã giao dịch</span>
          <strong>{totals.transactingUsers}</strong>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Chuyến đi</span>
          <strong>{totals.trips}</strong>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Xu đã nạp</span>
          <strong>{totals.xu.toLocaleString("vi-VN")}</strong>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>VND đã trả</span>
          <strong>{formatVnd(totals.vnd)}</strong>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Feedback</span>
          <strong>{totals.feedback}</strong>
        </div>
      </div>

      <label className={styles.searchLabel}>
        <span className={styles.srOnly}>Tìm user</span>
        <input
          className={styles.search}
          type="search"
          placeholder="Tìm email, tên, keycloak sub…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      {error ? <p className={styles.error}>{error}</p> : null}

      {loading && users.length === 0 ? (
        <LtBrandLoader size="md" tone="onLight" label="Đang tải users…" />
      ) : (
        <>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Người dùng</th>
                  <th>Tạo lúc</th>
                  <th>Đăng nhập gần nhất</th>
                  <th>Xu / nạp</th>
                  <th>VND đã trả</th>
                  <th>Chuyến</th>
                  <th>Feedback</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {pageRows.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className={styles.userCell}>
                        <strong>{u.displayName || "—"}</strong>
                        <span>{u.email || "—"}</span>
                        <span className={styles.badge}>{u.role}</span>
                      </div>
                    </td>
                    <td>{formatWhen(u.createdAt)}</td>
                    <td>{formatWhen(u.lastLoginAt)}</td>
                    <td>
                      <div className={styles.numCell}>
                        <strong>{u.wallet.balance}</strong>
                        <span>
                          +{u.wallet.xuToppedUp} ({u.wallet.topupCount} lần)
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.numCell}>
                        <strong>{formatVnd(u.payments.vndPaid)}</strong>
                        <span>{u.payments.paidCount} lần</span>
                      </div>
                    </td>
                    <td>{u.trips.count}</td>
                    <td>
                      {u.feedback.count === 0
                        ? "—"
                        : `${u.feedback.count}${
                            u.feedback.avgRating != null
                              ? ` · ★${u.feedback.avgRating}`
                              : ""
                          }`}
                    </td>
                    <td>
                      <button
                        type="button"
                        className={styles.btnLink}
                        onClick={() => setSelectedId(u.id)}
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 ? (
              <p className={styles.subEmpty}>Không có user khớp tìm kiếm.</p>
            ) : null}
          </div>

          {filtered.length > 0 ? (
            <div className={styles.pagination}>
              <p className={styles.pageMeta}>
                {rangeStart}–{rangeEnd} / {filtered.length}
              </p>
              <div className={styles.pageControls}>
                <button
                  type="button"
                  className={styles.pageBtn}
                  disabled={safePage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Trước
                </button>
                <span className={styles.pageIndicator}>
                  Trang {safePage} / {pageCount}
                </span>
                <button
                  type="button"
                  className={styles.pageBtn}
                  disabled={safePage >= pageCount}
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                >
                  Sau
                </button>
              </div>
            </div>
          ) : null}
        </>
      )}

      {selectedUser ? (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedId(null)}
        />
      ) : null}
    </div>
  );
}

export default function AdminPage() {
  return (
    <MarketingChrome hideConversion>
      <main className={styles.page}>
        <RequireAuth nextPath="/admin/">
          <RequireRole role="admin">
            <div className={styles.shell}>
              <UsersPanel />
            </div>
          </RequireRole>
        </RequireAuth>
      </main>
    </MarketingChrome>
  );
}

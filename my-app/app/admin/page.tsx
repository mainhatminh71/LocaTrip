"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { RequireAuth, RequireRole } from "@/components/auth/RequireAuth";
import { apiFetch, ApiError } from "@/lib/api/http";
import { getAdminUsers, type AdminUserRow } from "@/lib/api/admin";
import { LtBrandLoader, LtButtonLoading } from "@/components/book-a-trip/LtBrandLoader";
import styles from "./admin.module.css";

type AdminTab = "users" | "import";

type ImportStatus = {
  pending?: number;
  failed?: number;
  processing?: number;
  [key: string]: unknown;
};

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

function UsersPanel() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
      const hay = [
        u.email,
        u.displayName,
        u.keycloakSub,
        u.role,
        u.id,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [users, query]);

  const totals = useMemo(() => {
    return filtered.reduce(
      (acc, u) => {
        acc.trips += u.trips.count;
        acc.xu += u.wallet.xuToppedUp;
        acc.vnd += u.payments.vndPaid;
        acc.feedback += u.feedback.count;
        return acc;
      },
      { trips: 0, xu: 0, vnd: 0, feedback: 0 },
    );
  }, [filtered]);

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
              {filtered.map((u) => {
                const open = expandedId === u.id;
                return (
                  <tr key={u.id} className={open ? styles.rowOpen : undefined}>
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
                        onClick={() =>
                          setExpandedId((id) => (id === u.id ? null : u.id))
                        }
                      >
                        {open ? "Thu gọn" : "Chi tiết"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 ? (
            <p className={styles.sub}>Không có user khớp tìm kiếm.</p>
          ) : null}
        </div>
      )}

      {expandedId
        ? (() => {
            const u = users.find((x) => x.id === expandedId);
            if (!u) return null;
            return (
              <div className={styles.detailCard}>
                <h2>{u.displayName}</h2>
                <div className={styles.detailGrid}>
                  <section>
                    <h3>Keycloak / tài khoản</h3>
                    <dl className={styles.dl}>
                      <div>
                        <dt>Sub</dt>
                        <dd>
                          <code>{u.keycloak.sub || "—"}</code>
                        </dd>
                      </div>
                      <div>
                        <dt>Email</dt>
                        <dd>{u.keycloak.email || "—"}</dd>
                      </div>
                      <div>
                        <dt>Display name</dt>
                        <dd>{u.keycloak.displayName || "—"}</dd>
                      </div>
                      <div>
                        <dt>Role (app)</dt>
                        <dd>{u.keycloak.appRole}</dd>
                      </div>
                      <div>
                        <dt>User id (Mongo)</dt>
                        <dd>
                          <code>{u.id}</code>
                        </dd>
                      </div>
                      <div>
                        <dt>Active</dt>
                        <dd>{u.isActive ? "yes" : "no"}</dd>
                      </div>
                      <div>
                        <dt>Created</dt>
                        <dd>{formatWhen(u.createdAt)}</dd>
                      </div>
                      <div>
                        <dt>Updated</dt>
                        <dd>{formatWhen(u.updatedAt)}</dd>
                      </div>
                      <div>
                        <dt>Last login</dt>
                        <dd>{formatWhen(u.lastLoginAt)}</dd>
                      </div>
                    </dl>
                  </section>
                  <section>
                    <h3>Ví & thanh toán</h3>
                    <dl className={styles.dl}>
                      <div>
                        <dt>Số dư xu</dt>
                        <dd>{u.wallet.balance}</dd>
                      </div>
                      <div>
                        <dt>Xu đã nạp</dt>
                        <dd>
                          {u.wallet.xuToppedUp} ({u.wallet.topupCount} lần)
                        </dd>
                      </div>
                      <div>
                        <dt>VND đã trả (paid)</dt>
                        <dd>
                          {formatVnd(u.payments.vndPaid)} (
                          {u.payments.paidCount} lần)
                        </dd>
                      </div>
                      <div>
                        <dt>Số chuyến đi</dt>
                        <dd>{u.trips.count}</dd>
                      </div>
                    </dl>
                  </section>
                  <section className={styles.feedbackSection}>
                    <h3>Feedback gần đây</h3>
                    {u.feedback.recent.length === 0 ? (
                      <p className={styles.sub}>Chưa có feedback.</p>
                    ) : (
                      <ul className={styles.feedbackList}>
                        {u.feedback.recent.map((f, i) => (
                          <li key={`${u.id}-fb-${i}`}>
                            <div className={styles.feedbackMeta}>
                              <strong>★{f.rating}</strong>
                              <span>{formatWhen(f.createdAt)}</span>
                              {f.tripTitle ? (
                                <span className={styles.muted}>
                                  {f.tripTitle}
                                </span>
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
            );
          })()
        : null}
    </div>
  );
}

function ImportPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ImportStatus | null>(null);

  const refreshStatus = useCallback(async () => {
    setStatusLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/api/admin/import-status/", {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      const data = (await res.json()) as ImportStatus & { error?: string };
      if (!res.ok) throw new ApiError(data.error || "Lỗi status", res.status);
      setStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không lấy được status");
    } finally {
      setStatusLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshStatus();
  }, [refreshStatus]);

  async function onUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Chọn file CSV trước");
      return;
    }
    setUploading(true);
    setError(null);
    setMessage(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await apiFetch("/api/admin/import-csv/", {
        method: "POST",
        body: form,
      });
      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) throw new ApiError(data.error || "Import thất bại", res.status);
      setMessage(data.message || "Đã gửi import CSV");
      setFile(null);
      await refreshStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import thất bại");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={styles.panel}>
      <p className={styles.eyebrow}>Admin</p>
      <h1>Import địa điểm (CSV)</h1>
      <p className={styles.sub}>
        Chỉ tài khoản role <code>admin</code>. File gửi qua proxy tới LocalTrip.
      </p>

      <form className={styles.form} onSubmit={(e) => void onUpload(e)}>
        <label className={styles.fileLabel}>
          <span>File CSV</span>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        {file ? <p className={styles.fileName}>{file.name}</p> : null}
        <button type="submit" className={styles.btnPrimary} disabled={uploading}>
          {uploading ? (
            <LtButtonLoading label="Đang tải lên…" />
          ) : (
            "Import CSV"
          )}
        </button>
      </form>

      {message ? <p className={styles.ok}>{message}</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}

      <div className={styles.statusBox}>
        <div className={styles.statusHead}>
          <h2>Trạng thái import</h2>
          <button
            type="button"
            className={styles.btnGhost}
            disabled={statusLoading}
            onClick={() => void refreshStatus()}
          >
            {statusLoading ? "Đang tải…" : "Làm mới"}
          </button>
        </div>
        {statusLoading && !status ? (
          <LtBrandLoader size="md" tone="onLight" label="Đang tải status…" />
        ) : status ? (
          <pre className={styles.pre}>{JSON.stringify(status, null, 2)}</pre>
        ) : (
          <p className={styles.sub}>Chưa có dữ liệu status.</p>
        )}
      </div>
    </div>
  );
}

function AdminShell() {
  const [tab, setTab] = useState<AdminTab>("users");

  return (
    <div className={styles.shell}>
      <div className={styles.tabs} role="tablist" aria-label="Admin sections">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "users"}
          className={tab === "users" ? styles.tabActive : styles.tab}
          onClick={() => setTab("users")}
        >
          Người dùng
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "import"}
          className={tab === "import" ? styles.tabActive : styles.tab}
          onClick={() => setTab("import")}
        >
          Import CSV
        </button>
      </div>
      {tab === "users" ? <UsersPanel /> : <ImportPanel />}
    </div>
  );
}

export default function AdminPage() {
  return (
    <MarketingChrome hideConversion>
      <main className={styles.page}>
        <RequireAuth nextPath="/admin/">
          <RequireRole role="admin">
            <AdminShell />
          </RequireRole>
        </RequireAuth>
      </main>
    </MarketingChrome>
  );
}

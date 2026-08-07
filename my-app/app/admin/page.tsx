"use client";

import { useCallback, useEffect, useState } from "react";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { RequireAuth, RequireRole } from "@/components/auth/RequireAuth";
import { apiFetch, ApiError } from "@/lib/api/http";
import { LtBrandLoader, LtButtonLoading } from "@/components/book-a-trip/LtBrandLoader";
import styles from "./admin.module.css";

type ImportStatus = {
  pending?: number;
  failed?: number;
  processing?: number;
  [key: string]: unknown;
};

function AdminPanel() {
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

export default function AdminPage() {
  return (
    <MarketingChrome hideConversion>
      <main className={styles.page}>
        <RequireAuth nextPath="/admin/">
          <RequireRole role="admin">
            <AdminPanel />
          </RequireRole>
        </RequireAuth>
      </main>
    </MarketingChrome>
  );
}

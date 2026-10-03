"use client";

import { motion } from "framer-motion";
import type { DayReorderStats, ReorderDayPreviewResult } from "@/lib/api/trips";
import { LtButtonLoading } from "./LtBrandLoader";
import styles from "./book-a-trip.module.css";

type Props = {
  dayNumber: number;
  visitTitles: string[];
  preview: ReorderDayPreviewResult;
  applying?: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
};

function fmtKm(n: number) {
  return `${Number(n).toFixed(1)} km`;
}

function fmtMin(n: number) {
  return `${Math.round(n)} phút`;
}

function StatsRow({
  label,
  before,
  after,
}: {
  label: string;
  before: string;
  after: string;
}) {
  const changed = before !== after;
  return (
    <tr>
      <th scope="row">{label}</th>
      <td>{before}</td>
      <td className={changed ? styles.reorderStatChanged : undefined}>
        {after}
      </td>
    </tr>
  );
}

function statsCells(s: DayReorderStats) {
  return {
    travel: fmtMin(s.totalTravelMin),
    distance: fmtKm(s.totalDistanceKm),
    end: s.dayEnd || "—",
  };
}

export function ReorderDayConfirmModal({
  dayNumber,
  visitTitles,
  preview,
  applying,
  onClose,
  onConfirm,
}: Props) {
  const before = statsCells(preview.before);
  const after = statsCells(preview.after);
  const titles = visitTitles.slice(0, 6);
  const extra = Math.max(0, visitTitles.length - titles.length);

  return (
    <motion.div
      className={styles.replaceOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reorder-day-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={`${styles.replaceSheet} ${styles.reorderConfirmSheet}`}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="reorder-day-title">
          Xác nhận đổi thứ tự — Ngày {dayNumber}
        </h3>
        <p className={styles.reorderNote}>
          Chỉ sắp lại trong Ngày {dayNumber}. Các ngày khác không đổi.
        </p>

        <ol className={styles.reorderVisitList}>
          {titles.map((t, i) => (
            <li key={`${i}-${t}`}>
              <span className={styles.reorderVisitIdx}>{i + 1}</span>
              {t}
            </li>
          ))}
          {extra > 0 ? (
            <li className={styles.reorderVisitMore}>+{extra} địa điểm</li>
          ) : null}
        </ol>

        <table className={styles.reorderStatsTable}>
          <thead>
            <tr>
              <th scope="col" />
              <th scope="col">Trước</th>
              <th scope="col">Sau</th>
            </tr>
          </thead>
          <tbody>
            <StatsRow
              label="Thời gian đi"
              before={before.travel}
              after={after.travel}
            />
            <StatsRow
              label="Quãng đường"
              before={before.distance}
              after={after.distance}
            />
            <StatsRow
              label="Giờ kết thúc"
              before={before.end}
              after={after.end}
            />
          </tbody>
        </table>

        {preview.after.overtime || preview.warnings.length > 0 ? (
          <ul className={styles.reorderWarnings}>
            {preview.after.overtime ? (
              <li>Có thể trễ khung giờ ngày đã chọn.</li>
            ) : null}
            {preview.warnings.map((w, i) => (
              <li key={`${w.type}-${i}`}>{w.message}</li>
            ))}
          </ul>
        ) : (
          <p className={styles.reorderOk}>
            Thứ tự mới vẫn nằm trong khung giờ ngày.
          </p>
        )}

        <div className={styles.reorderActions}>
          <button
            type="button"
            className={styles.btnGhost}
            onClick={onClose}
            disabled={applying}
          >
            Hủy
          </button>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => void onConfirm()}
            disabled={applying}
          >
            {applying ? <LtButtonLoading label="Đang áp dụng" /> : "Xác nhận"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

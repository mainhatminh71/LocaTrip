"use client";

import { useMemo, useState } from "react";
import type { DayReorderStats, ReorderDayPreviewResult } from "@/lib/api/trips";
import {
  checkVisitOpenHours,
  issuesFromStatuses,
  resolveDayOfWeekIndex,
  type VisitOpenHoursStatus,
} from "@/lib/open-hours";
import { LtButtonLoading } from "./LtBrandLoader";
import styles from "./book-a-trip.module.css";

export type ReorderVisitRef = {
  placeId: string;
  title: string;
  openHours?: unknown;
};

type Props = {
  dayNumber: number;
  /** Visit order before reorder (current day). */
  previousVisits: ReorderVisitRef[];
  /** Trip start date YYYY-MM-DD for weekday open-hours. */
  tripDate?: string;
  preview: ReorderDayPreviewResult;
  applying?: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
};

type MoveChange = {
  placeId: string;
  title: string;
  from: number;
  to: number;
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

function titleById(
  visits: ReorderVisitRef[],
  placeId: string,
  fallback = "Địa điểm",
) {
  return visits.find((v) => v.placeId === placeId)?.title?.trim() || fallback;
}

/** Diff previous vs next visit order for the confirm modal. */
export function describeReorderChanges(
  previousVisits: ReorderVisitRef[],
  nextOrder: string[],
): {
  moves: MoveChange[];
  swap: { a: MoveChange; b: MoveChange } | null;
  slotChanges: { position: number; fromTitle: string; toTitle: string }[];
} {
  const prevIds = previousVisits.map((v) => v.placeId);
  const nextIds = nextOrder.filter(Boolean);
  const titleMap = new Map(previousVisits.map((v) => [v.placeId, v.title]));

  // Titles for next order may only exist in previous list (same set of places).
  const moves: MoveChange[] = [];
  nextIds.forEach((placeId, newIdx) => {
    const oldIdx = prevIds.indexOf(placeId);
    if (oldIdx < 0 || oldIdx === newIdx) return;
    moves.push({
      placeId,
      title: titleMap.get(placeId)?.trim() || "Địa điểm",
      from: oldIdx + 1,
      to: newIdx + 1,
    });
  });

  let swap: { a: MoveChange; b: MoveChange } | null = null;
  if (moves.length === 2) {
    const [a, b] = moves;
    if (a.from === b.to && a.to === b.from) {
      swap = { a, b };
    }
  }

  const slotChanges: { position: number; fromTitle: string; toTitle: string }[] =
    [];
  const len = Math.max(prevIds.length, nextIds.length);
  for (let i = 0; i < len; i++) {
    const fromId = prevIds[i];
    const toId = nextIds[i];
    if (!fromId || !toId || fromId === toId) continue;
    slotChanges.push({
      position: i + 1,
      fromTitle: titleById(previousVisits, fromId),
      toTitle: titleMap.get(toId)?.trim() || "Địa điểm",
    });
  }

  return { moves, swap, slotChanges };
}

export function ReorderDayConfirmModal({
  dayNumber,
  previousVisits,
  tripDate,
  preview,
  applying,
  onClose,
  onConfirm,
}: Props) {
  const before = statsCells(preview.before);
  const after = statsCells(preview.after);

  const nextOrder =
    preview.visitOrder?.length > 0
      ? preview.visitOrder
      : preview.schedule
          .filter((i) => i.type === "visit")
          .map((i) => (i.type === "visit" ? i.place?.placeId || "" : ""))
          .filter(Boolean);

  const hoursById = useMemo(() => {
    const map = new Map<string, unknown>();
    for (const v of previousVisits) {
      if (v.openHours != null) map.set(v.placeId, v.openHours);
    }
    for (const item of preview.schedule) {
      if (item.type !== "visit") continue;
      const id = item.place?.placeId?.trim();
      if (!id) continue;
      const hours = (item.place as { openHours?: unknown })?.openHours;
      if (hours != null && !map.has(id)) map.set(id, hours);
    }
    return map;
  }, [previousVisits, preview.schedule]);

  const nextVisits: ReorderVisitRef[] = nextOrder.map((placeId) => ({
    placeId,
    title: titleById(previousVisits, placeId),
    openHours: hoursById.get(placeId),
  }));

  const { moves, swap, slotChanges } = useMemo(
    () => describeReorderChanges(previousVisits, nextOrder),
    [previousVisits, nextOrder],
  );

  const dayOfWeekIndex = useMemo(
    () => resolveDayOfWeekIndex({ tripDate, dayNumber }),
    [tripDate, dayNumber],
  );

  const openHourStatuses: VisitOpenHoursStatus[] = useMemo(() => {
    return preview.schedule
      .filter((i) => i.type === "visit")
      .map((item) => {
        if (item.type !== "visit") {
          return null;
        }
        const placeId = item.place?.placeId?.trim() || "";
        const title =
          titleById(previousVisits, placeId) ||
          item.place?.title?.trim() ||
          "Địa điểm";
        return checkVisitOpenHours({
          title,
          placeId: placeId || undefined,
          time: item.time,
          openHours: hoursById.get(placeId) ?? null,
          dayOfWeekIndex,
        });
      })
      .filter((s): s is VisitOpenHoursStatus => s != null);
  }, [preview.schedule, previousVisits, hoursById, dayOfWeekIndex]);

  const clientOpenIssues = useMemo(
    () => issuesFromStatuses(openHourStatuses),
    [openHourStatuses],
  );

  const statusById = useMemo(() => {
    const map = new Map<string, VisitOpenHoursStatus>();
    for (const s of openHourStatuses) {
      if (s.placeId) map.set(s.placeId, s);
    }
    return map;
  }, [openHourStatuses]);

  /** Merge BE + client open-hours warnings (dedupe by type+placeId+message). */
  const mergedWarnings = useMemo(() => {
    const list = [...(preview.warnings || [])];
    const seen = new Set(
      list.map((w) => `${w.type}|${w.placeId || ""}|${w.message}`),
    );
    for (const issue of clientOpenIssues) {
      const key = `${issue.type}|${issue.placeId || ""}|${issue.message}`;
      if (seen.has(key)) continue;
      // Also skip if BE already warned same place+type
      const samePlaceType = list.some(
        (w) => w.type === issue.type && w.placeId === issue.placeId,
      );
      if (samePlaceType) continue;
      seen.add(key);
      list.push({
        type: issue.type,
        message: issue.message,
        placeId: issue.placeId,
      });
    }
    return list;
  }, [preview.warnings, clientOpenIssues]);

  const movedIds = new Set(moves.map((m) => m.placeId));
  const [listExpanded, setListExpanded] = useState(false);
  const PREVIEW_LIMIT = 8;
  const extra = Math.max(0, nextVisits.length - PREVIEW_LIMIT);
  const titles = listExpanded
    ? nextVisits
    : nextVisits.slice(0, PREVIEW_LIMIT);

  return (
    <div
      className={styles.replaceOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reorder-day-title"
      onClick={onClose}
    >
      <div
        className={`${styles.replaceSheet} ${styles.reorderConfirmSheet}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="reorder-day-title">
          Xác nhận đổi thứ tự — Ngày {dayNumber}
        </h3>
        <p className={styles.reorderNote}>
          Chỉ sắp lại trong Ngày {dayNumber}. Các ngày khác không đổi.
        </p>

        <section
          className={styles.reorderChanges}
          aria-label="Các địa điểm thay đổi"
        >
          <h4 className={styles.reorderChangesTitle}>Thay đổi</h4>
          {swap ? (
            <p className={styles.reorderSwapLine}>
              Đổi chỗ giữa{" "}
              <strong>
                #{swap.a.from} {swap.a.title}
              </strong>{" "}
              và{" "}
              <strong>
                #{swap.b.from} {swap.b.title}
              </strong>
            </p>
          ) : moves.length > 0 ? (
            <ul className={styles.reorderChangeList}>
              {moves.map((m) => (
                <li key={m.placeId}>
                  <strong>{m.title}</strong>
                  <span className={styles.reorderPosDelta}>
                    #{m.from} → #{m.to}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.reorderNote}>Không có thay đổi thứ tự.</p>
          )}

          {!swap && slotChanges.length > 0 && slotChanges.length <= 6 ? (
            <ul className={styles.reorderSlotList}>
              {slotChanges.map((s) => (
                <li key={`slot-${s.position}`}>
                  <span className={styles.reorderVisitIdx}>{s.position}</span>
                  <span>
                    <span className={styles.reorderSlotFrom}>{s.fromTitle}</span>
                    <span className={styles.reorderSlotArrow} aria-hidden="true">
                      {" "}
                      →{" "}
                    </span>
                    <strong>{s.toTitle}</strong>
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        <ol className={styles.reorderVisitList}>
          {titles.map((v, i) => {
            const moved = movedIds.has(v.placeId);
            const prevPos = previousVisits.findIndex(
              (p) => p.placeId === v.placeId,
            );
            const hours = statusById.get(v.placeId);
            return (
              <li
                key={`${i}-${v.placeId}`}
                className={moved ? styles.reorderVisitMoved : undefined}
              >
                <span className={styles.reorderVisitIdx}>{i + 1}</span>
                <span className={styles.reorderVisitText}>
                  {v.title}
                  {moved && prevPos >= 0 && prevPos !== i ? (
                    <span className={styles.reorderVisitWas}>
                      trước #{prevPos + 1}
                    </span>
                  ) : null}
                  {hours?.status === "ok" ? (
                    <span className={styles.reorderHoursOk}>
                      mở {hours.startLabel}
                    </span>
                  ) : null}
                  {hours?.status === "closed" ? (
                    <span className={styles.reorderHoursBad}>đóng cửa</span>
                  ) : null}
                  {hours?.status === "closes_early" ? (
                    <span className={styles.reorderHoursBad}>đóng sớm</span>
                  ) : null}
                </span>
              </li>
            );
          })}
          {extra > 0 && !listExpanded ? (
            <li className={styles.reorderVisitMore}>
              <button
                type="button"
                className={styles.reorderVisitMoreBtn}
                onClick={() => setListExpanded(true)}
              >
                +{extra} địa điểm
              </button>
            </li>
          ) : null}
          {listExpanded && extra > 0 ? (
            <li className={styles.reorderVisitMore}>
              <button
                type="button"
                className={styles.reorderVisitMoreBtn}
                onClick={() => setListExpanded(false)}
              >
                Thu gọn
              </button>
            </li>
          ) : null}
        </ol>

        {clientOpenIssues.length > 0 ? (
          <section
            className={styles.reorderOpenHours}
            aria-label="Kiểm tra giờ mở cửa"
          >
            <h4 className={styles.reorderChangesTitle}>Giờ mở cửa</h4>
            <ul className={styles.reorderOpenHoursList}>
              {clientOpenIssues.map((issue) => (
                <li key={`${issue.type}-${issue.placeId}`}>
                  <strong>{issue.title}</strong>
                  <span>
                    {issue.type === "CLOSED"
                      ? `đóng cửa lúc ${issue.startLabel}`
                      : `có thể đóng trước ${issue.endLabel}`}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

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

        {preview.after.overtime || mergedWarnings.length > 0 ? (
          <ul className={styles.reorderWarnings}>
            {preview.after.overtime &&
            !mergedWarnings.some((w) => w.type === "OVERTIME") ? (
              <li>Có thể trễ khung giờ ngày đã chọn.</li>
            ) : null}
            {mergedWarnings.map((w, i) => (
              <li
                key={`${w.type}-${i}`}
                className={
                  w.type === "CLOSED" || w.type === "CLOSES_EARLY"
                    ? styles.reorderWarningClosed
                    : undefined
                }
              >
                {w.message}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.reorderOk}>
            Thứ tự mới khớp khung giờ ngày và giờ mở cửa (nếu có).
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
      </div>
    </div>
  );
}

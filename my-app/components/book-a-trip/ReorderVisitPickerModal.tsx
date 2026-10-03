"use client";

import styles from "./book-a-trip.module.css";

export type ReorderPickerVisit = {
  placeId: string;
  title: string;
  /** 0-based index in the day */
  index: number;
};

type Props = {
  dayNumber: number;
  active: ReorderPickerVisit;
  visits: ReorderPickerVisit[];
  busy?: boolean;
  onClose: () => void;
  onMoveToIndex: (toIndex: number) => void;
  onSwapWith: (otherPlaceId: string) => void;
};

export function ReorderVisitPickerModal({
  dayNumber,
  active,
  visits,
  busy,
  onClose,
  onMoveToIndex,
  onSwapWith,
}: Props) {
  const others = visits.filter((v) => v.placeId !== active.placeId);

  return (
    <div
      className={styles.replaceOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reorder-picker-title"
      onClick={onClose}
    >
      <div
        className={`${styles.replaceSheet} ${styles.reorderPickerSheet}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.reorderPickerHead}>
          <p className={styles.reorderPickerEyebrow}>Ngày {dayNumber}</p>
          <h3 id="reorder-picker-title">Đổi thứ tự</h3>
          <p className={styles.reorderPickerSub}>
            <strong>{active.title}</strong> đang ở vị trí{" "}
            <strong>#{active.index + 1}</strong>
          </p>
        </header>

        <section className={styles.reorderPickerSection} aria-label="Đưa tới vị trí">
          <h4>Đưa tới vị trí</h4>
          <div className={styles.reorderPosGrid}>
            {visits.map((v) => {
              const selected = v.index === active.index;
              return (
                <button
                  key={`pos-${v.index}`}
                  type="button"
                  className={
                    selected
                      ? styles.reorderPosBtnActive
                      : styles.reorderPosBtn
                  }
                  disabled={busy || selected}
                  onClick={() => onMoveToIndex(v.index)}
                >
                  #{v.index + 1}
                </button>
              );
            })}
          </div>
        </section>

        {others.length ? (
          <section
            className={styles.reorderPickerSection}
            aria-label="Đổi chỗ với điểm khác"
          >
            <h4>Đổi chỗ với</h4>
            <ul className={styles.reorderSwapList}>
              {others.map((v) => (
                <li key={v.placeId}>
                  <button
                    type="button"
                    className={styles.reorderSwapBtn}
                    disabled={busy}
                    onClick={() => onSwapWith(v.placeId)}
                  >
                    <span className={styles.reorderSwapNum}>#{v.index + 1}</span>
                    <span className={styles.reorderSwapTitle}>{v.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className={styles.reorderPickerActions}>
          <button
            type="button"
            className={styles.btnGhost}
            disabled={busy}
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

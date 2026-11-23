"use client";

import styles from "@/app/shared-trips/shared-trips.module.css";

const STARS = [1, 2, 3, 4, 5] as const;

type Props = {
  value: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  disabled?: boolean;
  label?: string;
};

export function StarRatingInput({
  value,
  onChange,
  readOnly = false,
  disabled = false,
  label = "Đánh giá",
}: Props) {
  return (
    <div
      className={styles.starsRow}
      role={readOnly ? "img" : "radiogroup"}
      aria-label={label}
    >
      {STARS.map((n) => {
        const on = n <= value;
        if (readOnly || !onChange) {
          return (
            <span
              key={n}
              className={on ? `${styles.starBtn} ${styles.starBtnOn}` : styles.starBtn}
              aria-hidden
            >
              ★
            </span>
          );
        }
        return (
          <button
            key={n}
            type="button"
            className={on ? `${styles.starBtn} ${styles.starBtnOn}` : styles.starBtn}
            aria-label={`${n} sao`}
            aria-checked={value === n}
            role="radio"
            disabled={disabled}
            onClick={() => onChange(n)}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

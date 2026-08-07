"use client";

import styles from "./lt-loader.module.css";

type LtBrandLoaderProps = {
  size?: "sm" | "md" | "lg";
  label?: string;
  /** onDark = white/mint on ink buttons; onLight = deep/mint on pale surfaces */
  tone?: "onDark" | "onLight";
  className?: string;
};

/**
 * Branded LocaTrip loader — orbit ring (deep/teal) + mint pulse leaf.
 * sm: buttons · md: inline · lg: map / full-pane overlays
 */
export function LtBrandLoader({
  size = "md",
  label,
  tone = "onLight",
  className,
}: LtBrandLoaderProps) {
  const sizeClass =
    size === "sm" ? styles.sm : size === "lg" ? styles.lg : styles.md;
  const toneClass = tone === "onDark" ? styles.onDark : styles.onLight;

  return (
    <span
      className={`${styles.wrap} ${sizeClass} ${toneClass} ${className ?? ""}`}
      role="status"
      aria-live="polite"
      aria-label={label || "Đang tải"}
    >
      <span className={styles.mark} aria-hidden="true">
        <span className={styles.orbit} />
        <span className={styles.orbitSoft} />
        <svg className={styles.leaf} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3c4.5 2.2 7.5 6.2 7.5 10.8 0 2.4-.9 4.5-2.4 6.1C15.4 21.5 13.8 22 12 22c-1.8 0-3.4-.5-5.1-2.1C5.4 18.3 4.5 16.2 4.5 13.8 4.5 9.2 7.5 5.2 12 3Z"
            className={styles.leafFill}
          />
          <path
            d="M12 6.2v11.2M12 10.5c2.2.6 3.8 2.2 4.4 4.2"
            className={styles.leafVein}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {label ? <span className={styles.label}>{label}</span> : null}
    </span>
  );
}

/** Primary/ghost button content while busy. */
export function LtButtonLoading({
  label,
  onDark = true,
}: {
  label: string;
  onDark?: boolean;
}) {
  return (
    <span className={styles.btnInner}>
      <LtBrandLoader size="sm" tone={onDark ? "onDark" : "onLight"} />
      <span>{label}</span>
    </span>
  );
}

"use client";

import Image from "next/image";
import { LT_IMAGE_QUALITY } from "@/lib/image-quality";
import {
  FORM_ACTIVITY_OPTIONS,
  FORM_ATMOSPHERE_OPTIONS,
  FORM_CONSTRAINT_OPTIONS,
  FORM_FOOD_OPTIONS,
  FORM_TARGET_CUSTOMER_OPTIONS,
  FORM_TRIP_TYPE_OPTIONS,
  toggleMulti,
  type AutoTripDraft,
} from "@/lib/auto-trip-form";
import {
  BUDGET_OPTIONS,
  HOURS_OPTIONS,
  PACE_OPTIONS,
  type StartPreset,
} from "@/lib/trip";
import styles from "./book-a-trip.module.css";

function ChipRow({
  options,
  selected,
  multi,
  onPick,
}: {
  options: { value: string; label: string }[];
  selected: string | string[] | null;
  multi?: boolean;
  onPick: (value: string) => void;
}) {
  return (
    <div className={styles.chipRow}>
      {options.map((o) => {
        const active = multi
          ? Array.isArray(selected) && selected.includes(o.value)
          : selected === o.value;
        return (
          <button
            key={o.value}
            type="button"
            className={active ? styles.chipOn : styles.chip}
            aria-pressed={active}
            onClick={() => onPick(o.value)}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

type AutoTripPrefsFieldsProps = {
  draft: AutoTripDraft;
  startPresets: StartPreset[];
  activeStart: StartPreset;
  compact?: boolean;
  onPatch: (partial: Partial<AutoTripDraft>) => void;
};

/** Shared preference fields for setup form + itinerary “Tiêu chí” tab. */
export function AutoTripPrefsFields({
  draft,
  startPresets,
  activeStart,
  compact,
  onPatch,
}: AutoTripPrefsFieldsProps) {
  return (
    <div className={compact ? styles.prefsFieldsCompact : styles.prefsFields}>
      <div className={styles.autoSection}>
        <h3 className={styles.autoSectionTitle}>Điểm bắt đầu</h3>
        {!compact ? (
          <p className={styles.autoHint}>{activeStart.description}</p>
        ) : null}
        <div className={styles.startGrid}>
          {startPresets.map((p) => {
            const on = draft.startId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                className={on ? styles.startCardOn : styles.startCard}
                onClick={() => onPatch({ startId: p.id })}
              >
                <span className={styles.startThumb}>
                  <Image
                    src={p.thumbnail}
                    alt=""
                    fill
                    sizes="(max-width: 980px) 45vw, 220px"
                    quality={LT_IMAGE_QUALITY}
                    className={styles.startThumbImg}
                  />
                </span>
                <span className={styles.startLabel}>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.autoSection}>
        <h3 className={styles.autoSectionTitle}>Bán kính tìm điểm</h3>
        <label className={styles.autoInputWrap}>
          <input
            type="text"
            inputMode="decimal"
            className={styles.autoInput}
            value={draft.radiusKm}
            placeholder="vd. 10"
            aria-label="Bán kính km"
            onChange={(e) => {
              const raw = e.target.value.replace(",", ".");
              if (raw === "" || /^\d*\.?\d*$/.test(raw)) {
                onPatch({ radiusKm: raw });
              }
            }}
          />
          <span className={styles.autoInputSuffix}>km</span>
        </label>
      </div>

      <div className={styles.autoSection}>
        <h3 className={styles.autoSectionTitle}>
          Ngân sách (ước tính / người)
        </h3>
        <ChipRow
          options={BUDGET_OPTIONS.map((o) => ({
            value: o.value,
            label: o.hint,
          }))}
          selected={draft.budgetLevel}
          onPick={(v) =>
            onPatch({ budgetLevel: v as AutoTripDraft["budgetLevel"] })
          }
        />
        <p className={styles.autoHint}>
          {BUDGET_OPTIONS.find((o) => o.value === draft.budgetLevel)?.label}
        </p>
      </div>

      <div className={styles.autoSection}>
        <h3 className={styles.autoSectionTitle}>Nhịp độ trong ngày</h3>
        <ChipRow
          options={PACE_OPTIONS.map((o) => ({
            value: o.value,
            label: o.label,
          }))}
          selected={draft.pace}
          onPick={(v) => onPatch({ pace: v as AutoTripDraft["pace"] })}
        />
      </div>

      <div className={styles.autoSection}>
        <h3 className={styles.autoSectionTitle}>Khung giờ (tuỳ chọn)</h3>
        <ChipRow
          options={HOURS_OPTIONS.map((o) => ({
            value: o.value,
            label: o.label,
          }))}
          selected={draft.hours}
          onPick={(v) => onPatch({ hours: v })}
        />
      </div>

      <div className={styles.autoSection}>
        <h3 className={styles.autoSectionTitle}>Phong cách chuyến đi</h3>
        <ChipRow
          options={FORM_TRIP_TYPE_OPTIONS}
          selected={draft.tripType}
          onPick={(v) =>
            onPatch({ tripType: draft.tripType === v ? null : v })
          }
        />
      </div>

      <div className={styles.autoSection}>
        <h3 className={styles.autoSectionTitle}>Đi với ai</h3>
        <ChipRow
          options={FORM_TARGET_CUSTOMER_OPTIONS}
          selected={draft.targetCustomer}
          onPick={(v) =>
            onPatch({
              targetCustomer: draft.targetCustomer === v ? null : v,
            })
          }
        />
      </div>

      <div className={styles.autoSection}>
        <h3 className={styles.autoSectionTitle}>Không khí (tối đa 3)</h3>
        <ChipRow
          options={FORM_ATMOSPHERE_OPTIONS}
          selected={draft.atmosphere}
          multi
          onPick={(v) =>
            onPatch({ atmosphere: toggleMulti(draft.atmosphere, v, 3) })
          }
        />
      </div>

      <div className={styles.autoSection}>
        <h3 className={styles.autoSectionTitle}>Ẩm thực & trải nghiệm ăn</h3>
        <ChipRow
          options={FORM_FOOD_OPTIONS}
          selected={draft.food}
          multi
          onPick={(v) => onPatch({ food: toggleMulti(draft.food, v) })}
        />
      </div>

      <div className={styles.autoSection}>
        <h3 className={styles.autoSectionTitle}>Muốn làm gì</h3>
        <ChipRow
          options={FORM_ACTIVITY_OPTIONS}
          selected={draft.activities}
          multi
          onPick={(v) =>
            onPatch({ activities: toggleMulti(draft.activities, v) })
          }
        />
      </div>

      <div className={styles.autoSection}>
        <h3 className={styles.autoSectionTitle}>Ràng buộc (tuỳ chọn)</h3>
        <ChipRow
          options={FORM_CONSTRAINT_OPTIONS}
          selected={draft.constraints}
          multi
          onPick={(v) =>
            onPatch({ constraints: toggleMulti(draft.constraints, v) })
          }
        />
      </div>
    </div>
  );
}

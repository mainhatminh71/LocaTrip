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
  joinDraftHours,
  parseDraftHours,
  todayYmd,
  toggleMulti,
  validateSameDayHours,
  type AutoTripDraft,
} from "@/lib/auto-trip-form";
import {
  BUDGET_OPTIONS,
  HOURS_CHIP_OPTIONS,
  HOURS_CUSTOM_VALUE,
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
  const { start: startTime, end: endTime } = parseDraftHours(draft.hours);
  const hoursError = validateSameDayHours(startTime, endTime);

  function patchStartTime(value: string) {
    onPatch({ hours: joinDraftHours(value, endTime) });
  }

  function patchEndTime(value: string) {
    onPatch({ hours: joinDraftHours(startTime, value) });
  }

  return (
    <div className={compact ? styles.prefsFieldsCompact : styles.prefsFields}>
      <div className={styles.autoSection}>
        <h3 className={styles.autoSectionTitle}>Thông tin chuyến đi</h3>
        <p className={styles.autoHint}>
          Tên và ngày đi là bắt buộc — ngày phải từ hôm nay trở đi.
        </p>
        <div className={styles.tripInfoRow}>
          <label className={styles.tripInfoField}>
            <span className={styles.hoursTimeLabel}>Tên chuyến đi *</span>
            <input
              type="text"
              className={styles.autoInput}
              value={draft.title}
              maxLength={120}
              required
              placeholder="VD: Weekend Đà Lạt với bạn"
              aria-label="Tên chuyến đi"
              aria-required="true"
              onChange={(e) => onPatch({ title: e.target.value })}
            />
          </label>
          <label className={`${styles.tripInfoField} ${styles.tripInfoDate}`}>
            <span className={styles.hoursTimeLabel}>Ngày đi *</span>
            <input
              type="date"
              className={styles.autoInput}
              value={draft.date}
              min={todayYmd()}
              required
              aria-label="Ngày đi"
              aria-required="true"
              onChange={(e) => onPatch({ date: e.target.value })}
            />
          </label>
        </div>
      </div>

      <div className={styles.autoSection}>
        <h3 className={styles.autoSectionTitle}>Điểm bắt đầu</h3>

        <div className={styles.startModeList} role="radiogroup" aria-label="Cách chọn điểm bắt đầu">
          <label className={styles.startModeOption}>
            <input
              type="radio"
              name={compact ? "startModeCompact" : "startMode"}
              className={styles.startModeCheck}
              checked={(draft.startMode ?? "preset") === "gps"}
              onChange={() => onPatch({ startMode: "gps" })}
            />
            <span className={styles.startModeCopy}>
              <span className={styles.startModeTitle}>
                Lấy địa điểm hiện tại
              </span>
              <span className={styles.autoHint}>
                Lựa chọn này phù hợp khi bạn đang ở địa điểm tham quan.
              </span>
            </span>
          </label>

          <label className={styles.startModeOption}>
            <input
              type="radio"
              name={compact ? "startModeCompact" : "startMode"}
              className={styles.startModeCheck}
              checked={(draft.startMode ?? "preset") === "preset"}
              onChange={() => onPatch({ startMode: "preset" })}
            />
            <span className={styles.startModeCopy}>
              <span className={styles.startModeTitle}>
                Lấy địa điểm bắt đầu trong danh sách đề xuất
              </span>
            </span>
          </label>
        </div>

        {(draft.startMode ?? "preset") === "preset" ? (
          <>
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
                    onClick={() => onPatch({ startId: p.id, startMode: "preset" })}
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
          </>
        ) : (
          <p className={styles.autoHint}>
            Khi tạo lịch, trình duyệt sẽ hỏi quyền vị trí để lấy toạ độ hiện tại
            làm điểm xuất phát.
          </p>
        )}
      </div>

      <div className={styles.autoSection}>
        <h3 className={styles.autoSectionTitle}>Bán kính tìm điểm</h3>
        <p className={styles.autoHint}>
          Vùng tìm địa điểm quanh điểm bắt đầu (không phải khoảng cách giữa các
          điểm).
        </p>
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
          Khoảng cách giữa các điểm
        </h3>
        <p className={styles.autoHint}>
          Giới hạn quãng đường giữa hai điểm liên tiếp (không phải bán kính tìm
          kiếm).
        </p>
        <label className={styles.autoInputWrap}>
          <input
            type="text"
            inputMode="decimal"
            className={styles.autoInput}
            value={draft.maxDistance}
            placeholder="vd. 5"
            aria-label="Khoảng cách giữa các điểm km"
            onChange={(e) => {
              const raw = e.target.value.replace(",", ".");
              if (raw === "" || /^\d*\.?\d*$/.test(raw)) {
                onPatch({ maxDistance: raw });
              }
            }}
          />
          <span className={styles.autoInputSuffix}>km</span>
        </label>
      </div>

      <div className={styles.autoSection}>
        <h3 className={styles.autoSectionTitle}>Khứ hồi</h3>
        <label className={styles.startModeOption}>
          <input
            type="checkbox"
            className={styles.startModeCheck}
            checked={draft.isRoundTrip}
            onChange={(e) => onPatch({ isRoundTrip: e.target.checked })}
          />
          <span className={styles.startModeCopy}>
            <span className={styles.startModeTitle}>Bật khứ hồi</span>
            <span className={styles.autoHint}>
              Cuối ngày có đoạn về điểm xuất phát.
            </span>
          </span>
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
        <p className={styles.autoHint}>
          Chọn khung có sẵn hoặc bật Tự do để chỉnh giờ bắt đầu / kết thúc.
          Giờ kết thúc phải sau giờ bắt đầu.
        </p>
        <ChipRow
          options={[...HOURS_CHIP_OPTIONS]}
          selected={
            (draft.hoursMode ?? "preset") === "custom"
              ? HOURS_CUSTOM_VALUE
              : draft.hours
          }
          onPick={(v) => {
            if (v === HOURS_CUSTOM_VALUE) {
              onPatch({ hoursMode: "custom" });
              return;
            }
            onPatch({ hoursMode: "preset", hours: v });
          }}
        />
        {(draft.hoursMode ?? "preset") === "custom" ? (
          <>
            <div className={styles.hoursTimeRow}>
              <label className={styles.hoursTimeField}>
                <span className={styles.hoursTimeLabel}>Bắt đầu</span>
                <input
                  type="time"
                  className={styles.autoInput}
                  value={startTime}
                  aria-label="Giờ bắt đầu trong ngày"
                  onChange={(e) => patchStartTime(e.target.value)}
                />
              </label>
              <span className={styles.hoursTimeSep} aria-hidden>
                –
              </span>
              <label className={styles.hoursTimeField}>
                <span className={styles.hoursTimeLabel}>Kết thúc</span>
                <input
                  type="time"
                  className={styles.autoInput}
                  value={endTime}
                  aria-label="Giờ kết thúc trong ngày"
                  onChange={(e) => patchEndTime(e.target.value)}
                />
              </label>
            </div>
            {hoursError ? (
              <p className={styles.hoursTimeError} role="alert">
                {hoursError}
              </p>
            ) : null}
          </>
        ) : null}
      </div>

      <div className={styles.autoSection}>
        <p className={styles.prefsGroupLabel}>Chủ đề chuyến đi</p>
        <h3 className={styles.autoSectionTitle}>Chọn một chủ đề</h3>
        <p className={styles.autoHint}>
          Bắt buộc chọn chủ đề này hoặc ít nhất một sở thích bên dưới.
        </p>
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
        <p className={styles.autoHint}>
          Không thay cho chủ đề / sở thích — chỉ giúp gợi ý phù hợp hơn.
        </p>
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

      <div className={styles.prefsGroup}>
        <div className={styles.prefsGroupHeader}>
          <p className={styles.prefsGroupLabel}>Sở thích</p>
          <p className={styles.autoHint}>
            Không khí, ẩm thực, hoạt động, ràng buộc — chọn ít nhất một mục nếu
            chưa chọn chủ đề chuyến đi.
          </p>
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
    </div>
  );
}

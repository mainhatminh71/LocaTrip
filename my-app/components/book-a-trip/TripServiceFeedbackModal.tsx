"use client";

import { useEffect, useId, useState } from "react";
import { LtButtonLoading } from "./LtBrandLoader";
import styles from "./book-a-trip.module.css";

export type TripServiceFeedbackPayload = {
  rating: number;
  comment: string;
};

type Props = {
  tripTitle?: string;
  mode?: "save" | "update";
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (payload: TripServiceFeedbackPayload) => void | Promise<void>;
};

const STARS = [1, 2, 3, 4, 5] as const;

export function TripServiceFeedbackModal({
  tripTitle,
  mode = "save",
  submitting = false,
  onClose,
  onSubmit,
}: Props) {
  const titleId = useId();
  const commentId = useId();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, submitting]);

  const headline =
    mode === "update" ? "Đã cập nhật chuyến đi" : "Đã lưu chuyến đi";
  const active = hoverRating || rating;

  async function handleSubmit() {
    if (rating < 1) {
      setError("Chọn số sao đánh giá dịch vụ.");
      return;
    }
    setError(null);
    await onSubmit({
      rating,
      comment: comment.trim(),
    });
  }

  return (
    <div
      className={styles.feedbackOverlay}
      role="presentation"
      onClick={() => {
        if (!submitting) onClose();
      }}
    >
      <div
        className={styles.feedbackCard}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <p className={styles.feedbackEyebrow}>LocaTrip</p>
        <h3 id={titleId}>{headline}</h3>
        <p className={styles.feedbackLead}>
          {tripTitle
            ? `Chuyến “${tripTitle}” đã được ghi nhận. Cho chúng mình biết trải nghiệm nhé.`
            : "Cho chúng mình biết trải nghiệm dịch vụ vừa rồi nhé."}
        </p>

        <div className={styles.feedbackRatingBlock}>
          <p className={styles.feedbackLabel}>Đánh giá dịch vụ</p>
          <div
            className={styles.feedbackStars}
            role="radiogroup"
            aria-label="Đánh giá dịch vụ từ 1 đến 5 sao"
          >
            {STARS.map((value) => {
              const filled = value <= active;
              return (
                <button
                  key={value}
                  type="button"
                  className={
                    filled
                      ? `${styles.feedbackStar} ${styles.feedbackStarOn}`
                      : styles.feedbackStar
                  }
                  role="radio"
                  aria-checked={rating === value}
                  aria-label={`${value} sao`}
                  disabled={submitting}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                  onFocus={() => setHoverRating(value)}
                  onBlur={() => setHoverRating(0)}
                  onClick={() => {
                    setRating(value);
                    setError(null);
                  }}
                >
                  ★
                </button>
              );
            })}
          </div>
        </div>

        <label className={styles.feedbackField} htmlFor={commentId}>
          <span className={styles.feedbackLabel}>Góp ý thêm</span>
          <textarea
            id={commentId}
            className={styles.feedbackTextarea}
            rows={4}
            maxLength={800}
            placeholder="Bạn thích gì / cần cải thiện gì?"
            value={comment}
            disabled={submitting}
            onChange={(e) => setComment(e.target.value)}
          />
        </label>

        {error ? <p className={styles.feedbackError}>{error}</p> : null}

        <div className={styles.feedbackActions}>
          <button
            type="button"
            className={styles.btnGhost}
            disabled={submitting}
            onClick={onClose}
          >
            Bỏ qua
          </button>
          <button
            type="button"
            className={styles.btnPrimary}
            disabled={submitting}
            onClick={() => void handleSubmit()}
          >
            {submitting ? (
              <LtButtonLoading label="Đang gửi…" />
            ) : (
              "Gửi đánh giá"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

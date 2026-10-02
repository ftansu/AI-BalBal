import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { reviewDocument } from "../../api/documents";
import type { DocumentDetail, DocumentReviewRequest } from "../../api/types";
import { REVIEW_STATUS_LABELS, formatDate } from "../../lib/format";
import { S } from "../../lib/strings";
import { Modal } from "../common/Modal";
import { ErrorBox } from "../ErrorBox";

/** B-28 stage 2 (ADR-024, Çekirdek O-1): the publication state of a not-yet-published document
 * and — for the target department's own `department_manager` — Onayla / Geri gönder. The
 * server decides who may act (403 `not_the_approver`); `canReview` only shows the buttons to
 * the right person. */
export function ReviewStatusCard({ document, canReview }: { document: DocumentDetail; canReview: boolean }) {
  const queryClient = useQueryClient();
  const [asking, setAsking] = useState(false);
  const [comment, setComment] = useState("");
  const t = S.review;

  const review = useMutation({
    mutationFn: (body: DocumentReviewRequest) => reviewDocument(document.id, body),
    onSuccess: () => {
      setAsking(false);
      setComment("");
      void queryClient.invalidateQueries({ queryKey: ["document", document.id] });
      void queryClient.invalidateQueries({ predicate: (q) => q.queryKey[0] === "documents" });
    },
  });

  if (document.review_status === "approved") return null;
  const showActions = canReview && document.review_status === "pending_review";

  return (
    <section className="card">
      <h2>{t.statusTitle}</h2>
      <p>
        <span className="badge warn">{REVIEW_STATUS_LABELS[document.review_status]}</span>{" "}
        {t.pendingNote[document.review_status]}
      </p>
      <p className="muted small">
        {document.submitted_at && `${t.submittedAt}: ${formatDate(document.submitted_at)}`}
        {document.submitted_at && document.reviewed_at && " · "}
        {document.reviewed_at && `${t.reviewedAt}: ${formatDate(document.reviewed_at)}`}
      </p>
      {document.review_comment && (
        <p className="notice">
          <strong>{t.comment}:</strong> {document.review_comment}
        </p>
      )}
      {review.isError && <ErrorBox error={review.error} />}
      {showActions && (
        <div className="actions">
          <button type="button" onClick={() => review.mutate({ decision: "approve" })} disabled={review.isPending}>
            {review.isPending ? t.sending : t.approve}
          </button>
          <button type="button" className="secondary" onClick={() => setAsking(true)} disabled={review.isPending}>
            {t.requestChanges}
          </button>
        </div>
      )}
      {asking && (
        <Modal label={t.requestTitle} onClose={() => setAsking(false)}>
          <h2>{t.requestTitle}</h2>
          <p className="muted">{t.requestHint}</p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t.requestPlaceholder}
            rows={4}
            maxLength={2000}
            autoFocus
          />
          <div className="actions">
            <button
              type="button"
              className="danger"
              disabled={comment.trim().length === 0 || review.isPending}
              onClick={() => review.mutate({ decision: "request_changes", comment: comment.trim() })}
            >
              {review.isPending ? t.sending : t.requestChanges}
            </button>
            <button type="button" className="secondary" onClick={() => setAsking(false)}>
              {t.cancel}
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}

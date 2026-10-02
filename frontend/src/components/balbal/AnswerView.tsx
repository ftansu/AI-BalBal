import { useState } from "react";
import { Link } from "react-router-dom";

import { isPending, sendAnswerFeedback, type FeedbackRating } from "../../api/proposed";
import type { AskResponse, AskWarning } from "../../api/types";
import { PRODUCT_LEVEL_LABELS } from "../../lib/format";
import { S } from "../../lib/strings";
import { ExcelSourceCardList, SourceCardList } from "../SourceCardList";

const BADGE_CLASS: Record<AskResponse["query_type"], string> = {
  DOCUMENT_QUERY: "neutral",
  DATA_QUERY: "neutral",
  MIXED_QUERY: "neutral",
  GENERAL_QUERY: "warn",
};

/** Ç-7 veri durumu etiketi (Anayasa v2.0): the backend's fixed `warnings[]` carry the kind and the
 * Turkish sentence; the UI only labels them. `product_limit` is the ADR-022 degrade notice. */
const WARNING_CLASS: Record<AskWarning["kind"], string> = {
  missing_data: "warn",
  insufficient_data: "warn",
  product_limit: "neutral",
};

/** Renders one `/api/ask` answer exactly as the canvas shows it: query-type badge, answer,
 * notice, the "kaynak bulunamadı" fallback, numbered sources (each downloadable) and
 * feedback buttons. Shared by the Balbal modal and the department "Balbal'a Sor" tab. */
export function AnswerView({
  result,
  projectOfDocument,
  uploadPath,
}: {
  result: AskResponse;
  projectOfDocument: (documentId: string) => string | null;
  uploadPath: string | null;
}) {
  const showDocs = result.answered && result.query_type !== "GENERAL_QUERY" && result.query_type !== "DATA_QUERY";
  const showExcel = result.answered && (result.query_type === "DATA_QUERY" || result.query_type === "MIXED_QUERY");
  const warnings = result.warnings ?? [];
  return (
    <div className="answer-block">
      <div className="answer-bubble">
        <span className={`badge ${BADGE_CLASS[result.query_type]}`}>{S.ask.queryType[result.query_type]}</span>{" "}
        <span className="badge neutral" title={S.ask.productLevelTitle}>
          {PRODUCT_LEVEL_LABELS[result.product_level ?? "P1"]}
        </span>
        <div className={`answer${result.answered ? "" : " no"}`}>{result.answer}</div>
        {warnings.map((w) => (
          <p key={w.kind} className="answer-notice">
            <span className={`badge ${WARNING_CLASS[w.kind]}`}>{S.ask.warningKind[w.kind]}</span> {w.message}
          </p>
        ))}
        {/* GENERAL answers already start with the same sentence (ADR-010). */}
        {result.query_type !== "GENERAL_QUERY" && result.notice && <p className="answer-notice">{result.notice}</p>}
        {!result.answered && uploadPath && (
          <p className="muted">
            {S.balbal.noSourcePrefix} <Link to={uploadPath}>{S.balbal.uploadLink}</Link>
            {S.balbal.noSourceSuffix}
          </p>
        )}
        {showDocs && (
          <div className="answer-sources">
            <div className="section-label">{S.ask.sourcesTitle}</div>
            <SourceCardList sources={result.sources} projectOfDocument={projectOfDocument} />
          </div>
        )}
        {showExcel && (
          <div className="answer-sources">
            <div className="section-label">{S.ask.excelSourcesTitle}</div>
            <ExcelSourceCardList sources={result.excel_sources} />
          </div>
        )}
      </div>
      <FeedbackRow auditLogId={result.audit_log_id ?? null} />
    </div>
  );
}

function FeedbackRow({ auditLogId }: { auditLogId: string | null }) {
  const [rating, setRating] = useState<FeedbackRating | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function rate(value: FeedbackRating) {
    setRating(value);
    if (!auditLogId) {
      // `/api/ask` henüz cevabın kayıt kimliğini dönmüyor (BACKEND_GAPS B-04).
      setMessage(S.balbal.feedbackPending);
      return;
    }
    try {
      await sendAnswerFeedback(auditLogId, value);
      setMessage(value === "up" ? S.balbal.feedbackThanks : S.balbal.feedbackReported);
    } catch (error) {
      setMessage(isPending(error) ? S.balbal.feedbackPending : S.errors.generic);
    }
  }

  return (
    <div className="feedback-row">
      <button type="button" className={`pill-button${rating === "up" ? " on-ok" : ""}`} onClick={() => rate("up")}>
        {S.balbal.useful}
      </button>
      <button type="button" className={`pill-button${rating === "down" ? " on-err" : ""}`} onClick={() => rate("down")}>
        {S.balbal.report}
      </button>
      {message && <span className="muted small">{message}</span>}
    </div>
  );
}

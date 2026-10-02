import type { DocumentListItem, ReviewStatus } from "../../api/types";
import { REVIEW_STATUS_LABELS } from "../../lib/format";
import { S } from "../../lib/strings";

const ORDER: ReviewStatus[] = ["pending_review", "pending_metadata", "changes_requested"];

/** B-28 queue filter, local to the already-fetched list (the backend returns the pending
 * documents the caller may handle, so the chips narrow down to what concerns this user).
 * Only states with at least one document are offered; nothing renders when all is approved. */
export function ReviewFilterChips({
  documents,
  value,
  onChange,
}: {
  documents: DocumentListItem[];
  value: ReviewStatus | null;
  onChange: (next: ReviewStatus | null) => void;
}) {
  const counts = new Map<ReviewStatus, number>();
  for (const d of documents) counts.set(d.review_status, (counts.get(d.review_status) ?? 0) + 1);
  const states = ORDER.filter((s) => (counts.get(s) ?? 0) > 0);
  if (states.length === 0) return null;
  return (
    <div className="chips">
      <button type="button" className={`chip${value === null ? " active" : ""}`} onClick={() => onChange(null)}>
        {S.review.filterAll}
      </button>
      {states.map((s) => (
        <button type="button" key={s} className={`chip${value === s ? " active" : ""}`} onClick={() => onChange(s)}>
          {REVIEW_STATUS_LABELS[s]} ({counts.get(s)})
        </button>
      ))}
    </div>
  );
}

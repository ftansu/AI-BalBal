import { useReviewEvents } from "../../api/admin-documents";
import { REVIEW_EVENT_LABELS, SUGGESTION_FIELD_LABELS, formatDate } from "../../lib/format";
import { S } from "../../lib/strings";
import { ErrorBox } from "../ErrorBox";
import { Spinner } from "../Spinner";

function time(iso: string): string {
  return `${formatDate(iso)} ${iso.slice(11, 16)}`;
}

/** B-28 intake ledger (BACKEND_GAPS §4.7.6): admin-only, read-only — what Balbal suggested
 * and how sure it was, what the uploader changed or confirmed, who decided. */
export function ReviewEventsCard({ documentId }: { documentId: string }) {
  const events = useReviewEvents(documentId, true);
  const t = S.review;
  if (events.isLoading) return <Spinner />;
  if (events.isError) return <ErrorBox error={events.error} />;
  const rows = events.data ?? [];
  return (
    <section className="card">
      <h2>{t.eventsTitle}</h2>
      {rows.length === 0 ? (
        <p className="muted">{t.eventsEmpty}</p>
      ) : (
        <div className="table-wrap review-events">
          <table>
            <thead>
              <tr>
                <th>{t.eventCols.time}</th>
                <th>{t.eventCols.who}</th>
                <th>{t.eventCols.what}</th>
                <th>{t.eventCols.field}</th>
                <th>{t.eventCols.change}</th>
                <th>{t.eventCols.confidence}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id}>
                  <td>{time(e.created_at)}</td>
                  <td>{e.actor_name}</td>
                  <td>
                    {REVIEW_EVENT_LABELS[e.kind]}
                    {e.comment && <div className="muted small">{e.comment}</div>}
                  </td>
                  <td>{e.field ? (SUGGESTION_FIELD_LABELS[e.field] ?? e.field) : S.documents.none}</td>
                  <td>{e.before !== null || e.after !== null ? `${e.before ?? "—"} → ${e.after ?? "—"}` : S.documents.none}</td>
                  <td>{e.confidence !== null ? `${Math.round(e.confidence * 100)}%` : S.documents.none}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

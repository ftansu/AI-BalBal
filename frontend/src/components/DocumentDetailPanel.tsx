import { downloadUrl, inlineUrl, useDocument } from "../api/documents";
import { useAuth } from "../auth/useAuth";
import { FileLink } from "./common/FileLink";
import { WorkbookInspectCard } from "./WorkbookInspectCard";
import { CONFIDENTIALITY_LABELS, INGESTION_LABELS, REVIEW_STATUS_LABELS, STATUS_LABELS, formatDate } from "../lib/format";
import { S } from "../lib/strings";
import { DocumentMetadataEditForm } from "./DocumentMetadataEditForm";
import { DocumentVisibilityCard } from "./DocumentVisibilityCard";
import { ErrorBox } from "./ErrorBox";
import { MetadataSuggestionPanel, type SuggestionPanelMode } from "./MetadataSuggestionPanel";
import { ReviewEventsCard } from "./review/ReviewEventsCard";
import { ReviewStatusCard } from "./review/ReviewStatusCard";
import { Spinner } from "./Spinner";

const SUBMITTABLE = new Set(["pending_metadata", "changes_requested"]);

export function DocumentDetailPanel({
  id,
  isAdmin,
  projectNames,
  onClose,
}: {
  id: string;
  isAdmin: boolean;
  projectNames: Map<string, string>;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const document = useDocument(id);
  if (document.isLoading) return <Spinner />;
  if (document.isError) return <ErrorBox error={document.error} />;
  const d = document.data;
  if (!d || !user) return null;
  const none = S.documents.none;
  const t = S.documents;
  // B-28 (ADR-024): the uploader submits (stage 1); the target department's own manager
  // decides (stage 2). Both are re-checked by the server — this only picks what to show.
  const isUploader = d.uploaded_by_id !== null && d.uploaded_by_id === user.id;
  const isTargetManager =
    user.role === "department_manager" && d.department !== null && user.department_slugs.includes(d.department);
  const panelMode: SuggestionPanelMode =
    isUploader && SUBMITTABLE.has(d.review_status) ? "uploader" : isAdmin ? "admin" : "readonly";
  return (
    <>
      <section className="card">
        <div className="actions" style={{ justifyContent: "space-between", marginTop: 0 }}>
          <h2>
            {t.detail}: {d.title}
          </h2>
          <button type="button" className="secondary small" onClick={onClose}>
            {t.close}
          </button>
        </div>
        <dl className="detail-grid">
          <dt>{t.columns.type}</dt>
          <dd>{d.document_type}</dd>
          <dt>{t.columns.counterparty}</dt>
          <dd>{d.counterparty}</dd>
          <dt>{t.columns.date}</dt>
          <dd>{formatDate(d.document_date)}</dd>
          <dt>{t.effectiveDate}</dt>
          <dd>{formatDate(d.effective_date)}</dd>
          <dt>{t.expirationDate}</dt>
          <dd>{formatDate(d.expiration_date)}</dd>
          <dt>{t.columns.status}</dt>
          <dd>
            {STATUS_LABELS[d.status]}
            {d.review_status !== "approved" && (
              <>
                {" "}
                <span className="badge warn">{REVIEW_STATUS_LABELS[d.review_status]}</span>
              </>
            )}
          </dd>
          <dt>{t.version}</dt>
          <dd>{d.version}</dd>
          <dt>{t.columns.confidentiality}</dt>
          <dd>{CONFIDENTIALITY_LABELS[d.confidentiality]}</dd>
          <dt>{t.columns.project}</dt>
          <dd>{(d.project_id && projectNames.get(d.project_id)) || none}</dd>
          <dt>{t.columns.subdepartment}</dt>
          <dd>{d.subdepartment ?? none}</dd>
          <dt>{t.tags}</dt>
          <dd>{d.tags.length ? d.tags.join(", ") : none}</dd>
          <dt>{t.supersedes}</dt>
          <dd>{d.supersedes_document_id ? <FileLink documentId={d.supersedes_document_id} title={t.openVersion} /> : none}</dd>
          <dt>{t.supersededBy}</dt>
          <dd>{d.superseded_by_document_id ? <FileLink documentId={d.superseded_by_document_id} title={t.openVersion} /> : none}</dd>
          <dt>{t.columns.ingestion}</dt>
          <dd>
            {INGESTION_LABELS[d.ingestion_status]}
            {d.page_count !== null && ` · ${t.pages}: ${d.page_count}`}
            {d.ingestion_error && (
              <div className="error-box">
                {t.ingestionError}: {d.ingestion_error}
              </div>
            )}
          </dd>
        </dl>
        <div className="actions">
          <a className="button" href={inlineUrl(d.id)} target="_blank" rel="noreferrer">
            {t.open}
          </a>
          <a className="button secondary" href={downloadUrl(d.id)} download>
            {t.download}
          </a>
        </div>
      </section>
      <ReviewStatusCard document={d} canReview={isTargetManager} />
      {d.ingestion_status === "ready" && <WorkbookInspectCard documentId={d.id} />}
      {isAdmin && <DocumentVisibilityCard documentId={d.id} />}
      {isAdmin && <DocumentMetadataEditForm current={d} />}
      {d.ingestion_status === "ready" && (
        <MetadataSuggestionPanel documentId={d.id} poll={false} mode={panelMode} current={d} />
      )}
      {isAdmin && <ReviewEventsCard documentId={d.id} />}
    </>
  );
}

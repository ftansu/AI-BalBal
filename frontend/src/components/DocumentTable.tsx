import type { DocumentListItem, IngestionStatus } from "../api/types";
import {
  CONFIDENTIALITY_LABELS,
  FILE_KIND_LABELS,
  INGESTION_LABELS,
  REVIEW_STATUS_LABELS,
  STATUS_LABELS,
  formatDate,
} from "../lib/format";
import { S } from "../lib/strings";
import { DownloadLink, FileLink } from "./common/FileLink";

const INGESTION_CLASS: Record<IngestionStatus, string> = {
  uploaded: "neutral",
  ocr: "warn",
  ready: "ok",
  failed: "err",
};

export function DocumentTable({
  documents,
  projectNames,
  selectedId,
  onSelect,
  showSubdepartment,
  subdepartmentLabel = (value) => value,
}: {
  documents: DocumentListItem[];
  projectNames: Map<string, string>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  showSubdepartment: boolean;
  /** Seeded documents store the child department's slug; show its name instead. */
  subdepartmentLabel?: (value: string) => string;
}) {
  if (documents.length === 0) {
    return <p className="muted">{S.documents.empty}</p>;
  }
  const c = S.documents.columns;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>{c.title}</th>
            <th>{c.type}</th>
            <th>{c.counterparty}</th>
            <th>{c.date}</th>
            <th>{c.status}</th>
            <th>{c.confidentiality}</th>
            <th>{c.project}</th>
            {showSubdepartment && <th>{c.subdepartment}</th>}
            <th>{c.ingestion}</th>
            <th aria-label={S.documents.download} />
          </tr>
        </thead>
        <tbody>
          {documents.map((d) => (
            <tr
              key={d.id}
              className={`clickable${d.id === selectedId ? " selected" : ""}`}
              onClick={() => onSelect(d.id)}
            >
              <td onClick={(e) => e.stopPropagation()}>
                <FileLink documentId={d.id} title={d.title} showDownload={false} />
                {d.file_kind && (
                  <span className="muted small" title={c.kind}>
                    {" "}
                    {FILE_KIND_LABELS[d.file_kind]}
                  </span>
                )}
              </td>
              <td>{d.document_type}</td>
              <td>{d.counterparty}</td>
              <td>{formatDate(d.document_date)}</td>
              <td>
                {STATUS_LABELS[d.status]}
                {/* B-28 publication state next to the lifecycle status — approved is badged too, so
                    "Taslak" alone never reads as "not approved" (UX notu 1, T-12 onay bekliyor). */}
                {d.review_status && (
                  <>
                    {" "}
                    <span className={`badge ${d.review_status === "approved" ? "ok" : "warn"}`}>
                      {REVIEW_STATUS_LABELS[d.review_status]}
                    </span>
                  </>
                )}
              </td>
              <td>{CONFIDENTIALITY_LABELS[d.confidentiality]}</td>
              <td>{(d.project_id && projectNames.get(d.project_id)) || S.documents.none}</td>
              {showSubdepartment && (
                <td>{d.subdepartment ? subdepartmentLabel(d.subdepartment) : S.documents.none}</td>
              )}
              <td>
                <span className={`badge ${INGESTION_CLASS[d.ingestion_status]}`}>
                  {INGESTION_LABELS[d.ingestion_status]}
                </span>
              </td>
              <td onClick={(e) => e.stopPropagation()}>
                <DownloadLink documentId={d.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

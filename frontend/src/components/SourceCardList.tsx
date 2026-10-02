import type { ExcelSourceCard, SourceCard } from "../api/types";
import { STATUS_LABELS, formatDate } from "../lib/format";
import { S } from "../lib/strings";
import { DownloadLink, FileLink } from "./common/FileLink";

/** One card per cited (document, page) — SPEC_02 §10: belge, sayfa, tarih, versiyon, proje.
 * Every title is a link to the file plus a separate "İndir" link (sabit kural). */
export function SourceCardList({
  sources,
  projectOfDocument,
}: {
  sources: SourceCard[];
  projectOfDocument: (documentId: string) => string | null;
}) {
  if (sources.length === 0) return <p className="muted">{S.ask.noSources}</p>;
  return (
    <div className="source-list">
      {sources.map((s) => {
        // Aşama D: the card carries the project; the list-based lookup stays as a fallback.
        const project = s.project_name ?? projectOfDocument(s.document_id);
        return (
          <div className="source" key={`${s.ref}-${s.document_id}-${s.page_number}`}>
            <div className="source-head">
              <span className="ref">[{s.ref}]</span>
              <FileLink documentId={s.document_id} title={s.title} showDownload={false} />
              <span className="source-meta-inline">
                — {S.ask.page} {s.page_number} · {formatDate(s.document_date)} · v{s.version}
              </span>
              <span className={`badge ${s.is_current ? "ok" : "warn"}`}>
                {s.is_current ? S.ask.current : S.ask.historical}
              </span>
              <DownloadLink documentId={s.document_id} />
            </div>
            <div className="meta">
              {STATUS_LABELS[s.status]}
              {s.effective_date && ` · ${S.ask.effective}: ${formatDate(s.effective_date)}`}
              {project && ` · ${S.ask.project}: ${project}`}
            </div>
            {s.superseded_by_title && (
              // Aşama A (B-07): the newer version is a link — sabit kural, her belge referansı açılabilir.
              <div className="superseded-warning">
                {S.ask.supersededBy("")}{" "}
                <FileLink documentId={s.superseded_by_document_id} title={s.superseded_by_title} showDownload={false} />
              </div>
            )}
            {s.supersedes_title && (
              <div className="meta">
                {S.ask.supersedes("")}{" "}
                <FileLink documentId={s.supersedes_document_id} title={s.supersedes_title} showDownload={false} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** One card per cited workbook range — SPEC_04 §5: dosya, sheet, aralık (Phase 4.3). */
export function ExcelSourceCardList({ sources }: { sources: ExcelSourceCard[] }) {
  if (sources.length === 0) return <p className="muted">{S.ask.noSources}</p>;
  return (
    <div className="source-list">
      {sources.map((s) => (
        <div className="source" key={s.label}>
          <div className="source-head">
            <span className="badge neutral">{S.ask.queryType.DATA_QUERY}</span>
            <FileLink documentId={s.document_id} title={s.file} showDownload={false} />
            <span className="source-meta-inline">
              — {S.ask.sheet}: {s.sheet} · {S.ask.range}: {s.range}
            </span>
            <DownloadLink documentId={s.document_id} />
          </div>
        </div>
      ))}
    </div>
  );
}

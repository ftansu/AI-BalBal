import { useDocuments } from "../../api/documents";
import { SEARCH_MIN_LENGTH, useSearch, type SearchDocumentHit } from "../../api/search";
import { MATCHED_ON_LABELS, STAGE_LABELS, formatDate } from "../../lib/format";
import { S } from "../../lib/strings";
import { FileLink } from "../common/FileLink";
import { CloseButton } from "../common/Modal";
import { useShell } from "./ShellContext";

/** Üst bar araması — canvas: Arama-Sonuclari.dc.html. B-14 (company-ai Aşama D): tek uç
 * `GET /api/search` belge içeriği + metadata (snippet, sayfa), proje ve kişi sonuçlarını
 * yetki süzgecinden geçirip döner. Sorgu boşken kullanıcının son belgeleri listelenir.
 * Cevap isteyen sorular Balbal'a yönlendirilir. */
export function SearchPanel({ query, onClose }: { query: string; onClose: () => void }) {
  const { openBalbal } = useShell();
  const q = query.trim();
  const active = q.length >= SEARCH_MIN_LENGTH;
  const recent = useDocuments({});
  const search = useSearch(q);

  const docs: SearchDocumentHit[] = active
    ? (search.data?.documents ?? [])
    : (recent.data ?? []).slice(0, 4).map((d) => ({ ...d, snippet: null, page_number: null, matched_on: "content" as const }));
  const projectHits = active ? (search.data?.projects ?? []) : [];
  const personHits = active ? (search.data?.people ?? []) : [];
  const nothing = active && search.isSuccess && docs.length === 0 && projectHits.length === 0 && personHits.length === 0;

  return (
    <div className="popover search-panel" role="dialog" aria-label={S.shell.search}>
      <div className="popover-head">
        <span className="muted small">{active ? S.shell.resultsFor(q) : S.shell.searchHint}</span>
        <CloseButton onClick={onClose} />
      </div>
      <div className="popover-body">
        {active && (
          <button
            type="button"
            className="ask-balbal-row"
            onClick={() => {
              onClose();
              openBalbal(q);
            }}
          >
            <span className="agent-mark" aria-hidden="true" />
            {S.shell.askBalbal}: <strong>{q}</strong>
          </button>
        )}
        {docs.length > 0 && <div className="section-label">{active ? S.shell.documents : S.shell.recentDocuments}</div>}
        {docs.map((d) => (
          <div key={d.id} className="search-row">
            <FileLink documentId={d.id} title={d.title} />
            <span className="muted small">
              {d.document_type} · {d.counterparty} · {formatDate(d.document_date)}
              {d.page_number !== null && ` · ${S.shell.snippetPage(d.page_number)}`}
            </span>
            {d.snippet && <span className="muted small search-snippet">{d.snippet}</span>}
            {active && d.matched_on !== "content" && (
              <span className="badge neutral" title={S.shell.matchedOnTitle}>
                {MATCHED_ON_LABELS[d.matched_on] ?? d.matched_on}
              </span>
            )}
            {d.status === "superseded" && <span className="badge warn">{S.ask.historical}</span>}
          </div>
        ))}
        {projectHits.length > 0 && <div className="section-label">{S.shell.projects}</div>}
        {projectHits.map((p) => (
          <div key={p.id} className="search-row">
            <strong>{p.name}</strong>
            <span className="muted small">
              {p.code} · {STAGE_LABELS[p.stage]}
            </span>
          </div>
        ))}
        {personHits.length > 0 && <div className="section-label">{S.shell.people}</div>}
        {personHits.map((p) => (
          <div key={p.id} className="search-row">
            <strong>{p.display_name}</strong>
            <span className="muted small">
              {p.title ?? ""} · {p.department_name ?? ""}
            </span>
          </div>
        ))}
        {nothing && <p className="muted">{S.shell.noResults}</p>}
      </div>
      <div className="popover-foot muted small">{S.shell.searchFoot}</div>
    </div>
  );
}

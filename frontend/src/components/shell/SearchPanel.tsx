import { useDocuments } from "../../api/documents";
import { useProjects } from "../../api/projects";
import { isPending, useDirectory } from "../../api/proposed";
import { STAGE_LABELS, formatDate } from "../../lib/format";
import { S } from "../../lib/strings";
import { FileLink } from "../common/FileLink";
import { CloseButton } from "../common/Modal";
import { useShell } from "./ShellContext";

const norm = (s: string) => s.toLocaleLowerCase("tr");

/** Üst bar araması — canvas: Arama-Sonuclari.dc.html. Belge ve proje araması mevcut
 * `/api/documents` + `/api/projects` üzerinden (yalnızca yetkili kayıtlar döner); kişi
 * araması `/api/directory` bekliyor. Belge İÇERİĞİNDE arama Balbal'a yönlendirilir. */
export function SearchPanel({ query, onClose }: { query: string; onClose: () => void }) {
  const { openBalbal } = useShell();
  const documents = useDocuments({});
  const projects = useProjects();
  const q = norm(query.trim());
  const people = useDirectory(query.trim(), null);

  const docs = (documents.data ?? [])
    .filter((d) => !q || norm(`${d.title} ${d.document_type} ${d.counterparty}`).includes(q))
    .slice(0, q ? 8 : 4);
  const projectHits = q ? (projects.data ?? []).filter((p) => norm(`${p.name} ${p.code}`).includes(q)) : [];
  const personHits = q ? (people.data ?? []) : [];
  const nothing = q && docs.length === 0 && projectHits.length === 0 && personHits.length === 0;

  return (
    <div className="popover search-panel" role="dialog" aria-label={S.shell.search}>
      <div className="popover-head">
        <span className="muted small">{q ? S.shell.resultsFor(query.trim()) : S.shell.searchHint}</span>
        <CloseButton onClick={onClose} />
      </div>
      <div className="popover-body">
        {q && (
          <button
            type="button"
            className="ask-balbal-row"
            onClick={() => {
              onClose();
              openBalbal(query.trim());
            }}
          >
            <span className="brand-mark" aria-hidden="true" />
            {S.shell.askBalbal}: <strong>{query.trim()}</strong>
          </button>
        )}
        {docs.length > 0 && <div className="section-label">{q ? S.shell.documents : S.shell.recentDocuments}</div>}
        {docs.map((d) => (
          <div key={d.id} className="search-row">
            <FileLink documentId={d.id} title={d.title} />
            <span className="muted small">
              {d.document_type} · {d.counterparty} · {formatDate(d.document_date)}
            </span>
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
        {q && personHits.length > 0 && <div className="section-label">{S.shell.people}</div>}
        {personHits.map((p) => (
          <div key={p.id} className="search-row">
            <strong>{p.display_name}</strong>
            <span className="muted small">
              {p.title ?? ""} · {p.department_name ?? ""}
            </span>
          </div>
        ))}
        {q && isPending(people.error) && <p className="muted small">{S.shell.peoplePending}</p>}
        {nothing && <p className="muted">{S.shell.noResults}</p>}
      </div>
      <div className="popover-foot muted small">{S.shell.searchFoot}</div>
    </div>
  );
}

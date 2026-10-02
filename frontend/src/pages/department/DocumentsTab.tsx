import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import { useDepartments } from "../../api/departments";
import { useDocuments } from "../../api/documents";
import { projectNameById, useProjects } from "../../api/projects";
import { useMyFolders, type UserFolder } from "../../api/folders";
import type { Department, DocumentListItem, ReviewStatus } from "../../api/types";
import { FolderIcon } from "../../components/common/FolderIcon";
import { DocumentDetailPanel } from "../../components/DocumentDetailPanel";
import { DocumentTable } from "../../components/DocumentTable";
import { ErrorBox } from "../../components/ErrorBox";
import { ReviewFilterChips } from "../../components/review/ReviewFilterChips";
import { Spinner } from "../../components/Spinner";
import { ancestorNames, orderTree, subtreeIds } from "../../lib/folders";
import { applyReviewFilter } from "../../lib/review";
import { S } from "../../lib/strings";
import type { DepartmentContext } from "../Department";

function matchesSubdepartment(document: DocumentListItem, sub: Department): boolean {
  const value = document.subdepartment?.toLocaleLowerCase("tr") ?? "";
  return value === sub.name.toLocaleLowerCase("tr") || value === sub.slug;
}

/** Belgeler — canvas: Departman-Belgeleri.dc.html. Klasörler (B-26, company-ai Aşama E): solda
 * kullanıcının görebildiği klasör ağacı (kendi departmanı + bana açılanlar), sağda seçili
 * klasörün belgeleri. Kullanıcının hiç klasörü yoksa departmanın bütün belgeleri listelenir. */
export function DocumentsTab() {
  const folders = useMyFolders();
  if (folders.isLoading) return <Spinner />;
  if (folders.isSuccess && folders.data.length > 0) return <FolderDocuments folders={folders.data} />;
  return <DepartmentDocuments folderError={folders.isError ? folders.error : null} />;
}

function DepartmentDocuments({ folderError }: { folderError: unknown }) {
  const { department, children, subdepartment, isAdmin } = useOutletContext<DepartmentContext>();
  const documents = useDocuments({ department: department.slug });
  const projects = useProjects();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reviewFilter, setReviewFilter] = useState<ReviewStatus | null>(null);

  if (documents.isLoading) return <Spinner />;
  if (documents.isError) return <ErrorBox error={documents.error} />;
  const all = documents.data ?? [];
  const inScope = subdepartment ? all.filter((d) => matchesSubdepartment(d, subdepartment)) : all;
  const visible = applyReviewFilter(inScope, reviewFilter);
  const projectNames = projectNameById(projects.data);

  return (
    <>
      <h2>{S.documents.title}</h2>
      {folderError !== null && <ErrorBox error={folderError} />}
      <ReviewFilterChips documents={inScope} value={reviewFilter} onChange={setReviewFilter} />
      <DocumentTable
        documents={visible}
        projectNames={projectNames}
        selectedId={selectedId}
        onSelect={(id) => setSelectedId(id === selectedId ? null : id)}
        showSubdepartment={children.length > 0}
        subdepartmentLabel={(value) =>
          children.find((c) => c.slug === value || c.name === value)?.name ?? value
        }
      />
      {selectedId && (
        <div style={{ marginTop: 16 }}>
          <DocumentDetailPanel
            id={selectedId}
            isAdmin={isAdmin}
            projectNames={projectNames}
            onClose={() => setSelectedId(null)}
          />
        </div>
      )}
    </>
  );
}

function FolderDocuments({ folders }: { folders: UserFolder[] }) {
  const t = S.documents.folders;
  const { department, isAdmin } = useOutletContext<DepartmentContext>();
  const departments = useDepartments();
  // Bütün yetkili belgeler: paylaşılan klasörlerin belgeleri başka departmana aittir.
  // Yetki süzmesini backend yapar (allowed_document_ids); burada yalnızca klasöre göre ayrılır.
  const documents = useDocuments({});
  const projects = useProjects();
  const own = folders.filter((f) => f.owner_department_slug === department.slug);
  const shared = folders.filter((f) => f.owner_department_slug !== department.slug);
  const ownRows = orderTree(own);
  const sharedRows = orderTree(shared);
  const [folderId, setFolderId] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reviewFilter, setReviewFilter] = useState<ReviewStatus | null>(null);

  const selected = folders.find((f) => f.id === folderId) ?? ownRows[0]?.folder ?? sharedRows[0]?.folder;
  if (documents.isLoading) return <Spinner />;
  if (documents.isError) return <ErrorBox error={documents.error} />;
  if (!selected) return null;

  const deptName = (slug: string) => departments.data?.find((d) => d.slug === slug)?.name ?? slug;
  const isOwn = selected.owner_department_slug === department.slug;
  const canWrite = selected.access === "write";
  const all = documents.data ?? [];
  const hasFolderField = all.some((d) => d.folder_id !== undefined && d.folder_id !== null);
  const scope = subtreeIds(folders, selected.id);
  const needle = q.trim().toLocaleLowerCase("tr");
  const inFolder = all.filter(
    (d) =>
      (!hasFolderField || (d.folder_id != null && scope.has(d.folder_id))) &&
      (projectId === null || d.project_id === projectId) &&
      (!needle || `${d.title} ${d.counterparty} ${d.document_type}`.toLocaleLowerCase("tr").includes(needle)),
  );
  const visible = applyReviewFilter(inFolder, reviewFilter);
  const projectNames = projectNameById(projects.data);
  const ancestors = ancestorNames(folders, selected.id);
  // Paylaşılan klasörün üst klasörleri kullanıcıya görünmeyebilir; o zaman yol sahibi departmanla başlar.
  let top: UserFolder = selected;
  while (top.parent_id !== null) {
    const parent = folders.find((f) => f.id === top.parent_id);
    if (!parent) break;
    top = parent;
  }
  const path = top.parent_id !== null ? [deptName(selected.owner_department_slug), ...ancestors] : ancestors;

  const node = (f: UserFolder, depth: number, isShared: boolean) => (
    <button
      type="button"
      key={f.id}
      role="treeitem"
      aria-selected={f.id === selected.id}
      className={`folder-node${f.id === selected.id ? " active" : ""}${depth === 0 ? " root" : ""}`}
      style={{ paddingLeft: 10 + depth * 18 }}
      onClick={() => {
        setFolderId(f.id);
        setSelectedId(null);
        setQ("");
      }}
    >
      <FolderIcon shared={isShared} />
      <span className="folder-name">{f.name}</span>
      {isShared ? (
        <span className={`access-badge ${f.access}`}>{f.access === "write" ? t.write : t.read}</span>
      ) : (
        <span className="muted small">{f.document_count}</span>
      )}
    </button>
  );

  return (
    <div className="folder-layout">
      <aside className="card folder-tree-card">
        <div className="folder-tree" role="tree" aria-label={S.documents.title}>
          <div className="section-label">{t.own}</div>
          {ownRows.map(({ folder, depth }) => node(folder, depth, false))}
          {sharedRows.length > 0 && <div className="section-label">{t.shared}</div>}
          {sharedRows.map(({ folder, depth }) => node(folder, depth, true))}
        </div>
        <p className="folder-tree-note muted small">{t.note}</p>
      </aside>

      <section className="card folder-main">
        <div className="folder-head">
          <div>
            <div className="muted small">{path.length ? `${path.join(" / ")} /` : t.root}</div>
            <div className="folder-title-row">
              <h2 className="folder-title">{selected.name}</h2>
              <span className={`access-badge ${selected.access}`}>{canWrite ? t.write : t.read}</span>
            </div>
            <div className="muted small">
              {isOwn
                ? t.ownNote
                : canWrite
                  ? t.writeNote(deptName(selected.owner_department_slug))
                  : t.sharedNote(deptName(selected.owner_department_slug))}
            </div>
          </div>
          {canWrite && (
            <Link to={`/departman/${department.slug}/yukle?klasor=${encodeURIComponent(selected.id)}`} className="button">
              {t.uploadHere}
            </Link>
          )}
        </div>


        <div className="chips">
          <label htmlFor="folder-search" className="sr-only">
            {t.search}
          </label>
          <input
            id="folder-search"
            type="search"
            className="search-input"
            placeholder={t.search}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <span className="muted small">{t.project}:</span>
          <button type="button" className={`chip${projectId === null ? " active" : ""}`} onClick={() => setProjectId(null)}>
            {t.allProjects}
          </button>
          {(projects.data ?? [])
            .filter((p) => p.is_active)
            .map((p) => (
              <button
                type="button"
                key={p.id}
                className={`chip${projectId === p.id ? " active" : ""}`}
                onClick={() => setProjectId(p.id)}
              >
                {p.name}
              </button>
            ))}
        </div>
        <ReviewFilterChips documents={inFolder} value={reviewFilter} onChange={setReviewFilter} />

        {visible.length === 0 ? (
          <p className="muted">{t.empty}</p>
        ) : (
          <DocumentTable
            documents={visible}
            projectNames={projectNames}
            selectedId={selectedId}
            onSelect={(id) => setSelectedId(id === selectedId ? null : id)}
            showSubdepartment={false}
            subdepartmentLabel={(value) => value}
          />
        )}
        {selectedId && (
          <div style={{ marginTop: 16 }}>
            <DocumentDetailPanel
              id={selectedId}
              isAdmin={isAdmin}
              projectNames={projectNames}
              onClose={() => setSelectedId(null)}
            />
          </div>
        )}
      </section>
    </div>
  );
}

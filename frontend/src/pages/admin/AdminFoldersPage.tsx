import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, type FormEvent } from "react";

import { useDepartments } from "../../api/departments";
import {
  createFolder,
  updateFolderGrants,
  useAdminFolders,
  useFolderAudit,
  type AdminFolder,
  type EffectiveAccess,
  type FolderAccess,
} from "../../api/folders";
import { isPending } from "../../api/proposed";
import type { Department } from "../../api/types";
import { FolderIcon } from "../../components/common/FolderIcon";
import { PendingNotice } from "../../components/common/Modal";
import { ErrorBox } from "../../components/ErrorBox";
import { Spinner } from "../../components/Spinner";
import { formatDate } from "../../lib/format";
import { ancestorNames, orderTree } from "../../lib/folders";
import { S } from "../../lib/strings";

type View = "folder" | "matrix" | "history";
type Choice = "none" | FolderAccess;

interface Effective {
  access: EffectiveAccess;
  inherited: boolean;
}

function effectiveOf(folder: AdminFolder, slug: string): Effective {
  if (folder.owner_department_slug === slug) return { access: "owner", inherited: false };
  const grant = folder.grants.find((g) => g.department_slug === slug);
  return grant ? { access: grant.access, inherited: grant.inherited } : { access: "none", inherited: false };
}

/** Klasörler ve erişim — B-26, canvas: Yonetim.dc.html › "Klasörler ve erişim".
 * Sistem yöneticisi klasör ağacını ve her klasör için departman bazında görme/değiştirme
 * yetkisini belirler. Mirası ve etkin yetkiyi backend hesaplar; burada yalnızca gösterilir
 * ve seçili klasörde tanımlı yetkiler yazılır. */
export function AdminFoldersPage() {
  const t = S.admin.folders;
  const folders = useAdminFolders();
  const departments = useDepartments();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<View>("folder");
  const [pending, setPending] = useState<Record<string, Choice>>({});
  const [saved, setSaved] = useState(false);
  const [creating, setCreating] = useState(false);

  const topLevel: Department[] = useMemo(
    () => (departments.data ?? []).filter((d) => d.parent_id === null),
    [departments.data],
  );
  const deptName = (slug: string) => topLevel.find((d) => d.slug === slug)?.name ?? slug;
  const list = folders.data ?? [];
  const rows = orderTree(list);
  const selected = list.find((f) => f.id === selectedId) ?? rows[0]?.folder ?? null;

  if (folders.isLoading || departments.isLoading) return <Spinner />;
  if (isPending(folders.error)) {
    return (
      <>
        <h1>{S.admin.tabs.folders}</h1>
        <PendingNotice endpoint="GET /api/admin/folders">{t.pendingTree}</PendingNotice>
      </>
    );
  }
  if (folders.isError) return <ErrorBox error={folders.error} />;
  if (departments.isError) return <ErrorBox error={departments.error} />;

  const select = (id: string) => {
    setSelectedId(id);
    setPending({});
    setSaved(false);
  };

  return (
    <>
      <h1>{S.admin.tabs.folders}</h1>
      <div className="folder-layout">
        <aside className="card folder-tree-card">
          <div className="folder-tree-head">
            <strong>{t.treeTitle}</strong>
            <button type="button" className="small" onClick={() => setCreating((v) => !v)}>
              {t.newFolder}
            </button>
          </div>
          {creating && (
            <NewFolderForm folders={list} departments={topLevel} onDone={() => setCreating(false)} />
          )}
          <div className="folder-tree" role="tree" aria-label={t.treeTitle}>
            {rows.map(({ folder, depth }) => {
              const shared = folder.grants.length > 0;
              return (
                <button
                  type="button"
                  key={folder.id}
                  role="treeitem"
                  aria-selected={selected?.id === folder.id}
                  className={`folder-node${selected?.id === folder.id ? " active" : ""}${depth === 0 ? " root" : ""}`}
                  style={{ paddingLeft: 10 + depth * 18 }}
                  onClick={() => select(folder.id)}
                >
                  <FolderIcon muted={depth > 0} />
                  <span className="folder-name">{folder.name}</span>
                  {shared && <span className="access-badge write">{t.shared}</span>}
                  <span className="muted small">{folder.document_count}</span>
                </button>
              );
            })}
          </div>
          <p className="folder-tree-note muted small">{t.treeNote}</p>
        </aside>

        <section className="card folder-main">
          <div className="chips">
            {(["folder", "matrix", "history"] as View[]).map((v) => (
              <button
                type="button"
                key={v}
                className={`chip${view === v ? " active" : ""}`}
                onClick={() => setView(v)}
              >
                {t.views[v]}
              </button>
            ))}
          </div>

          {view === "folder" &&
            (selected ? (
              <FolderGrants
                folder={selected}
                path={ancestorNames(list, selected.id)}
                departments={topLevel}
                deptName={deptName}
                pending={pending}
                setPending={(next) => {
                  setPending(next);
                  setSaved(false);
                }}
                saved={saved}
                onSaved={() => {
                  setPending({});
                  setSaved(true);
                }}
              />
            ) : (
              <p className="muted">{t.pick}</p>
            ))}

          {view === "matrix" && (
            <div className="table-wrap">
              <table className="access-matrix">
                <thead>
                  <tr>
                    <th>{t.folderCol}</th>
                    {topLevel.map((d) => (
                      <th key={d.id}>{d.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ folder, depth }) => (
                    <tr key={folder.id}>
                      <td style={{ paddingLeft: 12 + depth * 16 }} className={depth === 0 ? "strong" : "muted"}>
                        {folder.name}
                      </td>
                      {topLevel.map((d) => {
                        const e = effectiveOf(folder, d.slug);
                        return (
                          <td key={d.id} className="center">
                            <AccessLabel access={e.access} inherited={e.inherited} />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="muted small">{t.legend}</p>
            </div>
          )}

          {view === "history" && <FolderHistory deptName={deptName} />}
        </section>
      </div>
    </>
  );
}

function FolderGrants({
  folder,
  path,
  departments,
  deptName,
  pending,
  setPending,
  saved,
  onSaved,
}: {
  folder: AdminFolder;
  path: string[];
  departments: Department[];
  deptName: (slug: string) => string;
  pending: Record<string, Choice>;
  setPending: (next: Record<string, Choice>) => void;
  saved: boolean;
  onSaved: () => void;
}) {
  const t = S.admin.folders;
  const queryClient = useQueryClient();
  const save = useMutation({
    mutationFn: () => {
      // Bu klasörde tanımlı (miras olmayan) yetkiler + bekleyen değişiklikler.
      const own = new Map<string, Choice>(
        folder.grants.filter((g) => !g.inherited).map((g) => [g.department_slug, g.access]),
      );
      for (const [slug, choice] of Object.entries(pending)) own.set(slug, choice);
      const grants = [...own.entries()].map(([department_slug, access]) => ({ department_slug, access }));
      return updateFolderGrants(folder.id, grants);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-folders"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-folders-audit"] });
      onSaved();
    },
  });
  const dirty = Object.keys(pending).length;

  return (
    <div className="folder-grants">
      <div>
        <div className="muted small">{path.length ? `${path.join(" / ")} /` : t.root}</div>
        <h2 className="folder-title">{folder.name}</h2>
        <div className="folder-meta small">
          <span>
            {t.owner}: <strong>{deptName(folder.owner_department_slug)}</strong> {t.ownerNote}
          </span>
          <span>
            {t.documents}: <strong>{folder.document_count}</strong>
          </span>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t.department}</th>
              <th>{t.access}</th>
              <th>{t.source}</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((d) => {
              const e = effectiveOf(folder, d.slug);
              const pendingChoice = pending[d.slug] as Choice | undefined;
              const current: Choice | "owner" = e.access === "owner" ? "owner" : (pendingChoice ?? e.access);
              const source =
                e.access === "owner"
                  ? t.srcOwner
                  : pendingChoice
                    ? t.srcOwn
                    : e.access === "none"
                      ? "—"
                      : e.inherited
                        ? t.srcInherited
                        : t.srcOwn;
              return (
                <tr key={d.id}>
                  <td className="strong">{d.name}</td>
                  <td>
                    {current === "owner" ? (
                      <span className="access-badge owner">{t.ownerBadge}</span>
                    ) : (
                      <div className="seg" role="group" aria-label={`${d.name} — ${t.access}`}>
                        {(["none", "read", "write"] as Choice[]).map((c) => (
                          <button
                            type="button"
                            key={c}
                            aria-pressed={current === c}
                            className={`seg-btn ${c}${current === c ? " on" : ""}`}
                            onClick={() => setPending({ ...pending, [d.slug]: c })}
                          >
                            {t[c]}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className={`small ${e.inherited && !pendingChoice ? "warn-text" : "muted"}`}>{source}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="help-grid small">
        <div>
          <strong>{t.read}:</strong> {t.readHelp}
        </div>
        <div>
          <strong>{t.write}:</strong> {t.writeHelp}
        </div>
      </div>
      <p className="muted small">{t.confNote}</p>

      {save.isError && <ErrorBox error={save.error} />}
      {isPending(save.error) && (
        <PendingNotice endpoint="PUT /api/admin/folders/{id}/grants">{t.pendingTree}</PendingNotice>
      )}
      {dirty > 0 && (
        <div className="dirty-bar">
          <span>{t.dirty(dirty)}</span>
          <button type="button" className="secondary small" onClick={() => setPending({})}>
            {t.cancel}
          </button>
          <button type="button" className="small" disabled={save.isPending} onClick={() => save.mutate()}>
            {save.isPending ? t.saving : t.save}
          </button>
        </div>
      )}
      {saved && dirty === 0 && (
        <div className="notice ok-notice" role="status">
          {t.saved}
        </div>
      )}
    </div>
  );
}

function NewFolderForm({
  folders,
  departments,
  onDone,
}: {
  folders: AdminFolder[];
  departments: Department[];
  onDone: () => void;
}) {
  const t = S.admin.folders;
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [owner, setOwner] = useState(departments[0]?.slug ?? "");
  const create = useMutation({
    mutationFn: () =>
      createFolder({
        name: name.trim(),
        parent_id: parentId || null,
        // Alt klasörün sahibi üst klasörün sahibidir.
        owner_department_slug: folders.find((f) => f.id === parentId)?.owner_department_slug ?? owner,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-folders"] });
      onDone();
    },
  });

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (name.trim()) create.mutate();
  }

  return (
    <form className="new-folder" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="nf-name">{t.name}</label>
        <input id="nf-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="field">
        <label htmlFor="nf-parent">{t.parent}</label>
        <select id="nf-parent" value={parentId} onChange={(e) => setParentId(e.target.value)}>
          <option value="">{t.noParent}</option>
          {orderTree(folders).map(({ folder, depth }) => (
            <option key={folder.id} value={folder.id}>
              {"  ".repeat(depth)}
              {folder.name}
            </option>
          ))}
        </select>
      </div>
      {!parentId && (
        <div className="field">
          <label htmlFor="nf-owner">{t.owner}</label>
          <select id="nf-owner" value={owner} onChange={(e) => setOwner(e.target.value)}>
            {departments.map((d) => (
              <option key={d.id} value={d.slug}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {create.isError && !isPending(create.error) && <ErrorBox error={create.error} />}
      {isPending(create.error) && <PendingNotice endpoint="POST /api/admin/folders" />}
      <button type="submit" className="small" disabled={create.isPending}>
        {t.create}
      </button>
    </form>
  );
}

function FolderHistory({ deptName }: { deptName: (slug: string) => string }) {
  const t = S.admin.folders;
  const audit = useFolderAudit();
  if (audit.isLoading) return <Spinner />;
  if (isPending(audit.error)) return <PendingNotice endpoint="GET /api/admin/folders/audit">{t.pendingAudit}</PendingNotice>;
  if (audit.isError) return <ErrorBox error={audit.error} />;
  const rows = audit.data ?? [];
  if (rows.length === 0) return <p className="muted">{t.histEmpty}</p>;
  const label = (a: "none" | FolderAccess) => t[a];
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>{t.histCols.time}</th>
            <th>{t.histCols.who}</th>
            <th>{t.histCols.what}</th>
            <th>{t.histCols.before}</th>
            <th>{t.histCols.after}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((h) => (
            <tr key={h.id}>
              <td className="muted">{formatDate(h.created_at)}</td>
              <td>{h.actor_name}</td>
              <td>
                {h.folder_name} · {deptName(h.department_slug)}
              </td>
              <td className="muted">{label(h.before)}</td>
              <td className="strong">{label(h.after)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AccessLabel({ access, inherited }: { access: EffectiveAccess; inherited: boolean }) {
  const t = S.admin.folders;
  if (access === "none") return <span className="muted">–</span>;
  const text = access === "owner" ? t.owner : t[access];
  return <span className={`access-badge ${access}${inherited ? " inherited" : ""}`}>{text}</span>;
}

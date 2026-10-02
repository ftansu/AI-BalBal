import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";

import { useAdminEvents } from "../../api/admin-events";
import { ADMIN_TAGS_KEY, TAGS_KEY, createTag, updateTag, useAdminTags } from "../../api/tags";
import type { Tag, TagKind } from "../../api/types";
import { ErrorBox } from "../../components/ErrorBox";
import { Spinner } from "../../components/Spinner";
import { TAG_KIND_LABELS, formatDate } from "../../lib/format";
import { S } from "../../lib/strings";

const KINDS: TagKind[] = ["identity", "change"];

function time(iso: string): string {
  return `${formatDate(iso)} ${iso.slice(11, 16)}`;
}

/** Yönetim › Etiketler — B-28b (company-ai ADR-025, BACKEND_GAPS §4.7.4). The customer admin
 * grows the company's fixed tag list and retires what is no longer used. Nothing is deleted:
 * old documents keep referring to a retired tag. Every change lands in the admin ledger. */
export function AdminTagsPage() {
  const t = S.admin.tags;
  const tags = useAdminTags();
  const [creating, setCreating] = useState(false);

  if (tags.isLoading) return <Spinner />;
  if (tags.isError) return <ErrorBox error={tags.error} />;
  const rows = [...(tags.data ?? [])].sort((a, b) =>
    a.is_active === b.is_active ? a.kind.localeCompare(b.kind) || a.label.localeCompare(b.label, "tr") : a.is_active ? -1 : 1,
  );

  return (
    <>
      <h1>{t.title}</h1>
      <section className="card">
        <p className="muted">{t.note}</p>
        <div className="actions">
          <button type="button" className="small" onClick={() => setCreating((v) => !v)}>
            {t.new}
          </button>
        </div>
        {creating && <TagForm onDone={() => setCreating(false)} />}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t.columns.slug}</th>
                <th>{t.columns.label}</th>
                <th>{t.columns.kind}</th>
                <th>{t.columns.status}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((tag) => (
                <TagRow key={tag.slug} tag={tag} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <TagHistory />
    </>
  );
}

function useInvalidateTags() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: ADMIN_TAGS_KEY });
    void queryClient.invalidateQueries({ queryKey: TAGS_KEY });
    void queryClient.invalidateQueries({ queryKey: ["admin-events"] });
  };
}

function TagForm({ onDone }: { onDone: () => void }) {
  const t = S.admin.tags;
  const invalidate = useInvalidateTags();
  const [slug, setSlug] = useState("");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState<TagKind>("identity");
  const create = useMutation({
    mutationFn: () => createTag({ slug: slug.trim(), label: label.trim(), kind }),
    onSuccess: () => {
      invalidate();
      onDone();
    },
  });
  const submit = (e: FormEvent) => {
    e.preventDefault();
    create.mutate();
  };
  return (
    <form className="form-grid" onSubmit={submit}>
      <div className="field">
        <label htmlFor="tag-slug">{t.slug}</label>
        <input id="tag-slug" value={slug} onChange={(e) => setSlug(e.target.value)} required maxLength={64} autoFocus />
      </div>
      <div className="field">
        <label htmlFor="tag-label">{t.label}</label>
        <input id="tag-label" value={label} onChange={(e) => setLabel(e.target.value)} required maxLength={128} />
      </div>
      <div className="field">
        <label htmlFor="tag-kind">{t.kind}</label>
        <select id="tag-kind" value={kind} onChange={(e) => setKind(e.target.value as TagKind)}>
          {KINDS.map((k) => (
            <option key={k} value={k}>
              {TAG_KIND_LABELS[k]}
            </option>
          ))}
        </select>
      </div>
      {create.isError && <ErrorBox error={create.error} />}
      <div className="actions">
        <button type="submit" disabled={create.isPending || !slug.trim() || !label.trim()}>
          {t.create}
        </button>
        <button type="button" className="secondary" onClick={onDone}>
          {t.cancel}
        </button>
      </div>
    </form>
  );
}

function TagRow({ tag }: { tag: Tag }) {
  const t = S.admin.tags;
  const invalidate = useInvalidateTags();
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(tag.label);
  const update = useMutation({
    mutationFn: (body: Parameters<typeof updateTag>[1]) => updateTag(tag.slug, body),
    onSuccess: () => {
      invalidate();
      setEditing(false);
    },
  });
  return (
    <tr className={tag.is_active ? undefined : "muted"}>
      <td>
        <code>{tag.slug}</code>
      </td>
      <td>
        {editing ? (
          <input value={label} onChange={(e) => setLabel(e.target.value)} maxLength={128} aria-label={t.label} />
        ) : (
          tag.label
        )}
      </td>
      <td>
        <span className={`badge ${tag.kind === "change" ? "warn" : "neutral"}`}>{TAG_KIND_LABELS[tag.kind]}</span>
      </td>
      <td>
        <span className={`badge ${tag.is_active ? "ok" : "neutral"}`}>{tag.is_active ? t.active : t.retired}</span>
      </td>
      <td>
        <div className="actions compact">
          {editing ? (
            <button type="button" className="small" disabled={update.isPending || !label.trim()} onClick={() => update.mutate({ label: label.trim() })}>
              {t.save}
            </button>
          ) : (
            <button type="button" className="small secondary" onClick={() => setEditing(true)}>
              {t.edit}
            </button>
          )}
          <button
            type="button"
            className={`small ${tag.is_active ? "danger" : "secondary"}`}
            disabled={update.isPending}
            onClick={() => update.mutate({ is_active: !tag.is_active })}
          >
            {tag.is_active ? t.retire : t.reactivate}
          </button>
        </div>
        {update.isError && <ErrorBox error={update.error} />}
      </td>
    </tr>
  );
}

function TagHistory() {
  const t = S.admin.tags;
  const events = useAdminEvents(null);
  if (events.isLoading) return <Spinner />;
  if (events.isError) return <ErrorBox error={events.error} />;
  const rows = (events.data ?? []).filter((e) => e.kind.startsWith("tag_"));
  return (
    <section className="card">
      <h2>{t.history}</h2>
      {rows.length === 0 ? (
        <p className="muted">{t.histEmpty}</p>
      ) : (
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
              {rows.map((e) => (
                <tr key={e.id}>
                  <td>{time(e.created_at)}</td>
                  <td>{e.actor_name}</td>
                  <td>
                    <code>{e.target}</code>
                  </td>
                  <td>{e.before ?? S.documents.none}</td>
                  <td>{e.after ?? S.documents.none}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

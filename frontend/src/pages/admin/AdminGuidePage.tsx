import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";

import { useAdminEvents } from "../../api/admin-events";
import {
  ADMIN_GUIDE_KEY,
  GUIDE_KEY,
  GUIDE_SIGNALS_KEY,
  createFamily,
  updateFamily,
  useAdminGuide,
  useGuideSignals,
} from "../../api/guide";
import type { GuideFamily, GuideField, GuideSignal, GuideUpdate } from "../../api/types";
import { ErrorBox } from "../../components/ErrorBox";
import { Spinner } from "../../components/Spinner";
import { TagPicker } from "../../components/TagPicker";
import { STANDARD_FIELD_LABELS, formatDate } from "../../lib/format";
import { S } from "../../lib/strings";
import { normalizeExtraKey } from "../../lib/typeFamily";

type View = "form" | "signals" | "history";

/** The editable part of a family — what PATCH accepts. */
type Draft = Required<Omit<GuideUpdate, "is_active">> & { is_active: boolean };

function draftOf(f: GuideFamily): Draft {
  return {
    label: f.label,
    type_patterns: [...f.type_patterns],
    suggested_extra_fields: f.suggested_extra_fields.map((x) => ({ ...x })),
    suggested_tags: [...f.suggested_tags],
    standard_fields_emphasis: [...f.standard_fields_emphasis],
    prompt_hint: f.prompt_hint,
    is_active: f.is_active,
  };
}

function time(iso: string): string {
  return `${formatDate(iso)} ${iso.slice(11, 16)}`;
}

/** Yönetim › Tür rehberi — B-28b (company-ai ADR-025, BACKEND_GAPS §4.7.2–4.7.3). Per document
 * family: which type names belong to it, which extra fields and tags usually matter, which
 * standard fields deserve emphasis, and a short hint for Balbal. A guide, never a mandatory
 * form. "Sinyaller" shows the keys staff keep adding by hand; adding them to the guide is the
 * admin's decision (the shortcut only prefills a row, nothing is saved until "Kaydet"). */
export function AdminGuidePage() {
  const t = S.admin.guide;
  const guide = useAdminGuide();
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [view, setView] = useState<View>("form");
  const [creating, setCreating] = useState(false);
  const [prefill, setPrefill] = useState<GuideField | null>(null);

  if (guide.isLoading) return <Spinner />;
  if (guide.isError) return <ErrorBox error={guide.error} />;
  const families = guide.data ?? [];
  const selected = families.find((f) => f.family === selectedFamily) ?? families[0] ?? null;

  const addFromSignal = (signal: GuideSignal) => {
    setSelectedFamily(signal.family);
    setPrefill({ key: signal.key, label: "", hint: "" });
    setView("form");
  };

  return (
    <>
      <h1>{t.title}</h1>
      <p className="muted">{t.note}</p>
      <div className="folder-layout">
        <aside className="card folder-tree-card">
          <div className="folder-tree-head">
            <strong>{t.families}</strong>
            <button type="button" className="small" onClick={() => setCreating((v) => !v)}>
              {t.newFamily}
            </button>
          </div>
          {creating && (
            <FamilyForm
              onDone={(family) => {
                setCreating(false);
                if (family) setSelectedFamily(family);
              }}
            />
          )}
          <div className="folder-tree" role="list">
            {families.map((f) => (
              <button
                type="button"
                key={f.family}
                role="listitem"
                className={`folder-node${selected?.family === f.family ? " active" : ""}${f.is_active ? "" : " muted"}`}
                onClick={() => {
                  setSelectedFamily(f.family);
                  setPrefill(null);
                  setView("form");
                }}
              >
                <span className="folder-name">{f.label}</span>
                <span className="muted small">{f.family}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="card folder-main">
          <div className="chips">
            {(["form", "signals", "history"] as View[]).map((v) => (
              <button type="button" key={v} className={`chip${view === v ? " active" : ""}`} onClick={() => setView(v)}>
                {t.views[v]}
              </button>
            ))}
          </div>
          {view === "form" &&
            (selected ? (
              <GuideForm key={selected.family} family={selected} prefill={prefill} onPrefilled={() => setPrefill(null)} />
            ) : (
              <p className="muted">{t.pick}</p>
            ))}
          {view === "signals" && <Signals families={families} onAdd={addFromSignal} />}
          {view === "history" && <GuideHistory families={families} />}
        </section>
      </div>
    </>
  );
}

function useInvalidateGuide() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: ADMIN_GUIDE_KEY });
    void queryClient.invalidateQueries({ queryKey: GUIDE_KEY });
    void queryClient.invalidateQueries({ queryKey: GUIDE_SIGNALS_KEY });
    void queryClient.invalidateQueries({ queryKey: ["admin-events"] });
  };
}

function FamilyForm({ onDone }: { onDone: (family: string | null) => void }) {
  const t = S.admin.guide;
  const invalidate = useInvalidateGuide();
  const [family, setFamily] = useState("");
  const [label, setLabel] = useState("");
  const create = useMutation({
    mutationFn: () => createFamily({ family: family.trim(), label: label.trim(), type_patterns: [] }),
    onSuccess: (created) => {
      invalidate();
      onDone(created.family);
    },
  });
  const submit = (e: FormEvent) => {
    e.preventDefault();
    create.mutate();
  };
  return (
    <form className="form-grid" onSubmit={submit}>
      <div className="field">
        <label htmlFor="family-slug">{t.familySlug}</label>
        <input id="family-slug" value={family} onChange={(e) => setFamily(e.target.value)} pattern="[a-z][a-z0-9_]*" maxLength={32} required autoFocus />
      </div>
      <div className="field">
        <label htmlFor="family-label">{t.familyLabel}</label>
        <input id="family-label" value={label} onChange={(e) => setLabel(e.target.value)} maxLength={128} required />
      </div>
      {create.isError && <ErrorBox error={create.error} />}
      <div className="actions">
        <button type="submit" disabled={create.isPending || !family.trim() || !label.trim()}>
          {t.create}
        </button>
        <button type="button" className="secondary" onClick={() => onDone(null)}>
          {t.cancel}
        </button>
      </div>
    </form>
  );
}

function GuideForm({
  family,
  prefill,
  onPrefilled,
}: {
  family: GuideFamily;
  prefill: GuideField | null;
  onPrefilled: () => void;
}) {
  const t = S.admin.guide;
  const invalidate = useInvalidateGuide();
  const [draft, setDraft] = useState<Draft>(() => draftOf(family));
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newPattern, setNewPattern] = useState("");

  // "Rehbere ekle" from the signals view: a prefilled, unsaved row (Naci SORU 4).
  useEffect(() => {
    if (!prefill) return;
    setDraft((d) =>
      d.suggested_extra_fields.some((f) => f.key === prefill.key)
        ? d
        : { ...d, suggested_extra_fields: [...d.suggested_extra_fields, prefill] },
    );
    setDirty(true);
    setSaved(false);
    onPrefilled();
  }, [prefill, onPrefilled]);

  const edit = (patch: Partial<Draft>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setDirty(true);
    setSaved(false);
  };
  const save = useMutation({
    mutationFn: () =>
      updateFamily(family.family, {
        ...draft,
        label: draft.label.trim(),
        type_patterns: draft.type_patterns.map((p) => p.trim().toLocaleLowerCase("tr")).filter(Boolean),
        suggested_extra_fields: draft.suggested_extra_fields
          .map((f) => ({ key: normalizeExtraKey(f.key), label: f.label.trim(), hint: f.hint.trim() }))
          .filter((f) => f.key),
        prompt_hint: draft.prompt_hint.trim(),
      }),
    onSuccess: () => {
      invalidate();
      setDirty(false);
      setSaved(true);
    },
  });

  const addPattern = () => {
    const value = newPattern.trim().toLocaleLowerCase("tr");
    if (!value || draft.type_patterns.includes(value)) return;
    edit({ type_patterns: [...draft.type_patterns, value] });
    setNewPattern("");
  };
  const setField = (index: number, patch: Partial<GuideField>) =>
    edit({ suggested_extra_fields: draft.suggested_extra_fields.map((f, i) => (i === index ? { ...f, ...patch } : f)) });

  return (
    <div className="folder-grants">
      <div>
        <div className="muted small">{family.family}</div>
        <h2 className="folder-title">{family.label}</h2>
      </div>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="guide-label">{t.familyLabel}</label>
          <input id="guide-label" value={draft.label} onChange={(e) => edit({ label: e.target.value })} maxLength={128} />
        </div>
        <div className="field">
          <label>{t.patterns}</label>
          <div className="chips">
            {draft.type_patterns.map((p) => (
              <button
                type="button"
                key={p}
                className="chip active"
                title={S.extra.remove}
                onClick={() => edit({ type_patterns: draft.type_patterns.filter((x) => x !== p) })}
              >
                {p} ×
              </button>
            ))}
          </div>
          <div className="actions compact">
            <input
              value={newPattern}
              placeholder={t.patternsHint}
              onChange={(e) => setNewPattern(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addPattern();
                }
              }}
            />
            <button type="button" className="small secondary" onClick={addPattern} disabled={!newPattern.trim()}>
              {t.addPattern}
            </button>
          </div>
        </div>
      </div>

      <div className="section-label">{t.fields}</div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t.fieldKey}</th>
              <th>{t.fieldLabel}</th>
              <th>{t.fieldHint}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {draft.suggested_extra_fields.map((f, i) => (
              <tr key={i}>
                <td>
                  <input className="extra-key" value={f.key} onChange={(e) => setField(i, { key: e.target.value })} maxLength={48} aria-label={t.fieldKey} />
                  {f.key && normalizeExtraKey(f.key) !== f.key && (
                    <div className="muted small">{S.extra.keyPreview(normalizeExtraKey(f.key) || "—")}</div>
                  )}
                </td>
                <td>
                  <input value={f.label} onChange={(e) => setField(i, { label: e.target.value })} maxLength={128} aria-label={t.fieldLabel} />
                </td>
                <td>
                  <input value={f.hint} onChange={(e) => setField(i, { hint: e.target.value })} maxLength={256} aria-label={t.fieldHint} />
                </td>
                <td>
                  <button
                    type="button"
                    className="icon-button small"
                    aria-label={S.extra.remove}
                    title={S.extra.remove}
                    onClick={() => edit({ suggested_extra_fields: draft.suggested_extra_fields.filter((_, j) => j !== i) })}
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        className="small secondary"
        onClick={() => edit({ suggested_extra_fields: [...draft.suggested_extra_fields, { key: "", label: "", hint: "" }] })}
      >
        {t.addField}
      </button>

      <div className="section-label">{t.tags}</div>
      <TagPicker selected={draft.suggested_tags} onChange={(next) => edit({ suggested_tags: next })} family={family.family} />

      <div className="section-label">{t.emphasis}</div>
      <div className="chips">
        {Object.entries(STANDARD_FIELD_LABELS).map(([key, label]) => {
          const on = draft.standard_fields_emphasis.includes(key);
          return (
            <button
              type="button"
              key={key}
              className={`chip${on ? " active" : ""}`}
              onClick={() =>
                edit({
                  standard_fields_emphasis: on
                    ? draft.standard_fields_emphasis.filter((k) => k !== key)
                    : [...draft.standard_fields_emphasis, key],
                })
              }
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="field">
        <label htmlFor="guide-hint">{t.promptHint}</label>
        <textarea id="guide-hint" rows={3} maxLength={500} value={draft.prompt_hint} onChange={(e) => edit({ prompt_hint: e.target.value })} />
        <p className="muted small">{t.promptHintNote}</p>
      </div>
      <label className="inline-check">
        <input type="checkbox" checked={draft.is_active} onChange={(e) => edit({ is_active: e.target.checked })} />
        {t.active}
      </label>

      {save.isError && <ErrorBox error={save.error} />}
      <div className="actions">
        <button type="button" onClick={() => save.mutate()} disabled={!dirty || save.isPending || !draft.label.trim()}>
          {save.isPending ? t.saving : t.save}
        </button>
        {dirty && <span className="muted small">{t.dirty}</span>}
        {saved && !dirty && <span className="badge ok">{t.saved}</span>}
      </div>
    </div>
  );
}

function Signals({ families, onAdd }: { families: GuideFamily[]; onAdd: (s: GuideSignal) => void }) {
  const t = S.admin.guide;
  const signals = useGuideSignals();
  if (signals.isLoading) return <Spinner />;
  if (signals.isError) return <ErrorBox error={signals.error} />;
  const rows = signals.data ?? [];
  const labelOf = (family: string) => families.find((f) => f.family === family)?.label ?? family;
  const inGuide = (s: GuideSignal) =>
    families.find((f) => f.family === s.family)?.suggested_extra_fields.some((x) => x.key === s.key) ?? false;
  return (
    <>
      <p className="muted small">{t.signalsNote}</p>
      {rows.length === 0 ? (
        <p className="muted">{t.signalsEmpty}</p>
      ) : (
        <div className="table-wrap">
          <table className="signals">
            <thead>
              <tr>
                <th>{t.signalCols.family}</th>
                <th>{t.signalCols.key}</th>
                <th>{t.signalCols.count}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={`${s.family}:${s.key}`}>
                  <td>{labelOf(s.family)}</td>
                  <td>
                    <code>{s.key}</code>
                  </td>
                  <td>{s.count}</td>
                  <td>
                    {inGuide(s) ? (
                      <span className="badge ok">{t.views.form}</span>
                    ) : (
                      <button type="button" className="small secondary" onClick={() => onAdd(s)}>
                        {t.addToGuide}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function GuideHistory({ families }: { families: GuideFamily[] }) {
  const t = S.admin.guide;
  const events = useAdminEvents(null);
  if (events.isLoading) return <Spinner />;
  if (events.isError) return <ErrorBox error={events.error} />;
  const rows = (events.data ?? []).filter((e) => e.kind.startsWith("guide_"));
  const labelOf = (family: string) => families.find((f) => f.family === family)?.label ?? family;
  return rows.length === 0 ? (
    <p className="muted">{t.histEmpty}</p>
  ) : (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>{t.histCols.time}</th>
            <th>{t.histCols.who}</th>
            <th>{t.histCols.what}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((e) => (
            <tr key={e.id}>
              <td>{time(e.created_at)}</td>
              <td>{e.actor_name}</td>
              <td>
                {labelOf(e.target)} <span className="muted small">({e.kind === "guide_created" ? t.create : t.save})</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

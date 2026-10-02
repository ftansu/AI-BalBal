import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { ApiError } from "../api/client";
import { useDepartments } from "../api/departments";
import {
  applySuggestion,
  rejectSuggestion,
  submitDocument,
  triggerSuggestion,
  useSuggestion,
} from "../api/documents";
import { useGuide } from "../api/guide";
import { useProjects } from "../api/projects";
import type {
  Confidentiality,
  DocumentDetail,
  DocumentStatus,
  MetadataSuggestion,
  MetadataSuggestionApply,
  ReviewStatus,
  SuggestionField,
} from "../api/types";
import {
  CONFIDENTIALITY_LABELS,
  CONFIDENTIALITY_VALUES,
  CONFIRM_THRESHOLD,
  SELECTABLE_STATUSES,
  STATUS_LABELS,
  SUGGESTION_FIELD_LABELS,
  SUGGESTION_FIELD_ORDER,
  SUGGESTION_STATUS_LABELS,
  formatDate,
} from "../lib/format";
import { EXTRA_PREFIX, extraFieldSuggestions } from "../lib/review";
import { S } from "../lib/strings";
import { MAX_EXTRA_FIELDS, OTHER_FAMILY, guideFor, normalizeExtraKey } from "../lib/typeFamily";
import { ErrorBox } from "./ErrorBox";
import { Spinner } from "./Spinner";
import { TagPicker } from "./TagPicker";

type FieldName = (typeof SUGGESTION_FIELD_ORDER)[number];

/** Who is looking at the panel (B-28, ADR-024):
 * - `uploader`: the person who uploaded a not-yet-published document — edits every value,
 *   confirms low-confidence suggestions and sends the document to review (stage 1).
 * - `admin`: the Phase 3.2 view — tick fields, apply/reject. Applying no longer publishes.
 * - `readonly`: everyone else. */
export type SuggestionPanelMode = "uploader" | "admin" | "readonly";

const WORKBOOK_KINDS = new Set(["xlsx", "xlsm", "csv"]);

/** One "Ek alanlar" row (B-28b): where it came from decides what the row shows. */
interface ExtraRow {
  key: string;
  value: string;
  origin: "suggestion" | "existing" | "guide" | "user";
  confidence: number | null;
  /** The value Balbal proposed (for the confidence rule), if any. */
  suggested: string | null;
  source: "ai" | "user" | null;
  label?: string;
  hint?: string;
}

function toInput(field: SuggestionField | undefined): string {
  const value = field?.value;
  if (value === null || value === undefined) return "";
  return Array.isArray(value) ? value.join(", ") : value;
}

function toList(field: SuggestionField | undefined): string[] {
  const value = field?.value;
  if (!value) return [];
  return Array.isArray(value) ? value : value.split(",").map((t) => t.trim()).filter(Boolean);
}

function sameValue(a: string, b: string): boolean {
  const norm = (v: string) =>
    v
      .split(",")
      .map((x) => x.trim().toLocaleLowerCase("tr"))
      .filter(Boolean)
      .sort()
      .join(",");
  return norm(a) === norm(b);
}

export function MetadataSuggestionPanel({
  documentId,
  poll,
  mode,
  current,
}: {
  documentId: string;
  poll: boolean;
  mode: SuggestionPanelMode;
  current?: DocumentDetail;
}) {
  const queryClient = useQueryClient();
  const suggestion = useSuggestion(documentId, poll);
  const projects = useProjects();
  const departments = useDepartments();
  const guide = useGuide();
  const [values, setValues] = useState<Record<string, string>>({});
  const [tags, setTags] = useState<string[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});
  const [serverFlagged, setServerFlagged] = useState<string[]>([]);
  const [extraRows, setExtraRows] = useState<ExtraRow[]>([]);
  const [removedKeys, setRemovedKeys] = useState<string[]>([]);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [sent, setSent] = useState<{ status: ReviewStatus; extras: number } | null>(null);

  const data = suggestion.data ?? null;
  const hasSuggestion = data !== null && data.status !== "failed";
  const isWorkbook = WORKBOOK_KINDS.has(current?.file_kind ?? "");
  const isUploader = mode === "uploader";
  const isAdmin = mode === "admin";
  const editable = isUploader || (isAdmin && data?.status === "pending");
  const extraSuggested = extraFieldSuggestions(hasSuggestion ? data : null);
  // The family follows the type as it will be saved (edited value, else the document's own).
  const typeForGuide = values.document_type || current?.document_type || null;
  const family = guideFor(typeForGuide, guide.data ?? []);

  /** The document's own value in the shape the inputs use (slug, code, ISO date, raw enum). */
  function rawCurrent(field: FieldName): string {
    if (!current) return "";
    switch (field) {
      case "department":
        return current.department ?? "";
      case "subdepartment":
        return current.subdepartment ?? "";
      case "project_code":
        return projects.data?.find((p) => p.id === current.project_id)?.code ?? "";
      case "document_type":
        return current.document_type;
      case "counterparty":
        return current.counterparty;
      case "document_date":
        return current.document_date.slice(0, 10);
      case "status":
        return current.status;
      case "confidentiality":
        return current.confidentiality;
      case "tags":
        return current.tags.join(", ");
    }
  }

  useEffect(() => {
    const nextValues: Record<string, string> = {};
    const nextSelected: Record<string, boolean> = {};
    for (const field of SUGGESTION_FIELD_ORDER) {
      const suggested = hasSuggestion && data ? toInput(data.fields[field]) : "";
      // Uploader starts from the suggestion where there is one, else from what was typed at upload.
      nextValues[field] = isUploader ? suggested || rawCurrent(field) : suggested;
      nextSelected[field] = nextValues[field] !== "";
    }
    setValues(nextValues);
    setSelected(nextSelected);
    // Tags: Balbal's catalogue-filtered proposal, else the document's own tags.
    const suggestedTags = hasSuggestion && data ? toList(data.fields.tags) : [];
    setTags(suggestedTags.length ? suggestedTags : (current?.tags ?? []));
    // Extra rows: suggestion ∪ existing; guide rows are appended once the family is known.
    const rows: ExtraRow[] = [];
    for (const [key, guess] of Object.entries(extraSuggested)) {
      const suggested = toInput(guess);
      if (!suggested) continue;
      rows.push({ key, value: suggested, origin: "suggestion", confidence: guess.confidence, suggested, source: "ai" });
    }
    for (const [key, entry] of Object.entries(current?.extra_fields ?? {})) {
      const row = rows.find((r) => r.key === key);
      if (row) {
        row.value = entry.value;
        row.origin = "existing";
        row.source = entry.source;
      } else {
        rows.push({ key, value: entry.value, origin: "existing", confidence: entry.confidence, suggested: null, source: entry.source });
      }
    }
    setExtraRows(rows);
    setRemovedKeys([]);
    setConfirmed({});
    setServerFlagged([]);
    setMessage(null);
    // `rawCurrent`/`extraSuggested` derive from `data`, `current`, `projects` — listed below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, current, projects.data, isUploader]);

  // Guide rows (empty, placeholder) for the matched family — added when missing, never
  // overwriting a filled row; keys the user removed stay removed.
  useEffect(() => {
    if (!editable || !family) return;
    setExtraRows((rows) => {
      const have = new Set(rows.map((r) => r.key));
      const additions = family.suggested_extra_fields
        .filter((f) => !have.has(f.key) && !removedKeys.includes(f.key))
        .map<ExtraRow>((f) => ({
          key: f.key,
          value: "",
          origin: "guide",
          confidence: null,
          suggested: null,
          source: null,
          label: f.label,
          hint: f.hint,
        }));
      return additions.length ? [...rows, ...additions] : rows;
    });
  }, [family, editable, removedKeys]);

  const setSuggestionData = (next: MetadataSuggestion) =>
    queryClient.setQueryData(["suggestion", documentId], next);
  const invalidateDocument = () => {
    void queryClient.invalidateQueries({ queryKey: ["document", documentId] });
    void queryClient.invalidateQueries({ predicate: (q) => q.queryKey[0] === "documents" });
    void queryClient.invalidateQueries({ queryKey: ["suggestion", documentId] });
  };

  const generate = useMutation({
    mutationFn: () => triggerSuggestion(documentId),
    onSuccess: setSuggestionData,
  });
  const apply = useMutation({
    mutationFn: (body: MetadataSuggestionApply) => applySuggestion(documentId, body),
    onSuccess: invalidateDocument,
  });
  const reject = useMutation({
    mutationFn: () => rejectSuggestion(documentId),
    onSuccess: setSuggestionData,
  });
  const submit = useMutation({
    mutationFn: (body: MetadataSuggestionApply & { confirmed_fields: string[] }) =>
      submitDocument(documentId, body),
    onSuccess: (detail) => {
      setSent({ status: detail.review_status, extras: Object.keys(detail.extra_fields ?? {}).length });
      invalidateDocument();
    },
    onError: (error) => {
      if (error instanceof ApiError && error.code === "low_confidence_not_confirmed") {
        setServerFlagged(error.fields);
      } else if (error instanceof ApiError && error.code === "department_required") {
        setServerFlagged(["department"]);
      }
    },
  });

  function currentValueLabel(field: FieldName): string {
    if (!current) return "";
    switch (field) {
      case "document_date":
        return formatDate(current.document_date);
      case "status":
        return STATUS_LABELS[current.status];
      case "confidentiality":
        return CONFIDENTIALITY_LABELS[current.confidentiality];
      default:
        return rawCurrent(field);
    }
  }

  /** Low-confidence suggestion kept as suggested → needs the explicit "Onaylıyorum" (§4.7.5). */
  function needsConfirm(field: FieldName): boolean {
    if (!isUploader) return false;
    if (serverFlagged.includes(field)) return true;
    const info = hasSuggestion && data ? data.fields[field] : undefined;
    if (!info || info.value === null || info.value === undefined) return false;
    const kept = field === "tags" ? tags.join(", ") : (values[field] ?? "");
    return info.confidence < CONFIRM_THRESHOLD && sameValue(kept, toInput(info));
  }

  function needsConfirmExtra(row: ExtraRow): boolean {
    if (!isUploader) return false;
    if (serverFlagged.includes(`${EXTRA_PREFIX}${row.key}`)) return true;
    return (
      row.suggested !== null &&
      row.confidence !== null &&
      row.confidence < CONFIRM_THRESHOLD &&
      sameValue(row.value, row.suggested)
    );
  }

  const filledExtras = extraRows.filter((r) => r.value.trim() !== "");
  const extraCount = filledExtras.length;
  const extraFull = extraCount >= MAX_EXTRA_FIELDS;
  const newKeyNormalized = normalizeExtraKey(newKey);
  const canAddNew =
    newKeyNormalized !== "" && newValue.trim() !== "" && !extraFull && !extraRows.some((r) => r.key === newKeyNormalized);

  function addRow() {
    if (!canAddNew) return;
    setExtraRows((rows) => [
      ...rows,
      { key: newKeyNormalized, value: newValue.trim(), origin: "user", confidence: null, suggested: null, source: "user" },
    ]);
    setRemovedKeys((keys) => keys.filter((k) => k !== newKeyNormalized));
    setNewKey("");
    setNewValue("");
    setAdding(false);
  }

  function removeRow(key: string) {
    setExtraRows((rows) => rows.filter((r) => r.key !== key));
    if (current?.extra_fields?.[key]) setRemovedKeys((keys) => [...keys, key]);
    else setRemovedKeys((keys) => [...keys, key]); // also keeps a guide row from re-appearing
  }

  function extraBody(): Record<string, string | null> {
    const body: Record<string, string | null> = {};
    for (const row of filledExtras) body[row.key] = row.value.trim();
    for (const key of removedKeys) if (current?.extra_fields?.[key]) body[key] = null;
    return body;
  }

  function buildBody(all: boolean): MetadataSuggestionApply {
    const body: MetadataSuggestionApply = {};
    for (const field of SUGGESTION_FIELD_ORDER) {
      if (!all && !selected[field]) continue;
      if (field === "tags") {
        if (all || selected.tags) body.tags = tags;
        continue;
      }
      const raw = (values[field] ?? "").trim();
      switch (field) {
        case "department":
          if (all && !raw) break;
          body.department = raw || null;
          break;
        case "subdepartment":
          if (all && !raw) break;
          body.subdepartment = raw || null;
          break;
        case "project_code":
          if (all && !raw) break;
          body.project_code = raw || null;
          break;
        case "status":
          if (raw) body.status = raw as DocumentStatus;
          break;
        case "confidentiality":
          if (raw) body.confidentiality = raw as Confidentiality;
          break;
        default:
          if (raw) body[field] = raw;
      }
    }
    const extras = extraBody();
    if (Object.keys(extras).length) body.extra_fields = extras;
    return body;
  }

  function onApply() {
    const body = buildBody(false);
    if (Object.keys(body).length === 0) {
      setMessage(S.suggestion.nothingSelected);
      return;
    }
    setMessage(null);
    apply.mutate(body);
  }

  function onSubmit() {
    setMessage(null);
    const confirmed_fields = [
      ...SUGGESTION_FIELD_ORDER.filter((f) => needsConfirm(f) && confirmed[f]),
      ...filledExtras.filter((r) => needsConfirmExtra(r) && confirmed[`${EXTRA_PREFIX}${r.key}`]).map((r) => `${EXTRA_PREFIX}${r.key}`),
    ];
    submit.mutate({ ...buildBody(true), confirmed_fields });
  }

  function renderInput(field: FieldName) {
    const value = values[field] ?? "";
    const onChange = (next: string) => setValues((v) => ({ ...v, [field]: next }));
    if (field === "tags") {
      return (
        <TagPicker
          selected={tags}
          onChange={setTags}
          suggested={family?.suggested_tags ?? []}
          family={family?.family ?? null}
          droppedNote={isAdmin && hasSuggestion && data ? (data.fields.tags?.dropped ?? null) : null}
        />
      );
    }
    if (field === "status") {
      return (
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">—</option>
          {SELECTABLE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      );
    }
    if (field === "confidentiality") {
      return (
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">—</option>
          {CONFIDENTIALITY_VALUES.map((c) => (
            <option key={c} value={c}>
              {CONFIDENTIALITY_LABELS[c]}
            </option>
          ))}
        </select>
      );
    }
    if (field === "department") {
      return (
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">—</option>
          {(departments.data ?? []).map((d) => (
            <option key={d.id} value={d.slug}>
              {d.name} ({d.slug})
            </option>
          ))}
        </select>
      );
    }
    if (field === "project_code") {
      return (
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">{S.upload.projectNone}</option>
          {(projects.data ?? []).map((p) => (
            <option key={p.id} value={p.code}>
              {p.name} ({p.code})
            </option>
          ))}
        </select>
      );
    }
    if (field === "document_date") {
      return <input type="date" value={value} onChange={(e) => onChange(e.target.value)} />;
    }
    return <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />;
  }

  function renderReadOnly(field: FieldName, info: SuggestionField | undefined) {
    if (field === "tags") return <TagPicker selected={toList(info)} onChange={() => undefined} readOnly />;
    return toInput(info) || S.documents.none;
  }

  const emphasised = new Set(family?.standard_fields_emphasis ?? []);
  const familyBadge = family && family.family !== OTHER_FAMILY && (
    <span className="badge neutral" title={S.guide.hint(family.suggested_extra_fields.map((f) => f.label || f.key).join(", "))}>
      {S.guide.familyBadge(family.label)}
    </span>
  );

  /** B-28b "Ek alanlar" section, shared by the uploader and admin forms. */
  const extraSection = (
    <div className="extra-fields">
      <div className="section-label">
        {S.extra.title} <span className="muted small">{S.extra.counter(extraCount, MAX_EXTRA_FIELDS)}</span>
      </div>
      <p className="muted small">{S.extra.hint}</p>
      {extraRows.map((row) => {
        const confirmNeeded = needsConfirmExtra(row);
        const confirmKey = `${EXTRA_PREFIX}${row.key}`;
        return (
          <div className={`suggestion-row${confirmNeeded ? " needs-confirm" : ""}`} key={row.key}>
            <div>
              <button type="button" className="icon-button small" aria-label={S.extra.remove} title={S.extra.remove} onClick={() => removeRow(row.key)}>
                ×
              </button>
            </div>
            <div className="label" title={row.hint}>
              {row.label ?? row.key}
              {row.origin === "guide" && <span className="muted small"> · {S.extra.suggested}</span>}
            </div>
            <div>
              <input
                type="text"
                value={row.value}
                placeholder={row.hint || S.extra.valuePlaceholder}
                onChange={(e) => setExtraRows((rows) => rows.map((r) => (r.key === row.key ? { ...r, value: e.target.value } : r)))}
              />
              {row.confidence !== null && row.suggested !== null && (
                <div className="confidence" title={`${S.suggestion.confidence}: ${row.confidence}`}>
                  <span style={{ width: `${Math.round(row.confidence * 100)}%` }} />
                </div>
              )}
            </div>
            <div className="current">
              {confirmNeeded ? (
                <label className="inline-check" title={S.review.confirmHint}>
                  <input
                    type="checkbox"
                    checked={confirmed[confirmKey] ?? false}
                    onChange={(e) => setConfirmed((c) => ({ ...c, [confirmKey]: e.target.checked }))}
                  />
                  {S.review.confirm}
                </label>
              ) : row.source ? (
                <span className="badge neutral">{S.extra.source[row.source]}</span>
              ) : null}
            </div>
          </div>
        );
      })}
      {extraFull ? (
        <p className="muted small">{S.extra.full}</p>
      ) : !adding ? (
        <button type="button" className="small secondary" onClick={() => setAdding(true)}>
          {S.extra.add}
        </button>
      ) : (
        <div className="suggestion-row extra-new">
          <div />
          <div>
            <input
              type="text"
              className="extra-key"
              value={newKey}
              placeholder={S.extra.keyPlaceholder}
              onChange={(e) => setNewKey(e.target.value)}
            />
            {newKey && <div className="muted small">{S.extra.keyPreview(newKeyNormalized || "—")}</div>}
          </div>
          <div>
            <input type="text" value={newValue} placeholder={S.extra.valuePlaceholder} onChange={(e) => setNewValue(e.target.value)} />
          </div>
          <div className="current">
            <button type="button" className="small" disabled={!canAddNew} onClick={addRow}>
              {S.extra.addButton}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (suggestion.isLoading) return <Spinner />;
  if (suggestion.isError) return <ErrorBox error={suggestion.error} />;

  // ---- Stage 1 done: a short status line instead of the form (B-28 T7).
  if (sent) {
    const published = sent.status === "approved";
    return (
      <section className="card">
        <p>
          <span className={`badge ${published ? "ok" : "warn"}`}>
            {published ? S.review.publishedTitle : S.review.sentTitle}
          </span>{" "}
          {published ? S.review.publishedText : S.review.sentText}
          {sent.extras > 0 && <span className="muted small"> {S.extra.savedCount(sent.extras)}</span>}
        </p>
      </section>
    );
  }

  // ---- Uploader (stage 1): editable rows, confirmation boxes, extra fields, "Onaya gönder".
  if (isUploader) {
    // An OCR document needs its suggestion first (409 `suggestion_pending` otherwise); a
    // workbook has none and is confirmed from the typed values.
    const canSend = isWorkbook || data !== null;
    const resubmit = current?.review_status === "changes_requested";
    const rows = SUGGESTION_FIELD_ORDER.filter((f) => hasSuggestion || (values[f] ?? "") !== "" || f === "department" || f === "tags");
    return (
      <section className="card">
        <h2>
          {S.review.panelTitle} {familyBadge}
        </h2>
        <p className="muted">{isWorkbook ? S.review.panelHintWorkbook : S.review.panelHint}</p>
        {!isWorkbook && data === null && <p className="muted">{S.review.waitingSuggestion}</p>}
        {data?.status === "failed" && (
          <p className="muted">
            {S.suggestion.failed} {data.error}
          </p>
        )}
        <div>
          {rows.map((field) => {
            const info = hasSuggestion && data ? data.fields[field] : undefined;
            const confirmNeeded = needsConfirm(field);
            return (
              <div className={`suggestion-row${confirmNeeded ? " needs-confirm" : ""}`} key={field}>
                <div />
                <div className="label">
                  {SUGGESTION_FIELD_LABELS[field]}
                  {emphasised.has(field) && <span className="muted small"> · {S.guide.important}</span>}
                </div>
                <div>
                  {renderInput(field)}
                  {info && field !== "tags" && (
                    <div className="confidence" title={`${S.suggestion.confidence}: ${info.confidence}`}>
                      <span style={{ width: `${Math.round(info.confidence * 100)}%` }} />
                    </div>
                  )}
                </div>
                <div className="current">
                  {confirmNeeded ? (
                    <label className="inline-check" title={S.review.confirmHint}>
                      <input
                        type="checkbox"
                        checked={confirmed[field] ?? false}
                        onChange={(e) => setConfirmed((c) => ({ ...c, [field]: e.target.checked }))}
                      />
                      {S.review.confirm}
                    </label>
                  ) : (
                    <>
                      {S.suggestion.currentValue}: {currentValueLabel(field) || S.documents.none}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {extraSection}
        {message && <p className="error-box">{message}</p>}
        {submit.isError && <ErrorBox error={submit.error} />}
        <div className="actions">
          <button type="button" onClick={onSubmit} disabled={!canSend || submit.isPending}>
            {submit.isPending ? S.review.submitting : resubmit ? S.review.resubmit : S.review.submit}
          </button>
        </div>
      </section>
    );
  }

  // ---- Admin / read-only (Phase 3.2 view).
  return (
    <section className="card">
      <h2>
        {S.suggestion.title} {familyBadge}
        {isAdmin && family && family.family !== OTHER_FAMILY && (
          <>
            {" "}
            <Link to="/yonetim/tur-rehberi" className="muted small">
              {S.guide.editLink}
            </Link>
          </>
        )}
      </h2>
      {!data && (
        <>
          <p className="muted">{poll ? S.suggestion.waiting : S.suggestion.notYet}</p>
          {isAdmin && (
            <button type="button" onClick={() => generate.mutate()} disabled={generate.isPending}>
              {S.suggestion.generate}
            </button>
          )}
          {generate.isError && <ErrorBox error={generate.error} />}
        </>
      )}
      {data && data.status === "failed" && (
        <>
          <p className="error-box">
            {S.suggestion.failed} {data.error}
          </p>
          {isAdmin && (
            <button type="button" onClick={() => generate.mutate()} disabled={generate.isPending}>
              {S.suggestion.retry}
            </button>
          )}
          {generate.isError && <ErrorBox error={generate.error} />}
        </>
      )}
      {data && data.status !== "failed" && (
        <>
          <p className="muted">
            <span className={`badge ${data.status === "applied" ? "ok" : data.status === "rejected" ? "neutral" : ""}`}>
              {SUGGESTION_STATUS_LABELS[data.status]}
            </span>{" "}
            · {S.suggestion.model}: {data.model}
          </p>
          <div>
            {SUGGESTION_FIELD_ORDER.map((field) => {
              const info = data.fields[field];
              return (
                <div className="suggestion-row" key={field}>
                  <div>
                    {editable ? (
                      <input
                        type="checkbox"
                        checked={selected[field] ?? false}
                        onChange={(e) => setSelected((s) => ({ ...s, [field]: e.target.checked }))}
                        aria-label={SUGGESTION_FIELD_LABELS[field]}
                      />
                    ) : null}
                  </div>
                  <div className="label">{SUGGESTION_FIELD_LABELS[field]}</div>
                  <div>
                    {editable ? renderInput(field) : renderReadOnly(field, info)}
                    {field !== "tags" && (
                      <div className="confidence" title={`${S.suggestion.confidence}: ${info?.confidence ?? 0}`}>
                        <span style={{ width: `${Math.round((info?.confidence ?? 0) * 100)}%` }} />
                      </div>
                    )}
                  </div>
                  <div className="current">
                    {S.suggestion.currentValue}: {currentValueLabel(field) || S.documents.none}
                  </div>
                </div>
              );
            })}
          </div>
          {editable && extraSection}
          {isAdmin && data.status === "pending" && (
            <>
              <p className="muted">{S.suggestion.includeHint}</p>
              <p className="muted small">{S.suggestion.applyNote}</p>
              {message && <p className="error-box">{message}</p>}
              {apply.isError && <ErrorBox error={apply.error} />}
              {reject.isError && <ErrorBox error={reject.error} />}
              <div className="actions">
                <button type="button" onClick={onApply} disabled={apply.isPending}>
                  {S.suggestion.apply}
                </button>
                <button type="button" className="danger" onClick={() => reject.mutate()} disabled={reject.isPending}>
                  {S.suggestion.reject}
                </button>
              </div>
            </>
          )}
          {!isAdmin && data.status === "pending" && <p className="muted">{S.suggestion.adminOnly}</p>}
        </>
      )}
    </section>
  );
}

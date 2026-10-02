import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { ApiError } from "../api/client";
import { useDepartments } from "../api/departments";
import {
  applySuggestion,
  rejectSuggestion,
  submitDocument,
  triggerSuggestion,
  useSuggestion,
} from "../api/documents";
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
import { S } from "../lib/strings";
import { ErrorBox } from "./ErrorBox";
import { Spinner } from "./Spinner";

type FieldName = (typeof SUGGESTION_FIELD_ORDER)[number];

/** Who is looking at the panel (B-28, ADR-024):
 * - `uploader`: the person who uploaded a not-yet-published document — edits every value,
 *   confirms low-confidence suggestions and sends the document to review (stage 1).
 * - `admin`: the Phase 3.2 view — tick fields, apply/reject. Applying no longer publishes.
 * - `readonly`: everyone else. */
export type SuggestionPanelMode = "uploader" | "admin" | "readonly";

const WORKBOOK_KINDS = new Set(["xlsx", "xlsm", "csv"]);

function toInput(field: SuggestionField | undefined): string {
  const value = field?.value;
  if (value === null || value === undefined) return "";
  return Array.isArray(value) ? value.join(", ") : value;
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
  const [values, setValues] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});
  const [serverFlagged, setServerFlagged] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [sent, setSent] = useState<ReviewStatus | null>(null);

  const data = suggestion.data ?? null;
  const isWorkbook = WORKBOOK_KINDS.has(current?.file_kind ?? "");
  const isUploader = mode === "uploader";
  const isAdmin = mode === "admin";

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
      const suggested = data && data.status !== "failed" ? toInput(data.fields[field]) : "";
      // Uploader starts from the suggestion where there is one, else from what was typed at upload.
      nextValues[field] = isUploader ? suggested || rawCurrent(field) : suggested;
      nextSelected[field] = nextValues[field] !== "";
    }
    setValues(nextValues);
    setSelected(nextSelected);
    setConfirmed({});
    setServerFlagged([]);
    setMessage(null);
    // `rawCurrent` depends on `current`/`projects`, listed below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, current, projects.data, isUploader]);

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
      setSent(detail.review_status);
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
    const info = data && data.status !== "failed" ? data.fields[field] : undefined;
    if (!info || info.value === null || info.value === undefined) return false;
    return info.confidence < CONFIRM_THRESHOLD && sameValue(values[field] ?? "", toInput(info));
  }

  function buildBody(all: boolean): MetadataSuggestionApply {
    const body: MetadataSuggestionApply = {};
    for (const field of SUGGESTION_FIELD_ORDER) {
      if (!all && !selected[field]) continue;
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
        case "tags":
          if (all && !raw) break;
          body.tags = raw ? raw.split(",").map((t) => t.trim()).filter(Boolean) : [];
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
    const confirmed_fields = SUGGESTION_FIELD_ORDER.filter((f) => needsConfirm(f) && confirmed[f]);
    submit.mutate({ ...buildBody(true), confirmed_fields });
  }

  function renderInput(field: FieldName) {
    const value = values[field] ?? "";
    const onChange = (next: string) => setValues((v) => ({ ...v, [field]: next }));
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

  if (suggestion.isLoading) return <Spinner />;
  if (suggestion.isError) return <ErrorBox error={suggestion.error} />;

  // ---- Stage 1 done: a short status line instead of the form (B-28 T7).
  if (sent) {
    const published = sent === "approved";
    return (
      <section className="card">
        <p>
          <span className={`badge ${published ? "ok" : "warn"}`}>
            {published ? S.review.publishedTitle : S.review.sentTitle}
          </span>{" "}
          {published ? S.review.publishedText : S.review.sentText}
        </p>
      </section>
    );
  }

  // ---- Uploader (stage 1): editable rows, confirmation boxes, "Onaya gönder".
  if (isUploader) {
    const hasSuggestion = data !== null && data.status !== "failed";
    // An OCR document needs its suggestion first (409 `suggestion_pending` otherwise); a
    // workbook has none and is confirmed from the typed values.
    const canSend = isWorkbook || data !== null;
    const resubmit = current?.review_status === "changes_requested";
    const rows = SUGGESTION_FIELD_ORDER.filter((f) => hasSuggestion || (values[f] ?? "") !== "" || f === "department");
    return (
      <section className="card">
        <h2>{S.review.panelTitle}</h2>
        <p className="muted">{isWorkbook ? S.review.panelHintWorkbook : S.review.panelHint}</p>
        {!isWorkbook && data === null && <p className="muted">{S.review.waitingSuggestion}</p>}
        {data?.status === "failed" && (
          <p className="muted">
            {S.suggestion.failed} {data.error}
          </p>
        )}
        <div>
          {rows.map((field) => {
            const info = hasSuggestion ? data?.fields[field] : undefined;
            const confirmNeeded = needsConfirm(field);
            return (
              <div className={`suggestion-row${confirmNeeded ? " needs-confirm" : ""}`} key={field}>
                <div />
                <div className="label">{SUGGESTION_FIELD_LABELS[field]}</div>
                <div>
                  {renderInput(field)}
                  {info && (
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
      <h2>{S.suggestion.title}</h2>
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
              const editable = isAdmin && data.status === "pending";
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
                    {editable ? renderInput(field) : toInput(info) || S.documents.none}
                    <div className="confidence" title={`${S.suggestion.confidence}: ${info?.confidence ?? 0}`}>
                      <span style={{ width: `${Math.round((info?.confidence ?? 0) * 100)}%` }} />
                    </div>
                  </div>
                  <div className="current">
                    {S.suggestion.currentValue}: {currentValueLabel(field) || S.documents.none}
                  </div>
                </div>
              );
            })}
          </div>
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

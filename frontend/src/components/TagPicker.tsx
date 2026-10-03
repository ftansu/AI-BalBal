import { useState } from "react";
import { Link } from "react-router-dom";

import { useTags } from "../api/tags";
import type { Tag } from "../api/types";
import { S } from "../lib/strings";
import { Spinner } from "./Spinner";

/** B-28b catalogue picker (BACKEND_GAPS §4.7.4): tags are chosen, never typed — so an unknown
 * tag cannot reach the server from here (it would be refused anyway, 422 `unknown_tag`).
 * Change tags belong to documents that alter another one: open for the `amendment` family,
 * folded elsewhere (Naci SORU 1). `suggested` chips come first. */
export function TagPicker({
  selected,
  onChange,
  suggested = [],
  family,
  readOnly = false,
  droppedNote,
}: {
  selected: string[];
  onChange: (next: string[]) => void;
  suggested?: string[];
  family?: string | null;
  readOnly?: boolean;
  /** Admin-only: what Balbal proposed outside the catalogue. */
  droppedNote?: string[] | null;
}) {
  const tags = useTags();
  const [showChange, setShowChange] = useState(family === "amendment");
  if (tags.isLoading) return <Spinner />;
  const all = tags.data ?? [];
  if (all.length === 0) return <p className="muted small">{S.tags.none}</p>;

  const isOn = (slug: string) => selected.includes(slug);
  const toggle = (slug: string) =>
    onChange(isOn(slug) ? selected.filter((s) => s !== slug) : [...selected, slug]);
  const byKind = (kind: Tag["kind"]) => all.filter((t) => t.kind === kind && !suggested.includes(t.slug));
  const suggestedTags = suggested.map((slug) => all.find((t) => t.slug === slug)).filter((t): t is Tag => !!t);
  const changeOpen = showChange || family === "amendment" || selected.some((s) => byKind("change").some((t) => t.slug === s));

  const chip = (tag: Tag) =>
    readOnly ? (
      isOn(tag.slug) ? (
        <span key={tag.slug} className={`badge ${tag.kind === "change" ? "warn" : "neutral"}`}>
          {tag.label}
        </span>
      ) : null
    ) : (
      <button
        type="button"
        key={tag.slug}
        className={`chip tag-chip${tag.kind === "change" ? " change" : ""}${isOn(tag.slug) ? " active" : ""}`}
        onClick={() => toggle(tag.slug)}
        title={tag.slug}
      >
        {tag.label}
      </button>
    );

  if (readOnly) {
    const shown = all.filter((t) => isOn(t.slug));
    return shown.length ? <div className="chips">{shown.map(chip)}</div> : <span>{S.documents.none}</span>;
  }

  return (
    <div className="tag-picker">
      {suggestedTags.length > 0 && (
        <>
          <div className="muted small">{S.tags.suggestedForType}</div>
          <div className="chips">{suggestedTags.map(chip)}</div>
        </>
      )}
      <div className="muted small">{S.tags.identity}</div>
      <div className="chips">{byKind("identity").map(chip)}</div>
      {byKind("change").length > 0 && (
        <>
          <div className="muted small">
            {S.tags.change}{" "}
            {family !== "amendment" && (
              <button type="button" className="link-button" onClick={() => setShowChange((v) => !v)}>
                {changeOpen ? S.tags.hideChange : S.tags.showChange}
              </button>
            )}
          </div>
          {changeOpen && <div className="chips">{byKind("change").map(chip)}</div>}
        </>
      )}
      {droppedNote && droppedNote.length > 0 && (
        <p className="muted small">
          {S.tags.droppedNote(droppedNote.join(", "))} · <Link to="/yonetim/etiketler">{S.tags.manage}</Link>
        </p>
      )}
    </div>
  );
}

import { useWorkbookInspect } from "../api/excel";
import { S } from "../lib/strings";

/** Excel dosya yapısı — backend `GET /api/excel/{id}/inspect` (Phase 4.2) mevcuttu ama
 * hiçbir ekranda kullanılmıyordu. Excel olmayan belgede backend 422 döner; kart gizlenir. */
export function WorkbookInspectCard({ documentId }: { documentId: string }) {
  const inspect = useWorkbookInspect(documentId, true);
  const w = inspect.data;
  if (!w) return null;
  const t = S.workbook;
  return (
    <section className="card">
      <h2>{t.title}</h2>
      <dl className="detail-grid">
        <dt>{t.sheets}</dt>
        <dd>
          {w.sheets.map((s) => (
            <div key={s.name}>
              {s.name} <span className="muted small">({s.max_row} × {s.max_col}{s.hidden ? `, ${t.hidden}` : ""})</span>
            </div>
          ))}
        </dd>
        <dt>{t.namedRanges}</dt>
        <dd>{w.named_ranges.length ? w.named_ranges.map((n) => `${n.name} (${n.sheet}!${n.ref})`).join(", ") : "—"}</dd>
        <dt>{t.tables}</dt>
        <dd>{w.tables.length ? w.tables.join(", ") : "—"}</dd>
        <dt>{t.formulas}</dt>
        <dd>{w.formula_cells}</dd>
        <dt>{t.macros}</dt>
        <dd>{w.has_macros ? t.macrosYes : t.no}</dd>
        <dt>{t.recalc}</dt>
        <dd>
          {w.needs_recalculation ? (
            <span className="badge warn">{t.recalcNeeded(w.formula_cells_without_cache)}</span>
          ) : (
            t.no
          )}
        </dd>
      </dl>
      <p className="muted small">{t.note}</p>
    </section>
  );
}

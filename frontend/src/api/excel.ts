import { useQuery } from "@tanstack/react-query";

import { getJson } from "./client";

/** Mirrors backend/app/schemas/excel.py `WorkbookInspectResponse` (Phase 4.2). */
export interface SheetInfo {
  name: string;
  hidden: boolean;
  max_row: number;
  max_col: number;
  columns: string[];
}

export interface NamedRange {
  name: string;
  sheet: string;
  ref: string;
}

export interface WorkbookInspect {
  document_id: string;
  file: string;
  kind: string;
  sheets: SheetInfo[];
  named_ranges: NamedRange[];
  has_macros: boolean;
  formula_cells: number;
  formula_cells_without_cache: number;
  needs_recalculation: boolean;
  tables: string[];
}

/** `GET /api/excel/{id}/inspect` — existed in the backend but was not used by any screen. */
export function useWorkbookInspect(documentId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["workbook-inspect", documentId],
    queryFn: () => getJson<WorkbookInspect>(`/api/excel/${documentId}/inspect`),
    enabled,
    retry: false,
  });
}

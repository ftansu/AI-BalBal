// Ürün 1 — Tanıma. B-28b document-type guide (company-ai ADR-025, BACKEND_GAPS §4.7.2): per
// family, which extra fields and tags usually matter. A guide — it steers Balbal and the upload
// screen, it never blocks a submission. Edited by the customer admin.
import { useQuery } from "@tanstack/react-query";

import { getJson, patchJson, postJson } from "./client";
import type { GuideCreate, GuideFamily, GuideSignal, GuideUpdate } from "./types";

export const GUIDE_KEY = ["guide"] as const;
export const ADMIN_GUIDE_KEY = ["admin-guide"] as const;
export const GUIDE_SIGNALS_KEY = ["guide-signals"] as const;

export function useGuide() {
  return useQuery({
    queryKey: GUIDE_KEY,
    queryFn: () => getJson<GuideFamily[]>("/api/document-type-guide"),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminGuide() {
  return useQuery({
    queryKey: ADMIN_GUIDE_KEY,
    queryFn: () => getJson<GuideFamily[]>("/api/admin/document-type-guide"),
  });
}

export function createFamily(body: GuideCreate): Promise<GuideFamily> {
  return postJson<GuideFamily>("/api/admin/document-type-guide", body);
}

export function updateFamily(family: string, body: GuideUpdate): Promise<GuideFamily> {
  return patchJson<GuideFamily>(`/api/admin/document-type-guide/${encodeURIComponent(family)}`, body);
}

/** §4.7.3: which keys staff keep adding by hand, per family — a hint for the admin. */
export function useGuideSignals() {
  return useQuery({
    queryKey: GUIDE_SIGNALS_KEY,
    queryFn: () => getJson<GuideSignal[]>("/api/admin/document-type-guide/signals"),
  });
}

// Ürün 1 — Tanıma (Çekirdek O-1 Onaylı Belge; BACKEND_GAPS §4.7.6 kayıt defteri). Admin-only:
// what Balbal suggested, what the uploader changed/confirmed, who approved — oldest first.
import { useQuery } from "@tanstack/react-query";

import { getJson } from "./client";
import type { ReviewEvent } from "./types";

export function useReviewEvents(documentId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["review-events", documentId],
    queryFn: () => getJson<ReviewEvent[]>(`/api/admin/documents/${documentId}/review-events`),
    enabled,
  });
}

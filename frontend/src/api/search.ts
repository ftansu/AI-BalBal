// Ürün 1 — Tanıma (Ek-B: bilgiyi bulur, belgeyi bulur). B-14 genel arama, company-ai Aşama D
// (01.10.2026): `GET /api/search?q=&limit=` → içerik + metadata belge eşleşmeleri (snippet, sayfa),
// projeler ve kişiler — hepsi `allowed_document_ids` süzgecinden geçmiş. `q` en az 2 karakter.
import { useQuery } from "@tanstack/react-query";

import { getJson, queryString } from "./client";
import type { DirectoryPerson } from "./directory";
import type { DocumentListItem, Project } from "./types";

export interface SearchDocumentHit extends DocumentListItem {
  /** Plain-text excerpt around the match (content hits); null for metadata-only hits. */
  snippet: string | null;
  page_number: number | null;
}

export interface SearchResponse {
  documents: SearchDocumentHit[];
  projects: Project[];
  people: DirectoryPerson[];
}

export const SEARCH_MIN_LENGTH = 2;

export function useSearch(q: string, limit = 8) {
  const query = q.trim();
  return useQuery({
    queryKey: ["search", query, limit],
    queryFn: () => getJson<SearchResponse>(`/api/search${queryString({ q: query, limit: String(limit) })}`),
    enabled: query.length >= SEARCH_MIN_LENGTH,
    staleTime: 30 * 1000,
  });
}

// Ürün 1 — Tanıma. B-28b tag catalogue (company-ai ADR-025, BACKEND_GAPS §4.7.4): tags come
// from the company's fixed list; the customer admin grows/retires it. Never deleted.
import { useQuery } from "@tanstack/react-query";

import { getJson, patchJson, postJson } from "./client";
import type { Tag, TagCreate, TagUpdate } from "./types";

export const TAGS_KEY = ["tags"] as const;
export const ADMIN_TAGS_KEY = ["admin-tags"] as const;

/** Active tags — what a document may be tagged with. */
export function useTags() {
  return useQuery({
    queryKey: TAGS_KEY,
    queryFn: () => getJson<Tag[]>("/api/tags"),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminTags() {
  return useQuery({ queryKey: ADMIN_TAGS_KEY, queryFn: () => getJson<Tag[]>("/api/admin/tags") });
}

export function createTag(body: TagCreate): Promise<Tag> {
  return postJson<Tag>("/api/admin/tags", body);
}

export function updateTag(slug: string, body: TagUpdate): Promise<Tag> {
  return patchJson<Tag>(`/api/admin/tags/${encodeURIComponent(slug)}`, body);
}

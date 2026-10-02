// Ürün 1 — Tanıma (Ek-B: departman yapısı üzerinden yetkiye göre erişim). B-26 klasörler ve
// departman erişim yetkileri, company-ai Aşama E (01.10.2026, ADR-023). Sözleşme bu dosyanın
// `proposed.ts` §10'daki önceki hâliyle alan alan aynıdır; artık gerçek uçlara gider.
import { useQuery } from "@tanstack/react-query";

import { getJson, postJson, putJson } from "./client";

export type FolderAccess = "read" | "write";
/** Bir departmanın bir klasördeki etkin erişimi. `owner` = klasörün sahibi departman. */
export type EffectiveAccess = "none" | FolderAccess | "owner";

export interface FolderGrant {
  department_slug: string;
  access: FolderAccess;
  /** true = üst klasörden miras; false = bu klasörde tanımlı. */
  inherited: boolean;
}

export interface AdminFolder {
  id: string;
  name: string;
  parent_id: string | null;
  owner_department_slug: string;
  grants: FolderGrant[];
  document_count: number;
}

/** Giriş yapan kullanıcının görebildiği klasör ve oradaki erişimi. */
export interface UserFolder {
  id: string;
  name: string;
  parent_id: string | null;
  owner_department_slug: string;
  access: FolderAccess;
  document_count: number;
}

export interface FolderAuditEntry {
  id: string;
  created_at: string;
  actor_name: string;
  folder_id: string | null;
  folder_name: string;
  department_slug: string;
  before: "none" | FolderAccess;
  after: "none" | FolderAccess;
}

export const ADMIN_FOLDERS_KEY = ["admin-folders"] as const;
export const FOLDERS_KEY = ["folders"] as const;

export function useAdminFolders() {
  return useQuery({
    queryKey: ADMIN_FOLDERS_KEY,
    queryFn: () => getJson<AdminFolder[]>("/api/admin/folders"),
  });
}

export function createFolder(body: { name: string; parent_id: string | null; owner_department_slug: string }) {
  return postJson<AdminFolder>("/api/admin/folders", body);
}

/** Klasörün bu klasörde tanımlı yetki listesini topluca yazar (sahibi departman listede olmaz).
 * `access: "none"` gönderilen departman için bu klasördeki tanım kaldırılır ve miras geçerli olur. */
export function updateFolderGrants(
  id: string,
  grants: { department_slug: string; access: "none" | FolderAccess }[],
) {
  return putJson<AdminFolder>(`/api/admin/folders/${id}/grants`, { grants });
}

export function useFolderAudit() {
  return useQuery({
    queryKey: ["admin-folders-audit"],
    queryFn: () => getJson<FolderAuditEntry[]>("/api/admin/folders/audit"),
  });
}

export function useMyFolders() {
  return useQuery({
    queryKey: FOLDERS_KEY,
    queryFn: () => getJson<UserFolder[]>("/api/folders"),
    staleTime: 60 * 1000,
  });
}

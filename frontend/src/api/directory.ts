// Ürün 1 — Tanıma (Ek-B: departman yapısı, yetkiye göre erişim). B-05 şirket rehberi,
// company-ai Aşama C (01.10.2026): `GET /api/directory?q=&department=` — herkes okur, yalnızca
// aktif kullanıcılar; rol/şifre/kullanıcı adı dönmez. (`/api/users` admin-only kalır.)
import { useQuery } from "@tanstack/react-query";

import { getJson, queryString } from "./client";

export interface DirectoryPerson {
  id: string;
  display_name: string;
  title: string | null;
  department_slug: string | null;
  department_name: string | null;
}

export function useDirectory(q: string, department: string | null) {
  return useQuery({
    queryKey: ["directory", q, department],
    queryFn: () =>
      getJson<DirectoryPerson[]>(
        `/api/directory${queryString({ q: q || undefined, department: department ?? undefined })}`,
      ),
    staleTime: 60 * 1000,
  });
}

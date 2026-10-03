// B-28b: append-only ledger of customer-admin configuration changes (tags, guide).
import { useQuery } from "@tanstack/react-query";

import { getJson, queryString } from "./client";
import type { AdminEvent } from "./types";

export function useAdminEvents(kind: string | null) {
  return useQuery({
    queryKey: ["admin-events", kind],
    queryFn: () =>
      getJson<AdminEvent[]>(`/api/admin/events${queryString({ kind: kind ?? undefined, limit: "200" })}`),
  });
}

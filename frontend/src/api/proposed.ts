// Endpoints the Balbal UI needs but backend V0 (ntoydem/company-ai, Phase 5.4) does not
// provide yet. Each function is a contract PROPOSAL — the full list, with request/response
// shapes and the reasoning, is in docs/BACKEND_GAPS.md. When the backend answers 404/405/501
// the call rejects with `BackendPending`, and the UI shows an honest "henüz backend'de yok"
// state instead of inventing data.
import { useQuery } from "@tanstack/react-query";

import { ApiError, getJson, postJson, queryString } from "./client";
import type { AskResponse } from "./types";

export class BackendPending extends Error {
  constructor(public readonly endpoint: string) {
    super(`Backend henüz bu özelliği sunmuyor: ${endpoint}`);
    this.name = "BackendPending";
  }
}

const PENDING_STATUSES = new Set([404, 405, 501]);

async function proposed<T>(endpoint: string, call: () => Promise<T>): Promise<T> {
  try {
    return await call();
  } catch (error) {
    if (error instanceof ApiError && PENDING_STATUSES.has(error.status)) {
      throw new BackendPending(endpoint);
    }
    throw error;
  }
}

export const isPending = (error: unknown): error is BackendPending => error instanceof BackendPending;

/** Pending endpoints must not be retried three times on every mount. */
const noRetryOnPending = (failureCount: number, error: unknown) => !isPending(error) && failureCount < 2;

// ---------------------------------------------------------------------------
// 1. Gündem — kişinin takip etmesi gereken işler (ana ekran özeti)
// ---------------------------------------------------------------------------
export type AgendaKind = "approval" | "opinion_request" | "deadline" | "document_request";

export interface AgendaItem {
  id: string;
  kind: AgendaKind;
  title: string;
  /** ISO date; e.g. a document's `expiration_date` or an opinion request's due date. */
  due_date: string | null;
  /** Every agenda item that refers to a file carries its id so the UI can link + download it. */
  document_id: string | null;
  document_title: string | null;
}

export function useAgenda() {
  return useQuery({
    queryKey: ["agenda"],
    queryFn: () => proposed("GET /api/me/agenda", () => getJson<AgendaItem[]>("/api/me/agenda")),
    retry: noRetryOnPending,
  });
}

// ---------------------------------------------------------------------------
// 2. Bildirimler
// ---------------------------------------------------------------------------
export interface NotificationItem {
  id: string;
  kind: AgendaKind | "document_uploaded" | "version_changed";
  text: string;
  created_at: string;
  read: boolean;
  document_id: string | null;
  document_title: string | null;
  chat_id: string | null;
}

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () =>
      proposed("GET /api/notifications", () => getJson<NotificationItem[]>("/api/notifications")),
    retry: noRetryOnPending,
    refetchInterval: (query) => (isPending(query.state.error) ? false : 60_000),
  });
}

export function markAllNotificationsRead(): Promise<void> {
  return proposed("POST /api/notifications/read-all", () =>
    postJson<void>("/api/notifications/read-all"),
  );
}

// ---------------------------------------------------------------------------
// 3. Balbal sohbet geçmişi + çok turlu soru + geri bildirim
// ---------------------------------------------------------------------------
export interface AskConversationSummary {
  id: string;
  title: string;
  updated_at: string;
}

export interface AskTurn {
  question: string;
  response: AskResponse & { audit_log_id?: string };
  created_at: string;
}

export function useAskConversations() {
  return useQuery({
    queryKey: ["ask-conversations"],
    queryFn: () =>
      proposed("GET /api/ask/conversations", () =>
        getJson<AskConversationSummary[]>("/api/ask/conversations"),
      ),
    retry: noRetryOnPending,
  });
}

export function getAskConversation(id: string): Promise<{ id: string; turns: AskTurn[] }> {
  return proposed("GET /api/ask/conversations/{id}", () =>
    getJson<{ id: string; turns: AskTurn[] }>(`/api/ask/conversations/${id}`),
  );
}

export type FeedbackRating = "up" | "down";

export function sendAnswerFeedback(auditLogId: string, rating: FeedbackRating, comment?: string) {
  return proposed("POST /api/ask/feedback", () =>
    postJson<void>("/api/ask/feedback", { audit_log_id: auditLogId, rating, comment }),
  );
}

// ---------------------------------------------------------------------------
// 4. Şirket rehberi (yönetici olmayan kullanıcılar için; /api/users yalnızca admin)
// ---------------------------------------------------------------------------
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
      proposed("GET /api/directory", () =>
        getJson<DirectoryPerson[]>(
          `/api/directory${queryString({ q: q || undefined, department: department ?? undefined })}`,
        ),
      ),
    retry: noRetryOnPending,
  });
}

// ---------------------------------------------------------------------------
// 5. Ekip sohbeti + departmanlar arası görüş talebi
// ---------------------------------------------------------------------------
export type ChatKind = "direct" | "group" | "opinion_request";

export interface ChatSummary {
  id: string;
  kind: ChatKind;
  title: string;
  member_ids: string[];
  includes_balbal: boolean;
  last_message: string | null;
  updated_at: string;
  unread_count: number;
  opinion_request: {
    from_department: string;
    to_department: string;
    subject: string;
    due_date: string | null;
    status: "open" | "answered" | "closed";
  } | null;
}

export interface ChatMessage {
  id: string;
  sender_id: string | null; // null = Balbal
  sender_name: string;
  text: string | null;
  document_id: string | null;
  document_title: string | null;
  created_at: string;
  system: boolean;
}

export function useChats() {
  return useQuery({
    queryKey: ["chats"],
    queryFn: () => proposed("GET /api/chats", () => getJson<ChatSummary[]>("/api/chats")),
    retry: noRetryOnPending,
  });
}

export function useChatMessages(chatId: string | null) {
  return useQuery({
    queryKey: ["chat-messages", chatId],
    queryFn: () =>
      proposed("GET /api/chats/{id}/messages", () =>
        getJson<ChatMessage[]>(`/api/chats/${chatId as string}/messages`),
      ),
    enabled: chatId !== null,
    retry: noRetryOnPending,
  });
}

export function createChat(body: { member_ids: string[]; title?: string; include_balbal: boolean }) {
  return proposed("POST /api/chats", () => postJson<ChatSummary>("/api/chats", body));
}

export function sendChatMessage(chatId: string, body: { text?: string; document_id?: string }) {
  return proposed("POST /api/chats/{id}/messages", () =>
    postJson<ChatMessage>(`/api/chats/${chatId}/messages`, body),
  );
}

export function addChatMembers(chatId: string, body: { member_ids: string[]; include_balbal?: boolean }) {
  return proposed("POST /api/chats/{id}/members", () =>
    postJson<ChatSummary>(`/api/chats/${chatId}/members`, body),
  );
}

export function createOpinionRequest(body: {
  to_department: string;
  subject: string;
  body: string;
  due_date: string | null;
}) {
  return proposed("POST /api/opinion-requests", () =>
    postJson<ChatSummary>("/api/opinion-requests", body),
  );
}

// ---------------------------------------------------------------------------
// 6. Yetkisiz belge için evrak talebi (Balbal "bu belge başka departmanda" dediğinde)
// ---------------------------------------------------------------------------
export function createDocumentRequest(body: { to_department: string; description: string }) {
  return proposed("POST /api/document-requests", () =>
    postJson<{ id: string }>("/api/document-requests", body),
  );
}

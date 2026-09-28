// Endpoints the Balbal UI needs but backend V0 (ntoydem/company-ai, Phase 5.4) does not
// provide yet. Each function is a contract PROPOSAL — the full list, with request/response
// shapes and the reasoning, is in docs/BACKEND_GAPS.md. When the backend answers 404/405/501
// the call rejects with `BackendPending`, and the UI shows an honest "henüz backend'de yok"
// state instead of inventing data.
import { useQuery } from "@tanstack/react-query";

import { ApiError, getJson, patchJson, postJson, queryString } from "./client";
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
//    Görüş talebi (opinion_request) = Ürün 2. Kişiler arası/grup sohbet (direct, group) = Ürün 2
//    tamamlandıktan sonra (Tansu'nun kararı). Balbal sohbete eklenebilir (include_balbal); yalnızca
//    ona seslenildiğinde, üyelerin ortak yetkili belgeleriyle cevap verir, işlem başlatmaz (P-1).
//    Ayrıntı: docs/BACKEND_GAPS.md §6.3 (B-06b).
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

// ===========================================================================
// DEĞİŞMEZ İLKE P-1 (docs/BACKEND_GAPS.md): Personel onayı olmadan hiçbir işlem ilerlemez.
// Balbal yalnızca taslak üretir. Taslak, sahibi aşağıdaki `approve…` uçlarından birini
// kendi oturumuyla çağırmadan kimseye görünmez ve hiçbir kuyruğa düşmez. Sohbette
// "onaylıyorum" yazmak onay değildir. Onaydan sonra içerik değişirse onay düşer.
// Bu bölümdeki ekranlar henüz tasarlanmadı (önce canvas); aşağıdakiler yalnızca sözleşmedir.
// ===========================================================================

// ---------------------------------------------------------------------------
// 7. Balbal işlem aksiyonu — `/api/ask` cevabına eklenecek alan (B-22 §7)
// ---------------------------------------------------------------------------
/** `AskResponse.action` olarak dönecek. Doluysa sohbette ilgili form kartı gösterilir. */
export type AskAction = { kind: "leave_request_draft"; request_id: string } | null;

// ---------------------------------------------------------------------------
// 8. Kurumsal işlemler — personel izin sistemi (B-22)
// ---------------------------------------------------------------------------
export type RequestKind = "annual_leave";
export type LeaveType = "annual" | "excuse" | "unpaid"; // V0'da yalnızca "annual" açık
export type HalfDay = "none" | "start_afternoon" | "end_morning";
export type RequestStatus =
  | "draft" // yalnızca talep sahibi görür; 72 saatte expired
  | "submitted" // personel onayladı, yönetici kuyruğunda
  | "changes_requested" // yönetici/İK yorumla geri gönderdi; personel düzeltip yeniden onaylar
  | "manager_approved" // İK kuyruğunda
  | "hr_recorded" // son: bakiyeden düşüldü
  | "rejected" // son
  | "cancelled" // son
  | "expired"; // son: içerik silinir

export interface LeaveFields {
  leave_type: LeaveType;
  start_date: string; // ISO date
  end_date: string; // ISO date
  half_day: HalfDay;
  /** Backend hesaplar (hafta sonu, resmî tatil, arife yarım gün düşülür). */
  working_days: number;
  /** Backend hesaplar: bitişten sonraki ilk iş günü. */
  return_date: string;
  note: string | null;
  contact_during_leave: string | null;
  /** V0'da yalnızca bilgi amaçlı; yetki devri yok. */
  substitute_user_id: string | null;
}

export interface RequestEvent {
  actor_id: string;
  actor_name: string;
  from_status: RequestStatus | null;
  to_status: RequestStatus;
  comment: string | null;
  created_at: string;
}

export interface LeaveRequest {
  id: string;
  kind: RequestKind;
  owner_id: string;
  owner_name: string;
  status: RequestStatus;
  fields: LeaveFields;
  approver_id: string | null;
  approver_name: string | null;
  expires_at: string | null; // yalnızca draft için
  events: RequestEvent[];
  created_at: string;
  updated_at: string;
}

export interface LeaveBalance {
  year: number;
  entitled: number;
  carried_over: number;
  used: number;
  /** submitted + manager_approved talepler */
  pending: number;
  /** Tahmini: entitled + carried_over − used − pending */
  remaining_estimated: number;
  /** Bakiye veritabanında sayaç olarak tutulmaz; İK klasöründeki izin hakkı belgesi ve onaylı
   *  izin belgelerinden türetilir. Balbal bunları kaynak kartı olarak gösterir (B-22 §8.1.6). */
  source_document_ids: string[];
}

export interface Holiday {
  date: string;
  name: string;
  half_day: boolean;
}

export function useMyRequests() {
  return useQuery({
    queryKey: ["requests", "mine"],
    queryFn: () => proposed("GET /api/requests/mine", () => getJson<LeaveRequest[]>("/api/requests/mine")),
    retry: noRetryOnPending,
  });
}

export function useRequestInbox() {
  return useQuery({
    queryKey: ["requests", "inbox"],
    queryFn: () => proposed("GET /api/requests/inbox", () => getJson<LeaveRequest[]>("/api/requests/inbox")),
    retry: noRetryOnPending,
  });
}

export function getRequest(id: string) {
  return proposed("GET /api/requests/{id}", () => getJson<LeaveRequest>(`/api/requests/${id}`));
}

/** Yalnızca talep sahibi; yalnızca draft / changes_requested. */
export function updateRequest(id: string, fields: Partial<LeaveFields>) {
  return proposed("PATCH /api/requests/{id}", () => patchJson<LeaveRequest>(`/api/requests/${id}`, { fields }));
}

/** P-1: Personel onayı. Yalnızca talep sahibinin oturumuyla; başkası çağırırsa 403. */
export function approveOwnRequest(id: string) {
  return proposed("POST /api/requests/{id}/approve", () => postJson<LeaveRequest>(`/api/requests/${id}/approve`));
}

export function cancelOwnRequest(id: string) {
  return proposed("POST /api/requests/{id}/cancel", () => postJson<LeaveRequest>(`/api/requests/${id}/cancel`));
}

/** Yönetici formu düzenleyemez; yalnızca onay / ret / düzeltme iste (yorum zorunlu). */
export function managerDecision(
  id: string,
  body: { decision: "approve" | "reject" | "request_changes"; comment: string | null },
) {
  return proposed("POST /api/requests/{id}/manager-decision", () =>
    postJson<LeaveRequest>(`/api/requests/${id}/manager-decision`, body),
  );
}

export function hrDecision(id: string, body: { decision: "record" | "reject"; comment: string | null }) {
  return proposed("POST /api/requests/{id}/hr-decision", () =>
    postJson<LeaveRequest>(`/api/requests/${id}/hr-decision`, body),
  );
}

export function useLeaveBalance() {
  return useQuery({
    queryKey: ["leave-balance"],
    queryFn: () => proposed("GET /api/me/leave-balance", () => getJson<LeaveBalance>("/api/me/leave-balance")),
    retry: noRetryOnPending,
  });
}

export function useHolidays(year: number) {
  return useQuery({
    queryKey: ["holidays", year],
    queryFn: () =>
      proposed("GET /api/holidays", () => getJson<Holiday[]>(`/api/holidays${queryString({ year: String(year) })}`)),
    retry: noRetryOnPending,
  });
}

// ---------------------------------------------------------------------------
// 9. Yazışma ve dilekçe taslağı — Hukuk, Enerji-Geliştirme (B-23)
//    Sistem hiçbir yazıyı göndermez (KEP/UYAP/e-posta yok); kullanıcı dışarıda gönderip işaretler.
// ---------------------------------------------------------------------------
export type CorrespondenceDepartment = "hukuk" | "enerji";
export type CorrespondenceKind = "incoming_letter" | "lawsuit" | "notice";
export type CorrespondenceStatus =
  | "received"
  | "summary_ready"
  | "summary_confirmed" // süre ve proje eşleşmesi kesinleşti
  | "draft_ready"
  | "preparer_approved" // P-1: hazırlayan onayı
  | "reviewer_approved" // ikinci onay (departman yöneticisi)
  | "marked_sent" // kullanıcı dışarıda gönderdi ve işaretledi
  | "closed";

export interface CorrespondenceSummary {
  sender: string;
  letter_date: string | null;
  reference_no: string | null;
  subject: string;
  related_refs: string[]; // "ilgi"
  requested_action: string;
  requested_documents: string[];
  /** Kullanıcı girer/onaylar; LLM tahmin etmez. */
  service_date: string | null;
  /** legal_deadline_rules + service_date ile deterministik hesaplanır. */
  deadline_date: string | null;
  deadline_rule_id: string | null;
  project_ids: string[];
}

export interface DraftSourceCard {
  document_id: string;
  document_title: string;
  page_number: number | null;
  quote: string;
}

export interface CorrespondenceDraft {
  version: number;
  body: string;
  source_cards: DraftSourceCard[];
  /** legal_references dışında kalan, [DOĞRULANMALI] etiketli atıflar. */
  unverified_references: string[];
  /** [BİLGİ EKSİK: …] yer tutucuları. */
  missing_info: string[];
  created_by: string;
  created_at: string;
}

export interface Correspondence {
  id: string;
  department: CorrespondenceDepartment;
  kind: CorrespondenceKind;
  incoming_document_id: string;
  incoming_document_title: string;
  owner_id: string;
  reviewer_id: string | null;
  status: CorrespondenceStatus;
  summary: CorrespondenceSummary | null;
  drafts: CorrespondenceDraft[];
  legal_case_id: string | null;
  sent_document_id: string | null;
  created_at: string;
  updated_at: string;
}

export function useCorrespondenceList(status: CorrespondenceStatus | null, department: CorrespondenceDepartment | null) {
  return useQuery({
    queryKey: ["correspondence", status, department],
    queryFn: () =>
      proposed("GET /api/correspondence", () =>
        getJson<Correspondence[]>(`/api/correspondence${queryString({ status, department })}`),
      ),
    retry: noRetryOnPending,
  });
}

export function createCorrespondence(body: {
  document_id: string;
  department: CorrespondenceDepartment;
  kind: CorrespondenceKind;
}) {
  return proposed("POST /api/correspondence", () => postJson<Correspondence>("/api/correspondence", body));
}

export function generateSummary(id: string) {
  return proposed("POST /api/correspondence/{id}/summary", () =>
    postJson<Correspondence>(`/api/correspondence/${id}/summary`),
  );
}

export function confirmSummary(
  id: string,
  body: { service_date: string; deadline_date: string | null; project_ids: string[] },
) {
  return proposed("POST /api/correspondence/{id}/summary/confirm", () =>
    postJson<Correspondence>(`/api/correspondence/${id}/summary/confirm`, body),
  );
}

export function generateDraft(id: string, body: { instructions?: string }) {
  return proposed("POST /api/correspondence/{id}/drafts", () =>
    postJson<CorrespondenceDraft>(`/api/correspondence/${id}/drafts`, body),
  );
}

/** P-1: hazırlayan onayı. Yalnızca hazırlayanın oturumuyla. */
export function approveDraft(id: string, version: number) {
  return proposed("POST /api/correspondence/{id}/drafts/{v}/approve", () =>
    postJson<Correspondence>(`/api/correspondence/${id}/drafts/${version}/approve`),
  );
}

/** İkinci onaycı taslağı düzenlemez; yalnızca onay / düzeltme iste. */
export function reviewCorrespondence(id: string, body: { decision: "approve" | "request_changes"; comment: string | null }) {
  return proposed("POST /api/correspondence/{id}/review", () =>
    postJson<Correspondence>(`/api/correspondence/${id}/review`, body),
  );
}

/** Sistem göndermez; kullanıcı dışarıda gönderdikten sonra işaretler ve nihai PDF'i bağlar. */
export function markCorrespondenceSent(
  id: string,
  body: { sent_at: string; channel: "KEP" | "UYAP" | "elden" | "posta"; sent_document_id: string },
) {
  return proposed("POST /api/correspondence/{id}/mark-sent", () =>
    postJson<Correspondence>(`/api/correspondence/${id}/mark-sent`, body),
  );
}

export function getCorrespondence(id: string) {
  return proposed("GET /api/correspondence/{id}", () => getJson<Correspondence>(`/api/correspondence/${id}`));
}

/** Kullanıcı Balbal'ın özetini düzeltir (confirm'den önce). */
export function updateSummary(id: string, fields: Partial<CorrespondenceSummary>) {
  return proposed("PATCH /api/correspondence/{id}/summary", () =>
    patchJson<Correspondence>(`/api/correspondence/${id}/summary`, { fields }),
  );
}

/** Yalnızca hazırlayan düzenler; ikinci onaycı düzenleyemez. */
export function updateDraft(id: string, version: number, body: string) {
  return proposed("PATCH /api/correspondence/{id}/drafts/{v}", () =>
    patchJson<CorrespondenceDraft>(`/api/correspondence/${id}/drafts/${version}`, { body }),
  );
}

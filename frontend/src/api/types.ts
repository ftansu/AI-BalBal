// Hand-written mirrors of backend/app/schemas/*.py — keep in step with the API.

/** B-08 (02.10.2026): `department_manager` = own departments at normal + restricted, never board. */
export type UserRole = "admin" | "management" | "department_manager" | "employee";

export type ProductLevel = "P1" | "P2" | "P3";

export interface CurrentUser {
  id: string;
  username: string;
  display_name: string;
  role: UserRole;
  /** Ana departman başta (B-09, Aşama C). */
  department_slugs: string[];
  /** Ürün katmanı anahtarı — B-25 (ADR-022). Backend `/login` ve `/me` ile gönderir (30.09.2026);
   * api/products.ts alan eksikse yine yalnızca P1 varsayar. */
  enabled_products: ProductLevel[];
  /** B-09 / B-05 (Aşama C). */
  primary_department_slug: string | null;
  title: string | null;
  /** Sistemin kendi "bugün"ü (ISO tarih) — company-ai ADR-026 `app.services.temporal.today()`.
   * Yalnızca üst bardaki "Bugün" rozeti okur; arayüz kendi tarih hesabını yapmaz. */
  today: string;
  /** true = demo takvimi (DEMO_TODAY), false = gerçek takvim (ADR-026). */
  demo_mode_enabled: boolean;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
}

export type ProjectStage = "development" | "construction" | "operation";

export interface Project {
  id: string;
  name: string;
  code: string;
  stage: ProjectStage;
  is_active: boolean;
  department_ids: string[];
}

export interface ProjectCreate {
  name: string;
  code: string;
  stage: ProjectStage;
  department_ids: string[];
}

export interface ProjectUpdate {
  name?: string;
  stage?: ProjectStage;
  is_active?: boolean;
  department_ids?: string[];
}

export type DocumentStatus = "draft" | "executed" | "amended" | "superseded" | "active";
export type Confidentiality = "normal" | "restricted" | "board";
export type IngestionStatus = "uploaded" | "ocr" | "ready" | "failed";
/** B-13 (Aşama B): derived from the stored file; null only for a hand-edited row. */
export type FileKind = "pdf" | "image" | "xlsx" | "xlsm" | "csv";
/** B-28 (ADR-024): publication state. Only `approved` documents reach search and Balbal. */
export type ReviewStatus = "pending_metadata" | "pending_review" | "changes_requested" | "approved";

export interface DocumentListItem {
  id: string;
  title: string;
  document_type: string;
  counterparty: string;
  document_date: string;
  status: DocumentStatus;
  ingestion_status: IngestionStatus;
  department: string | null;
  subdepartment: string | null;
  project_id: string | null;
  confidentiality: Confidentiality;
  external_ref: string | null;
  created_at: string;
  file_kind: FileKind | null;
  /** B-26 (Aşama E): belgenin klasörü; null = departmansız/eski kayıt. */
  folder_id: string | null;
  review_status: ReviewStatus;
}

export interface DocumentDetail extends DocumentListItem {
  tags: string[];
  /** B-28 review trail; the full ledger is admin-only (`/api/admin/documents/{id}/review-events`).
   * `uploaded_by_id`: only the uploader may submit (stage 1); the server enforces it, the UI
   * uses it to show the action to the right person. */
  uploaded_by_id: string | null;
  /** B-28b: type-specific facts (staff / Balbal), string values only. */
  extra_fields: Record<string, ExtraFieldValue>;
  review_comment: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
  reviewed_by_id: string | null;
  effective_date: string | null;
  expiration_date: string | null;
  version: number;
  supersedes_document_id: string | null;
  superseded_by_document_id: string | null;
  related_document_ids: string[];
  ingestion_error: string | null;
  page_count: number | null;
}

export interface DocumentUploadResponse {
  id: string;
  ingestion_status: IngestionStatus;
  file_kind: FileKind | null;
}

export interface DocumentStatusResponse {
  id: string;
  ingestion_status: IngestionStatus;
  ingestion_error: string | null;
  page_count: number | null;
}

export type SuggestionStatus = "pending" | "applied" | "rejected" | "failed";

export interface SuggestionField {
  value: string | string[] | null;
  confidence: number;
  /** B-28b: tags Balbal proposed that are not in the catalogue (admin sees them, may add). */
  dropped?: string[];
}

/** B-28b: one `documents.extra_fields` entry — who recorded it and how sure Balbal was. */
export interface ExtraFieldValue {
  value: string;
  source: "ai" | "user";
  confidence: number | null;
  added_by_id: string | null;
  added_at: string | null;
}

export type TagKind = "identity" | "change";

export interface Tag {
  slug: string;
  label: string;
  kind: TagKind;
  is_active: boolean;
}

export interface TagCreate {
  slug: string;
  label: string;
  kind: TagKind;
}

export interface TagUpdate {
  label?: string;
  kind?: TagKind;
  is_active?: boolean;
}

export interface GuideField {
  key: string;
  label: string;
  hint: string;
}

/** `document_type_guide` row (B-28b, ADR-025): a guide, never a mandatory form. */
export interface GuideFamily {
  family: string;
  label: string;
  type_patterns: string[];
  suggested_extra_fields: GuideField[];
  suggested_tags: string[];
  standard_fields_emphasis: string[];
  prompt_hint: string;
  is_active: boolean;
}

export interface GuideCreate {
  family: string;
  label: string;
  type_patterns: string[];
  suggested_extra_fields?: GuideField[];
  suggested_tags?: string[];
  standard_fields_emphasis?: string[];
  prompt_hint?: string;
}

export type GuideUpdate = Partial<Omit<GuideFamily, "family">>;

export interface GuideSignal {
  family: string;
  key: string;
  count: number;
}

export interface AdminEvent {
  id: string;
  created_at: string;
  actor_name: string;
  kind: string;
  target: string;
  before: string | null;
  after: string | null;
}

export interface MetadataSuggestion {
  id: string;
  document_id: string;
  model: string;
  status: SuggestionStatus;
  fields: Record<string, SuggestionField>;
  error: string | null;
  applied_at: string | null;
  applied_by_id: string | null;
}

export interface MetadataSuggestionApply {
  department?: string | null;
  subdepartment?: string | null;
  project_code?: string | null;
  document_type?: string;
  counterparty?: string;
  document_date?: string;
  status?: DocumentStatus;
  confidentiality?: Confidentiality;
  tags?: string[];
  /** B-28b: key → value; `null` removes the key. Keys are normalised to snake_case by the server. */
  extra_fields?: Record<string, string | null>;
}

/** B-28 stage 1 — `POST /api/documents/{id}/submit` (uploader only): the final metadata plus the
 * fields whose low-confidence suggestion is explicitly confirmed (BACKEND_GAPS §4.7.5). */
export interface DocumentSubmitRequest extends MetadataSuggestionApply {
  confirmed_fields: string[];
}

/** B-28 stage 2 — `POST /api/documents/{id}/review` (target department's manager). */
export interface DocumentReviewRequest {
  decision: "approve" | "request_changes";
  comment?: string | null;
}

export type ReviewEventKind =
  | "uploaded"
  | "auto_approved"
  | "field_edited"
  | "field_confirmed"
  | "submitted"
  | "resubmitted"
  | "approved"
  | "changes_requested"
  | "field_added"
  | "metadata_changed_after_approval";

/** `GET /api/admin/documents/{id}/review-events` — append-only intake ledger (admin only). */
export interface ReviewEvent {
  id: string;
  document_id: string;
  created_at: string;
  actor_name: string;
  kind: ReviewEventKind;
  field: string | null;
  before: string | null;
  after: string | null;
  confidence: number | null;
  comment: string | null;
}

/** `PATCH /api/documents/{id}` (Phase 5.2): manual edit, independent of the AI-suggestion
 * flow above. No version-chain fields — those stay upload/apply-only (ADR-012). */
export interface DocumentMetadataEdit {
  title?: string;
  department?: string | null;
  subdepartment?: string | null;
  project_code?: string | null;
  document_type?: string;
  counterparty?: string;
  document_date?: string;
  status?: DocumentStatus;
  confidentiality?: Confidentiality;
  tags?: string[];
  extra_fields?: Record<string, string | null>;
  effective_date?: string | null;
  expiration_date?: string | null;
}

export interface DocumentVisibilityUser {
  id: string;
  username: string;
  display_name: string;
  role: UserRole;
}

export interface DocumentVisibility {
  document_id: string;
  department: string | null;
  confidentiality: Confidentiality;
  /** B-28: for a pending document the list is who may *handle* it, not who will see it. */
  review_status: ReviewStatus;
  users: DocumentVisibilityUser[];
}

/** Admin user management (Phase 5.2). */
export interface AdminUser {
  id: string;
  username: string;
  display_name: string;
  role: UserRole;
  is_active: boolean;
  department_ids: string[];
  department_slugs: string[];
  title: string | null;
  primary_department_id: string | null;
}

export interface UserCreate {
  username: string;
  password: string;
  display_name: string;
  role: UserRole;
  department_ids: string[];
  title?: string | null;
  primary_department_id?: string | null;
}

export interface UserUpdate {
  display_name?: string;
  role?: UserRole;
  is_active?: boolean;
  department_ids?: string[];
  title?: string | null;
  primary_department_id?: string | null;
}

/** `GET /api/audit-log` (Phase 3.4/5.2) — no `answer`/`sources`, those are detail-only. */
export interface AuditLogListItem {
  id: string;
  timestamp: string;
  user_id: string | null;
  question: string;
  query_type: string;
  scope_department: string | null;
  scope_project: string | null;
  model: string | null;
  tokens_in: number;
  tokens_out: number;
  execution_ms: number;
  error: string | null;
}

export interface AuditLogDetail extends AuditLogListItem {
  documents_retrieved: string[];
  chunks_retrieved: Record<string, unknown>[];
  excel_files_used: string[];
  answer: string;
  sources: Record<string, unknown>[];
  cost_estimate: string | null;
  request_id: string | null;
}

export interface AuditLogFilter {
  user_id?: string;
  department?: string;
  project_id?: string;
  query_type?: string;
  from_ts?: string;
  to_ts?: string;
  has_error?: boolean;
  limit?: number;
  offset?: number;
}

/** `project_id` was removed from the backend request (Aşama B, 30.09.2026): Balbal penceresinde
 * proje seçimi yoktur (Ü-10); scope is the department only. */
export interface AskRequest {
  question: string;
  department?: string;
}

export interface SourceCard {
  ref: string;
  document_id: string;
  title: string;
  page_number: number;
  document_date: string;
  effective_date: string | null;
  version: number;
  status: DocumentStatus;
  is_current: boolean;
  supersedes_title: string | null;
  superseded_by_title: string | null;
  /** Aşama A (B-07): version-chain neighbours as ids, so the cards can link to them. */
  supersedes_document_id: string | null;
  superseded_by_document_id: string | null;
  is_initial: boolean;
  /** Aşama D (B-20/6): the document's project, straight from the card. */
  project_code: string | null;
  project_name: string | null;
}

/** Aşama A (B-04) + Ürün 1 uyum turu: structured warnings next to the answer (Ç-7 durumları). */
export interface AskWarning {
  kind: "missing_data" | "insufficient_data" | "product_limit";
  message: string;
  action: "request_data" | null;
}

// ADR-010 (Phase 4.3).
export type QueryType = "DOCUMENT_QUERY" | "DATA_QUERY" | "MIXED_QUERY" | "GENERAL_QUERY";

/** One cited workbook range (SPEC_04 §5): file + sheet + range, no page. */
export interface ExcelSourceCard {
  document_id: string | null;
  file: string;
  sheet: string;
  range: string;
  label: string;
}

export interface AskResponse {
  answer: string;
  answered: boolean;
  sources: SourceCard[];
  retrieved_document_ids: string[];
  model: string | null;
  tokens_in: number;
  tokens_out: number;
  notice: string;
  query_type: QueryType;
  excel_sources: ExcelSourceCard[];
  /** Aşama A: the audit row of this answer (B-04 feedback target). */
  audit_log_id: string | null;
  /** ADR-022: which product layer answered. */
  product_level: ProductLevel;
  warnings: AskWarning[];
}

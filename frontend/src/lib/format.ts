import type {
  Confidentiality,
  DocumentStatus,
  FileKind,
  IngestionStatus,
  ProductLevel,
  ProjectStage,
  ReviewEventKind,
  ReviewStatus,
  TagKind,
  SuggestionStatus,
  UserRole,
} from "../api/types";

/** "2023-06-01" (or an ISO datetime) → "01.06.2023"; string-based on purpose so a
 * date-only value never shifts by the browser's timezone. */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const [y, m, d] = iso.slice(0, 10).split("-");
  return y && m && d ? `${d}.${m}.${y}` : iso;
}

export const STATUS_LABELS: Record<DocumentStatus, string> = {
  draft: "Taslak",
  executed: "İmzalandı",
  amended: "Tadil edildi",
  superseded: "Yerini yenisi aldı",
  active: "Aktif",
};

export const CONFIDENTIALITY_LABELS: Record<Confidentiality, string> = {
  normal: "Normal",
  restricted: "Kısıtlı",
  board: "Yönetim kurulu",
};

export const INGESTION_LABELS: Record<IngestionStatus, string> = {
  uploaded: "Kuyrukta",
  ocr: "İşleniyor",
  ready: "Hazır",
  failed: "Hata",
};

export const STAGE_LABELS: Record<ProjectStage, string> = {
  development: "Geliştirme",
  construction: "İnşaat",
  operation: "İşletme",
};

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Yönetici",
  management: "Yönetim",
  department_manager: "Departman Yöneticisi",
  employee: "Çalışan",
};

/** B-13: shown next to the title; the file itself is always a link (FileLink). */
export const FILE_KIND_LABELS: Record<FileKind, string> = {
  pdf: "PDF",
  image: "Görüntü",
  xlsx: "Excel",
  xlsm: "Excel (makro)",
  csv: "CSV",
};

/** B-28 publication state. `approved` is the normal case and is not badged. */
export const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
  pending_metadata: "Onaya hazırlanıyor",
  pending_review: "Onay bekliyor",
  changes_requested: "Geri gönderildi",
  approved: "Onaylı",
};

/** B-28 ledger rows (admin). */
export const REVIEW_EVENT_LABELS: Record<ReviewEventKind, string> = {
  uploaded: "Yüklendi",
  auto_approved: "Departman yetkilisi yükledi — yayınlandı",
  field_edited: "Alan değiştirildi",
  field_added: "Alan eklendi (personel)",
  field_confirmed: "Düşük güvenli öneri onaylandı",
  submitted: "Onaya gönderildi",
  resubmitted: "Yeniden onaya gönderildi",
  approved: "Onaylandı",
  changes_requested: "Geri gönderildi",
  metadata_changed_after_approval: "Onaydan sonra bilgi değişti — onay düştü",
};

export const TAG_KIND_LABELS: Record<TagKind, string> = {
  identity: "Kimlik",
  change: "Değişiklik",
};

export const EXTRA_SOURCE_LABELS = { ai: "Balbal", user: "Personel" } as const;

/** B-28b search hits: which metadata field matched (content hits show a snippet instead). */
export const MATCHED_ON_LABELS: Record<string, string> = {
  title: "Başlıkta",
  type: "Türde",
  counterparty: "Muhatapta",
  reference: "Referansta",
  tag: "Etiket eşleşmesi",
  extra_field: "Ek alan eşleşmesi",
};

/** Standard fields the guide may emphasise ("bu türde özellikle doldur"). */
export const STANDARD_FIELD_LABELS: Record<string, string> = {
  ...SUGGESTION_FIELD_LABELS_BASE(),
  effective_date: "Yürürlük tarihi",
  expiration_date: "Bitiş tarihi",
  supersedes_document_id: "Değiştirdiği belge",
  title: "Başlık",
};

function SUGGESTION_FIELD_LABELS_BASE(): Record<string, string> {
  return {
    department: "Departman",
    subdepartment: "Alt departman",
    project_code: "Proje",
    document_type: "Belge türü",
    counterparty: "Muhatap",
    document_date: "Belge tarihi",
    status: "Durum",
    confidentiality: "Gizlilik",
    tags: "Etiketler",
  };
}

/** Mirrors the backend default `METADATA_CONFIRM_THRESHOLD`; only decides which rows get the
 * "Onaylıyorum" box. The rule itself is enforced by the server (422 → `fields`). */
export const CONFIRM_THRESHOLD = 0.8;

export const PRODUCT_LEVEL_LABELS: Record<ProductLevel, string> = {
  P1: "Ürün 1",
  P2: "Ürün 2",
  P3: "Ürün 3",
};

export const SUGGESTION_STATUS_LABELS: Record<SuggestionStatus, string> = {
  pending: "Bekliyor",
  applied: "Uygulandı",
  rejected: "Reddedildi",
  failed: "Hata",
};

export const SUGGESTION_FIELD_LABELS: Record<string, string> = {
  department: "Departman",
  subdepartment: "Alt departman",
  project_code: "Proje",
  document_type: "Belge türü",
  counterparty: "Muhatap",
  document_date: "Belge tarihi",
  status: "Durum",
  confidentiality: "Gizlilik",
  tags: "Etiketler",
};

export const SUGGESTION_FIELD_ORDER = [
  "department",
  "subdepartment",
  "project_code",
  "document_type",
  "counterparty",
  "document_date",
  "status",
  "confidentiality",
  "tags",
] as const;

/** Upload/apply forms offer these only; `superseded`/`active` are system-managed. */
export const SELECTABLE_STATUSES: DocumentStatus[] = ["draft", "executed", "amended"];
export const CONFIDENTIALITY_VALUES: Confidentiality[] = ["normal", "restricted", "board"];
export const STAGE_VALUES: ProjectStage[] = ["development", "construction", "operation"];
export const ROLE_VALUES: UserRole[] = ["admin", "management", "department_manager", "employee"];

/** "Ayşe Yılmaz" → "AY" (avatar). */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase("tr") ?? "")
    .join("");
}

// Ürün katmanı anahtarı — B-25 (docs/BACKEND_GAPS.md §1.5.4).
// Karar verildi (Tansu, 28.09.2026): ayrı uygulama/repo YOK. Tek frontend, tek backend;
// müşteride hangi ürünlerin açık olduğu `company_settings.enabled_products` ile tutulur ve
// giriş yapan kullanıcıya `CurrentUser.enabled_products` alanıyla bildirilir (bkz. api/types.ts).
//
// V0 backend'de bu alan henüz yok (B-25 backend tarafında henüz uygulanmadı). O yüzden alan
// `undefined` geldiğinde varsayılan olarak yalnızca P1 açık kabul edilir — böylece bugünkü
// backend'e karşı hiç kimseye yanlışlıkla Ürün 2/3 ekranı gösterilmez. Backend B-25'i
// uyguladığında bu dosyaya dokunmaya gerek kalmaz; `enabled_products` dolu gelmeye başlar.
import type { CurrentUser } from "./types";

export type ProductKey = "P1" | "P2" | "P3";

export const PRODUCT_LABELS: Record<ProductKey, string> = {
  P1: "Ürün 1 — Tanıma",
  P2: "Ürün 2 — Birleştirme",
  P3: "Ürün 3 — Yorumlama",
};

/** Backend B-25'i henüz göndermiyorsa güvenli varsayım: yalnızca P1. */
const DEFAULT_ENABLED_PRODUCTS: ProductKey[] = ["P1"];

export function enabledProducts(user: CurrentUser | null): ProductKey[] {
  return user?.enabled_products ?? DEFAULT_ENABLED_PRODUCTS;
}

export function hasProduct(user: CurrentUser | null, key: ProductKey): boolean {
  return enabledProducts(user).includes(key);
}

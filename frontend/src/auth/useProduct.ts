import { hasProduct, type ProductKey } from "../api/products";
import { useAuth } from "./useAuth";

/** Bu ürün katmanı (P1/P2/P3) bu müşteride açık mı? B-25 — bkz. api/products.ts. */
export function useHasProduct(key: ProductKey): boolean {
  const { user } = useAuth();
  return hasProduct(user, key);
}

import { Navigate, Outlet } from "react-router-dom";

import type { ProductKey } from "../api/products";
import { useHasProduct } from "./useProduct";

/** Guard for a route that belongs to a product layer not every customer has (B-25).
 * Same silent-redirect-to-home pattern as `RequireAdmin` — no separate 403 page. */
export function RequireProduct({ product }: { product: ProductKey }) {
  const enabled = useHasProduct(product);
  if (!enabled) return <Navigate to="/" replace />;
  return <Outlet />;
}

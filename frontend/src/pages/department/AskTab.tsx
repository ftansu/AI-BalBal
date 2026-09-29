import { useOutletContext } from "react-router-dom";

import { useHasProduct } from "../../auth/useProduct";
import { AskPanel } from "../../components/AskPanel";
import type { DepartmentContext } from "../Department";
import { Urun1Home } from "../urun1/Urun1Home";

/** Departman sayfasının giriş sekmesi.
 * Yalnızca Ürün 1 açıkken (P2 kapalı) bunun yerine ÜRÜN 1 ARAYÜZÜ gösterilir: ortada Balbal
 * çubuğu olan sade ana sayfa (pages/urun1/Urun1Home.tsx — yalnızca Ürün 1 içindir). */
export function AskTab() {
  const { department } = useOutletContext<DepartmentContext>();
  const hasP2 = useHasProduct("P2");
  if (!hasP2) return <Urun1Home department={department} uploadPath={`/departman/${department.slug}/yukle`} />;
  return <AskPanel department={department} />;
}

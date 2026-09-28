import { NavLink, Outlet } from "react-router-dom";

import { S } from "../../lib/strings";

/** Yönetim paneli sekmeleri — canvas: Yonetim.dc.html. Erişim `RequireAdmin` ile korunur. */
export function AdminLayout() {
  const t = S.admin.tabs;
  return (
    <>
      <nav className="tabs admin-tabs" aria-label={S.admin.nav}>
        <NavLink to="kullanicilar">{t.users}</NavLink>
        <NavLink to="denetim-kaydi">{t.audit}</NavLink>
        <NavLink to="klasorler">{t.folders}</NavLink>
      </nav>
      <Outlet />
    </>
  );
}

import { Link, useNavigate } from "react-router-dom";

import { useDepartments } from "../../api/departments";
import { useAuth } from "../../auth/useAuth";
import { ROLE_LABELS, initials } from "../../lib/format";
import { S } from "../../lib/strings";
import { CloseButton } from "../common/Modal";
import { uploadPathFor } from "./ShellContext";

/** Kullanıcı menüsü — canvas: Kullanici-Menusu.dc.html. Yetkiler `/api/auth/me` ve
 * backend'in rol kuralından türetilir (SPEC_02 §5): employee = kendi departmanı, yalnızca
 * normal gizlilik; management = tüm departmanlar, tüm gizlilikler; admin = her şey. */
export function UserMenu({ onClose }: { onClose: () => void }) {
  const { user, signOut } = useAuth();
  const departments = useDepartments();
  const navigate = useNavigate();
  if (!user) return null;
  const deptNames = user.department_slugs
    .map((slug) => departments.data?.find((d) => d.slug === slug)?.name ?? slug)
    .join(", ");
  const access =
    user.role === "employee"
      ? S.shell.accessEmployee(deptNames || "—")
      : user.role === "management"
        ? S.shell.accessManagement
        : S.shell.accessAdmin;
  const upload = uploadPathFor(user.department_slugs);

  async function logout() {
    onClose();
    await signOut();
    navigate("/giris", { replace: true });
  }

  return (
    <div className="popover user-panel" role="dialog" aria-label={S.shell.userMenu}>
      <div className="popover-head">
        <div className="user-id">
          <span className="avatar">{initials(user.display_name)}</span>
          <div>
            <strong>{user.display_name}</strong>
            <div className="muted small">
              {user.username} · {ROLE_LABELS[user.role]}
            </div>
          </div>
        </div>
        <CloseButton onClick={onClose} />
      </div>
      <div className="popover-body">
        <div className="section-label">{S.shell.myAccess}</div>
        <p className="small">{access}</p>
        <div className="kvkk-note">
          <strong>{S.shell.kvkkTitle}</strong>
          <p>{S.shell.kvkkBody}</p>
        </div>
        <nav className="menu-links">
          {upload && (
            <Link to={upload} onClick={onClose}>
              {S.shell.upload}
            </Link>
          )}
          {user.department_slugs[0] && (
            <Link to={`/departman/${user.department_slugs[0]}/belgeler`} onClick={onClose}>
              {S.shell.myDocuments}
            </Link>
          )}
          {user.role === "admin" && (
            <Link to="/yonetim/kullanicilar" onClick={onClose}>
              {S.admin.nav}
            </Link>
          )}
          <button type="button" className="link-button danger-text" onClick={logout}>
            {S.nav.logout}
          </button>
        </nav>
      </div>
      <div className="popover-foot muted small">{S.shell.sessionNote}</div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import { useDepartments } from "../api/departments";
import { useNotifications } from "../api/proposed";
import { useAuth } from "../auth/useAuth";
import { useHasProduct } from "../auth/useProduct";
import { initials } from "../lib/format";
import { S } from "../lib/strings";
import { BalbalChat } from "./balbal/BalbalChat";
import { BalbalSessionsProvider } from "./balbal/sessions";
import { NotificationsPanel } from "./shell/NotificationsPanel";
import { SearchPanel } from "./shell/SearchPanel";
import { ShellContext, uploadPathFor, type ShellValue } from "./shell/ShellContext";
import { UserMenu } from "./shell/UserMenu";
import { TeamChat } from "./team/TeamChat";

type Panel = "search" | "notifications" | "user" | null;

/** Uygulama kabuğu — canvas: departman ana sayfalarının üst barı + sağ alttaki iki buton.
 * Balbal ve ekip sohbeti her ekrandan açılır; üst bar panelleri tek seferde bir tane açık. */
export function Layout() {
  const { user } = useAuth();
  const departments = useDepartments();
  const notifications = useNotifications();
  /** Ekip sohbeti (kişiler arası / grup) Ürün 1'dir; her pakette açıktır (B-06b). Balbal bu sohbetlere
   * dahil edilemez. İçindeki "görüş talebi" sekmesi Ürün 2'dir ve TeamNewChat'te P2'ye bağlıdır (B-06a). */
  const [panel, setPanel] = useState<Panel>(null);
  const [query, setQuery] = useState("");
  const [balbal, setBalbal] = useState<{ open: boolean; question: string | null }>({ open: false, question: null });
  const [teamOpen, setTeamOpen] = useState(false);
  const location = useLocation();
  /** ÜRÜN 1 ARAYÜZÜ: yalnızca Ürün 1 açıkken departman giriş sayfasında Balbal ortadaki çubuktur;
   * üst bardaki arama ve sağ alttaki Balbal butonu bu sayfada gösterilmez. */
  const urun1Home = !useHasProduct("P2") && /^\/departman\/[^/]+\/?$/.test(location.pathname);

  const shell = useMemo<ShellValue>(
    () => ({
      openBalbal: (question?: string) => {
        setPanel(null);
        setBalbal({ open: true, question: question ?? null });
      },
      openTeam: () => {
        setPanel(null);
        setTeamOpen(true);
      },
    }),
    [],
  );

  const deptName = user?.department_slugs
    .map((slug) => departments.data?.find((d) => d.slug === slug)?.name ?? slug)
    .join(", ");
  const unread = (notifications.data ?? []).filter((n) => !n.read).length;
  const upload = user ? uploadPathFor(user.department_slugs) : null;
  const toggle = (p: Panel) => setPanel((cur) => (cur === p ? null : p));

  return (
    <ShellContext.Provider value={shell}>
      <BalbalSessionsProvider>
        <header className="topbar">
          <Link to="/" className="brand">
            <span className="brand-mark" aria-hidden="true" />
            {S.app}
          </Link>
          {deptName && (
            <span className="topbar-dept">
              <span className="dot" aria-hidden="true" />
              {deptName}
            </span>
          )}
          <div className="topbar-tools">
            {!urun1Home && (
              <div className="topbar-search">
                <label htmlFor="top-search" className="sr-only">
                  {S.shell.search}
                </label>
                <input
                  id="top-search"
                  value={query}
                  placeholder={S.shell.search}
                  onFocus={() => setPanel("search")}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPanel("search");
                  }}
                />
              </div>
            )}
            {upload && (
              <Link to={upload} className="topbar-button">
                {S.shell.upload}
              </Link>
            )}
            {urun1Home && (
              // Ürün 1 giriş ekranında sekmeler yok; Belgeler'e görünür tek yol bu link (UX notu 2, T-12 onay bekliyor).
              <Link to={`${location.pathname.replace(/\/$/, "")}/belgeler`} className="topbar-button">
                {S.shell.documents}
              </Link>
            )}
            <button type="button" className="topbar-icon" aria-label={S.shell.notifications} onClick={() => toggle("notifications")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              {unread > 0 && <span className="count">{unread}</span>}
            </button>
            {user && (
              <button type="button" className="topbar-user" aria-label={S.shell.userMenu} onClick={() => toggle("user")}>
                <span className="topbar-user-text">
                  <strong>{user.display_name}</strong>
                </span>
                <span className="avatar">{initials(user.display_name)}</span>
              </button>
            )}
          </div>
          {panel === "search" && <SearchPanel query={query} onClose={() => setPanel(null)} />}
          {panel === "notifications" && <NotificationsPanel onClose={() => setPanel(null)} />}
          {panel === "user" && <UserMenu onClose={() => setPanel(null)} />}
        </header>

        <main>
          <Outlet />
        </main>

        {!balbal.open && !teamOpen && (
          <div className="launchers">
            <button type="button" className="launcher launcher-team" aria-label={S.team.open} onClick={() => setTeamOpen(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </button>
            {!urun1Home && (
              <button type="button" className="launcher launcher-balbal" aria-label={S.balbal.open} onClick={() => shell.openBalbal()}>
                <span className="agent-mark large" aria-hidden="true" />
              </button>
            )}
          </div>
        )}
        {balbal.open && (
          <BalbalChat initialQuestion={balbal.question} onClose={() => setBalbal({ open: false, question: null })} />
        )}
        {teamOpen && <TeamChat onClose={() => setTeamOpen(false)} />}
      </BalbalSessionsProvider>
    </ShellContext.Provider>
  );
}

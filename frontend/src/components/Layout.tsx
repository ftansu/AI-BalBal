import { useMemo, useState } from "react";
import { Link, Outlet } from "react-router-dom";

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
  /** Ekip sohbeti = görüş talebi / kişiler arası sohbet = Ürün 2 (B-25, B-06a/b). */
  const hasTeamChat = useHasProduct("P2");
  const [panel, setPanel] = useState<Panel>(null);
  const [query, setQuery] = useState("");
  const [balbal, setBalbal] = useState<{ open: boolean; question: string | null }>({ open: false, question: null });
  const [teamOpen, setTeamOpen] = useState(false);

  const shell = useMemo<ShellValue>(
    () => ({
      openBalbal: (question?: string) => {
        setPanel(null);
        setBalbal({ open: true, question: question ?? null });
      },
      openTeam: () => {
        if (!hasTeamChat) return; // Ürün 2 kapalıysa ekip sohbeti hiç açılmaz (B-25).
        setPanel(null);
        setTeamOpen(true);
      },
    }),
    [hasTeamChat],
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
            {upload && (
              <Link to={upload} className="topbar-button">
                {S.shell.upload}
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
            {hasTeamChat && (
              <button type="button" className="launcher launcher-team" aria-label={S.team.open} onClick={() => setTeamOpen(true)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </button>
            )}
            <button type="button" className="launcher launcher-balbal" aria-label={S.balbal.open} onClick={() => shell.openBalbal()}>
              <span className="agent-mark large" aria-hidden="true" />
            </button>
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

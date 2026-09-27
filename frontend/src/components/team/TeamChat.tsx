import { useState } from "react";

import { isPending, useChats, useDirectory, type ChatSummary } from "../../api/proposed";
import { S } from "../../lib/strings";
import { CloseButton, Modal, PendingNotice } from "../common/Modal";
import { ErrorBox } from "../ErrorBox";
import { TeamConversation } from "./TeamConversation";
import { TeamNewChat } from "./TeamNewChat";

type ListFilter = "all" | "unread" | "request";

/** Ekip sohbeti — canvas: Ekip-Sohbet.dc.html. Solda sohbet listesi + arama (şirket
 * rehberinden kişi bulma dahil), sağda aktif sohbet veya "Yeni sohbet" (rehber / görüş talebi).
 * Kişiler arası mesajlaşma backend V0'da yok (BACKEND_GAPS B-05, B-06). */
export function TeamChat({ onClose }: { onClose: () => void }) {
  const chats = useChats();
  const [mode, setMode] = useState<"chat" | "new">("chat");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<ListFilter>("all");
  const directoryHits = useDirectory(q, null);

  const list = (chats.data ?? []).filter((c) => {
    if (filter === "unread" && c.unread_count === 0) return false;
    if (filter === "request" && c.kind !== "opinion_request") return false;
    return !q || c.title.toLocaleLowerCase("tr").includes(q.toLocaleLowerCase("tr"));
  });
  const active: ChatSummary | null =
    (chats.data ?? []).find((c) => c.id === activeId) ?? (mode === "chat" ? (list[0] ?? null) : null);

  const filters: [ListFilter, string][] = [
    ["all", S.team.filterAll],
    ["unread", S.team.filterUnread],
    ["request", S.team.filterRequests],
  ];

  return (
    <Modal label={S.team.title} onClose={onClose} wide>
      <div className="team">
        <aside className="team-side">
          <div className="team-side-head">
            <h2>{S.team.title}</h2>
            <button type="button" className="dark-button small" onClick={() => setMode("new")}>
              + {S.team.newChat}
            </button>
          </div>
          <label htmlFor="team-search" className="sr-only">
            {S.team.search}
          </label>
          <input id="team-search" className="search-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder={S.team.search} />
          <div className="chips">
            {filters.map(([key, label]) => (
              <button type="button" key={key} className={`chip${filter === key ? " active" : ""}`} onClick={() => setFilter(key)}>
                {label}
              </button>
            ))}
          </div>
          <div className="team-list">
            {isPending(chats.error) && <PendingNotice endpoint="GET /api/chats">{S.team.pendingChats}</PendingNotice>}
            {chats.isError && !isPending(chats.error) && <ErrorBox error={chats.error} />}
            {list.map((c) => (
              <button
                type="button"
                key={c.id}
                className={`team-row${active?.id === c.id && mode === "chat" ? " active" : ""}`}
                onClick={() => {
                  setActiveId(c.id);
                  setMode("chat");
                }}
              >
                <span className="team-row-title">{c.title}</span>
                {c.opinion_request && (
                  <span className="badge warn">
                    {S.team.requestTag}: {c.opinion_request.from_department} → {c.opinion_request.to_department}
                  </span>
                )}
                <span className="team-row-snippet muted small">{c.last_message ?? ""}</span>
                {c.unread_count > 0 && <span className="unread-dot">{c.unread_count}</span>}
              </button>
            ))}
            {q && (directoryHits.data ?? []).length > 0 && (
              <>
                <div className="section-label">{S.team.directory}</div>
                {(directoryHits.data ?? []).map((p) => (
                  <button type="button" key={p.id} className="team-row" onClick={() => setMode("new")}>
                    <span className="team-row-title">{p.display_name}</span>
                    <span className="muted small">
                      {p.title ?? ""} · {p.department_name ?? ""}
                    </span>
                  </button>
                ))}
              </>
            )}
          </div>
        </aside>

        <section className="team-main">
          <div className="team-close">
            <CloseButton onClick={onClose} />
          </div>
          {mode === "new" && (
            <TeamNewChat
              onCreated={(chat) => {
                setActiveId(chat.id);
                setMode("chat");
              }}
            />
          )}
          {mode === "chat" && active && <TeamConversation chat={active} />}
          {mode === "chat" && !active && (
            <div className="team-empty">
              <p className="muted">{S.team.emptyHint}</p>
              <button type="button" onClick={() => setMode("new")}>
                + {S.team.newChat}
              </button>
            </div>
          )}
        </section>
      </div>
    </Modal>
  );
}

import { useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";

import { useDocuments } from "../../api/documents";
import { isPending, sendChatMessage, useChatMessages, type ChatSummary } from "../../api/proposed";
import { useAuth } from "../../auth/useAuth";
import { formatDate } from "../../lib/format";
import { S } from "../../lib/strings";
import { FileLink } from "../common/FileLink";
import { PendingNotice } from "../common/Modal";
import { ErrorBox } from "../ErrorBox";

/** Aktif sohbet: mesajlar, paylaşılan belgeler (her biri link + İndir), belge ekleme. */
export function TeamConversation({ chat }: { chat: ChatSummary }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const messages = useChatMessages(chat.id);
  const documents = useDocuments({});
  const [draft, setDraft] = useState("");
  const [attachOpen, setAttachOpen] = useState(false);
  const [error, setError] = useState<unknown>(null);

  async function send(body: { text?: string; document_id?: string }) {
    setError(null);
    try {
      await sendChatMessage(chat.id, body);
      setDraft("");
      setAttachOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["chat-messages", chat.id] });
    } catch (e) {
      setError(e);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (draft.trim()) void send({ text: draft.trim() });
  }

  const shareable = (documents.data ?? []).filter((d) => d.ingestion_status === "ready").slice(0, 8);

  return (
    <div className="team-conv">
      <header className="team-conv-head">
        <div className="team-conv-title">{chat.title}</div>
        <div className="muted small">
          {chat.member_ids.length} {S.team.members}
        </div>
      </header>
      {chat.opinion_request && (
        <div className="request-banner">
          <strong>{chat.opinion_request.subject}</strong>
          {chat.opinion_request.due_date && ` · ${S.team.requestDue}: ${formatDate(chat.opinion_request.due_date)}`}
          <span className="badge warn">{S.team.requestStatus[chat.opinion_request.status]}</span>
        </div>
      )}
      <div className="team-messages">
        {isPending(messages.error) && <PendingNotice endpoint="GET /api/chats/{id}/messages" />}
        {(messages.data ?? []).map((m) =>
          m.system ? (
            <div key={m.id} className="system-line">
              {m.text}
            </div>
          ) : (
            <div key={m.id} className={`bubble ${m.sender_id === user?.id ? "user" : "other"}`}>
              {m.sender_id !== user?.id && <div className="sender">{m.sender_name}</div>}
              {m.text && <div>{m.text}</div>}
              {m.document_title && (
                <div className="file-card">
                  <FileLink documentId={m.document_id} title={m.document_title} />
                </div>
              )}
            </div>
          ),
        )}
      </div>
      {attachOpen && (
        <div className="attach-popover">
          <div className="section-label">{S.team.shareFromSystem}</div>
          {shareable.map((d) => (
            <button type="button" key={d.id} className="attach-row" onClick={() => send({ document_id: d.id })}>
              {d.title}
              <span className="muted small">
                {formatDate(d.document_date)} · {d.document_type}
              </span>
            </button>
          ))}
          <p className="muted small">{S.team.shareHint}</p>
        </div>
      )}
      {error !== null &&
        (isPending(error) ? <PendingNotice endpoint="POST /api/chats/{id}/messages" /> : <ErrorBox error={error} />)}
      <form className="team-input" onSubmit={onSubmit}>
        <button type="button" className="icon-button bordered" aria-label={S.team.attach} onClick={() => setAttachOpen((v) => !v)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </button>
        <label htmlFor="team-draft" className="sr-only">
          {S.team.placeholder}
        </label>
        <input id="team-draft" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={S.team.placeholder} />
        <button type="submit">{S.team.send}</button>
      </form>
    </div>
  );
}

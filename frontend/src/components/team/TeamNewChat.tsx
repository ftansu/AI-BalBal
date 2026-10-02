import { useState } from "react";

import { useDepartments } from "../../api/departments";
import { useDirectory, type DirectoryPerson } from "../../api/directory";
import { createChat, createOpinionRequest, isPending, type ChatSummary } from "../../api/proposed";
import { useAuth } from "../../auth/useAuth";
import { useHasProduct } from "../../auth/useProduct";
import { S } from "../../lib/strings";
import { PendingNotice } from "../common/Modal";
import { ErrorBox } from "../ErrorBox";

/** "Yeni sohbet": şirket rehberinden kişi seçimi (çoklu → grup) — Ürün 1, B-06b. Balbal bu sohbetlere
 * dahil edilemez. Başka bir departmandan resmi görüş talebi (kurumsal hafızaya kaydedilir) Ürün 2'dir
 * (B-06a); sekmesi yalnızca P2 açıkken görünür. */
export function TeamNewChat({ onCreated }: { onCreated: (chat: ChatSummary) => void }) {
  const hasOpinionRequest = useHasProduct("P2");
  const [tab, setTab] = useState<"people" | "request">("people");
  const active = hasOpinionRequest ? tab : "people";
  return (
    <div className="team-new">
      {hasOpinionRequest && (
        <div className="chips">
          <button type="button" className={`chip${active === "people" ? " active" : ""}`} onClick={() => setTab("people")}>
            {S.team.tabPeople}
          </button>
          <button type="button" className={`chip${active === "request" ? " active" : ""}`} onClick={() => setTab("request")}>
            {S.team.tabRequest}
          </button>
        </div>
      )}
      {active === "people" ? <PeoplePicker onCreated={onCreated} /> : <OpinionRequestForm onCreated={onCreated} />}
    </div>
  );
}

function PeoplePicker({ onCreated }: { onCreated: (chat: ChatSummary) => void }) {
  const departments = useDepartments();
  const [q, setQ] = useState("");
  const [dept, setDept] = useState<string | null>(null);
  const [selected, setSelected] = useState<DirectoryPerson[]>([]);
  const [error, setError] = useState<unknown>(null);
  const directory = useDirectory(q, dept);
  const topLevel = (departments.data ?? []).filter((d) => d.parent_id === null);

  const toggle = (p: DirectoryPerson) =>
    setSelected((prev) => (prev.some((x) => x.id === p.id) ? prev.filter((x) => x.id !== p.id) : [...prev, p]));

  async function start() {
    setError(null);
    try {
      const chat = await createChat({
        member_ids: selected.map((p) => p.id),
        title: selected.length > 1 ? selected.map((p) => p.display_name.split(" ")[0]).join(", ") : undefined,
      });
      onCreated(chat);
    } catch (e) {
      setError(e);
    }
  }

  return (
    <div className="team-new-body">
      <label htmlFor="dir-q" className="sr-only">
        {S.team.directorySearch}
      </label>
      <input id="dir-q" className="search-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder={S.team.directorySearch} />
      <div className="chips">
        <button type="button" className={`chip${dept === null ? " active" : ""}`} onClick={() => setDept(null)}>
          {S.team.allDepartments}
        </button>
        {topLevel.map((d) => (
          <button type="button" key={d.id} className={`chip${dept === d.slug ? " active" : ""}`} onClick={() => setDept(d.slug)}>
            {d.name}
          </button>
        ))}
      </div>
      {selected.length > 0 && (
        <div className="chips">
          <span className="muted small">{S.team.selected}:</span>
          {selected.map((p) => (
            <button type="button" key={p.id} className="chip active" onClick={() => toggle(p)}>
              {p.display_name} ×
            </button>
          ))}
        </div>
      )}
      <div className="directory-list">
        {isPending(directory.error) && <PendingNotice endpoint="GET /api/directory">{S.team.pendingDirectory}</PendingNotice>}
        {(directory.data ?? []).map((p) => {
          const on = selected.some((x) => x.id === p.id);
          return (
            <button type="button" key={p.id} className={`directory-row${on ? " selected" : ""}`} onClick={() => toggle(p)}>
              <span className={`check${on ? " on" : ""}`} aria-hidden="true" />
              <span className="directory-name">{p.display_name}</span>
              <span className="muted small">{p.title ?? ""}</span>
              <span className="badge neutral">{p.department_name ?? "—"}</span>
            </button>
          );
        })}
      </div>
      <div className="team-new-actions">
        <span />
        <button type="button" disabled={selected.length === 0} onClick={start}>
          {selected.length > 1 ? S.team.startGroup(selected.length + 1) : S.team.start}
        </button>
      </div>
      {error !== null &&
        (isPending(error) ? <PendingNotice endpoint="POST /api/chats" /> : <ErrorBox error={error} />)}
    </div>
  );
}

function OpinionRequestForm({ onCreated }: { onCreated: (chat: ChatSummary) => void }) {
  const { user } = useAuth();
  const departments = useDepartments();
  const [to, setTo] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [due, setDue] = useState("");
  const [error, setError] = useState<unknown>(null);
  const targets = (departments.data ?? []).filter(
    (d) => d.parent_id === null && !(user?.department_slugs ?? []).includes(d.slug),
  );

  async function submit() {
    if (!to || !subject.trim() || !body.trim()) return;
    setError(null);
    try {
      onCreated(await createOpinionRequest({ to_department: to, subject, body, due_date: due || null }));
    } catch (e) {
      setError(e);
    }
  }

  return (
    <div className="team-new-body">
      <p className="muted">{S.team.requestHint}</p>
      <div className="field">
        <span className="field-label">{S.team.requestTo}</span>
        <div className="chips">
          {targets.map((d) => (
            <button type="button" key={d.id} className={`chip${to === d.slug ? " active" : ""}`} onClick={() => setTo(d.slug)}>
              {d.name}
            </button>
          ))}
        </div>
      </div>
      <div className="field">
        <label htmlFor="req-subject">{S.team.requestSubject}</label>
        <input id="req-subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="req-body">{S.team.requestBody}</label>
        <textarea id="req-body" rows={5} value={body} onChange={(e) => setBody(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="req-due">{S.team.requestDue}</label>
        <input id="req-due" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
      </div>
      <div className="team-new-actions">
        <span />
        <button type="button" disabled={!to || !subject.trim() || !body.trim()} onClick={submit}>
          {S.team.requestSend}
        </button>
      </div>
      {error !== null &&
        (isPending(error) ? <PendingNotice endpoint="POST /api/opinion-requests" /> : <ErrorBox error={error} />)}
    </div>
  );
}

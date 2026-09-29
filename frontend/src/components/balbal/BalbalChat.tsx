import { useEffect, useRef, useState, type FormEvent } from "react";

import { ask } from "../../api/ask";
import { useDepartments } from "../../api/departments";
import { useDocuments } from "../../api/documents";
import { projectNameById, useProjects } from "../../api/projects";
import { isPending, useAskConversations } from "../../api/proposed";
import type { AskResponse } from "../../api/types";
import { useAuth } from "../../auth/useAuth";
import { S } from "../../lib/strings";
import { CloseButton, Modal } from "../common/Modal";
import { ErrorBox } from "../ErrorBox";
import { AnswerView } from "./AnswerView";
import { useBalbalSessions, type BalbalTurn } from "./sessionsContext";

/** Balbal sohbet penceresi — canvas: Balbal-Sohbet.dc.html.
 * Sol: geçmiş sorular + "Yeni soru". Sağ: cevaplar, kaynaklar. Proje seçimi yok (canvas v165):
 * tek pencerede birden çok proje hakkında konuşulur (BACKEND_GAPS §3.3, B-20/6).
 * Geçmiş sunucuda saklanmıyorsa (BACKEND_GAPS B-03) bu oturumda bellekte tutulur. */
export function BalbalChat({ initialQuestion, onClose }: { initialQuestion: string | null; onClose: () => void }) {
  const { user } = useAuth();
  const { sessions, activeId, setActiveId, newSession, addTurn, updateTurn } = useBalbalSessions();
  const [draft, setDraft] = useState("");
  const serverHistory = useAskConversations();
  const projects = useProjects();
  const departments = useDepartments();
  const documents = useDocuments({});
  const projectNames = projectNameById(projects.data);
  const listRef = useRef<HTMLDivElement>(null);
  const askedInitial = useRef(false);

  const department = user && user.role === "employee" ? user.department_slugs[0] : undefined;
  const active = sessions.find((s) => s.id === activeId) ?? null;

  const projectOfDocument = (documentId: string): string | null => {
    const doc = documents.data?.find((d) => d.id === documentId);
    return doc?.project_id ? (projectNames.get(doc.project_id) ?? null) : null;
  };

  async function send(question: string, targetSessionId?: string) {
    const q = question.trim();
    if (q.length < 3) return;
    const sessionId = targetSessionId ?? activeId ?? newSession(q);
    const turnId = addTurn(sessionId, q);
    setDraft("");
    try {
      const response: AskResponse = await ask({ question: q, department });
      updateTurn(sessionId, turnId, { status: "done", response });
    } catch (error) {
      updateTurn(sessionId, turnId, { status: "error", error });
    }
  }

  useEffect(() => {
    if (initialQuestion && !askedInitial.current) {
      askedInitial.current = true;
      void send(initialQuestion, newSession(initialQuestion));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuestion]);

  const turnCount = active?.turns.length ?? 0;
  const lastStatus = active?.turns[turnCount - 1]?.status;
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [turnCount, lastStatus]);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void send(draft);
  }

  const historyPending = isPending(serverHistory.error);
  const departmentName = department ? (departments.data?.find((d) => d.slug === department)?.name ?? department) : null;
  const uploadPath = department ? `/departman/${department}/yukle` : null;

  return (
    <Modal label="Balbal" onClose={onClose} wide>
      <div className="balbal">
        <aside className="balbal-side">
          <div className="balbal-brand">
            <span className="agent-mark" aria-hidden="true" />
            Balbal
          </div>
          <button type="button" className="dark-button" onClick={() => newSession(null)}>
            + {S.balbal.newQuestion}
          </button>
          <div className="section-label">{S.balbal.history}</div>
          <div className="balbal-history">
            {sessions.length === 0 && <p className="muted small">{S.balbal.noHistory}</p>}
            {sessions.map((s) => (
              <button
                type="button"
                key={s.id}
                className={`history-item${s.id === activeId ? " active" : ""}`}
                onClick={() => setActiveId(s.id)}
              >
                <span className="history-title">{s.title}</span>
                <span className="muted small">{s.when}</span>
              </button>
            ))}
          </div>
          <p className="balbal-privacy">
            {historyPending ? S.balbal.sessionOnly : S.balbal.privacy}
          </p>
        </aside>

        <section className="balbal-main">
          <header className="balbal-head">
            <div>
              <div className="balbal-title">{active?.title ?? S.balbal.newQuestion}</div>
              <div className="muted small">
                {S.balbal.scope}: {departmentName ?? S.balbal.allDepartments} · {S.balbal.allProjects}
              </div>
            </div>
            <CloseButton onClick={onClose} />
          </header>

          <div className="balbal-messages" ref={listRef}>
            {(!active || active.turns.length === 0) && (
              <div className="balbal-empty">
                <span className="agent-mark large" aria-hidden="true" />
                <h2>{S.balbal.emptyTitle}</h2>
                <p className="muted">{S.balbal.emptyHint}</p>
                <div className="example-list">
                  {S.ask.exampleQuestions.map((q) => (
                    <button type="button" key={q} className="example-button" onClick={() => void send(q)}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {active?.turns.map((t) => (
              <TurnView key={t.id} turn={t} projectOfDocument={projectOfDocument} uploadPath={uploadPath} />
            ))}
          </div>

          <form className="balbal-input" onSubmit={onSubmit}>
            <label htmlFor="balbal-q" className="sr-only">
              {S.balbal.placeholder}
            </label>
            <input
              id="balbal-q"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={S.balbal.placeholder}
              maxLength={1000}
              autoFocus
            />
            <button type="submit">{S.ask.submit}</button>
          </form>
          <p className="muted small balbal-footnote">{S.balbal.footnote}</p>
        </section>
      </div>
    </Modal>
  );
}

function TurnView({
  turn,
  projectOfDocument,
  uploadPath,
}: {
  turn: BalbalTurn;
  projectOfDocument: (id: string) => string | null;
  uploadPath: string | null;
}) {
  return (
    <>
      <div className="bubble user">{turn.question}</div>
      {turn.status === "pending" && <div className="bubble typing">{S.balbal.thinking}</div>}
      {turn.status === "error" && <ErrorBox error={turn.error} />}
      {turn.status === "done" && turn.response && (
        <AnswerView result={turn.response} projectOfDocument={projectOfDocument} uploadPath={uploadPath} />
      )}
    </>
  );
}

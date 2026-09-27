import { useCallback, useMemo, useState, type ReactNode } from "react";

import { SessionsContext, type BalbalTurn, type BalbalSession } from "./sessionsContext";

const NEW_TITLE = "Yeni soru";
let counter = 0;
const nextId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(counter += 1)}`;
const nowLabel = () =>
  new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

/** Balbal sohbet geçmişi. Backend sohbet saklamadığı sürece (BACKEND_GAPS B-03) oturum
 * boyunca bellekte tutulur; sayfa yenilenince kaybolur. Backend hazır olduğunda bu
 * sağlayıcı `/api/ask/conversations` ile beslenecek. */
export function BalbalSessionsProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<BalbalSession[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const newSession = useCallback((title: string | null) => {
    const id = nextId("s");
    setSessions((prev) => [{ id, title: title ?? NEW_TITLE, when: nowLabel(), turns: [] }, ...prev]);
    setActiveId(id);
    return id;
  }, []);

  const addTurn = useCallback((sessionId: string, question: string) => {
    const id = nextId("t");
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              title: s.title === NEW_TITLE ? question : s.title,
              turns: [...s.turns, { id, question, status: "pending" }],
            }
          : s,
      ),
    );
    return id;
  }, []);

  const updateTurn = useCallback((sessionId: string, turnId: string, patch: Partial<BalbalTurn>) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId ? { ...s, turns: s.turns.map((t) => (t.id === turnId ? { ...t, ...patch } : t)) } : s,
      ),
    );
  }, []);

  const value = useMemo(
    () => ({ sessions, activeId, setActiveId, newSession, addTurn, updateTurn }),
    [sessions, activeId, newSession, addTurn, updateTurn],
  );
  return <SessionsContext.Provider value={value}>{children}</SessionsContext.Provider>;
}

import { createContext, useContext } from "react";

import type { AskResponse } from "../../api/types";

export interface BalbalTurn {
  id: string;
  question: string;
  status: "pending" | "done" | "error";
  response?: AskResponse;
  error?: unknown;
}

export interface BalbalSession {
  id: string;
  title: string;
  when: string;
  turns: BalbalTurn[];
}

export interface SessionsValue {
  sessions: BalbalSession[];
  activeId: string | null;
  setActiveId: (id: string) => void;
  newSession: (title: string | null) => string;
  addTurn: (sessionId: string, question: string) => string;
  updateTurn: (sessionId: string, turnId: string, patch: Partial<BalbalTurn>) => void;
}

export const SessionsContext = createContext<SessionsValue | null>(null);
export function useBalbalSessions(): SessionsValue {
  const value = useContext(SessionsContext);
  if (!value) throw new Error("useBalbalSessions must be used inside BalbalSessionsProvider");
  return value;
}

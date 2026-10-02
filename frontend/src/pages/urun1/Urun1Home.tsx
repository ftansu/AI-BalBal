/**
 * ÜRÜN 1 ARAYÜZÜ — BU EKRAN YALNIZCA ÜRÜN 1 İÇİNDİR.
 *
 * Canvas: "X Platformu — Ürün 1" (ayrı canvas; Ürün 2 ve Ürün 3'ün kendi canvas'ları var).
 * Şirketin paketinde yalnızca Ürün 1 açıkken (enabled_products'ta P2 yok) departman ana
 * sayfası bu ekrandır. Ürün 2 veya 3 açıkken bu ekran gösterilmez; departman sayfasının
 * mevcut (sekmeli) arayüzü gelir.
 *
 * Ürün 1 kuralları (docs/BACKEND_GAPS.md §1.5, bible):
 *  - Sade: ortada Balbal çubuğu, bilgilendirici tablo / gösterge / EPİAŞ verisi YOK.
 *  - Balbal yorum katmaz, kaynak gösterir; kaynak yoksa "bulunamadı" der.
 *  - Ekip sohbeti ayrı penceredir ve Balbal'ı içermez (B-06b).
 * Bu ekrana Ürün 2/3 özelliği (gündem, görüş talebi, hesap, projeksiyon) EKLENMEZ.
 */
import { useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";

import { ask } from "../../api/ask";
import { useDocuments } from "../../api/documents";
import { projectNameById, useProjects } from "../../api/projects";
import type { AskResponse, Department } from "../../api/types";
import { useAuth } from "../../auth/useAuth";
import { AnswerView } from "../../components/balbal/AnswerView";
import { ErrorBox } from "../../components/ErrorBox";
import { Spinner } from "../../components/Spinner";
import { S } from "../../lib/strings";

interface Turn {
  question: string;
  result: AskResponse | null;
  error: unknown;
}

export function Urun1Home({ department, uploadPath }: { department: Department; uploadPath: string | null }) {
  const { user } = useAuth();
  const [turns, setTurns] = useState<Turn[]>([]);
  const [question, setQuestion] = useState("");
  const documents = useDocuments({ department: department.slug });
  const projects = useProjects();
  const projectNames = projectNameById(projects.data);
  const projectOfDocument = (documentId: string): string | null => {
    const doc = documents.data?.find((d) => d.id === documentId);
    return doc?.project_id ? (projectNames.get(doc.project_id) ?? null) : null;
  };

  const mutation = useMutation({
    mutationFn: (q: string) => ask({ question: q, department: department.slug }),
    onSuccess: (data, q) =>
      setTurns((prev) => prev.map((t, i) => (i === prev.length - 1 && t.question === q ? { ...t, result: data } : t))),
    onError: (error, q) =>
      setTurns((prev) => prev.map((t, i) => (i === prev.length - 1 && t.question === q ? { ...t, error } : t))),
  });

  function send(raw: string) {
    const q = raw.trim();
    if (q.length < 3 || mutation.isPending) return;
    setTurns((prev) => [...prev, { question: q, result: null, error: null }]);
    setQuestion("");
    mutation.mutate(q);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    send(question);
  }

  const firstName = (user?.display_name ?? "").split(" ")[0];
  const examples = S.urun1.examples[department.slug as keyof typeof S.urun1.examples] ?? S.urun1.examples.default;

  const bar = (
    <form className={`u1-bar${turns.length ? " compact" : ""}`} onSubmit={onSubmit}>
      <label htmlFor="u1-bar" className="sr-only">
        {S.urun1.barLabel}
      </label>
      <input
        id="u1-bar"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder={turns.length ? S.urun1.placeholderFollow : S.urun1.placeholder}
        autoComplete="off"
      />
      <button type="submit" aria-label={S.urun1.send} disabled={mutation.isPending || question.trim().length < 3}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </form>
  );

  if (turns.length === 0) {
    return (
      <section className="u1-home">
        <span className="agent-mark u1-agent" aria-hidden="true" />
        <h1 className="u1-greeting">{S.urun1.greeting(firstName)}</h1>
        {bar}
        <div className="u1-examples">
          {examples.map((q) => (
            <button type="button" key={q} className="u1-example" onClick={() => send(q)}>
              {q}
            </button>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="u1-home chat">
      <div className="u1-thread">
        <div className="u1-reset">
          <button type="button" className="link-button" onClick={() => setTurns([])}>
            {S.urun1.newQuestion}
          </button>
        </div>
        {turns.map((t, i) => (
          <div key={i} className="u1-turn">
            <div className="u1-question">{t.question}</div>
            {t.result && <AnswerView result={t.result} projectOfDocument={projectOfDocument} uploadPath={uploadPath} />}
            {!t.result && !t.error && <Spinner />}
            {t.error !== null && <ErrorBox error={t.error} />}
          </div>
        ))}
      </div>
      {bar}
    </section>
  );
}

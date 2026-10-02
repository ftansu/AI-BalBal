import { useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";

import { ask } from "../api/ask";
import { useDocuments } from "../api/documents";
import { projectNameById, useProjects } from "../api/projects";
import type { AskResponse, Department } from "../api/types";
import { useHasProduct } from "../auth/useProduct";
import { S } from "../lib/strings";
import { AnswerView } from "./balbal/AnswerView";
import { ErrorBox } from "./ErrorBox";

/** Department "Balbal'a Sor" tab and the /sor page. The backend answers only from documents
 * the user may see (ADR-004); `department` only narrows the scope. There is no project
 * selector: the backend dropped `project_id` from `/api/ask` (Aşama B) and Ü-10 keeps the
 * Balbal window free of project selection — projects are named in the question itself. */
export function AskPanel({ department }: { department?: Department }) {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<AskResponse | null>(null);
  const hasP2 = useHasProduct("P2");
  const documents = useDocuments(department ? { department: department.slug } : {});
  const projects = useProjects();
  const projectNames = projectNameById(projects.data);
  const projectOfDocument = (documentId: string): string | null => {
    const doc = documents.data?.find((d) => d.id === documentId);
    return doc?.project_id ? (projectNames.get(doc.project_id) ?? null) : null;
  };
  const mutation = useMutation({
    mutationFn: (q: string) => ask({ question: q, department: department ? department.slug : undefined }),
    onSuccess: (data) => setResult(data),
  });
  // P1: Excel-based example questions would only trigger the `product_limit` warning (ADR-022).
  const excelOnly: readonly string[] = S.ask.exampleQuestionsP2;
  const examples = hasP2 ? S.ask.exampleQuestions : S.ask.exampleQuestions.filter((q) => !excelOnly.includes(q));

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const q = question.trim();
    if (q.length < 3) return;
    setResult(null);
    mutation.mutate(q);
  }

  return (
    <div>
      <p className="notice">{department ? S.ask.scopeNote(department.name) : S.home.askHint}</p>
      <form className="ask-form" onSubmit={onSubmit}>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={S.ask.placeholder}
          minLength={3}
          maxLength={1000}
          required
        />
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? S.ask.submitting : S.ask.submit}
        </button>
      </form>
      <div className="examples">
        {S.ask.examples}{" "}
        {examples.map((q) => (
          <button type="button" key={q} className="link-button" onClick={() => setQuestion(q)}>
            {q}
          </button>
        ))}
      </div>
      {mutation.isError && <ErrorBox error={mutation.error} />}
      {result && (
        <AnswerView
          result={result}
          projectOfDocument={projectOfDocument}
          uploadPath={department ? `/departman/${department.slug}/yukle` : null}
        />
      )}
    </div>
  );
}

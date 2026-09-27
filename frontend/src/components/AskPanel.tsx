import { useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";

import { ask } from "../api/ask";
import { useDocuments } from "../api/documents";
import { projectNameById, useProjects } from "../api/projects";
import type { AskResponse, Department } from "../api/types";
import { S } from "../lib/strings";
import { AnswerView } from "./balbal/AnswerView";
import { ErrorBox } from "./ErrorBox";

/** Department "Balbal'a Sor" tab and the /sor page. The backend answers only from documents
 * the user may see (ADR-004); `department` and the project chip only narrow the scope. */
export function AskPanel({ department }: { department?: Department }) {
  const [question, setQuestion] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [result, setResult] = useState<AskResponse | null>(null);
  const documents = useDocuments(department ? { department: department.slug } : {});
  const projects = useProjects();
  const projectNames = projectNameById(projects.data);
  const projectOfDocument = (documentId: string): string | null => {
    const doc = documents.data?.find((d) => d.id === documentId);
    return doc?.project_id ? (projectNames.get(doc.project_id) ?? null) : null;
  };
  const scopedProjects = (projects.data ?? []).filter(
    (p) => p.is_active && (!department || p.department_ids.includes(department.id)),
  );

  const mutation = useMutation({
    mutationFn: (q: string) =>
      ask({ question: q, department: department ? department.slug : undefined, project_id: projectId ?? undefined }),
    onSuccess: (data) => setResult(data),
  });

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
      {scopedProjects.length > 0 && (
        <div className="chips">
          <span className="muted small">{S.balbal.project}:</span>
          <button type="button" className={`chip${projectId === null ? " active" : ""}`} onClick={() => setProjectId(null)}>
            {S.balbal.allProjects}
          </button>
          {scopedProjects.map((p) => (
            <button type="button" key={p.id} className={`chip${projectId === p.id ? " active" : ""}`} onClick={() => setProjectId(p.id)}>
              {p.name}
            </button>
          ))}
        </div>
      )}
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
        {S.ask.exampleQuestions.map((q) => (
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

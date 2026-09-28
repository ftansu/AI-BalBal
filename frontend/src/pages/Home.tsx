import { Navigate } from "react-router-dom";

import { useDepartments } from "../api/departments";
import { isPending, useAgenda, type AgendaItem } from "../api/proposed";
import { useAuth } from "../auth/useAuth";
import { useHasProduct } from "../auth/useProduct";
import { FileLink } from "../components/common/FileLink";
import { PendingNotice } from "../components/common/Modal";
import { DepartmentCard } from "../components/DepartmentCard";
import { ErrorBox } from "../components/ErrorBox";
import { useShell } from "../components/shell/ShellContext";
import { Spinner } from "../components/Spinner";
import { formatDate } from "../lib/format";
import { S } from "../lib/strings";
import { childrenOf, visibleTopLevel } from "../lib/visibility";

/** Tasarım kuralı (canvas: "tek kişi = tek departman arayüzü, departman geçişi yok"):
 * yalnızca birden çok departmanı gören (management/admin) kullanıcı departman seçer.
 * Tek departmanlı çalışan doğrudan kendi departmanına yönlenir. */
export function HomePage() {
  const { user } = useAuth();
  const departments = useDepartments();
  const { openBalbal } = useShell();
  if (!user) return null;
  if (departments.isLoading) return <Spinner />;
  if (departments.isError) return <ErrorBox error={departments.error} />;
  const all = departments.data ?? [];
  const visible = visibleTopLevel(user, all);

  // Çalışan: kendi (ana) departmanına. Backend'de "ana departman" alanı yok (BACKEND_GAPS
  // B-09); birden çok üyeliği olan çalışanda (demo "finans" = finans + mali_isler) ilk üyelik
  // ana departman sayılır.
  const home = user.role === "employee" ? visible.find((d) => d.slug === user.department_slugs[0]) : undefined;
  if (home || visible.length === 1) {
    return <Navigate to={`/departman/${(home ?? visible[0]).slug}`} replace />;
  }

  return (
    <>
      <AgendaCard />
      <h1>{S.home.title}</h1>
      {visible.length === 0 ? (
        <p className="muted">{S.home.noDepartments}</p>
      ) : (
        <div className="card-grid">
          {visible.map((d) => (
            <DepartmentCard key={d.id} department={d} children={childrenOf(all, d.id)} />
          ))}
        </div>
      )}
      <section className="card">
        <h2>{S.home.askTitle}</h2>
        <p className="muted">{S.home.askHint}</p>
        <button type="button" onClick={() => openBalbal()}>
          {S.home.askButton}
        </button>
      </section>
    </>
  );
}

const KIND_LABEL: Record<AgendaItem["kind"], string> = {
  approval: "Onayınızı bekliyor",
  opinion_request: "Görüş talebi",
  deadline: "Süre doluyor",
  document_request: "Evrak talebi",
};

/** "Gündeminiz": kişinin takip etmesi gereken profesyonel uyarılar ve işler.
 * Departman sayfasının başında da gösterilir. Backend: BACKEND_GAPS B-01. */
/** Gündem (B-01) Ürün 2'dir: ürün anahtarında P2 kapalıyken hiç gösterilmez ve istek atılmaz (B-25). */
export function AgendaCard() {
  const hasP2 = useHasProduct("P2");
  return hasP2 ? <AgendaCardInner /> : null;
}

function AgendaCardInner() {
  const agenda = useAgenda();
  return (
    <section className="card agenda">
      <h2>{S.home.agendaTitle}</h2>
      {agenda.isLoading && <Spinner />}
      {isPending(agenda.error) && <PendingNotice endpoint="GET /api/me/agenda">{S.home.agendaPending}</PendingNotice>}
      {agenda.isError && !isPending(agenda.error) && <ErrorBox error={agenda.error} />}
      {agenda.data && agenda.data.length === 0 && <p className="muted">{S.home.agendaEmpty}</p>}
      {(agenda.data ?? []).map((item) => (
        <div key={item.id} className="agenda-item">
          <span className={`badge ${item.kind === "deadline" ? "err" : item.kind === "approval" ? "warn" : "neutral"}`}>
            {KIND_LABEL[item.kind]}
          </span>
          <div className="agenda-text">
            <div>{item.title}</div>
            <div className="muted small">
              {item.due_date && `${S.home.due}: ${formatDate(item.due_date)} `}
              {item.document_title && <FileLink documentId={item.document_id} title={item.document_title} />}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

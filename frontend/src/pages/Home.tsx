import { Link, Navigate } from "react-router-dom";

import { useDepartments } from "../api/departments";
import { useAuth } from "../auth/useAuth";
import { DepartmentCard } from "../components/DepartmentCard";
import { ErrorBox } from "../components/ErrorBox";
import { Spinner } from "../components/Spinner";
import { S } from "../lib/strings";
import { childrenOf, visibleTopLevel } from "../lib/visibility";

/** Tasarım kuralı (canvas: "tek kişi = tek departman arayüzü, departman geçişi yok"):
 * yalnızca birden çok departmanı gören (management/admin) kullanıcı departman seçmek
 * zorunda kalır. Tek departmanlı bir çalışan doğrudan kendi departmanına yönlenir. */
export function HomePage() {
  const { user } = useAuth();
  const departments = useDepartments();
  if (!user) return null;
  if (departments.isLoading) return <Spinner />;
  if (departments.isError) return <ErrorBox error={departments.error} />;
  const all = departments.data ?? [];
  const visible = visibleTopLevel(user, all);

  if (visible.length === 1) {
    return <Navigate to={`/departman/${visible[0].slug}`} replace />;
  }

  return (
    <>
      <h1>{S.home.title}</h1>

      {/* Gündem özeti: kişinin takip etmesi gereken profesyonel uyarılar/işler.
       * NOT (varsayım): backend'de bunu besleyecek bir endpoint henüz yok — bu bölüm
       * arayüz iskeleti olarak eklendi, veri kaynağı Naci ile netleştirilmeli. */}
      <section className="card">
        <h2>{S.home.agendaTitle}</h2>
        <p className="muted">{S.home.agendaEmpty}</p>
      </section>

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
        <Link to="/sor" className="button">
          {S.home.askButton}
        </Link>
      </section>
    </>
  );
}

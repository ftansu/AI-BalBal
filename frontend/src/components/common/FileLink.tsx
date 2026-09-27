import { downloadUrl } from "../../api/documents";

/** Sabit kural: arayüzdeki HER dosya referansı tıklanabilir ve indirilebilir olmalı.
 * Bu bileşen dosya adını link olarak, yanında ayrı bir "İndir" linkiyle gösterir.
 * `documentId` yoksa (backend bir dosyanın kimliğini dönmediyse) dosya adı düz metin
 * kalır ve "bağlantı yok" olarak işaretlenir — bu durum backend eksiği olarak raporlanır. */
export function FileLink({
  documentId,
  title,
  showDownload = true,
}: {
  documentId: string | null | undefined;
  title: string;
  showDownload?: boolean;
}) {
  if (!documentId) {
    return (
      <span className="file-link missing" title="Backend bu dosyanın kimliğini dönmedi">
        {title}
      </span>
    );
  }
  const href = downloadUrl(documentId);
  return (
    <span className="file-link">
      <a href={href} target="_blank" rel="noreferrer" className="file-name">
        {title}
      </a>
      {showDownload && (
        <a href={href} download className="file-download">
          <DownloadIcon />
          İndir
        </a>
      )}
    </span>
  );
}

/** Tek başına "İndir" linki — satırın sonunda göstermek için (canvas düzeni). */
export function DownloadLink({ documentId }: { documentId: string | null | undefined }) {
  if (!documentId) return null;
  return (
    <a href={downloadUrl(documentId)} download className="file-download">
      <DownloadIcon />
      İndir
    </a>
  );
}

export function DownloadIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
    </svg>
  );
}

import { useEffect, type ReactNode } from "react";

/** Full-screen dimmed overlay with a centered panel; Escape and backdrop click close it. */
export function Modal({
  label,
  onClose,
  children,
  wide = false,
}: {
  label: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal-panel${wide ? " wide" : ""}`} role="dialog" aria-modal="true" aria-label={label}>
        {children}
      </div>
    </div>
  );
}

export function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="icon-button" aria-label="Kapat" onClick={onClick}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </button>
  );
}

/** Honest placeholder for a feature whose backend endpoint does not exist yet. */
export function PendingNotice({ endpoint, children }: { endpoint: string; children?: ReactNode }) {
  return (
    <div className="pending-notice">
      <strong>Backend bekleniyor.</strong> {children ?? "Bu özelliğin arayüzü hazır; sunucu tarafı henüz yok."}
      <code>{endpoint}</code>
    </div>
  );
}

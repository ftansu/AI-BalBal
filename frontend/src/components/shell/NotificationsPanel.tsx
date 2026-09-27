import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { isPending, markAllNotificationsRead, useNotifications } from "../../api/proposed";
import { S } from "../../lib/strings";
import { FileLink } from "../common/FileLink";
import { CloseButton, PendingNotice } from "../common/Modal";
import { ErrorBox } from "../ErrorBox";
import { useShell } from "./ShellContext";

/** Bildirimler — canvas: Bildirimler.dc.html. "Onayımı bekleyen" sekmesi Ürün 2'nin
 * "AI hazırlar, insan onaylar" ilkesinin görünür yeri. Backend: BACKEND_GAPS B-02. */
export function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const notifications = useNotifications();
  const queryClient = useQueryClient();
  const { openTeam } = useShell();
  const [tab, setTab] = useState<"all" | "approval">("all");
  const items = (notifications.data ?? []).filter((n) => tab === "all" || n.kind === "approval");
  const approvals = (notifications.data ?? []).filter((n) => n.kind === "approval").length;

  async function markAll() {
    await markAllNotificationsRead().catch(() => undefined);
    await queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }

  return (
    <div className="popover notif-panel" role="dialog" aria-label={S.shell.notifications}>
      <div className="popover-head">
        <strong>{S.shell.notifications}</strong>
        <div className="actions" style={{ marginTop: 0 }}>
          <button type="button" className="link-button" onClick={markAll}>
            {S.shell.markAllRead}
          </button>
          <CloseButton onClick={onClose} />
        </div>
      </div>
      <div className="chips popover-tabs">
        <button type="button" className={`chip${tab === "all" ? " active" : ""}`} onClick={() => setTab("all")}>
          {S.shell.all}
        </button>
        <button type="button" className={`chip${tab === "approval" ? " active" : ""}`} onClick={() => setTab("approval")}>
          {S.shell.awaitingApproval} ({approvals})
        </button>
      </div>
      <div className="popover-body">
        {isPending(notifications.error) && (
          <PendingNotice endpoint="GET /api/notifications">{S.shell.notificationsPending}</PendingNotice>
        )}
        {notifications.isError && !isPending(notifications.error) && <ErrorBox error={notifications.error} />}
        {items.map((n) => (
          <div key={n.id} className={`notif-row${n.read ? "" : " unread"}`}>
            <span className={`notif-kind ${n.kind}`} aria-hidden="true" />
            <div className="notif-text">
              <div>{n.text}</div>
              <div className="notif-links">
                <span className="muted small">{new Date(n.created_at).toLocaleString("tr-TR")}</span>
                {n.document_title && <FileLink documentId={n.document_id} title={n.document_title} />}
                {n.chat_id && (
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => {
                      onClose();
                      openTeam();
                    }}
                  >
                    {S.shell.openChat}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

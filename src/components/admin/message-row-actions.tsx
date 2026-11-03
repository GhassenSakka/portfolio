"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { markMessageRead, deleteMessage } from "@/app/admin/actions/message-actions";

export function MessageRowActions({ id, isRead }: { id: string; isRead: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleting, setDeleting] = useState(false);

  function handleToggleRead() {
    startTransition(async () => {
      await markMessageRead(id, !isRead);
      router.refresh();
    });
  }

  async function handleDelete() {
    if (!window.confirm("Supprimer définitivement ce message ?")) return;
    setDeleting(true);
    await deleteMessage(id);
    router.refresh();
    setDeleting(false);
  }

  return (
    <div className="flex shrink-0 items-center gap-1">
      <button
        type="button"
        disabled={isPending}
        onClick={handleToggleRead}
        title={isRead ? "Marquer comme non lu" : "Marquer comme lu"}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
      >
        {isRead ? <Mail size={15} /> : <MailOpen size={15} />}
      </button>
      <button
        type="button"
        disabled={deleting}
        onClick={handleDelete}
        title="Supprimer"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-50"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

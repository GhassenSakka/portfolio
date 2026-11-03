"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUp, ArrowDown, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { deleteEntityItem, toggleVisibility, moveItem } from "@/app/admin/actions/entity-actions";

export function EntityRowActions({
  slug,
  id,
  isVisible,
  isFirst,
  isLast,
  orderable,
  visibilityToggle,
}: {
  slug: string;
  id: string;
  isVisible: boolean;
  isFirst: boolean;
  isLast: boolean;
  orderable: boolean;
  visibilityToggle: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleting, setDeleting] = useState(false);

  function handleMove(direction: "up" | "down") {
    startTransition(async () => {
      await moveItem(slug, id, direction);
      router.refresh();
    });
  }

  function handleToggleVisibility() {
    startTransition(async () => {
      await toggleVisibility(slug, id);
      router.refresh();
    });
  }

  async function handleDelete() {
    if (!window.confirm("Supprimer définitivement cet élément ?")) return;
    setDeleting(true);
    await deleteEntityItem(slug, id);
    router.refresh();
    setDeleting(false);
  }

  return (
    <div className="flex items-center gap-1">
      {orderable ? (
        <>
          <button
            type="button"
            disabled={isFirst || isPending}
            onClick={() => handleMove("up")}
            title="Monter"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30"
          >
            <ArrowUp size={15} />
          </button>
          <button
            type="button"
            disabled={isLast || isPending}
            onClick={() => handleMove("down")}
            title="Descendre"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30"
          >
            <ArrowDown size={15} />
          </button>
        </>
      ) : null}
      {visibilityToggle ? (
        <button
          type="button"
          disabled={isPending}
          onClick={handleToggleVisibility}
          title={isVisible ? "Masquer" : "Afficher"}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
        >
          {isVisible ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>
      ) : null}
      <Link
        href={`/admin/${slug}/${id}`}
        title="Modifier"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-azure-600 hover:bg-azure-50"
      >
        <Pencil size={15} />
      </Link>
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

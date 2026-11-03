import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { getEntityConfig } from "@/lib/admin/entity-config";
import { EntityRowActions } from "@/components/admin/entity-row-actions";

export const dynamic = "force-dynamic";

function displayField(item: Record<string, unknown>, base: string): string {
  const frKey = `${base}Fr`;
  if (typeof item[frKey] === "string" && item[frKey]) return item[frKey] as string;
  if (typeof item[base] === "string") return item[base] as string;
  return "—";
}

export default async function EntityListPage({
  params,
}: {
  params: Promise<{ entity: string }>;
}) {
  const { entity: slug } = await params;
  const config = getEntityConfig(slug);
  if (!config) notFound();

  const db = (prisma as unknown as Record<string, { findMany: (args?: unknown) => Promise<Record<string, unknown>[]> }>)[
    config.model
  ];
  const items = await db.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{config.label}</h1>
          <p className="mt-1 text-sm text-slate-500">{items.length} élément(s)</p>
        </div>
        <Link
          href={`/admin/${slug}/new`}
          className="inline-flex items-center gap-2 rounded-full bg-azure-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-azure-700"
        >
          <Plus size={16} /> Ajouter {config.labelSingular}
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">
          Aucun élément pour le moment. Cliquez sur « Ajouter » pour commencer.
        </p>
      ) : (
        <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {items.map((item, idx) => {
            const title = displayField(item, config.listTitleField);
            const subtitle = config.listSubtitleField
              ? displayField(item, config.listSubtitleField)
              : null;
            return (
              <div key={String(item.id)} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {title}
                    {!item.isVisible ? (
                      <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
                        Masqué
                      </span>
                    ) : null}
                  </p>
                  {subtitle ? <p className="truncate text-sm text-slate-500">{subtitle}</p> : null}
                </div>
                <EntityRowActions
                  slug={slug}
                  id={String(item.id)}
                  isVisible={Boolean(item.isVisible)}
                  isFirst={idx === 0}
                  isLast={idx === items.length - 1}
                  orderable={config.orderable}
                  visibilityToggle={config.visibilityToggle}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

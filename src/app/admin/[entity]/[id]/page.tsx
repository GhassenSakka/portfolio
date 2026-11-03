import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { getEntityConfig } from "@/lib/admin/entity-config";
import { EntityForm } from "@/components/admin/entity-form";

export default async function EditEntityPage({
  params,
}: {
  params: Promise<{ entity: string; id: string }>;
}) {
  const { entity: slug, id } = await params;
  const config = getEntityConfig(slug);
  if (!config) notFound();

  const db = (prisma as unknown as Record<string, { findUnique: (args: unknown) => Promise<Record<string, unknown> | null> }>)[
    config.model
  ];
  const item = await db.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href={`/admin/${slug}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-azure-700"
      >
        <ArrowLeft size={15} /> Retour à la liste
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Modifier {config.labelSingular}</h1>
      <EntityForm config={config} id={id} initialData={item} />
    </div>
  );
}

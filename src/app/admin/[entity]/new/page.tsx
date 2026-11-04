import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getEntityConfig } from "@/lib/admin/entity-config";
import { EntityForm } from "@/components/admin/entity-form";

export default async function NewEntityPage({
  params,
}: {
  params: Promise<{ entity: string }>;
}) {
  const { entity: slug } = await params;
  const config = getEntityConfig(slug);
  if (!config || config.fixedRows) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href={`/admin/${slug}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-azure-700"
      >
        <ArrowLeft size={15} /> Retour à la liste
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Ajouter {config.labelSingular}</h1>
      <EntityForm config={config} id={null} initialData={null} />
    </div>
  );
}

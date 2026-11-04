import { prisma } from "@/lib/db";
import { TextsForm } from "@/components/admin/texts-form";

export const dynamic = "force-dynamic";

export default async function AdminTextsPage() {
  const texts = await prisma.uiText.findMany({ orderBy: [{ namespace: "asc" }, { key: "asc" }] });

  const groups = new Map<string, typeof texts>();
  for (const text of texts) {
    const list = groups.get(text.namespace) ?? [];
    list.push(text);
    groups.set(text.namespace, list);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Textes de l&apos;interface</h1>
      <p className="mb-6 text-sm text-slate-500">
        Tous les textes fixes affichés sur le site public (navigation, titres de section,
        libellés de boutons, messages…), en français et en anglais. Les descriptions et contenus
        propres à chaque élément (projets, certifications…) se modifient depuis leur propre
        section du back-office.
      </p>
      <TextsForm groups={Array.from(groups.entries())} />
    </div>
  );
}

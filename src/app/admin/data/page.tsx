import { DataTools } from "@/components/admin/data-tools";

export default function AdminDataPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Export / Import</h1>
      <p className="mb-6 text-sm text-slate-500">
        Sauvegardez ou restaurez l&apos;ensemble du contenu du site sous forme de fichier JSON.
      </p>
      <DataTools />
    </div>
  );
}

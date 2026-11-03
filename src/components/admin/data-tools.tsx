"use client";

import { useState, useTransition } from "react";
import { Download, Upload } from "lucide-react";
import { exportAllData, importAllData, type ImportResult } from "@/app/admin/actions/data-actions";

export function DataTools() {
  const [isExporting, startExportTransition] = useTransition();
  const [isImporting, startImportTransition] = useTransition();
  const [importState, setImportState] = useState<ImportResult | null>(null);

  function handleExport() {
    startExportTransition(async () => {
      const json = await exportAllData();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const date = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `portfolio-export-${date}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }

  function handleImport(formData: FormData) {
    startImportTransition(async () => {
      const result = await importAllData(formData);
      setImportState(result);
    });
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Exporter le contenu</h2>
        <p className="mt-1 text-sm text-slate-500">
          Télécharge un fichier JSON contenant tout le contenu éditable du site (profil + toutes les
          sections). Les messages de contact et le compte admin ne sont pas inclus.
        </p>
        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-azure-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-azure-700 disabled:opacity-60"
        >
          <Download size={16} /> {isExporting ? "Export en cours…" : "Exporter (JSON)"}
        </button>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="text-lg font-semibold text-slate-900">Importer / restaurer le contenu</h2>
        <p className="mt-1 text-sm text-slate-700">
          ⚠️ L&apos;import remplace tout le contenu existant des sections concernées par celui du
          fichier choisi. Cette action est irréversible — exportez d&apos;abord une sauvegarde si besoin.
        </p>
        <form action={handleImport} className="mt-4 flex flex-wrap items-center gap-3">
          <input
            type="file"
            name="file"
            accept="application/json"
            required
            className="block text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-3.5 file:py-2 file:text-sm file:font-semibold file:text-azure-700 hover:file:bg-azure-50"
          />
          <button
            type="submit"
            disabled={isImporting}
            className="inline-flex items-center gap-2 rounded-full border border-amber-400 bg-white px-5 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-100 disabled:opacity-60"
          >
            <Upload size={16} /> {isImporting ? "Import en cours…" : "Importer (JSON)"}
          </button>
        </form>
        {importState ? (
          <p
            className={`mt-3 text-sm font-medium ${
              importState.status === "success" ? "text-emerald-700" : "text-red-700"
            }`}
          >
            {importState.message}
          </p>
        ) : null}
      </div>
    </div>
  );
}

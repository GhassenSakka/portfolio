"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Save, Trash2, FileText } from "lucide-react";
import type { EntityConfig, FieldConfig } from "@/lib/admin/entity-config";
import { saveEntityItem, deleteEntityItem, type EntityFormState } from "@/app/admin/actions/entity-actions";
import { decodeJsonList } from "@/lib/json-fields";

const initialState: EntityFormState = { status: "idle" };

function toDateInputValue(value: unknown): string {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-azure-500";

export function EntityForm({
  config,
  id,
  initialData,
}: {
  config: EntityConfig;
  id: string | null;
  initialData: Record<string, unknown> | null;
}) {
  const router = useRouter();
  const boundSave = saveEntityItem.bind(null, config.slug, id);
  const [state, formAction, isPending] = useActionState(boundSave, initialState);
  const [activeTab, setActiveTab] = useState<"fr" | "en">("fr");
  const [deleting, setDeleting] = useState(false);

  const hasBilingualFields = config.fields.some(
    (f) => f.type === "bilingual-text" || f.type === "bilingual-textarea"
  );

  async function handleDelete() {
    if (!id) return;
    if (!window.confirm("Supprimer définitivement cet élément ? Cette action est irréversible.")) return;
    setDeleting(true);
    try {
      await deleteEntityItem(config.slug, id);
      router.push(`/admin/${config.slug}`);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <form action={formAction} className="space-y-6">
      {hasBilingualFields ? (
        <div className="inline-flex rounded-full border border-slate-200 bg-white p-1">
          <button
            type="button"
            onClick={() => setActiveTab("fr")}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              activeTab === "fr" ? "bg-azure-600 text-white" : "text-slate-500"
            }`}
          >
            Français
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("en")}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              activeTab === "en" ? "bg-azure-600 text-white" : "text-slate-500"
            }`}
          >
            English
          </button>
        </div>
      ) : null}

      {hasBilingualFields ? (
        <>
          <div className={activeTab === "fr" ? "space-y-5" : "hidden"}>
            {config.fields
              .filter((f) => f.type === "bilingual-text" || f.type === "bilingual-textarea")
              .map((field) => (
                <BilingualFieldInput
                  key={`${field.name}Fr`}
                  field={field}
                  lang="Fr"
                  initialData={initialData}
                  error={state.errors?.[`${field.name}Fr`]}
                />
              ))}
          </div>
          <div className={activeTab === "en" ? "space-y-5" : "hidden"}>
            {config.fields
              .filter((f) => f.type === "bilingual-text" || f.type === "bilingual-textarea")
              .map((field) => (
                <BilingualFieldInput
                  key={`${field.name}En`}
                  field={field}
                  lang="En"
                  initialData={initialData}
                  error={state.errors?.[`${field.name}En`]}
                />
              ))}
          </div>
        </>
      ) : null}

      <div className="space-y-5 border-t border-slate-200 pt-5">
        {config.fields
          .filter((f) => f.type !== "bilingual-text" && f.type !== "bilingual-textarea")
          .map((field) => (
            <SimpleFieldInput
              key={field.name}
              field={field}
              initialData={initialData}
              error={state.errors?.[field.name]}
            />
          ))}
      </div>

      {state.status === "error" && state.message ? (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.message}
        </p>
      ) : null}

      <div className="flex items-center justify-between border-t border-slate-200 pt-5">
        <div>
          {id && !config.fixedRows ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              <Trash2 size={15} /> {deleting ? "Suppression…" : "Supprimer"}
            </button>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-full bg-azure-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-azure-700 disabled:opacity-60"
        >
          <Save size={16} /> {isPending ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}

function BilingualFieldInput({
  field,
  lang,
  initialData,
  error,
}: {
  field: FieldConfig;
  lang: "Fr" | "En";
  initialData: Record<string, unknown> | null;
  error?: string;
}) {
  const key = `${field.name}${lang}`;
  const initialValue = initialData?.[key];
  const label = `${field.label} (${lang === "Fr" ? "Français" : "English"})`;

  return (
    <div>
      <label htmlFor={key} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
        {field.required ? <span className="text-red-500"> *</span> : null}
      </label>
      {field.type === "bilingual-textarea" ? (
        <textarea
          id={key}
          name={key}
          rows={4}
          defaultValue={typeof initialValue === "string" ? initialValue : ""}
          className={inputClass}
        />
      ) : (
        <input
          id={key}
          name={key}
          type="text"
          defaultValue={typeof initialValue === "string" ? initialValue : ""}
          className={inputClass}
        />
      )}
      {field.helpText ? <p className="mt-1 text-xs text-slate-400">{field.helpText}</p> : null}
      {error ? <p className="mt-1 text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
}

function SimpleFieldInput({
  field,
  initialData,
  error,
}: {
  field: FieldConfig;
  initialData: Record<string, unknown> | null;
  error?: string;
}) {
  const initialValue = initialData?.[field.name];

  if (field.type === "boolean") {
    // `isVisible` est à `true` par défaut en base : pour un nouvel élément
    // (initialData === null), la case doit donc être cochée d'emblée, sinon
    // l'élément serait créé masqué sans que l'admin ne l'ait demandé.
    const defaultChecked =
      initialData === null && field.name === "isVisible" ? true : Boolean(initialValue);
    return (
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          name={field.name}
          defaultChecked={defaultChecked}
          className="h-4 w-4 rounded border-slate-300"
        />
        {field.label}
      </label>
    );
  }

  if (field.type === "image" || field.type === "document") {
    const currentUrl = typeof initialValue === "string" ? initialValue : "";
    return (
      <div>
        <label htmlFor={field.name} className="mb-1 block text-sm font-medium text-slate-700">
          {field.label}
        </label>
        {currentUrl ? (
          <div className="mb-2 flex items-center gap-3">
            {field.type === "image" ? (
              <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-slate-200">
                <Image src={currentUrl} alt="" fill className="object-cover" sizes="64px" />
              </div>
            ) : (
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-azure-700 hover:underline"
              >
                <FileText size={15} /> Fichier actuel
              </a>
            )}
            <label className="flex items-center gap-1.5 text-xs text-slate-500">
              <input type="checkbox" name={`${field.name}_remove`} className="h-3.5 w-3.5" />
              Supprimer
            </label>
          </div>
        ) : null}
        <input type="hidden" name={`${field.name}_current`} value={currentUrl} />
        <input
          id={field.name}
          name={field.name}
          type="file"
          accept={field.type === "image" ? "image/jpeg,image/png,image/webp,image/gif,image/svg+xml" : "application/pdf"}
          className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-azure-50 file:px-3.5 file:py-2 file:text-sm file:font-semibold file:text-azure-700 hover:file:bg-azure-100"
        />
        {field.helpText ? <p className="mt-1 text-xs text-slate-400">{field.helpText}</p> : null}
        {error ? <p className="mt-1 text-xs font-medium text-red-600">{error}</p> : null}
      </div>
    );
  }

  if (field.type === "image-list") {
    const maxItems = field.maxItems ?? 4;
    const currentUrls = decodeJsonList(typeof initialValue === "string" ? initialValue : "");
    return (
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">{field.label}</label>
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: maxItems }).map((_, i) => {
            const currentUrl = currentUrls[i] ?? "";
            const slotName = `${field.name}_${i}`;
            return (
              <div key={slotName} className="rounded-lg border border-slate-200 p-3">
                <p className="mb-2 text-xs font-semibold text-slate-500">
                  Photo {i + 1}
                  {i === 0 ? " (couverture)" : ""}
                </p>
                {currentUrl ? (
                  <div className="mb-2 flex items-center gap-3">
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-slate-200">
                      <Image src={currentUrl} alt="" fill className="object-cover" sizes="64px" />
                    </div>
                    <label className="flex items-center gap-1.5 text-xs text-slate-500">
                      <input type="checkbox" name={`${slotName}_remove`} className="h-3.5 w-3.5" />
                      Supprimer
                    </label>
                  </div>
                ) : null}
                <input type="hidden" name={`${slotName}_current`} value={currentUrl} />
                <input
                  id={slotName}
                  name={slotName}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                  className="block w-full text-xs text-slate-600 file:mr-2 file:rounded-full file:border-0 file:bg-azure-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-azure-700 hover:file:bg-azure-100"
                />
              </div>
            );
          })}
        </div>
        {field.helpText ? <p className="mt-2 text-xs text-slate-400">{field.helpText}</p> : null}
        {error ? <p className="mt-1 text-xs font-medium text-red-600">{error}</p> : null}
      </div>
    );
  }

  if (field.type === "select") {
    const initialStr = typeof initialValue === "string" ? initialValue : "";
    const options = field.options ?? [];
    return (
      <div>
        <label htmlFor={field.name} className="mb-1 block text-sm font-medium text-slate-700">
          {field.label}
        </label>
        <select
          id={field.name}
          name={field.name}
          defaultValue={initialStr || options[0]?.value}
          className={inputClass}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {field.helpText ? <p className="mt-1 text-xs text-slate-400">{field.helpText}</p> : null}
        {error ? <p className="mt-1 text-xs font-medium text-red-600">{error}</p> : null}
      </div>
    );
  }

  if (field.type === "string-list") {
    const lines = decodeJsonList(typeof initialValue === "string" ? initialValue : "").join("\n");
    return (
      <div>
        <label htmlFor={`${field.name}_text`} className="mb-1 block text-sm font-medium text-slate-700">
          {field.label}
        </label>
        <textarea
          id={`${field.name}_text`}
          name={`${field.name}_text`}
          rows={3}
          defaultValue={lines}
          placeholder="https://www.instagram.com/p/..."
          className={inputClass}
        />
        {field.helpText ? <p className="mt-1 text-xs text-slate-400">{field.helpText}</p> : null}
      </div>
    );
  }

  if (field.type === "date") {
    return (
      <div>
        <label htmlFor={field.name} className="mb-1 block text-sm font-medium text-slate-700">
          {field.label}
        </label>
        <input
          id={field.name}
          name={field.name}
          type="date"
          defaultValue={toDateInputValue(initialValue)}
          className={inputClass}
        />
        {error ? <p className="mt-1 text-xs font-medium text-red-600">{error}</p> : null}
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div>
        <label htmlFor={field.name} className="mb-1 block text-sm font-medium text-slate-700">
          {field.label}
          {field.required ? <span className="text-red-500"> *</span> : null}
        </label>
        <textarea
          id={field.name}
          name={field.name}
          rows={4}
          dir="auto"
          defaultValue={typeof initialValue === "string" ? initialValue : ""}
          className={inputClass}
        />
        {field.helpText ? <p className="mt-1 text-xs text-slate-400">{field.helpText}</p> : null}
        {error ? <p className="mt-1 text-xs font-medium text-red-600">{error}</p> : null}
      </div>
    );
  }

  // text / url
  return (
    <div>
      <label htmlFor={field.name} className="mb-1 block text-sm font-medium text-slate-700">
        {field.label}
        {field.required ? <span className="text-red-500"> *</span> : null}
      </label>
      <input
        id={field.name}
        name={field.name}
        type={field.type === "url" ? "text" : "text"}
        placeholder={field.type === "url" ? "https://..." : field.placeholder}
        defaultValue={typeof initialValue === "string" ? initialValue : ""}
        className={inputClass}
      />
      {field.helpText ? <p className="mt-1 text-xs text-slate-400">{field.helpText}</p> : null}
      {error ? <p className="mt-1 text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
}

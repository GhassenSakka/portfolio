"use client";

import { useActionState } from "react";
import { Save, Languages } from "lucide-react";
import { saveUiTexts, type TextsFormState } from "@/app/admin/actions/text-actions";
import type { UiText } from "@prisma/client";

const initialState: TextsFormState = { status: "idle" };

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-azure-500";

/** Transforme le dernier segment d'une clé en libellé lisible (ex. "ctaCv" -> "Cta Cv"). */
function prettifyKey(key: string): string {
  const lastSegment = key.split(".").pop() ?? key;
  return lastSegment
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}

export function TextsForm({ groups }: { groups: Array<[string, UiText[]]> }) {
  const [state, formAction, isPending] = useActionState(saveUiTexts, initialState);

  return (
    <form action={formAction} className="space-y-8">
      {groups.map(([namespace, texts]) => (
        <fieldset key={namespace} className="rounded-xl border border-slate-200 bg-white p-5">
          <legend className="flex items-center gap-1.5 px-1 text-sm font-bold text-azure-700">
            <Languages size={15} /> {namespace}
          </legend>
          <div className="mt-3 divide-y divide-slate-100">
            {texts.map((text) => (
              <div key={text.key} className="grid gap-3 py-3 sm:grid-cols-[1fr_1.5fr_1.5fr] sm:items-start">
                <input type="hidden" name="__key" value={text.key} />
                <div>
                  <p className="text-sm font-medium text-slate-700">{prettifyKey(text.key)}</p>
                  <p className="font-mono text-xs text-slate-400">{text.key}</p>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-400">FR</label>
                  <textarea
                    name={`fr__${text.key}`}
                    defaultValue={text.valueFr}
                    rows={2}
                    dir="auto"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-400">EN</label>
                  <textarea
                    name={`en__${text.key}`}
                    defaultValue={text.valueEn}
                    rows={2}
                    dir="auto"
                    className={inputClass}
                  />
                </div>
              </div>
            ))}
          </div>
        </fieldset>
      ))}

      {state.status === "success" ? (
        <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {state.message}
        </p>
      ) : null}
      {state.status === "error" && state.message ? (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.message}
        </p>
      ) : null}

      <div className="sticky bottom-4 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-full bg-azure-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-azure-700 disabled:opacity-60"
        >
          <Save size={16} /> {isPending ? "Enregistrement…" : "Tout enregistrer"}
        </button>
      </div>
    </form>
  );
}

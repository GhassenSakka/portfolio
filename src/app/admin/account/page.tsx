"use client";

import { useActionState } from "react";
import { KeyRound } from "lucide-react";
import { changePasswordAction, type ChangePasswordState } from "@/app/admin/actions/auth-actions";

const initialState: ChangePasswordState = { status: "idle" };

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-azure-500";

export default function AdminAccountPage() {
  const [state, formAction, isPending] = useActionState(changePasswordAction, initialState);

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Mon compte</h1>
      <p className="mb-6 text-sm text-slate-500">Changer le mot de passe administrateur.</p>

      <form action={formAction} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <div>
          <label htmlFor="currentPassword" className="mb-1 block text-sm font-medium text-slate-700">
            Mot de passe actuel
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            required
            autoComplete="current-password"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="mb-1 block text-sm font-medium text-slate-700">
            Nouveau mot de passe
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-slate-700">
            Confirmer le nouveau mot de passe
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className={inputClass}
          />
        </div>

        {state.status === "success" ? (
          <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {state.message}
          </p>
        ) : null}
        {state.status === "error" ? (
          <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {state.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-full bg-azure-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-azure-700 disabled:opacity-60"
        >
          <KeyRound size={16} /> {isPending ? "Mise à jour…" : "Mettre à jour le mot de passe"}
        </button>
      </form>
    </div>
  );
}

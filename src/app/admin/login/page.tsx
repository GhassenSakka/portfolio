"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { loginAction, type LoginFormState } from "@/app/admin/actions/auth-actions";

const initialState: LoginFormState = { status: "idle" };

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-azure-600 text-white">
          <LogIn size={20} />
        </div>
        <h1 className="text-lg font-bold text-slate-900">Back-office — Ghassen SAKKA</h1>
        <p className="mt-1 text-sm text-slate-500">Connectez-vous pour gérer le contenu du site.</p>
      </div>

      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="username"
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-azure-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-azure-500"
          />
        </div>

        {state.status === "error" ? (
          <p role="alert" className="text-sm font-medium text-red-600">
            {state.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-full bg-azure-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-azure-700 disabled:opacity-60"
        >
          {isPending ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}

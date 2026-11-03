"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { Save, FileText } from "lucide-react";
import { saveProfile, type ProfileFormState } from "@/app/admin/actions/profile-actions";
import type { Profile } from "@prisma/client";

const initialState: ProfileFormState = { status: "idle" };

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-azure-500";

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const [state, formAction, isPending] = useActionState(saveProfile, initialState);
  const [activeTab, setActiveTab] = useState<"fr" | "en">("fr");

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-slate-700">
          Nom complet
        </label>
        <input
          id="fullName"
          name="fullName"
          defaultValue={profile?.fullName ?? "Ghassen SAKKA"}
          className={inputClass}
        />
        {state.errors?.fullName ? (
          <p className="mt-1 text-xs font-medium text-red-600">{state.errors.fullName}</p>
        ) : null}
      </div>

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

      <div className={activeTab === "fr" ? "space-y-5" : "hidden"}>
        <div>
          <label htmlFor="titleFr" className="mb-1 block text-sm font-medium text-slate-700">
            Titre / accroche (FR)
          </label>
          <input id="titleFr" name="titleFr" defaultValue={profile?.titleFr ?? ""} className={inputClass} />
          {state.errors?.titleFr ? (
            <p className="mt-1 text-xs font-medium text-red-600">{state.errors.titleFr}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="bannerFr" className="mb-1 block text-sm font-medium text-slate-700">
            Bandeau (ex. annonce de diplôme) — FR
          </label>
          <input id="bannerFr" name="bannerFr" defaultValue={profile?.bannerFr ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="aboutFr" className="mb-1 block text-sm font-medium text-slate-700">
            À propos (FR)
          </label>
          <textarea
            id="aboutFr"
            name="aboutFr"
            rows={6}
            defaultValue={profile?.aboutFr ?? ""}
            className={inputClass}
          />
          {state.errors?.aboutFr ? (
            <p className="mt-1 text-xs font-medium text-red-600">{state.errors.aboutFr}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="partnerNoteFr" className="mb-1 block text-sm font-medium text-slate-700">
            Mention partenariat (ex. « Je travaille avec un partenaire Microsoft ») — FR
          </label>
          <input
            id="partnerNoteFr"
            name="partnerNoteFr"
            defaultValue={profile?.partnerNoteFr ?? ""}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-slate-400">
            Laisser vide pour ne rien afficher. Affiché en petit badge dans l&apos;en-tête du site.
          </p>
        </div>
      </div>

      <div className={activeTab === "en" ? "space-y-5" : "hidden"}>
        <div>
          <label htmlFor="titleEn" className="mb-1 block text-sm font-medium text-slate-700">
            Titre / accroche (EN)
          </label>
          <input id="titleEn" name="titleEn" defaultValue={profile?.titleEn ?? ""} className={inputClass} />
          {state.errors?.titleEn ? (
            <p className="mt-1 text-xs font-medium text-red-600">{state.errors.titleEn}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="bannerEn" className="mb-1 block text-sm font-medium text-slate-700">
            Bandeau (ex. annonce de diplôme) — EN
          </label>
          <input id="bannerEn" name="bannerEn" defaultValue={profile?.bannerEn ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="aboutEn" className="mb-1 block text-sm font-medium text-slate-700">
            About (EN)
          </label>
          <textarea
            id="aboutEn"
            name="aboutEn"
            rows={6}
            defaultValue={profile?.aboutEn ?? ""}
            className={inputClass}
          />
          {state.errors?.aboutEn ? (
            <p className="mt-1 text-xs font-medium text-red-600">{state.errors.aboutEn}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="partnerNoteEn" className="mb-1 block text-sm font-medium text-slate-700">
            Partnership mention (e.g. &quot;I work with a Microsoft partner&quot;) — EN
          </label>
          <input
            id="partnerNoteEn"
            name="partnerNoteEn"
            defaultValue={profile?.partnerNoteEn ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-5 border-t border-slate-200 pt-5 sm:grid-cols-2">
        <div>
          <label htmlFor="location" className="mb-1 block text-sm font-medium text-slate-700">
            Localisation
          </label>
          <input id="location" name="location" defaultValue={profile?.location ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="linkedinUrl" className="mb-1 block text-sm font-medium text-slate-700">
            URL LinkedIn
          </label>
          <input
            id="linkedinUrl"
            name="linkedinUrl"
            defaultValue={profile?.linkedinUrl ?? ""}
            placeholder="https://linkedin.com/in/..."
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email1" className="mb-1 block text-sm font-medium text-slate-700">
            Email principal
          </label>
          <input id="email1" name="email1" defaultValue={profile?.email1 ?? ""} className={inputClass} />
          {state.errors?.email1 ? (
            <p className="mt-1 text-xs font-medium text-red-600">{state.errors.email1}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="email2" className="mb-1 block text-sm font-medium text-slate-700">
            Email secondaire
          </label>
          <input id="email2" name="email2" defaultValue={profile?.email2 ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone1" className="mb-1 block text-sm font-medium text-slate-700">
            Téléphone principal
          </label>
          <input id="phone1" name="phone1" defaultValue={profile?.phone1 ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone2" className="mb-1 block text-sm font-medium text-slate-700">
            Téléphone secondaire
          </label>
          <input id="phone2" name="phone2" defaultValue={profile?.phone2 ?? ""} className={inputClass} />
        </div>
      </div>

      <div className="grid gap-5 border-t border-slate-200 pt-5 sm:grid-cols-2">
        <div>
          <label htmlFor="photoUrl" className="mb-1 block text-sm font-medium text-slate-700">
            Photo de profil
          </label>
          {profile?.photoUrl ? (
            <div className="mb-2 flex items-center gap-3">
              <div className="relative h-16 w-16 overflow-hidden rounded-full border border-slate-200">
                <Image src={profile.photoUrl} alt="" fill className="object-cover" sizes="64px" />
              </div>
              <label className="flex items-center gap-1.5 text-xs text-slate-500">
                <input type="checkbox" name="photoUrl_remove" className="h-3.5 w-3.5" /> Supprimer
              </label>
            </div>
          ) : null}
          <input type="hidden" name="photoUrl_current" value={profile?.photoUrl ?? ""} />
          <input
            id="photoUrl"
            name="photoUrl"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-azure-50 file:px-3.5 file:py-2 file:text-sm file:font-semibold file:text-azure-700 hover:file:bg-azure-100"
          />
        </div>
        <div>
          <label htmlFor="cvUrl" className="mb-1 block text-sm font-medium text-slate-700">
            CV (PDF)
          </label>
          {profile?.cvUrl ? (
            <div className="mb-2 flex items-center gap-3">
              <a
                href={profile.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-azure-700 hover:underline"
              >
                <FileText size={15} /> CV actuel
              </a>
              <label className="flex items-center gap-1.5 text-xs text-slate-500">
                <input type="checkbox" name="cvUrl_remove" className="h-3.5 w-3.5" /> Supprimer
              </label>
            </div>
          ) : null}
          <input type="hidden" name="cvUrl_current" value={profile?.cvUrl ?? ""} />
          <input
            id="cvUrl"
            name="cvUrl"
            type="file"
            accept="application/pdf"
            className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-azure-50 file:px-3.5 file:py-2 file:text-sm file:font-semibold file:text-azure-700 hover:file:bg-azure-100"
          />
        </div>
      </div>

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

      <div className="flex justify-end border-t border-slate-200 pt-5">
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

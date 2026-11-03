"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { submitContactMessage, type ContactFormState } from "@/app/actions/contact";

const initialState: ContactFormState = { status: "idle" };

const inputClass =
  "w-full rounded-lg border border-surface-border bg-background px-3.5 py-2.5 text-sm text-foreground transition-colors focus:border-azure-500";

export function ContactForm() {
  const t = useTranslations("Contact");
  const [state, formAction, isPending] = useActionState(
    submitContactMessage,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {/* Honeypot anti-spam : champ invisible que seuls les robots remplissent. */}
      <div className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-foreground">
          {t("name")}
        </label>
        <input id="name" name="name" required minLength={2} maxLength={100} className={inputClass} />
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-foreground">
          {t("email")}
        </label>
        <input id="email" name="email" type="email" required maxLength={200} className={inputClass} />
      </div>

      <div>
        <label htmlFor="subject" className="mb-1 block text-sm font-medium text-foreground">
          {t("subject")}
        </label>
        <input id="subject" name="subject" maxLength={200} className={inputClass} />
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-foreground">
          {t("message")}
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-full bg-azure-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-azure-700 disabled:opacity-60"
      >
        {isPending ? t("sending") : t("send")}
      </button>

      {state.status === "success" ? (
        <p role="status" className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
          {t("success")}
        </p>
      ) : null}
      {state.status === "rate-limited" ? (
        <p role="alert" className="text-sm font-medium text-amber-600 dark:text-amber-400">
          {t("rateLimited")}
        </p>
      ) : null}
      {state.status === "validation-error" || state.status === "error" ? (
        <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">
          {state.message || t("error")}
        </p>
      ) : null}
    </form>
  );
}

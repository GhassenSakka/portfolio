"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useTransition } from "react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Language");
  const [isPending, startTransition] = useTransition();

  function switchTo(nextLocale: string) {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <div
      className="flex items-center gap-0.5 rounded-full border border-surface-border bg-surface p-0.5 text-xs font-semibold"
      role="group"
      aria-label={t("switchTo")}
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          disabled={isPending}
          aria-current={l === locale ? "true" : undefined}
          className={`rounded-full px-2.5 py-1 uppercase transition-colors ${
            l === locale
              ? "bg-azure-600 text-white"
              : "text-foreground/70 hover:bg-azure-50 dark:hover:bg-azure-950/40"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

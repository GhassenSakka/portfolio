"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X, Download } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LinkedinIcon } from "@/components/brand-icons";

interface HeaderClientProps {
  fullName: string;
  cvUrl: string | null;
  linkedinUrl: string | null;
}

const NAV_ITEMS = [
  { hash: "#hero", key: "home" },
  { hash: "#about", key: "about" },
  { hash: "#experience", key: "experience" },
  { hash: "#projects", key: "projects" },
  { hash: "#migration", key: "migration" },
  { hash: "#certifications", key: "certifications" },
  { hash: "#education", key: "education" },
  { hash: "#associative", key: "associative" },
  { hash: "#interests", key: "interests" },
  { hash: "#contact", key: "contact" },
] as const;

export function HeaderClient({ fullName, cvUrl, linkedinUrl }: HeaderClientProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Nav");

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a
          href="#hero"
          className="shrink-0 text-base font-bold tracking-tight text-azure-700 dark:text-azure-300"
        >
          {fullName}
        </a>

        <nav className="hidden flex-1 items-center justify-center gap-5 lg:flex" aria-label="Main">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.key}
              href={item.hash}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-azure-600 dark:hover:text-azure-300"
            >
              {t(item.key)}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {linkedinUrl ? (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-surface-border bg-surface text-foreground transition-colors hover:bg-azure-50 dark:hover:bg-azure-950/40"
            >
              <LinkedinIcon size={18} />
            </a>
          ) : null}
          <LanguageSwitcher />
          <ThemeToggle />
          {cvUrl ? (
            <a
              href={cvUrl}
              download
              className="inline-flex items-center gap-1.5 rounded-full bg-azure-600 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-azure-700"
            >
              <Download size={16} />
              {t("downloadCv")}
            </a>
          ) : null}
        </div>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-surface-border bg-surface text-foreground lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-surface-border bg-background px-4 pb-4 lg:hidden">
          <nav className="flex flex-col gap-1 pt-2" aria-label="Mobile">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.key}
                href={item.hash}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm font-medium text-foreground/80 hover:bg-azure-50 dark:hover:bg-azure-950/40"
              >
                {t(item.key)}
              </a>
            ))}
          </nav>
          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
              {linkedinUrl ? (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-surface-border bg-surface text-foreground"
                >
                  <LinkedinIcon size={18} />
                </a>
              ) : null}
            </div>
            {cvUrl ? (
              <a
                href={cvUrl}
                download
                className="inline-flex items-center gap-1.5 rounded-full bg-azure-600 px-3.5 py-2 text-sm font-semibold text-white"
              >
                <Download size={16} />
                {t("downloadCv")}
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}

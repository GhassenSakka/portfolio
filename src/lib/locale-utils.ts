import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";

/**
 * Sélectionne le champ `${field}Fr` ou `${field}En` d'un objet selon la langue.
 * Exemple : pickText(experience, "company", "en") -> experience.companyEn
 */
export function pickText<T extends Record<string, unknown>>(
  item: T,
  field: string,
  locale: string
): string {
  const suffix = locale === "fr" ? "Fr" : "En";
  const key = `${field}${suffix}`;
  const value = item[key];
  return typeof value === "string" ? value : "";
}

export function formatMonthYear(date: Date | string | null, locale: string): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "MMM yyyy", { locale: locale === "fr" ? fr : enUS });
}

export function formatDateRange(
  start: Date | string | null,
  end: Date | string | null,
  isCurrent: boolean,
  locale: string,
  presentLabel: string
): string {
  const startLabel = start ? formatMonthYear(start, locale) : "";
  const endLabel = isCurrent ? presentLabel : end ? formatMonthYear(end, locale) : "";
  if (!startLabel && !endLabel) return "";
  if (!endLabel) return startLabel;
  return `${startLabel} – ${endLabel}`;
}

/** Transforme un texte multi-lignes (un point par ligne) en tableau pour un rendu en liste à puces. */
export function toBulletList(text: string | null | undefined): string[] {
  if (!text) return [];
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

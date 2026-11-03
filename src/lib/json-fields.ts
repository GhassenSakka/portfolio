/**
 * Les connecteurs SQLite de Prisma ne supportent pas les listes natives
 * (String[]). Les champs de type liste (ex. liens Instagram) sont donc
 * stockés en base comme une chaîne JSON et (dé)sérialisés ici, de façon
 * identique quel que soit le provider (SQLite ou PostgreSQL).
 */

export function encodeJsonList(items: string[]): string {
  return JSON.stringify(items.filter((item) => item.trim().length > 0));
}

export function decodeJsonList(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string");
    }
    return [];
  } catch {
    return [];
  }
}

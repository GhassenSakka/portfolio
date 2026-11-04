import "server-only";
import { prisma } from "@/lib/db";

/**
 * Fusionne les textes d'interface stockés en base (table UiText, éditables
 * depuis le back-office) par-dessus les messages next-intl statiques
 * (messages/fr.json, messages/en.json) qui servent de valeur par défaut /
 * filet de sécurité si la base est indisponible ou qu'une clé n'a pas encore
 * été migrée.
 */
export async function mergeUiTexts(
  baseMessages: Record<string, unknown>,
  locale: string
): Promise<Record<string, unknown>> {
  try {
    const rows = await prisma.uiText.findMany();
    if (rows.length === 0) return baseMessages;

    // Clone profond simple (les messages sont des données JSON pures : objets/
    // tableaux/chaînes), pour ne jamais muter l'objet importé (mis en cache
    // par le bundler entre requêtes).
    const merged = JSON.parse(JSON.stringify(baseMessages)) as Record<string, unknown>;

    for (const row of rows) {
      const value = locale === "fr" ? row.valueFr : row.valueEn;
      setDeep(merged, row.key, value);
    }

    return merged;
  } catch (error) {
    console.error("mergeUiTexts: lecture UiText échouée, repli sur messages statiques.", error);
    return baseMessages;
  }
}

/** Affecte `value` dans `obj` au chemin pointé (ex. "Associative.roleLabels.president"). */
function setDeep(obj: Record<string, unknown>, dotPath: string, value: string): void {
  const parts = dotPath.split(".");
  let node = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    const next = node[part];
    if (typeof next !== "object" || next === null) {
      node[part] = {};
    }
    node = node[part] as Record<string, unknown>;
  }
  node[parts[parts.length - 1]] = value;
}

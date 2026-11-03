import { z } from "zod";
import type { EntityConfig, FieldConfig } from "@/lib/admin/entity-config";
import { fieldColumnKeys } from "@/lib/admin/entity-config";

/**
 * Construit dynamiquement un schéma zod à partir de la configuration d'une
 * entité. Les champs fichier (image/document) et liste (string-list) sont
 * traités séparément dans la Server Action (ils ne viennent pas de simples
 * chaînes de FormData), donc ils sont exclus de ce schéma texte.
 */
export function buildEntityTextSchema(config: EntityConfig) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of config.fields) {
    if (field.type === "image" || field.type === "document" || field.type === "string-list" || field.type === "image-list") {
      continue;
    }
    for (const key of fieldColumnKeys(field)) {
      shape[key] = schemaForField(field);
    }
  }

  return z.object(shape);
}

function schemaForField(field: FieldConfig): z.ZodTypeAny {
  switch (field.type) {
    case "bilingual-text":
    case "text":
      return field.required
        ? z.string().trim().min(1, `${field.label} : ce champ est obligatoire.`)
        : z.string().trim().optional().or(z.literal(""));
    case "bilingual-textarea":
    case "textarea":
      return field.required
        ? z.string().trim().min(1, `${field.label} : ce champ est obligatoire.`)
        : z.string().trim().optional().or(z.literal(""));
    case "url":
      return z
        .string()
        .trim()
        .optional()
        .or(z.literal(""))
        .refine(
          (value) => !value || /^https?:\/\//i.test(value) || value.startsWith("/") || value.includes("@"),
          `${field.label} : URL invalide (doit commencer par http:// ou https://).`
        );
    case "date":
      return z.string().trim().optional().or(z.literal(""));
    case "boolean":
      return z.union([z.literal("on"), z.literal("")]).optional();
    case "select": {
      const values = (field.options ?? []).map((o) => o.value);
      const fallback = values[0] ?? "";
      return z
        .string()
        .optional()
        .transform((value) => (value && values.includes(value) ? value : fallback));
    }
    default:
      return z.string().optional();
  }
}

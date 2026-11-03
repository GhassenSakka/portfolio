"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { getEntityConfig, fieldColumnKeys, type EntityConfig } from "@/lib/admin/entity-config";
import { buildEntityTextSchema } from "@/lib/admin/entity-schema";
import { saveUploadedFile, deleteUploadedFile } from "@/lib/storage";
import { encodeJsonList, decodeJsonList } from "@/lib/json-fields";

export interface EntityFormState {
  status: "idle" | "success" | "error";
  errors?: Record<string, string>;
  message?: string;
}

interface EntityRow {
  id: string;
  sortOrder: number;
  isVisible: boolean;
  [key: string]: unknown;
}

type PrismaDelegate = {
  findMany: (args?: unknown) => Promise<EntityRow[]>;
  findUnique: (args: unknown) => Promise<EntityRow | null>;
  create: (args: unknown) => Promise<EntityRow>;
  update: (args: unknown) => Promise<EntityRow>;
  delete: (args: unknown) => Promise<EntityRow>;
  aggregate: (args: unknown) => Promise<{ _max: { sortOrder: number | null } }>;
};

function delegate(config: EntityConfig): PrismaDelegate {
  return (prisma as unknown as Record<string, PrismaDelegate>)[config.model];
}

function revalidatePublic() {
  revalidatePath("/fr");
  revalidatePath("/en");
}

/** Création ou mise à jour d'un élément — utilisé via useActionState + .bind(null, slug, id). */
export async function saveEntityItem(
  slug: string,
  id: string | null,
  _prevState: EntityFormState,
  formData: FormData
): Promise<EntityFormState> {
  await requireAdminSession();
  const config = getEntityConfig(slug);
  if (!config) return { status: "error", message: "Section inconnue." };

  const schema = buildEntityTextSchema(config);
  const rawTextValues: Record<string, string> = {};
  for (const field of config.fields) {
    if (field.type === "image" || field.type === "document" || field.type === "string-list" || field.type === "image-list") continue;
    for (const key of fieldColumnKeys(field)) {
      rawTextValues[key] =
        field.type === "boolean"
          ? formData.get(key) === "on"
            ? "on"
            : ""
          : String(formData.get(key) ?? "");
    }
  }

  const parsed = schema.safeParse(rawTextValues);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!errors[key]) errors[key] = issue.message;
    }
    return { status: "error", errors, message: "Merci de corriger les champs indiqués ci-dessous." };
  }

  const data: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(parsed.data as Record<string, string>)) {
    const field = config.fields.find((f) => fieldColumnKeys(f).includes(key));
    if (!field) continue;
    if (field.type === "date") {
      data[key] = value ? new Date(value) : null;
    } else if (field.type === "boolean") {
      data[key] = value === "on";
    } else {
      data[key] = value === "" ? null : value;
    }
  }

  // Champs fichier (image / document) : upload, conservation ou suppression.
  for (const field of config.fields) {
    if (field.type !== "image" && field.type !== "document") continue;
    const file = formData.get(field.name);
    const currentUrl = String(formData.get(`${field.name}_current`) ?? "") || null;
    const shouldRemove = formData.get(`${field.name}_remove`) === "on";

    let finalUrl: string | null = currentUrl;
    if (file instanceof File && file.size > 0) {
      try {
        const uploaded = await saveUploadedFile(file, field.type === "document" ? "document" : "image");
        if (currentUrl) await deleteUploadedFile(currentUrl);
        finalUrl = uploaded.url;
      } catch (error) {
        return {
          status: "error",
          errors: { [field.name]: error instanceof Error ? error.message : "Échec de l'upload." },
          message: "Échec de l'upload d'un fichier.",
        };
      }
    } else if (shouldRemove) {
      if (currentUrl) await deleteUploadedFile(currentUrl);
      finalUrl = null;
    }
    data[field.name] = finalUrl;
  }

  // Champs liste (string-list), ex. liens Instagram.
  for (const field of config.fields) {
    if (field.type !== "string-list") continue;
    const raw = String(formData.get(`${field.name}_text`) ?? "");
    const lines = raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    data[field.name] = encodeJsonList(lines);
  }

  // Champs galerie (image-list), ex. photos d'une action associative : N emplacements
  // indépendants, chacun upload / conservation / suppression, assemblés en liste ordonnée.
  for (const field of config.fields) {
    if (field.type !== "image-list") continue;
    const maxItems = field.maxItems ?? 4;
    const finalUrls: string[] = [];

    for (let i = 0; i < maxItems; i++) {
      const slotName = `${field.name}_${i}`;
      const file = formData.get(slotName);
      const currentUrl = String(formData.get(`${slotName}_current`) ?? "") || null;
      const shouldRemove = formData.get(`${slotName}_remove`) === "on";

      let finalUrl: string | null = currentUrl;
      if (file instanceof File && file.size > 0) {
        try {
          const uploaded = await saveUploadedFile(file, "image");
          if (currentUrl) await deleteUploadedFile(currentUrl);
          finalUrl = uploaded.url;
        } catch (error) {
          return {
            status: "error",
            errors: { [field.name]: error instanceof Error ? error.message : "Échec de l'upload." },
            message: "Échec de l'upload d'une photo.",
          };
        }
      } else if (shouldRemove) {
        if (currentUrl) await deleteUploadedFile(currentUrl);
        finalUrl = null;
      }
      if (finalUrl) finalUrls.push(finalUrl);
    }

    data[field.name] = encodeJsonList(finalUrls);
  }

  const db = delegate(config);

  try {
    if (id) {
      await db.update({ where: { id }, data });
    } else {
      const maxAgg = await db.aggregate({ _max: { sortOrder: true } });
      const nextSortOrder = (maxAgg._max.sortOrder ?? -1) + 1;
      await db.create({ data: { ...data, sortOrder: nextSortOrder } });
    }
  } catch (error) {
    console.error("saveEntityItem failed:", error);
    return { status: "error", message: "Erreur lors de l'enregistrement en base de données." };
  }

  revalidatePublic();
  revalidatePath(`/admin/${slug}`);
  redirect(`/admin/${slug}`);
}

export async function deleteEntityItem(slug: string, id: string): Promise<void> {
  await requireAdminSession();
  const config = getEntityConfig(slug);
  if (!config) throw new Error("Section inconnue.");
  const db = delegate(config);

  const item = await db.findUnique({ where: { id } });
  if (item) {
    for (const field of config.fields) {
      if (field.type === "image" || field.type === "document") {
        const url = item[field.name];
        if (typeof url === "string") await deleteUploadedFile(url);
      }
      if (field.type === "image-list") {
        const raw = item[field.name];
        if (typeof raw === "string") {
          for (const url of decodeJsonList(raw)) await deleteUploadedFile(url);
        }
      }
    }
  }

  await db.delete({ where: { id } });
  revalidatePublic();
  revalidatePath(`/admin/${slug}`);
}

export async function toggleVisibility(slug: string, id: string): Promise<void> {
  await requireAdminSession();
  const config = getEntityConfig(slug);
  if (!config) throw new Error("Section inconnue.");
  const db = delegate(config);
  const item = await db.findUnique({ where: { id } });
  if (!item) return;
  await db.update({ where: { id }, data: { isVisible: !item.isVisible } });
  revalidatePublic();
  revalidatePath(`/admin/${slug}`);
}

export async function moveItem(slug: string, id: string, direction: "up" | "down"): Promise<void> {
  await requireAdminSession();
  const config = getEntityConfig(slug);
  if (!config) throw new Error("Section inconnue.");
  const db = delegate(config);

  const items = await db.findMany({ orderBy: { sortOrder: "asc" } });
  const index = items.findIndex((it) => it.id === id);
  if (index === -1) return;
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= items.length) return;

  const current = items[index];
  const swapWith = items[swapIndex];

  await db.update({ where: { id: current.id }, data: { sortOrder: swapWith.sortOrder } });
  await db.update({ where: { id: swapWith.id }, data: { sortOrder: current.sortOrder } });

  revalidatePublic();
  revalidatePath(`/admin/${slug}`);
}

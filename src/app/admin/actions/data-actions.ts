"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { ENTITY_REGISTRY } from "@/lib/admin/entity-config";

const EXPORT_VERSION = 1;

interface ListDelegate {
  findMany: (args?: unknown) => Promise<Record<string, unknown>[]>;
  deleteMany: () => Promise<unknown>;
  create: (args: unknown) => Promise<unknown>;
}

function delegateFor(model: string): ListDelegate {
  return (prisma as unknown as Record<string, ListDelegate>)[model];
}

/** Exporte tout le contenu éditable (profil + 10 sections) en JSON. N'inclut ni le compte admin ni les messages de contact. */
export async function exportAllData(): Promise<string> {
  await requireAdminSession();

  const profile = await prisma.profile.findFirst();
  const data: Record<string, unknown> = {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    profile,
  };

  for (const entity of ENTITY_REGISTRY) {
    data[entity.slug] = await delegateFor(entity.model).findMany({
      orderBy: { sortOrder: "asc" },
    });
  }

  return JSON.stringify(data, null, 2);
}

export interface ImportResult {
  status: "success" | "error";
  message: string;
}

const DATE_KEYS = ["startDate", "endDate", "issuedAt", "expiresAt"];

function sanitizeForCreate(raw: Record<string, unknown>): Record<string, unknown> {
  const result = { ...raw };
  for (const key of DATE_KEYS) {
    if (typeof result[key] === "string") {
      result[key] = new Date(result[key] as string);
    }
  }
  delete result.id;
  delete result.createdAt;
  delete result.updatedAt;
  return result;
}

/** Restaure tout le contenu depuis un export JSON précédent (remplacement complet, par section). */
export async function importAllData(formData: FormData): Promise<ImportResult> {
  await requireAdminSession();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Aucun fichier sélectionné." };
  }

  let parsed: Record<string, unknown>;
  try {
    const text = await file.text();
    parsed = JSON.parse(text);
  } catch {
    return { status: "error", message: "Fichier JSON invalide." };
  }

  try {
    if (parsed.profile && typeof parsed.profile === "object") {
      const profileData = sanitizeForCreate(parsed.profile as Record<string, unknown>);
      const existing = await prisma.profile.findFirst();
      if (existing) {
        await prisma.profile.update({ where: { id: existing.id }, data: profileData });
      } else {
        await prisma.profile.create({ data: profileData as never });
      }
    }

    for (const entity of ENTITY_REGISTRY) {
      const items = parsed[entity.slug];
      if (!Array.isArray(items)) continue;
      const db = delegateFor(entity.model);
      await db.deleteMany();
      for (const rawItem of items as Record<string, unknown>[]) {
        await db.create({ data: sanitizeForCreate(rawItem) });
      }
    }
  } catch (error) {
    console.error("importAllData failed:", error);
    return {
      status: "error",
      message: "Erreur lors de l'import. Vérifiez que le fichier provient bien d'un export de ce site.",
    };
  }

  revalidatePath("/fr");
  revalidatePath("/en");
  revalidatePath("/admin", "layout");

  return { status: "success", message: "Import réussi : tout le contenu a été restauré." };
}

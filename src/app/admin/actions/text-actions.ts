"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";

export interface TextsFormState {
  status: "idle" | "success" | "error";
  message?: string;
}

/** Enregistre en une fois tous les textes d'interface modifiés (back-office « Textes de l'interface »). */
export async function saveUiTexts(
  _prevState: TextsFormState,
  formData: FormData
): Promise<TextsFormState> {
  await requireAdminSession();

  const keys = formData.getAll("__key");
  if (keys.length === 0) {
    return { status: "error", message: "Aucune clé de texte reçue." };
  }

  try {
    for (const rawKey of keys) {
      const key = String(rawKey);
      const valueFr = String(formData.get(`fr__${key}`) ?? "");
      const valueEn = String(formData.get(`en__${key}`) ?? "");
      await prisma.uiText.update({ where: { key }, data: { valueFr, valueEn } });
    }
  } catch (error) {
    console.error("saveUiTexts failed:", error);
    return { status: "error", message: "Erreur lors de l'enregistrement en base de données." };
  }

  revalidatePath("/fr");
  revalidatePath("/en");
  revalidatePath("/admin/texts");

  return { status: "success", message: "Textes mis à jour avec succès." };
}

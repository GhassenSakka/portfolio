"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { saveUploadedFile, deleteUploadedFile } from "@/lib/storage";

export interface ProfileFormState {
  status: "idle" | "success" | "error";
  errors?: Record<string, string>;
  message?: string;
}

const profileSchema = z.object({
  fullName: z.string().trim().min(1, "Le nom est obligatoire."),
  titleFr: z.string().trim().min(1, "Le titre (FR) est obligatoire."),
  titleEn: z.string().trim().min(1, "Le titre (EN) est obligatoire."),
  bannerFr: z.string().trim().optional().or(z.literal("")),
  bannerEn: z.string().trim().optional().or(z.literal("")),
  aboutFr: z.string().trim().min(1, "Le texte « à propos » (FR) est obligatoire."),
  aboutEn: z.string().trim().min(1, "Le texte « à propos » (EN) est obligatoire."),
  partnerNoteFr: z.string().trim().optional().or(z.literal("")),
  partnerNoteEn: z.string().trim().optional().or(z.literal("")),
  location: z.string().trim().optional().or(z.literal("")),
  email1: z.string().trim().email("Email 1 invalide.").optional().or(z.literal("")),
  email2: z.string().trim().email("Email 2 invalide.").optional().or(z.literal("")),
  phone1: z.string().trim().optional().or(z.literal("")),
  phone2: z.string().trim().optional().or(z.literal("")),
  linkedinUrl: z.string().trim().optional().or(z.literal("")),
});

export async function saveProfile(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  await requireAdminSession();

  const raw = {
    fullName: String(formData.get("fullName") ?? ""),
    titleFr: String(formData.get("titleFr") ?? ""),
    titleEn: String(formData.get("titleEn") ?? ""),
    bannerFr: String(formData.get("bannerFr") ?? ""),
    bannerEn: String(formData.get("bannerEn") ?? ""),
    aboutFr: String(formData.get("aboutFr") ?? ""),
    aboutEn: String(formData.get("aboutEn") ?? ""),
    partnerNoteFr: String(formData.get("partnerNoteFr") ?? ""),
    partnerNoteEn: String(formData.get("partnerNoteEn") ?? ""),
    location: String(formData.get("location") ?? ""),
    email1: String(formData.get("email1") ?? ""),
    email2: String(formData.get("email2") ?? ""),
    phone1: String(formData.get("phone1") ?? ""),
    phone2: String(formData.get("phone2") ?? ""),
    linkedinUrl: String(formData.get("linkedinUrl") ?? ""),
  };

  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!errors[key]) errors[key] = issue.message;
    }
    return { status: "error", errors, message: "Merci de corriger les champs indiqués." };
  }

  const existing = await prisma.profile.findFirst();

  const data: Record<string, unknown> = {
    ...parsed.data,
    email1: parsed.data.email1 || null,
    email2: parsed.data.email2 || null,
    phone1: parsed.data.phone1 || null,
    phone2: parsed.data.phone2 || null,
    location: parsed.data.location || null,
    linkedinUrl: parsed.data.linkedinUrl || null,
    partnerNoteFr: parsed.data.partnerNoteFr || null,
    partnerNoteEn: parsed.data.partnerNoteEn || null,
  };

  // Photo de profil
  const photoFile = formData.get("photoUrl");
  const photoCurrent = String(formData.get("photoUrl_current") ?? "") || null;
  const photoRemove = formData.get("photoUrl_remove") === "on";
  if (photoFile instanceof File && photoFile.size > 0) {
    try {
      const uploaded = await saveUploadedFile(photoFile, "image");
      if (photoCurrent) await deleteUploadedFile(photoCurrent);
      data.photoUrl = uploaded.url;
    } catch (error) {
      return {
        status: "error",
        errors: { photoUrl: error instanceof Error ? error.message : "Échec de l'upload." },
      };
    }
  } else if (photoRemove) {
    if (photoCurrent) await deleteUploadedFile(photoCurrent);
    data.photoUrl = null;
  } else {
    data.photoUrl = photoCurrent;
  }

  // CV (PDF)
  const cvFile = formData.get("cvUrl");
  const cvCurrent = String(formData.get("cvUrl_current") ?? "") || null;
  const cvRemove = formData.get("cvUrl_remove") === "on";
  if (cvFile instanceof File && cvFile.size > 0) {
    try {
      const uploaded = await saveUploadedFile(cvFile, "document");
      if (cvCurrent) await deleteUploadedFile(cvCurrent);
      data.cvUrl = uploaded.url;
    } catch (error) {
      return {
        status: "error",
        errors: { cvUrl: error instanceof Error ? error.message : "Échec de l'upload." },
      };
    }
  } else if (cvRemove) {
    if (cvCurrent) await deleteUploadedFile(cvCurrent);
    data.cvUrl = null;
  } else {
    data.cvUrl = cvCurrent;
  }

  if (existing) {
    await prisma.profile.update({ where: { id: existing.id }, data });
  } else {
    await prisma.profile.create({ data: data as never });
  }

  revalidatePath("/fr");
  revalidatePath("/en");
  revalidatePath("/admin/profile");

  return { status: "success", message: "Profil mis à jour avec succès." };
}

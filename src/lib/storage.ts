import "server-only";
import { writeFile, mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";

/**
 * Abstraction de stockage des fichiers uploadés (images, CV PDF).
 * - STORAGE_DRIVER="local"       -> écrit dans public/uploads (dev + prod self-hosted)
 * - STORAGE_DRIVER="vercel-blob" -> Vercel Blob Storage (prod gratuite sans disque persistant)
 *
 * Le choix se fait uniquement via la variable d'environnement STORAGE_DRIVER,
 * aucun code appelant n'a besoin de connaître le driver actif.
 */

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];
export const ALLOWED_DOCUMENT_TYPES = ["application/pdf"];
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 Mo
export const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024; // 10 Mo

export interface UploadResult {
  url: string;
  fileName: string;
}

export class UploadError extends Error {}

function sanitizeExtension(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  // Liste blanche stricte des extensions acceptées.
  const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".pdf"];
  return allowed.includes(ext) ? ext : "";
}

export function validateUpload(
  file: { type: string; size: number },
  kind: "image" | "document"
): void {
  const allowedTypes =
    kind === "image" ? ALLOWED_IMAGE_TYPES : ALLOWED_DOCUMENT_TYPES;
  const maxSize = kind === "image" ? MAX_IMAGE_SIZE_BYTES : MAX_DOCUMENT_SIZE_BYTES;

  if (!allowedTypes.includes(file.type)) {
    throw new UploadError(
      kind === "image"
        ? "Type de fichier image non autorisé (jpg, png, webp, gif, svg uniquement)."
        : "Seuls les fichiers PDF sont autorisés pour le CV."
    );
  }
  if (file.size > maxSize) {
    throw new UploadError(
      `Fichier trop volumineux (max ${Math.round(maxSize / (1024 * 1024))} Mo).`
    );
  }
}

async function saveLocal(buffer: Buffer, ext: string): Promise<UploadResult> {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  const fileName = `${nanoid(12)}${ext}`;
  await writeFile(path.join(uploadsDir, fileName), buffer);
  return { url: `/uploads/${fileName}`, fileName };
}

async function saveVercelBlob(
  buffer: Buffer,
  ext: string,
  contentType: string
): Promise<UploadResult> {
  const { put } = await import("@vercel/blob");
  const fileName = `uploads/${nanoid(12)}${ext}`;
  const blob = await put(fileName, buffer, {
    access: "public",
    contentType,
    addRandomSuffix: false,
  });
  return { url: blob.url, fileName };
}

export async function saveUploadedFile(
  file: File,
  kind: "image" | "document"
): Promise<UploadResult> {
  validateUpload(file, kind);
  const ext = sanitizeExtension(file.name) || (kind === "document" ? ".pdf" : ".bin");
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const driver = process.env.STORAGE_DRIVER || "local";
  if (driver === "vercel-blob") {
    return saveVercelBlob(buffer, ext, file.type);
  }
  return saveLocal(buffer, ext);
}

/** Suppression best-effort (ne jamais bloquer une opération CRUD si ça échoue). */
export async function deleteUploadedFile(url: string | null | undefined): Promise<void> {
  if (!url) return;
  try {
    const driver = process.env.STORAGE_DRIVER || "local";
    if (driver === "vercel-blob" && url.includes("blob.vercel-storage.com")) {
      const { del } = await import("@vercel/blob");
      await del(url);
      return;
    }
    if (url.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", url);
      await unlink(filePath);
    }
  } catch {
    // Suppression best-effort : on ignore les erreurs (fichier déjà absent, etc.)
  }
}

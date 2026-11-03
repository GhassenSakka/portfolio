import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Badge rond utilisé pour les logos d'entreprises / établissements dans les
 * sections Expérience et Formation. Affiche le logo téléversé si disponible,
 * sinon une icône générique de repli.
 */
export function LogoBadge({
  imageUrl,
  alt,
  fallbackIcon,
}: {
  imageUrl: string | null | undefined;
  alt: string;
  fallbackIcon: ReactNode;
}) {
  if (imageUrl) {
    return (
      <div className="relative mt-1 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-surface-border bg-white p-1.5 shadow-sm">
        <Image src={imageUrl} alt={alt} fill className="object-contain p-1.5" sizes="40px" />
      </div>
    );
  }

  return (
    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-azure-100 text-azure-700 dark:bg-azure-950 dark:text-azure-300">
      {fallbackIcon}
    </div>
  );
}

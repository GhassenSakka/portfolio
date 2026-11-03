"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

/**
 * Liste à puces tronquée par défaut (utile pour les descriptions de projets
 * trop longues) avec un bouton "En savoir plus" / "Afficher moins" pour
 * afficher le reste. N'affiche le bouton que si la liste dépasse `maxItems`.
 */
export function TruncatedBulletList({
  items,
  maxItems = 3,
  moreLabel,
  lessLabel,
}: {
  items: string[];
  maxItems?: number;
  moreLabel: string;
  lessLabel: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = items.length > maxItems;
  const visibleItems = expanded ? items : items.slice(0, maxItems);

  return (
    <>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-foreground/80">
        {visibleItems.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
      {hasMore ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="mt-2 inline-flex w-fit items-center gap-1 text-sm font-semibold text-azure-600 hover:underline dark:text-azure-300"
        >
          {expanded ? lessLabel : moreLabel}
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      ) : null}
    </>
  );
}

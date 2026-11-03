"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

let scriptLoadingPromise: Promise<void> | null = null;

function loadInstagramScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.instgrm) return Promise.resolve();
  if (scriptLoadingPromise) return scriptLoadingPromise;

  scriptLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("instagram-embed-failed"));
    document.body.appendChild(script);
  });
  return scriptLoadingPromise;
}

/**
 * Embed officiel Instagram (oEmbed via embed.js). Le <blockquote> (avec son
 * lien de repli intégré) est TOUJOURS présent dans le HTML initial — rendu
 * serveur et sans JavaScript inclus — afin que le site reste utilisable hors
 * connexion / sans JS. Seul le CHARGEMENT du script tiers et son traitement
 * (remplacement du blockquote par l'iframe Instagram) sont différés jusqu'à
 * ce que la carte approche du viewport (IntersectionObserver), pour ne pas
 * pénaliser la performance quand plusieurs dizaines d'embeds sont présents.
 * En cas d'échec de chargement (hors ligne, bloqué…), repli automatique vers
 * une simple carte « Voir sur Instagram ».
 */
export function InstagramEmbed({
  url,
  fallbackLabel,
}: {
  url: string;
  fallbackLabel: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    function startLoading() {
      timeout = setTimeout(() => {
        if (!cancelled) setFailed(true);
      }, 4000);

      loadInstagramScript()
        .then(() => {
          if (cancelled) return;
          if (timeout) clearTimeout(timeout);
          window.instgrm?.Embeds.process();
        })
        .catch(() => {
          if (!cancelled) setFailed(true);
        });
    }

    if (typeof IntersectionObserver === "undefined") {
      startLoading();
      return () => {
        cancelled = true;
        if (timeout) clearTimeout(timeout);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          startLoading();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);

    return () => {
      cancelled = true;
      observer.disconnect();
      if (timeout) clearTimeout(timeout);
    };
  }, [url]);

  if (failed) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-48 w-full flex-col items-center justify-center gap-2 border border-dashed border-surface-border bg-surface p-6 text-center text-sm font-medium text-azure-700 transition-colors hover:bg-azure-50 dark:text-azure-300 dark:hover:bg-azure-950/40"
      >
        {fallbackLabel}
      </a>
    );
  }

  return (
    <div ref={containerRef} className="instagram-embed-wrapper overflow-hidden">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{
          background: "#FFF",
          border: 0,
          margin: 0,
          maxWidth: 540,
          minWidth: 300,
          width: "100%",
        }}
      >
        <a href={url} target="_blank" rel="noopener noreferrer">
          {fallbackLabel}
        </a>
      </blockquote>
    </div>
  );
}

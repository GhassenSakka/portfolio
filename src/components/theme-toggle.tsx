"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("Theme");

  // Ce flag "mounted" doit nécessairement être posé après l'hydratation (et
  // non via un lazy-initializer) pour éviter un flash de thème incorrect :
  // le rendu serveur ne connaît pas le thème système/local du navigateur.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-9 w-9" aria-hidden="true" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? t("light") : t("dark")}
      title={isDark ? t("light") : t("dark")}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-surface-border bg-surface text-foreground transition-colors hover:bg-azure-50 dark:hover:bg-azure-950/40"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

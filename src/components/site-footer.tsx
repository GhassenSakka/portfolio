import { getTranslations } from "next-intl/server";
import { Mail, Phone } from "lucide-react";
import { getProfile, getSocialLinks } from "@/lib/content";
import { LinkedinIcon, InstagramIcon } from "@/components/brand-icons";

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  linkedin: LinkedinIcon,
  instagram: InstagramIcon,
  email: Mail,
  phone: Phone,
};

export async function SiteFooter() {
  const [t, profile, socialLinks] = await Promise.all([
    getTranslations("Footer"),
    getProfile(),
    getSocialLinks(),
  ]);

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-surface-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 text-sm text-foreground/70 sm:flex-row sm:justify-between sm:px-6">
        <p>
          © {year} {profile?.fullName ?? "Ghassen SAKKA"} — {t("rights")}
        </p>
        <div className="flex items-center gap-3">
          {socialLinks.map((link) => {
            const Icon = ICONS[link.platform] ?? Mail;
            return (
              <a
                key={link.id}
                href={link.url}
                target={link.url.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={link.labelFr ?? link.platform}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-surface-border transition-colors hover:bg-azure-50 dark:hover:bg-azure-950/40"
              >
                <Icon size={15} />
              </a>
            );
          })}
        </div>
        <p className="text-xs text-foreground/50">{t("builtWith")}</p>
      </div>
    </footer>
  );
}

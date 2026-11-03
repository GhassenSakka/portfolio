import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Mail, Download, BadgeCheck, Cloud } from "lucide-react";
import { getProfile, getHeroStats } from "@/lib/content";
import { pickText } from "@/lib/locale-utils";
import { Reveal } from "@/components/reveal";
import { LinkedinIcon } from "@/components/brand-icons";

export async function HeroSection({ locale }: { locale: string }) {
  const [t, profile, stats] = await Promise.all([
    getTranslations("Hero"),
    getProfile(),
    getHeroStats(),
  ]);
  if (!profile) return null;

  const title = pickText(profile, "title", locale);
  const banner = pickText(profile, "banner", locale);
  const partnerNote = pickText(profile, "partnerNote", locale);
  const initials = profile.fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  const statItems = [
    stats.yearsOfExperience > 0
      ? { value: `${stats.yearsOfExperience}+`, label: t("statsYears") }
      : null,
    stats.certificationsCount > 0
      ? { value: `${stats.certificationsCount}`, label: t("statsCertifications") }
      : null,
    stats.projectsCount > 0
      ? { value: `${stats.projectsCount}`, label: t("statsProjects") }
      : null,
  ].filter((item): item is { value: string; label: string } => item !== null);

  return (
    <section id="hero" className="relative overflow-hidden bg-background">
      {/* Fond décoratif : dégradé + taches de couleur + grille de points */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-azure-50 via-background to-background dark:from-azure-950/40 dark:via-background dark:to-background" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-azure-300/30 blur-3xl dark:bg-azure-700/20" />
      <div className="pointer-events-none absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-azure-200/30 blur-3xl dark:bg-azure-800/10" />
      <div className="hero-dot-grid pointer-events-none absolute inset-0" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-28">
        <Reveal>
          <p className="inline-flex items-center rounded-full border border-azure-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-azure-600 backdrop-blur dark:border-azure-800 dark:bg-white/5 dark:text-azure-300">
            {t("eyebrow")}
          </p>
          <h1 className="mt-4 bg-gradient-to-r from-foreground to-azure-700 bg-clip-text text-4xl font-bold tracking-tight text-transparent dark:to-azure-300 sm:text-5xl lg:text-6xl">
            {profile.fullName}
          </h1>
          <p className="mt-3 text-lg font-medium text-foreground/80 sm:text-xl">{title}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {banner ? (
              <p className="inline-flex items-center rounded-full border border-azure-200 bg-azure-50 px-4 py-2 text-sm font-medium text-azure-800 dark:border-azure-800 dark:bg-azure-950/50 dark:text-azure-200">
                {banner}
              </p>
            ) : null}
            {partnerNote ? (
              <p className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
                <BadgeCheck size={15} /> {partnerNote}
              </p>
            ) : null}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-azure-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-azure-600/20 transition-all hover:-translate-y-0.5 hover:bg-azure-700 hover:shadow-xl hover:shadow-azure-600/30"
            >
              <Mail size={16} /> {t("ctaContact")}
            </a>
            {profile.cvUrl ? (
              <a
                href={profile.cvUrl}
                download
                className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:bg-azure-50 dark:hover:bg-azure-950/40"
              >
                <Download size={16} /> {t("ctaCv")}
              </a>
            ) : null}
            {profile.linkedinUrl ? (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:bg-azure-50 dark:hover:bg-azure-950/40"
              >
                <LinkedinIcon size={16} /> {t("ctaLinkedin")}
              </a>
            ) : null}
          </div>

          {statItems.length > 0 ? (
            <div className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-surface-border pt-6">
              {statItems.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-azure-700 dark:text-azure-300 sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-xs leading-snug text-foreground/60">{stat.label}</p>
                </div>
              ))}
            </div>
          ) : null}
        </Reveal>

        <Reveal delay={150} className="justify-self-center">
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-azure-400 to-azure-600 opacity-40 blur-2xl" />
            <div className="relative h-56 w-56 overflow-hidden rounded-full border-4 border-white bg-azure-100 shadow-2xl dark:border-slate-900 sm:h-72 sm:w-72">
              {profile.photoUrl ? (
                <Image
                  src={profile.photoUrl}
                  alt={profile.fullName}
                  fill
                  className="object-cover"
                  sizes="288px"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-6xl font-bold text-azure-600">
                  {initials}
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-background bg-azure-600 shadow-lg sm:h-16 sm:w-16">
              <Cloud size={26} className="text-white" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

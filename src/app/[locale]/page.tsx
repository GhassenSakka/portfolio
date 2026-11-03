import { setRequestLocale } from "next-intl/server";
import { routing, type AppLocale } from "@/i18n/routing";
import { HeroSection } from "./sections/hero-section";
import { AboutSection } from "./sections/about-section";
import { ExperienceSection } from "./sections/experience-section";
import { ProjectsSection } from "./sections/projects-section";
import { MigrationSection } from "./sections/migration-section";
import { CertificationsSection } from "./sections/certifications-section";
import { EducationSection } from "./sections/education-section";
import { AssociativeSection } from "./sections/associative-section";
import { InterestsSection } from "./sections/interests-section";
import { ContactSection } from "./sections/contact-section";

// Revalidation incrémentale (ISR) pour amortir les démarrages à froid d'une
// base PostgreSQL gratuite en production. En local (SQLite), le serveur de
// dev Next.js rend de toute façon chaque page dynamiquement.
export const revalidate = 60;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);

  return (
    <>
      <HeroSection locale={locale} />
      <AboutSection locale={locale} />
      <ExperienceSection locale={locale} />
      <ProjectsSection locale={locale} />
      <MigrationSection locale={locale} />
      <CertificationsSection locale={locale} />
      <EducationSection locale={locale} />
      <AssociativeSection locale={locale} />
      <InterestsSection locale={locale} />
      <ContactSection />
    </>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

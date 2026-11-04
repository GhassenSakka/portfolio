import { setRequestLocale } from "next-intl/server";
import { routing, type AppLocale } from "@/i18n/routing";
import { prisma } from "@/lib/db";
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

/** Associe chaque clé de SiteSection (back-office « Sections du site ») à son composant. */
const SECTION_COMPONENTS: Record<string, (props: { locale: string }) => Promise<React.ReactElement | null>> = {
  hero: HeroSection,
  about: AboutSection,
  experience: ExperienceSection,
  projects: ProjectsSection,
  migration: MigrationSection,
  certifications: CertificationsSection,
  education: EducationSection,
  associative: AssociativeSection,
  interests: InterestsSection,
  contact: async () => ContactSection(),
};

/** Ordre et visibilité par défaut, utilisés si la table SiteSection est vide (avant premier seed). */
const DEFAULT_SECTION_ORDER = [
  "hero",
  "about",
  "experience",
  "projects",
  "migration",
  "certifications",
  "education",
  "associative",
  "interests",
  "contact",
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);

  const sections = await prisma.siteSection.findMany({ orderBy: { sortOrder: "asc" } });
  const orderedKeys = sections.length > 0
    ? sections.filter((s) => s.isVisible).map((s) => s.key)
    : DEFAULT_SECTION_ORDER;

  return (
    <>
      {orderedKeys.map((key) => {
        const Section = SECTION_COMPONENTS[key];
        if (!Section) return null;
        return <Section key={key} locale={locale} />;
      })}
    </>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

import { getProfile } from "@/lib/content";
import { prisma } from "@/lib/db";
import { HeaderClient } from "@/components/header-client";

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

export async function SiteHeader({ locale }: { locale: string }) {
  const [profile, sections] = await Promise.all([
    getProfile(),
    prisma.siteSection.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  const navItems =
    sections.length > 0
      ? sections
          .filter((s) => s.isVisible)
          .map((s) => ({
            hash: `#${s.key}`,
            label: locale === "fr" ? s.labelFr : s.labelEn,
          }))
      : DEFAULT_SECTION_ORDER.map((key) => ({ hash: `#${key}`, label: key }));

  return (
    <HeaderClient
      fullName={profile?.fullName ?? "Ghassen SAKKA"}
      cvUrl={profile?.cvUrl ?? null}
      linkedinUrl={profile?.linkedinUrl ?? null}
      navItems={navItems}
    />
  );
}

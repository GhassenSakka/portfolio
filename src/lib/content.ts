import "server-only";
import { prisma } from "@/lib/db";

/**
 * Couche d'accès aux données du site public : ne retourne que les éléments
 * visibles (isVisible = true), triés par sortOrder. Le back-office utilise
 * directement Prisma pour voir aussi les éléments masqués.
 */

export async function getProfile() {
  const profile = await prisma.profile.findFirst();
  return profile;
}

export async function getExperiences() {
  return prisma.experience.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getProjects() {
  return prisma.project.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getCertifications() {
  return prisma.certification.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getMigrationProjects() {
  return prisma.migrationProject.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getEducation() {
  return prisma.education.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getAssociativeRoles() {
  return prisma.associativeRole.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getAssociativeActions() {
  return prisma.associativeAction.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getAwards() {
  return prisma.award.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getSponsors() {
  return prisma.sponsor.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getInterests() {
  return prisma.interest.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getSocialLinks() {
  return prisma.socialLink.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
  });
}

export interface HeroStats {
  yearsOfExperience: number;
  certificationsCount: number;
  projectsCount: number;
}

/** Statistiques calculées à partir du contenu réel (jamais de chiffres inventés). */
export async function getHeroStats(): Promise<HeroStats> {
  const [earliestExperience, certificationsCount, projectsCount] = await Promise.all([
    prisma.experience.findFirst({
      where: { isVisible: true, startDate: { not: null } },
      orderBy: { startDate: "asc" },
    }),
    prisma.certification.count({ where: { isVisible: true } }),
    prisma.project.count({ where: { isVisible: true } }),
  ]);

  let yearsOfExperience = 0;
  if (earliestExperience?.startDate) {
    const ms = Date.now() - new Date(earliestExperience.startDate).getTime();
    yearsOfExperience = Math.max(1, Math.round(ms / (365.25 * 24 * 60 * 60 * 1000)));
  }

  return { yearsOfExperience, certificationsCount, projectsCount };
}

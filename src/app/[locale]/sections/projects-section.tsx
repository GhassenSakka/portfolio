import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { getProjects } from "@/lib/content";
import { pickText, formatDateRange, toBulletList } from "@/lib/locale-utils";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { TruncatedBulletList } from "@/components/truncated-bullet-list";

export async function ProjectsSection({ locale }: { locale: string }) {
  const [t, common, projects] = await Promise.all([
    getTranslations("Projects"),
    getTranslations("Common"),
    getProjects(),
  ]);
  if (projects.length === 0) return null;

  return (
    <section id="projects" className="bg-surface/50 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading title={t("title")} />
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, idx) => {
            const description = pickText(project, "description", locale);
            return (
              <Reveal key={project.id} delay={(idx % 2) * 100} className="h-full">
                <article className="lift-on-hover flex h-full flex-col overflow-hidden rounded-2xl border border-surface-border bg-background shadow-sm">
                  {project.imageUrl ? (
                    <div className="relative h-44 w-full">
                      <Image
                        src={project.imageUrl}
                        alt={pickText(project, "title", locale)}
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 50vw, 100vw"
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-medium uppercase tracking-wide text-azure-600 dark:text-azure-300">
                      {formatDateRange(
                        project.startDate,
                        project.endDate,
                        project.isCurrent,
                        locale,
                        common("present")
                      )}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-foreground">
                      {pickText(project, "title", locale)}
                    </h3>
                    <TruncatedBulletList
                      items={toBulletList(description)}
                      maxItems={3}
                      moreLabel={common("readMore")}
                      lessLabel={common("readLess")}
                    />
                    {project.linkUrl ? (
                      <a
                        href={project.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-azure-600 hover:underline dark:text-azure-300"
                      >
                        {common("viewProject")} <ExternalLink size={14} />
                      </a>
                    ) : null}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

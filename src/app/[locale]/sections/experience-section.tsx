import { getTranslations } from "next-intl/server";
import { Briefcase } from "lucide-react";
import { getExperiences } from "@/lib/content";
import { pickText, formatDateRange, toBulletList } from "@/lib/locale-utils";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { LogoBadge } from "@/components/logo-badge";
import type { Experience } from "@prisma/client";

export async function ExperienceSection({ locale }: { locale: string }) {
  const [t, experiences] = await Promise.all([
    getTranslations("Experience"),
    getExperiences(),
  ]);
  if (experiences.length === 0) return null;

  // Regroupe les postes successifs occupés au sein d'une même organisation
  // (ex. plusieurs rôles chez CloudShift), en conservant l'ordre d'apparition.
  const groups = new Map<string, Experience[]>();
  for (const exp of experiences) {
    const key = exp.groupLabel || exp.companyFr;
    const arr = groups.get(key) ?? [];
    arr.push(exp);
    groups.set(key, arr);
  }

  return (
    <section id="experience" className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <Reveal>
        <SectionHeading title={t("title")} />
      </Reveal>
      <div className="space-y-10">
        {[...groups.entries()].map(([groupKey, items], idx) => {
          const company = pickText(items[0], "company", locale);
          return (
            <Reveal key={groupKey} delay={idx * 80}>
              <div className="flex gap-4">
                <LogoBadge
                  imageUrl={items[0].imageUrl}
                  alt={company}
                  fallbackIcon={<Briefcase size={18} />}
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">{company}</h3>
                  <div className="mt-3 space-y-5 border-l-2 border-surface-border pl-5">
                    {items.map((exp) => {
                      const description = pickText(exp, "description", locale);
                      const metaParts = [
                        exp.employmentType,
                        pickText(exp, "location", locale),
                        exp.workMode,
                      ].filter(Boolean);
                      return (
                        <div key={exp.id}>
                          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                            <p className="font-medium text-foreground">
                              {pickText(exp, "role", locale)}
                            </p>
                            <p className="text-sm text-foreground/60">
                              {formatDateRange(
                                exp.startDate,
                                exp.endDate,
                                exp.isCurrent,
                                locale,
                                t("present")
                              )}
                            </p>
                          </div>
                          {metaParts.length > 0 ? (
                            <p className="text-sm text-foreground/60">{metaParts.join(" · ")}</p>
                          ) : null}
                          {description ? (
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/80">
                              {toBulletList(description).map((line, i) => (
                                <li key={i}>{line}</li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

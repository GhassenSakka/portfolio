import { getTranslations } from "next-intl/server";
import { GraduationCap } from "lucide-react";
import { getEducation } from "@/lib/content";
import { pickText, formatDateRange } from "@/lib/locale-utils";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { LogoBadge } from "@/components/logo-badge";

export async function EducationSection({ locale }: { locale: string }) {
  const [t, common, items] = await Promise.all([
    getTranslations("Education"),
    getTranslations("Common"),
    getEducation(),
  ]);
  if (items.length === 0) return null;

  return (
    <section id="education" className="bg-surface/50 py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading title={t("title")} />
        </Reveal>
        <div className="space-y-6">
          {items.map((edu, idx) => {
            const field = pickText(edu, "field", locale);
            const grade = pickText(edu, "grade", locale);
            const school = pickText(edu, "school", locale);
            return (
              <Reveal key={edu.id} delay={idx * 80}>
                <div className="lift-on-hover flex gap-4 rounded-2xl border border-surface-border bg-background p-5 shadow-sm">
                  <LogoBadge
                    imageUrl={edu.imageUrl}
                    alt={school}
                    fallbackIcon={<GraduationCap size={18} />}
                  />
                  <div>
                    <h3 className="font-semibold text-foreground">{school}</h3>
                    <p className="text-sm text-foreground/80">
                      {pickText(edu, "degree", locale)}
                      {field ? ` · ${field}` : ""}
                    </p>
                    <p className="text-sm text-foreground/60">
                      {formatDateRange(
                        edu.startDate,
                        edu.endDate,
                        edu.isCurrent,
                        locale,
                        common("present")
                      )}
                    </p>
                    {grade ? (
                      <p className="mt-1 text-sm font-medium text-azure-700 dark:text-azure-300">
                        {grade}
                      </p>
                    ) : null}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

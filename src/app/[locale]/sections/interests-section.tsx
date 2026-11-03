import { getTranslations } from "next-intl/server";
import * as Icons from "lucide-react";
import { Heart } from "lucide-react";
import { getInterests } from "@/lib/content";
import { pickText } from "@/lib/locale-utils";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

type IconName = keyof typeof Icons;

export async function InterestsSection({ locale }: { locale: string }) {
  const [t, interests] = await Promise.all([getTranslations("Interests"), getInterests()]);
  if (interests.length === 0) return null;

  return (
    <section id="interests" className="bg-surface/50 py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading title={t("title")} />
        </Reveal>
        <div className="flex flex-wrap gap-4">
          {interests.map((interest, idx) => {
            const IconComp =
              (interest.icon && (Icons[interest.icon as IconName] as typeof Heart)) || Heart;
            return (
              <Reveal key={interest.id} delay={idx * 60}>
                <div className="flex items-center gap-2 rounded-full border border-surface-border bg-background px-4 py-2.5 text-sm font-medium text-foreground">
                  <IconComp size={16} className="text-azure-600 dark:text-azure-300" />
                  {pickText(interest, "label", locale)}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

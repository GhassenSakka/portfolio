import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { ArrowRightLeft, ExternalLink } from "lucide-react";
import { getMigrationProjects } from "@/lib/content";
import { pickText, formatDateRange, toBulletList } from "@/lib/locale-utils";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

export async function MigrationSection({ locale }: { locale: string }) {
  const [t, common, items] = await Promise.all([
    getTranslations("Migration"),
    getTranslations("Common"),
    getMigrationProjects(),
  ]);
  if (items.length === 0) return null;

  return (
    <section id="migration" className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading title={t("title")} />
          <p className="-mt-6 mb-8 max-w-2xl text-foreground/70">{t("subtitle")}</p>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item, idx) => {
            const description = pickText(item, "description", locale);
            return (
              <Reveal key={item.id} delay={(idx % 2) * 100} className="h-full">
                <article className="lift-on-hover flex h-full flex-col overflow-hidden rounded-2xl border border-surface-border bg-background shadow-sm">
                  {item.imageUrl ? (
                    <div className="relative h-40 w-full">
                      <Image
                        src={item.imageUrl}
                        alt={pickText(item, "title", locale)}
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 50vw, 100vw"
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-azure-600 dark:text-azure-300">
                      <ArrowRightLeft size={14} />
                      {formatDateRange(item.startDate, item.endDate, item.isCurrent, locale, common("present"))}
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-foreground">
                      {pickText(item, "title", locale)}
                    </h3>
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-foreground/80">
                      {toBulletList(description).map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                    {item.linkUrl ? (
                      <a
                        href={item.linkUrl}
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

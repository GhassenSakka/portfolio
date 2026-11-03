import { getTranslations } from "next-intl/server";
import Image from "next/image";
import type { ReactNode } from "react";
import { Trophy, Users, Medal, Crown, ShieldCheck } from "lucide-react";
import {
  getAssociativeRoles,
  getAssociativeActions,
  getAwards,
  getSponsors,
} from "@/lib/content";
import { pickText, formatDateRange } from "@/lib/locale-utils";
import { decodeJsonList } from "@/lib/json-fields";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { InstagramEmbed } from "@/components/instagram-embed";
import { LogoBadge } from "@/components/logo-badge";

const GALLERY_SIZES =
  "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

function ActionGallery({ images, alt }: { images: string[]; alt: string }) {
  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="relative h-48 w-full">
        <Image src={images[0]} alt={alt} fill className="object-cover" sizes={GALLERY_SIZES} />
      </div>
    );
  }

  if (images.length === 3) {
    return (
      <div className="grid h-48 grid-cols-2 grid-rows-2 gap-0.5">
        <div className="relative row-span-2 h-full w-full">
          <Image src={images[0]} alt={`${alt} 1`} fill className="object-cover" sizes={GALLERY_SIZES} />
        </div>
        {images.slice(1, 3).map((src, i) => (
          <div key={src} className="relative h-full w-full">
            <Image src={src} alt={`${alt} ${i + 2}`} fill className="object-cover" sizes={GALLERY_SIZES} />
          </div>
        ))}
      </div>
    );
  }

  // 2 photos (côte à côte) ou 4+ (grille 2x2, les suivantes ignorées visuellement)
  return (
    <div className="grid h-48 grid-cols-2 grid-rows-2 gap-0.5">
      {images.slice(0, 4).map((src, i) => (
        <div
          key={src}
          className={images.length === 2 ? "relative row-span-2 h-full w-full" : "relative h-full w-full"}
        >
          <Image src={src} alt={`${alt} ${i + 1}`} fill className="object-cover" sizes={GALLERY_SIZES} />
        </div>
      ))}
    </div>
  );
}

const ROLE_ICONS: Record<string, ReactNode> = {
  president: <Crown size={12} />,
  vice_president: <ShieldCheck size={12} />,
  organizer: <Users size={12} />,
};

export async function AssociativeSection({ locale }: { locale: string }) {
  const [t, common, roles, actions, awards, sponsors] = await Promise.all([
    getTranslations("Associative"),
    getTranslations("Common"),
    getAssociativeRoles(),
    getAssociativeActions(),
    getAwards(),
    getSponsors(),
  ]);

  if (roles.length === 0 && actions.length === 0 && awards.length === 0) {
    return null;
  }

  return (
    <section
      id="associative"
      className="relative overflow-hidden bg-gradient-to-b from-azure-50/60 via-background to-background py-16 dark:from-azure-950/20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading title={t("title")} kicker={t("kicker")} />
          <p className="-mt-6 mb-10 max-w-2xl text-foreground/70">{t("intro")}</p>
        </Reveal>

      {roles.length > 0 ? (
        <div className="mb-14">
          <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold text-foreground">
            <Users size={18} /> {t("roles")}
          </h3>
          <div className="space-y-4">
            {roles.map((role, idx) => (
              <Reveal key={role.id} delay={idx * 70}>
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-surface-border bg-background p-4">
                  <div className="flex items-center gap-3">
                    <LogoBadge
                      imageUrl={role.imageUrl}
                      alt={pickText(role, "organization", locale)}
                      fallbackIcon={<Users size={16} />}
                    />
                    <div>
                      <p className="font-medium text-foreground">
                        {pickText(role, "role", locale)}
                      </p>
                      <p className="text-sm text-foreground/60">
                        {pickText(role, "organization", locale)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/60">
                    {formatDateRange(
                      role.startDate,
                      role.endDate,
                      role.isCurrent,
                      locale,
                      common("present")
                    )}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      ) : null}

      {awards.length > 0 ? (
        <div className="mb-14">
          <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold text-foreground">
            <Trophy size={18} /> {t("awards")}
          </h3>
          <div className="space-y-5">
            {awards.map((award) => (
              <Reveal key={award.id}>
                <div className="rounded-2xl border border-azure-200 bg-azure-50 p-6 dark:border-azure-900 dark:bg-azure-950/30">
                  <div className="flex items-center gap-2 text-azure-700 dark:text-azure-300">
                    <Medal size={18} />
                    {award.dateLabel ? (
                      <span className="text-sm font-semibold">{award.dateLabel}</span>
                    ) : null}
                  </div>
                  <h4 className="mt-2 text-lg font-semibold text-foreground">
                    {pickText(award, "title", locale)}
                  </h4>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground/80">
                    {pickText(award, "description", locale)}
                  </p>
                  {award.photosUrl ? (
                    <a
                      href={award.photosUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-sm font-semibold text-azure-700 hover:underline dark:text-azure-300"
                    >
                      {t("photos")}
                    </a>
                  ) : null}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      ) : null}

      {actions.length > 0 ? (
        <div className="mb-14">
          <h3 className="text-lg font-semibold text-foreground">{t("actions")}</h3>
          <p className="mb-5 mt-1 text-sm text-foreground/60">{t("actionsSubtitle")}</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {actions.map((action, idx) => {
              const links = decodeJsonList(action.instagramLinks);
              const images = decodeJsonList(action.images);
              const title = pickText(action, "title", locale);
              const roleKey = action.role in ROLE_ICONS ? action.role : "organizer";
              return (
                <Reveal key={action.id} delay={(idx % 3) * 80}>
                  <article className="lift-on-hover flex h-full flex-col overflow-hidden rounded-2xl border border-surface-border bg-background shadow-sm">
                    {images.length > 0 ? (
                      <ActionGallery images={images} alt={title} />
                    ) : links[0] ? (
                      <InstagramEmbed url={links[0]} fallbackLabel={t("viewOnInstagram")} />
                    ) : null}
                    <div className="flex flex-1 flex-col p-5">
                      <span className="mb-2.5 inline-flex w-fit items-center gap-1.5 rounded-full bg-azure-50 px-2.5 py-1 text-[11px] font-semibold text-azure-700 dark:bg-azure-950/40 dark:text-azure-300">
                        {ROLE_ICONS[roleKey]}
                        {t(`roleLabels.${roleKey}`)}
                      </span>
                      <h4 className="font-semibold text-foreground">{title}</h4>
                      <p
                        dir="auto"
                        className="mt-2 whitespace-pre-line text-sm text-foreground/70"
                      >
                        {action.captionOriginal}
                      </p>
                      {links.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {links.map((link, i) => (
                            <a
                              key={link}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-full border border-surface-border px-3 py-1.5 text-xs font-semibold text-azure-700 transition-colors hover:bg-azure-50 dark:text-azure-300 dark:hover:bg-azure-950/40"
                            >
                              {t("viewOnInstagram")}
                              {links.length > 1 ? ` ${i + 1}` : ""}
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      ) : null}

      {sponsors.length > 0 ? (
        <div>
          <h3 className="mb-5 text-lg font-semibold text-foreground">{t("sponsors")}</h3>
          <div className="flex flex-wrap items-center gap-4">
            {sponsors.map((sponsor) =>
              sponsor.logoUrl ? (
                <div
                  key={sponsor.id}
                  className="relative h-12 w-28 grayscale transition hover:grayscale-0"
                >
                  <Image
                    src={sponsor.logoUrl}
                    alt={sponsor.name}
                    fill
                    className="object-contain"
                    sizes="112px"
                  />
                </div>
              ) : (
                <span
                  key={sponsor.id}
                  className="rounded-full border border-surface-border bg-surface px-4 py-2 text-sm font-medium text-foreground/80"
                >
                  {sponsor.name}
                </span>
              )
            )}
          </div>
        </div>
      ) : null}
      </div>
    </section>
  );
}

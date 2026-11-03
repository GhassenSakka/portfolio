import { getTranslations } from "next-intl/server";
import { Award as AwardIcon, ExternalLink } from "lucide-react";
import { getCertifications } from "@/lib/content";
import { pickText, formatMonthYear } from "@/lib/locale-utils";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { LogoBadge } from "@/components/logo-badge";

export async function CertificationsSection({ locale }: { locale: string }) {
  const [t, certifications] = await Promise.all([
    getTranslations("Certifications"),
    getCertifications(),
  ]);
  if (certifications.length === 0) return null;

  return (
    <section id="certifications" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Reveal>
        <SectionHeading title={t("title")} />
      </Reveal>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((cert, idx) => (
          <Reveal key={cert.id} delay={(idx % 3) * 90}>
            <div className="lift-on-hover flex h-full flex-col gap-2 rounded-2xl border border-surface-border bg-background p-5 shadow-sm">
              <LogoBadge
                imageUrl={cert.imageUrl}
                alt={cert.issuer}
                fallbackIcon={<AwardIcon size={18} />}
              />
              <h3 className="font-semibold text-foreground">{pickText(cert, "name", locale)}</h3>
              <p className="text-sm text-foreground/60">
                {t("issuedBy")} {cert.issuer}
              </p>
              <p className="text-xs text-foreground/50">
                {cert.issuedAt ? `${t("issued")} ${formatMonthYear(cert.issuedAt, locale)}` : ""}
                {cert.expiresAt
                  ? ` · ${t("expires")} ${formatMonthYear(cert.expiresAt, locale)}`
                  : ""}
              </p>
              {cert.credentialId ? (
                <p className="text-xs text-foreground/50">
                  {t("credentialId")}: {cert.credentialId}
                </p>
              ) : null}
              {cert.linkUrl ? (
                <a
                  href={cert.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-azure-600 hover:underline dark:text-azure-300"
                >
                  <ExternalLink size={13} />
                </a>
              ) : null}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

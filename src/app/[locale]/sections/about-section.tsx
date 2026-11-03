import { getTranslations } from "next-intl/server";
import { getProfile } from "@/lib/content";
import { pickText } from "@/lib/locale-utils";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

export async function AboutSection({ locale }: { locale: string }) {
  const [t, profile] = await Promise.all([getTranslations("About"), getProfile()]);
  const about = profile ? pickText(profile, "about", locale) : "";
  if (!about) return null;

  return (
    <section id="about" className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <Reveal>
        <SectionHeading title={t("title")} />
        <p className="-mt-6 whitespace-pre-line text-base leading-relaxed text-foreground/80 sm:text-lg">
          {about}
        </p>
      </Reveal>
    </section>
  );
}

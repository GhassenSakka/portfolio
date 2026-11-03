import { getTranslations } from "next-intl/server";
import { Mail, Phone, MapPin } from "lucide-react";
import { getProfile } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { ContactForm } from "@/components/contact-form";

export async function ContactSection() {
  const [t, profile] = await Promise.all([getTranslations("Contact"), getProfile()]);

  return (
    <section id="contact" className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <Reveal>
        <SectionHeading title={t("title")} />
        <p className="-mt-6 mb-8 text-foreground/70">{t("subtitle")}</p>
      </Reveal>
      <Reveal delay={100}>
        <div className="relative rounded-2xl border border-surface-border bg-background p-6 shadow-sm sm:p-8">
          <ContactForm />
          {profile?.email1 || profile?.phone1 || profile?.location ? (
            <div className="mt-6 flex flex-wrap gap-5 border-t border-surface-border pt-5 text-sm text-foreground/70">
              {profile?.email1 ? (
                <a
                  href={`mailto:${profile.email1}`}
                  className="inline-flex items-center gap-1.5 hover:text-azure-600 dark:hover:text-azure-300"
                >
                  <Mail size={14} /> {profile.email1}
                </a>
              ) : null}
              {profile?.phone1 ? (
                <a
                  href={`tel:${profile.phone1.replace(/\s+/g, "")}`}
                  className="inline-flex items-center gap-1.5 hover:text-azure-600 dark:hover:text-azure-300"
                >
                  <Phone size={14} /> {profile.phone1}
                </a>
              ) : null}
              {profile?.location ? (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} /> {profile.location}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </Reveal>
    </section>
  );
}

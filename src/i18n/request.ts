import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { mergeUiTexts } from "@/lib/ui-text";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = routing.locales.includes(requested as (typeof routing.locales)[number])
    ? (requested as (typeof routing.locales)[number])
    : routing.defaultLocale;

  const baseMessages = (await import(`../messages/${locale}.json`)).default;

  return {
    locale,
    messages: await mergeUiTexts(baseMessages, locale),
  };
});

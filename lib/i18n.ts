export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** A field that exists in both languages. */
export type I18nText = Record<Locale, string>;
export type I18nList = Record<Locale, string[]>;

export function t<T>(value: Record<Locale, T>, locale: Locale): T {
  return value[locale];
}

export const localeNames: Record<Locale, string> = {
  fr: "Français",
  en: "English",
};

/** Swap the locale segment of a pathname, keeping the rest of the route. */
export function switchLocalePath(pathname: string, next: Locale) {
  const segments = pathname.split("/");
  if (segments.length > 1 && isLocale(segments[1])) {
    segments[1] = next;
    return segments.join("/") || `/${next}`;
  }
  return `/${next}`;
}

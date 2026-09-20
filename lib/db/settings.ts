import "@/lib/db/seed";
import { db } from "@/lib/db/client";
import { site as defaults } from "@/lib/site";

/**
 * Same shape as `site` in lib/site.ts, but with plain `string` fields — the
 * static object is `as const` for literal defaults, values coming out of the
 * database are not.
 */
export type SiteSettings = {
  name: string;
  fullName: string;
  founder: string;
  city: string;
  country: { fr: string; en: string };
  street: { fr: string; en: string };
  postalCity: { fr: string; en: string };
  phoneDisplay: string;
  phoneHref: string;
  whatsappDisplay: string;
  whatsappNumber: string;
  email: string;
  coordinates: string;
  mapQuery: string;
  social: { instagram: string; linkedin: string };
  url: string;
  ordreNumber: string;
  areaServed: readonly string[];
  hasLogoAsset: boolean;
  gold: string;
  bio: { fr: string[]; en: string[] };
  portrait: string | null;
};

type SettingsRow = {
  full_name: string;
  founder: string;
  city: string;
  street_fr: string;
  street_en: string;
  postal_city_fr: string;
  postal_city_en: string;
  phone_display: string;
  phone_href: string;
  whatsapp_display: string;
  whatsapp_number: string;
  email: string;
  coordinates: string;
  map_query: string;
  instagram: string;
  linkedin: string;
  ordre_number: string;
  bio_fr: string;
  bio_en: string;
  portrait: string | null;
};

function fromRow(row: SettingsRow): SiteSettings {
  return {
    ...defaults,
    fullName: row.full_name,
    founder: row.founder,
    city: row.city,
    street: { fr: row.street_fr, en: row.street_en },
    postalCity: { fr: row.postal_city_fr, en: row.postal_city_en },
    phoneDisplay: row.phone_display,
    phoneHref: row.phone_href,
    whatsappDisplay: row.whatsapp_display,
    whatsappNumber: row.whatsapp_number,
    email: row.email,
    coordinates: row.coordinates,
    mapQuery: row.map_query,
    social: { instagram: row.instagram, linkedin: row.linkedin },
    ordreNumber: row.ordre_number,
    bio: { fr: JSON.parse(row.bio_fr), en: JSON.parse(row.bio_en) },
    portrait: row.portrait,
  };
}

export function getSettingsRaw(): SiteSettings {
  const row = db
    .prepare("SELECT * FROM site_settings WHERE id = 1")
    .get() as SettingsRow;
  return fromRow(row);
}

export type SettingsInput = Omit<SiteSettings, "name" | "country" | "areaServed" | "hasLogoAsset" | "gold" | "url">;

export function updateSettingsRaw(s: SettingsInput) {
  db.prepare(`
    UPDATE site_settings SET
      full_name = @full_name, founder = @founder, city = @city,
      street_fr = @street_fr, street_en = @street_en,
      postal_city_fr = @postal_city_fr, postal_city_en = @postal_city_en,
      phone_display = @phone_display, phone_href = @phone_href,
      whatsapp_display = @whatsapp_display, whatsapp_number = @whatsapp_number,
      email = @email, coordinates = @coordinates, map_query = @map_query,
      instagram = @instagram, linkedin = @linkedin, ordre_number = @ordre_number,
      bio_fr = @bio_fr, bio_en = @bio_en, portrait = @portrait
    WHERE id = 1
  `).run({
    full_name: s.fullName,
    founder: s.founder,
    city: s.city,
    street_fr: s.street.fr,
    street_en: s.street.en,
    postal_city_fr: s.postalCity.fr,
    postal_city_en: s.postalCity.en,
    phone_display: s.phoneDisplay,
    phone_href: s.phoneHref,
    whatsapp_display: s.whatsappDisplay,
    whatsapp_number: s.whatsappNumber,
    email: s.email,
    coordinates: s.coordinates,
    map_query: s.mapQuery,
    instagram: s.social.instagram,
    linkedin: s.social.linkedin,
    ordre_number: s.ordreNumber,
    bio_fr: JSON.stringify(s.bio.fr),
    bio_en: JSON.stringify(s.bio.en),
    portrait: s.portrait,
  });
}

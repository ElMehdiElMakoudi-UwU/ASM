import { projects as seedProjects } from "@/content/projects";
import { dict } from "@/content/dictionary";
import { site } from "@/lib/site";
import { db } from "@/lib/db/client";

/**
 * First boot only: copies the hand-written portfolio and practice details
 * into the database, so nothing already correct in the codebase is lost.
 * Every run after that is a no-op because the tables are no longer empty.
 */
export function seedIfEmpty() {
  const projectCount = (
    db.prepare("SELECT COUNT(*) AS n FROM projects").get() as { n: number }
  ).n;

  if (projectCount === 0) {
    const insert = db.prepare(`
      INSERT INTO projects (
        slug, ref, title, category, programme_fr, programme_en,
        location_fr, location_en, year, frame_fr, frame_en, role_fr, role_en,
        summary_fr, summary_en, body_fr, body_en, cover, gallery, featured, sort_order
      ) VALUES (
        @slug, @ref, @title, @category, @programme_fr, @programme_en,
        @location_fr, @location_en, @year, @frame_fr, @frame_en, @role_fr, @role_en,
        @summary_fr, @summary_en, @body_fr, @body_en, @cover, @gallery, @featured, @sort_order
      )
    `);
    const insertMany = db.transaction((rows: typeof seedProjects) => {
      rows.forEach((p, i) => {
        insert.run({
          slug: p.slug,
          ref: p.ref,
          title: p.title,
          category: p.category,
          programme_fr: p.programme.fr,
          programme_en: p.programme.en,
          location_fr: p.location.fr,
          location_en: p.location.en,
          year: p.year,
          frame_fr: p.frame.fr,
          frame_en: p.frame.en,
          role_fr: p.role.fr,
          role_en: p.role.en,
          summary_fr: p.summary.fr,
          summary_en: p.summary.en,
          body_fr: JSON.stringify(p.body.fr),
          body_en: JSON.stringify(p.body.en),
          cover: p.cover,
          gallery: JSON.stringify(p.gallery),
          featured: p.featured ? 1 : 0,
          sort_order: i,
        });
      });
    });
    insertMany(seedProjects);
  }

  const settingsRow = db
    .prepare("SELECT id FROM site_settings WHERE id = 1")
    .get();

  if (!settingsRow) {
    db.prepare(`
      INSERT INTO site_settings (
        id, full_name, founder, city, street_fr, street_en,
        postal_city_fr, postal_city_en, phone_display, phone_href,
        whatsapp_display, whatsapp_number, email, coordinates, map_query,
        instagram, linkedin, ordre_number, bio_fr, bio_en, portrait
      ) VALUES (
        1, @full_name, @founder, @city, @street_fr, @street_en,
        @postal_city_fr, @postal_city_en, @phone_display, @phone_href,
        @whatsapp_display, @whatsapp_number, @email, @coordinates, @map_query,
        @instagram, @linkedin, @ordre_number, @bio_fr, @bio_en, @portrait
      )
    `).run({
      full_name: site.fullName,
      founder: site.founder,
      city: site.city,
      street_fr: site.street.fr,
      street_en: site.street.en,
      postal_city_fr: site.postalCity.fr,
      postal_city_en: site.postalCity.en,
      phone_display: site.phoneDisplay,
      phone_href: site.phoneHref,
      whatsapp_display: site.whatsappDisplay,
      whatsapp_number: site.whatsappNumber,
      email: site.email,
      coordinates: site.coordinates,
      map_query: site.mapQuery,
      instagram: site.social.instagram,
      linkedin: site.social.linkedin,
      ordre_number: site.ordreNumber,
      bio_fr: JSON.stringify(dict.studio.bio.fr),
      bio_en: JSON.stringify(dict.studio.bio.en),
      portrait: "/souhail-mharrech.jpg",
    });
  }
}

seedIfEmpty();

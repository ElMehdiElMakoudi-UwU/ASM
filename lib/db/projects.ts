import "@/lib/db/seed";
import { db } from "@/lib/db/client";
import type { Category, GalleryItem, Project } from "@/content/projects";

type ProjectRow = {
  slug: string;
  ref: string;
  title: string;
  category: Category;
  programme_fr: string;
  programme_en: string;
  location_fr: string;
  location_en: string;
  year: string;
  frame_fr: string;
  frame_en: string;
  role_fr: string;
  role_en: string;
  summary_fr: string;
  summary_en: string;
  body_fr: string;
  body_en: string;
  cover: string | null;
  gallery: string;
  featured: number;
  sort_order: number;
};

function fromRow(row: ProjectRow): Project {
  return {
    slug: row.slug,
    ref: row.ref,
    title: row.title,
    category: row.category,
    programme: { fr: row.programme_fr, en: row.programme_en },
    location: { fr: row.location_fr, en: row.location_en },
    year: row.year,
    frame: { fr: row.frame_fr, en: row.frame_en },
    role: { fr: row.role_fr, en: row.role_en },
    summary: { fr: row.summary_fr, en: row.summary_en },
    body: { fr: JSON.parse(row.body_fr), en: JSON.parse(row.body_en) },
    cover: row.cover,
    gallery: JSON.parse(row.gallery),
    featured: !!row.featured,
  };
}

export function listProjectsRaw(): Project[] {
  const rows = db
    .prepare("SELECT * FROM projects ORDER BY sort_order ASC")
    .all() as ProjectRow[];
  return rows.map(fromRow);
}

export function getProjectRaw(slug: string): Project | undefined {
  const row = db.prepare("SELECT * FROM projects WHERE slug = ?").get(slug) as
    | ProjectRow
    | undefined;
  return row ? fromRow(row) : undefined;
}

export type ProjectInput = Omit<Project, "slug"> & { slug: string };

function toParams(p: ProjectInput) {
  return {
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
    gallery: JSON.stringify(p.gallery satisfies GalleryItem[]),
    featured: p.featured ? 1 : 0,
  };
}

export function createProjectRaw(p: ProjectInput) {
  const maxOrder = (
    db.prepare("SELECT COALESCE(MAX(sort_order), -1) AS n FROM projects").get() as {
      n: number;
    }
  ).n;
  db.prepare(`
    INSERT INTO projects (
      slug, ref, title, category, programme_fr, programme_en,
      location_fr, location_en, year, frame_fr, frame_en, role_fr, role_en,
      summary_fr, summary_en, body_fr, body_en, cover, gallery, featured, sort_order
    ) VALUES (
      @slug, @ref, @title, @category, @programme_fr, @programme_en,
      @location_fr, @location_en, @year, @frame_fr, @frame_en, @role_fr, @role_en,
      @summary_fr, @summary_en, @body_fr, @body_en, @cover, @gallery, @featured, @sort_order
    )
  `).run({ ...toParams(p), sort_order: maxOrder + 1 });
}

export function updateProjectRaw(originalSlug: string, p: ProjectInput) {
  db.prepare(`
    UPDATE projects SET
      slug = @slug, ref = @ref, title = @title, category = @category,
      programme_fr = @programme_fr, programme_en = @programme_en,
      location_fr = @location_fr, location_en = @location_en, year = @year,
      frame_fr = @frame_fr, frame_en = @frame_en, role_fr = @role_fr, role_en = @role_en,
      summary_fr = @summary_fr, summary_en = @summary_en,
      body_fr = @body_fr, body_en = @body_en,
      cover = @cover, gallery = @gallery, featured = @featured
    WHERE slug = @originalSlug
  `).run({ ...toParams(p), originalSlug });
}

export function deleteProjectRaw(slug: string) {
  db.prepare("DELETE FROM projects WHERE slug = ?").run(slug);
}

export function reorderProjectsRaw(slugs: string[]) {
  const update = db.prepare("UPDATE projects SET sort_order = ? WHERE slug = ?");
  const run = db.transaction((ordered: string[]) => {
    ordered.forEach((slug, i) => update.run(i, slug));
  });
  run(slugs);
}

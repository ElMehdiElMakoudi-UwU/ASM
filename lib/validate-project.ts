import { categories } from "@/content/projects";
import type { ProjectInput } from "@/lib/db/projects";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Throws a plain string message on the first invalid field. */
export function parseProjectInput(body: unknown): ProjectInput {
  if (typeof body !== "object" || body === null) throw "Invalid payload";
  const b = body as Record<string, unknown>;

  const slug = String(b.slug ?? "").trim();
  if (!SLUG_RE.test(slug)) {
    throw "Slug must be lowercase letters, numbers and hyphens only";
  }

  const title = String(b.title ?? "").trim();
  if (title.length < 1) throw "Title is required";

  const category = String(b.category ?? "");
  if (!(categories as readonly string[]).includes(category)) {
    throw "Invalid category";
  }

  const i18n = (value: unknown, field: string): { fr: string; en: string } => {
    const v = value as { fr?: unknown; en?: unknown } | undefined;
    if (!v || typeof v.fr !== "string" || typeof v.en !== "string") {
      throw `${field} needs both French and English text`;
    }
    return { fr: v.fr, en: v.en };
  };

  const i18nList = (value: unknown, field: string): { fr: string[]; en: string[] } => {
    const v = value as { fr?: unknown; en?: unknown } | undefined;
    if (!v || !Array.isArray(v.fr) || !Array.isArray(v.en)) {
      throw `${field} needs both French and English paragraphs`;
    }
    return {
      fr: v.fr.filter((x): x is string => typeof x === "string" && x.trim() !== ""),
      en: v.en.filter((x): x is string => typeof x === "string" && x.trim() !== ""),
    };
  };

  const gallery = Array.isArray(b.gallery)
    ? b.gallery.map((item) => {
        const g = item as Record<string, unknown>;
        return {
          src: typeof g.src === "string" && g.src ? g.src : null,
          shape: g.shape === "tall" ? ("tall" as const) : ("wide" as const),
          caption: i18n(g.caption, "Gallery caption"),
        };
      })
    : [];

  return {
    slug,
    ref: String(b.ref ?? "").trim(),
    title,
    category: category as ProjectInput["category"],
    programme: i18n(b.programme, "Programme"),
    location: i18n(b.location, "Location"),
    year: String(b.year ?? "").trim(),
    frame: i18n(b.frame, "Frame"),
    role: i18n(b.role, "Role"),
    summary: i18n(b.summary, "Summary"),
    body: i18nList(b.body, "Body"),
    cover: typeof b.cover === "string" && b.cover ? b.cover : null,
    gallery,
    featured: Boolean(b.featured),
  };
}

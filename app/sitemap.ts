import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { locales } from "@/lib/i18n";
import { site } from "@/lib/site";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? site.url;

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/projects", "/services", "/studio", "/contact"];
  const now = new Date();

  const staticEntries = locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: page === "" ? 1 : 0.8,
    })),
  );

  const projectEntries = locales.flatMap((locale) =>
    projects.map((project) => ({
      url: `${baseUrl}/${locale}/projects/${project.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  );

  return [...staticEntries, ...projectEntries];
}

import { unstable_cache } from "next/cache";
import {
  getProjectRaw,
  listProjectsRaw,
} from "@/lib/db/projects";
import { getSettingsRaw } from "@/lib/db/settings";

/**
 * Public-site reads, cached and tagged so pages stay fast without a rebuild.
 * Admin mutations call revalidateTag("projects") / revalidateTag("settings")
 * so the cache is invalidated the instant something changes.
 */
export const listProjects = unstable_cache(
  async () => listProjectsRaw(),
  ["projects-list"],
  { tags: ["projects"] },
);

export const getProject = unstable_cache(
  async (slug: string) => getProjectRaw(slug),
  ["project-by-slug"],
  { tags: ["projects"] },
);

export const getFeaturedProjects = unstable_cache(
  async () => listProjectsRaw().filter((p) => p.featured),
  ["projects-featured"],
  { tags: ["projects"] },
);

export const getSettings = unstable_cache(
  async () => getSettingsRaw(),
  ["site-settings"],
  { tags: ["settings"] },
);

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Frame } from "@/components/frame";
import { dict } from "@/content/dictionary";
import {
  categories,
  categoryLabels,
  type Category,
  type Project,
} from "@/content/projects";
import type { Locale } from "@/lib/i18n";

/**
 * The register: the atelier's own way of listing work — a drawing schedule,
 * not a card grid. Hovering a row brings the project up in the preview well.
 */
export function ProjectRegister({
  projects,
  locale,
}: {
  projects: Project[];
  locale: Locale;
}) {
  const [filter, setFilter] = useState<Category | "all">("all");
  const [activeSlug, setActiveSlug] = useState(projects[0]?.slug ?? "");

  const usedCategories = useMemo(
    () => categories.filter((cat) => projects.some((p) => p.category === cat)),
    [projects],
  );

  const shown = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.category === filter)),
    [filter, projects],
  );

  const active = shown.find((p) => p.slug === activeSlug) ?? shown[0];

  function applyFilter(next: Category | "all") {
    setFilter(next);
    const first =
      next === "all" ? projects[0] : projects.find((p) => p.category === next);
    if (first) setActiveSlug(first.slug);
  }

  const c = dict.projects.columns;

  return (
    <div>
      {/* Filters */}
      <div className="border-y border-rule py-4">
        <div
          className="flex flex-wrap items-center gap-x-6 gap-y-3"
          role="group"
          aria-label={dict.projects.filterLabel[locale]}
        >
          <FilterButton
            active={filter === "all"}
            onClick={() => applyFilter("all")}
            label={dict.projects.filterAll[locale]}
            count={projects.length}
          />
          {usedCategories.map((cat) => (
            <FilterButton
              key={cat}
              active={filter === cat}
              onClick={() => applyFilter(cat)}
              label={categoryLabels[cat][locale]}
              count={projects.filter((p) => p.category === cat).length}
            />
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="prose-asm py-20">
          <span>{dict.projects.empty[locale]}</span>
        </p>
      ) : (
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Rows */}
          <div className="lg:col-span-8">
            <div className="hidden grid-cols-[4.5rem_minmax(0,1fr)_11rem_4rem] gap-4 border-b border-rule py-3 lg:grid">
              <span className="label">{c.ref[locale]}</span>
              <span className="label">{c.project[locale]}</span>
              <span className="label">{c.programme[locale]}</span>
              <span className="label text-right">{c.year[locale]}</span>
            </div>

            <ul>
              {shown.map((project) => {
                const isActive = active?.slug === project.slug;
                return (
                  <li key={project.slug} className="border-b border-rule">
                    <Link
                      href={`/${locale}/projects/${project.slug}`}
                      onMouseEnter={() => setActiveSlug(project.slug)}
                      onFocus={() => setActiveSlug(project.slug)}
                      className="group block py-6 lg:py-0"
                    >
                      {/* Mobile: image sits with the row. */}
                      <Frame
                        src={project.cover}
                        alt={project.title}
                        seed={project.slug}
                        className="mb-5 aspect-[4/3] lg:hidden"
                        sizes="100vw"
                      />

                      <div className="lg:grid lg:grid-cols-[4.5rem_minmax(0,1fr)_11rem_4rem] lg:items-center lg:gap-4 lg:py-7">
                        <span
                          className={`data block text-graphite transition-colors lg:text-[0.75rem] ${
                            isActive ? "lg:text-ink" : ""
                          }`}
                        >
                          {project.ref}
                        </span>

                        <span className="mt-2 block lg:mt-0">
                          <span
                            className={`display block text-[1.75rem] leading-none transition-transform duration-500 lg:text-[2.125rem] ${
                              isActive ? "lg:translate-x-2" : ""
                            }`}
                          >
                            {project.title}
                          </span>
                          <span className="mt-2 block text-[0.9rem] text-graphite lg:hidden">
                            {project.programme[locale]} · {project.location[locale]} ·{" "}
                            {project.year}
                          </span>
                        </span>

                        <span className="hidden text-[0.9rem] text-graphite lg:block">
                          {project.programme[locale]}
                        </span>

                        <span className="data hidden text-right text-graphite lg:block">
                          {project.year}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <p className="label mt-6">
              {shown.length}{" "}
              {shown.length === 1
                ? dict.projects.countOne[locale]
                : dict.projects.count[locale]}
            </p>
          </div>

          {/* Preview well */}
          <div className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-32">
              <div className="relative aspect-[3/4] overflow-hidden bg-paper-dim">
                {shown.map((project) => (
                  <div
                    key={project.slug}
                    className="absolute inset-0 transition-opacity duration-700"
                    style={{ opacity: active?.slug === project.slug ? 1 : 0 }}
                    aria-hidden={active?.slug !== project.slug}
                  >
                    <Frame
                      src={project.cover}
                      alt={project.title}
                      seed={project.slug}
                      className="h-full w-full"
                      sizes="33vw"
                    />
                  </div>
                ))}
              </div>

              {active && (
                <dl className="mt-6 space-y-0">
                  <PreviewRow
                    label={dict.project.location[locale]}
                    value={active.location[locale]}
                  />
                  <PreviewRow
                    label={dict.project.frame[locale]}
                    value={active.frame[locale]}
                  />
                  <PreviewRow
                    label={dict.project.year[locale]}
                    value={active.year}
                    mono
                  />
                </dl>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`label link-underline ${active ? "label-ink" : "hover:text-ink"}`}
    >
      {label}
      <sup className="ml-1 opacity-50">{count}</sup>
    </button>
  );
}

function PreviewRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-rule py-3">
      <dt className="label">{label}</dt>
      <dd className={`text-right text-[0.9rem] ${mono ? "data" : ""}`}>{value}</dd>
    </div>
  );
}

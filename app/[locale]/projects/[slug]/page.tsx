import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Frame } from "@/components/frame";
import { Reveal } from "@/components/reveal";
import { dict } from "@/content/dictionary";
import { categoryLabels, getProject, projects } from "@/content/projects";
import { isLocale, locales, type Locale } from "@/lib/i18n";

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    projects.map((project) => ({ locale, slug: project.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const l: Locale = isLocale(locale) ? locale : "fr";
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary[l],
    alternates: {
      canonical: `/${l}/projects/${slug}`,
      languages: { fr: `/fr/projects/${slug}`, en: `/en/projects/${slug}` },
    },
    openGraph: {
      title: project.title,
      description: project.summary[l],
      type: "article",
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fr";
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const p = dict.project;

  const facts: { label: string; value: string; mono?: boolean }[] = [
    { label: p.ref[locale], value: project.ref, mono: true },
    { label: p.programme[locale], value: project.programme[locale] },
    { label: p.location[locale], value: project.location[locale] },
    { label: p.frame[locale], value: project.frame[locale] },
    { label: p.role[locale], value: project.role[locale] },
    { label: p.year[locale], value: project.year, mono: true },
  ];

  return (
    <article className="pb-28">
      {/*
        The opening is the mark: an aperture with two jambs and a lintel, open
        at the bottom where the ink band ends and the page proper begins. You
        enter the project through the portal.
      */}
      <header data-surface="dark" className="bg-ink text-paper">
        <div className="shell pt-32 md:pt-40">
          <Link
            href={`/${locale}/projects`}
            className="label link-underline text-graphite-light"
          >
            ← {p.backToProjects[locale]}
          </Link>
        </div>

        <div className="shell mt-10 grid items-end gap-12 md:mt-12 md:grid-cols-12">
          <div className="md:col-span-6 md:pb-20">
            <p className="label text-gold">
              {categoryLabels[project.category][locale]}
            </p>
            <h1 className="display display-lg mt-4">{project.title}</h1>
            <p className="mt-7 max-w-[38ch] text-[1.0625rem] leading-relaxed text-graphite-light">
              {project.summary[locale]}
            </p>
          </div>

          <div className="md:col-span-5 md:col-start-8">
            <Frame
              src={project.cover}
              alt={project.title}
              seed={project.slug}
              className="aspect-[4/5] max-h-[60svh] border-x-2 border-t-2 border-gold"
              sizes="(min-width: 768px) 42vw, 100vw"
              priority
            />
          </div>
        </div>
      </header>

      <div className="shell mt-16 grid gap-12 md:mt-24 md:grid-cols-12">
        <Reveal className="md:col-span-4">
          <h2 className="label">{p.facts[locale]}</h2>
          <dl className="mt-6">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="flex items-baseline justify-between gap-6 border-b border-rule py-3"
              >
                <dt className="label">{fact.label}</dt>
                <dd className={`text-right text-[0.9375rem] ${fact.mono ? "data" : ""}`}>
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal className="prose-asm md:col-span-7 md:col-start-6" delay={80}>
          {project.body[locale].map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </Reveal>
      </div>

      {/* Gallery */}
      <div className="shell mt-20 grid gap-x-8 gap-y-12 md:mt-28 md:grid-cols-12">
        {project.gallery.map((item, i) => (
          <Reveal
            key={i}
            className={item.shape === "wide" ? "md:col-span-12" : "md:col-span-6"}
            delay={(i % 2) * 90}
          >
            <figure>
              <Frame
                src={item.src}
                alt={item.caption[locale]}
                seed={`${project.slug}-${i}`}
                className={item.shape === "wide" ? "aspect-[16/9]" : "aspect-[4/5]"}
                sizes={item.shape === "wide" ? "100vw" : "(min-width: 768px) 48vw, 100vw"}
              />
              <figcaption className="label mt-4">{item.caption[locale]}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      {/* Neighbours in the register */}
      <nav
        className="shell mt-24 grid gap-6 border-t border-rule pt-8 md:mt-32 md:grid-cols-2"
        aria-label={dict.nav.projects[locale]}
      >
        <Link href={`/${locale}/projects/${previous.slug}`} className="group">
          <span className="label">← {p.previous[locale]}</span>
          <span className="display mt-2 block text-[1.75rem] leading-tight">
            {previous.title}
          </span>
        </Link>
        <Link
          href={`/${locale}/projects/${next.slug}`}
          className="group md:text-right"
        >
          <span className="label">{p.next[locale]} →</span>
          <span className="display mt-2 block text-[1.75rem] leading-tight">
            {next.title}
          </span>
        </Link>
      </nav>
    </article>
  );
}

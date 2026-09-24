import Link from "next/link";
import { Frame } from "@/components/frame";
import { ManifestoBuilding, PortalReveal, ThresholdPass } from "@/components/form-scenes";
import { Reveal } from "@/components/reveal";
import { dict, services } from "@/content/dictionary";
import { categoryLabels } from "@/content/projects";
import type { Project } from "@/content/projects";
import { getFeaturedProjects, getSettings } from "@/lib/data";
import { isLocale, type Locale } from "@/lib/i18n";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fr";
  const h = dict.home;
  const [site, featuredProjects] = await Promise.all([
    getSettings(),
    getFeaturedProjects(),
  ]);
  const [first, second, third, fourth] = featuredProjects;

  return (
    <>
      {/* ---- Hero ---------------------------------------------------- */}
      <section
        data-surface="dark"
        className="relative flex h-[100svh] min-h-[36rem] flex-col justify-end overflow-hidden bg-ink text-paper"
      >
        <div className="absolute inset-0">
          <Frame
            src="/hero.jpg"
            alt=""
            seed="lumiere-tanger"
            className="h-full w-full"
            imageClassName="kenburns"
            sizes="100vw"
            priority
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(12,13,14,0.42) 0%, rgba(12,13,14,0.06) 34%, rgba(12,13,14,0.55) 72%, rgba(12,13,14,0.86) 100%)",
          }}
        />

        <div className="shell relative pb-14 md:pb-20">
          <p className="label rise text-gold" style={{ animationDelay: "160ms" }}>
            {site.city} · {site.coordinates}
          </p>

          <h1
            className="display display-xl rise mt-6 max-w-[16ch]"
            style={{ animationDelay: "280ms" }}
          >
            {h.heroDisplay[locale]}
          </h1>

          <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p
              className="rise max-w-[46ch] text-[1.0625rem] leading-relaxed text-paper/80"
              style={{ animationDelay: "420ms" }}
            >
              {h.heroLead[locale]}
            </p>
            <Link
              href={`/${locale}/projects`}
              className="btn btn-paper rise shrink-0"
              style={{ animationDelay: "540ms" }}
            >
              {h.heroCta[locale]}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Approach ------------------------------------------------ */}
      <section id="approach" className="shell py-24 md:py-36">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <Reveal>
              <p className="label">{h.manifestoLabel[locale]}</p>
            </Reveal>
            {/* The mark's forms, building a house as you read. */}
            <ManifestoBuilding className="mt-14 hidden w-full max-w-[13rem] md:block" />
          </div>
          <Reveal className="md:col-span-9" delay={80}>
            <p className="display display-md max-w-[22ch]">{h.manifesto[locale][0]}</p>
            <p className="mt-10 max-w-[58ch] text-[1.0625rem] leading-relaxed text-graphite">
              {h.manifesto[locale][1]}
            </p>
            <Link
              href={`/${locale}/studio`}
              className="label link-underline label-ink mt-10 inline-block"
            >
              {h.manifestoLink[locale]} →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---- Selected work ------------------------------------------- */}
      <section id="work" className="shell border-t border-rule py-20 md:py-28">
        <div className="flex items-baseline justify-between gap-6">
          <div>
            <p className="label">{h.selectedLabel[locale]}</p>
            <h2 className="display display-md mt-4">{h.selectedTitle[locale]}</h2>
          </div>
          <Link
            href={`/${locale}/projects`}
            className="label link-underline label-ink hidden shrink-0 md:inline-block"
          >
            {h.allProjects[locale]} →
          </Link>
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-20 md:grid-cols-12">
          {first && (
            <Reveal className="md:col-span-7">
              <ProjectTile project={first} locale={locale} ratio="aspect-[4/3]" sizes="(min-width: 768px) 58vw, 100vw" />
            </Reveal>
          )}
          {second && (
            <Reveal className="md:col-span-4 md:col-start-9 md:mt-28" delay={120}>
              <ProjectTile project={second} locale={locale} ratio="aspect-[3/4]" sizes="(min-width: 768px) 33vw, 100vw" />
            </Reveal>
          )}
          {third && (
            <Reveal className="md:col-span-12" delay={60}>
              <ProjectTile project={third} locale={locale} ratio="aspect-[16/9] md:aspect-[21/9]" sizes="100vw" wideMeta />
            </Reveal>
          )}
          {fourth && (
            <Reveal className="md:col-span-5 md:col-start-4" delay={120}>
              <ProjectTile project={fourth} locale={locale} ratio="aspect-[4/3]" sizes="(min-width: 768px) 42vw, 100vw" />
            </Reveal>
          )}
        </div>

        <Link
          href={`/${locale}/projects`}
          className="btn btn-ink mt-16 md:hidden"
        >
          {h.allProjects[locale]}
        </Link>
      </section>

      {/* ---- Practice ------------------------------------------------ */}
      <section id="practice" className="shell border-t border-rule py-24 md:py-32">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="label">{h.servicesLabel[locale]}</p>
            <h2 className="display display-md mt-4 max-w-[14ch]">
              {h.servicesTitle[locale]}
            </h2>
            <Link
              href={`/${locale}/services`}
              className="label link-underline label-ink mt-8 inline-block"
            >
              {dict.nav.services[locale]} →
            </Link>
          </div>

          <ul className="md:col-span-7 md:col-start-6">
            {services.map((service, i) => (
              <Reveal as="li" key={service.key} delay={i * 70}>
                <div className="border-t border-rule py-8 md:py-10">
                  <h3 className="display text-[1.5rem] leading-tight md:text-[1.75rem]">
                    {service.title[locale]}
                  </h3>
                  <p className="mt-3 max-w-[52ch] text-[0.9375rem] leading-relaxed text-graphite">
                    {service.body[locale]}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- Enquiry: through the portal ------------------------------ */}
      <ThresholdPass>
        <div className="shell flex flex-col gap-10 py-24 md:flex-row md:items-end md:justify-between md:py-32">
          <div>
            <h2 className="display display-lg max-w-[16ch]">{h.ctaTitle[locale]}</h2>
            <p className="mt-6 max-w-[42ch] text-[1.0625rem] leading-relaxed text-graphite-light">
              {h.ctaBody[locale]}
            </p>
          </div>
          <Link href={`/${locale}/contact`} className="btn btn-gold shrink-0">
            {h.ctaButton[locale]}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </ThresholdPass>
    </>
  );
}

function ProjectTile({
  project,
  locale,
  ratio,
  sizes,
  wideMeta = false,
}: {
  project: Project;
  locale: Locale;
  ratio: string;
  sizes: string;
  wideMeta?: boolean;
}) {
  return (
    <Link href={`/${locale}/projects/${project.slug}`} className="group block">
      {/* Seen through the portal's opening, widening as it scrolls up. */}
      <PortalReveal>
        <Frame
          src={project.cover}
          alt={project.title}
          seed={project.slug}
          className={ratio}
          imageClassName="transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
          sizes={sizes}
        />
      </PortalReveal>
      <div
        className={`mt-5 flex items-baseline gap-4 border-t border-rule pt-4 ${
          wideMeta ? "md:gap-10" : ""
        }`}
      >
        <span className="data text-graphite">{project.ref}</span>
        <span className="min-w-0 flex-1">
          <span className="display block text-[1.5rem] leading-tight md:text-[1.75rem]">
            {project.title}
          </span>
          <span className="mt-1 block text-[0.875rem] text-graphite">
            {categoryLabels[project.category][locale]} · {project.location[locale]}
          </span>
        </span>
        <span className="data shrink-0 text-graphite">{project.year}</span>
      </div>
    </Link>
  );
}

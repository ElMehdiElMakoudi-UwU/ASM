import type { Metadata } from "next";
import { ProjectRegister } from "@/components/project-register";
import { dict } from "@/content/dictionary";
import { listProjects } from "@/lib/data";
import { isLocale, locales, type Locale } from "@/lib/i18n";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : "fr";
  return {
    title: dict.projects.title[l],
    description: dict.projects.leadTouch[l],
    alternates: {
      canonical: `/${l}/projects`,
      languages: { fr: "/fr/projects", en: "/en/projects" },
    },
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fr";
  const projects = await listProjects();

  return (
    <section className="shell pb-28 pt-36 md:pt-44">
      <header className="grid gap-8 pb-12 md:grid-cols-12">
        <h1 className="display display-lg md:col-span-6">
          {dict.projects.title[locale]}
        </h1>
        <p className="max-w-[46ch] self-end text-[1.0625rem] leading-relaxed text-graphite md:col-span-5 md:col-start-8">
          <span className="hidden lg:inline">{dict.projects.lead[locale]}</span>
          <span className="lg:hidden">{dict.projects.leadTouch[locale]}</span>
        </p>
      </header>

      <ProjectRegister projects={projects} locale={locale} />
    </section>
  );
}

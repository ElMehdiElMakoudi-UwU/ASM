import type { Metadata } from "next";
import Link from "next/link";
import { Frame } from "@/components/frame";
import { Reveal } from "@/components/reveal";
import { dict, figures, principles } from "@/content/dictionary";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

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
    title: dict.studio.title[l],
    description: dict.studio.lead[l],
    alternates: {
      canonical: `/${l}/studio`,
      languages: { fr: "/fr/studio", en: "/en/studio" },
    },
  };
}

export default async function StudioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fr";
  const s = dict.studio;

  return (
    <>
      <section className="shell pb-16 pt-36 md:pt-44">
        <div className="grid gap-8 md:grid-cols-12">
          <h1 className="display display-lg md:col-span-6">{s.title[locale]}</h1>
          <p className="max-w-[46ch] self-end text-[1.0625rem] leading-relaxed text-graphite md:col-span-5 md:col-start-8">
            {s.lead[locale]}
          </p>
        </div>
      </section>

      <section className="shell grid gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <Frame
            src="/souhail-mharrech.jpg"
            alt={site.founder}
            seed="souhail-mharrech-portrait"
            className="aspect-[4/5]"
            sizes="(min-width: 768px) 42vw, 100vw"
          />
          <p className="label mt-4">
            {site.founder} — {s.founderRole[locale]}
          </p>
        </Reveal>

        <Reveal className="prose-asm self-center md:col-span-6 md:col-start-7" delay={90}>
          {s.bio[locale].map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </Reveal>
      </section>

      {/* Three rules held at once — a set, not a sequence. */}
      <section className="shell mt-24 border-t border-rule py-16 md:mt-32 md:py-24">
        <p className="label">{s.principlesLabel[locale]}</p>
        <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-3">
          {principles.map((principle, i) => (
            <Reveal key={principle.title.fr} delay={i * 90}>
              <h2 className="display display-md max-w-[10ch]">
                {principle.title[locale]}
              </h2>
              <p className="mt-5 text-[0.9375rem] leading-relaxed text-graphite">
                {principle.body[locale]}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="shell border-t border-rule py-16 md:py-20">
        <p className="label">{s.figuresLabel[locale]}</p>
        <dl className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4">
          {figures.map((figure) => (
            <div key={figure.label.fr} className="flex flex-col-reverse">
              <dt className="label mt-3">{figure.label[locale]}</dt>
              <dd className="display text-[3rem] leading-none md:text-[4rem]">
                {figure.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section data-surface="dark" className="bg-ink text-paper">
        <div className="shell flex flex-col gap-10 py-20 md:flex-row md:items-end md:justify-between md:py-28">
          <h2 className="display display-lg max-w-[16ch]">
            {dict.home.ctaTitle[locale]}
          </h2>
          <Link href={`/${locale}/contact`} className="btn btn-gold shrink-0">
            {dict.home.ctaButton[locale]}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Frame } from "@/components/frame";
import { Reveal } from "@/components/reveal";
import { dict, processStages, services } from "@/content/dictionary";
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
    title: dict.services.title[l],
    description: dict.services.lead[l],
    alternates: {
      canonical: `/${l}/services`,
      languages: { fr: "/fr/services", en: "/en/services" },
    },
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fr";
  const s = dict.services;

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

      <section className="shell">
        {services.map((service, i) => (
          <Reveal as="section" key={service.key} className="border-t border-rule">
            <div className="grid gap-8 py-14 md:grid-cols-12 md:py-20">
              <div className="md:col-span-4">
                <h2 className="display display-md">{service.title[locale]}</h2>
              </div>

              <div className="md:col-span-4">
                <p className="text-[1.0625rem] leading-relaxed text-graphite">
                  {service.body[locale]}
                </p>
              </div>

              <ul className="md:col-span-3 md:col-start-10">
                {service.includes[locale].map((item) => (
                  <li
                    key={item}
                    className="border-b border-rule py-2.5 text-[0.9375rem]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {i === 1 && (
              <Frame
                src="/projects/le-stade-05.jpg"
                alt=""
                seed={`practice-${service.key}`}
                className="mb-16 aspect-[21/9] w-full"
                sizes="100vw"
              />
            )}
          </Reveal>
        ))}
      </section>

      {/* A commission runs in this order, so the stages are numbered. */}
      <section className="shell border-t border-rule py-24 md:py-32">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="label">{s.processLabel[locale]}</p>
            <h2 className="display display-md mt-4 max-w-[12ch]">
              {s.processTitle[locale]}
            </h2>
            <p className="mt-8 max-w-[36ch] text-[0.9375rem] leading-relaxed text-graphite">
              {s.processNote[locale]}
            </p>
          </div>

          <ol className="md:col-span-7 md:col-start-6">
            {processStages.map((stage, i) => (
              <Reveal as="li" key={stage.title.fr} delay={i * 60}>
                <div className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-rule py-8 md:gap-8">
                  <span className="data pt-1 text-graphite-light">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                      <h3 className="display text-[1.5rem] leading-tight">
                        {stage.title[locale]}
                      </h3>
                      <span className="data text-graphite">{stage.duration[locale]}</span>
                    </div>
                    <p className="mt-3 max-w-[52ch] text-[0.9375rem] leading-relaxed text-graphite">
                      {stage.body[locale]}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
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

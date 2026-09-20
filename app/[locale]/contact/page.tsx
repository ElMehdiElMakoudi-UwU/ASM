import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { dict } from "@/content/dictionary";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { whatsappLink } from "@/lib/site";
import { getSettings } from "@/lib/data";

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
    title: dict.contact.title[l],
    description: dict.contact.lead[l],
    alternates: {
      canonical: `/${l}/contact`,
      languages: { fr: "/fr/contact", en: "/en/contact" },
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fr";
  const c = dict.contact;
  const site = await getSettings();

  return (
    <section className="shell pb-28 pt-36 md:pt-44">
      <div className="grid gap-8 pb-16 md:grid-cols-12">
        <h1 className="display display-lg md:col-span-6">{c.title[locale]}</h1>
        <p className="max-w-[46ch] self-end text-[1.0625rem] leading-relaxed text-graphite md:col-span-5 md:col-start-8">
          {c.lead[locale]}
        </p>
      </div>

      <div className="grid gap-16 border-t border-rule pt-14 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-7">
          <h2 className="label">{c.formTitle[locale]}</h2>
          <div className="mt-10">
            <ContactForm locale={locale} />
          </div>
        </div>

        <aside className="md:col-span-4 md:col-start-9">
          <a
            href={whatsappLink(c.whatsappPrefill[locale], site.whatsappNumber)}
            target="_blank"
            rel="noreferrer noopener"
            className="btn btn-ink w-full justify-center"
          >
            {c.whatsapp[locale]}
          </a>

          <dl className="mt-12">
            <ContactRow label={c.studioLabel[locale]}>
              {site.street[locale] && (
                <span className="block">{site.street[locale]}</span>
              )}
              <span className="block">{site.postalCity[locale]}</span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapQuery)}`}
                target="_blank"
                rel="noreferrer noopener"
                className="label link-underline mt-3 inline-block"
              >
                {c.mapLink[locale]} →
              </a>
            </ContactRow>

            <ContactRow label={c.phoneLabel[locale]}>
              <a href={`tel:${site.phoneHref}`} className="data link-underline block">
                {site.phoneDisplay}
              </a>
              <span className="data mt-1 block text-graphite">
                WhatsApp {site.whatsappDisplay}
              </span>
            </ContactRow>

            <ContactRow label={c.emailLabel[locale]}>
              <a href={`mailto:${site.email}`} className="link-underline">
                {site.email}
              </a>
            </ContactRow>

            <ContactRow label={c.hoursLabel[locale]}>
              {c.hours[locale].map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </ContactRow>
          </dl>
        </aside>
      </div>
    </section>
  );
}

function ContactRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-rule py-5">
      <dt className="label">{label}</dt>
      <dd className="mt-3 text-[0.9375rem] leading-relaxed text-graphite">{children}</dd>
    </div>
  );
}

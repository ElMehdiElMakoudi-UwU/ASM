import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteLoader } from "@/components/site-loader";
import { dict } from "@/content/dictionary";
import { getSettings } from "@/lib/data";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { noindex, site as siteDefaults } from "@/lib/site";
import "../globals.css";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const sans = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? siteDefaults.url;

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
  const site = await getSettings();

  const description =
    l === "fr"
      ? "Atelier d'architecture à Tanger. Architecture, intérieur, urbanisme et suivi de chantier dans tout le nord du Maroc."
      : "Architecture studio in Tangier. Architecture, interiors, urban planning and site supervision across northern Morocco.";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: `${site.fullName} — ${l === "fr" ? "Architecte à Tanger" : "Architects in Tangier"}`,
      template: `%s — ${site.name}`,
    },
    description,
    alternates: {
      canonical: `/${l}`,
      languages: { fr: "/fr", en: "/en", "x-default": "/fr" },
    },
    openGraph: {
      type: "website",
      siteName: site.fullName,
      locale: l === "fr" ? "fr_MA" : "en_US",
      title: `${site.fullName} — ${l === "fr" ? "Architecte à Tanger" : "Architects in Tangier"}`,
      description,
      url: `/${l}`,
    },
    robots: { index: !noindex, follow: !noindex },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const site = await getSettings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ArchitecturalService",
    name: site.fullName,
    alternateName: site.name,
    founder: { "@type": "Person", name: site.founder },
    url: baseUrl,
    email: site.email,
    telephone: site.phoneDisplay,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressCountry: "MA",
      ...(site.street[locale] ? { streetAddress: site.street[locale] } : {}),
    },
    areaServed: site.areaServed,
    sameAs: [site.social.instagram, site.social.linkedin].filter(Boolean),
  };

  return (
    <html
      lang={locale}
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <head>
        {/* Without scripting the reveal observer never runs, so the content
            below the fold must not stay hidden. */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {/* Runs before the header paints: hides the real logo for the same
            first-visit case where SiteLoader is about to run its threshold
            splash, so its animated stand-in is never doubled up with the
            real one underneath. Mirrors SiteLoader's own gate exactly. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(!sessionStorage.getItem("asm-threshold")&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.setAttribute("data-intro-active","")}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-3 focus:text-paper"
        >
          {dict.common.skipToContent[locale]}
        </a>
        <SiteLoader />
        <SiteHeader locale={locale} settings={site} />
        <main id="main">{children}</main>
        <SiteFooter locale={locale} settings={site} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}

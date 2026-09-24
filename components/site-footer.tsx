import Link from "next/link";
import { FooterMark } from "@/components/form-scenes";
import { dict } from "@/content/dictionary";
import type { Locale } from "@/lib/i18n";
import type { SiteSettings } from "@/lib/db/settings";

export function SiteFooter({
  locale,
  settings: site,
}: {
  locale: Locale;
  settings: SiteSettings;
}) {
  const year = new Date().getFullYear();

  const links = [
    { href: `/${locale}/projects`, label: dict.nav.projects[locale] },
    { href: `/${locale}/services`, label: dict.nav.services[locale] },
    { href: `/${locale}/studio`, label: dict.nav.studio[locale] },
    { href: `/${locale}/contact`, label: dict.nav.contact[locale] },
  ];

  return (
    <footer data-surface="dark" className="bg-ink text-paper">
      <div className="shell py-20 md:py-28">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <FooterMark />
            <p className="mt-5 text-[0.95rem] text-graphite-light">
              {site.fullName}
            </p>
            <p className="label mt-6 text-graphite-light">
              {dict.footer.tagline[locale]} · {site.coordinates}
            </p>
          </div>

          <nav className="md:col-span-3" aria-label={dict.footer.navLabel[locale]}>
            <p className="label text-gold">{dict.footer.navLabel[locale]}</p>
            <ul className="mt-5 space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="link-underline text-[0.95rem]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <p className="label text-gold">{dict.footer.contactLabel[locale]}</p>
            <ul className="mt-5 space-y-3 text-[0.95rem]">
              <li>
                <a href={`mailto:${site.email}`} className="link-underline">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={`tel:${site.phoneHref}`} className="link-underline data">
                  {site.phoneDisplay}
                </a>
              </li>
              <li className="pt-2 text-graphite-light">
                {site.street[locale] && (
                  <span className="block">{site.street[locale]}</span>
                )}
                <span className="block">{site.postalCity[locale]}</span>
              </li>
            </ul>
            <div className="mt-6 flex gap-5">
              {(
                [
                  ["Instagram", site.social.instagram],
                  ["LinkedIn", site.social.linkedin],
                ] as const
              )
                .filter(([, href]) => href)
                .map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="label link-underline text-paper"
                  >
                    {label}
                  </a>
                ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-rule-dark pt-6 text-graphite-light md:flex-row md:items-center md:justify-between">
          <p className="label">
            © {year} {site.fullName} — {dict.footer.rights[locale]}
          </p>
          {site.ordreNumber && <p className="label">{site.ordreNumber}</p>}
        </div>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { LOGO_INTRO_EVENT } from "@/components/site-loader";
import { dict } from "@/content/dictionary";
import { locales, switchLocalePath, type Locale } from "@/lib/i18n";
import type { SiteSettings } from "@/lib/db/settings";

export function SiteHeader({
  locale,
  settings: site,
}: {
  locale: Locale;
  settings: SiteSettings;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const overlay = isHome && !scrolled && !menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const links = [
    { href: `/${locale}/projects`, label: dict.nav.projects[locale] },
    { href: `/${locale}/services`, label: dict.nav.services[locale] },
    { href: `/${locale}/studio`, label: dict.nav.studio[locale] },
    { href: `/${locale}/contact`, label: dict.nav.contact[locale] },
  ];

  return (
    <header
      data-surface={overlay ? "dark" : undefined}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        overlay
          ? "bg-transparent text-paper"
          : "border-b border-rule bg-paper/92 text-ink backdrop-blur-md"
      }`}
    >
      {/* Keeps the overlay nav legible over any hero photograph. */}
      {overlay && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-32"
          style={{
            background:
              "linear-gradient(180deg, rgba(12,13,14,0.55) 0%, rgba(12,13,14,0) 100%)",
          }}
        />
      )}

      <div className="shell relative flex h-[4.5rem] items-center justify-between gap-6 md:h-20">
        <Link
          href={`/${locale}`}
          className="group flex items-baseline"
          aria-label={`${site.fullName} — ${dict.common.backHome[locale]}`}
          // Replays the full splash instead of the page-transition curtain.
          data-no-transition
          onClick={() => {
            // From another page, clicking the logo replays the full
            // threshold splash (SiteLoader listens for this) instead of
            // the quick door-leaf cut every other in-app link gets.
            if (!isHome) {
              window.dispatchEvent(new Event(LOGO_INTRO_EVENT));
            }
          }}
        >
          {/* Hidden by the inline script in <head> while the first-visit
              threshold splash is running, so its own animated stand-in is
              the only "logo" on screen until it hands off here. */}
          <span data-logo-content className="flex items-baseline gap-3">
            <Logo height={22} onDark={overlay} />
            <span
              data-logo-name
              className="hidden text-[0.625rem] uppercase tracking-[0.22em] opacity-70 sm:inline"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {site.fullName}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex" aria-label={dict.footer.navLabel[locale]}>
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`label link-underline ${
                  overlay ? "text-paper" : active ? "label-ink" : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <LocaleSwitch locale={locale} pathname={pathname} overlay={overlay} />
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="label md:hidden"
          style={{ color: "inherit" }}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? dict.nav.close[locale] : dict.nav.menu[locale]}
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 top-[4.5rem] z-40 flex flex-col justify-between bg-paper px-5 pb-10 pt-8 text-ink md:hidden"
        >
          <nav className="flex flex-col" aria-label={dict.footer.navLabel[locale]}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="display display-md border-b border-rule py-5"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center justify-between">
            <LocaleSwitch locale={locale} pathname={pathname} overlay={false} />
            <a href={`mailto:${site.email}`} className="label link-underline">
              {site.email}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

function LocaleSwitch({
  locale,
  pathname,
  overlay,
}: {
  locale: Locale;
  pathname: string;
  overlay: boolean;
}) {
  return (
    <div className="flex items-center gap-2" aria-label={dict.footer.langLabel[locale]}>
      {locales.map((code, i) => (
        <span key={code} className="flex items-center gap-2">
          {i > 0 && <span className="label opacity-40">/</span>}
          <Link
            href={switchLocalePath(pathname, code)}
            hrefLang={code}
            aria-current={code === locale ? "true" : undefined}
            className={`label ${
              code === locale
                ? overlay
                  ? "text-paper"
                  : "label-ink"
                : "opacity-55 hover:opacity-100"
            }`}
          >
            {code.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  );
}

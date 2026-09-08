# ASM — Atelier Souhail Mharrech

Bilingual (FR/EN) website for an architecture studio in Tanger, Morocco.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## What is where

| Path | What it holds |
| --- | --- |
| `lib/site.ts` | Address, phone, WhatsApp, email, social links, registration number. **Start here.** |
| `content/projects.ts` | Every project — text, facts, gallery captions, image paths. |
| `content/dictionary.ts` | All interface copy in both languages, plus the service lines, the five commission stages, the working rules and the figures. |
| `app/globals.css` | The whole design system: colours, type roles, spacing, motion. |
| `components/placeholder.tsx` | The stand-in artwork used until real photography arrives. |
| `components/logo.tsx` | The wordmark. Reads the real vector once it is supplied. |

Routes live under `app/[locale]/`, so every page exists at `/fr/…` and `/en/…`.
A visitor landing on `/` is sent to the language their browser asks for.

## The content

The site is built from Souhail's own "Selected works 2026" portfolio: eight
projects, the studio biography, and the imagery — all extracted from that PDF
and rewritten for the web in French and English.

**Projects are described honestly.** Each one carries a `frame` (Projet de fin
d'études · Atelier S8 · Projet de stage) and a `role` (Intégralité du projet ·
Travail en binôme) rather than a client and a completion status, because that
is what these projects are. There are no surfaces, budgets or client names
anywhere, since the portfolio gives none — do not add any that cannot be
evidenced.

### Still to confirm with the architect

- **`year`** on every project except *Le stade*. The studio semesters (S6, S8,
  S9, S10) give the sequence but not the date; the years currently shown are
  inferred from his 2019–2024 studies.
- **`location`** for *Dar el hayat* and *Parking sous-sol*, shown as "Nord du
  Maroc" because the portfolio does not name the sites.
- **`lib/site.ts`**: the street address, the Ordre National des Architectes
  number, the LinkedIn URL, and the production domain. Each is an empty string
  and is hidden by the interface rather than rendered as a placeholder — never
  invent a registration number or an address.
- Two small fixes in the PDF itself: the contents page on p.4 lists the projects
  in a different order from the body, and the CV has a couple of overlapping
  placement dates.

### Adding more photography

Drop the files into `public/projects/`, then set the paths:

```ts
cover: "/projects/malabata-cover.jpg",
gallery: [
  { src: "/projects/malabata-01.jpg", shape: "wide", caption: { fr: "…", en: "…" } },
],
```

Any project set back to `null` falls back to a generated study, so the site
never shows an empty box. `shape: "wide"` spans the full width; `"tall"` sits in
a half column. Supply images at roughly 2400px on the long edge — Next.js
generates the smaller sizes and serves AVIF/WebP. Avoid sources wider than about
2:1 for gallery slots; they crop heavily in a 16:9 frame.

The home page shows the projects flagged `featured: true`, in the order they
appear in the file.

## The logo

The header and footer currently draw a **stand-in** wordmark: "AS" set in the
grotesque, followed by the portal — the M of the mark. The portal is exact
(three rectangles); the letterforms are an approximation, because the original
typeface is not known here.

To use the real mark, export two SVGs with transparent backgrounds and drop
them into `public/`:

- `asm-logo-light.svg` — white letters + gold portal, for the dark bands
  (the header over the hero, and the footer)
- `asm-logo-dark.svg` — ink letters + gold portal, for the header on paper

Then set `hasLogoAsset: true` in `lib/site.ts`. Nothing else changes.

## The portal

The M of the logo is an opening, and the site uses it once, where it means
something: **every project page opens through it.** The title sits on an ink
band beside an aperture with two gold jambs and a lintel, open at the bottom
where the ink ends and the page begins — you enter the project through the mark.

It is deliberately used in exactly one place (plus the favicon). The projects
register is the site's signature; a motif repeated on every section would
compete with it and stop meaning anything. If you extend the site, resist
putting the portal on more surfaces.

## Colour

The palette is near-monochrome so the gold reads as the brand, not as
decoration:

| Token | Value | Where |
| --- | --- | --- |
| `--color-paper` | `#F2F1EE` | Page ground. A cool lime-plaster white, not a warm cream. |
| `--color-ink` | `#16181A` | Text, and the dark bands. |
| `--color-graphite` | `#5C6166` | Secondary text. 5.5:1 on paper. |
| `--color-gold` | `#D3A83B` | The brand. **Dark surfaces only.** |
| `--color-alert` | `#8A3A1E` | Form errors. |

The gold is sampled from the supplied logo — correct it in `lib/site.ts` and
`app/globals.css` if there is a brand guide with exact values.

**The gold rule matters.** Gold on ink is 8:1 and beautiful; gold on paper is
1.97:1 and illegible. So it appears only on the dark surfaces — the logo's
portal, the hero coordinates, the footer headings, and the enquiry buttons —
which is exactly how the mark itself is presented. Never set gold text on the
paper ground.

## Turning the contact form on

Copy `.env.example` to `.env.local` and fill in:

```
RESEND_API_KEY=…                              # from resend.com
CONTACT_TO=contact@asm-architectes.ma         # inbox that receives enquiries
CONTACT_FROM=ASM <site@asm-architectes.ma>    # a sender on a verified domain
NEXT_PUBLIC_SITE_URL=https://www.asm-architectes.ma
```

Until those are set, submissions are logged to the console in development and
refused in production — the form never quietly drops an enquiry. The same
values must be set on the host.

WhatsApp and email need no configuration; they read from `lib/site.ts`.

## Deploying

Built for Vercel: import the repository, add the environment variables above,
and point the domain at it. Every page except the contact endpoint is
pre-rendered as static HTML, so any Node host that runs `next build` and
`next start` works too.

## Details worth knowing

- **Search.** Each page sets its own title, description, canonical URL and
  `hreflang` pair. `sitemap.xml` and `robots.txt` are generated from the content
  files, so new projects appear automatically. The studio is described to search
  engines as an `ArchitecturalService` in Tanger.
- **Accessibility.** Keyboard focus is visible throughout, the register responds
  to focus as well as hover, `prefers-reduced-motion` disables the animation, and
  the reveal effect falls back to plain visible content without JavaScript.
- **Fonts.** Instrument Serif for display, Archivo for text, IBM Plex Mono for
  references and figures — all self-hosted by Next.js, nothing calls Google at
  runtime.

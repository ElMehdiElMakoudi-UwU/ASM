# ASM — Atelier Souhail Mharrech

Bilingual (FR/EN) website for an architecture studio in Tanger, Morocco.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build, output in .next-build
npm start        # serve that build
```

`next dev` writes to `.next` and `next build` writes to `.next-build`, so a
build never deletes the chunks a running dev server is serving. Do not run two
dev servers against this directory at once — they share `.next` and will
overwrite each other, which surfaces as `ChunkLoadError` in the browser.

## What is where

| Path | What it holds |
| --- | --- |
| `content/projects.ts` | The **seed** copy of every project — text, facts, gallery captions, image paths. Loaded into the database once, on first boot; editing it after that has no effect on the live site (edit through `/admin` instead). |
| `lib/site.ts` | The **seed** copy of the studio's practice details — address, phone, WhatsApp, email, social links, registration number. Same caveat: `/admin` owns it after first boot. |
| `content/dictionary.ts` | All interface copy in both languages — nav labels, service descriptions, form strings — plus the service lines, the five commission stages, the working rules and the figures. This one is still static code; only projects and the studio bio/contact details moved to the database. |
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

The client adds photography himself, through `/admin` — see **The
backoffice** below. Upload there re-encodes the file, strips metadata and
caps it at 3000px on the long edge, so there is no manual prep step. A
project with no cover set falls back to a generated study, so the site never
shows an empty box. `shape: "wide"` spans the full width; `"tall"` sits in a
half column. Avoid sources wider than about 2:1 for gallery slots; they crop
heavily in a 16:9 frame.

The home page shows the projects flagged "featured", in their current
display order.

## The backoffice

`/admin` is a password-protected area where the client can add, edit,
reorder and delete projects, and edit the studio's practice details (address,
phone, WhatsApp, email, socials, registration number) and bio — without a
developer and without a redeploy. It is a separate, unlocalised tool (no
`/fr`/`/en` prefix) and is excluded from search indexing regardless of the
`NEXT_PUBLIC_SITE_NOINDEX` flag.

**How it works.** Content that used to be hardcoded in `content/projects.ts`
and `lib/site.ts` now lives in a SQLite database (`lib/db/`). On first boot,
if that database is empty, it is seeded from those two files, so nothing in
the existing portfolio is lost — after that, those files are just historical
seed copy and are no longer read by the live site. Public pages read through
a cached layer (`lib/data.ts`) tagged `"projects"` / `"settings"`; every
admin edit calls `revalidateTag`, so changes appear on the live site within
the same request, with no rebuild.

**Setting it up.** Set two env vars before deploying:

```
ADMIN_PASSWORD=…             # the password the client logs in with
ADMIN_SESSION_SECRET=…       # a long random string, signs the login session
```

Generate a secret with `openssl rand -hex 32`. Optionally set
`DATABASE_PATH` to change where the SQLite file is written (default
`./data/asm.db`).

**Persistence.** The database file and any uploaded photos
(`public/uploads/`) must survive redeploys — see the volumes note in
**Deploying to Coolify** below. Back up by copying the SQLite file; it is a
single file at `DATABASE_PATH`.

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

## Deploying to Coolify

The repository ships a `Dockerfile` using Next.js standalone output. In Coolify:

1. **New Resource → Application**, connect this repository, branch `main`.
2. **Build Pack: Dockerfile** (not Nixpacks). Dockerfile path `./Dockerfile`.
3. **Port: 3000**.
4. **Health check path: `/api/health`.** Do not leave it on `/` — that redirects
   to a locale with a 307 and can be read as unhealthy.
5. **Build Variables** — these are baked in at build time, so they must be set
   as build variables, not only runtime environment variables:

   | Variable | Value |
   | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | the URL this deployment answers on |
   | `NEXT_PUBLIC_SITE_NOINDEX` | `true` while it is a client preview |

6. **Runtime environment variables** for the contact form:
   `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`. Without them the form is
   refused rather than silently dropping an enquiry — WhatsApp and the email
   link keep working regardless.
7. **Runtime environment variables** for the backoffice: `ADMIN_PASSWORD` and
   `ADMIN_SESSION_SECRET` (see **The backoffice** above). `/admin` is unusable
   without them — every login attempt fails closed.
8. **Persistent volumes — required, not optional.** Mount two Coolify
   volumes:

   | Container path | Holds |
   | --- | --- |
   | `/app/data` | The SQLite database (projects, studio info) |
   | `/app/public/uploads` | Photos uploaded through `/admin` |

   Without these, every redeploy resets the site to the seed content and
   deletes every photo the client uploaded. A single volume mounted at
   `/app` would also work, but covers more than it needs to.
9. Attach the domain and let Coolify issue the certificate.

### Sending it to the client for a first look

Set `NEXT_PUBLIC_SITE_NOINDEX=true` and `NEXT_PUBLIC_SITE_URL` to the preview
URL Coolify gives you. That makes `robots.txt` return `Disallow: /` and puts
`noindex` on every page, so an unfinished site with placeholder years does not
get picked up by Google under the architect's name. Coolify can also put basic
auth in front of the whole application if you would rather it were not public
at all. Remove the flag and redeploy at launch.

### Local checks before deploying

```bash
npm run build     # writes to .next-build, so a running dev server is unaffected
npm start         # serves that build
```

A local Docker run, matching the container exactly:

```bash
docker build --build-arg NEXT_PUBLIC_SITE_URL=http://localhost:3000 -t asm .
docker run --rm -p 3000:3000 asm
```

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

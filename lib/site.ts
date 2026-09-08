/**
 * The practice's real-world details.
 *
 * Contact details are taken from Souhail's own 2026 portfolio and confirmed by
 * the client. Anything still marked TODO was not in that document and must be
 * supplied before launch — empty strings are hidden by the interface rather
 * than rendered as placeholders.
 */
export const site = {
  name: "ASM",
  fullName: "Atelier Souhail Mharrech",
  founder: "Souhail Mharrech",
  city: "Tanger",
  country: { fr: "Maroc", en: "Morocco" },
  /** TODO: the studio's street address. Only the city is shown until it is set. */
  street: { fr: "", en: "" },
  postalCity: { fr: "Tanger, Maroc", en: "Tangier, Morocco" },
  phoneDisplay: "+212 777 478 946",
  phoneHref: "+212777478946",
  whatsappDisplay: "+212 777 478 946",
  whatsappNumber: "212777478946",
  email: "Mharrechkk@gmail.com",
  /** Tangier, where the Atlantic meets the Mediterranean. */
  coordinates: "35°46′N 5°48′W",
  mapQuery: "Tanger, Maroc",
  social: {
    instagram: "https://www.instagram.com/souhailmharrech",
    /** TODO: the portfolio gives a handle, not a URL. Hidden until confirmed. */
    linkedin: "",
  },
  /** TODO: set to the production domain before launch. */
  url: "https://www.asm-architectes.ma",
  /**
   * TODO: the architect is registered with the Ordre National des Architectes —
   * add the actual number here and it appears in the footer. Never invent one.
   */
  ordreNumber: "",
  /** Schools and cities the practice actually works across. */
  areaServed: ["Tanger", "Tétouan", "Asilah", "Martil", "Chefchaouen"],
  /**
   * Flip to true once /public/asm-logo-light.svg and /public/asm-logo-dark.svg
   * exist. Until then the header and footer draw a stand-in wordmark.
   */
  hasLogoAsset: false,
  /** Brand gold, as sampled from the mark. Correct it if there is a brand guide. */
  gold: "#D3A83B",
} as const;

/**
 * Set NEXT_PUBLIC_SITE_NOINDEX=true on the Coolify preview so search engines
 * leave it alone. Remove it (or set false) on the real domain at launch.
 * It is read at build time, so a change needs a redeploy.
 */
export const noindex = process.env.NEXT_PUBLIC_SITE_NOINDEX === "true";

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

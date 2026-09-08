import { site } from "@/lib/site";

/**
 * The ASM wordmark.
 *
 * Once the vector files are dropped into /public (see README), flip
 * `site.hasLogoAsset` and this renders the real artwork — the light variant on
 * dark bands, the dark variant on paper.
 *
 * Until then it draws a stand-in: "AS" in the grotesque, followed by the
 * portal — the M of the mark, which IS exact, being three rectangles. The
 * letterforms are an approximation and are meant to be replaced.
 */
export function Logo({
  /** Cap height of the mark, in px. */
  height = 22,
  /** Dark bands need the light artwork. */
  onDark = false,
  className = "",
}: {
  height?: number;
  onDark?: boolean;
  className?: string;
}) {
  if (site.hasLogoAsset) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element -- fixed-height vector, no optimisation to do */
      <img
        src={onDark ? "/asm-logo-light.svg" : "/asm-logo-dark.svg"}
        alt={site.fullName}
        style={{ height }}
        className={className}
      />
    );
  }

  return (
    <span
      className={className}
      style={{ fontSize: height, lineHeight: 1, whiteSpace: "nowrap" }}
      aria-hidden="true"
    >
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 600,
          letterSpacing: "-0.035em",
        }}
      >
        AS
      </span>
      <svg
        viewBox="0 0 104 100"
        style={{
          // Preflight makes svg display:block; inline-block puts the portal
          // back on the baseline, at the cap height of the letters.
          display: "inline-block",
          verticalAlign: "baseline",
          height: "0.72em",
          marginLeft: "0.06em",
        }}
        fill="var(--color-gold)"
        role="presentation"
      >
        <path d="M0 0H104V100H82V22H22V100H0Z" />
      </svg>
    </span>
  );
}

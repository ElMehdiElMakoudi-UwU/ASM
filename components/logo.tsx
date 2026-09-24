import { AsmMark } from "@/components/asm-mark";
import { site } from "@/lib/site";

/**
 * The ASM wordmark.
 *
 * Once the vector files are dropped into /public (see README), flip
 * `site.hasLogoAsset` and this renders the real artwork — the light variant on
 * dark bands, the dark variant on paper.
 *
 * Until then it draws the geometric mark from AsmMark — roof, stair, portal —
 * which is the same set of forms every animation on the site moves around.
 * The portal is exact (three rectangles); the A and S are drawn to match it.
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
    <AsmMark
      height={Math.round(height * 0.72)}
      className={className}
      style={{ display: "inline-block", verticalAlign: "baseline" }}
      data-logo-mark
    />
  );
}

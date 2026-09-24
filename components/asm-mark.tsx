import type { CSSProperties } from "react";

/**
 * The ASM mark, cut into the three architectural forms it is built from:
 *
 *   A — the roof. A gable with its crossbar lifted out as a separate piece,
 *       which is the gold line that runs through the whole site.
 *   S — the stair. Squared, straight edges only, like everything else.
 *   M — the portal. Two posts and a lintel: the door, the threshold.
 *
 * Every animation (the splash, the home-page scroll scenes, the footer) draws
 * these same paths and targets them through `data-form`, so they always read
 * as the same three objects travelling through the page.
 *
 * All coordinates are in a 100-unit cap height. Swap the paths here if the
 * real logo artwork differs; nothing else needs to change.
 */
export const FORMS = {
  A: { d: "M0 100L50 0L100 100H78L50 44L22 100Z", width: 100 },
  S: { d: "M0 0H100V22H22V39H100V100H0V78H78V61H0Z", width: 100 },
  M: { d: "M0 0H104V100H82V22H22V100H0Z", width: 104 },
} as const;

export type FormKey = keyof typeof FORMS;

/** The A's crossbar, in the A's own coordinates. */
export const BAR = { x: 30, y: 64, width: 40, height: 10 } as const;

/** Where each form sits in the lockup, and the lockup's overall width. */
export const LOCKUP_X = { A: 0, S: 112, M: 224 } as const;
export const LOCKUP_WIDTH = 328;

/** The portal's opening, in the M's own coordinates. */
export const PORTAL_OPENING = { x: 22, y: 22, width: 60, height: 78 } as const;

export function AsmMark({
  height,
  className = "",
  style,
  ...rest
}: {
  /** Rendered cap height, in px. */
  height: number;
  className?: string;
  style?: CSSProperties;
} & Record<`data-${string}`, string | boolean | undefined>) {
  return (
    <svg
      viewBox={`0 0 ${LOCKUP_WIDTH} 100`}
      width={(height * LOCKUP_WIDTH) / 100}
      height={height}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ overflow: "visible", ...style }}
      {...rest}
    >
      {/* Each form is wrapped in a positioning group so animations can
          transform the form itself without fighting its lockup offset. */}
      <g transform={`translate(${LOCKUP_X.A} 0)`}>
        <path data-form="A" d={FORMS.A.d} />
        <rect
          data-form="bar"
          x={BAR.x}
          y={BAR.y}
          width={BAR.width}
          height={BAR.height}
          fill="var(--color-gold)"
        />
      </g>
      <g transform={`translate(${LOCKUP_X.S} 0)`}>
        <path data-form="S" d={FORMS.S.d} />
      </g>
      <g transform={`translate(${LOCKUP_X.M} 0)`}>
        <path data-form="M" d={FORMS.M.d} fill="var(--color-gold)" />
      </g>
    </svg>
  );
}

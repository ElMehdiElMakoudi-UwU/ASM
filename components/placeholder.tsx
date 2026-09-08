/**
 * Deterministic stand-in artwork used until the client delivers photography.
 * Each seed produces the same abstract architectural study — a tonal field,
 * a horizon, a few masses and a shaft of light — so the layout can be judged
 * with images in place. Set a real `src` on the project to replace it.
 */

const RAMP = [
  "#0e1012",
  "#1b1e21",
  "#2b2f33",
  "#3d4247",
  "#565b61",
  "#767b81",
  "#9aa0a5",
  "#bcc0c3",
  "#d8d7d3",
  "#eceae6",
];

function hash(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function Placeholder({ seed, className }: { seed: string; className?: string }) {
  const h = hash(seed);
  const variant = h % 4;
  const dark = RAMP[1 + (h % 2)];
  const mid = RAMP[3 + ((h >> 3) % 2)];
  const light = RAMP[7 + ((h >> 5) % 3)];
  const id = `ph-${(h % 100000).toString(36)}`;

  return (
    <svg
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor={light} />
          <stop offset="100%" stopColor={mid} />
        </linearGradient>
        <linearGradient id={`${id}-shaft`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={RAMP[9]} stopOpacity="0.55" />
          <stop offset="100%" stopColor={RAMP[9]} stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={h % 90} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>

      <rect width="1600" height="1000" fill={`url(#${id}-sky)`} />

      {variant === 0 && (
        <g>
          {/* Facade study: vertical bays, one deep recess. */}
          <rect x="0" y="360" width="1600" height="640" fill={mid} />
          <rect x="120" y="360" width="200" height="640" fill={dark} opacity="0.85" />
          <rect x="420" y="440" width="120" height="560" fill={light} opacity="0.35" />
          <rect x="640" y="360" width="380" height="640" fill={dark} opacity="0.45" />
          <rect x="1120" y="500" width="220" height="500" fill={light} opacity="0.28" />
          <rect x="0" y="352" width="1600" height="8" fill={light} opacity="0.5" />
        </g>
      )}

      {variant === 1 && (
        <g>
          {/* Section: strata and a void cut through them. */}
          <rect x="0" y="620" width="1600" height="380" fill={dark} />
          <rect x="0" y="480" width="1600" height="140" fill={mid} />
          <rect x="0" y="472" width="1600" height="8" fill={light} opacity="0.4" />
          <rect x="560" y="300" width="480" height="700" fill={light} opacity="0.16" />
          <rect x="700" y="480" width="200" height="520" fill={dark} opacity="0.9" />
        </g>
      )}

      {variant === 2 && (
        <g>
          {/* Massing: two blocks and a long afternoon shadow. */}
          <rect x="0" y="700" width="1600" height="300" fill={mid} />
          <polygon points="980,700 1600,700 1600,1000 640,1000" fill={dark} opacity="0.35" />
          <rect x="240" y="280" width="520" height="420" fill={dark} opacity="0.92" />
          <rect x="760" y="440" width="320" height="260" fill={light} opacity="0.4" />
          <rect x="240" y="272" width="520" height="10" fill={light} opacity="0.55" />
        </g>
      )}

      {variant === 3 && (
        <g>
          {/* Interior: a shaft of light landing on a dark plane. */}
          <rect x="0" y="0" width="1600" height="1000" fill={RAMP[3]} />
          <polygon points="180,0 720,0 1280,1000 460,1000" fill={`url(#${id}-shaft)`} />
          <rect x="0" y="0" width="1600" height="1000" fill={dark} opacity="0.45" />
          <rect x="0" y="820" width="1600" height="180" fill={mid} opacity="0.75" />
          <rect x="1240" y="180" width="240" height="640" fill={light} opacity="0.18" />
          <rect x="0" y="812" width="1600" height="8" fill={light} opacity="0.35" />
        </g>
      )}

      <rect
        width="1600"
        height="1000"
        filter={`url(#${id}-grain)`}
        opacity="0.09"
        style={{ mixBlendMode: "overlay" }}
      />
    </svg>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * "Threshold" — a doorway built from the mark's own portal glyph.
 *
 * First visit in a tab: ASM appears centered at the top of a stack, with
 * "Atelier Souhail Mharrech" settling in underneath it — the gold portal
 * glyph draws itself in, the "AS" letters relax from tracked-out to tight,
 * and a glowing underline sweeps in beneath the mark. Once settled, the ASM
 * mark alone travels to the header's top-left corner; only after it lands
 * does the studio name slide in beside it, mirroring the real header's
 * logo + name layout. The ink backdrop then dissolves to hand off into the
 * live header. Every later in-app navigation replays a fast, mark-less cut
 * of the older door-leaf motion instead.
 */
export function SiteLoader() {
  const pathname = usePathname();
  const firstPath = useRef(pathname);
  const [phase, setPhase] = useState<"intro" | "transit" | "idle">("idle");
  const [stage, setStage] = useState<
    "enter" | "toCorner" | "settle" | "reveal"
  >("enter");
  const [showName, setShowName] = useState(true);
  // The header itself renders light-on-dark only on the transparent home
  // hero; everywhere else (and once scrolled) it's dark-on-paper. Scroll is
  // always 0 at load, so matching just needs the route.
  const isHome = /^\/(fr|en)\/?$/.test(pathname);

  useEffect(() => {
    // The real logo is hidden by the inline script in <head> whenever this
    // splash is about to run; if we're not running it after all, undo that
    // immediately instead of leaving the header logo permanently hidden.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.removeAttribute("data-intro-active");
      return;
    }
    if (sessionStorage.getItem("asm-threshold")) {
      document.documentElement.removeAttribute("data-intro-active");
      return;
    }
    sessionStorage.setItem("asm-threshold", "1");
    // The real header hides the studio name below `sm`; match it so the
    // corner lockup lands on a same-shaped target.
    setShowName(window.matchMedia("(min-width: 640px)").matches);
    setStage("enter");
    setPhase("intro");
    document.body.style.overflow = "hidden";
    const timers = [
      // ASM alone travels to the top-left corner.
      window.setTimeout(() => setStage("toCorner"), 1400),
      // Only once it has landed does the studio name slide in beside it.
      window.setTimeout(() => setStage("settle"), 1900),
      window.setTimeout(() => setStage("reveal"), 2200),
      window.setTimeout(() => {
        setPhase("idle");
        document.body.style.overflow = "";
        // Our stand-in is styled and positioned to match the real logo
        // exactly, so revealing it here is an invisible swap.
        document.documentElement.removeAttribute("data-intro-active");
      }, 2600),
    ];
    return () => timers.forEach((t) => window.clearTimeout(t));
    // Runs once, on first mount, regardless of which route it lands on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pathname === firstPath.current) return;
    firstPath.current = pathname;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPhase("transit");
    const t = window.setTimeout(() => setPhase("idle"), 620);
    return () => window.clearTimeout(t);
  }, [pathname]);

  if (phase === "idle") return null;

  // Stays paper (light) the whole time the ink backdrop is opaque or
  // fading; only once "reveal" nears completion does it need to match
  // whatever the real header will look like on this route.
  const standInColor =
    stage === "reveal"
      ? isHome
        ? "var(--color-paper)"
        : "var(--color-ink)"
      : "var(--color-paper)";

  return (
    <div
      aria-hidden="true"
      data-phase={phase}
      className="threshold pointer-events-none fixed inset-0 z-[200]"
    >
      {phase === "intro" && (
        <div className="threshold-splash" data-stage={stage}>
          <div className="threshold-bg" />
          <div className="threshold-glow" />
          <div
            className="threshold-lockup-mark"
            data-stage={stage}
            style={{ color: standInColor }}
          >
            <span className="threshold-wordmark">
              <span className="threshold-as">AS</span>
              <svg viewBox="0 0 104 100" className="threshold-portal-mark">
                <path
                  className="threshold-portal-fill"
                  d="M0 0H104V100H82V22H22V100H0Z"
                />
                <path
                  className="threshold-portal-outline"
                  d="M0 0H104V100H82V22H22V100H0Z"
                  fill="none"
                  stroke="var(--color-gold)"
                  strokeWidth="3"
                  pathLength={1}
                />
              </svg>
            </span>
            <span className="threshold-underline" />
          </div>
          {showName && (
            <span
              className="threshold-lockup-name"
              data-stage={stage}
              style={{ color: standInColor }}
            >
              Atelier Souhail Mharrech
            </span>
          )}
        </div>
      )}
      {phase === "transit" && (
        <>
          <div className="threshold-leaf threshold-leaf-l" />
          <div className="threshold-leaf threshold-leaf-r" />
          <div className="threshold-mark">
            <svg viewBox="0 0 104 100" className="threshold-portal">
              <path
                d="M0 0H104V100H82V22H22V100H0Z"
                fill="none"
                stroke="var(--color-gold)"
                strokeWidth="3"
                pathLength={1}
              />
            </svg>
          </div>
        </>
      )}
    </div>
  );
}

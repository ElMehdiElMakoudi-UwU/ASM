"use client";

import { usePathname } from "next/navigation";
import { useRef, type ReactNode } from "react";
import { AsmMark, BAR, FORMS, PORTAL_OPENING, type FormKey } from "@/components/asm-mark";
import { Logo } from "@/components/logo";
import { gsap, prefersReducedMotion, useGSAP, whenPageReady } from "@/lib/gsap";

/*
 * The site's scroll scenes. The mark's three forms — roof (A), stair (S),
 * portal (M) — leave the header's lockup and keep turning up wherever you go:
 * they build a house beside the home manifesto and again, stage by stage,
 * beside the commission process; they drop onto each service and each
 * contact detail; the lockup splits so each form carries one of the studio's
 * three rules; the portal's opening frames every project image; you walk
 * through the portal into each dark call-to-action; and the forms come to
 * rest on a gold line in the footer. The page-transition curtain (see
 * PageTransition) assembles them again between pages, so they read as the
 * same three objects from the first load to the last page.
 */

type Point = { x: number; y: number };

/**
 * GSAP x/y for a form transformed about its own centre `c`, so that its
 * top-left corner lands on `p` at scale `s`.
 */
function place(c: Point, p: Point, s: number) {
  return { x: p.x - c.x * (1 - s), y: p.y - c.y * (1 - s), scale: s };
}

const CENTER = {
  A: { x: 50, y: 50 },
  S: { x: 50, y: 50 },
  M: { x: FORMS.M.width / 2, y: 50 },
};

/* ------------------------------------------------------------------------ */

/**
 * Home · Manifesto — the lockup builds a house.
 *
 * The forms start as a small ASM lockup, then, scrubbed by scroll: a ground
 * line draws, the portal drops onto it as the door, the roof lands on top,
 * and the stair settles beside them.
 */
export function ManifestoBuilding({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = ref.current;
      if (!svg) return;
      const q = gsap.utils.selector(svg);
      const [A] = q('[data-scene="A"]');
      const [S] = q('[data-scene="S"]');
      const [M] = q('[data-scene="M"]');
      const [ground] = q("[data-scene-ground]");

      // Start: the lockup, small, top-left. End: the house on its ground.
      const s0 = 0.36;
      const start = {
        A: place(CENTER.A, { x: 0, y: 8 }, s0),
        S: place(CENTER.S, { x: 112 * s0, y: 8 }, s0),
        M: place(CENTER.M, { x: 224 * s0, y: 8 }, s0),
      };
      const end = {
        M: place(CENTER.M, { x: 68, y: 180 }, 1),
        A: place(CENTER.A, { x: 68, y: 76 }, 1.04),
        S: place(CENTER.S, { x: 182, y: 230 }, 0.5),
      };

      gsap.set([A, S, M], { transformOrigin: "50% 50%" });
      gsap.set(ground, { transformOrigin: "0% 50%" });

      if (prefersReducedMotion()) {
        gsap.set(A, end.A);
        gsap.set(S, end.S);
        gsap.set(M, end.M);
        return;
      }

      gsap.set(A, start.A);
      gsap.set(S, start.S);
      gsap.set(M, start.M);
      gsap.set(ground, { scaleX: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: svg.closest("section") ?? svg,
          start: "top 75%",
          end: "center 40%",
          scrub: 0.6,
        },
      });

      tl.to(ground, { scaleX: 1, duration: 0.3, ease: "power2.out" }, 0);

      // Each form swings out (lifting, tipping) before settling into place.
      const travel = (
        el: Element,
        from: ReturnType<typeof place>,
        to: ReturnType<typeof place>,
        tip: number,
        at: number,
      ) => {
        tl.to(
          el,
          {
            keyframes: [
              {
                x: (from.x + to.x) / 2 + 30,
                y: (from.y + to.y) / 2 - 40,
                scale: (from.scale + to.scale) / 2,
                rotation: tip,
                ease: "power1.in",
              },
              { ...to, rotation: 0, ease: "back.out(1.6)" },
            ],
            duration: 0.45,
          },
          at,
        );
      };
      travel(M, start.M, end.M, 90, 0.1);
      travel(A, start.A, end.A, -40, 0.3);
      travel(S, start.S, end.S, 70, 0.5);
    },
    { scope: ref },
  );

  return (
    <svg
      ref={ref}
      viewBox="0 0 240 300"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="currentColor"
      style={{ overflow: "visible" }}
    >
      <rect data-scene-ground x="0" y="279.25" width="240" height="1.5" />
      <path data-scene="M" d={FORMS.M.d} fill="var(--color-gold)" />
      <g data-scene="A">
        <path d={FORMS.A.d} />
        <rect
          x={BAR.x}
          y={BAR.y}
          width={BAR.width}
          height={BAR.height}
          fill="var(--color-gold)"
        />
      </g>
      <path data-scene="S" d={FORMS.S.d} />
    </svg>
  );
}

/* ------------------------------------------------------------------------ */

/**
 * The opening of the portal, sized to sit on the floor of a `w`×`h` box: a
 * doorway about 62% of the box's height, in the portal's own proportions.
 */
export function doorway(w: number, h: number) {
  const dh = h * 0.62;
  const dw = Math.min(w * 0.5, (dh * PORTAL_OPENING.width) / PORTAL_OPENING.height);
  const side = (w - dw) / 2;
  return `inset(${h - dh}px ${side}px 0px ${side}px)`;
}

/**
 * Project images, seen through the portal.
 *
 * The image starts cut to the portal's opening, standing on the frame's
 * floor, and widens to the full frame — scrubbed as it scrolls up the screen,
 * or, with `on="load"`, played once as soon as the page is uncovered (for
 * images already in view, like a project's cover).
 */
export function PortalReveal({
  children,
  className = "",
  on = "scroll",
}: {
  children: ReactNode;
  className?: string;
  on?: "scroll" | "load";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const closed = () => doorway(el.offsetWidth, el.offsetHeight);
      const open = "inset(0px 0px 0px 0px)";

      if (on === "load") {
        gsap.set(el, { clipPath: closed() });
        return whenPageReady(() => {
          gsap.to(el, { clipPath: open, duration: 1.2, ease: "expo.inOut", delay: 0.15 });
        });
      }

      gsap.fromTo(
        el,
        { clipPath: closed },
        {
          clipPath: open,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            end: "top 30%",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------------ */

/**
 * Dark call-to-action bands — you walk through the portal.
 *
 * The dark band is cut to the portal's opening, with the gold portal standing
 * around it on the paper. Once the band reaches the top of the screen it
 * pins, and scrolling carries you through: the portal grows until its
 * opening is the whole screen, the posts and lintel sweep past, and the
 * enquiry copy comes up on the far side.
 */
export function ThresholdPass({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const q = gsap.utils.selector(wrap);
      const [band] = q("[data-threshold-band]") as HTMLElement[];
      const [portal] = q("[data-threshold-portal]") as HTMLElement[];
      const [content] = q("[data-threshold-content]") as HTMLElement[];

      if (prefersReducedMotion()) {
        gsap.set(portal, { display: "none" });
        return;
      }

      // Measured on every refresh: the band's size, the portal's unit (px
      // per glyph unit) and how far it must grow to open onto everything.
      const m = { w: 0, h: 0, u: 1, grow: 1 };
      const measure = () => {
        m.w = band.offsetWidth;
        m.h = band.offsetHeight;
        m.u = gsap.utils.clamp(1.2, 2.2, (m.h * 0.3) / 100);
        m.grow =
          Math.max(
            m.w / (PORTAL_OPENING.width * m.u),
            m.h / (PORTAL_OPENING.height * m.u),
          ) * 1.12;
        // The portal sits with its opening centred on the band.
        const ox = (PORTAL_OPENING.x + PORTAL_OPENING.width / 2) * m.u;
        const oy = (PORTAL_OPENING.y + PORTAL_OPENING.height / 2) * m.u;
        gsap.set(portal, {
          width: FORMS.M.width * m.u,
          height: 100 * m.u,
          left: m.w / 2 - ox,
          top: m.h / 2 - oy,
          transformOrigin: `${ox}px ${oy}px`,
        });
      };

      const state = { p: 0 };
      const render = () => {
        // Accelerates: a slow first step through the door, then a rush.
        const k = 1 + (m.grow - 1) * Math.pow(state.p, 2.2);
        const ow = PORTAL_OPENING.width * m.u * k;
        const oh = PORTAL_OPENING.height * m.u * k;
        const x = Math.max(0, (m.w - ow) / 2);
        const y = Math.max(0, (m.h - oh) / 2);
        band.style.clipPath = `inset(${y}px ${x}px ${y}px ${x}px)`;
        gsap.set(portal, {
          scale: k,
          autoAlpha: 1 - gsap.utils.clamp(0, 1, (state.p - 0.55) / 0.3),
        });
      };

      measure();
      render();
      gsap.set(content, { autoAlpha: 0, y: 28 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onRefresh: () => {
            measure();
            render();
          },
        },
      });
      tl.to(state, { p: 1, duration: 1, ease: "none", onUpdate: render }, 0);
      tl.to(content, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, 0.72);
    },
    { scope: wrapRef },
  );

  return (
    <div ref={wrapRef} className="relative overflow-hidden">
      <section
        data-threshold-band
        data-surface="dark"
        className="flex min-h-[100svh] items-center bg-ink text-paper"
      >
        <div data-threshold-content className="w-full">
          {children}
        </div>
      </section>
      <div
        data-threshold-portal
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0"
      >
        <svg
          viewBox={`0 0 ${FORMS.M.width} 100`}
          preserveAspectRatio="none"
          className="block h-full w-full"
        >
          <path d={FORMS.M.d} fill="var(--color-gold)" />
        </svg>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

/**
 * Footer — the forms come to rest.
 *
 * A gold line draws under the footer mark and the three forms drop onto it
 * one by one. The footer outlives page changes, so this re-arms on each new
 * page and plays again when you reach the bottom.
 */
export function FooterMark() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const q = gsap.utils.selector(el);
      const forms = ["M", "A", "S"].map((k) => q(`[data-form="${k}"]`)[0]);
      const [bar] = q('[data-form="bar"]');
      const [line] = q("[data-footer-line]");

      gsap.set(forms, { transformOrigin: "50% 100%" });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
      tl.from(line, { scaleX: 0, transformOrigin: "0% 50%", duration: 0.9, ease: "expo.out" }, 0);
      forms.forEach((form, i) => {
        tl.from(
          form,
          {
            y: -140,
            rotation: [28, -34, 46][i],
            autoAlpha: 0,
            duration: 0.9,
            ease: "bounce.out",
          },
          0.2 + i * 0.12,
        );
      });
      tl.from(bar, { scaleX: 0, transformOrigin: "0% 50%", duration: 0.4, ease: "power2.out" }, 0.9);
    },
    { scope: ref, dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <div ref={ref} className="inline-block">
      <Logo height={44} onDark />
      <span
        data-footer-line
        aria-hidden="true"
        className="mt-3 block h-px w-full"
        style={{ background: "var(--color-gold)" }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------------ */

type GlyphKind = FormKey | "ASM";

/** One of the mark's forms on its own (or the whole lockup), in ink + gold. */
export function FormGlyph({
  form,
  height,
  className = "",
}: {
  form: GlyphKind;
  height: number;
  className?: string;
}) {
  if (form === "ASM") return <AsmMark height={height} className={className} />;
  const width = FORMS[form].width;
  return (
    <svg
      viewBox={`0 0 ${width} 100`}
      width={(height * width) / 100}
      height={height}
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="currentColor"
      style={{ overflow: "visible" }}
    >
      <path d={FORMS[form].d} fill={form === "M" ? "var(--color-gold)" : undefined} />
      {form === "A" && (
        <rect
          x={BAR.x}
          y={BAR.y}
          width={BAR.width}
          height={BAR.height}
          fill="var(--color-gold)"
        />
      )}
    </svg>
  );
}

/**
 * A form that falls into its row as the row scrolls up the screen — tipping
 * as it drops, bouncing as it lands. Used to mark each service and each
 * contact detail with one of the mark's forms.
 */
export function FormDrop({
  form,
  height = 34,
  className = "",
}: {
  form: GlyphKind;
  height?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const tip = { A: -38, S: 52, M: 90, ASM: -14 }[form];

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const glyph = el.firstElementChild;
      gsap.set(glyph, { transformOrigin: "50% 100%" });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 96%", end: "top 62%", scrub: 0.4 },
      });
      tl.fromTo(glyph, { y: -150 }, { y: 0, ease: "bounce.out", duration: 1 }, 0);
      tl.fromTo(glyph, { rotation: tip }, { rotation: 0, ease: "power2.out", duration: 0.75 }, 0);
      tl.fromTo(glyph, { autoAlpha: 0 }, { autoAlpha: 1, ease: "none", duration: 0.15 }, 0);
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      <FormGlyph form={form} height={height} className="block" />
    </div>
  );
}

/* ------------------------------------------------------------------------ */

/**
 * Practice · The commission, stage by stage — the house is built as you read.
 *
 * Sits sticky beside the numbered stages and advances one step per stage:
 * the ground is surveyed, the portal is sketched in outline, the permit fills
 * it in, the construction documents set the roof on it, and the site brings
 * the stair and the gold crossbar.
 */
export function StageBuild({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = ref.current;
      if (!svg) return;
      const q = gsap.utils.selector(svg);
      const [ground] = q("[data-build-ground]");
      const [sketch] = q("[data-build-sketch]");
      const [door] = q("[data-build-door]");
      const [roof] = q("[data-build-roof]");
      const [stair] = q("[data-build-stair]");
      const [bar] = q("[data-build-bar]");
      const steps = q("[data-build-step]");

      if (prefersReducedMotion()) return;

      const stages = svg.closest("section")?.querySelector("ol") ?? svg;
      gsap.set(ground, { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set(sketch, { strokeDashoffset: 1 });
      gsap.set(door, { autoAlpha: 0 });
      gsap.set(roof, { y: -120, rotation: -30, autoAlpha: 0, transformOrigin: "50% 50%" });
      gsap.set(stair, { x: 90, y: -60, rotation: 60, autoAlpha: 0, transformOrigin: "50% 50%" });
      gsap.set(bar, { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set(steps, { opacity: 0.25 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stages,
          start: "top 65%",
          end: "bottom 75%",
          scrub: 0.5,
        },
      });
      // 01 Survey · 02 Concept · 03 Permit · 04 Documents · 05 Site
      tl.to(ground, { scaleX: 1, duration: 1, ease: "power2.out" }, 0);
      tl.to(sketch, { strokeDashoffset: 0, duration: 1, ease: "power1.inOut" }, 1);
      tl.to(door, { autoAlpha: 1, duration: 0.6 }, 2.2);
      tl.to(sketch, { autoAlpha: 0, duration: 0.4 }, 2.6);
      tl.to(roof, { y: 0, rotation: 0, autoAlpha: 1, duration: 1, ease: "back.out(1.4)" }, 3);
      tl.to(stair, { x: 0, y: 0, rotation: 0, autoAlpha: 1, duration: 0.8, ease: "back.out(1.4)" }, 4);
      tl.to(bar, { scaleX: 1, duration: 0.3, ease: "power2.out" }, 4.7);
      steps.forEach((step, i) => {
        tl.to(step, { opacity: 1, duration: 0.2 }, i);
      });
    },
    { scope: ref },
  );

  return (
    <svg
      ref={ref}
      viewBox="0 0 240 320"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="currentColor"
      style={{ overflow: "visible" }}
    >
      <rect data-build-ground x="0" y="279.25" width="240" height="1.5" />
      <path
        data-build-sketch
        d={FORMS.M.d}
        transform="translate(68 180)"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        pathLength={1}
        strokeDasharray="1"
      />
      <path data-build-door d={FORMS.M.d} transform="translate(68 180)" fill="var(--color-gold)" />
      <g transform="translate(68 76) scale(1.04)">
        <g data-build-roof>
          <path d={FORMS.A.d} />
          <rect
            data-build-bar
            x={BAR.x}
            y={BAR.y}
            width={BAR.width}
            height={BAR.height}
            fill="var(--color-gold)"
          />
        </g>
      </g>
      <g transform="translate(182 230) scale(0.5)">
        <path data-build-stair d={FORMS.S.d} />
      </g>
      {/* The five stage ticks under the ground line, lit as each is reached. */}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} data-build-step transform={`translate(${i * 52} 294)`}>
          <rect width="32" height="1.5" />
          <text
            y="20"
            fontSize="10"
            fontFamily="var(--font-mono)"
            letterSpacing="0.1em"
          >
            {String(i + 1).padStart(2, "0")}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------------ */

/**
 * Studio · Three working rules — the lockup splits into its three forms.
 *
 * Wraps the rules section. A small ASM lockup sits by the section label
 * (`RelayLockup`); each rule carries one form (`RelayForm`). As the section
 * scrolls in, each form leaves its place in the lockup and travels — lifting,
 * tipping — to its own rule, so the three rules are visibly the three parts
 * of one mark.
 */
export function FormRelay({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      const [lockup] = q("[data-relay-lockup]");
      if (!lockup) return;

      const keys: FormKey[] = ["A", "S", "M"];
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 70%",
          end: "top 5%",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      // The lockup is only a departure point: its forms hand over at once.
      gsap.set(lockup, { autoAlpha: 0 });

      keys.forEach((key, i) => {
        const glyph = q(`[data-relay-form="${key}"] > svg`)[0];
        const source = lockup.querySelector(`[data-form="${key}"]`);
        const slot = glyph?.parentElement;
        if (!glyph || !source || !slot) return;

        // Centre-to-centre offset from the form's slot back to the lockup,
        // measured on untransformed boxes so refreshes stay correct.
        const from = () => {
          const a = source.getBoundingClientRect();
          const b = slot.getBoundingClientRect();
          return {
            x: a.left + a.width / 2 - (b.left + b.width / 2),
            y: a.top + a.height / 2 - (b.top + b.height / 2),
            scale: a.height / b.height,
          };
        };
        gsap.set(glyph, { transformOrigin: "50% 50%" });
        const at = i * 0.18;
        // Lift and tip out of the lockup…
        tl.fromTo(
          glyph,
          {
            x: () => from().x,
            y: () => from().y,
            scale: () => from().scale,
            rotation: 0,
          },
          {
            x: () => from().x * 0.45,
            y: () => from().y * 0.45 - 60,
            scale: 0.8,
            rotation: [-40, 55, 90][i],
            duration: 0.5,
            ease: "power1.in",
          },
          at,
        );
        // …then settle onto the rule.
        tl.to(
          glyph,
          { x: 0, y: 0, scale: 1, rotation: 0, duration: 0.5, ease: "back.out(1.5)" },
          at + 0.5,
        );
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** The departure point for FormRelay: a small lockup set by the label. */
export function RelayLockup({ height = 16, className = "" }: { height?: number; className?: string }) {
  return (
    <span data-relay-lockup className={`inline-block ${className}`}>
      <AsmMark height={height} />
    </span>
  );
}

/** One rule's form in a FormRelay. */
export function RelayForm({ form, height = 48 }: { form: FormKey; height?: number }) {
  return (
    <span data-relay-form={form} className="inline-block">
      <FormGlyph form={form} height={height} className="block" />
    </span>
  );
}

/* ------------------------------------------------------------------------ */

/**
 * 404 — the house has fallen down.
 *
 * The three forms lie tumbled on the ground line: the portal on its side, the
 * roof upside down, the stair propped against it and rocking slightly.
 */
export function FallenForms({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = ref.current;
      if (!svg || prefersReducedMotion()) return;
      const q = gsap.utils.selector(svg);
      const [stair] = q("[data-fallen-stair]");
      const [roof] = q("[data-fallen-roof]");
      gsap.to(stair, {
        rotation: 16,
        svgOrigin: "268 130",
        duration: 1.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      gsap.to(roof, {
        rotation: 4,
        svgOrigin: "176 130",
        duration: 2.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    },
    { scope: ref },
  );

  return (
    <svg
      ref={ref}
      viewBox="0 0 360 140"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="currentColor"
      style={{ overflow: "visible" }}
    >
      <rect x="0" y="129.25" width="360" height="1.5" />
      {/* Portal, toppled onto its back. */}
      <g transform="translate(20 130) rotate(-90) scale(0.62)">
        <path d={FORMS.M.d} fill="var(--color-gold)" />
      </g>
      {/* Roof, upside down, rocking on its point. */}
      <g data-fallen-roof>
        <g transform="translate(206 130) rotate(180) scale(0.6)">
          <path d={FORMS.A.d} />
          <rect x={BAR.x} y={BAR.y} width={BAR.width} height={BAR.height} fill="var(--color-gold)" />
        </g>
      </g>
      {/* Stair, leaning. */}
      <g data-fallen-stair>
        <g transform="translate(268 130) rotate(-24) translate(0 -46) scale(0.46)">
          <path d={FORMS.S.d} />
        </g>
      </g>
    </svg>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AsmMark } from "@/components/asm-mark";
import { gsap, PAGE_READY_EVENT, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

/** Dispatched by SiteHeader when its logo is clicked from another page. */
export const LOGO_INTRO_EVENT = "asm:logo-intro";

/**
 * "Threshold" — the mark assembles itself from its three forms.
 *
 * Every full page load: on the ink backdrop, the roof (A), the stair (S) and
 * the portal (M) arrive as loose forms, tumble, and lock into the lockup. A
 * gold line draws across the whole screen, then closes into the A's crossbar,
 * the last piece of the mark. The studio name settles underneath; then the
 * mark flies to the header and lands exactly on the real logo (measured,
 * FLIP-style) while the backdrop dissolves, and the two swap invisibly.
 * Clicking the header's own logo from another page replays it (see
 * LOGO_INTRO_EVENT).
 *
 * The overlay is server-rendered so it covers the page from the first paint;
 * it only shows while <html data-intro-active> is set, which the inline script
 * in the layout's <head> does before paint (unless reduced motion is on). With
 * no JavaScript that attribute is never set, so the overlay never shows.
 */
export function SiteLoader() {
  const [playing, setPlaying] = useState(true);
  const [run, setRun] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const finish = useCallback(() => {
    const html = document.documentElement;
    // Show the real logo, but hold the studio name back for one frame so it
    // fades in beside the mark instead of popping.
    html.setAttribute("data-intro-name", "");
    html.removeAttribute("data-intro-active");
    document.body.style.overflow = "";
    setPlaying(false);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => html.removeAttribute("data-intro-name")),
    );
    // Scroll scenes measured the page while scrolling was locked.
    ScrollTrigger.refresh();
    window.dispatchEvent(new Event(PAGE_READY_EVENT));
  }, []);

  useEffect(() => {
    const onLogoIntro = () => {
      if (prefersReducedMotion()) return;
      document.documentElement.setAttribute("data-intro-active", "");
      setPlaying(true);
      setRun((r) => r + 1);
    };
    window.addEventListener(LOGO_INTRO_EVENT, onLogoIntro);
    return () => window.removeEventListener(LOGO_INTRO_EVENT, onLogoIntro);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) {
      finish();
      return;
    }
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const bg = q("[data-splash-bg]")[0];
      const mark = q("[data-splash-mark]")[0] as unknown as SVGSVGElement;
      const name = q("[data-splash-name]")[0];
      const line = q("[data-splash-line]")[0];
      const [A] = q('[data-form="A"]');
      const [S] = q('[data-form="S"]');
      const [M] = q('[data-form="M"]');
      const [bar] = q('[data-form="bar"]');

      gsap.set([A, S, M], { transformOrigin: "50% 50%" });
      gsap.set(A, { x: -150, y: -70, rotation: -38, autoAlpha: 0 });
      gsap.set(S, { x: 40, y: -150, rotation: 52, autoAlpha: 0 });
      gsap.set(M, { x: 130, y: 120, rotation: 90, autoAlpha: 0 });
      gsap.set(bar, { autoAlpha: 0 });
      gsap.set(name, { autoAlpha: 0, y: 6 });
      gsap.set(line, { autoAlpha: 0 });

      const tl = gsap.timeline({ onComplete: finish, delay: 0.1 });

      // 1 · The forms arrive, loose, and lock into the lockup. Foundation
      //     first: the portal, then the roof, then the stair.
      [M, A, S].forEach((form, i) => {
        tl.to(form, { autoAlpha: 1, duration: 0.2, ease: "none" }, i * 0.14);
        tl.to(
          form,
          { x: 0, y: 0, duration: 0.85, ease: "expo.out" },
          i * 0.14,
        );
        tl.to(
          form,
          { rotation: 0, duration: 0.95, ease: "back.out(2.2)" },
          i * 0.14,
        );
      });

      // 2 · A gold line draws across the screen at the crossbar's height…
      tl.add(() => {
        const r = bar.getBoundingClientRect();
        gsap.set(line, {
          top: r.top + r.height / 2 - 1,
          left: 0,
          width: window.innerWidth,
          height: 2,
          scaleX: 0,
          autoAlpha: 1,
        });
      }, 0.8);
      tl.to(line, { scaleX: 1, duration: 0.5, ease: "expo.out" }, 0.8);
      // …then closes into the A's crossbar, the last piece of the mark.
      tl.to(
        line,
        {
          left: () => bar.getBoundingClientRect().left,
          width: () => bar.getBoundingClientRect().width,
          top: () => bar.getBoundingClientRect().top,
          height: () => bar.getBoundingClientRect().height,
          duration: 0.45,
          ease: "power3.inOut",
        },
        1.25,
      );
      tl.set(bar, { autoAlpha: 1 }, 1.7);
      tl.set(line, { autoAlpha: 0 }, 1.7);

      tl.to(name, { autoAlpha: 0.7, y: 0, duration: 0.45, ease: "power2.out" }, 1.45);

      // 3 · The mark flies into the header and lands on the real logo.
      const target = () =>
        document.querySelector<SVGSVGElement>("header [data-logo-mark]");
      const flip = () => {
        const t = target();
        const from = mark.getBoundingClientRect();
        if (!t) return { x: 0, y: -from.top - from.height, scale: 1 };
        const to = t.getBoundingClientRect();
        return {
          x: to.left - from.left,
          y: to.top - from.top,
          scale: to.height / from.height,
        };
      };
      let move = { x: 0, y: 0, scale: 1 };
      tl.add(() => {
        move = flip();
      }, 2.05);
      tl.to(name, { autoAlpha: 0, duration: 0.25, ease: "power1.in" }, 2.05);
      tl.to(
        mark,
        {
          x: () => move.x,
          y: () => move.y,
          scale: () => move.scale,
          color: () => {
            const t = target();
            return t ? getComputedStyle(t).color : "#f2f1ee";
          },
          duration: 0.8,
          ease: "power3.inOut",
        },
        2.05,
      );
      tl.to(bg, { autoAlpha: 0, duration: 0.55, ease: "power1.inOut" }, 2.3);
    }, root);

    return () => ctx.revert();
  }, [playing, run, finish]);

  if (!playing) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="asm-splash pointer-events-none fixed inset-0 z-[200]"
    >
      <div data-splash-bg className="absolute inset-0 bg-ink" />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <AsmMark
          data-splash-mark
          height={64}
          className="asm-splash-mark text-paper"
          style={{ transformOrigin: "0 0" }}
        />
        <span
          data-splash-name
          className="mt-8 text-[0.625rem] uppercase tracking-[0.22em] text-paper opacity-0"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Atelier Souhail Mharrech
        </span>
      </div>
      <div
        data-splash-line
        className="fixed opacity-0"
        style={{
          background: "var(--color-gold)",
          boxShadow: "0 0 10px rgba(211, 168, 59, 0.4)",
        }}
      />
    </div>
  );
}

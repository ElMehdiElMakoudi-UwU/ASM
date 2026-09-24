"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { AsmMark } from "@/components/asm-mark";
import {
  gsap,
  PAGE_READY_EVENT,
  prefersReducedMotion,
  ScrollTrigger,
} from "@/lib/gsap";

const trimSlash = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p);

/**
 * The curtain between pages — the forms carry you from one page to the next.
 *
 * Any in-site link: an ink curtain rises from the bottom, and inside it the
 * portal, the roof and the stair tumble up and lock into the mark, the gold
 * crossbar drawing last. Behind the curtain the next page is loaded; then the
 * forms scatter upwards, the curtain lifts off the top, and the new page rises
 * into place under it.
 *
 * It listens to clicks in the capture phase, before Next's <Link> sees them,
 * and takes over only plain left-clicks on same-site links to another page.
 * Links marked `data-no-transition` (the header logo, which replays the full
 * splash instead), new tabs, downloads, in-page anchors, /admin and the
 * back/forward buttons are all left alone. Reduced motion turns it off.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const arrival = useRef<{ path: string; resolve: () => void } | null>(null);

  // Resolves the pending navigation once the new route has rendered.
  useEffect(() => {
    const pending = arrival.current;
    if (pending && trimSlash(pathname) === trimSlash(pending.path)) {
      arrival.current = null;
      pending.resolve();
    }
  }, [pathname]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const q = gsap.utils.selector(root);
    const [panel] = q("[data-transition-panel]");
    const forms = ["M", "A", "S"].map((k) => q(`[data-form="${k}"]`)[0]);
    const [bar] = q('[data-form="bar"]');
    const html = document.documentElement;
    let busy = false;

    gsap.set(panel, { yPercent: 100 });
    gsap.set(forms, { transformOrigin: "50% 50%", autoAlpha: 0 });
    gsap.set(bar, { transformOrigin: "0% 50%", autoAlpha: 0 });

    const cover = () =>
      new Promise<void>((resolve) => {
        const tl = gsap.timeline({ onComplete: resolve });
        tl.set(root, { visibility: "visible" });
        tl.fromTo(
          panel,
          { yPercent: 100 },
          { yPercent: 0, duration: 0.7, ease: "power4.inOut" },
          0,
        );
        forms.forEach((form, i) => {
          tl.fromTo(
            form,
            { autoAlpha: 0, y: 90, rotation: [90, -40, 60][i] },
            {
              autoAlpha: 1,
              y: 0,
              rotation: 0,
              duration: 0.55,
              ease: "back.out(1.8)",
            },
            0.32 + i * 0.07,
          );
        });
        tl.fromTo(
          bar,
          { autoAlpha: 0, scaleX: 0 },
          { autoAlpha: 1, scaleX: 1, duration: 0.25, ease: "power2.out" },
          0.72,
        );
      });

    const uncover = () =>
      new Promise<void>((resolve) => {
        const main = document.getElementById("main");
        const tl = gsap.timeline({
          onComplete: () => {
            gsap.set(root, { visibility: "hidden" });
            gsap.set(panel, { yPercent: 100 });
            resolve();
          },
        });
        [...forms, bar].forEach((form, i) => {
          tl.to(
            form,
            {
              autoAlpha: 0,
              y: -70,
              rotation: [-30, 40, -60, 0][i],
              duration: 0.4,
              ease: "power2.in",
            },
            i * 0.04,
          );
        });
        tl.to(panel, { yPercent: -100, duration: 0.8, ease: "power4.inOut" }, 0.15);
        if (main) {
          tl.fromTo(
            main,
            { y: 80 },
            { y: 0, duration: 0.8, ease: "power4.out", clearProps: "transform" },
            0.35,
          );
        }
      });

    const go = async (href: string) => {
      busy = true;
      html.setAttribute("data-transitioning", "");
      await cover();

      const target = new URL(href, window.location.href);
      const arrived = new Promise<void>((resolve) => {
        arrival.current = { path: target.pathname, resolve };
        // Never leave the curtain down if the route fails to render.
        window.setTimeout(resolve, 6000);
      });
      router.push(href);
      await arrived;
      // Let the new page paint and settle before measuring it.
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      if (!target.hash) window.scrollTo({ top: 0, behavior: "instant" });
      ScrollTrigger.refresh();

      html.removeAttribute("data-transitioning");
      window.dispatchEvent(new Event(PAGE_READY_EVENT));
      await uncover();
      busy = false;
    };

    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }
      const link = (e.target as Element | null)?.closest?.("a");
      if (!link || !link.href) return;
      if (link.target && link.target !== "_self") return;
      if (link.hasAttribute("download") || "noTransition" in link.dataset) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (/^\/(admin|api)(\/|$)/.test(url.pathname)) return;
      if (trimSlash(url.pathname) === trimSlash(window.location.pathname)) return;
      if (prefersReducedMotion() || html.hasAttribute("data-intro-active")) return;

      // Stops <Link> from navigating on its own; the curtain drives it.
      e.preventDefault();
      if (busy) return;
      void go(url.pathname + url.search + url.hash);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[150] overflow-hidden"
      style={{ visibility: "hidden" }}
    >
      <div data-transition-panel className="absolute inset-0 bg-ink">
        {/* The curtain's leading edge is the gold line. */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gold" />
        <div className="absolute inset-0 flex items-center justify-center">
          <AsmMark height={52} className="text-paper" />
        </div>
      </div>
    </div>
  );
}

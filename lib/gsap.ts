"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Fired when a page is uncovered: by SiteLoader when the splash hands off, and
 * by PageTransition as its curtain starts to lift.
 */
export const PAGE_READY_EVENT = "asm:page-ready";

/**
 * Runs `callback` once the page is actually visible — immediately if nothing
 * covers it, otherwise when the splash or the page-transition curtain lifts.
 * Returns a function that cancels the wait.
 */
export function whenPageReady(callback: () => void) {
  const html = document.documentElement;
  if (
    !html.hasAttribute("data-intro-active") &&
    !html.hasAttribute("data-transitioning")
  ) {
    callback();
    return () => {};
  }
  const onReady = () => callback();
  window.addEventListener(PAGE_READY_EVENT, onReady, { once: true });
  return () => window.removeEventListener(PAGE_READY_EVENT, onReady);
}

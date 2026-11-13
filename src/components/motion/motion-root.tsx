"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * All scroll animations are declared in server-rendered HTML through data attributes
 * (data-reveal, data-split, data-counter, data-hscroll, ...). Once the browser is idle this component loads only
 * the code the current page needs and wires it up, so:
 *  - every piece of content is in the HTML for crawlers, with or without JS;
 *  - nothing above the fold is hidden or delayed (no LCP/CLS cost);
 *  - animation code never blocks the first render;
 *  - a page with only simple entrance animations never downloads GSAP (see the three files below).
 *
 *   lite-motion.ts    fade/rise/clip, staggered groups, word-by-word headings, tape strips   (every page, ~2 KB)
 *   smooth-scroll.ts  Lenis wheel smoothing                                                  (mouse/trackpad only)
 *   gsap-scenes.ts    scrubbed scenes: counters, horizontal track, stepped FAQ, ...          (pages that have one, ~45 KB)
 */

/** Markers that need GSAP + ScrollTrigger. Only the home page has them. */
const SCENES = "[data-hscroll], [data-steps], [data-counter], [data-draw], [data-hero-content], [data-velocity-skew]";

export function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    let disposed = false;
    const undo: Array<() => void> = [];

    const start = async () => {
      // visitors who ask for reduced motion get the static page and never download the animation code
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const main = document.getElementById("main");
      if (!main) return;

      const [reveals, smooth, scenes] = await Promise.all([
        import("@/components/motion/lite-motion"),
        // smooth scrolling is for mice and trackpads; touch screens keep native scrolling and never download Lenis
        matchMedia("(pointer: fine)").matches ? import("@/components/motion/smooth-scroll") : null,
        main.querySelector(SCENES) ? import("@/components/motion/gsap-scenes") : null,
      ]);
      if (disposed) return;

      const lenis = smooth?.smoothScroll() ?? null;
      lenis?.resize();
      undo.push(reveals.setupReveals(main));

      if (scenes) {
        const cleanup = await scenes.setupScenes(main, lenis && smooth ? { lenis, driveWith: smooth.driveWith, defaultTicker: smooth.defaultTicker } : undefined);
        if (disposed) cleanup();
        else undo.push(cleanup);
      }
    };

    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const cic = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = ric(() => void start(), { timeout: 1500 });
    return () => {
      disposed = true;
      cic(handle);
      undo.splice(0).reverse().forEach((fn) => fn());
    };
  }, [pathname]);

  return null;
}

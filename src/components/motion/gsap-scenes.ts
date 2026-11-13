import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";
import type { Ticker } from "@/components/motion/smooth-scroll";

/**
 * The scroll-scrubbed scenes of the home page: number counters, the line that draws itself, the hero text drifting
 * away, the marquee leaning with scroll speed, the horizontal product track and the stepped FAQ.
 * These need GSAP + ScrollTrigger (~45 KB gzipped), so motion-root.tsx loads this file only on a page that has one
 * of those markers. The simple entrance animations live in lite-motion.ts and need none of it.
 */

export type SmoothScroll = { lenis: Lenis; driveWith: (ticker: Ticker) => void; defaultTicker: Ticker };

export async function setupScenes(main: HTMLElement, smooth?: SmoothScroll) {
  gsap.registerPlugin(ScrollTrigger);
  const undo: Array<() => void> = [];

  if (smooth) {
    // Lenis takes its frames from GSAP's ticker here, so the scroll position and the scrubbed tweens stay in step.
    const off = smooth.lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);
    smooth.driveWith(gsap.ticker);
    undo.push(() => {
      off();
      smooth.driveWith(smooth.defaultTicker);
    });
  }
  // DrawSVG is a separate file: fetched only on a page that has a path to draw
  if (main.querySelector("[data-draw]")) {
    const { DrawSVGPlugin } = await import("gsap/DrawSVGPlugin");
    gsap.registerPlugin(DrawSVGPlugin);
  }

  const mm = gsap.matchMedia();
  mm.add(
    {
      motion: "(prefers-reduced-motion: no-preference)",
      desktop: "(min-width: 1024px)",
      tall: "(min-height: 680px)",
    },
    (ctx) => {
      const { motion, desktop, tall } = ctx.conditions as Record<string, boolean>;
      if (!motion) return;
      const cleanups: (() => void)[] = [];
      // Only animate what the visitor hasn't seen yet — content in the first viewport stays put.
      const belowFold = (el: Element) => el.getBoundingClientRect().top > window.innerHeight * 0.9;
      const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = main) => Array.from(root.querySelectorAll<T & Element>(sel));

      /* number counters (final value is already in the HTML) */
      const fmt = new Intl.NumberFormat("fa-IR");
      $("[data-counter]").forEach((el) => {
        if (!belowFold(el)) return;
        const target = Number(el.dataset.counter);
        const state = { v: 0 };
        el.textContent = fmt.format(0);
        gsap.to(state, {
          v: target,
          duration: 2.2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => (el.textContent = fmt.format(Math.round(state.v))),
        });
      });

      /* svg line drawing tied to scroll */
      $<SVGPathElement>("[data-draw]").forEach((path) => {
        gsap.fromTo(
          path,
          { drawSVG: "0%" },
          { drawSVG: "100%", ease: "none", scrollTrigger: { trigger: path.closest("[data-draw-root]") ?? path, start: "top 70%", end: "bottom 60%", scrub: 0.6 } },
        );
      });

      /* hero content drifts away as you scroll past it (scroll-driven, never on load) */
      $("[data-hero-content]").forEach((el) => {
        gsap.to(el, {
          yPercent: -12,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: { trigger: el.closest("[data-hero]") ?? el, start: "top top", end: "bottom top", scrub: true },
        });
      });

      /* marquee leans with scroll velocity */
      $("[data-velocity-skew]").forEach((el) => {
        const skew = gsap.quickTo(el, "skewX", { duration: 0.5, ease: "power3" });
        ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => skew(gsap.utils.clamp(-4, 4, self.getVelocity() / -400)),
          onLeave: () => skew(0),
          onLeaveBack: () => skew(0),
        });
      });

      /* horizontal scroll sections (desktop). Sticky CSS instead of pin, so React's DOM is never re-parented. */
      if (desktop) {
        $("[data-hscroll]").forEach((section) => {
          const track = section.querySelector<HTMLElement>(".h-track");
          const viewport = section.querySelector<HTMLElement>(".h-viewport");
          const bar = section.querySelector<HTMLElement>("[data-hscroll-progress]");
          if (!track || !viewport) return;
          section.classList.add("is-hscroll");
          const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
          const size = () => (section.style.height = `${distance() + window.innerHeight}px`);
          size();
          gsap.to(track, {
            x: () => distance(), // RTL: moving right reveals the cards on the left
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${distance()}`,
              scrub: 0.7,
              invalidateOnRefresh: true,
              onRefreshInit: size,
              onUpdate: (self) => bar && gsap.set(bar, { scaleX: self.progress }),
            },
          });
          cleanups.push(() => {
            section.classList.remove("is-hscroll");
            section.style.height = "";
          });
        });
      }

      /* scroll-stepped sections (desktop): the section holds still while each <details> opens in turn,
         then normal scrolling resumes. Sticky CSS again — no pinning, no DOM re-parenting. */
      if (desktop && tall) {
        $("[data-steps]").forEach((section) => {
          const items = $<HTMLDetailsElement>("details", section);
          if (items.length < 2) return;
          const counter = section.querySelector<HTMLElement>("[data-steps-counter]");
          const bar = section.querySelector<HTMLElement>("[data-steps-progress]");
          const total = fmt.format(items.length);
          const stepPx = () => window.innerHeight * 0.55;
          const size = () => (section.style.height = `${window.innerHeight + stepPx() * items.length}px`);
          section.classList.add("is-stepped");
          size();
          let current = -1;
          const show = (index: number) => {
            if (index === current) return;
            current = index;
            items.forEach((d, i) => (d.open = i === index));
            if (counter) counter.textContent = `${fmt.format(index + 1)} / ${total}`;
          };
          show(0);
          ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: () => `+=${stepPx() * items.length}`,
            invalidateOnRefresh: true,
            onRefreshInit: size,
            onUpdate: (self) => {
              show(Math.min(items.length - 1, Math.floor(self.progress * items.length)));
              if (bar) gsap.set(bar, { scaleX: self.progress });
            },
          });
          cleanups.push(() => {
            section.classList.remove("is-stepped");
            section.style.height = "";
          });
        });
      }

      return () => cleanups.forEach((fn) => fn());
    },
  );

  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  ScrollTrigger.refresh();

  return () => {
    mm.revert();
    undo.forEach((fn) => fn());
  };
}

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * All scroll animations are declared in server-rendered HTML through data attributes
 * (data-reveal, data-split, data-counter, data-hscroll, ...). This component lazy-loads
 * GSAP + Lenis once the browser is idle and wires them up, so:
 *  - every piece of content is in the HTML for crawlers, with or without JS;
 *  - nothing above the fold is hidden or delayed (no LCP/CLS cost);
 *  - animation code never blocks the first render.
 */

type Engine = Awaited<ReturnType<typeof createEngine>>;
let enginePromise: Promise<Engine> | null = null;

async function createEngine() {
  const [{ gsap }, { ScrollTrigger }, { SplitText }, { DrawSVGPlugin }, { default: Lenis }] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
    import("gsap/SplitText"),
    import("gsap/DrawSVGPlugin"),
    import("lenis"),
  ]);
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

  let lenis: InstanceType<typeof Lenis> | null = null;
  if (matchMedia("(prefers-reduced-motion: no-preference) and (pointer: fine)").matches) {
    lenis = new Lenis({ lerp: 0.11, anchors: { offset: -90 }, autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis?.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  return { gsap, ScrollTrigger, SplitText, lenis };
}

const loadEngine = () => (enginePromise ??= createEngine());

function setup({ gsap, ScrollTrigger, SplitText }: Engine) {
  const main = document.getElementById("main");
  const mm = gsap.matchMedia();
  if (!main) return mm;

  mm.add(
    {
      motion: "(prefers-reduced-motion: no-preference)",
      desktop: "(min-width: 1024px)",
      fine: "(pointer: fine)",
      tall: "(min-height: 680px)",
    },
    (ctx) => {
      const { motion, desktop, fine, tall } = ctx.conditions as Record<string, boolean>;
      if (!motion) return;
      const cleanups: (() => void)[] = [];
      // Only animate what the visitor hasn't seen yet — content in the first viewport stays put.
      const belowFold = (el: Element) => el.getBoundingClientRect().top > window.innerHeight * 0.9;
      const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = main) => Array.from(root.querySelectorAll<T & Element>(sel));

      /* reveal single elements */
      const presets: Record<string, gsap.TweenVars> = {
        up: { y: 56, opacity: 0 },
        fade: { opacity: 0 },
        scale: { scale: 0.9, opacity: 0 },
        clip: { clipPath: "inset(0 0 100% 0 round 28px)" },
        tilt: { y: 80, rotate: -3, opacity: 0 },
      };
      $("[data-reveal]").forEach((el) => {
        if (!belowFold(el)) return;
        gsap.from(el, {
          ...presets[el.dataset.reveal || "up"],
          duration: 1.1,
          ease: "power3.out",
          delay: Number(el.dataset.delay ?? 0),
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      /* staggered groups */
      $("[data-reveal-group]").forEach((group) => {
        if (!belowFold(group)) return;
        gsap.from($("[data-reveal-item]", group), {
          y: 48,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: group, start: "top 85%", once: true },
        });
      });

      /* headings: split by WORDS only — splitting Persian into characters breaks letter joining */
      $("[data-split]").forEach((el) => {
        if (!belowFold(el)) return;
        const split = SplitText.create(el, { type: "words", mask: "words" });
        gsap.from(split.words, {
          yPercent: 115,
          duration: 1,
          ease: "power4.out",
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      /* tape strips that "stick" onto the page */
      $("[data-tape]").forEach((el) => {
        if (!belowFold(el)) return;
        gsap.from(el, {
          scaleX: 0,
          transformOrigin: "right center",
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

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

      /* parallax */
      $("[data-parallax]").forEach((el) => {
        const amount = Number(el.dataset.parallax || 12);
        gsap.fromTo(
          el,
          { yPercent: -amount },
          { yPercent: amount, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } },
        );
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
          onUpdate: (self) => skew(gsap.utils.clamp(-8, 8, self.getVelocity() / -250)),
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

      /* magnetic buttons */
      if (fine) {
        document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
          const x = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
          const y = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            x((e.clientX - (r.left + r.width / 2)) * 0.25);
            y((e.clientY - (r.top + r.height / 2)) * 0.35);
          };
          const leave = () => {
            x(0);
            y(0);
          };
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerleave", leave);
            gsap.set(el, { x: 0, y: 0 });
          });
        });
      }

      /* list with a floating image that follows the cursor */
      if (fine && desktop) {
        $("[data-hover-reveal]").forEach((list) => {
          const media = list.querySelector<HTMLElement>("[data-hover-media]");
          const img = media?.querySelector("img");
          if (!media || !img) return;
          const x = gsap.quickTo(media, "x", { duration: 0.6, ease: "power3" });
          const y = gsap.quickTo(media, "y", { duration: 0.6, ease: "power3" });
          const move = (e: PointerEvent) => {
            const r = list.getBoundingClientRect();
            // sit just to the left of the cursor (RTL: away from the row titles)
            x(Math.max(0, e.clientX - r.left - media.offsetWidth - 48));
            y(e.clientY - r.top - media.offsetHeight / 2);
          };
          const enterItem = (e: Event) => {
            const item = e.currentTarget as HTMLElement;
            if (item.dataset.image) img.src = item.dataset.image;
            gsap.to(media, { autoAlpha: 1, scale: 1, rotate: Number(item.dataset.rotate ?? -4), duration: 0.45, ease: "power3.out" });
          };
          const leave = () => gsap.to(media, { autoAlpha: 0, scale: 0.6, duration: 0.35, ease: "power3.in" });
          gsap.set(media, { autoAlpha: 0, scale: 0.6 });
          const items = $("[data-hover-item]", list);
          items.forEach((it) => it.addEventListener("pointerenter", enterItem));
          list.addEventListener("pointermove", move);
          list.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            items.forEach((it) => it.removeEventListener("pointerenter", enterItem));
            list.removeEventListener("pointermove", move);
            list.removeEventListener("pointerleave", leave);
          });
        });
      }

      return () => cleanups.forEach((fn) => fn());
    },
  );
  return mm;
}

export function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    let disposed = false;
    let mm: ReturnType<typeof setup> | undefined;
    const start = async () => {
      const engine = await loadEngine();
      if (disposed) return;
      engine.lenis?.resize();
      mm = setup(engine);
      engine.ScrollTrigger.refresh();
    };
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const cic = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = ric(() => void start(), { timeout: 1500 });
    return () => {
      disposed = true;
      cic(handle);
      mm?.revert();
    };
  }, [pathname]);

  return null;
}

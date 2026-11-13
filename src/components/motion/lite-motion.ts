/**
 * The simple entrance animations every page uses: things that fade or rise into place, a staggered group of cards,
 * headings that rise word by word, and the small tape strips. They run on the Web Animations API with one
 * IntersectionObserver, so a page that only needs these does not download GSAP + ScrollTrigger (~45 KB gzipped)
 * and does not run ScrollTrigger's permanent animation-frame loop.
 *
 * Same markup contract as before (data-reveal, data-reveal-group/-item, data-split, data-tape) and the same
 * timings and eases (the cubic-beziers below are GSAP's power2.out, power3.out, expo.out and power2.inOut).
 * Content is in the HTML for crawlers; only what is below the fold gets hidden, and only once this has loaded.
 */

const POWER2_OUT = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
const POWER3_OUT = "cubic-bezier(0.215, 0.61, 0.355, 1)";
const EXPO_OUT = "cubic-bezier(0.19, 1, 0.22, 1)";
const POWER2_IN_OUT = "cubic-bezier(0.455, 0.03, 0.515, 0.955)";

type Frame = Record<string, string>;
type Timing = { duration: number; delay?: number; easing: string };
const kebab = (prop: string) => prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

/** Splits an element's text into words, each inside a clipping mask; nested elements (coloured spans) are kept. */
function splitWords(el: HTMLElement) {
  const words: HTMLElement[] = [];
  const walk = (node: Node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
        continue;
      }
      if (child.nodeType !== Node.TEXT_NODE) continue;
      const fragment = document.createDocumentFragment();
      for (const part of (child.textContent ?? "").split(/(\s+)/)) {
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          fragment.append(part);
          continue;
        }
        const mask = document.createElement("span");
        mask.className = "split-mask";
        const word = document.createElement("span");
        word.className = "split-word";
        word.textContent = part;
        mask.append(word);
        fragment.append(mask);
        words.push(word);
      }
      child.replaceWith(fragment);
    }
  };
  walk(el);
  return words;
}

export function setupReveals(main: HTMLElement) {
  const undo: Array<() => void> = [];
  const running = new Set<Animation>();

  /** Puts the element in its starting pose (inline); returns a function that removes exactly those styles again. */
  const pose = (el: HTMLElement, from: Frame) => {
    for (const [prop, value] of Object.entries(from)) el.style.setProperty(kebab(prop), value);
    const release = () => {
      for (const prop of Object.keys(from)) el.style.removeProperty(kebab(prop));
      if (!el.getAttribute("style")) el.removeAttribute("style"); // leave no empty style="" behind
    };
    undo.push(release);
    return release;
  };

  const play = (el: HTMLElement, from: Frame, to: Frame, timing: Timing, release: () => void) => {
    // fill "both" holds the end pose until the inline starting pose is removed, so there is never a flash
    const animation = el.animate([from, to], { ...timing, fill: "both" });
    running.add(animation);
    animation.finished
      .then(() => {
        release();
        animation.cancel();
        running.delete(animation);
      })
      .catch(() => {}); // cancelled by cleanup
  };

  // One observer per trigger line: an element fires once, when its top edge rises above (100 - line)% of the viewport.
  const observers = new Map<number, { io: IntersectionObserver; jobs: Map<Element, Array<() => void>> }>();
  const when = (el: Element, line: number, job: () => void) => {
    let entry = observers.get(line);
    if (!entry) {
      const jobs = new Map<Element, Array<() => void>>();
      const io = new IntersectionObserver(
        (hits) => {
          for (const hit of hits) {
            if (!hit.isIntersecting) continue;
            io.unobserve(hit.target);
            jobs.get(hit.target)?.forEach((run) => run());
            jobs.delete(hit.target);
          }
        },
        { rootMargin: `0px 0px -${100 - line}% 0px` },
      );
      entry = { io, jobs };
      observers.set(line, entry);
    }
    entry.jobs.set(el, [...(entry.jobs.get(el) ?? []), job]);
    entry.io.observe(el);
  };

  // Read every position first and change styles afterwards, so the page is laid out once instead of once per element.
  const fold = window.innerHeight * 0.9;
  const below = <T extends HTMLElement>(selector: string) =>
    Array.from(main.querySelectorAll<T>(selector)).filter((el) => el.getBoundingClientRect().top > fold);
  const reveals = below("[data-reveal]");
  const groups = below("[data-reveal-group]");
  const headings = below("[data-split]");
  const strips = below("[data-tape]");

  /* fade / rise / clip (the clip reveal wipes a block open from the top) */
  for (const el of reveals) {
    const kind = el.dataset.reveal || "up";
    const clip = kind === "clip";
    const from: Frame = clip
      ? { clipPath: "inset(0 0 100% 0 round 28px)" }
      : kind === "fade"
        ? { opacity: "0" }
        : { opacity: "0", transform: "translateY(28px)" };
    const to: Frame = clip ? { clipPath: "inset(0 0 0% 0 round 28px)" } : kind === "fade" ? { opacity: "1" } : { opacity: "1", transform: "none" };
    const release = pose(el, from);
    when(el, 90, () => play(el, from, to, { duration: clip ? 1300 : 1000, easing: clip ? POWER2_IN_OUT : POWER2_OUT }, release));
  }

  /* groups of cards that arrive one after another */
  for (const group of groups) {
    const from: Frame = { opacity: "0", transform: "translateY(28px)" };
    const to: Frame = { opacity: "1", transform: "none" };
    const items = Array.from(group.querySelectorAll<HTMLElement>("[data-reveal-item]")).map((item) => ({ item, release: pose(item, from) }));
    when(group, 88, () => items.forEach(({ item, release }, i) => play(item, from, to, { duration: 950, delay: i * 70, easing: POWER2_OUT }, release)));
  }

  /* Headings rise word by word. The text is split only when the heading is about to appear (never at load, so
     it cannot collide with hydration), and by words only: cutting Persian into letters breaks the joined forms. */
  for (const heading of headings) {
    const original = heading.innerHTML;
    heading.style.opacity = "0";
    undo.push(() => {
      heading.style.removeProperty("opacity");
      if (heading.innerHTML !== original) heading.innerHTML = original;
    });
    when(heading, 90, () => {
      const words = splitWords(heading);
      const from: Frame = { transform: "translateY(105%)" };
      const to: Frame = { transform: "none" };
      const releases = words.map((word) => pose(word, from));
      heading.style.removeProperty("opacity");
      words.forEach((word, i) => play(word, from, to, { duration: 950, delay: i * 50, easing: POWER3_OUT }, releases[i]));
    });
  }

  /* tape strips that stick on from the right */
  for (const strip of strips) {
    const from: Frame = { transform: "scaleX(0)", transformOrigin: "right center" };
    const to: Frame = { transform: "none", transformOrigin: "right center" };
    const release = pose(strip, from);
    when(strip, 90, () => play(strip, from, to, { duration: 1100, easing: EXPO_OUT }, release));
  }

  return () => {
    observers.forEach(({ io }) => io.disconnect());
    running.forEach((animation) => animation.cancel());
    running.clear();
    undo.forEach((fn) => fn());
  };
}

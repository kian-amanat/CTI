import Lenis from "lenis";

/**
 * Smooth (eased) wheel scrolling for mice and trackpads. Touch screens keep native scrolling and never download this.
 *
 * Lenis needs animation frames only while the page is moving. Left running, it makes the browser produce a
 * main-thread frame 60 times a second for as long as the tab is open (about 9% of a mid-range phone-class CPU on the
 * home page), so the loop sleeps after ~0.7 s of stillness and wakes on any input that can scroll.
 */

/** What produces Lenis' frames: a plain requestAnimationFrame loop, or GSAP's ticker on pages that use ScrollTrigger. */
export type Ticker = {
  add: (tick: (seconds: number) => void) => unknown;
  remove: (tick: (seconds: number) => void) => unknown;
};

export const defaultTicker: Ticker = (() => {
  const ticks = new Set<(seconds: number) => void>();
  let frame = 0;
  const loop = (ms: number) => {
    frame = requestAnimationFrame(loop);
    ticks.forEach((tick) => tick(ms / 1000));
  };
  return {
    add(tick) {
      ticks.add(tick);
      if (ticks.size === 1) frame = requestAnimationFrame(loop);
    },
    remove(tick) {
      ticks.delete(tick);
      if (!ticks.size) cancelAnimationFrame(frame);
    },
  };
})();

let lenis: Lenis | null = null;
let ticker: Ticker = defaultTicker;
let running = false;
let still = 0;

const tick = (seconds: number) => {
  lenis?.raf(seconds * 1000);
  still = lenis?.isScrolling ? 0 : still + 1;
  if (still > 40) sleep();
};
function sleep() {
  running = false;
  ticker.remove(tick);
}
function wake() {
  still = 0;
  if (running || !lenis) return;
  running = true;
  lenis.time = 0; // otherwise the first frame after a pause would be one huge time step
  ticker.add(tick);
}

export function smoothScroll() {
  if (!lenis) {
    lenis = new Lenis({ lerp: 0.11, anchors: { offset: -90 }, autoRaf: false });
    for (const type of ["wheel", "touchstart", "keydown", "pointerdown", "scroll", "hashchange"]) {
      window.addEventListener(type, wake, { passive: true });
    }
    wake();
  }
  return lenis;
}

/** Switch what drives the frames (GSAP's ticker while a page with ScrollTrigger scenes is open). */
export function driveWith(next: Ticker) {
  if (next === ticker) return;
  const wasRunning = running;
  if (wasRunning) sleep();
  ticker = next;
  if (wasRunning) wake();
}

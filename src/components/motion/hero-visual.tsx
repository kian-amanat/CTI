"use client";

import { useEffect, useRef, useState } from "react";
import { TapeRollsIllustration } from "@/components/motion/tape-rolls-illustration";
import { cx } from "@/lib/cx";

type NavigatorWithHints = Navigator & { connection?: { saveData?: boolean; effectiveType?: string }; deviceMemory?: number };

function canRun3D() {
  const nav = navigator as NavigatorWithHints;
  // a wide screen with a mouse or trackpad (the scene follows the pointer); tablets keep the SVG
  if (!matchMedia("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return false;
  if (matchMedia("(prefers-reduced-data: reduce)").matches || nav.connection?.saveData) return false;
  if (["slow-2g", "2g", "3g"].includes(nav.connection?.effectiveType ?? "")) return false;
  if ((nav.hardwareConcurrency ?? 4) < 4 || (nav.deviceMemory ?? 8) < 4) return false;
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

/** Any of these is a sign that a person is looking at the page (a prefetcher, a bot or a link preview never produces one). */
const SIGNS_OF_LIFE = ["pointermove", "pointerdown", "wheel", "keydown", "scroll"] as const;

/**
 * Desktop: the SVG illustration is swapped for a live three.js scene (~130 KB gzipped) once the page has loaded,
 * the browser is idle, the hero is on screen and the visitor has moved the pointer or scrolled — so a visit that
 * ends without any interaction never downloads it, and it never competes with content for bandwidth or CPU.
 * Phones, tablets, reduced motion, data saver, slow connections and weak machines keep the SVG; so does a machine
 * that turns out too slow (the scene gives up by itself, see tape-scene.ts).
 */
export function HeroVisual({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  // "svg": the illustration is showing. "fading": the 3D scene is fading in over it. "3d": the scene is showing and
  // the illustration is removed, so its looping animation stops costing anything.
  const [phase, setPhase] = useState<"svg" | "fading" | "3d">("svg");
  const setReady = (ready: boolean) => setPhase(ready ? "fading" : "svg");

  useEffect(() => {
    if (phase !== "fading") return;
    const id = window.setTimeout(() => setPhase("3d"), 900); // after the cross-fade
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvasHost = canvasRef.current;
    if (!wrap || !canvasHost || !canRun3D()) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    let idleId: number | undefined;
    let checkedAt = 0;

    const start = async () => {
      const { createTapeScene } = await import("@/components/motion/tape-scene");
      if (cancelled) return;
      const hero = wrap.closest<HTMLElement>("[data-hero]") ?? wrap;
      dispose = createTapeScene(
        canvasHost,
        hero,
        () => setReady(true),
        () => setReady(false),
      ).dispose;
    };
    const disarm = () => SIGNS_OF_LIFE.forEach((type) => window.removeEventListener(type, onSign));
    function onSign() {
      const now = performance.now();
      if (now - checkedAt < 250) return;
      checkedAt = now;
      const rect = wrap!.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return; // hero scrolled away: wait for the next sign
      disarm();
      idleId = (window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300)))(() => void start(), { timeout: 2500 });
    }
    const arm = () => SIGNS_OF_LIFE.forEach((type) => window.addEventListener(type, onSign, { passive: true }));
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", arm);
      disarm();
      if (idleId) (window.cancelIdleCallback ?? window.clearTimeout)(idleId);
      dispose?.();
    };
  }, []);

  return (
    <div ref={wrapRef} className={cx("relative aspect-square w-full", className)}>
      {phase !== "3d" && (
        <TapeRollsIllustration className={cx("absolute inset-0 transition-opacity duration-700", phase === "fading" && "opacity-0")} />
      )}
      <div
        ref={canvasRef}
        aria-hidden="true"
        className={cx("absolute -inset-[12%] transition-opacity duration-1000", phase === "svg" ? "opacity-0" : "opacity-100")}
      />
    </div>
  );
}

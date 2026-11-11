"use client";

import { useEffect, useRef, useState } from "react";
import { TapeRollsIllustration } from "@/components/motion/tape-rolls-illustration";
import { cn } from "@/lib/utils";

type NavigatorWithHints = Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };

function canRun3D() {
  const nav = navigator as NavigatorWithHints;
  if (!matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)").matches) return false;
  if (nav.connection?.saveData) return false;
  if ((nav.hardwareConcurrency ?? 4) < 4 || (nav.deviceMemory ?? 8) < 4) return false;
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

/**
 * Desktop: the SVG illustration is swapped for a live three.js scene once the page has fully
 * loaded and the browser is idle — three.js never competes with content for bandwidth or CPU.
 * Phones / reduced motion / data saver: the SVG stays.
 */
export function HeroVisual({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvasHost = canvasRef.current;
    if (!wrap || !canvasHost || !canRun3D()) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    let idleId: number | undefined;

    const start = async () => {
      const { createTapeScene } = await import("@/components/motion/tape-scene");
      if (cancelled) return;
      const hero = wrap.closest<HTMLElement>("[data-hero]") ?? wrap;
      dispose = createTapeScene(canvasHost, hero, () => setReady(true)).dispose;
    };
    const kick = () => {
      idleId = (window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300)))(() => void start(), {
        timeout: 2500,
      });
    };
    if (document.readyState === "complete") kick();
    else window.addEventListener("load", kick, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", kick);
      if (idleId) (window.cancelIdleCallback ?? window.clearTimeout)(idleId);
      dispose?.();
    };
  }, []);

  return (
    <div ref={wrapRef} className={cn("relative aspect-square w-full", className)}>
      <TapeRollsIllustration className={cn("absolute inset-0 transition-opacity duration-700", ready && "opacity-0")} />
      <div
        ref={canvasRef}
        aria-hidden="true"
        className={cn("absolute -inset-[12%] opacity-0 transition-opacity duration-1000", ready && "opacity-100")}
      />
    </div>
  );
}

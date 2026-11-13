"use client";

import { useEffect, useRef } from "react";

/**
 * The animated strip of the marquee. It only moves while it is on screen: a looping animation nobody can see
 * still makes the browser do main-thread work on every frame (measured: ~9% of a phone-class CPU on the home
 * page, all of it spent on a strip that sat far below the visible area).
 */
export function MarqueeTrack({ className, style, children }: { className?: string; style?: React.CSSProperties; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => (el.dataset.run = entry.isIntersecting ? "true" : "false"), { rootMargin: "120px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

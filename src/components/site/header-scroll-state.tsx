"use client";

import { useEffect } from "react";

/** Hides the header while scrolling down, shows it again on the way up. No animation library needed. */
export function HeaderScrollState() {
  useEffect(() => {
    const header = document.getElementById("site-header");
    if (!header) return;
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      header.dataset.scrolled = String(y > 8);
      // only flip state on a deliberate movement, so smooth-scroll's tiny final frames don't reset it
      if (Math.abs(dy) > 6) {
        header.dataset.hidden = String(y > 240 && dy > 0);
        lastY = y;
      }
      if (y <= 240) header.dataset.hidden = "false";
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    // never keep the header hidden while something inside it has focus
    const onFocus = () => (header.dataset.hidden = "false");
    header.addEventListener("focusin", onFocus);
    return () => {
      window.removeEventListener("scroll", onScroll);
      header.removeEventListener("focusin", onFocus);
    };
  }, []);
  return null;
}

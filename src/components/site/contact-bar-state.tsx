"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Hides the phone contact bar while a block with the same buttons is on screen (anything marked `data-cta`, and the
 * footer), so a page never shows the same two buttons twice at once. One IntersectionObserver, armed again on every
 * page change. Without JavaScript the bar simply stays where it is.
 */
export function ContactBarState() {
  const pathname = usePathname();

  useEffect(() => {
    const bar = document.getElementById("contact-bar");
    if (!bar) return;
    const targets = Array.from(document.querySelectorAll("[data-cta]"));

    // decide the first state synchronously, so the bar does not flash in and slide out again on a page that opens
    // on a call to action; the observer then keeps it up to date
    const visibleNow = targets.some((el) => {
      const rect = el.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    });
    bar.dataset.hidden = String(visibleNow);
    bar.dataset.ready = "";

    const onScreen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) onScreen.add(entry.target);
        else onScreen.delete(entry.target);
      }
      bar.dataset.hidden = String(onScreen.size > 0);
    });
    targets.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      delete bar.dataset.hidden;
    };
  }, [pathname]);

  return null;
}

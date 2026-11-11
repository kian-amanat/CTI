"use client";

import { useEffect } from "react";

type DataLayerWindow = Window & {
  dataLayer?: Record<string, unknown>[];
  gtag?: (...args: unknown[]) => void;
};

/**
 * One delegated listener for every element with data-track="call|whatsapp".
 * Sends a GA4 event when analytics is installed; otherwise it's a no-op.
 * This is how we'll show the client which products bring in phone calls.
 */
export function ClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-track]");
      if (!el) return;
      const w = window as DataLayerWindow;
      const payload = {
        event: "contact_click",
        contact_method: el.dataset.track,
        contact_label: el.dataset.trackLabel ?? "",
        page_path: location.pathname,
      };
      if (w.gtag) w.gtag("event", payload.event, payload);
      else w.dataLayer?.push(payload);
      if (process.env.NODE_ENV === "development") console.info("[track]", payload);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}

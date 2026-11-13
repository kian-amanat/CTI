"use client";

import { ViewTransition } from "react";
import { usePathname } from "next/navigation";

/**
 * Makes every route change play the browser's view transition: the page on screen cross-fades into the new one,
 * while the header, the fixed contact buttons and the footer stay exactly where they are.
 *
 * This tiny keyed element is only the trigger. The page itself is deliberately NOT given a transition name:
 * the browser would have to snapshot the whole page (the home page is ~9000px tall, 18000 device pixels on a
 * retina screen) and each click then froze for up to two seconds. The cross-fade therefore runs on the "root"
 * layer, which is only the visible viewport. See the "Route transitions" block in globals.css.
 *
 * Browsers without View Transitions support just swap the page. prefers-reduced-motion switches it off.
 */
export function RouteTransition() {
  const pathname = usePathname();
  return (
    <ViewTransition key={pathname} enter="route" exit="route" default="none">
      <span aria-hidden="true" className="pointer-events-none fixed start-0 top-0 size-px" />
    </ViewTransition>
  );
}

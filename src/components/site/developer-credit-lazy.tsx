"use client";

import dynamic from "next/dynamic";

// The designer credit (a Radix popover) is switched off for now. Its code lives in its own chunk, so it costs
// nothing until `developer.enabled` is turned on in src/config/site.ts.
const DeveloperCredit = dynamic(() => import("@/components/site/developer-credit").then((m) => m.DeveloperCredit));

export function DeveloperCreditLazy() {
  return <DeveloperCredit />;
}

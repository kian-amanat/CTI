"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { MenuIcon } from "lucide-react";
import type { MenuCategory } from "@/components/site/mobile-nav-sheet";

// The slide-over menu (Radix Dialog + its animation) is only needed after a tap, so its code is fetched on demand
// and never counts against the first load. The button itself is plain HTML.
const MobileNavSheet = dynamic(() => import("@/components/site/mobile-nav-sheet"), { ssr: false });

export function MobileNav({ categories, children }: { categories: MenuCategory[]; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [wanted, setWanted] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  // start fetching as soon as a finger or pointer shows interest, so the menu is usually ready by the time the tap lands
  const warmUp = () => setWanted(true);

  return (
    <>
      <button
        ref={button}
        type="button"
        aria-label="باز کردن منو"
        aria-haspopup="dialog"
        aria-expanded={open}
        onPointerEnter={warmUp}
        onPointerDown={warmUp}
        onFocus={warmUp}
        onClick={() => {
          setWanted(true);
          setOpen(true);
        }}
        className="inline-flex size-11 items-center justify-center rounded-full border border-ink/10 bg-card lg:hidden"
      >
        <MenuIcon className="size-5" />
      </button>
      {wanted && (
        <MobileNavSheet open={open} onOpenChange={setOpen} returnFocusTo={button} categories={categories}>
          {children}
        </MobileNavSheet>
      )}
    </>
  );
}

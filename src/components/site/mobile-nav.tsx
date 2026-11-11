"use client";

import { useState } from "react";
import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NavLinks } from "@/components/site/nav-links";
import { LogoMark } from "@/components/site/logo";
import { categories } from "@/data/categories";
import { siteConfig } from "@/config/site";

export function MobileNav({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="inline-flex size-11 items-center justify-center rounded-full border border-ink/10 bg-card lg:hidden"
        aria-label="باز کردن منو"
      >
        <MenuIcon className="size-5" />
      </SheetTrigger>
      <SheetContent side="right" className="w-[86%] gap-0 bg-paper p-0">
        <div className="flex items-center gap-3 border-b border-ink/10 p-5">
          <LogoMark className="h-7" />
          <div>
            <SheetTitle className="text-base font-black">{siteConfig.legalName}</SheetTitle>
            <SheetDescription className="text-xs">{siteConfig.tagline}</SheetDescription>
          </div>
        </div>
        <nav aria-label="منوی موبایل" className="flex-1 overflow-y-auto p-5">
          <NavLinks className="flex-col items-stretch gap-1 [&_a]:text-lg" onNavigate={() => setOpen(false)} />
          <p className="mt-8 mb-3 px-4 text-xs font-bold text-muted-foreground">دسته‌بندی‌ها</p>
          <ul className="space-y-1">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/categories/${c.slug}/`}
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-2.5 transition-colors hover:bg-paper-deep"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="grid gap-2 border-t border-ink/10 p-5">{children}</div>
      </SheetContent>
    </Sheet>
  );
}

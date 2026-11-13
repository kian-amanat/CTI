"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { NavLinks } from "@/components/site/nav-links";
import { LogoMark } from "@/components/site/logo";
import { siteConfig } from "@/config/site";

export type MenuCategory = { slug: string; name: string };

/**
 * The slide-over menu. mobile-nav.tsx loads it on demand: Radix Dialog and its animations are ~15 KB that
 * nobody needs until the menu button is tapped.
 * It receives only the slug and name of each category: importing the category data itself would put every
 * description and FAQ (about 6 KB gzipped) into this client chunk.
 */
export default function MobileNavSheet({
  open,
  onOpenChange,
  returnFocusTo,
  categories,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The menu button: it gets the focus back when the menu closes */
  returnFocusTo: React.RefObject<HTMLElement | null>;
  categories: MenuCategory[];
  children?: React.ReactNode;
}) {
  const close = () => onOpenChange(false);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[86%] gap-0 bg-paper p-0"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          returnFocusTo.current?.focus();
        }}
      >
        <div className="flex items-center gap-3 border-b border-ink/10 p-5">
          <LogoMark className="h-7" />
          <div>
            <SheetTitle className="text-base font-black">{siteConfig.legalName}</SheetTitle>
            <SheetDescription className="text-xs">{siteConfig.tagline}</SheetDescription>
          </div>
        </div>
        <nav aria-label="منوی موبایل" className="flex-1 overflow-y-auto p-5">
          <NavLinks className="flex-col items-stretch gap-1 [&_a]:text-lg" onNavigate={close} />
          <p className="mt-8 mb-3 px-4 text-xs font-bold text-muted-foreground">دسته‌بندی‌ها</p>
          <ul className="space-y-1">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/categories/${c.slug}/`}
                  prefetch={false}
                  onClick={close}
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

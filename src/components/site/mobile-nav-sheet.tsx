"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { XIcon } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { isActive } from "@/components/site/nav-links";
import { LogoMark } from "@/components/site/logo";
import { navLinks, siteConfig } from "@/config/site";
import { cx } from "@/lib/cx";

export type MenuCategory = { slug: string; name: string };

/**
 * The slide-over menu. mobile-nav.tsx loads it on demand: Radix Dialog and its animations are ~15 KB that
 * nobody needs until the menu button is tapped.
 * It receives only the slug and name of each category: importing the category data itself would put every
 * description and FAQ (about 6 KB gzipped) into this client chunk.
 *
 * Built for thumbs: the close button is as big as the menu button, the main pages are large rows and the many product
 * groups are chips that wrap, so they take a few lines instead of a long list.
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
  const pathname = usePathname();
  const close = () => onOpenChange(false);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-[88%] gap-0 bg-paper p-0"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          returnFocusTo.current?.focus();
        }}
      >
        <div className="flex items-center gap-3 border-b border-ink/10 p-4">
          <LogoMark className="h-8" />
          <div className="min-w-0 flex-1">
            <SheetTitle className="text-lg font-black">{siteConfig.name}</SheetTitle>
            <SheetDescription className="sr-only">{siteConfig.tagline}</SheetDescription>
          </div>
          <SheetClose asChild>
            <button
              type="button"
              aria-label="بستن منو"
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-card transition-colors duration-300 ease-out hover:bg-paper-deep"
            >
              <XIcon className="size-5" />
            </button>
          </SheetClose>
        </div>

        <nav aria-label="منوی موبایل" className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
          <ul>
            {navLinks.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={cx(
                      "flex h-12 items-center justify-between rounded-xl px-4 text-lg font-bold transition-colors duration-300 ease-out hover:bg-ink/[0.05]",
                      active && "bg-ink/[0.06]",
                    )}
                  >
                    {link.label}
                    {active && <span className="size-2 rounded-full bg-tape" aria-hidden="true" />}
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="mt-6 mb-3 px-4 text-xs font-bold text-muted-foreground">دسته‌بندی‌ها</p>
          <ul className="flex flex-wrap gap-2 px-1">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/categories/${c.slug}/`}
                  prefetch={false}
                  onClick={close}
                  className="flex min-h-10 items-center rounded-full border border-ink/12 bg-card px-3.5 text-sm font-bold transition-[border-color,background-color] duration-300 ease-out hover:border-ink/35 hover:bg-paper-deep"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="grid gap-2 border-t border-ink/10 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">{children}</div>
      </SheetContent>
    </Sheet>
  );
}

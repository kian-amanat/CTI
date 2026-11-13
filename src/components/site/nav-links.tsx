"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/config/site";
import { cx } from "@/lib/cx";

export const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href) || (href === "/products/" && pathname.startsWith("/categories/"));

export function NavLinks({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    // `className` replaces the default alignment instead of being merged with it (no tailwind-merge on the client)
    <ul className={cx("flex gap-1", className ?? "items-center")}>
      {navLinks.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cx(
                "relative block rounded-full px-4 py-2 text-[0.95rem] font-medium transition-colors duration-300 ease-out hover:bg-ink/[0.06]",
                active && "text-tape-deep after:absolute after:inset-x-4 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-tape",
              )}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

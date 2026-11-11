import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** A tape roll that unrolls into a strip. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 36" aria-hidden="true" className={cn("h-8 w-auto", className)}>
      <path
        d="M42 29H17A12 12 0 1 1 29 17"
        fill="none"
        stroke="var(--tape)"
        strokeWidth="7"
      />
      <circle cx="17" cy="17" r="3.4" fill="currentColor" />
    </svg>
  );
}

export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.legalName} - صفحه اصلی`}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-md outline-offset-4",
        tone === "light" ? "text-paper" : "text-ink",
        className,
      )}
    >
      <LogoMark className="transition-transform duration-500 group-hover:-rotate-12" />
      <span className="flex flex-col leading-none">
        <span className="text-xl font-black">{siteConfig.name}</span>
        <span dir="ltr" className={cn("mt-1 text-[0.62rem] font-medium tracking-wide", tone === "light" ? "text-paper/60" : "text-muted-foreground")}>
          {siteConfig.nameEn}
        </span>
      </span>
    </Link>
  );
}

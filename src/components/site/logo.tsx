import Link from "next/link";
import { siteConfig } from "@/config/site";
import brand from "@/data/brand-manifest.json";
import { cn } from "@/lib/utils";

const markFiles = brand.mark.files;
const largest = markFiles[markFiles.length - 1];
const markSrcSet = markFiles.map((f) => `${f.src} ${f.width}w`).join(", ");

/**
 * The client's CTI letters (cut out of their logo by scripts/optimize-images.mjs).
 * The white keyline is part of the artwork, so it reads on both the light header and the dark footer.
 * It is shown ~70px wide, so the browser gets two small hashed files (140/280px) instead of one 320px file.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={largest.src}
      srcSet={markSrcSet}
      sizes="75px"
      width={largest.width}
      height={largest.height}
      alt=""
      aria-hidden="true"
      className={cn("h-8 w-auto", className)}
    />
  );
}

export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-3 rounded-md outline-offset-4",
        tone === "light" ? "text-paper" : "text-ink",
        className,
      )}
    >
      <LogoMark className="h-8 lg:h-9" />
      <span className="flex flex-col leading-none">
        <span className="text-xl font-black">{siteConfig.name}</span>
        <span dir="ltr" className={cn("mt-1.5 text-[0.62rem] font-medium tracking-[0.18em] uppercase", tone === "light" ? "text-paper/60" : "text-muted-foreground")}>
          {siteConfig.nameEn}
        </span>
      </span>
      {/* no aria-label: the link's name is its visible text plus this (WCAG "label in name") */}
      <span className="sr-only"> - صفحه اصلی</span>
    </Link>
  );
}

import Link from "next/link";
import { featuredProducts } from "@/data/products";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/site/section-heading";
import { CardArrow } from "@/components/site/card-arrow";

/**
 * Desktop: vertical scroll drives a horizontal track (sticky + GSAP scrub).
 * Mobile / no JS: a native swipeable row with scroll-snap. Same HTML either way.
 */
export function FeaturedProducts() {
  const items = featuredProducts();
  return (
    <section data-hscroll aria-labelledby="featured-title" className="relative bg-paper-deep">
      <div className="h-viewport py-20 lg:py-0">
        <div className="container-x flex items-end justify-between gap-6">
          <SectionHeading
            id="featured-title"
            eyebrow="محصولات شاخص"
            title="نمونه‌ای از محصولات کاتالوگ"
          />
          <div className="hidden w-48 shrink-0 lg:block" aria-hidden="true">
            <div className="h-1 overflow-hidden rounded-full bg-ink/10">
              <div data-hscroll-progress className="h-full origin-right scale-x-0 rounded-full bg-tape" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">برای دیدن بقیه، اسکرول کنید</p>
          </div>
        </div>
        <div className="h-track mt-10 flex gap-5 overflow-x-auto px-4 pt-4 pb-8 sm:px-6 lg:mt-14 lg:gap-7 lg:ps-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pe-[30vw]">
          {items.map((p) => (
            <ProductCard
              key={p.slug}
              product={p}
              variant="overlay"
              className="aspect-[4/5] w-[78vw] shrink-0 sm:w-[22rem] lg:aspect-auto lg:h-[min(31rem,60svh)] lg:w-[24rem]"
              sizes="(min-width: 1024px) 24rem, (min-width: 640px) 22rem, 78vw"
            />
          ))}
          <Link
            href="/products/"
            className="group relative isolate flex w-[60vw] shrink-0 flex-col items-center justify-center gap-5 overflow-hidden rounded-[1.8rem] border-2 border-dashed border-ink/20 text-center font-black transition-colors duration-500 hover:border-transparent hover:text-white sm:w-[16rem]"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-tape-deep transition-[clip-path] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [clip-path:inset(100%_0_0_0)] group-hover:[clip-path:inset(0_0_0_0)]"
            />
            <CardArrow className="size-14 bg-ink text-paper group-hover:bg-paper group-hover:text-ink" />
            مشاهده همه محصولات
          </Link>
        </div>
      </div>
    </section>
  );
}

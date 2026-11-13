import Link from "next/link";
import type { Product } from "@/data/products";
import { getCategory } from "@/data/categories";
import { Picture } from "@/components/site/picture";
import { CardArrow } from "@/components/site/card-arrow";
import { productPath } from "@/lib/jsonld";
import { cn } from "@/lib/utils";
import { bidi } from "@/lib/bidi";

export function ProductCard({
  product,
  className,
  headingLevel: Heading = "h3",
  // phones show two cards per row (50vw minus the page gutter, the grid gap and the card padding)
  sizes = "(min-width: 1280px) 17rem, (min-width: 1024px) 28vw, (min-width: 640px) calc(50vw - 3.5rem), calc(50vw - 2.5rem)",
  variant = "default",
  ...rest
}: {
  product: Product;
  className?: string;
  headingLevel?: "h2" | "h3";
  sizes?: string;
  /** "overlay": full-bleed photo with the details on a dark fade; hover only brightens the photo a little */
  variant?: "default" | "overlay";
} & React.HTMLAttributes<HTMLElement>) {
  const category = getCategory(product.category);
  const chips = product.chips;

  if (variant === "overlay") {
    return (
      <article
        className={cn("group relative isolate flex flex-col justify-end overflow-hidden rounded-[1.8rem] bg-ink text-paper", className)}
        {...rest}
      >
        <Picture image={product.image} alt={product.imageAlt} sizes={sizes} className="absolute inset-0 -z-10" />
        {/* dark base under the text; on hover it thins out slightly so the photo reads a little brighter */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-ink from-15% via-ink/80 via-45% to-transparent to-75% transition-opacity duration-500 ease-out group-hover:opacity-85"
        />
        <span className="absolute start-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-xs font-bold text-ink backdrop-blur">
          {category?.name}
        </span>
        <div className="p-5 sm:p-6">
          <Heading className="text-xl font-black leading-8">
            <Link
              href={productPath(product)}
              prefetch={false}
              className="outline-none after:absolute after:inset-0 after:rounded-[1.8rem] focus-visible:after:ring-3 focus-visible:after:ring-masking"
            >
              {bidi(product.name)}
            </Link>
          </Heading>
          <p className="mt-2 line-clamp-2 text-sm leading-7 text-paper/80">{bidi(product.summary)}</p>
          <div className="mt-5 flex items-end justify-between gap-3">
            <ul className="flex flex-wrap gap-1.5" aria-label="مشخصات کلیدی">
              {chips.map((c) => (
                <li key={c} className="rounded-full border border-paper/20 bg-paper/10 px-2.5 py-1 text-[0.72rem] font-medium backdrop-blur-sm">
                  {bidi(c)}
                </li>
              ))}
            </ul>
            <CardArrow tone="dark" className="size-11" />
          </div>
        </div>
      </article>
    );
  }

  /*
   * Phones show these two to a row, so below `sm` the card is compact: no group label on the photo (the page already
   * says which group it is in), no summary, one spec chip and no arrow. The whole card is the link either way.
   */
  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-[1.25rem] border border-ink/8 bg-card p-2 transition-[border-color,background-color,box-shadow] duration-300 ease-out hover:border-ink/25 hover:bg-white hover:shadow-[0_24px_48px_-34px_rgb(19_20_24/0.45)] sm:rounded-[1.6rem] sm:p-3",
        className,
      )}
      {...rest}
    >
      <div className="relative aspect-square overflow-hidden rounded-[0.95rem] sm:rounded-[1.2rem]">
        <Picture image={product.image} alt={product.imageAlt} sizes={sizes} />
        <span className="absolute start-3 top-3 rounded-full bg-paper/90 px-3 py-1 text-xs font-bold backdrop-blur max-sm:hidden">
          {category?.name}
        </span>
      </div>
      <div className="flex flex-1 flex-col px-1.5 pt-3 pb-1.5 sm:px-2 sm:pt-4 sm:pb-2">
        <Heading className="line-clamp-3 text-[0.95rem] leading-7 font-black sm:line-clamp-none sm:text-lg sm:leading-8">
          <Link
            href={productPath(product)}
            prefetch={false}
            className="outline-none after:absolute after:inset-0 after:rounded-[1.25rem] focus-visible:after:ring-3 focus-visible:after:ring-ink/60 sm:after:rounded-[1.6rem]"
          >
            {bidi(product.name)}
          </Link>
        </Heading>
        <p className="mt-2 line-clamp-2 text-sm leading-7 text-muted-foreground max-sm:hidden">{bidi(product.summary)}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3 sm:pt-4">
          <ul className="flex flex-wrap gap-1.5" aria-label="مشخصات کلیدی">
            {chips.map((c, i) => (
              <li key={c} className={cn("rounded-full bg-paper-deep px-2.5 py-1 text-[0.72rem] font-medium", i > 0 && "max-sm:hidden")}>
                {bidi(c)}
              </li>
            ))}
          </ul>
          <CardArrow tone="light" className="size-10 max-sm:hidden" />
        </div>
      </div>
    </article>
  );
}

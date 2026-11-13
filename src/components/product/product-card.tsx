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
  sizes = "(min-width: 1280px) 17rem, (min-width: 1024px) 28vw, (min-width: 640px) calc(50vw - 3.5rem), calc(100vw - 3.5rem)",
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

  return (
    <article
      className={cn(
        "group has-tape relative flex flex-col rounded-[1.6rem] border border-ink/8 bg-card p-3 transition-[border-color,background-color,box-shadow] duration-300 ease-out hover:border-ink/25 hover:bg-white hover:shadow-[0_24px_48px_-34px_rgb(19_20_24/0.45)]",
        className,
      )}
      {...rest}
    >
      <div className="relative aspect-square overflow-hidden rounded-[1.2rem]">
        <Picture image={product.image} alt={product.imageAlt} sizes={sizes} />
        <span className="absolute start-3 top-3 rounded-full bg-paper/90 px-3 py-1 text-xs font-bold backdrop-blur">
          {category?.name}
        </span>
      </div>
      <div className="flex flex-1 flex-col px-2 pt-4 pb-2">
        <Heading className="text-lg font-black leading-8">
          <Link
            href={productPath(product)}
            prefetch={false}
            className="outline-none after:absolute after:inset-0 after:rounded-[1.6rem] focus-visible:after:ring-3 focus-visible:after:ring-ink/60"
          >
            {bidi(product.name)}
          </Link>
        </Heading>
        <p className="mt-2 line-clamp-2 text-sm leading-7 text-muted-foreground">{bidi(product.summary)}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <ul className="flex flex-wrap gap-1.5" aria-label="مشخصات کلیدی">
            {chips.map((c) => (
              <li key={c} className="rounded-full bg-paper-deep px-2.5 py-1 text-[0.72rem] font-medium">
                {bidi(c)}
              </li>
            ))}
          </ul>
          <CardArrow tone="light" className="size-10" />
        </div>
      </div>
    </article>
  );
}

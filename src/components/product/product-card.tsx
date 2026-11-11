import Link from "next/link";
import { ArrowUpLeftIcon } from "lucide-react";
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
  sizes = "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 90vw",
  variant = "default",
  ...rest
}: {
  product: Product;
  className?: string;
  headingLevel?: "h2" | "h3";
  sizes?: string;
  /** "overlay": full-bleed photo with the details on a dark fade; hover fills colour from the bottom, nothing moves */
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
        {/* darker base under the text */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-ink from-15% via-ink/80 via-45% to-transparent to-75%" />
        {/* hover: brand colour rises from the bottom edge */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-tape-deep from-20% via-tape-deep/85 via-50% to-transparent to-85% transition-[clip-path] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [clip-path:inset(100%_0_0_0)] group-hover:[clip-path:inset(0_0_0_0)] group-focus-within:[clip-path:inset(0_0_0_0)]"
        />
        <span className="absolute start-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-xs font-bold text-ink backdrop-blur">
          {category?.name}
        </span>
        <div className="p-5 sm:p-6">
          <Heading className="text-xl font-black leading-8">
            <Link href={productPath(product)} prefetch={false} className="outline-none after:absolute after:inset-0 after:rounded-[1.8rem] focus-visible:after:ring-3 focus-visible:after:ring-masking">
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
            <CardArrow className="size-11 bg-paper text-ink group-hover:bg-ink group-hover:text-paper" />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-[1.6rem] border border-ink/8 bg-card p-3 transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgb(19_20_24/0.35)]",
        className,
      )}
      {...rest}
    >
      <span className="tape-corner" aria-hidden="true" />
      <div className="relative aspect-square overflow-hidden rounded-[1.2rem]">
        <Picture
          image={product.image}
          alt={product.imageAlt}
          sizes={sizes}
          className="transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <span className="absolute start-3 top-3 rounded-full bg-paper/90 px-3 py-1 text-xs font-bold backdrop-blur">
          {category?.name}
        </span>
      </div>
      <div className="flex flex-1 flex-col px-2 pt-4 pb-2">
        <Heading className="text-lg font-black leading-8">
          <Link href={productPath(product)} prefetch={false} className="after:absolute after:inset-0 after:rounded-[1.6rem]">
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
          <span
            aria-hidden="true"
            className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-paper transition-colors duration-300 group-hover:bg-tape"
          >
            <ArrowUpLeftIcon className="size-5 transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}

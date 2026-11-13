import Link from "next/link";
import { categories } from "@/data/categories";
import { productsByCategory } from "@/data/products";
import { SectionHeading } from "@/components/site/section-heading";
import { CardArrow } from "@/components/site/card-arrow";
import { Picture } from "@/components/site/picture";
import { categoryCover } from "@/lib/images";
import { categoryPath } from "@/lib/jsonld";
import { faNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { bidi } from "@/lib/bidi";

/**
 * Bento layout for the eight lead groups (12-column grid on desktop). Below `lg` it is a two-column grid: the first
 * tile spans the full width, the rest sit two to a row (an odd one out at the end gets the full width too).
 */
const layout = [
  "col-span-2 lg:col-span-7 lg:row-span-2",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-6",
  "lg:col-span-6",
];

/**
 * Product count and description stay folded until the card is hovered or has keyboard focus. Touch screens cannot
 * hover, so there they are always open. Only opacity and the folded height change (the arrow never moves, the title
 * glides up by the height of the text that opens below it), and the text stays in the HTML for crawlers.
 */
const fold =
  "grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-500 ease-out group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100 [@media(hover:none)]:grid-rows-[1fr] [@media(hover:none)]:opacity-100";

export function CategoriesGrid() {
  const lead = categories.filter((c) => c.home);
  const lastSpansTwo = (lead.length - 1) % 2 === 1;
  return (
    <section aria-labelledby="categories-title" className="container-x py-16 sm:py-24 lg:py-36">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end lg:gap-8">
        <SectionHeading
          id="categories-title"
          eyebrow="گروه‌های محصول"
          title="هر کاری، چسب مخصوص خودش را دارد"
          description={`${faNumber(categories.length)} گروه محصول در کاتالوگ ماست. هر گروه را باز کنید تا مدل‌ها، ابعاد و مشخصات فنی را ببینید.`}
        />
        <Link href="/products/" className="inline-flex min-h-11 shrink-0 items-center font-bold text-tape-deep underline-offset-8 hover:underline">
          همه محصولات ←
        </Link>
      </div>

      <ul data-reveal-group className="mt-10 grid auto-rows-[minmax(11rem,auto)] grid-cols-2 gap-3 sm:mt-14 sm:auto-rows-[minmax(15rem,auto)] sm:gap-4 lg:mt-20 lg:grid-cols-12">
        {lead.map((c, i) => {
          const items = productsByCategory(c.slug);
          const cover = categoryCover(c);
          const big = i === 0;
          return (
            <li key={c.slug} data-reveal-item className={cn("group relative", layout[i], lastSpansTwo && i === lead.length - 1 && "max-lg:col-span-2")}>
              <Link
                href={categoryPath(c)}
                prefetch={false}
                className={cn(
                  "relative isolate flex h-full overflow-hidden rounded-[1.4rem] bg-ink text-paper outline-none focus-visible:ring-3 focus-visible:ring-ink/60 focus-visible:ring-offset-2 focus-visible:ring-offset-paper sm:min-h-[15rem] sm:rounded-[1.8rem]",
                  big ? "min-h-[15rem]" : "min-h-[11rem]",
                )}
              >
                {/* nothing zooms or slides: the photo only dims a little while the card is hovered, so the revealed text stays readable */}
                <div className="absolute inset-0">
                  {cover && (
                    <Picture
                      image={cover.key}
                      alt=""
                      sizes={
                        big
                          ? "(min-width: 1280px) 44rem, (min-width: 1024px) 55vw, calc(100vw - 2rem)"
                          : "(min-width: 1024px) 40vw, (min-width: 640px) calc(50vw - 2rem), calc(50vw - 1.5rem)"
                      }
                      plate={big}
                      className="opacity-65 transition-opacity duration-500 ease-out group-hover:opacity-50"
                    />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />
                <div className={cn("relative mt-auto flex w-full items-end justify-between gap-3 sm:gap-4 sm:p-8", big ? "p-5" : "p-4")}>
                  <div>
                    <div className={fold}>
                      <div className="min-h-0 overflow-hidden">
                        <p className="pb-1 text-xs font-bold text-masking sm:pb-1.5">{faNumber(items.length)} محصول</p>
                      </div>
                    </div>
                    {/* sm+: min-h-12 = the arrow's height, so at rest the title is centred on the arrow */}
                    <h3 className={cn("flex items-center font-black", big ? "min-h-12 text-3xl lg:text-4xl" : "text-base leading-7 sm:min-h-12 sm:text-2xl sm:leading-normal")}>
                      {c.name}
                    </h3>
                    {/* the two-column phone tiles are too narrow for a description: it stays in the HTML, shown from `sm` up */}
                    <div className={cn(fold, !big && "max-sm:hidden")}>
                      <div className="min-h-0 overflow-hidden">
                        <p className={cn("max-w-md pt-2 text-sm leading-7 text-paper/80", !big && "line-clamp-2")}>{bidi(c.summary)}</p>
                      </div>
                    </div>
                  </div>
                  <CardArrow tone="dark" className={cn("size-12", !big && "max-sm:hidden")} />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <nav aria-label="همه گروه‌های محصول" className="mt-10 sm:mt-14 lg:mt-16">
        <p className="text-sm font-bold text-muted-foreground">همه گروه‌ها</p>
        <ul className="mt-4 flex flex-wrap gap-2 sm:mt-5 sm:gap-2.5">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={categoryPath(c)}
                prefetch={false}
                className="block rounded-full border border-ink/12 bg-card px-3.5 py-2 text-sm font-bold transition-[border-color,background-color] duration-300 ease-out hover:border-ink/35 hover:bg-paper-deep sm:px-4"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}

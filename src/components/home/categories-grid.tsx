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

/** Bento layout for the eight lead groups (12-column grid on desktop). */
const layout = [
  "lg:col-span-7 lg:row-span-2",
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
  return (
    <section aria-labelledby="categories-title" className="container-x py-24 lg:py-36">
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <SectionHeading
          id="categories-title"
          eyebrow="گروه‌های محصول"
          title="هر کاری، چسب مخصوص خودش را دارد"
          description={`${faNumber(categories.length)} گروه محصول در کاتالوگ ماست. هر گروه را باز کنید تا مدل‌ها، ابعاد و مشخصات فنی را ببینید.`}
        />
        <Link href="/products/" className="shrink-0 font-bold text-tape-deep underline-offset-8 hover:underline">
          همه محصولات ←
        </Link>
      </div>

      <ul data-reveal-group className="mt-14 grid auto-rows-[minmax(15rem,auto)] gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-12">
        {lead.map((c, i) => {
          const items = productsByCategory(c.slug);
          const cover = categoryCover(c);
          const big = i === 0;
          return (
            <li key={c.slug} data-reveal-item className={cn("group relative", layout[i])}>
              <Link
                href={categoryPath(c)}
                prefetch={false}
                className="relative isolate flex h-full min-h-[15rem] overflow-hidden rounded-[1.8rem] bg-ink text-paper outline-none focus-visible:ring-3 focus-visible:ring-ink/60 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              >
                {/* nothing zooms or slides: the photo only dims a little while the card is hovered, so the revealed text stays readable */}
                <div className="absolute inset-0">
                  {cover && (
                    <Picture
                      image={cover.key}
                      alt=""
                      sizes={
                        big
                          ? "(min-width: 1280px) 44rem, (min-width: 1024px) 55vw, (min-width: 640px) calc(50vw - 2rem), calc(100vw - 2rem)"
                          : "(min-width: 1024px) 40vw, (min-width: 640px) calc(50vw - 2rem), calc(100vw - 2rem)"
                      }
                      plate={big}
                      className="opacity-65 transition-opacity duration-500 ease-out group-hover:opacity-50"
                    />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />
                <div className="relative mt-auto flex w-full items-end justify-between gap-4 p-6 sm:p-8">
                  <div>
                    <div className={fold}>
                      <div className="min-h-0 overflow-hidden">
                        <p className="pb-1.5 text-xs font-bold text-masking">{faNumber(items.length)} محصول</p>
                      </div>
                    </div>
                    {/* min-h-12 = the arrow's height, so at rest the title is centred on the arrow */}
                    <h3 className={cn("flex min-h-12 items-center font-black", big ? "text-3xl lg:text-4xl" : "text-2xl")}>{c.name}</h3>
                    <div className={fold}>
                      <div className="min-h-0 overflow-hidden">
                        <p className={cn("max-w-md pt-2 text-sm leading-7 text-paper/80", !big && "line-clamp-2")}>{bidi(c.summary)}</p>
                      </div>
                    </div>
                  </div>
                  <CardArrow tone="dark" className="size-12" />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <nav aria-label="همه گروه‌های محصول" className="mt-14 lg:mt-16">
        <p className="text-sm font-bold text-muted-foreground">همه گروه‌ها</p>
        <ul className="mt-5 flex flex-wrap gap-2.5">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={categoryPath(c)}
                prefetch={false}
                className="block rounded-full border border-ink/12 bg-card px-4 py-2 text-sm font-bold transition-[border-color,background-color] duration-300 ease-out hover:border-ink/35 hover:bg-paper-deep"
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

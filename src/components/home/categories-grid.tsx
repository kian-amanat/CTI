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

export function CategoriesGrid() {
  const lead = categories.filter((c) => c.home);
  return (
    <section aria-labelledby="categories-title" className="container-x py-20 lg:py-28">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
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

      <ul data-reveal-group className="mt-12 grid auto-rows-[minmax(15rem,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-12">
        {lead.map((c, i) => {
          const items = productsByCategory(c.slug);
          const cover = categoryCover(c);
          const big = i === 0;
          return (
            <li key={c.slug} data-reveal-item className={cn("group relative", layout[i])}>
              <Link
                href={categoryPath(c)}
                prefetch={false}
                className="relative isolate flex h-full min-h-[15rem] transform-gpu overflow-hidden rounded-[1.8rem] bg-ink text-paper"
              >
                {/* zoom runs on its own compositor layer: only `transform` changes, nothing repaints */}
                <div className="absolute inset-0 transform-gpu transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform group-hover:scale-[1.07]">
                  {cover && (
                    <Picture
                      image={cover.key}
                      alt=""
                      sizes={big ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 1024px) 40vw, 100vw"}
                      className="opacity-70"
                    />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                <div className="absolute inset-0 bg-ink opacity-0 transition-opacity duration-700 group-hover:opacity-25" />
                <div className="relative mt-auto flex w-full items-end justify-between gap-4 p-6 sm:p-7">
                  <div>
                    <p className="text-xs font-bold text-masking">{faNumber(items.length)} محصول</p>
                    <h3 className={cn("mt-1 font-black", big ? "text-3xl lg:text-4xl" : "text-2xl")}>{c.name}</h3>
                    <p className={cn("mt-2 max-w-md text-sm leading-7 text-paper/70", !big && "line-clamp-2")}>{bidi(c.summary)}</p>
                  </div>
                  <CardArrow className="size-12 bg-paper text-ink group-hover:bg-tape group-hover:text-white" />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <nav aria-label="همه گروه‌های محصول" className="mt-10">
        <p className="text-sm font-bold text-muted-foreground">همه گروه‌ها</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={categoryPath(c)}
                prefetch={false}
                className="block rounded-full border border-ink/12 bg-card px-4 py-2 text-sm font-bold transition-colors hover:border-tape hover:bg-tape hover:text-white"
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

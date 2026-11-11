import type { Metadata } from "next";
import Link from "next/link";
import { categories, categoriesByGroup, groups } from "@/data/categories";
import { products, productsByCategory } from "@/data/products";
import { siteConfig } from "@/config/site";
import { PageBreadcrumbs } from "@/components/site/page-breadcrumbs";
import { Picture } from "@/components/site/picture";
import { ProductCard } from "@/components/product/product-card";
import { FinalCta } from "@/components/home/final-cta";
import { JsonLd } from "@/components/site/json-ld";
import { categoryPath, itemListLd } from "@/lib/jsonld";
import { categoryCover } from "@/lib/images";
import { faNumber } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { bidi } from "@/lib/bidi";

export const metadata: Metadata = pageMetadata({
  title: "محصولات؛ انواع چسب دوطرفه و نوار چسب صنعتی",
  description:
    "کاتالوگ چسب دوطرفه سلولزی، شیشه‌ای، فوم و ژله‌ای، چسب روکش قرمز و نوار چسب‌های آلومینیومی، برزنتی، کنفی، بسته‌بندی و PVC با ابعاد و مشخصات فنی. برای قیمت روز تماس بگیرید.",
  path: "/products/",
  keywords: ["انواع چسب دوطرفه", "کاتالوگ چسب", "قیمت چسب دوطرفه", "خرید نوار چسب صنعتی"],
});

export default function ProductsPage() {
  return (
    <>
      <div className="container-x pt-24 lg:pt-28">
        <PageBreadcrumbs items={[{ name: "محصولات", path: "/products/" }]} />
        <header className="mt-8 max-w-3xl">
          <h1 className="text-4xl font-black sm:text-5xl lg:leading-[1.3]">
            محصولات؛ <span className="text-tape-deep">انواع چسب دوطرفه</span> و نوار چسب صنعتی
          </h1>
          <p className="mt-6 text-lg leading-9 text-muted-foreground">
            {faNumber(products.length)} محصول در {faNumber(categories.length)} گروه. روی هر محصول بزنید تا ابعاد، تعداد در کارتن و
            مشخصات فنی را ببینید و برای قیمت روز تماس بگیرید.
          </p>
        </header>

        <nav aria-label="گروه‌های محصول" className="sticky top-16 z-30 -mx-4 mt-10 overflow-x-auto bg-paper/85 px-4 py-3 backdrop-blur-xl lg:top-[4.5rem]">
          <ul className="flex w-max gap-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <a href={`#${c.slug}`} className="block rounded-full border border-ink/12 bg-card px-4 py-2 text-sm font-bold whitespace-nowrap transition-colors hover:border-tape hover:bg-tape hover:text-white">
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-24 pt-12 pb-24">
          {groups.map((g) => (
            <div key={g.id} className="space-y-16">
              <div className="border-b-2 border-ink pb-4">
                <h2 className="text-3xl font-black sm:text-4xl">{g.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{g.description}</p>
              </div>
              {categoriesByGroup(g.id).map((c) => {
                const items = productsByCategory(c.slug);
                const cover = categoryCover(c);
                return (
                  <section key={c.slug} id={c.slug} aria-labelledby={`${c.slug}-title`} className="scroll-mt-36">
                    <div className="flex flex-col justify-between gap-3 border-b border-ink/10 pb-5 sm:flex-row sm:items-end">
                      <div>
                        <h3 id={`${c.slug}-title`} data-split className="text-2xl font-black sm:text-3xl">
                          {c.name}
                        </h3>
                        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">{bidi(c.summary)}</p>
                      </div>
                      <Link href={categoryPath(c)} prefetch={false} className="shrink-0 text-sm font-bold text-tape-deep hover:underline">
                        صفحه {c.name} ←
                      </Link>
                    </div>
                    {items.length > 0 ? (
                      <div data-reveal-group className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {items.map((p) => (
                          <ProductCard key={p.slug} product={p} data-reveal-item />
                        ))}
                      </div>
                    ) : (
                      <Link
                        href={categoryPath(c)}
                        prefetch={false}
                        className="group mt-8 flex items-center gap-5 rounded-[1.6rem] border border-dashed border-ink/20 bg-card p-4 transition-colors hover:border-tape"
                      >
                        {cover && (
                          <span className="size-24 shrink-0 overflow-hidden rounded-2xl">
                            <Picture image={cover.key} alt={cover.alt} sizes="96px" />
                          </span>
                        )}
                        <span>
                          <span className="block font-black">مدل‌ها و قیمت روز را بپرسید</span>
                          <span className="mt-1 block text-sm leading-7 text-muted-foreground">
                            مشخصات این گروه را از کارشناسان {siteConfig.name} بپرسید؛ صفحه {c.name} را ببینید.
                          </span>
                        </span>
                      </Link>
                    )}
                  </section>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <FinalCta />
      <JsonLd data={itemListLd(`محصولات ${siteConfig.legalName}`, products)} />
    </>
  );
}

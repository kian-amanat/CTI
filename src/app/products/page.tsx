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
});

export default function ProductsPage() {
  return (
    <>
      <div className="container-x pt-24 lg:pt-28">
        <PageBreadcrumbs items={[{ name: "محصولات", path: "/products/" }]} />
        <header className="mt-8 max-w-3xl sm:mt-10">
          <h1 className="text-[2rem] font-black sm:text-5xl lg:leading-[1.3]">
            محصولات؛ <span className="text-tape-deep">انواع چسب دوطرفه</span> و نوار چسب صنعتی
          </h1>
          <p className="mt-5 leading-8 text-muted-foreground sm:mt-7 sm:text-lg sm:leading-9">
            {faNumber(products.length)} محصول در {faNumber(categories.length)} گروه. روی هر محصول بزنید تا ابعاد، تعداد در کارتن و
            مشخصات فنی را ببینید و برای قیمت روز تماس بگیرید.
          </p>
        </header>

        <nav aria-label="گروه‌های محصول" className="stick-under-header z-30 -mx-4 mt-10 overflow-x-auto bg-paper/90 px-4 py-3 backdrop-blur-xl sm:mt-14 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="flex w-max gap-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <a href={`#${c.slug}`} className="block rounded-full border border-ink/12 bg-card px-4 py-2 text-sm font-bold whitespace-nowrap transition-[border-color,background-color] duration-300 ease-out hover:border-ink/35 hover:bg-paper-deep">
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-20 pt-12 pb-20 sm:space-y-32 sm:pt-20 sm:pb-28">
          {groups.map((g) => (
            <div key={g.id} className="space-y-16 sm:space-y-24">
              <div className="border-b-2 border-ink pb-5 sm:pb-6">
                <h2 className="text-[1.75rem] font-black sm:text-4xl">{g.name}</h2>
                <p className="mt-3 text-sm text-muted-foreground">{g.description}</p>
              </div>
              {categoriesByGroup(g.id).map((c) => {
                const items = productsByCategory(c.slug);
                const cover = categoryCover(c);
                return (
                  <section key={c.slug} id={c.slug} aria-labelledby={`${c.slug}-title`} className="scroll-mt-36">
                    <div className="flex flex-col justify-between gap-3 border-b border-ink/10 pb-5 sm:flex-row sm:items-end sm:gap-4 sm:pb-6">
                      <div>
                        <h3 id={`${c.slug}-title`} data-split className="text-2xl font-black sm:text-3xl">
                          {c.name}
                        </h3>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{bidi(c.summary)}</p>
                      </div>
                      <Link href={categoryPath(c)} prefetch={false} className="inline-flex min-h-10 shrink-0 items-center text-sm font-bold text-tape-deep hover:underline">
                        صفحه {c.name} ←
                      </Link>
                    </div>
                    {items.length > 0 ? (
                      <div data-reveal-group className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-4">
                        {items.map((p) => (
                          <ProductCard key={p.slug} product={p} data-reveal-item />
                        ))}
                      </div>
                    ) : (
                      <Link
                        href={categoryPath(c)}
                        prefetch={false}
                        className="group mt-8 flex items-center gap-4 rounded-[1.6rem] border border-dashed border-ink/20 bg-card p-3 transition-[border-color,background-color] duration-300 ease-out hover:border-ink/45 hover:bg-white sm:mt-10 sm:gap-5 sm:p-4"
                      >
                        {cover && (
                          <span className="size-20 shrink-0 overflow-hidden rounded-2xl sm:size-24">
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

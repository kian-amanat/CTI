import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getCategory } from "@/data/categories";
import { productsByCategory } from "@/data/products";
import { PageBreadcrumbs } from "@/components/site/page-breadcrumbs";
import { Picture } from "@/components/site/picture";
import { ProductCard } from "@/components/product/product-card";
import { CallButton, WhatsAppButton } from "@/components/site/contact-buttons";
import { FaqList } from "@/components/site/faq-list";
import { FinalCta } from "@/components/home/final-cta";
import { JsonLd } from "@/components/site/json-ld";
import { categoryPath, itemListLd } from "@/lib/jsonld";
import { categoryCover, getImage } from "@/lib/images";
import { absoluteUrl, faNumber } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { bidi } from "@/lib/bidi";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/categories/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  const cover = categoryCover(category);
  const img = cover && getImage(cover.key);
  return pageMetadata({
    title: category.seoTitle ?? category.title,
    description: category.summary,
    path: categoryPath(category),
    image: img && cover ? { url: absoluteUrl(img.url(img.width)), width: img.width, height: img.height, alt: cover.alt } : undefined,
  });
}

export default async function CategoryPage({ params }: PageProps<"/categories/[slug]">) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const items = productsByCategory(slug);
  const others = categories.filter((c) => c.slug !== slug);
  const cover = categoryCover(category);
  // a hero photo is shown when the group has its own photo, or has no product cards to carry the page visually
  const showCover = cover && (category.image || items.length === 0);

  return (
    <>
      <div className="container-x pt-24 lg:pt-28">
        <PageBreadcrumbs
          items={[
            { name: "محصولات", path: "/products/" },
            { name: category.name, path: categoryPath(category) },
          ]}
        />
        <header className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-14">
          <div>
            {items.length > 0 && <p className="text-sm font-bold text-tape-deep">{faNumber(items.length)} محصول</p>}
            <h1 className="mt-3 text-4xl font-black sm:text-5xl lg:leading-[1.3]">{bidi(category.title)}</h1>
            <div className="mt-9 space-y-5 leading-8 text-muted-foreground">
              {category.intro.map((p) => (
                <p key={p.slice(0, 20)}>{bidi(p)}</p>
              ))}
            </div>
          </div>
          {showCover && cover && (
            <figure className="has-tape relative mx-auto w-full max-w-md rounded-[2rem] border border-ink/8 bg-card p-3 lg:mx-0">
              <div className="aspect-square overflow-hidden rounded-[1.5rem]">
                <Picture image={cover.key} alt={cover.alt} sizes="(min-width: 1024px) 28rem, calc(100vw - 3.5rem)" priority plate />
              </div>
            </figure>
          )}
        </header>

        {items.length > 0 ? (
          <section aria-label={`فهرست ${category.name}`} className="mt-20">
            <div data-reveal-group className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((p) => (
                <ProductCard key={p.slug} product={p} headingLevel="h2" data-reveal-item />
              ))}
            </div>
          </section>
        ) : (
          <section aria-labelledby="inquiry-title" className="mt-20 rounded-[1.8rem] bg-ink p-8 text-paper sm:p-12">
            <h2 id="inquiry-title" className="text-2xl font-black">
              مدل‌ها و قیمت روز را بپرسید
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-paper/75">
              مشخصات فنی کامل این گروه هنوز در کاتالوگ آنلاین ثبت نشده است. مدل‌های موجود، ابعاد و قیمت روز را از کارشناسان بپرسید.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CallButton size="lg" showNumber trackLabel={`category-${category.slug}`} />
              <WhatsAppButton
                size="lg"
                tone="dark"
                message={`سلام، برای «${category.name}» استعلام مدل‌های موجود و قیمت می‌خواستم.`}
                trackLabel={`category-${category.slug}`}
              />
            </div>
          </section>
        )}

        {category.gallery && (
          <section aria-labelledby="gallery-title" className="mt-28">
            <h2 id="gallery-title" className="text-2xl font-black sm:text-3xl">
              تصاویر بیشتر
            </h2>
            <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
              {category.gallery.map((g) => (
                <li key={g.image}>
                  <figure>
                    <div className="aspect-square overflow-hidden rounded-[1.4rem] border border-ink/8 bg-card">
                      <Picture image={g.image} alt={g.alt} sizes="(min-width: 1024px) 22vw, 45vw" />
                    </div>
                    {g.caption && <figcaption className="mt-3 px-1 text-sm leading-7 text-muted-foreground">{bidi(g.caption)}</figcaption>}
                  </figure>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="cfaq-title" className="mt-32 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <h2 id="cfaq-title" data-split className="text-3xl font-black">
            سؤالات متداول درباره {category.name}
          </h2>
          <FaqList items={category.faq} />
        </section>

        <nav aria-labelledby="other-title" className="mt-32 pb-28">
          <h2 id="other-title" className="text-2xl font-black">
            گروه‌های دیگر
          </h2>
          <ul className="mt-8 flex flex-wrap gap-3">
            {others.map((c) => (
              <li key={c.slug}>
                <Link
                  href={categoryPath(c)}
                  prefetch={false}
                  className="block rounded-full border border-ink/12 bg-card px-5 py-3 font-bold transition-[border-color,background-color] duration-300 ease-out hover:border-ink/35 hover:bg-paper-deep"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <FinalCta />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: category.title,
          description: category.summary,
          url: absoluteUrl(categoryPath(category)),
          inLanguage: "fa-IR",
          ...(items.length > 0 ? { mainEntity: itemListLd(category.name, items) } : {}),
        }}
      />
    </>
  );
}

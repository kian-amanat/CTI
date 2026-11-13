import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckIcon, InfoIcon } from "lucide-react";
import { categoriesByGroup, getCategory } from "@/data/categories";
import { getProduct, products, productsByCategory } from "@/data/products";
import { PageBreadcrumbs } from "@/components/site/page-breadcrumbs";
import { Picture } from "@/components/site/picture";
import { CallButton, WhatsAppButton } from "@/components/site/contact-buttons";
import { FaqList } from "@/components/site/faq-list";
import { JsonLd } from "@/components/site/json-ld";
import { ProductCard } from "@/components/product/product-card";
import { DataTableView } from "@/components/product/data-table";
import { categoryPath, productPageLd, productPath } from "@/lib/jsonld";
import { productImage } from "@/lib/images";
import { absoluteUrl, productInquiryMessage } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { bidi } from "@/lib/bidi";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  const img = productImage(product);
  return pageMetadata({
    title: product.seoTitle ?? product.name,
    description: product.summary,
    path: productPath(product),
    image: img ? { url: absoluteUrl(img.url(img.width)), width: img.width, height: img.height, alt: product.imageAlt } : undefined,
  });
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const category = getCategory(product.category)!;

  // related: same category first, then other categories of the same group
  const sameGroup = categoriesByGroup(category.group)
    .filter((c) => c.slug !== category.slug)
    .flatMap((c) => productsByCategory(c.slug));
  const related = [...productsByCategory(product.category).filter((p) => p.slug !== product.slug), ...sameGroup].slice(0, 4);
  const message = productInquiryMessage(product.name);

  return (
    <>
      <div className="container-x pt-24 lg:pt-28">
        <PageBreadcrumbs
          items={[
            { name: "محصولات", path: "/products/" },
            { name: category.name, path: categoryPath(category) },
            { name: product.shortName, path: productPath(product) },
          ]}
        />

        <div className="mt-8 grid grid-cols-1 gap-10 sm:mt-10 sm:gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <figure className="rounded-[1.6rem] border border-ink/8 bg-card p-2.5 sm:rounded-[2rem] sm:p-3">
              <div className="aspect-square overflow-hidden rounded-[1.2rem] sm:rounded-[1.5rem]">
                <Picture image={product.image} alt={product.imageAlt} sizes="(min-width: 1024px) 40vw, calc(100vw - 3.5rem)" priority plate />
              </div>
              <figcaption className="sr-only">{product.imageAlt}</figcaption>
            </figure>
            {product.gallery && (
              <ul className="mt-4 grid grid-cols-3 gap-3" aria-label="تصاویر بیشتر">
                {product.gallery.map((g) => (
                  <li key={g.image} className="aspect-square overflow-hidden rounded-2xl border border-ink/8 bg-card">
                    <Picture image={g.image} alt={g.alt} sizes="(min-width: 1024px) 15vw, 30vw" />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="min-w-0">
            <Link
              href={categoryPath(category)}
              prefetch={false}
              className="inline-flex min-h-9 items-center rounded-full bg-paper-deep px-3.5 text-sm font-bold transition-colors duration-300 ease-out hover:bg-ink/10"
            >
              {category.name}
            </Link>
            <h1 className="mt-5 text-[1.7rem] leading-[1.45] font-black sm:text-4xl lg:text-[2.5rem] lg:leading-[1.4]">{bidi(product.name)}</h1>
            <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
              {product.brand && (
                <span>
                  برند: <span dir="ltr" className="font-bold text-ink">{product.brand}</span>
                </span>
              )}
              {product.model && (
                <span>
                  مدل: <span dir="ltr" className="font-bold text-ink">{product.model}</span>
                </span>
              )}
            </p>
            <p className="mt-6 leading-8 sm:mt-8 sm:text-lg sm:leading-9">{bidi(product.summary)}</p>

            <dl className="mt-8 grid grid-cols-2 gap-3 sm:mt-10">
              {product.highlights.map((s) => (
                <div key={s.label} className="flex flex-col rounded-2xl border border-ink/8 bg-card p-4">
                  <dt className="text-xs text-muted-foreground">{s.label}</dt>
                  <dd className="mt-1 font-bold leading-7">{bidi(s.value)}</dd>
                </div>
              ))}
            </dl>

            {/* data-cta: the phone bottom bar steps aside while these buttons are on screen */}
            <aside aria-labelledby="buy-title" data-cta className="mt-8 rounded-[1.6rem] bg-ink p-6 text-paper sm:mt-10 sm:rounded-[1.8rem] sm:p-9">
              <h2 id="buy-title" className="text-xl font-black">
                قیمت و خرید
              </h2>
              <p className="mt-4 flex gap-2 text-sm leading-7 text-paper/75">
                <InfoIcon className="mt-1 size-4 shrink-0 text-masking" />
                قیمت این محصول به‌دلیل نوسان بازار تلفنی اعلام می‌شود. برای قیمت روز، موجودی و ابعاد مورد نیازتان تماس بگیرید.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <CallButton className="w-full" trackLabel={product.slug} size="lg" />
                <WhatsAppButton className="w-full" tone="dark" message={message} trackLabel={product.slug} size="lg" />
              </div>
            </aside>
          </div>
        </div>

        {/* min-w-0 + an explicit single column: wide catalog tables must scroll inside their box, never stretch the page on phones */}
        <div className="mt-20 grid grid-cols-1 gap-14 sm:mt-28 sm:gap-16 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-20">
          <div className="min-w-0 space-y-16 sm:space-y-24">
            <section aria-labelledby="about-title">
              <h2 id="about-title" data-split className="text-2xl font-black sm:text-3xl">
                معرفی {bidi(product.shortName)}
              </h2>
              <div className="mt-6 space-y-5 leading-8 text-ink/85 sm:mt-7 sm:text-[1.05rem] sm:leading-9">
                {product.description.map((d) => (
                  <p key={d.slice(0, 24)}>{bidi(d)}</p>
                ))}
              </div>
            </section>

            <section aria-labelledby="features-title">
              <h2 id="features-title" className="text-2xl font-black sm:text-3xl">
                ویژگی‌ها
              </h2>
              <ul data-reveal-group className="mt-8 grid gap-3 sm:grid-cols-2">
                {product.features.map((f) => (
                  <li key={f} data-reveal-item className="flex items-start gap-3 rounded-2xl bg-card p-4">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-tape text-white">
                      <CheckIcon className="size-4" />
                    </span>
                    <span className="leading-7">{bidi(f)}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="specs-title">
              <h2 id="specs-title" className="text-2xl font-black sm:text-3xl">
                مشخصات و ابعاد
              </h2>
              <div className="mt-8 space-y-12">
                {product.tables.map((t) => (
                  <div key={t.title}>
                    <h3 className="mb-5 text-lg font-black">{t.title}</h3>
                    <DataTableView table={t} subject={product.name} />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside aria-labelledby="usage-title" className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[1.8rem] border border-ink/10 bg-card p-7 sm:p-9">
              {product.applications && product.applications.length > 0 && (
                <>
                  <h2 id="usage-title" className="text-xl font-black">
                    کاربردها
                  </h2>
                  <ul className="mt-6 space-y-3.5">
                    {product.applications.map((a) => (
                      <li key={a} className="flex items-center gap-3">
                        <span className="size-2 shrink-0 rounded-full bg-tape" aria-hidden="true" />
                        {bidi(a)}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <p className={product.applications?.length ? "mt-6 border-t border-ink/10 pt-5 text-sm leading-7 text-muted-foreground" : "text-sm leading-7 text-muted-foreground"}>
                {!product.applications?.length && <span id="usage-title" className="mb-3 block text-xl font-black text-ink">راهنمایی انتخاب</span>}
                مطمئن نیستید این چسب برای کار شما مناسب است؟ جنس سطح، محل مصرف و شرایط محیط را برای ما بفرستید تا راهنمایی‌تان کنیم.
              </p>
            </div>
          </aside>
        </div>

        <section aria-labelledby="pfaq-title" className="mt-20 sm:mt-32">
          <h2 id="pfaq-title" className="mb-9 text-2xl font-black sm:text-3xl">
            سؤالات متداول درباره {bidi(category.name)}
          </h2>
          {/* the category's questions repeat on its product pages: visible here, but marked up (FAQPage) only once, on the category page */}
          <FaqList items={category.faq} withSchema={false} />
        </section>

        {related.length > 0 && (
          <section aria-labelledby="related-title" className="mt-20 pb-20 sm:mt-32 sm:pb-28">
            <div className="flex items-end justify-between gap-4">
              <h2 id="related-title" data-split className="text-2xl font-black sm:text-3xl">
                محصولات مرتبط
              </h2>
              <Link href={categoryPath(category)} prefetch={false} className="inline-flex min-h-10 items-center text-sm font-bold text-tape-deep hover:underline">
                همه محصولات {category.name} ←
              </Link>
            </div>
            <div data-reveal-group className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} data-reveal-item />
              ))}
            </div>
          </section>
        )}
      </div>
      <JsonLd data={productPageLd(product)} />
    </>
  );
}

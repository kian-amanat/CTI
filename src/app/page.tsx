import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { homeFaq } from "@/data/home";
import { products } from "@/data/products";
import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/home/marquee";
import { CategoriesGrid } from "@/components/home/categories-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { WhyUs } from "@/components/home/why-us";
import { Applications } from "@/components/home/applications";
import { OrderProcess } from "@/components/home/order-process";
import { FinalCta } from "@/components/home/final-cta";
import { SectionHeading } from "@/components/site/section-heading";
import { FaqList } from "@/components/site/faq-list";
import { JsonLd } from "@/components/site/json-ld";
import { itemListLd } from "@/lib/jsonld";
import { faNumber } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `چسب دوطرفه، فوم، ژله‌ای و نوار چسب صنعتی | ${siteConfig.legalName}`,
  absoluteTitle: true,
  description: siteConfig.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <CategoriesGrid />
      <FeaturedProducts />
      <WhyUs />
      <Applications />
      <OrderProcess />
      {/* Desktop: the section holds still while scrolling opens each answer in turn (see data-steps in motion-root) */}
      <section data-steps aria-labelledby="faq-title" className="relative">
        <div className="steps-viewport">
          <div className="container-x grid gap-12 py-24 lg:grid-cols-[1fr_1.4fr] lg:items-center lg:gap-16 lg:py-36">
            <div>
              <SectionHeading
                id="faq-title"
                eyebrow="سؤالات متداول"
                title="پیش از خرید بدانید"
                description="پاسخ سؤال‌هایی که مشتریان بیشتر از همه می‌پرسند. سؤال دیگری دارید؟ یک تماس کافی است."
              />
              <div className="steps-ui mt-12 items-center gap-4" aria-hidden="true">
                <span data-steps-counter className="min-w-14 text-sm font-black">
                  ۱ / {faNumber(homeFaq.length)}
                </span>
                <div className="h-1 w-44 overflow-hidden rounded-full bg-ink/10">
                  <div data-steps-progress className="h-full origin-right scale-x-0 rounded-full bg-tape" />
                </div>
              </div>
            </div>
            <FaqList items={homeFaq} />
          </div>
        </div>
      </section>
      <FinalCta />
      <JsonLd data={itemListLd(`محصولات شاخص ${siteConfig.legalName}`, products.filter((p) => p.featured))} />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { reasons } from "@/data/home";
import { PageBreadcrumbs } from "@/components/site/page-breadcrumbs";
import { Picture } from "@/components/site/picture";
import { FinalCta } from "@/components/home/final-cta";
import { toFaDigits } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "درباره ما؛ تولید و واردات چسب صنعتی NANO",
  description: `${siteConfig.legalName} با برند NANO، تولید و واردات‌کننده انواع چسب یکطرفه و دوطرفه صنعتی، استیکر، روزرنگ و شبرنگ‌های قابل چاپ و ترافیکی؛ ${siteConfig.address.short}.`,
  path: "/about/",
});

/** Brands printed in the client's own catalog overview page. */
const catalogBrands = {
  own: ["NANO TAPE", "QUICK TAPE", "ST JET", "3D JET", "3D CAL"],
  partners: ["ORAJET", "ORACAL", "ORAFOL", "AVERY", "3M", "KNAUF", "NITTO", "tesa", "Lohmann", "MIRKA", "HONO FILM", "Qbono"],
};

/** Other product lines listed in the catalog overview (no product pages yet: price and availability by phone). */
const otherProducts = [
  "وینیل و وینیل قابل چاپ (ORAJET، ORACAL، 3D JET، ST JET)",
  "سلفون نصب ORAFOL",
  "روزرنگ 3D CAL",
  "شبرنگ اکریلیک NANO و شبرنگ لانه‌زنبوری ۳ ساله",
  "شبرنگ ترافیکی ۷ و ۱۰ ساله (AVERY، 3M، ORAFOL)",
  "چسب دوطرفه شاسی NANO",
  "چسب دوطرفه فلکسو TESA",
  "ترمز پله NANO",
  "سنباده MIRKA و محصولات 3M",
  "ورق اکریلیک (پلکسی‌گلاس)",
  "دودی شیشه خودرو HONO FILM",
];

export default function AboutPage() {
  return (
    <>
      <div className="container-x pt-24 lg:pt-28">
        <PageBreadcrumbs items={[{ name: "درباره ما", path: "/about/" }]} />
        <header className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-bold text-tape-deep">{siteConfig.nameEn}</p>
            <h1 className="mt-4 text-4xl font-black sm:text-5xl lg:leading-[1.3]">{siteConfig.legalName}</h1>
            <div className="mt-6 space-y-5 leading-9 text-ink/80">
              <p>
                {siteConfig.legalName} با برند NANO در زمینه تولید و واردات انواع چسب‌های یکطرفه و دوطرفه صنعتی فعالیت می‌کند؛ از چسب‌های
                بسته‌بندی و آلومینیومی گرفته تا چسب‌های دوطرفه فوم، ژله‌ای، سلولزی و شیشه‌ای.
              </p>
              <p>
                در کنار چسب، طبق کاتالوگ بازرگانی، انواع استیکر، روزرنگ، شبرنگ‌های قابل چاپ، راهداری و ترافیکی هم عرضه می‌شود. برای
                هر محصول در این سایت ابعاد، تعداد در کارتن و در صورت وجود کاتالوگ فنی، مشخصات و نتایج آزمون درج شده است.
              </p>
            </div>
          </div>
          <div className="relative">
            <div data-reveal="clip" className="aspect-square overflow-hidden rounded-[2rem]">
              <Picture image="categories/branded-tapes" alt="تابلوی برندهای tesa، Lohmann و 3M" sizes="(min-width: 1024px) 45vw, 100vw" priority />
            </div>
            <span className="tape-corner !top-[-12px] !w-28" aria-hidden="true" />
          </div>
        </header>

        <section aria-labelledby="values-title" className="py-24">
          <h2 id="values-title" data-split className="text-3xl font-black sm:text-4xl">
            آنچه در کاتالوگ ما می‌بینید
          </h2>
          <ul data-reveal-group className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r, i) => (
              <li key={r.title} data-reveal-item className="rounded-[1.6rem] border border-ink/10 bg-card p-6">
                <span className="text-sm font-black text-tape-deep">{toFaDigits(`0${i + 1}`)}</span>
                <h3 className="mt-3 text-lg font-black">{r.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{r.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="brands-title" className="grid gap-10 pb-24 lg:grid-cols-2">
          <div>
            <h2 id="brands-title" data-split className="text-3xl font-black sm:text-4xl">
              برندهای کاتالوگ
            </h2>
            <p className="mt-5 leading-9 text-muted-foreground">
              برندهای بازرگانی ما NANO TAPE، QUICK TAPE، ST JET، 3D JET و 3D CAL هستند. در کاتالوگ و تصاویر ما برندهای دیگری هم دیده
              می‌شود که برای موجودی و قیمت آن‌ها می‌توانید تماس بگیرید.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="برندهای بازرگانی">
              {catalogBrands.own.map((b) => (
                <li key={b} dir="ltr" className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-paper">
                  {b}
                </li>
              ))}
            </ul>
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="برندهای دیگر در کاتالوگ">
              {catalogBrands.partners.map((b) => (
                <li key={b} dir="ltr" className="rounded-full border border-ink/15 bg-card px-4 py-2 text-sm font-medium">
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 id="others-title" className="text-3xl font-black sm:text-4xl">
              سایر محصولات بازرگانی
            </h2>
            <p className="mt-5 leading-9 text-muted-foreground">
              این محصولات در بخش معرفی کاتالوگ آمده‌اند و صفحه جداگانه ندارند؛ قیمت و موجودی را تلفنی بپرسید.
            </p>
            <ul className="mt-6 space-y-3">
              {otherProducts.map((p) => (
                <li key={p} className="flex items-start gap-3 leading-8">
                  <span className="mt-3 h-2 w-5 shrink-0 -rotate-12 rounded-[2px] bg-masking" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="visit-title" className="pb-24">
          <h2 id="visit-title" data-split className="text-3xl font-black sm:text-4xl">
            آدرس و تماس
          </h2>
          <p className="mt-5 max-w-3xl leading-9 text-muted-foreground">
            آدرس: {siteConfig.address.street}. برای اطلاعات بیشتر و مسیر دسترسی{" "}
            <Link href="/contact/" className="font-bold text-tape-deep hover:underline">
              صفحه تماس با ما
            </Link>{" "}
            را ببینید.
          </p>
        </section>
      </div>
      <FinalCta />
    </>
  );
}

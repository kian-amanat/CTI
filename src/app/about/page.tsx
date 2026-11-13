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
  title: "درباره ما؛ تهیه و عرضه برترین برندهای چسب دوطرفه",
  description: `${siteConfig.legalName}: تهیه و عرضه چسب دوطرفه و نوار چسب صنعتی از برندهای tesa، NANO، QUICK TAPE، 3M، Lohmann و NITTO؛ ${siteConfig.address.short}.`,
  path: "/about/",
});

/** Product lines listed in the overview page of the NANO catalog (no product pages here: price and availability by phone). */
const nanoCatalogOthers = [
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
        <header className="mt-10 grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p dir="ltr" className="text-start text-sm font-bold tracking-wider text-tape-deep uppercase">
              {siteConfig.nameEn}
            </p>
            <h1 className="mt-5 text-4xl font-black sm:text-5xl lg:leading-[1.3]">درباره {siteConfig.legalName}</h1>
            <div className="mt-8 space-y-6 leading-9 text-ink/80">
              <p>
                {siteConfig.legalName} با شعار «{siteConfig.tagline}» چسب‌های دوطرفه و نوار چسب‌های صنعتی را از برندهای مختلف در
                یک‌جا گرد آورده است؛ از چسب‌های دوطرفه سلولزی، شیشه‌ای، فوم و ژله‌ای تا نوار چسب‌های آلومینیومی، برزنتی، کنفی و
                بسته‌بندی.
              </p>
              <p>
                برای هر محصول در این سایت ابعاد، تعداد در کارتن و در صورت وجود کاتالوگ فنی، مشخصات و نتایج آزمون درج شده است.
                بسیاری از تصاویر، عکس رول‌ها و ویترین خود ماست.
              </p>
            </div>
          </div>
          <div className="relative">
            <div data-reveal="clip" className="aspect-square overflow-hidden rounded-[2rem]">
              <Picture image="categories/branded-tapes" alt="تابلوی برندهای tesa، Lohmann و 3M" sizes="(min-width: 1024px) 40vw, calc(100vw - 2rem)" priority preload={false} plate />
            </div>
            <span className="tape-corner !top-[-12px] !w-28" aria-hidden="true" />
          </div>
        </header>

        <section aria-labelledby="values-title" className="py-28 lg:py-36">
          <h2 id="values-title" data-split className="text-3xl font-black sm:text-4xl">
            آنچه در کاتالوگ ما می‌بینید
          </h2>
          <ul data-reveal-group className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {reasons.map((r, i) => (
              <li key={r.title} data-reveal-item className="rounded-[1.6rem] border border-ink/10 bg-card p-6">
                <span className="text-sm font-black text-tape-deep">{toFaDigits(`0${i + 1}`)}</span>
                <h3 className="mt-3 text-lg font-black">{r.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{r.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="brands-title" className="grid gap-16 pb-28 lg:grid-cols-2 lg:gap-20 lg:pb-36">
          <div>
            <h2 id="brands-title" data-split className="text-3xl font-black sm:text-4xl">
              برندها
            </h2>
            <p className="mt-6 leading-9 text-muted-foreground">
              در کاتالوگ و تصاویر ما برندهای زیر دیده می‌شود. برای موجودی و قیمت هر برند و مدل می‌توانید تماس بگیرید.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2.5" aria-label="برندها">
              {siteConfig.brands.map((b, i) => (
                <li
                  key={b}
                  dir="ltr"
                  className={i < 4 ? "rounded-full bg-ink px-4 py-2 text-sm font-bold text-paper" : "rounded-full border border-ink/15 bg-card px-4 py-2 text-sm font-medium"}
                >
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 id="others-title" className="text-3xl font-black sm:text-4xl">
              سایر محصولات کاتالوگ NANO
            </h2>
            <p className="mt-6 leading-9 text-muted-foreground">
              کاتالوگ NANO علاوه بر چسب، محصولات دیگری هم معرفی کرده است. این موارد صفحه جداگانه ندارند؛ موجودی و قیمت را تلفنی بپرسید.
            </p>
            <ul className="mt-8 space-y-3.5">
              {nanoCatalogOthers.map((p) => (
                <li key={p} className="flex items-start gap-3 leading-8">
                  <span className="mt-3 h-2 w-5 shrink-0 -rotate-12 rounded-[2px] bg-masking" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="visit-title" className="pb-28 lg:pb-36">
          <h2 id="visit-title" data-split className="text-3xl font-black sm:text-4xl">
            آدرس و تماس
          </h2>
          <p className="mt-6 max-w-3xl leading-9 text-muted-foreground">
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

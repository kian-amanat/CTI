import Link from "next/link";
import { ArrowLeftIcon, MapPinIcon } from "lucide-react";
import { siteConfig } from "@/config/site";
import { siteStats } from "@/data/home";
import { buttonVariants } from "@/components/ui/button";
import { CallButton } from "@/components/site/contact-buttons";
import { HeroVisual } from "@/components/motion/hero-visual";
import { faNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Words are wrapped server-side and animated with pure CSS on first paint — no JS, no LCP delay. */
function Words({ text, start = 0 }: { text: string; start?: number }) {
  return text.split(" ").map((word, i) => (
    <span key={i}>
      <span className="hero-word" style={{ ["--i" as string]: start + i }}>
        {word}
      </span>{" "}
    </span>
  ));
}

export function Hero() {
  return (
    <section data-hero aria-labelledby="hero-title" className="px-2 pt-[4.5rem] sm:px-3 lg:pt-[5.25rem]">
      <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-ink text-paper sm:rounded-[2rem] lg:rounded-[2.75rem]">
        <div className="grid-lines absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_30%_40%,#000_20%,transparent_75%)]" />
        <div className="absolute -start-40 -top-40 -z-10 size-[36rem] rounded-full bg-tape/25 blur-[120px]" />
        <div className="noise absolute inset-0 -z-10 opacity-[0.07] mix-blend-overlay" />

        <div className="container-x grid min-h-[min(54rem,calc(100svh-6rem))] items-center gap-2 pt-9 pb-8 sm:pt-12 sm:pb-10 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:py-16">
          <div data-hero-content>
            <p className="hero-fade inline-flex max-w-full items-center gap-2 rounded-full border border-paper/15 bg-paper/5 px-3.5 py-1.5 text-xs text-paper/80 sm:px-4 sm:text-sm">
              <MapPinIcon className="size-4 shrink-0 text-tape" />
              {siteConfig.address.short}
            </p>

            <h1 id="hero-title" className="mt-6 font-black sm:mt-7">
              <span className="block text-[clamp(2.6rem,7vw,5.25rem)] leading-[1.15]">
                <Words text="چسب دوطرفه" />
              </span>{" "}
              <span className="block text-[clamp(2.1rem,5.6vw,4.25rem)] leading-[1.2] text-tape">
                <Words text="و نوار چسب صنعتی" start={2} />
              </span>{" "}
              <span className="mt-4 block text-lg font-bold text-paper/75 sm:mt-5 sm:text-2xl">
                <Words text={siteConfig.tagline} start={6} />
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-[0.95rem] leading-8 text-paper/65 sm:mt-6 sm:text-base">
              از چسب دوطرفه سلولزی، شیشه‌ای، فوم و ژله‌ای تا نوار چسب‌های آلومینیومی، برزنتی، کنفی و بسته‌بندی؛ از برندهای tesa،
              NANO، 3M و Lohmann، با ابعاد مشخص برای هر محصول. قیمت روز را تلفنی بپرسید.
            </p>

            {/* data-cta="top": the phone bottom bar stays out of sight while these buttons are on screen */}
            <div data-cta="top" className="hero-fade mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap" style={{ ["--i" as string]: 12 }}>
              <Link
                href="/products/"
                className={cn(buttonVariants(), "h-12 w-full gap-3 rounded-full bg-paper px-7 text-base font-bold text-ink hover:bg-paper/85 sm:h-14 sm:w-auto")}
              >
                مشاهده کاتالوگ محصولات
                <ArrowLeftIcon className="size-5" />
              </Link>
              <CallButton size="lg" trackLabel="hero" className="h-12 w-full sm:h-14 sm:w-auto" />
            </div>

            <dl className="hero-fade mt-9 grid max-w-lg grid-cols-3 gap-4 border-t border-paper/10 pt-6 sm:mt-12 sm:pt-7" style={{ ["--i" as string]: 14 }}>
              {siteStats.slice(0, 3).map((s) => (
                <div key={s.label} className="flex flex-col">
                  <dt className="text-xs leading-6 text-paper/55">{s.label}</dt>
                  <dd className="order-first text-2xl font-black text-paper sm:text-3xl">{faNumber(s.value)}</dd>
                </div>
              ))}
            </dl>
          </div>

          <HeroVisual className="mx-auto max-w-[16rem] sm:max-w-md lg:max-w-none" />
        </div>
      </div>
    </section>
  );
}

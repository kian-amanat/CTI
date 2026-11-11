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
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-ink text-paper lg:rounded-[2.75rem]">
        <div className="grid-lines absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_30%_40%,#000_20%,transparent_75%)]" />
        <div className="absolute -start-40 -top-40 -z-10 size-[36rem] rounded-full bg-tape/25 blur-[120px]" />
        <div className="noise absolute inset-0 -z-10 opacity-[0.07] mix-blend-overlay" />

        <div className="container-x grid min-h-[min(54rem,calc(100svh-6rem))] items-center gap-6 pt-12 pb-10 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:py-16">
          <div data-hero-content>
            <p className="hero-fade inline-flex items-center gap-2 rounded-full border border-paper/15 bg-paper/5 px-4 py-1.5 text-sm text-paper/80">
              <MapPinIcon className="size-4 text-tape" />
              {siteConfig.address.short}
            </p>

            <h1 id="hero-title" className="mt-7 font-black">
              <span className="block text-[clamp(2.6rem,7vw,5.25rem)] leading-[1.15]">
                <Words text="چسب دوطرفه" />
              </span>{" "}
              <span className="block text-[clamp(2.1rem,5.6vw,4.25rem)] leading-[1.2] text-tape">
                <Words text="و نوار چسب صنعتی" start={2} />
              </span>{" "}
              <span className="mt-5 block text-lg font-bold text-paper/75 sm:text-2xl">
                {/* NBSP keeps "QUICK TAPE" in one animated span so the Latin words don't swap order in RTL */}
                <Words text={"تولید و واردات؛ NANO و QUICK TAPE"} start={6} />
              </span>
            </h1>

            <p className="mt-6 max-w-xl leading-8 text-paper/65">
              از چسب دوطرفه سلولزی، شیشه‌ای، فوم و ژله‌ای تا نوار چسب‌های آلومینیومی، برزنتی، کنفی و بسته‌بندی؛ با ابعاد و تعداد در
              کارتن مشخص برای هر محصول. قیمت روز را تلفنی بپرسید.
            </p>

            <div className="hero-fade mt-9 flex flex-wrap gap-3" style={{ ["--i" as string]: 12 }}>
              <Link
                href="/products/"
                data-magnetic
                className={cn(buttonVariants(), "h-14 gap-3 rounded-full bg-paper px-7 text-base font-bold text-ink hover:bg-masking")}
              >
                مشاهده کاتالوگ محصولات
                <ArrowLeftIcon className="size-5" />
              </Link>
              <CallButton size="lg" trackLabel="hero" />
            </div>

            <dl className="hero-fade mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-paper/10 pt-7" style={{ ["--i" as string]: 14 }}>
              {siteStats.slice(0, 3).map((s) => (
                <div key={s.label} className="flex flex-col">
                  <dt className="text-xs leading-6 text-paper/55">{s.label}</dt>
                  <dd className="order-first text-2xl font-black text-paper sm:text-3xl">{faNumber(s.value)}</dd>
                </div>
              ))}
            </dl>
          </div>

          <HeroVisual className="mx-auto max-w-[22rem] sm:max-w-md lg:max-w-none" />
        </div>
      </div>
    </section>
  );
}

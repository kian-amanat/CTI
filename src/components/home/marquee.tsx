import { categories } from "@/data/categories";
import { MarqueeTrack } from "@/components/home/marquee-track";

const words = [
  "چسب دوطرفه سلولزی",
  "چسب دوطرفه شیشه‌ای",
  "فوم چسبدار دوطرفه",
  "چسب ژله‌ای",
  "چسب دوطرفه روکش قرمز",
  "آلومینیوم چسبدار",
  "چسب برزنتی",
  "چسب کنفی",
  "چسب بسته‌بندی",
  "چسب پی‌وی‌سی",
  "چسب کاغذی",
  "چسب مارکدار",
];

/** A strip of masking tape running across the page. CSS-only loop; leans with scroll speed. */
export function Marquee() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {words.map((w) => (
        <li key={w} className="flex items-center gap-6 px-6 text-lg font-black whitespace-nowrap text-ink/85 sm:text-2xl">
          {w}
          <span className="text-tape">✦</span>
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label={`انواع محصولات: ${categories.map((c) => c.name).join("، ")}`} className="relative z-10 -my-2 overflow-hidden py-10">
      <div data-velocity-skew className="-mx-4 -rotate-2">
        <MarqueeTrack
          className="relative flex w-max animate-marquee bg-masking py-4 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.25)] [--marquee-duration:45s] hover:[animation-play-state:paused] data-[run=false]:[animation-play-state:paused]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgb(255 255 255 / 0.08) 0 2px, transparent 2px 7px), linear-gradient(180deg, rgb(255 255 255 / 0.25), transparent 40%, rgb(0 0 0 / 0.06))",
          }}
        >
          {row(false)}
          {row(true)}
        </MarqueeTrack>
      </div>
    </section>
  );
}

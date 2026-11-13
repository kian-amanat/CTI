import { LayersIcon, PackageIcon, RulerIcon, TagsIcon } from "lucide-react";
import { siteConfig } from "@/config/site";
import { reasons, siteStats } from "@/data/home";
import { SectionHeading } from "@/components/site/section-heading";
import { faNumber } from "@/lib/format";

const icons = [TagsIcon, LayersIcon, RulerIcon, PackageIcon];

export function WhyUs() {
  return (
    <section aria-labelledby="why-title" className="relative overflow-hidden bg-ink py-16 text-paper sm:py-24 lg:py-36">
      <div className="grid-lines absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,#000,transparent)]" />
      <div className="container-x relative">
        <SectionHeading
          id="why-title"
          tone="light"
          eyebrow={`چرا ${siteConfig.name}؟`}
          title="انتخاب چسب، با مشخصات دقیق و بدون حدس"
          description="برای هر محصول، ابعاد، تعداد در کارتن و (در مدل‌های دارای کاتالوگ فنی) ضخامت و نتایج آزمون ثبت شده است تا بدانید دقیقاً چه می‌خرید."
        />

        <dl data-reveal-group className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[1.4rem] bg-paper/10 sm:mt-14 sm:rounded-[1.8rem] lg:mt-20 lg:grid-cols-4">
          {siteStats.map((s) => (
            <div key={s.label} data-reveal-item className="flex flex-col bg-ink p-5 sm:p-8">
              <dt className="mt-1.5 text-sm text-paper/60 sm:mt-2">{s.label}</dt>
              <dd className="order-first text-4xl font-black text-masking sm:text-5xl">
                <span data-counter={s.value}>{faNumber(s.value)}</span>
              </dd>
            </div>
          ))}
        </dl>

        {/* phones: one list, icon beside the text; from `sm` up: separate cards */}
        <ul data-reveal-group className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {reasons.map((r, i) => {
            const Icon = icons[i];
            return (
              <li
                key={r.title}
                data-reveal-item
                className="grid grid-cols-[auto_1fr] items-start gap-x-4 rounded-[1.4rem] border border-paper/10 bg-paper/[0.03] p-5 transition-[border-color,background-color] duration-300 ease-out hover:border-paper/25 hover:bg-paper/[0.07] sm:block sm:rounded-[1.6rem] sm:p-6"
              >
                <Icon className="size-7 text-tape max-sm:mt-1 sm:size-8" />
                <div>
                  <h3 className="text-lg font-black sm:mt-5">{r.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-paper/65">{r.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

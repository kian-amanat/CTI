import { FactoryIcon, PackageIcon, RulerIcon, TagsIcon } from "lucide-react";
import { siteConfig } from "@/config/site";
import { reasons, siteStats } from "@/data/home";
import { SectionHeading } from "@/components/site/section-heading";
import { faNumber } from "@/lib/format";

const icons = [FactoryIcon, RulerIcon, PackageIcon, TagsIcon];

export function WhyUs() {
  return (
    <section aria-labelledby="why-title" className="relative overflow-hidden bg-ink py-20 text-paper lg:py-28">
      <div className="grid-lines absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,#000,transparent)]" />
      <div className="container-x relative">
        <SectionHeading
          id="why-title"
          tone="light"
          eyebrow={`چرا ${siteConfig.name}؟`}
          title="انتخاب چسب، با مشخصات دقیق و بدون حدس"
          description="برای هر محصول، ابعاد، تعداد در کارتن و (در مدل‌های دارای کاتالوگ فنی) ضخامت و نتایج آزمون ثبت شده است تا بدانید دقیقاً چه می‌خرید."
        />

        <dl data-reveal-group className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-[1.8rem] bg-paper/10 lg:grid-cols-4">
          {siteStats.map((s) => (
            <div key={s.label} data-reveal-item className="flex flex-col bg-ink p-6 sm:p-8">
              <dt className="mt-2 text-sm text-paper/60">{s.label}</dt>
              <dd className="order-first text-4xl font-black text-masking sm:text-5xl">
                <span data-counter={s.value}>{faNumber(s.value)}</span>
              </dd>
            </div>
          ))}
        </dl>

        <ul data-reveal-group className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => {
            const Icon = icons[i];
            return (
              <li key={r.title} data-reveal-item className="rounded-[1.6rem] border border-paper/10 bg-paper/[0.03] p-6 transition-colors hover:border-tape/60 hover:bg-tape/[0.06]">
                <Icon className="size-8 text-tape" />
                <h3 className="mt-5 text-lg font-black">{r.title}</h3>
                <p className="mt-2 text-sm leading-7 text-paper/65">{r.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

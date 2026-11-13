import { orderSteps } from "@/data/home";
import { SectionHeading } from "@/components/site/section-heading";
import { CallButton, WhatsAppButton } from "@/components/site/contact-buttons";
import { toFaDigits } from "@/lib/format";

export function OrderProcess() {
  return (
    <section aria-labelledby="process-title" className="bg-paper-deep py-16 sm:py-24 lg:py-36">
      <div className="container-x">
        <SectionHeading
          id="process-title"
          eyebrow="روش خرید"
          title="سه قدم تا تحویل سفارش"
          description="خرید ساده است: بدون ثبت‌نام و سبد خرید. قیمت روز را بپرسید و سفارش دهید."
          align="center"
        />
        <div data-draw-root className="relative mt-10 sm:mt-16 lg:mt-24">
          {/* a strip of tape drawn across the steps as you scroll */}
          <svg className="absolute inset-x-0 top-10 hidden h-24 w-full lg:block" viewBox="0 0 1200 100" preserveAspectRatio="none" aria-hidden="true">
            <path
              data-draw
              d="M1150 50 C 1000 -10, 850 110, 600 50 S 200 -10, 50 50"
              fill="none"
              stroke="var(--tape)"
              strokeWidth="5"
              strokeDasharray="1 0"
              strokeLinecap="round"
            />
          </svg>
          {/* phones: the number sits beside the text (a compact row per step); from `sm` up: centred cards */}
          <ol data-reveal-group className="relative grid gap-3 sm:gap-6 lg:grid-cols-3 lg:gap-10">
            {orderSteps.map((s, i) => (
              <li
                key={s.title}
                data-reveal-item
                className="relative grid grid-cols-[auto_1fr] items-start gap-x-4 rounded-[1.4rem] bg-card p-5 shadow-[0_20px_50px_-30px_rgb(19_20_24/0.3)] sm:block sm:rounded-[1.8rem] sm:p-8 sm:pt-10 sm:text-center"
              >
                <span className="grid size-12 place-items-center rounded-full bg-ink text-xl font-black text-paper sm:mx-auto sm:size-16 sm:text-2xl sm:ring-8 sm:ring-paper-deep">
                  {toFaDigits(i + 1)}
                </span>
                <div>
                  <h3 className="text-lg font-black sm:mt-6 sm:text-xl">{s.title}</h3>
                  <p className="mt-2 leading-8 text-muted-foreground sm:mt-3">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div data-reveal="up" data-cta className="mt-10 flex flex-col gap-3 sm:mt-14 sm:flex-row sm:flex-wrap sm:justify-center lg:mt-16">
          <CallButton size="lg" trackLabel="process" showNumber className="w-full sm:w-auto" />
          <WhatsAppButton size="lg" trackLabel="process" className="w-full sm:w-auto" />
        </div>
      </div>
    </section>
  );
}

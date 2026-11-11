import { orderSteps } from "@/data/home";
import { SectionHeading } from "@/components/site/section-heading";
import { CallButton, WhatsAppButton } from "@/components/site/contact-buttons";
import { toFaDigits } from "@/lib/format";

export function OrderProcess() {
  return (
    <section aria-labelledby="process-title" className="bg-paper-deep py-20 lg:py-28">
      <div className="container-x">
        <SectionHeading
          id="process-title"
          eyebrow="روش خرید"
          title="سه قدم تا تحویل سفارش"
          description="خرید ساده است: بدون ثبت‌نام و سبد خرید. قیمت روز را بپرسید و سفارش دهید."
          align="center"
        />
        <div data-draw-root className="relative mt-16">
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
          <ol data-reveal-group className="relative grid gap-6 lg:grid-cols-3 lg:gap-10">
            {orderSteps.map((s, i) => (
              <li key={s.title} data-reveal-item className="relative rounded-[1.8rem] bg-card p-8 pt-10 text-center shadow-[0_20px_50px_-30px_rgb(19_20_24/0.3)]">
                <span className="mx-auto grid size-16 place-items-center rounded-full bg-ink text-2xl font-black text-paper ring-8 ring-paper-deep">
                  {toFaDigits(i + 1)}
                </span>
                <h3 className="mt-6 text-xl font-black">{s.title}</h3>
                <p className="mt-3 leading-8 text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
        <div data-reveal="up" className="mt-12 flex flex-wrap justify-center gap-3">
          <CallButton size="lg" trackLabel="process" showNumber />
          <WhatsAppButton size="lg" trackLabel="process" />
        </div>
      </div>
    </section>
  );
}

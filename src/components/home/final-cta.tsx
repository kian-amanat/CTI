import { MapPinIcon } from "lucide-react";
import { siteConfig } from "@/config/site";
import { CallButton, WhatsAppButton } from "@/components/site/contact-buttons";
import { mapLinks } from "@/lib/format";

export function FinalCta({ title = "قیمت روز را همین حالا بپرسید" }: { title?: string }) {
  return (
    <section aria-labelledby="cta-title" className="px-2 py-6 sm:px-3">
      <div data-reveal="clip" className="parallax-root relative isolate overflow-hidden rounded-[2rem] bg-tape px-6 py-16 text-white sm:px-12 lg:rounded-[2.75rem] lg:py-24">
        <div className="noise absolute inset-0 -z-10 opacity-20 mix-blend-overlay" />
        <div
          data-parallax
          style={{ "--parallax": 18 } as React.CSSProperties}
          aria-hidden="true"
          className="absolute -top-10 -left-24 -z-10 h-24 w-[32rem] -rotate-12 bg-masking/90 shadow-lg"
        />
        <div
          data-parallax
          style={{ "--parallax": -14 } as React.CSSProperties}
          aria-hidden="true"
          className="absolute -right-20 -bottom-6 -z-10 h-20 w-[28rem] rotate-6 bg-ink/90"
        />
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="cta-title" data-split className="text-3xl font-black sm:text-5xl lg:text-6xl lg:leading-[1.25]">
            {title}
          </h2>
          <p className="mx-auto mt-6 max-w-xl leading-8 text-white/85">
            قیمت‌ها به‌خاطر نوسان بازار روی سایت درج نمی‌شوند. تماس بگیرید یا پیام بدهید تا قیمت، موجودی و ابعاد مورد نیازتان را
            اعلام کنیم.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <CallButton size="lg" showNumber trackLabel="final-cta" className="bg-ink shadow-none hover:bg-ink/85" />
            <WhatsAppButton size="lg" tone="dark" trackLabel="final-cta" className="border-white/40" />
          </div>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 text-sm text-white/85 sm:flex-row sm:gap-8">
            <a href={mapLinks.google} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:underline">
              <MapPinIcon className="size-4" />
              {siteConfig.address.short}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

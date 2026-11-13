import { MapPinIcon } from "lucide-react";
import { siteConfig } from "@/config/site";
import { CallButton, WhatsAppButton } from "@/components/site/contact-buttons";
import { mapLinks } from "@/lib/format";

export function FinalCta({ title = "قیمت روز را همین حالا بپرسید" }: { title?: string }) {
  return (
    // data-cta: the phone bottom bar steps aside while this block (which has the same buttons) is on screen
    <section aria-labelledby="cta-title" data-cta className="px-2 py-6 sm:px-3">
      <div data-reveal="clip" className="relative isolate overflow-hidden rounded-[2rem] bg-tape px-5 py-14 text-white sm:px-12 sm:py-16 lg:rounded-[2.75rem] lg:py-24">
        <div className="noise absolute inset-0 -z-10 opacity-20 mix-blend-overlay" />
        {/* a soft light from above gives the flat red some depth */}
        <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-3/4 bg-[radial-gradient(ellipse_at_50%_0%,rgb(255_255_255/0.2),transparent_70%)]" />
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="cta-title" data-split className="text-[1.9rem] font-black sm:text-5xl lg:text-6xl lg:leading-[1.25]">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-8 text-white/85 sm:mt-6">
            قیمت‌ها به‌خاطر نوسان بازار روی سایت درج نمی‌شوند. تماس بگیرید یا پیام بدهید تا قیمت، موجودی و ابعاد مورد نیازتان را
            اعلام کنیم.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:justify-center">
            <CallButton size="lg" showNumber trackLabel="final-cta" className="w-full bg-ink shadow-none hover:bg-ink/85 sm:w-auto" />
            <WhatsAppButton size="lg" tone="dark" trackLabel="final-cta" className="w-full border-white/40 sm:w-auto" />
          </div>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 text-sm text-white/85 sm:mt-10 sm:flex-row sm:gap-8">
            <a href={mapLinks.google} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 hover:underline">
              <MapPinIcon className="size-4 shrink-0" />
              {siteConfig.address.short}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

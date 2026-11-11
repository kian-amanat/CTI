import { PhoneIcon } from "lucide-react";
import { WhatsAppIcon } from "@/components/site/brand-icons";
import { telHref, whatsappHref } from "@/lib/format";

/** Always-visible purchase actions: a bottom bar on phones, a floating WhatsApp bubble on desktop. */
export function MobileContactBar() {
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-paper/90 p-3 backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-2 gap-2">
          <a
            href={telHref}
            data-track="call"
            data-track-label="mobile-bar"
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-tape font-bold text-white"
          >
            <PhoneIcon className="size-5" />
            تماس برای خرید
          </a>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            data-track="whatsapp"
            data-track-label="mobile-bar"
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-whatsapp font-bold text-white"
          >
            <WhatsAppIcon className="size-5" />
            واتساپ
          </a>
        </div>
      </div>
      <a
        href={whatsappHref()}
        target="_blank"
        rel="noopener noreferrer"
        data-track="whatsapp"
        data-track-label="floating"
        aria-label="گفتگو در واتساپ"
        className="fixed bottom-6 left-6 z-40 hidden size-14 place-items-center rounded-full bg-whatsapp text-white shadow-[0_12px_30px_-8px_rgb(31_168_85/0.7)] transition-transform hover:scale-110 lg:grid"
      >
        <WhatsAppIcon className="size-7" />
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-whatsapp/40 [animation-duration:2.5s]" />
      </a>
    </>
  );
}

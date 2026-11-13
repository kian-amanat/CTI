import { PhoneIcon } from "lucide-react";
import { WhatsAppIcon } from "@/components/site/brand-icons";
import { ContactBarState } from "@/components/site/contact-bar-state";
import { telHref, whatsappHref } from "@/lib/format";

/**
 * Always-within-reach purchase actions: a slim bar at the bottom on phones (it steps aside while the page itself shows
 * the same buttons, see contact-bar-state.tsx), a floating WhatsApp bubble on desktop.
 */
export function MobileContactBar() {
  return (
    <>
      <div
        id="contact-bar"
        className="contact-bar fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-paper/90 px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden"
      >
        <div className="grid grid-cols-[3fr_2fr] gap-2">
          <a
            href={telHref}
            data-track="call"
            data-track-label="mobile-bar"
            className="flex h-11 items-center justify-center gap-2 rounded-full bg-tape text-[0.95rem] font-bold text-white transition-colors duration-300 ease-out active:bg-tape-deep"
          >
            <PhoneIcon className="size-[1.1rem]" />
            تماس برای خرید
          </a>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            data-track="whatsapp"
            data-track-label="mobile-bar"
            className="flex h-11 items-center justify-center gap-2 rounded-full bg-whatsapp text-[0.95rem] font-bold text-white transition-colors duration-300 ease-out active:bg-[#188a49]"
          >
            <WhatsAppIcon className="size-[1.1rem]" />
            واتساپ
          </a>
        </div>
      </div>
      <ContactBarState />
      <a
        href={whatsappHref()}
        target="_blank"
        rel="noopener noreferrer"
        data-track="whatsapp"
        data-track-label="floating"
        aria-label="گفتگو در واتساپ"
        className="fixed bottom-6 left-6 z-40 hidden size-14 place-items-center rounded-full bg-whatsapp text-white shadow-[0_12px_30px_-8px_rgb(31_168_85/0.7)] transition-colors duration-300 ease-out hover:bg-[#188a49] lg:grid"
      >
        <WhatsAppIcon className="size-7" />
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-whatsapp/40 [animation-duration:2.5s]" />
      </a>
    </>
  );
}

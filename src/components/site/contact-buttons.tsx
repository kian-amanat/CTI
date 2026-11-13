import { PhoneIcon } from "lucide-react";
import { primaryPhone } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/site/brand-icons";
import { telHref, whatsappHref } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Pre-filled WhatsApp message */
  message?: string;
  /** Analytics label, e.g. the product SKU */
  trackLabel?: string;
  size?: "md" | "lg";
  tone?: "light" | "dark";
  showNumber?: boolean;
};

const sizes = {
  md: "h-11 gap-2 rounded-full px-5 text-[0.95rem]",
  lg: "h-14 gap-3 rounded-full px-7 text-base",
};

export function CallButton({ className, trackLabel, size = "md", showNumber = false }: Props) {
  return (
    <a
      href={telHref}
      data-track="call"
      data-track-label={trackLabel}
      className={cn(buttonVariants(), sizes[size], "font-bold shadow-[0_10px_30px_-14px_var(--tape)]", className)}
    >
      <PhoneIcon className="size-5" />
      <span>{showNumber ? <span dir="ltr">{primaryPhone.display}</span> : "تماس برای خرید"}</span>
    </a>
  );
}

export function WhatsAppButton({ className, message, trackLabel, size = "md", tone = "light" }: Props) {
  return (
    <a
      href={whatsappHref(message)}
      target="_blank"
      rel="noopener noreferrer"
      data-track="whatsapp"
      data-track-label={trackLabel}
      className={cn(
        buttonVariants({ variant: "outline" }),
        sizes[size],
        "font-bold",
        tone === "dark"
          ? "border-paper/20 bg-transparent text-paper hover:border-paper/45 hover:bg-paper/10 hover:text-paper dark:bg-transparent"
          : "border-ink/15 bg-card hover:border-ink/35 hover:bg-paper-deep",
        className,
      )}
    >
      <WhatsAppIcon className="size-5 text-whatsapp" />
      <span>پیام در واتساپ</span>
    </a>
  );
}

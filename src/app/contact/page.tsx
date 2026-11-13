import type { Metadata } from "next";
import { MailIcon, MapPinIcon, NavigationIcon, PhoneIcon } from "lucide-react";
import { siteConfig } from "@/config/site";
import { PageBreadcrumbs } from "@/components/site/page-breadcrumbs";
import { CallButton, WhatsAppButton } from "@/components/site/contact-buttons";
import { InstagramIcon, TelegramIcon, WhatsAppIcon } from "@/components/site/brand-icons";
import { mapLinks, whatsappHref } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "تماس با ما؛ استعلام قیمت چسب دوطرفه و نوار چسب صنعتی",
  description: `برای استعلام قیمت روز چسب دوطرفه و نوار چسب صنعتی با ${siteConfig.legalName} تماس بگیرید یا پیام بدهید. آدرس: ${siteConfig.address.short}.`,
  path: "/contact/",
});

const cards = [
  ...siteConfig.phones.map((p, i) => ({
    title: `تلفن ${["اول", "دوم", "سوم"][i]}`,
    value: p.display,
    href: `tel:${p.tel}`,
    Icon: PhoneIcon,
    ltr: true,
    track: "call",
  })),
  { title: "موبایل", value: siteConfig.mobile.display, href: `tel:${siteConfig.mobile.tel}`, Icon: PhoneIcon, ltr: true, track: "call" },
  { title: "واتساپ", value: siteConfig.whatsapp.display, href: whatsappHref(), Icon: WhatsAppIcon, ltr: true, track: "whatsapp" },
  { title: "تلگرام", value: "@standard_enk", href: siteConfig.social.telegram, Icon: TelegramIcon, ltr: true, track: "telegram" },
  { title: "اینستاگرام", value: "@nano_enk", href: siteConfig.social.instagram, Icon: InstagramIcon, ltr: true, track: "instagram" },
  { title: "ایمیل", value: siteConfig.email, href: `mailto:${siteConfig.email}`, Icon: MailIcon, ltr: true, track: undefined },
];

export default function ContactPage() {
  return (
    <div className="container-x pt-24 pb-20 sm:pb-28 lg:pt-28">
      <PageBreadcrumbs items={[{ name: "تماس با ما", path: "/contact/" }]} />
      <header className="mt-8 max-w-3xl sm:mt-10">
        <h1 className="text-[2rem] font-black sm:text-5xl lg:leading-[1.3]">
          تماس با ما و <span className="text-tape-deep">استعلام قیمت</span>
        </h1>
        <p className="mt-5 leading-8 text-muted-foreground sm:mt-7 sm:text-lg sm:leading-9">
          سریع‌ترین راه خرید، تماس تلفنی یا پیام است. نام محصول، مدل و ابعاد مورد نیازتان را بگویید تا قیمت روز و موجودی را اعلام کنیم.
        </p>
        {/* data-cta="top": the phone bottom bar stays out of sight while these buttons are on screen */}
        <div data-cta="top" className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap">
          <CallButton size="lg" showNumber trackLabel="contact-page" className="w-full sm:w-auto" />
          <WhatsAppButton size="lg" trackLabel="contact-page" className="w-full sm:w-auto" />
        </div>
      </header>

      {/* phones: one grouped list of tap-to-call rows; from `sm` up: separate cards in a grid */}
      <ul
        data-reveal-group
        className="mt-12 divide-y divide-ink/8 overflow-hidden rounded-[1.4rem] border border-ink/10 bg-card sm:mt-20 sm:grid sm:grid-cols-2 sm:gap-4 sm:divide-y-0 sm:overflow-visible sm:rounded-none sm:border-0 sm:bg-transparent lg:grid-cols-4"
      >
        {cards.map(({ title, value, href, Icon, ltr, track }) => (
          <li key={title} data-reveal-item>
            <a
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              data-track={track}
              data-track-label="contact-card"
              className="group flex items-center gap-4 p-4 transition-[border-color,background-color,box-shadow] duration-300 ease-out hover:bg-white sm:rounded-[1.6rem] sm:border sm:border-ink/10 sm:bg-card sm:p-5 sm:hover:border-ink/30 sm:hover:shadow-[0_20px_40px_-32px_rgb(19_20_24/0.4)]"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-paper-deep text-tape sm:size-12">
                <Icon className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm text-muted-foreground">{title}</span>
                <span className="block truncate font-black" dir={ltr ? "ltr" : undefined}>
                  {value}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <section aria-labelledby="address-title" className="relative mt-4 overflow-hidden rounded-[1.6rem] bg-ink p-6 text-paper sm:mt-6 sm:rounded-[2rem] sm:p-12">
        <div className="grid-lines absolute inset-0 opacity-70" aria-hidden="true" />
        <div className="relative">
          <h2 id="address-title" className="flex items-center gap-3 text-2xl font-black">
            <MapPinIcon className="size-6 text-tape" />
            آدرس
          </h2>
          <address className="mt-4 leading-9 not-italic text-paper/85 sm:mt-5 sm:text-lg">{siteConfig.address.street}</address>
          <p className="mt-8 text-sm font-bold text-paper/60 sm:mt-10">مسیریابی با:</p>
          <ul className="mt-3 flex flex-wrap gap-2 sm:mt-4">
            <li className="max-sm:w-full">
              <a
                href={mapLinks.google}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-paper/20 px-5 font-bold transition-[border-color,background-color] duration-300 ease-out hover:border-paper/50 hover:bg-paper/10 max-sm:w-full"
              >
                <NavigationIcon className="size-4" />
                گوگل مپ
              </a>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

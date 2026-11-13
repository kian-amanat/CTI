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
    <div className="container-x pt-24 pb-28 lg:pt-28">
      <PageBreadcrumbs items={[{ name: "تماس با ما", path: "/contact/" }]} />
      <header className="mt-10 max-w-3xl">
        <h1 className="text-4xl font-black sm:text-5xl lg:leading-[1.3]">
          تماس با ما و <span className="text-tape-deep">استعلام قیمت</span>
        </h1>
        <p className="mt-7 text-lg leading-9 text-muted-foreground">
          سریع‌ترین راه خرید، تماس تلفنی یا پیام است. نام محصول، مدل و ابعاد مورد نیازتان را بگویید تا قیمت روز و موجودی را اعلام کنیم.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <CallButton size="lg" showNumber trackLabel="contact-page" />
          <WhatsAppButton size="lg" trackLabel="contact-page" />
        </div>
      </header>

      <ul data-reveal-group className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ title, value, href, Icon, ltr, track }) => (
          <li key={title} data-reveal-item>
            <a
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              data-track={track}
              data-track-label="contact-card"
              className="group flex items-center gap-4 rounded-[1.6rem] border border-ink/10 bg-card p-5 transition-[border-color,background-color,box-shadow] duration-300 ease-out hover:border-ink/30 hover:bg-white hover:shadow-[0_20px_40px_-32px_rgb(19_20_24/0.4)]"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-paper-deep text-tape">
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

      <section aria-labelledby="address-title" className="relative mt-6 overflow-hidden rounded-[2rem] bg-ink p-8 text-paper sm:p-12">
        <div className="grid-lines absolute inset-0 opacity-70" aria-hidden="true" />
        <div className="relative">
          <h2 id="address-title" className="flex items-center gap-3 text-2xl font-black">
            <MapPinIcon className="size-6 text-tape" />
            آدرس
          </h2>
          <address className="mt-5 text-lg leading-9 not-italic text-paper/85">{siteConfig.address.street}</address>
          <p className="mt-10 text-sm font-bold text-paper/60">مسیریابی با:</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            <li>
              <a
                href={mapLinks.google}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-paper/20 px-5 py-2.5 font-bold transition-[border-color,background-color] duration-300 ease-out hover:border-paper/50 hover:bg-paper/10"
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

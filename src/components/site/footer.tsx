import Link from "next/link";
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { developer, navLinks, siteConfig } from "@/config/site";
import { categories } from "@/data/categories";
import { Logo } from "@/components/site/logo";
import { InstagramIcon, TelegramIcon, WhatsAppIcon } from "@/components/site/brand-icons";
import { DeveloperCredit } from "@/components/site/developer-credit";
import { currentFaYear, mapLinks, whatsappHref } from "@/lib/format";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink pb-24 text-paper/80 lg:pb-0" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        اطلاعات تماس و دسترسی سریع
      </h2>
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-3">
          <Logo tone="light" />
          <p className="mt-6 max-w-sm text-sm leading-8">{siteConfig.tagline}. برندهای {siteConfig.brands.slice(0, 2).join(" و ")}.</p>
          <ul className="mt-6 flex gap-2" aria-label="شبکه‌های اجتماعی">
            {[
              { href: siteConfig.social.instagram, label: "اینستاگرام", Icon: InstagramIcon },
              { href: siteConfig.social.telegram, label: "تلگرام", Icon: TelegramIcon },
              { href: whatsappHref(), label: "واتساپ", Icon: WhatsAppIcon },
            ].map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-full border border-paper/15 transition-colors hover:border-tape hover:bg-tape hover:text-white"
                >
                  <Icon className="size-[18px]" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="دسته‌بندی محصولات" className="lg:col-span-4">
          <p className="mb-5 font-bold text-paper">گروه‌های محصول</p>
          <ul className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/categories/${c.slug}/`} prefetch={false} className="transition-colors hover:text-masking">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="دسترسی سریع" className="lg:col-span-2">
          <p className="mb-5 font-bold text-paper">دسترسی سریع</p>
          <ul className="space-y-3 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-masking">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <p className="mb-5 font-bold text-paper">تماس و آدرس</p>
          <address className="space-y-4 text-sm not-italic">
            <p className="flex gap-3">
              <MapPinIcon className="mt-1 size-4 shrink-0 text-tape" />
              <a href={mapLinks.google} target="_blank" rel="noopener noreferrer" className="hover:text-masking">
                {siteConfig.address.street}
              </a>
            </p>
            <div className="flex gap-3">
              <PhoneIcon className="mt-1 size-4 shrink-0 text-tape" />
              <ul className="space-y-1">
                {siteConfig.phones.map((p) => (
                  <li key={p.tel}>
                    <a href={`tel:${p.tel}`} data-track="call" data-track-label="footer" className="hover:text-masking" dir="ltr">
                      {p.display}
                    </a>
                  </li>
                ))}
                <li>
                  <a href={`tel:${siteConfig.mobile.tel}`} data-track="call" data-track-label="footer-mobile" className="hover:text-masking" dir="ltr">
                    {siteConfig.mobile.display}
                  </a>
                </li>
              </ul>
            </div>
            <p className="flex gap-3">
              <MailIcon className="mt-1 size-4 shrink-0 text-tape" />
              <a href={`mailto:${siteConfig.email}`} className="hover:text-masking" dir="ltr">
                {siteConfig.email}
              </a>
            </p>
          </address>
        </div>
      </div>

      {/* Oversized outlined wordmark, purely decorative */}
      <p
        aria-hidden="true"
        dir="ltr"
        className="pointer-events-none select-none text-center text-[28vw] leading-[0.8] font-black text-transparent lg:text-[22vw]"
        style={{ WebkitTextStroke: "1px rgb(245 242 235 / 0.12)" }}
      >
        {siteConfig.brands[0]}
      </p>

      <div className="border-t border-paper/10">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-6 text-xs sm:flex-row lg:pe-24">
          <p>
            © {currentFaYear()} {siteConfig.legalName}. تمامی حقوق این وب‌سایت محفوظ است.
          </p>
          {developer.enabled && <DeveloperCredit />}
        </div>
      </div>
    </footer>
  );
}

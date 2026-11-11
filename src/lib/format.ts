import { primaryPhone, siteConfig } from "@/config/site";

const faDigits = "۰۱۲۳۴۵۶۷۸۹";

export const toFaDigits = (value: string | number) =>
  String(value).replace(/\d/g, (d) => faDigits[Number(d)]);

export const faNumber = (value: number) => new Intl.NumberFormat("fa-IR").format(value);

export const telHref = `tel:${primaryPhone.tel}`;

export function whatsappHref(message?: string) {
  const base = `https://wa.me/${siteConfig.whatsapp.number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const productInquiryMessage = (name: string) => `سلام، برای «${name}» استعلام قیمت و موجودی می‌خواستم.`;

/** Current Solar Hijri year in Persian digits, computed at build time. */
export const currentFaYear = () =>
  new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric" }).format(new Date());

export function absoluteUrl(path = "/") {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * The client hasn't given a map pin yet, so navigation links search by address instead of
 * pointing at invented coordinates. Replace with exact pins once the client sends them.
 */
export const mapLinks = {
  google: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${siteConfig.address.short}، پلاک ۴۲`)}`,
};

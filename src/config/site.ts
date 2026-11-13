/**
 * Every business detail the site shows lives here.
 *
 * Brand name, tagline and logo: the client's CTI logo files.
 * Phones, address and social handles: the back cover and footers of the printed NANO catalog.
 * CONFIRM: that NANO catalog belongs to the "بازرگانی چسب و شبرنگ استاندارد" company, so check with the
 * client that these contact details are CTI's own before launch.
 * Items marked CONFIRM should be double-checked with the client.
 */

const phone = (national: string) => ({
  /** shown on the page, Persian digits */
  display: `۰۲۱-${national.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)])}`,
  /** tel: link, international format */
  tel: `+9821${national}`,
});

export const siteConfig = {
  /** Brand name as written in the client's logo: header, footer, installed-app name */
  name: "چسب طیف ایران",
  /** Full name used in titles and structured data */
  legalName: "چسب طیف ایران (CTI)",
  /** Latin name shown under the Persian name in the logo lockup */
  nameEn: "Chasb Teyf Iran",
  /** The letters of the logo (also the outlined wordmark in the footer) */
  mark: "CTI",
  /** The client's own tagline, printed on their logo card */
  tagline: "تهیه و عرضه برترین برندهای چسب دوطرفه",
  description:
    "چسب طیف ایران (CTI): تهیه و عرضه برترین برندهای چسب دوطرفه و نوار چسب صنعتی؛ سلولزی، شیشه‌ای، فوم، ژله‌ای، آلومینیومی، برزنتی، کنفی و بسته‌بندی از برندهای tesa، NANO، 3M و Lohmann. استعلام قیمت روز تلفنی.",
  /** Canonical domain. Override with NEXT_PUBLIC_SITE_URL for staging builds. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://chasbteyfiran.com").replace(/\/$/, ""),
  /** Set NEXT_PUBLIC_NOINDEX=true on staging/preview deployments so they never get indexed. */
  noindex: process.env.NEXT_PUBLIC_NOINDEX === "true",
  /** Token from Google Search Console ("HTML tag" verification method). Optional. */
  googleVerification: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  locale: "fa_IR",

  /** Landlines printed in the catalog. The first one is used for the main "call" buttons. */
  phones: [phone("33532291"), phone("36619560"), phone("36058567")],
  /** Mobile printed on the back cover next to "دبیرخانه بازرگانی چسب و شبرنگ استاندارد". */
  mobile: { display: "۰۹۱۲-۹۵۱۷۳۶۷", tel: "+989129517367" },
  /** CONFIRM: the catalog prints this mobile number but doesn't say it has WhatsApp. */
  whatsapp: { display: "۰۹۱۲-۹۵۱۷۳۶۷", number: "989129517367" },
  email: "info@chasbteyfiran.com",
  address: {
    street: "تهران، میدان امام خمینی، خیابان فردوسی، نبش کوچه باربد، مجتمع سیما، طبقه اول، پلاک ۴۲",
    short: "تهران، میدان امام خمینی، خیابان فردوسی، مجتمع سیما",
    locality: "تهران",
    region: "استان تهران",
    country: "IR",
  },
  /** CONFIRM: handles read from the catalog footer (camera icon = Instagram, paper-plane icon = Telegram). */
  social: {
    instagram: "https://instagram.com/nano_enk",
    telegram: "https://t.me/standard_enk",
  },
  /** Brands that appear in the client's catalogs and shop photos. Shown as text, no logos. */
  brands: ["tesa", "NANO", "QUICK TAPE", "3M", "Lohmann", "NITTO", "KNAUF", "Qbono", "TOP TAPE"],
} as const;

/** Main number for call buttons and structured data */
export const primaryPhone = siteConfig.phones[0];

/**
 * The person who built the site (footer credit). Hidden until `enabled` is true and the
 * fields are filled in.
 */
export const developer = {
  enabled: false,
  name: "",
  nameEn: "",
  role: "طراح و توسعه‌دهنده وب",
  pitch: "",
  links: [] as { label: string; href: string; kind: "linkedin" | "email" | "telegram" }[],
};

export const navLinks = [
  { href: "/", label: "خانه" },
  { href: "/products/", label: "محصولات" },
  { href: "/about/", label: "درباره ما" },
  { href: "/contact/", label: "تماس با ما" },
] as const;

/**
 * Every business detail the site shows lives here.
 *
 * Source of every value: the client's printed NANO catalog (back cover + footer of each page).
 * Items marked CONFIRM were read from the catalog but should be double-checked with the client
 * before launch (see README "Before launch").
 */

const phone = (national: string) => ({
  /** shown on the page, Persian digits */
  display: `۰۲۱-${national.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)])}`,
  /** tel: link, international format */
  tel: `+9821${national}`,
});

export const siteConfig = {
  /** Short name: header, footer, installed-app name */
  name: "چسب و شبرنگ استاندارد",
  /** Company name exactly as printed in the catalog */
  legalName: "بازرگانی چسب و شبرنگ استاندارد",
  /** Brand line printed under the NANO logo in the catalog */
  nameEn: "NANO Industrial Adhesive Tape",
  tagline: "تولید و واردات انواع چسب یکطرفه و دوطرفه صنعتی",
  description:
    "بازرگانی چسب و شبرنگ استاندارد؛ تولید و واردات چسب دوطرفه سلولزی، شیشه‌ای، فوم و ژله‌ای و نوار چسب‌های یکطرفه (آلومینیومی، برزنتی، کنفی، بسته‌بندی، PVC) با برندهای NANO و QUICK TAPE. تهران، میدان امام خمینی. استعلام قیمت روز تلفنی.",
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
  /** Brands that appear in the client's catalog. Shown as text, no logos. */
  brands: ["NANO", "QUICK TAPE", "tesa", "Lohmann", "3M", "NITTO", "KNAUF", "Qbono"],
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

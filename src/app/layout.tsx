import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { developer, siteConfig } from "@/config/site";
import { DirectionProvider } from "@/components/ui/direction";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { MobileContactBar } from "@/components/site/mobile-contact-bar";
import { JsonLd } from "@/components/site/json-ld";
import { ClickTracker } from "@/components/site/click-tracker";
import { MotionRoot } from "@/components/motion/motion-root";
import { RouteTransition } from "@/components/site/route-transition";
import { businessLd, websiteLd } from "@/lib/jsonld";
import { defaultOgImage } from "@/lib/seo";

// Self-hosted (no request to Google at build or run time — matters for Iranian hosting/dev machines)
//
// display: "optional" + preload: the font is used only if it arrives within ~100 ms of the first paint (it does on a
// good connection and always from the cache). On a slow connection the page keeps the system font for that visit
// instead of re-flowing when Vazirmatn arrives, so the font causes no layout shift (CLS 0.19 -> 0 on the contact page
// with a simulated slow phone). The font is still downloaded and cached (1 year, see public/.htaccess), so every later
// visit uses it. Switch back to "swap" if the exact typeface on a first visit matters more than layout stability.
const vazirmatn = localFont({
  src: "./fonts/Vazirmatn-Variable.woff2",
  variable: "--font-vazirmatn",
  weight: "100 900",
  display: "optional",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.legalName} | چسب دوطرفه و نوار چسب صنعتی`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.legalName,
  creator: developer.enabled ? developer.nameEn : undefined,
  publisher: siteConfig.legalName,
  category: "industrial supplies",
  verification: siteConfig.googleVerification ? { google: siteConfig.googleVerification } : undefined,
  formatDetection: { telephone: true, address: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.legalName,
    images: [defaultOgImage],
  },
  twitter: { card: "summary_large_image" },
  robots: siteConfig.noindex
    ? { index: false, follow: false }
    : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

export const viewport: Viewport = {
  themeColor: "#f5f2eb",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa-IR" dir="rtl" className={vazirmatn.variable}>
      <body className="flex min-h-svh flex-col">
        <DirectionProvider dir="rtl">
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <MobileContactBar />
        </DirectionProvider>
        <JsonLd data={[businessLd(), websiteLd()]} />
        <RouteTransition />
        <MotionRoot />
        <ClickTracker />
      </body>
    </html>
  );
}

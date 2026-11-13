import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

type PageSeo = {
  title: string;
  description: string;
  /** Path with trailing slash, e.g. "/products/foo/" */
  path: string;
  image?: { url: string; width: number; height: number; alt: string };
  noindex?: boolean;
  /** Use the title as-is, without the "| brand" suffix */
  absoluteTitle?: boolean;
};

/**
 * Google shows roughly 60-65 characters of a Persian title and cuts the rest. The brand is useful but the
 * keyword matters more, so "| brand" is added only when the whole title still fits.
 */
const MAX_TITLE = 65;
const brandSuffix = ` | ${siteConfig.name}`;
const withBrand = (title: string) => (title.length + brandSuffix.length <= MAX_TITLE ? `${title}${brandSuffix}` : title);

export const defaultOgImage = {
  url: "/og/default.jpg",
  width: 1200,
  height: 630,
  alt: `${siteConfig.legalName} | ${siteConfig.tagline}`,
};

export function pageMetadata({ title, description, path, image, noindex, absoluteTitle }: PageSeo): Metadata {
  const og = image ?? defaultOgImage;
  const hide = noindex || siteConfig.noindex;
  return {
    title: { absolute: absoluteTitle ? title : withBrand(title) },
    description,
    // no <meta name="keywords">: Google ignores it and it only tells competitors what we target
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      siteName: siteConfig.legalName,
      url: path,
      title,
      description,
      images: [og],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [og.url],
    },
    // leave the key out entirely when indexable, so the root layout's robots settings are inherited
    ...(hide ? { robots: { index: false, follow: !siteConfig.noindex } } : {}),
  };
}

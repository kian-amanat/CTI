import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

type PageSeo = {
  title: string;
  description: string;
  /** Path with trailing slash, e.g. "/products/foo/" */
  path: string;
  image?: { url: string; width: number; height: number; alt: string };
  keywords?: readonly string[];
  noindex?: boolean;
  /** Use the title as-is, without the "| brand" suffix */
  absoluteTitle?: boolean;
};

export const defaultOgImage = {
  url: "/og/default.jpg",
  width: 1200,
  height: 630,
  alt: `${siteConfig.legalName} | ${siteConfig.tagline}`,
};

export function pageMetadata({ title, description, path, image, keywords, noindex, absoluteTitle }: PageSeo): Metadata {
  const og = image ?? defaultOgImage;
  const hide = noindex || siteConfig.noindex;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: keywords ? [...keywords] : undefined,
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

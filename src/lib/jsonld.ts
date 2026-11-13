import { siteConfig } from "@/config/site";
import type { Category, Faq } from "@/data/categories";
import type { Product } from "@/data/products";
import { absoluteUrl } from "@/lib/format";
import { productImage } from "@/lib/images";

const businessId = `${siteConfig.url}/#business`;
const websiteId = `${siteConfig.url}/#website`;

export function businessLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WholesaleStore",
    "@id": businessId,
    name: siteConfig.legalName,
    alternateName: [siteConfig.name, siteConfig.nameEn],
    description: siteConfig.description,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/icon-512.png"),
    image: absoluteUrl("/og/default.jpg"),
    telephone: [...siteConfig.phones.map((p) => p.tel), siteConfig.mobile.tel],
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.address.country,
    },
    areaServed: { "@type": "Country", name: "Iran" },
    contactPoint: [
      ...siteConfig.phones.map((p) => ({ "@type": "ContactPoint", telephone: p.tel, contactType: "sales", availableLanguage: ["fa"] })),
      { "@type": "ContactPoint", telephone: siteConfig.mobile.tel, contactType: "sales", availableLanguage: ["fa"] },
    ],
    sameAs: Object.values(siteConfig.social),
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    url: absoluteUrl("/"),
    name: siteConfig.legalName,
    alternateName: siteConfig.name,
    inLanguage: "fa-IR",
    publisher: { "@id": businessId },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqLd(faq: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export const productPath = (p: Product) => `/products/${p.slug}/`;
export const categoryPath = (c: Category | string) => `/categories/${typeof c === "string" ? c : c.slug}/`;

/**
 * A product page is marked up as an `ItemPage` that is `about` the item, not as a `Product`.
 *
 * Google's product snippet needs `offers`, `review` or `aggregateRating`, and this catalogue has none of them on
 * purpose: prices are given by phone and there are no real reviews, and inventing either breaks Google's
 * structured-data policy. A `Product` without them cannot get any rich result and is reported as an error in
 * Search Console's "Product snippets" report. If real prices or reviews ever exist, turn `about` back into a
 * `Product` (with `offers`, `brand`, `mpn` and `additionalProperty` from `p.highlights`).
 */
export function productPageLd(p: Product) {
  const img = productImage(p);
  const url = absoluteUrl(productPath(p));
  const image = img ? { url: absoluteUrl(img.url(img.width)), width: img.width, height: img.height } : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    "@id": `${url}#webpage`,
    url,
    name: p.name,
    description: p.summary,
    inLanguage: "fa-IR",
    isPartOf: { "@id": websiteId },
    ...(image ? { primaryImageOfPage: { "@type": "ImageObject", ...image } } : {}),
    about: {
      "@type": "Thing",
      "@id": `${url}#item`,
      name: p.name,
      description: p.summary,
      url,
      ...(image ? { image: image.url } : {}),
      ...(p.model ? { identifier: p.model } : {}),
    },
    ...(p.brand ? { mentions: { "@type": "Brand", name: p.brand } } : {}),
  };
}

export function itemListLd(name: string, items: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(productPath(p)),
      name: p.name,
    })),
  };
}

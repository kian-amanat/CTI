import { siteConfig } from "@/config/site";
import type { Category, Faq } from "@/data/categories";
import { getCategory } from "@/data/categories";
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
 * No price/offer on purpose: prices are given by phone. Google still reads the product entity,
 * we just don't fake an Offer (which would be a structured-data policy violation).
 */
export function productLd(p: Product) {
  const img = productImage(p);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${absoluteUrl(productPath(p))}#product`,
    name: p.name,
    ...(p.model ? { mpn: p.model, model: p.model } : {}),
    description: p.summary,
    category: getCategory(p.category)?.name,
    url: absoluteUrl(productPath(p)),
    image: img ? img.sizes.map((w) => absoluteUrl(img.url(w))) : undefined,
    brand: { "@type": "Brand", name: p.brand },
    additionalProperty: p.highlights.map((s) => ({ "@type": "PropertyValue", name: s.label, value: s.value })),
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

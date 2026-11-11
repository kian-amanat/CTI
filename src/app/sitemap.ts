import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { categoryPath, productPath } from "@/lib/jsonld";
import { categoryCover, getImage, productImage } from "@/lib/images";
import { absoluteUrl } from "@/lib/format";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/products/"), lastModified, changeFrequency: "weekly", priority: 0.9 },
    ...categories.map((c) => {
      const cover = categoryCover(c);
      const img = cover ? getImage(cover.key) : undefined;
      return {
        url: absoluteUrl(categoryPath(c)),
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.8,
        images: img ? [absoluteUrl(img.url(img.width))] : undefined,
      };
    }),
    ...products.map((p) => {
      const img = productImage(p);
      return {
        url: absoluteUrl(productPath(p)),
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        images: img ? [absoluteUrl(img.url(img.width))] : undefined,
      };
    }),
    { url: absoluteUrl("/about/"), lastModified, changeFrequency: "yearly", priority: 0.5 },
    { url: absoluteUrl("/contact/"), lastModified, changeFrequency: "yearly", priority: 0.6 },
  ];
}

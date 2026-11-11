import manifest from "@/data/image-manifest.json";
import type { Category } from "@/data/categories";
import { productsByCategory, type Product } from "@/data/products";

type ManifestEntry = {
  width: number;
  height: number;
  sizes: number[];
  color: string;
};

export type ResolvedImage = ManifestEntry & {
  key: string;
  src: string;
  srcSet: string;
  url: (w: number) => string;
};

const entries = manifest as Record<string, ManifestEntry>;

export function getImage(key: string): ResolvedImage | undefined {
  const entry = entries[key];
  if (!entry) return undefined;
  const url = (w: number) => `/images/${key}-${w}.webp`;
  return {
    ...entry,
    key,
    url,
    src: url(entry.sizes[Math.min(1, entry.sizes.length - 1)]),
    srcSet: entry.sizes.map((w) => `${url(w)} ${w}w`).join(", "),
  };
}

export const productImage = (p: Product) => getImage(p.image);

/** Cover photo of a category: its own photo, else the first product's photo, else nothing. */
export function categoryCover(c: Category) {
  const key = c.image ?? productsByCategory(c.slug)[0]?.image;
  return key ? { key, alt: c.imageAlt ?? productsByCategory(c.slug)[0]?.imageAlt ?? c.name } : undefined;
}

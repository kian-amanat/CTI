import manifest from "@/data/image-manifest.json";
import type { Category } from "@/data/categories";
import { productsByCategory, type Product } from "@/data/products";

type ManifestEntry = {
  width: number;
  height: number;
  sizes: number[];
  color: string;
  /** Content hash in the file names (see scripts/optimize-images.mjs) */
  hash: string;
};

export type ResolvedImage = ManifestEntry & {
  key: string;
  /** Widest file that exists, i.e. the real pixel size of the photo */
  maxWidth: number;
  src: string;
  srcSet: string;
  url: (w: number) => string;
};

const entries = manifest as Record<string, ManifestEntry>;

export function getImage(key: string): ResolvedImage | undefined {
  const entry = entries[key];
  if (!entry) return undefined;
  const url = (w: number) => `/images/${key}-${w}.${entry.hash}.webp`;
  return {
    ...entry,
    key,
    url,
    maxWidth: entry.sizes[entry.sizes.length - 1],
    // fallback for browsers that ignore srcset: the first size from 480px up (or the largest one)
    src: url(entry.sizes.find((w) => w >= 480) ?? entry.sizes[entry.sizes.length - 1]),
    srcSet: entry.sizes.map((w) => `${url(w)} ${w}w`).join(", "),
  };
}

export const productImage = (p: Product) => getImage(p.image);

/** Cover photo of a category: its own photo, else the first product's photo, else nothing. */
export function categoryCover(c: Category) {
  const key = c.image ?? productsByCategory(c.slug)[0]?.image;
  return key ? { key, alt: c.imageAlt ?? productsByCategory(c.slug)[0]?.imageAlt ?? c.name } : undefined;
}

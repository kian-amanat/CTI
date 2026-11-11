import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Plain HTML/CSS/JS output: fully crawlable and hostable on any (Iranian) static host or CDN.
  output: "export",
  // /products/x -> /products/x/index.html, which every static server resolves without rewrites.
  trailingSlash: true,
  // Images are pre-optimized to WebP at several widths by scripts/optimize-images.mjs.
  images: { unoptimized: true },
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

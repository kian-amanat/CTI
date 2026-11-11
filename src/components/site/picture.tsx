import { getImage } from "@/lib/images";
import { cn } from "@/lib/utils";

type Props = {
  /** Manifest key, e.g. "products/knauf-joint-tape" or "gallery/tesa-blue-tape" */
  image: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/**
 * Responsive WebP with explicit width/height (zero layout shift) and a dominant-color
 * placeholder. The static export has no image server, so srcset comes from pre-built files.
 */
export function Picture({ image, alt, sizes, priority, className }: Props) {
  const img = getImage(image);
  if (!img) return <div className={cn("bg-paper-deep", className)} role="img" aria-label={alt} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={img.src}
      srcSet={img.srcSet}
      sizes={sizes}
      width={img.width}
      height={img.height}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding={priority ? "sync" : "async"}
      style={{ backgroundColor: img.color }}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}

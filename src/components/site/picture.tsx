import { getImage } from "@/lib/images";
import { cn } from "@/lib/utils";

type Props = {
  /** Manifest key, e.g. "products/knauf-joint-tape" or "gallery/tesa-blue-tape" */
  image: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  /**
   * Only meaningful together with `priority`. `false` keeps React from adding a <link rel="preload"> for the image.
   * The browser finds the <img> in the HTML anyway, and Next prefetches other pages' data (header links), which
   * would otherwise preload this page's hero photo on every page of the site.
   */
  preload?: boolean;
  className?: string;
  /**
   * For big frames only. Some of the client's photos are small (crops of a printed catalog), and stretching them
   * over a large frame makes them look soft. With `plate`, such a photo is shown at (about) its own pixel size,
   * centred on a blurred copy of itself, instead of being enlarged. Sharp photos, and frames smaller than the
   * photo, are unaffected: they render as a normal cover image.
   */
  plate?: boolean;
};

/** Photos narrower than this are "low resolution" for `plate`; the site's largest files are 800px. */
const PLATE_BELOW = 760;
/** How far past its own pixel size a plate photo may be shown (1 = never enlarged). */
const PLATE_SCALE = 1.1;

/**
 * Responsive WebP with explicit width/height (zero layout shift) and a dominant-color
 * placeholder. The static export has no image server, so srcset comes from pre-built files.
 */
export function Picture({ image, alt, sizes, priority, preload = true, className, plate }: Props) {
  const img = getImage(image);
  if (!img) return <div className={cn("bg-paper-deep", className)} role="img" aria-label={alt} />;

  const common = {
    src: img.src,
    srcSet: img.srcSet,
    sizes,
    width: img.width,
    height: img.height,
    loading: priority ? ("eager" as const) : ("lazy" as const),
    fetchPriority: priority ? ("high" as const) : ("auto" as const),
    decoding: priority ? ("sync" as const) : ("async" as const),
  };
  // React preloads every non-lazy <img> except one inside <picture>, so a bare <picture> opts a priority image out.
  const wrap = (node: React.ReactNode) => (priority && !preload ? <picture className="contents">{node}</picture> : node);

  if (plate && img.maxWidth < PLATE_BELOW) {
    const cap = Math.round(img.maxWidth * PLATE_SCALE);
    return (
      <div className={cn("relative h-full w-full overflow-hidden", className)} style={{ backgroundColor: img.color }}>
        {/* the same photo, blurred and enlarged, fills whatever the sharp photo does not cover */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img.url(img.sizes[0])} width={img.width} height={img.height} alt="" aria-hidden="true" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full scale-125 object-cover blur-2xl" />
        {wrap(
          // eslint-disable-next-line @next/next/no-img-element
          <img {...common} alt={alt} className="absolute inset-0 m-auto aspect-square w-auto max-w-full object-cover" style={{ height: `min(100%, ${cap}px)` }} />,
        )}
      </div>
    );
  }

  return wrap(
    // eslint-disable-next-line @next/next/no-img-element
    <img {...common} alt={alt} style={{ backgroundColor: img.color }} className={cn("h-full w-full object-cover", className)} />,
  );
}

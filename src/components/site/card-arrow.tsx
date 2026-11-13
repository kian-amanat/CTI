import { cn } from "@/lib/utils";

/**
 * Round arrow chip for cards. It never moves, rotates or turns red: when the parent `.group` is hovered
 * it only swaps between two neutral looks (filled <-> outlined) over 300 ms.
 * The arrow (up-left, the "open" direction in a right-to-left layout) is drawn by `.card-arrow::after`
 * in globals.css, so the chip is a single DOM node instead of an SVG with children.
 */
const tones = {
  /** on light cards: a soft chip that fills with ink */
  light: "bg-paper-deep text-ink group-hover:bg-ink group-hover:text-paper",
  /** on light surfaces that already use the chip colour: an ink chip that softens slightly */
  solid: "bg-ink text-paper group-hover:bg-ink/80",
  /** on dark photo cards: a solid paper chip that turns into an outlined one */
  dark: "bg-paper text-ink ring-1 ring-transparent group-hover:bg-paper/10 group-hover:text-paper group-hover:ring-paper/60",
} as const;

export function CardArrow({ tone = "dark", className }: { tone?: keyof typeof tones; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "card-arrow grid shrink-0 place-items-center rounded-full transition-[background-color,color,box-shadow] duration-300 ease-out",
        tones[tone],
        className,
      )}
    />
  );
}

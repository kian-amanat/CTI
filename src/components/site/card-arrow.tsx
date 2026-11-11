import { ArrowDownLeftIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Round arrow button for cards. On hover of the parent `.group` it turns exactly 90° clockwise,
 * from ↙ to ↖ — the "open" direction in a right-to-left layout.
 */
export function CardArrow({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("grid shrink-0 place-items-center rounded-full transition-colors duration-500", className)}
    >
      <ArrowDownLeftIcon className="size-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-90" />
    </span>
  );
}

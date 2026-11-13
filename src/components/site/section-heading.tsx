import { cn } from "@/lib/utils";

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  className,
  tone = "dark",
  align = "start",
  as: Tag = "h2",
}: {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  tone?: "dark" | "light";
  align?: "start" | "center";
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className={cn("mb-4 inline-flex items-center gap-2 text-sm font-bold sm:mb-5", tone === "light" ? "text-masking" : "text-tape-deep")}>
          <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
          {eyebrow}
        </p>
      )}
      <Tag id={id} data-split className="text-[1.75rem] font-black sm:text-4xl lg:text-[2.75rem] lg:leading-[1.3]">
        {title}
      </Tag>
      {description && (
        <p data-reveal="fade" className={cn("mt-5 leading-8 sm:mt-6", tone === "light" ? "text-paper/70" : "text-muted-foreground")}>
          {description}
        </p>
      )}
    </div>
  );
}

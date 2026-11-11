import { ChevronDownIcon } from "lucide-react";
import type { Faq } from "@/data/categories";
import { JsonLd } from "@/components/site/json-ld";
import { faqLd } from "@/lib/jsonld";
import { bidi } from "@/lib/bidi";

/**
 * Native <details>: zero JavaScript, keyboard accessible, and every answer is in the HTML
 * for crawlers. `name` makes the group behave like a single-open accordion.
 */
export function FaqList({ items, withSchema = true, name = "faq" }: { items: Faq[]; withSchema?: boolean; name?: string }) {
  return (
    <>
      <div className="divide-y divide-ink/10 rounded-[1.6rem] border border-ink/10 bg-card px-5 sm:px-7">
        {items.map((f, i) => (
          <details key={f.q} name={name} open={i === 0} className="faq-item group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-base font-bold outline-offset-4 [&::-webkit-details-marker]:hidden">
              {bidi(f.q)}
              <ChevronDownIcon className="size-5 shrink-0 text-tape transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <p className="pb-5 text-[0.95rem] leading-8 text-muted-foreground">{bidi(f.a)}</p>
          </details>
        ))}
      </div>
      {withSchema && <JsonLd data={faqLd(items)} />}
    </>
  );
}

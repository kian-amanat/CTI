import Link from "next/link";
import { applications } from "@/data/home";
import { SectionHeading } from "@/components/site/section-heading";
import { categoryPath } from "@/lib/jsonld";
import { toFaDigits } from "@/lib/format";

/** Big typographic list. Hover only softens the row background: nothing follows the cursor, moves or gets underlined. */
export function Applications() {
  return (
    <section aria-labelledby="apps-title" className="container-x py-16 sm:py-24 lg:py-36">
      <SectionHeading
        id="apps-title"
        eyebrow="کاربردها"
        title="برای هر صنعت، چسب درست"
        description="از بسته‌بندی و خودرو تا کناف‌کاری و تأسیسات؛ گروه مناسب کار خود را انتخاب کنید و مدل‌ها و ابعاد آن را ببینید."
      />
      <ol className="mt-8 border-t border-ink/15 sm:mt-14 lg:mt-20">
        {applications.map((a, i) => (
          <li key={a.title} data-reveal="up" className="border-b border-ink/15">
            <Link
              href={categoryPath(a.category)}
              prefetch={false}
              className="group -mx-3 grid grid-cols-[auto_1fr] items-baseline gap-x-4 rounded-2xl px-3 py-5 transition-colors duration-300 ease-out hover:bg-card focus-visible:bg-card sm:-mx-5 sm:grid-cols-[4rem_1fr_1fr] sm:gap-x-5 sm:px-5 sm:py-7 lg:py-9"
            >
              <span className="text-sm font-bold text-tape-deep">{toFaDigits(String(i + 1).padStart(2, "0"))}</span>
              <h3 className="text-2xl font-black sm:text-4xl lg:text-5xl">
                {a.title}
              </h3>
              <p className="col-start-2 mt-3 text-sm leading-7 text-muted-foreground sm:col-start-3 sm:mt-0 sm:text-base">{a.text}</p>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

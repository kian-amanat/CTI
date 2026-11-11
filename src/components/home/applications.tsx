import Link from "next/link";
import { applications } from "@/data/home";
import { SectionHeading } from "@/components/site/section-heading";
import { categoryPath } from "@/lib/jsonld";
import { getImage } from "@/lib/images";
import { toFaDigits } from "@/lib/format";

/** Big typographic list; on desktop a photo follows the cursor over each row. */
export function Applications() {
  const first = getImage(applications[0].image);
  return (
    <section aria-labelledby="apps-title" className="container-x py-20 lg:py-28">
      <SectionHeading
        id="apps-title"
        eyebrow="کاربردها"
        title="برای هر صنعت، چسب درست"
        description="از بسته‌بندی و خودرو تا کناف‌کاری و تأسیسات؛ گروه مناسب کار خود را انتخاب کنید و مدل‌ها و ابعاد آن را ببینید."
      />
      <div data-hover-reveal className="relative mt-12">
        <ol className="border-t border-ink/15">
          {applications.map((a, i) => (
            <li
              key={a.title}
              data-hover-item
              data-image={getImage(a.image)?.src}
              data-rotate={i % 2 ? 4 : -4}
              data-reveal="up"
              className="group border-b border-ink/15"
            >
              <Link
                href={categoryPath(a.category)}
                prefetch={false}
                className="grid grid-cols-[auto_1fr] items-baseline gap-x-5 py-6 sm:grid-cols-[4rem_1fr_1fr] lg:py-8"
              >
                <span className="text-sm font-bold text-tape-deep">{toFaDigits(String(i + 1).padStart(2, "0"))}</span>
                <h3 className="text-2xl font-black transition-transform duration-500 group-hover:-translate-x-3 sm:text-4xl lg:text-5xl">
                  {a.title}
                </h3>
                <p className="col-start-2 mt-2 text-sm leading-7 text-muted-foreground sm:col-start-3 sm:mt-0 sm:text-base">{a.text}</p>
              </Link>
            </li>
          ))}
        </ol>
        <div
          data-hover-media
          aria-hidden="true"
          className="pointer-events-none invisible absolute top-0 left-0 z-10 hidden h-56 w-72 overflow-hidden rounded-2xl shadow-2xl lg:block"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={first?.src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
}

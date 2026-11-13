import Link from "next/link";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { JsonLd } from "@/components/site/json-ld";
import { breadcrumbLd } from "@/lib/jsonld";
import { bidi } from "@/lib/bidi";

export type Crumb = { name: string; path: string };

/** Visible breadcrumb trail + matching BreadcrumbList structured data. */
export function PageBreadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: "خانه", path: "/" }, ...items];
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList className="text-sm">
          {all.map((item, i) => (
            <Fragment key={item.path}>
              <BreadcrumbItem>
                {i === all.length - 1 ? (
                  <BreadcrumbPage className="font-medium">{bidi(item.name)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    {/* py-2 -my-2: a 36px tall tap area that takes no extra room in the page */}
                    <Link href={item.path} className="inline-block py-2 -my-2">
                      {bidi(item.name)}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {i < all.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <JsonLd data={breadcrumbLd(all)} />
    </>
  );
}

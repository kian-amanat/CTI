import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Next adds its own noindex for this page; stating it here keeps it the only robots tag instead of fighting the layout's "index, follow".
export const metadata: Metadata = { robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[80svh] flex-col items-center justify-center pt-24 pb-16 text-center">
      <p className="text-[8rem] leading-none font-black text-ink sm:text-[13rem]" aria-hidden="true">
        ۴<span className="text-tape">۰</span>۴
      </p>
      <h1 className="mt-8 text-3xl font-black sm:mt-10">این صفحه از جایش کنده شده!</h1>
      <p className="mt-5 max-w-md leading-8 text-muted-foreground">
        صفحه‌ای که دنبالش هستید پیدا نشد. شاید آدرس اشتباه است یا صفحه جابه‌جا شده. از کاتالوگ محصولات شروع کنید.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/products/" className={cn(buttonVariants(), "h-12 rounded-full px-6 text-base font-bold")}>
          مشاهده محصولات
        </Link>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "h-12 rounded-full px-6 text-base font-bold")}>
          صفحه اصلی
        </Link>
      </div>
    </div>
  );
}

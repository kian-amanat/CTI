import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[80svh] flex-col items-center justify-center pt-24 pb-16 text-center">
      <div className="relative">
        <p className="text-[9rem] leading-none font-black text-ink sm:text-[13rem]" aria-hidden="true">
          ۴۰۴
        </p>
        <span className="absolute top-1/2 left-1/2 h-12 w-[120%] -translate-x-1/2 -translate-y-1/2 -rotate-6 bg-masking/90 shadow-md" aria-hidden="true" />
      </div>
      <h1 className="mt-8 text-3xl font-black">این صفحه از جایش کنده شده!</h1>
      <p className="mt-4 max-w-md leading-8 text-muted-foreground">
        صفحه‌ای که دنبالش هستید پیدا نشد. شاید آدرس اشتباه است یا صفحه جابه‌جا شده. از کاتالوگ محصولات شروع کنید.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
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

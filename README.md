# بازرگانی چسب و شبرنگ استاندارد | chasbteyfiran.com

سایت کاتالوگ سئومحور برای فروشنده چسب دوطرفه و نوار چسب صنعتی (برندهای NANO و QUICK TAPE) در تهران. خرید از طریق تماس، واتساپ و پیام‌رسان‌ها انجام می‌شود (بدون سبد خرید و بدون قیمت؛ قیمت تلفنی اعلام می‌شود).

**تکنولوژی:** Next.js 16 (خروجی کاملاً استاتیک) · Tailwind 4 · shadcn/ui (RTL) · GSAP + ScrollTrigger · Lenis · three.js

## دستورات

```bash
npm install
npm run dev      # توسعه روی http://localhost:3000
npm run build    # خروجی استاتیک در پوشه out/
npm run images   # ساخت تصاویر بهینه از assets/client-photos + تصویر OG و آیکون‌ها
```

## کجا چه چیزی را عوض کنم؟

| چه چیزی | فایل |
|---|---|
| نام، تلفن‌ها، واتساپ، ایمیل، آدرس، شبکه‌های اجتماعی، برندها | `src/config/site.ts` |
| اعتبار طراح در فوتر (فعلاً خاموش) | `developer` در `src/config/site.ts` |
| محصولات (۲۲ محصول: ابعاد، جدول‌های فنی، توضیحات) | `src/data/products.ts` |
| گروه‌های محصول (۱۷ گروه): متن، سؤالات متداول، کلمات کلیدی | `src/data/categories.ts` |
| متن‌های صفحه اصلی، سؤالات متداول، آمار (از روی داده محاسبه می‌شود) | `src/data/home.ts` |
| برش و ساخت تصاویر | `scripts/image-crops.json` و بعد `npm run images` |

همه اطلاعات محصولات از دو کاتالوگ مشتری استخراج شده است: کاتالوگ چاپی NANO / QUICK TAPE (ابعاد، تعداد در کارتن، ویژگی‌ها) و کاتالوگ فنی Qbono (جدول مشخصات و نتایج آزمون). مقادیری که در عکس کاتالوگ زیر انعکاس نور خوانا نبودند عمداً درج نشده‌اند.

### تصاویر

تصاویر خام در `assets/client-photos/` هستند (عکس‌هایی که مشتری فرستاده است). هر تصویر سایت یک برش از این فایل‌هاست و مختصات برش در `scripts/image-crops.json` ثبت شده. وقتی مشتری عکس واقعی و باکیفیت محصولات را فرستاد، فایل را در همان پوشه بگذارید، `src` و `rect` کلید مربوطه را عوض کنید و `npm run images` را اجرا کنید؛ هیچ کامپوننتی نیاز به تغییر ندارد.

## انتشار روی هاست

۱. دامنه را تنظیم کنید (برای canonical، sitemap و Open Graph). پیش‌فرض `https://chasbteyfiran.com` است. فقط برای نسخه آزمایشی لازم است عوضش کنید:

```bash
NEXT_PUBLIC_SITE_URL=https://chasbteyfiran.com npm run build
```

۲. **قبل از جایگزینی، از وردپرس فعلی روی هاست بکاپ کامل بگیرید** (فایل‌ها و دیتابیس).
۳. همه محتوای پوشه `out/` (از جمله فایل مخفی `.htaccess`) را در ریشه وب (public_html) آپلود کنید. `.htaccess` ریدایرکت HTTPS، حذف www، صفحه ۴۰۴ سفارشی، فشرده‌سازی و کش را انجام می‌دهد و روی LiteSpeed و Apache کار می‌کند.
۴. برای Nginx: `error_page 404 /404.html;` و `try_files $uri $uri/ =404;`
۵. برای نسخه‌های آزمایشی `NEXT_PUBLIC_NOINDEX=true` بگذارید تا گوگل ایندکسشان نکند.
۶. در Google Search Console، دامنه را اضافه و `https://chasbteyfiran.com/sitemap.xml` را ثبت کنید. اگر روش «تگ HTML» را انتخاب کردید، مقدار content را در `NEXT_PUBLIC_GOOGLE_VERIFICATION` بگذارید و دوباره build کنید.

## سئو

- همه صفحات HTML کامل‌اند (بدون نیاز به اجرای JS برای دیدن محتوا)
- یک H1 در هر صفحه، canonical، Open Graph، Twitter Card، `lang="fa-IR"` و `dir="rtl"`
- هر کلمه کلیدی مشتری یک صفحه گروه جدا دارد (`/categories/<slug>/`) و هر محصول یک صفحه (`/products/<slug>/`)
- داده ساختاریافته: `WholesaleStore`، `WebSite`، `Product`، `BreadcrumbList`، `FAQPage`، `ItemList`، `CollectionPage` (بدون `Offer` ساختگی چون قیمت درج نمی‌شود)
- `sitemap.xml` (همراه با تصاویر)، `robots.txt`، `manifest.webmanifest`
- تصاویر WebP با `srcset` و ابعاد مشخص (بدون CLS)، فونت وزیرمتن روی سرور خود سایت
- متن فارسیِ مخلوط با اعداد و واحدهای لاتین (مثل `15 N/25mm`) با ایزوله‌های یونیکد (`src/lib/bidi.ts`) درست نمایش داده می‌شود؛ این کاراکترهای نامرئی فقط در متن صفحه‌اند، نه در title و JSON-LD.

## انیمیشن بدون آسیب به سئو

- عنوان صفحه اصلی فقط با CSS انیمیت می‌شود و منتظر جاوااسکریپت نمی‌ماند، پس LCP دیر نمی‌شود.
- GSAP و Lenis بعد از بیکار شدن مرورگر لود می‌شوند. انیمیشن‌ها با data attribute در HTML تعریف شده‌اند (`data-reveal`، `data-split`، `data-counter`، `data-hscroll`، `data-parallax`، `data-draw`، `data-magnetic`) و در `src/components/motion/motion-root.tsx` اجرا می‌شوند.
- فقط محتوای زیر خط دید انیمیت می‌شود، و فقط با transform و opacity.
- متن فارسی فقط کلمه‌به‌کلمه شکسته می‌شود؛ شکستن حرف‌به‌حرف اتصال حروف را خراب می‌کند.
- صحنه سه‌بعدی (three.js) فقط روی دسکتاپ و بعد از لود کامل صفحه اجرا می‌شود. موبایل یک SVG سبک می‌بیند.
- `prefers-reduced-motion` رعایت می‌شود.

## فونت

وزیرمتن تحت مجوز SIL Open Font License.

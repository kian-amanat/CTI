import { siteConfig } from "@/config/site";
import { categories, type Faq } from "./categories";
import { products } from "./products";

export const homeFaq: Faq[] = [
  {
    q: "چرا قیمت محصولات روی سایت نیست؟",
    a: "قیمت چسب و نوار چسب به نرخ مواد اولیه و بازار وابسته است و دائماً تغییر می‌کند. برای اینکه همیشه قیمت دقیق و به‌روز دریافت کنید، قیمت را تلفنی یا در پیام‌رسان‌ها اعلام می‌کنیم.",
  },
  {
    q: "آیا محصولات را در ابعاد دلخواه هم تهیه می‌کنید؟",
    a: "بسیاری از محصولات NANO و QUICK TAPE در کاتالوگ با عنوان «قابل ارائه در ابعاد درخواستی» آمده‌اند. عرض و طول مورد نیازتان را هنگام تماس بگویید تا امکان تأمین آن بررسی شود.",
  },
  {
    q: "خرید عمده و کارتنی چگونه است؟",
    a: "در کاتالوگ، تعداد رول در هر کارتن برای هر محصول مشخص شده است؛ مثلاً چسب کریستال ۴۸ میلی‌متری ۳۶ حلقه در هر کارتن. برای قیمت کارتنی و حداقل سفارش با کارشناسان تماس بگیرید.",
  },
  {
    q: "نمی‌دانم کدام چسب برای کار من مناسب است؛ چه کنم؟",
    a: "جنس دو سطحی که می‌خواهید به هم بچسبانید، محل مصرف و شرایط محیط (دما، رطوبت، فضای باز) را برای ما بفرستید تا کارشناسان نوع مناسب را پیشنهاد دهند.",
  },
  {
    q: "سفارش به شهرستان چطور ارسال می‌شود؟",
    a: "نحوه تحویل سفارش (مراجعه حضوری یا ارسال) هنگام ثبت سفارش و پس از هماهنگی تلفنی مشخص می‌شود.",
  },
];

export const applications = [
  {
    title: "بسته‌بندی و حمل",
    text: "چسب کریستال، برزنتی و کنفی برای بسته‌بندی‌های عمومی و سنگین",
    category: "packaging-tape",
    image: "products/nano-crystal-packaging-tape",
  },
  {
    title: "خودرو",
    text: "چسب دوطرفه فوم زه خودرو برای چسباندن زه و سطوح ناصاف",
    category: "double-sided-foam-tape",
    image: "products/gergonne-car-trim-foam-tape",
  },
  {
    title: "کیف، کفش و صنایع کاغذی",
    text: "چسب دوطرفه سلولزی برای درب پاکت، جعبه کاغذی، کیف و کفش",
    category: "cellulose-double-sided-tape",
    image: "products/nano-cellulose-double-sided-tape",
  },
  {
    title: "تأسیسات و لوازم خانگی",
    text: "چسب آلومینیومی برای لوله، تانکر و لوازم حرارتی و برودتی",
    category: "aluminum-foil-tape",
    image: "products/nano-aluminum-mesh-tape-170-micron",
  },
  {
    title: "کناف و ساختمان",
    text: "چسب کناف برای درز پنل، بتونه‌کاری و رنگ‌آمیزی",
    category: "joint-tape",
    image: "products/knauf-joint-tape",
  },
  {
    title: "برق و سیم‌کشی",
    text: "چسب برق PVC در ضخامت‌های ۱۰۰ تا ۱۸۰ میکرون",
    category: "pvc-electrical-tape",
    image: "products/qbono-pvc-electrical-tape",
  },
] as const;

export const reasons = [
  {
    title: "تولید و واردات",
    text: "تولید و واردات انواع چسب یکطرفه و دوطرفه صنعتی؛ از رول‌های باریک تا رول‌های عریض ۱۰۲ و ۱۲۴ سانتی‌متری.",
  },
  {
    title: "ابعاد درخواستی",
    text: "بیشتر محصولات NANO و QUICK TAPE در ابعاد درخواستی هم قابل ارائه‌اند؛ عرض و طول مورد نیازتان را بگویید.",
  },
  {
    title: "بسته‌بندی کارتنی",
    text: "تعداد رول در هر کارتن برای محصولات مشخص است؛ مناسب خرید عمده، فروشگاه‌ها و کارگاه‌ها.",
  },
  {
    title: "برندهای متنوع",
    text: "علاوه بر NANO و QUICK TAPE، چسب‌های مارکدار tesa، Lohmann، 3M، NITTO و KNAUF هم در کاتالوگ ما دیده می‌شود.",
  },
] as const;

export const orderSteps = [
  { title: "محصول را انتخاب کنید", text: "از کاتالوگ، گروه و مدل موردنظر را پیدا کنید یا نوع کارتان را برای ما بفرستید." },
  { title: "تماس بگیرید یا پیام بدهید", text: "قیمت روز، موجودی و ابعاد را تلفنی یا در پیام‌رسان‌ها بپرسید." },
  { title: "هماهنگی تحویل", text: "نحوه تحویل (مراجعه حضوری یا ارسال) را هنگام سفارش هماهنگ کنید." },
] as const;

/** Real numbers computed from the catalog data (never typed by hand). */
export const siteStats = [
  { value: categories.length, label: "گروه محصول" },
  { value: products.length, label: "محصول با مشخصات کامل" },
  { value: siteConfig.brands.length, label: "برند در کاتالوگ" },
  { value: siteConfig.phones.length + 1, label: "شماره تماس" },
] as const;
